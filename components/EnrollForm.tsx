"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  courseId: string;
  title: string;
  titleZh: string;
  price: number;
  weeks: number;
};

export default function EnrollForm({ courseId, title, titleZh, price, weeks }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReferredBy(localStorage.getItem("referredBy"));
  }, []);

  const discounted = referredBy ? Math.round(price * 0.9 * 100) / 100 : price;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, courseId, referredBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border hairline bg-paper-2 p-8 text-center">
        <div className="text-4xl">✓</div>
        <h2 className="font-display text-2xl mt-3">You&apos;re enrolled!</h2>
        <p className="text-muted text-sm mt-2">
          A confirmation for <span className="text-ink">{title}</span> is on its
          way to {email}. (Demo: no real email is sent.)
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href="/admin"
            className="rounded-xl bg-ink text-paper px-5 py-2.5 text-sm hover:bg-accent transition"
          >
            See it in the admin →
          </Link>
          <Link
            href="/"
            className="rounded-xl border hairline px-5 py-2.5 text-sm hover:border-accent transition"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl border hairline bg-paper-2 p-6">
        <div className="text-xs uppercase tracking-widest text-muted">Order</div>
        <h2 className="font-display text-2xl mt-1">{title}</h2>
        <p className="text-muted text-sm">{titleZh}</p>
        <p className="text-sm mt-3">{weeks} weeks · live cohort</p>

        <div className="mt-6 border-t hairline pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Tuition</span>
            <span>${price.toFixed(2)}</span>
          </div>
          {referredBy && (
            <div className="flex justify-between text-accent">
              <span>Referral discount (10%)</span>
              <span>−${(price - discounted).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-lg pt-2 border-t hairline">
            <span>Total</span>
            <span>${discounted.toFixed(2)}</span>
          </div>
          {referredBy && (
            <p className="text-xs text-muted">
              Referred by <span className="font-mono">{referredBy}</span>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl border hairline bg-paper p-6">
        <div className="text-xs uppercase tracking-widest text-muted">Checkout</div>
        <label className="block text-sm mt-4">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border hairline bg-paper-2 px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="Jane Doe"
          />
        </label>
        <label className="block text-sm mt-4">
          Email <span className="text-accent">*</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full rounded-xl border hairline bg-paper-2 px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </label>

        {error && <p className="text-accent text-sm mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-accent text-paper py-3 text-sm font-medium disabled:opacity-40 hover:opacity-90 transition"
        >
          {loading ? "Processing…" : `Pay $${discounted.toFixed(2)} (demo)`}
        </button>
        <p className="text-[11px] text-muted mt-3 text-center">
          Demo checkout — no card is charged. In production this is a Stripe
          Checkout session + webhook.
        </p>
      </form>
    </div>
  );
}
