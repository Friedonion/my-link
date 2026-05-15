import ProfileClient from "./ProfileClient";

export async function generateMetadata({ params }) {
  const { displayName } = await params;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!displayName || !projectId) {
    return { title: "프로필" };
  }

  try {
    // 1. displayName으로 uid 찾기
    const nameRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/displayNames/${displayName}`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    );
    
    if (nameRes.ok) {
      const nameData = await nameRes.json();
      const uid = nameData.fields?.uid?.stringValue;

      if (uid) {
        // 2. uid로 사용자 프로필 정보 가져오기
        const userRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
          { next: { revalidate: 3600 } }
        );

        if (userRes.ok) {
          const fullData = await userRes.json();
          const f = fullData.fields;
          const username = f.username?.stringValue || displayName;
          const bio = f.bio?.stringValue || `${username}님의 마이링크 페이지입니다.`;
          const photoURL = f.photoURL?.stringValue;

          return {
            title: `${username} (@${displayName})`,
            description: bio,
            openGraph: {
              title: `${username}님의 마이링크`,
              description: bio,
              url: `/${displayName}`,
              images: photoURL ? [
                {
                  url: photoURL,
                  width: 400,
                  height: 400,
                  alt: username,
                }
              ] : [],
            },
            twitter: {
              card: "summary",
              title: `${username}님의 마이링크`,
              description: bio,
              images: photoURL ? [photoURL] : [],
            },
            alternates: {
              canonical: `/${displayName}`,
            },
          };
        }
      }
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    title: "프로필",
    description: "마이링크 사용자 프로필 페이지입니다.",
  };
}

export default function Page() {
  return <ProfileClient />;
}
