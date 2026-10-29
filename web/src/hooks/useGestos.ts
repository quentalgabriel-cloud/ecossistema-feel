"use client";

import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from "react";

import { deslocar, zoomNoPonto, type Camera, type Ponto } from "@/lib/universo/camera";

import type { ApiCamera } from "./useCameraUniverso";

// Gestos do canvas (handoff § 12.3): arrastar o fundo desloca, pinça e roda dão
// zoom em torno do ponto entre os dedos ou do cursor. Um toque só vira arrasto
// depois de um limiar — abaixo dele, o clique chega intacto na bolha. Um gesto
// novo sempre cancela a animação de câmera em curso.

const LIMIAR_ARRASTO = 6;

interface Pinca {
  distancia: number;
  meio: Ponto;
  camera: Camera;
}

export function useGestos(viewport: RefObject<HTMLElement | null>, api: ApiCamera, ativo: boolean) {
  const ponteiros = useRef(new Map<number, Ponto>());
  const inicio = useRef<Ponto | null>(null);
  const ultimo = useRef<Ponto | null>(null);
  const arrastando = useRef(false);
  const pinca = useRef<Pinca | null>(null);
  const suprimirClique = useRef(false);

  const local = (e: { clientX: number; clientY: number }): Ponto => {
    const r = viewport.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const medirPinca = (): Pinca | null => {
    const [a, b] = [...ponteiros.current.values()];
    if (!a || !b) return null;
    return {
      distancia: Math.hypot(a.x - b.x, a.y - b.y),
      meio: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      camera: api.camera.current,
    };
  };

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      api.cancelarAnimacao();
      const p = local(e);
      ponteiros.current.set(e.pointerId, p);
      if (ponteiros.current.size === 1) {
        inicio.current = p;
        ultimo.current = p;
        arrastando.current = false;
      } else if (ponteiros.current.size === 2) {
        pinca.current = medirPinca();
        arrastando.current = true;
        viewport.current?.setPointerCapture(e.pointerId);
      }
    },
    [api],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!ponteiros.current.has(e.pointerId)) return;
      const p = local(e);
      ponteiros.current.set(e.pointerId, p);

      if (ponteiros.current.size >= 2 && pinca.current) {
        const agora = medirPinca();
        if (!agora || pinca.current.distancia === 0) return;
        const base = deslocar(
          pinca.current.camera,
          agora.meio.x - pinca.current.meio.x,
          agora.meio.y - pinca.current.meio.y,
        );
        const k = pinca.current.camera.k * (agora.distancia / pinca.current.distancia);
        api.definir(zoomNoPonto(base, agora.meio, k));
        return;
      }

      if (!inicio.current || !ultimo.current) return;
      if (!arrastando.current) {
        if (Math.hypot(p.x - inicio.current.x, p.y - inicio.current.y) < LIMIAR_ARRASTO) return;
        arrastando.current = true;
        viewport.current?.setPointerCapture(e.pointerId);
      }
      api.definir(deslocar(api.camera.current, p.x - ultimo.current.x, p.y - ultimo.current.y));
      ultimo.current = p;
    },
    [api],
  );

  const terminar = useCallback((e: PointerEvent) => {
    ponteiros.current.delete(e.pointerId);
    if (arrastando.current) suprimirClique.current = true;
    if (ponteiros.current.size < 2) pinca.current = null;
    if (ponteiros.current.size === 1) {
      // Saiu um dedo da pinça: o que ficou continua arrastando dali.
      const [p] = [...ponteiros.current.values()];
      inicio.current = p;
      ultimo.current = p;
    }
    if (ponteiros.current.size === 0) {
      inicio.current = null;
      ultimo.current = null;
      arrastando.current = false;
    }
  }, []);

  /** Clique que encerrou um arrasto não seleciona nada. */
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (suprimirClique.current) {
      suprimirClique.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  // Roda/trackpad: listener não-passivo para poder impedir a rolagem da página.
  useEffect(() => {
    const el = viewport.current;
    if (!ativo || !el) return;
    const roda = (e: WheelEvent) => {
      e.preventDefault();
      api.cancelarAnimacao();
      const linhas = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const delta = e.deltaY * linhas;
      // ctrlKey = pinça no trackpad: mais sensível.
      const fator = Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0015));
      api.zoomPor(fator, local(e));
    };
    el.addEventListener("wheel", roda, { passive: false });
    return () => el.removeEventListener("wheel", roda);
  }, [viewport, ativo, api.zoomPor, api.cancelarAnimacao]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: terminar,
    onPointerCancel: terminar,
    onClickCapture,
  };
}
