---
title: Tokens de espaçamento nomeados sequestram utilitários do Tailwind
tags: [web, tailwind, tokens]
created: 2026-10-21
updated: 2026-10-21
status: permanente
type: armadilha
---

# `max-w-md` vale 16px neste repositório

O `DESIGN.md` define `spacing.md = 16px`, `spacing.lg = 28px`. O gerador emite
`--spacing-md`/`--spacing-lg` no `@theme` do Tailwind v4, e o Tailwind passa a resolver
**qualquer** utilitário nomeado (`max-w-md`, `sm:max-w-lg`, `w-xl`) pela escala de
espaçamento, não pela de container. Componentes de terceiros (shadcn) quebram calados:
a coluna de controles da demo FeelID ficou com 16px de largura e o diálogo com 28px.

**Por quê:** os nomes de token da marca (`xs…xl`) colidem com os nomes que o
ecossistema Tailwind assume serem tamanhos de container. O build não acusa nada.

**Como aplicar:** em `web/`, larguras máximas sempre com valor explícito
(`max-w-[28rem]`). Ao importar componente de registry, procurar `max-w-(xs|sm|md|lg|xl)`
antes de usar. O mesmo vale para `cn()`: o `tailwind-merge` precisa conhecer os nomes
de token (`text-style-*`, `text-h1`) ou descarta classes — ver `web/src/lib/utils.ts`.

Relacionadas: [[forma-vence-matiz]]
