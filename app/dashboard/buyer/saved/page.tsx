import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved",
};

export default function BuyerSavedPage() {
  return (
    <div>
      <p className="label mb-2">Saved</p>
      <h1 className="font-display text-display-lg text-ink">Saved products</h1>
      <p className="mt-6 text-sm text-smoke">
        There&rsquo;s no `saved_products` table in the schema yet — it wasn&rsquo;t in the Build order step 2
        data model. Add a `(user_id, product_id)` join table + RLS policy alongside the other org-scoped
        tables to back this page.
      </p>
    </div>
  );
}
