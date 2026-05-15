import { ImageResponse } from "next/og";

export const runtime = "edge";

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
    bio: "마이링크 프로필",
    photoURL: null,
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
              };
            }
          }
        }
      }
    } catch (error) {
      console.error("OG fetch error:", error);
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #f1f5f9 2%, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '40px 60px',
            borderRadius: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Profile Photo Placeholder if photoURL is missing or fails */}
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '80px',
              backgroundColor: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              overflow: 'hidden'
            }}
          >
            {userData.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={userData.photoURL} 
                alt="profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              userData.username.charAt(0).toUpperCase()
            )}
          </div>
          
          <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
            {userData.username}
          </div>
          <div style={{ fontSize: '30px', color: '#64748b', marginBottom: '24px' }}>
            @{displayName}
          </div>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            MY-link
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
