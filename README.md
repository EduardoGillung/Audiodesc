# AudioDesc

Audiodesc é uma solução web moderna projetada para converter arquivos de áudio e URL's em texto com precisão e, subsequentemente, processar essa transcrição usando Groq com whisper-large-v3-turbo para gerar insights acionáveis e criar prompt personalizaveis para uso diário.

Desenvolvida com o objetivo de otimizar fluxos de trabalho em ambientes como Suporte Técnico e atendimento ao cliente, a plataforma permite transformar gravações de chamadas, reuniões e outros áudios em resumos, tarefas e respostas contextuais, reduzindo o tempo de análise e agilizando a documentação.

<<<<<<< HEAD

## 🎯 Sobre o Projeto

AudioDesc é uma aplicação web desenvolvida para converter áudio em texto de forma automática, oferecendo recursos adicionais como geração de resumos, criação de tickets de suporte e listagem de tarefas baseadas no conteúdo transcrito.

### Objetivos

- Fornecer transcrição de áudio de alta qualidade
- Interface minimalista e intuitiva
- Experiência de usuário fluida e responsiva
- Arquitetura escalável e manutenível

## 🚀 Tecnologias

### Core
=======
## Tecnologias
>>>>>>> 00b36c4ce966d442ff31247db1480f88bdedf35a

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend e autenticação
- **PostgreSQL** - Banco de dados
- **Groq API** - Transcrição de áudio (Whisper)

## Funcionalidades

### Transcrição

- Upload de arquivos de áudio (MP3, WAV, OGG, M4A)
- Transcrição via URL direta
- Suporte a múltiplos formatos
- Streaming de resultados em tempo real

### Processamento IA

- Geração de resumos
- Extração de tarefas
- Respostas contextuais
- Prompts customizáveis pelo usuário

### Gerenciamento

- Sistema de autenticação (Supabase Auth)
- Histórico de transcrições
- Prompts personalizados (CRUD completo)
- Interface responsiva

## Estrutura do Projeto

```
src/
├── app/
│   ├── (main)/              # Rotas principais
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── privacy/         # Política de privacidade
│   │   ├── terms/           # Termos de uso
│   │   └── contact/         # Contato
│   ├── auth/                # Autenticação
│   │   ├── login/           # Login
│   │   └── signup/          # Cadastro
│   └── api/                 # API Routes
│       ├── transcribe/      # Transcrição de áudio
│       ├── generate/        # Geração de conteúdo IA
│       ├── custom-prompts/  # Gerenciamento de prompts
│       └── history/         # Histórico de transcrições
├── components/
│   ├── layout/              # Header, Footer
│   └── ui/                  # Componentes reutilizáveis
├── hooks/                   # Custom hooks
├── lib/                     # Utilitários e configurações
└── middleware.ts            # Middleware de autenticação
```

## Instalação

### Pré-requisitos

- Node.js 18+
- Conta Supabase
- API Key do Groq

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/EduardoGillung/Audiodesc.git
cd audiodesc
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase
GROQ_API_KEY=sua_chave_groq
```

4. Execute as migrations do banco de dados:

- Execute os scripts SQL em `DATABASE_SETUP.md`
- Execute os scripts SQL em `DATABASE_CUSTOM_PROMPTS.md`
- Execute os scripts SQL em `DATABASE_HISTORY.md`

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## Comandos

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## Banco de Dados

### Tabelas

**transcription_history**

- Armazena histórico de transcrições do usuário
- Campos: id, user_id, title, transcription_text, created_at

**custom_prompts**

- Prompts personalizados do usuário
- Campos: id, user_id, title, prompt, icon, color, order_index

### Segurança

- Row Level Security (RLS) habilitado
- Políticas de acesso por usuário
- Autenticação obrigatória para recursos protegidos

## API Routes

### Transcrição

- `POST /api/transcribe` - Upload de arquivo
- `POST /api/transcribe/url` - Transcrição via URL

### Geração IA

- `POST /api/generate/summary` - Gerar resumo
- `POST /api/generate/tasks` - Extrair tarefas
- `POST /api/generate/response` - Gerar resposta
- `POST /api/generate/custom` - Prompt customizado

### Prompts

- `GET /api/custom-prompts` - Listar prompts
- `POST /api/custom-prompts` - Criar prompt
- `PUT /api/custom-prompts/[id]` - Editar prompt
- `DELETE /api/custom-prompts/[id]` - Deletar prompt

### Histórico

- `GET /api/history` - Listar histórico
- `DELETE /api/history/[id]` - Deletar item

## Arquitetura

### Padrões

- Component-driven development
- Separation of concerns
- Custom hooks para lógica reutilizável
- API Routes para backend
- Server-Sent Events (SSE) para streaming

### Segurança

- Autenticação via Supabase Auth
- RLS no PostgreSQL
- Validação de dados no backend
- Proteção de rotas via middleware

## Autor

Eduardo Gillung

- GitHub: [@EduardoGillung](https://github.com/EduardoGillung)

## Licença

MIT
