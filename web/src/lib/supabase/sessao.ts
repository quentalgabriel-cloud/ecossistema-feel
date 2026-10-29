import type { SupabaseClient } from "@supabase/supabase-js";

import { clienteSupabase } from "./cliente";
import { configSupabase } from "./config";

// Anônimo primeiro (D-19): a pessoa entra sem cadastro e o que ela faz fica salvo na
// conta dela. O e-mail só aparece na hora de assinar. Se o banco não aceitar a
// entrada anônima (ou não houver rede), o app segue no modo local, neste aparelho.

export type Sessao =
  | { modo: "local"; motivo: "desligado" | "sem_anonimo" | "sem_rede" }
  | {
      modo: "remoto";
      cliente: SupabaseClient;
      usuarioId: string;
      /** Sessão anônima cria e mede, mas não assina. */
      anonimo: boolean;
    };

/** O mínimo do cliente que a sessão usa — facilita testar sem rede. */
type ClienteAuth = Pick<SupabaseClient, "auth">;

const ESPERA_MS = 6000;

function comPrazo<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("prazo")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      },
    );
  });
}

/**
 * Pergunta ao projeto se a entrada anônima está ligada, antes de tentar: assim a
 * recusa esperada não vira erro no console de cada visita.
 */
async function anonimoLigadoNoProjeto(): Promise<boolean> {
  const cfg = configSupabase();
  if (!cfg) return false;
  const r = await fetch(`${cfg.url}/auth/v1/settings`, { headers: { apikey: cfg.chave } });
  if (!r.ok) throw new Error(`settings ${r.status}`);
  const corpo = (await r.json()) as { external?: { anonymous_users?: boolean } };
  return corpo.external?.anonymous_users === true;
}

export async function abrirSessao(
  cliente: ClienteAuth | null,
  espera = ESPERA_MS,
  anonimoLigado: () => Promise<boolean> = async () => true,
): Promise<Sessao> {
  if (!cliente) return { modo: "local", motivo: "desligado" };
  const remoto = (u: { id: string; is_anonymous?: boolean }): Sessao => ({
    modo: "remoto",
    cliente: cliente as SupabaseClient,
    usuarioId: u.id,
    anonimo: u.is_anonymous !== false,
  });
  try {
    const { data } = await comPrazo(cliente.auth.getSession(), espera);
    if (data.session?.user) return remoto(data.session.user);
    if (!(await comPrazo(anonimoLigado(), espera))) return { modo: "local", motivo: "sem_anonimo" };
    const { data: entrada, error } = await comPrazo(cliente.auth.signInAnonymously(), espera);
    if (error || !entrada.user) {
      // 4xx = o projeto recusou (entrada anônima desligada); o resto é rede ou servidor.
      const status = (error as { status?: number } | null)?.status ?? 0;
      return { modo: "local", motivo: status >= 400 && status < 500 ? "sem_anonimo" : "sem_rede" };
    }
    return remoto(entrada.user);
  } catch {
    return { modo: "local", motivo: "sem_rede" };
  }
}

let atual: Promise<Sessao> | null = null;

/** A sessão da aba, aberta uma vez só. */
export function sessaoAtual(): Promise<Sessao> {
  atual ??= clienteSupabase().then(
    (c) => abrirSessao(c, ESPERA_MS, anonimoLigadoNoProjeto),
    // A biblioteca não carregou (rede caiu no meio): segue neste aparelho.
    (): Sessao => ({ modo: "local", motivo: "sem_rede" }),
  );
  return atual;
}

/** Depois de confirmar o e-mail, a sessão deixa de ser anônima: reabre para ler isso. */
export function reabrirSessao(): Promise<Sessao> {
  atual = null;
  return sessaoAtual();
}

export type ResultadoEmail = { ok: true } | { ok: false; erro: "invalido" | "servidor" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Liga um e-mail à conta anônima. O banco manda um link de confirmação; ao abrir o
 * link, a conta deixa de ser anônima e pode assinar.
 */
export async function pedirEmail(
  cliente: ClienteAuth,
  email: string,
  voltarPara: string,
): Promise<ResultadoEmail> {
  const e = email.trim();
  if (!EMAIL.test(e)) return { ok: false, erro: "invalido" };
  try {
    const { error } = await cliente.auth.updateUser({ email: e }, { emailRedirectTo: voltarPara });
    return error ? { ok: false, erro: "servidor" } : { ok: true };
  } catch {
    return { ok: false, erro: "servidor" };
  }
}
