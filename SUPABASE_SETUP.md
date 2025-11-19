# Configuração do Supabase

## Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js 18+ instalado
3. Supabase CLI (opcional, mas recomendado)

## Instalação do Supabase CLI (Opcional)

```bash
npm install -g supabase
```

## Passos de Configuração

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em "New Project"
3. Preencha os dados:
   - Nome do projeto: `audiodesc`
   - Database Password: (escolha uma senha forte)
   - Region: (escolha a mais próxima)
4. Aguarde a criação do projeto (2-3 minutos)

### 2. Obter Credenciais

1. No dashboard do projeto, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configurar Variáveis de Ambiente

1. Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

2. Edite `.env.local` e adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Executar Migrations

#### Opção A: Via Dashboard (Recomendado para iniciantes)

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie o conteúdo de `supabase/migrations/001_create_transcriptions_table.sql`
4. Cole no editor e clique em "Run"

#### Opção B: Via CLI (Recomendado para produção)

```bash
# Inicializar Supabase no projeto
supabase init

# Linkar com seu projeto
supabase link --project-ref xxxxx

# Executar migrations
supabase db push
```

### 5. Configurar Autenticação

1. No dashboard, vá em **Authentication** > **Providers**
2. Habilite os provedores desejados:

   - Email/Password (recomendado)
   - Google OAuth (opcional)
   - GitHub OAuth (opcional)

3. Configure URLs de redirecionamento:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://seu-dominio.com/api/auth/callback`

### 6. Testar Conexão

Execute o projeto:

```bash
npm run dev
```

Verifique no console se não há erros de conexão com o Supabase.

## Estrutura do Banco de Dados

### Tabela: transcriptions

| Coluna             | Tipo      | Descrição                                   |
| ------------------ | --------- | ------------------------------------------- |
| id                 | UUID      | ID único da transcrição                     |
| created_at         | TIMESTAMP | Data de criação                             |
| updated_at         | TIMESTAMP | Data de atualização                         |
| user_id            | UUID      | ID do usuário (FK para auth.users)          |
| title              | TEXT      | Título da transcrição                       |
| description        | TEXT      | Descrição opcional                          |
| audio_url          | TEXT      | URL do arquivo de áudio                     |
| transcription_text | TEXT      | Texto transcrito                            |
| status             | TEXT      | Status: pending/processing/completed/failed |

## Políticas de Segurança (RLS)

O projeto usa Row Level Security (RLS) para garantir que:

- Usuários só podem ver suas próprias transcrições
- Usuários só podem criar transcrições para si mesmos
- Usuários só podem atualizar suas próprias transcrições
- Usuários só podem deletar suas próprias transcrições

## API Routes

### GET /api/transcriptions

Lista todas as transcrições do usuário autenticado.

### POST /api/transcriptions

Cria uma nova transcrição.

**Body:**

```json
{
  "title": "Minha transcrição",
  "description": "Descrição opcional",
  "audio_url": "https://exemplo.com/audio.mp3"
}
```

### GET /api/transcriptions/[id]

Obtém uma transcrição específica.

### PATCH /api/transcriptions/[id]

Atualiza uma transcrição.

### DELETE /api/transcriptions/[id]

Deleta uma transcrição.

## Troubleshooting

### Erro: "Invalid API key"

- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env.local` existe
- Reinicie o servidor de desenvolvimento

### Erro: "relation does not exist"

- Execute as migrations no banco de dados
- Verifique se a tabela foi criada corretamente no SQL Editor

### Erro: "Row Level Security"

- Certifique-se de que o usuário está autenticado
- Verifique se as políticas RLS foram criadas corretamente

## Próximos Passos

1. Implementar autenticação no frontend
2. Criar páginas de login/registro
3. Integrar API de transcrição de áudio
4. Implementar upload de arquivos para Supabase Storage
5. Adicionar testes automatizados

## Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
