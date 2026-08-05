import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor approvals",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Vendor approvals</p>
      <h1 className="font-display text-display-lg text-ink">Vendor approvals</h1>
      <p className="mt-4 text-sm text-smoke">Vendor approval queue lands in Build order step 7.</p>
    </div>
  );
}
