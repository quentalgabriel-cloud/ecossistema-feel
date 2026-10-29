import type { DadosUniverso, Relacao, Sugestao } from "./tipos";

// Conjunto de demonstração. TUDO aqui é fictício: nomes descritivos, nenhuma
// comunidade, pessoa ou lugar real, nenhuma foto. As contagens existem para
// exercitar a escala (40 · 250 · 1.800 · 10.000 · sem contagem) e a interface as
// rotula como "dados de demonstração" — número sem rótulo seria número inventado.

export const dadosDemo: DadosUniverso = {
  demo: true,
  grupos: [
    { id: "imagem", nome: "Imagem", descricao: "Quem fotografa, filma e pensa a imagem." },
    { id: "som", nome: "Som", descricao: "Batuque, estúdio, palco e escuta." },
    { id: "territorio", nome: "Território", descricao: "Ruas, feiras e lugares que juntam gente." },
    { id: "mesa", nome: "Mesa", descricao: "Cozinha, café e o que acontece em volta." },
    { id: "oficio", nome: "Ofício", descricao: "Fazer com as mãos e com método." },
    {
      id: "tecnologia",
      nome: "Tecnologia criativa",
      descricao: "Código, luz e ferramenta a serviço da ideia.",
    },
  ],
  entidades: [
    {
      id: "cineclube-rua",
      tipo: "comunidade",
      nome: "Cineclube de rua",
      descricao: "Sessões ao ar livre e conversa depois do filme.",
      grupoId: "imagem",
      visibilidade: "publica",
      relacionadas: ["fotografia-documental", "projecao-mapeada"],
    },
    {
      id: "fotografia-documental",
      tipo: "comunidade",
      nome: "Fotografia documental",
      descricao: "Gente que fotografa a cidade como ela é, sem pose.",
      grupoId: "imagem",
      visibilidade: "publica",
      relacionadas: ["cineclube-rua", "feira-bairro"],
    },
    {
      id: "lambe-lambe",
      tipo: "interesse",
      nome: "Cartaz e lambe-lambe",
      descricao: "Tipografia de muro, impressão e colagem.",
      grupoId: "imagem",
      visibilidade: "publica",
      relacionadas: ["design-editorial"],
    },
    {
      id: "batuque-quintal",
      tipo: "comunidade",
      nome: "Batuque de quintal",
      descricao: "Percussão aberta, de ensaio em ensaio.",
      grupoId: "som",
      visibilidade: "publica",
      relacionadas: ["ladeira-sabado"],
    },
    {
      id: "estudio-garagem",
      tipo: "comunidade",
      nome: "Estúdio de garagem",
      descricao: "Produção musical independente, troca de equipamento e de ouvido.",
      grupoId: "som",
      visibilidade: "membros",
      relacionadas: ["batuque-quintal", "codigo-criativo"],
    },
    {
      id: "escuta-vinil",
      tipo: "interesse",
      nome: "Escuta de vinil",
      descricao: "Ouvir disco inteiro, do lado A ao B.",
      grupoId: "som",
      visibilidade: "publica",
      relacionadas: [],
    },
    {
      id: "ladeira-sabado",
      tipo: "evento",
      nome: "Roda de sábado na ladeira",
      descricao: "Encontro recorrente de música e rua. Agenda de demonstração.",
      grupoId: "territorio",
      visibilidade: "publica",
      relacionadas: ["batuque-quintal", "feira-bairro"],
    },
    {
      id: "feira-bairro",
      tipo: "lugar",
      nome: "Feira do bairro",
      descricao: "Onde a cidade compra, conversa e se encontra.",
      grupoId: "territorio",
      visibilidade: "publica",
      relacionadas: ["cozinha-mercado", "fotografia-documental"],
    },
    {
      id: "caminhada-centro",
      tipo: "comunidade",
      nome: "Centro antigo a pé",
      descricao: "Caminhadas para olhar fachada, história e gente.",
      grupoId: "territorio",
      visibilidade: "publica",
      relacionadas: ["fotografia-documental"],
    },
    {
      id: "cozinha-mercado",
      tipo: "comunidade",
      nome: "Cozinha de mercado",
      descricao: "Receita de família, ingrediente da estação.",
      grupoId: "mesa",
      visibilidade: "publica",
      relacionadas: ["feira-bairro", "cafe-especial"],
    },
    {
      id: "cafe-especial",
      tipo: "interesse",
      nome: "Café de origem",
      descricao: "Torra, método e quem planta.",
      grupoId: "mesa",
      visibilidade: "publica",
      relacionadas: ["cozinha-mercado"],
    },
    {
      id: "design-editorial",
      tipo: "comunidade",
      nome: "Design editorial",
      descricao: "Livro, revista e zine: página como objeto.",
      grupoId: "oficio",
      visibilidade: "publica",
      relacionadas: ["lambe-lambe", "ilustracao"],
    },
    {
      id: "ilustracao",
      tipo: "comunidade",
      nome: "Ilustração e traço",
      descricao: "Desenho à mão e digital, encontro para desenhar junto.",
      grupoId: "oficio",
      visibilidade: "publica",
      relacionadas: ["design-editorial"],
    },
    {
      id: "producao-audiovisual",
      tipo: "habilidade",
      nome: "Produção audiovisual",
      descricao: "Organizar set, equipe e entrega.",
      grupoId: "oficio",
      visibilidade: "publica",
      relacionadas: ["cineclube-rua"],
    },
    {
      id: "codigo-criativo",
      tipo: "comunidade",
      nome: "Código criativo",
      descricao: "Arte generativa, som e luz programados.",
      grupoId: "tecnologia",
      visibilidade: "publica",
      relacionadas: ["projecao-mapeada", "estudio-garagem"],
    },
    {
      id: "projecao-mapeada",
      tipo: "interesse",
      nome: "Projeção em fachada",
      descricao: "Luz contando história em parede de prédio.",
      grupoId: "tecnologia",
      visibilidade: "publica",
      relacionadas: ["codigo-criativo", "cineclube-rua"],
    },
    {
      id: "edital-curta",
      tipo: "oportunidade",
      nome: "Chamada para curta de bairro",
      descricao: "Oportunidade de demonstração: equipe pequena para um curta documental.",
      grupoId: "imagem",
      visibilidade: "publica",
      relacionadas: ["fotografia-documental", "producao-audiovisual"],
    },
  ],
  comunidades: [
    {
      entidadeId: "cineclube-rua",
      membrosConfirmados: 1800,
      contagemEm: "2026-10-01",
      politica: "aberta",
    },
    {
      entidadeId: "fotografia-documental",
      membrosConfirmados: 10000,
      contagemEm: "2026-10-01",
      politica: "aberta",
    },
    {
      entidadeId: "batuque-quintal",
      membrosConfirmados: 250,
      contagemEm: "2026-10-01",
      politica: "aberta",
    },
    {
      entidadeId: "estudio-garagem",
      membrosConfirmados: 40,
      contagemEm: "2026-10-01",
      politica: "pedido",
    },
    { entidadeId: "caminhada-centro", membrosConfirmados: null, politica: "aberta" },
    {
      entidadeId: "cozinha-mercado",
      membrosConfirmados: 620,
      contagemEm: "2026-10-01",
      politica: "aberta",
    },
    {
      entidadeId: "design-editorial",
      membrosConfirmados: 410,
      contagemEm: "2026-10-01",
      politica: "pedido",
    },
    {
      entidadeId: "ilustracao",
      membrosConfirmados: 3200,
      contagemEm: "2026-10-01",
      politica: "aberta",
    },
    {
      entidadeId: "codigo-criativo",
      membrosConfirmados: 90,
      contagemEm: "2026-10-01",
      politica: "convite",
    },
  ],
};

/** Escolhas oferecidas no onboarding — tudo que a pessoa pode declarar. */
export const catalogoInteresses: string[] = dadosDemo.entidades
  .filter((e) => e.tipo !== "oportunidade" && e.tipo !== "evento")
  .map((e) => e.id);

/**
 * Persona da demonstração ("Explorar demonstração"): mostra todos os estados de
 * verdade convivendo. Quem entra pelo convite começa só com o que declarou.
 */
export const relacoesDemo: Relacao[] = [
  { entidadeId: "fotografia-documental", tipo: "membro", estado: "confirmado", provas: 3 },
  { entidadeId: "cineclube-rua", tipo: "contribui", estado: "assinado", provas: 6 },
  { entidadeId: "design-editorial", tipo: "membro", estado: "em_processo", provas: 0 },
  { entidadeId: "lambe-lambe", tipo: "identifica_se", estado: "declarado", provas: 0 },
  { entidadeId: "batuque-quintal", tipo: "identifica_se", estado: "declarado", provas: 0 },
  { entidadeId: "feira-bairro", tipo: "acompanha", estado: "declarado", provas: 0 },
  { entidadeId: "cozinha-mercado", tipo: "membro", estado: "confirmado", provas: 1 },
  { entidadeId: "producao-audiovisual", tipo: "identifica_se", estado: "declarado", provas: 0 },
  { entidadeId: "codigo-criativo", tipo: "interesse", estado: "declarado", provas: 0 },
];

/**
 * Regras de descoberta da demonstração. Não é motor de recomendação: cada
 * sugestão nomeia o motivo e as entidades que a sustentam (handoff § 8.2).
 */
export const regrasSugestao: Sugestao[] = [
  {
    entidadeId: "caminhada-centro",
    motivo: "interesse_em_comum",
    evidencias: ["fotografia-documental", "feira-bairro"],
  },
  {
    entidadeId: "projecao-mapeada",
    motivo: "contexto_compartilhado",
    evidencias: ["cineclube-rua", "codigo-criativo"],
  },
  {
    entidadeId: "ladeira-sabado",
    motivo: "contexto_compartilhado",
    evidencias: ["batuque-quintal", "feira-bairro"],
  },
  {
    entidadeId: "edital-curta",
    motivo: "habilidade_complementar",
    evidencias: ["producao-audiovisual", "fotografia-documental"],
  },
  {
    entidadeId: "ilustracao",
    motivo: "interesse_em_comum",
    evidencias: ["design-editorial", "lambe-lambe"],
  },
  {
    entidadeId: "cafe-especial",
    motivo: "contexto_compartilhado",
    evidencias: ["cozinha-mercado"],
  },
  {
    entidadeId: "estudio-garagem",
    motivo: "interesse_em_comum",
    evidencias: ["batuque-quintal", "escuta-vinil", "codigo-criativo"],
  },
];

/** Variação simulada de 30 dias, para demonstrar crescimento e redução (handoff § 6.3). */
export const variacao30Dias: Record<string, number> = {
  "cineclube-rua": 2016,
  "fotografia-documental": 10400,
  "batuque-quintal": 310,
  "estudio-garagem": 36,
  "cozinha-mercado": 580,
  "design-editorial": 470,
  ilustracao: 3350,
  "codigo-criativo": 132,
};
