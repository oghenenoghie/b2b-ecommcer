# Supabase

Not wired up yet — this is Build order step 2 (`org`/`membership`/RLS schema,
`references/commerce.md` money fields, `references/ai-search.md` pgvector
columns).

Once a project exists:

```
npx supabase link --project-ref <project-ref>
npx supabase migration new init_schema
npx supabase db push
npx supabase gen types typescript --project-id <project-ref> > ../types/supabase.ts
```

Put schema migrations in `migrations/`, keeping RLS policies alongside the
tables they govern rather than in a separate catch-all migration.
