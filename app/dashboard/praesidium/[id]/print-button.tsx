"use client";

import { Printer } from "lucide-react";

/**
 * Print-to-PDF button for assessment detail pages.
 *
 * Uses the browser's native print dialog. Combined with the print:
 * styles in globals.css, the rendered PDF hides the dashboard chrome
 * (sidebar, topbar, footer actions) and shows the assessment content
 * with a light-mode color scheme suitable for paper or sharing.
 *
 * Why not server-side PDF generation: avoids @react-pdf/renderer or
 * puppeteer, both of which add deployment complexity and bundle weight
 * for a feature most users will exercise rarely. Browser print is good
 * enough at this stage; we can swap to server PDF when we need
 * email-attachable reports.
 */
export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary justify-center print:hidden"
    >
      <Printer className="h-4 w-4" />
      Download as PDF
    </button>
  );
}
