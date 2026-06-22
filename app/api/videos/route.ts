import { listVideos, addVideo, updateVideo, deleteVideo, type Video } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const videos = await listVideos();
  return Response.json({ videos });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const action = (body as { action?: string }).action;

  if (action === "add") {
    const { youtube, title, source, sort } = body as {
      youtube?: string;
      title?: string;
      source?: string;
      sort?: number;
    };
    if (!youtube?.trim() || !title?.trim()) {
      return Response.json({ error: "youtube and title required" }, { status: 400 });
    }
    const v = await addVideo({
      youtube: youtube.trim(),
      title: title.trim(),
      source: (source ?? "").trim(),
      sort: Number.isFinite(sort) ? (sort as number) : 0,
    });
    return Response.json({ ok: true, video: v });
  }

  if (action === "update") {
    const { id, patch } = body as { id?: string; patch?: Partial<Omit<Video, "id">> };
    if (!id || !patch) return Response.json({ error: "id and patch required" }, { status: 400 });
    await updateVideo(id, patch);
    return Response.json({ ok: true });
  }

  if (action === "delete") {
    const { id } = body as { id?: string };
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    await deleteVideo(id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
