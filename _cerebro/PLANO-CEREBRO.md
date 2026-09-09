# Cérebro — análise, arquitetura e plano

Análise do documento `Aprimorar prompt segundo cérebro` (ChatGPT, 18–21/ago/2026, 10.562 linhas), cruzada com o ambiente real da máquina e com verificação das dependências externas. Ao final, a arquitetura proposta e o plano completo até o cérebro rodando aqui.

---

## 1. O que aquele chat realmente construiu

Não foi um prompt sendo melhorado nove vezes. Foi uma tese sendo reescrita nove vezes, e cada reescrita mudou o problema.

| # | O que entrou | A virada real |
|---|---|---|
| 1 | Prompt original: "Obsidian vira meu segundo cérebro, tudo automático" | Sai "peça ao agente para lembrar de lembrar", entra ciclo `TAREFA → RECUPERAR → EXECUTAR → REFLETIR → CONSOLIDAR` com progressive disclosure e captura ≠ gravação |
| 2 | Você diz que trava, que perde a noção de onde está | **A maior virada.** O problema deixa de ser memória e passa a ser orientação. Nascem `ONDE ESTOU`, estados de maturidade, checkpoints, protocolo anti-overwhelm, mineração de conversa, reasoning threads, ideias dormentes, pontas soltas |
| 3 | "Vasculhe suas memórias sobre mim" | Confirma a ordem obrigatória: **Orientação → Memória → Inteligência → Automação**. "Seu primeiro produto não é memória automática; é um sistema que te impede de se perder" |
| 4 | "E UI? E repos do GitHub?" | Economia arquitetural: QMD assume o retrieval, Dataview assume a UI, Smart Connections vira visão periférica, o repo do Lucas Rosati vira doador de padrões. Nada de frontend próprio |
| 5 | NotebookLM + repo Git | **Git deixa de ser backup e vira memória temporal.** Vault = repositório. NotebookLM vira coprocessador de síntese, nunca memória. MCP dele = automação de navegador, não API |
| 6 | "Faça isso servir para outras pessoas" | Separação entre invariantes da arquitetura e camada adaptável ao perfil de cada um |
| 7 | Auditoria contra `claude-code-memory-setup` | Veredito: camada complementar, não fork. Modelo de dados cai de 15 tipos para 5. Zettelkasten rejeitado como regra universal |
| 8 | O vídeo do "map" | Entra **VERIFICAR** entre executar e aprender. E o achado mais forte: aprendizado tem três destinos — **memória, teste ou regra** |
| 9 | Explicações para Gabriel Prates | Aparece a versão institucional da tese: memória de secretaria, continuidade apesar da troca de pessoas |

### O núcleo que sobreviveu às nove rodadas

```
ORIENTAR → RECUPERAR → EXECUTAR → VERIFICAR → REFLETIR → CONSOLIDAR → REGISTRAR
```

- Markdown versionado é a única casa canônica do conhecimento.
- A fonte bruta nunca é substituída por resumo: `RAW → EXTRAÍDO → CONSOLIDADO`.
- Todo item sabe de onde veio e permite voltar lá.
- Fato ≠ evidência ≠ inferência ≠ hipótese ≠ decisão. Repetição não promove hipótese a fato.
- Nada é sobrescrito em silêncio: `supersedes:` preserva o histórico.
- `IDEIA → EXPLORADO → DEFINIDO → CONSTRUINDO → TESTANDO → UTILIZÁVEL → ESTÁVEL`. "Pronto" não é um estado.
- Captura pode ser automática; promoção a conhecimento permanente é seletiva.
- Se qualquer ferramenta sumir amanhã, o conhecimento continua legível numa pasta.

Isso está certo. É a base da arquitetura e eu não mudaria nada aí.

---

## 2. O que o documento acertou

**A inversão da ordem.** Começar por memória automática teria produzido um vault cheio e inútil. Começar por orientação produz utilidade na primeira semana. Esse foi o melhor movimento da conversa inteira.

**Git como memória temporal.** Markdown responde *o que sabemos agora*; o histórico do Git responde *como chegamos aqui*. Isso elimina — talvez para sempre — a necessidade de Graphiti, Neo4j e banco vetorial nesta fase. É a maior economia de arquitetura do documento.

**Reasoning threads.** Guardar a conclusão sem o caminho é o que mata a maioria dos "segundos cérebros". Preservar `ideia → objeção → nova informação → reformulação → decisão` é o diferencial real, e é exatamente o formato do seu raciocínio.

**Captura ≠ promoção.** Sem isso, seis meses viram aterro cognitivo. Com isso, o vault continua legível no ano dois.

**Os três destinos do aprendizado.** Nem tudo que se aprende é memória. Algumas coisas precisam virar teste permanente ("isso não pode acontecer de novo") e algumas, raramente, viram regra do sistema. Foi a última coisa que entrou e é a mais madura.

---

## 3. Nove coisas que faltam ou estão erradas

### 3.1 O achado mais importante: nove rodadas, zero artefatos

O documento produziu oito versões de prompt mestre, cinco diagramas de arquitetura, quatro roadmaps — e nenhum arquivo. A própria conversa é uma instância do padrão que ela diagnostica em você: expandir o problema antes de fechar a etapa atual. Ela até se classifica corretamente ao final (`DEFINIDO`, não `CONSTRUINDO`), e depois continua elaborando por mais quatro mil linhas.

Consequência prática para o plano: **o Gate 1 não pode ser "definir a arquitetura".** Já está definida o suficiente. O Gate 1 é criar pastas e commitar. Se este plano gerar uma décima versão da arquitetura antes de existir um `git log` com dois commits, ele falhou.

### 3.2 A arquitetura foi desenhada para um ambiente que não é o seu

O documento nunca perguntou o que existe na sua máquina. O que existe:

| | |
|---|---|
| SO | Windows 11 |
| Git | 2.55.0 ✅ |
| Node.js | **ausente** ❌ |
| Python 3 | **ausente** ❌ |
| ffmpeg | ausente (só importa para ingestão de vídeo) |
| Pasta de trabalho | dentro do OneDrive, com espaço e acento no caminho |

Isso muda três coisas. QMD precisa de Node ≥ 22 ou Bun — logo, **retrieval não é o Gate 3, é consequência do Gate 0**. Os scripts Python do repo do Lucas não rodam. E todo comando com caminho precisa de aspas — coisa que seu próprio `AGENTS.md` já avisa.

### 3.3 OneDrive + `.git` + índice do Obsidian é uma combinação ruim

O documento nunca tocou nisso. Sincronização de nuvem reescrevendo arquivos que o Git e o Obsidian estão indexando ao mesmo tempo é causa clássica de conflito silencioso e de `.git` corrompido. Por isso o cérebro vai para `C:\Users\tassi\cerebro`, fora do OneDrive. Backup você tem via GitHub, que é melhor que sincronização de arquivo.

### 3.4 Várias afirmações externas não estavam verificadas

Verifiquei as que a arquitetura depende:

| Afirmação do documento | Situação hoje |
|---|---|
| QMD existe e faz BM25 + vetorial + rerank local, com MCP | ✅ Confirmado. `npm install -g @tobilu/qmd` |
| QMD é a escolha óbvia de retrieval | ⚠️ **Requer Node ≥22 ou Bun; suporte a Windows não está documentado**, e o motor usa extensões de SQLite. Isso é uma aposta, não um dado |
| Graphify converte codebase em grafo, com AST determinístico, para Claude Code/Cursor/Codex | ✅ Confirmado |
| Graphify tem "mais de 100 mil estrelas" | ⚠️ Fontes divergem entre 63 mil e 108 mil em datas diferentes. Estrela não é evidência de nada — não use como argumento |
| Repo do Lucas Rosati tem ~940 estrelas | ❌ 845 estrelas, 71 forks, 9 commits, MIT, 86% Python |
| NotebookLM virou Gemini Notebook | ✅ Confirmado, renomeado em julho/2026 |
| MCP de NotebookLM é automação de Chrome, não API | ✅ Confirmado, e o veredito "experimental, não core" continua correto |
| Claude Code e Codex têm hooks de ciclo de vida | ✅ Confirmado — e mais ricos do que o documento sabia (ver 3.9) |

### 3.5 Ninguém definiu como a conversa entra no sistema

O documento diz "importe uma conversa" quinze vezes e nunca diz de onde ela vem. Export do ChatGPT é um zip pedido nas configurações que chega por e-mail em algumas horas; o do Claude é outro caminho. É o primeiro gargalo real, é chato, e não estava no plano. Por isso o corpus da V1 é o arquivo que você já exportou — não um export completo que ainda não existe.

### 3.6 Falta o ritual humano

Tudo no documento é "automático". Mas `captura → candidato → conhecimento` exige um ponto de decisão, e um sistema sem ritual de revisão apodrece em dois meses. Falta um encontro semanal de quinze minutos com o inbox. Quinze minutos, não uma tarde: se virar administração, o sistema falhou pela definição dele mesmo.

### 3.7 Vazamento entre clientes não foi desenhado

O documento cita "cross-project data leakage" numa lista de riscos e nunca volta ao assunto. Mas você opera Feel, Grupo Levay, Korun, MassaHub e clientes ao mesmo tempo. Uma memória de um cliente aparecendo numa sessão de outro não é um bug de UX — é um problema de confidencialidade. Um campo `scope:` custa nada agora e é quase impossível de retrofitar em oitocentas notas depois.

### 3.8 O documento não sabia que metade do sistema já existe na sua máquina

Este é o achado que mais muda o plano. O repositório `Ecossistema Feel` já implementa, funcionando, os padrões que a conversa passou dez mil linhas teorizando:

- **`MEMORY.md`** — um índice carregado toda sessão, com as notas fora do contexto. É exatamente o *progressive disclosure* que o documento propõe.
- **`memory/permanent/`** — doze notas atômicas com o formato certo: uma ideia, o **porquê**, como aplicar, relacionadas.
- **`docs/decisoes/log.md`** — D-01 a D-15, com critério de reabertura. É a `decision memory` do documento, pronta.
- **Hierarquia de conflito explícita** — quando dois documentos discordam, qual vence. O documento nunca chegou nisso e é essencial.
- **`.claude/settings.json`** — hooks de governança já rodando: alterar arquivo constitucional pede aprovação, peça visual alterada dispara o lembrete d'O Teste.
- **`/resume`, `/save`, `/teste`** e a skill `feel-diagram`.
- **"O Teste"** — cinco perguntas como função de avaliação antes de travar qualquer peça. É a etapa `VERIFICAR` que o vídeo do "map" sugeriu, já implementada, seis meses antes.
- **Quarentena** — a lista do que explicitamente **não** se constrói. É o `NÃO PENSAR AINDA` em forma vinculante.

Você não está começando do zero. Você tem um protótipo funcionando, com escopo de um projeto. **O trabalho é extrair esse padrão para uma camada transversal** — não inventá-lo.

Duas ressalvas: o repo tem `git init` mas **zero commits e nenhum remoto** (todo o trabalho está sem histórico e sem backup), e o Zettelkasten rígido do repo do Lucas ("uma ideia por nota, mínimo dois wikilinks") não deve ser importado — `PROJECT-STATE` não é atômico e link forçado é ruído.

### 3.9 Os hooks hoje fazem mais do que o documento imaginava

O documento planejava um "memory engine" em Python acionado por hooks. Hoje isso é desnecessário. O Claude Code expõe, entre outros, `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionEnd`, `PreCompact`/`PostCompact`, `SubagentStart`/`SubagentStop` e `InstructionsLoaded`; hooks injetam contexto na sessão via `additionalContext`; e os handlers podem ser **comando, HTTP, ferramenta MCP, prompt ou agente**, com execução assíncrona.

Traduzindo: a recuperação automática é um hook de `UserPromptSubmit` que devolve as memórias relevantes como contexto, e a reflexão é um hook de `Stop`/`SessionEnd` com handler de prompt. **Nenhum daemon, nenhum servidor, nenhum MCP próprio.** A Fase 4 do documento acabou de ficar três vezes menor.

---

## 4. A arquitetura

```
                            VOCÊ
                             │
             ┌───────────────┴───────────────┐
             │                               │
        OBSIDIAN                      CLAUDE CODE / CODEX
    interface humana                    execução + raciocínio
      HOME · Dataview                    CLAUDE.md · AGENTS.md
             │                               │
             └───────────────┬───────────────┘
                             ▼
                  C:\Users\tassi\cerebro
              vault Markdown = repositório Git
                             │
       ┌──────────────┬──────┴───────┬──────────────┐
       ▼              ▼              ▼              ▼
   02-fontes     04-memoria     03-projetos    00-sistema
   RAW imutável  consolidado    PROJECT-STATE  regras · testes · logs
       │              │              │
       └──────────────┴──────────────┘
                      ▼
              RECUPERAÇÃO
        ripgrep (V1)  →  QMD (V2, se passar no teste)
                      │
                      ▼
              GitHub privado
        histórico · backup · como o pensamento mudou

    opcionais, por demanda observada:
      Graphify ····· só em tarefa de código, responde "como o software está estruturado"
      Gemini Notebook ····· síntese de corpus curado, via Knowledge Pack
      Smart Connections ····· visão periférica dentro do Obsidian
```

### Uma função por peça

| Peça | Responsabilidade única | Veredito |
|---|---|---|
| Markdown | formato canônico | **núcleo** |
| Obsidian | interface humana, navegação, revisão | **núcleo** |
| Git | histórico — como o conhecimento mudou | **núcleo** |
| GitHub privado | remoto, backup, recuperação | **núcleo** |
| Claude Code / Codex | executar e raciocinar sobre o vault | **núcleo** |
| ripgrep | recuperação V1, zero instalação | **núcleo até falhar** |
| QMD | recuperação híbrida quando `rg` falhar em pergunta semântica | **testar no Gate 3** |
| Dataview | dashboards do HOME sem escrever frontend | **adotar no Gate 1** |
| Smart Connections | associações enquanto você navega | opcional |
| Gemini Notebook | síntese profunda de corpus curado | opcional, alto valor |
| Graphify | estrutura de codebase, por projeto | opcional, por demanda |
| MCP de NotebookLM | ponte experimental via navegador | experimental, nunca núcleo |
| UI própria — o Mapa | localização visual e leitura da estrutura, em só-leitura | **adotar no Gate 3.5** |
| Graphiti · Mem0 · Neo4j · banco vetorial · MCP próprio | — | **rejeitados por ora** |

A regra que sustenta a tabela: **duas ferramentas com a mesma função é erro de arquitetura.** E nenhuma entra sem um problema observado.

### Estrutura do vault

```
cerebro/
├── HOME.md                    ONDE ESTOU — a primeira tela, em 30 segundos
├── README.md · SCHEMA.md
├── CLAUDE.md · AGENTS.md      a constituição, uma para cada agente
├── 00-sistema/
│   ├── CURRENT-STATE.md       o ambiente auditado
│   ├── regras/                standing rules
│   ├── testes/                falhas verificadas viradas gate permanente
│   └── logs/                  observabilidade enxuta
├── 01-inbox/                  entrou, ainda não foi processado
├── 02-fontes/                 RAW imutável — chats, docs, transcrições
├── 03-projetos/
│   ├── feel/PROJECT-STATE.md
│   ├── levay/PROJECT-STATE.md
│   └── cerebro/PROJECT-STATE.md
├── 04-memoria/
│   ├── decisoes/  raciocinios/  insights/  open-loops/  padroes/
├── 05-packs/                  corpus curado para o Gemini Notebook
└── 09-arquivo/
```

### Modelo de dados — seis classes, dez campos

```yaml
id:          # DEC-001 · RT-001 · INS-001 · OL-001
type:        # decision | reasoning | insight | open-loop | project-state | source
project:
scope:       # pessoal | publico | cliente:<nome>      ← barreira de vazamento
status:      # ativa | superseded | resolvida | dormente
epistemic:   # fato | evidencia | decisao | hipotese | inferencia | opiniao
confidence:  # baixa | media | alta
created / updated:
source:      # [[02-fontes/chats/...]] + âncora
supersedes / related:
```

`ideia`, `hipótese`, `experimento`, `lição` e `ideia dormente` **não** viram classes próprias na V1 — vivem como `status` e `epistemic` dentro dessas seis. Se o uso provar necessidade, promove-se depois. O documento tinha dezesseis tipos; dezesseis tipos é uma taxonomia que ninguém mantém.

### O destino do aprendizado

```
                    ┌──→ MEMÓRIA   "aprendemos isso"       promoção normal
APRENDIZADO ────────┼──→ TESTE     "não pode se repetir"   basta uma falha verificada
                    └──→ REGRA     "muda como trabalhamos" exige recorrência + impacto
```

Falha verificada vira teste automaticamente. **Mudar regra exige evidência maior** — caso contrário, em três meses você tem duzentas regras conflitantes e um sistema paranoico.

---

## 5. O plano — do zero ao cérebro rodando

Cada gate termina em **resultado observável**, não em arquivo criado. Só avança quem passou no teste.

### GATE 0 · Ambiente — 1 hora

| | |
|---|---|
| **Objetivo** | Sair do ambiente imaginário |
| **Ação** | `winget install OpenJS.NodeJS.LTS` · abrir terminal **novo** · `node -v`. Criar `C:\Users\tassi\cerebro`. Conectar essa pasta no app do Claude ("Adicionar pasta"). Confirmar Obsidian instalado. `git init` no cérebro. E, de quebra, **commitar o repo Feel**, que hoje está com zero commits |
| **Teste** | `node -v` responde; a pasta aparece nas pastas conectadas; `git log` do Feel mostra ao menos um commit |
| **Pronto quando** | Existe um terminal onde `node`, `git` e o caminho do cérebro funcionam juntos |
| **Bônus** | Instalar o Node também desbloqueia a Fase 1 do Feel, parada por isso |

### GATE 1 · O esqueleto — 1 sessão

| | |
|---|---|
| **Objetivo** | O cérebro existir, mesmo vazio |
| **Ação** | Criar a estrutura de pastas. Escrever `SCHEMA.md`, `CLAUDE.md`, `AGENTS.md` e os templates das seis classes — **copiando os padrões do repo Feel**, não inventando: índice carregado toda sessão, hierarquia de conflito, log de decisões com critério de reabertura, governança sem autoaprovação. `HOME.md` com Dataview. `.gitignore`. Abrir a pasta como vault no Obsidian |
| **Teste** | Abrir o Obsidian e navegar |
| **Pronto quando** | `git log` mostra o primeiro commit e o HOME abre no Obsidian |
| **Não pense ainda em** | retrieval, hooks, QMD, MCP, grafo, UI própria |

### GATE 2 · Checkpoint 01 — a prova de valor — 1 sessão

| | |
|---|---|
| **Objetivo** | Provar que mineração produz algo que você não enxergava |
| **Entra** | O `.md` deste chat do ChatGPT |
| **Ação** | Rodar o **Prompt A** apontado para ele, projeto `cerebro` |
| **Sai** | 1 fonte imutável · decisões · reasoning threads · open loops · ideias dormentes · contradições · `PROJECT-STATE.md` · `HOME.md` preenchido |
| **Teste** | Você lê e pensa: *"agora vejo o que estava escondido ali"* |
| **Pronto quando** | Pelo menos um item extraído muda uma decisão ou uma ação sua |
| **Se falhar** | Não avance. Ou o prompt está fraco, ou a tese está errada. Descobrir isso aqui custa uma sessão; descobrir no Gate 6 custa um mês |

### GATE 3 · Recuperação — 1 sessão

| | |
|---|---|
| **Objetivo** | Encontrar o mínimo relevante, não despejar o vault |
| **Ação** | Duas metades. **Texto:** baseline com `ripgrep` + metadata, cinco perguntas reais, medir, e só então `npm i -g @tobilu/qmd` para comparar nas mesmas cinco. **Estrutura:** escrever o `cerebro-index` — frontmatter, relações tipadas, validação, `graph.json` |
| **Teste** | QMD ganha do `rg` em pergunta semântica? |
| **Pronto quando** | Uma sessão nova recupera uma decisão antiga sem você dizer onde ela está |
| **Risco declarado** | QMD não documenta suporte a Windows e depende de extensões de SQLite. **Se não instalar em trinta minutos, fica no `rg` e siga.** O sistema inteiro precisa funcionar sem QMD |


### GATE 3.5 · Mapa v1 — a UI própria — 3–4 sessões

| | |
|---|---|
| **Objetivo** | Se localizar visualmente, na sua própria gramática |
| **Ação** | Renderer em canvas com os seis glifos, posições persistidas em `layout.json`, modos *Onde estou* e *Como se conecta*, painel do nó e ponte `obsidian://` |
| **Teste** | Você abre o mapa depois de uma semana longe e sabe onde está sem ler nada |
| **Trava** | **Só leitura.** A UI nunca altera uma nota. Se passar de quatro sessões, o escopo está errado |
| **Spec** | `MAPA-UI.md` |

### GATE 4 · O ciclo completo, na mão — 1 semana de uso real

| | |
|---|---|
| **Objetivo** | Rodar o loop inteiro em trabalho de verdade, sem automação |
| **Ação** | Criar dois comandos no cérebro: `/orientar` (lê PROJECT-STATE + recupera memória relevante) e `/consolidar` (verifica → reflete → gera candidatos → atualiza estado → commita). Usar num projeto real |
| **Teste** | `ORIENTAR → RECUPERAR → EXECUTAR → VERIFICAR → REFLETIR → CONSOLIDAR → REGISTRAR` acontece de ponta a ponta |
| **Pronto quando** | Você usou por uma semana e **confiou** no que voltou |
| **Por que na mão** | Automatizar um loop em que você ainda não confia multiplica o erro em vez de eliminar o trabalho |

### GATE 5 · Automação no Claude Code — 1 sessão

| | |
|---|---|
| **Objetivo** | Parar de pedir "procure na memória" e "registre isso" |
| **Ação** | `UserPromptSubmit` → recuperação, devolvida via `additionalContext`. `Stop`/`SessionEnd` → reflexão, com handler de prompt. Sem daemon, sem MCP próprio |
| **Regras duras** | Hooks rápidos, idempotentes e tolerantes a falha. **Se a memória cair, o trabalho continua.** Recuperação uma vez por tarefa, não a cada ferramenta. Log em arquivo, terminal limpo |
| **Teste** | Abrir um projeto, dar uma tarefa, e o contexto certo aparecer sozinho |
| **Pronto quando** | Uma tarefa começa e termina e a memória se atualiza sem intervenção |

### GATE 6 · Codex — meia sessão

`AGENTS.md` global + hooks equivalentes. `AGENTS.md` ensina que a camada existe, quando usá-la e o que fazer se ela falhar — **nunca vira banco de conhecimento**. A memória nativa do Codex é auxiliar; a canônica é o vault.


### GATE 6.5 · Mapa v2 — tempo, fio e saúde — 2–3 sessões

Régua de tempo sobre o histórico do Git, a vista de uma linha de raciocínio desenhada como cicloide, e o painel de lint do vault: `supersedes` quebrado, nó órfão, nota sem fonte, contradição não resolvida.

### GATE 7 · Cross-project e testes de aceitação — 1 sessão

Os seis testes do documento, agora com nomes de arquivos reais:

| | Teste | Esperado |
|---|---|---|
| A | Aprendizado do projeto A, tarefa no projeto B | Aparece sozinho, e **só** quando relevante |
| B | Decisão nova relevante | Registrada automaticamente |
| C | Mesma ideia aparece de novo | Não duplica |
| D | Decisão antiga muda | `supersedes`, com histórico preservado |
| E | Tarefa trivial | **Nenhuma** memória permanente criada |
| F | Vault indisponível | Agentes seguem funcionando e reportam a falha |
| **G** | Memória com `scope: cliente:X` numa sessão do cliente Y | **Não aparece.** Teste novo, não estava no documento |

### GATE 8 · Inteligência — só depois de uso real

Knowledge Packs → Gemini Notebook para síntese de corpus. Smart Connections como visão periférica. Um **Memory Curator** mensal, que procura conceitos que atravessaram projetos, padrões emergentes e contradições — como ritual, não como agente rodando sempre. Graphify quando houver codebase que justifique.

Nada aqui pertence ao MVP.

### GitHub — o que só você pode fazer

Eu não tenho acesso à sua conta. No Gate 1 ou 2:

1. Criar `cerebro` como repositório **privado** no GitHub.
2. `git remote add origin ...` e `git push -u origin main`.
3. Confirmar o `.gitignore`: entram `.md`, schemas, templates, scripts e configs não sensíveis. Ficam de fora `.env`, tokens, cookies, cache, índice do QMD, embeddings, perfis de navegador e binários pesados.
4. Nunca versionar segredo. A sanitização acontece **antes** do writeback, não depois.

Os commits do cérebro são a memória temporal: `decisao(feel): SPACE vira camada de apoio` diz mais do que a nota sozinha.

---

## 6. Os rituais

**Toda sessão** começa com orientação e termina com consolidação — automático a partir do Gate 5.

**Toda sexta, quinze minutos:** abrir o inbox, promover o que merece, descartar o resto, fechar as pontas soltas que já foram resolvidas na prática. Quinze minutos. Se passar disso duas semanas seguidas, o sistema está pedindo simplificação, não mais disciplina.

**Todo mês, meia hora:** rodar o curador. Que conceito apareceu em três projetos? Que decisão de hoje contradiz uma de seis meses atrás? Que ideia dormente merece voltar?

---

## 7. Modos de falha vigiados

| Risco | Mitigação |
|---|---|
| Aterro cognitivo | Promoção seletiva; relatório de descarte a cada extração |
| Contexto demais no prompt | 3 a 10 itens por tarefa, nunca o vault |
| Inferência virando fato | `epistemic:` obrigatório; `inferencia` nunca vira `fato` sem evidência nova |
| Contradição silenciosa | Nunca escolher um lado sozinho: apresentar os dois e perguntar |
| Hook quebrando o trabalho | Falha de memória **nunca** bloqueia a tarefa |
| Vazamento entre clientes | `scope:` desde a primeira nota + teste G |
| Git poluído | `.gitignore` no Gate 1, não depois |
| Você não entender mais o sistema | `HOME.md` responde em 30 segundos; se parar de responder, é bug do sistema |
| Décima versão da arquitetura | Este plano tem gates com teste. Arquitetura nova só com problema observado |

---

## 8. Você está aqui

| | |
|---|---|
| **Projeto** | Cérebro — camada de orientação, memória e inteligência |
| **Fase** | ORIENTAR |
| **Maturidade real** | `DEFINIDO`. Nada construído ainda — e isso está certo |
| **Última conquista** | Arquitetura fechada, dependências verificadas, ambiente auditado |
| **Descoberta que muda o plano** | Metade dos padrões já roda no repo Feel. É extração, não invenção |

**AGORA — uma prioridade**
Gate 0. Instalar o Node, criar `C:\Users\tassi\cerebro`, conectar a pasta. Uma hora.

**DEPOIS — no máximo três**
1. Gate 1 — esqueleto do vault, herdando os padrões do Feel.
2. Gate 2 — minerar este chat com o Prompt A.
3. Gate 3 — recuperação de texto e o indexador de estrutura.

**NÃO PRECISA PENSAR AINDA EM**
MCP próprio · embeddings · Graphiti · Mem0 · Neo4j · orquestração multiagente · export completo do ChatGPT · NotebookLM · Smart Connections · Graphify

---

**Fontes verificadas:** [tobi/qmd](https://github.com/tobi/qmd) · [lucasrosati/claude-code-memory-setup](https://github.com/lucasrosati/claude-code-memory-setup) · [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) · [Claude Code — Hooks](https://code.claude.com/docs/en/hooks) · [Google renomeia NotebookLM para Gemini Notebook](https://9to5google.com/2026/07/16/notebooklm-gemini-notebook/)
