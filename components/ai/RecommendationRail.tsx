// "Similar products" / "frequently sourced with" — vector neighbours +
// co-purchase (Build order step 8, references/ai-search.md #4).
export function RecommendationRail({ title }: { title: string }) {
  return (
    <section className="space-y-4">
      <p className="label">{title}</p>
      <p className="text-sm text-smoke">Recommendations populate once the catalog has orders.</p>
    </section>
  );
}
