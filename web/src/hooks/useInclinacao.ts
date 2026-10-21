"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

// Inclinação da carta. Escreve variáveis CSS direto no elemento (sem
// re-render do React a cada movimento do ponteiro):
//   --rx / --ry  rotação em graus
//   --lx / --ly  posição da luz, 0–1 sobre a carta
//   --luz        intensidade do reflexo, 0–1
// O CSS só anima transform e opacity a partir delas.

const INCLINACAO_MAX = 9;
const PASSO_TECLADO = 0.12;
/** Arrasto acima disso (px) não conta como toque para virar. */
const LIMIAR_ARRASTO = 8;

/** Luz de repouso: a carta parada já mostra o acabamento, sem animação. */
export const LUZ_REPOUSO = { x: 0.3, y: 0.22, intensidade: 0.55 } as const;

interface Estado {
  x: number;
  y: number;
  ativo: boolean;
}

export function useInclinacao(
  alvo: RefObject<HTMLElement | null>,
  { reduzido }: { reduzido: boolean },
) {
  const estado = useRef<Estado>({ x: LUZ_REPOUSO.x, y: LUZ_REPOUSO.y, ativo: false });
  const quadro = useRef<number | null>(null);
  const inicioToque = useRef<{ x: number; y: number } | null>(null);
  const arrastou = useRef(false);

  const aplicar = useCallback(() => {
    quadro.current = null;
    const el = alvo.current;
    if (!el) return;
    const { x, y, ativo } = estado.current;
    const girar = ativo && !reduzido;
    el.style.setProperty("--rx", `${girar ? (0.5 - y) * 2 * INCLINACAO_MAX : 0}`);
    el.style.setProperty("--ry", `${girar ? (x - 0.5) * 2 * INCLINACAO_MAX : 0}`);
    el.style.setProperty("--lx", `${x}`);
    el.style.setProperty("--ly", `${y}`);
    el.style.setProperty("--luz", `${ativo ? 1 : LUZ_REPOUSO.intensidade}`);
    el.dataset.inclinacao = ativo ? "ativa" : "repouso";
  }, [alvo, reduzido]);

  const agendar = useCallback(() => {
    if (quadro.current === null) quadro.current = requestAnimationFrame(aplicar);
  }, [aplicar]);

  const repousar = useCallback(() => {
    estado.current = { x: LUZ_REPOUSO.x, y: LUZ_REPOUSO.y, ativo: false };
    agendar();
  }, [agendar]);

  const apontar = useCallback(
    (clientX: number, clientY: number) => {
      const el = alvo.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      estado.current = {
        x: Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
        ativo: true,
      };
      agendar();
    },
    [alvo, agendar],
  );

  /** Teclado: desloca a luz/inclinação em passos, mantendo a pose. */
  const empurrar = useCallback(
    (dx: number, dy: number) => {
      const atual = estado.current;
      estado.current = {
        x: Math.min(1, Math.max(0, (atual.ativo ? atual.x : 0.5) + dx * PASSO_TECLADO)),
        y: Math.min(1, Math.max(0, (atual.ativo ? atual.y : 0.5) + dy * PASSO_TECLADO)),
        ativo: true,
      };
      agendar();
    },
    [agendar],
  );

  // Reaplica quando a preferência de movimento muda.
  useEffect(() => {
    agendar();
    return () => {
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
      quadro.current = null;
    };
  }, [agendar]);

  const handlers = {
    onPointerMove(e: React.PointerEvent) {
      if (e.pointerType === "touch") {
        const inicio = inicioToque.current;
        if (!inicio) return;
        if (Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > LIMIAR_ARRASTO) {
          arrastou.current = true;
        }
      }
      apontar(e.clientX, e.clientY);
    },
    onPointerDown(e: React.PointerEvent) {
      arrastou.current = false;
      if (e.pointerType === "touch") {
        inicioToque.current = { x: e.clientX, y: e.clientY };
        apontar(e.clientX, e.clientY);
      }
    },
    onPointerUp(e: React.PointerEvent) {
      if (e.pointerType === "touch") {
        inicioToque.current = null;
        repousar();
      }
    },
    onPointerCancel() {
      inicioToque.current = null;
      repousar();
    },
    onPointerLeave(e: React.PointerEvent) {
      if (e.pointerType !== "touch") repousar();
    },
  };

  return {
    handlers,
    empurrar,
    repousar,
    /** Se o último gesto foi arrasto (para não virar a carta sem querer). */
    foiArrasto: () => arrastou.current,
  };
}
