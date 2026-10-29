import { dadosDemo, regrasSugestao, relacoesDemo, variacao30Dias } from "./demo";
import type { DadosUniverso, Relacao, Sugestao } from "./tipos";

// A camada de dados é intercambiável (handoff § 9.2): hoje responde com as
// fixtures de demonstração, sem rede e sem autenticação. Quando houver dado
// real, só este arquivo troca (Supabase `feel`, Onda 3 do plano).

export interface FonteUniverso {
  carregar(): Promise<DadosUniverso>;
  relacoesDemonstracao(): Relacao[];
  regrasDescoberta(): Sugestao[];
  variacaoSimulada(): Record<string, number>;
}

export const fonteDemo: FonteUniverso = {
  carregar: async () => dadosDemo,
  relacoesDemonstracao: () => relacoesDemo,
  regrasDescoberta: () => regrasSugestao,
  variacaoSimulada: () => variacao30Dias,
};
