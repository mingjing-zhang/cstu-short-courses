import { listEnrollments, getPayouts, COMMISSION_RATE } from "@/lib/store";
import { getCourse } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public earnings lookup for the share page: /api/referrals?code=abc123
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code")?.trim().toLowerCase();
  if (!code) {
    return Response.json({ error: "A referral code is required" }, { status: 400 });
  }

  const [enrollments, payouts] = await Promise.all([listEnrollments(), getPayouts()]);
  const mine = enrollments.filter(
    (e) => e.referredBy?.toLowerCase() === code && e.status === "paid"
  );

  const revenue = mine.reduce((s, e) => s + e.amount, 0);
  const commission = Math.round(revenue * COMMISSION_RATE * 100) / 100;

  return Response.json({
    code,
    enrolled: mine.length,
    revenue: Math.round(revenue * 100) / 100,
    commission,
    paidOut: payouts[code] ?? false,
    students: mine.map((e) => ({
      name: e.name,
      course: getCourse(e.courseId)?.title ?? e.courseId,
      amount: e.amount,
      date: e.createdAt,
    })),
  });
}
