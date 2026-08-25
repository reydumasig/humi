-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  career_stage text,
  resume_path text,
  resume_file_name text,
  recommended_role text,
  career_interest text,
  ai_readiness integer,
  created_at timestamptz not null default now()
);

-- RLS is enabled with no policies: the table is only ever reached through
-- the server-side service_role key (see src/lib/humi/supabase.server.ts),
-- which bypasses RLS. This blocks all direct client/anon access.
alter table public.candidates enable row level security;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;
