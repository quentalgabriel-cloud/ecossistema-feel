import type { EstadoVerdade } from "@/data/universo/tipos";

// O estado de verdade vira desenho pelas regras da LINGUAGEM.md:
// § 4 preenchimento = verificação (contorno → bone → ink), § 3 peso = densidade
// de evidência (1.5 / 2.6 / 3.5px). Glass só no estado de descoberta (DESIGN.md
// § Glass) — aqui, a sugestão. Nada disso usa matiz (D-09).

export type Preenchimento = "nenhum" | "emProcesso" | "verificado";

export interface AparenciaEstado {
  preenchimento: Preenchimento;
  tracejado: boolean;
  vidro: boolean;
  /** Peso do contorno, em px de tela. */
  peso: number;
}

export const PESOS = { registro: 1.5, acumulo: 2.6, recorrencia: 3.5 } as const;

/** Peso pelo número de provas assinadas: 0–1 registro, 2–4 acúmulo, 5+ recorrência. */
export function pesoPorProvas(provas: number): number {
  if (provas >= 5) return PESOS.recorrencia;
  if (provas >= 2) return PESOS.acumulo;
  return PESOS.registro;
}

export function aparencia(estado: EstadoVerdade | null, provas = 0): AparenciaEstado {
  switch (estado) {
    case "sugerido":
      return { preenchimento: "nenhum", tracejado: true, vidro: true, peso: PESOS.registro };
    case "declarado":
      return { preenchimento: "nenhum", tracejado: false, vidro: false, peso: PESOS.registro };
    case "em_processo":
      return {
        preenchimento: "emProcesso",
        tracejado: false,
        vidro: false,
        peso: pesoPorProvas(provas),
      };
    case "confirmado":
    case "assinado":
      return {
        preenchimento: "verificado",
        tracejado: false,
        vidro: false,
        peso: pesoPorProvas(provas),
      };
    default:
      // Sem relação com a pessoa (ex.: perspectiva Comunidades): só contorno fino.
      return { preenchimento: "nenhum", tracejado: false, vidro: false, peso: PESOS.registro };
  }
}

/**
 * Uma ação da pessoa nunca promove além do que ela pode afirmar sozinha:
 * identificar-se = declarado; pedir para participar = em processo.
 * Confirmado e assinado dependem do outro lado (comunidade, contratante).
 */
export function aposAcao(
  atual: EstadoVerdade | null,
  acao: "identificar" | "participar" | "descartar",
): EstadoVerdade | null {
  if (acao === "descartar") return atual === "sugerido" ? null : atual;
  if (atual === "confirmado" || atual === "assinado") return atual;
  if (acao === "participar") return "em_processo";
  return atual === "em_processo" ? atual : "declarado";
}
