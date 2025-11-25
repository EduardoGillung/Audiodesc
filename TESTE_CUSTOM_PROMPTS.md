# 🧪 Como Testar a Feature de Prompts Customizados

## 📋 Pré-requisitos

1. **Criar a tabela no Supabase**

   - Abra o SQL Editor no Supabase Dashboard
   - Execute o SQL em `DATABASE_CUSTOM_PROMPTS.md`

2. **Iniciar o servidor**

   ```bash
   npm run dev
   ```

3. **Fazer login**
   - Acesse http://localhost:3000/auth/login
   - Faça login com sua conta

---

## 🎯 Passo a Passo para Testar

### 1. Acessar o Dashboard

- Vá para http://localhost:3000/dashboard
- Você verá 3 botões fixos: **Resumo**, **Tarefas**, **Resposta**
- E um novo botão amarelo: **+ Criar Prompt**

### 2. Fazer uma Transcrição

- Cole uma URL de áudio OU
- Envie um arquivo de áudio
- Aguarde a transcrição aparecer

### 3. Criar Seu Primeiro Prompt Customizado

**Clique em "+ Criar Prompt"**

O modal abrirá com:

- Campo "Título do Botão"
- Campo "Prompt (Instrução para a IA)"

**Exemplo 1: Traduzir para Inglês**

- **Título**: `Traduzir EN`
- **Prompt**: `Traduza o seguinte texto para inglês de forma clara e natural, mantendo o contexto original.`
- Clique em **"Criar Botão"**

**Exemplo 2: Corrigir Gramática**

- **Título**: `Corrigir`
- **Prompt**: `Corrija erros gramaticais e ortográficos no texto. Retorne apenas o texto corrigido sem explicações.`
- Clique em **"Criar Botão"**

**Exemplo 3: Formalizar Texto**

- **Título**: `Formalizar`
- **Prompt**: `Reescreva o texto de forma mais formal e profissional, adequado para ambiente corporativo.`
- Clique em **"Criar Botão"**

### 4. Usar o Prompt Customizado

- Após criar, o botão aparecerá ao lado dos 3 botões fixos
- Clique no botão do seu prompt
- A IA processará a transcrição usando seu prompt
- A resposta aparecerá no painel da direita com streaming

### 5. Editar um Prompt

- Passe o mouse sobre o botão customizado
- Aparecerão 2 ícones: ✏️ (editar) e 🗑️ (deletar)
- Clique no ícone de editar
- Modifique o título ou prompt
- Clique em **"Salvar Alterações"**

### 6. Deletar um Prompt

- Passe o mouse sobre o botão customizado
- Clique no ícone de deletar (🗑️)
- Confirme a exclusão

---

## ✅ O Que Você Deve Ver

### Após Criar um Prompt:

- ✅ Toast verde: "Prompt criado com sucesso!"
- ✅ Novo botão aparece ao lado dos 3 fixos
- ✅ Botão tem ícone de estrela ⭐

### Ao Usar um Prompt:

- ✅ Painel de resposta abre automaticamente
- ✅ Texto aparece com streaming (palavra por palavra)
- ✅ Cursor amarelo pulsante durante geração
- ✅ Toast verde: "Resposta gerada com sucesso!"

### Ao Editar:

- ✅ Modal abre com dados preenchidos
- ✅ Título muda para "Editar Prompt"
- ✅ Botão muda para "Salvar Alterações"
- ✅ Toast verde: "Prompt atualizado com sucesso!"

### Ao Deletar:

- ✅ Confirmação aparece
- ✅ Botão desaparece da interface
- ✅ Toast verde: "Prompt deletado com sucesso!"

---

## 🐛 Possíveis Erros

### Erro: "relation 'custom_prompts' does not exist"

**Solução**: Execute o SQL no Supabase (DATABASE_CUSTOM_PROMPTS.md)

### Erro: "Unauthorized"

**Solução**: Faça login novamente

### Botões não aparecem após criar

**Solução**: Recarregue a página (F5)

### Erro ao executar prompt

**Solução**: Verifique se há transcrição no campo "Descrição do Áudio"

---

## 💡 Dicas de Uso

### Prompts Úteis para o Dia a Dia:

**📧 Criar Email**

```
Título: Email
Prompt: Transforme este texto em um email profissional com saudação, corpo e despedida apropriados.
```

**📝 Pontos-Chave**

```
Título: Pontos-Chave
Prompt: Extraia os 5 pontos mais importantes deste texto em formato de lista numerada.
```

**🔄 Simplificar**

```
Título: Simplificar
Prompt: Simplifique o texto para que seja facilmente compreendido, usando linguagem clara e direta.
```

**📊 Criar Relatório**

```
Título: Relatório
Prompt: Organize este texto em formato de relatório com introdução, desenvolvimento e conclusão.
```

**🎯 Action Items**

```
Título: Ações
Prompt: Liste todas as ações e tarefas mencionadas neste texto em formato de checklist.
```

---

## 🎨 Personalização Futura

A estrutura já suporta (mas não está implementado na UI):

- Ícones customizados
- Cores customizadas
- Reordenação de botões

---

## ✨ Resumo

1. ✅ Execute o SQL no Supabase
2. ✅ Faça login no sistema
3. ✅ Transcreva um áudio
4. ✅ Clique em "+ Criar Prompt"
5. ✅ Preencha título e prompt
6. ✅ Use, edite ou delete seus prompts

**Tudo funcionando sem erros nem gambiarras!** 🚀
