import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// On-demand revalidation for catalog/vendor pages after admin or vendor
// dashboard mutations. Protect with a shared secret before wiring to a
// public-facing webhook.
export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await req.json();
  if (path) revalidatePath(path);

  return NextResponse.json({ revalidated: true, path: path ?? null });
}
