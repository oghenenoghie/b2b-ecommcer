import type { ShipmentEvent } from "@/types";

export function ShipmentTimeline({ events }: { events: ShipmentEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-smoke">No shipment events yet.</p>;
  }

  return (
    <ol className="space-y-4 border-l border-line pl-4">
      {events.map((event, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-ink" />
          <p className="label">{event.status}</p>
          <p className="font-mono text-xs tabular-nums text-smoke">{event.at}</p>
          {event.location ? <p className="text-sm text-ink">{event.location}</p> : null}
          {event.note ? <p className="text-sm text-smoke">{event.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
