---
name: Feel
version: 2.0
spec: design.md-alpha
colors:
  # Neutros — 90% do sistema
  paper: "#FBF9F3"        # base clara — background padrão do sistema
  tint: "#F7F2E9"         # entre paper e bone — fundo alternado de seção, painel de leitura
  bone: "#F2EDE3"         # surface — painéis, chips, blocos de dado
  steel: "#857C70"        # secondary — bordas fortes, metadados, texto mudo
  ink: "#17140F"          # primary — títulos, texto, e o palco (modo escuro)
  # Superfícies do modo escuro (palco / evento / FeelMakers)
  inkSurface: "#1D1915"
  inkLine: "#322B24"
  inkText: "#F2EDE3"
  inkMuted: "#B9B0A2"
  # Linhas do modo claro
  line: "#E3DCCE"
  lineDashed: "#C9BFAC"
  textBody: "#4A443C"
  # Cor institucional — 8%, regra do anel
  coral: "#FF5C3D"
  coralHover: "#D9431F"
  # Ênfase exclusiva do FeelMakers (físico / cena) — nunca com coral na mesma peça
  amber: "#F0A63B"
typography:
  h1:
    fontFamily: Archivo
    fontSize: 62px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.035em
  h2:
    fontFamily: Archivo
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Archivo
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Archivo
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: Archivo
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.2em
    textTransform: uppercase
  data:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    fontVariantNumeric: tabular-nums
rounded:
  sm: 8px
  md: 12px
  lg: 14px
  xl: 18px
  pill: 99px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 28px
  xl: 44px
  section: 88px
---

## Overview

Feel é a marca-mãe (branded house) de uma **infraestrutura de reputação, confiança e coordenação** para a economia criativa — conectando varejo, profissionais criativos, creators e marcas, catalisada por um espaço físico. O princípio-raiz: **a Feel não cria valor, ela revela.** (Tese de negócio completa em `00-tese/`.) O design existe para reduzir complexidade, tornar conexões visíveis e criar confiança — nunca para decorar.

O registro é o de uma **instituição da economia criativa**, não o de uma startup de IA: base clara, silêncio, cor rara, tipografia que desaparece. "Menos interface de IA, mais infraestrutura cultural." A referência de sensação é minimalismo arquitetônico com gravidade editorial — acabamento fosco, premium, tocável.

Seis leis geram o sistema: (1) tudo está em transformação; (2) toda trajetória deixa memória; (3) nada acontece isolado — sentimento nasce de relação; (4) encontros nunca são forçados; (5) a identidade evolui sem perder a essência; (6) o design revela, nunca grita.

## Colors

Dosagem inegociável — **90 / 8 / 2**: 90% neutros, 8% cor institucional, 2% efeitos (glass).

- **paper (#FBF9F3):** base clara, o default do sistema (produto, documentos, institucional).
- **tint (#F7F2E9):** um passo mais quente que paper — alterna o fundo entre seções e veste painéis de leitura, para dar ritmo sem sair dos neutros.
- **bone (#F2EDE3):** surface — painéis, chips, blocos de dado.
- **steel (#857C70):** secondary — bordas de ênfase, metadados, texto mudo. Também nomeia o "inimigo": a cor do quadrante corporativo frio.
- **ink (#17140F):** primary — títulos e texto no claro; e a superfície do **modo escuro** (palco, evento, FeelMakers).
- **coral (#FF5C3D):** cor institucional, teto de 8%. Regra do anel — **um elemento coral por composição**. Pode: links, o dado-chave de um card, a palavra grifada de um título, a linha do fio, o estado ativo. Não pode: fundos grandes, texto longo, dois elementos disputando, gradiente decorativo. Se a peça só funciona colorida, ainda não está pronta.
- **amber (#F0A63B):** ênfase exclusiva do **FeelMakers** (físico, cena, palco). Mesma família, ênfase diferente — nunca convive com coral na mesma peça.

O sistema precisa sobreviver em preto e branco. Se copiarem a paleta, tem de sobrar algo impossível de copiar.

## Typography

Duas famílias, no máximo — e que desapareçam. A hierarquia nasce de **peso, escala e espaço**, nunca de trocar fonte. Ficam de fora Space Grotesk / Inter / JetBrains (viraram o template das startups de IA).

- **Archivo** — display e texto. Grotesca neutra, sem tique geométrico. H1/H2 em 600 com tracking negativo; corpo em 400; UI em 500.
- **IBM Plex Mono** — dados, etiquetas e o registro builder (lastro, prova, ritmo). Caixa-alta com tracking largo para labels. **Números sempre tabulares.** Nunca corre em texto longo.
- Upgrade futuro licenciado: Neue Haas Grotesk — caminho de refino, não de partida.

O maior ativo tipográfico não é a fonte: é o respiro. Muito branco, muito silêncio, muito grid.

## Spacing & Radius

Respiro é lei. Seções abrem com `spacing.section` (88px) no vertical; blocos internos respiram em `lg`/`xl`. Raios discretos e consistentes: `sm`/`md` para chips e dados, `lg`/`xl` para cards e painéis, `pill` para tags e o estado ativo.

## The Grammar (a lei geradora)

A cicloide dos "ee" do wordmark é o motor gerador do sistema — não um ornamento. Dela derivam:

- **Proporção de composição 5:8:5** (margem · corpo · margem), sempre com corte assimétrico — composições Feel nunca são espelhadas.
- **Constantes de traço:** curva-mãe com raio b = 1.6u (1u = altura do laço ÷ 3); terminais sempre redondos, raio mínimo 0.5u; peso de referência 2.6px em canvas de 24u para ícones.
- **O fio nunca fecha:** entra e sai do quadro — nenhuma trajetória está concluída (Lei 1).

Derivação completa e prova visual em `Feel - Gramática do Fio.dc.html`.

## The Fio (elemento gerador)

O fio é **rastro de trajetória — consequência, nunca origem**. Reputação não é currículo nem score: é um rastro contável. Geometricamente, o fio é o gesto dos "ee" do logotipo (uma cicloide prolata que forma laços). Três comportamentos, um vira regra:

- **Assinatura (padrão):** uma linha, um gesto, no fim da composição — como quem assina. Uma vez por peça. É o "anel da roupa preta".
- **Estrutural (restrito):** conector de eventos, só na timeline de Lastro e em divisores. Fora disso vira ornamento.
- **Topografia (raro):** malha de trajetórias como superfície, só em capa, palco e abertura de deck. Único lugar onde muitos fios convivem. Nunca atrás de texto corrido.

Ícones derivam do gesto: mesmo peso, terminais redondos, mesmo raio mínimo do wordmark. Nunca packs prontos.

## Motion

A marca **se desenha** — nada "aparece". Verbos permitidos: desenhar, revelar, conectar, respirar, deslizar, entrelaçar. Proibidos: explodir, quicar, girar sem motivo, piscar. Tudo desenha, descansa e recomeça.

## Glass

Glass é **comportamento, não linguagem** (os 2% da dosagem). Significa: "existe, mas ainda não foi revelado". Só aparece sobre conteúdo em estado de descoberta (preview de oportunidade, prova aguardando 2ª assinatura, perfil em construção). Física fixa: blur 12px, borda de 1px de luz vinda de cima, sem gradiente colorido dentro. Máximo 20% da composição; nunca atrás do logotipo nem sobre fotografia inteira. Quando o conteúdo é revelado, o vidro sai — é um estado, não um estilo.

## Modes

**Claro é o sistema. Escuro é o palco.** O default do produto, dos documentos e do institucional é o claro (paper, respiro, silêncio). O ink vira o modo de cena: evento, keynote, FeelMakers.

## Logo

O wordmark "feel" é a estratégia dentro da tipografia: consoantes duras (f, l) = ferramenta; vogais à mão (ee) = alma. A anatomia não se mexe. **Monocromático é o padrão** (coral/paper como assinatura; bone/ink no palco; steel em documentos). Bicolor vira exceção de campanha. Clearspace = altura do olho do "e"; tamanho mínimo 96px digital / 22mm impresso. O símbolo isolado (os dois loops) só ganha autonomia depois que "Feel" tiver equity.

## Voice

A marca é **Feel**; o convite é **"Segue a Feel."**; e **"Segue o fio."** é uma camada descoberta (o trocadilho Feel→fio), recurso de campanha, nunca a explicação oficial. Domínios: feelbrasil.com (institucional), segueafeel.com.br (campanha), @segueafeel. Vocabulário de builder — lastro, prova, obra, ritmo, oportunidade, ticket, permuta, publi, assessor. A voz nunca explica; sugere. Nunca "plataforma inovadora que conecta"; sempre o fato: "34 provas assinadas".

## Photography

Documental, em relação — nunca performática. Foco na relação (troca, escuta) e no processo, não no indivíduo posando. Tratamento: luz disponível, −8% de saturação, sombras quentes puxando para o ink (nunca preto puro), grão fino 2–3%. Proibido: stock de "creator com ring light", 3D decorativo, mockup brilhante de dashboard. Se parece anúncio de SaaS, está errado.

## Components

Todos derivados da gramática (5:8:5, terminal redondo, corte assimétrico). Referência viva: `Feel - Componentes.dc.html`.

- **Botões:** primário coral (único por composição — regra do anel), secundário outline ink, terciário mudo sem borda. Radius `md` (12px), peso 500, 44px+ de alvo.
- **Chips:** IBM Plex Mono caps, `pill`, borda `line`; o chip de estado ativo é o único que pode ser coral.
- **Campos:** padrão borda `line`; ativo borda coral 1.5px; preenchido borda ink sobre bone.
- **Cards:** radius `xl` (18px), borda `line`, fundo paper; corte interno 5:8 quando há mídia. Glass só como overlay de descoberta (blur 12px, borda de luz, sai quando revelado).
- **Timeline de Lastro:** o único lugar do fio estrutural; nós coral no percorrido, `lineDashed` no futuro; o fio nunca fecha (estado "em processo" para em ~82% e continua para fora do quadro).
- **Números:** sempre `tabular-nums`, rotulados em mono caps.
- **Estado padrão é "em processo"** (Lei 1): glass visível, fio parcial. "Revelado" é a exceção que remove o vidro e completa o traço.

## Applications (provas de campo)

- `01-marca/Feel - Deck Institucional.dc.html` — keynote claro, fecho ink; topografia só na capa e no fecho.
- `01-marca/Feel - Palco FeelMakers.dc.html` — evento, modo escuro, âmbar exclusivo, topografia de palco, grão. Serve também de keynote de evento.
- `01-marca/Feel - Grid Social.dc.html` — fio único atravessando o grid 3×3; stories e carrossel com o fio entrando/saindo.
- `01-marca/Feel - Materialidade.dc.html` — relevo seco, serigrafia, gravação; vinil-guia âmbar no piso (sinalização do espaço).
- `02-feelworks/` — produto em modo claro, coral pela regra do anel: Perfil (creator/assessor), Onboarding, Modo de Edição, Área Pessoal, Descoberta &amp; Prova.
- `05-narrativas/` — decks e documentos por público (investidor, shopping, varejo, profissional criativo, creator, imprensa); placeholders em `[BRACKETS]` onde falta dado real — nunca número inventado.

## The Feel Test

Cinco perguntas antes de aprovar qualquer peça. Uma resposta "não" = a peça depende de elemento superficial; volta para a mesa, remove 30% e testa de novo.

1. Sem o logotipo — ainda parece Feel?
2. Sem a cor — ainda parece Feel?
3. Sem os efeitos — ainda comunica clareza?
4. Em preto e branco — continua elegante?
5. Se copiarem a paleta — sobra algo impossível de copiar?
