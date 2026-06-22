"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type LightCourse = {
  id: string;
  title: string;
  titleZh: string;
  price: number;
  priceInPerson: number;
  faculty: string;
};

type RefStats = {
  code: string;
  enrolled: number;
  revenue: number;
  commission: number;
  paidOut: boolean;
  students: { name: string; course: string; amount: number; date: string }[];
};

function codeFromEmail(email: string): string {
  let h = 0;
  const s = email.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6).padStart(6, "0");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function ShareTool({
  courses,
  initialCourse,
}: {
  courses: LightCourse[];
  initialCourse: string;
}) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState(initialCourse);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<RefStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = code ? `${origin}/?r=${code}` : "";

  const loadStats = useCallback(async (c: string) => {
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/referrals?code=${encodeURIComponent(c)}`);
      const data = await res.json();
      if (res.ok) setStats(data);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (code) loadStats(code);
  }, [code, loadStats]);

  function generateCode() {
    if (!email.trim()) return;
    setCode(codeFromEmail(email));
    setPosterUrl(null);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function drawPoster() {
    const canvas = canvasRef.current;
    if (!canvas || !code) return;
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const paper = "#faf7f0";
    const ink = "#1c1a17";
    const muted = "#6b6356";
    const accent = "#b4471f";
    const serif = 'Georgia, "Times New Roman", serif';
    const sans = "system-ui, -apple-system, sans-serif";
    const mono = "ui-monospace, Menlo, monospace";

    // background
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    // inner border
    ctx.strokeStyle = "#e3dccd";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    const M = 96;

    // top kicker
    ctx.fillStyle = accent;
    ctx.font = `600 26px ${sans}`;
    ctx.fillText("CSTU × BAYAI CIRCLE", M, 150);
    ctx.fillStyle = muted;
    ctx.font = `26px ${sans}`;
    ctx.textAlign = "right";
    ctx.fillText("VOL · COHORT 2026", W - M, 150);
    ctx.textAlign = "left";

    // title
    ctx.fillStyle = ink;
    ctx.font = `700 86px ${serif}`;
    const titleLines = wrapText(ctx, course.title, W - M * 2);
    let y = 320;
    for (const l of titleLines) {
      ctx.fillText(l, M, y);
      y += 100;
    }

    // zh subtitle
    ctx.fillStyle = muted;
    ctx.font = `40px ${serif}`;
    ctx.fillText(course.titleZh, M, y + 6);
    y += 70;

    // faculty
    ctx.fillStyle = muted;
    ctx.font = `30px ${sans}`;
    ctx.fillText(`Taught by ${course.faculty}`, M, y + 30);

    // divider
    ctx.strokeStyle = "#e3dccd";
    ctx.beginPath();
    ctx.moveTo(M, 820);
    ctx.lineTo(W - M, 820);
    ctx.stroke();

    // price
    ctx.fillStyle = ink;
    ctx.font = `700 80px ${serif}`;
    ctx.fillText(`$${course.price}`, M, 930);
    const pw = ctx.measureText(`$${course.price}`).width;
    ctx.fillStyle = muted;
    ctx.font = `34px ${sans}`;
    ctx.fillText(`online / $${course.priceInPerson} in-person`, M + pw + 24, 930);

    // referral pill
    const pillY = 1000;
    const pillH = 96;
    ctx.fillStyle = accent;
    const pillW = W - M * 2;
    const r = 20;
    ctx.beginPath();
    ctx.moveTo(M + r, pillY);
    ctx.arcTo(M + pillW, pillY, M + pillW, pillY + pillH, r);
    ctx.arcTo(M + pillW, pillY + pillH, M, pillY + pillH, r);
    ctx.arcTo(M, pillY + pillH, M, pillY, r);
    ctx.arcTo(M, pillY, M + pillW, pillY, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = paper;
    ctx.font = `600 42px ${sans}`;
    ctx.textAlign = "center";
    ctx.fillText(`10% OFF · 邀请码 ${code.toUpperCase()}`, W / 2, pillY + 62);
    ctx.textAlign = "left";

    // QR code (bottom-right) — scan to open the referral link
    const qrSize = 210;
    const qrX = W - M - qrSize;
    const qrY = 1135;
    try {
      const qrUrl = await QRCode.toDataURL(link, {
        margin: 1,
        width: qrSize * 2,
        color: { dark: ink, light: paper },
      });
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => reject(new Error("qr load failed"));
        qrImg.src = qrUrl;
      });
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = muted;
      ctx.font = `26px ${sans}`;
      ctx.textAlign = "center";
      ctx.fillText("扫码报名 · scan to enroll", qrX + qrSize / 2, qrY + qrSize + 34);
      ctx.textAlign = "left";
    } catch {
      // QR is a nice-to-have; poster still renders without it
    }

    // link (left of the QR)
    ctx.fillStyle = ink;
    ctx.font = `30px ${mono}`;
    const linkText = link.replace(/^https?:\/\//, "");
    ctx.fillText(linkText, M, 1180);

    // footer brand
    ctx.fillStyle = muted;
    ctx.font = `italic 32px ${serif}`;
    ctx.fillText("CSTU Short Courses", M, 1240);

    setPosterUrl(canvas.toDataURL("image/png"));
  }

  function downloadPoster() {
    if (!posterUrl) return;
    const a = document.createElement("a");
    a.href = posterUrl;
    a.download = `cstu-short-courses-${course.id}-${code}.png`;
    a.click();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-10">
      {/* Controls */}
      <div className="rounded-2xl border hairline bg-paper-2 p-6">
        <label className="block text-sm">
          Course to share
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setPosterUrl(null);
            }}
            className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — ${c.price}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm mt-5">
          Your email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>

        <button
          onClick={generateCode}
          disabled={!email.trim()}
          className="mt-5 w-full rounded-xl bg-ink text-paper py-3 text-sm font-medium disabled:opacity-40 hover:bg-accent transition"
        >
          Get my referral link
        </button>

        {code && (
          <div className="mt-6 rounded-xl border hairline bg-paper p-4">
            <div className="text-xs uppercase tracking-widest text-muted">
              Your link · code {code.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                readOnly
                value={link}
                className="flex-1 rounded-lg border hairline bg-paper-2 px-3 py-2 text-sm font-mono"
              />
              <button
                onClick={copyLink}
                className="rounded-lg bg-ink text-paper px-3 py-2 text-sm hover:bg-accent transition"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={drawPoster}
                className="rounded-xl bg-accent text-paper px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Generate poster
              </button>
              {posterUrl && (
                <button
                  onClick={downloadPoster}
                  className="rounded-xl border hairline px-4 py-2.5 text-sm font-medium hover:border-accent transition"
                >
                  Download PNG
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live earnings dashboard — ties referral to the back-office billing */}
        {code && (
          <div className="mt-5 rounded-xl border hairline bg-ink text-paper p-5 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-paper/60">
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                Your earnings · live
              </div>
              <button
                onClick={() => code && loadStats(code)}
                className="text-xs text-paper/60 hover:text-paper transition"
              >
                {loadingStats ? "…" : "↻ refresh"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <Metric label="Enrolled" value={stats ? `${stats.enrolled}` : "—"} />
              <Metric
                label="Revenue driven"
                value={stats ? `$${stats.revenue.toFixed(0)}` : "—"}
              />
              <Metric
                label="You earn (10%)"
                value={stats ? `$${stats.commission.toFixed(2)}` : "—"}
                accent
              />
            </div>

            {stats && stats.enrolled > 0 ? (
              <>
                <div className="mt-4 space-y-1.5">
                  {stats.students.slice(0, 4).map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs text-paper/70 border-t border-paper/10 pt-1.5"
                    >
                      <span className="truncate">
                        {s.name === "—" ? "A friend" : s.name} · {s.course}
                      </span>
                      <span className="text-accent shrink-0 ml-2">
                        +${(s.amount * 0.1).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-paper/50 mt-3">
                  {stats.paidOut
                    ? "Commission settled in the admin. ✓"
                    : "Commission accrues here; payouts are settled in the back office."}
                </p>
              </>
            ) : (
              <p className="text-xs text-paper/50 mt-4">
                No enrollments yet. Share your link or poster — every paid signup
                gives your friend 10% off and earns you 10% back.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Poster preview */}
      <div className="rounded-2xl border hairline bg-paper-2 p-6 flex items-center justify-center min-h-[420px]">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="Referral poster"
            className="max-h-[560px] w-auto rounded-lg shadow-lg border hairline"
          />
        ) : (
          <div className="text-center text-muted text-sm">
            <div className="font-display text-2xl text-ink">Poster preview</div>
            <p className="mt-2">
              Enter your email, get a link, then click <em>Generate poster</em>.
            </p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-paper/5 border border-paper/10 px-3 py-3">
      <div className="text-[10px] uppercase tracking-widest text-paper/50">
        {label}
      </div>
      <div
        className={`font-display text-2xl mt-0.5 ${accent ? "text-accent" : "text-paper"}`}
      >
        {value}
      </div>
    </div>
  );
}
