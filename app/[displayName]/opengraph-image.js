import { ImageResponse } from "next/og";

// Edge 런타임 대신 기본 nodejs 런타임 사용 (외부 이미지 fetch 안정성 확보)
export const runtime = "nodejs";

export const alt = "MY-link User Profile";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { displayName } = await params;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  let userData = {
    username: displayName,
    bio: "",
    photoURL: null,
    displayName: displayName,
  };

  if (projectId) {
    try {
      const nameRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/displayNames/${displayName}`,
        { next: { revalidate: 60 } }
      );
      
      if (nameRes.ok) {
        const nameData = await nameRes.json();
        const uid = nameData.fields?.uid?.stringValue;

        if (uid) {
          const userRes = await fetch(
            `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
            { next: { revalidate: 60 } }
          );

          if (userRes.ok) {
            const fullData = await userRes.json();
            const f = fullData.fields;
            if (f) {
              userData = {
                username: f.username?.stringValue || displayName,
                bio: f.bio?.stringValue || "",
                photoURL: f.photoURL?.stringValue || null,
                displayName: displayName,
              };
            }
          }
        }
      }
    } catch (error) {
      console.error("OG Image fetch error:", error);
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Modern Background Gradient & Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
            zIndex: -2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 0)",
            backgroundSize: "32px 32px",
            zIndex: -1,
          }}
        />

        {/* Sophisticated Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "48px",
            background: "white",
            padding: "50px 70px",
            borderRadius: "60px",
            boxShadow: "0 25px 80px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
            border: "1px solid rgba(255,255,255,0.8)",
            width: "90%",
            maxWidth: "1000px",
          }}
        >
          {/* Profile Photo with stylized border */}
          <div
            style={{
              display: "flex",
              padding: "8px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "92px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {userData.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userData.photoURL}
                  alt={userData.username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "84px", fontWeight: "bold", color: "#94a3b8" }}>
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: "0",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                {userData.username}
              </h1>
              <p
                style={{
                  fontSize: "34px",
                  fontWeight: "600",
                  color: "#64748b",
                  margin: "4px 0 0 0",
                  letterSpacing: "-0.02em",
                }}
              >
                @{userData.displayName}
              </p>
            </div>

            {userData.bio && (
              <div
                style={{
                  height: "2px",
                  width: "60px",
                  background: "#e2e8f0",
                  margin: "8px 0 20px 0",
                  borderRadius: "2px",
                }}
              />
            )}

            {userData.bio && (
              <p
                style={{
                  fontSize: "26px",
                  color: "#475569",
                  textAlign: "left",
                  margin: 0,
                  maxWidth: "550px",
                  lineHeight: 1.5,
                  fontWeight: "500",
                }}
              >
                {userData.bio.length > 120 ? userData.bio.substring(0, 120) + "..." : userData.bio}
              </p>
            )}
          </div>
        </div>

        {/* Floating Branding Tag */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "64px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            borderRadius: "20px",
            background: "#1e293b",
            color: "white",
            fontSize: "20px",
            fontWeight: "800",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span style={{ letterSpacing: "-0.02em" }}>MY-link</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
