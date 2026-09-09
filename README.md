# Feel System

> A Feel não cria valor. Ela revela.
> O design revela, nunca grita.

Este repositório não é um site sobre a Feel. É a **materialização executável da tese** —
uma única camada semântica que alimenta, ao mesmo tempo:

- **5 boards** — infográficos 16:9, exportáveis em 4K para apresentação;
- **a experiência** — narrativa em scroll, pública, no Vercel.

Mesma fonte de dados, dois renderizadores. É isso que faz os cinco boards parecerem
partes do mesmo organismo, e não cinco artes diferentes.

---

## Ordem de leitura (humanos e agentes)

| # | Arquivo | O que é |
|---|---|---|
| 1 | [`DESIGN.md`](DESIGN.md) | Tokens e gramática. **O compilador, não o handoff.** |
| 2 | [`marca/SISTEMA-DE-MARCA.md`](marca/SISTEMA-DE-MARCA.md) | As leis travadas da v2 |
| 3 | [`CLAUDE.md`](CLAUDE.md) | Tese, arquitetura, quarentenas, fases |
| 4 | [`AGENTS.md`](AGENTS.md) | Convenções técnicas e checklist de review |
| 5 | [`docs/decisoes/log.md`](docs/decisoes/log.md) | D-01…D-15 e critérios de reabertura |
| 6 | [`docs/01-linguagem/LINGUAGEM.md`](docs/01-linguagem/LINGUAGEM.md) | A gramática aplicada a diagrama |
| 7 | [`MEMORY.md`](MEMORY.md) | Índice da Memória Viva |

**Hierarquia em caso de conflito:** `DESIGN.md` > `SISTEMA-DE-MARCA.md` > Tese
Estratégica v1 > `CLAUDE.md` > log de decisões > `docs/planejamento/` (histórico) >
Inventário Intelectual (superado, D-13).

---

## Mapa do repositório

```
DESIGN.md                    tokens + gramática — gera web/src/tokens/ (D-08)
CLAUDE.md · AGENTS.md · MEMORY.md
.claude/
  settings.json              permissões + hooks de governança
  commands/                  /resume · /save · /teste
  skills/feel-diagram/       a gramática como skill de projeto
marca/                       o sistema de marca v2
  00-tese/                   a tese de negócio
  01-marca/                  Sistema de Marca, Gramática do Fio, Componentes, obras
  02-feelworks/              o produto
  03-feelmakers/             o espaço físico (Patteo)
  04-parcerias/ 05-narrativas/
  assets/                    wordmark e símbolo em SVG
docs/
  01-linguagem/LINGUAGEM.md  a gramática aplicada a diagrama
  02-boards/                 um brief por board (01…05)
  03-experiencia/            mapa de scroll e sequências de draw-in
  decisoes/log.md            D-01…D-15
  sessoes/                   handoffs
  planejamento/              os 5 docs originais — HISTÓRICO, não lei
memory/                      Memória Viva (Zettelkasten atômico)
contexto/                    material bruto: pdf, imagens, vídeo, transcrições
scripts/ingest/              yt-dlp → transcrição → memory/inbox
scripts/export/              Playwright → boards PNG/PDF 4K
web/                         a aplicação Next.js  ← Vercel Root Directory
```

---

## Estado

**Fase 0 concluída** — fundação, linguagem, memória e governança.

**Fase 1 bloqueada** — requer **Node.js**, que não está instalado nesta máquina:

```bash
winget install OpenJS.NodeJS.LTS
```

Depois abra um terminal novo (o PATH só atualiza em sessão nova) e confirme com `node -v`.

Roadmap completo em [`CLAUDE.md`](CLAUDE.md) § Fases.

---

## Os cinco boards

Reconstruídos sobre a Tese Estratégica v1 (D-14). Os 4 infográficos anteriores
reprovaram em 3 das 5 perguntas d'O Teste e foram substituídos.

| # | Board | Pergunta que responde |
|---|---|---|
| 01 | O sistema | O que é a Feel? |
| 02 | Da opacidade à prova | Como funciona na prática? |
| 03 | O lastro | Por que cada trabalho vira ativo? |
| 04 | A rede | O que exatamente se acumula? |
| 05 | A espiral | Por que fica mais valioso? |

---

## O Teste

Cinco perguntas antes de travar qualquer peça. Qualquer "não" = remove 30% e refaz.

1. Sem o logotipo — ainda parece Feel?
2. Sem a cor — ainda parece Feel?
3. Sem os efeitos — ainda comunica clareza?
4. Em preto e branco — continua elegante?
5. Se copiarem a paleta — sobra algo impossível de copiar?

Rode com `/teste <arquivo>`.

---

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 (`@theme` gerado do
`DESIGN.md`) · Motion · Vercel (Root Directory = `web/`)
