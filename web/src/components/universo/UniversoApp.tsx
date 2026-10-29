"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BarraNucleo } from "@/components/nucleo/BarraNucleo";
import { EscolhaInteresses } from "@/components/onboarding/EscolhaInteresses";
import { universoCopy } from "@/content/universo.pt-BR";
import { fonteDemo } from "@/data/universo/adaptador";
import type {
  DadosUniverso,
  Entidade,
  EstadoVerdade,
  Perspectiva,
  Relacao,
} from "@/data/universo/tipos";
import { useCameraUniverso } from "@/hooks/useCameraUniverso";
import { useGestos } from "@/hooks/useGestos";
import { usePreferencias } from "@/hooks/usePreferencias";
import { sessaoAtual } from "@/lib/supabase/sessao";
import { registrar } from "@/lib/telemetria";
import { aplicarProvas } from "@/lib/trabalhos/evidencia";
import { lerTrabalhos, provasDe, type ProvaRegistrada } from "@/lib/trabalhos/memoria";
import { caixaDeCirculos, deslocar, enquadrar } from "@/lib/universo/camera";
import { montarCena, relacoesDeEscolhas, type BolhaCena } from "@/lib/universo/cena";
import { raioBolha } from "@/lib/universo/escala";
import { aposAcao } from "@/lib/universo/estadoVerdade";
import type { MapaVagas } from "@/lib/universo/layout";
import { atualizarMemoria, lerMemoria, memoriaVazia, type Memoria } from "@/lib/universo/memoria";
import {
  aplicarRemotas,
  espelharAjuste,
  espelharEscolhas,
  lerRelacoesRemotas,
} from "@/lib/universo/repositorioRelacoes";
import { nivelEfetivo } from "@/lib/universo/zoomSemantico";

import { Bolha } from "./Bolha";
import { Icone } from "./Icones";
import { ListaUniverso } from "./ListaUniverso";
import { PainelContexto, explicarSugestao, type AcaoEntidade } from "./PainelContexto";
import { BuscaUniverso, Legenda, Preferencias } from "./Sobreposicoes";
import s from "./universo.module.css";

const c = universoCopy;

/** A conta da pessoa, quando há sessão (D-19): de onde vêm as provas verificadas. */
interface Conta {
  cliente: Parameters<typeof lerRelacoesRemotas>[0];
  relacoes: Relacao[];
}

/**
 * Carrega a memória do aparelho e os dados (fixtures). Só depois disso monta o
 * universo — assim o servidor e o primeiro render do cliente não divergem.
 */
export function UniversoApp({ demonstracao }: { demonstracao: boolean }) {
  const [memoria, setMemoria] = useState<Memoria | null>(null);
  const [provas, setProvas] = useState<ProvaRegistrada[]>([]);
  const [dados, setDados] = useState<DadosUniverso | null>(null);
  const [conta, setConta] = useState<Conta | null>(null);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(() => {
    setErro(false);
    fonteDemo
      .carregar()
      .then(setDados)
      .catch(() => setErro(true));
  }, []);

  useEffect(() => {
    let m = lerMemoria();
    if (demonstracao && !m.demonstracao)
      m = atualizarMemoria({
        demonstracao: true,
        ajustes: {},
        descartadas: [],
      });
    setMemoria(m);
    setProvas(provasDe(lerTrabalhos()));
    carregar();
    // A conta chega depois, sem segurar o primeiro desenho do universo.
    let vivo = true;
    void sessaoAtual().then(async (sessao) => {
      if (sessao.modo !== "remoto") return;
      const relacoes = await lerRelacoesRemotas(sessao.cliente);
      if (vivo) setConta({ cliente: sessao.cliente, relacoes });
    });
    return () => {
      vivo = false;
    };
  }, [demonstracao, carregar]);

  if (erro) {
    return (
      <div className={s.app} data-adaptativo="">
        <div className={s.centro}>
          <div>
            <p className="text-style-ui">{c.erro.titulo}</p>
            <button type="button" className={`${s.botao} ${s.contorno} mt-md`} onClick={carregar}>
              {c.erro.acao}
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!memoria || !dados) {
    return (
      <div className={s.app} data-adaptativo="">
        <p className={`${s.centro} text-style-body-md text-textoCorpo`} role="status">
          {c.carregando}
        </p>
      </div>
    );
  }
  return <Universo dados={dados} memoriaInicial={memoria} provas={provas} contaDaSessao={conta} />;
}

function Universo({
  dados,
  memoriaInicial,
  provas,
  contaDaSessao,
}: {
  dados: DadosUniverso;
  memoriaInicial: Memoria;
  /** Provas co-assinadas em Trabalhos: voltam para a identidade (evidence loop). */
  provas: ProvaRegistrada[];
  contaDaSessao: Conta | null;
}) {
  const [memoria, setMemoriaEstado] = useState(memoriaInicial);
  // A persona da demonstração é fictícia: nada dela vai para a conta.
  const conta = memoria.demonstracao ? null : contaDaSessao;
  const prefs = usePreferencias({
    tema: memoriaInicial.tema,
    movimento: memoriaInicial.movimento,
  });
  const [perspectiva, setPerspectiva] = useState<Perspectiva>("meu-universo");
  const [modo, setModo] = useState<"canvas" | "lista">("canvas");
  const [simulando, setSimulando] = useState(false);
  const [foco, setFoco] = useState<string | null>(null);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<string | null>(null);
  const [aberto, setAberto] = useState<"legenda" | "busca" | "preferencias" | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");

  const viewport = useRef<HTMLDivElement>(null);
  const mundo = useRef<HTMLDivElement>(null);
  const vagas = useRef<MapaVagas | null>(null);
  const historico = useRef<{ x: number; y: number; k: number }[]>([]);

  const emOnboarding = !memoria.demonstracao && memoria.escolhas === null;
  const canvasAtivo = modo === "canvas" && !emOnboarding;
  const api = useCameraUniverso(viewport, mundo, {
    reduzido: prefs.reduzido,
    ativo: canvasAtivo,
  });
  const gestos = useGestos(viewport, api, canvasAtivo);

  const salvar = useCallback((parcial: Partial<Memoria>) => {
    setMemoriaEstado(atualizarMemoria(parcial));
  }, []);

  // ---------- dados derivados ----------

  const porId = useMemo(() => new Map(dados.entidades.map((e) => [e.id, e])), [dados]);
  const comunidadePorId = useMemo(
    () => new Map(dados.comunidades.map((x) => [x.entidadeId, x])),
    [dados],
  );
  const variacao = useMemo(() => fonteDemo.variacaoSimulada(), []);
  const regras = useMemo(() => fonteDemo.regrasDescoberta(), []);

  const relacoes = useMemo(() => {
    const base: Map<string, Relacao> = memoria.demonstracao
      ? new Map(fonteDemo.relacoesDemonstracao().map((r) => [r.entidadeId, r]))
      : relacoesDeEscolhas(memoria.escolhas ?? []);
    for (const [id, estado] of Object.entries(memoria.ajustes)) {
      if (estado == null) base.delete(id);
      else
        base.set(id, {
          entidadeId: id,
          tipo: base.get(id)?.tipo ?? "identifica_se",
          estado,
          provas: base.get(id)?.provas ?? 0,
        });
    }
    return conta ? aplicarRemotas(base, conta.relacoes) : aplicarProvas(base, provas);
  }, [memoria, provas, conta]);

  const contagens = useMemo(
    () =>
      new Map(
        dados.comunidades.map((x) => [
          x.entidadeId,
          simulando && variacao[x.entidadeId] != null
            ? variacao[x.entidadeId]
            : x.membrosConfirmados,
        ]),
      ),
    [dados, simulando, variacao],
  );
  const reservas = useMemo(
    () =>
      new Map(
        dados.comunidades.map((x) => [
          x.entidadeId,
          Math.max(x.membrosConfirmados ?? 0, variacao[x.entidadeId] ?? 0) || null,
        ]),
      ),
    [dados, variacao],
  );

  const cena = useMemo(
    () =>
      montarCena({
        dados,
        perspectiva,
        relacoes,
        regras,
        descartadas: new Set(memoria.descartadas),
        contagens,
        reservas,
        nomeNucleo: memoria.nome.trim() || c.nucleoPadrao,
        vagasAnteriores: vagas.current,
      }),
    [dados, perspectiva, relacoes, regras, memoria.descartadas, memoria.nome, contagens, reservas],
  );
  useEffect(() => {
    if (cena.perspectiva === "meu-universo") vagas.current = cena.vagas;
  }, [cena]);

  const porBolha = useMemo(() => new Map(cena.bolhas.map((b) => [b.id, b])), [cena]);
  const presentes = useMemo(() => new Set(cena.bolhas.map((b) => b.id)), [cena]);

  // ---------- câmera ----------

  const areaUtil = useCallback(
    (comPainel: boolean) => {
      const t = api.tamanho.current;
      if (!comPainel) return t;
      return t.largura < 768
        ? { largura: t.largura, altura: t.altura * 0.4 }
        : { largura: Math.max(240, t.largura - 400), altura: t.altura };
    },
    [api.tamanho],
  );

  const recentrar = useCallback(
    (animar: boolean) => {
      api.definir(enquadrar(cena.caixa, areaUtil(false), 28, 1.15), { animar });
    },
    [api, cena.caixa, areaUtil],
  );

  const enquadrarBolha = useCallback(
    (b: BolhaCena, fator: number, kMax: number, comPainel: boolean) => {
      api.definir(
        enquadrar(
          caixaDeCirculos([{ x: b.x, y: b.y, r: b.r * fator }]),
          areaUtil(comPainel),
          20,
          kMax,
        ),
        { animar: true },
      );
    },
    [api, areaUtil],
  );

  // Primeiro enquadramento quando o canvas monta, e a cada troca de perspectiva.
  const ultimaPerspectiva = useRef<string | null>(null);
  useEffect(() => {
    if (!canvasAtivo) {
      ultimaPerspectiva.current = null;
      return;
    }
    if (ultimaPerspectiva.current === perspectiva) return;
    const primeira = ultimaPerspectiva.current === null;
    ultimaPerspectiva.current = perspectiva;
    requestAnimationFrame(() => recentrar(!primeira));
  }, [perspectiva, canvasAtivo, recentrar]);

  useEffect(() => {
    registrar("universo_aberto", { demo: memoria.demonstracao });
  }, [memoria.demonstracao]);

  useEffect(() => {
    registrar("nivel_zoom_trocado", { nivel: api.nivel });
  }, [api.nivel]);

  // ---------- navegação ----------

  const limpar = () => {
    setFoco(null);
    setSelecionada(null);
    setDetalhes(null);
    setMensagem(null);
    historico.current = [];
  };

  const explorar = (b: BolhaCena) => {
    if (b.tipo === "grupo") {
      historico.current.push(api.camera.current);
      setFoco(b.grupoId ?? null);
      setSelecionada(null);
      enquadrarBolha(b, 1.08, 2.4, false);
      setAnuncio(c.anuncios.foco(b.nome));
      registrar("contexto_focado", { id: b.id });
    } else if (b.tipo === "entidade") {
      if (perspectiva === "meu-universo" && b.grupoId && foco !== b.grupoId) setFoco(b.grupoId);
      setSelecionada(b.id);
      setDetalhes(b.id);
      setMensagem(null);
      enquadrarBolha(b, 3.2, 2.2, true);
      setAnuncio(c.anuncios.foco(b.nome));
      registrar("detalhes_abertos", { id: b.id });
      if (b.sugestao) registrar("explicacao_sugestao_aberta", { id: b.id });
    }
  };

  const aoSelecionar = (b: BolhaCena) => {
    if (b.tipo === "nucleo") {
      limpar();
      recentrar(true);
      setAnuncio(c.anuncios.recentrado);
      registrar("camera_recentrada");
      return;
    }
    if (selecionada === b.id) {
      explorar(b);
      return;
    }
    setSelecionada(b.id);
    setDetalhes(null);
    registrar("bolha_selecionada", { id: b.id, tipo: b.tipo });
  };

  const voltar = useCallback(() => {
    registrar("navegacao_voltar");
    if (detalhes) {
      setDetalhes(null);
      setMensagem(null);
      return;
    }
    if (foco) {
      setFoco(null);
      setSelecionada(null);
      const anterior = historico.current.pop();
      if (anterior) api.definir(anterior, { animar: true });
      else recentrar(true);
      setAnuncio(c.anuncios.voltou(c.perspectivas[perspectiva]));
      return;
    }
    if (selecionada) setSelecionada(null);
  }, [detalhes, foco, selecionada, api, recentrar, perspectiva]);

  const trocarPerspectiva = (p: Perspectiva) => {
    if (p === perspectiva) return;
    limpar();
    setSimulando(false);
    setPerspectiva(p);
    setAnuncio(c.anuncios.perspectiva(c.perspectivas[p]));
    registrar("perspectiva_trocada", { perspectiva: p });
  };

  const irAte = (b: BolhaCena) => {
    setAberto(null);
    if (modo !== "canvas") setModo("canvas");
    requestAnimationFrame(() => {
      if (b.tipo === "grupo") explorar(b);
      else {
        setSelecionada(b.id);
        setDetalhes(null);
        if (perspectiva === "meu-universo" && b.grupoId) setFoco(b.grupoId);
        enquadrarBolha(b, 3.2, 2.2, false);
        setAnuncio(c.anuncios.foco(b.nome));
      }
    });
  };

  // ---------- ações sobre entidades (simulação local) ----------

  const aoAcao = (acao: AcaoEntidade) => {
    if (!detalhes) return;
    const atual =
      relacoes.get(detalhes)?.estado ?? (perspectiva === "descobrir" ? "sugerido" : null);
    let proximo: EstadoVerdade | null = atual;
    if (acao === "identificar") proximo = aposAcao(atual, "identificar");
    if (acao === "participar") proximo = aposAcao(atual, "participar");
    if (acao === "acompanhar") proximo = atual && atual !== "sugerido" ? atual : "declarado";
    if (acao === "descartar") {
      salvar({ descartadas: [...memoria.descartadas, detalhes] });
      setDetalhes(null);
      setSelecionada(null);
      setAnuncio(c.painel.feito.descartar);
      return;
    }
    salvar({ ajustes: { ...memoria.ajustes, [detalhes]: proximo } });
    if (conta) void espelharAjuste(conta.cliente, detalhes, proximo);
    setMensagem(c.painel.feito[acao]);
    registrar("entidade_salva", { id: detalhes, acao });
  };

  // ---------- teclado ----------

  const aoTeclaViewport = (e: React.KeyboardEvent) => {
    const passo = 60;
    const mapa: Record<string, () => void> = {
      "+": () => api.zoomPor(1.25),
      "=": () => api.zoomPor(1.25),
      "-": () => api.zoomPor(0.8),
      "0": () => recentrar(true),
      ArrowLeft: () => api.definir(deslocar(api.camera.current, passo, 0)),
      ArrowRight: () => api.definir(deslocar(api.camera.current, -passo, 0)),
      ArrowUp: () => api.definir(deslocar(api.camera.current, 0, passo)),
      ArrowDown: () => api.definir(deslocar(api.camera.current, 0, -passo)),
    };
    const f = mapa[e.key];
    if (f && e.target === viewport.current) {
      e.preventDefault();
      f();
    }
  };

  // ---------- onboarding ----------

  if (emOnboarding) {
    return (
      <div
        className={s.app}
        data-adaptativo=""
        data-tema={prefs.tema === "sistema" ? undefined : prefs.tema}
        data-movimento={prefs.reduzido ? "reduzido" : prefs.movimento}
      >
        <Cabecalho nome={memoria.nome} />
        <EscolhaInteresses
          dados={dados}
          aoConcluir={(ids) => {
            salvar({ escolhas: ids });
            if (conta) void espelharEscolhas(conta.cliente, ids);
            registrar("onboarding_concluido", { escolhas: ids.length });
          }}
          aoPular={() => {
            salvar({ demonstracao: true, escolhas: [] });
            registrar("onboarding_concluido", { pulou: true });
          }}
        />
      </div>
    );
  }

  // ---------- render ----------

  const nivel = nivelEfetivo(api.nivel, detalhes ? "detalhe" : foco ? "contexto" : null);
  const bolhaSel = selecionada ? porBolha.get(selecionada) : undefined;
  const entidadeDetalhes = detalhes ? porId.get(detalhes) : undefined;
  const bolhaDetalhes = detalhes ? porBolha.get(detalhes) : undefined;
  const grupoFoco = foco ? dados.grupos.find((g) => g.id === foco) : undefined;
  const destaque = detalhes ?? selecionada;
  const relacionadosAoDestaque = new Set(destaque ? (porId.get(destaque)?.relacionadas ?? []) : []);
  const linhas =
    destaque && porBolha.get(destaque)?.tipo === "entidade"
      ? [...relacionadosAoDestaque].map((id) => porBolha.get(id)).filter((b): b is BolhaCena => !!b)
      : [];
  const origem = destaque ? porBolha.get(destaque) : undefined;

  const recuada = (b: BolhaCena) => {
    if (b.tipo === "nucleo") return !!(foco || detalhes);
    if (detalhes)
      return b.id !== detalhes && !relacionadosAoDestaque.has(b.id) && b.id !== `grupo:${foco}`;
    if (foco) return b.grupoId !== foco;
    return false;
  };

  const temNavegacao = !!(foco || selecionada || detalhes);

  return (
    <div
      className={s.app}
      data-adaptativo=""
      data-tema={prefs.tema === "sistema" ? undefined : prefs.tema}
      data-movimento={prefs.reduzido ? "reduzido" : prefs.movimento}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !aberto) voltar();
      }}
    >
      <Cabecalho
        nome={memoria.nome}
        aoBuscar={() => setAberto(aberto === "busca" ? null : "busca")}
        aoPreferencias={() => setAberto(aberto === "preferencias" ? null : "preferencias")}
      />

      <div className={s.barra}>
        <div className={s.perspectivas} role="group" aria-label={c.rotuloPerspectiva}>
          {(Object.keys(c.perspectivas) as Perspectiva[]).map((p) => (
            <button
              key={p}
              type="button"
              className={`${s.perspectiva} text-style-body-md`}
              aria-pressed={perspectiva === p}
              onClick={() => trocarPerspectiva(p)}
            >
              {c.perspectivas[p]}
            </button>
          ))}
        </div>
        {perspectiva === "comunidades" && (
          <button
            type="button"
            className={`${s.chip} text-style-body-md`}
            aria-pressed={simulando}
            onClick={() => setSimulando(!simulando)}
          >
            {simulando ? c.comunidades.voltarHoje : c.comunidades.simular}
          </button>
        )}
        <button
          type="button"
          className={`${s.botao} text-style-body-md ml-auto`}
          onClick={() => {
            const proximo = modo === "canvas" ? "lista" : "canvas";
            setModo(proximo);
            if (proximo === "lista") registrar("modo_lista_aberto");
          }}
        >
          <Icone nome={modo === "canvas" ? "lista" : "espaco"} />
          {modo === "canvas" ? c.controles.lista : c.controles.canvas}
        </button>
      </div>

      <div className={s.palco}>
        {modo === "lista" ? (
          <ListaUniverso
            bolhas={cena.bolhas}
            grupos={dados.grupos}
            perspectiva={perspectiva}
            porId={porId}
            aoDetalhes={(b) => {
              setSelecionada(b.id);
              setDetalhes(b.id);
              setMensagem(null);
              registrar("detalhes_abertos", { id: b.id, lista: true });
            }}
            aoIrAte={irAte}
          />
        ) : (
          <>
            <div
              ref={viewport}
              className={s.viewport}
              data-nivel={nivel}
              tabIndex={0}
              role="application"
              aria-label={`${c.perspectivas[perspectiva]}: ${c.niveis[nivel]}. Arraste ou use as setas para mover; mais e menos aproximam; zero recentra.`}
              onKeyDown={aoTeclaViewport}
              onClick={(e) => {
                if (e.target === viewport.current || e.target === mundo.current) {
                  setSelecionada(null);
                }
              }}
              {...gestos}
            >
              <div ref={mundo} className={s.mundo}>
                {origem && linhas.length > 0 && (
                  <svg className={s.relacoes} aria-hidden focusable="false">
                    {linhas.map((b) => (
                      <path
                        key={`${origem.id}-${b.id}`}
                        className={s.relacao}
                        d={`M${origem.x} ${origem.y}L${b.x} ${b.y}`}
                        pathLength={1}
                      />
                    ))}
                  </svg>
                )}
                {cena.bolhas.map((b) => (
                  <Bolha
                    key={`${perspectiva}:${b.id}`}
                    bolha={b}
                    raioMax={
                      perspectiva === "comunidades"
                        ? raioBolha(reservas.get(b.id) ?? null)
                        : undefined
                    }
                    perspectiva={perspectiva}
                    selecionada={selecionada === b.id}
                    recuada={recuada(b)}
                    nucleoAceso={!selecionada && !detalhes}
                    aoSelecionar={aoSelecionar}
                  />
                ))}
              </div>
            </div>

            {cena.bolhas.filter((b) => b.tipo === "entidade").length === 0 && (
              <div className={`${s.centro} pointer-events-none`}>
                <p
                  className={`${s.cartao} text-style-body-md pointer-events-auto max-w-[380px] p-md`}
                >
                  {perspectiva === "descobrir" ? c.vazio.descobrir : c.vazio.universo}
                </p>
              </div>
            )}

            {temNavegacao && (
              <nav className={s.trilha} aria-label={c.trilha.rotulo}>
                <button
                  type="button"
                  className={`${s.botaoIcone} ${s.cartao}`}
                  onClick={voltar}
                  aria-label={c.controles.voltar}
                >
                  <Icone nome="voltar" />
                </button>
                <ol className={`${s.trilhaLista} text-style-body-md`}>
                  <li>
                    <button
                      type="button"
                      className={s.trilhaItem}
                      aria-current={!grupoFoco && !entidadeDetalhes ? "location" : undefined}
                      onClick={() => {
                        limpar();
                        recentrar(true);
                        registrar("camera_recentrada");
                      }}
                    >
                      {c.perspectivas[perspectiva]}
                    </button>
                  </li>
                  {grupoFoco && perspectiva === "meu-universo" && (
                    <li className="flex items-center gap-[4px]">
                      <span aria-hidden className="text-textoMudo">
                        ›
                      </span>
                      <button
                        type="button"
                        className={s.trilhaItem}
                        aria-current={!entidadeDetalhes ? "location" : undefined}
                        onClick={() => {
                          setDetalhes(null);
                          const g = porBolha.get(`grupo:${grupoFoco.id}`);
                          if (g) enquadrarBolha(g, 1.08, 2.4, false);
                        }}
                      >
                        {grupoFoco.nome}
                      </button>
                    </li>
                  )}
                  {entidadeDetalhes && (
                    <li className="flex items-center gap-[4px]">
                      <span aria-hidden className="text-textoMudo">
                        ›
                      </span>
                      <span className={s.trilhaItem} aria-current="location">
                        {entidadeDetalhes.nome}
                      </span>
                    </li>
                  )}
                </ol>
              </nav>
            )}

            <div className={s.controles}>
              <button
                type="button"
                className={s.botaoIcone}
                onClick={() => api.zoomPor(1.3)}
                aria-label={c.controles.aproximar}
              >
                <Icone nome="mais" />
              </button>
              <button
                type="button"
                className={s.botaoIcone}
                onClick={() => api.zoomPor(1 / 1.3)}
                aria-label={c.controles.afastar}
              >
                <Icone nome="menos" />
              </button>
              <button
                type="button"
                className={s.botaoIcone}
                onClick={() => {
                  limpar();
                  recentrar(true);
                  setAnuncio(c.anuncios.recentrado);
                  registrar("camera_recentrada");
                }}
                aria-label={c.controles.recentrar}
              >
                <Icone nome="recentrar" />
              </button>
            </div>

            <button
              type="button"
              className={`${s.botao} ${s.legendaBotao} text-style-body-md`}
              aria-expanded={aberto === "legenda"}
              onClick={() => setAberto(aberto === "legenda" ? null : "legenda")}
            >
              {c.legenda.abrir}
            </button>
            {aberto === "legenda" && (
              <Legenda perspectiva={perspectiva} aoFechar={() => setAberto(null)} />
            )}

            {bolhaSel && !detalhes && bolhaSel.tipo !== "nucleo" && (
              <Previa
                bolha={bolhaSel}
                perspectiva={perspectiva}
                porId={porId}
                aoExplorar={() => explorar(bolhaSel)}
                aoFechar={() => setSelecionada(null)}
              />
            )}
          </>
        )}

        {entidadeDetalhes && (
          <PainelContexto
            entidade={entidadeDetalhes}
            estado={
              relacoes.get(entidadeDetalhes.id)?.estado ??
              (bolhaDetalhes?.estado === "sugerido" ? "sugerido" : null)
            }
            provas={relacoes.get(entidadeDetalhes.id)?.provas ?? 0}
            comunidade={comunidadePorId.get(entidadeDetalhes.id)}
            membrosAgora={contagens.get(entidadeDetalhes.id)}
            simulando={simulando}
            sugestao={bolhaDetalhes?.sugestao}
            porId={porId}
            presentes={modo === "canvas" ? presentes : new Set()}
            mensagem={mensagem}
            aoAcao={aoAcao}
            aoIrPara={(id) => {
              const b = porBolha.get(id);
              if (b) explorar(b);
            }}
            aoFechar={() => {
              setDetalhes(null);
              setMensagem(null);
            }}
          />
        )}

        {aberto === "busca" && (
          <BuscaUniverso bolhas={cena.bolhas} aoEscolher={irAte} aoFechar={() => setAberto(null)} />
        )}
        {aberto === "preferencias" && (
          <Preferencias
            tema={prefs.tema}
            movimento={prefs.movimento}
            aoTema={prefs.setTema}
            aoMovimento={prefs.setMovimento}
            aoReiniciar={() => {
              atualizarMemoria(memoriaVazia);
              window.location.assign("/convite");
            }}
            aoFechar={() => setAberto(null)}
          />
        )}
      </div>

      <p className={s.vivo} aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}

function Cabecalho({
  nome,
  aoBuscar,
  aoPreferencias,
}: {
  nome: string;
  aoBuscar?: () => void;
  aoPreferencias?: () => void;
}) {
  return (
    <header className={s.cabecalho}>
      {/* O título continua para leitores de tela; visualmente, o núcleo diz onde se está. */}
      <h1 className={s.vivo}>
        {c.titulo}
        {nome.trim() ? ` · ${nome.trim()}` : ""}
      </h1>
      <BarraNucleo atual="rede" />
      {/* Todo dado desta entrega é fixture: o selo aparece sempre, não só na demonstração. */}
      <span className={`${s.selo} text-style-label-caps`}>{c.seloDemo}</span>
      {aoBuscar && (
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoBuscar}
          aria-label={c.controles.buscar}
        >
          <Icone nome="busca" />
        </button>
      )}
      {aoPreferencias && (
        <button
          type="button"
          className={s.botaoIcone}
          onClick={aoPreferencias}
          aria-label={c.controles.preferencias}
        >
          <Icone nome="ajustes" />
        </button>
      )}
    </header>
  );
}

function Previa({
  bolha: b,
  perspectiva,
  porId,
  aoExplorar,
  aoFechar,
}: {
  bolha: BolhaCena;
  perspectiva: Perspectiva;
  porId: Map<string, Entidade>;
  aoExplorar: () => void;
  aoFechar: () => void;
}) {
  const meta =
    b.tipo === "grupo"
      ? c.bolha.quantidade(b.quantidade ?? 0)
      : [
          b.entidade ? c.tipos[b.entidade.tipo] : null,
          b.estado ? c.estados[b.estado] : null,
          perspectiva === "comunidades"
            ? b.membros == null
              ? c.bolha.semContagem
              : c.bolha.membros(b.membros)
            : null,
        ]
          .filter(Boolean)
          .join(" · ");
  return (
    <section className={`${s.cartao} ${s.previa}`} aria-label={b.nome}>
      <p className="text-style-data text-textoCorpo">{meta}</p>
      <h2 className="text-style-ui mt-xs">{b.nome}</h2>
      {b.grupo && <p className="text-style-body-md mt-xs text-textoCorpo">{b.grupo.descricao}</p>}
      {b.sugestao && (
        <p className="text-style-body-md mt-xs">{explicarSugestao(b.sugestao, porId)}</p>
      )}
      <div className={s.previaAcoes}>
        <button type="button" className={`${s.botao} ${s.coral}`} onClick={aoExplorar}>
          {b.tipo === "grupo" ? c.previa.explorar : c.previa.detalhes}
        </button>
        <button type="button" className={s.botao} onClick={aoFechar}>
          {c.previa.fechar}
        </button>
      </div>
    </section>
  );
}
