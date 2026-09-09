# Sessão 2026-08-11 — Fundação, linguagem e correção de rumo

## O que foi feito

**Repositório criado e unificado.** `git init` na pasta existente; material bruto
reorganizado em `contexto/` (pdf, imagens, vídeo, transcrições, binários); os 5
documentos de planejamento movidos para `docs/planejamento/`.

**Sistema de marca v2 incorporado.** `FeelCompany - CLAUDE DESIGN` (11 MB úteis)
copiada para `marca/`. `DESIGN.md` promovido à raiz como fonte de verdade dos tokens.
Deixados de fora: `uploads/` (93 MB de duplicatas aninhadas) e o zip de assets;
`Assets Google Drive Axel/` foi para `contexto/binarios/`, fora do git.

**Constituição.** `CLAUDE.md` (tese, leis visuais, quarentena, O Teste, fases) e
`AGENTS.md` (pré-requisitos, ordem de construção, 10 regras duras, checklist de review).

**Log de decisões.** D-01 a D-15 em `docs/decisoes/log.md`, cada uma com os quatro
campos. **D-02 revogada** e substituída por D-02.1.

**Linguagem.** `docs/01-linguagem/LINGUAGEM.md` — a gramática do fio aplicada a
diagrama, incluindo a solução do problema das 7 entidades.

**Skill de projeto.** `.claude/skills/feel-diagram/` — a gramática executável, para que
toda peça futura nasça no sistema.

**Memória Viva.** 12 notas atômicas em `memory/permanent/` + template + `MEMORY.md`.
Comandos `/resume`, `/save` e `/teste` em `.claude/commands/`.

**Governança.** `.claude/settings.json` com hooks pipe-testados (5 casos, positivos e
negativos) escritos em bash puro — a máquina não tem `jq`.

**Ingestão.** `scripts/ingest/ingerir.sh` — yt-dlp para legenda sem baixar vídeo,
whisper para vídeo local, VTT → markdown com frontmatter → `memory/inbox/`.
Conversor testado de ponta a ponta com VTT sintético.

---

## Decisões tomadas

| # | Decisão |
|---|---|
| D-01 | "Lastro" e "prova" são vocabulário oficial da Feel — confirmado pelo `DESIGN.md` § Voice |
| ~~D-02~~ | **Revogada** — navy + dourado foi inferência de artefatos que violavam o sistema |
| D-02.1 | `DESIGN.md` v2 é a fonte de verdade única dos tokens |
| D-03 | Escopo: 5 boards + experiência scrollytelling |
| D-04 | Uma camada semântica, dois renderizadores |
| D-05 | Governança adotada como padrão, não como dependência (baseline é alpha) |
| D-06 | Memória Viva no repositório, não em vault externo |
| D-07 | yt-dlp é ingestão local, não dependência da aplicação |
| D-08 | `DESIGN.md` gera os tokens; ninguém replica valor à mão |
| D-09 | Entidades por forma, peso e preenchimento — nunca por matiz |
| D-10 | O flywheel é espiral, não anel (Lei 1: o fio nunca fecha) |
| D-11 | Motion é draw-in por `stroke-dashoffset`, nunca aparição |
| D-12 | Os boards são em português |
| D-13 | O Inventário Intelectual é histórico, não lei |
| D-14 | Os 5 boards são reconstruídos do zero, no sistema e na Tese v1 |
| D-15 | Repositório único; sistema de marca em `marca/` |

---

## As duas correções de rumo desta sessão

**1. Os 4 infográficos estavam fora do sistema.** Auditados contra O Teste, reprovaram
em 3 de 5 perguntas: sem o wordmark dourado nada os identifica; a informação está
codificada em 8 matizes (morre em P&B); não há 5:8:5 nem fio. Além disso usam serifa
Didone (fora das duas famílias permitidas) e assinatura em inglês.

**2. Erro de conteúdo, não só de forma.** Os boards expressavam o enquadramento do
Inventário (camada de inteligência, FeelMind, Creative Intelligence). A Tese
Estratégica v1 §04 lista IA de conteúdo e automação pesada como **"não construir
agora"**. Refazer com capricho visual a narrativa desatualizada seria caprichar na
embalagem do conteúdo errado. Decidido com o usuário: Tese v1 vence.

---

## O que ficou aberto

- **Os 4 PNGs de referência** não estão em `contexto/imagens/boards/`. Ver o `LEIA-ME.md`
  de lá. Servem para amostrar cor e como critério de aceite do export — mas com D-02.1
  a paleta vem do `DESIGN.md`, então deixaram de ser bloqueantes.
- **Briefs dos 5 boards** (`docs/02-boards/01…05`) ainda não escritos. É o próximo
  entregável e não depende de Node.
- **Mapa de scroll** (`docs/03-experiencia/`) precisa ser reescrito: os snippets de
  `feel-system-fluxo-visual.md` usam `scale: 0→1` para entrada, proibido pela D-11.

---

## Bloqueios

**Node.js não está instalado.** Bloqueia a Fase 1 inteira (scaffold `web/`, gerador de
tokens, export). `winget install OpenJS.NodeJS.LTS`, depois terminal novo.

**Python e ffmpeg ausentes** — só afetam `scripts/ingest/`, não o caminho principal.

**Hooks ativam na próxima sessão.** `.claude/settings.json` não existia quando esta
sessão começou, então o watcher de configuração não o carregou. Os comandos foram
pipe-testados e estão corretos; passam a valer ao reabrir o Claude Code.

**Nada foi commitado.** D-05: commit exige aprovação explícita.

---

## Próximo passo

Instalar Node.js e rodar a Fase 1: gerador de tokens a partir do `DESIGN.md` + scaffold
`web/` + primeiro deploy vazio no Vercel para fechar o circuito cedo. Em paralelo (não
depende de Node): escrever os briefs dos 5 boards em `docs/02-boards/`.
