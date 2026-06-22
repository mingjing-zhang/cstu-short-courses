"use client";

import { useCallback, useEffect, useState } from "react";

type Video = {
  id: string;
  youtube: string;
  title: string;
  source: string;
  sort: number;
  hidden: boolean;
};

function ytId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export default function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtube, setYoutube] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("0");

  const load = useCallback(async () => {
    const d = await fetch("/api/videos").then((r) => r.json());
    setVideos(d.videos);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!youtube.trim() || !title.trim()) return;
    await fetch("/api/videos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "add",
        youtube: youtube.trim(),
        title: title.trim(),
        source: source.trim(),
        sort: Number(sort) || 0,
      }),
    });
    setYoutube("");
    setTitle("");
    setSource("");
    setSort("0");
    load();
  }

  async function update(id: string, patch: Partial<Omit<Video, "id">>) {
    await fetch("/api/videos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "update", id, patch }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/videos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    load();
  }

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl">Videos</h2>
        <span className="text-xs text-muted">{videos.length} total</span>
      </div>
      <p className="text-muted text-sm mt-2">
        Promotional / intro videos shown on the public <code className="text-xs">/videos</code>{" "}
        page (视频精选) — not the paid lesson recordings. Paste a YouTube link, give it a title,
        and it appears for everyone. Lower <em>sort</em> shows first; hide a video without
        deleting it with <em>Hide</em>.
      </p>

      {/* Add form */}
      <div className="mt-6 rounded-2xl border hairline bg-paper-2 p-5">
        <label className="block text-xs text-muted">
          YouTube link or id
          <input
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="block text-xs text-muted mt-4">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="想进入 AI 时代却不知道如何开始？"
            className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <label className="block text-xs text-muted">
            Source (optional)
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="安心学堂 Anzzin × BayAI Circle"
              className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="block text-xs text-muted">
            Sort (lower = first)
            <input
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>
        <button
          onClick={add}
          disabled={!youtube.trim() || !title.trim()}
          className="mt-4 w-full rounded-xl bg-ink text-paper py-3 text-sm font-medium hover:bg-accent transition disabled:opacity-40"
        >
          Add video
        </button>
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-muted text-sm py-6">Loading…</div>
        ) : videos.length === 0 ? (
          <div className="text-muted text-sm py-6">No videos yet.</div>
        ) : (
          videos.map((v) => <VideoRow key={v.id} v={v} onUpdate={update} onRemove={remove} />)
        )}
      </div>
    </>
  );
}

function VideoRow({
  v,
  onUpdate,
  onRemove,
}: {
  v: Video;
  onUpdate: (id: string, patch: Partial<Omit<Video, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState(v.title);
  const [source, setSource] = useState(v.source);
  const [sort, setSort] = useState(String(v.sort));
  const id = ytId(v.youtube);
  const thumb = id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  const dirty = title !== v.title || source !== v.source || Number(sort) !== v.sort;

  return (
    <div className={`rounded-2xl border hairline bg-paper-2 p-4 ${v.hidden ? "opacity-50" : ""}`}>
      <div className="flex gap-4">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-28 h-16 object-cover rounded-lg border hairline" />
        ) : (
          <div className="w-28 h-16 rounded-lg border hairline bg-paper grid place-items-center text-[10px] text-muted">
            no preview
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-accent font-medium">
              {v.hidden ? "hidden" : "live"} · sort {v.sort}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(v.id, { hidden: !v.hidden })}
                className="rounded-lg border hairline px-3 py-1 text-xs hover:border-accent transition"
              >
                {v.hidden ? "Show" : "Hide"}
              </button>
              <button
                onClick={() => onRemove(v.id)}
                className="rounded-lg border hairline px-3 py-1 text-xs hover:border-accent transition"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="text-xs text-muted mt-1 font-mono truncate">{v.youtube}</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mt-3">
        <label className="block text-xs text-muted">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="block text-xs text-muted">
          Sort
          <input
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-24 rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>
      <label className="block text-xs text-muted mt-3">
        Source
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </label>
      {dirty && (
        <button
          onClick={() => onUpdate(v.id, { title, source, sort: Number(sort) || 0 })}
          className="mt-3 w-full rounded-xl bg-ink text-paper py-2.5 text-sm hover:bg-accent transition"
        >
          Save
        </button>
      )}
    </div>
  );
}
