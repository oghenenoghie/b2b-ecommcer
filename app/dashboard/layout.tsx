import Link from "next/link";

// Org-role gated via RLS — every read/write here is scoped to the caller's
// org membership (SKILL.md "RLS & org-role model").
const BUYER_NAV = [
  { href: "/dashboard/buyer", label: "Overview" },
  { href: "/dashboard/buyer/orders", label: "Orders" },
  { href: "/dashboard/buyer/invoices", label: "Invoices" },
  { href: "/dashboard/buyer/rfqs", label: "RFQs" },
  { href: "/dashboard/buyer/shipments", label: "Shipments" },
  { href: "/dashboard/buyer/team", label: "Team" },
  { href: "/dashboard/buyer/saved", label: "Saved" },
];

const VENDOR_NAV = [
  { href: "/dashboard/vendor", label: "Overview" },
  { href: "/dashboard/vendor/products", label: "Products" },
  { href: "/dashboard/vendor/orders", label: "Orders" },
  { href: "/dashboard/vendor/quotes", label: "Quotes" },
  { href: "/dashboard/vendor/invoices", label: "Invoices" },
  { href: "/dashboard/vendor/shipments", label: "Shipments" },
  { href: "/dashboard/vendor/analytics", label: "Analytics" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <aside className="w-56 shrink-0 border-r border-line px-6 py-10">
        <p className="label mb-4">Buyer</p>
        <nav className="mb-8 flex flex-col gap-2">
          {BUYER_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-smoke hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="label mb-4">Vendor</p>
        <nav className="flex flex-col gap-2">
          {VENDOR_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-smoke hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-8 py-10">{children}</main>
    </div>
  );
}
