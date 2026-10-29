import type { Trabalho } from "@/data/trabalhos/tipos";

import { provaCompleta } from "./ciclo";

// Trabalhos do protótipo, só neste aparelho (mesmo padrão de lib/universo/memoria).
// Falhar ao ler ou gravar nunca quebra a tela.

export interface MemoriaTrabalhos {
  atual: Trabalho | null;
  encerrados: Trabalho[];
}

/** Uma prova co-assinada, do jeito que o resto do produto precisa enxergar. */
export interface ProvaRegistrada {
  trabalhoId: string;
  /** Entidade do Meu Universo onde a prova pesa (o primeiro nicho da necessidade). */
  entidadeId: string;
  perfilId: string;
  em: string;
}

const CHAVE = "feel:trabalhos:v1";
export const memoriaTrabalhosVazia: MemoriaTrabalhos = { atual: null, encerrados: [] };

export function lerTrabalhos(): MemoriaTrabalhos {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return memoriaTrabalhosVazia;
    const m = JSON.parse(bruto) as Partial<MemoriaTrabalhos>;
    return {
      atual: m.atual && typeof m.atual === "object" ? m.atual : null,
      encerrados: Array.isArray(m.encerrados) ? m.encerrados : [],
    };
  } catch {
    return memoriaTrabalhosVazia;
  }
}

export function gravarTrabalhos(m: MemoriaTrabalhos) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(m));
  } catch {
    // Armazenamento bloqueado: o protótipo segue sem lembrar.
  }
}

export function provasDe(m: MemoriaTrabalhos): ProvaRegistrada[] {
  return [...m.encerrados, ...(m.atual ? [m.atual] : [])]
    .filter((t) => provaCompleta(t) && t.acordo && t.entendimento?.nichos.length)
    .map((t) => ({
      trabalhoId: t.id,
      entidadeId: t.entendimento!.nichos[0],
      perfilId: t.acordo!.perfilId,
      em:
        t.assinaturas.profissional! > t.assinaturas.contratante!
          ? t.assinaturas.profissional!
          : t.assinaturas.contratante!,
    }));
}
