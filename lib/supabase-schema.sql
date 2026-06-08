-- Optional starter schema for future Supabase integration.
-- Current MVP uses mock data in lib/mock-data.ts.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  default_city text,
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  venue text,
  address text,
  city text,
  neighborhood text,
  start_time timestamptz not null,
  end_time timestamptz,
  price numeric default 0,
  capacity int,
  age_restriction text,
  dress_code text,
  accessibility_notes text,
  safety_notes text,
  organizer_name text,
  verified_organizer boolean default false,
  created_at timestamptz default now()
);

create type rsvp_status as enum ('pending', 'locked', 'revealed', 'attended', 'cancelled');

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  status rsvp_status default 'locked',
  selected_date date,
  selected_time_range text,
  radius int,
  budget_max numeric,
  categories text[],
  reveal_at timestamptz,
  created_at timestamptz default now()
);
