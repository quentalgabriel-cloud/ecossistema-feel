import type { Metadata } from "next";

import { ConviteRecebido } from "@/components/trabalhos/ConviteRecebido";

export const metadata: Metadata = {
  title: "Convite — Feel",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function PaginaConvite({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ConviteRecebido token={token} />;
}
