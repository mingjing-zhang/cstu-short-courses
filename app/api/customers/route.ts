import {
  listEnrollments,
  getPayouts,
  getContacts,
  setEnrollmentStatus,
  setPayout,
  COMMISSION_RATE,
  type EnrollmentStatus,
} from "@/lib/store";
import { getCourse } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function codeFromEmail(email: string): string {
  let h = 0;
  const s = email.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6).padStart(6, "0");
}

export async function GET() {
  const [enrollments, payouts, contacts] = await Promise.all([
    listEnrollments(),
    getPayouts(),
    getContacts(),
  ]);

  const rows = enrollments.map((e) => ({
    ...e,
    courseTitle: getCourse(e.courseId)?.title ?? e.courseId,
    contact: contacts[e.email] ?? null,
  }));

  const paid = enrollments.filter((e) => e.status === "paid");

  const revenue = paid.reduce((sum, e) => sum + e.amount, 0);
  const discounts = paid.reduce((sum, e) => sum + e.discount, 0);
  const referredPaid = paid.filter((e) => e.referredBy);
  const commission = referredPaid.reduce((sum, e) => sum + e.amount * COMMISSION_RATE, 0);

  const byCourse: Record<string, { title: string; count: number; revenue: number }> = {};
  for (const e of paid) {
    const title = getCourse(e.courseId)?.title ?? e.courseId;
    byCourse[e.courseId] ??= { title, count: 0, revenue: 0 };
    byCourse[e.courseId].count += 1;
    byCourse[e.courseId].revenue += e.amount;
  }

  // Group paid enrollments by referral code into a payout sheet
  const refMap: Record<string, { code: string; enrolled: number; revenue: number }> = {};
  for (const e of referredPaid) {
    const code = e.referredBy as string;
    refMap[code] ??= { code, enrolled: 0, revenue: 0 };
    refMap[code].enrolled += 1;
    refMap[code].revenue += e.amount;
  }
  const referrers = Object.values(refMap)
    .map((r) => ({
      ...r,
      revenue: round(r.revenue),
      commission: round(r.revenue * COMMISSION_RATE),
      paidOut: payouts[r.code] ?? false,
    }))
    .sort((a, b) => b.commission - a.commission);

  // A customer is an "affiliate" if their own referral code has driven ≥1 paid enrollment.
  const drivingCodes = new Set(referrers.filter((r) => r.enrolled > 0).map((r) => r.code));
  const affiliates = Array.from(
    new Set(
      enrollments
        .map((e) => e.email)
        .filter((email) => drivingCodes.has(codeFromEmail(email)))
    )
  );

  return Response.json({
    rows,
    affiliates,
    stats: {
      enrollments: paid.length,
      refunded: enrollments.length - paid.length,
      revenue: round(revenue),
      discounts: round(discounts),
      commission: round(commission),
      commissionOwed: round(
        referrers.filter((r) => !r.paidOut).reduce((s, r) => s + r.commission, 0)
      ),
      byCourse: Object.values(byCourse)
        .map((c) => ({ ...c, revenue: round(c.revenue) }))
        .sort((a, b) => b.revenue - a.revenue),
    },
    referrers,
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const action = (body as { action?: string }).action;

  if (action === "setStatus") {
    const { id, status } = body as { id?: string; status?: EnrollmentStatus };
    if (!id || (status !== "paid" && status !== "refunded")) {
      return Response.json({ error: "id and valid status required" }, { status: 400 });
    }
    const updated = await setEnrollmentStatus(id, status);
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, enrollment: updated });
  }

  if (action === "setPayout") {
    const { code, paidOut } = body as { code?: string; paidOut?: boolean };
    if (!code || typeof paidOut !== "boolean") {
      return Response.json({ error: "code and paidOut required" }, { status: 400 });
    }
    await setPayout(code, paidOut);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
