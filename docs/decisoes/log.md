# Log de Decisões

Convenção herdada do Massa Hub / FeelWorks: decisões numeradas, com **critério de
reabertura** explícito. Uma decisão não é reaberta sem que o critério seja atendido.

> Regra: nenhuma decisão entra aqui sem (a) o que foi decidido, (b) por quê,
> (c) o que ela impede, (d) o que a reabre.

**Numeração:** `D-nn` neste repositório. Não confundir com `D1…D12` do Massa Hub —
logs separados de produtos separados. Referência cruzada: `MH-D1`.

**Hierarquia de fontes de verdade** (em caso de conflito, a de cima vence):

1. `DESIGN.md` (raiz) — tokens, gramática, componentes. Legível por máquina.
2. `marca/SISTEMA-DE-MARCA.md` — as leis travadas da v2.
3. `marca/00-tese/Feel - Tese Estratégica.dc.html` — a tese de negócio.
4. Este log.
5. `docs/planejamento/` — os 5 documentos originais. **Histórico, não lei.**
6. `contexto/pdf/FEEL — Inventário Intelectual…pdf` — **superado em parte** (ver D-13).

---

## D-01 — "Lastro" e "prova" são vocabulário oficial da Feel

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** tese, copy, design system semântico

**Decisão.** "Lastro", "prova", "obra", "ritmo" são vocabulário oficial do ecossistema Feel.

**Por quê.** Confirmado de forma independente por `DESIGN.md` § Voice: *"Vocabulário de
builder — lastro, prova, obra, ritmo, oportunidade, ticket, permuta, publi, assessor"*,
e por `IBM Plex Mono — dados, etiquetas e o registro builder (lastro, prova, ritmo)`.
A Tese Estratégica v1 constrói a categoria inteira sobre "prova co-assinada" e "lastro
portável". Não é hipótese: é a espinha da tese.

**Nota.** Quando esta decisão foi tomada, a única evidência contrária era o *Inventário
Intelectual* (§8.5, §26), que lista os termos como "hipóteses a validar". O Sistema de
Marca v2 resolveu a dúvida na direção oposta. Ver D-13.

**O que impede.** Lastro nunca é score, nota, índice ou ranking. É agregado de **fatos
contáveis**. Herdado de `MH-D1`, inegociável. `DESIGN.md` reforça: *"Reputação não é
currículo nem score: é um rastro contável"*.

**Critério de reabertura.** Nenhum previsto.

---

## ~~D-02 — A linguagem visual da Feel é papel + navy + dourado~~ — **REVOGADA**

**Revogada em:** 2026-08-10, mesma data · **Substituída por:** D-02.1

**O erro.** Inferi os tokens dos 4 infográficos já gerados, por serem a única evidência
material disponível na ocasião. Eram evidência ruim: os próprios boards estão fora do
sistema (ver D-14). Inferir a lei a partir de artefatos que violam a lei.

---

## D-02.1 — `DESIGN.md` v2 é a fonte de verdade única dos tokens

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** tudo que renderiza

**Decisão.** Os tokens da Feel são os do `DESIGN.md` v2, sem exceção nem "adaptação
para diagrama":

```
paper #FBF9F3 · tint #F7F2E9 · bone #F2EDE3 · steel #857C70 · ink #17140F
line #E3DCCE · lineDashed #C9BFAC · textBody #4A443C
inkSurface #1D1915 · inkLine #322B24 · inkText #F2EDE3 · inkMuted #B9B0A2
coral #FF5C3D (≤8%, regra do anel) · amber #F0A63B (só FeelMakers, nunca com coral)
Tipografia: Archivo (display/texto) + IBM Plex Mono (dados/labels, tabular-nums). Só.
Dosagem 90 / 8 / 2. Claro é o sistema, escuro é o palco.
```

Navy, dourado e a serifa Didone **não existem** no sistema Feel. O violeta `#6C5BFF` do
Massa Hub também não — é token do produto FeelWorks legado, e nem esse sobrevive à v2
(`02-feelworks/` já está em modo claro com coral pela regra do anel).

**O que impede.** Nenhum componente hardcoda cor ou família de fonte. Proibido
introduzir matiz novo para "diferenciar categoria" — ver D-09.

**Critério de reabertura.** Alteração no próprio `DESIGN.md` via o Loop do `EVOLUTION.md`.

---

## D-03 — Escopo: 5 boards + experiência scrollytelling

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** roadmap

**Decisão.** Os 5 boards estáticos **e** a experiência narrativa em scroll.

**O que impede.** Não permite duplicar dados. Board e cena consomem a mesma
`web/src/data/*.ts` (D-04). Board divergindo da cena é bug.

**Critério de reabertura.** Pressão de prazo. Fases 0–2 entregam valor fechado sozinhas.

---

## D-04 — Uma camada semântica, dois renderizadores

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** arquitetura

```
web/src/data/*.ts      nós, arestas, legendas, estados   ← a gramática
     ├──► <Board>      16:9 estático, export 4K
     └──► <Scene>      scroll-driven, draw-in
```

**Por quê.** Única forma de os cinco boards parecerem partes do mesmo organismo.

**O que impede.** Proíbe SVG desenhado à mão, coordenadas literais em componente de
seção, e copy dentro de JSX. Posição vem de layout determinístico sobre os dados;
copy vem de `web/src/content/`.

**Critério de reabertura.** Nenhum. É constitucional.

---

## D-05 — Governança adotada como padrão, não como dependência

**Data:** 2026-08-10 · **Status:** ✅ Decidida com critério · **Áreas:** `.claude/`, processo

**Decisão.** Adotar o *padrão* do `baseline` (constituição versionada, gates de
consentimento, hooks que bloqueiam no limite da ferramenta), escrito por nós. Não
instalar o pacote agora.

**Por quê.** O risco é real e nominal: o anti-padrão *"expandir a tese antes de executar
a tese"*. Governança externa ao modelo é a resposta certa — o agente não se auto-aprova.
Mas `baseline` é alpha público (v0.21); dependência dura de governança de terceiros em
alpha, na semana 1, importa risco de quebra sem ter internalizado o padrão.

**Convergência.** O `EVOLUTION.md` da Feel **já é** um harness de governança — contexto
fixo, loop fechado, avaliador determinístico (O Teste), regra de iteração (−30%),
higiene de estado em arquivo. Os hooks apenas tornam O Teste inescapável.

**Critério de reabertura.** `baseline` sair de alpha, ou o padrão caseiro falhar.

---

## D-06 — Memória Viva no repositório, não em vault externo

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** `memory/`, `.claude/commands/`

**Decisão.** Memória em `memory/`, versionada, notas atômicas com frontmatter e
wikilinks. Não em vault Obsidian separado.

**Por quê.** A arquitetura do `claude-code-memory-setup` (Zettelkasten, `/save`,
`/resume`, índice carregado toda sessão) é excelente e foi adotada. A **localização**
não: memória fora do repo não viaja com o projeto nem é revisável em PR.

Também coerência: "Memória Viva da Marca" é conceito da Feel. O repositório praticar a
própria tese é a prova de que a tese funciona.

**Fronteira.** Memória de projeto aqui. Memória sobre o usuário em `~/.claude/`.

**Critério de reabertura.** Necessidade de navegação em grafo visual.

---

## D-07 — yt-dlp é ferramenta de ingestão, não dependência da aplicação

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** `scripts/ingest/`

**Decisão.** `yt-dlp` em `scripts/ingest/`, ferramenta local de captura de transcrição.
Não entra em `web/`, não vai para o Vercel.

**Por quê.** O valor é converter referência audiovisual em **texto pesquisável** para a
Memória Viva. `--write-auto-subs --skip-download` baixa a legenda sem o vídeo.

**Restrição.** Gravações próprias e material legitimamente acessível.

---

## D-08 — `DESIGN.md` gera os tokens; ninguém replica valor à mão

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** build, `web/src/tokens/`

**Decisão.** Um script lê o frontmatter YAML do `DESIGN.md` e emite
`web/src/tokens/tokens.css` (bloco `@theme` do Tailwind v4) e `web/src/tokens/tokens.ts`.
Ambos gerados, ambos com cabeçalho `// GERADO — não edite`. CI falha se estiverem
dessincronizados do `DESIGN.md`.

**Por quê — e esta é uma crítica deliberada ao processo atual.** O `SISTEMA-DE-MARCA.md`
instrui: *"o DESIGN.md é documentação/handoff, não fonte de runtime; replicar os valores
dele à mão nos estilos inline"*. Isso funciona para peças `.dc.html` isoladas, onde a
ferramenta exige estilo inline. Não funciona para uma aplicação: replicação manual de
token é deriva garantida — basta um `#FF5C3D` digitado como `#FF5C3E` para o sistema
começar a mentir.

A decisão **fortalece a intenção declarada** do próprio documento (*"a verdade legível
por máquina"*) em vez de contrariá-la: o `DESIGN.md` deixa de ser handoff e passa a ser
compilador. As peças `.dc.html` em `marca/` seguem com estilo inline — são o arquivo
histórico, não runtime.

**O que impede.** Proíbe hex literal em qualquer arquivo de `web/`. Lint bloqueia.

**Critério de reabertura.** Se o formato `design.md` ganhar gerador oficial, migrar.

---

## D-09 — Entidades se distinguem por forma, peso e preenchimento — nunca por matiz

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** boards, componentes de diagrama

**Decisão.** Os 8 tipos de entidade (pessoa, organização, capacidade, projeto, prova,
resultado, partner, oportunidade) são codificados por três eixos neutros:

| Eixo | Valores |
|---|---|
| **Forma** | glifo derivado do gesto do fio — terminal redondo, raio mín. 0.5u, peso 2.6px em canvas 24u |
| **Peso** | traço 1.5 / 2.6 / 3.5px conforme densidade de evidência |
| **Preenchimento** | contorno (potencial) · `bone` (em processo) · `ink` (verificado) |

Coral aparece **uma vez por composição**, no nó focal. Nunca como código de categoria.

**Por quê — o problema mais difícil deste projeto.** O board 04 precisa distinguir 8
categorias. O sistema Feel oferece neutros + um coral (≤8%, um por peça) + um amber
(exclusivo FeelMakers, incompatível com coral). **Não é possível codificar 8 categorias
por cor dentro dessa lei.** A versão gerada resolveu isso violando a lei: 8 matizes
saturados, dosagem estourada, regra do anel ignorada.

A resposta correta está na própria gramática, e é melhor que cor: *"O sistema precisa
sobreviver em preto e branco"* e *"a hierarquia nasce de peso, escala e espaço"*. Forma
+ peso + preenchimento carregam mais informação que matiz (o preenchimento codifica
**estado de verificação**, que matiz não codificaria), sobrevive a P&B, é acessível a
daltônicos por construção, e passa nas perguntas 2 e 4 do Teste.

**O que impede.** Proíbe legenda colorida. A legenda passa a ser de formas.

**Critério de reabertura.** Teste com usuário mostrando que 8 formas não se distinguem
em leitura macro. Mitigação prévia: reduzir a 6 entidades antes de recorrer a cor.

---

## D-10 — O flywheel é uma espiral, não um círculo

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** board 05, cena final

**Decisão.** O board 05 não é um anel fechado com setas. É uma **espiral**: a trajetória
retorna à mesma posição angular com raio maior, e sai do quadro.

**Por quê.** Tensão direta entre a tese e a lei. A tese diz que o ciclo se fecha e se
retroalimenta. A Lei 1 do sistema diz *"o fio nunca fecha: entra e sai do quadro —
nenhuma trajetória está concluída"*. Um anel fechado viola a lei fundadora.

A espiral resolve as duas e é **melhor argumento**: um círculo comunica repetição; uma
espiral comunica **acúmulo** — que é exatamente a tese ("o valor está no acúmulo — o
lastro só cresce dentro da Feel"). E atende ao briefing original, que pedia
*"evitar setas grossas formando um círculo perfeito… o ciclo pareça ganhar densidade
à medida que avança"*.

Geometria: a cicloide `[t − b·sin(t), b·cos(t)]` com `b = 1.6`, raio crescendo por volta,
terminal aberto fora da moldura.

**Critério de reabertura.** Nenhum previsto.

---

## D-11 — Motion é desenho de traço, nunca aparição

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** toda a experiência

**Decisão.** Entrada de elemento = `pathLength` / `stroke-dashoffset` de 0 a 1. A marca
**se desenha**. Verbos: desenhar, revelar, conectar, respirar, deslizar, entrelaçar.

**O que isso invalida.** Os snippets de `docs/planejamento/feel-system-fluxo-visual.md`
usam `scale: 0 → 1` e `opacity: 0 → 1` para entrada de nó — isso é *aparecer*, que o
sistema proíbe. Também saem: glow pulsante, partículas, `boxShadow` animado, rotação
infinita. `DESIGN.md` § Motion proíbe explodir, quicar, girar sem motivo, piscar.

Glass fica em ≤2% e **só** como estado de descoberta (prova aguardando 2ª assinatura,
perfil em construção). Não é estilo, é estado — sai quando o conteúdo é revelado.

**Por quê é um ganho, não uma perda.** Draw-in é mais coerente *e* mais barato: um
`pathLength` animado num SVG já desenhado tem custo de GPU menor que sombra animada, e
respeita `prefers-reduced-motion` trivialmente (traço nasce completo).

**Critério de reabertura.** Nenhum.

---

## D-12 — Os boards são em português

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** copy de todos os boards

**Decisão.** Títulos e corpo em português. Saem "THE FEEL NETWORK", "FROM PROBLEM TO
RESULT", "PROOF → LASTRO → INTELLIGENCE" e a assinatura "THE LIVING SYSTEM".

**Por quê.** O sistema v2 inteiro é em português. A voz é *"Segue a Feel"*. `DESIGN.md`
§ Voice: a voz *sugere*, não explica — *"nunca 'plataforma inovadora que conecta';
sempre o fato: '34 provas assinadas'"*. "THE LIVING SYSTEM" é exatamente o registro
proibido: abstração em inglês que explica o que a peça deveria demonstrar.

**Critério de reabertura.** Peça destinada a investidor estrangeiro — e aí é versão
traduzida, não o padrão.

---

## D-13 — O Inventário Intelectual é histórico, não lei

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** hierarquia de fontes

**Decisão.** `contexto/pdf/FEEL — Inventário Intelectual…pdf` e os 5 documentos de
`docs/planejamento/` são **arquivo histórico**. Onde conflitarem com `DESIGN.md`,
`marca/SISTEMA-DE-MARCA.md` ou a Tese Estratégica v1, perdem.

**Por quê.** O Inventário foi escrito como levantamento explícito de "o que ainda não
foi decidido" — ele mesmo se declara provisório e pede que a IA não invente o que falta.
O Sistema de Marca v2 e a Tese v1 **decidiram**. Manter o Inventário como fonte ativa
reintroduz dúvidas já resolvidas (foi o que produziu o erro da D-02).

**O que permanece válido do Inventário.** A recomendação de §27 — *"construa primeiro um
Design System semântico, não visual"* — que é justamente o que a D-04 implementa.

**Critério de reabertura.** Nenhum.

---

## D-14 — Os 5 boards são reconstruídos do zero, no sistema e na tese v1

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** todo o entregável visual

**Decisão.** Os 4 infográficos gerados não são refinados nem "adaptados". São
substituídos. O novo conjunto expressa a **Tese Estratégica v1** — infraestrutura de
reputação verificável — dentro do sistema v2.

**Auditoria dos boards antigos contra O Teste:**

| Pergunta do Teste | Veredito |
|---|---|
| 1. Sem o logotipo — ainda parece Feel? | ❌ Removido o wordmark dourado, nada os identifica |
| 2. Sem a cor — ainda parece Feel? | ❌ A informação está codificada em 8 matizes; sem cor a legenda morre |
| 3. Sem efeitos — comunica clareza? | ✅ |
| 4. Em P&B — continua elegante? | ❌ Colapsa junto com a pergunta 2 |
| 5. Copiada a paleta — sobra o incopiável? | ❌ Não há 5:8:5, não há fio, não há gramática |

Três "não" em cinco. Pela regra do `EVOLUTION.md`, a peça volta para a mesa.

**Violações adicionais.** Serifa Didone (fora das duas famílias permitidas); wordmark em
caixa-alta em vez do `feel` desenhado, que existe como SVG em `marca/assets/`;
assinatura em inglês; ausência total do fio.

**Erro de conteúdo, além do de forma.** Os boards expressam o enquadramento "camada de
inteligência / FeelMind / Creative Intelligence". A Tese v1 §04 lista IA de conteúdo e
automação pesada como **"NÃO CONSTRUIR AGORA"**. Reconstruir com capricho visual a
narrativa desatualizada seria caprichar na embalagem do conteúdo errado.

**O que fica.** A ideia de *cinco instrumentos de compreensão, cada um com uma função
cognitiva distinta*, e a sequência argumentativa (o quê → como funciona → por que gera
ativo → o que acumula → por que fica mais valioso). Isso era o que havia de bom no
plano, e sobrevive inteiro. Só a tese e a superfície mudam.

**Critério de reabertura.** Nenhum.

---

## D-15 — O repositório é único; o sistema de marca vive em `marca/`

**Data:** 2026-08-10 · **Status:** ✅ Decidida · **Áreas:** estrutura

**Decisão.** `FeelCompany - CLAUDE DESIGN` foi copiada para `marca/` neste repositório.
`DESIGN.md` sobe para a raiz (é o compilador de tokens, D-08). `EVOLUTION.md` e
`SISTEMA-DE-MARCA.md` ficam em `marca/`.

**Não copiado.** `uploads/` (93 MB de duplicatas aninhadas, redundante com
`marca/assets/`) e o `.zip` de assets. `Assets Google Drive Axel/` foi para
`contexto/binarios/assets-axel/`, fora do git.

A pasta original em `Downloads` fica intocada como backup.

**Critério de reabertura.** Nenhum.

---

## D-16 — Tese Estratégica v1 (D-14) parcialmente superada pelo Handoff Mestre 05/10

**Data:** 2026-10-05 · **Status:** ✅ Decidida · **Áreas:** tese de negócio, escopo,
produto digital — **não** sistema de marca/visual

**Decisão.** `docs/FEEL-HANDOFF-MESTRE-2026-10-05.md` passa a ser a referência de tese
de negócio e produto digital, substituindo nesse escopo a leitura de
`marca/00-tese/Feel - Tese Estratégica.dc.html` como definição ativa. A Feel deixa de
ser definida primariamente como "infraestrutura de reputação, confiança e coordenação
para a economia criativa" (D-14) e passa a "infraestrutura de orquestração de mercado":
demanda real → contexto/diagnóstico → requisitos → capacidades → composição → execução
→ distribuição/transação quando necessária → evidência → aprendizado. B2B é o motor
econômico inicial; creators são uma capacidade da rede, não o eixo do negócio.

**Por quê.** Instrução explícita do fundador (Gabriel), 2026-10-05, apontando o handoff
como "as atualizações mais recentes e confiáveis sobre a Feel". O próprio handoff lista
em §45 sete fontes internas de 11/08 a 05/10 que o compõem — entre elas o
`FEEL Business Model v0.1` (a "Documentação FeelCompany" de Downloads), já absorvido,
não precisa ser reprocessado à parte.

**O que NÃO muda.** Vocabulário builder (D-01), tokens e leis visuais de `DESIGN.md`
(D-02.1), arquitetura de dois renderizadores (D-04), governança (D-05), memória no
repo (D-06), entidades por forma não matiz (D-09), flywheel como espiral (D-10),
motion (D-11), boards em português (D-12), e a decisão de reconstruir os 5 boards do
zero (D-14) **continuam valendo como decisões de execução visual** — o próprio D-14 já
previa que "a tese e a superfície mudam" sem derrubar a sequência argumentativa dos
boards. O que muda é o conteúdo de negócio que os boards (ainda não construídos,
Fase 1 bloqueada) vão expressar.

**O que impede.** Nenhum material novo (board, copy, pitch, produto) pode descrever a
Feel como "infraestrutura de reputação para a economia criativa", "marketplace de
talentos" ou "rede social para criativos" como definição primária — classificado como
LEGADO/SUPERADO pelo próprio handoff. `marca/00-tese/Feel - Tese Estratégica.dc.html`
não é apagado; fica como histórico, do mesmo jeito que D-13 tratou o Inventário
Intelectual.

**Critério de reabertura.** Novo handoff mestre mais recente, ou instrução explícita
do fundador em contrário.

---

## Hierarquia de fontes de verdade — atualizada

Para tese de negócio e produto digital, `docs/FEEL-HANDOFF-MESTRE-2026-10-05.md` entra
**acima** do item 3 original (`Feel - Tese Estratégica.dc.html`) na lista do topo deste
arquivo. Para sistema de marca/visual, a hierarquia original (`DESIGN.md` →
`SISTEMA-DE-MARCA.md`) continua intocada — o handoff não trata de tokens, cor ou
tipografia.
