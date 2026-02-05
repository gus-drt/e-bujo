"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  Entry,
  EntryType,
  createEntry,
  fetchEntriesByDate,
} from "@/lib/api/journaling";
import { BuJoEditor } from "@/components/BuJoEditor";

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function CollectionDailyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectionId = params.id;
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const dateLabel = useMemo(() => formatDateLabel(date), [date]);

  useEffect(() => {
    async function ensureSessionAndLoad() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      await loadEntries();
    }

    async function loadEntries() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEntriesByDate({ collectionId, date });
        setEntries(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar entries.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void ensureSessionAndLoad();
  }, [collectionId, date, router]);

  function navigateTo(offset: number) {
    const current = new Date(date);
    current.setDate(current.getDate() + offset);
    const nextDate = current.toISOString().slice(0, 10);
    router.push(`/app/collections/${collectionId}?date=${nextDate}`);
  }

  async function handleCreateEntry(input: {
    type: EntryType;
    content: unknown;
    rawText: string;
  }) {
    try {
      const created = await createEntry({
        collectionId,
        type: input.type,
        content: input.content,
        rawText: input.rawText,
        scheduledDate: date,
      });
      setEntries((prev) => [...prev, created]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar entry.";
      setError(message);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/app")}
            className="text-xs text-zinc-600 hover:underline"
          >
            ← Voltar para dashboard
          </button>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigateTo(-1)}
              className="rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50"
            >
              Dia anterior
            </button>
            <span className="font-medium">{dateLabel}</span>
            <button
              type="button"
              onClick={() => navigateTo(1)}
              className="rounded-md border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-50"
            >
              Próximo dia
            </button>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold">
            Entries do dia ({entries.length})
          </h2>
          {loading ? (
            <p className="text-sm text-zinc-600">Carregando entries...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Nenhuma entry ainda para esta data.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start gap-2 rounded-md bg-zinc-50 p-2"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold uppercase">
                    {entry.type[0]}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500">
                      status: {entry.status}
                    </p>
                    <pre className="whitespace-pre-wrap text-xs text-zinc-800">
                      {entry.raw_text}
                    </pre>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
          <h2 className="mb-2 text-sm font-semibold">
            Novo item rápido (TipTap)
          </h2>
          <p className="mb-2 text-xs text-zinc-600">
            Digite símbolos BuJo no início da linha:{" "}
            <code className="rounded bg-zinc-200 px-1 text-[10px]">-</code>{" "}
            (task),{" "}
            <code className="rounded bg-zinc-200 px-1 text-[10px]">o</code>{" "}
            (event),{" "}
            <code className="rounded bg-zinc-200 px-1 text-[10px]">.</code>{" "}
            (note),{" "}
            <code className="rounded bg-zinc-200 px-1 text-[10px]">{">"}</code>{" "}
            (idea/migrated).
          </p>
          <BuJoEditor onSubmit={handleCreateEntry} />
        </section>
      </div>
    </main>
  );
}

