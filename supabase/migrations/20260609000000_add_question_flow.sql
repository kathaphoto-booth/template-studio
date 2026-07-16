-- Migration to add question_responses JSONB column to leads table
-- Enables tracking of dynamic questionnaire and AI-summarized insights

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'leads'
        AND column_name = 'question_responses'
    ) THEN
        ALTER TABLE public.leads 
        ADD COLUMN question_responses JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;
