import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800/40 bg-black/60 backdrop-blur-sm sticky top-0 z-30">
      <nav className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-extrabold text-yellow-400 hover:text-yellow-300 transition-colors font-[family-name:var(--font-kufam)]">
          Audiodesc
        </Link>
        <button className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 hover:text-yellow-300">
          Conectar-se
        </button>
      </nav>
    </header>
  );
}
