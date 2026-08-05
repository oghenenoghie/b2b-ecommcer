import type { ProductCardData } from "@/types";
import { ProductCard } from "@/components/catalog/ProductCard";

export function ResultGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-smoke">No results — try relaxing a filter.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="bg-paper">
          <ProductCard
            slug={product.slug}
            vendor={{ slug: product.vendor.slug, name: product.vendor.display_name }}
            title={product.title}
            price={product.price}
            moq={product.moq}
            inStock={product.inStock}
          />
        </div>
      ))}
    </div>
  );
}
