// Hand-authored to match supabase/migrations/0001-0008. Regenerate from a
// real linked project once one exists:
//
//   npx supabase gen types typescript --project-id <project-ref> > types/supabase.ts
//
// ...and diff against this file to catch drift. types/index.ts's
// hand-written domain types should stay reconciled with this file.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type OrgType = "buyer" | "vendor" | "both";
type OrgStatus = "pending" | "active" | "suspended";
type MembershipRole = "owner" | "admin" | "buyer" | "manager" | "viewer";
type ProductStatus = "draft" | "active" | "archived";
type RfqStatus = "open" | "quoted" | "accepted" | "declined" | "expired";
type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
type OrderStatus = "pending" | "confirmed" | "fulfilling" | "shipped" | "completed" | "cancelled";
type InvoiceTerms = "prepaid" | "net_15" | "net_30";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
type PaymentProvider = "tap" | "myfatoorah" | "stripe";
type PaymentStatus = "pending" | "succeeded" | "failed";

// `Relationships` entries mirror what `supabase gen types` emits from
// pg_constraint — verified against supabase/migrations/*.sql with a scratch
// Postgres instance (see PR/commit notes), not guessed.
export type Database = {
  public: {
    Tables: {
      platform_admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: OrgType;
          status: OrgStatus;
          country: string;
          currency: string;
          tax_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type: OrgType;
          status?: OrgStatus;
          country: string;
          currency: string;
          tax_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
        Relationships: [];
      };
      memberships: {
        Row: { user_id: string; org_id: string; role: MembershipRole; created_at: string };
        Insert: { user_id: string; org_id: string; role: MembershipRole; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "memberships_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      vendors: {
        Row: {
          id: string;
          org_id: string;
          display_name: string;
          slug: string;
          bio: string | null;
          logo_url: string | null;
          banner_url: string | null;
          rating_avg: number | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          display_name: string;
          slug: string;
          bio?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          rating_avg?: number | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "vendors_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: true;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          path?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string;
          specs: Json;
          status: ProductStatus;
          moq: number;
          lead_time_days: number | null;
          base_price: number | null;
          currency: string;
          embedding: number[] | null;
          fts: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          category_id?: string | null;
          title: string;
          slug: string;
          description?: string;
          specs?: Json;
          status?: ProductStatus;
          moq?: number;
          lead_time_days?: number | null;
          base_price?: number | null;
          currency: string;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          attrs: Json;
          price: number;
          stock_qty: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          attrs?: Json;
          price: number;
          stock_qty?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      price_tiers: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          min_qty: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          min_qty: number;
          unit_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["price_tiers"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "price_tiers_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_tiers_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt: string | null;
          is_primary: boolean;
          sort: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt?: string | null;
          is_primary?: boolean;
          sort?: number;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "media_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      embed_queue: {
        Row: { id: number; product_id: string; enqueued_at: string; processed_at: string | null };
        Insert: { id?: number; product_id: string; enqueued_at?: string; processed_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["embed_queue"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "embed_queue_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      carts: {
        Row: { id: string; org_id: string; user_id: string; created_at: string; updated_at: string };
        Insert: { id?: string; org_id: string; user_id: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "carts_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: true;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          variant_id: string | null;
          qty: number;
          unit_price_snapshot: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          variant_id?: string | null;
          qty: number;
          unit_price_snapshot: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      rfqs: {
        Row: { id: string; buyer_org_id: string; status: RfqStatus; created_at: string; updated_at: string };
        Insert: { id?: string; buyer_org_id: string; status?: RfqStatus; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["rfqs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rfqs_buyer_org_id_fkey";
            columns: ["buyer_org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      rfq_items: {
        Row: {
          id: string;
          rfq_id: string;
          product_id: string;
          qty: number;
          target_price: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          product_id: string;
          qty: number;
          target_price?: number | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["rfq_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rfq_items_rfq_id_fkey";
            columns: ["rfq_id"];
            isOneToOne: false;
            referencedRelation: "rfqs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rfq_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          id: string;
          rfq_id: string;
          vendor_id: string;
          valid_until: string;
          lines: Json;
          total: number;
          currency: string;
          status: QuoteStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          vendor_id: string;
          valid_until: string;
          lines?: Json;
          total: number;
          currency: string;
          status?: QuoteStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "quotes_rfq_id_fkey";
            columns: ["rfq_id"];
            isOneToOne: false;
            referencedRelation: "rfqs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      tax_rules: {
        Row: {
          id: string;
          country: string;
          rate_bps: number;
          effective_from: string;
          effective_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          country: string;
          rate_bps: number;
          effective_from: string;
          effective_to?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tax_rules"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          buyer_org_id: string;
          vendor_id: string;
          po_number: string | null;
          status: OrderStatus;
          subtotal: number;
          tax: number;
          total: number;
          currency: string;
          tax_rule_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_org_id: string;
          vendor_id: string;
          po_number?: string | null;
          status?: OrderStatus;
          subtotal: number;
          tax?: number;
          total: number;
          currency: string;
          tax_rule_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_buyer_org_id_fkey";
            columns: ["buyer_org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_tax_rule_id_fkey";
            columns: ["tax_rule_id"];
            isOneToOne: false;
            referencedRelation: "tax_rules";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          qty: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          qty: number;
          unit_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_counters: {
        Row: { vendor_id: string; last_number: number };
        Insert: { vendor_id: string; last_number?: number };
        Update: Partial<Database["public"]["Tables"]["invoice_counters"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "invoice_counters_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: true;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
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
        Insert: {
          id?: string;
          order_id: string;
          number: string;
          terms: InvoiceTerms;
          issued_at?: string;
          due_at: string;
          amount: number;
          currency: string;
          status?: InvoiceStatus;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          provider: PaymentProvider;
          provider_ref: string;
          amount: number;
          currency: string;
          status: PaymentStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          provider: PaymentProvider;
          provider_ref: string;
          amount: number;
          currency: string;
          status?: PaymentStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          carrier: string | null;
          tracking_number: string | null;
          status: string;
          events: Json;
          shipped_at: string | null;
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          carrier?: string | null;
          tracking_number?: string | null;
          status?: string;
          events?: Json;
          shipped_at?: string | null;
          delivered_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["shipments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: true;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          buyer_org_id: string;
          rating: number;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          buyer_org_id: string;
          rating: number;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_buyer_org_id_fkey";
            columns: ["buyer_org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          payload: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          payload?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_org_member: { Args: { target_org: string }; Returns: boolean };
      has_org_role: { Args: { target_org: string; roles: string[] }; Returns: boolean };
      is_platform_admin: { Args: Record<string, never>; Returns: boolean };
      next_invoice_number: { Args: { target_vendor: string }; Returns: string };
      search_products: {
        Args: {
          query_text: string;
          query_embedding: number[];
          filter_category?: string | null;
          max_price_minor?: number | null;
          min_qty?: number | null;
          match_limit?: number;
        };
        Returns: Database["public"]["Tables"]["products"]["Row"][];
      };
    };
    Enums: Record<string, never>;
  };
};
