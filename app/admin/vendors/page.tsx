import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { isCurrentUserPlatformAdmin, listVendorsPendingApproval } from "@/lib/data/admin";
import { approveVendor } from "@/lib/actions/admin";

export const metadata: Metadata = {
  title: "Vendor approvals",
};

export default async function AdminVendorsPage() {
  const isAdmin = await isCurrentUserPlatformAdmin();

  if (!isAdmin) {
    return (
      <div>
        <p className="label mb-2">Vendor approvals</p>
        <h1 className="font-display text-display-lg text-ink">Vendor approvals</h1>
        <p className="mt-4 text-sm text-smoke">Sign in as a platform admin to approve vendors.</p>
      </div>
    );
  }

  const pending = await listVendorsPendingApproval();

  return (
    <div>
      <p className="label mb-2">Vendor approvals</p>
      <h1 className="font-display text-display-lg text-ink">Pending vendors</h1>

      {pending.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No vendors awaiting approval.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line bg-paper">
          {pending.map((vendor) => (
            <li key={vendor.id} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm text-ink">{vendor.displayName}</p>
                <p className="text-xs text-smoke">{vendor.orgName}</p>
              </div>
              <form action={approveVendor}>
                <input type="hidden" name="vendorId" value={vendor.id} />
                <Button type="submit" size="sm">
                  Approve
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
