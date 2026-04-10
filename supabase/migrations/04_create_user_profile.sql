-- Create the user_profile table
create table public.user_profile (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null unique,
    full_name text not null,
    birth_date date not null,
    dojo_name text,
    belt_id text not null,
    belt_graduation_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.user_profile enable row level security;

-- Policies

-- Users can view their own profile
create policy "Users can view own profile" 
on public.user_profile for select 
using (auth.uid() = user_id);

-- Users can insert their own profile
create policy "Users can insert own profile" 
on public.user_profile for insert 
with check (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own profile" 
on public.user_profile for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
