-- Run this in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

-- ─────────────────────────────────────────────
-- Table: generations
-- ─────────────────────────────────────────────
create table if not exists public.generations (
  id            uuid primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  original_text text not null,
  modes         text[] not null default '{}',
  titles        text[] not null default '{}',
  captions      text[] not null default '{}',
  seo_descriptions text[] not null default '{}',
  hashtags      text[] not null default '{}',
  hooks         text[] not null default '{}',
  created_at    bigint not null
);

-- Index for fast per-user queries ordered by time
create index if not exists generations_user_created
  on public.generations (user_id, created_at desc);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.generations enable row level security;

-- Users can only read their own rows
create policy "select_own_generations"
  on public.generations for select
  using (auth.uid() = user_id);

-- Users can only insert their own rows
create policy "insert_own_generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "delete_own_generations"
  on public.generations for delete
  using (auth.uid() = user_id);
