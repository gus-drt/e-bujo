-- Migration 01 - Initial schema for e-Bujo
-- Esta migração define enums e tabelas base para o journaling.

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums para entries
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_type') THEN
    CREATE TYPE entry_type AS ENUM ('task', 'event', 'note', 'idea');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entry_status') THEN
    CREATE TYPE entry_status AS ENUM ('todo', 'completed', 'migrated', 'cancelled');
  END IF;
END$$;

-- Tabela de perfis (extensão de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'ivory',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de coleções (cadernos/agrupamentos)
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('journal', 'project', 'zettelkasten')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_user ON public.collections(user_id);

-- Tabela de entries (Rapid Logging Engine)
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.entries(id) ON DELETE SET NULL,
  type entry_type DEFAULT 'note',
  status entry_status DEFAULT 'todo',
  content JSONB NOT NULL,
  raw_text TEXT,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entries_user_date ON public.entries (user_id, scheduled_date);

-- -------------------------------------------------------------------
-- Migration 02 - RLS e módulos avançados (hábitos e backlinks)
-- Mantida no mesmo arquivo para simplicidade neste estágio inicial.
-- -------------------------------------------------------------------

-- Tabelas de hábitos
CREATE TABLE IF NOT EXISTS public.habit_trackers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal_value INTEGER,
  unit TEXT,
  frequency JSONB, -- ex.: { "mon": true, "tue": false, ... }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES public.habit_trackers(id) ON DELETE CASCADE,
  completed_at DATE NOT NULL,
  value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de backlinks (grafo de conhecimento)
CREATE TABLE IF NOT EXISTS public.backlinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_entry_id UUID REFERENCES public.entries(id) ON DELETE CASCADE,
  target_entry_id UUID REFERENCES public.entries(id) ON DELETE CASCADE,
  context_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices auxiliares
CREATE INDEX IF NOT EXISTS idx_habit_trackers_user ON public.habit_trackers(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit ON public.habit_logs(habit_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_backlinks_source ON public.backlinks(source_entry_id);
CREATE INDEX IF NOT EXISTS idx_backlinks_target ON public.backlinks(target_entry_id);

-- -------------------------------------------------------------------
-- RLS (Row Level Security)
-- -------------------------------------------------------------------

-- Habilita RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlinks ENABLE ROW LEVEL SECURITY;

-- Perfis: cada usuário só vê/edita o próprio perfil
CREATE POLICY "Profiles select own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Profiles update own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Coleções: visíveis apenas pelo dono
CREATE POLICY "Collections select own" ON public.collections
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Collections modify own" ON public.collections
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Entries: visíveis apenas pelo dono (via user_id)
CREATE POLICY "Entries select own" ON public.entries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Entries modify own" ON public.entries
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Habit trackers: vinculados ao perfil do usuário
CREATE POLICY "Habits select own" ON public.habit_trackers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Habits modify own" ON public.habit_trackers
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Habit logs: acessíveis apenas via hábitos do próprio usuário
CREATE POLICY "Habit logs via own habits" ON public.habit_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.habit_trackers h
      WHERE h.id = habit_logs.habit_id
        AND h.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.habit_trackers h
      WHERE h.id = habit_logs.habit_id
        AND h.user_id = auth.uid()
    )
  );

-- Backlinks: apenas backlinks entre entries do próprio usuário
CREATE POLICY "Backlinks via own entries" ON public.backlinks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.entries e
      WHERE e.id = backlinks.source_entry_id
        AND e.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.entries e2
      WHERE e2.id = backlinks.target_entry_id
        AND e2.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.entries e
      WHERE e.id = backlinks.source_entry_id
        AND e.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM public.entries e2
      WHERE e2.id = backlinks.target_entry_id
        AND e2.user_id = auth.uid()
    )
  );

