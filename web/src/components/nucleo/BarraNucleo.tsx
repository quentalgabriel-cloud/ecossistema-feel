import Link from "next/link";

import s from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";

// As superfícies permanentes do núcleo (Handoff Mestre § 14.1). Nesta entrega:
// Rede (o Meu Universo) e Trabalhos. Agora e Você entram depois.

const c = trabalhosCopy.nucleo;

export function BarraNucleo({ atual }: { atual: "rede" | "trabalhos" }) {
  return (
    <nav className={s.nucleo} aria-label={c.rotulo}>
      <Link
        href="/universo"
        className={`${s.nucleoLink} text-style-ui`}
        aria-current={atual === "rede" ? "page" : undefined}
      >
        {c.rede}
      </Link>
      <Link
        href="/trabalhos"
        className={`${s.nucleoLink} text-style-ui`}
        aria-current={atual === "trabalhos" ? "page" : undefined}
      >
        {c.trabalhos}
      </Link>
    </nav>
  );
}
