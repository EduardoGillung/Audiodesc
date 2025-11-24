"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulação de envio (implementar backend depois)
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Mensagem Enviada!
            </h2>
            <p className="text-zinc-400 mb-6">
              Recebemos sua mensagem e responderemos em breve.
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-6 py-2.5 rounded-md transition-all duration-300 hover:scale-[1.02]"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </Link>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Contato</h1>
        <p className="text-zinc-400 mb-8">
          Entre em contato conosco. Responderemos o mais breve possível.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={formData.assunto}
                  onChange={(e) =>
                    setFormData({ ...formData, assunto: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Assunto da mensagem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) =>
                    setFormData({ ...formData, mensagem: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  placeholder="Escreva sua mensagem..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2.5 rounded-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Informações de Contato
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <a
                      href="mailto:contato@audiodesc.com"
                      className="text-zinc-200 hover:text-yellow-400"
                    >
                      contato@audiodesc.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-zinc-400">Horário de Atendimento</p>
                    <p className="text-zinc-200">
                      Segunda a Sexta: 9h às 18h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Perguntas Frequentes
              </h3>
              <p className="text-zinc-400 text-sm">
                Antes de entrar em contato, confira se sua dúvida já foi
                respondida em nossa seção de perguntas frequentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
