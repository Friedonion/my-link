"use client";

import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useParams } from "next/navigation";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// 마이페이지에서 사용하던 Favicon 컴포넌트 재사용
const Favicon = ({ src, alt }) => {
  const [error, setError] = React.useState(false);

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

// React import (Favicon에서 사용)
import * as React from "react";

export default function PublicProfilePage() {
  const params = useParams();
  const displayName = params.displayName;

  // 1. displayName으로 uid 찾기
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["public-user", displayName],
    queryFn: async () => {
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
  });

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!userData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-20 px-4">
      <div className="mx-auto max-w-[500px] flex flex-col items-center gap-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 w-full">
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
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {isLinksLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
            </div>
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
