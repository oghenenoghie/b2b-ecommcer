# Aswaq

An AI-powered B2B multi-vendor marketplace for wholesale and industrial
procurement — Next.js 14+ App Router, Supabase (Postgres + pgvector), and a
Claude-powered procurement assistant, styled with a black-and-white editorial
design system.

Full project context, data model, RLS model, and build order live in the
`aswaq-b2b-marketplace` Claude Code skill — see `SKILL.md` and
`references/{ai-search,commerce,design-system}.md` there for the source of
truth this scaffold follows.

## Stack

Next.js (App Router, TypeScript strict) · Tailwind CSS v3 + shadcn/ui (Radix)
· Framer Motion · Supabase (Postgres, Auth, RLS, Storage, Realtime) ·
pgvector + Postgres FTS · Anthropic (Claude) tool-calling · OpenAI embeddings
· Tap/MyFatoorah + Stripe · Resend.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Anthropic/OpenAI keys
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck

## Project status

This is a **Build order step 1** scaffold: repo, Next.js, Tailwind, fonts,
design tokens, full route/folder structure, and CI are in place. No Supabase
schema exists yet — `types/supabase.ts` is a permissive placeholder and
`lib/search.ts` / `app/api/assistant` call an RPC (`search_products`) that
doesn't exist until the schema below is applied.

Next steps, in order (see the skill for full detail on each):

1. ~~Repo + Next.js + Tailwind + fonts + tokens; CI + Vercel~~ — done here.
2. Supabase schema: orgs/membership/RLS + the rest of the data model.
3. Catalog: categories, products, media, product detail + facets.
4. Hybrid search — pgvector + FTS RPC + embedding backfill worker.
5. AI procurement assistant — wire `/api/assistant` to real data.
6. Commerce: cart → per-vendor split → RFQ/quote → order → invoice → payment
   → shipment tracking.
7. Dashboards (buyer/vendor/admin) + Realtime notifications.
8. Recommendations, reviews, SEO, analytics, polish.

## Design system

Near-monochrome editorial system — see
`references/design-system.md` in the skill for the full token set and
component recipes. Tokens are wired into `tailwind.config.ts`; fonts
(Newsreader/Inter/IBM Plex Mono) into `lib/fonts.ts`.
