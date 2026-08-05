import type { Metadata } from "next";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listCurrentOrgTeam } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Team",
};

export default async function BuyerTeamPage() {
  const team = await listCurrentOrgTeam();

  return (
    <div>
      <p className="label mb-2">Team</p>
      <h1 className="font-display text-display-lg text-ink">Team</h1>

      {team === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a buyer org to see your team.</p>
      ) : team.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No teammates yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "user", label: "User" },
              { key: "role", label: "Role" },
            ]}
            rows={team.map((member) => ({
              user: <span className="font-mono text-xs tabular-nums text-smoke">{member.userId}</span>,
              role: <Badge>{member.role}</Badge>,
            }))}
          />
        </div>
      )}
    </div>
  );
}
