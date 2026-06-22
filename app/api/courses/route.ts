import { COURSES } from "@/lib/courses";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ courses: COURSES });
}
