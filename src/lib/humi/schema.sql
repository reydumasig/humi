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

create table if not exists public.job_postings (
  id text primary key,
  title text not null,
  company text not null,
  company_blurb text not null,
  location text not null,
  work_type text not null,
  salary text not null,
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  ai_tools text not null,
  skills text[] not null default '{}',
  families text[] not null default '{}',
  interview_dates text[] not null default '{}',
  interview_slots text[] not null default '{}',
  interview_mode text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.job_postings enable row level security;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id text not null references public.job_postings(id) on delete cascade,
  job_title text not null,
  company text not null,
  candidate_name text not null,
  email text not null,
  phone text,
  note text,
  interview_date text not null,
  interview_time text not null,
  interview_mode text not null,
  created_at timestamptz not null default now()
);

alter table public.job_applications enable row level security;
