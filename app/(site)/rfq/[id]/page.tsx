export default async function RfqThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="label mb-2">RFQ thread</p>
      <h1 className="font-display text-display-lg text-ink">RFQ {id}</h1>
      <p className="mt-4 text-sm text-smoke">
        RFQ → quote → order thread with audit trail lands in Build order step 6.
      </p>
    </div>
  );
}
