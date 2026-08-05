import type { Metadata } from "next";

import { getCurrentVendor } from "@/lib/data/org";
import { listOrdersForCurrentOrg } from "@/lib/data/orders";
import { listCurrentVendorQuotes } from "@/lib/data/vendor-dashboard";
import { getCurrentVendorAnalytics } from "@/lib/data/analytics";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Vendor overview",
};

export default async function VendorOverviewPage() {
  const vendor = await getCurrentVendor();

  if (!vendor) {
    return (
      <div>
        <p className="label mb-2">Vendor overview</p>
        <h1 className="font-display text-display-lg text-ink">Vendor overview</h1>
        <p className="mt-4 text-sm text-smoke">
          Sign in to a vendor org to see your dashboard — no auth UI exists in this scaffold yet.
        </p>
      </div>
    );
  }

  const [orders, quotes, analytics] = await Promise.all([
    listOrdersForCurrentOrg("vendor"),
    listCurrentVendorQuotes(),
    getCurrentVendorAnalytics(),
  ]);

  const stats = [
    { label: "Orders", value: orders?.length ?? 0 },
    { label: "Quotes to respond", value: quotes?.filter((q) => q.status === "draft").length ?? 0 },
    { label: "Revenue", value: analytics ? format(analytics.totalRevenue) : "—" },
  ];

  return (
    <div>
      <p className="label mb-2">{vendor.display_name}</p>
      <h1 className="font-display text-display-lg text-ink">Vendor overview</h1>
      <div className="mt-8 grid grid-cols-3 gap-px bg-line">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper p-6">
            <p className="data text-2xl">{stat.value}</p>
            <p className="label mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
