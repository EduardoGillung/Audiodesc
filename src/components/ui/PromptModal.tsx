"use client";
import { useState, useEffect } from "react";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, prompt: string) => Promise<void>;
  initialTitle?: string;
  initialPrompt?: string;
  mode: "create" | "edit";
}

export default function PromptModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  initialPrompt = "",
  mode,
}: PromptModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setPrompt(initialPrompt);
  }, [initialTitle, initialPrompt, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    setLoading(true);
    try {
      await onSave(title, prompt);
      setTitle("");
      setPrompt("");
      onClose();
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 w-full max-w-4xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-yellow-400">
                {mode === "create" ? "Criar Prompt Customizado" : "Editar Prompt"}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Configure um botão personalizado para processar suas transcrições
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-700 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Título do Botão
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Traduzir, Corrigir, Resumir..."
                  required
                  maxLength={30}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  {title.length}/30 caracteres
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dicas Rápidas
                </h3>
                <ul className="text-xs text-zinc-400 space-y-1">
                  <li>• Use verbos de ação</li>
                  <li>• Seja claro e específico</li>
                  <li>• Defina o formato desejado</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Prompt (Instrução para a IA)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemplo: Traduza o seguinte texto para inglês de forma clara e natural, mantendo o contexto original..."
                required
                rows={6}
                maxLength={500}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-xs text-zinc-500">
                  {prompt.length}/500 caracteres
                </p>
                <p className="text-xs text-zinc-500">
                  {prompt.length > 0 && `~${Math.ceil(prompt.length / 4)} tokens`}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !prompt.trim()}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading
                  ? "Salvando..."
                  : mode === "create"
                  ? "Criar Botão"
                  : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
