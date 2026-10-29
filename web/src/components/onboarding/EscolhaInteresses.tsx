"use client";

import { useEffect, useState } from "react";

import s from "@/components/universo/universo.module.css";
import { onboardingCopy, universoCopy } from "@/content/universo.pt-BR";
import { catalogoInteresses } from "@/data/universo/demo";
import type { DadosUniverso } from "@/data/universo/tipos";
import { registrar } from "@/lib/telemetria";

const c = onboardingCopy;
const MINIMO = 3;

/**
 * Composição inicial (handoff § 5.3): chips por agrupamento. Escolher declara o
 * que representa a pessoa — não filia a nenhuma comunidade. Dá para pular.
 */
export function EscolhaInteresses({
  dados,
  aoConcluir,
  aoPular,
}: {
  dados: DadosUniverso;
  aoConcluir: (ids: string[]) => void;
  aoPular: () => void;
}) {
  const [escolhas, setEscolhas] = useState<string[]>([]);
  useEffect(() => registrar("onboarding_iniciado"), []);

  const alternar = (id: string) => {
    setEscolhas((atual) => {
      const tem = atual.includes(id);
      if (!tem) registrar("interesse_selecionado", { id });
      return tem ? atual.filter((x) => x !== id) : [...atual, id];
    });
  };

  const porGrupo = dados.grupos
    .map((g) => ({
      grupo: g,
      itens: dados.entidades.filter((e) => e.grupoId === g.id && catalogoInteresses.includes(e.id)),
    }))
    .filter((x) => x.itens.length > 0);

  const faltam = Math.max(0, MINIMO - escolhas.length);

  return (
    <main className={s.tela}>
      <div className={s.telaInterna}>
        <h2 className="text-style-h2">{c.titulo}</h2>
        <p className="text-style-body-lg mt-sm text-textoCorpo">{c.subtitulo}</p>
        <p className="text-style-body-md mt-xs text-textoCorpo">{c.instrucao}</p>

        {/* As bolhas surgindo: um traço que se desenha por escolha. */}
        <svg
          className={s.semente}
          viewBox={`0 0 ${Math.max(1, escolhas.length) * 56} 48`}
          aria-hidden
          focusable="false"
        >
          {escolhas.map((id, i) => (
            <circle
              key={id}
              className={s.relacao}
              cx={28 + i * 56}
              cy={24}
              r={20}
              pathLength={1}
              style={{ stroke: "var(--tema-texto)", strokeWidth: 1.5 }}
            />
          ))}
        </svg>

        {porGrupo.map(({ grupo, itens }) => (
          <fieldset key={grupo.id} className="mt-lg">
            <legend className={`text-style-label-caps ${s.secaoTitulo}`}>{grupo.nome}</legend>
            <div className={s.chips} role="group" aria-label={c.rotuloGrupo(grupo.nome)}>
              {itens.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`${s.chip} text-style-body-md`}
                  aria-pressed={escolhas.includes(e.id)}
                  onClick={() => alternar(e.id)}
                >
                  {e.nome}
                  <span
                    className="text-style-data text-textoCorpo"
                    aria-hidden={escolhas.includes(e.id)}
                  >
                    {universoCopy.tipos[e.tipo].toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <p className={`text-style-body-md ${s.aviso}`}>{c.aviso}</p>

        <div className={s.rodapeFixo}>
          <p className="text-style-body-md mr-auto" role="status">
            {c.contador(escolhas.length)}
            {escolhas.length > 0 && faltam > 0 ? ` · ${c.faltam(faltam)}` : ""}
          </p>
          <button type="button" className={s.botao} onClick={aoPular}>
            {c.pular}
          </button>
          <button
            type="button"
            className={`${s.botao} ${s.coral}`}
            disabled={escolhas.length === 0}
            aria-disabled={escolhas.length === 0}
            onClick={() => aoConcluir(escolhas)}
          >
            {c.continuar}
          </button>
        </div>
      </div>
    </main>
  );
}
