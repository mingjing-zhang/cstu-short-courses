import { getContent, setSessionLinks, setSessionMeta } from "@/lib/store";
import { COURSES } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { sessionLinks, sessionMeta } = await getContent();

  const courses = COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    titleZh: c.titleZh,
    sessions: c.sessionList.map((s) => ({
      n: s.n,
      title: s.title,
      week: s.week,
    })),
  }));

  return Response.json({ courses, sessionLinks, sessionMeta });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const action = (body as { action?: string }).action;

  if (action === "links") {
    const { courseId, online, inperson } = body as {
      courseId?: string;
      online?: string;
      inperson?: string;
    };
    if (!courseId) return Response.json({ error: "courseId required" }, { status: 400 });
    await setSessionLinks(courseId, { online, inperson });
    return Response.json({ ok: true });
  }

  if (action === "meta") {
    const { key, scheduled, recording, materials } = body as {
      key?: string;
      scheduled?: string;
      recording?: string;
      materials?: string;
    };
    if (!key) return Response.json({ error: "key required" }, { status: 400 });
    await setSessionMeta(key, { scheduled, recording, materials });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
