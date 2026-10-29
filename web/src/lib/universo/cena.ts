import type {
  DadosUniverso,
  Entidade,
  EstadoVerdade,
  Grupo,
  Perspectiva,
  Relacao,
  Sugestao,
} from "@/data/universo/tipos";

import { caixaDeCirculos, type Caixa } from "./camera";
import { raioBolha } from "./escala";
import {
  geometriaGrupos,
  layoutAnel,
  layoutComunidades,
  layoutMeuUniverso,
  MEDIDAS,
  type MapaVagas,
} from "./layout";

// Monta o que cada perspectiva desenha (handoff § 4.1). Separar perspectiva de
// tipo de entidade: a mesma comunidade é "algo que declarei" no Meu Universo,
// "um tamanho medido" em Comunidades e "uma sugestão explicada" em Descobrir.

export type TipoBolha = "nucleo" | "grupo" | "entidade";

export interface BolhaCena {
  id: string;
  tipo: TipoBolha;
  nome: string;
  x: number;
  y: number;
  r: number;
  grupoId?: string;
  entidade?: Entidade;
  grupo?: Grupo;
  estado: EstadoVerdade | null;
  provas: number;
  /** Comunidades: contagem confirmada (ou null = sem contagem). */
  membros?: number | null;
  sugestao?: Sugestao;
  /** Agrupamento: quantas entidades estão dentro. */
  quantidade?: number;
}

export interface Cena {
  perspectiva: Perspectiva;
  bolhas: BolhaCena[];
  caixa: Caixa;
  vagas: MapaVagas;
}

export interface EntradaCena {
  dados: DadosUniverso;
  perspectiva: Perspectiva;
  relacoes: Map<string, Relacao>;
  regras: Sugestao[];
  descartadas: Set<string>;
  /** Contagens em vigor (permite simular a variação de 30 dias). */
  contagens: Map<string, number | null>;
  /** Contagens alternativas a reservar no layout (para crescer sem colidir). */
  reservas?: Map<string, number | null>;
  nomeNucleo: string;
  vagasAnteriores: MapaVagas | null;
}

/** Relações que a pessoa afirma ou que foram confirmadas — nunca sugestões. */
export const pertenceAoUniverso = (r: Relacao | undefined) => !!r && r.estado !== "sugerido";

/** Sugestões explicáveis: só aparecem se alguma evidência estiver no universo da pessoa. */
export function sugestoesAtivas(
  regras: Sugestao[],
  relacoes: Map<string, Relacao>,
  descartadas: Set<string>,
): Sugestao[] {
  return regras
    .filter(
      (s) => !descartadas.has(s.entidadeId) && !pertenceAoUniverso(relacoes.get(s.entidadeId)),
    )
    .map((s) => ({
      ...s,
      evidencias: s.evidencias.filter((e) => pertenceAoUniverso(relacoes.get(e))),
    }))
    .filter((s) => s.evidencias.length > 0);
}

export function montarCena(e: EntradaCena): Cena {
  const porId = new Map(e.dados.entidades.map((x) => [x.id, x]));
  const nucleo: BolhaCena = {
    id: "nucleo",
    tipo: "nucleo",
    nome: e.nomeNucleo,
    x: 0,
    y: 0,
    r: MEDIDAS.raioNucleo,
    estado: null,
    provas: 0,
  };

  if (e.perspectiva === "comunidades") {
    const itens = e.dados.comunidades.map((c) => ({
      id: c.entidadeId,
      r: raioBolha(e.contagens.get(c.entidadeId) ?? null),
      rReserva: raioBolha(e.reservas?.get(c.entidadeId) ?? null),
    }));
    const nos = layoutComunidades(itens);
    const bolhas: BolhaCena[] = e.dados.comunidades.map((c) => {
      const n = nos.get(c.entidadeId)!;
      const ent = porId.get(c.entidadeId)!;
      const rel = e.relacoes.get(c.entidadeId);
      return {
        id: ent.id,
        tipo: "entidade",
        nome: ent.nome,
        x: n.x,
        y: n.y,
        r: n.r,
        grupoId: ent.grupoId,
        entidade: ent,
        estado: pertenceAoUniverso(rel) ? rel!.estado : null,
        provas: rel?.provas ?? 0,
        membros: e.contagens.get(c.entidadeId) ?? null,
      };
    });
    return {
      perspectiva: e.perspectiva,
      bolhas,
      caixa: caixaDeCirculos(bolhas),
      vagas: e.vagasAnteriores ?? new Map(),
    };
  }

  if (e.perspectiva === "descobrir") {
    const sugestoes = sugestoesAtivas(e.regras, e.relacoes, e.descartadas);
    const nos = layoutAnel(
      sugestoes.map((s) => s.entidadeId),
      34,
    );
    const bolhas: BolhaCena[] = [
      nucleo,
      ...sugestoes.map((s) => {
        const n = nos.get(s.entidadeId)!;
        const ent = porId.get(s.entidadeId)!;
        return {
          id: ent.id,
          tipo: "entidade" as const,
          nome: ent.nome,
          x: n.x,
          y: n.y,
          r: n.r,
          grupoId: ent.grupoId,
          entidade: ent,
          estado: "sugerido" as const,
          provas: 0,
          sugestao: s,
        };
      }),
    ];
    return {
      perspectiva: e.perspectiva,
      bolhas,
      caixa: caixaDeCirculos(bolhas),
      vagas: e.vagasAnteriores ?? new Map(),
    };
  }

  // Meu Universo: núcleo + agrupamentos com o que a pessoa declarou ou tem confirmado.
  const minhas = e.dados.entidades.filter((x) => pertenceAoUniverso(e.relacoes.get(x.id)));
  const gruposVisiveis = e.dados.grupos.filter((g) => minhas.some((x) => x.grupoId === g.id));
  const capacidade: Record<string, number> = {};
  for (const x of e.dados.entidades) capacidade[x.grupoId] = (capacidade[x.grupoId] ?? 0) + 1;
  const geo = geometriaGrupos(gruposVisiveis, capacidade);
  const { nos, vagas } = layoutMeuUniverso(geo, minhas, e.vagasAnteriores);

  const bolhas: BolhaCena[] = [nucleo];
  for (const g of gruposVisiveis) {
    const gg = geo.get(g.id)!;
    bolhas.push({
      id: `grupo:${g.id}`,
      tipo: "grupo",
      nome: g.nome,
      x: gg.x,
      y: gg.y,
      r: gg.r,
      grupoId: g.id,
      grupo: g,
      estado: null,
      provas: 0,
      quantidade: minhas.filter((x) => x.grupoId === g.id).length,
    });
  }
  for (const x of minhas) {
    const n = nos.get(x.id);
    if (!n) continue;
    const rel = e.relacoes.get(x.id)!;
    bolhas.push({
      id: x.id,
      tipo: "entidade",
      nome: x.nome,
      x: n.x,
      y: n.y,
      r: n.r,
      grupoId: x.grupoId,
      entidade: x,
      estado: rel.estado,
      provas: rel.provas,
      membros: e.contagens.get(x.id),
    });
  }
  return { perspectiva: e.perspectiva, bolhas, caixa: caixaDeCirculos(bolhas), vagas };
}

export function relacoesDeEscolhas(ids: string[]): Map<string, Relacao> {
  return new Map(
    ids.map((id) => [
      id,
      { entidadeId: id, tipo: "identifica_se", estado: "declarado", provas: 0 } satisfies Relacao,
    ]),
  );
}
