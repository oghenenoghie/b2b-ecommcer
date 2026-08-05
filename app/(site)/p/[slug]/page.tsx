import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RfqForm } from "@/components/commerce/RfqForm";
import { getProductBySlug } from "@/lib/data/products";
import { listReviewsForProduct } from "@/lib/data/reviews";
import { addToCart } from "@/lib/actions/cart";
import { format } from "@/lib/money";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  return { title: product?.title ?? "Product" };
}

const ERROR_COPY: Record<string, string> = {
  "sign-in-required": "Sign in to a buyer org to do that — no auth UI exists in this scaffold yet.",
  "quote-only": "This item is quote-only — request a quote instead of adding to cart.",
  "rfq-failed": "Couldn't submit that RFQ — try again.",
};

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await listReviewsForProduct(product.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {error && ERROR_COPY[error] ? (
        <p className="mb-8 border border-error px-4 py-3 text-sm text-error">{ERROR_COPY[error]}</p>
      ) : null}

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-2">
          <div className="relative aspect-square overflow-hidden bg-bone">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden bg-bone">
                  <Image src={src} alt={product.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="label mb-2">
            <Link href={`/v/${product.vendor.slug}`} className="hover:text-ink">
              {product.vendor.display_name}
            </Link>
          </p>
          <h1 className="font-display text-display-lg text-ink">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="data text-lg">{product.price ? format(product.price) : "Request quote"}</span>
            <span className="font-mono text-xs tabular-nums text-smoke">MOQ {product.moq}</span>
            {product.price ? (
              <Badge variant={product.inStock ? "stock" : "warn"}>{product.inStock ? "In stock" : "Low stock"}</Badge>
            ) : null}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-smoke">{product.description}</p>

          {Object.keys(product.specs).length > 0 ? (
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="label">{key.replace(/_/g, " ")}</dt>
                  <dd className="data">{String(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {product.priceTiers.length > 0 ? (
            <div className="mt-6 border-t border-line pt-6">
              <p className="label mb-3">Volume pricing</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink">
                    <th className="label py-1 text-left">Qty</th>
                    <th className="label py-1 text-right">Unit price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.priceTiers.map((tier) => (
                    <tr key={tier.minQty} className="border-b border-line">
                      <td className="py-2 font-mono tabular-nums">{tier.minQty}+</td>
                      <td className="data py-2 text-right">
                        {format({ amount: tier.unitPrice, currency: product.price?.currency ?? "KWD" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {product.leadTimeDays ? (
            <p className="mt-4 text-sm text-smoke">Lead time: {product.leadTimeDays} days</p>
          ) : null}

          <div className="mt-8 border-t border-line pt-8">
            {product.price ? (
              <form action={addToCart} className="flex items-end gap-3">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="productSlug" value={product.slug} />
                <div className="w-24 space-y-1.5">
                  <Label htmlFor="qty">Qty</Label>
                  <Input id="qty" name="qty" type="number" min={product.moq} defaultValue={product.moq} />
                </div>
                <Button type="submit">Add to cart</Button>
              </form>
            ) : (
              <RfqForm productId={product.id} productSlug={product.slug} moq={product.moq} />
            )}
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <p className="label mb-6">Reviews</p>
        {reviews.length > 0 ? (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-line pb-6">
                <div className="flex items-center gap-3">
                  <span className="data">{review.rating}/5</span>
                  <span className="text-sm text-smoke">{review.buyerOrgName}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{review.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-smoke">No reviews yet.</p>
        )}
      </section>
    </div>
  );
}
