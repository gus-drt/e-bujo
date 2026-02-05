import { supabaseClient } from "../supabaseClient";

export type EntryType = "task" | "event" | "note" | "idea";
export type EntryStatus = "todo" | "completed" | "migrated" | "cancelled";

export interface Collection {
  id: string;
  user_id: string;
  title: string;
  type: "journal" | "project" | "zettelkasten";
  is_pinned: boolean;
  created_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  collection_id: string | null;
  parent_id: string | null;
  type: EntryType;
  status: EntryStatus;
  content: unknown;
  raw_text: string | null;
  scheduled_date: string;
  created_at: string;
}

async function ensureProfileForCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError) {
    throw new Error(`Erro ao obter usuário autenticado: ${userError.message}`);
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: existingProfile, error: fetchError } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(
      `Erro ao verificar perfil do usuário: ${fetchError.message}`
    );
  }

  if (!existingProfile) {
    const { error: insertError } = await supabaseClient.from("profiles").insert(
      {
        id: user.id,
        full_name:
          (user.user_metadata as { full_name?: string } | null)?.full_name ??
          null,
        avatar_url:
          (user.user_metadata as { avatar_url?: string } | null)?.avatar_url ??
          null,
      }
    );

    if (insertError) {
      throw new Error(
        `Erro ao criar perfil do usuário: ${insertError.message}`
      );
    }
  }

  return user;
}

export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabaseClient
    .from("collections")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar coleções: ${error.message}`);
  }

  return data ?? [];
}

export async function createCollection(input: {
  title: string;
  type: Collection["type"];
}): Promise<Collection> {
  const user = await ensureProfileForCurrentUser();

  const { data, error } = await supabaseClient
    .from("collections")
    .insert({
      user_id: user.id,
      title: input.title,
      type: input.type,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao criar coleção: ${error.message}`);
  }

  return data;
}

export async function fetchEntriesByDate(params: {
  collectionId?: string;
  date: string; // ISO YYYY-MM-DD
}): Promise<Entry[]> {
  let query = supabaseClient
    .from("entries")
    .select("*")
    .eq("scheduled_date", params.date)
    .order("created_at", { ascending: true });

  if (params.collectionId) {
    query = query.eq("collection_id", params.collectionId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar entries: ${error.message}`);
  }

  return data ?? [];
}

export async function createEntry(input: {
  collectionId?: string;
  type: EntryType;
  status?: EntryStatus;
  content: unknown;
  rawText?: string;
  scheduledDate: string; // ISO YYYY-MM-DD
}): Promise<Entry> {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError) {
    throw new Error(`Erro ao obter usuário autenticado: ${userError.message}`);
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabaseClient
    .from("entries")
    .insert({
      user_id: user.id,
      collection_id: input.collectionId ?? null,
      type: input.type,
      status: input.status ?? "todo",
      content: input.content,
      raw_text: input.rawText ?? null,
      scheduled_date: input.scheduledDate,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao criar entry: ${error.message}`);
  }

  return data;
}

