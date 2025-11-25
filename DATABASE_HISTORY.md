# 📜 Histórico de Transcrições

## SQL para criar a tabela

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de histórico de transcrições
CREATE TABLE transcription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  transcription_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_transcription_history_user_id ON transcription_history(user_id);
CREATE INDEX idx_transcription_history_created_at ON transcription_history(user_id, created_at DESC);

-- RLS
ALTER TABLE transcription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transcriptions"
  ON transcription_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transcriptions"
  ON transcription_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transcriptions"
  ON transcription_history FOR DELETE
  USING (auth.uid() = user_id);
```
