"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  HabitLog,
  HabitTracker,
  fetchHabitLogsByDate,
  fetchHabits,
  toggleHabitForDate,
} from "@/lib/api/habits";

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitTracker[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  useEffect(() => {
    async function ensureSessionAndLoad() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      await loadData();
    }

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [habitData, logData] = await Promise.all([
          fetchHabits(),
          fetchHabitLogsByDate({ date: today }),
        ]);
        setHabits(habitData);
        setLogs(logData);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao carregar hábitos e logs.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void ensureSessionAndLoad();
  }, [router, today]);

  function isHabitDoneToday(habitId: string) {
    return logs.some((log) => log.habit_id === habitId);
  }

  async function handleToggleHabit(habitId: string) {
    setTogglingId(habitId);
    setError(null);
    try {
      await toggleHabitForDate({ habitId, date: today });
      const updatedLogs = await fetchHabitLogsByDate({ date: today });
      setLogs(updatedLogs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar hábito.";
      setError(message);
    } finally {
      setTogglingId(null);
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
          <h1 className="text-sm font-semibold">
            Hábitos · {new Date(today).toLocaleDateString("pt-BR")}
          </h1>
        </header>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold">Hábitos configurados</h2>
          {loading ? (
            <p className="text-sm text-zinc-600">Carregando hábitos...</p>
          ) : habits.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Nenhum hábito ainda. Crie alguns diretamente na tabela
              <code className="ml-1 rounded bg-zinc-100 px-1 text-[10px]">
                habit_trackers
              </code>{" "}
              no Supabase para este protótipo.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {habits.map((habit) => {
                const done = isHabitDoneToday(habit.id);
                return (
                  <li
                    key={habit.id}
                    className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2"
                  >
                    <span>{habit.name}</span>
                    <button
                      type="button"
                      disabled={togglingId === habit.id}
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        done
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-200 text-zinc-800"
                      } disabled:opacity-60`}
                    >
                      {done ? "Feito" : "Marcar hoje"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

