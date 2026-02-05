"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Collection,
  createCollection,
  fetchCollections,
} from "@/lib/api/journaling";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AppDashboardPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function ensureSession() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      await loadCollections();
    }

    async function loadCollections() {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar coleções.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void ensureSession();
  }, [router]);

  async function handleCreateQuickJournal() {
    setCreating(true);
    setError(null);
    try {
      const created = await createCollection({
        title: "Journal",
        type: "journal",
      });
      setCollections((prev) => [...prev, created]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar coleção.";
      setError(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.replace("/login");
  }

  const today = new Date().toISOString().slice(0, 10);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-600">Carregando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">e-Bujo · Dashboard</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-zinc-600 hover:underline"
          >
            Sair
          </button>
        </header>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Coleções</h2>
            <button
              type="button"
              onClick={handleCreateQuickJournal}
              disabled={creating}
              className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {creating ? "Criando..." : "Criar Journal rápido"}
            </button>
          </div>
          {collections.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Nenhuma coleção ainda. Crie um journal para começar.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {collections.map((collection) => (
                <li key={collection.id} className="flex items-center gap-2">
                  <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-full bg-zinc-100 text-xs uppercase text-zinc-700">
                    {collection.type}
                  </span>
                  <Link
                    href={`/app/collections/${collection.id}?date=${today}`}
                    className="flex-1 hover:underline"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Hábitos</h2>
            <Link
              href="/app/habits"
              className="text-xs text-zinc-600 hover:underline"
            >
              Abrir painel de hábitos
            </Link>
          </div>
          <p className="text-xs text-zinc-600">
            Use o painel de hábitos para testar a tabela{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[10px]">
              habit_trackers
            </code>{" "}
            e{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-[10px]">
              habit_logs
            </code>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

