import type {
  EstadoVerdade,
  MotivoSugestao,
  Perspectiva,
  TipoEntidade,
} from "@/data/universo/tipos";
import type { NivelSemantico } from "@/lib/universo/zoomSemantico";

// Toda a copy do Meu Universo. Nenhuma string de interface mora no JSX.
// Tom: Handoff Mestre § 20–21 — sugere, não explica; "Apareceu porque…", nunca
// "match de 87%".

const fmt = new Intl.NumberFormat("pt-BR");
export const formatarNumero = (n: number) => fmt.format(n);

const lista = (nomes: string[]) =>
  nomes.length <= 1
    ? (nomes[0] ?? "")
    : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;

export const universoCopy = {
  titulo: "Meu Universo",
  seloDemo: "Demonstração · dados fictícios",
  nucleoPadrao: "Você",

  perspectivas: {
    "meu-universo": "Meu Universo",
    comunidades: "Comunidades",
    descobrir: "Descobrir",
  } satisfies Record<Perspectiva, string>,
  rotuloPerspectiva: "Perspectiva",

  tipos: {
    pessoa: "Pessoa",
    organizacao: "Organização",
    comunidade: "Comunidade",
    interesse: "Interesse",
    habilidade: "Habilidade",
    lugar: "Lugar",
    evento: "Encontro",
    projeto: "Projeto",
    oportunidade: "Oportunidade",
  } satisfies Record<TipoEntidade, string>,

  estados: {
    sugerido: "Sugestão",
    declarado: "Identifico-me",
    em_processo: "Pedido enviado",
    confirmado: "Participando",
    assinado: "Contribuí · prova assinada",
  } satisfies Record<EstadoVerdade, string>,

  estadosExplicacao: {
    sugerido: "A Feel acha que pode ter a ver com você. Não é pertencimento.",
    declarado: "Você disse que isso te representa. Ninguém precisou confirmar.",
    em_processo: "Você pediu para participar. Falta o outro lado responder.",
    confirmado: "A comunidade confirmou sua participação.",
    assinado: "Sua contribuição foi registrada e assinada pelos dois lados.",
  } satisfies Record<EstadoVerdade, string>,

  legenda: {
    abrir: "Como ler",
    fechar: "Fechar legenda",
    titulo: "Como ler o universo",
    estados: "O preenchimento diz o quanto já foi confirmado. A cor nunca muda.",
    peso: "Traço mais grosso = mais provas assinadas.",
    tamanhoUniverso: "Aqui o tamanho não mede nada: cada contexto vale o mesmo.",
    tamanhoComunidades: (teto: number) =>
      `Tamanho = membros confirmados (escala por raiz quadrada, teto em ${formatarNumero(teto)}).`,
    semContagem: "Anel interno = sem contagem confirmada.",
    tamanhoDescobrir: "Aqui a posição não mede afinidade: são sugestões em volta de você.",
  },

  controles: {
    aproximar: "Aproximar",
    afastar: "Afastar",
    recentrar: "Recentrar no Meu Universo",
    lista: "Ver em lista",
    canvas: "Ver no espaço",
    voltar: "Voltar",
    buscar: "Buscar",
    preferencias: "Preferências",
    fecharPainel: "Fechar painel",
  },

  trilha: {
    rotulo: "Onde você está",
  },

  niveis: {
    macro: "visão geral",
    contexto: "contextos",
    detalhe: "detalhe",
  } satisfies Record<NivelSemantico, string>,

  bolha: {
    grupo: (nome: string, n: number) => `${nome}, ${n} ${n === 1 ? "contexto" : "contextos"}`,
    quantidade: (n: number) => `${n} ${n === 1 ? "contexto" : "contextos"}`,
    entidade: (nome: string, tipo: string, estado: string | null, membros: string | null) =>
      [nome, tipo, estado, membros].filter(Boolean).join(", "),
    membros: (n: number) => `${formatarNumero(n)} membros confirmados`,
    membrosCurto: (n: number) => formatarNumero(n),
    semContagem: "sem contagem confirmada",
    nucleo: (nome: string) => `${nome}, centro do seu universo`,
  },

  previa: {
    explorar: "Explorar",
    detalhes: "Ver detalhes",
    fechar: "Fechar prévia",
  },

  painel: {
    rotulo: (nome: string) => `Detalhes de ${nome}`,
    estado: "Sua relação",
    semRelacao: "Nenhuma relação sua com isso ainda.",
    membros: "Membros confirmados",
    contagemEm: (data: string) => `contagem de ${data}`,
    semContagem: "Sem contagem confirmada. Não estimamos.",
    acimaDoTeto: "Acima do teto da escala: o tamanho da bolha para de crescer, o número não.",
    variacao: (p: number) => `${p > 0 ? "+" : ""}${p}% em 30 dias (simulado)`,
    porque: "Apareceu porque…",
    relacionadas: "Também aparece com",
    semRelacionadas: "Ainda sem contextos em comum por aqui.",
    politica: {
      aberta: "Entrada aberta",
      pedido: "Entrada por pedido",
      convite: "Entrada por convite",
    },
    dentroDoGrupo: "Neste agrupamento",
    acoes: {
      identificar: "Identifico-me",
      participar: "Tenho interesse em participar",
      acompanhar: "Acompanhar",
      descartar: "Isso não tem a ver comigo",
      desfazer: "Desfazer",
    },
    simulacao: "Simulação: nada foi enviado a ninguém.",
    feito: {
      identificar: "Anotado: isso te representa. Ninguém precisa confirmar.",
      participar:
        "Pedido registrado (simulação). Fica como “pedido enviado” até a comunidade responder.",
      acompanhar: "Você vai ver o que acontecer por aqui (simulação).",
      descartar: "Sugestão descartada.",
    },
  },

  motivos: {
    interesse_em_comum: (ev: string[]) => `Apareceu porque você tem ${lista(ev)} no seu universo.`,
    contexto_compartilhado: (ev: string[]) => `Apareceu porque acontece perto de ${lista(ev)}.`,
    habilidade_complementar: (ev: string[]) =>
      `Apareceu porque combina com o que você faz: ${lista(ev)}.`,
    objetivo_declarado: (ev: string[]) =>
      `Apareceu porque você disse que quer movimentar ${lista(ev)}.`,
  } satisfies Record<MotivoSugestao, (ev: string[]) => string>,

  comunidades: {
    simular: "Simular 30 dias",
    voltarHoje: "Voltar para hoje",
    simulando: "Mostrando a variação simulada de 30 dias.",
  },

  vazio: {
    descobrir:
      "Ainda não há o que sugerir com segurança. Quanto mais contextos você declarar, mais a Feel consegue explicar uma sugestão.",
    universo: "Seu universo ainda está vazio. Escolha alguns contextos para começar.",
    escolher: "Escolher contextos",
  },

  busca: {
    rotulo: "Buscar no universo",
    placeholder: "Comunidade, interesse, lugar…",
    irAte: "Ir até",
    semResultado: (q: string) => `Nada com “${q}” por aqui.`,
    fechar: "Fechar busca",
  },

  preferencias: {
    titulo: "Preferências",
    tema: "Aparência",
    temas: { sistema: "Seguir o aparelho", claro: "Claro", escuro: "Escuro" },
    movimento: "Movimento",
    movimentos: { sistema: "Seguir o aparelho", reduzido: "Reduzido", completo: "Completo" },
    reiniciar: "Recomeçar do convite",
    fechar: "Fechar preferências",
  },

  anuncios: {
    foco: (nome: string) => `${nome} em foco.`,
    voltou: (nome: string) => `De volta a ${nome}.`,
    recentrado: "Meu Universo recentrado.",
    nivel: (n: string) => `Zoom: ${n}.`,
    perspectiva: (p: string) => `Perspectiva ${p}.`,
  },

  lista: {
    titulo: "Tudo em lista",
    descricao: "As mesmas entidades do espaço, sem gesto nenhum.",
    abrir: "Ver detalhes",
  },

  erro: {
    titulo: "Não deu para montar o universo agora.",
    acao: "Tentar de novo",
  },

  carregando: "Desenhando o universo…",
} as const;

export const onboardingCopy = {
  titulo: "O que faz parte do seu universo?",
  subtitulo: "Explore interesses, comunidades e possibilidades a partir do que importa para você.",
  instrucao: "Escolha três ou mais. Dá para mudar depois.",
  contador: (n: number) =>
    n === 0 ? "Nada escolhido ainda" : `${n} ${n === 1 ? "escolha" : "escolhas"}`,
  faltam: (n: number) => `Falta${n === 1 ? "" : "m"} ${n} para um universo mais rico.`,
  continuar: "Ver meu universo",
  pular: "Pular e explorar a demonstração",
  aviso: "Escolher aqui não te coloca em nenhuma comunidade. É só o que te representa.",
  rotuloGrupo: (nome: string) => `Contextos de ${nome}`,
} as const;
