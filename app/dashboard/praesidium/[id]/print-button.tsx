"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * Server-rendered PDF download for an assessment.
 *
 * Calls /api/praesidium/[id]/pdf which renders the report with
 * @react-pdf/renderer and returns application/pdf. Result is a real,
 * email-attachable PDF file - not a browser-print hack.
 *
 * Falls back to window.print() if the server endpoint errors out, so
 * users always have a way to capture the report.
 */
export function PrintReportButton({ assessmentId }: { assessmentId: string }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);
    setDownloading(true);
    try {
      const res = await fetch(`/api/praesidium/${assessmentId}/pdf`, {
        method: "GET",
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `PDF generation failed (${res.status})`);
      }

      // Pull the filename from Content-Disposition if present, otherwise
      // synthesize one from the assessment id.
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="?([^";]+)"?/);
      const filename = match
        ? match[1]
        : `praesidium-report-${assessmentId.slice(0, 8)}.pdf`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download failed, falling back to print:", e);
      setError(e instanceof Error ? e.message : "Download failed");
      // Last-resort fallback: trigger the browser's native print dialog.
      // The page has print: styles that strip dashboard chrome.
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="btn-primary justify-center print:hidden disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download PDF Report
          </>
        )}
      </button>
      {error && (
        <p className="text-[11px] text-[var(--color-silver-300)] mt-1">
          {error}. Browser print dialog opened as fallback.
        </p>
      )}
    </div>
  );
}
