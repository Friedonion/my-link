"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

export default function Home() {
  const [links, setLinks] = useState(dummyLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let parsedDomain = "";
    const urlString = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    
    try {
      const urlObj = new URL(urlString);
      parsedDomain = urlObj.hostname;
    } catch (error) {
      // Fallback if URL parsing fails
      parsedDomain = urlString;
    }

    const newLink = {
      id: Date.now().toString(),
      title: newTitle,
      url: urlString,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${parsedDomain}&sz=64`,
      createdAt: new Date().toISOString(),
    };

    setLinks((prev) => [newLink, ...prev]);
    setIsDialogOpen(false);
    setNewTitle("");
    setNewUrl("");
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-full" size="lg">
                <Plus className="mr-2 h-5 w-5" /> 링크 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddLink}>
                <DialogHeader>
                  <DialogTitle>새로운 링크 추가</DialogTitle>
                  <DialogDescription>
                    공유할 링크의 제목과 URL을 입력해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      제목
                    </Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="예: 내 블로그"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
