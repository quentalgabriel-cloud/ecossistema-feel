"use client";

import { useId } from "react";

import { universoCopy } from "@/content/universo.pt-BR";
import type { BolhaCena } from "@/lib/universo/cena";
import { acimaDoTeto } from "@/lib/universo/escala";
import { aparencia } from "@/lib/universo/estadoVerdade";
import { glifoDe } from "@/lib/universo/glifos";

import s from "./universo.module.css";

const c = universoCopy;

export function rotuloAcessivel(b: BolhaCena, perspectiva: string): string {
  if (b.tipo === "nucleo") return c.bolha.nucleo(b.nome);
  if (b.tipo === "grupo") return c.bolha.grupo(b.nome, b.quantidade ?? 0);
  const tipo = b.entidade ? c.tipos[b.entidade.tipo] : "";
  const estado = b.estado ? c.estados[b.estado] : null;
  const membros =
    perspectiva === "comunidades"
      ? b.membros == null
        ? c.bolha.semContagem
        : c.bolha.membros(b.membros)
      : null;
  return c.bolha.entidade(b.nome, tipo, estado, membros);
}

interface Props {
  bolha: BolhaCena;
  /** Raio reservado (a bolha anima por escala até ele). */
  raioMax?: number;
  perspectiva: string;
  selecionada: boolean;
  recuada: boolean;
  nucleoAceso?: boolean;
  aoSelecionar: (b: BolhaCena) => void;
}

/**
 * Uma bolha: disco (preenchimento = estado de verdade), contorno em SVG com
 * peso fixo em px de tela (vector-effect), e rótulo compensado pela escala.
 */
export function Bolha({
  bolha: b,
  raioMax,
  perspectiva,
  selecionada,
  recuada,
  nucleoAceso,
  aoSelecionar,
}: Props) {
  const idMascara = useId();
  const ap = aparencia(b.tipo === "entidade" ? b.estado : null, b.provas);
  const R = Math.max(raioMax ?? b.r, b.r);
  const escala = b.r / R;
  const glifo = b.entidade ? glifoDe(b.entidade.tipo) : null;
  const semContagem = perspectiva === "comunidades" && b.membros === null;
  const peso = b.tipo === "nucleo" ? 2.6 : b.tipo === "grupo" ? 1 : ap.peso;
  const preenchimento = b.tipo === "entidade" ? ap.preenchimento : "nenhum";

  const meta =
    b.tipo === "grupo"
      ? c.bolha.quantidade(b.quantidade ?? 0)
      : perspectiva === "comunidades"
        ? b.membros == null
          ? c.bolha.semContagem
          : `${c.bolha.membrosCurto(b.membros)}${acimaDoTeto(b.membros) ? "+" : ""}`
        : b.estado
          ? c.estados[b.estado]
          : null;
  const tipoTexto = b.entidade ? c.tipos[b.entidade.tipo] : null;

  return (
    <button
      type="button"
      className={s.bolha}
      style={{ left: b.x, top: b.y, width: b.r * 2, height: b.r * 2 }}
      data-tipo={b.tipo}
      data-preenchimento={preenchimento}
      data-selecionada={selecionada}
      data-recuada={recuada}
      data-sempre-rotulo={perspectiva === "comunidades" && b.r >= 70}
      aria-label={rotuloAcessivel(b, perspectiva)}
      aria-pressed={b.tipo === "nucleo" ? undefined : selecionada}
      onClick={() => aoSelecionar(b)}
    >
      <span
        className={s.disco}
        data-preenchimento={preenchimento}
        data-vidro={ap.vidro && b.tipo === "entidade"}
        style={{
          width: R * 2,
          height: R * 2,
          transform: `translate(-50%, -50%) scale(${escala})`,
        }}
      >
        <svg
          className={s.contornoSvg}
          viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
          aria-hidden
          focusable="false"
        >
          <mask
            id={idMascara}
            maskUnits="userSpaceOnUse"
            x={-R * 2}
            y={-R * 2}
            width={R * 4}
            height={R * 4}
          >
            <circle className={s.revelar} r={R} pathLength={1} transform="rotate(-90)" />
          </mask>
          <g mask={`url(#${idMascara})`}>
            <circle
              className={s.traco}
              r={R - 0.5}
              strokeWidth={peso}
              data-tracejado={ap.tracejado && b.tipo === "entidade"}
            />
            {semContagem && <circle className={s.anelInterno} r={R * 0.84} />}
          </g>
          <circle className={s.anelSelecao} r={R + 7 / Math.max(escala, 0.01)} />
          {glifo && b.tipo === "entidade" && (
            <g transform={`scale(${R * 0.42})`}>
              {glifo.tracos.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className={s.glifo}
                  strokeDasharray={glifo.tracejado ? "3 3" : undefined}
                />
              ))}
            </g>
          )}
        </svg>
      </span>

      {b.tipo === "nucleo" ? (
        <>
          <span className={`${s.rotulo} ${s.rotuloCentro}`} style={{ top: "50%" }} aria-hidden>
            <span className={s.nucleoPonto} data-oculto={!nucleoAceso} />
          </span>
          <span className={s.rotulo} style={{ top: `calc(50% + ${b.r + 6}px)` }} aria-hidden>
            <span className={`${s.rotuloNome} text-style-ui`}>{b.nome}</span>
          </span>
        </>
      ) : b.tipo === "grupo" ? (
        <span className={s.rotulo} style={{ top: `calc(50% - ${b.r - 14}px)` }} aria-hidden>
          <span className={`${s.rotuloNome} text-style-ui`}>{b.nome}</span>
          <span className={`${s.rotuloMeta} text-style-data`}>{meta}</span>
        </span>
      ) : (
        <span className={s.rotulo} style={{ top: `calc(50% + ${b.r + 6}px)` }} aria-hidden>
          <span className={`${s.rotuloNome} text-style-body-md`}>{b.nome}</span>
          {meta && (
            <span
              className={`${s.rotuloMeta} text-style-data`}
              data-nivel-min={perspectiva === "comunidades" ? "contexto" : "detalhe"}
            >
              {meta}
            </span>
          )}
          {tipoTexto && (
            <span className={`${s.rotuloMeta} text-style-label-caps`} data-nivel-min="detalhe">
              {tipoTexto}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

/** Amostra estática de um estado (legenda, painel, lista). */
export function AmostraEstado({
  estado,
  provas = 0,
  tamanho = 24,
}: {
  estado: BolhaCena["estado"];
  provas?: number;
  tamanho?: number;
}) {
  const ap = aparencia(estado, provas);
  const r = tamanho / 2;
  return (
    <span className={s.amostra} style={{ width: tamanho, height: tamanho }} aria-hidden>
      <span
        className={s.disco}
        data-preenchimento={ap.preenchimento}
        data-vidro={ap.vidro}
        style={{ width: tamanho, height: tamanho, left: 0, top: 0, transform: "none" }}
      >
        <svg
          className={s.contornoSvg}
          viewBox={`${-r} ${-r} ${tamanho} ${tamanho}`}
          focusable="false"
        >
          <circle
            className={s.traco}
            r={r - 1}
            strokeWidth={ap.peso}
            data-tracejado={ap.tracejado}
          />
        </svg>
      </span>
    </span>
  );
}
