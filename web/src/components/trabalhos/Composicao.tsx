"use client";

import { useMemo, useState } from "react";

import u from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import type { Composicao as TComposicao, PerfilDemo } from "@/data/trabalhos/tipos";
import type { Entidade } from "@/data/universo/tipos";
import { leituraPares, medianasPorPorte } from "@/lib/trabalhos/compor";

import s from "./trabalhos.module.css";

const c = trabalhosCopy.composicao;
const LIMITE_COMPARAR = 3;

/** Passo 2: quem faz sentido, por quê, e quem ficou de fora. */
export function Composicao({
  composicao,
  perfis,
  porId,
  escolhido,
  ativo,
  aoEscolher,
  aoSeguir,
}: {
  composicao: TComposicao;
  perfis: PerfilDemo[];
  porId: Map<string, Entidade>;
  escolhido: string | null;
  ativo: boolean;
  aoEscolher: (perfilId: string) => void;
  aoSeguir: () => void;
}) {
  const [comparar, setComparar] = useState<string[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const perfilDe = useMemo(() => new Map(perfis.map((p) => [p.id, p])), [perfis]);
  const medianas = useMemo(() => medianasPorPorte(perfis), [perfis]);
  const nomes = (ids: string[]) => ids.map((id) => porId.get(id)?.nome ?? id);

  if (!ativo) {
    const p = escolhido ? perfilDe.get(escolhido) : null;
    return (
      <p className="text-style-body-lg">
        {c.escolhido}: {p ? `${p.nome} ${c.demo}` : "—"}
      </p>
    );
  }

  const alternarComparar = (id: string) => {
    if (comparar.includes(id)) {
      setComparar(comparar.filter((x) => x !== id));
      setAviso(null);
    } else if (comparar.length >= LIMITE_COMPARAR) setAviso(c.limiteComparar);
    else {
      setComparar([...comparar, id]);
      setAviso(null);
    }
  };

  return (
    <div>
      <h2 className="text-style-h2">{c.titulo}</h2>
      <p className="text-style-body-md mt-xs text-textoCorpo">{c.ordem}</p>

      {composicao.incluidos.length === 0 && (
        <p className={`text-style-body-md ${u.aviso}`}>{c.vazio}</p>
      )}

      <ul className={s.listaPerfis}>
        {composicao.incluidos.map((inc) => {
          const p = perfilDe.get(inc.perfilId)!;
          const leitura = leituraPares(p, medianas);
          return (
            <li key={p.id} className={s.cartaoPerfil} data-escolhido={escolhido === p.id}>
              <h3 className="text-style-ui">
                {p.nome} <span className="text-textoCorpo">{c.demo}</span>
              </h3>
              <p className="text-style-data mt-xs text-textoCorpo">
                {c.oficio(p.oficio, p.bairro, p.cidade)}
              </p>
              <p className="text-style-label-caps mt-sm text-textoCorpo">{c.fazSentido}</p>
              <ul className={`${s.motivos} text-style-body-md`}>
                {inc.motivos.map((m, i) => (
                  <li key={i}>{c.motivos(m, nomes)}</li>
                ))}
              </ul>
              {inc.parcial && <p className={`text-style-body-md ${u.aviso}`}>{c.parcial}</p>}
              {inc.verificar && <p className={`text-style-body-md ${u.aviso}`}>{c.verificar}</p>}

              {aberto === p.id && (
                <table className={`${s.tabela} text-style-body-md`}>
                  <caption className="text-style-label-caps text-left text-textoCorpo">
                    {c.decomposicao.titulo}
                  </caption>
                  <tbody>
                    <tr>
                      <th scope="row">{c.decomposicao.nicho}</th>
                      <td>{nomes(p.nichos).join(", ")}</td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.praca}</th>
                      <td>
                        {p.bairro}, {p.cidade}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.pares}</th>
                      <td>{leitura ? c.pares[leitura] : c.naoVerificavel}</td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.constancia}</th>
                      <td>
                        {p.constanciaSemana != null
                          ? c.porSemana(p.constanciaSemana)
                          : c.naoVerificavel}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.provas}</th>
                      <td>{p.provasAssinadas}</td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.faixa}</th>
                      <td>{c.faixa(p.faixaMin, p.faixaMax)}</td>
                    </tr>
                    <tr>
                      <th scope="row">{c.decomposicao.fonte}</th>
                      <td>{c.fontes[p.fonte]}</td>
                    </tr>
                  </tbody>
                </table>
              )}

              <div className={s.acoesLinha}>
                <button
                  type="button"
                  className={`${u.botao} ${u.contorno}`}
                  aria-pressed={escolhido === p.id}
                  onClick={() => aoEscolher(p.id)}
                >
                  {escolhido === p.id ? c.escolhido : c.escolher}
                  <span className={u.vivo}>: {p.nome}</span>
                </button>
                <button
                  type="button"
                  className={`${u.chip} text-style-body-md`}
                  aria-pressed={comparar.includes(p.id)}
                  onClick={() => alternarComparar(p.id)}
                >
                  {c.comparar}
                  <span className={u.vivo}> {p.nome}</span>
                </button>
                <button
                  type="button"
                  className={`${u.link} text-style-body-md`}
                  aria-expanded={aberto === p.id}
                  onClick={() => setAberto(aberto === p.id ? null : p.id)}
                >
                  {aberto === p.id ? c.porQueFechar : c.porQue}
                  <span className={u.vivo}> {p.nome}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {aviso && (
        <p className={`text-style-body-md ${u.aviso}`} role="status">
          {aviso}
        </p>
      )}

      <LadoALado ids={comparar} perfilDe={perfilDe} medianas={medianas} />

      {/* O único coral do passo: seguir com quem foi escolhido. */}
      <div className={s.acoesLinha}>
        <button
          type="button"
          className={`${u.botao} ${u.coral}`}
          disabled={!escolhido}
          aria-disabled={!escolhido}
          onClick={aoSeguir}
        >
          {c.seguir}
        </button>
      </div>
      {!escolhido && <p className="text-style-body-md mt-xs text-textoCorpo">{c.escolhaAlguem}</p>}

      {composicao.excluidos.length > 0 && (
        <section className={s.fora} aria-labelledby="fora-titulo">
          <h3 id="fora-titulo" className="text-style-ui">
            {c.foraTitulo(composicao.excluidos.length)}
          </h3>
          <ul className="mt-xs">
            {composicao.excluidos.map((x) => {
              const p = perfilDe.get(x.perfilId)!;
              return (
                <li key={x.perfilId} className={`${s.foraItem} text-style-body-md`}>
                  <span>
                    {p.nome} <span className="text-textoCorpo">{c.demo}</span>
                  </span>
                  <span className="text-textoCorpo">{c.fora(x.motivo)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function LadoALado({
  ids,
  perfilDe,
  medianas,
}: {
  ids: string[];
  perfilDe: Map<string, PerfilDemo>;
  medianas: ReturnType<typeof medianasPorPorte>;
}) {
  const l = trabalhosCopy.ladoALado;
  const perfis = ids.map((id) => perfilDe.get(id)!);
  return (
    <section className="mt-lg" aria-labelledby="lado-titulo">
      <h3 id="lado-titulo" className="text-style-ui">
        {l.titulo}
      </h3>
      {perfis.length < 2 ? (
        <p className="text-style-body-md mt-xs text-textoCorpo">{l.vazio}</p>
      ) : (
        <div className={s.rolagemTabela}>
          <table className={`${s.tabela} text-style-body-md`}>
            <thead>
              <tr>
                <th scope="col">{l.eixo}</th>
                {perfis.map((p) => (
                  <th key={p.id} scope="col">
                    {p.nome} {c.demo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{c.decomposicao.pares}</th>
                {perfis.map((p) => {
                  const leitura = leituraPares(p, medianas);
                  return <td key={p.id}>{leitura ? c.pares[leitura] : c.naoVerificavel}</td>;
                })}
              </tr>
              <tr>
                <th scope="row">{c.decomposicao.constancia}</th>
                {perfis.map((p) => (
                  <td key={p.id}>
                    {p.constanciaSemana != null
                      ? c.porSemana(p.constanciaSemana)
                      : c.naoVerificavel}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">{c.decomposicao.provas}</th>
                {perfis.map((p) => (
                  <td key={p.id}>{p.provasAssinadas}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">{c.decomposicao.faixa}</th>
                {perfis.map((p) => (
                  <td key={p.id}>{c.faixa(p.faixaMin, p.faixaMax)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">{c.decomposicao.fonte}</th>
                {perfis.map((p) => (
                  <td key={p.id}>{c.fontes[p.fonte]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
