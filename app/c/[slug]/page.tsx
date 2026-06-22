import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, getCourse } from "@/lib/courses";
import ReferralCapture from "@/components/ReferralCapture";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.id }));
}

export default async function CourseLanding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <ReferralCapture />

      {/* slim top bar */}
      <div className="border-b hairline">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between text-sm">
          <Link href="/" className="font-display italic text-lg">
            CSTU Short Courses
          </Link>
          <div className="flex items-center gap-5 text-muted">
            <Link href="/#courses" className="hover:text-ink">All cohorts</Link>
            <Link href={`/share?course=${course.id}`} className="hover:text-ink">Refer & earn</Link>
            <Link
              href={`/enroll?course=${course.id}`}
              className="rounded-lg bg-ink text-paper px-3 py-1.5 hover:bg-accent transition"
            >
              Reserve a seat
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Hero */}
        <section className="pt-12 pb-16">
          <div className="flex items-center gap-4 text-xs tracking-[0.18em] uppercase">
            <span className="text-accent">{course.vol}</span>
            <span className="h-px w-12 bg-[var(--color-hairline)]" />
            <span className="text-muted">{course.kicker}</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl leading-[1.02] mt-8 max-w-4xl">
            {course.headline.pre}
            <span className="italic text-accent">{course.headline.accent}</span>
            {course.headline.post}
          </h1>

          <div className="grid md:grid-cols-2 gap-10 mt-12 items-end">
            <p className="text-lg sm:text-xl leading-relaxed text-ink/90">
              {course.blurb}
            </p>
            <div className="md:justify-self-end">
              <div className="font-display text-5xl">
                ${course.price}
                <span className="text-base text-muted font-sans ml-2">
                  online / ${course.priceInPerson} in-person
                </span>
              </div>
              <div className="flex gap-3 mt-5">
                <Link
                  href={`/enroll?course=${course.id}`}
                  className="rounded-xl bg-ink text-paper px-6 py-3.5 text-sm font-medium hover:bg-accent transition"
                >
                  Reserve a seat →
                </Link>
                <a
                  href="#syllabus"
                  className="rounded-xl border hairline px-6 py-3.5 text-sm font-medium hover:border-accent transition"
                >
                  Syllabus
                </a>
              </div>
              <p className="text-xs text-muted mt-4">{course.metaLine}</p>
            </div>
          </div>
        </section>

        {/* Founder note */}
        <section className="py-16 border-t hairline grid md:grid-cols-[200px_1fr] gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-accent">A note</div>
            <div className="text-muted text-sm mt-2">From the founders</div>
            <div className="text-muted text-sm mt-6">{course.startLine}</div>
          </div>
          <div>
            <blockquote className="font-display text-3xl sm:text-4xl leading-snug">
              “{course.founderQuote}”
            </blockquote>
            <div className="mt-8 space-y-4 text-ink/90 leading-relaxed max-w-2xl">
              {course.founderNote.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Syllabus */}
        <section id="syllabus" className="py-16 border-t hairline scroll-mt-6">
          <div className="text-xs uppercase tracking-[0.18em] text-accent">§02 — Syllabus</div>
          <div className="grid md:grid-cols-2 gap-8 mt-4 items-start">
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">
              {course.syllabusTitle.l1}
              <br />
              {course.syllabusTitle.l2}
            </h2>
            <p className="text-ink/80 leading-relaxed">{course.syllabusIntro}</p>
          </div>

          <div className="mt-12">
            {course.sessionList.map((s) => (
              <div
                key={s.n}
                className="grid grid-cols-1 md:grid-cols-[40px_1fr_1.3fr_40px] gap-4 md:gap-8 py-7 border-t hairline"
              >
                <div className="text-accent font-mono text-sm">{s.n}</div>
                <div>
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <div className="text-muted text-sm mt-1">{s.week}</div>
                </div>
                <div>
                  <p className="text-ink/80 leading-relaxed">{s.desc}</p>
                  <p className="text-accent text-sm mt-3">→ {s.deliverable}</p>
                </div>
                <div className="text-muted text-sm md:text-right">{s.hours}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Faculty */}
        <section id="faculty" className="py-16 border-t hairline">
          <div className="text-xs uppercase tracking-[0.18em] text-accent">§03 — Faculty</div>
          <h2 className="font-display text-4xl sm:text-5xl mt-3">
            Taught by operators, not lecturers.
          </h2>

          <div className="mt-10 rounded-2xl bg-ink text-paper overflow-hidden grid sm:grid-cols-[260px_1fr]">
            <div className="aspect-square sm:aspect-auto sm:min-h-[260px] bg-[#0f0d0b] flex items-center justify-center">
              <span className="font-display text-7xl text-accent">
                {course.faculty.initials}
              </span>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">
                {course.faculty.role}
              </div>
              <div className="font-display text-4xl mt-1">{course.faculty.name}</div>
              <div className="text-paper/70 text-sm mt-2">{course.faculty.tagline}</div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 text-accent px-3 py-1.5 text-sm">
                  ⛨ {course.faculty.badge}
                </span>
              </div>
              <p className="text-paper/80 leading-relaxed mt-5 max-w-xl">
                {course.faculty.bio}
              </p>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-16 border-t hairline bg-paper-2 -mx-6 sm:-mx-10 px-6 sm:px-10 rounded-2xl">
          <div className="text-xs uppercase tracking-[0.18em] text-accent">§04 — Why this cohort</div>
          <h2 className="font-display text-4xl sm:text-5xl mt-3 max-w-3xl">
            The course we wish existed when we started.
          </h2>
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {course.why.map((w) => (
              <div key={w.numeral}>
                <div className="text-accent font-display text-xl">{w.numeral}</div>
                <h3 className="font-display text-2xl mt-2">{w.title}</h3>
                <p className="text-ink/80 leading-relaxed mt-3 text-[15px]">{w.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 text-center border-t hairline">
          <h2 className="font-display text-4xl sm:text-5xl">Ready to start?</h2>
          <p className="text-muted mt-3">{course.startLine}</p>
          <div className="flex gap-3 justify-center mt-7">
            <Link
              href={`/enroll?course=${course.id}`}
              className="rounded-xl bg-accent text-paper px-7 py-3.5 text-sm font-medium hover:opacity-90 transition"
            >
              Reserve a seat · ${course.price}
            </Link>
            <Link
              href={`/share?course=${course.id}`}
              className="rounded-xl border hairline px-7 py-3.5 text-sm font-medium hover:border-accent transition"
            >
              Refer a friend, get 10% →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t hairline">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 text-xs text-muted flex flex-wrap justify-between gap-3">
          <span>CSTU Short Courses · built with skills from CSE642 (frontend + AI) × CSE552 (full-stack)</span>
          <span>Demo content for illustration.</span>
        </div>
      </footer>
    </>
  );
}
