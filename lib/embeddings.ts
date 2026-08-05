// Product embeddings — OpenAI text-embedding-3-small (1536-dim). If you
// switch to Supabase's gte-small Edge Function instead, use 384 dims and
// update every vector column + index consistently (references/ai-search.md).
const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!res.ok) {
    throw new Error(`Embedding request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding as number[];
}

/**
 * Builds the compact per-product document to embed: title, key specs,
 * category path, vendor, application keywords — not the raw description
 * blob. Keep it under ~500 tokens so retrieval stays sharp.
 */
export function buildProductDocument(product: {
  title: string;
  specs?: Record<string, unknown> | null;
  categoryPath?: string | null;
  vendorName?: string | null;
  applicationKeywords?: string[] | null;
}): string {
  const parts = [
    product.title,
    product.categoryPath,
    product.vendorName,
    product.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(", ") : null,
    product.applicationKeywords?.join(", "),
  ].filter(Boolean);

  return parts.join(" — ");
}
