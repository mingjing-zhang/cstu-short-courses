import { getAttendance, setAttendance, listEnrollments } from "@/lib/store";
import { COURSES } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [attendance, enrollments] = await Promise.all([
    getAttendance(),
    listEnrollments(),
  ]);

  // Group paid students by course (unique emails)
  const studentsByCourse: Record<string, { name: string; email: string }[]> = {};
  for (const e of enrollments) {
    if (e.status !== "paid") continue;
    const list = (studentsByCourse[e.courseId] ??= []);
    if (!list.some((s) => s.email === e.email)) {
      list.push({ name: e.name, email: e.email });
    }
  }

  const courses = COURSES.filter((c) => studentsByCourse[c.id]?.length).map((c) => ({
    id: c.id,
    title: c.title,
    sessions: c.sessions,
    students: studentsByCourse[c.id] ?? [],
  }));

  return Response.json({ courses, attendance });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { key, present } = body as { key?: string; present?: boolean };
  if (!key || typeof present !== "boolean") {
    return Response.json({ error: "key and present required" }, { status: 400 });
  }
  await setAttendance(key, present);
  return Response.json({ ok: true });
}
