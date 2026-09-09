# Feel System — Fluxo Visual e Exemplos de Motion

**Complemento do planejamento técnico** — representa visualmente como os 4 movimentos se conectam e o que o usuário vê em cada etapa.

---

## 1. Fluxo de Scroll Principal (0vh → 210vh+)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FEEL SYSTEM MAP                             │
│                        Scroll Visualization                          │
└─────────────────────────────────────────────────────────────────────┘

VIEWPORT
     ↓
[0vh] ═══════════════════════════════════════════════════════════════
      │ TELA 1: O COMEÇO
      │ 
      │     ┌───────────────────────────────────┐
      │     │                                   │
      │     │            FEEL                   │
      │     │         (logo grande)             │
      │     │                                   │
      │     │  Transforming problems into       │
      │     │  capabilities, execution and      │
      │     │  intelligence                     │
      │     │                                   │
      │     │  [chevron pulsante]               │
      │     │       ↓ scroll                    │
      │     └───────────────────────────────────┘
      │
      │ Motion:
      │ - Logo fade-in (200ms delay)
      │ - Frase fade-in (400ms delay)
      │ - Chevron pulsante infinito
      │ - Background parallax leve (ao scroll)
      │
[15vh] ═══════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: fim da tela 1, começa tela 2
      │ → Seção 2 entra em view
      │ → Parallax acelera (fundo fica mais escuro/colorido)
      │
[20vh] ═══════════════════════════════════════════════════════════════
      │ TELA 2a: RESOLVE
      │ ┌─────────────────────────────────────────┐
      │ │                                         │
      │ │ ╔═══════════════════════════════════╗   │
      │ │ ║        RESOLVE                    ║   │
      │ │ ║                                   ║   │ 
      │ │ ║  Problema → Contexto → Capacidade │   │
      │ │ ║    → Execução → Resultado         ║   │
      │ │ ║                                   ║   │
      │ │ ╚═══════════════════════════════════╝   │
      │ │                                         │
      │ │   ○ ← ○ ← ○ ← ○ ← ○                   │
      │ │                                         │
      │ │ Motion:                                 │
      │ │ - Nós entram em stagger (100ms cada)    │
      │ │ - Conexões se desenham (stroke)         │
      │ │ - Resultado bifurca em bifurcação       │
      │ │                                         │
      │ └─────────────────────────────────────────┘
      │
[40vh] ═══════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: nós se consolidam
      │ → Seção PROVE entra em view
      │ → Parallax muda direção (sutileza)
      │
[45vh] ═══════════════════════════════════════════════════════════════
      │ TELA 2b: PROVE
      │
      │ ┌─────────────────────────────────────────┐
      │ │ ╔═══════════════════════════════════╗   │
      │ │ ║        PROVE                      ║   │
      │ │ ║                                   ║   │
      │ │ ║  Trabalho → Evidência →PROVA      ║   │
      │ │ ║    → Lastro                       ║   │
      │ │ ║                                   ║   │
      │ │ ╚═══════════════════════════════════╝   │
      │ │                                         │
      │ │   ○ → ○ → ◉ (PROVA destaque) → ○       │
      │ │       [Clicável! ⚡]                   │
      │ │                                         │
      │ │ Prova expandida (no mesmo lugar):       │
      │ │ ┌─────────────────────────────┐         │
      │ │ │ Quem fez: Gabriel Quental   │         │
      │ │ │ O quê: Identidade visual FW │         │
      │ │ │ Para quem: Feel             │         │
      │ │ │ Resultado: Sistema vivo     │         │
      │ │ │ Confirmou: ✓✓ bilateral    │         │
      │ │ └─────────────────────────────┘         │
      │ │                                         │
      │ └─────────────────────────────────────────┘
      │
[65vh] ═══════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: Prova se consolida, Lastro fica "pesado"
      │ → Seção LEARN entra em view
      │
[70vh] ═══════════════════════════════════════════════════════════════
      │ TELA 2c: LEARN
      │
      │ ┌─────────────────────────────────────────┐
      │ │ ╔═══════════════════════════════════╗   │
      │ │ ║        LEARN                      ║   │
      │ │ ║                                   ║   │
      │ │ ║  Resultado → Contexto → Memória  ║   │
      │ │ ║    → Inteligência ⟲             ║   │
      │ │ ║                                   ║   │
      │ │ ╚═══════════════════════════════════╝   │
      │ │                                         │
      │ │         ↗─────────────────↖            │
      │ │        /                    \           │
      │ │       ●  (Resultado)   (Memória)  ●    │
      │ │        \                    /           │
      │ │         ↘─────────────────↙            │
      │ │                                         │
      │ │  FeelMind aparece como overlay:        │
      │ │  [FeelMind transforma contexto]        │
      │ │                                         │
      │ │ Motion:                                 │
      │ │ - Ciclo se desenha continuamente        │
      │ │ - Rotação suave (1 ciclo = 4s)         │
      │ │ - Nós ganham brilho (crescimento)       │
      │ │ - FeelMind aparece com delay (600ms)    │
      │ │                                         │
      │ └─────────────────────────────────────────┘
      │
[90vh] ═══════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: Ciclo se fecha, sistema "pulsa"
      │ → Seção SCALE entra em view
      │
[95vh] ═══════════════════════════════════════════════════════════════
      │ TELA 2d: SCALE
      │
      │ ┌─────────────────────────────────────────┐
      │ │ ╔═══════════════════════════════════╗   │
      │ │ ║        SCALE                      ║   │
      │ │ ║                                   ║   │
      │ │ ║  Inteligência → Matching →        ║   │
      │ │ ║    Novos Problemas → Novos        ║   │
      │ │ ║    Projetos ⟲                    ║   │
      │ │ ║                                   ║   │
      │ │ ╚═══════════════════════════════════╝   │
      │ │                                         │
      │ │    ●                                    │
      │ │   /|\  Inteligência                     │
      │ │    |                                    │
      │ │    ↓                                    │
      │ │   ●-●-● Matching                       │
      │ │   | | |                                │
      │ │   ↓ ↓ ↓                                │
      │ │   ● ● ● Novos Problemas                │
      │ │    \ | /                               │
      │ │     ↓                                   │
      │ │     ● Novos Projetos                   │
      │ │     |                                   │
      │ │     ↻ (volta ao Inteligência)          │
      │ │                                         │
      │ │ Motion:                                 │
      │ │ - Nós aparecem progressivamente         │
      │ │ - Conexões se multiplicam               │
      │ │ - Densidade visual aumenta (exponencial)│
      │ │ - Grafo fica "vivo" (pulsações)        │
      │ │                                         │
      │ └─────────────────────────────────────────┘
      │
[120vh] ════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: Todos os 4 movimentos consolidados
      │ → Grande pausa (respiro visual)
      │ → Seção de Integração de Produtos entra em view
      │
[130vh] ════════════════════════════════════════════════════════════
      │ TELA 3: INTEGRAÇÃO DE PRODUTOS
      │
      │ ┌───────────────────────────────────────────────┐
      │ │ ╔═════════════════════════════════════════╗   │
      │ │ ║ Como o Sistema Funciona: As Camadas    ║   │
      │ │ ╚═════════════════════════════════════════╝   │
      │ │                                               │
      │ │  [Card 1]      [Card 2]      [Card 3]         │
      │ │  FeelMind      FeelWorks     FeelMakers       │
      │ │  (Inteligência) (Orquestração)(Capacidades)   │
      │ │  [Clicável]    [Clicável]    [Clicável]      │
      │ │                                               │
      │ │  [Card 4]                                      │
      │ │  Prova & Lastro                              │
      │ │  (Confiança)                                 │
      │ │  [Clicável]                                  │
      │ │                                               │
      │ │ Motion:                                       │
      │ │ - Cards entram em stagger ao viewport        │
      │ │ - Outline animada ao hover                   │
      │ │ - Modal abre ao clique (smooth transition)   │
      │ │                                               │
      │ └───────────────────────────────────────────────┘
      │
[150vh] ════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: Produtos se consolidam como camadas visíveis
      │
[160vh] ════════════════════════════════════════════════════════════
      │ TELA 4: MODELO ECONÔMICO (como consequência)
      │
      │ ┌───────────────────────────────────────────────┐
      │ │ ╔═════════════════════════════════════════╗   │
      │ │ ║ Como Capturamos Valor                  ║   │
      │ │ ║ (não é uma tabela de preços)           ║   │
      │ │ ╚═════════════════════════════════════════╝   │
      │ │                                               │
      │ │  REDE → CAPACIDADES → TRABALHO → PROVAS       │
      │ │    ↓                                           │
      │ │  CONTEXTO → INTELIGÊNCIA → PRODUTOS           │
      │ │    ↓                                           │
      │ │  VALOR PARA EMPRESAS → RECEITA                │
      │ │                                               │
      │ │  Depois breakdown:                            │
      │ │  - SaaS de Assessores                         │
      │ │  - Inteligência (FeelMind como API)            │
      │ │  - Infraestrutura de Projetos                 │
      │ │  - Serviços (FeelMakers)                      │
      │ │  - Produtos (Provas, Lastro como dados)       │
      │ │                                               │
      │ │ Motion:                                       │
      │ │ - Cada etapa aparece sequencialmente           │
      │ │ - Setas se desenham entre etapas              │
      │ │ - RECEITA final ganha destaque                │
      │ │                                               │
      │ └───────────────────────────────────────────────┘
      │
[180vh] ════════════════════════════════════════════════════════════
      │
      │ TRANSIÇÃO: Grande zoom out visual
      │ Sistema inteiro se afasta
      │ Tudo se reorganiza em um único ciclo
      │
[190vh] ════════════════════════════════════════════════════════════
      │ TELA 5: FLYWHEEL MACRO (visão final)
      │
      │ ┌───────────────────────────────────────────────┐
      │ │                                               │
      │ │              ╔════════════════╗              │
      │ │             ╱                  ╲             │
      │ │            │  MAIS PROBLEMAS   │            │
      │ │             ╲                  ╱             │
      │ │              ╚════════════════╝              │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS PROJETOS    │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS RESULTADOS  │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS PROVAS      │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS CONTEXTO    │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS MEMÓRIA     │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MAIS INTELIGÊNCIA│            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MELHORES DECISÕES│            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MELHORES         │            │
      │ │              │ CAPACIDADES      │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │              ┌──────────────────┐            │
      │ │              │ MELHORES         │            │
      │ │              │ RESULTADOS       │            │
      │ │              └──────────────────┘            │
      │ │                      ↓                        │
      │ │                      ↻ (ciclo fecha)        │
      │ │                                               │
      │ │ "Every interaction makes the system          │
      │ │  more intelligent."                          │
      │ │                                               │
      │ │ Motion:                                       │
      │ │ - Grande animação: zoom out (500ms)          │
      │ │ - Elementos se reorganizam em ciclo (600ms)  │
      │ │ - Ciclo ganha rotação infinita (suave)       │
      │ │ - Partículas/glows podem aparecer            │
      │ │ - Frase final aparece com fade-in            │
      │ │                                               │
      │ └───────────────────────────────────────────────┘
      │
[210vh+] ═══════════════════════════════════════════════════════════
      │
      │ Final Options:
      │ - Loop back to beginning (scroll to top)
      │ - CTA para explorar Feel Platform
      │ - Contato/newsletter
      │
```

---

## 2. Interatividade Detalhada — Fluxos de Click

### Click em Nó de Conceito (ex: "PROBLEMA")

```
Usuário vê o nó "Problema" (T+200ms de entrada)
  ↓
Passa mouse → nó cresce (scale 1 → 1.1, 200ms, ease-out)
  ↓
Nó ganha glow (opacity 0 → 0.4, animação de pulsação)
  ↓
Click no nó
  ├─ Se tela 1 (Hero): scroll smooth para tela 2a (RESOLVE)
  └─ Se tela 2a (RESOLVE): expande descrição inline (tooltip)
       └─ Tooltip aparece abaixo do nó (fade-in 200ms)
       └─ Conteúdo: "O que define um problema? Como a Feel o interpreta?"
       └─ Click fora → tooltip desaparece (fade-out 200ms)
```

### Click em "Prova" (Tela 2b)

```
Usuário vê o nó central "Prova" (destaque especial: maior, mais glow)
  ↓
Passa mouse → nó cresce (scale 1 → 1.15, mais dramático)
  ↓
Click no nó
  ├─ Overlay escurece (backdrop com opacity 0 → 0.5, 300ms)
  └─ Modal abre com suavidade:
       ├─ Backdropesurge (fade-in)
       ├─ Conteúdo slide-up de baixo (translateY -20px → 0, 400ms, ease-out)
       └─ Exibe:
           ├─ "Quem fez" (com link para perfil)
           ├─ "O quê foi feito" (descrição)
           ├─ "Para quem" (marca)
           ├─ "Em qual contexto" (data, evento, etc)
           ├─ "Resultado mensurável" (números, impacto)
           ├─ "Confirmado por" (✓✓ bilateral, com avatares)
           └─ [Botão fechar ou click fora]
  ↓
  Usuário clica fora ou [X]
  ├─ Modal fade-out + slide-down (reverso da entrada)
  └─ Backdrop fade-out
  └─ Volta ao contexto anterior (tela 2b, Prova nó volta ao estado normal)
```

### Click em "Capacidades" (Tela 3)

```
Usuário vê card "FeelMakers/Partners/Technology"
  ↓
Passa mouse → card outline ganha animação (stroke pulse, cor do texto muda)
  ↓
Click no card
  ├─ Overlay + Modal abrindo
  └─ Mostra grid de capacidades:
       ├─ FeelMakers (imagem + "Braço operacional da Feel")
       ├─ Feel Partners (grid de partners: Korun, Noodle, etc)
       ├─ Technology (componentes técnicos: API, SDK, etc)
       └─ Cada item é clicável (drills down mais)
```

### Sequência Global de Interação

```
01. Usuário carrega página
    └─ Hero section aparece (fade-in)
    
02. Scroll down (parallax ativo)
    └─ Sente que há mais abaixo
    
03. Seção 2a (RESOLVE) entra em view
    └─ Nós entram em sequência
    
04. Pode clicar em nó para expandir tooltip
    
05. Seção 2b (PROVE) entra em view
    └─ Prova é um nó especial (maior, brilho)
    
06. Click em Prova abre modal com detalhe completo
    
07. Fecha modal, continua scroll
    
08. Seções 2c, 2d entram (LEARN, SCALE)
    
09. Seção 3 (Produtos como componentes)
    └─ 4 cards grandes, cada um é clicável
    
10. Click em card abre modal respectivo
    
11. Fecha modal, continua scroll
    
12. Seção 4 (Modelo Econômico)
    └─ Visualização sequencial (sem interação esperada)
    
13. Seção 5 (Flywheel)
    └─ Visão macro, ciclo em rotação
    └─ Usuário vê tudo se conecta
    
14. Final: CTA ou loop
```

---

## 3. Exemplos de Motion Design (CSS-in-JS / Framer Motion)

### Motion Variant 1: Entrada de Nó

```tsx
const nodeVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

<motion.div
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={nodeVariants}
/>
```

### Motion Variant 2: Glow / Pulsação

```tsx
const glowVariants = {
  rest: { boxShadow: "0 0 20px rgba(108, 91, 255, 0.3)" },
  hover: {
    boxShadow: "0 0 40px rgba(108, 91, 255, 0.8)",
    transition: { duration: 0.3 },
  },
  pulse: {
    boxShadow: [
      "0 0 20px rgba(108, 91, 255, 0.3)",
      "0 0 40px rgba(108, 91, 255, 0.6)",
      "0 0 20px rgba(108, 91, 255, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

<motion.div
  initial="rest"
  whileHover="hover"
  animate={isPulse ? "pulse" : "rest"}
  variants={glowVariants}
/>
```

### Motion Variant 3: Stroke Animation (SVG)

```tsx
const strokeVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

<motion.svg>
  <motion.line
    initial="hidden"
    animate={isInView ? "visible" : "hidden"}
    variants={strokeVariants}
    x1="10" y1="10" x2="100" y2="100"
    stroke="currentColor"
  />
</motion.svg>
```

### Motion Variant 4: Parallax ao Scroll

```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, -150]);

<motion.div style={{ y }}>
  Background element moves slower
</motion.div>
```

### Motion Variant 5: Stagger Children

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={childVariants}>Item 1</motion.div>
  <motion.div variants={childVariants}>Item 2</motion.div>
  <motion.div variants={childVariants}>Item 3</motion.div>
</motion.div>
```

### Motion Variant 6: Modal Entrance (Backdrop + Content)

```tsx
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      />
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## 4. Padrão de Responsividade — o Mesmo Sistema em Mobile

```
┌─────────────────────┐
│ MOBILE (360–480px)  │
├─────────────────────┤
│                     │
│     [FEEL logo]     │
│   (2rem, centered)  │
│                     │
│   "Transforming..." │
│   (1rem, centered)  │
│                     │
│   [chevron ↓]       │
│                     │
│  [scroll down]      │
│                     │
│ ─────────────────── │
│                     │
│    [RESOLVE]        │
│    (título 1.5rem)  │
│                     │
│   O O O O O         │ (nós menores: 48px)
│                     │
│    (stagger igual)  │
│    (conexões igual) │
│                     │
│ ─────────────────── │
│                     │
│     [PROVE]         │
│                     │
│   O → O → ◉ → O     │ (igual, mesma semântica)
│                     │
│ (click em ◉ abre    │
│  modal fullscreen)  │
│                     │
│ ─────────────────── │
│                     │
│     [LEARN]         │
│     (ciclo igual)   │
│                     │
│ ─────────────────── │
│                     │
│     [SCALE]         │
│   (grafo igual,     │
│    mas mais denso)  │
│                     │
│ ─────────────────── │
│                     │
│   [Card 1] [Card 2] │ (cards empilhados)
│   [Card 3] [Card 4] │
│                     │
│ ─────────────────── │
│                     │
│ (Modelo econômico)  │
│ (vertical flow)     │
│                     │
│ ─────────────────── │
│                     │
│  (Flywheel macro)   │
│  (circular, 100%w)  │
│                     │
└─────────────────────┘

KEY DIFFERENCES:
- Nós um pouco menores (48–64px vs 80–100px)
- Spacing reduzido (8vh vs 12–16vh entre seções)
- Parallax menos intenso (0.5x vs 1x)
- Cards empilhados (não grid de 2 colunas)
- Modal toma 100% viewport (não centered box)
- Tipografia reduzida proporcionalmente

MOTION MANTIDA:
- Stagger de entrada igual
- Stroke animations igual
- Pulsações igual
- Timing igual (a experiência narrativa é a mesma)
```

---

## 5. Fluxo de Dados — o que é Estático vs Dinâmico

### Hoje (MVP)

```
Dados = Hardcoded em MDX ou constantes TypeScript

exemplo:
const movements = [
  {
    id: "resolve",
    title: "RESOLVE",
    nodes: [
      { id: "problema", label: "Problema", x: 0, y: 0 },
      { id: "contexto", label: "Contexto", x: 100, y: 0 },
      ...
    ],
    connections: [
      { from: "problema", to: "contexto" },
      ...
    ],
  },
  ...
]

Renderização = diretamente em componentes
```

### Futuro (quando FeelWorks tiver rede viva)

```
Dados = API FeelWorks em tempo real

exemplo de SSR:
export async function generateStaticParams() {
  const provas = await fetch("api.feel.com/provas?limit=100");
  return provas.map(p => ({ id: p.id }));
}

Renderização = SSR + ISR (revalidate 1h)

Modal de Prova = SSR dinâmico:
app/(modals)/@modal/(.)prova/[id]/page.tsx
  └─ fetch real-time de prova específica
  └─ hydrate com dados vivos da rede

Implicação:
- Primeira tela (Hero + 4 movimentos) vira estática (gera em build time)
- Segunda tela (Produtos) vira semi-dinâmica (dados de parceiros)
- Modais (Prova, Inteligência) viram dinâmicas (dados reais)
- Flywheel viraliza dados agregados da rede
```

---

## 6. Checklist de Elementos Visuais

- [x] Logo Feel (Archivo Black, grande, centered)
- [x] Tipografia: Archivo (display), Inter (corpo), IBM Plex Mono (dados)
- [x] Paleta: violeta (#6C5BFF), deep (#2B1FA8), soft (#EFEDFF), paper, ink
- [x] Nós: círculos com glow, hover scale, click expand
- [x] Conexões: SVG linhas com stroke-dasharray, desenhadas ao scroll
- [x] Cards: border, hover outline glow, shadow sutil
- [x] Modais: fullscreen no mobile, centered no desktop, backdrop escuro
- [x] Tooltips: fade-in/out, posicionadas smart (acima/abaixo conforme espaço)
- [x] Ciclos: rotação suave infinita, nodes pulsam
- [x] Parallax: backgrounds em velocidades diferentes, não distrativo
- [x] Buttons: hover state, active state, loading state se necessário
- [x] Heatmap (futuro): escala violeta, 5 tons (#F0EFE8 → #2B1FA8)

---

## 7. Fluxo de Deploy e Validação

### Build

```bash
npm run build
# Verifica se tsc compila (strict mode)
# Verifica se Tailwind gera classes corretas
# Otimiza imagens (next/image)
# Exporta fontes otimizadas
```

### Validação Local

```bash
npm run dev
# Abre localhost:3000
# Testa scroll em 60fps (DevTools Performance tab)
# Testa parallax em 3 breakpoints (360, 768, 1280px)
# Testa todos os cliques de interatividade
# Testa modals (abertura, fechamento, ESC key)
# Mede CLS (Cumulative Layout Shift) — deve ser < 0.1
```

### Lighthouse Check

```bash
# Boa referência:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 90+
# SEO: 100
# CLS: < 0.1
# LCP: < 2.5s
# FID: < 100ms
```

### Deployment

```bash
git push origin main
# Vercel auto-deploys
# Preview link gerado
# Production link: https://feel-system.vercel.app (exemplo)
```

---

## 8. Timeline de Implementação (Resumida)

| Semana | Fase | Entrega |
|--------|------|---------|
| 1 | Setup + Tela 1 | Hero section viva, motion básica |
| 2–3 | Tela 2a-2d | Os 4 Movimentos com nós + conexões + interatividade |
| 4 | Modals + Tela 3 | Detalhes de Prova, cards de produtos, Tela 3 completa |
| 5 | Telas 4–5 | Modelo econômico + Flywheel macro + Polish |
| 6 | Validação | Lighthouse, responsividade, bugs, deploy final |

---

## Conclusão

Este fluxo visual representa a experiência completa que o usuário terá:

1. **Simplicidade radical** no começo (só FEEL + frase)
2. **Revelação progressiva** (4 movimentos como narrativa)
3. **Profundidade ao clicar** (modals para aprofundamento)
4. **Visão macro** (flywheel fecha tudo)
5. **Movimento semântico** (cada anim comunica a tese)

O sistema não é explicado em prosa. É **experimentado** através de movimento e interatividade.

Isso é o que faz Feel System ser um protótipo da linguagem operacional futura, não só um site.
