import type { Enquadramento } from "@/data/feelid/tipos";

// O enquadramento é guardado em coordenadas da própria imagem (foco x/y em
// 0–1 e zoom ≥ 1 sobre o "cover"). Assim ele é independente do tamanho em que
// a carta é renderizada — tela, editor ou impressão — e a proporção original
// nunca é alterada: largura e altura sempre escalam pelo mesmo fator.

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;

export const ENQUADRAMENTO_INICIAL: Enquadramento = { x: 0.5, y: 0.5, zoom: 1 };

interface Dimensoes {
  largura: number;
  altura: number;
}

/** Largura e altura da imagem em % da moldura, já com o zoom aplicado. */
function tamanhoRelativo(imagem: Dimensoes, proporcaoMoldura: number, zoom: number) {
  const proporcaoImagem = imagem.largura / imagem.altura;
  const cobrePorAltura = proporcaoImagem > proporcaoMoldura;
  const largura = (cobrePorAltura ? (proporcaoImagem / proporcaoMoldura) * 100 : 100) * zoom;
  const altura = (cobrePorAltura ? 100 : (proporcaoMoldura / proporcaoImagem) * 100) * zoom;
  return { largura, altura };
}

function limitar(valor: number, min: number, max: number) {
  return Math.min(max, Math.max(min, valor));
}

/** Garante que a imagem sempre cubra a moldura inteira — sem bordas vazias. */
export function limitarEnquadramento(
  enq: Enquadramento,
  imagem: Dimensoes,
  proporcaoMoldura: number,
): Enquadramento {
  const zoom = limitar(enq.zoom, ZOOM_MIN, ZOOM_MAX);
  const { largura, altura } = tamanhoRelativo(imagem, proporcaoMoldura, zoom);
  const metadeX = 50 / largura;
  const metadeY = 50 / altura;
  return {
    zoom,
    x: limitar(enq.x, metadeX, 1 - metadeX),
    y: limitar(enq.y, metadeY, 1 - metadeY),
  };
}

/** Posição e tamanho da <img> dentro da moldura, em porcentagem. */
export function geometriaImagem(
  enq: Enquadramento,
  imagem: Dimensoes,
  proporcaoMoldura: number,
) {
  const e = limitarEnquadramento(enq, imagem, proporcaoMoldura);
  const { largura, altura } = tamanhoRelativo(imagem, proporcaoMoldura, e.zoom);
  return {
    largura,
    altura,
    esquerda: 50 - e.x * largura,
    topo: 50 - e.y * altura,
  };
}

/** Converte um arrasto em pixels da moldura num novo foco. */
export function deslocarEnquadramento(
  enq: Enquadramento,
  imagem: Dimensoes,
  proporcaoMoldura: number,
  deltaPx: { x: number; y: number },
  molduraPx: { largura: number; altura: number },
): Enquadramento {
  const { largura, altura } = tamanhoRelativo(imagem, proporcaoMoldura, enq.zoom);
  // 1px de arrasto move a imagem 1px: o foco anda no sentido oposto.
  const dx = ((deltaPx.x / molduraPx.largura) * 100) / largura;
  const dy = ((deltaPx.y / molduraPx.altura) * 100) / altura;
  return limitarEnquadramento(
    { ...enq, x: enq.x - dx, y: enq.y - dy },
    imagem,
    proporcaoMoldura,
  );
}
