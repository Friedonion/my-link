import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { BASE_URL, APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${APP_NAME} | 모든 링크를 하나로`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: ["마이링크", "링크트리", "멀티링크", "프로필링크", "소셜미디어", "콘텐츠크리에이터"],
  authors: [{ name: "Friedonion" }],
  creator: "Friedonion",
  publisher: "Friedonion",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: APP_NAME,
    title: `${APP_NAME} | 모든 링크를 하나로`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | 모든 링크를 하나로`,
    description: APP_DESCRIPTION,
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
