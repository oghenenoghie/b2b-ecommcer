import { createClient } from "@/lib/supabase/server";
import type { MembershipRole } from "@/types";

export type CurrentMembership = {
  userId: string;
  orgId: string;
  role: MembershipRole;
  orgName: string;
  orgType: "buyer" | "vendor" | "both";
};

/**
 * The signed-in user's first org membership, or null if there's no session
 * yet (no auth UI exists in this scaffold — see AGENTS.md/README "Next
 * steps") or the user belongs to no org. Dashboard pages use this to decide
 * between an empty/unauthenticated state and real org-scoped data.
 */
export async function getCurrentMembership(): Promise<CurrentMembership | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("memberships")
    .select("org_id, role, organizations(name, type)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const org = Array.isArray(data.organizations) ? data.organizations[0] : data.organizations;
  if (!org) return null;

  return {
    userId: user.id,
    orgId: data.org_id,
    role: data.role,
    orgName: org.name,
    orgType: org.type,
  };
}

/** Convenience: the current membership's vendor row, for vendor-side pages. */
export async function getCurrentVendor() {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("vendors")
    .select("id, display_name, slug")
    .eq("org_id", membership.orgId)
    .maybeSingle();

  return data;
}
