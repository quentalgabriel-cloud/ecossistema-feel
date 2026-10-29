"use client";

import { useEffect, useRef } from "react";

import { formatarNumero, universoCopy } from "@/content/universo.pt-BR";
import type { Comunidade, Entidade, EstadoVerdade, Sugestao } from "@/data/universo/tipos";
import { acimaDoTeto, variacaoPercentual } from "@/lib/universo/escala";

import { AmostraEstado } from "./Bolha";
import { Icone } from "./Icones";
import s from "./universo.module.css";

const c = universoCopy;

export type AcaoEntidade = "identificar" | "participar" | "acompanhar" | "descartar";

export function explicarSugestao(sug: Sugestao, porId: Map<string, Entidade>): string {
  return c.motivos[sug.motivo](sug.evidencias.map((id) => porId.get(id)?.nome ?? id));
}

const dataCurta = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso + "T12:00:00"),
  );

interface Props {
  entidade: Entidade;
  estado: EstadoVerdade | null;
  provas: number;
  comunidade?: Comunidade;
  membrosAgora: number | null | undefined;
  simulando: boolean;
  sugestao?: Sugestao;
  porId: Map<string, Entidade>;
  /** Entidades presentes na cena (dá para ir até elas). */
  presentes: Set<string>;
  mensagem: string | null;
  aoAcao: (acao: AcaoEntidade) => void;
  aoIrPara: (id: string) => void;
  aoFechar: () => void;
}

/** Detalhe de entidade (handoff § 5.7): o quê, por que apareceu, sua relação, ações. */
export function PainelContexto({
  entidade: e,
  estado,
  provas,
  comunidade,
  membrosAgora,
  simulando,
  sugestao,
  porId,
  presentes,
  mensagem,
  aoAcao,
  aoIrPara,
  aoFechar,
}: Props) {
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titulo.current?.focus();
  }, [e.id]);

  const original = comunidade?.membrosConfirmados ?? null;
  const variacao = simulando ? variacaoPercentual(original, membrosAgora ?? null) : null;
  const podeParticipar =
    ["comunidade", "evento", "oportunidade"].includes(e.tipo) &&
    estado !== "em_processo" &&
    estado !== "confirmado" &&
    estado !== "assinado";
  const podeIdentificar = estado === null || estado === "sugerido";
  const relacionadas = e.relacionadas.map((id) => porId.get(id)).filter((x): x is Entidade => !!x);

  // Coral: a ação principal do painel (regra do anel — um por composição).
  const principal: AcaoEntidade | null = podeIdentificar
    ? "identificar"
    : podeParticipar
      ? "participar"
      : null;

  return (
    <aside
      className={s.painel}
      aria-labelledby={`painel-${e.id}`}
      onKeyDown={(ev) => {
        if (ev.key === "Escape") {
          ev.stopPropagation();
          aoFechar();
        }
      }}
    >
      <div className={s.painelTopo}>
        <span className={`text-style-label-caps ${s.secaoTitulo}`}>{c.tipos[e.tipo]}</span>
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoFechar}
          aria-label={c.controles.fecharPainel}
        >
          <Icone nome="fechar" />
        </button>
      </div>
      <div className={s.painelCorpo}>
        <h2 id={`painel-${e.id}`} ref={titulo} tabIndex={-1} className="text-style-h2 outline-none">
          {e.nome}
        </h2>
        <p className="text-style-body-lg mt-sm text-textoCorpo">{e.descricao}</p>

        {sugestao && (
          <section className={s.secao}>
            <h3 className={`text-style-label-caps ${s.secaoTitulo}`}>{c.painel.porque}</h3>
            <p className="text-style-body-md">{explicarSugestao(sugestao, porId)}</p>
          </section>
        )}

        <section className={s.secao}>
          <h3 className={`text-style-label-caps ${s.secaoTitulo}`}>{c.painel.estado}</h3>
          {estado ? (
            <div className={s.estadoLinha}>
              <AmostraEstado estado={estado} provas={provas} tamanho={28} />
              <div>
                <p className="text-style-ui">{c.estados[estado]}</p>
                <p className="text-style-body-md text-textoCorpo">{c.estadosExplicacao[estado]}</p>
              </div>
            </div>
          ) : (
            <p className="text-style-body-md text-textoCorpo">{c.painel.semRelacao}</p>
          )}
        </section>

        {comunidade && (
          <section className={s.secao}>
            <h3 className={`text-style-label-caps ${s.secaoTitulo}`}>{c.painel.membros}</h3>
            {membrosAgora == null ? (
              <p className="text-style-body-md text-textoCorpo">{c.painel.semContagem}</p>
            ) : (
              <>
                <p className={`text-style-h2 ${s.numero}`}>{formatarNumero(membrosAgora)}</p>
                <p className="text-style-data mt-xs text-textoCorpo">
                  {comunidade.contagemEm
                    ? c.painel.contagemEm(dataCurta(comunidade.contagemEm))
                    : null}
                  {variacao != null ? ` · ${c.painel.variacao(variacao)}` : null}
                </p>
                {acimaDoTeto(membrosAgora) && (
                  <p className={`text-style-body-md ${s.aviso}`}>{c.painel.acimaDoTeto}</p>
                )}
              </>
            )}
            <p className="text-style-body-md mt-xs text-textoCorpo">
              {c.painel.politica[comunidade.politica]}
            </p>
          </section>
        )}

        <section className={s.secao}>
          <h3 className={`text-style-label-caps ${s.secaoTitulo}`}>{c.painel.relacionadas}</h3>
          {relacionadas.length === 0 ? (
            <p className="text-style-body-md text-textoCorpo">{c.painel.semRelacionadas}</p>
          ) : (
            <div className={s.relacionadas}>
              {relacionadas.map((r) =>
                presentes.has(r.id) ? (
                  <button
                    key={r.id}
                    type="button"
                    className={`${s.chip} text-style-body-md`}
                    onClick={() => aoIrPara(r.id)}
                  >
                    {r.nome}
                  </button>
                ) : (
                  <span
                    key={r.id}
                    className={`${s.chip} text-style-body-md`}
                    style={{ cursor: "default" }}
                  >
                    {r.nome}
                  </span>
                ),
              )}
            </div>
          )}
        </section>

        <div className={s.acoes}>
          {podeIdentificar && (
            <button
              type="button"
              className={`${s.botao} ${principal === "identificar" ? s.coral : s.contorno}`}
              onClick={() => aoAcao("identificar")}
            >
              {c.painel.acoes.identificar}
            </button>
          )}
          {podeParticipar && (
            <button
              type="button"
              className={`${s.botao} ${principal === "participar" ? s.coral : s.contorno}`}
              onClick={() => aoAcao("participar")}
            >
              {c.painel.acoes.participar}
            </button>
          )}
          <button
            type="button"
            className={`${s.botao} ${s.contorno}`}
            onClick={() => aoAcao("acompanhar")}
          >
            {c.painel.acoes.acompanhar}
          </button>
          {estado === "sugerido" && (
            <button type="button" className={s.botao} onClick={() => aoAcao("descartar")}>
              {c.painel.acoes.descartar}
            </button>
          )}
        </div>
        <p className={`text-style-body-md ${s.aviso}`} role="status">
          {mensagem ?? c.painel.simulacao}
        </p>
      </div>
    </aside>
  );
}
