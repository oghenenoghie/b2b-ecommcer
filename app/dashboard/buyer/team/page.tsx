import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Team</p>
      <h1 className="font-display text-display-lg text-ink">Team</h1>
      <p className="mt-4 text-sm text-smoke">Org membership + role management lands in Build order step 2.</p>
    </div>
  );
}
