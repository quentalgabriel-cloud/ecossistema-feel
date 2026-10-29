"use client";

import { useId, useState } from "react";

import u from "@/components/universo/universo.module.css";
import { trabalhosCopy } from "@/content/trabalhos.pt-BR";
import { pedirEmail } from "@/lib/supabase/sessao";
import type { Sessao } from "@/lib/supabase/sessao";

import s from "./trabalhos.module.css";

const cv = trabalhosCopy.convidar;
const em = trabalhosCopy.email;

/** Depois do carimbo, o contratante manda o link para quem cria. */
export function ConvidarQuemCria({
  nome,
  aoGerar,
}: {
  nome: string;
  aoGerar: () => Promise<string | null>;
}) {
  const id = useId();
  const [link, setLink] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const gerar = async () => {
    const l = await aoGerar();
    setLink(l);
    setMsg(l ? null : cv.falhou);
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link!);
      setMsg(cv.copiado);
    } catch {
      // Sem permissão de área de transferência: o campo já está selecionável.
    }
  };

  return (
    <section className="mt-md" aria-labelledby={`${id}-titulo`}>
      <h3 id={`${id}-titulo`} className="text-style-ui">
        {cv.titulo}
      </h3>
      <p className="text-style-body-md mt-xs text-textoCorpo">{cv.dica(nome)}</p>
      {link ? (
        <div className="mt-xs grid gap-xs">
          <label htmlFor={id} className="text-style-body-md">
            {cv.rotulo}
          </label>
          <input
            id={id}
            className={`${u.campo} text-style-data`}
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className={s.acoesLinha}>
            <button type="button" className={`${u.botao} ${u.contorno}`} onClick={copiar}>
              {cv.copiar}
            </button>
          </div>
        </div>
      ) : (
        <div className={s.acoesLinha}>
          <button type="button" className={`${u.botao} ${u.coral}`} onClick={gerar}>
            {cv.gerar}
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

/** Sessão anônima não assina: liga um e-mail à conta e volta para assinar. */
export function PedirEmail({ sessao, voltarPara }: { sessao: Sessao; voltarPara: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessao.modo !== "remoto") return;
    const r = await pedirEmail(sessao.cliente, email, voltarPara);
    setMsg(r.ok ? em.enviado(email.trim()) : r.erro === "invalido" ? em.invalido : em.falhou);
  };

  return (
    <form
      className={`${s.destaque} grid gap-xs`}
      onSubmit={enviar}
      aria-labelledby={`${id}-titulo`}
    >
      <h4 id={`${id}-titulo`} className="text-style-ui">
        {em.titulo}
      </h4>
      <p className="text-style-body-md text-textoCorpo">{em.dica}</p>
      <label htmlFor={id} className="text-style-body-md">
        {em.rotulo}
      </label>
      <input
        id={id}
        type="email"
        autoComplete="email"
        className={`${u.campo} text-style-body-md`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className={s.acoesLinha}>
        <button type="submit" className={`${u.botao} ${u.coral}`}>
          {em.enviar}
        </button>
      </div>
      {msg && (
        <p className="text-style-body-md" role="status">
          {msg}
        </p>
      )}
    </form>
  );
}
