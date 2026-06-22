import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b hairline">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="inline-flex flex-col leading-none">
          <span className="font-display italic text-2xl">Catalyst</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted mt-1">
            Short AI Courses
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#courses" className="text-muted hover:text-ink transition">
            Courses
          </Link>
          <Link href="/#advisor" className="text-muted hover:text-ink transition">
            AI Advisor
          </Link>
          <Link href="/videos" className="text-muted hover:text-ink transition">
            Videos
          </Link>
          <Link href="/share" className="text-muted hover:text-ink transition">
            Refer &amp; earn
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border hairline px-3 py-1.5 hover:border-accent transition"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
