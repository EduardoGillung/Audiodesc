import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800/50 bg-black/95 backdrop-blur-sm sticky top-0 z-30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-extrabold text-yellow-400 hover:text-yellow-300 transition-colors font-[family-name:var(--font-kufam)]">
          AudioDesc
        </Link>
        <button className="bg-yellow-400/90 hover:bg-yellow-400 text-black text-sm font-medium px-4 py-1.5 rounded-md transition-all">
          Conectar-se
        </button>
      </nav>
    </header>
  );
}
