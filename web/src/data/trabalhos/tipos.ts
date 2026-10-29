// O ciclo do negócio (Handoff Mestre § 5): necessidade → composição → acordo →
// trabalho → resultado → prova. Valores em reais (número), datas em ISO.

export type Objetivo = "visitas" | "lancamento" | "reconhecimento" | "evento";

/** "Entendemos assim…": o que o texto livre disse, e de onde tiramos cada campo. */
export interface Entendimento {
  objetivo: Objetivo | null;
  /** Cidade da praça (RMR). */
  praca: string | null;
  /** Entidades do catálogo (ids de data/universo). */
  nichos: string[];
  prazo: string | null;
  /** Trecho do texto que sustentou cada campo — a pessoa vê por que entendemos assim. */
  trechos: Partial<Record<"objetivo" | "praca" | "prazo", string>> & { nichos?: string[] };
}

/** Portão econômico: sem ticket e conversão não existe custo por desfecho. */
export interface Economia {
  ticketMedio: number | null;
  /** De cada 10 contatos, quantos viram cliente (1–10). */
  conversaoDe10: number | null;
  orcamento: number | null;
}

/** Perfil de demonstração. Ninguém real: primeiro nome + "(demo)", sem foto, sem @. */
export interface PerfilDemo {
  id: string;
  nome: string;
  oficio: string;
  nichos: string[];
  cidade: string;
  bairro: string;
  seguidores: number | null;
  /** Engajamento público médio das últimas publicações (0–1). */
  engajamento: number | null;
  /** Publicações por semana nos últimos 90 dias. */
  constanciaSemana: number | null;
  provasAssinadas: number;
  disponivel: boolean;
  faixaMin: number | null;
  faixaMax: number | null;
  /** consentida = conta conectada pela pessoa; publica = inferência rotulada. */
  fonte: "consentida" | "publica";
}

export type MotivoDentro =
  | { tipo: "nicho"; entidades: string[] }
  | { tipo: "praca"; cidade: string; bairro: string }
  | { tipo: "provas"; n: number }
  | { tipo: "pares"; leitura: LeituraPares }
  | { tipo: "faixa" }
  | { tipo: "disponivel" };

export type MotivoFora =
  | { tipo: "sem_agenda" }
  | { tipo: "fora_da_praca"; cidade: string }
  | { tipo: "acima_do_orcamento"; faixaMin: number }
  | { tipo: "sem_relacao" }
  | { tipo: "sem_dado" };

export type LeituraPares = "acima" | "na_media" | "abaixo";

export interface Incluido {
  perfilId: string;
  motivos: MotivoDentro[];
  /** Algum eixo sem dado: aparece como "parcial", nunca com número inventado. */
  parcial: boolean;
  /** Engajamento acima do plausível para o porte: precisa verificar antes de contratar. */
  verificar: boolean;
}

export interface Excluido {
  perfilId: string;
  motivo: MotivoFora;
}

export interface Composicao {
  incluidos: Incluido[];
  excluidos: Excluido[];
}

export type DireitosUso = "organico" | "repost" | "impulsionamento";

/** Acordo carimbado: depois do carimbo, nada aqui muda. */
export interface Acordo {
  readonly perfilId: string;
  readonly entregaveis: readonly string[];
  readonly direitos: DireitosUso;
  readonly prazo: string;
  readonly esperamos: string;
  readonly erramosSe: string;
  readonly carimbadoEm: string;
}

export type Estagio =
  | "rascunho"
  | "proposta"
  | "aceita"
  | "em_andamento"
  | "entregue"
  | "encerrado";

/** Medido, não estimado: o que não foi medido fica null (em branco na tela). */
export interface Funil {
  contatos: number | null;
  agendados: number | null;
  clientes: number | null;
  /** Gasto efetivo — não o orçamento declarado. */
  gasto: number | null;
}

export interface Trabalho {
  id: string;
  criadoEm: string;
  texto: string;
  entendimento: Entendimento | null;
  economia: Economia;
  acordo: Acordo | null;
  estagio: Estagio;
  funil: Funil;
  veredito: string | null;
  assinaturas: { contratante: string | null; profissional: string | null };
}
