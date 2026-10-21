import type { CartaPerfil } from "./tipos";

// Carta da demonstração. Não há pessoa real aqui: todo dado de perfil fica em
// [COLCHETES] até existir dado de verdade — número inventado é bug (AGENTS.md).

export const cartaPerfilDemo: CartaPerfil = {
  id: "demo-perfil",
  tipo: "perfil",
  titulo: "[Nome da pessoa]",
  frase: "[Uma frase curta de apresentação, na voz dela]",
  imagem: null,
  identificacao: {
    colecao: "[Coleção]",
    edicao: "[01]",
    numero: "[000]",
  },
  verso: {
    momento: "[O que quer ativar agora]",
    repertorio: ["[Capacidade]", "[Capacidade]", "[Capacidade]"],
    praca: "[Bairro · Cidade]",
    disponibilidade: "[Aberta a projetos a partir de …]",
    lastro: "[N] provas assinadas",
  },
};
