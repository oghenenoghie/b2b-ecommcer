import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Webhook-driven payment truth — never mark an invoice paid from the client.
// Verify the provider signature, then update `payments` + `invoices.status`
// in one transaction and emit a notification (Build order step 6,
// references/commerce.md "Payments"). Provider adapters live in
// lib/payments/index.ts.
export async function POST(req: Request) {
  const signature = req.headers.get("x-webhook-signature");
  const payload = await req.text();

  // TODO(build order step 6): dispatch to the correct PaymentAdapter based
  // on the provider indicated by the route/header, verify signature, then
  // apply the update inside a Supabase transaction (admin client).
  void signature;
  void payload;

  return NextResponse.json({ received: true });
}
