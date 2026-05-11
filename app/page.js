"use client";

import { useState, useEffect } from "react";
import { Plus, Link as LinkIcon, Loader2, Pencil, Trash2, LogOut, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
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

const LinkItem = ({ link, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(link.id);
      setIsDeleteDialogOpen(false);
      toast.success("링크가 삭제되었습니다.");
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await onUpdate(link.id, data);
      setIsEditing(false);
      toast.success("링크가 성공적으로 수정되었습니다.");
    } catch (error) {
      toast.error("수정 중 오류가 발생했습니다. URL 형식을 확인해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="overflow-hidden border-zinc-200 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div>
              <Input 
                placeholder="제목"
                className={errors.title ? "border-red-500" : ""}
                disabled={isSaving}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm font-medium text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Input 
                placeholder="URL"
                type="url"
                className={errors.url ? "border-red-500" : ""}
                disabled={isSaving}
                {...register("url")}
              />
              {errors.url && (
                <p className="text-sm font-medium text-red-500 mt-1">{errors.url.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                취소
              </Button>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative group block w-full transition-all">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <Card className="overflow-hidden border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm">
          <CardContent className="p-4 pr-12 flex items-center gap-4">
            <Favicon src={link.faviconUrl} alt={link.title} />
            <span className="flex-1 font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {link.title}
            </span>
          </CardContent>
        </Card>
      </a>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black shadow-sm h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Pencil className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black shadow-sm h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-zinc-600 hover:text-red-500 dark:text-zinc-400" />
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="pt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{link.title}</span> 링크를 삭제합니다.
              <br />
              <span className="text-red-500 font-medium mt-2 block">이 작업은 되돌릴 수 없습니다.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Header = ({ user, onLogin, onLogout }) => {
  const handleCopyLink = () => {
    if (!user) return;
    const username = user.email ? user.email.split('@')[0] : "user";
    const link = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("프로필 링크가 복사되었습니다!");
    }).catch(() => {
      toast.error("링크 복사에 실패했습니다.");
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50">
          <LinkIcon className="h-5 w-5" />
          <span>MyLink</span>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:focus:ring-zinc-100">
                <Avatar className="h-9 w-9 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                  <AvatarFallback>{(user.displayName || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || "이름 없음"}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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

const LandingView = ({ onLogin }) => {
  return (
    <div className="mx-auto max-w-3xl flex flex-col items-center justify-center text-center py-20 gap-8 h-full min-h-[60vh]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-900 text-white shadow-xl dark:bg-zinc-100 dark:text-black">
        <LinkIcon className="h-10 w-10" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          마이링크
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 font-medium">
          하나의 링크로 당신의 모든 것을 공유하세요.
        </p>
      </div>
      <div className="mt-4">
        <Button 
          size="lg" 
          className="w-full sm:w-auto rounded-full px-8 py-6 font-semibold shadow-md hover:shadow-lg transition-all text-base bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800"
          onClick={onLogin}
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          구글 계정으로 시작하기
        </Button>
      </div>
    </div>
  );
};

const MyPageView = ({ user }) => {
  const [links, setLinks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Firestore에서 실시간으로 링크 목록 가져오기
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "links"),
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
  }, [user]);

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

  const handleUpdateLink = async (id, updatedData) => {
    try {
      const urlObj = new URL(updatedData.url);
      const domain = urlObj.hostname;
      
      let faviconUrl = `https://www.google.com/s2/favicons?domain=${updatedData.url}&sz=64`;

      if (domain === "blog.naver.com" || domain.endsWith(".blog.me")) {
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          const blogId = pathSegments[0];
          faviconUrl = `https://blog.naver.com/favicon.ico?blogId=${blogId}`;
        }
      }

      const linkRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(linkRef, {
        title: updatedData.title,
        url: updatedData.url,
        faviconUrl,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating link: ", error);
      throw error;
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      const linkRef = doc(db, "users", user.uid, "links", id);
      await deleteDoc(linkRef);
    } catch (error) {
      console.error("Error deleting link: ", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const urlObj = new URL(data.url);
      const domain = urlObj.hostname;
      
      let faviconUrl = `https://www.google.com/s2/favicons?domain=${data.url}&sz=64`;

      if (domain === "blog.naver.com" || domain.endsWith(".blog.me")) {
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          const blogId = pathSegments[0];
          faviconUrl = `https://blog.naver.com/favicon.ico?blogId=${blogId}`;
        }
      }

      await addDoc(collection(db, "users", user.uid, "links"), {
        title: data.title,
        url: data.url,
        faviconUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      handleOpenChange(false);
      toast.success("링크가 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("Error adding link: ", error);
      toast.error("링크 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const username = user?.email ? user.email.split('@')[0] : "user";
  const profileName = user?.displayName || "이름 없음";

  return (
    <div className="mx-auto max-w-[500px] flex flex-col items-center gap-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 rounded-full bg-zinc-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-zinc-400 font-bold text-2xl">{profileName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profileName}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            @{username}
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
            <LinkItem key={link.id} link={link} onUpdate={handleUpdateLink} onDelete={handleDeleteLink} />
          ))
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      toast.success("성공적으로 로그인되었습니다.");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <Header user={user} onLogin={handleGoogleLogin} onLogout={handleLogout} />
      <main className="flex-1 py-12 px-4">
        {user ? <MyPageView user={user} /> : <LandingView onLogin={handleGoogleLogin} />}
      </main>
    </div>
  );
}
