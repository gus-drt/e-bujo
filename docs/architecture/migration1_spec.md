Database Schema Specification: Meu Bujo Digital (v1.0)
Este documento define a estrutura de dados inicial para o Supabase. O design prioriza a extensibilidade de blocos e a rastreabilidade temporal (Daily/Monthly logs).

1. Core Tables (Journaling & Tasks)
profiles
Extensão da tabela auth.users do Supabase para armazenar preferências de UI.

id: uuid (primary key, references auth.users)

full_name: text

avatar_url: text

theme_preference: text (default: 'ivory')

updated_at: timestamp with time zone

collections
Representa os diferentes cadernos ou agrupamentos (ex: "Trabalho", "Pessoal", "Projeto X").

id: uuid (primary key)

user_id: uuid (references profiles.id)

title: text

type: text (enum: 'journal', 'project', 'zettelkasten')

is_pinned: boolean (default: false)

created_at: timestamp

entries (The Rapid Logging Engine)
A tabela principal. Cada linha é um "ponto" no Bullet Journal. O conteúdo será renderizado via TipTap.

id: uuid (primary key)

user_id: uuid (references profiles.id)

collection_id: uuid (references collections.id)

parent_id: uuid (self-reference para threading ou subtarefas)

type: text (enum: 'task', 'event', 'note', 'idea')

status: text (enum: 'todo', 'completed', 'migrated', 'cancelled')

content: jsonb (armazenamento de documentos TipTap JSON para rich text rápido)

raw_text: text (para busca full-text rápida)

scheduled_date: date (para logs diários/planejamento futuro)

created_at: timestamp

2. Productivity & Habit Tracking (Extended Version)
habit_trackers
id: uuid (primary key)

user_id: uuid (references profiles.id)

name: text (ex: "Beber Água")

goal_value: integer

unit: text (ex: "ml", "vezes")

frequency: jsonb (dias da semana)

habit_logs
id: uuid (primary key)

habit_id: uuid (references habit_trackers.id)

completed_at: date

value: integer

3. Knowledge Graph (Bi-directional Links)
backlinks
Mapeia as conexões entre notas estilo Obsidian.

id: uuid (primary key)

source_entry_id: uuid (references entries.id)

target_entry_id: uuid (references entries.id)

context_snippet: text (o trecho de texto onde o link ocorre)

4. SQL Implementation Snippet (Migration 01)
Para aplicar no editor SQL do Supabase ou via Cursor:

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar enums para consistência
CREATE TYPE entry_type AS ENUM ('task', 'event', 'note', 'idea');
CREATE TYPE entry_status AS ENUM ('todo', 'completed', 'migrated', 'cancelled');

CREATE TABLE public.entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id),
  parent_id UUID REFERENCES public.entries(id),
  type entry_type DEFAULT 'note',
  status entry_status DEFAULT 'todo',
  content JSONB NOT NULL,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexação para busca rápida por data (Daily Log)
CREATE INDEX idx_entries_user_date ON public.entries (user_id, scheduled_date);