"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Message = {
  id: string;
  email: string;
  body: string;
  createdAt: string;
  read: boolean;
  outgoing: boolean;
};

type Thread = {
  email: string;
  wechat?: string;
  phone?: string;
  lastBody: string;
  lastAt: string;
  unread: number;
  messages: Message[];
};

type Broadcast = { id: string; body: string; createdAt: string };

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesTab({
  composeTo,
  onComposeHandled,
}: {
  composeTo: string | null;
  onComposeHandled: () => void;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastBody, setBroadcastBody] = useState("");

  const load = useCallback(async () => {
    const d = await fetch("/api/messages").then((r) => r.json());
    setThreads(d.threads);
    setBroadcasts(d.broadcasts);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (composeTo) {
      setSelected(composeTo);
      onComposeHandled();
    }
  }, [composeTo, onComposeHandled]);

  const current = useMemo(
    () => threads.find((t) => t.email === selected) ?? null,
    [threads, selected]
  );

  async function markRead(id: string) {
    await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "markRead", id }),
    });
    load();
  }

  // mark inbound messages read when opening a thread
  useEffect(() => {
    if (!current) return;
    const unread = current.messages.filter((m) => !m.outgoing && !m.read);
    if (unread.length) Promise.all(unread.map((m) => markRead(m.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  async function send() {
    if (!selected || !reply.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "send", email: selected, body: reply.trim() }),
    });
    setReply("");
    load();
  }

  async function sendBroadcast() {
    if (!broadcastBody.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "broadcast", body: broadcastBody.trim() }),
    });
    setBroadcastBody("");
    setShowBroadcast(false);
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Messages</h2>
        <button
          onClick={() => setShowBroadcast((s) => !s)}
          className="rounded-xl border hairline px-4 py-2.5 text-sm font-medium hover:border-accent transition"
        >
          New broadcast
        </button>
      </div>

      {showBroadcast && (
        <div className="mt-4 rounded-2xl border hairline bg-paper-2 p-5">
          <div className="text-xs uppercase tracking-widest text-muted">
            Broadcast to all students
          </div>
          <textarea
            value={broadcastBody}
            onChange={(e) => setBroadcastBody(e.target.value)}
            rows={3}
            placeholder="请缴费后入群 / Reminder to all enrolled students…"
            className="mt-2 w-full rounded-xl border hairline bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowBroadcast(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={sendBroadcast}
              disabled={!broadcastBody.trim()}
              className="rounded-lg bg-ink text-paper px-4 py-1.5 text-sm hover:bg-accent transition disabled:opacity-40"
            >
              Send broadcast
            </button>
          </div>
          {broadcasts.length > 0 && (
            <div className="mt-4 space-y-1.5 border-t hairline pt-3">
              {broadcasts.slice(0, 5).map((b) => (
                <div key={b.id} className="text-xs text-muted flex justify-between gap-3">
                  <span className="truncate">📣 {b.body}</span>
                  <span className="shrink-0">{fmt(b.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-[320px_1fr] gap-6 mt-6">
        {/* Thread list */}
        <div className="rounded-2xl border hairline overflow-hidden">
          {loading ? (
            <div className="px-5 py-10 text-center text-muted text-sm">Loading…</div>
          ) : threads.length === 0 && !selected ? (
            <div className="px-5 py-10 text-center text-muted text-sm">No messages yet.</div>
          ) : (
            <>
              {selected && !threads.some((t) => t.email === selected) && (
                <ThreadRow
                  email={selected}
                  preview="New conversation — say hello 👋"
                  date=""
                  unread={0}
                  active
                  onClick={() => setSelected(selected)}
                />
              )}
              {threads.map((t) => (
                <ThreadRow
                  key={t.email}
                  email={t.email}
                  preview={t.lastBody}
                  date={t.lastAt}
                  unread={t.unread}
                  active={selected === t.email}
                  onClick={() => setSelected(t.email)}
                />
              ))}
            </>
          )}
        </div>

        {/* Conversation */}
        <div className="rounded-2xl border hairline bg-paper-2 p-5 min-h-[360px] flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-muted text-sm">
              Select a conversation, or click “Message” on a customer.
            </div>
          ) : (
            <>
              <div className="text-sm font-medium border-b hairline pb-3">
                {selected}
                {current?.wechat && (
                  <span className="text-muted text-xs ml-2">微信 {current.wechat}</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {current?.messages.length ? (
                  current.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        m.outgoing
                          ? "ml-auto bg-ink text-paper"
                          : "bg-paper border hairline"
                      }`}
                    >
                      <div>{m.body}</div>
                      <div
                        className={`text-[10px] mt-1 ${
                          m.outgoing ? "text-paper/50" : "text-muted"
                        }`}
                      >
                        {fmt(m.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted text-sm text-center pt-8">
                    No messages in this thread yet.
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t hairline pt-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a reply…"
                  className="flex-1 rounded-xl border hairline bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
                <button
                  onClick={send}
                  disabled={!reply.trim()}
                  className="rounded-xl bg-ink text-paper px-4 py-2.5 text-sm hover:bg-accent transition disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ThreadRow({
  email,
  preview,
  date,
  unread,
  active,
  onClick,
}: {
  email: string;
  preview: string;
  date: string;
  unread: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 border-b hairline last:border-0 transition ${
        active ? "bg-accent-soft" : "hover:bg-paper-2"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{email}</span>
        {unread > 0 && (
          <span className="shrink-0 text-[10px] bg-accent text-paper rounded-full px-2 py-0.5">
            {unread} new
          </span>
        )}
      </div>
      <div className="text-xs text-muted truncate mt-0.5">{preview}</div>
      {date && (
        <div className="text-[10px] text-muted mt-1">
          {new Date(date).toLocaleDateString()}
        </div>
      )}
    </button>
  );
}
