-- Extensions used across the schema:
--   pgcrypto  -> gen_random_uuid() for primary keys
--   vector    -> pgvector, product embeddings (hybrid semantic search)
--   pg_trgm   -> fuzzy part-number / title matching, fused with vector search
create extension if not exists pgcrypto;
create extension if not exists vector;
create extension if not exists pg_trgm;
