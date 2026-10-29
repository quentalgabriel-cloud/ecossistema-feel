import type { TipoEntidade } from "@/data/universo/tipos";
import { cicloide, tracoCicloide } from "@/lib/feelid/cicloide";

// Glifos de entidade da LINGUAGEM.md § 2, gerados da cicloide (b = 1.6) e
// normalizados para caber num quadrado [-1, 1]. Só entram os tipos que a
// LINGUAGEM já define; comunidade, interesse, encontro e habilidade ainda não têm
// glifo próprio (pendência registrada) — a bolha e o rótulo de tipo os distinguem.

export interface Glifo {
  /** Um ou mais traços (path `d`) já normalizados. */
  tracos: string[];
  tracejado: boolean;
}

const ARCO = { t0: -1.35, t1: 1.35 }; // profissional: arco aberto, terminais livres
const LACO = { t0: -2.3, t1: 2.3 }; // espaço: o laço completo

function normalizado(t0: number, t1: number, deslocY = 0, escalaExtra = 1): string {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i <= 64; i++) {
    const [x, y] = cicloide(t0 + ((t1 - t0) * i) / 64);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const lado = Math.max(maxX - minX, maxY - minY);
  const escala = (2 / lado) * escalaExtra;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return tracoCicloide({
    t0,
    t1,
    escala,
    origem: [-cx * escala, -cy * escala + deslocY],
    passos: 64,
  });
}

export function glifoDe(tipo: TipoEntidade): Glifo | null {
  switch (tipo) {
    case "pessoa":
      return { tracos: [normalizado(ARCO.t0, ARCO.t1)], tracejado: false };
    case "lugar":
      return { tracos: [normalizado(LACO.t0, LACO.t1)], tracejado: false };
    case "organizacao":
      // Negócio: dois arcos paralelos — a relação ainda não cruzada.
      return {
        tracos: [
          normalizado(ARCO.t0, ARCO.t1, -0.38, 0.8),
          normalizado(ARCO.t0, ARCO.t1, 0.38, 0.8),
        ],
        tracejado: false,
      };
    case "oportunidade":
      // Arco tracejado, aberto: ainda não aconteceu.
      return { tracos: [normalizado(ARCO.t0, ARCO.t1)], tracejado: true };
    default:
      return null;
  }
}

/** Ângulo de cruzamento da Gramática do Fio — quando duas trajetórias se cruzam nele, houve prova. */
export const ANGULO_PROVA = 32;

/**
 * Prova (LINGUAGEM.md § 2): dois arcos cruzando a 32°. O cruzamento É a
 * co-assinatura. Devolve o arco e a rotação de cada traço (±16°).
 */
export function glifoProva(): { traco: string; rotacoes: [number, number] } {
  return {
    traco: normalizado(ARCO.t0, ARCO.t1, 0, 0.92),
    rotacoes: [ANGULO_PROVA / 2, -ANGULO_PROVA / 2],
  };
}
