import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { MembershipRole } from "@/types";

export type TeamMemberRow = { userId: string; role: MembershipRole };

export async function listCurrentOrgTeam(): Promise<TeamMemberRow[] | null> {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("user_id, role")
    .eq("org_id", membership.orgId)
    .order("role");

  if (error || !data) {
    if (error) console.error("listCurrentOrgTeam", error.message);
    return [];
  }

  return data.map((row) => ({ userId: row.user_id, role: row.role }));
}
