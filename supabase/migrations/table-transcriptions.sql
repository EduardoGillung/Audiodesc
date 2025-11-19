-- Create transcriptions table
CREATE TABLE IF NOT EXISTS public.transcriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    transcription_text TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS transcriptions_user_id_idx ON public.transcriptions(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS transcriptions_created_at_idx ON public.transcriptions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own transcriptions
CREATE POLICY "Users can view their own transcriptions"
    ON public.transcriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy for users to insert their own transcriptions
CREATE POLICY "Users can insert their own transcriptions"
    ON public.transcriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own transcriptions
CREATE POLICY "Users can update their own transcriptions"
    ON public.transcriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy for users to delete their own transcriptions
CREATE POLICY "Users can delete their own transcriptions"
    ON public.transcriptions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.transcriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
