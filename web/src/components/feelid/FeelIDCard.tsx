"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { feelidCopy } from "@/content/feelid.pt-BR";
import { camposDoVerso } from "@/data/feelid/campos";
import { CARTA_MM, VARIANTES, proporcaoMoldura } from "@/data/feelid/geometria";
import type { Acabamento, Carta, ImagemCarta } from "@/data/feelid/tipos";
import { useInclinacao } from "@/hooks/useInclinacao";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";
import { malhaCicloideDataUri } from "@/lib/feelid/cicloide";
import { geometriaImagem } from "@/lib/feelid/enquadramento";
import { cn } from "@/lib/utils";

import s from "./FeelIDCard.module.css";
import { FioAssinatura, Glifo, Simbolo } from "./Tracos";

const MALHA = malhaCicloideDataUri();
const GRAO = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>",
)}")`;

/** Títulos acima disso descem um degrau de corpo para caber em duas linhas. */
const TITULO_LONGO = 22;

export interface FeelIDCardProps {
  carta: Carta;
  acabamento?: Acabamento;
  /** Controlado: qual face está à vista. Omitido, a carta guarda o próprio estado. */
  virada?: boolean;
  onViradaChange?: (virada: boolean) => void;
  /** Mostra a ação "Adicionar imagem" no espaço reservado. */
  aoSolicitarImagem?: () => void;
  /** Aceita imagem arrastada para a moldura. */
  aoSoltarArquivo?: (arquivo: File) => void;
  /** `false` = objeto estático (sem inclinar nem virar), ex.: catálogo ou impressão. */
  interativa?: boolean;
  className?: string;
}

export function FeelIDCard({
  carta,
  acabamento = "fosco",
  virada: viradaControlada,
  onViradaChange,
  aoSolicitarImagem,
  aoSoltarArquivo,
  interativa = true,
  className,
}: FeelIDCardProps) {
  const [viradaInterna, setViradaInterna] = useState(false);
  const virada = viradaControlada ?? viradaInterna;
  const [anuncio, setAnuncio] = useState("");
  const palco = useRef<HTMLDivElement>(null);
  const reduzido = usePrefereMovimentoReduzido();
  const { handlers, empurrar, repousar, foiArrasto } = useInclinacao(palco, { reduzido });
  const idInstrucoes = useId();

  const virar = useCallback(() => {
    const proxima = !virada;
    if (viradaControlada === undefined) setViradaInterna(proxima);
    onViradaChange?.(proxima);
    setAnuncio(feelidCopy.carta.anuncioFace(proxima ? "verso" : "frente"));
  }, [virada, viradaControlada, onViradaChange]);

  const aoClicar = (e: MouseEvent) => {
    if (!interativa || foiArrasto()) return;
    if ((e.target as HTMLElement).closest("button, a, input, label")) return;
    virar();
  };

  const aoTeclar = (e: KeyboardEvent) => {
    if (!interativa || e.target !== e.currentTarget) return;
    const setas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      virar();
    } else if (e.key in setas) {
      e.preventDefault();
      const [dx, dy] = setas[e.key];
      empurrar(dx, dy);
    } else if (e.key === "Escape") {
      repousar();
    }
  };

  const { moldura } = VARIANTES[carta.tipo];
  const estiloPalco = {
    "--malha": MALHA,
    "--grao": GRAO,
    "--m-x": moldura.x,
    "--m-y": moldura.y,
    "--m-l": moldura.largura,
    "--m-a": moldura.altura,
    "--m-r1": moldura.raios[0],
    "--m-r2": moldura.raios[1],
    "--m-r3": moldura.raios[2],
    "--m-r4": moldura.raios[3],
  } as CSSProperties;

  return (
    <div className={cn(s.raiz, className)}>
      <div
        ref={palco}
        className={s.palco}
        style={estiloPalco}
        data-acabamento={acabamento}
        data-interativa={interativa}
        data-inclinacao="repouso"
        role="group"
        aria-roledescription={feelidCopy.carta.descricaoRoleplay}
        aria-label={feelidCopy.carta.rotuloRegiao(carta.titulo, virada ? "verso" : "frente")}
        aria-describedby={interativa ? idInstrucoes : undefined}
        tabIndex={interativa ? 0 : undefined}
        onKeyDown={aoTeclar}
        onClick={aoClicar}
        {...(interativa ? handlers : {})}
      >
        <div className={s.inclinacao}>
          <div className={s.carta} data-virada={virada}>
            <Frente
              carta={carta}
              acabamento={acabamento}
              oculta={virada}
              aoSolicitarImagem={aoSolicitarImagem}
              aoSoltarArquivo={aoSoltarArquivo}
            />
            <Verso carta={carta} acabamento={acabamento} oculta={!virada} />
          </div>
        </div>
      </div>
      {interativa && (
        <>
          <p id={idInstrucoes} className="sr-only">
            {feelidCopy.carta.instrucoes}
          </p>
          <p className="sr-only" aria-live="polite">
            {anuncio}
          </p>
        </>
      )}
    </div>
  );
}

function Camadas({ acabamento }: { acabamento: Acabamento }) {
  return (
    <>
      {acabamento === "holografico" && (
        <span className={cn(s.camada, s.folha)} aria-hidden>
          <span className={s.folhaFaixas} />
        </span>
      )}
      {acabamento === "holografico" && (
        <span className={s.camada} aria-hidden style={{ overflow: "hidden" }}>
          <span className={s.folhaVarredura} />
        </span>
      )}
      {acabamento !== "fosco" && (
        <span className={s.camada} aria-hidden style={{ overflow: "hidden" }}>
          <span className={s.brilho} />
        </span>
      )}
      <span className={cn(s.camada, s.grao)} aria-hidden />
    </>
  );
}

function Frente({
  carta,
  acabamento,
  oculta,
  aoSolicitarImagem,
  aoSoltarArquivo,
}: {
  carta: Carta;
  acabamento: Acabamento;
  oculta: boolean;
  aoSolicitarImagem?: () => void;
  aoSoltarArquivo?: (arquivo: File) => void;
}) {
  const { glifo } = VARIANTES[carta.tipo];
  const { identificacao: id } = carta;
  const c = feelidCopy;
  return (
    <div className={s.face} aria-hidden={oculta} inert={oculta}>
      <div className={cn(s.cabecalho, s.mono)}>
        <span>{c.marca}</span>
        <span className={s.mudo}>
          {c.identificacao.numero} {id.numero}
        </span>
      </div>

      <div className={s.moldura}>
        {carta.imagem ? (
          <Foto imagem={carta.imagem} carta={carta} />
        ) : (
          <EspacoReservado
            quadro={VARIANTES[carta.tipo].moldura}
            aoSolicitarImagem={aoSolicitarImagem}
            aoSoltarArquivo={aoSoltarArquivo}
          />
        )}
      </div>

      <span className={cn(s.chip, s.mono)}>
        <Glifo tipo={glifo} />
        {c.tipos[carta.tipo]}
      </span>

      <Simbolo className={s.simbolo} rotulo={c.carta.simbolo} />

      <div className={s.info}>
        <p className={s.titulo} data-longo={carta.titulo.length > TITULO_LONGO}>
          {carta.titulo}
        </p>
        <p className={s.frase}>{carta.frase}</p>
        <div className={cn(s.rodape, s.mono)}>
          <span>
            {c.identificacao.colecao} {id.colecao}
          </span>
          <span>
            {c.identificacao.edicao} {id.edicao}
          </span>
        </div>
      </div>

      <Camadas acabamento={acabamento} />
    </div>
  );
}

function Foto({ imagem, carta }: { imagem: ImagemCarta; carta: Carta }) {
  const g = geometriaImagem(imagem.enquadramento, imagem, proporcaoMoldura(carta.tipo));
  return (
    // Object URL local: next/image não otimiza blob:, então <img> direto.
    <img
      className={s.foto}
      src={imagem.src}
      alt={imagem.descricao}
      draggable={false}
      decoding="async"
      style={{
        width: `${g.largura}%`,
        height: `${g.altura}%`,
        left: `${g.esquerda}%`,
        top: `${g.topo}%`,
      }}
    />
  );
}

function EspacoReservado({
  quadro,
  aoSolicitarImagem,
  aoSoltarArquivo,
}: {
  quadro: { largura: number; altura: number };
  aoSolicitarImagem?: () => void;
  aoSoltarArquivo?: (arquivo: File) => void;
}) {
  const [soltando, setSoltando] = useState(false);
  const c = feelidCopy.imagem;
  const arrastavel = aoSoltarArquivo
    ? {
        onDragOver(e: DragEvent) {
          e.preventDefault();
          setSoltando(true);
        },
        onDragLeave() {
          setSoltando(false);
        },
        onDrop(e: DragEvent) {
          e.preventDefault();
          setSoltando(false);
          const arquivo = e.dataTransfer.files[0];
          if (arquivo) aoSoltarArquivo(arquivo);
        },
      }
    : {};
  return (
    <div className={s.vazia} data-soltando={soltando} {...arrastavel}>
      <FioAssinatura
        className={s.vaziaFio}
        quadro={quadro}
        altura={quadro.altura * 0.86}
        inclinacao={-0.16}
        escala={1.4}
      />
      <span className={cn(s.vaziaRotulo, s.mono)}>{soltando ? c.soltarAqui : c.vaziaRotulo}</span>
      {aoSolicitarImagem && (
        <Button
          type="button"
          variant="outline"
          className={cn(s.vaziaAcao, "bg-paper")}
          onClick={aoSolicitarImagem}
        >
          {c.vaziaAcao}
        </Button>
      )}
      <span className={s.vaziaDica}>{c.vaziaDica}</span>
    </div>
  );
}

function Verso({
  carta,
  acabamento,
  oculta,
}: {
  carta: Carta;
  acabamento: Acabamento;
  oculta: boolean;
}) {
  const c = feelidCopy;
  const { identificacao: id } = carta;
  return (
    <div className={cn(s.face, s.verso)} aria-hidden={oculta} inert={oculta}>
      <div className={cn(s.cabecalho, s.mono)}>
        <span>{c.marca}</span>
        <span className={s.mudo}>{c.tipos[carta.tipo]}</span>
      </div>

      <Simbolo className={s.versoSimbolo} rotulo={c.carta.simbolo} />
      <p className={s.versoTitulo}>{carta.titulo}</p>

      <dl className={s.lista}>
        {camposDoVerso(carta).map((campo) => (
          <div key={campo.rotulo} style={{ display: "contents" }}>
            <dt className={s.mono}>{campo.rotulo}</dt>
            <dd>
              {Array.isArray(campo.valor) ? (
                <ul className={s.repertorio}>
                  {campo.valor.map((v, i) => (
                    <li key={`${v}-${i}`}>{v}</li>
                  ))}
                </ul>
              ) : (
                campo.valor
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Assinatura: entra pela margem esquerda, sai pela direita mais alta. */}
      <FioAssinatura className={s.fio} altura={CARTA_MM.altura - 11} inclinacao={-0.09} escala={1.7} />

      <div className={cn(s.versoRodape, s.mono)}>
        <span>
          {c.identificacao.numero} {id.numero}
        </span>
        <span>
          {c.identificacao.colecao} {id.colecao} · {c.identificacao.edicao} {id.edicao}
        </span>
      </div>

      <Camadas acabamento={acabamento} />
    </div>
  );
}
