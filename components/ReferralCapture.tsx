"use client";

import { useEffect, useState } from "react";

export default function ReferralCapture() {
  const [code, setCode] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("r");
    if (fromUrl) {
      localStorage.setItem("referredBy", fromUrl);
    }
    setCode(localStorage.getItem("referredBy"));
  }, []);

  if (!code || dismissed) return null;

  return (
    <div className="bg-ink text-paper text-sm">
      <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
        <span>
          🎟️ 已享 10% 折扣 —— 由 <span className="font-mono">{code}</span> 推荐
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="opacity-60 hover:opacity-100"
          aria-label="dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
