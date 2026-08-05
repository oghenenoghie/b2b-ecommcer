const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// `media.storage_path` values are stored relative to the `media` Storage
// bucket, e.g. "products/<slug>/main.jpg" (see supabase/seed.sql).
export function productImageUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath || !SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${storagePath}`;
}
