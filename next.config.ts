import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Until we build a dedicated grants page, send people straight to the
      // federal source so they at least land somewhere useful.
      {
        source: "/grants",
        destination:
          "https://www.fema.gov/grants/preparedness/nonprofit-security",
        permanent: false,
      },
      // SHIELD Assessment (in-person walkthrough) is booked via /walkthrough.
      // SHIELD AI (photo analysis) is a separate product. Send legacy
      // /services/shield-assessment links to the booking page.
      {
        source: "/services/shield-assessment",
        destination: "/walkthrough",
        permanent: true,
      },
      // /case-studies link in the footer was added before we had cases. Until
      // we have permissioned anonymized examples, point it at the assessment.
      {
        source: "/case-studies",
        destination: "/shield-ai",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
