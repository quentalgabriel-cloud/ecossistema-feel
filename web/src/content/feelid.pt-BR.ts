import type { Acabamento, TipoCarta } from "@/data/feelid/tipos";

// Toda a copy do FeelID. Nenhuma string de interface mora no JSX (AGENTS.md).

export const feelidCopy = {
  marca: "FEEL ID",
  tipos: {
    perfil: "Perfil",
    habilidade: "Habilidade",
    lugar: "Lugar",
  } satisfies Record<TipoCarta, string>,

  identificacao: {
    colecao: "Coleção",
    edicao: "Ed.",
    numero: "Nº",
  },

  verso: {
    perfil: {
      momento: "Momento",
      repertorio: "Repertório",
      praca: "Atua em",
      disponibilidade: "Agenda",
      lastro: "Lastro",
    },
    habilidade: {
      descricao: "O que é",
      contextos: "Onde aparece",
      lastro: "Lastro",
    },
    lugar: {
      endereco: "Endereço",
      praca: "Praça",
      usos: "Usos",
      lastro: "Lastro",
    },
  },

  acabamentos: {
    fosco: { nome: "Fosco", descricao: "Impressão sem brilho. Só papel e tinta." },
    reluzente: { nome: "Reluzente", descricao: "Verniz: a luz desliza com a inclinação." },
    holografico: {
      nome: "Holográfico",
      descricao: "Folha de segurança: a trama do fio aparece onde a luz bate.",
    },
  } satisfies Record<Acabamento, { nome: string; descricao: string }>,

  carta: {
    rotuloRegiao: (titulo: string, face: "frente" | "verso") =>
      `Carta FeelID de ${titulo}, ${face === "frente" ? "frente" : "verso"}`,
    descricaoRoleplay: "carta colecionável",
    instrucoes:
      "Enter ou espaço vira a carta. Setas inclinam. Esc volta ao repouso.",
    anuncioFace: (face: "frente" | "verso") =>
      face === "frente" ? "Mostrando a frente" : "Mostrando o verso",
    simbolo: "Símbolo Feel",
  },

  imagem: {
    vaziaRotulo: "Imagem",
    vaziaAcao: "Adicionar imagem",
    vaziaDica: "Foto, ilustração ou outra imagem sua",
    soltarAqui: "Solte para usar esta imagem",
    altPadrao: (titulo: string) => `Imagem escolhida para ${titulo}`,
    erroTipo: "Esse arquivo não é uma imagem. Tente JPG, PNG, WebP ou GIF.",
    erroLeitura: "Não foi possível abrir essa imagem neste navegador.",
  },

  editor: {
    titulo: "Enquadrar imagem",
    descricao:
      "Arraste para posicionar e use o zoom para aproximar. A proporção original da imagem é preservada.",
    areaRotulo: "Área de enquadramento",
    areaInstrucoes: "Setas movem a imagem. Mais e menos ajustam o zoom.",
    zoom: "Zoom",
    zoomValor: (z: number) => `${z.toFixed(1).replace(".", ",")}×`,
    centralizar: "Centralizar",
    trocar: "Trocar imagem",
    cancelar: "Cancelar",
    confirmar: "Confirmar enquadramento",
  },

  demo: {
    titulo: "FeelID",
    subtitulo:
      "Carta de perfil. Incline com o ponteiro, vire para ver o verso, troque a imagem e o acabamento.",
    rotuloAcabamento: "Acabamento",
    virar: "Virar carta",
    verFrente: "Ver frente",
    ajustar: "Ajustar enquadramento",
    adicionar: "Adicionar imagem",
    trocar: "Trocar imagem",
    remover: "Remover imagem",
    rotuloConteudo: "Conteúdo da frente",
    campoNome: "Nome",
    campoFrase: "Frase curta",
    limiteFrase: (n: number, max: number) => `${n}/${max}`,
    dicaToque: "Toque na carta para virar. Arraste de lado para inclinar.",
    sessao:
      "A imagem fica só nesta aba, na memória do navegador. Nada é enviado; ao recarregar a página, ela some.",
  },
} as const;

export const LIMITE_FRASE = 90;
