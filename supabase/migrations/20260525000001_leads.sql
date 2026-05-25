-- EWasteKochi leads table
-- DPDP-compliant: no raw PII beyond name/email/phone; IP stored as SHA-256 hash

create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  email         text        not null,
  phone         text,
  company       text,
  service       text        not null default 'general',
  message       text        not null,

  -- Attribution
  source_url    text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,

  -- Privacy-safe fingerprinting
  ip_hash       text,           -- SHA-256(ip + salt), never raw IP
  user_agent    text,

  -- CRM lifecycle
  status        text        not null default 'new'
                            check (status in ('new','contacted','qualified','converted','lost')),
  notes         text,
  assigned_to   text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- Indexes for common query patterns
create index leads_status_idx       on leads (status);
create index leads_service_idx      on leads (service);
create index leads_created_at_idx   on leads (created_at desc);
create index leads_utm_source_idx   on leads (utm_source) where utm_source is not null;

-- Row-level security
alter table leads enable row level security;

-- Service role can do everything (used by the API route)
create policy "service role full access"
  on leads
  for all
  to service_role
  using (true)
  with check (true);

-- No anon or authenticated access (leads are internal-only)
