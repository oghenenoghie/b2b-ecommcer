import type { Metadata } from "next";

import { DataTable } from "@/components/dashboard/DataTable";
import { isCurrentUserPlatformAdmin, listAllCategories } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const isAdmin = await isCurrentUserPlatformAdmin();

  if (!isAdmin) {
    return (
      <div>
        <p className="label mb-2">Categories</p>
        <h1 className="font-display text-display-lg text-ink">Categories</h1>
        <p className="mt-4 text-sm text-smoke">Sign in as a platform admin to manage categories.</p>
      </div>
    );
  }

  const categories = await listAllCategories();

  return (
    <div>
      <p className="label mb-2">Categories</p>
      <h1 className="font-display text-display-lg text-ink">Category tree</h1>

      {categories.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No categories yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "path", label: "Path" },
              { key: "slug", label: "Slug" },
              { key: "count", label: "Products", align: "right" },
            ]}
            rows={categories.map((category) => ({
              path: category.parent_id ? `— ${category.name}` : category.name,
              slug: <span className="font-mono text-xs text-smoke">{category.slug}</span>,
              count: category.productCount,
            }))}
          />
        </div>
      )}
    </div>
  );
}
