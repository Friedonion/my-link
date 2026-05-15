import { ImageResponse } from "next/og";

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          }}
        />
        
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            gap: "60px",
            background: "white",
            padding: "60px 80px",
            borderRadius: "80px",
            boxShadow: "0 30px 90px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "1050px",
          }}
        >
          {/* Profile Photo - Simplified for Satori compatibility */}
          <div
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "110px",
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "8px solid #f8fafc",
            }}
          >
            {userData.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userData.photoURL}
                alt={userData.username}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "110px" }}
              />
            ) : (
              <div style={{ fontSize: "100px", fontWeight: "bold", color: "#94a3b8" }}>
                {userData.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
              <h1
                style={{
                  fontSize: "80px",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: "0",
                  letterSpacing: "-0.04em",
                }}
              >
                {userData.username}
              </h1>
              <p
                style={{
                  fontSize: "40px",
                  fontWeight: "600",
                  color: "#64748b",
                  margin: "5px 0 0 0",
                }}
              >
                @{userData.displayName}
              </p>
            </div>

            {userData.bio && (
              <p
                style={{
                  fontSize: "30px",
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.4,
                  fontWeight: "500",
                }}
              >
                {userData.bio.length > 100 ? userData.bio.substring(0, 100) + "..." : userData.bio}
              </p>
            )}
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px",
            borderRadius: "30px",
            background: "#1e293b",
            color: "white",
            fontSize: "24px",
            fontWeight: "800",
          }}
        >
          <span>🔗 MY-link</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
