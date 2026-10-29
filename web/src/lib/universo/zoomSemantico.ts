// Zoom semântico com histerese (handoff § 7.2). A informação muda por faixa de
// escala, mas cada limiar tem uma folga de entrada e saída: parado perto de um
// limiar, o rótulo não pisca entre dois estados.

export type NivelSemantico = "macro" | "contexto" | "detalhe";

interface Limiar {
  /** Sobe para o nível de cima quando k >= entrar. */
  entrar: number;
  /** Volta para o nível de baixo quando k <= sair. */
  sair: number;
}

export const LIMIARES: { contexto: Limiar; detalhe: Limiar } = {
  // Abaixo disso os nomes das entidades não cabem entre as vagas do agrupamento
  // (testado em 390px e 1440px): o macro mostra só agrupamentos e contagens.
  contexto: { entrar: 0.8, sair: 0.7 },
  detalhe: { entrar: 1.65, sair: 1.45 },
};

export function proximoNivel(atual: NivelSemantico, k: number, l = LIMIARES): NivelSemantico {
  switch (atual) {
    case "macro":
      if (k >= l.detalhe.entrar) return "detalhe";
      if (k >= l.contexto.entrar) return "contexto";
      return "macro";
    case "contexto":
      if (k >= l.detalhe.entrar) return "detalhe";
      if (k <= l.contexto.sair) return "macro";
      return "contexto";
    case "detalhe":
      if (k <= l.contexto.sair) return "macro";
      if (k <= l.detalhe.sair) return "contexto";
      return "detalhe";
  }
}

/** Nível para uma escala sem histórico (primeira renderização). */
export function nivelInicial(k: number, l = LIMIARES): NivelSemantico {
  if (k >= l.detalhe.entrar) return "detalhe";
  if (k >= l.contexto.entrar) return "contexto";
  return "macro";
}

const ORDEM: NivelSemantico[] = ["macro", "contexto", "detalhe"];

/** Foco explícito também decide a camada: o maior dos dois vence. */
export function nivelEfetivo(
  porZoom: NivelSemantico,
  porFoco: NivelSemantico | null,
): NivelSemantico {
  if (!porFoco) return porZoom;
  return ORDEM[Math.max(ORDEM.indexOf(porZoom), ORDEM.indexOf(porFoco))];
}

export const nivelAoMenos = (n: NivelSemantico, minimo: NivelSemantico) =>
  ORDEM.indexOf(n) >= ORDEM.indexOf(minimo);
