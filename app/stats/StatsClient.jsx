"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, BarChart3, MousePointer2, TrendingUp } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Header } from "@/components/Header";
import { toast } from "sonner";

export const metadata = {
  title: "통계 분석",
  description: "내 링크의 성과를 실시간으로 분석합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "var(--chart-1)",
  },
};

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && !authLoading) {
        router.push("/");
      }
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router, authLoading]);

  // 1. 프로필 데이터 조회
  const { data: profileData } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      return userSnap.data();
    },
    enabled: !!user,
  });

  // 2. 링크 데이터 조회 (클릭 수 기준 내림차순 정렬)
  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["links-stats", user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "users", user.uid, "links"),
        orderBy("clicks", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  if (authLoading || isLinksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!user) return null;

  const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
  
  // 차트 데이터 (상위 5개 또는 10개만 표시하거나 전체 표시)
  const chartData = links.slice(0, 10).map(link => ({
    title: link.title.length > 10 ? link.title.substring(0, 10) + "..." : link.title,
    clicks: link.clicks || 0,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <Header user={user} profileData={profileData} onLogin={handleGoogleLogin} onLogout={handleLogout} />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Section (Internal Title) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">통계 분석</h1>
                <p className="text-sm text-zinc-500">@{profileData?.displayName}님의 링크 성과</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <BarChart3 className="h-8 w-8 text-zinc-300" />
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 클릭 수</CardTitle>
                <MousePointer2 className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-zinc-500 mt-1">모든 링크의 합산 클릭 수입니다.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">등록된 링크</CardTitle>
                <TrendingUp className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{links.length}개</div>
                <p className="text-xs text-zinc-500 mt-1">현재 활성화된 링크 개수입니다.</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader>
                <CardTitle>링크별 클릭 수 (Top 10)</CardTitle>
                <CardDescription>가장 인기가 많은 링크들을 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pt-4">
                {links.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
                      <XAxis 
                        dataKey="title" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent hideLabel />} 
                      />
                      <Bar 
                        dataKey="clicks" 
                        fill="var(--color-clicks)" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                      >
                        <LabelList
                          dataKey="clicks"
                          position="top"
                          offset={10}
                          className="fill-zinc-500 text-[10px]"
                          fontSize={10}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-xl">
                    데이터가 없습니다.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle>상세 목록</CardTitle>
                <CardDescription>인기순으로 정렬된 링크 리스트입니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[400px] overflow-y-auto">
                  {links.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400">등록된 링크가 없습니다.</div>
                  ) : (
                    links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{link.title}</span>
                          <span className="text-xs text-zinc-500 truncate">{link.url}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm font-bold shrink-0">
                          <MousePointer2 className="h-3 w-3" />
                          {link.clicks || 0}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
