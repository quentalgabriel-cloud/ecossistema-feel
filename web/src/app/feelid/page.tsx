import type { Metadata } from "next";

import { FeelIDDemo } from "@/components/feelid/FeelIDDemo";
import { feelidCopy } from "@/content/feelid.pt-BR";

export const metadata: Metadata = {
  title: "FeelID — carta de perfil",
  robots: { index: false, follow: false },
};

export default function PaginaFeelID() {
  const c = feelidCopy.demo;
  return (
    <main className="min-h-screen bg-paper px-md py-xl md:px-xl md:py-section">
      <header className="mb-xl max-w-[640px] md:mb-section print:hidden">
        <h1 className="text-style-h1 text-ink">{c.titulo}</h1>
        <p className="text-style-body-lg mt-sm text-textBody">{c.subtitulo}</p>
      </header>
      <FeelIDDemo />
    </main>
  );
}
