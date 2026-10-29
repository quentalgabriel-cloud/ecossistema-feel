import type {
  DireitosUso,
  Estagio,
  LeituraPares,
  MotivoDentro,
  MotivoFora,
  Objetivo,
} from "@/data/trabalhos/tipos";

// Toda a copy de Trabalhos. Tom do Handoff Mestre § 21: "Tenho interesse", "Faz
// sentido porque…", nunca "match de 87%". Vocabulário interno (capability,
// composition, engagement) não aparece na interface.

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const brlCentavos = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const num = new Intl.NumberFormat("pt-BR");
export const reais = (n: number) => brl.format(n);
export const reaisCentavos = (n: number) => brlCentavos.format(n);
export const numero = (n: number) => num.format(n);

const lista = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`;

const dataHora = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));

export const trabalhosCopy = {
  titulo: "Trabalhos",
  selo: {
    local: "Demonstração · neste aparelho",
    remoto: "Salvo na sua conta",
  },

  nucleo: { rotulo: "Navegação principal", rede: "Rede", trabalhos: "Trabalhos" },

  passos: {
    necessidade: "O que precisa acontecer",
    composicao: "Quem faz sentido",
    acordo: "O combinado",
    trabalho: "Acontecendo",
    encerramento: "O que voltou",
  },
  passoAtual: "você está aqui",
  rever: "Rever",

  necessidade: {
    titulo: "O que precisa acontecer?",
    subtitulo: "Escreva do seu jeito. A gente organiza.",
    rotulo: "O que você quer movimentar",
    placeholder: "Ex.: quero levar gente pra minha cafeteria no Recife Antigo em dezembro.",
    exemplos: "Usar um exemplo",
    entender: "Entender",
    vazio: "Escreva pelo menos uma frase.",
  },

  entendimento: {
    titulo: "Entendemos assim…",
    porque: (trecho: string) => `por causa de “${trecho}”`,
    campos: { objetivo: "Objetivo", praca: "Praça", nichos: "Para quem", prazo: "Quando" },
    vazio: "—",
    falta: "Falta saber",
    perguntas: {
      objetivo: "O que precisa acontecer?",
      praca: "Em que cidade?",
      nichos: "Que tipo de público você quer alcançar?",
      prazo: "Para quando?",
    },
    corrigir: "Corrigir",
    objetivos: {
      visitas: "Mais gente no lugar",
      lancamento: "Lançamento",
      reconhecimento: "Ser lembrado",
      evento: "Evento",
    } satisfies Record<Objetivo, string>,
    escolherCidade: "Escolher cidade",
    escolherPrazo: "Ex.: Dezembro",
    escolherNichos: "Escolha um ou mais",
  },

  portao: {
    titulo: "Quanto vale um cliente pra você?",
    subtitulo:
      "Sem isso não dá para dizer se a campanha se paga. Recomendação sem custo por cliente não é recomendação.",
    ticket: "Ticket médio (R$)",
    ticketDica: "Quanto um cliente gasta, em média, por visita.",
    conversao: "De cada 10 pessoas que entram em contato, quantas viram cliente?",
    orcamento: "Orçamento da campanha (R$)",
    sePaga: (clientes: number, contatos: number | null) =>
      `Para se pagar: ${numero(clientes)} ${clientes === 1 ? "cliente" : "clientes"}${
        contatos != null ? `, o que pede uns ${numero(contatos)} contatos` : ""
      }.`,
    conta: "orçamento ÷ ticket; contatos = clientes ÷ conversão. Só com o que você digitou.",
    fechado: "Preencha os três para ver quem faz sentido.",
    invalido: "Use só números, como 180 ou 1.200,50.",
    seguir: "Ver quem faz sentido",
  },

  composicao: {
    titulo: "Quem faz sentido",
    ordem:
      "Ordem: mais provas assinadas primeiro, depois afinidade com o que você precisa. Sem nota.",
    fazSentido: "Faz sentido porque",
    porQue: "Por que apareceu?",
    porQueFechar: "Fechar explicação",
    parcial: "Dado parcial: só mostramos o que dá para verificar.",
    verificar:
      "Engajamento acima do plausível para o tamanho do perfil. Vale verificar antes de fechar.",
    comparar: "Comparar",
    escolher: "Chamar para o combinado",
    escolhido: "Escolhido",
    seguir: "Seguir para o combinado",
    escolhaAlguem: "Chame alguém para o combinado para seguir.",
    limiteComparar: "Dá para comparar até 3 de cada vez.",
    foraTitulo: (n: number) => `Ficou de fora (${n}), e por quê`,
    vazio:
      "Ninguém da demonstração faz sentido para essa necessidade. Ajuste o público ou a praça.",
    demo: "(demo)",
    oficio: (oficio: string, bairro: string, cidade: string) => `${oficio} · ${bairro}, ${cidade}`,
    motivos: (m: MotivoDentro, nomes: (ids: string[]) => string[]): string => {
      switch (m.tipo) {
        case "nicho":
          return `trabalha com ${lista(nomes(m.entidades).map((n) => n.toLowerCase()))}`;
        case "praca":
          return `atua em ${m.bairro}, ${m.cidade}`;
        case "provas":
          return `${m.n} ${m.n === 1 ? "prova assinada" : "provas assinadas"} com quem contratou`;
        case "pares":
          return "engaja acima de perfis do mesmo tamanho";
        case "faixa":
          return "a faixa de preço cabe no orçamento";
        case "disponivel":
          return "tem agenda no período";
      }
    },
    fora: (m: MotivoFora): string => {
      switch (m.tipo) {
        case "sem_relacao":
          return "não trabalha com esse público";
        case "fora_da_praca":
          return `atua em ${m.cidade}, fora da praça`;
        case "sem_agenda":
          return "sem agenda no período";
        case "acima_do_orcamento":
          return `faixa a partir de ${reais(m.faixaMin)}, acima do orçamento`;
        case "sem_dado":
          return "nenhum dado verificável ainda";
      }
    },
    decomposicao: {
      titulo: "O que pesou",
      nicho: "Público em comum",
      praca: "Praça",
      pares: "Engajamento perto de perfis do mesmo tamanho",
      constancia: "Constância (90 dias)",
      provas: "Provas assinadas",
      faixa: "Faixa de preço",
      fonte: "De onde vem o dado",
    },
    fontes: {
      consentida: "conta conectada pela pessoa",
      publica: "dado público (inferência rotulada)",
    },
    pares: { acima: "acima", na_media: "na média", abaixo: "abaixo" } satisfies Record<
      LeituraPares,
      string
    >,
    naoVerificavel: "não verificável",
    porSemana: (n: number) => `${numero(n)} por semana`,
    faixa: (min: number | null, max: number | null) =>
      min == null
        ? "não informada"
        : max == null
          ? `a partir de ${reais(min)}`
          : `${reais(min)} a ${reais(max)}`,
  },

  ladoALado: {
    titulo: "Lado a lado",
    eixo: "O que comparar",
    vazio: "Marque “Comparar” em dois ou três perfis.",
  },

  acordo: {
    titulo: "O combinado",
    subtitulo:
      "Escreva antes o que você espera e o que provaria que deu errado. Depois do carimbo, não muda.",
    com: (nome: string) => `Com ${nome} (demo)`,
    entregaveis: "O que vai ser entregue",
    direitos: "Direitos de uso do conteúdo",
    direitosOpcoes: {
      organico: "Só no perfil de quem cria",
      repost: "Repost no perfil do negócio",
      impulsionamento: "Impulsionamento por 90 dias",
    } satisfies Record<DireitosUso, string>,
    prazo: "Prazo",
    esperamos: "Esperamos que…",
    esperamosDica: "O que deve acontecer. Ex.: 20 clientes novos citando o cupom até o fim do mês.",
    erramosSe: "Erramos se…",
    erramosSeDica: "O que provaria que não funcionou. Ex.: menos de 8 clientes com o cupom.",
    carimbar: "Carimbar o combinado",
    incompleto: "Escolha ao menos um entregável e escreva “Esperamos” e “Erramos se”.",
    carimbado: (iso: string) => `Carimbado em ${dataHora(iso)}`,
    imutavel: "Imutável desde o carimbo: o critério se escreve antes, não se ajusta depois.",
  },

  andamento: {
    titulo: "Acontecendo",
    estagios: {
      rascunho: "Rascunho",
      proposta: "Proposta enviada",
      aceita: "Aceita",
      em_andamento: "Em andamento",
      entregue: "Entregue",
      encerrado: "Encerrado",
    } satisfies Record<Estagio, string>,
    proximo: "Próximo passo",
    acoes: {
      proposta: "Marcar como aceita",
      aceita: "Marcar como em andamento",
      em_andamento: "Marcar como entregue",
    } as Partial<Record<Estagio, string>>,
    simulacao: "Simulação: na demonstração, você faz os dois lados.",
    aguardandoAceite:
      "Quem cria entra pelo convite. Quando aceitar, o trabalho passa para “Aceita”.",
    verSeAceitou: "Ver se já aceitou",
    funil: "O que foi medido",
    funilDica: "O que não foi medido fica em branco. Nada é estimado.",
    campos: {
      contatos: "Contatos",
      agendados: "Agendados",
      clientes: "Clientes fechados",
      gasto: "Gasto efetivo (R$)",
    },
    salvar: "Salvar medição",
    salvo: "Medição salva.",
    invalido: "Números inteiros nos contatos, agendados e clientes; o gasto aceita centavos.",
    custo: (v: string) => `Custo por cliente fechado: ${v}`,
    custoConta: "gasto efetivo ÷ clientes medidos.",
    meta: (feitos: number, meta: number) =>
      `Precisava de ${numero(meta)} para se pagar; ${feitos >= meta ? "chegou a" : "por enquanto,"} ${numero(feitos)}.`,
  },

  encerramento: {
    titulo: "O que voltou",
    criterio: "O critério carimbado",
    esperamos: "Esperamos",
    erramosSe: "Erramos se",
    veredito: "Veredito",
    vereditoDica: "O que aconteceu de verdade, comparado com o “Erramos se”.",
    salvarVeredito: "Registrar veredito",
    assinaturas: "Assinaturas",
    assinarContratante: "Assino como contratante",
    simularProfissional: "Simular a assinatura de quem criou",
    simulacaoProfissional: "Na demonstração, a outra assinatura é simulada.",
    aguardandoProfissional: "Falta a assinatura de quem criou, que assina pelo link do convite.",
    verSeAssinou: "Ver se já assinou",
    assinadoEm: (lado: string, iso: string) => `${lado}: assinado em ${dataHora(iso)}`,
    lados: { contratante: "Contratante", profissional: "Quem criou" },
    prova: "Prova assinada pelos dois lados",
    provaDetalhe: "O cruzamento dos dois traços é a assinatura. Isso entra no lastro dos dois.",
    noUniverso: (nicho: string) =>
      `No seu universo, ${nicho} agora aparece como “Contribuí · prova assinada”.`,
    verNaRede: "Ver na Rede",
    carta: "Sua carta FEEL ID, com o lastro atualizado",
    novo: "Começar outro trabalho",
  },

  convidar: {
    titulo: "Convidar quem cria",
    dica: (nome: string) =>
      `Mande este link para ${nome}. Pelo link, a pessoa vê o combinado carimbado antes de aceitar.`,
    gerar: "Gerar link do convite",
    rotulo: "Link do convite",
    copiar: "Copiar link",
    copiado: "Link copiado.",
    falhou: "Não deu para gerar o convite agora. Tente de novo.",
  },

  email: {
    titulo: "Para assinar, confirme seu e-mail",
    dica: "A assinatura vira prova, então pede um e-mail confirmado. O resto já está salvo na sua conta.",
    rotulo: "Seu e-mail",
    enviar: "Enviar link de confirmação",
    enviado: (email: string) =>
      `Enviamos um link para ${email}. Abra neste aparelho e volte aqui para assinar.`,
    invalido: "Confira o e-mail: parece faltar alguma parte.",
    falhou: "Não deu para enviar agora. Tente de novo em alguns minutos.",
  },

  conviteRecebido: {
    titulo: "Um convite para criar",
    carregando: "Abrindo o convite…",
    local:
      "Este convite precisa de uma conta, e as contas ainda não estão abertas por aqui. Peça para quem contratou tentar de novo mais tarde.",
    invalido: "Este convite não vale mais: venceu ou já foi aceito por outra pessoa.",
    proprio: "Este é o convite que você criou. Mande o link para quem vai criar.",
    voltar: "Voltar para Trabalhos",
    necessidade: "O que precisa acontecer",
    praca: "Praça",
    combinado: "O combinado carimbado",
    aceitar: "Aceitar o convite",
    aceitarDica: "Ao aceitar, você entra no trabalho. O combinado não muda.",
    aceito: "Você está neste trabalho.",
    estagio: "Agora",
    aguardandoEntrega:
      "Quando o trabalho for entregue e o veredito estiver registrado, você assina aqui.",
    veredito: "Veredito de quem contratou",
    assinar: "Assino como quem criou",
    aguardandoContratante: "Sua assinatura está registrada. Falta a de quem contratou.",
    atualizar: "Atualizar",
  },

  historico: {
    titulo: "Provas assinadas",
    item: (perfil: string, quando: string) => `${perfil} (demo) · ${quando}`,
  },

  recomecar: "Descartar este trabalho",
  erro: "Isso não pode ser feito agora.",
  erroServidor: "Não deu para salvar agora. Confira a conexão e tente de novo.",
} as const;
