# Meu Universo — convite, FEEL ID e o universo navegável

Rotas: `/convite` e `/universo` (`/universo?demo=1` abre a persona de demonstração).
As duas têm `noindex`. Fonte: handoff "Feel — Meu Universo" (26/10/2026), Estratégia de
Lançamento (16/10) e Handoff Mestre (05/10).

```bash
cd web
npm run dev        # http://localhost:3000/convite
npm test           # vitest: escala, câmera, zoom semântico, layout, estado de verdade, cena
npm run build      # gera tokens e builda
```

## A jornada

```
SENTIR          /convite: a carta FEEL ID ganha o nome de quem chega (FeelIDCard)
DESCOBRIR       "O que faz parte do seu universo?" → escolhas → bolhas se desenham
ENTENDER        pan / pinça / roda → foco no agrupamento → detalhe → "por que apareceu?"
PARTICIPAR      Identifico-me · Tenho interesse em participar · Acompanhar (simulação)
```

Três perspectivas sobre os mesmos dados: **Meu Universo** (o que a pessoa declarou ou tem
confirmado; tamanho não mede nada), **Comunidades** (tamanho = membros confirmados, escala
por raiz quadrada com teto, "Simular 30 dias") e **Descobrir** (sugestões, cada uma com o
motivo e as entidades que a sustentam). **Ver em lista** mostra tudo sem gesto nenhum.

## Estado de verdade — um vocabulário só

| Estado | Quem afirma | Desenho (LINGUAGEM.md § 3–4, DESIGN.md § Glass) |
|---|---|---|
| sugerido | a Feel | contorno tracejado + vidro (o único glass do produto) |
| declarado | a pessoa | contorno |
| em processo | a pessoa pediu | preenchimento `bone` |
| confirmado | a comunidade | preenchimento `ink` |
| assinado | os dois lados | `ink` + peso pela quantidade de provas |

Uma ação da pessoa nunca promove além de "em processo" (`aposAcao`). Escolher no
onboarding declara, não filia. Nada usa matiz para distinguir estado ou tipo (D-09).

## Onde mora cada coisa

| Arquivo | Papel |
|---|---|
| `data/universo/tipos.ts` | Modelo: entidade, comunidade, relação, sugestão, layout |
| `data/universo/demo.ts` | Fixtures **fictícias** (`demo: true`) |
| `data/universo/adaptador.ts` | Fonte de dados trocável (hoje fixtures; depois Supabase) |
| `lib/universo/camera.ts` | `mundoParaTela`/`telaParaMundo`, zoom no ponto, enquadrar, interpolação |
| `lib/universo/escala.ts` | `raioBolha` (raiz quadrada com limites; sem contagem = neutro) |
| `lib/universo/zoomSemantico.ts` | macro/contexto/detalhe com histerese |
| `lib/universo/layout.ts` | Espiral de ouro determinística, vagas em flor, memória de vagas |
| `lib/universo/cena.ts` | O que cada perspectiva desenha |
| `lib/universo/estadoVerdade.ts` | Estado → preenchimento, peso, tracejado, vidro |
| `lib/universo/glifos.ts` | Glifos da LINGUAGEM.md gerados da cicloide |
| `lib/universo/memoria.ts` | localStorage do protótipo (nome, escolhas, preferências) |
| `lib/telemetria.ts` | Eventos do handoff § 14.1 numa fila em memória, sem serviço externo |
| `hooks/useCameraUniverso.ts` | Câmera escreve direto no DOM (`transform` + `--k`); React só sabe do nível |
| `hooks/useGestos.ts` | Arrasto com limiar, pinça, roda; clique que encerra arrasto não seleciona |
| `components/universo/*` | Viewport, bolha, prévia, painel, lista, busca, legenda, preferências |
| `content/universo.pt-BR.ts`, `content/convite.pt-BR.ts` | Toda a copy |

## Decisões

- **Modo adaptativo (D-18).** `data-adaptativo` liga a camada semântica gerada do
  DESIGN.md (`--tema-*`). Claro é a referência; escuro = superfícies `ink*`. A pessoa pode
  fixar claro/escuro e movimento reduzido/completo em Preferências.
- **Câmera fora do React.** Pan e zoom escrevem um `transform` no mundo; rótulos se
  compensam com `scale(1 / var(--k))` e contornos usam `vector-effect: non-scaling-stroke`,
  então o peso do traço é sempre o peso semântico, em px de tela.
- **Layout estável.** A geometria dos agrupamentos depende do catálogo, não do que está
  visível. Quem chega pega a primeira vaga livre; ninguém se move (teste em `motor.test.ts`).
- **Entrada = traço se desenhando** (máscara com `stroke-dashoffset`), nunca escala (D-11).
- **Coral, um por tela:** o ponto do núcleo em repouso; o botão principal quando há prévia
  ou painel. Texto ink sobre coral, para contraste AA.
- **Zoom semântico:** limiares 0.8/0.7 e 1.65/1.45. Abaixo de 0.8 os nomes não cabem entre
  as vagas, então o macro mostra só agrupamentos e contagens.

## Limitações conhecidas

- Tudo é demonstração: sem backend, sem autenticação, sem dado real. As ações dizem
  "Simulação: nada foi enviado a ninguém".
- Comunidade, interesse, encontro e habilidade ainda não têm glifo na LINGUAGEM.md.
- Copy do convite vem do manifesto em aprovação (Estratégia de Lançamento § 6).
- O canvas foi testado com 8–20 nós. Acima disso, falta agregação.
