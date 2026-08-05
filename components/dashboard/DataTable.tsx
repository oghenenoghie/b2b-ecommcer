// Generic dashboard table shell — label-role header, hairline row rules,
// numeric columns right-aligned mono/tabular-nums (design-system.md).
export function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, React.ReactNode>[];
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-ink">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`label py-2 ${col.align === "right" ? "text-right" : "text-left"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-line">
            {columns.map((col) => (
              <td
                key={col.key}
                className={`py-3 text-ink ${col.align === "right" ? "text-right font-mono tabular-nums" : ""}`}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
