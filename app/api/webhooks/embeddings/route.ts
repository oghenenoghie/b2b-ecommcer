import { NextResponse } from "next/server";

import { embed, buildProductDocument } from "@/lib/embeddings";

export const runtime = "nodejs";

// Fired on product create/update (DB trigger -> pg_net/Edge Function, or a
// Realtime listener on an embed_queue table). Builds the compact doc, embeds
// it, writes it back. Idempotent; safe to call per-product or batched.
// Build order step 4, references/ai-search.md "Embeddings pipeline".
export async function POST(req: Request) {
  const { productId, title, specs, categoryPath, vendorName } = await req.json();

  if (!productId || !title) {
    return NextResponse.json({ error: "Missing productId or title" }, { status: 400 });
  }

  const doc = buildProductDocument({ title, specs, categoryPath, vendorName });
  const embedding = await embed(doc);

  // TODO(build order step 4): write `embedding` back onto the product row
  // via the admin client once the schema/migration exists.
  void embedding;

  return NextResponse.json({ productId, ok: true });
}
