import {
  listMessages,
  listBroadcasts,
  addMessage,
  addBroadcast,
  markMessageRead,
  getContacts,
  type Message,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Thread = {
  email: string;
  wechat?: string;
  phone?: string;
  lastBody: string;
  lastAt: string;
  unread: number;
  messages: Message[];
};

export async function GET() {
  const [messages, broadcasts, contacts] = await Promise.all([
    listMessages(),
    listBroadcasts(),
    getContacts(),
  ]);

  const byEmail: Record<string, Message[]> = {};
  for (const m of messages) {
    (byEmail[m.email] ??= []).push(m);
  }

  const threads: Thread[] = Object.entries(byEmail)
    .map(([email, msgs]) => {
      const sorted = [...msgs].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const last = sorted[sorted.length - 1];
      return {
        email,
        wechat: contacts[email]?.wechat,
        phone: contacts[email]?.phone,
        lastBody: last.body,
        lastAt: last.createdAt,
        unread: msgs.filter((m) => !m.outgoing && !m.read).length,
        messages: sorted,
      };
    })
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));

  return Response.json({ threads, broadcasts });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const action = (body as { action?: string }).action;

  if (action === "send") {
    const { email, body: text } = body as { email?: string; body?: string };
    if (!email || !text?.trim()) {
      return Response.json({ error: "email and body required" }, { status: 400 });
    }
    const msg = await addMessage({ email, body: text.trim(), outgoing: true });
    return Response.json({ ok: true, message: msg });
  }

  if (action === "broadcast") {
    const { body: text } = body as { body?: string };
    if (!text?.trim()) {
      return Response.json({ error: "body required" }, { status: 400 });
    }
    const b = await addBroadcast(text.trim());
    return Response.json({ ok: true, broadcast: b });
  }

  if (action === "markRead") {
    const { id } = body as { id?: string };
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    await markMessageRead(id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
