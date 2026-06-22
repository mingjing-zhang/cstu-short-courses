import Link from "next/link";
import { getCourse } from "@/lib/courses";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EnrollForm from "@/components/EnrollForm";

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: courseId } = await searchParams;
  const course = courseId ? getCourse(courseId) : undefined;

  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-6 py-14">
        <Link href="/#courses" className="text-sm text-muted hover:text-ink">
          ← All courses
        </Link>
        <h1 className="font-display text-3xl mt-3 mb-8">Enroll</h1>

        {course ? (
          <EnrollForm
            courseId={course.id}
            title={course.title}
            titleZh={course.titleZh}
            price={course.price}
            weeks={course.weeks}
          />
        ) : (
          <div className="rounded-2xl border hairline bg-paper-2 p-8">
            <p className="text-muted">
              No course selected. Head back and pick one.
            </p>
            <Link
              href="/#courses"
              className="inline-block mt-4 rounded-xl bg-ink text-paper px-5 py-2.5 text-sm hover:bg-accent transition"
            >
              Browse courses →
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
