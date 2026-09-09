---
name: feel-diagram
description: Cria ou revisa qualquer peça visual da Feel — board, diagrama, cena de scroll, componente de grafo. Use SEMPRE antes de escrever SVG, definir cor, posicionar nó, animar entrada ou desenhar ícone neste repositório. Carrega a lei geradora (cicloide, 5:8:5, dosagem 90/8/2, regra do anel), o sistema de glifos por forma, e roda O Teste de 5 perguntas como avaliador. Também dispara ao revisar peça existente contra o sistema de marca.
---

# feel-diagram

A gramática da Feel, executável. Nenhuma peça visual nasce sem passar por aqui.

## Antes de qualquer coisa, leia

1. `DESIGN.md` (raiz) — tokens e gramática. **É o compilador, não o handoff.**
2. `docs/01-linguagem/LINGUAGEM.md` — a gramática aplicada a diagrama.
3. `docs/decisoes/log.md` — D-09 (forma, não matiz), D-10 (espiral), D-11 (draw-in).

Se houver conflito, `DESIGN.md` vence.

---

## O loop

```
CONTEXTO → GERAR → AVALIAR → CORRIGIR → TRAVAR
(ler)      (peça)  (O Teste)  (−30%)   (arquivo)
```

Nunca pule o AVALIAR. Qualquer "não" n'O Teste = a peça depende de superfície.
Remove 30%, reforça o estrutural, repete. Só trava com 5 "sim".

---

## As constantes (não negocie)

```
cicloide   p(t) = [ t − b·sin(t), b·cos(t) ]     b = 1.6
unidade    1u = altura do laço ÷ 3
peso ref.  2.6px em canvas 24u
raio mín.  0.5u — terminal SEMPRE redondo
cruzamento 32°  ← este ângulo significa co-assinatura
grid       5fr 8fr 5fr, gap 8 / 14 / 22
```

## Cor — o que existe

```
paper #FBF9F3 · tint #F7F2E9 · bone #F2EDE3 · steel #857C70 · ink #17140F
line #E3DCCE · lineDashed #C9BFAC · textBody #4A443C
inkSurface #1D1915 · inkLine #322B24 · inkText #F2EDE3 · inkMuted #B9B0A2
coral #FF5C3D   ≤8%, UM elemento por composição
amber #F0A63B   só FeelMakers, NUNCA com coral na mesma peça
```

Não existe navy. Não existe dourado. Não existe violeta. Não existe serifa.
Tipografia: **Archivo** + **IBM Plex Mono**. Só. Números sempre `tabular-nums`.

---

## Codificação de entidade — forma, peso, preenchimento

**Nunca use matiz para diferenciar categoria.** O sistema não tem cores suficientes, e a
alternativa é melhor.

| Entidade | Glifo |
|---|---|
| Profissional | arco aberto, terminais livres |
| Negócio | dois arcos paralelos |
| Marca | laço fechado único |
| Obra | segmento com terminais redondos |
| Prova | **dois arcos cruzando a 32°** |
| Oportunidade | arco tracejado aberto |
| Espaço | laço completo da cicloide |

**Peso** = densidade de evidência: 1.5 (um registro) · 2.6 (acúmulo) · 3.5 (recorrência).
**Preenchimento** = estado: contorno (potencial) · `bone` (em processo) · `ink` (verificado).
**Coral** = o nó focal. Um. Por peça.

---

## Motion

Entrada = `stroke-dashoffset: comprimento → 0`. A marca **se desenha**.

Proibido: `scale: 0→1`, `opacity: 0→1` como entrada, glow, partícula, `boxShadow`
animado, rotação infinita, explodir, quicar, girar sem motivo, piscar.

`prefers-reduced-motion`: traço nasce completo. Sem fallback alternativo.

---

## Regras de composição

- Corte **assimétrico** — composição Feel nunca é espelhada. O corpo pende para uma borda.
- O fio **entra por uma margem e sai pela outra**, em alturas diferentes. Nunca fecha.
- Ciclo é **espiral**, nunca anel (D-10).
- Glass ≤2%, só como estado de descoberta. Sai quando revelado.
- Claro é o sistema. Escuro é o palco (evento, FeelMakers).

---

## Voz

Rótulo é **fato**: `34 provas assinadas`, nunca `reputação sólida`.
A voz sugere, não explica. Português. Dado inexistente vira `[COLCHETES]` — nunca invente número.

---

## O Teste — avaliador obrigatório

Rode e **escreva o veredito** antes de entregar:

1. Sem o logotipo — ainda parece Feel?
2. Sem a cor — ainda parece Feel?
3. Sem os efeitos — ainda comunica clareza?
4. Em preto e branco — continua elegante?
5. Se copiarem a paleta — sobra algo impossível de copiar?

Modo de verificar a 1, 2 e 4 sem depender de julgamento: renderize com
`--coral: var(--ink)` e sem wordmark. Se a peça perde identidade, ela dependia de
superfície.

---

## Checklist final

- [ ] 5:8:5 com corte assimétrico
- [ ] Fio entra e sai — não fecha
- [ ] Um coral
- [ ] Nenhum matiz fora da paleta
- [ ] Nenhuma categoria por cor
- [ ] Terminais redondos
- [ ] `tabular-nums`
- [ ] Motion draw-in
- [ ] Nada inventado
- [ ] O Teste: 5 sim
