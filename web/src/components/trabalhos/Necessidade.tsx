"use client";

import { useId, useState } from "react";

import u from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import { EXEMPLOS_NECESSIDADE, NICHOS, PRACAS } from "@/data/trabalhos/demo";
import type { Economia, Entendimento, Objetivo } from "@/data/trabalhos/tipos";
import type { Entidade } from "@/data/universo/tipos";
import {
  clientesParaSePagar,
  contatosNecessarios,
  lerValor,
  portaoAberto,
} from "@/lib/trabalhos/economia";
import { entender, faltando } from "@/lib/trabalhos/entender";

import s from "./trabalhos.module.css";

const c = trabalhosCopy;
const CIDADES = [...new Set(PRACAS.map((p) => p.cidade))];
const OBJETIVOS = Object.keys(c.entendimento.objetivos) as Objetivo[];

/** Passo 1: texto livre → "Entendemos assim…" → portão econômico. */
export function Necessidade({
  texto,
  entendimento,
  economia,
  porId,
  ativo,
  aoMudar,
  aoSeguir,
}: {
  texto: string;
  entendimento: Entendimento | null;
  economia: Economia;
  porId: Map<string, Entidade>;
  ativo: boolean;
  aoMudar: (m: { texto?: string; entendimento?: Entendimento; economia?: Economia }) => void;
  aoSeguir: () => void;
}) {
  const idTexto = useId();
  const [rascunho, setRascunho] = useState(texto);
  const [aviso, setAviso] = useState<string | null>(null);
  const nome = (id: string) => porId.get(id)?.nome ?? id;

  if (!ativo && entendimento) {
    return (
      <div>
        <p className="text-style-body-lg">{texto}</p>
        <p className="text-style-data mt-xs text-textoCorpo">
          {[
            entendimento.objetivo ? c.entendimento.objetivos[entendimento.objetivo] : null,
            entendimento.praca,
            entendimento.nichos.map(nome).join(", "),
            entendimento.prazo,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    );
  }

  const entenderAgora = (t: string) => {
    if (!t.trim()) {
      setAviso(c.necessidade.vazio);
      return;
    }
    setAviso(null);
    aoMudar({ texto: t, entendimento: entender(t) });
  };

  const corrigir = (parcial: Partial<Entendimento>) =>
    entendimento && aoMudar({ entendimento: { ...entendimento, ...parcial } });

  return (
    <div>
      <h2 className="text-style-h2">{c.necessidade.titulo}</h2>
      <p className="text-style-body-lg mt-xs text-textoCorpo">{c.necessidade.subtitulo}</p>

      <label htmlFor={idTexto} className={`${s.rotulo} text-style-label-caps mt-lg`}>
        {c.necessidade.rotulo}
      </label>
      <textarea
        id={idTexto}
        className={`${s.areaTexto} text-style-body-lg`}
        value={rascunho}
        placeholder={c.necessidade.placeholder}
        maxLength={400}
        onChange={(e) => setRascunho(e.target.value)}
      />
      <p className="text-style-label-caps mt-sm text-textoCorpo">{c.necessidade.exemplos}</p>
      <div className={u.opcoes}>
        {EXEMPLOS_NECESSIDADE.map((ex) => (
          <button
            key={ex}
            type="button"
            className={`${u.chip} text-style-body-md`}
            onClick={() => {
              setRascunho(ex);
              entenderAgora(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>
      <div className={s.acoesLinha}>
        <button
          type="button"
          className={`${u.botao} ${entendimento ? u.contorno : u.coral}`}
          onClick={() => entenderAgora(rascunho)}
        >
          {c.necessidade.entender}
        </button>
      </div>
      {aviso && (
        <p className={`text-style-body-md ${u.aviso}`} role="alert">
          {aviso}
        </p>
      )}

      {entendimento && (
        <>
          <section className="mt-xl" aria-labelledby="entendimento-titulo">
            <h3 id="entendimento-titulo" className="text-style-ui">
              {c.entendimento.titulo}
            </h3>

            <div className={s.campoLinha}>
              <span className="text-style-label-caps text-textoCorpo">
                {c.entendimento.campos.objetivo}
              </span>
              <div>
                <div className={u.opcoes} role="group" aria-label={c.entendimento.campos.objetivo}>
                  {OBJETIVOS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={`${u.chip} text-style-body-md`}
                      aria-pressed={entendimento.objetivo === o}
                      onClick={() => corrigir({ objetivo: entendimento.objetivo === o ? null : o })}
                    >
                      {c.entendimento.objetivos[o]}
                    </button>
                  ))}
                </div>
                {entendimento.trechos.objetivo && (
                  <span className={`${s.trecho} text-style-data`}>
                    {c.entendimento.porque(entendimento.trechos.objetivo)}
                  </span>
                )}
              </div>
            </div>

            <div className={s.campoLinha}>
              <span className="text-style-label-caps text-textoCorpo">
                {c.entendimento.campos.praca}
              </span>
              <div>
                <div className={u.opcoes} role="group" aria-label={c.entendimento.campos.praca}>
                  {CIDADES.map((cidade) => (
                    <button
                      key={cidade}
                      type="button"
                      className={`${u.chip} text-style-body-md`}
                      aria-pressed={entendimento.praca === cidade}
                      onClick={() =>
                        corrigir({ praca: entendimento.praca === cidade ? null : cidade })
                      }
                    >
                      {cidade}
                    </button>
                  ))}
                </div>
                {entendimento.trechos.praca && (
                  <span className={`${s.trecho} text-style-data`}>
                    {c.entendimento.porque(entendimento.trechos.praca)}
                  </span>
                )}
              </div>
            </div>

            <div className={s.campoLinha}>
              <span className="text-style-label-caps text-textoCorpo">
                {c.entendimento.campos.nichos}
              </span>
              <div>
                <div className={u.opcoes} role="group" aria-label={c.entendimento.campos.nichos}>
                  {NICHOS.map(({ entidade }) => {
                    const marcado = entendimento.nichos.includes(entidade);
                    return (
                      <button
                        key={entidade}
                        type="button"
                        className={`${u.chip} text-style-body-md`}
                        aria-pressed={marcado}
                        onClick={() =>
                          corrigir({
                            nichos: marcado
                              ? entendimento.nichos.filter((n) => n !== entidade)
                              : [...entendimento.nichos, entidade],
                          })
                        }
                      >
                        {nome(entidade)}
                      </button>
                    );
                  })}
                </div>
                {entendimento.trechos.nichos?.length ? (
                  <span className={`${s.trecho} text-style-data`}>
                    {c.entendimento.porque(entendimento.trechos.nichos.join("”, “"))}
                  </span>
                ) : null}
              </div>
            </div>

            <div className={s.campoLinha}>
              <span className="text-style-label-caps text-textoCorpo">
                {c.entendimento.campos.prazo}
              </span>
              <div>
                <input
                  className={`${u.campo} text-style-body-md`}
                  aria-label={c.entendimento.campos.prazo}
                  value={entendimento.prazo ?? ""}
                  placeholder={c.entendimento.escolherPrazo}
                  maxLength={40}
                  onChange={(e) => corrigir({ prazo: e.target.value || null })}
                />
                {entendimento.trechos.prazo && (
                  <span className={`${s.trecho} text-style-data`}>
                    {c.entendimento.porque(entendimento.trechos.prazo)}
                  </span>
                )}
              </div>
            </div>

            {faltando(entendimento).length > 0 && (
              <div className={u.aviso}>
                <p className="text-style-label-caps">{c.entendimento.falta}</p>
                <ul className="mt-xs">
                  {faltando(entendimento).map((f) => (
                    <li key={f} className="text-style-body-md">
                      {c.entendimento.perguntas[f]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <Portao
            economia={economia}
            podeSeguir={entendimento.nichos.length > 0}
            aoMudar={(e) => aoMudar({ economia: e })}
            aoSeguir={aoSeguir}
          />
        </>
      )}
    </div>
  );
}

function Portao({
  economia,
  podeSeguir,
  aoMudar,
  aoSeguir,
}: {
  economia: Economia;
  podeSeguir: boolean;
  aoMudar: (e: Economia) => void;
  aoSeguir: () => void;
}) {
  const ids = { ticket: useId(), conversao: useId(), orcamento: useId() };
  const [textos, setTextos] = useState({
    ticket: economia.ticketMedio?.toString().replace(".", ",") ?? "",
    orcamento: economia.orcamento?.toString().replace(".", ",") ?? "",
  });
  const invalido =
    Number.isNaN(lerValor(textos.ticket)) || Number.isNaN(lerValor(textos.orcamento));
  const clientes = clientesParaSePagar(economia.orcamento, economia.ticketMedio);
  const contatos = contatosNecessarios(clientes, economia.conversaoDe10);
  const aberto = portaoAberto(economia) && podeSeguir;

  const mudarValor = (campo: "ticket" | "orcamento", t: string) => {
    setTextos((x) => ({ ...x, [campo]: t }));
    const v = lerValor(t);
    const valor = v == null || Number.isNaN(v) ? null : v;
    aoMudar(
      campo === "ticket" ? { ...economia, ticketMedio: valor } : { ...economia, orcamento: valor },
    );
  };

  return (
    <section className="mt-xl" aria-labelledby="portao-titulo">
      <h3 id="portao-titulo" className="text-style-ui">
        {c.portao.titulo}
      </h3>
      <p className="text-style-body-md mt-xs text-textoCorpo">{c.portao.subtitulo}</p>
      <div className={`${s.grade} ${s.gradeTres}`}>
        <label htmlFor={ids.ticket} className="grid gap-xs">
          <span className="text-style-body-md">{c.portao.ticket}</span>
          <input
            id={ids.ticket}
            className={`${u.campo} text-style-body-md`}
            inputMode="decimal"
            value={textos.ticket}
            onChange={(e) => mudarValor("ticket", e.target.value)}
          />
        </label>
        <label htmlFor={ids.conversao} className="grid gap-xs">
          <span className="text-style-body-md">{c.portao.conversao}</span>
          <select
            id={ids.conversao}
            className={`${u.campo} text-style-body-md`}
            value={economia.conversaoDe10 ?? ""}
            onChange={(e) =>
              aoMudar({
                ...economia,
                conversaoDe10: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">—</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={ids.orcamento} className="grid gap-xs">
          <span className="text-style-body-md">{c.portao.orcamento}</span>
          <input
            id={ids.orcamento}
            className={`${u.campo} text-style-body-md`}
            inputMode="decimal"
            value={textos.orcamento}
            onChange={(e) => mudarValor("orcamento", e.target.value)}
          />
        </label>
      </div>
      {invalido && (
        <p className={`text-style-body-md ${u.aviso}`} role="alert">
          {c.portao.invalido}
        </p>
      )}
      {clientes != null && (
        <div className={s.destaque} role="status">
          <p className={`text-style-ui ${s.numeroGrande}`}>{c.portao.sePaga(clientes, contatos)}</p>
          <p className="text-style-data mt-xs text-textoCorpo">{c.portao.conta}</p>
        </div>
      )}
      <div className={s.acoesLinha}>
        <button
          type="button"
          className={`${u.botao} ${u.coral}`}
          disabled={!aberto}
          aria-disabled={!aberto}
          onClick={aoSeguir}
        >
          {c.portao.seguir}
        </button>
      </div>
      {!aberto && <p className="text-style-body-md mt-xs text-textoCorpo">{c.portao.fechado}</p>}
    </section>
  );
}
