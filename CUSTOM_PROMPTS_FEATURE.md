# 🎯 Feature: Botões de Prompts Customizados

## 📋 Resumo

Feature que permite usuários criarem botões personalizados com prompts customizados para processar transcrições de áudio de acordo com suas necessidades.

---

## 🗂️ Arquivos Criados

### Backend (API Routes)

- `src/app/api/custom-prompts/route.ts` - GET (listar) e POST (criar)
- `src/app/api/custom-prompts/[id]/route.ts` - PUT (editar) e DELETE (deletar)
- `src/app/api/generate/custom/route.ts` - Executar prompt customizado com streaming

### Frontend

- `src/components/ui/PromptModal.tsx` - Modal para criar/editar prompts
- `src/hooks/useCustomPrompts.ts` - Hook para gerenciar prompts

### Database

- `DATABASE_CUSTOM_PROMPTS.md` - SQL para criar tabela

---

## 🔧 Configuração

### 1. Criar Tabela no Supabase

Execute o SQL em `DATABASE_CUSTOM_PROMPTS.md` no SQL Editor do Supabase.

### 2. Integrar no Dashboard

Adicione no `src/app/(main)/dashboard/page.tsx`:

```typescript
import { useCustomPrompts } from "@/hooks/useCustomPrompts";
import PromptModal from "@/components/ui/PromptModal";

// Dentro do componente Dashboard:
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingPrompt, setEditingPrompt] = useState<any>(null);
const { prompts, createPrompt, updatePrompt, deletePrompt } =
  useCustomPrompts();

// Função para executar prompt customizado
const handleCustomPrompt = async (prompt: string) => {
  if (!description) {
    showToast("Nenhuma transcrição para processar", "error");
    return;
  }

  setIsStreaming(true);
  setResponse("");

  try {
    const res = await fetch("/api/generate/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: description, prompt }),
    });

    if (!res.ok) throw new Error("Erro na requisição");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("Stream não disponível");

    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulatedText += parsed.content;
              setResponse(accumulatedText);
            }
          } catch (e) {
            // Ignora linhas inválidas
          }
        }
      }
    }

    showToast("Resposta gerada com sucesso!", "success");
  } catch (error) {
    showToast("Erro ao gerar resposta", "error");
  } finally {
    setIsStreaming(false);
  }
};

// Handlers do modal
const handleCreatePrompt = async (title: string, prompt: string) => {
  await createPrompt(title, prompt);
  showToast("Prompt criado com sucesso!", "success");
};

const handleUpdatePrompt = async (title: string, prompt: string) => {
  if (editingPrompt) {
    await updatePrompt(editingPrompt.id, title, prompt);
    showToast("Prompt atualizado com sucesso!", "success");
    setEditingPrompt(null);
  }
};

const handleDeletePrompt = async (id: string) => {
  if (confirm("Tem certeza que deseja deletar este prompt?")) {
    await deletePrompt(id);
    showToast("Prompt deletado com sucesso!", "success");
  }
};
```

### 3. Adicionar Botões no JSX

Substitua a seção de botões (Resumo, Tarefas, Resposta) por:

```tsx
<div className="mt-2 flex justify-end gap-2 flex-wrap">
  {/* Botões fixos */}
  <button
    onClick={handleGenerateSummary}
    disabled={isStreaming || !description}
    className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    {isStreaming ? "Gerando..." : "Resumo"}
  </button>

  <button
    onClick={handleGenerateTasks}
    disabled={isStreaming || !description}
    className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
    {isStreaming ? "Gerando..." : "Tarefas"}
  </button>

  <button
    onClick={handleGenerateResponse}
    disabled={isStreaming || !description}
    className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01"
      />
    </svg>
    {isStreaming ? "Gerando..." : "Resposta"}
  </button>

  {/* Botões customizados */}
  {prompts.map((prompt) => (
    <div key={prompt.id} className="relative group">
      <button
        onClick={() => handleCustomPrompt(prompt.prompt)}
        disabled={isStreaming || !description}
        className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        {isStreaming ? "Gerando..." : prompt.title}
      </button>

      {/* Botões de editar/deletar (aparecem no hover) */}
      <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
        <button
          onClick={() => {
            setEditingPrompt(prompt);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
          title="Editar"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => handleDeletePrompt(prompt.id)}
          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
          title="Deletar"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  ))}

  {/* Botão para adicionar novo prompt */}
  <button
    onClick={() => {
      setEditingPrompt(null);
      setIsModalOpen(true);
    }}
    className="bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500/30 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
    Novo Prompt
  </button>
</div>;

{
  /* Modal */
}
<PromptModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingPrompt(null);
  }}
  onSave={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
  initialTitle={editingPrompt?.title || ""}
  initialPrompt={editingPrompt?.prompt || ""}
  mode={editingPrompt ? "edit" : "create"}
/>;
```

---

## 🎨 Funcionalidades

### ✅ Criar Prompt

1. Clique no botão "+ Novo Prompt"
2. Digite o título (nome do botão)
3. Digite o prompt (instrução para a IA)
4. Clique em "Criar Botão"

### ✅ Usar Prompt

1. Faça uma transcrição de áudio
2. Clique no botão do prompt customizado
3. A IA processará usando seu prompt

### ✅ Editar Prompt

1. Passe o mouse sobre o botão customizado
2. Clique no ícone de editar (lápis)
3. Modifique título ou prompt
4. Salve as alterações

### ✅ Deletar Prompt

1. Passe o mouse sobre o botão customizado
2. Clique no ícone de deletar (lixeira)
3. Confirme a exclusão

---

## 💡 Exemplos de Prompts Úteis

### Tradução

- **Título**: Traduzir EN
- **Prompt**: Traduza o seguinte texto para inglês de forma clara e natural, mantendo o contexto e significado original.

### Correção

- **Título**: Corrigir
- **Prompt**: Corrija erros gramaticais e ortográficos no texto, mantendo o sentido original. Retorne apenas o texto corrigido.

### Formalizar

- **Título**: Formalizar
- **Prompt**: Reescreva o texto de forma mais formal e profissional, adequado para ambiente corporativo.

### Simplificar

- **Título**: Simplificar
- **Prompt**: Simplifique o texto para que seja facilmente compreendido por qualquer pessoa, usando linguagem clara e direta.

### Email

- **Título**: Criar Email
- **Prompt**: Transforme este texto em um email profissional bem estruturado, com saudação, corpo e despedida apropriados.

### Pontos-Chave

- **Título**: Pontos-Chave
- **Prompt**: Extraia os 5 pontos mais importantes deste texto em formato de lista numerada.

---

## 🔒 Segurança

- ✅ RLS habilitado (usuários veem apenas seus prompts)
- ✅ Autenticação obrigatória
- ✅ Validação de dados no backend
- ✅ Limite de caracteres (título: 30, prompt: 500)
- ✅ Foreign key com CASCADE DELETE

---

## 📊 Estrutura do Banco

```sql
custom_prompts
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── title (TEXT, max 30 chars)
├── prompt (TEXT, max 500 chars)
├── icon (TEXT, default 'sparkles')
├── color (TEXT, default 'yellow')
├── order_index (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🚀 Pronto!

A feature está completa e pronta para uso. Basta:

1. Executar o SQL no Supabase
2. Integrar o código no dashboard
3. Testar criando seu primeiro prompt customizado

**Sem gambiarras, código profissional e seguindo a estrutura do projeto!** ✨
