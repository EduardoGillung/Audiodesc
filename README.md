# AudioDesc

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwindcss)

Plataforma de conversão de áudio para texto.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Design System](#design-system)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

AudioDesc é uma aplicação web desenvolvida para converter áudio em texto de forma automática, oferecendo recursos adicionais como geração de resumos, criação de tickets de suporte e listagem de tarefas baseadas no conteúdo transcrito.

### Objetivos

- Fornecer transcrição de áudio de alta qualidade
- Interface minimalista e intuitiva
- Experiência de usuário fluida e responsiva
- Arquitetura escalável e manutenível

## 🚀 Tecnologias

### Core

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **TailwindCSS 4** - Framework CSS utility-first

### Backend & Database

- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Banco de dados relacional
- **Supabase Auth** - Sistema de autenticação
- **Row Level Security** - Segurança em nível de linha

### Fontes

- **Inconsolata** - Fonte principal do projeto
- **Kufam** - Fonte para branding (logo e títulos)

### Ferramentas

- **ESLint** - Linter para código JavaScript/TypeScript
- **Git** - Controle de versão

## 🏗️ Arquitetura

### Padrões Arquiteturais

O projeto segue uma arquitetura baseada em componentes com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Camada de Apresentação      │
│    (Pages, Components, Layouts)     │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│         Camada de Lógica            │
│      (Hooks, Utils, Services)       │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│         Camada de Dados             │
│        (API, State Management)      │
└─────────────────────────────────────┘
```

### Princípios de Design

- **Component-Driven Development**: Componentes reutilizáveis e isolados
- **Mobile-First**: Design responsivo priorizando dispositivos móveis
- **Atomic Design**: Organização hierárquica de componentes
- **DRY (Don't Repeat Yourself)**: Evitar duplicação de código

## 📁 Estrutura do Projeto

```
audiodesc/
├── src/
│   ├── app/                      # App Router do Next.js
│   │   ├── dashboard/           # Página principal do dashboard
│   │   │   └── page.tsx
│   │   ├── history/             # Página de histórico
│   │   │   └── page.tsx
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout raiz da aplicação
│   │   └── page.tsx             # Página inicial (redireciona)
│   │
│   └── components/              # Componentes reutilizáveis
│       ├── layout/              # Componentes de layout
│       │   ├── header.tsx       # Cabeçalho da aplicação
│       │   └── footer.tsx       # Rodapé da aplicação
│       └── ui/                  # Componentes de UI (futuro)
│
├── public/                      # Arquivos estáticos
├── .gitignore                   # Arquivos ignorados pelo Git
├── eslint.config.mjs           # Configuração do ESLint
├── next.config.ts              # Configuração do Next.js
├── package.json                # Dependências e scripts
├── postcss.config.mjs          # Configuração do PostCSS
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Documentação do projeto
```

### Descrição dos Diretórios

#### `/src/app`

Contém as rotas e páginas da aplicação usando o App Router do Next.js 15.

- **dashboard/**: Página principal com conversor de áudio
- **history/**: Histórico de conversões
- **layout.tsx**: Layout global com Header e Footer
- **globals.css**: Estilos CSS globais e variáveis

#### `/src/components`

Componentes React reutilizáveis organizados por categoria.

- **layout/**: Componentes estruturais (Header, Footer)
- **ui/**: Componentes de interface (botões, inputs, etc.)

## ⚙️ Instalação

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

### Passos

1. Clone o repositório

```bash
git clone https://github.com/EduardoGillung/Audiodesc.git
cd audiodesc
```

2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 💻 Uso

### Desenvolvimento

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

### Estrutura de Rotas

- `/` - Redireciona para `/dashboard`
- `/dashboard` - Página principal do conversor
- `/history` - Histórico de conversões

## ✨ Funcionalidades

### Implementadas

- ✅ Conversão de áudio via URL
- ✅ Upload de arquivo de áudio
- ✅ Visualização de descrição do áudio
- ✅ Histórico de conversões
- ✅ Interface responsiva
- ✅ Dark mode nativo
- ✅ Botões de ação (Criar Resposta, Ticket, Tarefas)

### Em Desenvolvimento

- 🔄 Integração com API de transcrição
- 🔄 Sistema de autenticação
- 🔄 Salvamento de histórico no banco de dados
- 🔄 Exportação de transcrições
- 🔄 Suporte a múltiplos idiomas

## 🎨 Design System

### Paleta de Cores

```css
--background: #0a0a0a (black)
--foreground: #ededed (white)
--primary: #facc15 (yellow-400)
--secondary: #27272a (zinc-800)
--accent: #18181b (zinc-900)
```

### Tipografia

- **Fonte Principal**: Inconsolata (400, 500, 600, 700)
- **Fonte Branding**: Kufam (400, 500, 600, 700)

### Componentes

#### Botões

```tsx
// Botão Primário
<button className="bg-yellow-400/90 hover:bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md transition-all">
  Texto
</button>

// Botão Secundário
<button className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-2 rounded-md transition-all">
  Texto
</button>
```

#### Inputs

```tsx
<input className="bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900" />
```

### Espaçamento

- **Gap padrão**: 2-4 (0.5rem - 1rem)
- **Padding**: 3-4 (0.75rem - 1rem)
- **Margin**: 2-4 (0.5rem - 1rem)

### Responsividade

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para type safety
- Siga as convenções do ESLint
- Componentes em PascalCase
- Funções e variáveis em camelCase
- Use Tailwind para estilização
- Mantenha componentes pequenos e focados

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Eduardo Gillung**

- GitHub: [@EduardoGillung](https://github.com/EduardoGillung)
- Repositório: [Audiodesc](https://github.com/EduardoGillung/Audiodesc)

---

Desenvolvido com ❤️ usando Next.js e TailwindCSS
