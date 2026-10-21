"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LIMITE_FRASE, feelidCopy } from "@/content/feelid.pt-BR";
import { cartaPerfilDemo } from "@/data/feelid/demo";
import type { Acabamento, CartaPerfil, Enquadramento, ImagemCarta } from "@/data/feelid/tipos";
import { ENQUADRAMENTO_INICIAL } from "@/lib/feelid/enquadramento";
import { ErroImagem, lerArquivoImagem, liberarImagem } from "@/lib/feelid/imagem";

import { EditorImagem, type ImagemPendente } from "./EditorImagem";
import { FeelIDCard } from "./FeelIDCard";

const ACABAMENTOS: Acabamento[] = ["fosco", "reluzente", "holografico"];

type Pendente = ImagemPendente & { nova: boolean };

export function FeelIDDemo() {
  const c = feelidCopy.demo;
  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");
  const [acabamento, setAcabamento] = useState<Acabamento>("reluzente");
  const [virada, setVirada] = useState(false);
  const [imagem, setImagem] = useState<ImagemCarta | null>(null);
  const [pendente, setPendente] = useState<Pendente | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const controleImagem = useRef<HTMLButtonElement>(null);

  // Toda object URL criada aqui é liberada ao sair da página.
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const vivas = urls.current;
    return () => vivas.forEach((u) => liberarImagem(u));
  }, []);
  const liberar = (src: string | undefined) => {
    if (!src) return;
    urls.current.delete(src);
    liberarImagem(src);
  };

  const carta: CartaPerfil = {
    ...cartaPerfilDemo,
    titulo: titulo.trim() || cartaPerfilDemo.titulo,
    frase: frase.trim() || cartaPerfilDemo.frase,
    imagem,
  };

  const solicitarImagem = () => entrada.current?.click();

  const receberArquivo = async (arquivo: File) => {
    setErro(null);
    try {
      const lida = await lerArquivoImagem(arquivo);
      urls.current.add(lida.src);
      setVirada(false);
      // Trocar dentro do editor descarta a imagem nova ainda não confirmada.
      if (pendente?.nova) liberar(pendente.src);
      setPendente({
        src: lida.src,
        largura: lida.largura,
        altura: lida.altura,
        descricao: feelidCopy.imagem.altPadrao(carta.titulo),
        enquadramento: ENQUADRAMENTO_INICIAL,
        nova: true,
      });
    } catch (e) {
      setErro(e instanceof ErroImagem ? e.message : feelidCopy.imagem.erroLeitura);
    }
  };

  const aoEscolher = (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (arquivo) void receberArquivo(arquivo);
  };

  const ajustar = () => {
    if (!imagem) return;
    setVirada(false);
    setPendente({ ...imagem, nova: false });
  };

  const confirmar = (enquadramento: Enquadramento) => {
    if (!pendente) return;
    if (pendente.nova && imagem && imagem.src !== pendente.src) liberar(imagem.src);
    setImagem({
      src: pendente.src,
      largura: pendente.largura,
      altura: pendente.altura,
      descricao: pendente.descricao,
      enquadramento,
      origem: "sessao",
    });
    setPendente(null);
  };

  const cancelar = () => {
    if (pendente?.nova) liberar(pendente.src);
    setPendente(null);
  };

  const remover = () => {
    liberar(imagem?.src);
    setImagem(null);
  };

  return (
    <div className="grid gap-xl md:grid-cols-[minmax(0,420px)_minmax(0,26rem)] md:items-start md:justify-start md:gap-section">
      <div className="mx-auto w-full max-w-[420px] md:sticky md:top-xl md:mx-0">
        <FeelIDCard
          carta={carta}
          acabamento={acabamento}
          virada={virada}
          onViradaChange={setVirada}
          aoSolicitarImagem={solicitarImagem}
          aoSoltarArquivo={(a) => void receberArquivo(a)}
        />
        <p className="text-style-body-md mt-md text-center text-steel md:hidden print:hidden">{c.dicaToque}</p>
      </div>

      <div className="grid w-full max-w-[26rem] gap-xl print:hidden">
        <section className="grid gap-sm" aria-labelledby="feelid-acabamento">
          <h2 id="feelid-acabamento" className="text-style-label-caps text-steel">
            {c.rotuloAcabamento}
          </h2>
          <ToggleGroup
            type="single"
            variant="outline"
            value={acabamento}
            onValueChange={(v) => v && setAcabamento(v as Acabamento)}
            aria-label={c.rotuloAcabamento}
          >
            {ACABAMENTOS.map((a) => (
              <ToggleGroupItem key={a} value={a}>
                {feelidCopy.acabamentos[a].nome}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-style-body-md text-textBody">
            {feelidCopy.acabamentos[acabamento].descricao}
          </p>
        </section>

        <section className="grid gap-sm">
          <Button type="button" variant="outline" className="justify-self-start" onClick={() => setVirada((v) => !v)}>
            {virada ? c.verFrente : c.virar}
          </Button>
        </section>

        <section className="grid gap-sm" aria-labelledby="feelid-imagem">
          <h2 id="feelid-imagem" className="text-style-label-caps text-steel">
            {feelidCopy.imagem.vaziaRotulo}
          </h2>
          <div className="flex flex-wrap gap-xs">
            {imagem ? (
              <>
                <Button ref={controleImagem} type="button" onClick={ajustar}>
                  {c.ajustar}
                </Button>
                <Button type="button" variant="outline" onClick={solicitarImagem}>
                  {c.trocar}
                </Button>
                <Button type="button" variant="ghost" onClick={remover}>
                  {c.remover}
                </Button>
              </>
            ) : (
              <Button ref={controleImagem} type="button" onClick={solicitarImagem}>
                {c.adicionar}
              </Button>
            )}
          </div>
          {erro && (
            <p role="alert" className="text-style-body-md text-ink">
              {erro}
            </p>
          )}
          <p className="text-style-body-md text-steel">{c.sessao}</p>
          <input
            ref={entrada}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={aoEscolher}
          />
        </section>

        <section className="grid gap-md" aria-labelledby="feelid-conteudo">
          <h2 id="feelid-conteudo" className="text-style-label-caps text-steel">
            {c.rotuloConteudo}
          </h2>
          <div className="grid gap-xs">
            <Label htmlFor="feelid-nome">{c.campoNome}</Label>
            <Input
              id="feelid-nome"
              value={titulo}
              maxLength={40}
              placeholder={cartaPerfilDemo.titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="grid gap-xs">
            <div className="flex items-center justify-between">
              <Label htmlFor="feelid-frase">{c.campoFrase}</Label>
              <span className="text-style-data text-steel">
                {c.limiteFrase(frase.length, LIMITE_FRASE)}
              </span>
            </div>
            <Input
              id="feelid-frase"
              value={frase}
              maxLength={LIMITE_FRASE}
              placeholder={cartaPerfilDemo.frase}
              onChange={(e) => setFrase(e.target.value)}
            />
          </div>
        </section>
      </div>

      <EditorImagem
        imagem={pendente}
        tipo="perfil"
        aoConfirmar={confirmar}
        aoCancelar={cancelar}
        aoTrocar={solicitarImagem}
        focoAoFechar={() => controleImagem.current}
      />
    </div>
  );
}
