---
name: "source-command-save"
description: "Encerra a sessão — grava handoff, atualiza memória e decisões"
---

# source-command-save

Use this skill when the user asks to run the migrated source command `save`.

## Command Template

Encerre a sessão gravando o estado nos arquivos. O chat não guarda estado; os arquivos guardam.

## 1. Handoff da sessão

Crie `docs/sessoes/AAAA-MM-DD-slug.md` (data de hoje, slug do assunto principal):

```markdown
# Sessão AAAA-MM-DD — {assunto}

## O que foi feito
{entregáveis travados, com caminho de arquivo}

## Decisões tomadas
{D-nn novas ou alteradas — devem estar em docs/decisoes/log.md}

## O que ficou aberto
{o que não fechou, e o que falta para fechar}

## Bloqueios
{dependências externas, coisas que exigem o usuário}

## Próximo passo
{uma frase, acionável, sem ambiguidade}
```

## 2. Memória

Para cada aprendizado **não derivável dos arquivos** (o raciocínio, não o fato):

- Crie a nota em `memory/permanent/`, seguindo `memory/templates/nota.md`
- Uma ideia por nota. Se precisar escrever "e também", é outra nota.
- Sempre com `**Por quê:**` e `**Como aplicar:**`
- Ligue com `[[wikilinks]]` — link para nota inexistente é válido: marca o que falta escrever
- Adicione a linha correspondente em `MEMORY.md`

**Não** crie nota para: o que o código/git já registra, o que só importa a esta conversa,
ou o que já está no `DESIGN.md`.

**Se uma nota existente ficou errada, corrija ou apague** — pergunte antes de apagar.

## 3. Decisões

Se alguma decisão foi tomada, ela vai para `docs/decisoes/log.md` com os quatro campos:
o que, por quê, o que impede, o que a reabre. Sem os quatro, não é decisão — é preferência.

## 4. Fechamento

- Rode `git status` e liste o que mudou
- **Não commite sem aprovação explícita** (D-05)
- Termine dizendo, em uma linha, qual é o próximo passo
