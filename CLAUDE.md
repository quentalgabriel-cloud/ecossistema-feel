# Feel System — Constituição

> A Feel não cria valor. Ela revela.
> O design revela, nunca grita.

Este repositório materializa a tese da Feel em duas superfícies que compartilham uma
única camada semântica: **5 boards** (16:9, exportáveis em 4K) e **a experiência**
(narrativa em scroll, pública, no Vercel).

---

## Ordem de leitura obrigatória

Toda sessão lê, nesta ordem, antes de escrever qualquer linha:

1. **`docs/FEEL-HANDOFF-MESTRE-2026-10-05.md`** — tese de negócio e produto digital
   vigentes. Mais recente que a Tese Estratégica v1 abaixo — ver D-16.
2. **`DESIGN.md`** (raiz) — tokens, gramática, componentes. É o compilador, não o handoff.
3. **`marca/SISTEMA-DE-MARCA.md`** — as leis travadas da v2.
4. **Este arquivo** — arquitetura, quarentenas visuais (a tese de negócio vem do item 1).
5. **`docs/decisoes/log.md`** — D-01…D-17. Não reabrir sem o critério.
6. **`MEMORY.md`** — índice da Memória Viva.
7. **`docs/sessoes/`** — o handoff de sessão mais recente.

**Hierarquia em caso de conflito:** para tese de negócio/produto digital,
`docs/FEEL-HANDOFF-MESTRE-2026-10-05.md` > tudo abaixo (D-16). Para sistema de marca/
visual, a ordem original continua: `DESIGN.md` > `SISTEMA-DE-MARCA.md` > Tese
Estratégica v1 (histórica para negócio, ainda base para os boards — D-14) > este
arquivo > log de decisões > `docs/planejamento/` (histórico) > Inventário Intelectual
(superado — D-13).

---

## A tese (Tese Estratégica v1 — D-14) — **histórica para negócio, ver D-16**

> Esta seção descreve a tese original (ago/2026). Para tese de negócio e produto
> digital vigente, ler `docs/FEEL-HANDOFF-MESTRE-2026-10-05.md` — a definição de
> "economia criativa" abaixo é classificada como LEGADO/SUPERADO lá. Esta seção
> continua sendo a base da reconstrução dos 5 boards (D-14) até que isso mude.

A Feel é **infraestrutura de reputação, confiança e coordenação** para a economia
criativa. Não é plataforma de creator, não é agência, não é marketplace.

**O problema.** Contratar criatividade é apostar às cegas. A prova é auto-declarada
(mediakit em PDF, print de depoimento). Redes sociais organizam audiência; sites de
freelancer organizam preço. **Ninguém organiza reputação aplicada ao trabalho.**

**A categoria.** Infraestrutura de reputação verificável para a economia criativa.

**A sequência — e ela é lei de escopo:**
1. **Primeiro a confiança.** Perfil verificável: lastro + prova de dupla assinatura +
   dados na fonte. É o FeelWorks (Fase A).
2. **Depois a coordenação.** Matching varejo↔profissional sobre a confiança já
   estabelecida. Só quando o lastro tiver massa.

**Os ativos difíceis de copiar:** catalisador físico (endereço no shopping) · lastro
acumulado e portável · prova co-assinada · rede coordenada por praça.

**A pergunta que orienta tudo:** *se a Feel der muito certo, o que passa a existir no
mercado que hoje não existe?* — Um registro público e verificável de reputação
profissional criativa. Contratar deixa de depender de quem você conhece.

---

## Quarentena (o que NÃO se constrói)

Da Tese v1 §04, e é vinculante para o conteúdo dos boards e da experiência:

- ❌ IA de conteúdo, automação pesada, agentes autônomos
- ❌ Inbox / CRM de e-mail
- ❌ Marketplace nacional, ambição geográfica precoce
- ❌ Monetização precoce

**Consequência direta.** "FeelMind", "Creative Intelligence" e "camada cognitiva" não
aparecem como presente em nenhuma peça. Se aparecerem, é como horizonte explicitamente
marcado — nunca como capacidade existente. Ver D-14.

**O anti-padrão vigiado:** *expandir a tese antes de executar a tese.* Toda proposta de
feature nova responde primeiro: isso serve à camada de confiança, agora?

---

## Arquitetura — uma camada semântica, dois renderizadores (D-04)

```
web/src/data/*.ts        nós, arestas, legendas, estados   ← a gramática
       ├──► <Board>      16:9 estático, export 4K
       └──► <Scene>      scroll-driven, draw-in
```

Nenhum componente define conteúdo. Nenhum dado é escrito duas vezes. Board divergindo
da cena é bug, não variação.

**Proibido:** SVG desenhado à mão; `cx`/`cy` literais em componente de seção; string de
copy dentro de JSX; hex literal em qualquer arquivo de `web/`.

---

## As leis visuais (de `DESIGN.md` — resumo operacional)

| Lei | Regra |
|---|---|
| **Dosagem** | 90 neutros / 8 coral / 2 glass. Inegociável. |
| **Regra do anel** | **Um** elemento coral por composição. Se a peça só funciona colorida, não está pronta. |
| **Amber** | `#F0A63B` exclusivo FeelMakers. Nunca com coral na mesma peça. |
| **Tipografia** | Archivo + IBM Plex Mono. Só. Nunca Inter/Space Grotesk/JetBrains. Números sempre tabulares. |
| **Modos** | Claro é o sistema. Escuro é o palco (evento, FeelMakers). |
| **Gramática** | 5:8:5, corte assimétrico, terminal redondo r=0.5u, peso 2.6px em canvas 24u, cruzamento 32°. |
| **O fio nunca fecha** | Entra e sai do quadro. Nenhuma trajetória está concluída. |
| **Motion** | A marca *se desenha*. Desenhar · revelar · conectar · respirar · deslizar · entrelaçar. Proibido: explodir, quicar, girar sem motivo, piscar, **aparecer**. |
| **Glass** | Comportamento, não estilo. Só em estado de descoberta. Sai quando revelado. |
| **Entidades** | Distinguidas por forma + peso + preenchimento. **Nunca por matiz** (D-09). |

**A cicloide** (a lei geradora, de `marca/01-marca/Feel - Gramática do Fio.dc.html`):

```js
// b = 1.6 · 1u = altura do laço ÷ 3
cycloid(t) => [ t - b * Math.sin(t), b * Math.cos(t) ]
```

---

## O Teste (avaliador — roda antes de entregar qualquer peça)

1. Sem o logotipo — ainda parece Feel?
2. Sem a cor — ainda parece Feel?
3. Sem os efeitos — ainda comunica clareza?
4. Em preto e branco — continua elegante?
5. Se copiarem a paleta — sobra algo impossível de copiar?

**Qualquer "não" = a peça depende de superfície. Remove 30%, reforça o estrutural,
repete.** Só trava com 5 "sim". Herdado de `marca/EVOLUTION.md` § 1.

---

## Voz

- A marca é **Feel**. O convite é **"Segue a Feel."**
- *"Segue o fio"* é camada descoberta — recurso de campanha, nunca a explicação oficial.
- Vocabulário builder: lastro, prova, obra, ritmo, oportunidade, ticket, permuta, publi, assessor.
- **A voz sugere, não explica.** Nunca "plataforma inovadora que conecta". Sempre o
  fato: *"34 provas assinadas"*.
- Português. Títulos em inglês saem (D-12).
- Placeholders em `[COLCHETES]` onde falta dado real. **Nunca número inventado.**

---

## O Loop de trabalho

```
CONTEXTO → GERAR → AVALIAR → CORRIGIR → TRAVAR
(harness)  (peça)  (O Teste)   (−30%)   (arquivo + DESIGN.md)
```

Um entregável = um arquivo. Versionar (`… v2`) em vez de sobrescrever exploração.
Ao fechar um loop, atualizar `DESIGN.md` se surgiu token ou regra nova — o harness
evolui junto. O estado vive nos **arquivos**, não no chat.

Sessão termina com `/save`. Sessão começa com `/resume`.

---

## Fases

| Fase | Entrega | Estado |
|---|---|---|
| **0** | Fundação: repo, constituição, decisões, memória, governança | ✅ |
| **1** | Linguagem: tokens gerados do `DESIGN.md`, skill `feel-diagram`, scaffold `web/` | ✅ 2026-10-05 (D-17) — não verificado em navegador, ver nota na decisão |
| **2** | Os 5 boards em código + export 4K | ⏳ |
| **3** | A experiência em scroll | ⏳ |
| **4** | Acabamento, responsividade, deploy | ⏳ |

---

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 (`@theme` gerado) · Motion · Vercel
Root Directory do Vercel = `web/`.
