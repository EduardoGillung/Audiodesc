import Link from "next/link";
import { getUser, signOut } from "@/lib/actions/auth.actions";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="w-full sticky top-0 z-30 backdrop-blur-md bg-gray-700/80 border-b border-zinc-600/20">
      <nav className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-extrabold text-yellow-400 hover:text-yellow-300 transition-all font-[family-name:var(--font-kufam)]">
          Audiodesc
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-zinc-300 text-sm hidden sm:inline">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 hover:text-yellow-300"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 hover:text-yellow-300"
              style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.6), 0 0 30px rgba(250, 204, 21, 0.4)' }}
            >
              Conectar-se
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
