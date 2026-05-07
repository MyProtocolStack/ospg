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
      // The AI photo-analysis tool was previously branded "SHIELD AI" but
      // was renamed to VIGIL to avoid trademark overlap with the registered
      // Shield AI Inc. defense-AI mark. Both legacy URLs redirect.
      {
        source: "/services/shield-assessment",
        destination: "/walkthrough",
        permanent: true,
      },
      {
        source: "/shield-ai",
        destination: "/vigil",
        permanent: true,
      },
      {
        source: "/shield-ai/:path*",
        destination: "/vigil/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/shield-ai",
        destination: "/dashboard/vigil",
        permanent: true,
      },
      {
        source: "/dashboard/shield-ai/:path*",
        destination: "/dashboard/vigil/:path*",
        permanent: true,
      },
      // /case-studies link in the footer was added before we had cases. Until
      // we have permissioned anonymized examples, point it at the AI tool.
      {
        source: "/case-studies",
        destination: "/vigil",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
