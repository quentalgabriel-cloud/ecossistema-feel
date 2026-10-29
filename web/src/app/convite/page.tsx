import type { Metadata } from "next";

import { EntradaConvite } from "@/components/convite/EntradaConvite";

// Peça em validação: fora de índice até o lançamento (CLAUDE.md § Nunca).
export const metadata: Metadata = {
  title: "Convite — Feel",
  robots: { index: false, follow: false },
};

export default async function PaginaConvite({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string | string[] }>;
}) {
  const { codigo } = await searchParams;
  const inicial = typeof codigo === "string" ? codigo.slice(0, 16) : "";
  return <EntradaConvite codigoInicial={inicial} />;
}
