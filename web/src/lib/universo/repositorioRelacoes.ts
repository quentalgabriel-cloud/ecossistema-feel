import type { SupabaseClient } from "@supabase/supabase-js";

import type { EstadoVerdade, Relacao } from "@/data/universo/tipos";

// Relações da pessoa com o catálogo, na conta dela. O que a pessoa afirma sozinha
// (declarado, em processo) ela grava; confirmado e assinado só chegam do banco
// (feel_assinar). A tela segue usando a memória do aparelho e espelha aqui o que
// pode — falhar ao espelhar nunca quebra o universo.

type Cliente = Pick<SupabaseClient, "from">;

interface LinhaRelacao {
  entidade_id: string;
  tipo: Relacao["tipo"];
  estado: EstadoVerdade;
  provas: number;
}

const GRAVAVEIS: ReadonlySet<EstadoVerdade> = new Set(["declarado", "em_processo"]);

export async function lerRelacoesRemotas(cliente: Cliente): Promise<Relacao[]> {
  const { data, error } = await cliente
    .from("feel_relacoes")
    .select("entidade_id, tipo, estado, provas");
  if (error || !data) return [];
  return (data as LinhaRelacao[]).map((l) => ({
    entidadeId: l.entidade_id,
    tipo: l.tipo,
    estado: l.estado,
    provas: l.provas,
  }));
}

/** Escolhas do onboarding: declarado. Não sobrescreve o que já existe (ex.: assinado). */
export async function espelharEscolhas(cliente: Cliente, ids: string[]) {
  if (ids.length === 0) return;
  await cliente.from("feel_relacoes").upsert(
    ids.map((id) => ({ entidade_id: id, tipo: "identifica_se", estado: "declarado" })),
    { onConflict: "owner_id,entidade_id", ignoreDuplicates: true },
  );
}

/** Uma ação no painel. Só o que a pessoa pode afirmar sozinha vai para o banco. */
export async function espelharAjuste(
  cliente: Cliente,
  entidadeId: string,
  estado: EstadoVerdade | null,
) {
  if (estado == null) {
    await cliente.from("feel_relacoes").delete().eq("entidade_id", entidadeId);
    return;
  }
  if (!GRAVAVEIS.has(estado)) return;
  await cliente
    .from("feel_relacoes")
    .upsert(
      { entidade_id: entidadeId, tipo: "identifica_se", estado },
      { onConflict: "owner_id,entidade_id" },
    );
}

/**
 * O banco tem a palavra final sobre o que foi verificado: confirmado/assinado e as
 * provas vêm de lá. O que é só declarado segue a memória do aparelho (que a pessoa
 * acabou de mudar), para uma leitura antiga não ressuscitar o que ela tirou.
 */
export function aplicarRemotas(
  base: Map<string, Relacao>,
  remotas: readonly Relacao[],
): Map<string, Relacao> {
  const saida = new Map(base);
  for (const r of remotas) {
    if (r.estado === "confirmado" || r.estado === "assinado" || r.provas > 0)
      saida.set(r.entidadeId, r);
  }
  return saida;
}
