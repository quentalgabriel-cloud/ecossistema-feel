---
name: "source-command-resume"
description: "Recarrega o contexto do projeto — constituição, decisões, memória e o último handoff"
---

# source-command-resume

Use this skill when the user asks to run the migrated source command `resume`.

## Command Template

Recarregue o contexto deste projeto na ordem canônica e me devolva um briefing curto.

**Leia, nesta ordem:**

1. `DESIGN.md` — tokens e gramática (é o compilador, não o handoff)
2. `marca/SISTEMA-DE-MARCA.md` — as leis travadas da v2
3. `AGENTS.md` — tese, arquitetura, quarentenas, fases
4. `docs/decisoes/log.md` — todas as decisões e seus critérios de reabertura
5. `MEMORY.md` — o índice; abra só as notas relevantes ao que vamos fazer
6. O arquivo mais recente de `docs/sessoes/`
7. `git log --oneline -15` e `git status`

**Depois responda, em no máximo 15 linhas:**

- Onde o projeto parou (fase, último entregável travado)
- O que está bloqueado e por quê
- Quais decisões são relevantes para o próximo passo
- Qual é o próximo passo concreto

Não resuma o que já está nos arquivos. Diga onde estamos e o que fazer agora.

Se houver conflito entre fontes, aplique a hierarquia:
`DESIGN.md` > `SISTEMA-DE-MARCA.md` > Tese v1 > `AGENTS.md` > log > `docs/planejamento/` (histórico) > Inventário (superado).
