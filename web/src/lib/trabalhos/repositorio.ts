import type { SupabaseClient } from "@supabase/supabase-js";

import type { Acordo, DireitosUso, Estagio, Funil, Trabalho } from "@/data/trabalhos/tipos";

import {
  assinar,
  avancar,
  carimbarAcordo,
  funilVazio,
  novoTrabalho,
  registrarFunil,
  registrarVeredito,
  type ErroCiclo,
} from "./ciclo";
import { gravarTrabalhos, lerTrabalhos, type MemoriaTrabalhos } from "./memoria";

// Onde o trabalho mora. Duas implementações com a mesma forma:
//   · local: este aparelho (localStorage), como na demonstração da Onda 2;
//   · remoto: a conta da pessoa no banco da Feel.
// As regras puras de ciclo.ts validam primeiro nos dois casos; no remoto, o banco
// valida de novo (RLS, triggers e funções) e tem a palavra final.

export type ErroRepositorio = ErroCiclo | "pede_email" | "servidor";
export type ResultadoRepo = { ok: true; trabalho: Trabalho } | { ok: false; erro: ErroRepositorio };

export type DadosAcordo = {
  perfilId: string;
  entregaveis: string[];
  direitos: DireitosUso;
  prazo: string;
  esperamos: string;
  erramosSe: string;
};

export interface RepositorioTrabalhos {
  modo: "local" | "remoto";
  carregar(): Promise<MemoriaTrabalhos>;
  /** Guarda o estado da tela. No remoto, só a necessidade em rascunho (com espera). */
  guardar(m: MemoriaTrabalhos): void;
  novo(agora: string): Trabalho;
  carimbar(t: Trabalho, dados: DadosAcordo, agora: string): Promise<ResultadoRepo>;
  avancar(t: Trabalho): Promise<ResultadoRepo>;
  medir(t: Trabalho, f: Funil): Promise<ResultadoRepo>;
  veredito(t: Trabalho, v: string): Promise<ResultadoRepo>;
  assinar(t: Trabalho, lado: "contratante" | "profissional", agora: string): Promise<ResultadoRepo>;
  /** Link de convite para quem cria. `null` no modo local (não há outro lado de verdade). */
  convidar(t: Trabalho): Promise<string | null>;
  descartar(t: Trabalho): Promise<void>;
}

// ---------------------------------------------------------------------------
// Local
// ---------------------------------------------------------------------------

export const repositorioLocal: RepositorioTrabalhos = {
  modo: "local",
  carregar: async () => lerTrabalhos(),
  guardar: gravarTrabalhos,
  novo: (agora) => novoTrabalho(`t-${Date.now()}`, agora),
  carimbar: async (t, dados, agora) => carimbarAcordo(t, dados, agora),
  avancar: async (t) => avancar(t),
  medir: async (t, f) => registrarFunil(t, f),
  veredito: async (t, v) => registrarVeredito(t, v),
  assinar: async (t, lado, agora) => assinar(t, lado, agora),
  convidar: async () => null,
  descartar: async () => {},
};

// ---------------------------------------------------------------------------
// Linhas do banco ↔ Trabalho
// ---------------------------------------------------------------------------

export interface LinhaAcordo {
  perfil_demo: string;
  entregaveis: string[];
  direitos: DireitosUso;
  prazo: string;
  esperamos: string;
  erramos_se: string;
  carimbado_em: string;
}

export interface LinhaTrabalho {
  id: string;
  criado_em: string;
  texto: string;
  entendimento: Trabalho["entendimento"];
  economia: Partial<Trabalho["economia"]> | null;
  funil: Partial<Funil> | null;
  estagio: Estagio;
  veredito: string | null;
  /** Um para um: o PostgREST devolve objeto, mas aceitamos lista por segurança. */
  feel_acordos?: LinhaAcordo | LinhaAcordo[] | null;
  feel_assinaturas?: { lado: "contratante" | "profissional"; assinado_em: string }[] | null;
}

const umSo = <T>(x: T | T[] | null | undefined): T | null =>
  Array.isArray(x) ? (x[0] ?? null) : (x ?? null);

export function acordoDeLinha(a: LinhaAcordo): Acordo {
  return Object.freeze({
    perfilId: a.perfil_demo,
    entregaveis: Object.freeze([...a.entregaveis]),
    direitos: a.direitos,
    prazo: a.prazo,
    esperamos: a.esperamos,
    erramosSe: a.erramos_se,
    carimbadoEm: a.carimbado_em,
  });
}

export function trabalhoDeLinha(l: LinhaTrabalho): Trabalho {
  const acordo = umSo(l.feel_acordos);
  const assinatura = (lado: "contratante" | "profissional") =>
    l.feel_assinaturas?.find((a) => a.lado === lado)?.assinado_em ?? null;
  return {
    id: l.id,
    criadoEm: l.criado_em,
    texto: l.texto,
    entendimento: l.entendimento,
    economia: {
      ticketMedio: l.economia?.ticketMedio ?? null,
      conversaoDe10: l.economia?.conversaoDe10 ?? null,
      orcamento: l.economia?.orcamento ?? null,
    },
    acordo: acordo ? acordoDeLinha(acordo) : null,
    estagio: l.estagio,
    funil: { ...funilVazio, ...(l.funil ?? {}) },
    veredito: l.veredito,
    assinaturas: {
      contratante: assinatura("contratante"),
      profissional: assinatura("profissional"),
    },
  };
}

/** A tela mostra o mais recente; os encerrados anteriores contam como provas. */
export function memoriaDeLinhas(linhas: LinhaTrabalho[]): MemoriaTrabalhos {
  const trabalhos = linhas.map(trabalhoDeLinha);
  const [atual = null, ...resto] = trabalhos;
  return { atual, encerrados: resto.filter((t) => t.estagio === "encerrado") };
}

export const SELECAO_TRABALHO =
  "id, criado_em, texto, entendimento, economia, funil, estagio, veredito, " +
  "feel_acordos(perfil_demo, entregaveis, direitos, prazo, esperamos, erramos_se, carimbado_em), " +
  "feel_assinaturas(lado, assinado_em)";

// ---------------------------------------------------------------------------
// Remoto
// ---------------------------------------------------------------------------

type Cliente = Pick<SupabaseClient, "from" | "rpc">;

const ESPERA_RASCUNHO_MS = 600;

export function repositorioRemoto(
  cliente: Cliente,
  sessao: { usuarioId: string; anonimo: boolean },
  origem: string,
): RepositorioTrabalhos {
  let pendente: Trabalho | null = null;
  let relogio: ReturnType<typeof setTimeout> | null = null;

  const gravarRascunho = async (t: Trabalho) => {
    const { error } = await cliente
      .from("feel_trabalhos")
      .upsert({ id: t.id, texto: t.texto, entendimento: t.entendimento, economia: t.economia });
    return !error;
  };

  /** Grava já o rascunho que estava esperando (antes do carimbo, por exemplo). */
  const descarregar = async () => {
    if (relogio) clearTimeout(relogio);
    relogio = null;
    const t = pendente;
    pendente = null;
    return t ? gravarRascunho(t) : true;
  };

  const atualizar = async (id: string, campos: Record<string, unknown>) => {
    const { data, error } = await cliente
      .from("feel_trabalhos")
      .update(campos)
      .eq("id", id)
      .select("id");
    return !error && Array.isArray(data) && data.length === 1;
  };

  const espelhar = async (
    r: { ok: true; trabalho: Trabalho } | { ok: false; erro: ErroCiclo },
    campos: (t: Trabalho) => Record<string, unknown>,
  ): Promise<ResultadoRepo> => {
    if (!r.ok) return r;
    return (await atualizar(r.trabalho.id, campos(r.trabalho)))
      ? r
      : { ok: false, erro: "servidor" };
  };

  return {
    modo: "remoto",

    async carregar() {
      const { data, error } = await cliente
        .from("feel_trabalhos")
        .select(SELECAO_TRABALHO)
        .eq("contratante_id", sessao.usuarioId)
        .order("criado_em", { ascending: false })
        .limit(50);
      if (error) throw error;
      return memoriaDeLinhas((data ?? []) as unknown as LinhaTrabalho[]);
    },

    guardar(m) {
      const t = m.atual;
      if (!t || t.estagio !== "rascunho" || (!t.texto && !t.entendimento)) return;
      pendente = t;
      if (relogio) clearTimeout(relogio);
      relogio = setTimeout(() => void descarregar(), ESPERA_RASCUNHO_MS);
    },

    novo: (agora) => novoTrabalho(crypto.randomUUID(), agora),

    async carimbar(t, dados, agora) {
      const r = carimbarAcordo(t, dados, agora);
      if (!r.ok) return r;
      pendente = t;
      if (!(await descarregar())) return { ok: false, erro: "servidor" };
      const { data, error } = await cliente.rpc("feel_carimbar_acordo", {
        p_trabalho: t.id,
        p_perfil: dados.perfilId,
        p_entregaveis: dados.entregaveis,
        p_direitos: dados.direitos,
        p_prazo: dados.prazo,
        p_esperamos: dados.esperamos,
        p_erramos_se: dados.erramosSe,
      });
      if (error || typeof data !== "string") return { ok: false, erro: "servidor" };
      // A data que vale é a do servidor.
      const acordo = Object.freeze({ ...r.trabalho.acordo!, carimbadoEm: data });
      return { ok: true, trabalho: { ...r.trabalho, acordo } };
    },

    async avancar(t) {
      // De proposta para aceita, só quem cria move (aceitando o convite).
      if (t.estagio === "proposta") return { ok: false, erro: "transicao_invalida" };
      return espelhar(avancar(t), (n) => ({ estagio: n.estagio }));
    },

    medir: (t, f) => espelhar(registrarFunil(t, f), (n) => ({ funil: n.funil })),

    veredito: (t, v) => espelhar(registrarVeredito(t, v), (n) => ({ veredito: n.veredito })),

    async assinar(t, lado, agora) {
      const r = assinar(t, lado, agora);
      if (!r.ok) return r;
      if (sessao.anonimo) return { ok: false, erro: "pede_email" };
      const { data, error } = await cliente.rpc("feel_assinar", { p_trabalho: t.id, p_lado: lado });
      if (error) {
        return { ok: false, erro: /e-mail/i.test(error.message) ? "pede_email" : "servidor" };
      }
      // Encerrado só quando o servidor confirma as duas assinaturas.
      const estagio: Estagio = data === "encerrado" ? "encerrado" : t.estagio;
      return { ok: true, trabalho: { ...r.trabalho, estagio } };
    },

    async convidar(t) {
      if (!t.acordo) return null;
      const { data, error } = await cliente.rpc("feel_convidar", { p_trabalho: t.id });
      if (error || typeof data !== "string") return null;
      return `${origem}/trabalhos/convite/${data}`;
    },

    async descartar(t) {
      if (relogio) clearTimeout(relogio);
      relogio = null;
      pendente = null;
      // O banco só deixa apagar rascunho; depois do acordo, o trabalho fica registrado.
      if (t.estagio === "rascunho") await cliente.from("feel_trabalhos").delete().eq("id", t.id);
    },
  };
}
