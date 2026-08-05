import Link from "next/link";

// Platform admin — a separate role from org roles (SKILL.md "RLS & org-role
// model"), gated in middleware/RLS once auth exists.
const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/vendors", label: "Vendor approvals" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/disputes", label: "Disputes" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <aside className="w-56 shrink-0 border-r border-line px-6 py-10">
        <p className="label mb-4">Admin</p>
        <nav className="flex flex-col gap-2">
          {ADMIN_NAV.map((item) => (
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
