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

Repo, Next.js, Tailwind, fonts, design tokens, full route/folder structure,
CI, the complete Supabase schema (`supabase/migrations/0001`-`0008`, RLS
included), and every page's UI are in place and wired to real (typed)
Supabase queries — see `lib/data/*` and `lib/actions/*`. `types/supabase.ts`
is hand-authored to match the migrations (verified against a scratch
Postgres instance); swap it for real `supabase gen types` output once a
project is linked.

There is **no Supabase project connected yet** in this environment and no
auth UI, so every page degrades gracefully to an empty/"sign in" state
rather than crashing (verified: `npm run build` + a dev-server smoke test
against a placeholder `NEXT_PUBLIC_SUPABASE_URL`). Point `.env.local` at a
real project and run `supabase db reset` (see `supabase/README.md`) to see
it fully populated from `supabase/seed.sql`.

Next steps, in order (see the skill for full detail on each):

1. ~~Repo + Next.js + Tailwind + fonts + tokens; CI + Vercel~~ — done here.
2. ~~Supabase schema: orgs/membership/RLS + the rest of the data model~~ —
   done here (`supabase/migrations/`).
3. ~~Catalog: categories, products, media, product detail + facets~~ — done
   here, pending real product photography/Storage bucket.
4. ~~Hybrid search — pgvector + FTS RPC~~ — done here; the embedding
   backfill worker (a scheduled job draining `embed_queue`) is not.
5. AI procurement assistant — `/api/assistant` is wired to the real search
   path; needs an `ANTHROPIC_API_KEY` + `OPENAI_API_KEY` to actually run.
6. ~~Commerce: cart → per-vendor split → RFQ/quote → order → invoice~~ —
   done here; payment capture (Tap/MyFatoorah/Stripe webhooks) needs real
   provider credentials, so invoices land in `sent` status awaiting payment.
7. ~~Dashboards (buyer/vendor/admin)~~ — done here, reading live data;
   Realtime notifications are not wired.
8. Recommendations, reviews (write path exists, no UI to post one yet), SEO,
   analytics polish, auth UI (there is currently no way to sign in/up).

## Design system

Near-monochrome editorial system — see
`references/design-system.md` in the skill for the full token set and
component recipes. Tokens are wired into `tailwind.config.ts`; fonts
(Newsreader/Inter/IBM Plex Mono) into `lib/fonts.ts`.
