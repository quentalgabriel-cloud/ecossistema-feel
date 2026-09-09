# A Linguagem — gramática aplicada a diagrama

Este documento não redefine o sistema Feel. Ele **aplica** a lei do `DESIGN.md` a um
problema que o sistema ainda não tinha enfrentado: representar um grafo de entidades,
relações e estados sem violar a dosagem 90/8/2 nem a regra do anel.

Fonte de verdade permanece `DESIGN.md`. O que está aqui é derivação.

---

## 1. O problema que este documento resolve

Um diagrama de rede precisa distinguir 7 tipos de entidade em leitura macro. O
instrumento óbvio é matiz — uma cor por tipo. **O sistema Feel torna isso impossível,
e essa impossibilidade é uma vantagem.**

O sistema oferece: neutros + um coral (≤8%, um elemento por composição) + um amber
(exclusivo FeelMakers, incompatível com coral na mesma peça). Não há 7 cores. Não
haverá.

A versão anterior dos boards resolveu violando: 8 matizes saturados, dosagem estourada,
regra do anel ignorada, e reprovação em três das cinco perguntas d'O Teste.

A resposta correta está na própria lei:

> *"O sistema precisa sobreviver em preto e branco."*
> *"A hierarquia nasce de peso, escala e espaço, nunca de trocar fonte."*

**Codificamos por forma, peso e preenchimento.** Três eixos neutros carregam mais
informação que um eixo de cor — e o preenchimento codifica algo que matiz não
codificaria: o **estado de verificação**.

---

## 2. Os glifos — derivados do gesto, não de um pack

Toda entidade é um traço único, desenhado com as três constantes da curva-mãe:

```
peso        2.6px em canvas de 24u        (1u = altura do laço ÷ 3)
raio mín.   0.5u
terminal    sempre redondo, nunca chanfrado
cicloide    p(t) = [ t − b·sin(t), b·cos(t) ]   com b = 1.6
```

A distinção entre glifos é **topológica** — quantos gestos, se abrem, se cruzam, se
fecham. Isso sobrevive a P&B, a redução de escala e a daltonismo por construção.

| Entidade | Glifo | Por que essa forma |
|---|---|---|
| **Profissional** | um arco aberto, terminais livres | o átomo do sistema; a trajetória de uma pessoa nunca está concluída (Lei 1) |
| **Negócio** | dois arcos paralelos | contratar tem dois lados; o paralelismo é a relação ainda não cruzada |
| **Marca** | laço fechado único | a marca é a única entidade que se reconhece sozinha — tem volta |
| **Obra** | segmento com terminais redondos | o trabalho é finito: tem começo, tem fim |
| **Prova** | **dois arcos cruzando a 32°** | o cruzamento **é** a co-assinatura |
| **Oportunidade** | arco tracejado, aberto (`lineDashed`) | ainda não aconteceu |
| **Espaço** | o laço completo da cicloide | o catalisador contém, envolve, dá partida |

O glifo de **Prova** é o centro da linguagem. O ângulo de cruzamento de 32° não foi
escolhido para ela — é a constante que já estava na `Gramática do Fio`. A dupla
assinatura *já era* a geometria do sistema; só não tinha sido nomeada. Quando duas
trajetórias se cruzam nesse ângulo, houve prova. Quando correm paralelas, houve contato
sem prova.

Isso responde à pergunta 5 d'O Teste melhor que qualquer paleta: **copiam as cores e não
levam nada, porque a informação está na geometria.**

---

## 3. Peso — densidade de evidência

| Peso | Significado |
|---|---|
| `1.5px` | um registro |
| `2.6px` | acúmulo (o peso de referência) |
| `3.5px` | densidade alta — recorrência |

Peso nunca é decorativo. Um traço mais grosso significa **mais provas**, sempre.

---

## 4. Preenchimento — estado de verificação

| Preenchimento | Estado | Uso |
|---|---|---|
| contorno, sem fill | **potencial** | perfil não reivindicado, oportunidade aberta |
| `bone` `#F2EDE3` | **em processo** | uma assinatura de duas — aqui entra o glass |
| `ink` `#17140F` | **verificado** | dupla assinatura completa |

O estado padrão do sistema é **em processo** (Lei 1). "Verificado" é a exceção que
completa o traço e remove o vidro.

---

## 5. Coral — um por composição

Coral marca **o nó focal**: a única entidade sobre a qual a peça está falando. Nunca
codifica categoria, nunca codifica estado, nunca aparece duas vezes.

Teste mecânico, verificável por script: `grep -c 'coral' board.tsx === 1`.

Se a peça precisa de dois focos, não é uma peça — são duas.

---

## 6. As relações

| Relação | Traço | Significado |
|---|---|---|
| **direta** | linha sólida, peso 1.5 | trabalho realizado juntos |
| **indireta** | `lineDashed` `#C9BFAC` | contexto, histórico, adjacência |
| **fluxo de valor** | sólida com nó no meio | prova circulando, lastro acumulando |

Toda aresta entra e sai pelos terminais redondos. Nenhuma aresta termina em ponta.

---

## 7. Layout — 5:8:5 com corte assimétrico

```
grid-template-columns: 5fr 8fr 5fr     margem · corpo · margem
gap: 8px (compacta) · 14px (padrão) · 22px (ampla)
```

A proporção nunca muda; a densidade sim.

**O corte assimétrico é lei, não gosto.** *"Composições Feel nunca são espelhadas."*
Operacionalmente, em toda peça:

- o conteúdo do corpo **pende para uma borda**, nunca centraliza por padrão;
- o fio **entra por uma margem e sai pela outra, em alturas diferentes**;
- o título e a assinatura ficam em margens opostas.

Teste: cubra o coral e o wordmark. Se o 5:8:5 sumir, a peça não nasceu da gramática.

---

## 8. Motion — a marca se desenha

Entrada de qualquer elemento:

```
stroke-dasharray  = comprimento do traço
stroke-dashoffset : comprimento → 0
```

Nada usa `scale: 0 → 1` nem `opacity: 0 → 1` como entrada. Isso é *aparecer*, e o
sistema proíbe aparecer.

| Verbo | Implementação |
|---|---|
| **desenhar** | `pathLength` 0 → 1 |
| **revelar** | glass sai: `backdrop-filter` 12px → 0 |
| **conectar** | aresta desenha do nó de origem ao de destino, nessa ordem |
| **respirar** | peso de traço 2.6 → 2.8 → 2.6, ciclo de 4s, só no nó focal |
| **deslizar** | translação ≤ 24px, sempre no eixo do fio |
| **entrelaçar** | dois caminhos desenham simultaneamente e se cruzam a 32° |

**Proibido:** explodir, quicar, girar sem motivo, piscar, partícula, glow, `boxShadow`
animado, rotação infinita.

`prefers-reduced-motion`: o traço nasce completo (`dashoffset: 0`). Sem exceção, sem
fallback alternativo — a peça estática já é a peça.

---

## 9. A espiral (board 05)

O flywheel **não é um anel**. Lei 1: o fio nunca fecha.

A trajetória retorna à mesma posição angular com raio maior e sai do quadro:

```
r(θ) = r₀ · (1 + k·θ/2π)      k ≈ 0.28 por volta
ponto = cicloide(θ) escalada por r(θ)
```

Um círculo comunica **repetição**. Uma espiral comunica **acúmulo** — que é a tese:
*"o valor está no acúmulo — o lastro só cresce dentro da Feel; sair é perder o histórico
verificável."*

Cada volta ganha peso de traço (1.5 → 2.6 → 3.5) e mais nós de prova. A densidade
visual **é** o argumento econômico.

---

## 10. Tipografia em diagrama

| Papel | Estilo |
|---|---|
| Título do board | Archivo 600, 62px, tracking −0.035em |
| Rótulo de etapa | IBM Plex Mono 500, 11px, caps, tracking 0.2em |
| Rótulo de nó | Archivo 500, 16px |
| Número / contagem | IBM Plex Mono 500, 12px, **`tabular-nums`** |
| Nota de rodapé | Archivo 400, 15px, `textBody` `#4A443C` |

Nunca IBM Plex Mono em texto corrido. Nunca uma terceira família.

---

## 11. Voz aplicada ao diagrama

- Rótulo é **fato**, não adjetivo. `34 provas assinadas`, nunca `reputação sólida`.
- O diagrama **mostra**; a legenda **não explica o que já está visível**.
- Dado que não existe vira `[COLCHETES]`. Número inventado é bug.
- Português. Sem títulos em inglês.

---

## 12. Os cinco boards — função cognitiva de cada um

Reescritos sobre a Tese Estratégica v1 (D-14). A sequência argumentativa do plano
original sobrevive inteira; a tese e a superfície mudam.

| # | Board | Pergunta que responde | Instrumento |
|---|---|---|---|
| **01** | **O sistema** | O que é a Feel? | Mapa: oferta → camada de confiança → demanda, com o espaço físico como catalisador |
| **02** | **Da opacidade à prova** | Como funciona na prática? | Jornada de um trabalho real até virar prova co-assinada |
| **03** | **O lastro** | Por que cada trabalho vira ativo? | Acúmulo: prova → lastro → confiança → contratação de baixo risco |
| **04** | **A rede** | O que exatamente se acumula? | Grafo por praça: profissionais, negócios, marcas, obras, provas |
| **05** | **A espiral** | Por que fica mais valioso? | Espiral de densidade, com as camadas econômicas como consequência |

Cada board tem **um** nó focal em coral. Cada board passa n'O Teste antes de travar.

---

## 13. Checklist antes de travar qualquer peça

- [ ] 5:8:5 presente, com corte assimétrico
- [ ] O fio entra e sai do quadro — não fecha
- [ ] **Um** elemento coral
- [ ] Nenhum matiz fora do `DESIGN.md`
- [ ] Nenhuma categoria codificada por cor
- [ ] Terminais redondos em tudo
- [ ] Números tabulares
- [ ] Motion é draw-in
- [ ] Nenhum dado inventado
- [ ] **O Teste, 5 perguntas, 5 sim**
