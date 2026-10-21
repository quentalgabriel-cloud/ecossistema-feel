import { SIMBOLO_PATH, SIMBOLO_VIEWBOX } from "@/data/feelid/simbolo";
import type { GlifoEntidade } from "@/data/feelid/geometria";
import { CARTA_MM } from "@/data/feelid/geometria";
import { cicloide, tracoCicloide } from "@/lib/feelid/cicloide";

/** O símbolo Feel (os dois laços). Cor = currentColor. */
export function Simbolo({ className, rotulo }: { className?: string; rotulo?: string }) {
  return (
    <svg
      viewBox={SIMBOLO_VIEWBOX}
      className={className}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      focusable="false"
    >
      <path d={SIMBOLO_PATH} fill="currentColor" />
    </svg>
  );
}

// Glifos de entidade (LINGUAGEM.md § 2), gerados da cicloide.
// O laço da curva-mãe se fecha em t ≈ ±1.6: antes disso o arco fica aberto.
const GLIFOS: Record<Exclude<GlifoEntidade, null>, { t0: number; t1: number }> = {
  profissional: { t0: -1.35, t1: 1.35 }, // arco aberto, terminais livres
  espaco: { t0: -2.3, t1: 2.3 }, // o laço completo
};

function caixa(t0: number, t1: number) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i <= 64; i++) {
    const [x, y] = cicloide(t0 + ((t1 - t0) * i) / 64);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}

export function Glifo({ tipo, className }: { tipo: GlifoEntidade; className?: string }) {
  if (!tipo) return null;
  const { t0, t1 } = GLIFOS[tipo];
  const c = caixa(t0, t1);
  const lado = Math.max(c.maxX - c.minX, c.maxY - c.minY);
  // Peso de referência: 2.6px num canvas de 24u.
  const peso = (lado * 2.6) / 24;
  const pad = peso;
  const d = tracoCicloide({ t0, t1, escala: 1, origem: [0, 0], passos: 64 });
  const vb = [
    c.minX - pad - (lado - (c.maxX - c.minX)) / 2,
    c.minY - pad - (lado - (c.maxY - c.minY)) / 2,
    lado + pad * 2,
    lado + pad * 2,
  ]
    .map((n) => n.toFixed(3))
    .join(" ");
  return (
    <svg viewBox={vb} className={className} aria-hidden focusable="false">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={peso}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * O fio de assinatura: uma vez por peça, entra por uma margem e sai pela
 * outra em alturas diferentes — nunca fecha (DESIGN.md § The Fio).
 * Coordenadas em mm sobre a carta inteira.
 */
export function FioAssinatura({
  className,
  altura,
  inclinacao = -0.11,
  escala = 2.6,
  quadro = { largura: CARTA_MM.largura, altura: CARTA_MM.altura },
}: {
  className?: string;
  /** Caixa em mm onde o fio é desenhado (padrão: a carta inteira). */
  quadro?: { largura: number; altura: number };
  /** Altura (mm) em que o fio entra pela margem esquerda. */
  altura: number;
  inclinacao?: number;
  escala?: number;
}) {
  const periodo = 2 * Math.PI * escala;
  const voltas = Math.ceil((quadro.largura + 12) / periodo) + 1;
  const d = tracoCicloide({
    t0: 0,
    t1: voltas * 2 * Math.PI,
    escala,
    origem: [-8, altura],
    inclinacao,
    passos: 120 * voltas,
  });
  return (
    <svg
      viewBox={`0 0 ${quadro.largura} ${quadro.altura}`}
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d={d} pathLength={1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
