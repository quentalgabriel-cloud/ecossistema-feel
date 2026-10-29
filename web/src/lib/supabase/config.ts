// Onde o app encontra o banco da Feel (projeto `feel`). A chave publicável é pública
// por natureza: quem protege os dados são as regras do banco (RLS e as funções da
// migração feel_nucleo), não o segredo desta chave.

const PADRAO = {
  url: "https://bmwlxjtuhwrqvacnvnhc.supabase.co",
  chave: "sb_publishable_x-0n8-qkvjN6-l22TWJspQ_3DM6hcwe",
};

export interface ConfigSupabase {
  url: string;
  chave: string;
}

interface Ambiente {
  url?: string;
  chave?: string;
  /** "0" força o modo local (sem conta), mesmo com o banco disponível. */
  remoto?: string;
}

// O Next só embute NEXT_PUBLIC_* lidas por acesso direto, então o padrão lê uma a uma.
const ambiente = (): Ambiente => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  chave: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  remoto: process.env.NEXT_PUBLIC_FEEL_REMOTO,
});

export function configSupabase(env: Ambiente = ambiente()): ConfigSupabase | null {
  if (env.remoto === "0") return null;
  const url = env.url?.trim() || PADRAO.url;
  const chave = env.chave?.trim() || PADRAO.chave;
  return url && chave ? { url, chave } : null;
}
