"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import {
  curvaSaida,
  interpolarCamera,
  limitarZoom,
  zoomNoPonto,
  type Camera,
  type Ponto,
} from "@/lib/universo/camera";
import { nivelInicial, proximoNivel, type NivelSemantico } from "@/lib/universo/zoomSemantico";

// A câmera escreve direto no DOM: um único `transform` no mundo e a variável
// --k (escala) para quem precisa compensar (rótulos). O React só re-renderiza
// quando o nível semântico muda — pan e zoom não passam pelo React.

const DURACAO_FOCO_MS = 520;

export interface ApiCamera {
  camera: RefObject<Camera>;
  nivel: NivelSemantico;
  definir: (c: Camera, opcoes?: { animar?: boolean }) => void;
  zoomPor: (fator: number, foco?: Ponto) => void;
  cancelarAnimacao: () => void;
  tamanho: RefObject<{ largura: number; altura: number }>;
}

export function useCameraUniverso(
  viewport: RefObject<HTMLElement | null>,
  mundo: RefObject<HTMLElement | null>,
  { reduzido, ativo }: { reduzido: boolean; ativo: boolean },
): ApiCamera {
  const camera = useRef<Camera>({ x: 0, y: 0, k: 1 });
  const tamanho = useRef({ largura: 0, altura: 0 });
  const animacao = useRef<number | null>(null);
  const nivelRef = useRef<NivelSemantico>("contexto");
  const [nivel, setNivel] = useState<NivelSemantico>("contexto");
  const iniciado = useRef(false);

  const aplicar = useCallback(
    (c: Camera) => {
      camera.current = c;
      const el = mundo.current;
      if (el) {
        el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.k})`;
        el.style.setProperty("--k", String(c.k));
      }
      const proximo = iniciado.current ? proximoNivel(nivelRef.current, c.k) : nivelInicial(c.k);
      iniciado.current = true;
      if (proximo !== nivelRef.current) {
        nivelRef.current = proximo;
        setNivel(proximo);
      }
    },
    [mundo],
  );

  const cancelarAnimacao = useCallback(() => {
    if (animacao.current != null) cancelAnimationFrame(animacao.current);
    animacao.current = null;
  }, []);

  const definir = useCallback(
    (alvo: Camera, opcoes: { animar?: boolean } = {}) => {
      cancelarAnimacao();
      const destino = { ...alvo, k: limitarZoom(alvo.k) };
      if (!opcoes.animar || reduzido) {
        aplicar(destino);
        return;
      }
      const origem = camera.current;
      const centro = { x: tamanho.current.largura / 2, y: tamanho.current.altura / 2 };
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / DURACAO_FOCO_MS);
        aplicar(interpolarCamera(origem, destino, curvaSaida(t), centro));
        animacao.current = t < 1 ? requestAnimationFrame(passo) : null;
      };
      animacao.current = requestAnimationFrame(passo);
    },
    [aplicar, cancelarAnimacao, reduzido],
  );

  const zoomPor = useCallback(
    (fator: number, foco?: Ponto) => {
      const centro = foco ?? { x: tamanho.current.largura / 2, y: tamanho.current.altura / 2 };
      const c = camera.current;
      const alvo = zoomNoPonto(c, centro, c.k * fator);
      // Botões animam (curto); pinça e roda respondem direto (chamam aplicar via definir sem animar).
      definir(alvo, { animar: !foco });
    },
    [definir],
  );

  // Tamanho do viewport (para centrar zoom e enquadrar). `ativo` refaz a
  // medição quando o canvas monta (ele não existe durante o onboarding nem na lista).
  useEffect(() => {
    const el = viewport.current;
    if (!ativo || !el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      tamanho.current = { largura: r.width, altura: r.height };
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewport, ativo]);

  useEffect(() => cancelarAnimacao, [cancelarAnimacao]);

  return { camera, nivel, definir, zoomPor, cancelarAnimacao, tamanho };
}
