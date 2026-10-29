// Tamanho da bolha (handoff § 6.2). A área de um círculo cresce com r², então o
// raio cresce com a raiz da contagem. É uma escala de apresentação com limites,
// não proporcionalidade exata: acima do teto, a interface mostra o número real.

export const ESCALA = {
  minMembros: 1,
  maxMembros: 10000,
  minRaio: 28,
  maxRaio: 108,
  /** Sem contagem: tamanho neutro + indicador de ausência. */
  raioNeutro: 44,
} as const;

export function raioBolha(membros: number | null, e = ESCALA): number {
  if (membros == null || !Number.isFinite(membros)) return e.raioNeutro;
  const seguro = Math.max(e.minMembros, Math.min(membros, e.maxMembros));
  const normalizado =
    (Math.sqrt(seguro) - Math.sqrt(e.minMembros)) /
    (Math.sqrt(e.maxMembros) - Math.sqrt(e.minMembros));
  return e.minRaio + normalizado * (e.maxRaio - e.minRaio);
}

/** A contagem passou do teto da escala? A interface avisa e mostra o valor. */
export function acimaDoTeto(membros: number | null, e = ESCALA): boolean {
  return membros != null && membros > e.maxMembros;
}

/** Variação percentual, só quando os dois lados existem. */
export function variacaoPercentual(antes: number | null, depois: number | null): number | null {
  if (antes == null || depois == null || antes <= 0) return null;
  return Math.round(((depois - antes) / antes) * 100);
}
