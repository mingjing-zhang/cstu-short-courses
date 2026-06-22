export default function SiteFooter() {
  return (
    <footer className="border-t hairline mt-20">
      <div className="max-w-5xl mx-auto px-6 py-10 text-sm text-muted">
        <div className="font-display italic text-lg text-ink">CSTU Short Courses</div>
        <p className="mt-2 max-w-md">
          A short-course platform for CSTU — a marketing landing page, an AI
          advisor, full-stack APIs, and an admin back office.
        </p>
        <div className="mt-6 grid gap-1 text-xs">
          <span>
            Frontend &amp; AI integration · built on coursework from{" "}
            <span className="text-ink">CSE642</span>
          </span>
          <span>
            Full-stack &amp; backend APIs · built on coursework from{" "}
            <span className="text-ink">CSE552</span>
          </span>
          <span className="mt-3 text-muted">
            Built by Aaron Zhang · with credit to both course instructors.
          </span>
        </div>
      </div>
    </footer>
  );
}
