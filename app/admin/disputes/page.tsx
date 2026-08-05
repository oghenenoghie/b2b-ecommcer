import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disputes",
};

export default function AdminDisputesPage() {
  return (
    <div>
      <p className="label mb-2">Disputes</p>
      <h1 className="font-display text-display-lg text-ink">Disputes</h1>
      <p className="mt-6 text-sm text-smoke">
        There&rsquo;s no disputes table in the schema yet — SKILL.md&rsquo;s data model doesn&rsquo;t define
        one. Add a `disputes` table (order_id, raised_by_org_id, reason, status, resolution) + RLS alongside
        `orders` to back this page.
      </p>
    </div>
  );
}
