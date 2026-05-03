"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [links, setLinks] = useState(dummyLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      reset(); // Reset form state when dialog closes
    }
  };

  const onSubmit = (data) => {
    let parsedDomain = "";
    // Zod already validated it as a valid URL, so this parsing is safe
    try {
      const urlObj = new URL(data.url);
      parsedDomain = urlObj.hostname;
    } catch (error) {
      parsedDomain = data.url;
    }

    const newLink = {
      id: Date.now().toString(),
      title: data.title,
      url: data.url,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${parsedDomain}&sz=64`,
      createdAt: new Date().toISOString(),
    };

    setLinks((prev) => [newLink, ...prev]);
    handleOpenChange(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 dark:bg-black">
      <div className="mx-auto max-w-[500px] flex flex-col items-center gap-8">
        {/* Profile Section (Placeholder) */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-zinc-200 overflow-hidden">
            {/* <Image src="/profile.png" alt="Profile" width={96} height={96} /> */}
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">@username</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-center">
            My personal links and social media.
          </p>
        </div>

        {/* Add Link Section */}
        <div className="w-full">
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-full" size="lg">
                <Plus className="mr-2 h-5 w-5" /> 링크 추가
              </Button>
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
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                    취소
                  </Button>
                  <Button type="submit">추가하기</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Card className="overflow-hidden border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700">
                <CardContent className="p-4 flex items-center gap-4">
                  {link.faviconUrl && (
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-white p-1">
                      <img
                        src={link.faviconUrl}
                        alt={`${link.title} icon`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">
                    {link.title}
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
