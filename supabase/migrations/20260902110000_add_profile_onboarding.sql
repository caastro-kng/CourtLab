alter table public.profiles
add column if not exists onboarding_completed boolean;

-- Existing athletes keep their current experience; only accounts created after
-- this migration must complete the questionnaire.
update public.profiles
set onboarding_completed = true
where onboarding_completed is null;

alter table public.profiles
alter column onboarding_completed set default false,
alter column onboarding_completed set not null,
add column if not exists training_focus text,
add column if not exists training_days_per_week smallint,
add column if not exists session_duration_minutes smallint;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_training_focus_check'
  ) then
    alter table public.profiles
      add constraint profiles_training_focus_check
      check (training_focus is null or training_focus in ('ball-handle', 'shooting', 'finishing', 'passing', 'defense', 'athletic', 'complete'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_training_days_per_week_check'
  ) then
    alter table public.profiles
      add constraint profiles_training_days_per_week_check
      check (training_days_per_week is null or training_days_per_week between 2 and 6);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_session_duration_minutes_check'
  ) then
    alter table public.profiles
      add constraint profiles_session_duration_minutes_check
      check (session_duration_minutes is null or session_duration_minutes in (30, 45, 60));
  end if;
end
$$;
