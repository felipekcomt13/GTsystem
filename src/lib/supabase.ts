import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase singleton. Sólo se inicializa si las variables de entorno están definidas.
 * Las implementaciones `Supabase*Repository` deben importar este cliente cuando se materialicen.
 *
 * Variables esperadas (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    if (!url || !anonKey) {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
          "Defínelas en .env.local antes de usar la fuente de datos 'supabase'.",
      );
    }
    client = createClient(url, anonKey);
  }
  return client;
}

export const supabase = {
  get from() {
    return getSupabaseClient().from.bind(getSupabaseClient());
  },
};
