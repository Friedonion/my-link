import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

      <main className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl shadow-black/5 dark:shadow-black/40 transition-all duration-500 hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10">
          
          {/* Avatar container */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl transform group-hover:scale-105 transition-transform duration-500">
              <Image 
                src="/profile_avatar.png"
                alt="Profile Avatar"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, 160px"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">
            강현중
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-medium text-zinc-600 dark:text-zinc-300 mb-6">
            Creative Developer
          </h2>

          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
            안녕하세요! 사용자 경험(UX)과 아름다운 인터랙션에 관심이 많은 개발자 강현중입니다. 
            새롭게 단장한 프로필 페이지에 오신 것을 환영합니다.
          </p>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3.5 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              GitHub
            </a>
            
            <a
              href="mailto:rkdwnd333@gmail.com"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm text-foreground px-8 py-3.5 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:-translate-y-1 transition-all duration-300 active:translate-y-0 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email Me
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
