import { getCourse } from "@/lib/courses";
import { addEnrollment } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, courseId, referredBy } = (body ?? {}) as {
    name?: string;
    email?: string;
    courseId?: string;
    referredBy?: string;
  };

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  const course = courseId ? getCourse(courseId) : undefined;
  if (!course) {
    return Response.json({ error: "Unknown course" }, { status: 400 });
  }

  const enrollment = await addEnrollment({
    name: (name || "").trim() || "—",
    email: email.trim().toLowerCase(),
    courseId: course.id,
    listPrice: course.price,
    referredBy: referredBy?.trim() || null,
  });

  return Response.json({ ok: true, enrollment });
}
