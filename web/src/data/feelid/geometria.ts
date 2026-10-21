import type { TipoCarta } from "./tipos";

// Geometria da carta em milímetros. 63 × 88 mm é o formato de carta
// colecionável (o mesmo de Pokémon/Magic): a peça já nasce imprimível. Na tela
// 1 mm = 100cqw / 63, então a carta escala sem perder proporção.

export const CARTA_MM = { largura: 63, altura: 88, raio: 3.5, margem: 3.5 } as const;

/** Área segura de impressão: nada de texto a menos de 3 mm do corte. */
export const SANGRIA_MM = 3;

export interface Moldura {
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** Raios dos cantos [sup-esq, sup-dir, inf-dir, inf-esq]. Um é sempre maior: corte assimétrico. */
  raios: readonly [number, number, number, number];
}

export type GlifoEntidade = "profissional" | "espaco" | null;

export interface VarianteCarta {
  /** Área de imagem — fixa por tipo para a coleção manter identidade. */
  moldura: Moldura;
  /** Glifo de entidade (D-09: forma, nunca matiz). */
  glifo: GlifoEntidade;
}

// A variação entre tipos é de forma: proporção da moldura e qual canto se
// abre. Nunca de matiz (D-09).
export const VARIANTES: Record<TipoCarta, VarianteCarta> = {
  perfil: {
    // Imagem : texto = 8 : 5 (DESIGN.md § Components — corte interno 5:8).
    moldura: { x: 3.5, y: 8.5, largura: 56, altura: 46.5, raios: [2, 2, 12, 2] },
    glifo: "profissional",
  },
  habilidade: {
    moldura: { x: 3.5, y: 8.5, largura: 56, altura: 38, raios: [12, 2, 2, 2] },
    // Capacidade ainda não tem glifo em LINGUAGEM.md § 2 — decisão pendente.
    glifo: null,
  },
  lugar: {
    moldura: { x: 3.5, y: 8.5, largura: 56, altura: 40, raios: [2, 12, 2, 2] },
    glifo: "espaco",
  },
};

export function proporcaoMoldura(tipo: TipoCarta) {
  const { largura, altura } = VARIANTES[tipo].moldura;
  return largura / altura;
}
