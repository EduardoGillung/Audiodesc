# 🗄️ Configuração do Banco de Dados - Supabase PostgreSQL

## 📊 Estrutura do Banco de Dados

O sistema utiliza **1 tabela principal** para armazenar as transcrições de áudio.

---

## 🔧 Configuração no Supabase

### 1. Acesse o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral

---

## 📝 Criação da Tabela

### Tabela: `transcriptions`

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela de transcrições
CREATE TABLE transcriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcription_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_transcriptions_user_id ON transcriptions(user_id);
CREATE INDEX idx_transcriptions_created_at ON transcriptions(created_at DESC);
CREATE INDEX idx_transcriptions_status ON transcriptions(status);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_transcriptions_updated_at
  BEFORE UPDATE ON transcriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Adicionar comentários nas colunas (documentação)
COMMENT ON TABLE transcriptions IS 'Armazena todas as transcrições de áudio dos usuários';
COMMENT ON COLUMN transcriptions.id IS 'ID único da transcrição';
COMMENT ON COLUMN transcriptions.user_id IS 'ID do usuário que criou a transcrição';
COMMENT ON COLUMN transcriptions.title IS 'Título ou nome do arquivo de áudio';
COMMENT ON COLUMN transcriptions.audio_url IS 'URL ou caminho do arquivo de áudio original';
COMMENT ON COLUMN transcriptions.transcription_text IS 'Texto transcrito do áudio';
COMMENT ON COLUMN transcriptions.status IS 'Status da transcrição (completed, processing, failed)';
COMMENT ON COLUMN transcriptions.created_at IS 'Data e hora de criação';
COMMENT ON COLUMN transcriptions.updated_at IS 'Data e hora da última atualização';
```

---

## 🔒 Configurar Row Level Security (RLS)

Para garantir que usuários vejam apenas suas próprias transcrições:

```sql
-- Habilitar RLS na tabela
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias transcrições
CREATE POLICY "Users can view own transcriptions"
  ON transcriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem criar suas próprias transcrições
CREATE POLICY "Users can create own transcriptions"
  ON transcriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias transcrições
CREATE POLICY "Users can update own transcriptions"
  ON transcriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias transcrições
CREATE POLICY "Users can delete own transcriptions"
  ON transcriptions
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 📋 Estrutura Detalhada da Tabela

### `transcriptions`

| Coluna               | Tipo                     | Obrigatório | Padrão            | Descrição                             |
| -------------------- | ------------------------ | ----------- | ----------------- | ------------------------------------- |
| `id`                 | UUID                     | Sim         | gen_random_uuid() | Identificador único da transcrição    |
| `user_id`            | UUID                     | Sim         | -                 | ID do usuário (FK para auth.users)    |
| `title`              | TEXT                     | Sim         | -                 | Título ou nome do arquivo             |
| `audio_url`          | TEXT                     | Sim         | -                 | URL ou caminho do arquivo de áudio    |
| `transcription_text` | TEXT                     | Sim         | -                 | Texto transcrito                      |
| `status`             | TEXT                     | Sim         | 'completed'       | Status: completed, processing, failed |
| `created_at`         | TIMESTAMP WITH TIME ZONE | Sim         | NOW()             | Data de criação                       |
| `updated_at`         | TIMESTAMP WITH TIME ZONE | Sim         | NOW()             | Data da última atualização            |

---

## 🧪 Testar Conexão

### Método 1: Via API Route

Acesse no navegador ou via curl:

```bash
curl http://localhost:3000/api/test-db
```

**Resposta esperada:**

```json
{
  "status": "connected",
  "table": "transcriptions",
  "count": 0
}
```

### Método 2: Via Supabase Dashboard

1. Vá em **Table Editor**
2. Verifique se a tabela `transcriptions` aparece
3. Clique na tabela para ver a estrutura

---

## 🔗 Relacionamentos

```
auth.users (Supabase Auth)
    ↓ (1:N)
transcriptions
```

- Um usuário pode ter **múltiplas transcrições**
- Uma transcrição pertence a **um único usuário**
- Se o usuário for deletado, suas transcrições são deletadas automaticamente (CASCADE)

---

## 📊 Exemplo de Dados

```sql
-- Exemplo de inserção (feito automaticamente pela aplicação)
INSERT INTO transcriptions (
  user_id,
  title,
  audio_url,
  transcription_text,
  status
) VALUES (
  'uuid-do-usuario',
  'reuniao-2024.mp3',
  'https://exemplo.com/audio.mp3',
  'Texto transcrito do áudio...',
  'completed'
);
```

---

## 🔍 Queries Úteis

### Ver todas as transcrições de um usuário

```sql
SELECT * FROM transcriptions
WHERE user_id = 'uuid-do-usuario'
ORDER BY created_at DESC;
```

### Contar transcrições por usuário

```sql
SELECT user_id, COUNT(*) as total
FROM transcriptions
GROUP BY user_id;
```

### Ver transcrições recentes

```sql
SELECT id, title, created_at
FROM transcriptions
ORDER BY created_at DESC
LIMIT 10;
```

### Deletar transcrições antigas (mais de 90 dias)

```sql
DELETE FROM transcriptions
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## ⚙️ Variáveis de Ambiente

Certifique-se de que seu `.env.local` contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
GROQ_API_KEY=sua-chave-groq
```

---

## 🚀 Como a Aplicação Usa o Banco

### 1. Transcrição de Arquivo (`/api/transcribe`)

```typescript
// Após transcrever o áudio
await supabase.from("transcriptions").insert({
  user_id: user.id,
  title: file.name,
  audio_url: `file://${file.name}`,
  transcription_text: transcription.text,
  status: "completed",
});
```

### 2. Transcrição de URL (`/api/transcribe/url`)

```typescript
// Após transcrever áudio de URL
await supabase.from("transcriptions").insert({
  user_id: user.id,
  title: "Transcrição de URL",
  audio_url: url,
  transcription_text: transcription.text,
  status: "completed",
});
```

### 3. Teste de Conexão (`/api/test-db`)

```typescript
// Verifica se a tabela existe e conta registros
const { data, error, count } = await supabase
  .from("transcriptions")
  .select("*", { count: "exact", head: true });
```

---

## 🛡️ Segurança

### ✅ Implementado

- **RLS (Row Level Security)**: Usuários veem apenas seus dados
- **Foreign Key**: Relacionamento com auth.users
- **CASCADE DELETE**: Dados deletados quando usuário é removido
- **Índices**: Performance otimizada para queries comuns
- **Timestamps**: Rastreamento de criação e atualização

### 🔐 Boas Práticas

1. **Nunca exponha** a chave `service_role` no frontend
2. **Use apenas** `anon_key` no cliente
3. **RLS sempre habilitado** em produção
4. **Validação** de dados antes de inserir
5. **Backup regular** dos dados

---

## 📈 Monitoramento

### No Supabase Dashboard

1. **Database** → **Tables** → `transcriptions`

   - Ver dados em tempo real
   - Editar registros manualmente

2. **Database** → **Indexes**

   - Verificar performance dos índices

3. **Database** → **Roles**

   - Ver permissões e políticas RLS

4. **Logs**
   - Monitorar queries e erros

---

## 🐛 Troubleshooting

### Erro: "relation 'transcriptions' does not exist"

**Solução**: Execute o SQL de criação da tabela no SQL Editor.

### Erro: "permission denied for table transcriptions"

**Solução**: Verifique se o RLS está configurado corretamente.

### Erro: "insert or update on table violates foreign key constraint"

**Solução**: Certifique-se de que o `user_id` existe na tabela `auth.users`.

### Tabela não aparece no Table Editor

**Solução**:

1. Recarregue a página
2. Verifique se o SQL foi executado sem erros
3. Verifique a aba "Logs" para erros

---

## 📚 Próximos Passos (Opcional)

### Adicionar mais campos

```sql
ALTER TABLE transcriptions
ADD COLUMN language TEXT DEFAULT 'pt',
ADD COLUMN duration_seconds INTEGER,
ADD COLUMN file_size_bytes BIGINT,
ADD COLUMN model_used TEXT DEFAULT 'whisper-large-v3-turbo';
```

### Criar tabela de histórico

```sql
CREATE TABLE transcription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transcription_id UUID REFERENCES transcriptions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  old_data JSONB,
  new_data JSONB
);
```

### Adicionar busca full-text

```sql
-- Adicionar coluna de busca
ALTER TABLE transcriptions
ADD COLUMN search_vector tsvector;

-- Criar índice GIN para busca
CREATE INDEX idx_transcriptions_search
ON transcriptions USING GIN(search_vector);

-- Atualizar automaticamente
CREATE TRIGGER update_transcriptions_search
  BEFORE INSERT OR UPDATE ON transcriptions
  FOR EACH ROW
  EXECUTE FUNCTION
    tsvector_update_trigger(
      search_vector, 'pg_catalog.portuguese',
      title, transcription_text
    );
```

---

## ✅ Checklist de Configuração

- [ ] Tabela `transcriptions` criada
- [ ] Índices criados
- [ ] Trigger `updated_at` configurado
- [ ] RLS habilitado
- [ ] Políticas RLS criadas
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de conexão executado com sucesso
- [ ] Primeira transcrição testada

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Supabase Dashboard
2. Execute `/api/test-db` para testar conexão
3. Verifique se as variáveis de ambiente estão corretas
4. Consulte a [documentação do Supabase](https://supabase.com/docs)

---

## 🎯 Resumo

**1 Tabela:**

- `transcriptions` - Armazena todas as transcrições

**Relacionamentos:**

- `transcriptions.user_id` → `auth.users.id`

**Segurança:**

- RLS habilitado
- Políticas por usuário

**Performance:**

- 3 índices otimizados
- Trigger automático para `updated_at`

**Pronto para produção!** ✅
