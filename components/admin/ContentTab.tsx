"use client";

import { useCallback, useEffect, useState } from "react";

type SessionLite = { n: string; title: string; week: string };
type CourseLite = { id: string; title: string; titleZh: string; sessions: SessionLite[] };
type Links = { online: string; inperson: string };
type Meta = { scheduled: string; recording: string; materials: string };

export default function ContentTab() {
  const [courses, setCourses] = useState<CourseLite[]>([]);
  const [links, setLinks] = useState<Record<string, Links>>({});
  const [meta, setMeta] = useState<Record<string, Meta>>({});
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const d = await fetch("/api/content").then((r) => r.json());
    setCourses(d.courses);
    setLinks(d.sessionLinks ?? {});
    setMeta(d.sessionMeta ?? {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function flash(key: string) {
    setSavedKey(key);
    setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
  }

  async function saveLinks(courseId: string) {
    const l = links[courseId] ?? { online: "", inperson: "" };
    await fetch("/api/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "links", courseId, online: l.online, inperson: l.inperson }),
    });
    flash(`links:${courseId}`);
  }

  async function saveMeta(key: string) {
    const m = meta[key] ?? { scheduled: "", recording: "", materials: "" };
    await fetch("/api/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "meta",
        key,
        scheduled: m.scheduled,
        recording: m.recording,
        materials: m.materials,
      }),
    });
    flash(`meta:${key}`);
  }

  if (loading) return <div className="text-muted text-sm py-10">Loading…</div>;

  return (
    <>
      <h2 className="font-display text-3xl">Course content</h2>

      {/* Live session links */}
      <h3 className="text-xs uppercase tracking-widest text-muted mt-8">Live session links</h3>
      <div className="mt-4 space-y-3">
        {courses.map((c) => {
          const l = links[c.id] ?? { online: "", inperson: "" };
          return (
            <div key={c.id} className="rounded-2xl border hairline bg-paper-2 p-4">
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-xs text-muted font-mono">{c.id}</div>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <LinkInput
                  label="Online (Zoom)"
                  value={l.online}
                  onChange={(v) => setLinks((s) => ({ ...s, [c.id]: { ...l, online: v } }))}
                />
                <LinkInput
                  label="In-person (location)"
                  value={l.inperson}
                  onChange={(v) => setLinks((s) => ({ ...s, [c.id]: { ...l, inperson: v } }))}
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => saveLinks(c.id)}
                  className="rounded-lg bg-ink text-paper px-4 py-1.5 text-sm hover:bg-accent transition"
                >
                  {savedKey === `links:${c.id}` ? "Saved ✓" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-session meta */}
      {courses.map((c) => (
        <div key={c.id} className="mt-12">
          <h3 className="text-xs uppercase tracking-widest text-muted">
            {c.title} — sessions, recordings & materials
          </h3>
          <div className="mt-4 space-y-3">
            {c.sessions.map((s) => {
              const key = `${c.id}:${s.n}`;
              const m = meta[key] ?? { scheduled: "", recording: "", materials: "" };
              return (
                <div key={key} className="rounded-2xl border hairline bg-paper-2 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-accent">{s.n}</span>
                    <span className="font-display text-lg">{s.title}</span>
                    <span className="text-xs text-muted ml-auto">{s.week}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <Field
                      label="Scheduled (ISO 8601)"
                      value={m.scheduled}
                      placeholder="2026-06-25T02:00:00+00:00"
                      mono
                      onChange={(v) => setMeta((st) => ({ ...st, [key]: { ...m, scheduled: v } }))}
                    />
                    <Field
                      label="Recording URL"
                      value={m.recording}
                      placeholder="https:// (Mux / S3 / YouTube)"
                      onChange={(v) => setMeta((st) => ({ ...st, [key]: { ...m, recording: v } }))}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-muted">
                      Materials — one per line, “Label | https://url”
                      <textarea
                        value={m.materials}
                        onChange={(v) =>
                          setMeta((st) => ({ ...st, [key]: { ...m, materials: v.target.value } }))
                        }
                        rows={2}
                        placeholder="Slides | https://…&#10;Worksheet (PDF) | https://…"
                        className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => saveMeta(key)}
                      className="rounded-lg bg-ink text-paper px-4 py-1.5 text-sm hover:bg-accent transition"
                    >
                      {savedKey === `meta:${key}` ? "Saved ✓" : "Save session"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function LinkInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://zoom.us/j/… or location"
        className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Field({
  label,
  value,
  placeholder,
  mono,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  mono?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent ${
          mono ? "font-mono" : ""
        }`}
      />
    </label>
  );
}
