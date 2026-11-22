begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.recipe_storage_usage (
  user_id uuid primary key references auth.users (id) on delete cascade,
  used_bytes bigint not null default 0 check (used_bytes >= 0)
);
revoke all on table private.recipe_storage_usage from public, anon, authenticated;

create table if not exists public.personal_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe jsonb not null check (jsonb_typeof(recipe) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personal_recipes_user_id_idx
  on public.personal_recipes (user_id, updated_at desc);

alter table public.personal_recipes enable row level security;
revoke all on table public.personal_recipes from public, anon, authenticated;
grant select, insert, update, delete on table public.personal_recipes to authenticated;

drop policy if exists personal_recipes_select_own on public.personal_recipes;
create policy personal_recipes_select_own
  on public.personal_recipes for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists personal_recipes_insert_own on public.personal_recipes;
create policy personal_recipes_insert_own
  on public.personal_recipes for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists personal_recipes_update_own on public.personal_recipes;
create policy personal_recipes_update_own
  on public.personal_recipes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists personal_recipes_delete_own on public.personal_recipes;
create policy personal_recipes_delete_own
  on public.personal_recipes for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.track_personal_recipe_storage()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_bytes bigint := 0;
  new_bytes bigint := 0;
  resulting_bytes bigint;
begin
  if tg_op = 'DELETE' then
    old_bytes := pg_catalog.octet_length(pg_catalog.convert_to(old.recipe::text, 'UTF8'));
    update private.recipe_storage_usage
      set used_bytes = greatest(used_bytes - old_bytes, 0)
      where user_id = old.user_id;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if new.id <> old.id or new.user_id <> old.user_id then
      raise exception 'Recipe owner and ID cannot be changed';
    end if;
    old_bytes := pg_catalog.octet_length(pg_catalog.convert_to(old.recipe::text, 'UTF8'));
  end if;

  new_bytes := pg_catalog.octet_length(pg_catalog.convert_to(new.recipe::text, 'UTF8'));
  insert into private.recipe_storage_usage (user_id, used_bytes)
    values (new.user_id, 0)
    on conflict (user_id) do nothing;

  update private.recipe_storage_usage
    set used_bytes = used_bytes - old_bytes + new_bytes
    where user_id = new.user_id
      and used_bytes - old_bytes + new_bytes <= 52428800
    returning used_bytes into resulting_bytes;

  if not found then
    raise exception 'Personal recipe storage limit is 50 MB' using errcode = '54000';
  end if;

  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists personal_recipes_track_storage on public.personal_recipes;
create trigger personal_recipes_track_storage
  before insert or update or delete on public.personal_recipes
  for each row execute function public.track_personal_recipe_storage();

commit;
