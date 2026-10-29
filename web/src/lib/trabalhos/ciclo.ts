import type { Acordo, DireitosUso, Estagio, Funil, Trabalho } from "@/data/trabalhos/tipos";

// As regras do ciclo, puras. Cada função devolve um trabalho novo ou um erro com
// motivo — a interface só mostra o que estas regras permitem.

export type Resultado = { ok: true; trabalho: Trabalho } | { ok: false; erro: ErroCiclo };

export type ErroCiclo =
  | "acordo_ja_carimbado"
  | "acordo_incompleto"
  | "transicao_invalida"
  | "sem_veredito"
  | "ainda_nao_entregue"
  | "ja_assinado";

export const funilVazio: Funil = { contatos: null, agendados: null, clientes: null, gasto: null };

export function novoTrabalho(id: string, agora: string): Trabalho {
  return {
    id,
    criadoEm: agora,
    texto: "",
    entendimento: null,
    economia: { ticketMedio: null, conversaoDe10: null, orcamento: null },
    acordo: null,
    estagio: "rascunho",
    funil: funilVazio,
    veredito: null,
    assinaturas: { contratante: null, profissional: null },
  };
}

/**
 * Carimba o acordo. "Esperamos" e "Erramos se" são obrigatórios e, depois do
 * carimbo, imutáveis: o critério se escreve antes, não se ajusta depois.
 */
export function carimbarAcordo(
  t: Trabalho,
  dados: {
    perfilId: string;
    entregaveis: string[];
    direitos: DireitosUso;
    prazo: string;
    esperamos: string;
    erramosSe: string;
  },
  agora: string,
): Resultado {
  if (t.acordo) return { ok: false, erro: "acordo_ja_carimbado" };
  const esperamos = dados.esperamos.trim();
  const erramosSe = dados.erramosSe.trim();
  if (!dados.perfilId || !esperamos || !erramosSe || dados.entregaveis.length === 0)
    return { ok: false, erro: "acordo_incompleto" };
  const acordo: Acordo = Object.freeze({
    perfilId: dados.perfilId,
    entregaveis: Object.freeze([...dados.entregaveis]),
    direitos: dados.direitos,
    prazo: dados.prazo.trim(),
    esperamos,
    erramosSe,
    carimbadoEm: agora,
  });
  return { ok: true, trabalho: { ...t, acordo, estagio: "proposta" } };
}

const SEGUINTE: Partial<Record<Estagio, Estagio>> = {
  proposta: "aceita",
  aceita: "em_andamento",
  em_andamento: "entregue",
};

export const proximoEstagio = (e: Estagio): Estagio | null => SEGUINTE[e] ?? null;

export function avancar(t: Trabalho): Resultado {
  const proximo = proximoEstagio(t.estagio);
  if (!proximo || !t.acordo) return { ok: false, erro: "transicao_invalida" };
  return { ok: true, trabalho: { ...t, estagio: proximo } };
}

export function registrarFunil(t: Trabalho, funil: Funil): Resultado {
  if (t.estagio === "rascunho" || t.estagio === "encerrado")
    return { ok: false, erro: "transicao_invalida" };
  return { ok: true, trabalho: { ...t, funil } };
}

export function registrarVeredito(t: Trabalho, veredito: string): Resultado {
  if (t.estagio !== "entregue") return { ok: false, erro: "ainda_nao_entregue" };
  if (t.assinaturas.contratante || t.assinaturas.profissional)
    return { ok: false, erro: "ja_assinado" };
  const v = veredito.trim();
  if (!v) return { ok: false, erro: "sem_veredito" };
  return { ok: true, trabalho: { ...t, veredito: v } };
}

/** Assina um dos lados. Com os dois, o trabalho se encerra e vira prova. */
export function assinar(
  t: Trabalho,
  lado: "contratante" | "profissional",
  agora: string,
): Resultado {
  if (t.estagio !== "entregue") return { ok: false, erro: "ainda_nao_entregue" };
  if (!t.veredito) return { ok: false, erro: "sem_veredito" };
  if (t.assinaturas[lado]) return { ok: false, erro: "ja_assinado" };
  const assinaturas = { ...t.assinaturas, [lado]: agora };
  const completa = !!assinaturas.contratante && !!assinaturas.profissional;
  return { ok: true, trabalho: { ...t, assinaturas, estagio: completa ? "encerrado" : t.estagio } };
}

export const provaCompleta = (t: Trabalho) =>
  !!t.assinaturas.contratante && !!t.assinaturas.profissional;
