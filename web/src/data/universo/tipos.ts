// O modelo do Meu Universo (handoff 26/10 § 10). Entidade é o objeto canônico,
// relação é o vínculo tipado da pessoa com ela, sugestão é inferência explicável e
// layout é estado de apresentação — nunca verdade do domínio.

export type TipoEntidade =
  | "pessoa"
  | "organizacao"
  | "comunidade"
  | "interesse"
  | "habilidade"
  | "lugar"
  | "evento"
  | "projeto"
  | "oportunidade";

export type Visibilidade = "publica" | "membros" | "privada";

export interface Entidade {
  id: string;
  tipo: TipoEntidade;
  nome: string;
  descricao: string;
  /** Agrupamento de apresentação (Meu Universo). Não é hierarquia de domínio. */
  grupoId: string;
  visibilidade: Visibilidade;
  /** Outras entidades que compartilham contexto — interseção, não filiação. */
  relacionadas: string[];
}

export interface Comunidade {
  entidadeId: string;
  /** `null` = sem contagem confirmada. Nunca vira "0 membros" por inferência. */
  membrosConfirmados: number | null;
  /** Data da contagem (ISO). */
  contagemEm?: string;
  politica: "aberta" | "pedido" | "convite";
}

export interface Grupo {
  id: string;
  nome: string;
  descricao: string;
}

/**
 * Estado de verdade da relação — o mesmo vocabulário em todo o produto.
 * sugerido: a Feel acha que pode interessar (nunca pertencimento).
 * declarado: a pessoa disse "isso me representa".
 * em_processo: pediu para participar / está acontecendo.
 * confirmado: a comunidade (ou o sistema dela) confirmou.
 * assinado: contribuição registrada com dupla assinatura (prova).
 */
export type EstadoVerdade = "sugerido" | "declarado" | "em_processo" | "confirmado" | "assinado";

export type TipoRelacao =
  | "identifica_se"
  | "interesse"
  | "membro"
  | "contribui"
  | "organiza"
  | "acompanha";

export interface Relacao {
  entidadeId: string;
  tipo: TipoRelacao;
  estado: EstadoVerdade;
  /** Quantidade de provas assinadas — decide o peso do traço (LINGUAGEM § 3). */
  provas: number;
}

export type MotivoSugestao =
  | "interesse_em_comum"
  | "contexto_compartilhado"
  | "habilidade_complementar"
  | "objetivo_declarado";

export interface Sugestao {
  entidadeId: string;
  motivo: MotivoSugestao;
  /** Entidades do universo da pessoa que sustentam a sugestão. */
  evidencias: string[];
}

export type Perspectiva = "meu-universo" | "comunidades" | "descobrir";

/** Coordenada estável por entidade e versão de layout (handoff § 6.5). */
export interface NoLayout {
  id: string;
  x: number;
  y: number;
  r: number;
  versao: number;
}

export interface DadosUniverso {
  demo: true;
  grupos: Grupo[];
  entidades: Entidade[];
  comunidades: Comunidade[];
}
