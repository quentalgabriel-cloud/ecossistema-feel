---
description: Roda O Teste da Feel (5 perguntas) numa peça e devolve o veredito
argument-hint: [caminho do arquivo ou nome da peça]
---

Rode **O Teste da Feel** em: $1

Leia antes: `DESIGN.md`, `docs/01-linguagem/LINGUAGEM.md`.

## As cinco perguntas

Responda cada uma com **sim** ou **não** e uma frase de justificativa. Sem "parcialmente".

1. **Sem o logotipo — ainda parece Feel?**
   Verifique de fato: remova o wordmark mentalmente (ou renderize sem) e pergunte o que
   resta. Deve restar o 5:8:5, o corte assimétrico e o pulso do traço.

2. **Sem a cor — ainda parece Feel?**
   Substitua `coral` por `ink`. Se alguma informação se perde, a peça codificou
   significado em matiz — violação da D-09.

3. **Sem os efeitos — ainda comunica clareza?**
   Remova glass e motion. A peça estática precisa funcionar sozinha.

4. **Em preto e branco — continua elegante?**
   Colapse tudo para escala de cinza.

5. **Se copiarem a paleta — sobra algo impossível de copiar?**
   O que sobra deve ser a gramática: proporção, geometria do glifo, o cruzamento a 32°.

## Verificações mecânicas (rode, não estime)

- [ ] Exatamente **um** elemento coral — conte
- [ ] Nenhum hex fora da paleta do `DESIGN.md`
- [ ] Nenhuma categoria codificada por matiz
- [ ] Grid 5:8:5 presente, com corte assimétrico (não espelhado)
- [ ] O fio entra e sai do quadro — não fecha
- [ ] Terminais redondos em todo traço
- [ ] Números com `tabular-nums`
- [ ] Motion é `stroke-dashoffset`, não `scale`/`opacity`
- [ ] Nenhum dado inventado — só `[COLCHETES]`
- [ ] Nenhuma capacidade em quarentena apresentada como presente (`CLAUDE.md` § Quarentena)

## Veredito

Se **qualquer** resposta for "não":

> A peça depende de superfície. Remova 30%, reforce o estrutural, repita.

Diga **o que remover** — especificamente, não "simplifique". Só trava com 5 sim.
