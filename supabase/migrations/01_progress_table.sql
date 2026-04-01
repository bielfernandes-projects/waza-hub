-- Create the progress table
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  technique_id text not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- ensure a user can only have one progress record per technique
  unique(user_id, technique_id)
);

-- Turn on Row Level Security
alter table public.progress enable row level security;

-- Policies
create policy "Users can view their own progress"
  on public.progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own progress"
  on public.progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own progress"
  on public.progress for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own progress"
  on public.progress for delete
  using ( auth.uid() = user_id );
