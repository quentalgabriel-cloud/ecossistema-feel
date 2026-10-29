"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { FeelIDCard } from "@/components/feelid/FeelIDCard";
import u from "@/components/universo/universo.module.css";
import { reaisCentavos, trabalhosCopy } from "@/content/trabalhos.pt-BR";
import type { CartaPerfil } from "@/data/feelid/tipos";
import type { Estagio, Funil, Trabalho } from "@/data/trabalhos/tipos";
import { proximoEstagio } from "@/lib/trabalhos/ciclo";
import { clientesParaSePagar, custoPorCliente, lerValor } from "@/lib/trabalhos/economia";

import { GlifoProva } from "./GlifoProva";
import s from "./trabalhos.module.css";

const a = trabalhosCopy.andamento;
const f = trabalhosCopy.encerramento;
const ORDEM: Estagio[] = ["proposta", "aceita", "em_andamento", "entregue"];

/** Passo 4: estágios, próximo passo e o funil medido. */
export function Andamento({
  trabalho: t,
  modo,
  convite,
  aoAvancar,
  aoMedir,
}: {
  trabalho: Trabalho;
  modo: "local" | "remoto";
  /** Na conta, o aceite vem de quem cria, pelo convite (o contratante não marca). */
  convite: React.ReactNode;
  aoAvancar: () => void;
  aoMedir: (f: Funil) => Promise<boolean>;
}) {
  const atual = ORDEM.indexOf(t.estagio);
  const proximo = proximoEstagio(t.estagio);
  const meta = clientesParaSePagar(t.economia.orcamento, t.economia.ticketMedio);
  const custo = custoPorCliente(t.funil);
  const esperaAceite = modo === "remoto" && t.estagio === "proposta";

  return (
    <div>
      <h2 className="text-style-h2">{a.titulo}</h2>
      <ol className={s.estagios} aria-label={a.titulo}>
        {ORDEM.map((e, i) => (
          <li
            key={e}
            className={`${s.estagio} text-style-body-md`}
            data-estado={i < atual || t.estagio === "encerrado" ? "feito" : undefined}
            aria-current={e === t.estagio ? "step" : undefined}
          >
            {a.estagios[e]}
          </li>
        ))}
      </ol>

      {esperaAceite && convite}

      {proximo && a.acoes[t.estagio] && !esperaAceite && (
        <div className={s.destaque}>
          <p className="text-style-label-caps text-textoCorpo">{a.proximo}</p>
          <button type="button" className={`${u.botao} ${u.coral} mt-xs`} onClick={aoAvancar}>
            {a.acoes[t.estagio]}
          </button>
          {modo === "local" && (
            <p className="text-style-body-md mt-xs text-textoCorpo">{a.simulacao}</p>
          )}
        </div>
      )}

      {t.estagio !== "proposta" && (
        <MedicaoFunil funil={t.funil} bloqueado={t.estagio === "encerrado"} aoSalvar={aoMedir} />
      )}

      {(custo != null || (meta != null && t.funil.clientes != null)) && (
        <div className={s.destaque} role="status">
          {custo != null && (
            <>
              <p className={`text-style-ui ${s.numeroGrande}`}>{a.custo(reaisCentavos(custo))}</p>
              <p className="text-style-data mt-xs text-textoCorpo">{a.custoConta}</p>
            </>
          )}
          {meta != null && t.funil.clientes != null && (
            <p className="text-style-body-md mt-xs">{a.meta(t.funil.clientes, meta)}</p>
          )}
        </div>
      )}
    </div>
  );
}

function MedicaoFunil({
  funil,
  bloqueado,
  aoSalvar,
}: {
  funil: Funil;
  bloqueado: boolean;
  aoSalvar: (f: Funil) => Promise<boolean>;
}) {
  const ids = { contatos: useId(), agendados: useId(), clientes: useId(), gasto: useId() };
  const texto = (n: number | null) => (n == null ? "" : String(n).replace(".", ","));
  const [v, setV] = useState({
    contatos: texto(funil.contatos),
    agendados: texto(funil.agendados),
    clientes: texto(funil.clientes),
    gasto: texto(funil.gasto),
  });
  const [msg, setMsg] = useState<string | null>(null);

  const salvar = async () => {
    const inteiro = (t: string) => {
      const n = lerValor(t);
      return n == null ? null : Number.isInteger(n) ? n : NaN;
    };
    const novo: Funil = {
      contatos: inteiro(v.contatos),
      agendados: inteiro(v.agendados),
      clientes: inteiro(v.clientes),
      gasto: lerValor(v.gasto),
    };
    if (Object.values(novo).some((x) => Number.isNaN(x))) {
      setMsg(a.invalido);
      return;
    }
    setMsg((await aoSalvar(novo)) ? a.salvo : trabalhosCopy.erro);
  };

  return (
    <section className="mt-lg" aria-labelledby="funil-titulo">
      <h3 id="funil-titulo" className="text-style-ui">
        {a.funil}
      </h3>
      <p className="text-style-body-md mt-xs text-textoCorpo">{a.funilDica}</p>
      <div className={`${s.grade} ${s.gradeDois}`}>
        {(["contatos", "agendados", "clientes", "gasto"] as const).map((campo) => (
          <label key={campo} htmlFor={ids[campo]} className="grid gap-xs">
            <span className="text-style-body-md">{a.campos[campo]}</span>
            <input
              id={ids[campo]}
              className={`${u.campo} text-style-body-md ${s.numeroGrande}`}
              inputMode={campo === "gasto" ? "decimal" : "numeric"}
              value={v[campo]}
              disabled={bloqueado}
              onChange={(e) => setV({ ...v, [campo]: e.target.value })}
            />
          </label>
        ))}
      </div>
      {!bloqueado && (
        <div className={s.acoesLinha}>
          <button type="button" className={`${u.botao} ${u.contorno}`} onClick={salvar}>
            {a.salvar}
          </button>
        </div>
      )}
      {msg && (
        <p className="text-style-body-md mt-xs" role="status">
          {msg}
        </p>
      )}
    </section>
  );
}

/** Passo 5: veredito contra o critério carimbado, assinaturas, prova. */
export function Encerramento({
  trabalho: t,
  modo,
  pedeEmail,
  nomeNicho,
  carta,
  aoAtualizar,
  aoVeredito,
  aoAssinar,
  aoNovo,
}: {
  trabalho: Trabalho;
  modo: "local" | "remoto";
  /** Formulário de e-mail, quando a sessão anônima tentou assinar. */
  pedeEmail: React.ReactNode;
  nomeNicho: string;
  carta: CartaPerfil;
  aoAtualizar: () => void;
  aoVeredito: (v: string) => void;
  aoAssinar: (lado: "contratante" | "profissional") => void;
  aoNovo: () => void;
}) {
  const idVeredito = useId();
  const [rascunho, setRascunho] = useState(t.veredito ?? "");
  const assinado = !!t.assinaturas.contratante || !!t.assinaturas.profissional;
  const prova = !!t.assinaturas.contratante && !!t.assinaturas.profissional;

  return (
    <div>
      <h2 className="text-style-h2">{f.titulo}</h2>

      {t.acordo && (
        <dl className={s.carimbo}>
          <dt className="text-style-label-caps text-textoCorpo">{f.criterio}</dt>
          <dd className="mt-xs">
            <span className="text-style-label-caps text-textoCorpo">{f.esperamos}: </span>
            <span className="text-style-body-md">{t.acordo.esperamos}</span>
          </dd>
          <dd className="mt-xs">
            <span className="text-style-label-caps text-textoCorpo">{f.erramosSe}: </span>
            <span className="text-style-body-md">{t.acordo.erramosSe}</span>
          </dd>
        </dl>
      )}

      <label htmlFor={idVeredito} className="mt-lg grid gap-xs">
        <span className="text-style-ui">{f.veredito}</span>
        <span className="text-style-body-md text-textoCorpo">{f.vereditoDica}</span>
        <textarea
          id={idVeredito}
          className={`${s.areaTexto} text-style-body-md`}
          value={rascunho}
          maxLength={400}
          disabled={assinado}
          onChange={(e) => setRascunho(e.target.value)}
        />
      </label>
      {!assinado && (
        <div className={s.acoesLinha}>
          <button
            type="button"
            className={`${u.botao} ${t.veredito ? u.contorno : u.coral}`}
            disabled={!rascunho.trim()}
            aria-disabled={!rascunho.trim()}
            onClick={() => aoVeredito(rascunho)}
          >
            {f.salvarVeredito}
          </button>
        </div>
      )}

      {t.veredito && (
        <section className="mt-lg" aria-labelledby="assinaturas-titulo">
          <h3 id="assinaturas-titulo" className="text-style-ui">
            {f.assinaturas}
          </h3>
          <ul className="mt-xs grid gap-xs">
            {(["contratante", "profissional"] as const).map((lado) =>
              t.assinaturas[lado] ? (
                <li key={lado} className="text-style-body-md">
                  {f.assinadoEm(f.lados[lado], t.assinaturas[lado]!)}
                </li>
              ) : null,
            )}
          </ul>
          {!prova && pedeEmail && !t.assinaturas.contratante ? (
            pedeEmail
          ) : !prova ? (
            <div className={s.acoesLinha}>
              {!t.assinaturas.contratante && (
                <button
                  type="button"
                  className={`${u.botao} ${u.coral}`}
                  onClick={() => aoAssinar("contratante")}
                >
                  {f.assinarContratante}
                </button>
              )}
              {modo === "local" && !t.assinaturas.profissional && (
                <button
                  type="button"
                  className={`${u.botao} ${u.contorno}`}
                  onClick={() => aoAssinar("profissional")}
                >
                  {f.simularProfissional}
                </button>
              )}
            </div>
          ) : null}
          {!prova && modo === "local" && (
            <p className="text-style-body-md mt-xs text-textoCorpo">{f.simulacaoProfissional}</p>
          )}
          {!prova && modo === "remoto" && !t.assinaturas.profissional && (
            <p className="text-style-body-md mt-xs text-textoCorpo">
              {f.aguardandoProfissional}{" "}
              <button
                type="button"
                className={`${u.link} text-style-body-md`}
                onClick={aoAtualizar}
              >
                {f.verSeAssinou}
              </button>
            </p>
          )}
        </section>
      )}

      {prova && (
        <section aria-labelledby="prova-titulo">
          <div className={s.prova}>
            <GlifoProva rotulo={f.prova} />
            <div>
              <h3 id="prova-titulo" className="text-style-ui">
                {f.prova}
              </h3>
              <p className="text-style-body-md mt-xs text-textoCorpo">{f.provaDetalhe}</p>
            </div>
          </div>
          <p className="text-style-body-lg mt-lg">{f.noUniverso(nomeNicho)}</p>
          <div className={s.acoesLinha}>
            {/* O coral desta face é o símbolo na carta: o botão fica em contorno. */}
            <Link href="/universo" className={`${u.botao} ${u.contorno}`}>
              {f.verNaRede}
            </Link>
            <button type="button" className={`${u.botao} ${u.contorno}`} onClick={aoNovo}>
              {f.novo}
            </button>
          </div>
          <p className="text-style-label-caps mt-lg text-textoCorpo">{f.carta}</p>
          <div className={s.carta}>
            <FeelIDCard carta={carta} acabamento="fosco" virada />
          </div>
        </section>
      )}
    </div>
  );
}
