import Image from "next/image";
import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
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

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {dummyLinks.map((link) => (
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
