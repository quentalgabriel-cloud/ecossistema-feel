# Feel System — Resumo Executivo

**Leia isto primeiro. Depois aprofunde nos 3 documentos de planejamento.**

---

## O Que Você Pediu

> Uma experiência visual interativa que revela como a Feel pensa. Começa brutalmente simples, evolui através de movimento com significado, e comunica a tese core: "cada resultado alimenta o sistema como conhecimento."

Sem menu tradicional. Sem explicação em prosa. O sistema é **experimentado** através de scroll, parallax e interatividade.

---

## O Que Você Está Construindo

**Não é um site sobre Feel.**

É um **protótipo executável da linguagem operacional futura** — uma interface que demonstra visualmente como Feel pensa, funciona e evolui.

### A Estrutura Conceitual

```
MOVIMENTO 1: RESOLVE
Problema → Contexto → Capacidade → Execução → Resultado

MOVIMENTO 2: PROVE
Trabalho → Evidência → Prova → Lastro

MOVIMENTO 3: LEARN
Resultado → Contexto → Memória → Inteligência (ciclo fechado)

MOVIMENTO 4: SCALE
Inteligência → Matching → Novos Problemas → Novos Projetos (exponencial)

PAYOFF:
Sistema vira um ciclo. Cada interação o torna mais inteligente.
"Every interaction makes the system more intelligent."
```

---

## A Recomendação Técnica

### Stack: **Next.js 15 + Framer Motion + Tailwind v4**

**Por quê essa stack, não as outras:**

| Consideração | HTML/CSS Puro | React | Next.js |
|---|---|---|---|
| Motion design é central? | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Fácil escalar para dados? | ❌ | ⚠️ | ✅ |
| Manutenibilidade | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Transparência de código | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**HTML/CSS puro** é elegante se a experiência for eternamente estática. Mas você quer poder, em 6–12 meses, quando Feel tiver rede viva com dados reais (Provas, Inteligência), virar isso em um sistema dinâmico **sem reescrever tudo**.

**React puro** resolveria motion design bem. Mas Next.js oferece a mesma facilidade de motion (Framer Motion é agnóstico) PLUS SSR/ISR/image optimization quando escalar.

**Next.js é o vencedor** porque:
- ✅ Começa como SPA estática (simples, rápido)
- ✅ Framer Motion resolve motion design semântico perfeitamente
- ✅ Evolui para SSR com dados quando Feel tiver rede real
- ✅ Vercel deploy é `git push`
- ✅ Tailwind v4 com design tokens Feel é nativo

---

## O Que Cada Documento Contém

### 1. **feel-system-planejamento-tecnico.md** (~40 páginas)
Leia se você quer entender **por quê** cada decisão foi tomada.

Contém:
- Análise detalhada de cada stack (pros/cons)
- Arquitetura hexagonal e estrutura de pastas
- Design system (tokens, tipografia, paleta, motion)
- Timing de animações com significado semântico
- Responsividade por breakpoint
- Roadmap de 5 fases com cronograma
- Checklist de decisões de arquitetura

**Tempo de leitura:** 45 minutos a 1h

---

### 2. **feel-system-fluxo-visual.md** (~30 páginas)
Leia se você quer **visualizar** como o usuário experiencia o sistema.

Contém:
- Mapa de scroll completo (0vh → 210vh+)
- Sequências de motion em cada tela
- Fluxos de interatividade (clicks, modals, tooltips)
- Exemplos de código motion (Framer Motion)
- Padrão de responsividade mobile
- Fluxo de dados (hoje vs futuro)

**Tempo de leitura:** 30 minutos

---

### 3. **feel-system-quick-start.md** (~25 páginas)
Leia se você quer **começar a implementar agora**.

Contém:
- Setup em 5 minutos
- Snippets prontos de código (copy-paste)
- Componentes funcionando (Hero, ConceptNode, InteractiveDiagram)
- Padrão de modal com intercepted routes
- Checklist de implementação por fase
- Estrutura final de pastas
- Deploy no Vercel

**Tempo de leitura:** 20 minutos + tempo para implementar (2–3 semanas)

---

## As Decisões Críticas Resumidas

### 1. Motion Design é Semântico (Não Cosmético)

Cada animação comunica algo:
- **Nó aparece** = conceito foi introduzido
- **Conexão se desenha** = relação foi criada
- **Ciclo fecha** = aprendizado aconteceu
- **Sistema cresce** = escala está aumentando

Isso é o oposto de "animar porque é bonito". Cada pixel se move por razão.

### 2. Navegação é por Scroll + Click (Não Menu Tradicional)

Sem menu com 15 itens. A pessoa **explora** scrollando e clicando em elementos. Modals abrem ao clicar para aprofundamento.

### 3. Single Page, Não Multi-Rota

O fluxo narrativo é **contínuo** (0vh → 210vh+). Modals de detalhe usam intercepted routes do Next.js, mas não quebram o fluxo.

### 4. Dados Dinâmicos no Futuro, Não Agora

Hoje: tudo é hardcoded em componentes.

Amanhã (Q1 2027, quando Feel tiver rede): SSR de dados reais da Massa Hub, ISR para revalidar periódico.

Isso é possível **porque escolhemos Next.js**, não HTML/CSS puro.

### 5. Prova, Lastro, Inteligência como Camadas

Os produtos Feel (FeelWorks, FeelMind, FeelMakers) não aparecem logo. Aparecem como **componentes do sistema**, não protagonistas.

Isso inverte a narrativa: "problema → solução" em vez de "produto → use".

---

## Que Acontece Agora

### Passo 1: Leitura (Hoje, ~2h total)
- Leia este documento
- Leia os 3 planejamentos (em qualquer ordem)

### Passo 2: Decisão (Hoje/Amanhã)
- Confirma a stack (Next.js + Framer Motion + Tailwind)?
- Quer começar a implementar agora ou vai contratar um dev?

### Passo 3: Setup Técnico (Dia 1)
Se implementando você mesmo com Claude Code:
```bash
npx create-next-app@latest feel-system --typescript --tailwind
npm install framer-motion
# Configurar tailwind.config.ts com tokens Feel
# Deploy preview no Vercel
```

Tempo: 1 hora.

### Passo 4: Implementação em Fases (Semanas 1–5)
**Fase 1 (Semana 1):** Hero section com motion básica. Verifica parallax.
**Fase 2 (Semanas 2–3):** Os 4 movimentos (RESOLVE, PROVE, LEARN, SCALE) com nós + conexões.
**Fase 3 (Semana 4):** Modals, produtos, economia.
**Fase 4 (Semana 5):** Flywheel, polish, responsividade, performance audit.
**Fase 5 (Semana 6):** Deploy final.

Tempo total: ~6 semanas com 1 dev full-time, ou ~10–12 semanas em paralelo com outras responsabilidades.

---

## O Risco Mais Importante

**Scope creep.** É muito fácil começar a adicionar:
- Mais animações "legais"
- Mais seções
- Mais funcionalidades interativas
- IA/chatbot integrado
- Login de usuários

**Nenhuma dessas coisas ajuda a contar a história.**

Mantenha a regra radical de Gabriel:
> "Se um elemento visual não ajuda a explicar uma relação, uma transformação ou uma decisão, ele não entra."

---

## Performance Alvo

- **Lighthouse:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **CLS (Cumulative Layout Shift):** < 0.1 (sem movimento de layout ao clicar)
- **LCP (Largest Contentful Paint):** < 2.5s (logo/hero carrega rápido)
- **Motion em mobile:** 60fps mesmo em parallax
- **Bundle size:** Next.js default ~200kb gzipped (aceitável)

---

## Se Você Quer Delegar a um Dev

O documento **quick-start.md** é um briefing pronto. Dê para um desenvolvedor que:
- Conhece Next.js / React
- Conhece Tailwind CSS
- Tem vontade de trabalhar com motion design (Framer Motion não é difícil, mas precisa gostar)

Budget: R$ 20k–40k para 6 semanas, ou R$ 8k–12k/mês se em tempo parcial (10–12 semanas).

---

## Se Você Quer Implementar Você Mesmo com Claude Code

Você tem **tudo** que precisa:
- Planejamento técnico completo ✅
- Fluxo visual mapeado ✅
- Snippets de código prontos ✅
- Estrutura de pastas definida ✅
- Checklist de implementação ✅

Os 3 documentos são briefings prontos para Claude Code. Pastas, comanda `npx`, copiar snippets, testar locally, push, deploy.

---

## A Sequência de Leitura Recomendada

**Se você tem 1 hora:**
1. Este documento (10 min)
2. Primeiras 10 páginas do planejamento-tecnico.md (decisões de stack) (15 min)
3. Fluxo-visual.md seções 1–3 (mapa de scroll) (20 min)
4. Quick-start.md seção 0–3 (como começar) (15 min)

**Se você tem 3 horas:**
Leia tudo, mas nesta ordem:
1. Este documento
2. Planejamento-tecnico.md (completo)
3. Fluxo-visual.md (completo)
4. Quick-start.md (completo)

**Se você quer começar em 1 hora:**
1. Este documento
2. Quick-start.md (sections 0–12)
3. Execute `npx create-next-app` + git push
4. Leia o resto depois

---

## Perguntas Frequentes

**P: Isso precisa ser um site? Pode ser um app React standalone?**
R: Pode ser React puro. Mas Next.js oferece mais flexibilidade sem adicionar complexidade. Deploy é más fácil. Escolha Next.js.

**P: Quanto isso vai custar em hospedagem?**
R: Vercel free tier até ~100k requisições/mês. Feel System começa gratuito, então custo é zero. Quando escalar, ~$20–50/mês no Vercel.

**P: Posso usar outra stack (Vue, Svelte, etc)?**
R: Teoricamente sim. Mas Framer Motion é React-first. Vue/Svelte têm equivalentes piores ou menores ecosystems. Stick com Next.js.

**P: Quando Feel tiver dados dinâmicos, como isso muda?**
R: Vai mudar as calls de API, não a arquitetura. Adiciona `async` em algumas funções, SSR em alguns routes, ISR caching. Tudo pensado já no planejamento.

**P: Preciso começar com as 5 fases? Posso fazer só Hero + RESOLVE?**
R: Sim, começa com Hero + RESOLVE. Deploy. Depois adiciona PROVE. Depois LEARN/SCALE. É incremental.

**P: Motion design vai ficar lento em mobile?**
R: Se bem feito (GPU acceleration, reduced motion query), não. Planejamento tem tips de performance. Teste antes de declarar vencedor.

**P: Pode usar um template pronto?**
R: Evita. Templates enchem de código não relacionado. Comece do zero com `create-next-app`. 100 linhas de código seu são melhores que 10k de template.

---

## Próxima Ação

**Escolha uma de três:**

### Opção A: Você implementa com Claude Code
→ Vá para quick-start.md
→ Execute section 0 (setup)
→ Criar PR com Hero section até amanhã
→ Depois expande por fases

### Opção B: Você contrata um dev
→ Envie os 3 documentos para dev
→ Leia junto 1h para align
→ Dev começa no dia seguinte

### Opção C: Você quer aprofundar mais antes de decidir
→ Leia os 3 documentos (3h total)
→ Volta aqui com perguntas concretas
→ Claude ajusta planejamento se necessário

---

## Conclusão

Você tem um briefing técnico completo, mapeado, e pronto para implementação. A stack é clara (Next.js), o fluxo é claro (scroll + 4 movimentos + flywheel), e os snippets são prontos.

Feel System não é um site. É um sistema vivo que comunica através de movimento, transformação visual e narrativa.

**O que falta agora é implementação. Tudo está planejado.**

Escolha seu caminho acima e avance.

---

**Tempo até MVP (Hero + RESOLVE + PROVE):** 3–5 dias
**Tempo até completo (todas as 5 fases):** 5–6 semanas
**Tempo para viver (quando Feel tiver dados reais):** +6–12 meses de integração gradual

Você está no caminho certo. Agora é meter mão na massa.

---

**Documentos acessíveis:**
1. `feel-system-planejamento-tecnico.md` — Referência técnica profunda
2. `feel-system-fluxo-visual.md` — Visualização narrativa
3. `feel-system-quick-start.md` — Setup e snippets prontos
