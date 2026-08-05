import type { Metadata } from "next";

import { RevenueByProductChart } from "@/components/dashboard/RevenueByProductChart";
import { getCurrentVendorAnalytics } from "@/lib/data/analytics";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function VendorAnalyticsPage() {
  const analytics = await getCurrentVendorAnalytics();

  if (!analytics) {
    return (
      <div>
        <p className="label mb-2">Analytics</p>
        <h1 className="font-display text-display-lg text-ink">Analytics</h1>
        <p className="mt-4 text-sm text-smoke">Sign in to a vendor org to see analytics.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="label mb-2">Analytics</p>
      <h1 className="font-display text-display-lg text-ink">Analytics</h1>

      <div className="mt-8 grid grid-cols-2 gap-px bg-line">
        <div className="bg-paper p-6">
          <p className="data text-2xl">{format(analytics.totalRevenue)}</p>
          <p className="label mt-1">Total revenue</p>
        </div>
        <div className="bg-paper p-6">
          <p className="data text-2xl">{analytics.orderCount}</p>
          <p className="label mt-1">Orders</p>
        </div>
      </div>

      <div className="mt-10">
        <p className="label mb-4">Top products by units sold</p>
        {analytics.topProducts.length > 0 ? (
          <RevenueByProductChart data={analytics.topProducts} />
        ) : (
          <p className="text-sm text-smoke">No sales yet.</p>
        )}
      </div>
    </div>
  );
}
