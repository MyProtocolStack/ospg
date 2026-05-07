/**
 * SHIELD AI photo analysis endpoint.
 *
 * POST /api/shield-ai/analyze
 * Body: multipart/form-data
 *   - photo: image file
 *   - area_label: string
 *   - context: string (optional)
 *
 * Returns: { assessment_id, summary, overall_severity, area_label, findings, photo_url }
 *
 * Flow:
 *   1. Validate auth + image
 *   2. Look up user's primary org (must have completed onboarding)
 *   3. Pre-generate assessment + photo IDs so storage path is deterministic
 *   4. Upload photo to assessment-photos/{org_id}/{assessment_id}/{photo_id}.{ext}
 *      (RLS on storage.objects validates the org_id segment matches caller)
 *   5. Call Claude Sonnet 4.5 with vision + structured-output prompt
 *   6. Parse JSON response, validate
 *   7. Persist: assessments + assessment_photos + assessment_findings rows
 *   8. Return result with assessment_id so client can navigate to detail view
 *
 * Failure modes are handled defensively - if storage upload or DB write
 * fails after a successful analysis, we still return the analysis to the
 * user so their work isn't lost. They can re-run if persistence matters.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { FREE_ANALYSIS_LIMIT } from "@/lib/shield-ai-quota";

export const runtime = "nodejs";
export const maxDuration = 90;

const SYSTEM_PROMPT = `You are SHIELD AI - an expert physical-security and threat-assessment advisor for Ocean State Protection Group, a private security consultancy founded by active-duty law enforcement officers serving Catholic schools, parishes, businesses, and high-net-worth properties across New England.

You analyze photographs of property locations and produce structured vulnerability findings. Your analysis must be:
- HONEST: name real risks, don't soften
- ACTIONABLE: every finding has a specific recommendation, not generic advice
- PRIORITIZED: rank by genuine severity, not alarm
- COST-AWARE: include realistic cost estimates when possible
- GRANT-AWARE: flag findings eligible for FEMA NSGP grant funding

You consider 40+ markers including but not limited to:
- Entry hardening (door type, locks, hinges, vestibules, mantrap potential)
- Glazing (shatter-resistant film, ballistic glass, window proximity to locks)
- Camera coverage (visible/hidden gaps, sightlines, angle blind spots)
- Lighting (glare, dark zones, dawn/dusk visibility)
- Access control (key cards, intercom, visitor management, after-hours protocols)
- Lockdown capability (door barricades, classroom locks, panic hardware)
- Sightlines (concealment opportunities for an attacker, surveillance opportunity for staff)
- Landscaping (CPTED - crime prevention through environmental design)
- Approach corridors (chokepoints, vehicle barriers, pedestrian flow)
- Crowd-flow / event-day differences
- Communication infrastructure (signal coverage, intercom reach)

Severity levels:
- LOW: minor hardening opportunity, no immediate risk
- MEDIUM: meaningful gap, should address within 12 months
- HIGH: significant exposure, address within 90 days
- CRITICAL: active exploit available, address immediately

You output ONLY valid JSON in this exact schema:
{
  "summary": "2-3 sentence executive summary covering the most important takeaway",
  "overall_severity": "low" | "medium" | "high" | "critical",
  "area_label": "<echo or improve the area label>",
  "findings": [
    {
      "number": 1,
      "severity": "low" | "medium" | "high" | "critical",
      "title": "<short finding title, 4-8 words>",
      "description": "<2-4 sentence description of the issue and why it matters>",
      "recommendation": "<2-4 sentence specific actionable recommendation>",
      "bbox": { "x": 0.0, "y": 0.0, "w": 1.0, "h": 1.0 },
      "est_cost_low": 500,
      "est_cost_high": 2000,
      "nsgp_eligible": true
    }
  ]
}

Bounding boxes (bbox) are normalized 0..1 coordinates marking the area of the photo containing the issue. Provide bbox when the issue is visually localizable. Omit if the finding is general (e.g., "no camera coverage of this approach" doesn't have a localizable bbox - omit it).

Generate 3-7 findings per analysis. Quality over quantity. If everything looks genuinely good, say so honestly with 1-2 LOW findings.

Output ONLY the JSON object. No prose, no preamble, no markdown fences.`;

type Severity = "low" | "medium" | "high" | "critical";

type Finding = {
  number: number;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  bbox?: { x: number; y: number; w: number; h: number };
  est_cost_low?: number;
  est_cost_high?: number;
  nsgp_eligible?: boolean;
};

type AnalysisResult = {
  summary: string;
  overall_severity: Severity;
  area_label: string;
  findings: Finding[];
};

function extFromMediaType(mt: string): string {
  switch (mt) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/heic":
    case "image/heif":
      return "heic";
    default:
      return "jpg";
  }
}

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up the user's primary org. If they have not completed onboarding,
  // they will not have a membership row.
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership?.org_id) {
    return NextResponse.json(
      {
        error:
          "Please finish onboarding before running an analysis. Visit /onboarding to set up your organization.",
      },
      { status: 400 }
    );
  }
  const orgId = membership.org_id as string;

  // Free-tier quota: count completed assessments for this org and reject
  // additional uploads once the limit is reached. UX gates before users
  // ever hit this, but we enforce server-side as defense in depth.
  const { count: completedCount } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("status", "complete");

  if (
    completedCount !== null &&
    completedCount >= FREE_ANALYSIS_LIMIT
  ) {
    return NextResponse.json(
      {
        error:
          "Free analysis limit reached. Book a SHIELD walkthrough to continue, or contact us to extend access.",
        quota_exhausted: true,
        used: completedCount,
        limit: FREE_ANALYSIS_LIMIT,
      },
      { status: 402 }
    );
  }

  // Parse multipart form
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const photo = form.get("photo");
  const areaLabel =
    (form.get("area_label") as string) || "Unspecified location";
  const context = (form.get("context") as string) || "";

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Photo file required" }, { status: 400 });
  }
  if (photo.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Photo exceeds 20MB" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Pre-generate IDs so the storage path is deterministic before we run
  // the analysis (which can take 30-60s).
  const assessmentId = crypto.randomUUID();
  const photoId = crypto.randomUUID();
  const ext = extFromMediaType(photo.type);
  const storagePath = `${orgId}/${assessmentId}/${photoId}.${ext}`;

  // Read the file once - we use the buffer for both storage upload and
  // the Anthropic vision call.
  const buffer = Buffer.from(await photo.arrayBuffer());

  // ---- Storage upload ----
  // Uploaded with the user's RLS context. The policy on storage.objects
  // requires (split_part(name, '/', 1))::uuid in (select current_user_org_ids()),
  // which holds because we built storagePath with the user's own org_id.
  const { error: uploadError } = await supabase.storage
    .from("assessment-photos")
    .upload(storagePath, buffer, {
      contentType: photo.type,
      upsert: false,
    });

  // If the upload failed, log it but continue. The analysis is the
  // user-visible value; persistence is a nice-to-have we can recover.
  let photoPersisted = !uploadError;
  if (uploadError) {
    console.error("Storage upload failed:", uploadError.message);
  }

  // ---- Vision analysis ----
  const base64 = buffer.toString("base64");
  const mediaType =
    photo.type === "image/jpg"
      ? "image/jpeg"
      : (photo.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let userText = `Analyze this photograph of: ${areaLabel}.`;
  if (context)
    userText += `\n\nAdditional context from the property owner:\n${context}`;
  userText += `\n\nProvide a structured SHIELD AI analysis. Output JSON only.`;

  let analysisRaw: string;
  let inputTokens = 0;
  let outputTokens = 0;
  try {
    const resp = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            { type: "text", text: userText },
          ],
        },
      ],
    });
    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model");
    }
    analysisRaw = textBlock.text.trim();
    inputTokens = resp.usage?.input_tokens ?? 0;
    outputTokens = resp.usage?.output_tokens ?? 0;
  } catch (e) {
    console.error("Anthropic API error:", e);
    // If we already uploaded the photo, leave it - the user might retry
    // and we'll dedupe on the next attempt.
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    );
  }

  // Parse JSON (be tolerant of code fences)
  let parsed: AnalysisResult;
  try {
    let cleaned = analysisRaw;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```(?:json)?/, "")
        .replace(/```$/, "")
        .trim();
    }
    parsed = JSON.parse(cleaned) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse model output:", analysisRaw.slice(0, 500));
    return NextResponse.json(
      {
        error: "Model returned malformed output. Try a clearer photo.",
        rawSample: analysisRaw.slice(0, 200),
      },
      { status: 500 }
    );
  }

  // Light sanity-check on the parsed shape - if it's missing required
  // fields, return what we have and skip persistence.
  if (
    !parsed.findings ||
    !Array.isArray(parsed.findings) ||
    !parsed.summary ||
    !parsed.overall_severity
  ) {
    return NextResponse.json({
      ...parsed,
      assessment_id: null,
      _warning: "Analysis returned but did not match expected shape; not persisted.",
    });
  }

  // ---- Persist to DB ----
  // Wrapped in try/catch so a DB failure does not lose the user's analysis.
  let persistedAssessmentId: string | null = null;
  let signedPhotoUrl: string | null = null;

  try {
    // Cost estimate: rough Claude Sonnet 4.5 pricing (as of writing).
    // Inputs ~$3/M, outputs ~$15/M. Approximate; refresh from billing as needed.
    const costUsd =
      (inputTokens * 3) / 1_000_000 + (outputTokens * 15) / 1_000_000;

    const { error: assessErr } = await supabase.from("assessments").insert({
      id: assessmentId,
      org_id: orgId,
      created_by: user.id,
      title: parsed.area_label || areaLabel || "Untitled assessment",
      status: "complete",
      area_label: parsed.area_label || areaLabel,
      model: "claude-sonnet-4-5",
      analysis_text: analysisRaw,
      summary: parsed.summary,
      overall_severity: parsed.overall_severity,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: costUsd.toFixed(4),
      completed_at: new Date().toISOString(),
    });

    if (assessErr) {
      console.error("Failed to insert assessment:", assessErr.message);
    } else {
      persistedAssessmentId = assessmentId;

      // Photo row (only if upload actually succeeded above)
      if (photoPersisted) {
        const { error: photoErr } = await supabase
          .from("assessment_photos")
          .insert({
            id: photoId,
            assessment_id: assessmentId,
            storage_path: storagePath,
            filename: photo.name,
            size_bytes: photo.size,
          });
        if (photoErr) {
          console.error("Failed to insert photo row:", photoErr.message);
          photoPersisted = false;
        } else {
          // Generate a 7-day signed URL for the client to render.
          const { data: signed } = await supabase.storage
            .from("assessment-photos")
            .createSignedUrl(storagePath, 60 * 60 * 24 * 7);
          signedPhotoUrl = signed?.signedUrl ?? null;
        }
      }

      // Findings rows
      if (parsed.findings.length > 0) {
        const findingRows = parsed.findings.map((f) => ({
          assessment_id: assessmentId,
          finding_number: f.number,
          severity: f.severity,
          title: f.title,
          description: f.description ?? "",
          recommendation: f.recommendation ?? "",
          photo_id: photoPersisted ? photoId : null,
          bbox_x: f.bbox?.x ?? null,
          bbox_y: f.bbox?.y ?? null,
          bbox_w: f.bbox?.w ?? null,
          bbox_h: f.bbox?.h ?? null,
          est_cost_low: f.est_cost_low ?? null,
          est_cost_high: f.est_cost_high ?? null,
        }));
        const { error: findErr } = await supabase
          .from("assessment_findings")
          .insert(findingRows);
        if (findErr) {
          console.error("Failed to insert findings:", findErr.message);
        }
      }
    }
  } catch (e) {
    console.error("Persistence error:", e);
  }

  return NextResponse.json({
    ...parsed,
    assessment_id: persistedAssessmentId,
    photo_url: signedPhotoUrl,
  });
}
