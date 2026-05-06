/**
 * SHIELD AI photo analysis endpoint.
 *
 * POST /api/shield-ai/analyze
 * Body: multipart/form-data
 *   - photo: image file
 *   - area_label: string
 *   - context: string (optional)
 *
 * Returns: AnalysisResult JSON
 *
 * Flow:
 *   1. Validate auth + image
 *   2. Convert image to base64
 *   3. Call Claude Sonnet 4.5 with vision + structured-output prompt
 *   4. Parse JSON response, validate
 *   5. Return to client (DB persistence handled separately to keep this fast)
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 90;

const SYSTEM_PROMPT = `You are SHIELD AI — an expert physical-security and threat-assessment advisor for Ocean State Protection Group, a private security consultancy founded by active-duty law enforcement officers serving Catholic schools, parishes, businesses, and high-net-worth properties across New England.

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
- Landscaping (CPTED — crime prevention through environmental design)
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

Bounding boxes (bbox) are normalized 0..1 coordinates marking the area of the photo containing the issue. Provide bbox when the issue is visually localizable. Omit if the finding is general (e.g., "no camera coverage of this approach" doesn't have a localizable bbox — omit it).

Generate 3-7 findings per analysis. Quality over quantity. If everything looks genuinely good, say so honestly with 1-2 LOW findings.

Output ONLY the JSON object. No prose, no preamble, no markdown fences.`;

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const photo = form.get("photo");
  const areaLabel = (form.get("area_label") as string) || "Unspecified location";
  const context = (form.get("context") as string) || "";

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Photo file required" }, { status: 400 });
  }
  if (photo.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Photo exceeds 20MB" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Convert to base64
  const buffer = Buffer.from(await photo.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType =
    photo.type === "image/jpg" ? "image/jpeg" : (photo.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Build user message
  let userText = `Analyze this photograph of: ${areaLabel}.`;
  if (context) userText += `\n\nAdditional context from the property owner:\n${context}`;
  userText += `\n\nProvide a structured SHIELD AI analysis. Output JSON only.`;

  let analysisRaw: string;
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
  } catch (e) {
    console.error("Anthropic API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    );
  }

  // Parse JSON (be tolerant of code fences)
  let parsed: unknown;
  try {
    let cleaned = analysisRaw;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse model output:", analysisRaw.slice(0, 500));
    return NextResponse.json(
      { error: "Model returned malformed output. Try a clearer photo." },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
