"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { universoCopy } from "@/content/universo.pt-BR";
import type { Perspectiva } from "@/data/universo/tipos";
import type { BolhaCena } from "@/lib/universo/cena";
import { ESCALA } from "@/lib/universo/escala";
import type { PreferenciaMovimento, PreferenciaTema } from "@/lib/universo/memoria";

import { AmostraEstado } from "./Bolha";
import { Icone } from "./Icones";
import s from "./universo.module.css";

const c = universoCopy;

const fecharComEsc = (fechar: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Escape") {
    e.stopPropagation();
    fechar();
  }
};

/** Legenda contextual: explica o que forma, preenchimento e tamanho significam aqui. */
export function Legenda({
  perspectiva,
  aoFechar,
}: {
  perspectiva: Perspectiva;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`${s.cartao} ${s.legenda}`}
      role="dialog"
      aria-label={c.legenda.titulo}
      onKeyDown={fecharComEsc(aoFechar)}
    >
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-style-ui">{c.legenda.titulo}</h2>
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoFechar}
          aria-label={c.legenda.fechar}
        >
          <Icone nome="fechar" />
        </button>
      </div>
      <p className="text-style-body-md mt-xs text-textoCorpo">{c.legenda.estados}</p>
      <ul className={s.legendaLista}>
        {(["sugerido", "declarado", "em_processo", "confirmado"] as const).map((e) => (
          <li key={e} className={s.legendaItem}>
            <AmostraEstado estado={e} />
            <span className="text-style-body-md">{c.estados[e]}</span>
          </li>
        ))}
        <li className={s.legendaItem}>
          <AmostraEstado estado="assinado" provas={6} />
          <span className="text-style-body-md">{c.legenda.peso}</span>
        </li>
      </ul>
      <p className="text-style-body-md mt-sm text-textoCorpo">
        {perspectiva === "comunidades"
          ? c.legenda.tamanhoComunidades(ESCALA.maxMembros)
          : perspectiva === "descobrir"
            ? c.legenda.tamanhoDescobrir
            : c.legenda.tamanhoUniverso}
      </p>
      {perspectiva === "comunidades" && (
        <p className="text-style-body-md mt-xs text-textoCorpo">{c.legenda.semContagem}</p>
      )}
    </div>
  );
}

/** Busca por entidade com "Ir até" (handoff § 5.4). */
export function BuscaUniverso({
  bolhas,
  aoEscolher,
  aoFechar,
}: {
  bolhas: BolhaCena[];
  aoEscolher: (b: BolhaCena) => void;
  aoFechar: () => void;
}) {
  const [q, setQ] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  useEffect(() => campo.current?.focus(), []);
  const normal = (t: string) =>
    t
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const resultados = useMemo(() => {
    const alvo = normal(q.trim());
    const candidatos = bolhas.filter((b) => b.tipo !== "nucleo");
    return alvo ? candidatos.filter((b) => normal(b.nome).includes(alvo)) : candidatos;
  }, [q, bolhas]);

  return (
    <div
      className={`${s.cartao} ${s.folha}`}
      role="dialog"
      aria-label={c.busca.rotulo}
      onKeyDown={fecharComEsc(aoFechar)}
    >
      <div className="flex items-center gap-xs">
        <label className="flex-1">
          <span className={s.vivo}>{c.busca.rotulo}</span>
          <input
            ref={campo}
            className={`${s.campo} text-style-body-md`}
            type="search"
            value={q}
            placeholder={c.busca.placeholder}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoFechar}
          aria-label={c.busca.fechar}
        >
          <Icone nome="fechar" />
        </button>
      </div>
      {resultados.length === 0 ? (
        <p className="text-style-body-md mt-sm text-textoCorpo" role="status">
          {c.busca.semResultado(q.trim())}
        </p>
      ) : (
        <ul className={s.resultados}>
          {resultados.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className={`${s.resultado} text-style-body-md`}
                onClick={() => aoEscolher(b)}
              >
                <span>{b.nome}</span>
                <span className="text-style-data text-textoCorpo">
                  {c.busca.irAte}
                  <span className={s.vivo}> {b.nome}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Tema e movimento (espelham feel_user_preferences). */
export function Preferencias({
  tema,
  movimento,
  aoTema,
  aoMovimento,
  aoReiniciar,
  aoFechar,
}: {
  tema: PreferenciaTema;
  movimento: PreferenciaMovimento;
  aoTema: (t: PreferenciaTema) => void;
  aoMovimento: (m: PreferenciaMovimento) => void;
  aoReiniciar: () => void;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`${s.cartao} ${s.folha}`}
      role="dialog"
      aria-label={c.preferencias.titulo}
      onKeyDown={fecharComEsc(aoFechar)}
    >
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-style-ui">{c.preferencias.titulo}</h2>
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoFechar}
          aria-label={c.preferencias.fechar}
        >
          <Icone nome="fechar" />
        </button>
      </div>
      <fieldset className="mt-md">
        <legend className={`text-style-label-caps ${s.secaoTitulo}`}>{c.preferencias.tema}</legend>
        <div className={s.opcoes}>
          {(Object.keys(c.preferencias.temas) as PreferenciaTema[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`${s.chip} text-style-body-md`}
              aria-pressed={tema === t}
              onClick={() => aoTema(t)}
            >
              {c.preferencias.temas[t]}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-md">
        <legend className={`text-style-label-caps ${s.secaoTitulo}`}>
          {c.preferencias.movimento}
        </legend>
        <div className={s.opcoes}>
          {(Object.keys(c.preferencias.movimentos) as PreferenciaMovimento[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`${s.chip} text-style-body-md`}
              aria-pressed={movimento === m}
              onClick={() => aoMovimento(m)}
            >
              {c.preferencias.movimentos[m]}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" className={`${s.link} text-style-body-md mt-lg`} onClick={aoReiniciar}>
        {c.preferencias.reiniciar}
      </button>
    </div>
  );
}
