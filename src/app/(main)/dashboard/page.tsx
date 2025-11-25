"use client";
import { useState, useRef } from "react";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useCustomPrompts } from "@/hooks/useCustomPrompts";
import PromptModal from "@/components/ui/PromptModal";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showResponsePanel, setShowResponsePanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast, showToast, hideToast } = useToast();
  const { prompts, createPrompt, updatePrompt, deletePrompt } = useCustomPrompts();

  const streamResponse = async (endpoint: string, successMessage: string) => {
    if (!description) {
      showToast("Nenhuma transcrição para processar", "error");
      return;
    }

    setShowResponsePanel(true);
    setIsStreaming(true);
    setResponse("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });

      if (!res.ok) {
        throw new Error("Erro na requisição");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Stream não disponível");
      }

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
              // Ignora linhas que não são JSON válido
            }
          }
        }
      }

      showToast(successMessage, "success");
    } catch (error) {
      showToast("Erro ao gerar resposta", "error");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGenerateResponse = () => streamResponse("/api/generate/response", "Resposta gerada com sucesso!");
  const handleGenerateTasks = () => streamResponse("/api/generate/tasks", "Lista de tarefas gerada!");
  const handleGenerateSummary = () => streamResponse("/api/generate/summary", "Resumo gerado com sucesso!");

  const handleCustomPrompt = async (promptText: string) => {
    if (!description) {
      showToast("Nenhuma transcrição para processar", "error");
      return;
    }

    setShowResponsePanel(true);
    setIsStreaming(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description, prompt: promptText }),
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

  const handleCreatePrompt = async (promptTitle: string, promptText: string) => {
    try {
      await createPrompt(promptTitle, promptText);
      showToast("Prompt criado com sucesso!", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar prompt";
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        showToast("Você precisa estar logado para criar prompts", "error");
      } else {
        showToast(errorMessage, "error");
      }
    }
  };

  const handleUpdatePrompt = async (promptTitle: string, promptText: string) => {
    if (editingPrompt) {
      try {
        await updatePrompt(editingPrompt.id, promptTitle, promptText);
        showToast("Prompt atualizado com sucesso!", "success");
        setEditingPrompt(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar prompt";
        if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
          showToast("Você precisa estar logado para editar prompts", "error");
        } else {
          showToast(errorMessage, "error");
        }
      }
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este prompt?")) {
      try {
        await deletePrompt(id);
        showToast("Prompt deletado com sucesso!", "success");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao deletar prompt";
        if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
          showToast("Você precisa estar logado para deletar prompts", "error");
        } else {
          showToast(errorMessage, "error");
        }
      }
    }
  };

  const streamTranscription = async (text: string) => {
    setDescription("");
    setIsTranscribing(true);

    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];
      setDescription(currentText);
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    setIsTranscribing(false);
  };

  const handleConvertUrl = async () => {
    if (!url) return;

    setIsTranscribing(true);
    try {
      const res = await fetch("/api/transcribe/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.text) {
        setTitle("Transcrição de URL");
        await streamTranscription(data.text);
        showToast("Áudio transcrito com sucesso!", "success");
      } else {
        showToast(data.error || "Erro ao transcrever áudio", "error");
        setIsTranscribing(false);
      }
    } catch (error) {
      showToast("Erro ao processar áudio", "error");
      setIsTranscribing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setTitle(file.name);
        await streamTranscription(data.text);
        showToast("Arquivo transcrito com sucesso!", "success");
      } else {
        showToast(data.error || "Erro ao transcrever arquivo", "error");
        setIsTranscribing(false);
      }
    } catch (error) {
      showToast("Erro ao processar arquivo", "error");
      setIsTranscribing(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="text-white px-4 py-6 bg-zinc-800/80">
        <div className="max-w-9xl mx-auto">
          <div className="space-y-4">
          
          <div className={`transition-all duration-500 ${showResponsePanel ? 'md:grid md:grid-cols-5 md:gap-3' : 'max-w-5xl mx-auto'}`}>
            <div className={`transition-all duration-500 ${showResponsePanel ? 'md:col-span-3' : ''}`}>
              <h2 className="text-base mb-1 text-yellow-400 font-semibold">Transcritor de Áudio para mensagens de texto.</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cole o link URL do áudio aqui para converter."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-800/50 rounded-md pl-9 pr-3 py-1.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                  />
                </div>
                <button
                  onClick={handleConvertUrl}
                  disabled={isTranscribing}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-medium px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                >
                  {isTranscribing ? "Processando..." : "Converter"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.ogg,.mp3,.wav,.m4a"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTranscribing}
                  className="bg-zinc-800 border border-zinc-800/50 hover:bg-zinc-800/50 px-2.5 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5m0 0L7 8m5-5v12" />
                  </svg>
                  <span className="text-xs text-zinc-300">Enviar Arquivo</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ${showResponsePanel ? 'md:grid md:grid-cols-5 md:gap-3' : 'max-w-5xl mx-auto'}`}>
            <div className={`bg-zinc-900/30 border border-zinc-800 rounded-md p-4 transition-all duration-500 ${showResponsePanel ? 'md:col-span-3' : ''}`}>
              <div className="flex justify-center items-center mb-3 relative">
                <h3 className="text-sm font-medium text-zinc-300">Descrição do Áudio</h3>
                <div className="flex items-center gap-2 absolute right-0">
                  <button
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setResponse("");
                    }}
                    className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-2 py-1 rounded-md transition-all duration-300 hover:scale-105 text-xs text-zinc-300 hover:text-white"
                  >
                    Limpar
                  </button>
                  <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-xs text-zinc-300">Título:</label>
                <input
                  type="text"
                  placeholder="Título da transcrição"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-800/50 rounded-md px-3 py-1.5 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                />
              </div>
              <div className="relative w-full h-72 bg-zinc-800 p-4 rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-y-auto">
                <p className="text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {description || "A transcrição aparecerá aqui..."}
                  {isTranscribing && <span className="inline-block w-0.5 h-5 bg-yellow-400 ml-0.5 animate-pulse"></span>}
                </p>
              </div>
              <div className="mt-2 flex justify-end gap-2 flex-wrap">
                <button
                  onClick={handleGenerateSummary}
                  disabled={isStreaming || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isStreaming ? "Gerando..." : "Resumo"}
                </button>
                <button
                  onClick={handleGenerateTasks}
                  disabled={isStreaming || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {isStreaming ? "Gerando..." : "Tarefas"}
                </button>
                <button
                  onClick={handleGenerateResponse}
                  disabled={isStreaming || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01" />
                  </svg>
                  {isStreaming ? "Gerando..." : "Resposta"}
                </button>

                {prompts.map((prompt) => (
                  <div key={prompt.id} className="relative group">
                    <button
                      onClick={() => handleCustomPrompt(prompt.prompt)}
                      disabled={isStreaming || !description}
                      className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      {isStreaming ? "Gerando..." : prompt.title}
                    </button>
                    
                    <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1 z-10">
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors shadow-lg"
                        title="Editar"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors shadow-lg"
                        title="Deletar"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setEditingPrompt(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500/30 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Criar Prompt
                </button>
              </div>
            </div>

            {showResponsePanel && (
              <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800/50 rounded-md p-4 animate-slideInRight">
                <div className="flex justify-center items-center mb-3 relative">
                  <h3 className="text-sm font-medium text-zinc-300">Resposta</h3>
                  <button
                    onClick={() => {
                      setShowResponsePanel(false);
                      setResponse("");
                    }}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors absolute right-0"
                    title="Fechar painel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative w-full h-[calc(100%-3rem)] bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-y-auto">
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {response || "A resposta gerada aparecerá aqui..."}
                    {isStreaming && <span className="inline-block w-0.5 h-4 bg-yellow-400 ml-0.5 animate-pulse"></span>}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-md p-3">
            <div className="flex justify-center items-center mb-3 relative">
              <h3 className="text-sm font-medium text-zinc-300">Histórico</h3>
              <button className="text-zinc-600 hover:text-zinc-400 transition-all duration-300 hover:scale-110 absolute right-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              <button className="flex items-center gap-2 p-2 rounded-md bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02]">
                <div className="w-8 h-8 bg-zinc-800/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="h-2 bg-zinc-700/50 rounded w-3/4"></div>
                  <div className="h-1.5 bg-zinc-800/50 rounded w-1/2 mt-1"></div>
                </div>
              </button>
              <button className="flex items-center gap-2 p-2 rounded-md bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02]">
                <div className="w-8 h-8 bg-zinc-800/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="h-2 bg-zinc-700/50 rounded w-2/3"></div>
                  <div className="h-1.5 bg-zinc-800/50 rounded w-1/3 mt-1"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

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
      />
    </>
  );
}
