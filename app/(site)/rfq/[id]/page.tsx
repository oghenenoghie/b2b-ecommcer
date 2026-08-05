import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getRfqThread } from "@/lib/data/rfq";
import { format } from "@/lib/money";

export default async function RfqThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rfq = await getRfqThread(id);

  if (!rfq) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="label mb-2">RFQ thread</p>
          <h1 className="font-display text-display-lg text-ink">RFQ {rfq.id.slice(0, 8)}</h1>
        </div>
        <Badge variant={rfq.status === "accepted" ? "stock" : "neutral"}>{rfq.status}</Badge>
      </div>

      <section className="mt-10">
        <p className="label mb-4">Items requested</p>
        <div className="border border-line bg-paper">
          {rfq.items.map((item) => (
            <div key={item.id} className="border-b border-line px-4 py-3 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink">{item.productTitle}</span>
                <span className="font-mono text-xs tabular-nums text-smoke">Qty {item.qty}</span>
              </div>
              {item.targetPrice ? (
                <p className="mt-1 font-mono text-xs tabular-nums text-smoke">
                  Target: {format(item.targetPrice)}
                </p>
              ) : null}
              {item.notes ? <p className="mt-1 text-sm text-smoke">{item.notes}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="label mb-4">Quotes</p>
        {rfq.quotes.length > 0 ? (
          <div className="space-y-4">
            {rfq.quotes.map((quote) => (
              <div key={quote.id} className="border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base text-ink">{quote.vendorName}</span>
                  <Badge variant={quote.status === "accepted" ? "stock" : "neutral"}>{quote.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-smoke">
                  Valid until {new Date(quote.validUntil).toLocaleDateString()}
                </p>
                <ul className="mt-3 space-y-1">
                  {quote.lines.map((line, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-smoke">Qty {line.qty}</span>
                      <span className="data">{format({ amount: line.unit_price, currency: quote.total.currency })}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="label">Total</span>
                  <span className="data text-base">{format(quote.total)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-smoke">No quotes yet — the vendor hasn&rsquo;t responded.</p>
        )}
      </section>
    </div>
  );
}
