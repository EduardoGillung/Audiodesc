# 🏗️ Estrutura e Lógica do Supabase Auth

## 📁 Estrutura Completa de Pastas e Arquivos

```
audiodesc/
├── src/
│   ├── app/
│   │   ├── api/                          # 🔴 BACKEND - API Routes
│   │   │   └── auth/
│   │   │       ├── callback/
│   │   │       │   └── route.ts          # OAuth callback handler
│   │   │       └── logout/
│   │   │           └── route.ts          # Logout endpoint
│   │   │
│   │   ├── auth/                         # 🔵 FRONTEND - Páginas de autenticação
│   │   │   ├── layout.tsx                # Layout sem header/footer
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Página de login
│   │   │   └── signup/
│   │   │       └── page.tsx              # Página de registro
│   │   │
│   │   ├── dashboard/                    # 🔵 FRONTEND - Área protegida
│   │   │   └── page.tsx                  # Dashboard (requer auth)
│   │   │
│   │   ├── layout.tsx                    # Layout raiz (com header/footer)
│   │   ├── page.tsx                      # Home page
│   │   └── globals.css                   # Estilos globais
│   │
│   ├── components/                       # 🔵 FRONTEND - Componentes React
│   │   ├── layout/
│   │   │   ├── header.tsx                # Header (mostra usuário logado)
│   │   │   └── footer.tsx                # Footer
│   │   └── ui/
│   │       └── Toast.tsx                 # Notificações
│   │
│   ├── lib/                              # 🟡 SHARED - Lógica compartilhada
│   │   ├── actions/
│   │   │   └── auth.actions.ts           # Server Actions (getUser, signOut)
│   │   ├── database/
│   │   │   ├── client.ts                 # Cliente Supabase (browser)
│   │   │   └── server.ts                 # Cliente Supabase (server)
│   │   ├── groq/
│   │   │   └── client.ts                 # Cliente Groq AI
│   │   └── services/
│   │       ├── generation.service.ts     # Serviço de geração
│   │       └── transcription.service.ts  # Serviço de transcrição
│   │
│   └── hooks/                            # 🔵 FRONTEND - Custom React Hooks
│       ├── useGeneration.ts
│       ├── useToast.ts
│       └── useTranscription.ts
│
├── middleware.ts                         # 🔴 BACKEND - Proteção de rotas
├── .env.local                            # Variáveis de ambiente
└── package.json                          # Dependências
```

---

## 📝 Explicação Detalhada de Cada Arquivo

### 🔴 BACKEND (Server-Side)

#### `middleware.ts`

**Propósito**: Intercepta TODAS as requisições antes de chegar nas páginas

**Lógica**:

```
1. Cria cliente Supabase server-side
2. Lê cookies da requisição
3. Verifica se usuário está autenticado
4. Protege rotas:
   - /dashboard → requer login
   - /auth/login → redireciona se já logado
5. Permite ou bloqueia acesso
```

**Por que existe**:

- Proteção em nível de aplicação
- Evita acesso não autorizado
- Centraliza lógica de autenticação

---

#### `src/app/api/auth/callback/route.ts`

**Propósito**: Processa callback do OAuth (Google, GitHub, etc)

**Lógica**:

```
1. Recebe código de autorização na URL (?code=xxx)
2. Troca código por sessão (access_token + refresh_token)
3. Salva tokens em cookies
4. Redireciona para /dashboard
```

**Quando é chamado**:

- Após usuário autorizar no Google
- Após clicar no link de confirmação de email

**Por que existe**:

- OAuth requer um endpoint de callback
- Supabase precisa trocar código por sessão

---

#### `src/app/api/auth/logout/route.ts`

**Propósito**: Endpoint para fazer logout

**Lógica**:

```
1. Recebe requisição POST
2. Chama supabase.auth.signOut()
3. Deleta cookies de sessão
4. Retorna sucesso
```

**Por que existe**:

- Alternativa a Server Actions
- Pode ser chamado via fetch() de qualquer lugar

---

#### `src/lib/actions/auth.actions.ts`

**Propósito**: Server Actions para autenticação

**Funções**:

- `getUser()`: Retorna usuário logado (ou null)
- `signOut()`: Faz logout e redireciona

**Lógica**:

```typescript
// getUser()
1. Cria cliente Supabase server-side
2. Chama supabase.auth.getUser()
3. Retorna dados do usuário

// signOut()
1. Cria cliente Supabase server-side
2. Chama supabase.auth.signOut()
3. Deleta cookies
4. Redirect para /auth/login
```

**Por que existe**:

- Server Actions são mais simples que API Routes
- Podem ser chamadas diretamente de componentes
- Executam no servidor (seguras)

---

#### `src/lib/database/server.ts`

**Propósito**: Cliente Supabase para uso server-side

**Lógica**:

```typescript
1. Importa cookies() do Next.js
2. Cria cliente Supabase com:
   - URL do projeto
   - Chave anon
   - Configuração de cookies (getAll, setAll)
3. Retorna cliente configurado
```

**Onde é usado**:

- Middleware
- Server Actions
- API Routes
- Server Components

**Por que existe**:

- Server-side precisa ler cookies manualmente
- Next.js fornece API de cookies
- Supabase precisa dessa configuração

---

### 🔵 FRONTEND (Client-Side)

#### `src/app/auth/login/page.tsx`

**Propósito**: Página de login

**Lógica**:

```
1. Formulário com email e senha
2. Ao submeter:
   - Chama supabase.auth.signInWithPassword()
   - Se sucesso: redirect /dashboard
   - Se erro: mostra mensagem
3. Botão Google OAuth:
   - Chama supabase.auth.signInWithOAuth()
   - Redireciona para Google
```

**Estado gerenciado**:

- email, password (inputs)
- loading (botão desabilitado)
- error (mensagem de erro)

**Por que existe**:

- Interface para usuário fazer login
- Client Component (interatividade)

---

#### `src/app/auth/signup/page.tsx`

**Propósito**: Página de registro

**Lógica**:

```
1. Formulário com email, senha, confirmar senha
2. Validações:
   - Senhas coincidem?
   - Senha tem 6+ caracteres?
3. Ao submeter:
   - Chama supabase.auth.signUp()
   - Supabase envia email de confirmação
   - Mostra tela de sucesso
4. Botão Google OAuth (igual login)
```

**Estado gerenciado**:

- email, password, confirmPassword
- loading, error
- success (mostra tela de confirmação)

**Por que existe**:

- Interface para criar conta
- Validação client-side (UX)

---

#### `src/app/auth/layout.tsx`

**Propósito**: Layout específico para páginas de auth

**Lógica**:

```typescript
export default function AuthLayout({ children }) {
  return <>{children}</>;
}
```

**Por que existe**:

- Remove header e footer das páginas de login/signup
- Next.js usa layouts aninhados
- Layout mais específico sobrescreve o geral

---

#### `src/components/layout/header.tsx`

**Propósito**: Header do site (mostra usuário logado)

**Lógica**:

```
1. Server Component (async)
2. Chama getUser() para verificar autenticação
3. Se logado:
   - Mostra email
   - Botão "Sair" (form com Server Action)
4. Se não logado:
   - Botão "Conectar-se" (link para /auth/login)
```

**Por que é Server Component**:

- Precisa verificar usuário no servidor
- Evita flash de conteúdo
- Mais seguro

---

#### `src/lib/database/client.ts`

**Propósito**: Cliente Supabase para uso client-side

**Lógica**:

```typescript
1. Cria cliente Supabase com:
   - URL do projeto
   - Chave anon
2. Gerencia cookies automaticamente (browser)
3. Retorna cliente configurado
```

**Onde é usado**:

- Páginas de login/signup
- Componentes client-side
- Hooks customizados

**Por que existe**:

- Browser gerencia cookies automaticamente
- Não precisa configuração manual de cookies
- Mais simples que versão server

---

### 🟡 SHARED (Compartilhado)

#### `src/lib/services/transcription.service.ts`

**Propósito**: Serviço para fazer requisições de transcrição

**Lógica**:

```typescript
class TranscriptionService {
  static async transcribeFromUrl(url) {
    // Faz fetch para /api/transcribe/url
    return response.json();
  }

  static async transcribeFromFile(file) {
    // Faz fetch para /api/transcribe
    return response.json();
  }
}
```

**Por que existe**:

- Centraliza lógica de requisições
- Reutilizável em múltiplos componentes
- Fácil de testar

---

#### `src/hooks/useTranscription.ts`

**Propósito**: Hook customizado para transcrição

**Lógica**:

```typescript
1. Gerencia estado de loading
2. Chama TranscriptionService
3. Retorna funções e estado
```

**Por que existe**:

- Separa lógica de UI
- Reutilizável
- Segue padrão React

---

## 🔄 Fluxo de Dados Completo

### Cenário 1: Login com Email/Senha

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário acessa /auth/login                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Middleware intercepta                                     │
│    - Verifica cookies (não tem sessão)                      │
│    - Permite acesso (rota pública)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Página renderiza (src/app/auth/login/page.tsx)          │
│    - Mostra formulário                                       │
│    - Sem header/footer (layout específico)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Usuário preenche email/senha e clica "Entrar"           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Client-side (browser)                                     │
│    - createClient() (src/lib/database/client.ts)           │
│    - supabase.auth.signInWithPassword({ email, password }) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Supabase (servidor externo)                              │
│    - Valida credenciais                                      │
│    - Gera access_token + refresh_token (JWT)                │
│    - Retorna tokens                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Browser                                                   │
│    - Salva tokens em cookies (automático)                   │
│    - Cookies: httpOnly, secure, sameSite                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Client-side                                               │
│    - router.push('/dashboard')                              │
│    - router.refresh()                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Middleware intercepta /dashboard                          │
│    - Lê cookies da requisição                               │
│    - createClient() server (src/lib/database/server.ts)    │
│    - supabase.auth.getUser()                                │
│    - Cookies válidos! Usuário autenticado                   │
│    - Permite acesso                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. Dashboard renderiza (src/app/dashboard/page.tsx)       │
│     - Mostra conteúdo protegido                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. Header renderiza (src/components/layout/header.tsx)    │
│     - Server Component                                       │
│     - Chama getUser() (src/lib/actions/auth.actions.ts)   │
│     - Retorna dados do usuário                              │
│     - Mostra email + botão "Sair"                           │
└─────────────────────────────────────────────────────────────┘
```

---

### Cenário 2: Login com Google OAuth

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica "Continuar com Google"                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Client-side                                               │
│    - supabase.auth.signInWithOAuth({                        │
│        provider: 'google',                                   │
│        redirectTo: '/api/auth/callback'                     │
│      })                                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Supabase redireciona para Google                         │
│    - URL: accounts.google.com/o/oauth2/auth?...            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Usuário autoriza no Google                               │
│    - Seleciona conta                                         │
│    - Concede permissões                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Google redireciona para Supabase                         │
│    - URL: projeto.supabase.co/auth/v1/callback?code=xxx    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Supabase redireciona para nossa app                      │
│    - URL: localhost:3000/api/auth/callback?code=xxx        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. API Route (src/app/api/auth/callback/route.ts)          │
│    - Extrai código da URL                                   │
│    - supabase.auth.exchangeCodeForSession(code)            │
│    - Troca código por tokens                                │
│    - Salva tokens em cookies                                │
│    - Redirect para /dashboard                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Usuário está logado!                                     │
│    - Cookies salvos                                          │
│    - Dashboard acessível                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Cenário 3: Logout

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica "Sair" no header                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Form submete (Server Action)                             │
│    - <form action={signOut}>                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Server Action (src/lib/actions/auth.actions.ts)         │
│    - signOut() executa no servidor                          │
│    - createClient() server                                   │
│    - supabase.auth.signOut()                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Supabase                                                  │
│    - Invalida tokens                                         │
│    - Deleta cookies                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Server Action                                             │
│    - redirect('/auth/login')                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Usuário está deslogado                                   │
│    - Sem cookies                                             │
│    - Redirecionado para login                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Decisões de Arquitetura

### Por que 2 clientes Supabase?

**Client** (`client.ts`):

- Browser gerencia cookies automaticamente
- Usado em componentes interativos
- Mais simples

**Server** (`server.ts`):

- Servidor precisa ler cookies manualmente
- Usado em proteção de rotas
- Mais seguro (não expõe tokens)

### Por que Middleware?

- Executa ANTES de qualquer página
- Protege rotas em um único lugar
- Evita código duplicado
- Mais performático (não renderiza página desnecessária)

### Por que Server Actions?

- Mais simples que API Routes
- Menos código boilerplate
- Integração nativa com forms
- Executam no servidor (seguros)

### Por que Layout aninhado para /auth?

- Remove header/footer apenas de login/signup
- Resto do site mantém layout normal
- Padrão do Next.js App Router

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE AUTH FLOW                        │
└─────────────────────────────────────────────────────────────┘

FRONTEND (Browser)          BACKEND (Server)         SUPABASE
─────────────────────────────────────────────────────────────

/auth/login
    │
    ├─> signInWithPassword() ──────────────────────────────> Valida
    │                                                         │
    │                                                         │
    │   <────────────────────────────────────────────────── Tokens
    │
    ├─> Salva cookies
    │
    └─> Redirect /dashboard
                │
                │
                └──> Middleware
                        │
                        ├─> Lê cookies
                        │
                        ├─> getUser() ──────────────────────> Valida
                        │                                     │
                        │   <────────────────────────────── User data
                        │
                        └─> Permite acesso
                                │
                                │
/dashboard                      │
    │                           │
    └─> Renderiza (protegido) <─┘

Header
    │
    └─> getUser() ──────────────────────────────────────────> Valida
        │                                                     │
        │   <────────────────────────────────────────────── User data
        │
        └─> Mostra email
```

---

## ✅ Checklist de Implementação

- [x] Cliente Supabase browser (`client.ts`)
- [x] Cliente Supabase server (`server.ts`)
- [x] Middleware de proteção (`middleware.ts`)
- [x] Página de login (`/auth/login`)
- [x] Página de registro (`/auth/signup`)
- [x] Layout sem header/footer (`/auth/layout.tsx`)
- [x] Callback OAuth (`/api/auth/callback`)
- [x] Endpoint de logout (`/api/auth/logout`)
- [x] Server Actions (`auth.actions.ts`)
- [x] Header com usuário logado
- [x] Variáveis de ambiente (`.env.local`)

---

## 🚀 Próximos Passos (Opcional)

1. **Recuperação de senha**

   - Página `/auth/forgot-password`
   - Página `/auth/reset-password`
   - Email template no Supabase

2. **Perfil de usuário**

   - Tabela `profiles` no banco
   - Página `/profile`
   - Upload de avatar

3. **Mais provedores OAuth**

   - GitHub
   - Facebook
   - Twitter

4. **2FA (Two-Factor Authentication)**

   - TOTP (Google Authenticator)
   - SMS

5. **RLS (Row Level Security)**
   - Políticas no Supabase
   - Usuários veem apenas seus dados

---

## 📚 Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
