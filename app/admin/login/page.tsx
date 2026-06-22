"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError("Wrong password — try again.");
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <div className="rounded-2xl border hairline bg-paper-2 p-8">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl">Staff sign-in</h1>
          <span className="text-xs uppercase tracking-widest text-accent border hairline rounded px-2 py-1">
            Admin
          </span>
        </div>
        <p className="text-muted text-sm mt-3">
          The back office is staff-only. Enter the staff password to manage enrollments,
          messages, content, videos, and attendance.
        </p>
        <form onSubmit={submit} className="mt-6">
          <label className="block text-sm">
            Staff password
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </label>
          {error && <p className="text-accent text-sm mt-3">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-5 w-full rounded-xl bg-ink text-paper py-3 text-sm font-medium hover:bg-accent transition disabled:opacity-40"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
