---
title: Governança — o agente não se auto-aprova
tags: [processo, governanca]
created: 2026-08-10
updated: 2026-08-10
status: permanente
type: processo
---

# Padrão adotado, dependência recusada

Do `baseline` (friedbotstudio) adotamos o **padrão**: constituição versionada, gates de
consentimento, hooks que bloqueiam no limite da ferramenta. Não instalamos o pacote —
é alpha público v0.21, e uma dependência dura de governança de terceiros em alpha
importa risco de quebra sem que o padrão tenha sido internalizado.

**Por quê:** o risco é real e nominal neste projeto — o anti-padrão declarado é
*"expandir a tese antes de executar a tese"*. Governança externa ao modelo é a resposta
estrutural: a aprovação é escrita antes de o modelo rodar, então não é forjável.

**Convergência:** o `EVOLUTION.md` da Feel já era um harness de governança — contexto
fixo, loop fechado, avaliador determinístico, higiene de estado em arquivo. Os hooks só
tornam O Teste inescapável.

**Como aplicar:** commit e push exigem aprovação explícita. Reavaliar o baseline em
branch isolada quando sair de alpha.

Relacionadas: [[o-teste-como-avaliador]]
