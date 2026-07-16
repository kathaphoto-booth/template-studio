-- Create available_dates table
CREATE TABLE public.available_dates (
    date DATE PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('open', 'booked')),
    note TEXT
);

-- Create selections table
CREATE TABLE public.selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead TEXT,
    template_name TEXT,
    names TEXT,
    date DATE,
    venue TEXT,
    service_tier TEXT,
    configuration JSONB
);

-- Enable RLS
ALTER TABLE public.available_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;

-- Policies for available_dates
-- Public can SELECT
CREATE POLICY "Public can select available_dates"
    ON public.available_dates FOR SELECT
    TO anon
    USING (true);

-- Policies for selections
-- anon can insert
CREATE POLICY "Anon can insert selections"
    ON public.selections FOR INSERT
    TO anon
    WITH CHECK (true);
