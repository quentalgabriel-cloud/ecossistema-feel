import type { Relacao } from "@/data/universo/tipos";

import type { ProvaRegistrada } from "./memoria";

// O evidence loop (Handoff Mestre § 15.5): um trabalho concluído e co-assinado
// muda a identidade. Cada prova vira "assinado" na entidade onde pesa, e o traço
// engrossa com a contagem (LINGUAGEM § 3).

export function aplicarProvas(
  relacoes: Map<string, Relacao>,
  provas: ProvaRegistrada[],
): Map<string, Relacao> {
  if (provas.length === 0) return relacoes;
  const saida = new Map(relacoes);
  for (const p of provas) {
    const atual = saida.get(p.entidadeId);
    saida.set(p.entidadeId, {
      entidadeId: p.entidadeId,
      tipo: "contribui",
      estado: "assinado",
      provas: (atual?.provas ?? 0) + 1,
    });
  }
  return saida;
}
