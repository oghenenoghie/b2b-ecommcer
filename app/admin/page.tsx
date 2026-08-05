import type { Metadata } from "next";

import { isCurrentUserPlatformAdmin, listVendorsPendingApproval } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Platform admin",
};

export default async function AdminOverviewPage() {
  const isAdmin = await isCurrentUserPlatformAdmin();

  if (!isAdmin) {
    return (
      <div>
        <p className="label mb-2">Platform admin</p>
        <h1 className="font-display text-display-lg text-ink">Platform admin</h1>
        <p className="mt-4 text-sm text-smoke">
          Sign in as a platform admin to see marketplace-level metrics — no auth UI exists in this
          scaffold yet. Grant access by inserting into the `platform_admins` table.
        </p>
      </div>
    );
  }

  const pending = await listVendorsPendingApproval();

  return (
    <div>
      <p className="label mb-2">Platform admin</p>
      <h1 className="font-display text-display-lg text-ink">Overview</h1>
      <div className="mt-8 grid grid-cols-2 gap-px bg-line">
        <div className="bg-paper p-6">
          <p className="data text-2xl">{pending.length}</p>
          <p className="label mt-1">Vendors pending approval</p>
        </div>
      </div>
    </div>
  );
}
