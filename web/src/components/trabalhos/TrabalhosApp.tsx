"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BarraNucleo } from "@/components/nucleo/BarraNucleo";
import u from "@/components/universo/universo.module.css";
import { conviteCopy } from "@/content/convite.pt-BR";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import type { CartaPerfil } from "@/data/feelid/tipos";
import { perfisDemo } from "@/data/trabalhos/demo";
import type { Funil, Trabalho } from "@/data/trabalhos/tipos";
import { dadosDemo } from "@/data/universo/demo";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";
import { sessaoAtual, type Sessao } from "@/lib/supabase/sessao";
import { registrar } from "@/lib/telemetria";
import { compor } from "@/lib/trabalhos/compor";
import { portaoAberto } from "@/lib/trabalhos/economia";
import { provasDe, type MemoriaTrabalhos } from "@/lib/trabalhos/memoria";
import {
  repositorioLocal,
  repositorioRemoto,
  type RepositorioTrabalhos,
  type ResultadoRepo,
} from "@/lib/trabalhos/repositorio";
import { lerMemoria, type Memoria } from "@/lib/universo/memoria";

import { AcordoCarimbado, FormularioAcordo } from "./Acordo";
import { Andamento, Encerramento } from "./Andamento";
import { Composicao } from "./Composicao";
import { ConvidarQuemCria, PedirEmail } from "./Conta";
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

/** Na conta da pessoa quando há sessão; senão, neste aparelho (D-19). */
async function abrirRepositorio(): Promise<{
  sessao: Sessao;
  repo: RepositorioTrabalhos;
  mem: MemoriaTrabalhos;
}> {
  const sessao = await sessaoAtual();
  if (sessao.modo === "remoto") {
    const repo = repositorioRemoto(sessao.cliente, sessao, window.location.origin);
    try {
      return { sessao, repo, mem: await repo.carregar() };
    } catch {
      // Banco fora do ar: segue neste aparelho, sem perder a tela.
    }
  }
  return { sessao, repo: repositorioLocal, mem: await repositorioLocal.carregar() };
}

/**
 * O ciclo do negócio (Handoff Mestre § 5 e § 16.3–16.5). Carrega a memória antes de
 * montar, como o Meu Universo, para servidor e cliente não divergirem.
 */
export function TrabalhosApp() {
  const [universo, setUniverso] = useState<Memoria | null>(null);
  const [aberto, setAberto] = useState<{
    sessao: Sessao;
    repo: RepositorioTrabalhos;
    mem: MemoriaTrabalhos;
  } | null>(null);

  useEffect(() => {
    setUniverso(lerMemoria());
    let vivo = true;
    void abrirRepositorio().then((a) => {
      if (!vivo) return;
      setAberto(a.mem.atual ? a : { ...a, mem: { ...a.mem, atual: a.repo.novo(agora()) } });
    });
    return () => {
      vivo = false;
    };
  }, []);

  if (!universo || !aberto?.mem.atual) {
    return (
      <div className={u.app} data-adaptativo="">
        <p className={`${u.centro} text-style-body-md text-textoCorpo`} role="status">
          …
        </p>
      </div>
    );
  }
  return (
    <Fluxo universo={universo} memInicial={aberto.mem} repo={aberto.repo} sessao={aberto.sessao} />
  );
}

function Fluxo({
  universo,
  memInicial,
  repo,
  sessao,
}: {
  universo: Memoria;
  memInicial: MemoriaTrabalhos;
  repo: RepositorioTrabalhos;
  sessao: Sessao;
}) {
  const [mem, setMemEstado] = useState(memInicial);
  const t = mem.atual!;
  const [seguiuPortao, setSeguiuPortao] = useState(!!t.acordo);
  const [escolhido, setEscolhido] = useState<string | null>(t.acordo?.perfilId ?? null);
  const [noAcordo, setNoAcordo] = useState(!!t.acordo);
  const [erro, setErro] = useState<string | null>(null);
  const [pedeEmail, setPedeEmail] = useState(false);
  const ocupado = useRef(false);
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
    repo.guardar(m);
  };
  /** Uma operação por vez: um duplo clique não carimba nem assina duas vezes. */
  const executar = async (op: () => Promise<ResultadoRepo>) => {
    if (ocupado.current) return null;
    ocupado.current = true;
    try {
      const r = await op();
      if (r.ok) {
        setErro(null);
        salvar(r.trabalho);
        return r;
      }
      if (r.erro === "pede_email") setPedeEmail(true);
      else setErro(r.erro === "servidor" ? c.erroServidor : c.erro);
      return null;
    } finally {
      ocupado.current = false;
    }
  };

  // Na conta, o outro lado age em outro aparelho: ao voltar para a aba, relê o trabalho.
  const atualizar = useCallback(async () => {
    if (repo.modo !== "remoto") return;
    try {
      const m = await repo.carregar();
      setMemEstado((agoraMem) =>
        m.atual && m.atual.id === agoraMem.atual?.id ? { ...m, atual: m.atual } : agoraMem,
      );
    } catch {
      // Sem rede: fica o que está na tela.
    }
  }, [repo]);
  useEffect(() => {
    if (repo.modo !== "remoto") return;
    const aoVoltar = () => {
      if (document.visibilityState === "visible") void atualizar();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => document.removeEventListener("visibilitychange", aoVoltar);
  }, [repo, atualizar]);

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
        <span className={`${u.selo} text-style-label-caps`}>{c.selo[repo.modo]}</span>
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
                aoCarimbar={async (d) => {
                  const r = await executar(() =>
                    repo.carimbar(t, { perfilId: perfilEscolhido.id, ...d }, agora()),
                  );
                  if (r) registrar("acordo_carimbado");
                }}
              />
            ) : null,
          )}

          {t.acordo &&
            secao(
              "trabalho",
              <Andamento
                trabalho={t}
                modo={repo.modo}
                convite={
                  perfilEscolhido && (
                    <>
                      <ConvidarQuemCria
                        nome={`${perfilEscolhido.nome} ${c.composicao.demo}`}
                        aoGerar={() => repo.convidar(t)}
                      />
                      <p className="text-style-body-md mt-md text-textoCorpo">
                        {c.andamento.aguardandoAceite}{" "}
                        <button
                          type="button"
                          className={`${u.link} text-style-body-md`}
                          onClick={() => void atualizar()}
                        >
                          {c.andamento.verSeAceitou}
                        </button>
                      </p>
                    </>
                  )
                }
                aoAvancar={() => void executar(() => repo.avancar(t))}
                aoMedir={async (f: Funil) => !!(await executar(() => repo.medir(t, f)))}
              />,
            )}

          {secao(
            "encerramento",
            <Encerramento
              trabalho={t}
              modo={repo.modo}
              pedeEmail={
                pedeEmail && (
                  <PedirEmail sessao={sessao} voltarPara={`${window.location.origin}/trabalhos`} />
                )
              }
              aoAtualizar={() => void atualizar()}
              nomeNicho={porId.get(t.entendimento?.nichos[0] ?? "")?.nome ?? ""}
              carta={carta}
              aoVeredito={(v) => void executar(() => repo.veredito(t, v))}
              aoAssinar={async (lado) => {
                const r = await executar(() => repo.assinar(t, lado, agora()));
                if (r?.ok && r.trabalho.estagio === "encerrado") registrar("prova_assinada");
              }}
              aoNovo={() => {
                salvar(repo.novo(agora()), [...mem.encerrados, t]);
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

          {/* Na conta, depois do acordo o trabalho fica registrado: não há o que descartar. */}
          {(repo.modo === "local" ? t.estagio !== "encerrado" : t.estagio === "rascunho") &&
            (t.texto || t.entendimento) && (
              <button
                type="button"
                className={`${u.link} text-style-body-md mt-xl`}
                onClick={() => {
                  void repo.descartar(t);
                  salvar(repo.novo(agora()));
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
