-- Sample data for local development (`supabase db reset` runs this after
-- migrations). Everything here is free of auth.users dependencies except the
-- commented block at the bottom — memberships/carts/notifications need a
-- real authenticated user id, which only exists once you've signed one up
-- (Supabase Studio -> Authentication, or `supabase.auth.signUp`).

-- Tax rules
insert into tax_rules (country, rate_bps, effective_from) values
  ('KW', 0, '2024-01-01'),
  ('SA', 1500, '2024-01-01'),
  ('AE', 500, '2024-01-01');

-- Categories
insert into categories (id, name, slug, parent_id, path) values
  ('11111111-1111-1111-1111-111111111101', 'Bearings & Power Transmission', 'bearings', null, 'bearings'),
  ('11111111-1111-1111-1111-111111111102', 'Fasteners & Fixings', 'fasteners', null, 'fasteners'),
  ('11111111-1111-1111-1111-111111111103', 'Safety & PPE', 'safety', null, 'safety'),
  ('11111111-1111-1111-1111-111111111104', 'Marine & Offshore', 'marine', null, 'marine'),
  ('11111111-1111-1111-1111-111111111105', 'Marine Bearings', 'marine-bearings',
    '11111111-1111-1111-1111-111111111101', 'bearings.marine-bearings');

-- Orgs: two vendors, two buyers
insert into organizations (id, name, slug, type, status, country, currency, tax_id) values
  ('22222222-2222-2222-2222-222222222201', 'Gulf Bearing Co.', 'gulf-bearing-co', 'vendor', 'active', 'KW', 'KWD', 'KW-VAT-001'),
  ('22222222-2222-2222-2222-222222222202', 'Al-Rashid Industrial Supply', 'al-rashid-industrial', 'vendor', 'active', 'KW', 'KWD', 'KW-VAT-002'),
  ('22222222-2222-2222-2222-222222222203', 'Port of Shuwaikh Marine Services', 'port-shuwaikh-marine', 'buyer', 'active', 'KW', 'KWD', null),
  ('22222222-2222-2222-2222-222222222204', 'Desert Fabrication LLC', 'desert-fabrication', 'buyer', 'active', 'KW', 'KWD', null);

insert into vendors (id, org_id, display_name, slug, bio, approved_at) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201',
    'Gulf Bearing Co.', 'gulf-bearing-co',
    'Marine and industrial bearings, saltwater-rated, stocked in Kuwait.', now()),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202',
    'Al-Rashid Industrial Supply', 'al-rashid-industrial',
    'Fasteners, fixings, and safety equipment for GCC industrial buyers.', now());

-- Products — a mix of priced (instant checkout) and POA/quote-only.
insert into products (id, vendor_id, category_id, title, slug, description, specs, status, moq, lead_time_days, base_price, currency) values
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111105', 'Marine Bearing 6205-2RS Saltwater Rated', 'marine-bearing-6205-2rs',
    'Sealed deep-groove ball bearing rated for continuous saltwater exposure. Stainless races.',
    '{"bore_mm": 25, "od_mm": 52, "width_mm": 15, "seal": "2RS", "material": "stainless"}', 'active', 10, 5, 4500, 'KWD'),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111105', 'Marine Bearing 6308 Heavy Duty', 'marine-bearing-6308-heavy-duty',
    'Heavy-duty bearing for marine winches and deck machinery.',
    '{"bore_mm": 40, "od_mm": 90, "width_mm": 23, "material": "chrome steel"}', 'active', 20, 10, null, 'KWD'),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111102', 'Stainless Hex Bolt M12x50 (Box of 100)', 'stainless-hex-bolt-m12x50',
    'A4-80 marine-grade stainless hex bolts, box of 100.',
    '{"thread": "M12", "length_mm": 50, "grade": "A4-80"}', 'active', 5, 3, 1800, 'KWD'),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111103', 'Industrial Safety Harness Kit', 'industrial-safety-harness-kit',
    'Full-body harness + lanyard, EN 361 certified.',
    '{"standard": "EN 361", "max_load_kg": 140}', 'active', 1, 2, 3200, 'KWD');

insert into product_variants (product_id, sku, attrs, price, stock_qty) values
  ('44444444-4444-4444-4444-444444444401', 'GBC-6205-2RS-BLK', '{"finish": "black oxide"}', 4500, 240),
  ('44444444-4444-4444-4444-444444444403', 'ARI-BOLT-M12X50-100', '{}', 1800, 60);

insert into price_tiers (product_id, min_qty, unit_price) values
  ('44444444-4444-4444-4444-444444444401', 50, 4200),
  ('44444444-4444-4444-4444-444444444401', 200, 3900),
  ('44444444-4444-4444-4444-444444444403', 20, 1650);

insert into media (product_id, storage_path, alt, is_primary, sort) values
  ('44444444-4444-4444-4444-444444444401', 'products/marine-bearing-6205-2rs/main.jpg', 'Marine Bearing 6205-2RS', true, 0),
  ('44444444-4444-4444-4444-444444444402', 'products/marine-bearing-6308/main.jpg', 'Marine Bearing 6308', true, 0),
  ('44444444-4444-4444-4444-444444444403', 'products/stainless-hex-bolt-m12x50/main.jpg', 'Stainless Hex Bolt M12x50', true, 0),
  ('44444444-4444-4444-4444-444444444404', 'products/safety-harness-kit/main.jpg', 'Industrial Safety Harness Kit', true, 0);

-- An RFQ on the quote-only bearing, and the vendor's response.
insert into rfqs (id, buyer_org_id, status) values
  ('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222203', 'quoted');

insert into rfq_items (rfq_id, product_id, qty, target_price, notes) values
  ('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444402', 50, 8000,
    'Need these for a winch overhaul, delivery to Shuwaikh port.');

insert into quotes (id, rfq_id, vendor_id, valid_until, lines, total, currency, status) values
  ('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501',
    '33333333-3333-3333-3333-333333333301', now() + interval '14 days',
    '[{"product_id": "44444444-4444-4444-4444-444444444402", "qty": 50, "unit_price": 8200}]',
    410000, 'KWD', 'sent');

-- A confirmed order + invoice + shipment on the priced bearing.
insert into orders (id, buyer_org_id, vendor_id, po_number, status, subtotal, tax, total, currency) values
  ('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222204',
    '33333333-3333-3333-3333-333333333301', 'PO-2026-0142', 'shipped', 90000, 0, 90000, 'KWD');

insert into order_items (order_id, product_id, qty, unit_price) values
  ('77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', 20, 4500);

-- Via next_invoice_number() so invoice_counters stays consistent with any
-- invoices created later through the same function.
insert into invoices (order_id, number, terms, due_at, amount, currency, status)
select
  '77777777-7777-7777-7777-777777777701',
  next_invoice_number('33333333-3333-3333-3333-333333333301'),
  'net_30', now() + interval '20 days', 90000, 'KWD', 'sent';

insert into shipments (order_id, carrier, tracking_number, status, events, shipped_at) values
  ('77777777-7777-7777-7777-777777777701', 'Aramex', 'ARX-KW-88213', 'in_transit',
    '[{"at": "2026-07-28T09:00:00Z", "status": "confirmed"}, {"at": "2026-07-30T14:00:00Z", "status": "shipped", "location": "Shuwaikh Port"}]',
    now() - interval '3 days');

insert into reviews (product_id, buyer_org_id, rating, body) values
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222204', 5,
    'Held up through a full season of saltwater exposure, no corrosion on the races.');

-- Uncomment and adapt once you've created a real user (Supabase Studio ->
-- Authentication -> Add user), substituting its id below:
--
-- insert into memberships (user_id, org_id, role) values
--   ('<auth-user-id>', '22222222-2222-2222-2222-222222222201', 'owner');
--
-- insert into carts (org_id, user_id) values
--   ('22222222-2222-2222-2222-222222222204', '<auth-user-id>');
