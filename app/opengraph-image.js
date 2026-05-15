import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MY-link";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "40px",
            padding: "24px 40px",
            borderRadius: "48px",
            background: "#18181b", // zinc-900
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span
            style={{
              fontSize: "84px",
              fontWeight: "900",
              color: "white",
              letterSpacing: "-0.05em",
            }}
          >
            MY-link
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              fontWeight: "900",
              color: "#18181b",
              textAlign: "center",
              margin: 0,
              letterSpacing: "-0.04em",
            }}
          >
            모든 링크를 하나로
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#71717a", // zinc-500
              margin: 0,
              fontWeight: "600",
            }}
          >
            가장 쉬운 나만의 링크 모음 서비스
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
