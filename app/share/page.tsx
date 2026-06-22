import { COURSES } from "@/lib/courses";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareTool from "@/components/ShareTool";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const courses = COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    titleZh: c.titleZh,
    price: c.price,
    priceInPerson: c.priceInPerson,
    faculty: c.faculty.name,
  }));

  return (
    <>
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-xs uppercase tracking-[0.18em] text-accent">
          Refer &amp; earn
        </div>
        <h1 className="font-display text-4xl mt-2">Share a course, give 10% off.</h1>
        <p className="text-muted mt-3 max-w-2xl">
          Get your personal referral link, then generate a poster you can drop in a
          WeChat group or post anywhere. Anyone who enrolls through your link gets
          10% off — and shows up attributed to you in the admin.
        </p>
        <ShareTool
          courses={courses}
          initialCourse={course ?? courses[0]?.id ?? ""}
        />
      </main>
      <SiteFooter />
    </>
  );
}
