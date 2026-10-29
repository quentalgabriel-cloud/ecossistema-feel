import type { SupabaseClient } from "@supabase/supabase-js";

import { configSupabase } from "./config";

let cliente: Promise<SupabaseClient | null> | undefined;

/**
 * Um cliente por aba, carregado sob demanda: a biblioteca não pesa no primeiro
 * desenho da tela. `null` quando o modo local foi forçado.
 */
export function clienteSupabase(): Promise<SupabaseClient | null> {
  cliente ??= (async () => {
    const cfg = configSupabase();
    if (!cfg) return null;
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(cfg.url, cfg.chave, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  })();
  return cliente;
}
