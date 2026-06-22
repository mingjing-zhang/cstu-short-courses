"use client";

import { useCallback, useEffect, useState } from "react";

type Contact = { wechat?: string; phone?: string };

type Row = {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  listPrice: number;
  discount: number;
  amount: number;
  referredBy: string | null;
  status: "paid" | "refunded";
  createdAt: string;
  contact: Contact | null;
};

type Referrer = {
  code: string;
  enrolled: number;
  revenue: number;
  commission: number;
  paidOut: boolean;
};

type Stats = {
  enrollments: number;
  refunded: number;
  revenue: number;
  discounts: number;
  commission: number;
  commissionOwed: number;
  byCourse: { title: string; count: number; revenue: number }[];
};

export default function CustomersTab({ onMessage }: { onMessage: (email: string) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [affiliates, setAffiliates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const d = await fetch("/api/customers").then((r) => r.json());
    setRows(d.rows);
    setStats(d.stats);
    setReferrers(d.referrers);
    setAffiliates(d.affiliates ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: "paid" | "refunded") {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "setStatus", id, status }),
    });
    load();
  }

  async function togglePayout(code: string, paidOut: boolean) {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "setPayout", code, paidOut }),
    });
    load();
  }

  const filtered = rows.filter(
    (r) =>
      !q ||
      r.email.toLowerCase().includes(q.toLowerCase()) ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      {/* Billing stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Paid enrollments" value={stats ? `${stats.enrollments}` : "—"} />
        <Stat label="Net revenue" value={stats ? `$${stats.revenue.toFixed(2)}` : "—"} />
        <Stat label="Discounts given" value={stats ? `$${stats.discounts.toFixed(2)}` : "—"} />
        <Stat
          label="Commission owed"
          value={stats ? `$${stats.commissionOwed.toFixed(2)}` : "—"}
          accent
        />
      </div>

      {/* Referral payout sheet */}
      <h2 className="font-display text-2xl mt-12">Referral payouts</h2>
      <p className="text-muted text-sm mt-1">
        Each code earns 10% of the revenue it drives. Mark a payout once you&apos;ve settled it.
      </p>
      <div className="mt-4 rounded-2xl border hairline overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs uppercase tracking-widest text-muted bg-paper-2 border-b hairline">
          <div className="col-span-3">Code</div>
          <div className="col-span-2 text-right">Enrolled</div>
          <div className="col-span-3 text-right">Revenue driven</div>
          <div className="col-span-2 text-right">Commission</div>
          <div className="col-span-2 text-right">Payout</div>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-muted text-sm">Loading…</div>
        ) : referrers.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted text-sm">
            No referred enrollments yet.
          </div>
        ) : (
          referrers.map((r) => (
            <div
              key={r.code}
              className="grid grid-cols-12 gap-2 px-5 py-4 border-b hairline last:border-0 items-center text-sm"
            >
              <div className="col-span-3 font-mono text-xs">{r.code}</div>
              <div className="col-span-2 text-right">{r.enrolled}</div>
              <div className="col-span-3 text-right">${r.revenue.toFixed(2)}</div>
              <div className="col-span-2 text-right font-medium text-accent">
                ${r.commission.toFixed(2)}
              </div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => togglePayout(r.code, !r.paidOut)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    r.paidOut
                      ? "bg-accent-soft text-accent"
                      : "bg-ink text-paper hover:bg-accent"
                  }`}
                >
                  {r.paidOut ? "Paid ✓" : "Mark paid"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customers */}
      <div className="flex items-center justify-between mt-12">
        <h2 className="font-display text-2xl">Customers</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search email / name / course…"
          className="w-full sm:w-72 rounded-xl border hairline bg-paper-2 px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="mt-4 rounded-2xl border hairline overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs uppercase tracking-widest text-muted bg-paper-2 border-b hairline">
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-1 text-right">Paid</div>
          <div className="col-span-2">Referred by</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-muted text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted text-sm">
            No enrollments yet. Go enroll in a course and it&apos;ll show up here.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className={`grid grid-cols-12 gap-2 px-5 py-4 border-b hairline last:border-0 items-center text-sm ${
                r.status === "refunded" ? "opacity-50" : ""
              }`}
            >
              <div className="col-span-3">
                <div className="font-medium flex items-center gap-2">
                  {r.name}
                  {affiliates.includes(r.email) && (
                    <span className="text-[10px] uppercase tracking-wider bg-accent text-paper rounded px-1.5 py-0.5">
                      affiliate
                    </span>
                  )}
                </div>
                <div className="text-muted text-xs">{r.email}</div>
              </div>
              <div className="col-span-2 text-xs text-muted">
                {r.contact?.wechat && <div>微信 {r.contact.wechat}</div>}
                {r.contact?.phone && <div className="font-mono">{r.contact.phone}</div>}
                {!r.contact?.wechat && !r.contact?.phone && <span>—</span>}
              </div>
              <div className="col-span-2 text-muted">{r.courseTitle}</div>
              <div className="col-span-1 text-right">
                <div className="font-medium">${r.amount.toFixed(2)}</div>
                {r.discount > 0 && (
                  <div className="text-accent text-[11px]">−${r.discount.toFixed(2)}</div>
                )}
              </div>
              <div className="col-span-2">
                {r.referredBy ? (
                  <span className="font-mono text-xs bg-accent-soft text-accent rounded px-2 py-1">
                    {r.referredBy}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
              <div className="col-span-2 text-right flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onMessage(r.email)}
                  className="rounded-lg border hairline px-2.5 py-1 text-xs hover:border-accent transition"
                >
                  Message
                </button>
                <button
                  onClick={() => setStatus(r.id, r.status === "paid" ? "refunded" : "paid")}
                  className="rounded-lg border hairline px-2.5 py-1 text-xs hover:border-accent transition"
                >
                  {r.status === "paid" ? "Refund" : "Restore"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border hairline bg-paper-2 p-5">
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className={`font-display text-2xl mt-1 ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
