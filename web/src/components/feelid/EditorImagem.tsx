"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { feelidCopy } from "@/content/feelid.pt-BR";
import { VARIANTES, proporcaoMoldura } from "@/data/feelid/geometria";
import type { Enquadramento, TipoCarta } from "@/data/feelid/tipos";
import {
  ENQUADRAMENTO_INICIAL,
  ZOOM_MAX,
  ZOOM_MIN,
  deslocarEnquadramento,
  geometriaImagem,
  limitarEnquadramento,
} from "@/lib/feelid/enquadramento";

export interface ImagemPendente {
  src: string;
  largura: number;
  altura: number;
  descricao: string;
  enquadramento: Enquadramento;
}

interface EditorImagemProps {
  imagem: ImagemPendente | null;
  tipo: TipoCarta;
  aoConfirmar: (enquadramento: Enquadramento) => void;
  aoCancelar: () => void;
  aoTrocar: () => void;
  /** Para onde o foco volta quando o diálogo fecha. */
  focoAoFechar?: () => HTMLElement | null;
}

/** Diálogo de enquadramento. Monta um editor novo a cada imagem. */
export function EditorImagem({
  imagem,
  tipo,
  aoConfirmar,
  aoCancelar,
  aoTrocar,
  focoAoFechar,
}: EditorImagemProps) {
  const c = feelidCopy.editor;
  return (
    <Dialog open={imagem !== null} onOpenChange={(aberto) => !aberto && aoCancelar()}>
      <DialogContent
        className="sm:max-w-[32rem]"
        onCloseAutoFocus={(e) => {
          // O diálogo abre sem gatilho (após escolher arquivo): sem isso o
          // foco cairia no <body>.
          const alvo = focoAoFechar?.();
          if (!alvo) return;
          e.preventDefault();
          alvo.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{c.titulo}</DialogTitle>
          <DialogDescription>{c.descricao}</DialogDescription>
        </DialogHeader>
        {imagem && (
          <Corpo
            key={imagem.src}
            imagem={imagem}
            tipo={tipo}
            aoConfirmar={aoConfirmar}
            aoCancelar={aoCancelar}
            aoTrocar={aoTrocar}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Corpo({
  imagem,
  tipo,
  aoConfirmar,
  aoCancelar,
  aoTrocar,
}: Omit<EditorImagemProps, "imagem"> & { imagem: ImagemPendente }) {
  const c = feelidCopy.editor;
  const proporcao = proporcaoMoldura(tipo);
  const { moldura } = VARIANTES[tipo];
  const [enq, setEnq] = useState(() =>
    limitarEnquadramento(imagem.enquadramento, imagem, proporcao),
  );
  const area = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{ x: number; y: number } | null>(null);

  const g = geometriaImagem(enq, imagem, proporcao);

  const mover = (dx: number, dy: number) => {
    const el = area.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setEnq((atual) =>
      deslocarEnquadramento(atual, imagem, proporcao, { x: dx, y: dy }, {
        largura: r.width,
        altura: r.height,
      }),
    );
  };

  const aproximar = (zoom: number) =>
    setEnq((atual) => limitarEnquadramento({ ...atual, zoom }, imagem, proporcao));

  const aoApontar = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { x: e.clientX, y: e.clientY };
  };
  const aoArrastar = (e: PointerEvent<HTMLDivElement>) => {
    const inicio = arrasto.current;
    if (!inicio) return;
    mover(e.clientX - inicio.x, e.clientY - inicio.y);
    arrasto.current = { x: e.clientX, y: e.clientY };
  };
  const aoSoltar = () => {
    arrasto.current = null;
  };

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const passo = e.shiftKey ? 40 : 8;
    const acoes: Record<string, () => void> = {
      ArrowLeft: () => mover(passo, 0),
      ArrowRight: () => mover(-passo, 0),
      ArrowUp: () => mover(0, passo),
      ArrowDown: () => mover(0, -passo),
      "+": () => aproximar(enq.zoom + 0.1),
      "=": () => aproximar(enq.zoom + 0.1),
      "-": () => aproximar(enq.zoom - 0.1),
    };
    const acao = acoes[e.key];
    if (acao) {
      e.preventDefault();
      acao();
    }
  };

  // Mesmo recorte da carta: proporção e cantos da moldura, em mm relativos.
  const estiloArea = {
    aspectRatio: `${moldura.largura} / ${moldura.altura}`,
    borderRadius: moldura.raios
      .map((r) => `calc(${r} * 100cqw / ${moldura.largura})`)
      .join(" "),
  } as CSSProperties;

  return (
    <>
      <div className="@container w-full">
        <div
          ref={area}
          role="application"
          aria-roledescription={c.areaRotulo}
          aria-label={`${c.areaRotulo}. ${c.areaInstrucoes}`}
          tabIndex={0}
          className="relative w-full cursor-grab touch-none overflow-hidden bg-bone outline-none select-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:cursor-grabbing"
          style={estiloArea}
          onPointerDown={aoApontar}
          onPointerMove={aoArrastar}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          onKeyDown={aoTeclar}
        >
          <img
            src={imagem.src}
            alt={imagem.descricao}
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none"
            style={{
              width: `${g.largura}%`,
              height: `${g.altura}%`,
              left: `${g.esquerda}%`,
              top: `${g.topo}%`,
            }}
          />
          {/* Terços: guia de composição, só no editor. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 [&>span]:border-paper/50 [&>span:nth-child(-n+6)]:border-b [&>span:not(:nth-child(3n))]:border-r"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-xs">
        <div className="flex items-center justify-between">
          <Label htmlFor="feelid-zoom">{c.zoom}</Label>
          <span className="text-style-data text-textBody">{c.zoomValor(enq.zoom)}</span>
        </div>
        <Slider
          id="feelid-zoom"
          aria-label={c.zoom}
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.01}
          value={[enq.zoom]}
          onValueChange={([z]) => aproximar(z)}
        />
      </div>

      <div className="grid gap-sm">
        <div className="-ml-4 flex flex-wrap gap-xs">
          <Button type="button" variant="ghost" onClick={aoTrocar}>
            {c.trocar}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setEnq(limitarEnquadramento(ENQUADRAMENTO_INICIAL, imagem, proporcao))
            }
          >
            {c.centralizar}
          </Button>
        </div>
        <div className="flex flex-wrap justify-end gap-xs">
          <Button type="button" variant="outline" onClick={aoCancelar}>
            {c.cancelar}
          </Button>
          <Button type="button" onClick={() => aoConfirmar(enq)}>
            {c.confirmar}
          </Button>
        </div>
      </div>
    </>
  );
}
