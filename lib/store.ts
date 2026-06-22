import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const DISCOUNT_RATE = 0.1; // referred students pay 10% less
export const COMMISSION_RATE = 0.1; // referrers earn 10% of what they drive

export type EnrollmentStatus = "paid" | "refunded";

export type Enrollment = {
  id: string;
  name: string;
  email: string;
  courseId: string;
  listPrice: number;
  discount: number;
  amount: number; // amount actually paid = listPrice - discount
  referredBy: string | null;
  status: EnrollmentStatus;
  createdAt: string;
};

export type Contact = { wechat?: string; phone?: string };
export type Message = {
  id: string;
  email: string;
  body: string;
  createdAt: string;
  read: boolean;
  outgoing: boolean; // true = staff → customer, false = customer → staff
};
export type Broadcast = { id: string; body: string; createdAt: string };
export type SessionLinks = { online: string; inperson: string };
export type SessionMeta = { scheduled: string; recording: string; materials: string };
export type Video = {
  id: string;
  youtube: string;
  title: string;
  source: string;
  sort: number;
  hidden: boolean;
};

type StoreShape = {
  enrollments: Enrollment[];
  payouts: Record<string, boolean>; // referral code -> commission paid out?
  contacts: Record<string, Contact>; // email -> contact
  messages: Message[];
  broadcasts: Broadcast[];
  sessionLinks: Record<string, SessionLinks>; // courseId -> links
  sessionMeta: Record<string, SessionMeta>; // `${courseId}:${n}` -> meta
  videos: Video[];
  attendance: Record<string, boolean>; // `${courseId}:${email}:${n}` -> present
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "store.json");

function empty(): StoreShape {
  return {
    enrollments: [],
    payouts: {},
    contacts: {},
    messages: [],
    broadcasts: [],
    sessionLinks: {},
    sessionMeta: {},
    videos: [],
    attendance: {},
  };
}

async function read(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return {
      ...empty(),
      ...parsed,
      enrollments: (parsed.enrollments ?? []).map((e) => ({
        ...e,
        listPrice: e.listPrice ?? e.amount,
        discount: e.discount ?? 0,
        status: e.status ?? ("paid" as EnrollmentStatus),
      })),
    };
  } catch {
    return empty();
  }
}

async function write(data: StoreShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

/* ---------- enrollments / billing ---------- */

export async function listEnrollments(): Promise<Enrollment[]> {
  const data = await read();
  return data.enrollments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addEnrollment(input: {
  name: string;
  email: string;
  courseId: string;
  listPrice: number;
  referredBy: string | null;
}): Promise<Enrollment> {
  const data = await read();
  const discount = input.referredBy
    ? Math.round(input.listPrice * DISCOUNT_RATE * 100) / 100
    : 0;
  const enrollment: Enrollment = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    courseId: input.courseId,
    listPrice: input.listPrice,
    discount,
    amount: Math.round((input.listPrice - discount) * 100) / 100,
    referredBy: input.referredBy,
    status: "paid",
    createdAt: new Date().toISOString(),
  };
  data.enrollments.push(enrollment);
  await write(data);
  return enrollment;
}

export async function setEnrollmentStatus(
  id: string,
  status: EnrollmentStatus
): Promise<Enrollment | null> {
  const data = await read();
  const row = data.enrollments.find((e) => e.id === id);
  if (!row) return null;
  row.status = status;
  await write(data);
  return row;
}

export async function getPayouts(): Promise<Record<string, boolean>> {
  return (await read()).payouts;
}

export async function setPayout(code: string, paidOut: boolean): Promise<void> {
  const data = await read();
  data.payouts[code] = paidOut;
  await write(data);
}

export async function getContacts(): Promise<Record<string, Contact>> {
  return (await read()).contacts;
}

/* ---------- messages ---------- */

export async function listMessages(): Promise<Message[]> {
  const data = await read();
  return data.messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listBroadcasts(): Promise<Broadcast[]> {
  return (await read()).broadcasts;
}

export async function addMessage(input: {
  email: string;
  body: string;
  outgoing: boolean;
}): Promise<Message> {
  const data = await read();
  const msg: Message = {
    id: randomUUID(),
    email: input.email,
    body: input.body,
    createdAt: new Date().toISOString(),
    read: input.outgoing, // outgoing messages are "read" by definition
    outgoing: input.outgoing,
  };
  data.messages.push(msg);
  await write(data);
  return msg;
}

export async function markMessageRead(id: string): Promise<void> {
  const data = await read();
  const m = data.messages.find((x) => x.id === id);
  if (m) m.read = true;
  await write(data);
}

export async function addBroadcast(body: string): Promise<Broadcast> {
  const data = await read();
  const b: Broadcast = { id: randomUUID(), body, createdAt: new Date().toISOString() };
  data.broadcasts.push(b);
  await write(data);
  return b;
}

/* ---------- content (links + per-session meta) ---------- */

export async function getContent(): Promise<{
  sessionLinks: Record<string, SessionLinks>;
  sessionMeta: Record<string, SessionMeta>;
}> {
  const data = await read();
  return { sessionLinks: data.sessionLinks, sessionMeta: data.sessionMeta };
}

export async function setSessionLinks(
  courseId: string,
  links: Partial<SessionLinks>
): Promise<void> {
  const data = await read();
  data.sessionLinks[courseId] = {
    online: links.online ?? data.sessionLinks[courseId]?.online ?? "",
    inperson: links.inperson ?? data.sessionLinks[courseId]?.inperson ?? "",
  };
  await write(data);
}

export async function setSessionMeta(
  key: string,
  meta: Partial<SessionMeta>
): Promise<void> {
  const data = await read();
  const cur = data.sessionMeta[key] ?? { scheduled: "", recording: "", materials: "" };
  data.sessionMeta[key] = { ...cur, ...meta };
  await write(data);
}

/* ---------- videos ---------- */

export async function listVideos(): Promise<Video[]> {
  const data = await read();
  return data.videos.sort((a, b) => a.sort - b.sort);
}

export async function addVideo(input: {
  youtube: string;
  title: string;
  source: string;
  sort: number;
}): Promise<Video> {
  const data = await read();
  const v: Video = { id: randomUUID(), hidden: false, ...input };
  data.videos.push(v);
  await write(data);
  return v;
}

export async function updateVideo(
  id: string,
  patch: Partial<Omit<Video, "id">>
): Promise<void> {
  const data = await read();
  const v = data.videos.find((x) => x.id === id);
  if (v) Object.assign(v, patch);
  await write(data);
}

export async function deleteVideo(id: string): Promise<void> {
  const data = await read();
  data.videos = data.videos.filter((x) => x.id !== id);
  await write(data);
}

/* ---------- attendance ---------- */

export async function getAttendance(): Promise<Record<string, boolean>> {
  return (await read()).attendance;
}

export async function setAttendance(key: string, present: boolean): Promise<void> {
  const data = await read();
  if (present) data.attendance[key] = true;
  else delete data.attendance[key];
  await write(data);
}
