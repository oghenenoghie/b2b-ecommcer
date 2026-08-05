import type { Money } from "@/lib/money";

// Hand-written domain types mirroring the data model in SKILL.md, ahead of
// the generated `types/supabase.ts`. Keep field names in sync with the
// schema introduced in Build order step 2.

export type OrgType = "buyer" | "vendor" | "both";
export type OrgStatus = "pending" | "active" | "suspended";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  status: OrgStatus;
  country: string;
  currency: string;
  tax_id: string | null;
};

export type MembershipRole = "owner" | "admin" | "buyer" | "manager" | "viewer";

export type Membership = {
  user_id: string;
  org_id: string;
  role: MembershipRole;
};

export type Vendor = {
  id: string;
  org_id: string;
  display_name: string;
  slug: string;
  bio: string | null;
  logo_url: string | null;
  banner_url: string | null;
  rating_avg: number | null;
  approved_at: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  path: string;
};

export type ProductStatus = "draft" | "active" | "archived";

export type Product = {
  id: string;
  vendor_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  specs: Record<string, unknown>;
  status: ProductStatus;
  moq: number;
  lead_time_days: number | null;
  /** null = quote-only / POA — cannot be added to cart, only RFQ'd. */
  base_price: number | null;
  currency: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  attrs: Record<string, unknown>;
  price: number;
  stock_qty: number;
};

export type PriceTier = {
  id: string;
  product_id: string;
  variant_id: string | null;
  min_qty: number;
  unit_price: number;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  qty: number;
  unit_price_snapshot: number;
};

export type Cart = {
  id: string;
  org_id: string;
  user_id: string;
  items: CartItem[];
};

export type RfqStatus = "open" | "quoted" | "accepted" | "declined" | "expired";

export type RfqItem = {
  id: string;
  rfq_id: string;
  product_id: string;
  qty: number;
  target_price: number | null;
  notes: string | null;
};

export type Rfq = {
  id: string;
  buyer_org_id: string;
  status: RfqStatus;
  items: RfqItem[];
};

export type QuoteLine = { product_id: string; qty: number; unit_price: number };

export type Quote = {
  id: string;
  rfq_id: string;
  vendor_id: string;
  valid_until: string;
  lines: QuoteLine[];
  total: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "fulfilling"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  qty: number;
  unit_price: number;
};

export type Order = {
  id: string;
  buyer_org_id: string;
  vendor_id: string;
  po_number: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  items: OrderItem[];
};

export type InvoiceTerms = "prepaid" | "net_15" | "net_30";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Invoice = {
  id: string;
  order_id: string;
  number: string;
  terms: InvoiceTerms;
  issued_at: string;
  due_at: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
};

export type PaymentProvider = "tap" | "myfatoorah" | "stripe";

export type Payment = {
  id: string;
  invoice_id: string;
  provider: PaymentProvider;
  provider_ref: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
};

export type ShipmentEvent = {
  at: string;
  status: string;
  location?: string;
  note?: string;
};

export type Shipment = {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string | null;
  status: string;
  events: ShipmentEvent[];
  shipped_at: string | null;
  delivered_at: string | null;
};

export type Review = {
  id: string;
  product_id: string;
  buyer_org_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  read_at: string | null;
};

// Convenience view used by product cards / search results.
export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  vendor: Pick<Vendor, "slug" | "display_name">;
  price: Money | null; // null when quote-only
  moq: number;
  inStock: boolean;
  imageUrl: string | null;
};
