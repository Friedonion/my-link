export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground font-sans">
      <main className="flex flex-col items-center gap-6 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          강현중
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            안녕하세요 강현중입니다!
          </p>
          <p className="text-zinc-500 dark:text-zinc-500">
            rkdwnd333@gmail.com
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <button className="rounded-full bg-foreground text-background px-6 py-2 font-medium hover:opacity-90 transition-opacity">
            프로필 상세 보기
          </button>
          <a
            href="mailto:rkdwnd333@gmail.com"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-6 py-2 font-medium hover:bg-black/[.04] dark:hover:bg-white/[.06] transition-colors"
          >
            연락하기
          </a>
        </div>
      </main>
    </div>
  );
}
