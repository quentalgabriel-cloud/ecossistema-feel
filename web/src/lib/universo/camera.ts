// Câmera 2D (handoff § 7.1). Convenção única: tela = mundo · k + (x, y).
// Todo gesto, hit test e animação passa por estas duas funções.

export interface Camera {
  x: number;
  y: number;
  k: number;
}

export interface Ponto {
  x: number;
  y: number;
}

export interface Caixa {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const ZOOM_MIN = 0.35;
export const ZOOM_MAX = 3;

export const limitarZoom = (k: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, k));

export function mundoParaTela(c: Camera, p: Ponto): Ponto {
  return { x: p.x * c.k + c.x, y: p.y * c.k + c.y };
}

export function telaParaMundo(c: Camera, p: Ponto): Ponto {
  return { x: (p.x - c.x) / c.k, y: (p.y - c.y) / c.k };
}

/** Zoom mantendo fixo o ponto de tela `foco` (cursor ou meio da pinça). */
export function zoomNoPonto(c: Camera, foco: Ponto, k: number): Camera {
  const kNovo = limitarZoom(k);
  const m = telaParaMundo(c, foco);
  return { x: foco.x - m.x * kNovo, y: foco.y - m.y * kNovo, k: kNovo };
}

export function deslocar(c: Camera, dx: number, dy: number): Camera {
  return { ...c, x: c.x + dx, y: c.y + dy };
}

/** Câmera que enquadra a caixa no viewport, com folga. */
export function enquadrar(
  caixa: Caixa,
  viewport: { largura: number; altura: number },
  folga = 32,
  kMax = 1.4,
): Camera {
  const larguraMundo = Math.max(1, caixa.maxX - caixa.minX);
  const alturaMundo = Math.max(1, caixa.maxY - caixa.minY);
  const kx = (viewport.largura - folga * 2) / larguraMundo;
  const ky = (viewport.altura - folga * 2) / alturaMundo;
  const k = limitarZoom(Math.min(kx, ky, kMax));
  const cx = (caixa.minX + caixa.maxX) / 2;
  const cy = (caixa.minY + caixa.maxY) / 2;
  return { k, x: viewport.largura / 2 - cx * k, y: viewport.altura / 2 - cy * k };
}

export function caixaDeCirculos(circulos: { x: number; y: number; r: number }[]): Caixa {
  if (circulos.length === 0) return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
  return circulos.reduce<Caixa>(
    (c, n) => ({
      minX: Math.min(c.minX, n.x - n.r),
      minY: Math.min(c.minY, n.y - n.r),
      maxX: Math.max(c.maxX, n.x + n.r),
      maxY: Math.max(c.maxY, n.y + n.r),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

/** Interpolação de câmera em espaço de zoom logarítmico — o zoom não "acelera". */
export function interpolarCamera(
  a: Camera,
  b: Camera,
  t: number,
  centro: Ponto = { x: 0, y: 0 },
): Camera {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const k = Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t);
  // Interpola o ponto do mundo que está no centro da tela, não o deslocamento
  // bruto, para a cena não derrapar enquanto o zoom muda.
  const ma = telaParaMundo(a, centro);
  const mb = telaParaMundo(b, centro);
  const mx = ma.x + (mb.x - ma.x) * t;
  const my = ma.y + (mb.y - ma.y) * t;
  return { k, x: centro.x - mx * k, y: centro.y - my * k };
}

/** Saída suave (equivalente a cubic-bezier(0.22, 1, 0.36, 1) para a câmera). */
export const curvaSaida = (t: number) => 1 - Math.pow(1 - t, 4);
