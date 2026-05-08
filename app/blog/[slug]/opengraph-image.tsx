/**
 * Dynamic Open Graph image for blog posts.
 *
 * Next.js 13+ App Router auto-generates an OG card per post by
 * resolving this `opengraph-image.tsx` file. Renders a 1200x630
 * branded card with the post title, category, and read time.
 *
 * Result: every shared blog URL on LinkedIn / X / Slack / iMessage
 * gets a unique, on-brand preview card instead of the generic
 * site-wide og-image.png.
 */
import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog-posts";

export const alt = "Ocean State Protection Group - Field Notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  // Fallback if the post is missing - render a generic Field Notes card
  // rather than throwing.
  const title = post?.title ?? "Field Notes";
  const category = post?.category ?? "OSPG";
  const readMins = post?.readMins ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#060E1B",
          backgroundImage:
            "radial-gradient(circle at 25% 0%, rgba(201,169,97,0.18), transparent 55%), radial-gradient(circle at 100% 100%, rgba(20,40,76,0.5), transparent 60%)",
          padding: "72px 80px",
          color: "#F8F6F1",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              backgroundColor: "#C9A961",
            }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#F8F6F1",
            }}
          >
            OCEAN STATE PROTECTION GROUP
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4,
              color: "#8E94A0",
            }}
          >
            FIELD NOTES
          </div>
        </div>

        {/* Category pill */}
        <div
          style={{
            display: "flex",
            marginTop: 56,
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 3,
              fontWeight: 700,
              color: "#C9A961",
              backgroundColor: "rgba(201,169,97,0.1)",
              border: "1px solid rgba(201,169,97,0.45)",
              padding: "8px 16px",
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title - the headline word */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 60,
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#F8F6F1",
            maxWidth: 1040,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>

        {/* Bottom band */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            left: 80,
            right: 80,
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(201,169,97,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                color: "#8E94A0",
                textTransform: "uppercase",
              }}
            >
              Operational analysis
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#C0C5CE",
              }}
            >
              oceanstateprotectiongroup.com
            </div>
          </div>
          {readMins ? (
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#C9A961",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {readMins} min read
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
