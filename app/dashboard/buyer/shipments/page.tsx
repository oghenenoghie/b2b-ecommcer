import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipments",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Shipments</p>
      <h1 className="font-display text-display-lg text-ink">Shipments</h1>
      <p className="mt-4 text-sm text-smoke">Live shipment timelines (Realtime) land in Build order step 6.</p>
    </div>
  );
}
