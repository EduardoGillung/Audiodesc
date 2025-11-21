"use client";
import { useState, useRef } from "react";
import Toast from "@/components/ui/Toast";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateResponse = async () => {
    if (!description) {
      setToast({ message: "Nenhuma transcrição para processar", type: "error" });
      return;
    }

    setGeneratingResponse(true);
    try {
      const res = await fetch("/api/generate/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
        setToast({ message: "Resposta gerada com sucesso!", type: "success" });
      } else {
        setToast({ message: "Erro ao gerar resposta", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erro ao gerar resposta", type: "error" });
    } finally {
      setGeneratingResponse(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (!description) {
      setToast({ message: "Nenhuma transcrição para processar", type: "error" });
      return;
    }

    setGeneratingResponse(true);
    try {
      const res = await fetch("/api/generate/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });

      const data = await res.json();
      if (data.tasks) {
        setResponse(data.tasks);
        setToast({ message: "Lista de tarefas gerada!", type: "success" });
      } else {
        setToast({ message: "Erro ao gerar tarefas", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erro ao gerar tarefas", type: "error" });
    } finally {
      setGeneratingResponse(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!description) {
      setToast({ message: "Nenhuma transcrição para processar", type: "error" });
      return;
    }

    setGeneratingResponse(true);
    try {
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });

      const data = await res.json();
      if (data.summary) {
        setResponse(data.summary);
        setToast({ message: "Resumo gerado com sucesso!", type: "success" });
      } else {
        setToast({ message: "Erro ao gerar resumo", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erro ao gerar resumo", type: "error" });
    } finally {
      setGeneratingResponse(false);
    }
  };

  const handleConvertUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/transcribe/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.text) {
        setDescription(data.text);
        setTitle("Transcrição de URL");
        setToast({ message: "Áudio transcrito com sucesso!", type: "success" });
      } else {
        setToast({ message: data.error || "Erro ao transcrever áudio", type: "error" });
      }
    } catch (error) {
      console.error("Erro:", error);
      setToast({ message: "Erro ao processar áudio", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setDescription(data.text);
        setTitle(file.name);
        setToast({ message: "Arquivo transcrito com sucesso!", type: "success" });
      } else {
        setToast({ message: data.error || "Erro ao transcrever arquivo", type: "error" });
      }
    } catch (error) {
      console.error("Erro:", error);
      setToast({ message: "Erro ao processar arquivo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="text-white px-4 py-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
          
          <div className="bg-zinc-800/20 p-6 rounded-md border border-zinc-800/50">
            <h2 className="text-base mb-2 text-yellow-400">Transcritor de Áudio para texto.</h2>
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
                  className="w-full bg-zinc-800 border border-zinc-800/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900"
                />
              </div>
              <button
                onClick={handleConvertUrl}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : "Converter"}
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
                disabled={loading}
                className="bg-zinc-800 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-2 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5m0 0L7 8m5-5v12" />
                </svg>
                <span className="text-sm text-zinc-300"> Enviar Arquivo</span>
              </button>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block mb-2 text-xs text-zinc-300">Título:</label>
              <input
                type="text"
                placeholder="Título da transcrição"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-800/50 rounded-md px-3 py-1.5 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900"
              />
            </div>
            <button
              onClick={() => {
                setTitle("");
                setDescription("");
                setResponse("");
              }}
              className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 text-sm text-zinc-300 hover:text-white"
            >
              Limpar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            <div className="md:col-span-3 bg-zinc-900/30 border border-zinc-800 rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-zinc-300">Descrição do Áudio</h3>
                <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-80 bg-zinc-800 p-4 rounded-md border-none resize-none focus:outline-none text-base text-zinc-200 leading-relaxed"
                placeholder="A transcrição aparecerá aqui..."
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={handleGenerateSummary}
                  disabled={generatingResponse || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {generatingResponse ? "Gerando..." : "Resumo"}
                </button>
                <button
                  onClick={handleGenerateTasks}
                  disabled={generatingResponse || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {generatingResponse ? "Gerando..." : "Tarefas"}
                </button>
                <button
                  onClick={handleGenerateResponse}
                  disabled={generatingResponse || !description}
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-1.5 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01" />
                  </svg>
                  {generatingResponse ? "Gerando..." : "Resposta"}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-md p-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-zinc-300">Histórico</h3>
                <button className="text-zinc-600 hover:text-zinc-400 transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 p-2 rounded-md bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02]">
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
                <button className="w-full flex items-center gap-2 p-2 rounded-md bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02]">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-300">Resposta:</label>
              <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full min-h-64 bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-base text-zinc-200 leading-relaxed placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 resize-y"
              placeholder="A resposta gerada aparecerá aqui..."
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
