import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "MY-link | 모든 링크를 하나로",
    template: "%s | MY-link"
  },
  description: "인스타그램, 유튜브, 블로그까지. 나만의 모든 링크를 한 페이지에 담고 실시간 통계까지 확인하세요.",
  keywords: ["마이링크", "링크트리", "멀티링크", "프로필링크", "소셜미디어", "콘텐츠크리에이터"],
  authors: [{ name: "Friedonion" }],
  creator: "Friedonion",
  publisher: "Friedonion",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "MY-link",
    title: "MY-link | 모든 링크를 하나로",
    description: "나만의 모든 링크를 한 페이지에 담고 실시간 통계까지 확인하세요.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MY-link",
        type: "image/png",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MY-link | 모든 링크를 하나로",
    description: "나만의 모든 링크를 한 페이지에 담고 실시간 통계까지 확인하세요.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Bfcache 무한 로딩 방지를 위한 강제 새로고침 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('pageshow', function(event) {
                  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                    window.location.reload();
                  }
                });
              })();
            `,
          }}
        />
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
