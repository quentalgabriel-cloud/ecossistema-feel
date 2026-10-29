"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { BarraNucleo } from "@/components/nucleo/BarraNucleo";
import u from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import { perfisDemo } from "@/data/trabalhos/demo";
import type { Acordo, Trabalho } from "@/data/trabalhos/tipos";
import { sessaoAtual, type Sessao } from "@/lib/supabase/sessao";
import {
  acordoDeLinha,
  SELECAO_TRABALHO,
  trabalhoDeLinha,
  type LinhaAcordo,
  type LinhaTrabalho,
} from "@/lib/trabalhos/repositorio";

import { AcordoCarimbado } from "./Acordo";
import { PedirEmail } from "./Conta";
import { GlifoProva } from "./GlifoProva";
import s from "./trabalhos.module.css";

const c = trabalhosCopy;
const r = trabalhosCopy.conviteRecebido;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Previa {
  trabalho: string;
  texto: string;
  praca: string | null;
  souContratante: boolean;
  aceito: boolean;
  acordo: LinhaAcordo;
}

type Estado =
  | { tipo: "carregando" }
  | { tipo: "local" }
  | { tipo: "invalido" }
  | { tipo: "proprio" }
  | { tipo: "previa"; previa: Previa; acordo: Acordo }
  | { tipo: "dentro"; trabalho: Trabalho };

const nomeDoPerfil = (id: string) => perfisDemo.find((p) => p.id === id)?.nome ?? id;

/**
 * O outro lado do trabalho: quem cria abre o link, vê o combinado carimbado antes de
 * aceitar, acompanha e assina. Sem conta (banco sem entrada anônima), explica e para.
 */
export function ConviteRecebido({ token }: { token: string }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const [pedeEmail, setPedeEmail] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const lerTrabalho = useCallback(async (sess: Sessao, id: string) => {
    if (sess.modo !== "remoto") return;
    const { data, error } = await sess.cliente
      .from("feel_trabalhos")
      .select(SELECAO_TRABALHO)
      .eq("id", id)
      .single();
    if (error || !data) setEstado({ tipo: "invalido" });
    else setEstado({ tipo: "dentro", trabalho: trabalhoDeLinha(data as unknown as LinhaTrabalho) });
  }, []);

  const abrir = useCallback(async () => {
    const sess = await sessaoAtual();
    setSessao(sess);
    if (sess.modo !== "remoto") return setEstado({ tipo: "local" });
    if (!UUID.test(token)) return setEstado({ tipo: "invalido" });
    const { data, error } = await sess.cliente.rpc("feel_ver_convite", { p_token: token });
    if (error || !data) return setEstado({ tipo: "invalido" });
    const previa = data as Previa;
    if (previa.souContratante) return setEstado({ tipo: "proprio" });
    if (previa.aceito) return lerTrabalho(sess, previa.trabalho);
    setEstado({ tipo: "previa", previa, acordo: acordoDeLinha(previa.acordo) });
  }, [token, lerTrabalho]);

  useEffect(() => {
    void abrir();
  }, [abrir]);

  const aceitar = async (previa: Previa) => {
    if (sessao?.modo !== "remoto") return;
    const { data, error } = await sessao.cliente.rpc("feel_aceitar_convite", { p_token: token });
    if (error || typeof data !== "string") return setErro(c.erroServidor);
    setErro(null);
    await lerTrabalho(sessao, previa.trabalho);
  };

  const assinar = async (t: Trabalho) => {
    if (sessao?.modo !== "remoto") return;
    if (sessao.anonimo) return setPedeEmail(true);
    const { error } = await sessao.cliente.rpc("feel_assinar", {
      p_trabalho: t.id,
      p_lado: "profissional",
    });
    if (error) {
      if (/e-mail/i.test(error.message)) setPedeEmail(true);
      else setErro(c.erroServidor);
      return;
    }
    setErro(null);
    await lerTrabalho(sessao, t.id);
  };

  return (
    <div className={u.app} data-adaptativo="">
      <header className={u.cabecalho}>
        <BarraNucleo atual="trabalhos" />
        {sessao && (
          <span className={`${u.selo} text-style-label-caps`}>
            {c.selo[sessao.modo === "remoto" ? "remoto" : "local"]}
          </span>
        )}
      </header>

      <main className={s.pagina}>
        <div className={s.coluna}>
          <h1 className="text-style-h2">{r.titulo}</h1>
          <Conteudo
            estado={estado}
            sessao={sessao}
            pedeEmail={pedeEmail}
            aoAceitar={aceitar}
            aoAssinar={assinar}
            aoAtualizar={() => void abrir()}
          />
          {erro && (
            <p className={`text-style-body-md ${u.aviso}`} role="alert">
              {erro}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function Conteudo({
  estado,
  sessao,
  pedeEmail,
  aoAceitar,
  aoAssinar,
  aoAtualizar,
}: {
  estado: Estado;
  sessao: Sessao | null;
  pedeEmail: boolean;
  aoAceitar: (p: Previa) => void;
  aoAssinar: (t: Trabalho) => void;
  aoAtualizar: () => void;
}) {
  const voltar = (
    <Link href="/trabalhos" className={`${u.botao} ${u.contorno} mt-md`}>
      {r.voltar}
    </Link>
  );

  switch (estado.tipo) {
    case "carregando":
      return (
        <p className="text-style-body-md mt-md text-textoCorpo" role="status">
          {r.carregando}
        </p>
      );
    case "local":
    case "invalido":
    case "proprio":
      return (
        <div className="mt-md">
          <p className="text-style-body-lg">{r[estado.tipo]}</p>
          {voltar}
        </div>
      );
    case "previa": {
      const { previa, acordo } = estado;
      return (
        <section className={s.secao} aria-label={r.combinado}>
          <dl className="grid gap-xs">
            <dt className="text-style-label-caps text-textoCorpo">{r.necessidade}</dt>
            <dd className="text-style-body-lg">{previa.texto}</dd>
            {previa.praca && (
              <>
                <dt className="text-style-label-caps text-textoCorpo mt-xs">{r.praca}</dt>
                <dd className="text-style-body-md">{previa.praca}</dd>
              </>
            )}
          </dl>
          <h2 className="text-style-ui mt-lg">{r.combinado}</h2>
          <AcordoCarimbado acordo={acordo} nome={nomeDoPerfil(acordo.perfilId)} />
          <div className={s.destaque}>
            <button
              type="button"
              className={`${u.botao} ${u.coral}`}
              onClick={() => aoAceitar(previa)}
            >
              {r.aceitar}
            </button>
            <p className="text-style-body-md mt-xs text-textoCorpo">{r.aceitarDica}</p>
          </div>
        </section>
      );
    }
    case "dentro": {
      const t = estado.trabalho;
      const prova = t.estagio === "encerrado";
      const podeAssinar = t.estagio === "entregue" && !!t.veredito && !t.assinaturas.profissional;
      return (
        <section className={s.secao} aria-label={r.combinado}>
          <p className="text-style-body-lg">{r.aceito}</p>
          <p className="text-style-body-md mt-xs">
            <span className="text-style-label-caps text-textoCorpo">{r.estagio}: </span>
            {c.andamento.estagios[t.estagio]}
          </p>
          {t.acordo && <AcordoCarimbado acordo={t.acordo} nome={nomeDoPerfil(t.acordo.perfilId)} />}

          {t.veredito && (
            <div className="mt-lg">
              <p className="text-style-label-caps text-textoCorpo">{r.veredito}</p>
              <p className="text-style-body-lg mt-xs">{t.veredito}</p>
            </div>
          )}

          {prova ? (
            <div className={s.prova}>
              <GlifoProva rotulo={c.encerramento.prova} />
              <div>
                <h3 className="text-style-ui">{c.encerramento.prova}</h3>
                <p className="text-style-body-md mt-xs text-textoCorpo">
                  {c.encerramento.provaDetalhe}
                </p>
              </div>
            </div>
          ) : podeAssinar ? (
            pedeEmail && sessao ? (
              <div className="mt-lg">
                <PedirEmail sessao={sessao} voltarPara={window.location.href} />
              </div>
            ) : (
              <div className={s.acoesLinha}>
                <button
                  type="button"
                  className={`${u.botao} ${u.coral} mt-md`}
                  onClick={() => aoAssinar(t)}
                >
                  {r.assinar}
                </button>
              </div>
            )
          ) : (
            <p className="text-style-body-md mt-lg text-textoCorpo">
              {t.assinaturas.profissional ? r.aguardandoContratante : r.aguardandoEntrega}{" "}
              <button
                type="button"
                className={`${u.link} text-style-body-md`}
                onClick={aoAtualizar}
              >
                {r.atualizar}
              </button>
            </p>
          )}
        </section>
      );
    }
  }
}
