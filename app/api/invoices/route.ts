import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Server-side invoice PDF generation + Supabase Storage upload, emailed via
// Resend (Build order step 6, references/commerce.md "Invoices").
export async function POST(req: Request) {
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // TODO(build order step 6): allocate the sequential per-vendor invoice
  // number inside the txn, render the PDF, store it, send via Resend.
  return NextResponse.json({ orderId, status: "not_implemented" }, { status: 501 });
}
