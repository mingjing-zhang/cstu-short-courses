import Link from "next/link";
import { COURSES } from "@/lib/courses";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Advisor from "@/components/Advisor";
import ReferralCapture from "@/components/ReferralCapture";

export default function Home() {
  return (
    <>
      <ReferralCapture />
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              Live cohorts · Real instructors
            </div>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight mt-3">
              Learn to build with AI — in weeks, not years.
            </h1>
            <p className="text-muted mt-4 text-lg">
              Short, focused courses for founders, marketers, and curious
              beginners. Pick a track, join a cohort, ship something real.
            </p>
            <div className="flex gap-3 mt-6">
              <Link
                href="#courses"
                className="rounded-xl bg-ink text-paper px-5 py-3 text-sm font-medium hover:bg-accent transition"
              >
                Browse courses
              </Link>
              <Link
                href="#advisor"
                className="rounded-xl border hairline px-5 py-3 text-sm font-medium hover:border-accent transition"
              >
                Ask the AI advisor
              </Link>
            </div>
          </div>
          <div id="advisor" className="scroll-mt-24">
            <Advisor />
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="scroll-mt-24 py-8">
          <div className="flex items-end justify-between border-b hairline pb-4">
            <h2 className="font-display text-3xl">Courses</h2>
            <span className="text-sm text-muted">{COURSES.length} tracks</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border hairline bg-paper-2 p-6 flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/c/${course.id}`} className="hover:text-accent transition">
                      <h3 className="font-display text-xl">{course.title}</h3>
                    </Link>
                    <p className="text-muted text-sm">{course.titleZh}</p>
                  </div>
                  <span className="font-display text-xl">${course.price}</span>
                </div>
                <p className="text-sm mt-3 leading-relaxed">{course.tagline}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-muted">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="text-accent">→</span>
                      {o}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    Taught by {course.faculty.name} · {course.weeks} weeks
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/c/${course.id}`}
                      className="text-sm text-muted hover:text-ink transition"
                    >
                      Syllabus
                    </Link>
                    <Link
                      href={`/enroll?course=${course.id}`}
                      className="rounded-lg bg-accent text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                    >
                      Enroll →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
