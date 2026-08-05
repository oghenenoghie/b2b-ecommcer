import { NextResponse } from "next/server";

import { searchProducts } from "@/lib/search";

export const runtime = "nodejs";

// Hybrid search endpoint used by /search and the procurement bar. Embeds the
// query server-side then calls the search_products RPC (Build order step 4).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  const products = await searchProducts({
    queryText: q,
    category: searchParams.get("category"),
    maxPriceMinor: searchParams.get("max") ? Number(searchParams.get("max")) : null,
    minQty: searchParams.get("qty") ? Number(searchParams.get("qty")) : null,
  });

  return NextResponse.json({ products });
}
