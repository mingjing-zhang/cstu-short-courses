import { COURSES, getCourse, type Course } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Advice = {
  recommendedId: string;
  pitch: string;
  source: "claude" | "rules";
};

function ruleBased(goal: string): Advice {
  const text = goal.toLowerCase();
  let best: Course = COURSES[0];
  let bestScore = -1;
  for (const course of COURSES) {
    const score = course.keywords.reduce(
      (acc, kw) => acc + (text.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = course;
    }
  }
  if (bestScore <= 0) best = getCourse("agentic") ?? COURSES[0];

  return {
    recommendedId: best.id,
    pitch: `Based on what you described, ${best.title} is the closest fit — ${best.tagline} It runs ${best.weeks} weeks and is built for ${best.for.toLowerCase()}`,
    source: "rules",
  };
}

async function withClaude(goal: string, apiKey: string): Promise<Advice> {
  const catalog = COURSES.map(
    (c) =>
      `- id: ${c.id} | ${c.title} (${c.titleZh}) | $${c.price} | ${c.weeks} weeks | for: ${c.for}`
  ).join("\n");

  const prompt = `You are a friendly course advisor for an AI school. A prospective student says:

"${goal}"

Here is the catalog:
${catalog}

Pick the single best course for them. Reply with ONLY a JSON object, no markdown:
{"recommendedId": "<one of the ids above>", "pitch": "<2-3 warm sentences, written in the same language the student used, explaining why this course fits them specifically>"}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
  const data = await res.json();
  const raw: string = data?.content?.[0]?.text ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in model response");
  const parsed = JSON.parse(match[0]) as { recommendedId?: string; pitch?: string };
  if (!parsed.recommendedId || !getCourse(parsed.recommendedId) || !parsed.pitch) {
    throw new Error("Invalid model response");
  }
  return { recommendedId: parsed.recommendedId, pitch: parsed.pitch, source: "claude" };
}

export async function POST(req: Request) {
  let goal = "";
  try {
    const body = (await req.json()) as { goal?: string };
    goal = (body.goal || "").trim();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!goal) {
    return Response.json({ error: "Tell us a bit about your goal." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  let advice: Advice;
  if (apiKey) {
    try {
      advice = await withClaude(goal, apiKey);
    } catch {
      advice = ruleBased(goal);
    }
  } else {
    advice = ruleBased(goal);
  }

  const course = getCourse(advice.recommendedId)!;
  return Response.json({
    recommendedId: advice.recommendedId,
    pitch: advice.pitch,
    source: advice.source,
    course: {
      id: course.id,
      title: course.title,
      titleZh: course.titleZh,
      price: course.price,
      weeks: course.weeks,
    },
  });
}
