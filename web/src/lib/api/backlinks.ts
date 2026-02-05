import { supabaseClient } from "../supabaseClient";

export interface Backlink {
  id: string;
  source_entry_id: string;
  target_entry_id: string;
  context_snippet: string | null;
  created_at: string;
}

export async function fetchBacklinksForEntry(
  entryId: string
): Promise<Backlink[]> {
  const { data, error } = await supabaseClient
    .from("backlinks")
    .select("*")
    .or(
      `source_entry_id.eq.${entryId},target_entry_id.eq.${entryId}` as string
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar backlinks: ${error.message}`);
  }

  return data ?? [];
}

export async function createBacklink(input: {
  sourceEntryId: string;
  targetEntryId: string;
  contextSnippet?: string;
}): Promise<Backlink> {
  const { data, error } = await supabaseClient
    .from("backlinks")
    .insert({
      source_entry_id: input.sourceEntryId,
      target_entry_id: input.targetEntryId,
      context_snippet: input.contextSnippet ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao criar backlink: ${error.message}`);
  }

  return data;
}

