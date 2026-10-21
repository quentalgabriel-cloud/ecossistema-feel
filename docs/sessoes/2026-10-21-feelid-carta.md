# Sessão 2026-10-21 — FeelID, a carta colecionável de perfil

## O que foi feito

**Componente `<FeelIDCard>`** em `web/src/components/feelid/` e demo em `/feelid`
(`noindex`). README do componente: `web/src/components/feelid/README.md`.

- Carta em milímetros (63 × 88, formato TCG): `--mm = 100cqw / 63`. Em `@media print`
  frente e verso saem lado a lado em tamanho real.
- Frente: imagem (corte interno 8:5, canto assimétrico), chip de tipo com glifo,
  nome, frase, coleção, edição. Verso: símbolo, campos do perfil (Handoff Mestre § 11),
  fio de assinatura que se desenha a cada revelação.
- Imagem do usuário: espaço reservado, arrastar e soltar, editor de enquadramento
  (arrastar, zoom, teclado), confirmar, trocar, remover. Proporção preservada.
  **Persistência: nenhuma** — object URL na memória da aba.
- Inclinação por ponteiro, toque e setas; giro por clique, toque, Enter/espaço e botão.
  Acabamentos fosco, reluzente, holográfico. `prefers-reduced-motion` respeitado.
- Modelo de dados para `perfil | habilidade | lugar` em `web/src/data/feelid/`.

**shadcn/ui** entrou em `web/` (Button, Dialog, Slider, ToggleGroup, Input, Label), com o
tema apontando para os tokens gerados. Sem Geist, sem lucide, sem tw-animate.

**PR #1** (`componente/feelid`), CI `tokens-and-build` verde.

Verificado no Chromium via Playwright: proporção de imagens vertical/horizontal,
trocar/cancelar/remover, erro de tipo, foco ao fechar diálogo, toque no celular,
movimento reduzido, impressão, console sem erro.

## Decisões tomadas

Nenhuma D-nn registrada — as escolhas abaixo esperam o fundador:

- **Holográfico de marca** = folha de segurança monocromática (trama de cicloides,
  só neutros). Arco-íris exigiria matiz fora do DESIGN.md.
- **shadcn/ui como base de controles de `web/`**, tematizado pelos tokens.

Se aprovadas, viram D-18 e D-19 com os quatro campos.

## O que ficou aberto

- O Teste: o verso sem o símbolo perde o terço superior (pergunta 1).
- Glifo de **habilidade/capacidade** não existe em `LINGUAGEM.md` § 2.
- Cartas de habilidade e lugar: dados e moldura prontos, nunca renderizadas.
- Sangria e marcas de corte para gráfica.
- Persistência da imagem (o tipo `ImagemCarta.origem` já prevê `"remota"`).

## Bloqueios

- Merge do PR #1 exige aprovação humana (D-05); `main` faz deploy no Vercel.

## Próximo passo

Revisar `/feelid` no preview do PR #1 e decidir o holográfico monocromático.
