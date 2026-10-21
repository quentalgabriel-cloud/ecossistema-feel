import { feelidCopy } from "@/content/feelid.pt-BR";

export interface ImagemLida {
  src: string;
  largura: number;
  altura: number;
  nomeArquivo: string;
}

export class ErroImagem extends Error {}

/**
 * Lê um arquivo local como object URL e descobre as dimensões naturais.
 * Nada sai do navegador: a URL vive só enquanto esta aba estiver aberta
 * (ou até `URL.revokeObjectURL`).
 */
export async function lerArquivoImagem(arquivo: File): Promise<ImagemLida> {
  if (!arquivo.type.startsWith("image/")) {
    throw new ErroImagem(feelidCopy.imagem.erroTipo);
  }
  const src = URL.createObjectURL(arquivo);
  const img = new Image();
  img.src = src;
  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(src);
    throw new ErroImagem(feelidCopy.imagem.erroLeitura);
  }
  if (!img.naturalWidth || !img.naturalHeight) {
    URL.revokeObjectURL(src);
    throw new ErroImagem(feelidCopy.imagem.erroLeitura);
  }
  return {
    src,
    largura: img.naturalWidth,
    altura: img.naturalHeight,
    nomeArquivo: arquivo.name,
  };
}

export function liberarImagem(src: string | undefined | null) {
  if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
}
