import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-800">
      <div className="mx-auto max-w-9xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <h2 className="text-base font-extrabold text-yellow-400 font-[family-name:var(--font-kufam)]">
                Audiodesc</h2>
            <p className="text-xs text-zinc-300 mt-1.5">
              Transcritor de áudio para mensagens de texto.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium mb-3 text-zinc-400">Navegação</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-zinc-300 transition-colors">Início</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium mb-3 text-zinc-400">Suporte</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-zinc-300 transition-colors">Contato</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-zinc-300 transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-zinc-300 transition-colors">Termos de Uso</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-zinc-800/50 mt-6 pt-4 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Audiodesc — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
