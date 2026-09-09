# Feel System — Planejamento Técnico Completo

**Versão:** 1.0  
**Data:** agosto/2026  
**Fase:** planejamento de arquitetura, stack selection, design system  
**Entrega:** roadmap de implementação com recomendação técnica

---

## 0. Resumo Executivo — Decisões de Alto Nível

### O Projeto
Não é um "site sobre Feel". É uma **interface interativa para compreender a tese da Feel** — um sistema vivo que revela como a Feel pensa através de movimentação, transformação visual e navegação de conceitos conectados.

**Estrutura conceitual** em 4 movimentos:
1. **RESOLVE** — Problema → Contexto → Capacidade → Execução → Resultado
2. **PROVE** — Trabalho → Evidência → Prova → Lastro
3. **LEARN** — Resultado → Contexto → Memória → Inteligência
4. **SCALE** — Inteligência → Matching → Novos Problemas → Novos Projetos

### Recomendação Técnica Resumida
**Stack: Next.js 15 (App Router) + Framer Motion + Tailwind v4**

Justificativa: melhor equilíbrio entre controle de motion design (que é central aqui, não cosmético), reatividade, performance em scroll/parallax, e capacidade de começar simples e escalar para dados dinâmicos futuros (quando o sistema virar "vivo" com dados reais da rede).

HTML/CSS puro é elegante se for estático forever. React/Framer Motion dá flexibilidade. Next.js permite começar como SPA (static) e evoluir para SSR/ISR (dados reais).

---

## 1. Análise do Briefing Conceitual

### O que foi pedido
Uma experiência visual-interativa que:
- Começa **brutalmente simples** (nada de menu com 15 itens)
- Revela o sistema através de **movimentação que tem significado** (não decorativa)
- Usa **parallax e scroll** como linguagem de navegação (não links tradicionais)
- Comunica a tese core: **"cada resultado alimenta o sistema como conhecimento"**
- Evolui de simples (1 tela) → complexo (4 movimentos) → macro (flywheel)
- Posiciona products (FeelWorks, FeelMind, FeelMakers) como **componentes do sistema**, não protagonistas
- Transmite a ideia de que é um **protótipo da linguagem operacional futura**

### Regra Radical de Design
> "Se um elemento visual não ajuda a explicar uma relação, uma transformação ou uma decisão, ele não entra."

Consequência técnica: toda animação, toda transição, todo movimento de elemento é **semântico**. Não há "decoração por estar disponível".

Exemplos de movimento com significado:
- Conexão aparece = relação foi criada
- Camada aparece = contexto foi adicionado
- Nó se fortalece = existe evidência
- Ciclo fecha = houve aprendizado
- Sistema cresce = nova interação

### Estrutura de Navegação (não tradicional)
- **Não há menu.** Navegação é por scroll (vertical) e por cliques em elementos (exploração).
- **Primeira tela:** design radical — só FEEL + "Transforming problems into capabilities..." + sinal visual de que há mais abaixo.
- **Interatividade:** cliques em conceitos-chave (PROBLEMA, RESULTADO, CAPACIDADES, etc.) abrem sub-narrativas.
- **Retorno:** voltar fecha a sub-narrativa, não leva a uma outra página.
- **Zoom conceitual:** de micro (uma prova individual) para macro (flywheel global).

---

## 2. Comparação de Stacks — Análise Detalhada

### Opção 1: HTML/CSS Puro (+ vanilla JS)

**Pros:**
- Máxima clareza: código é o conceito visual
- Zero overhead de bundle; carrega instantaneamente
- Facilita que não-devs (como um diretor criativo) entendam/editem
- Performance pura em scroll (se bem otimizado)

**Cons:**
- Parallax e movimento coordenado = muito código imperativo (manipulação manual de `transform`, `scroll` listeners)
- Difícil manter semântica de movimento conforme a complexidade cresce
- Refatorar é custoso (não há componentização clara)
- Escalar para dados dinâmicos (quando Feel tiver rede real) é rewrite completo
- Debugging de interações é mais árduo (não há dev tools de componentes)

**Complexidade de implementação: MÉDIA-ALTA**
- Parallax puro: moderado
- Revelar elementos ao scroll: moderado
- Coordenar múltiplas animações com significado: alto
- Fazer responsivo sem quebrar semântica: alto

**Quando usar:** se a experiência for forever estática e a prioridade for "código legível para não-devs". Hoje isso não parece ser o caso.

---

### Opção 2: React + Framer Motion (SPA)

**Pros:**
- Componentização clara = fácil manter "cada movimento tem significado"
- Framer Motion é **feita para motion design**, tem primitivas de parallax/scroll triggers prontas
- `useScroll`, `useMotionValueEvent`, `useViewportScroll` — tudo integrado
- Facílimo mudar timing, easing, comportamento sem tocar em CSS
- Dev tools excelentes (React DevTools, Framer Motion playground)
- Responsivo é natural (componentes adaptam por prop)

**Cons:**
- Mais bundle (React + Framer Motion ~50-60kb gzipped)
- Sem SSR: quando Feel tiver dados reais (perfis, provas, inteligência dinâmica), você vai querer hydration/SSR
- Build/deploy mais complexo (Vercel, Netlify, etc.)
- Requer conhecimento de React para manutenção

**Complexidade de implementação: MÉDIA**
- Setup inicial: simples
- Componentes de movimento: muito simples (Framer Motion abstrair tudo)
- Coordenação de múltiplas animações: simples (composition model excelente)
- Responsivo: simples

**Quando usar:** se quiser máxima flexibilidade de movimento + facilidade de manutenção + plano de escalar para dados dinâmicos.

---

### Opção 3: Next.js 15 (App Router) + Framer Motion

**Pros:**
- Tudo que React + Framer Motion oferece
- Mais: SSR pronto → começa estático, evolui para dados dinâmicos sem rewrite
- Image optimization nativa (`next/image`)
- Font optimization (fontes custom são pesadas)
- Built-in analytics/observability
- Vercel deploy é um `git push`
- Começa como SPA, vira app conforme escala

**Cons:**
- Complexidade inicial maior (não é só React, é um framework opinionado)
- Build time um pouco mais longo que SPA puro (negligenciável em 2026)
- Se usar SSR, precisa pensar em hydration (não é mágico)

**Complexidade de implementação: MÉDIA**
- Setup inicial: um pouco mais que React puro, mas Vercel CLI atalha
- Componentes de movimento: idêntico a React + Framer Motion
- Responsivo: idêntico
- Escalar para dados dinâmicos: natural (middleware, dynamic routes, cache já existem)

**Quando usar:** **recomendação deste planejamento**. Oferece 90% da simplicidade de React + Framer Motion, mas abre a porta para a Feel System virar um sistema vivo com dados reais sem refactor em 6–12 meses.

---

### Matriz de Decisão

| Critério | HTML/CSS | React | Next.js |
|----------|----------|-------|---------|
| Motion design semântico | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Performance em scroll | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Manutenibilidade | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Escalabilidade para dados | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Tempo até MVP | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Transparência de código | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Vencedor:** Next.js (melhor trade-off geral).

---

## 3. Arquitetura de Dados e Hierarquia Visual

### Estrutura Conceitual

```
FEEL SYSTEM
│
├─ TELA 1: O Começo (entry point)
│  └─ Centro: FEEL + "Transforming problems..."
│  └─ Hint visual: "scroll down" ou "explore"
│
├─ TELA 2: Os 4 Movimentos (exploração)
│  ├─ RESOLVE
│  │  ├─ Problema
│  │  ├─ Contexto
│  │  ├─ Capacidade
│  │  ├─ Execução
│  │  └─ Resultado
│  │
│  ├─ PROVE
│  │  ├─ Trabalho
│  │  ├─ Evidência
│  │  ├─ Prova (click → detalhe visual)
│  │  └─ Lastro
│  │
│  ├─ LEARN
│  │  ├─ Resultado
│  │  ├─ Contexto
│  │  ├─ Memória
│  │  └─ Inteligência
│  │
│  └─ SCALE
│     ├─ Inteligência
│     ├─ Matching
│     ├─ Novos Problemas
│     └─ Novos Projetos
│
├─ TELA 3: Aprofundamento (sub-narrativas ao clicar)
│  ├─ Click em "Prova" → detalhe expandido
│  ├─ Click em "Capacidades" → aparece Feelmakers/Partners/Technology
│  ├─ Click em "Inteligência" → FeelMind é revelado como camada
│  └─ Click em "Execução" → FeelWorks é revelado como orquestrador
│
├─ TELA 4: Integração de Produtos
│  ├─ FEELMIND (camada que contextualiza)
│  ├─ FEELWORKS (orquestração)
│  ├─ FEELMAKERS/PARTNERS (capacidades)
│  └─ PROVA/LASTRO (confiança)
│
├─ TELA 5: Modelo Econômico (consequência visual)
│  └─ Mostra receitas como resultado natural do sistema
│
└─ TELA 6: Flywheel Final (macro view)
   └─ Todo o sistema vista de cima, ciclo fechado e se auto-alimentando
```

### Hierarquia de Conceitos

**Camada 1 (Foundation):** Problema, Contexto, Resultado
**Camada 2 (Action):** Capacidade, Execução, Trabalho
**Camada 3 (Trust):** Evidência, Prova, Lastro
**Camada 4 (Intelligence):** Memória, Contexto Acumulado, FeelMind
**Camada 5 (Scaling):** Inteligência → Matching → Novos Ciclos

---

## 4. Design System — Motion Semântica

### Princípios de Movimento

| Tipo de Movimento | Significado | Easing | Duração | Exemplo |
|-------------------|------------|--------|---------|---------|
| **Conexão aparece** | Relação foi criada | ease-out | 600ms | Linha conectando Prova → Lastro |
| **Nó cresce** | Evidência acumulou | ease-in-out | 400ms | Nó de Capacidade fica mais "pesado" |
| **Camada desliza** | Contexto novo entrou | ease-out | 500ms | FeelMind aparece como sobreposição |
| **Elemento desvanece saindo** | Ciclo fechou e retornou | ease-in | 400ms | Movimento se afasta na macro view |
| **Parallax ao scroll** | Profundidade + narrativa | linear | scroll-linked | Backgrounds em velocidades diferentes |
| **Ciclo fecha** | Aprendizado → retorno | ease-in-out | 800ms | Animação que traz tudo de volta ao centro |
| **Sistema cresce** | Escala está acontecendo | ease-out | 700ms | Novos nós aparecem recursivamente |

### Tipografia

- **Títulos/conceitos-chave:** Archivo Black (same da Feel), peso 900, comprimida, 2.5–4rem
- **Corpo/contexto:** Inter, regular, 1–1.2rem
- **Dados/métricas:** IBM Plex Mono, 0.875rem
- **Versos/citações:** Garamond ou Playfair (serif para contraste), italic

### Paleta (derivada de Feel tokens)

- **Primária:** `#6C5BFF` (violeta marca)
- **Secundária:** `#2B1FA8` (violeta deep)
- **Papel:** `#FAFAF6` (off-white quente)
- **Tinta:** `#16151D` (quase-preta)
- **Accent:** `#FF5A2D` (ember, parcimonioso)
- **Ritmo scale:** `#F0EFE8` → `#DCD8FB` → `#A99CFF` → `#6C5BFF` → `#2B1FA8` (heatmap)

### Espaçamento

- **Seções:** 20vh a 40vh (breathing room)
- **Elementos internos:** 1rem, 1.5rem, 2rem, 3rem (sistema 8px base)
- **Máx width:** 1200px (confortável para leitura + movimento visual)

---

## 5. Stack Técnico Recomendado — Detalhamento

### Tech Stack: Next.js 15 + Framer Motion + Tailwind v4

**Por que cada peça:**

```
Frontend
├─ Framework: Next.js 15 (App Router)
│  └─ Razão: SSR-ready, Image/Font optimization, Vercel deploy native
│
├─ Motion Design: Framer Motion 11+
│  └─ Razão: Scroll triggers, parallax, coordenação de múltiplas anim sem código imperativo
│
├─ Styling: Tailwind CSS v4 (@theme config)
│  └─ Razão: Design tokens únicos, responsive design integrado, performance (PurgeCSS nativo)
│
├─ Hosting: Vercel
│  └─ Razão: Zero-config Next.js, analytics built-in, preview links
│
└─ Observability: Vercel Analytics (free tier) + Web Vitals
   └─ Razão: Motion design pode impactar performance; precisa medir CLS, LCP, etc.

Styling Utilities
├─ clsx (utility para conditional classes)
├─ tailwind/typography (se houver muito prosa)
└─ tailwind.config.js com design tokens Feel

Animation
├─ Framer Motion (core)
├─ Scroll Observer hooks (compostos do Framer Motion)
└─ Linear Easing para parallax (se quiser controle manual)

Dev Tools
├─ TypeScript strict
├─ ESLint + Prettier
├─ Storybook (futuro: testar componentes de motion)
└─ Playwright (e2e tests de scroll/interação — importante aqui)
```

### Estrutura de Pastas (Next.js 15 App Router)

```
feel-system/
│
├─ app/
│  ├─ layout.tsx                    # root layout (fontes, providers)
│  ├─ page.tsx                      # tela 1: entrada
│  ├─ (sections)/
│  │  ├─ layout.tsx                 # wrapper comum para seções
│  │  ├─ resolve/page.tsx           # tela 2a: RESOLVE
│  │  ├─ prove/page.tsx             # tela 2b: PROVE
│  │  ├─ learn/page.tsx             # tela 2c: LEARN
│  │  └─ scale/page.tsx             # tela 2d: SCALE
│  │
│  └─ (modals)/
│     ├─ @modal/(.)prova/[id]/page.tsx    # intercepted route: modal de prova
│     ├─ @modal/(.)capacidades/page.tsx   # intercepted route: Feelmakers/Partners
│     └─ @modal/(.)inteligencia/page.tsx  # intercepted route: FeelMind reveal
│
├─ components/
│  ├─ ui/
│  │  ├─ ConceptNode.tsx            # bloco visual de um conceito
│  │  ├─ ConnectionLine.tsx         # linha animada entre conceitos
│  │  ├─ SectionHeader.tsx          # cabeçalho de movimento
│  │  ├─ InteractiveDiagram.tsx     # diagrama com cliques
│  │  └─ AnimatedCycle.tsx          # ciclo fechado com movimento
│  │
│  ├─ sections/
│  │  ├─ HeroSection.tsx            # tela 1
│  │  ├─ ResolveFlow.tsx            # RESOLVE visual
│  │  ├─ ProveFlow.tsx              # PROVE visual
│  │  ├─ LearnFlow.tsx              # LEARN visual
│  │  ├─ ScaleFlow.tsx              # SCALE visual
│  │  ├─ EconomicsSection.tsx       # modelo econômico
│  │  └─ FlywheelMacro.tsx          # visão macro final
│  │
│  ├─ layouts/
│  │  ├─ ScrollContainer.tsx        # wrapper com scroll snap (opcional)
│  │  └─ MotionProvider.tsx         # contexto global de motion
│  │
│  └─ modals/
│     ├─ ProvaDetailModal.tsx       # detalhe de uma prova
│     ├─ CapacitiesModal.tsx        # Feelmakers/Partners expand
│     └─ FeelMindModal.tsx          # FeelMind reveal
│
├─ hooks/
│  ├─ useScrollPosition.ts          # derive scroll position
│  ├─ useInViewport.ts              # trigger animations ao entrar em view
│  ├─ useParallax.ts                # parallax coordenado
│  └─ useMotionSequence.ts          # orquestra múltiplas anim
│
├─ lib/
│  ├─ animations.ts                 # export motion variants/presets
│  ├─ easing.ts                     # custom easing functions
│  └─ constants.ts                  # timing, spacing, breakpoints
│
├─ public/
│  ├─ fonts/                        # Archivo, Inter, IBM Plex Mono
│  └─ (images se houver SVG static)
│
├─ styles/
│  ├─ globals.css                   # Tailwind imports + custom @theme
│  └─ animations.css                # keyframes customizadas (se necessário)
│
├─ tailwind.config.ts               # design tokens Feel
├─ tsconfig.json                    # strict mode
├─ next.config.js                   # compression, image optimization
└─ package.json
```

### Dependências (Package.json)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^4.0.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "eslint": "latest",
    "prettier": "latest",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 6. Design System — Componentes de Motion

### Componentes Core (Framer Motion)

**1. ConceptNode**
- Renderiza um nó visual (círculo, quadrado, etc.)
- Props: `label`, `color`, `size`, `isActive`, `onClick`
- Motion: aparece com scale 0 → 1, ganha glow ao hover
- Semântica: representa um conceito

```tsx
<ConceptNode 
  label="Problema"
  color="violet"
  onClick={() => expandProblema()}
  animate={{ scale: isActive ? 1.1 : 1 }}
/>
```

**2. ConnectionLine**
- Linha SVG animada entre dois ConceptNodes
- Props: `from`, `to`, `isActive`
- Motion: traço se desenha via SVG stroke-dasharray
- Semântica: relação apareceu

```tsx
<ConnectionLine from="problema" to="contexto" isActive />
```

**3. SectionHeader**
- Título + subtle hint de "mais abaixo"
- Motion: parallax leve ao scroll, fade in ao entrar em viewport
- Semântica: novo movimento começou

**4. InteractiveDiagram**
- Container que orquestra ConceptNodes + ConnectionLines
- Motion: sequência de entrada (stagger), saída coordenada
- Props: `nodes`, `connections`, `onNodeClick`

**5. AnimatedCycle**
- Renderiza um ciclo fechado (RESOLVE → PROVE → LEARN → SCALE → retorna)
- Motion: rotação suave, nodes se reforçam ao passar
- Semântica: loop fecha, sistema se auto-alimenta

### Hooks de Motion

**useScrollPosition()**
```tsx
const scrollY = useScroll();
const opacity = useMotionTemplate`${scrollY}px`;
// usa para parallax coordenado
```

**useInViewport()**
```tsx
const ref = useRef(null);
const isInView = useInViewport(ref);
const controls = useAnimation();

useEffect(() => {
  if (isInView) {
    controls.start("visible");
  }
}, [isInView]);
```

**useParallax()**
```tsx
const y = useMotionValue(0);
const parallaxY = useTransform(y, [0, 300], [0, 100]); // mais lento
```

**useMotionSequence()**
```tsx
const sequence = [
  [".problema", { scale: 1 }, { duration: 0.5 }],
  [".contexto", { scale: 1 }, { duration: 0.5 }, "-0.3"],
  // stagger e coordenação
];
```

---

## 7. Fluxo de Scroll e Navegação

### Mapa de Telas (1 longa página com seções ou múltiplas rotas?)

**Opção A: Single Page (um scroll contínuo)**
- Vantagem: narrativa fluida, parallax coordenado globalmente
- Desvantagem: performance em mobile (mais DOM ao mesmo tempo)
- Recomendação: sim, com lazy loading de seções fora de viewport

**Opção B: Múltiplas páginas (router Next.js)
- Vantagem: performance, fácil para cachear seções
- Desvantagem: perde continuidade de scroll, parallax entre páginas é complexo
- Recomendação: usar para sub-narrativas (modals), não para fluxo principal

**Decisão:** Opção A (single page) para o fluxo 01–06. Sub-narrativas (detalhe de Prova, FeelMind) abrem como modals (intercepted routes).

### Scroll Triggers e Waypoints

```
0vh — Tela 1: Entrada (FEEL + sinal visual)
  │ fade-in do logo/brand
  │ hint animation (chevron down, sutil)
  
15vh — Tela 2: Os 4 Movimentos começam
  │ seção container entra em view
  │ RESOLVE section aparece primeiro
  
40vh — RESOLVE flow completo
  │ nós entram em sequência
  │ conexões se desenham
  
60vh — PROVE flow
  │ transição suave do anterior
  │ Prova detalha ao clicar
  
80vh — LEARN flow
  │ FeelMind começa a aparecer como camada
  
100vh — SCALE flow
  │ grafo de relações fica visível (consequência)
  
130vh — Integração de Produtos
  │ FeelWorks, FeelMind, FeelMakers aparecem em contexto
  
160vh — Modelo Econômico
  │ receitas como consequência
  
190vh — Flywheel Macro
  │ zoom out visual
  │ tudo se afasta, sistema vira um ciclo
  │ "Every interaction makes the system..."
  
210vh+ — CTA final (ou loop de volta ao início)
```

### Interatividade via Cliques

**Click em conceito expande/aprofunda:**
- Click em "PROBLEMA" → seção RESOLVE expande
- Click em "Prova" (dentro de PROVE) → modal com detalhe
- Click em "Capacidades" → modal com Feelmakers/Partners/Technology grid
- Click em "Inteligência" → modal com FeelMind explicado

**Voltar de modal:** ESC ou click fora, transição suave

---

## 8. Motion Design — Timing e Sequência

### Velocidades de Base

- **Rápido** (UI responsiva): 200ms (easing: ease-out)
- **Médio** (transições): 400–600ms (easing: ease-in-out)
- **Lento** (narrativa): 800ms–1s (easing: ease-in-out)
- **Parallax** (scroll-linked): sem duração, linear sync com scroll

### Sequência de Entrada Principal (Tela 2 onwards)

```
T+0ms: Seção RESOLVE entra em view
  └─ background parallax inicia
  └─ título RESOLVE fades in (200ms, ease-out)

T+200ms: Problema node aparece (scale 0→1, 400ms)
T+300ms: Seta/hint "→" aparece
T+400ms: Contexto node aparece
  └─ Conexão entre Problem e Contexto se desenha

T+500ms: Capacidade node
T+600ms: Execução node
T+700ms: Resultado node
  └─ Todas as conexões completadas

T+1000ms: Bifurcação Resultado → Entregável & Aprendizado (especial)
  └─ Ciclo começa a fechar

T+1600ms: Seção PROVE já visível no scroll, começa sua sequência
```

### Easing Functions

```ts
export const easings = {
  smooth: [0.43, 0.13, 0.23, 0.96],  // ease-in-out
  snappy: [0.34, 1.56, 0.64, 1],      // ease-out (bounce soft)
  subtle: [0.55, 0.055, 0.675, 0.19], // ease-in
  reveal: [0.17, 0.67, 0.33, 0.97],   // entrada suave
};
```

---

## 9. Responsividade

### Breakpoints (Tailwind v4)

- `sm` (640px): mobile
- `md` (768px): tablet small
- `lg` (1024px): tablet large / desktop small
- `xl` (1280px): desktop
- `2xl` (1536px): desktop large

### Adaptações por Breakpoint

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Título (RESOLVE etc) | 2rem | 2.5rem | 3.5rem |
| ConceptNode tamanho | 60px | 80px | 100px |
| Spacing entre seções | 12vh | 16vh | 20vh |
| Máx width container | 100% | 90% | 1200px |
| Parallax intensity | 0.5x | 0.7x | 1x |
| Modal width | 95% | 80% | 600px |

### Performance Mobile

- Lazy loading de seções fora de viewport
- Reduced motion media query (`prefers-reduced-motion`)
  - Se ativa: skip parallax, animações mais curtas (100ms)
  - Manter semântica visual mas sem cinemática
- Touch targets ≥ 44px
- Éviter overflow horizontal

---

## 10. Componentes por Tela — Especificação

### Tela 1: Hero (Entry Point)

**Layout:**
- Flex center, height: 100vh
- Logo Feel (marca) grande, centrado
- Frase curta embaixo: "Transforming problems into capabilities, execution and intelligence."
- Hint visual sutíl: chevron down com pulsação

**Motion:**
- Logo fade-in (300ms, delay 200ms)
- Frase fade-in (300ms, delay 400ms)
- Chevron pulsação infinita (scale 0.9 → 1, 1000ms, ease-in-out)
- Ao scroll, logo parallax para trás (mais lento que background)

**Interação:**
- Click no chevron ou scroll desce para Tela 2
- Nenhum outro clique esperado nesta tela

---

### Tela 2: Os 4 Movimentos (multi-seção)

#### 2a. RESOLVE

**Layout:**
- Título "RESOLVE" (violeta, Archivo)
- Subtítulo: "Problema → Contexto → Capacidade → Execução → Resultado"
- Diagrama interativo: 5 nós em sequência com conexões

**Motion:**
- Nós entram em stagger (100ms delay entre cada)
- Conexões se desenham com strokeDasharray
- Ao hover em nó: glow + label aparece

**Interação:**
- Click em qualquer nó expande breve descrição (tooltip)
- Click em "Resultado" especial: revela bifurcação

**Componentes:**
```tsx
<ResolveFlow>
  <InteractiveDiagram
    nodes={[
      { id: "problema", label: "Problema", color: "violet" },
      { id: "contexto", label: "Contexto", color: "violet-soft" },
      ...
    ]}
    connections={[
      { from: "problema", to: "contexto" },
      ...
    ]}
    onNodeClick={(id) => handleNodeClick(id)}
  />
</ResolveFlow>
```

#### 2b. PROVE

**Layout:**
- Título "PROVE" (cor amber ou violeta deep)
- Sequência: Trabalho → Evidência → Prova (clickable) → Lastro
- Prova renderizada com campos visíveis (quem fez, o que fez, para quem, resultado, quem confirmou)

**Motion:**
- Entrada similar a RESOLVE
- Prova: destaque especial (glow mais forte)
- Ao click em Prova: modal abre com detalhe completo

**Interação:**
- Click em nó Prova abre modal com `@modal/(.)prova/[id]`

#### 2c. LEARN

**Layout:**
- Título "LEARN"
- Ciclo fechado: Resultado → Contexto → Memória → Inteligência → volta ao Resultado
- FeelMind aparece como sobreposição/camada sobre o ciclo

**Motion:**
- Ciclo se desenha como animação contínua (talvez com rotation suave)
- Nós ganham "peso" (glowing maior) conforme ciclo completa
- FeelMind aparece com delay (mostra que é consequência do ciclo)

#### 2d. SCALE

**Layout:**
- Título "SCALE"
- Grafo de relações: Inteligência → Matching → Novos Problemas → Novos Projetos
- Grafo fica progressivamente mais denso (mais nós, mais conexões)

**Motion:**
- Começa com 4 nós principais
- Ao scroll, novos nós aparecem (scale in)
- Conexões se multiplicam (stroke animations)
- Comunicar exponencial growth visualmente

---

### Tela 3: Integração de Produtos (seção com modals)

**Layout:**
- Título: "Como o sistema funciona: as camadas"
- 4 boxes/cards: FeelMind, FeelWorks, FeelMakers/Partners, Prova

**Interação:**
- Click em cada box abre um modal com detalhe
- Modals usam intercepted routes do Next.js

**Motion:**
- Cards entram em stagger ao scroll (useInViewport)
- Cards têm outline animada ao hover

---

### Tela 4: Modelo Econômico

**Layout:**
- Mostra receitas como **consequência** do sistema
- REDE → CAPACIDADES → TRABALHO → PROVAS → CONTEXTO → INTELIGÊNCIA → PRODUTOS → VALOR → RECEITA
- Depois: breakdown de SaaS, Intelligence, Infra, Serviços, Produtos

**Motion:**
- Sequência de entrada: cada etapa da cadeia aparece após a anterior
- Última etapa (RECEITA) se destaca

---

### Tela 5: Flywheel Macro

**Layout:**
- Todo o sistema "voa para trás" (zoom out visual)
- Círculo fechado mostrando o ciclo completo
- Frase: "Every interaction makes the system more intelligent."

**Motion:**
- Grande animação: todos os elementos da tela anterior se afastam
- Se reorganizam em um grande ciclo circular
- Ciclo ganha una rotação suave infinita
- Partículas/luzes podem aparecer no ciclo (opcional, mas semânticas: representam interações)

---

## 11. Roadmap de Implementação

### Fase 1: Setup e Tela 1 (Semana 1)

**Tarefas:**
- [ ] Scaffold Next.js 15 + Framer Motion + Tailwind v4
- [ ] Design tokens em `tailwind.config.ts` (paleta Feel)
- [ ] Tipografia: importar Archivo, Inter, IBM Plex Mono
- [ ] Tela 1 (Hero): logo, frase, chevron pulsante
- [ ] Scroll inicial funciona (hint de mais conteúdo)
- [ ] Deploy test no Vercel

**Critério de sucesso:**
- Tela carrega em <3s (Lighthouse Green)
- Motion é smooth (60fps em Lighthouse)
- Responsivo verifica (mobile/tablet/desktop)

---

### Fase 2: Tela 2a-2d (Semanas 2–3)

**Tarefas:**
- [ ] ConceptNode component + motion
- [ ] ConnectionLine component (SVG + stroke-dasharray)
- [ ] InteractiveDiagram orquestrador
- [ ] ResolveFlow completo (5 nós, 4 conexões)
- [ ] ProveFlow completo (incluindo click em Prova)
- [ ] LearnFlow completo (ciclo fechado + FeelMind aparece)
- [ ] ScaleFlow completo (grafo dinâmico, novos nós ao scroll)
- [ ] Hooks de motion (useInViewport, useParallax, etc)

**Critério de sucesso:**
- Cada seção tem animações semânticas (não cosmética)
- Scroll triggers funcionam (seções entram em timing certo)
- Motion é fluid (60fps)
- Parallax noticeable mas não distrator

---

### Fase 3: Modals e Integração (Semana 4)

**Tarefas:**
- [ ] Intercepted routes para modals (`@modal/(.)prova/[id]`)
- [ ] ProvaDetailModal component (exibe campos estruturados)
- [ ] CapacitiesModal (Feelmakers/Partners grid)
- [ ] FeelMindModal (explicação de IA como camada)
- [ ] FeelWorksModal (orquestração explicada)
- [ ] Tela de Modelo Econômico
- [ ] Tela de Flywheel Macro

**Critério de sucesso:**
- Modals abrem/fecham suave (ESC ou click fora)
- No reflow de layout ao abrir modal (fixed position bem)
- Motion dentro de modal é independente da main page

---

### Fase 4: Polish e Responsividade (Semana 5)

**Tarefas:**
- [ ] Audit de performance (Lighthouse)
- [ ] Responsividade completa (mobile breakpoints)
- [ ] Reduced motion media query (acessibilidade)
- [ ] E2E tests com Playwright (scroll triggers, clicks)
- [ ] Design review (semântica de movimento)
- [ ] Copy review (textos, frases)

**Critério de sucesso:**
- Lighthouse: 90+
- CLS < 0.1 (no layout shift)
- Passa em acessibilidade
- Mobile experience é equally smooth

---

### Fase 5: Dados Dinâmicos (Roadmap futuro, não agora)

Quando Feel System virar "viva" com dados reais da rede:
- [ ] API layer (SSR de dados real de Prova, Inteligência, etc)
- [ ] ISR (incremental static regeneration) para seções com dados
- [ ] Search/filtering interativo
- [ ] User profiles integrados

---

## 12. Checklist de Decisões de Arquitetura

- [x] Stack: Next.js 15 + Framer Motion + Tailwind v4
- [x] Navegação: Single page (scroll) + modals (intercepted routes)
- [x] Motion: Semântica (toda anim tem significado)
- [x] Responsividade: Mobile-first (Tailwind breakpoints)
- [x] Performance: Lazy load seções, no-layout-shift, parallax otimizado
- [x] Acessibilidade: `prefers-reduced-motion`, alt text, keyboard nav
- [x] Deployment: Vercel (native Next.js)

---

## 13. Estrutura de Componentes — Pseudocódigo

### App Layout

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <FontsPreload />
        <Meta />
      </head>
      <body className="bg-paper text-ink">
        <MotionProvider>
          <ScrollObserver>
            {children}
          </ScrollObserver>
        </MotionProvider>
      </body>
    </html>
  );
}
```

### Page Structure

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <HeroSection />
      <section id="movements">
        <ResolveFlow />
        <ProveFlow />
        <LearnFlow />
        <ScaleFlow />
      </section>
      <section id="integration">
        <ProductsIntegrationSection />
      </section>
      <section id="economics">
        <EconomicsSection />
      </section>
      <section id="flywheel">
        <FlywheelMacroSection />
      </section>
    </main>
  );
}
```

### Component: InteractiveDiagram

```tsx
interface Node {
  id: string;
  label: string;
  color: "violet" | "violet-deep" | "violet-soft" | "ink";
  x?: number;
  y?: number;
}

interface Connection {
  from: string;
  to: string;
}

export function InteractiveDiagram({
  nodes,
  connections,
  onNodeClick,
}: {
  nodes: Node[];
  connections: Connection[];
  onNodeClick: (id: string) => void;
}) {
  const containerRef = useRef(null);
  const isInView = useInViewport(containerRef);

  return (
    <div ref={containerRef} className="relative w-full h-96">
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn) => (
          <ConnectionLine key={`${conn.from}-${conn.to}`} {...conn} isActive={isInView} />
        ))}
      </svg>
      <div className="flex justify-around items-center h-full">
        {nodes.map((node) => (
          <ConceptNode
            key={node.id}
            {...node}
            isActive={isInView}
            onClick={() => onNodeClick(node.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Component: ConceptNode

```tsx
export function ConceptNode({
  id,
  label,
  color,
  isActive,
  onClick,
}: {
  id: string;
  label: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      });
    }
  }, [isActive]);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
      whileHover={{ scale: 1.1 }}
      className={`relative w-24 h-24 rounded-full bg-${color} cursor-pointer`}
      onClick={onClick}
    >
      <span className="text-sm font-bold text-ink">{label}</span>
    </motion.button>
  );
}
```

---

## 14. Guia de Estilo de Código

### Regras Gerais

1. **Componentes são puros:** nenhuma side effect fora de `useEffect`
2. **Motion props isoladas:** `animate`, `whileHover`, etc separados de className
3. **Nomes descritivos:** `useScrollPosition`, `isInViewport`, não `useSP`, `inView`
4. **TypeScript strict:** nenhum `any`
5. **Tailwind over CSS:** preferir classes a `style` prop
6. **Motion em componentes:** cada animação é um "smart component" (Framer Motion wrapper)

### Naming Conventions

- Componentes: PascalCase (`ConceptNode.tsx`)
- Hooks: camelCase com prefixo `use` (`useParallax.ts`)
- Funções utilitárias: camelCase (`calculateNodePosition.ts`)
- Classes Tailwind: kebab-case (`bg-violet`, `text-ink`)
- Variáveis de estado: camelCase (`isExpanded`, `scrollY`)

---

## 15. Arquitetura de Dados (quando Feel tiver dados reais)

**Hoje:** estático (MDX ou dados hardcoded).

**Futuro:** quando FeelWorks tiver rede viva:

```ts
interface Prova {
  id: string;
  criador: { id: string; name: string; handle: string };
  marca: { id: string; name: string };
  resultado: string;
  assinaturas: number;
  data: Date;
  lastro: {
    nProvasVerificadas: number;
    marcasDistintas: number;
    marcasRecorrentes: number;
  };
}

interface Inteligencia {
  id: string;
  tipo: "matching" | "recomendacao" | "contexto";
  confianca: number;
  fonte: string; // "FeelMind", "Historico", etc
}

// SSR: fetch de API no server
// ISR: revalidate a cada 1h
export const revalidate = 3600;
```

---

## Conclusão e Próximas Etapas

### Recomendação Final

**Tech Stack: Next.js 15 + Framer Motion + Tailwind v4**

Por quê:
1. **Motion design é central**, não cosmética → Framer Motion é a ferramenta certa
2. **Escalabilidade:** começa estático, evolui para dados vivos sem rewrite
3. **Performance:** next/image, next/font, Vercel optimizations nativas
4. **Developer experience:** TypeScript, componentes reutilizáveis, hot reload
5. **Deploy:** Vercel é um `git push`

### Próximo Passo Real

1. **Criar o repositório:** `feel-system` no GitHub
2. **Scaffold:** `npx create-next-app@latest --typescript --tailwind`
3. **Instalar Framer Motion:** `npm install framer-motion`
4. **Configurar:** `tailwind.config.ts` com tokens Feel
5. **Começar Fase 1:** Hero section com motion básica

### Arquivos Auxiliares a Criar

- `lib/animations.ts` — motion variants e presets
- `lib/constants.ts` — timing, spacing, breakpoints
- `hooks/useParallax.ts` — hook de parallax
- `hooks/useInViewport.ts` — trigger animations ao entrar em view
- `components/ConceptNode.tsx` — primeiro componente de motion
- `app/page.tsx` — homepage com estrutura

---

**Status:** ✅ Planejamento completo, pronto para implementação
**Próxima Fase:** implementação iterativa (Semanas 1–5 por fases)
