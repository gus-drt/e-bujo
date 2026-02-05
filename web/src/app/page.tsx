import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">e-Bujo · Protótipo</h1>
        <p className="text-sm text-zinc-600">
          Esta é a etapa inicial focada em testar o schema Supabase
          (journaling, hábitos e backlinks). Use o login para criar dados reais
          no banco.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    </main>
  );
}

