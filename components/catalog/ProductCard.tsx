import Image from "next/image";
import Link from "next/link";

import { format, type Money } from "@/lib/money";
import { Badge } from "@/components/ui/badge";

export type ProductCardProps = {
  slug: string;
  vendor: { slug: string; name: string };
  title: string;
  imageUrl?: string | null;
  price: Money | null; // null => quote-only / POA
  moq: number;
  inStock: boolean;
};

export function ProductCard({ slug, vendor, title, imageUrl, price, moq, inStock }: ProductCardProps) {
  return (
    <Link href={`/p/${slug}`} className="group block">
      <article className="border border-line bg-paper transition-colors group-hover:border-ink">
        <div className="relative aspect-square overflow-hidden bg-bone">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          ) : null}
        </div>
        <div className="space-y-1 p-4">
          <p className="label">
            <Link href={`/v/${vendor.slug}`} className="hover:text-ink">
              {vendor.name}
            </Link>
          </p>
          <h3 className="font-display text-base leading-snug text-ink">{title}</h3>
          <div className="flex items-baseline justify-between pt-1">
            <span className="data">{price ? format(price) : "Request quote"}</span>
            <span className="font-mono text-xs tabular-nums text-smoke">MOQ {moq}</span>
          </div>
          {price ? (
            <Badge variant={inStock ? "stock" : "warn"}>{inStock ? "In stock" : "Low stock"}</Badge>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
