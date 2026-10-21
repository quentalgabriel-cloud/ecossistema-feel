// A lei geradora (DESIGN.md § The Grammar): p(t) = [t − b·sin(t), b·cos(t)],
// b = 1.6. Todo traço da carta sai daqui — nenhum SVG desenhado à mão.

export const B_CICLOIDE = 1.6;

type Ponto = readonly [number, number];

export function cicloide(t: number, b = B_CICLOIDE): Ponto {
  return [t - b * Math.sin(t), b * Math.cos(t)];
}

interface OpcoesTraco {
  /** Parâmetro inicial e final da curva (radianos). */
  t0: number;
  t1: number;
  /** Escala uniforme aplicada à curva-mãe. */
  escala: number;
  /** Translação depois da escala. */
  origem: Ponto;
  /** Inclinação vertical por unidade de x — o fio entra e sai em alturas diferentes. */
  inclinacao?: number;
  passos?: number;
  b?: number;
}

/** Converte um trecho da cicloide em `d` de path SVG. */
export function tracoCicloide({
  t0,
  t1,
  escala,
  origem,
  inclinacao = 0,
  passos = 160,
  b = B_CICLOIDE,
}: OpcoesTraco): string {
  const partes: string[] = [];
  for (let i = 0; i <= passos; i++) {
    const t = t0 + ((t1 - t0) * i) / passos;
    const [cx, cy] = cicloide(t, b);
    const x = origem[0] + cx * escala;
    const y = origem[1] + cy * escala + inclinacao * cx * escala;
    partes.push(`${i === 0 ? "M" : "L"}${x.toFixed(3)} ${y.toFixed(3)}`);
  }
  return partes.join("");
}

/**
 * Malha de cicloides para a folha holográfica: fileiras deslocadas meio
 * período, como um guilhoché de documento. Devolvida como data URI para uso
 * em `mask-image` — a cor do traço é irrelevante numa máscara (só o alfa conta).
 */
export function malhaCicloideDataUri(): string {
  const periodo = 2 * Math.PI;
  const escala = 2;
  const largura = periodo * escala;
  const altura = 7.2;
  const fileiras = [0, 1].map((i) =>
    tracoCicloide({
      t0: -periodo,
      t1: periodo * 2,
      escala,
      origem: [i * (largura / 2) - largura, 1.8 + i * (altura / 2)],
      passos: 240,
    }),
  );
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${largura.toFixed(3)} ${altura}'>` +
    fileiras
      .map(
        (d) =>
          `<path d='${d}' fill='none' stroke='black' stroke-width='0.32' stroke-linecap='round'/>`,
      )
      .join("") +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
