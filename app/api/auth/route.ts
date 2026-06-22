import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "staff_session";
const DEFAULT_PASSWORD = "lovecstu1234";

// Opaque session token. Set SESSION_TOKEN in prod; the default keeps local dev
// working. Middleware compares the cookie against this exact value, so a blank
// or arbitrary cookie can no longer pass the gate.
const SESSION_TOKEN = process.env.SESSION_TOKEN || "cstu-courses-staff-session";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = (body.password || "").trim();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const expected = process.env.STAFF_PASSWORD || DEFAULT_PASSWORD;
  if (password !== expected) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(COOKIE);
  return Response.json({ ok: true });
}
