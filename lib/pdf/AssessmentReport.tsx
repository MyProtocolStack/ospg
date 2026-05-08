/**
 * PRAESIDIUM Assessment Report - server-rendered PDF.
 *
 * Composed with @react-pdf/renderer primitives (Document/Page/View/Text/
 * Image). Rendered to a Buffer in /api/praesidium/[id]/pdf and streamed
 * as application/pdf.
 *
 * Layout:
 *   - Cover page: brand mark, title, area label, severity, dates,
 *     OSPG contact footer
 *   - Body page(s): photo with bbox annotations, executive summary,
 *     findings list with severity / cost / NSGP flags
 *   - Disclaimer page: limitations of preliminary AI analysis
 *
 * Pure presentational - no Supabase calls inside. Caller assembles the
 * data and passes it in as props.
 */
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export type ReportFinding = {
  finding_number: number;
  severity: ReportSeverity;
  title: string;
  description: string;
  recommendation: string;
  bbox?: { x: number; y: number; w: number; h: number } | null;
  est_cost_low?: number | null;
  est_cost_high?: number | null;
  nsgp_eligible?: boolean | null;
};

export type AssessmentReportProps = {
  /** Title shown on the cover. Usually the assessment.title or area_label. */
  title: string;
  area_label: string;
  summary: string;
  overall_severity: ReportSeverity;
  /** ISO datetime of completion. */
  completed_at?: string | null;
  created_at?: string | null;
  /** Photo as a base64 data URL, JPEG/PNG. Optional. */
  photo_data_url?: string | null;
  findings: ReportFinding[];
  /** Org / client name shown on cover. */
  org_name?: string | null;
};

// Brand palette for PDF - hex equivalents of the CSS vars used on the site.
const COLORS = {
  navy: "#0A1628",
  navyDeep: "#060E1B",
  cream: "#F8F6F1",
  silver100: "#E2E5EA",
  silver200: "#C0C5CE",
  silver300: "#8E94A0",
  silver400: "#6A6F7A",
  gold: "#C9A961",
  goldDeep: "#A88A4A",
  high: "#E59A3A",
  medium: "#C9A961",
  low: "#A0C7E5",
  critical: "#B33A3A",
};

const SEV_LABEL: Record<ReportSeverity, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL",
};

const styles = StyleSheet.create({
  // Pages -----------------------------------------------------------------
  cover: {
    flexDirection: "column",
    backgroundColor: COLORS.navyDeep,
    padding: 56,
    color: COLORS.cream,
  },
  page: {
    backgroundColor: "#FFFFFF",
    padding: 48,
    paddingBottom: 64,
    fontSize: 10,
    color: "#1F2937",
  },
  // Cover page ------------------------------------------------------------
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  brandLogo: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.gold,
    marginRight: 8,
  },
  brandText: {
    fontSize: 11,
    color: COLORS.cream,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
  },
  brandSub: {
    fontSize: 9,
    color: COLORS.silver300,
    marginLeft: 6,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  coverEyebrow: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
    marginTop: 80,
  },
  coverTitle: {
    fontSize: 36,
    color: COLORS.cream,
    marginBottom: 18,
    lineHeight: 1.1,
    fontFamily: "Helvetica-Bold",
  },
  coverArea: {
    fontSize: 14,
    color: COLORS.silver100,
    marginBottom: 40,
    lineHeight: 1.45,
  },
  coverDivider: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 32,
  },
  coverMetaRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  coverMetaLabel: {
    width: 120,
    fontSize: 9,
    color: COLORS.silver300,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  coverMetaValue: {
    fontSize: 11,
    color: COLORS.cream,
  },
  coverFooter: {
    position: "absolute",
    bottom: 48,
    left: 56,
    right: 56,
    paddingTop: 18,
    borderTopWidth: 0.5,
    borderTopColor: "#3a4866",
  },
  coverFooterText: {
    fontSize: 9,
    color: COLORS.silver300,
    lineHeight: 1.5,
  },
  // Body ------------------------------------------------------------------
  sectionLabel: {
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  sectionH2: {
    fontSize: 18,
    color: "#0A1628",
    marginBottom: 14,
    fontFamily: "Helvetica-Bold",
  },
  bodyText: {
    fontSize: 11,
    color: "#1F2937",
    lineHeight: 1.55,
    marginBottom: 8,
  },
  smallText: {
    fontSize: 9,
    color: COLORS.silver400,
    lineHeight: 1.45,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#D8DDE5",
    marginVertical: 18,
  },
  photoFrame: {
    width: "100%",
    height: 240,
    backgroundColor: "#0F1E3D",
    borderRadius: 4,
    marginBottom: 18,
    position: "relative",
  },
  photoImg: {
    width: "100%",
    height: 240,
    objectFit: "cover",
  },
  photoCaption: {
    fontSize: 8,
    color: COLORS.silver400,
    textAlign: "center",
    marginTop: -10,
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Findings --------------------------------------------------------------
  findingCard: {
    borderWidth: 0.5,
    borderColor: "#D8DDE5",
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  findingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  findingNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textAlign: "center",
    paddingTop: 4,
    marginRight: 10,
  },
  findingSeverity: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    marginRight: 10,
  },
  findingNsgp: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    color: COLORS.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
  },
  findingTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0A1628",
    marginTop: 6,
    marginBottom: 8,
  },
  findingPara: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  recommendLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    color: COLORS.gold,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 4,
  },
  costLine: {
    fontSize: 9,
    color: COLORS.silver400,
    marginTop: 6,
  },
  // Page footer -----------------------------------------------------------
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#D8DDE5",
  },
  pageFooterText: {
    fontSize: 8,
    color: COLORS.silver400,
  },
});

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function severityColor(s: ReportSeverity): string {
  return COLORS[s];
}

function formatCost(low?: number | null, high?: number | null): string {
  if (low == null && high == null) return "";
  if (low != null && high != null && low !== high) {
    return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
  }
  return `$${(low ?? high ?? 0).toLocaleString()}`;
}

export function AssessmentReport(props: AssessmentReportProps) {
  const {
    title,
    area_label,
    summary,
    overall_severity,
    completed_at,
    created_at,
    photo_data_url,
    findings,
    org_name,
  } = props;

  const dateLine = formatDate(completed_at ?? created_at);

  return (
    <Document
      title={`PRAESIDIUM Report - ${title}`}
      author="Ocean State Protection Group"
      subject="Preliminary Vulnerability Assessment"
      creator="OSPG PRAESIDIUM"
    >
      {/* COVER PAGE */}
      <Page size="LETTER" style={styles.cover}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogo} />
          <Text style={styles.brandText}>OCEAN STATE PROTECTION GROUP</Text>
          <Text style={styles.brandSub}>OSPG</Text>
        </View>

        <Text style={styles.coverEyebrow}>PRAESIDIUM Assessment Report</Text>
        <Text style={styles.coverTitle}>{title}</Text>
        <Text style={styles.coverArea}>{area_label}</Text>
        <View style={styles.coverDivider} />

        {org_name && (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Prepared for</Text>
            <Text style={styles.coverMetaValue}>{org_name}</Text>
          </View>
        )}
        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaLabel}>Overall severity</Text>
          <Text
            style={[
              styles.coverMetaValue,
              { color: severityColor(overall_severity) },
            ]}
          >
            {SEV_LABEL[overall_severity]}
          </Text>
        </View>
        {dateLine && (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Date</Text>
            <Text style={styles.coverMetaValue}>{dateLine}</Text>
          </View>
        )}
        <View style={styles.coverMetaRow}>
          <Text style={styles.coverMetaLabel}>Findings</Text>
          <Text style={styles.coverMetaValue}>
            {findings.length} {findings.length === 1 ? "item" : "items"}
          </Text>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>
            Ocean State Protection Group | Rhode Island
          </Text>
          <Text style={styles.coverFooterText}>
            oceanstateprotectiongroup.com | (207) 974-9840
          </Text>
          <Text style={styles.coverFooterText}>
            CONFIDENTIAL - Prepared for the named recipient. Do not redistribute
            without written permission.
          </Text>
        </View>
      </Page>

      {/* BODY PAGE - Summary + Photo + Findings */}
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.sectionLabel}>Executive Summary</Text>
        <Text style={styles.sectionH2}>{title}</Text>
        <Text style={styles.bodyText}>{summary}</Text>

        {photo_data_url && (
          <View>
            <Image src={photo_data_url} style={styles.photoImg} />
            <Text style={styles.photoCaption}>
              Reference photo - bounding-box annotations omitted in PDF
              for legibility
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>
          Findings ({findings.length})
        </Text>
        <Text style={styles.sectionH2}>Prioritized observations</Text>

        {findings.length === 0 && (
          <Text style={styles.bodyText}>
            No findings recorded for this assessment.
          </Text>
        )}

        {findings.map((f) => {
          const sevColor = severityColor(f.severity);
          const cost = formatCost(f.est_cost_low, f.est_cost_high);
          return (
            <View key={f.finding_number} style={styles.findingCard} wrap={false}>
              <View style={styles.findingHeader}>
                <Text
                  style={[styles.findingNumber, { backgroundColor: sevColor }]}
                >
                  {f.finding_number}
                </Text>
                <Text style={[styles.findingSeverity, { color: sevColor }]}>
                  {SEV_LABEL[f.severity]}
                </Text>
                {f.nsgp_eligible && (
                  <Text style={styles.findingNsgp}>NSGP-ELIGIBLE</Text>
                )}
              </View>
              <Text style={styles.findingTitle}>{f.title}</Text>
              {f.description && (
                <Text style={styles.findingPara}>{f.description}</Text>
              )}
              {f.recommendation && (
                <View>
                  <Text style={styles.recommendLabel}>Recommended Action</Text>
                  <Text style={styles.findingPara}>{f.recommendation}</Text>
                </View>
              )}
              {cost && (
                <Text style={styles.costLine}>
                  Estimated cost: {cost}
                </Text>
              )}
            </View>
          );
        })}

        <View
          style={styles.pageFooter}
          render={({ pageNumber }) => (
            <>
              <Text style={styles.pageFooterText}>
                OSPG | PRAESIDIUM Assessment{dateLine ? ` | ${dateLine}` : ""}
              </Text>
              <Text style={styles.pageFooterText}>Page {pageNumber}</Text>
            </>
          )}
          fixed
        />
      </Page>

      {/* DISCLAIMER PAGE */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionLabel}>Notice</Text>
        <Text style={styles.sectionH2}>Limitations of this report</Text>
        <Text style={styles.bodyText}>
          PRAESIDIUM provides a preliminary, photo-based vulnerability analysis.
          The findings in this report are based exclusively on visual evidence
          present in the submitted image and the context provided by the user
          at the time of submission. They are intended to inform an in-person
          security assessment, not to replace one.
        </Text>
        <Text style={styles.bodyText}>
          A full SHIELD Assessment - conducted on site by Ocean State Protection
          Group&apos;s founders - is required for definitive recommendations,
          insurance-grade documentation, FEMA Nonprofit Security Grant Program
          submissions, and any decisions involving life-safety, regulatory
          compliance, or capital expenditure.
        </Text>
        <Text style={styles.bodyText}>
          This document does not constitute legal, engineering, or insurance
          advice. Cost ranges are budgetary estimates only and may vary based
          on local labor markets, vendor selection, and site conditions
          discoverable only on a physical walkthrough.
        </Text>
        <Text style={styles.bodyText}>
          OSPG is co-founded by active-duty law enforcement officers in the
          State of Rhode Island. Founder work for OSPG is limited to consulting
          activities (assessments, written reports, training delivery, program
          design, grant-application advisory) conducted off-duty under approved
          extra-duty authorization. Active-duty officers, including OSPG
          founders, are never assigned to private security details. Detail
          staffing, when contracted, is provided exclusively by retired law
          enforcement officers and military veterans through OSPG&apos;s vetted
          operator network.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Next Steps</Text>
        <Text style={styles.sectionH2}>Schedule a SHIELD walkthrough</Text>
        <Text style={styles.bodyText}>
          Both founders attend every initial walkthrough. Free for first-time
          clients. The walkthrough validates these findings, surfaces what
          photos miss (procedure gaps, communication trees, drill cadence),
          and produces the document insurance carriers and FEMA actually
          require.
        </Text>
        <Text style={styles.bodyText}>
          Request a walkthrough at oceanstateprotectiongroup.com/walkthrough
          or contact us directly:
        </Text>
        <Text style={styles.bodyText}>
          Email: Oceanstateprotectiongroup@gmail.com
        </Text>
        <Text style={styles.bodyText}>
          Phone: (207) 974-9840
        </Text>

        <Text style={styles.smallText}>
          (c) {new Date().getFullYear()} Ocean State Protection Group. All
          rights reserved. This report is confidential.
        </Text>
      </Page>
    </Document>
  );
}
