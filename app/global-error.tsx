"use client";

/**
 * Absolute-last-resort error boundary. Only catches errors that happen
 * INSIDE the root app/layout.tsx itself (since that file is above every
 * other error boundary in the tree). Must include its own <html> and
 * <body> tags because the root layout failed to render.
 *
 * Keep styling minimal and inline so a corrupted CSS bundle does not
 * also break this fallback.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#060e1b",
          color: "#f1f3fa",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            margin: "0 24px",
            padding: 32,
            border: "1px solid rgba(201, 169, 97, 0.25)",
            borderRadius: 16,
            backgroundColor: "rgba(10, 22, 40, 0.6)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#C9A961",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Critical Error
          </p>
          <h1
            style={{
              fontSize: 26,
              lineHeight: 1.2,
              color: "#F8F6F1",
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            The site couldn&apos;t load.
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#C0C5CE",
              marginBottom: 20,
            }}
          >
            A critical error happened before the page could render. Try
            reloading. If the error persists, contact us at
            Oceanstateprotectiongroup@gmail.com.
          </p>
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#A0A6B0",
                marginBottom: 6,
                marginTop: 0,
              }}
            >
              Diagnostic
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#F8F6F1",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: 10,
                  color: "#888",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                digest: {error.digest}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                backgroundColor: "#C9A961",
                color: "#0A1628",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                backgroundColor: "transparent",
                color: "#F8F6F1",
                fontWeight: 500,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "inline-block",
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
