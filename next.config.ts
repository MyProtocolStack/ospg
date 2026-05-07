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
      {
        source: "/services/shield-assessment",
        destination: "/walkthrough",
        permanent: true,
      },

      // The AI photo-analysis tool went through two short-lived names
      // (SHIELD AI -> VIGIL -> PRAESIDIUM). 'SHIELD AI' was a registered
      // trademark conflict with Shield AI Inc.; 'VIGIL' carried funeral /
      // wake associations that were tonally wrong for our Catholic ICP.
      // PRAESIDIUM is from the St. Michael Prayer ('esto praesidium' =
      // 'be our protection') and is now the canonical brand. Both legacy
      // path families 308-redirect to the new URLs so external links and
      // bookmarks still work.
      {
        source: "/shield-ai",
        destination: "/praesidium",
        permanent: true,
      },
      {
        source: "/shield-ai/:path*",
        destination: "/praesidium/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/shield-ai",
        destination: "/dashboard/praesidium",
        permanent: true,
      },
      {
        source: "/dashboard/shield-ai/:path*",
        destination: "/dashboard/praesidium/:path*",
        permanent: true,
      },
      {
        source: "/vigil",
        destination: "/praesidium",
        permanent: true,
      },
      {
        source: "/vigil/:path*",
        destination: "/praesidium/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/vigil",
        destination: "/dashboard/praesidium",
        permanent: true,
      },
      {
        source: "/dashboard/vigil/:path*",
        destination: "/dashboard/praesidium/:path*",
        permanent: true,
      },

      // /case-studies link in the footer was added before we had cases.
      // Until we have permissioned anonymized examples, point it at the
      // AI tool.
      {
        source: "/case-studies",
        destination: "/praesidium",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
