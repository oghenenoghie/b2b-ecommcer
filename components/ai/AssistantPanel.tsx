"use client";

// AI procurement assistant panel — natural language in, grounded product
// cards out. Wires to /api/assistant once the search_products RPC exists
// (Build order steps 4-5, references/ai-search.md).
export function AssistantPanel() {
  return (
    <div className="border border-line bg-bone p-6">
      <p className="label mb-2">Procurement assistant</p>
      <p className="text-sm text-smoke">
        Coming in Build order step 5 — Claude tool-calling over the product catalog.
      </p>
    </div>
  );
}
