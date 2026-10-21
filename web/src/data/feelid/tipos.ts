// A coleção FeelID: uma carta por entidade. Hoje só "perfil" é renderizada
// na demo; "habilidade" e "lugar" já têm dados e variante visual preparados
// para entrar sem mexer no chassi da carta.

export type TipoCarta = "perfil" | "habilidade" | "lugar";

export type Acabamento = "fosco" | "reluzente" | "holografico";

/** Foco (0–1, coordenadas da imagem) e zoom (≥ 1 sobre o "cover"). */
export interface Enquadramento {
  x: number;
  y: number;
  zoom: number;
}

export interface ImagemCarta {
  /** Object URL (sessão) ou URL remota, quando houver persistência. */
  src: string;
  largura: number;
  altura: number;
  /** Texto alternativo. */
  descricao: string;
  enquadramento: Enquadramento;
  /** "sessao" = vive só na memória desta aba (URL.createObjectURL). */
  origem: "sessao" | "remota";
}

export interface IdentificacaoCarta {
  colecao: string;
  edicao: string;
  numero: string;
}

interface CartaBase<T extends TipoCarta> {
  id: string;
  tipo: T;
  /** Nome da pessoa, da habilidade ou do lugar. */
  titulo: string;
  /** Frase curta de apresentação — a voz sugere, não explica. */
  frase: string;
  imagem: ImagemCarta | null;
  identificacao: IdentificacaoCarta;
}

/** Perfil (FEEL ID, Handoff Mestre § 11): eu digo · eu mostro · a rede sabe. */
export interface CartaPerfil extends CartaBase<"perfil"> {
  verso: {
    momento: string;
    repertorio: string[];
    praca: string;
    disponibilidade: string;
    /** A camada "a rede sabe porque aconteceu". Nunca número inventado. */
    lastro: string;
  };
}

export interface CartaHabilidade extends CartaBase<"habilidade"> {
  verso: {
    descricao: string;
    contextos: string[];
    lastro: string;
  };
}

export interface CartaLugar extends CartaBase<"lugar"> {
  verso: {
    endereco: string;
    praca: string;
    usos: string[];
    lastro: string;
  };
}

export type Carta = CartaPerfil | CartaHabilidade | CartaLugar;

/** Uma linha do verso, já pronta para o chassi renderizar. */
export interface CampoVerso {
  rotulo: string;
  valor: string | string[];
}
