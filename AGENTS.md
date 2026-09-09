# AGENTS.md — Convenções técnicas

Complemento operacional do `CLAUDE.md`. Aquele traz a tese e as leis; este traz como
escrever o código sem violá-las.

---

## Pré-requisitos

| Ferramenta | Estado | Instalação |
|---|---|---|
| Git | ✅ 2.55.0 | — |
| **Node.js ≥ 20** | ❌ **ausente** | `winget install OpenJS.NodeJS.LTS` |
| Python 3 | ❌ ausente | `winget install Python.Python.3.12` — só para ingestão |
| ffmpeg | ❌ ausente | `winget install Gyan.FFmpeg` — só para ingestão |

**Fase 1 em diante está bloqueada até o Node existir.** Depois de instalar, abra um
terminal novo (o PATH só atualiza em sessão nova) e confirme com `node -v`.

⚠️ O caminho do repositório tem espaço e acento (`Área de Trabalho`, `Ecossistema Feel`).
**Todo comando com caminho precisa de aspas.**

---

## Ordem de construção (obrigatória)

Herdada do Massa Hub e válida aqui pelo mesmo motivo: *"se o schema vier antes, o
domínio vira refém do banco"*. Aqui a tradução é:

```
1. dados semânticos   web/src/data/*.ts      ← nós, arestas, estados
2. tokens             gerados do DESIGN.md   ← nunca escritos à mão
3. primitivas         components/diagram/    ← Node, Edge, Fio, Frame
4. composição         <Board> / <Scene>
5. copy               web/src/content/
```

Nunca começar por "desenhar a tela". Se a posição de um nó não pode ser derivada dos
dados por um layout determinístico, o modelo de dados está errado — não o layout.

---

## Estrutura

```
DESIGN.md                    tokens + gramática — o compilador (D-08)
CLAUDE.md · AGENTS.md · MEMORY.md
.claude/
  settings.json              permissões + hooks de governança
  commands/                  save · resume · board · decisao · teste
  skills/feel-diagram/       a gramática como skill de projeto
docs/
  01-linguagem/LINGUAGEM.md  a gramática expandida e aplicada a diagrama
  02-boards/                 um brief por board (01…05)
  03-experiencia/            mapa de scroll, sequências de draw-in
  decisoes/log.md            D-01…D-15
  sessoes/                   handoffs
  planejamento/              os 5 docs originais — HISTÓRICO, não lei
marca/                       o sistema de marca v2 (.dc.html, assets, tese)
memory/                      Memória Viva
contexto/                    material bruto (pdf, imagens, vídeo, transcrições)
scripts/ingest · scripts/export
web/                         ← Vercel Root Directory
```

---

## Regras duras (verificadas em review)

1. **Nenhum hex literal em `web/`.** Cor vem de `tokens.ts` / var CSS. Lint bloqueia.
2. **Nenhuma família de fonte hardcoded.** Só as duas variáveis de `next/font`.
3. **Nenhuma coordenada literal** em componente de seção. Posição vem de layout sobre dados.
4. **Nenhuma string de copy em JSX.** Copy vem de `web/src/content/`.
5. **Nenhum matiz novo** para diferenciar categoria (D-09). Forma, peso, preenchimento.
6. **Um coral por composição.** Regra do anel. Verificável: `grep` por `coral` no board.
7. **Motion só por `pathLength`/`stroke-dashoffset`** (D-11). Proibido `scale: 0→1`,
   `opacity: 0→1` como entrada, `boxShadow` animado, rotação infinita, partícula, glow.
8. **`tabular-nums` em todo número.**
9. **TypeScript strict. Nenhum `any`.** `tsc --noEmit` limpo é gate de merge.
10. **Placeholders em `[COLCHETES]`.** Número inventado é bug, não estimativa.

---

## Nomenclatura

- Componentes: `PascalCase.tsx` — `NodeGlyph.tsx`, `FioPath.tsx`
- Hooks: `useCamelCase.ts` — `useDrawOnScroll.ts`
- Dados: `NN-slug.ts` — `01-problema.ts`, `05-espiral.ts`
- Conteúdo: `NN-slug.pt-BR.ts`
- Tudo em português no domínio (`prova`, `lastro`, `assinatura`), inglês só no que é da
  linguagem (`Node`, `Edge`, `Board`).

---

## Tokens — o build step (D-08)

```
DESIGN.md (frontmatter YAML)
   └─► scripts/tokens/build.ts
          ├─► web/src/tokens/tokens.css   @theme do Tailwind v4
          └─► web/src/tokens/tokens.ts    tipado, para lógica
```

Ambos com cabeçalho `/* GERADO A PARTIR DE DESIGN.md — NÃO EDITE */`.
`npm run tokens:check` falha se os gerados divergirem do `DESIGN.md`. Roda no CI e no
hook de pre-commit.

Para mudar um token: **edita o `DESIGN.md`**, roda `npm run tokens`, commita os três.

---

## Testes

| Camada | Ferramenta | O que cobre |
|---|---|---|
| Dados | Vitest | invariantes do grafo: aresta sem nó órfão, ciclo fechado onde deve, um nó focal por board |
| Tokens | Vitest | `tokens.ts` bate com o frontmatter do `DESIGN.md` |
| Lei visual | Vitest | **um coral por board**; nenhum matiz fora da paleta; contraste AA |
| E2E | Playwright | scroll triggers, draw-in completa, modal abre/fecha, ESC |
| Export | Playwright | os 5 boards renderizam em 3840×2160 sem overflow |

O teste de "lei visual" é o `O Teste` na parte automatizável. As perguntas 1, 2 e 4 do
Teste da Feel são verificáveis por código — renderizar sem coral e sem wordmark e
comparar estrutura. Vale construir.

---

## Comandos

```bash
npm run dev            # dev server
npm run tokens         # regenera tokens do DESIGN.md
npm run tokens:check   # falha se dessincronizado
npm run export         # os 5 boards em PNG 4K + PDF
npm run test           # vitest
npm run e2e            # playwright
npx tsc --noEmit       # gate de merge
```

---

## Git

- `main` = produção. Deploy automático no Vercel.
- Feature branches por peça: `board/03-lastro`, `cena/prove`.
- Commits pequenos, descritivos, **em português**.
- **Commit e push exigem aprovação explícita nesta sessão** (D-05). O agente não se
  auto-aprova.
- Migrations e mudanças de token nunca entram no mesmo commit que mudança visual.

---

## Checklist de code review

**Conformidade com a lei:**
- [ ] Rodou O Teste (5 perguntas)? Anexou o veredito?
- [ ] Um coral por composição?
- [ ] Nenhum matiz fora da paleta do `DESIGN.md`?
- [ ] 5:8:5 presente e com corte assimétrico?
- [ ] O fio entra e sai do quadro — não fecha?
- [ ] Motion é draw-in, não aparição?
- [ ] Números tabulares?
- [ ] Nenhum dado inventado (só `[COLCHETES]`)?

**Conformidade com a arquitetura:**
- [ ] Nenhum hex, fonte ou coordenada literal?
- [ ] Copy fora do JSX?
- [ ] Board e cena consomem o mesmo `data/`?
- [ ] `tsc --noEmit` limpo?
- [ ] Nenhuma capacidade em quarentena apresentada como presente?
