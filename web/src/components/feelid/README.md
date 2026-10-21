# FeelID — carta colecionável

Demo: `/feelid` (`noindex`). Componente: `<FeelIDCard>`.

```tsx
<FeelIDCard
  carta={carta}                 // Carta: perfil | habilidade | lugar
  acabamento="reluzente"        // fosco | reluzente | holografico
  virada={virada}               // opcional (controlado)
  onViradaChange={setVirada}
  aoSolicitarImagem={abrir}     // opcional: botão no espaço reservado
  aoSoltarArquivo={receber}     // opcional: arrastar e soltar na moldura
  interativa                    // false = objeto estático (catálogo, impressão)
/>
```

## Onde mora cada coisa

| Arquivo | Papel |
|---|---|
| `data/feelid/tipos.ts` | Modelo da coleção. `Carta` é união discriminada por `tipo`. |
| `data/feelid/geometria.ts` | Carta em mm (63 × 88, formato TCG). Moldura de imagem por tipo — a variação entre tipos é de **forma**, nunca de matiz (D-09). |
| `data/feelid/campos.ts` | O que cada tipo põe no verso. O chassi só desenha a lista. |
| `data/feelid/demo.ts` | Carta da demo, tudo em `[COLCHETES]`. |
| `content/feelid.pt-BR.ts` | Toda a copy. |
| `lib/feelid/cicloide.ts` | Fio, glifos e trama holográfica gerados da cicloide (b = 1.6). |
| `lib/feelid/enquadramento.ts` | Foco + zoom em coordenadas da imagem; garante cobertura sem distorção. |
| `hooks/useInclinacao.ts` | Ponteiro/toque/teclado → variáveis CSS (`--rx --ry --lx --ly --luz`). |
| `FeelIDCard.module.css` | Chassi 3D, faces, acabamentos, movimento reduzido, impressão. |
| `EditorImagem.tsx` | Diálogo shadcn de enquadramento (arrastar, zoom, setas, +/−). |

## Decisões

- **Uma unidade:** `--mm = 100cqw / 63`. A composição inteira é em milímetros; em
  `@media print` vira `1mm` real e frente/verso saem lado a lado em 63 × 88 mm.
  Texto respeita 3,5 mm de margem (sangria de 3 mm ainda não adicionada).
- **Legibilidade por construção:** nenhum texto fica sobre a foto. Nome e frase
  estão no papel; o chip de tipo tem fundo próprio.
- **Coral:** um elemento por face — o símbolo. Controles da demo usam ink.
- **Holográfico de marca:** folha de segurança monocromática. A trama é a malha
  de cicloides e só aparece onde a luz bate; as faixas usam só neutros do
  DESIGN.md. Arco-íris exigiria matiz fora da paleta — decisão de marca, não de código.
- **Movimento:** só `transform` e `opacity`. O fio do verso se desenha
  (`stroke-dashoffset`) a cada revelação. Com `prefers-reduced-motion` não há
  inclinação, o giro é instantâneo e o fio nasce completo.
- **Imagem:** `URL.createObjectURL` — fica só na memória da aba; nada é enviado;
  recarregar apaga. URLs são revogadas ao trocar, remover ou sair da página.
  `ImagemCarta.origem` já prevê `"remota"` para quando houver persistência.

## Pendências

- Glifo de **habilidade** (capacidade) não existe em LINGUAGEM.md § 2 — `glifo: null`.
- Habilidade e lugar têm dados, campos de verso e moldura, mas não foram vistos
  renderizados nem passaram por O Teste.
- Verso sem o símbolo perde o terço superior (pergunta 1 d'O Teste).
- Sangria e marcas de corte para gráfica.
