# 🎯 Tabela de Prompts Customizados

## SQL para criar a tabela

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de prompts customizados
CREATE TABLE custom_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  icon TEXT DEFAULT 'sparkles',
  color TEXT DEFAULT 'yellow',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_custom_prompts_user_id ON custom_prompts(user_id);
CREATE INDEX idx_custom_prompts_order ON custom_prompts(user_id, order_index);

-- Trigger para updated_at
CREATE TRIGGER update_custom_prompts_updated_at
  BEFORE UPDATE ON custom_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE custom_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON custom_prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own prompts"
  ON custom_prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON custom_prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON custom_prompts FOR DELETE
  USING (auth.uid() = user_id);
```
