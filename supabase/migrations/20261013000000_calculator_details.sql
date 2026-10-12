-- Sizing inputs and recommended models for each calculator run (duty, site, largest motor, picks …).
alter table public.calculator_submissions add column if not exists details jsonb;
