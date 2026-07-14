-- Sustainability Intelligence private workspace schema
-- Run this file in the Supabase SQL editor for the project used by the site.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 100),
  fit_track text not null default 'both' check (fit_track in ('expert', 'nonprofit', 'both')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intelligence_items (
  id text primary key,
  record_type text not null check (record_type in ('direct', 'signal')),
  title text not null check (char_length(title) between 1 and 240),
  summary text not null,
  source_name text not null,
  source_url text,
  source_kind text,
  published_at timestamptz,
  deadline timestamptz,
  region text,
  themes text[] not null default '{}',
  evidence_status text not null,
  confidence integer check (confidence between 0 and 100),
  individual_expert_fit jsonb not null default '{}'::jsonb,
  nonprofit_fit jsonb not null default '{}'::jsonb,
  recommended_action text,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  saved boolean not null default false,
  tracked boolean not null default false,
  dismissed boolean not null default false,
  note text check (note is null or char_length(note) <= 4000),
  next_action text check (next_action is null or char_length(next_action) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.account_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in ('export', 'delete')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists intelligence_items_set_updated_at on public.intelligence_items;
create trigger intelligence_items_set_updated_at
before update on public.intelligence_items
for each row execute function public.set_updated_at();

drop trigger if exists workspace_states_set_updated_at on public.workspace_states;
create trigger workspace_states_set_updated_at
before update on public.workspace_states
for each row execute function public.set_updated_at();

drop trigger if exists account_requests_set_updated_at on public.account_requests;
create trigger account_requests_set_updated_at
before update on public.account_requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.intelligence_items enable row level security;
alter table public.workspace_states enable row level security;
alter table public.account_requests enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.intelligence_items from anon;
revoke all on table public.workspace_states from anon;
revoke all on table public.account_requests from anon;

grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select on table public.intelligence_items to authenticated;
grant select, insert, update, delete on table public.workspace_states to authenticated;
grant select, insert on table public.account_requests to authenticated;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their profile" on public.profiles;
create policy "Users can create their profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Verified users can read published intelligence" on public.intelligence_items;
create policy "Verified users can read published intelligence"
on public.intelligence_items for select
to authenticated
using (status = 'published');

drop policy if exists "Users can read their workspace state" on public.workspace_states;
create policy "Users can read their workspace state"
on public.workspace_states for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their workspace state" on public.workspace_states;
create policy "Users can create their workspace state"
on public.workspace_states for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their workspace state" on public.workspace_states;
create policy "Users can update their workspace state"
on public.workspace_states for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their workspace state" on public.workspace_states;
create policy "Users can delete their workspace state"
on public.workspace_states for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their account requests" on public.account_requests;
create policy "Users can read their account requests"
on public.account_requests for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their account requests" on public.account_requests;
create policy "Users can create their account requests"
on public.account_requests for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
);
