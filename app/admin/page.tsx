"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import CustomersTab from "@/components/admin/CustomersTab";
import MessagesTab from "@/components/admin/MessagesTab";
import ContentTab from "@/components/admin/ContentTab";
import VideosTab from "@/components/admin/VideosTab";
import AttendanceTab from "@/components/admin/AttendanceTab";

type Tab = "customers" | "messages" | "content" | "videos" | "attendance";

const TABS: { id: Tab; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "messages", label: "Messages" },
  { id: "content", label: "Content" },
  { id: "videos", label: "Videos" },
  { id: "attendance", label: "Attendance" },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("customers");
  const [composeTo, setComposeTo] = useState<string | null>(null);

  function openMessage(email: string) {
    setComposeTo(email);
    setTab("messages");
  }

  async function signOut() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl">Back office</h1>
          <span className="text-xs uppercase tracking-widest text-accent border hairline rounded px-2 py-1">
            Admin
          </span>
          <button
            onClick={signOut}
            className="ml-auto text-xs text-muted hover:text-ink border hairline rounded px-3 py-1.5 transition"
          >
            Sign out
          </button>
        </div>
        <p className="text-muted text-sm mt-2">
          Back office. Payments are simulated — no card is charged. This sits behind
          staff sign-in (a CSE552 topic) — the demo password is{" "}
          <span className="font-mono text-ink">lovecstu1234</span>.
        </p>

        {/* Tabs */}
        <nav className="mt-8 flex flex-wrap gap-1 border-b hairline">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition ${
                tab === t.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "customers" && <CustomersTab onMessage={openMessage} />}
          {tab === "messages" && (
            <MessagesTab composeTo={composeTo} onComposeHandled={() => setComposeTo(null)} />
          )}
          {tab === "content" && <ContentTab />}
          {tab === "videos" && <VideosTab />}
          {tab === "attendance" && <AttendanceTab />}
        </div>
      </main>
    </>
  );
}
