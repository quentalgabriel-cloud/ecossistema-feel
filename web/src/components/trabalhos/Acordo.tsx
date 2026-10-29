"use client";

import { useId, useState } from "react";

import u from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import { ENTREGAVEIS } from "@/data/trabalhos/demo";
import type { Acordo as TAcordo, DireitosUso } from "@/data/trabalhos/tipos";

import s from "./trabalhos.module.css";

const c = trabalhosCopy.acordo;
const DIREITOS = Object.keys(c.direitosOpcoes) as DireitosUso[];

export interface DadosAcordo {
  entregaveis: string[];
  direitos: DireitosUso;
  prazo: string;
  esperamos: string;
  erramosSe: string;
}

/** Leitura do acordo carimbado: não há campo editável depois do carimbo. */
export function AcordoCarimbado({ acordo, nome }: { acordo: TAcordo; nome: string }) {
  return (
    <div className={s.carimbo}>
      <p className="text-style-label-caps text-textoCorpo">{c.carimbado(acordo.carimbadoEm)}</p>
      <p className="text-style-ui mt-xs">{c.com(nome)}</p>
      <p className="text-style-body-md mt-xs text-textoCorpo">
        {acordo.entregaveis.join(" · ")} · {c.direitosOpcoes[acordo.direitos]}
        {acordo.prazo ? ` · ${acordo.prazo}` : ""}
      </p>
      <dl className="mt-sm grid gap-xs">
        <div>
          <dt className="text-style-label-caps text-textoCorpo">{c.esperamos}</dt>
          <dd className="text-style-body-lg">{acordo.esperamos}</dd>
        </div>
        <div>
          <dt className="text-style-label-caps text-textoCorpo">{c.erramosSe}</dt>
          <dd className="text-style-body-lg">{acordo.erramosSe}</dd>
        </div>
      </dl>
      <p className="text-style-data mt-sm text-textoCorpo">{c.imutavel}</p>
    </div>
  );
}

/** Passo 3: o combinado, escrito antes — "Esperamos" e "Erramos se". */
export function FormularioAcordo({
  nome,
  prazoInicial,
  erro,
  aoCarimbar,
}: {
  nome: string;
  prazoInicial: string;
  erro: string | null;
  aoCarimbar: (d: DadosAcordo) => void;
}) {
  const ids = { prazo: useId(), esperamos: useId(), erramosSe: useId() };
  const [d, setD] = useState<DadosAcordo>({
    entregaveis: [],
    direitos: "organico",
    prazo: prazoInicial,
    esperamos: "",
    erramosSe: "",
  });
  const completo = d.entregaveis.length > 0 && !!d.esperamos.trim() && !!d.erramosSe.trim();

  return (
    <div>
      <h2 className="text-style-h2">{c.titulo}</h2>
      <p className="text-style-body-lg mt-xs text-textoCorpo">{c.subtitulo}</p>
      <p className="text-style-ui mt-md">{c.com(nome)}</p>

      <fieldset className="mt-lg">
        <legend className={`${s.rotulo} text-style-label-caps`}>{c.entregaveis}</legend>
        <div className={u.opcoes}>
          {ENTREGAVEIS.map((e) => {
            const marcado = d.entregaveis.includes(e);
            return (
              <button
                key={e}
                type="button"
                className={`${u.chip} text-style-body-md`}
                aria-pressed={marcado}
                onClick={() =>
                  setD({
                    ...d,
                    entregaveis: marcado
                      ? d.entregaveis.filter((x) => x !== e)
                      : [...d.entregaveis, e],
                  })
                }
              >
                {e}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-lg">
        <legend className={`${s.rotulo} text-style-label-caps`}>{c.direitos}</legend>
        <div className={u.opcoes}>
          {DIREITOS.map((dir) => (
            <button
              key={dir}
              type="button"
              className={`${u.chip} text-style-body-md`}
              aria-pressed={d.direitos === dir}
              onClick={() => setD({ ...d, direitos: dir })}
            >
              {c.direitosOpcoes[dir]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={`${s.grade} ${s.gradeDois}`}>
        <label htmlFor={ids.prazo} className="grid gap-xs">
          <span className={`${s.rotulo} text-style-label-caps`}>{c.prazo}</span>
          <input
            id={ids.prazo}
            className={`${u.campo} text-style-body-md`}
            value={d.prazo}
            maxLength={40}
            onChange={(e) => setD({ ...d, prazo: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-lg grid gap-md">
        <label htmlFor={ids.esperamos} className="grid gap-xs">
          <span className="text-style-ui">{c.esperamos}</span>
          <span className="text-style-body-md text-textoCorpo">{c.esperamosDica}</span>
          <textarea
            id={ids.esperamos}
            className={`${s.areaTexto} text-style-body-md`}
            value={d.esperamos}
            maxLength={280}
            onChange={(e) => setD({ ...d, esperamos: e.target.value })}
          />
        </label>
        <label htmlFor={ids.erramosSe} className="grid gap-xs">
          <span className="text-style-ui">{c.erramosSe}</span>
          <span className="text-style-body-md text-textoCorpo">{c.erramosSeDica}</span>
          <textarea
            id={ids.erramosSe}
            className={`${s.areaTexto} text-style-body-md`}
            value={d.erramosSe}
            maxLength={280}
            onChange={(e) => setD({ ...d, erramosSe: e.target.value })}
          />
        </label>
      </div>

      <div className={s.acoesLinha}>
        <button
          type="button"
          className={`${u.botao} ${u.coral}`}
          disabled={!completo}
          aria-disabled={!completo}
          onClick={() => aoCarimbar(d)}
        >
          {c.carimbar}
        </button>
      </div>
      {(!completo || erro) && (
        <p className="text-style-body-md mt-xs text-textoCorpo" role={erro ? "alert" : undefined}>
          {erro ?? c.incompleto}
        </p>
      )}
    </div>
  );
}
