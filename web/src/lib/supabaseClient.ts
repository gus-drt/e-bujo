import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Em desenvolvimento, falhar cedo ajuda a detectar má configuração de ambiente.
  // No futuro podemos trocar por log/telemetria.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabaseClient] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidos."
  );
}

export const supabaseClient = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);

