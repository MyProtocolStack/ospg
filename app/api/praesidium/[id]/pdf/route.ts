/**
 * Server-rendered PDF download for a saved PRAESIDIUM assessment.
 *
 * GET /api/praesidium/[id]/pdf
 *
 * Flow:
 *   1. Auth caller via the user-context Supabase client. RLS denies
 *      access if the assessment belongs to an org the caller is not in.
 *   2. Fetch assessment + photo metadata + findings.
 *   3. Generate a short-lived signed URL for the photo, fetch it, and
 *      embed as base64 so the PDF is fully self-contained (no external
 *      fetch needed at render time, works in any reader, never breaks
 *      when signed URLs expire).
 *   4. Render the React-PDF document with renderToBuffer.
 *   5. Stream the bytes back as application/pdf with a download
 *      Content-Disposition.
 */
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import {
  AssessmentReport,
  type ReportFinding,
  type ReportSeverity,
} from "@/lib/pdf/AssessmentReport";

export const runtime = "nodejs";
// PDF rendering can be CPU heavy on large finding sets - give it room.
export const maxDuration = 60;

function safeFilename(s: string, fallback: string): string {
  if (!s) return fallback;
  return (
    s
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .slice(0, 50)
      .replace(/\s+/g, "-") || fallback
  );
}

function isSeverity(v: unknown): v is ReportSeverity {
  return v === "low" || v === "medium" || v === "high" || v === "critical";
}

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS scopes the read to the caller's own-org assessments.
  const { data: assessment, error: assessErr } = await supabase
    .from("assessments")
    .select(
      "id, org_id, title, area_label, summary, overall_severity, status, model, created_at, completed_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (assessErr || !assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  // Photo (one per assessment in current schema).
  const { data: photo } = await supabase
    .from("assessment_photos")
    .select("id, storage_path, filename")
    .eq("assessment_id", id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Embed the photo as a base64 data URL so the PDF is fully self-
  // contained. We sign a short-lived URL just for the render, fetch
  // the bytes, and inline them.
  let photoDataUrl: string | null = null;
  if (photo?.storage_path) {
    try {
      const { data: signed } = await supabase.storage
        .from("assessment-photos")
        .createSignedUrl(photo.storage_path, 60);
      if (signed?.signedUrl) {
        const photoRes = await fetch(signed.signedUrl);
        if (photoRes.ok) {
          const buf = Buffer.from(await photoRes.arrayBuffer());
          const contentType =
            photoRes.headers.get("content-type") || "image/jpeg";
          photoDataUrl = `data:${contentType};base64,${buf.toString("base64")}`;
        }
      }
    } catch (e) {
      console.error("PDF photo fetch failed (non-fatal):", e);
      photoDataUrl = null;
    }
  }

  // Findings, ordered.
  const { data: rawFindings } = await supabase
    .from("assessment_findings")
    .select(
      "finding_number, severity, title, description, recommendation, bbox_x, bbox_y, bbox_w, bbox_h, est_cost_low, est_cost_high"
    )
    .eq("assessment_id", id)
    .order("finding_number", { ascending: true });

  const findings: ReportFinding[] = (rawFindings ?? []).map((f) => {
    const sev = isSeverity(f.severity) ? f.severity : "low";
    return {
      finding_number: Number(f.finding_number) || 0,
      severity: sev,
      title: typeof f.title === "string" ? f.title : "",
      description: typeof f.description === "string" ? f.description : "",
      recommendation:
        typeof f.recommendation === "string" ? f.recommendation : "",
      est_cost_low:
        typeof f.est_cost_low === "number" ? f.est_cost_low : null,
      est_cost_high:
        typeof f.est_cost_high === "number" ? f.est_cost_high : null,
      nsgp_eligible: null,
      bbox:
        f.bbox_x != null &&
        f.bbox_y != null &&
        f.bbox_w != null &&
        f.bbox_h != null
          ? {
              x: Number(f.bbox_x),
              y: Number(f.bbox_y),
              w: Number(f.bbox_w),
              h: Number(f.bbox_h),
            }
          : null,
    };
  });

  // Best-effort lookup of the org name for the cover page.
  let orgName: string | null = null;
  try {
    const { data: org } = await supabase
      .from("orgs")
      .select("name")
      .eq("id", assessment.org_id)
      .maybeSingle();
    if (org && typeof (org as { name?: string }).name === "string") {
      orgName = (org as { name: string }).name;
    }
  } catch {
    orgName = null;
  }

  const overall = isSeverity(assessment.overall_severity)
    ? assessment.overall_severity
    : "low";

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      AssessmentReport({
        title:
          (typeof assessment.title === "string" && assessment.title) ||
          "PRAESIDIUM Assessment",
        area_label:
          (typeof assessment.area_label === "string" &&
            assessment.area_label) ||
          "",
        summary:
          (typeof assessment.summary === "string" && assessment.summary) ||
          "",
        overall_severity: overall,
        completed_at: assessment.completed_at as string | null,
        created_at: assessment.created_at as string | null,
        photo_data_url: photoDataUrl,
        findings,
        org_name: orgName,
      })
    );
  } catch (e) {
    console.error("PDF render failed:", e);
    return NextResponse.json(
      { error: "Could not generate PDF report. Try again or contact support." },
      { status: 500 }
    );
  }

  const filename = `praesidium-${safeFilename(
    (assessment.title as string) || (assessment.area_label as string) || "report",
    "report"
  )}-${id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
