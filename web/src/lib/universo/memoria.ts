import type { EstadoVerdade } from "@/data/universo/tipos";

// O que o protótipo lembra entre visitas, só neste aparelho (localStorage).
// Não é persistência de produto: some ao limpar o navegador, e falhar ao ler ou
// gravar nunca quebra a tela.

export type PreferenciaTema = "sistema" | "claro" | "escuro";
export type PreferenciaMovimento = "sistema" | "reduzido" | "completo";

export interface Memoria {
  nome: string;
  codigo: string;
  /** Escolhas do onboarding; `null` = ainda não passou por ele. */
  escolhas: string[] | null;
  /** Entrou pela demonstração (persona com todos os estados). */
  demonstracao: boolean;
  /** Mudanças de estado feitas pela pessoa no protótipo. */
  ajustes: Record<string, EstadoVerdade | null>;
  descartadas: string[];
  tema: PreferenciaTema;
  movimento: PreferenciaMovimento;
}

const CHAVE = "feel:universo:v1";

export const memoriaVazia: Memoria = {
  nome: "",
  codigo: "",
  escolhas: null,
  demonstracao: false,
  ajustes: {},
  descartadas: [],
  tema: "sistema",
  movimento: "sistema",
};

export function lerMemoria(): Memoria {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return memoriaVazia;
    const m = JSON.parse(bruto) as Partial<Memoria>;
    return {
      ...memoriaVazia,
      ...m,
      escolhas: Array.isArray(m.escolhas) ? m.escolhas.filter((x) => typeof x === "string") : null,
      descartadas: Array.isArray(m.descartadas) ? m.descartadas : [],
      ajustes: m.ajustes && typeof m.ajustes === "object" ? m.ajustes : {},
    };
  } catch {
    return memoriaVazia;
  }
}

export function gravarMemoria(m: Memoria) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(m));
  } catch {
    // Aba privada ou armazenamento bloqueado: o protótipo segue sem lembrar.
  }
}

export function atualizarMemoria(parcial: Partial<Memoria>): Memoria {
  const m = { ...lerMemoria(), ...parcial };
  gravarMemoria(m);
  return m;
}
