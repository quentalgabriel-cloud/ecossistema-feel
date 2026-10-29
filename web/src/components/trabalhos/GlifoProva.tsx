import { glifoProva } from "@/lib/universo/glifos";

import s from "./trabalhos.module.css";

const { traco, rotacoes } = glifoProva();

/** Dois arcos que se cruzam a 32°: o cruzamento é a co-assinatura (LINGUAGEM § 2). */
export function GlifoProva({ rotulo }: { rotulo: string }) {
  return (
    <svg className={s.glifoProva} viewBox="-1.2 -1.2 2.4 2.4" role="img" aria-label={rotulo}>
      {rotacoes.map((r) => (
        <path key={r} d={traco} pathLength={1} transform={`rotate(${r})`} />
      ))}
    </svg>
  );
}
