import Link from "next/link";

const NAV = [
  { href: "/search", label: "Shop" },
  { href: "/rfq", label: "RFQ" },
  { href: "/dashboard/buyer", label: "Dashboard" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          Aswaq
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="label hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <Link href="/cart" className="label hover:text-ink">
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
