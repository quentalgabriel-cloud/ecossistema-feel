import type { Economia, Funil } from "@/data/trabalhos/tipos";

// Contas que só usam o que a pessoa digitou ou mediu. Faltou um lado, o resultado
// é null — a tela mostra o que falta, nunca um número estimado.

const positivo = (n: number | null | undefined): n is number =>
  typeof n === "number" && Number.isFinite(n) && n > 0;

/** O portão econômico está aberto? (ticket, conversão e orçamento preenchidos.) */
export function portaoAberto(e: Economia): boolean {
  return (
    positivo(e.ticketMedio) &&
    positivo(e.orcamento) &&
    positivo(e.conversaoDe10) &&
    e.conversaoDe10! <= 10
  );
}

/** Quantos clientes a campanha precisa trazer para se pagar. */
export function clientesParaSePagar(
  orcamento: number | null,
  ticket: number | null,
): number | null {
  if (!positivo(orcamento) || !positivo(ticket)) return null;
  return Math.ceil(orcamento / ticket);
}

/** Quantos contatos isso exige, dada a conversão declarada (de cada 10). */
export function contatosNecessarios(
  clientes: number | null,
  conversaoDe10: number | null,
): number | null {
  if (!positivo(clientes) || !positivo(conversaoDe10) || conversaoDe10 > 10) return null;
  return Math.ceil((clientes * 10) / conversaoDe10);
}

/** Custo por cliente fechado = gasto efetivo ÷ clientes medidos. */
export function custoPorCliente(f: Funil): number | null {
  if (f.gasto == null || !Number.isFinite(f.gasto) || f.gasto < 0) return null;
  if (!positivo(f.clientes)) return null;
  return f.gasto / f.clientes;
}

/** Receita trazida = clientes medidos × ticket declarado. */
export function receitaMedida(f: Funil, ticket: number | null): number | null {
  if (f.clientes == null || f.clientes < 0 || !positivo(ticket)) return null;
  return f.clientes * ticket;
}

/** Converte o que foi digitado ("1.200,50", "180") em número; vazio = null. */
export function lerValor(texto: string): number | null {
  const limpo = texto.trim().replace(/\s|R\$/g, "");
  if (!limpo) return null;
  const n = Number(limpo.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}
