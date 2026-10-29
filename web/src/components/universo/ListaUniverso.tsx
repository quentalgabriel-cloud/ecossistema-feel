"use client";

import { universoCopy } from "@/content/universo.pt-BR";
import type { Entidade, Grupo } from "@/data/universo/tipos";
import type { BolhaCena } from "@/lib/universo/cena";

import { AmostraEstado } from "./Bolha";
import { explicarSugestao } from "./PainelContexto";
import s from "./universo.module.css";

const c = universoCopy;

interface Props {
  bolhas: BolhaCena[];
  grupos: Grupo[];
  perspectiva: string;
  porId: Map<string, Entidade>;
  aoDetalhes: (b: BolhaCena) => void;
  aoIrAte: (b: BolhaCena) => void;
}

/** Alternativa linear e equivalente ao canvas (handoff § 5.8): sem pinça, sem arrasto. */
export function ListaUniverso({ bolhas, grupos, perspectiva, porId, aoDetalhes, aoIrAte }: Props) {
  const entidades = bolhas.filter((b) => b.tipo === "entidade");
  const blocos =
    perspectiva === "meu-universo"
      ? grupos
          .map((g) => ({ titulo: g.nome, itens: entidades.filter((b) => b.grupoId === g.id) }))
          .filter((x) => x.itens.length > 0)
      : [{ titulo: c.perspectivas[perspectiva as keyof typeof c.perspectivas], itens: entidades }];

  return (
    <div className={s.lista}>
      <div className={s.listaInterna}>
        <h2 className="text-style-h2">{c.lista.titulo}</h2>
        <p className="text-style-body-lg mt-xs text-textoCorpo">{c.lista.descricao}</p>
        {entidades.length === 0 && (
          <p className={`text-style-body-md ${s.aviso}`}>
            {perspectiva === "descobrir" ? c.vazio.descobrir : c.vazio.universo}
          </p>
        )}
        {blocos.map((bloco) => (
          <section key={bloco.titulo} className={s.listaGrupo} aria-label={bloco.titulo}>
            <h3 className={`text-style-label-caps ${s.secaoTitulo}`}>{bloco.titulo}</h3>
            <ul>
              {bloco.itens.map((b) => (
                <li key={b.id} className={s.listaItem}>
                  <AmostraEstado estado={b.estado} provas={b.provas} tamanho={28} />
                  <div>
                    <h4 className="text-style-ui">{b.nome}</h4>
                    <p className="text-style-data mt-xs text-textoCorpo">
                      {[
                        b.entidade ? c.tipos[b.entidade.tipo] : null,
                        b.estado ? c.estados[b.estado] : null,
                        perspectiva === "comunidades"
                          ? b.membros == null
                            ? c.bolha.semContagem
                            : c.bolha.membros(b.membros)
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {b.sugestao && (
                      <p className="text-style-body-md mt-xs">
                        {explicarSugestao(b.sugestao, porId)}
                      </p>
                    )}
                    <div className={s.previaAcoes}>
                      <button
                        type="button"
                        className={`${s.botao} ${s.contorno}`}
                        onClick={() => aoDetalhes(b)}
                      >
                        {c.lista.abrir}
                        <span className={s.vivo}>: {b.nome}</span>
                      </button>
                      <button type="button" className={s.botao} onClick={() => aoIrAte(b)}>
                        {c.busca.irAte}
                        <span className={s.vivo}> {b.nome}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
