import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listVideos } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ytId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export default async function VideosPage() {
  const all = await listVideos();
  const videos = all.filter((v) => !v.hidden);

  return (
    <>
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-accent">视频精选 · Watch</div>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mt-3">
          Start with a short video.
        </h1>
        <p className="text-muted mt-4 text-lg max-w-2xl">
          Free intro talks from our instructors and the BayAI Circle. No sign-up — just press
          play. When you&apos;re ready, the live cohorts are{" "}
          <Link href="/#courses" className="text-accent underline-offset-2 hover:underline">
            over here
          </Link>
          .
        </p>

        {videos.length === 0 ? (
          <div className="mt-12 rounded-2xl border hairline bg-paper-2 p-12 text-center text-muted">
            No videos published yet. Check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8 mt-12">
            {videos.map((v) => {
              const id = ytId(v.youtube);
              return (
                <article key={v.id} className="rounded-2xl border hairline overflow-hidden bg-paper-2">
                  <div className="aspect-video bg-ink">
                    {id ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${id}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-paper/50 text-sm">
                        Invalid video link
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl leading-snug">{v.title}</h2>
                    {v.source && <p className="text-muted text-sm mt-1">{v.source}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
