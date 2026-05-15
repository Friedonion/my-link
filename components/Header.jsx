"use client";

import Link from "next/link";
import { Link as LinkIcon, LogOut, Copy, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Header = ({ user, profileData, onLogin, onLogout }) => {
  const handleCopyLink = () => {
    if (!user || !profileData) return;
    const displayName = profileData.displayName;
    const link = `${window.location.origin}/${displayName}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("프로필 링크가 복사되었습니다!");
    }).catch(() => {
      toast.error("링크 복사에 실패했습니다.");
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity">
          <LinkIcon className="h-5 w-5" />
          <span>MyLink</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {profileData && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-9 px-3 sm:px-4"
                  nativeButton={false}
                  render={<Link href={`/${profileData.displayName}`} className="flex items-center gap-2" />}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">내 페이지</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-zinc-100">
                  <Avatar className="h-9 w-9 hover:opacity-80 transition-opacity cursor-pointer">
                    <AvatarImage src={profileData?.photoURL || user.photoURL} alt={profileData?.username || user.displayName || "User"} />
                    <AvatarFallback>{(profileData?.username || user.displayName || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profileData?.username || user.displayName || "이름 없음"}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/${profileData?.displayName}`} className="cursor-pointer flex items-center" />}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>내 페이지 보기</span>
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/stats" className="cursor-pointer flex items-center" />}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>통계 보기</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" />
                  <span>내 링크 복사</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
          ) : (
            <Button variant="outline" size="sm" onClick={onLogin}>
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
