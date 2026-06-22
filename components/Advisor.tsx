"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  pitch: string;
  source: "claude" | "rules";
  course: { id: string; title: string; titleZh: string; price: number; weeks: number };
};

const EXAMPLES = [
  "I'm a designer who wants to start a solo business with AI",
  "我想用 AI 做营销，但预算很少",
  "完全是新手，想先了解 AI 能干什么",
  "I manage a 30-person team and need an AI strategy",
];

export default function Advisor() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    const value = text.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ goal: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border hairline bg-paper-2 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-accent" />
        AI Course Advisor
      </div>
      <h3 className="font-display text-2xl mt-2">
        Not sure where to start? Describe your goal.
      </h3>
      <p className="text-muted text-sm mt-1">
        Tell us what you want to do — in any language — and we&apos;ll recommend the right course.
      </p>

      <div className="mt-4">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
          placeholder="e.g. I want to launch a one-person product using AI…"
          className="w-full rounded-xl border hairline bg-paper px-4 py-3 text-sm outline-none focus:border-accent resize-none"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setGoal(ex);
                ask(ex);
              }}
              className="text-xs rounded-full border hairline px-3 py-1.5 text-muted hover:border-accent hover:text-ink transition"
            >
              {ex}
            </button>
          ))}
        </div>
        <button
          onClick={() => ask(goal)}
          disabled={loading || !goal.trim()}
          className="mt-4 w-full rounded-xl bg-ink text-paper py-3 text-sm font-medium disabled:opacity-40 hover:bg-accent transition"
        >
          {loading ? "Thinking…" : "Recommend a course →"}
        </button>
      </div>

      {error && <p className="text-accent text-sm mt-4">{error}</p>}

      {result && (
        <div className="mt-5 rounded-xl border hairline bg-paper p-5">
          <div className="text-xs uppercase tracking-widest text-muted">
            Recommended for you
          </div>
          <div className="font-display text-xl mt-1">{result.course.title}</div>
          <div className="text-muted text-sm">{result.course.titleZh}</div>
          <p className="mt-3 text-sm leading-relaxed">{result.pitch}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/c/${result.course.id}`}
                className="rounded-lg bg-accent text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                View course →
              </Link>
              <Link
                href={`/enroll?course=${result.course.id}`}
                className="text-sm text-muted hover:text-ink transition"
              >
                Enroll · ${result.course.price}
              </Link>
            </div>
            <span className="text-[11px] text-muted">
              {result.source === "claude" ? "✦ Personalized by Claude" : "✦ Sample recommendation"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
