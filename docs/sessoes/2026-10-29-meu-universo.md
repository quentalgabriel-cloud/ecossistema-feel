# Sessão 2026-10-29 — Meu Universo: convite → FEEL ID → universo navegável

## Contexto

Três documentos descrevem a mesma jornada vista de ângulos diferentes:

- **Handoff Mestre (05/10):** loop Necessidade → Composição → Trabalho → Evidência.
- **Estratégia de Lançamento (16/10):** SENTIR → DESCOBRIR → ENTENDER → PARTICIPAR → VER
  EVIDÊNCIAS, com convite, card vivo e FEEL ID.
- **Handoff "Feel — Meu Universo" (26/10):** canvas de bolhas, zoom semântico, estados
  declarado/confirmado/sugerido.

Esta sessão entrega a porta de entrada: `/convite` → onboarding → `/universo`. Tudo roda
com dados de demonstração. O detalhe está em `web/src/components/universo/README.md`.

## O que foi feito

- **`/convite`:** a `FeelIDCard` existente vira o card vivo do convite. Ela ganha o nome
  enquanto a pessoa digita e mostra o código do convite no número.
- **Onboarding:** "O que faz parte do seu universo?". As escolhas declaram, não filiam, e
  dá para pular para a demonstração.
- **`/universo`:**
  - três perspectivas: Meu Universo, Comunidades e Descobrir;
  - pan, pinça, roda e botões, com zoom no ponto focal (deriva medida de 0,001 unidade);
  - zoom semântico com histerese, foco em agrupamento com trilha, voltar e recentrar;
  - painel de detalhe com "Apareceu porque…", sua relação e ações simuladas;
  - modo lista equivalente, busca com "Ir até", legenda e preferências (tema e movimento);
  - "Simular 30 dias" na perspectiva Comunidades.
- **Estado de verdade = gramática da LINGUAGEM.md:**
  - preenchimento contorno → bone → ink;
  - peso do traço = quantidade de provas;
  - glass só na sugestão (estado de descoberta);
  - nenhuma distinção por matiz.
- **D-18 — modo adaptativo:** o gerador de tokens emite a camada semântica `--tema-*`
  (claro = paper, escuro = superfícies `ink*`) dentro de `[data-adaptativo]`. O resto de
  `web/` continua no claro fixo.
- **vitest** entrou em `web/` (24 testes do motor), e a CI ganhou o passo `npm test`.

## Verificação

- `npm run tokens:check`, `npx tsc --noEmit`, `npm test` (24/24) e `npm run build` limpos.
- **Playwright (Chromium):**
  - fluxo convite → onboarding → universo → foco → detalhe → ação → voltar → lista;
  - telas de 390×844 e 1440×900, claro e escuro, movimento reduzido;
  - sem overflow horizontal e sem erro de console.
- **axe-core (WCAG 2 A/AA + 2.2 AA):** zero violações em convite, onboarding, universo,
  lista e painel, nos modos claro e escuro.
- **Auditoria de marca por grep:** nenhum hex fora de `tokens/`, nenhum `transition: all`,
  `scale(0)`, Inter/JetBrains ou serifa.

## Decisões

- **D-18 registrada** (escolha do Gabriel). Os candidatos da sessão de 21/10 (holográfico
  monocromático, shadcn como base) passam a ser D-19 e D-20, se aprovados.
- **Limiares do zoom semântico:** 0.8/0.7 e 1.65/1.45. Abaixo de 0.8 os nomes não cabem
  entre as vagas, então o macro mostra só agrupamentos e contagens.
- **Texto ink sobre o botão coral:** paper sobre coral não passa AA.

## O que ficou aberto

- Glifos de comunidade, interesse, encontro e habilidade não existem na LINGUAGEM.md.
- A copy do convite usa o manifesto em aprovação.
- Pesquisa com usuários (handoff § 14.2): editorial × espacial × híbrida.
- **Ondas seguintes do plano:**
  - Onda 2: loop do negócio (criar necessidade → composição → acordo "Esperamos / Erramos
    se" → resultado → prova co-assinada);
  - Onda 3: schema unificado no Supabase `feel`;
  - Onda 4: modo palco / FEEL Network Live com o mesmo canvas;
  - Onda 5: console interno.
- **`next@15.5.27` tem aviso crítico no `npm audit`** (pré-existente na `main`). Subir para
  15.5.28 é uma decisão à parte (D-17 trava a versão).

## Próximo passo

Revisar `/convite` e `/universo?demo=1` no preview do PR e decidir se o modo espacial vai
para a pesquisa com usuários.

---

# Onda 2 (mesma data) — Trabalhos: o ciclo do negócio

Branch `claude/feel-trabalhos`, empilhada sobre a Onda 1. Detalhe em
`web/src/components/trabalhos/README.md`.

## O que foi feito

- **`/trabalhos`:** necessidade em texto livre → "Entendemos assim…" (regras, sem IA,
  citando o trecho original) → portão econômico com "para se pagar: N clientes" →
  composição sem nota, com motivos, quem ficou de fora e lado a lado → acordo com
  "Esperamos / Erramos se" carimbado e imutável → estágios e funil medido → custo por
  cliente (gasto efetivo ÷ clientes) → veredito → duas assinaturas → glifo Prova.
- **Evidence loop:** a prova volta para o Meu Universo (entidade `assinado`, provas+1) e
  para o lastro da carta FEEL ID (convite e tela da prova).
- **Núcleo:** barra Rede · Trabalhos no cabeçalho das duas superfícies.

## Verificação

- `tsc`, `npm test` (44/44) e `npm run build` limpos.
- **Playwright**, fluxo completo convite → onboarding → Trabalhos → prova → Rede:
  - telas de 390×844 (claro) e 1440×900 (escuro, movimento reduzido);
  - custo por cliente conferido (R$ 80,00) e prova refletida no universo;
  - axe-core sem violações em todos os passos;
  - sem overflow horizontal e sem erro de console.
- O fluxo da Onda 1 continua verde.

## O que ficou aberto

- O outro lado (quem cria) ainda é simulado. A versão real precisa de identidade e
  permissão (Onda 3, Supabase `feel`).
- A composição usa perfis de demonstração; com dado real, a regra de pares por porte e o
  "precisa verificar" passam a valer sobre perfis reivindicados.

---

# Onda 3 (mesma data) — O núcleo no Supabase `feel`

Branch `claude/feel-nucleo-supabase`, empilhada sobre a Onda 2. Decisão: **D-19**. Detalhe
em `supabase/README.md` e na seção "Na conta" de `web/src/components/trabalhos/README.md`.

## O que foi feito

- **Banco** (só tabelas novas; v12 e Geração 1 intactas): duas migrações aplicadas no
  `feel`.
  - `feel_nucleo`: relações, trabalhos, acordos, assinaturas e convites, todos com RLS,
    mais o trigger das regras do ciclo e as funções de carimbo, convite e assinatura.
  - `feel_convite_previa`: quem cria vê o combinado antes de aceitar.
- **App:**
  - **Sessão:** anônimo primeiro, com o e-mail pedido só para assinar. Se o projeto não
    aceita entrada anônima ou não há rede, o app segue neste aparelho e o selo diz isso.
  - **Bundle:** o cliente Supabase é carregado sob demanda (/trabalhos tem 161 kB de
    primeiro carregamento).
  - **Trabalhos na conta:** "Convidar quem cria" no lugar do aceite simulado, e a rota
    `/trabalhos/convite/[token]` para o outro lado.
  - **Rede:** as escolhas e ações da pessoa são espelhadas em `feel_relacoes`, e as provas
    verificadas vêm do banco.
- **Acessibilidade:** o hover do botão coral passava paper sobre `coralHover` (4,18:1).
  Agora o hover mantém o coral (ink, 5,99:1) e marca o estado com um contorno interno.

## Verificação

- `tsc`, `npm test` (64/64, 20 novos com cliente Supabase falso) e `npm run build` limpos.
- **Playwright no modo local** (como o `feel` está hoje):
  - os fluxos das Ondas 1 e 2 continuam verdes, sem erro de console;
  - selo "neste aparelho";
  - o convite explica que precisa de conta e está com `noindex`.
- **Playwright na conta, com Supabase simulado no navegador** (dois contextos:
  contratante no celular claro, quem cria no desktop escuro):
  - rascunho gravado → carimbo com a data do servidor → link do convite → prévia → aceite;
  - medição → veredito → pedido de e-mail → as duas assinaturas → prova de volta no
    universo pela conta;
  - um coral por tela.
- **axe:** sem violações em todas as telas novas.
- **Verificador de segurança do Supabase:** nada novo para corrigir. Os avisos sobre as
  funções `feel_*` são intencionais, e os outros já existiam.
- **Não rodado:** `supabase/testes/nucleo.sql` (30 casos das regras no banco). O painel pede
  confirmação, e ela expirou três vezes.

## O que ficou aberto

- **Teste SQL:** rodar `supabase/testes/nucleo.sql` no SQL Editor.
- **Painel do Supabase:**
  - ligar a entrada anônima;
  - incluir as URLs do app em Redirect URLs;
  - configurar um SMTP próprio (o padrão só entrega para membros da organização).
- **Variante `coral` de `components/ui/button.tsx`** (shadcn, anterior a esta onda): usa
  `hover:bg-coralHover` com texto paper, o mesmo contraste insuficiente. Não é usada nas
  superfícies do app.
- **Numeração das decisões:** os candidatos antigos a D-19/D-20 (holográfico monocromático,
  shadcn como base) passam a D-20/D-21.
