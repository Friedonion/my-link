"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, collection, query, orderBy, getDocs, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useParams } from "next/navigation";
import { Loader2, Link as LinkIcon, MousePointer2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Favicon 컴포넌트 (React import 순서 버그 수정: useState 직접 import 사용)
const Favicon = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-400 shadow-sm">
        <LinkIcon className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-white p-1.5 shadow-sm">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default function PublicProfilePage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const displayName = typeof params?.displayName === "string" ? params.displayName : "";

  // 뒤로가기 시 무한 로딩 해결을 위한 Bfcache 대응 (강력한 버전)
  useEffect(() => {
    // 1. pageshow 이벤트 처리
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    // 2. 초기 로드 시 뒤로가기 여부 확인 (일부 브라우저 대응)
    const entries = window.performance.getEntriesByType("navigation");
    if (entries.length > 0 && entries[0].type === "back_forward") {
      window.location.reload();
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // 1. displayName으로 uid 찾기
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["public-user", displayName],
    queryFn: async () => {
      if (!displayName) return null;

      const nameRef = doc(db, "displayNames", displayName);
      const nameSnap = await getDoc(nameRef);

      if (!nameSnap.exists()) {
        return null;
      }

      const uid = nameSnap.data().uid;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return { uid, ...userSnap.data() };
    },
    enabled: !!displayName,
    retry: 1,
    staleTime: 0, // 항상 최신 데이터 확인
    refetchOnWindowFocus: true,
  });

  // 2. uid로 링크 목록 가져오기
  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["public-links", userData?.uid],
    queryFn: async () => {
      if (!userData?.uid) return [];
      const q = query(
        collection(db, "users", userData.uid, "links"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    enabled: !!userData?.uid,
    retry: 1,
  });

  // 클릭 카운트 증가 함수
  const handleLinkClick = async (linkId) => {
    if (!userData?.uid) return;
    try {
      const linkRef = doc(db, "users", userData.uid, "links", linkId);
      await updateDoc(linkRef, {
        clicks: increment(1)
      });
    } catch (error) {
      console.error("클릭 카운트 저장 오류:", error);
    }
  };

  // 사용자를 찾을 수 없는 경우
  if (!isUserLoading && (isUserError || (displayName && !userData))) {
    notFound();
  }

  // 초기 로딩 시 사용자가 요청한 로딩 바(Spinner) 표시
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        <p className="text-zinc-500 text-sm font-medium animate-pulse">프로필을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-20 px-4">
      <div className="mx-auto max-w-[500px] flex flex-col items-center gap-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 w-full">
          {isUserLoading ? (
            <>
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-64 mt-2" />
              </div>
            </>
          ) : userData ? (
            <>
              <Avatar className="h-24 w-24 border-2 border-white shadow-sm">
                <AvatarImage src={userData.photoURL} alt={userData.username} />
                <AvatarFallback className="bg-zinc-200 text-zinc-400 text-2xl font-bold">
                  {userData.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {userData.username}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  @{userData.displayName}
                </p>
                {userData.bio && (
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-[300px]">
                    {userData.bio}
                  </p>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {isUserLoading || isLinksLoading ? (
            // 링크 로딩 중 Skeleton UI
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-zinc-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 flex-1" />
                </CardContent>
              </Card>
            ))
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
              등록된 링크가 없습니다.
            </div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="block w-full transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Card className="overflow-hidden border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Favicon src={link.faviconUrl} alt={link.title} />
                    <span className="flex-1 font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {link.title}
                    </span>
                  </CardContent>
                </Card>
              </a>
            ))
          )}
        </div>

        {/* Footer (Branding) */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-xs font-semibold text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800">
            <LinkIcon className="h-3 w-3" />
            <span>Powered by MyLink</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
