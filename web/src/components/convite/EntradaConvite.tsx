"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

import { FeelIDCard } from "@/components/feelid/FeelIDCard";
import { FioAssinatura } from "@/components/feelid/Tracos";
import s from "@/components/universo/universo.module.css";
import { conviteCopy } from "@/content/convite.pt-BR";
import type { CartaPerfil } from "@/data/feelid/tipos";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";
import { registrar } from "@/lib/telemetria";
import { atualizarMemoria, lerMemoria } from "@/lib/universo/memoria";

const c = conviteCopy;
const LIMITE_NOME = 40;

/**
 * SENTIR (Estratégia de Lançamento § 8): o convite vira um objeto — a carta
 * FEEL ID ganha o nome de quem chega enquanto a pessoa digita. Só depois disso
 * vem a primeira pergunta, e ela é sobre o universo da pessoa, não sobre a Feel.
 */
export function EntradaConvite({ codigoInicial }: { codigoInicial: string }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState(codigoInicial);
  const [virada, setVirada] = useState(false);
  const idNome = useId();
  const idCodigo = useId();
  const [prefsIniciais, setPrefsIniciais] = useState<ReturnType<typeof lerMemoria> | null>(null);

  useEffect(() => {
    const m = lerMemoria();
    setPrefsIniciais(m);
    if (m.nome) setNome(m.nome);
    if (!codigoInicial && m.codigo) setCodigo(m.codigo);
    registrar("convite_aberto", { comCodigo: !!codigoInicial });
  }, [codigoInicial]);

  // O convite não tem tela de preferências: só respeita o que a pessoa já escolheu.
  const sistemaReduzido = usePrefereMovimentoReduzido();
  const tema = prefsIniciais?.tema ?? "sistema";
  const movimento = prefsIniciais?.movimento ?? "sistema";
  const reduzido = movimento === "reduzido" || (movimento === "sistema" && sistemaReduzido);

  const carta: CartaPerfil = useMemo(
    () => ({
      id: "convite",
      tipo: "perfil",
      titulo: nome.trim() || c.carta.nomeVazio,
      frase: c.carta.frase,
      imagem: null,
      identificacao: {
        colecao: c.carta.colecao,
        edicao: c.carta.edicao,
        numero: codigo.trim() ? codigo.trim().toUpperCase().slice(0, 8) : c.carta.numeroVazio,
      },
      verso: {
        momento: c.carta.momento,
        repertorio: [c.carta.repertorio],
        praca: c.carta.praca,
        disponibilidade: c.carta.disponibilidade,
        lastro: c.carta.lastro,
      },
    }),
    [nome, codigo],
  );

  const comecar = () => {
    atualizarMemoria({
      nome: nome.trim(),
      codigo: codigo.trim(),
      escolhas: null,
      demonstracao: false,
      ajustes: {},
      descartadas: [],
    });
    router.push("/universo");
  };

  const demonstracao = () => {
    atualizarMemoria({ nome: nome.trim(), codigo: codigo.trim() });
    router.push("/universo?demo=1");
  };

  return (
    <div
      className={`${s.app} ${s.paginaRolavel}`}
      data-adaptativo=""
      data-tema={tema === "sistema" ? undefined : tema}
      data-movimento={reduzido ? "reduzido" : movimento}
    >
      {/* O fio de assinatura: entra por uma margem e sai pela outra, nunca fecha. */}
      <FioAssinatura
        className="pointer-events-none absolute inset-x-0 top-[38%] h-[120px] w-full stroke-textoMudo [stroke-width:0.35]"
        quadro={{ largura: 160, altura: 30 }}
        altura={16}
        inclinacao={-0.06}
        escala={2.2}
      />
      <main className="relative mx-auto grid w-full max-w-[1040px] gap-xl px-md py-xl md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:items-center md:gap-section md:py-section">
        <div className="order-2 md:order-1">
          <p className="text-style-label-caps text-textoCorpo">{c.rotulo}</p>
          <h1 className={`${s.tituloConvite} mt-sm`}>{c.titulo}</h1>
          <p className={`${s.subtituloConvite} mt-xs text-textoCorpo`}>{c.subtitulo}</p>
          <p className="text-style-body-lg mt-md max-w-[520px] text-textoCorpo">{c.explicacao}</p>

          <form
            className="mt-lg grid max-w-[420px] gap-md"
            onSubmit={(e) => {
              e.preventDefault();
              comecar();
            }}
          >
            <label htmlFor={idNome} className="grid gap-xs">
              <span className="text-style-ui">{c.campoNome}</span>
              <input
                id={idNome}
                className={`${s.campo} text-style-body-md`}
                value={nome}
                maxLength={LIMITE_NOME}
                autoComplete="name"
                placeholder={c.placeholderNome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
            <label htmlFor={idCodigo} className="grid gap-xs">
              <span className="text-style-ui">{c.campoCodigo}</span>
              <input
                id={idCodigo}
                className={`${s.campo} text-style-body-md`}
                value={codigo}
                maxLength={16}
                autoComplete="off"
                placeholder={c.placeholderCodigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </label>
            <p className="text-style-body-md text-textoCorpo">{c.privacidade}</p>
            <div className="flex flex-wrap gap-xs">
              <button type="submit" className={`${s.botao} ${s.contorno}`}>
                {c.comecar}
              </button>
              <button type="button" className={s.botao} onClick={demonstracao}>
                {c.demonstracao}
              </button>
            </div>
          </form>
          <p className="text-style-label-caps mt-xl text-textoCorpo">{c.assinatura}</p>
        </div>

        <div className="order-1 mx-auto w-full max-w-[300px] md:order-2 md:max-w-[360px]">
          <FeelIDCard
            carta={carta}
            acabamento="reluzente"
            virada={virada}
            onViradaChange={setVirada}
          />
          <p className="text-style-body-md mt-sm text-center text-textoCorpo">{c.dicaCarta}</p>
        </div>
      </main>
    </div>
  );
}
