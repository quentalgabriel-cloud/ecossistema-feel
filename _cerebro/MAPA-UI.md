# MAPA — especificação da UI do Cérebro

> Versão 1.0 · derivada de `DESIGN.md` v2.0 e `docs/01-linguagem/LINGUAGEM.md` (Ecossistema Feel).
> Esta spec não redefine o sistema Feel. Ela **aplica** a gramática já derivada a seis classes novas.
> Em caso de conflito: `DESIGN.md` > `LINGUAGEM.md` > este arquivo.

**Escopo travado:** só leitura + posições. **Alcance:** local. **Tela inicial:** *Onde eu estou*.

---

## 1. Por que UI própria

O grafo do Obsidian só distingue nó por pasta e tag — isto é, por matiz. A `LINGUAGEM.md`
proíbe matiz como codificador de categoria (D-09); foi esse erro que reprovou a versão
anterior dos boards em três das cinco perguntas d'O Teste.

Não existe plugin que desenhe forma, peso e preenchimento como o sistema exige.
A escolha não é entre UI simples e UI sofisticada — é entre um grafo que viola a lei e um
que a obedece.

---

## 2. Princípio inegociável — estabilidade espacial

Um mapa que se reorganiza a cada abertura não é um mapa. Você se orienta numa cidade
porque a padaria fica sempre no mesmo lugar.

- Posição é calculada **uma vez** e gravada em `00-sistema/layout.json`, versionado.
- Nó novo é colocado no espaço livre mais próximo do vizinho mais forte e **congela**.
- Arrastar é permitido e permanente.
- **Nunca** há re-layout global. `d3-force` roda offline, uma vez, e some.

---

## 3. Os glifos — forma, peso, preenchimento

Constantes da curva-mãe: peso 2.6px em canvas 24u · raio mín. 0.5u · terminal sempre
redondo · `p(t) = [t − 1.6·sin t, 1.6·cos t]`.

| Classe | Glifo | Por quê |
|---|---|---|
| `decision` | laço fechado único | é a única classe que tem volta; se reconhece sozinha |
| `reasoning` | cicloide de 2–3 laços, entra e sai do quadro | é literalmente o fio; nenhum raciocínio está concluído |
| `insight` | dois arcos cruzando a 32° | mesmo glifo da Prova — o cruzamento de duas linhas que não se encontravam |
| `open-loop` | arco aberto, terminais livres | o fio que não fecha, no sentido literal da Lei 1 |
| `source` | segmento reto, peso 3.5, terminais redondos | material bruto é finito; vive na periferia |
| `project-state` | o laço completo da cicloide, peso 1.5, como moldura | não é nó, é o território que contém |

**Peso — densidade de evidência.** `1.5` um registro · `2.6` acúmulo · `3.5` recorrência
(3+ fontes independentes). Peso nunca é decorativo.

**Preenchimento — estado epistêmico.** contorno = hipótese/inferência · `bone #F2EDE3` =
evidência, uma fonte, sem corroboração (aqui entra o glass) · `ink #17140F` = fato ou
decisão travada (o traço se completa, o vidro sai).

**Coral `#FF5C3D` — um por composição.** Marca o nó focal: **você**. Onde você está
agora, e nada mais. Nunca categoria, nunca estado, nunca duas vezes.
Verificável por script: `coral` aparece exatamente uma vez no render.

**Status `superseded`** → o glifo recua para `lineDashed #C9BFAC`. Não some: recua.

---

## 4. As arestas

A lei diz que nenhuma aresta termina em ponta. **Sem setas.** Direção é gradiente de
peso: a ponta que origina é cheia, a que recebe afina.

| Relação | Traço |
|---|---|
| `supports` | sólida, peso 1.5 |
| `derived-from` | sólida com nó no meio (o fluxo de valor) |
| `supersedes` | lado substituído em `lineDashed`, lado vigente em 2.6 |
| `contradicts` | linha sólida **interrompida no meio** — cruzar a 32° é prova, quebrar é contradição |
| `depends-on` | tracejada, extremidade dependente mais leve |
| `related-to` | fio de cabelo, `lineDashed` — **oculta por padrão** |

Esconder `related-to` por padrão elimina ~80% do emaranhado sozinha. Relação genérica não
é informação: é a ausência de uma classificação.

**Motion.** A marca se desenha. Entrada por `stroke-dashoffset`, do foco para fora.
Proibido `opacity 0→1`, `scale`, piscar, quicar.

---

## 5. Os cinco modos

O mapa nunca renderiza o vault inteiro. Sempre responde uma pergunta.

1. **Onde eu estou** *(inicial)* — mapa em silêncio, foco em coral, últimos 7 dias em peso
   cheio, resto recuado. Rail esquerdo em texto: projeto ativo, objetivo, próximo
   resultado observável, o que está fora de escopo agora.
2. **Como isso se conecta** — foco + N saltos, relações tipadas visíveis.
3. **O que mudou** — régua de tempo sobre `git log`; modo diff desde uma data.
4. **O que ficou aberto** — pontas soltas por idade × quantos itens travam.
5. **O que eu esqueci** — dormentes por (desenvolvimento recebido × tempo sem toque).

---

## 6. Zoom semântico

| Nível | Aparece | Some |
|---|---|---|
| `z0` territórios | molduras de projeto + contagens | nós individuais |
| `z1` aglomerados | grupos por classe dentro do projeto | rótulos, arestas fracas |
| `z2` nós | glifos + arestas tipadas; rótulo no foco e vizinhos | trechos |
| `z3` leitura | glifo + rótulo + primeira linha da nota | — |

**Escopo é território, não cor.** Material de cliente ocupa região visivelmente separada.

---

## 7. Arquitetura

```
vault Markdown  (a verdade)
      │
      ▼
cerebro-index          Node · TS · ~400 linhas
frontmatter → relações tipadas → validação → densidade de evidência
      │
      ├─► .cerebro/graph.json      nós + arestas (sem posição)
      ├─► .cerebro/timeline.json   de git log --name-status
      ├─► .cerebro/health.json     lint do vault
      └─► .cerebro/state.json      PROJECT-STATE por projeto
      │
      ▼
cerebro-ui             canvas 2D · 5:8:5 com corte assimétrico
rail (orientação) · mapa · painel do nó
      │
      ├─► 00-sistema/layout.json   ← a ÚNICA escrita da UI
      └─► obsidian://open?vault=cerebro&file=…
                  │
                  ▼
            Obsidian edita → reindexa
```

**O indexador não é acessório da UI.** É o substrato de recuperação: `rg`/QMD resolvem
texto, o índice resolve estrutura (o que supersede o quê, o que ficou órfão). O agente
consulta o mesmo `graph.json` que a UI desenha. Ele se paga mesmo sem interface.

**Renderer escrito à mão, deliberadamente.** Cytoscape, vis.js e react-flow trazem a
linguagem visual deles — nós arredondados, setas, paletas categóricas. Canvas 2D próprio
dá cicloide, corte assimétrico, peso 2.6 e terminal redondo sem negociação.
Hit-test por quadtree. Nenhum nó em SVG (SVG morre por volta de 500 elementos).

**Só leitura é o que torna seguro.** Zero conflito com o Obsidian aberto ao lado, zero
risco de corromper conhecimento, e a UI pode ser jogada fora a qualquer momento.

**Stack:** Next 15 · TypeScript strict · Tailwind v4 com `@theme` gerado do `DESIGN.md` ·
Motion. Mesmo pipeline de tokens do Feel; mesma arquitetura "uma camada semântica, N
renderizadores" — Board, Scene e agora Mapa. Roda com `npm run cerebro`.

**Orçamento:** índice de 2.000 notas < 2s · primeira pintura < 500ms · pan/zoom 60fps até
~3.000 nós.

---

## 8. Contrato de dados (o que o Gate 1 precisa já gravar)

```yaml
id:            # DEC-001 · RT-001 · INS-001 · OL-001 — estável, nunca reciclado
type:          # decision | reasoning | insight | open-loop | project-state | source
project:
scope:         # pessoal | publico | cliente:<nome>
status:        # ativa | superseded | resolvida | dormente
epistemic:     # fato | evidencia | decisao | hipotese | inferencia | opiniao
confidence:    # baixa | media | alta
created / updated:
source:        # [[02-fontes/...]] + âncora
# relações TIPADAS — não basta `related`
supports:      []
contradicts:   []
derived_from:  []
depends_on:    []
supersedes:
related:       []
```

Relações tipadas no frontmatter desde a primeira nota. Custo zero hoje; retrofit
caríssimo em 800 notas.

---

## 9. Gates

| Gate | Entrega |
|---|---|
| 1 | contrato de dados acima + `layout.json` reservado |
| 3 | `cerebro-index` (metade "estrutura" do gate de recuperação) |
| **3.5** | **Mapa v1** — renderer, glifos, posições persistidas, modos 1 e 2, painel do nó, ponte Obsidian · **3–4 sessões** |
| **6.5** | **Mapa v2** — tempo (git), vista de fio, painel de saúde · **2–3 sessões** |

**Trava de escopo:** se o Mapa v1 passar de quatro sessões, o problema não é a próxima
feature — é o escopo. Só leitura, sempre.
