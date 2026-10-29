import type {
  Composicao,
  Economia,
  Entendimento,
  Excluido,
  Incluido,
  LeituraPares,
  MotivoDentro,
  PerfilDemo,
} from "@/data/trabalhos/tipos";

// Composição (Handoff Mestre § 15.4): quem faz sentido, por quê, e quem ficou de
// fora com motivo. Não existe nota: a ordem é declarada (mais provas assinadas
// primeiro, depois afinidade) e cada pessoa aparece com os motivos, não com um
// número. Engajamento só se compara com os pares do mesmo porte.

export type Porte = "pequeno" | "medio" | "grande";

/** Uma tabela de porte só, interna. Nunca vira rótulo de identidade. */
export const PORTES: { porte: Porte; ate: number }[] = [
  { porte: "pequeno", ate: 10_000 },
  { porte: "medio", ate: 100_000 },
  { porte: "grande", ate: Infinity },
];

export function porteDe(seguidores: number | null): Porte | null {
  if (seguidores == null) return null;
  return PORTES.find((p) => seguidores < p.ate)!.porte;
}

/** Acima disso, o engajamento é implausível para o porte: precisa verificar. */
export function engajamentoImplausivel(p: PerfilDemo): boolean {
  if (p.engajamento == null || p.seguidores == null) return false;
  return p.engajamento > (p.seguidores > 1000 ? 0.25 : 0.4);
}

const mediana = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Mediana de engajamento por porte, calculada do próprio conjunto (sem constante
 * inventada). Perfis implausíveis não entram na mediana.
 */
export function medianasPorPorte(perfis: PerfilDemo[]): Map<Porte, number> {
  const grupos = new Map<Porte, number[]>();
  for (const p of perfis) {
    const porte = porteDe(p.seguidores);
    if (!porte || p.engajamento == null || engajamentoImplausivel(p)) continue;
    grupos.set(porte, [...(grupos.get(porte) ?? []), p.engajamento]);
  }
  return new Map([...grupos].map(([porte, xs]) => [porte, mediana(xs)]));
}

export function leituraPares(p: PerfilDemo, medianas: Map<Porte, number>): LeituraPares | null {
  const porte = porteDe(p.seguidores);
  const m = porte ? medianas.get(porte) : undefined;
  if (p.engajamento == null || m == null || engajamentoImplausivel(p)) return null;
  if (p.engajamento >= m * 1.3) return "acima";
  if (p.engajamento >= m * 0.7) return "na_media";
  return "abaixo";
}

export function compor(perfis: PerfilDemo[], e: Entendimento, eco: Economia): Composicao {
  const medianas = medianasPorPorte(perfis);
  const incluidos: (Incluido & { ordem: [number, number, number, string] })[] = [];
  const excluidos: Excluido[] = [];

  for (const p of perfis) {
    const nichos = p.nichos.filter((n) => e.nichos.includes(n));
    const semDado = p.seguidores == null && p.provasAssinadas === 0;

    // Fora, sempre com um motivo — o primeiro que se aplica, nesta ordem.
    if (nichos.length === 0) excluidos.push({ perfilId: p.id, motivo: { tipo: "sem_relacao" } });
    else if (e.praca && p.cidade !== e.praca)
      excluidos.push({ perfilId: p.id, motivo: { tipo: "fora_da_praca", cidade: p.cidade } });
    else if (!p.disponivel) excluidos.push({ perfilId: p.id, motivo: { tipo: "sem_agenda" } });
    else if (eco.orcamento != null && p.faixaMin != null && p.faixaMin > eco.orcamento)
      excluidos.push({
        perfilId: p.id,
        motivo: { tipo: "acima_do_orcamento", faixaMin: p.faixaMin },
      });
    else if (semDado) excluidos.push({ perfilId: p.id, motivo: { tipo: "sem_dado" } });
    else {
      const leitura = leituraPares(p, medianas);
      const motivos: MotivoDentro[] = [{ tipo: "nicho", entidades: nichos }];
      if (e.praca) motivos.push({ tipo: "praca", cidade: p.cidade, bairro: p.bairro });
      if (p.provasAssinadas > 0) motivos.push({ tipo: "provas", n: p.provasAssinadas });
      if (leitura === "acima") motivos.push({ tipo: "pares", leitura });
      if (eco.orcamento != null && p.faixaMin != null) motivos.push({ tipo: "faixa" });
      motivos.push({ tipo: "disponivel" });
      const rank = leitura === "acima" ? 2 : leitura === "na_media" ? 1 : 0;
      incluidos.push({
        perfilId: p.id,
        motivos,
        parcial: p.engajamento == null || p.constanciaSemana == null,
        verificar: engajamentoImplausivel(p),
        ordem: [p.provasAssinadas, nichos.length, rank, p.id],
      });
    }
  }

  incluidos.sort(
    (a, b) =>
      b.ordem[0] - a.ordem[0] ||
      b.ordem[1] - a.ordem[1] ||
      b.ordem[2] - a.ordem[2] ||
      a.ordem[3].localeCompare(b.ordem[3]),
  );
  return { incluidos: incluidos.map(({ ordem: _ordem, ...i }) => i), excluidos };
}
