// Placeholder — replace by running, once the schema from Build order step 2
// (references/ai-search.md, references/commerce.md) is applied to Supabase:
//
//   npx supabase gen types typescript --project-id <project-ref> > types/supabase.ts
//
// Domain types in ./index.ts are hand-written in the meantime and should be
// reconciled with the generated `Database` type once it exists.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Permissive placeholder shape (not `Record<string, never>`) so `.from()` /
// `.rpc()` calls type-check loosely until the real generated types land —
// swap the whole file for the `supabase gen types` output at that point.
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
  };
};
