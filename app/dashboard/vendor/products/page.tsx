import type { Metadata } from "next";
import Link from "next/link";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listCurrentVendorProducts } from "@/lib/data/vendor-dashboard";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Products",
};

const STATUS_VARIANT = { active: "stock", draft: "neutral", archived: "warn" } as const;

export default async function VendorProductsPage() {
  const products = await listCurrentVendorProducts();

  return (
    <div>
      <p className="label mb-2">Products</p>
      <h1 className="font-display text-display-lg text-ink">Products</h1>

      {products === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a vendor org to manage products.</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No products yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "title", label: "Title" },
              { key: "status", label: "Status" },
              { key: "price", label: "Price", align: "right" },
              { key: "moq", label: "MOQ", align: "right" },
            ]}
            rows={products.map((product) => ({
              title: (
                <Link href={`/p/${product.slug}`} className="hover:underline">
                  {product.title}
                </Link>
              ),
              status: <Badge variant={STATUS_VARIANT[product.status]}>{product.status}</Badge>,
              price: product.price ? format(product.price) : "POA",
              moq: product.moq,
            }))}
          />
        </div>
      )}
    </div>
  );
}
