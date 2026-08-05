import { createClient } from "@/lib/supabase/server";
import { productImageUrl } from "@/lib/storage";
import type { ProductCardData } from "@/types";

const CARD_SELECT = `
  id, slug, title, base_price, currency, moq,
  vendors!inner ( slug, display_name ),
  media ( storage_path, is_primary, sort ),
  product_variants ( stock_qty )
`;

type CardRow = {
  id: string;
  slug: string;
  title: string;
  base_price: number | null;
  currency: string;
  moq: number;
  vendors: { slug: string; display_name: string } | { slug: string; display_name: string }[];
  media: { storage_path: string; is_primary: boolean; sort: number }[] | null;
  product_variants: { stock_qty: number }[] | null;
};

function toCardData(row: CardRow): ProductCardData {
  const vendor = Array.isArray(row.vendors) ? row.vendors[0] : row.vendors;
  const media = [...(row.media ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort - b.sort,
  );
  const variants = row.product_variants ?? [];
  const inStock = variants.length === 0 || variants.some((v) => v.stock_qty > 0);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    vendor: { slug: vendor?.slug ?? "", display_name: vendor?.display_name ?? "" },
    price: row.base_price != null ? { amount: row.base_price, currency: row.currency } : null,
    moq: row.moq,
    inStock,
    imageUrl: productImageUrl(media[0]?.storage_path),
  };
}

export type ProductListFilters = {
  categorySlug?: string | null;
  vendorSlug?: string | null;
  maxPriceMinor?: number | null;
  minQty?: number | null;
  limit?: number;
};

export async function listActiveProducts(filters: ProductListFilters = {}): Promise<ProductCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(CARD_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 24);

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  if (filters.vendorSlug) {
    query = query.eq("vendors.slug", filters.vendorSlug);
  }

  if (filters.maxPriceMinor != null) {
    query = query.lte("base_price", filters.maxPriceMinor);
  }

  if (filters.minQty != null) {
    query = query.lte("moq", filters.minQty);
  }

  const { data, error } = await query;
  if (error) {
    console.error("listActiveProducts", error.message);
    return [];
  }

  return (data as unknown as CardRow[]).map(toCardData);
}

/**
 * Enriches raw `search_products` RPC rows (plain `products` columns, no
 * joins — see supabase/migrations/0008) with vendor/media/stock for
 * ProductCard, preserving the RPC's relevance order.
 */
export async function getProductCardsByIds(ids: string[]): Promise<ProductCardData[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(CARD_SELECT).in("id", ids);

  if (error || !data) {
    if (error) console.error("getProductCardsByIds", error.message);
    return [];
  }

  const bySlugOrId = new Map((data as unknown as CardRow[]).map((row) => [row.id, toCardData(row)]));
  return ids.map((id) => bySlugOrId.get(id)).filter((card): card is ProductCardData => Boolean(card));
}

export type ProductDetail = ProductCardData & {
  description: string;
  specs: Record<string, unknown>;
  leadTimeDays: number | null;
  vendorBio: string | null;
  images: string[];
  variants: { id: string; sku: string; price: number; stockQty: number }[];
  priceTiers: { minQty: number; unitPrice: number }[];
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, title, description, specs, base_price, currency, moq, lead_time_days,
      vendors!inner ( slug, display_name, bio ),
      media ( storage_path, is_primary, sort ),
      product_variants ( id, sku, price, stock_qty ),
      price_tiers ( min_qty, unit_price )
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductBySlug", error.message);
    return null;
  }

  const row = data as unknown as {
    id: string;
    slug: string;
    title: string;
    base_price: number | null;
    currency: string;
    moq: number;
    description: string;
    specs: Record<string, unknown>;
    lead_time_days: number | null;
    vendors: { slug: string; display_name: string; bio: string | null };
    media: { storage_path: string; is_primary: boolean; sort: number }[] | null;
    product_variants: { id: string; sku: string; price: number; stock_qty: number }[];
    price_tiers: { min_qty: number; unit_price: number }[];
  };

  const card = toCardData(row);
  const media = [...(row.media ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort - b.sort,
  );

  return {
    ...card,
    description: row.description,
    specs: row.specs ?? {},
    leadTimeDays: row.lead_time_days,
    vendorBio: row.vendors.bio,
    images: media.map((m) => productImageUrl(m.storage_path)).filter((u): u is string => Boolean(u)),
    variants: row.product_variants.map((v) => ({ id: v.id, sku: v.sku, price: v.price, stockQty: v.stock_qty })),
    priceTiers: row.price_tiers
      .map((t) => ({ minQty: t.min_qty, unitPrice: t.unit_price }))
      .sort((a, b) => a.minQty - b.minQty),
  };
}
