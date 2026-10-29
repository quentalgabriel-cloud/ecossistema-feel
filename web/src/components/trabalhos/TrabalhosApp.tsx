"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BarraNucleo } from "@/components/nucleo/BarraNucleo";
import u from "@/components/universo/universo.module.css";
import { conviteCopy } from "@/content/convite.pt-BR";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import type { CartaPerfil } from "@/data/feelid/tipos";
import { perfisDemo } from "@/data/trabalhos/demo";
import type { Funil, Trabalho } from "@/data/trabalhos/tipos";
import { dadosDemo } from "@/data/universo/demo";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";
import { registrar } from "@/lib/telemetria";
import {
  assinar,
  avancar,
  carimbarAcordo,
  novoTrabalho,
  registrarFunil,
  registrarVeredito,
  type Resultado,
} from "@/lib/trabalhos/ciclo";
import { compor } from "@/lib/trabalhos/compor";
import { portaoAberto } from "@/lib/trabalhos/economia";
import {
  gravarTrabalhos,
  lerTrabalhos,
  provasDe,
  type MemoriaTrabalhos,
} from "@/lib/trabalhos/memoria";
import { lerMemoria, type Memoria } from "@/lib/universo/memoria";

import { AcordoCarimbado, FormularioAcordo } from "./Acordo";
import { Andamento, Encerramento } from "./Andamento";
import { Composicao } from "./Composicao";
import { Necessidade } from "./Necessidade";
import s from "./trabalhos.module.css";

const c = trabalhosCopy;
type Passo = keyof typeof c.passos;
const PASSOS = Object.keys(c.passos) as Passo[];

const agora = () => new Date().toISOString();

/** Em que passo o trabalho está, derivado do próprio trabalho. */
function passoDe(t: Trabalho, seguiuPortao: boolean): Passo {
  if (t.estagio === "entregue" || t.estagio === "encerrado") return "encerramento";
  if (t.acordo) return "trabalho";
  if (t.entendimento && portaoAberto(t.economia) && seguiuPortao) return "composicao";
  return "necessidade";
}

/**
 * O ciclo do negócio (Handoff Mestre § 5 e § 16.3–16.5). Carrega a memória do
 * aparelho antes de montar, como o Meu Universo, para servidor e cliente não divergirem.
 */
export function TrabalhosApp() {
  const [universo, setUniverso] = useState<Memoria | null>(null);
  const [mem, setMem] = useState<MemoriaTrabalhos | null>(null);

  useEffect(() => {
    setUniverso(lerMemoria());
    const m = lerTrabalhos();
    setMem(m.atual ? m : { ...m, atual: novoTrabalho(`t-${Date.now()}`, agora()) });
  }, []);

  if (!universo || !mem?.atual) {
    return (
      <div className={u.app} data-adaptativo="">
        <p className={`${u.centro} text-style-body-md text-textoCorpo`} role="status">
          …
        </p>
      </div>
    );
  }
  return <Fluxo universo={universo} memInicial={mem} />;
}

function Fluxo({ universo, memInicial }: { universo: Memoria; memInicial: MemoriaTrabalhos }) {
  const [mem, setMemEstado] = useState(memInicial);
  const t = mem.atual!;
  const [seguiuPortao, setSeguiuPortao] = useState(!!t.acordo);
  const [escolhido, setEscolhido] = useState<string | null>(t.acordo?.perfilId ?? null);
  const [noAcordo, setNoAcordo] = useState(!!t.acordo);
  const [erro, setErro] = useState<string | null>(null);
  const sistemaReduzido = usePrefereMovimentoReduzido();
  const reduzido =
    universo.movimento === "reduzido" || (universo.movimento === "sistema" && sistemaReduzido);

  const porId = useMemo(() => new Map(dadosDemo.entidades.map((e) => [e.id, e])), []);
  const composicao = useMemo(
    () => (t.entendimento ? compor(perfisDemo, t.entendimento, t.economia) : null),
    [t.entendimento, t.economia],
  );
  const perfilEscolhido = perfisDemo.find((p) => p.id === (t.acordo?.perfilId ?? escolhido));

  let passo = passoDe(t, seguiuPortao);
  if (passo === "composicao" && noAcordo && escolhido) passo = "acordo";
  const indice = PASSOS.indexOf(passo);

  const salvar = (atual: Trabalho, encerrados = mem.encerrados) => {
    const m = { atual, encerrados };
    setMemEstado(m);
    gravarTrabalhos(m);
  };
  const aplicar = (r: Resultado) => {
    if (r.ok) {
      setErro(null);
      salvar(r.trabalho);
      return true;
    }
    setErro(c.erro);
    return false;
  };

  // Leva a pessoa ao passo novo sem salto brusco (movimento reduzido = sem rolagem animada).
  const secaoAtual = useRef<HTMLElement>(null);
  const passoAnterior = useRef(passo);
  useEffect(() => {
    if (passoAnterior.current === passo) return;
    passoAnterior.current = passo;
    secaoAtual.current?.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    const titulo = secaoAtual.current?.querySelector<HTMLElement>("h2");
    titulo?.setAttribute("tabindex", "-1");
    titulo?.focus({ preventScroll: true });
  }, [passo, reduzido]);

  const provas = provasDe(mem);
  const carta: CartaPerfil = {
    id: "feelid-trabalhos",
    tipo: "perfil",
    titulo: universo.nome.trim() || conviteCopy.carta.nomeVazio,
    frase: conviteCopy.carta.frase,
    imagem: null,
    identificacao: {
      colecao: conviteCopy.carta.colecao,
      edicao: conviteCopy.carta.edicao,
      numero: universo.codigo.trim()
        ? universo.codigo.trim().toUpperCase().slice(0, 8)
        : conviteCopy.carta.numeroVazio,
    },
    verso: {
      momento: conviteCopy.carta.momento,
      repertorio: [conviteCopy.carta.repertorio],
      praca: t.entendimento?.praca ?? conviteCopy.carta.praca,
      disponibilidade: conviteCopy.carta.disponibilidade,
      lastro: conviteCopy.carta.lastroProvas(provas.length),
    },
  };

  const secao = (p: Passo, conteudo: React.ReactNode) =>
    PASSOS.indexOf(p) <= indice ? (
      <section
        key={p}
        ref={p === passo ? secaoAtual : undefined}
        className={s.secao}
        aria-label={c.passos[p]}
      >
        {conteudo}
      </section>
    ) : null;

  return (
    <div
      className={u.app}
      data-adaptativo=""
      data-tema={universo.tema === "sistema" ? undefined : universo.tema}
      data-movimento={reduzido ? "reduzido" : universo.movimento}
    >
      <header className={u.cabecalho}>
        <BarraNucleo atual="trabalhos" />
        <span className={`${u.selo} text-style-label-caps`}>{c.seloDemo}</span>
      </header>

      <main className={s.pagina}>
        <div className={s.coluna}>
          <h1 className="text-style-label-caps text-textoCorpo">{c.titulo}</h1>
          <ol className={`${s.passos} text-style-body-md`} aria-label={c.titulo}>
            {PASSOS.map((p, i) => (
              <li
                key={p}
                className={s.passo}
                data-estado={i < indice || t.estagio === "encerrado" ? "feito" : undefined}
                aria-current={p === passo ? "step" : undefined}
              >
                {c.passos[p]}
                {p === passo && <span className={u.vivo}> ({c.passoAtual})</span>}
              </li>
            ))}
          </ol>

          {secao(
            "necessidade",
            <Necessidade
              texto={t.texto}
              entendimento={t.entendimento}
              economia={t.economia}
              porId={porId}
              ativo={passo === "necessidade"}
              aoMudar={(m) => {
                if (m.entendimento && !t.entendimento) registrar("necessidade_criada");
                salvar({ ...t, ...m });
              }}
              aoSeguir={() => {
                setSeguiuPortao(true);
                registrar("composicao_vista");
              }}
            />,
          )}

          {composicao &&
            secao(
              "composicao",
              <Composicao
                composicao={composicao}
                perfis={perfisDemo}
                porId={porId}
                escolhido={escolhido}
                ativo={passo === "composicao"}
                aoEscolher={setEscolhido}
                aoSeguir={() => setNoAcordo(true)}
              />,
            )}

          {secao(
            "acordo",
            t.acordo && perfilEscolhido ? (
              <AcordoCarimbado acordo={t.acordo} nome={perfilEscolhido.nome} />
            ) : perfilEscolhido ? (
              <FormularioAcordo
                nome={perfilEscolhido.nome}
                prazoInicial={t.entendimento?.prazo ?? ""}
                erro={erro}
                aoCarimbar={(d) => {
                  if (aplicar(carimbarAcordo(t, { perfilId: perfilEscolhido.id, ...d }, agora())))
                    registrar("acordo_carimbado");
                }}
              />
            ) : null,
          )}

          {t.acordo &&
            secao(
              "trabalho",
              <Andamento
                trabalho={t}
                aoAvancar={() => aplicar(avancar(t))}
                aoMedir={(f: Funil) => aplicar(registrarFunil(t, f))}
              />,
            )}

          {secao(
            "encerramento",
            <Encerramento
              trabalho={t}
              nomeNicho={porId.get(t.entendimento?.nichos[0] ?? "")?.nome ?? ""}
              carta={carta}
              aoVeredito={(v) => aplicar(registrarVeredito(t, v))}
              aoAssinar={(lado) => {
                const r = assinar(t, lado, agora());
                if (aplicar(r) && r.ok && r.trabalho.estagio === "encerrado")
                  registrar("prova_assinada");
              }}
              aoNovo={() => {
                salvar(novoTrabalho(`t-${Date.now()}`, agora()), [...mem.encerrados, t]);
                setSeguiuPortao(false);
                setEscolhido(null);
                setNoAcordo(false);
              }}
            />,
          )}

          {erro && (
            <p className={`text-style-body-md ${u.aviso}`} role="alert">
              {erro}
            </p>
          )}

          {t.estagio !== "encerrado" && (t.texto || t.entendimento) && (
            <button
              type="button"
              className={`${u.link} text-style-body-md mt-xl`}
              onClick={() => {
                salvar(novoTrabalho(`t-${Date.now()}`, agora()));
                setSeguiuPortao(false);
                setEscolhido(null);
                setNoAcordo(false);
              }}
            >
              {c.recomecar}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
