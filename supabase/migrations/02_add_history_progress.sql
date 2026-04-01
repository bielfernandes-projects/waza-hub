-- Step 1: Rename the column to be generic
ALTER TABLE public.progress 
RENAME COLUMN technique_id TO reference_id;

-- Step 2: Add the type column
ALTER TABLE public.progress 
ADD COLUMN type text DEFAULT 'technique' NOT NULL;

-- Step 3: Replace the unique constraint
-- PostgreSQL auto-names unique constraints from create table as tablename_col1_col2_key
ALTER TABLE public.progress 
DROP CONSTRAINT IF EXISTS progress_user_id_technique_id_key;

ALTER TABLE public.progress 
ADD CONSTRAINT progress_user_id_reference_id_type_key UNIQUE (user_id, reference_id, type);
