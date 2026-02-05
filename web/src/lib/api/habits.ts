import { supabaseClient } from "../supabaseClient";

export interface HabitTracker {
  id: string;
  user_id: string;
  name: string;
  goal_value: number | null;
  unit: string | null;
  frequency: unknown;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  value: number | null;
  created_at: string;
}

export async function fetchHabits(): Promise<HabitTracker[]> {
  const { data, error } = await supabaseClient
    .from("habit_trackers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar hábitos: ${error.message}`);
  }

  return data ?? [];
}

export async function fetchHabitLogsByDate(params: {
  date: string; // ISO YYYY-MM-DD
}): Promise<HabitLog[]> {
  const { data, error } = await supabaseClient
    .from("habit_logs")
    .select("*")
    .eq("completed_at", params.date);

  if (error) {
    throw new Error(`Erro ao buscar logs de hábitos: ${error.message}`);
  }

  return data ?? [];
}

export async function toggleHabitForDate(params: {
  habitId: string;
  date: string; // ISO YYYY-MM-DD
}): Promise<void> {
  const { data: existing, error: fetchError } = await supabaseClient
    .from("habit_logs")
    .select("*")
    .eq("habit_id", params.habitId)
    .eq("completed_at", params.date)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Erro ao verificar log de hábito: ${fetchError.message}`);
  }

  if (existing) {
    const { error: deleteError } = await supabaseClient
      .from("habit_logs")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      throw new Error(`Erro ao desmarcar hábito: ${deleteError.message}`);
    }
    return;
  }

  const { error: insertError } = await supabaseClient.from("habit_logs").insert({
    habit_id: params.habitId,
    completed_at: params.date,
    value: 1,
  });

  if (insertError) {
    throw new Error(`Erro ao marcar hábito: ${insertError.message}`);
  }
}

