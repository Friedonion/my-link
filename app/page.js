"use client";

import { useState, useEffect } from "react";
import { Plus, Link as LinkIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const linkSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  url: z.string().min(1, "URL을 입력해주세요.").url("유효한 URL 형식이 아닙니다."),
});

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

export default function Home() {
  const [links, setLinks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Firestore에서 실시간으로 링크 목록 가져오기
  useEffect(() => {
    const q = query(
      collection(db, "users", "anonymous", "links"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const linksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLinks(linksData);
      setIsInitialLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const handleOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const urlObj = new URL(data.url);
      const domain = urlObj.hostname;
      
      // 기본 구글 파비콘 API (전체 URL을 사용하면 더 정확할 수 있음)
      let faviconUrl = `https://www.google.com/s2/favicons?domain=${data.url}&sz=64`;

      // 네이버 블로그 전용 파비콘 처리 보강
      if (domain === "blog.naver.com" || domain.endsWith(".blog.me")) {
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          const blogId = pathSegments[0];
          faviconUrl = `https://blog.naver.com/favicon.ico?blogId=${blogId}`;
        }
      }

      await addDoc(collection(db, "users", "anonymous", "links"), {
        title: data.title,
        url: data.url,
        faviconUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      handleOpenChange(false);
    } catch (error) {
      console.error("Error adding link: ", error);
      alert("링크 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 dark:bg-black">
      <div className="mx-auto max-w-[500px] flex flex-col items-center gap-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-zinc-200 overflow-hidden border-2 border-white shadow-sm">
            {/* <Image src="/profile.png" alt="Profile" width={96} height={96} /> */}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">@anonymous</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              My personal links and social media.
            </p>
          </div>
        </div>

        {/* Add Link Section */}
        <div className="w-full">
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button className="w-full rounded-full shadow-md hover:shadow-lg transition-all" size="lg" />}>
              <Plus className="mr-2 h-5 w-5" /> 링크 추가
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>새로운 링크 추가</DialogTitle>
                  <DialogDescription>
                    공유할 링크의 제목과 URL을 입력해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="title" className="text-right mt-3">
                      제목
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="title"
                        placeholder="예: 내 블로그"
                        className={errors.title ? "border-red-500" : ""}
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-sm font-medium text-red-500 mt-1">{errors.title.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="url" className="text-right mt-3">
                      URL
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        className={errors.url ? "border-red-500" : ""}
                        {...register("url")}
                      />
                      {errors.url && (
                        <p className="text-sm font-medium text-red-500 mt-1">{errors.url.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                    취소
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "추가 중..." : "추가하기"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
              <Loader2 className="h-10 w-10 animate-spin text-zinc-300" />
              <p className="text-sm font-medium">링크를 불러오는 중입니다...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
              아직 등록된 링크가 없습니다.
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
                    <span className="flex-1 font-semibold text-zinc-900 dark:text-zinc-100">
                      {link.title}
                    </span>
                  </CardContent>
                </Card>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
