"use client";
import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");

  const handleConvert = () => {
    console.log("Convertendo:", url);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          
          <div>
            <h2 className="text-base mb-2 text-yellow-400">Conversor de Áudio para texto.</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cole o link URL do áudio aqui para converter."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900"
              />
              <button
                onClick={handleConvert}
                className="bg-yellow-400/90 hover:bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md transition-all"
              >
                Converter
              </button>
              <button className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 px-3 py-2 rounded-md transition-all flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm">Arquivo</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs text-zinc-500">Resumo completo do áudio:</label>
            <input
              type="text"
              placeholder="Título:"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-md p-3">
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
                className="w-full h-56 bg-transparent border-none resize-none focus:outline-none text-sm text-zinc-500"
                placeholder="A descrição aparecerá aqui..."
              />
              <button className="mt-2 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Criar Resposta
              </button>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-md p-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-zinc-300">Histórico</h3>
                <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-800/50 rounded-full"></div>
                  <div className="flex-1 h-3 bg-zinc-800/50 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-800/50 rounded-full"></div>
                  <div className="flex-1 h-3 bg-zinc-800/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500">Resposta:</label>
              <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full h-16 bg-zinc-900/50 border border-zinc-800/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 resize-none"
              placeholder="A resposta aparecerá aqui..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
