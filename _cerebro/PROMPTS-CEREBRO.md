# Prompts Mestres — Cérebro

> Três prompts. Cada um faz **uma** coisa e para. Nenhum deles implementa arquitetura.
> Ordem de uso: **A → B → C**.
>
> | # | Prompt | Quando usar | Sai daqui |
> |---|---|---|---|
> | **A** | Mineração de conversa | Uma thread longa de ChatGPT/Claude | `source` + decisões + raciocínios + open loops + ideias dormentes + contradições |
> | **B** | Fechamento de arquitetura | Depois de A, com o material na mesa | A arquitetura final, com trade-offs e o que foi descartado |
> | **C** | Mineração de repositório | Qualquer repo (seu ou de terceiro) | Ficha padronizada do repo: o que resolve, o que dá pra roubar, o que rejeitar |

---

# PROMPT A — MINERAÇÃO DE CONVERSA

**Onde colar:** Claude Code (ou Codex) aberto na raiz do vault, com o arquivo da conversa acessível.
**Substitua:** `{{ARQUIVO}}`, `{{PROJETO}}`.

---

Você vai **minerar** uma conversa longa. Minerar não é resumir. Resumir preserva a conclusão; minerar preserva o caminho, o que ficou pelo caminho e o que contradiz o caminho.

**Arquivo:** `{{ARQUIVO}}`
**Projeto:** `{{PROJETO}}`

## Regra zero — modo leitura

Nesta tarefa você **não implementa nada**. Não instala, não cria estrutura de sistema, não configura ferramenta, não escreve código. Você lê, extrai e escreve arquivos Markdown de conhecimento. Se sentir vontade de "já ir adiantando a implementação", isso é exatamente o erro que este prompt existe para evitar.

## Regra um — leia inteiro antes de escrever qualquer coisa

O arquivo é longo. Leia-o **inteiro**, em blocos, antes de produzir a primeira linha de saída. Uma leitura dinâmica produz uma extração medíocre: o valor está enterrado no meio, não no fim. Se o arquivo exceder sua janela, particione e mantenha um caderno de notas incremental — mas nunca extraia a partir de uma amostra.

Declare no início da resposta: `LIDO: N de N linhas/blocos`.

## Regra dois — a fonte é imutável

Copie o arquivo original, sem edição, para `02-fontes/chats/AAAA-MM-DD-slug.md`, com frontmatter e um hash do conteúdo. Todo item extraído aponta de volta para essa cópia com uma âncora suficiente para reencontrar o trecho (data da mensagem, primeiras palavras, ou número de linha). **Nunca substitua a fonte por um resumo.**

## Regra três — separe o que você sabe do que você deduziu

Todo item extraído carrega um estado epistêmico:

| Estado | Significa |
|---|---|
| `fato` | Verificável fora da conversa |
| `evidencia` | Dado/observação apresentado na conversa |
| `decisao` | Alguém decidiu e a decisão sobreviveu |
| `hipotese` | Formulado como possibilidade, ainda não testado |
| `inferencia` | **Sua** dedução, não o que foi dito |
| `opiniao` | Preferência declarada sem sustentação |

Repetição não promove hipótese a fato. Se a conversa disse uma coisa oito vezes e nunca testou, continua `hipotese`.

## Regra quatro — verifique as afirmações externas

A conversa cita ferramentas, repositórios, números de estrelas, nomes de produtos, funcionalidades e datas. **Muitas dessas afirmações podem estar erradas** — foram geradas por um modelo, com ou sem busca, em outro momento.

Para cada afirmação externa que a arquitetura depende (uma ferramenta existe? faz o que dizem? roda no meu ambiente?), marque:

```
AFIRMAÇÃO: ...
STATUS: verificado | não verificado | contradito | obsoleto
FONTE: ...
IMPACTO SE FALSA: ...
```

Não trate número de estrelas, nome de produto ou funcionalidade como fato só porque apareceu no texto. Se tiver acesso à web, verifique as que forem load-bearing. Se não tiver, marque `não verificado` e liste como pendência — nunca invente a verificação.

## O que extrair

Extraia **apenas** o que tiver valor futuro. Uma conversa de 10 mil linhas não gera 200 notas; gera algumas dezenas de itens que merecem sobreviver.

### 1. `decision` — decisões
O que foi decidido, **por quê**, qual evidência sustentou, o que foi considerado e descartado, se ainda vale, e o que reabriria. Uma decisão sem rationale perde a maior parte do valor. Se a conversa mudou de ideia, registre a decisão nova com `supersedes:` apontando para a antiga — e **não apague a antiga**.

### 2. `reasoning` — linhas de raciocínio
Este é o item mais valioso e o mais fácil de perder. Quando uma ideia evoluiu ao longo de várias mensagens, preserve a **cadeia**, não o ponto final:

```
IDEIA INICIAL → OBJEÇÃO → NOVA INFORMAÇÃO → REFORMULAÇÃO → CONSEQUÊNCIA → DECISÃO
```

Cada elo com data/âncora. Uma conclusão sem o caminho que levou a ela é uma conclusão que não se consegue revisar depois.

### 3. `insight` — percepções reutilizáveis
Algo que mudou o entendimento e serve fora do contexto onde nasceu. Se só faz sentido dentro daquela conversa, não é insight — é contexto.

### 4. `open-loop` — pontas soltas
Pergunta feita e nunca respondida; teste sugerido e não executado; dado prometido e não coletado; decisão travada esperando informação; próximo passo mencionado e nunca feito. Cada uma com: o que está pendente, de que depende, e o que destrava.

### 5. `dormant-idea` — ideias que sumiram sem serem descartadas
O critério é específico: recebeu desenvolvimento relevante, parecia promissora, **não foi rejeitada**, não virou decisão, e parou de aparecer. Ideia abandonada por decisão estratégica não entra aqui. Ideia abandonada por dinâmica de conversa entra.

### 6. `conflict` — contradições
Onde a conversa afirma A e depois afirma não-A sem reconhecer a mudança; ou onde uma conclusão contradiz um documento/decisão fora da conversa. Apresente lado a lado, com as duas âncoras, e classifique: **evolução legítima**, **contradição não resolvida**, ou **hipótese alternativa convivendo**. Nunca "corrija" silenciosamente escolhendo um dos lados.

### 7. `connection` — relações
Ligue itens entre si e a projetos com um tipo lógico: `supports`, `contradicts`, `derived-from`, `supersedes`, `depends-on`, `similar-to`, `inspired-by`, `used-in`. E com uma força: `direta`, `forte`, `possível`, `especulativa`.

**Não crie link por semelhança de palavra.** Dois documentos que citam "memória" não estão relacionados por isso. Um link que não muda nada é ruído com aparência de organização.

## O que NÃO extrair

- Mensagens de cortesia, meta-conversa sobre o próprio chat, reformulações da mesma coisa.
- Conteúdo derivável em dois minutos de outra fonte.
- Resumos de resumos.
- Qualquer coisa em que você não consiga responder: *"que tarefa futura isso melhora?"*

Ao final, informe quantos candidatos você **descartou** e por quê. Uma extração que não descarta nada não filtrou nada.

## Além dos itens: leia o arco

Depois da extração item a item, produza uma seção curta que os itens sozinhos não dão:

**A EVOLUÇÃO DO PENSAMENTO** — em que ponto a conversa começou, quais foram as viradas reais (não as reformulações), e onde terminou. Nomeie cada virada e diga o que a causou.

**O QUE A CONVERSA NÃO PERCEBEU SOBRE SI MESMA** — padrões visíveis de fora: ela orbitou um problema sem resolver? Trocou de arquitetura N vezes? Produziu N versões de um plano e zero artefatos? Adiou sistematicamente a mesma decisão? Seja direto. Esta seção costuma ser a mais útil e é a que exige mais coragem.

**MATURIDADE REAL** — classifique o assunto da conversa em `IDEIA · EXPLORADO · DEFINIDO · CONSTRUINDO · TESTANDO · UTILIZÁVEL · ESTÁVEL`, e defenda a classificação. Se nada foi construído, o estado é `DEFINIDO`, por mais sofisticado que o texto seja. Dizer "80%" quando não existe artefato é o erro que este sistema existe para impedir.

## Saída — arquivos

Escreva, com este frontmatter mínimo:

```yaml
---
id:            # DEC-001 | RT-001 | INS-001 | OL-001
type:          # decision | reasoning | insight | open-loop | source | project-state
project:
scope:         # pessoal | publico | cliente:<nome>
status:        # ativa | superseded | resolvida | dormente
epistemic:     # fato | evidencia | decisao | hipotese | inferencia | opiniao
confidence:    # baixa | media | alta
created:
updated:
source:        # [[02-fontes/chats/...]] + âncora
supersedes:
related:
---
```

Estrutura de destino:

```
02-fontes/chats/AAAA-MM-DD-slug.md      cópia imutável
04-memoria/decisoes/DEC-NNN-slug.md
04-memoria/raciocinios/RT-NNN-slug.md
04-memoria/insights/INS-NNN-slug.md
04-memoria/open-loops/OL-NNN-slug.md
03-projetos/{{PROJETO}}/PROJECT-STATE.md
```

## Saída — resposta na tela

Termine **exatamente** assim, e não com uma lista de tarefas:

```
ANTES DA EXTRAÇÃO
o que estava difícil de enxergar

DEPOIS DA EXTRAÇÃO
o que ficou visível

MUDA ALGUMA COISA?
alguma decisão, ação ou entendimento muda por causa disso?
Se não muda nada, a extração não provou valor — diga isso.

VOCÊ ESTÁ AQUI
projeto · fase · maturidade real · último resultado observável

AGORA
uma única prioridade

DEPOIS
no máximo três

NÃO PRECISA PENSAR AINDA EM
o que pode ser deliberadamente ignorado nesta etapa
```

---

# PROMPT B — FECHAMENTO DE ARQUITETURA

**Quando:** depois de A, com a extração pronta e as afirmações externas verificadas.

---

Com base **apenas** no material extraído em `04-memoria/` e `03-projetos/`, feche a arquitetura do sistema. Não recomece a discussão: o corpus já contém a discussão. Seu trabalho é **decidir**.

## Antes de propor: audite o ambiente real

1. Sistema operacional, shell, caminhos (atenção a espaço e acento).
2. O que está instalado: `git`, `node`, `python`, `rg` — versão de cada. Não presuma.
3. O que já existe de memória/configuração: `~/.claude/`, `~/.codex/`, `CLAUDE.md`, `AGENTS.md`, hooks, skills, MCPs.
4. Onde há sincronização de nuvem (OneDrive/Dropbox) sobre pastas que terão `.git`.
5. O que pode conflitar com a arquitetura proposta.

Produza `00-sistema/CURRENT-STATE.md` com esse diagnóstico **antes** de qualquer recomendação. Uma arquitetura desenhada para um ambiente imaginário é ficção.

## Regra de admissão de tecnologia

Nenhum componente entra sem responder as seis perguntas:

```
PROBLEMA           que problema observado ele resolve?
VALOR ÚNICO        o que ele faz que o que já temos não faz?
CUSTO              que complexidade e que dependência adiciona?
FALHA              o sistema para de funcionar sem ele?
REVERSIBILIDADE    quanto custa remover daqui a três meses?
VEREDITO           ADOTAR | TESTAR | DEPOIS | REJEITAR
```

Sem problema **observado**, o veredito é `DEPOIS` — não `ADOTAR porque é interessante`.

## Invariantes — não negociáveis

1. **Uma casa canônica.** Markdown versionado. Nenhuma outra ferramenta guarda uma segunda versão da verdade.
2. **Fonte bruta preservada.** `RAW → EXTRAÍDO → CONSOLIDADO`, nunca `RAW → resumo → apagar RAW`.
3. **Proveniência.** Todo item sabe de onde veio e permite voltar lá.
4. **Distinção epistêmica.** Fato ≠ evidência ≠ inferência ≠ hipótese ≠ decisão.
5. **Temporalidade.** Nada é sobrescrito em silêncio. `supersedes:` preserva o histórico.
6. **Maturidade.** `IDEIA → EXPLORADO → DEFINIDO → CONSTRUINDO → TESTANDO → UTILIZÁVEL → ESTÁVEL`. "Pronto" sozinho não é um estado.
7. **Captura ≠ promoção.** Capturar pode ser automático; promover a conhecimento permanente é seletivo.
8. **Reversibilidade.** Se qualquer ferramenta sumir amanhã, o conhecimento continua legível numa pasta.
9. **Escopo.** Todo item carrega `scope:`. Memória de cliente não vaza para sessão de outro cliente. Isso é barato agora e caro depois.

## Entregue, nesta ordem

1. **VEREDITO** — a arquitetura escolhida, em no máximo 15 linhas.
2. **DIAGRAMA** — texto simples, uma tela.
3. **RESPONSABILIDADE DE CADA PEÇA** — uma função inequívoca por ferramenta. Duas ferramentas com a mesma função é um erro de arquitetura, não redundância saudável.
4. **FONTE DA VERDADE** — onde mora, e o que explicitamente **não** é fonte da verdade.
5. **FLUXO** — `ORIENTAR → RECUPERAR → EXECUTAR → VERIFICAR → REFLETIR → CONSOLIDAR → REGISTRAR`, com o que é determinístico e o que exige modelo em cada passo.
6. **DESTINO DO APRENDIZADO** — todo aprendizado termina em um de três lugares: `MEMÓRIA` (aprendemos isso), `TESTE` (garantir que não se repita) ou `REGRA` (muda como o sistema trabalha). Diga o critério de promoção de cada um. Falha verificada pode virar teste automaticamente; **mudar regra exige evidência maior**.
7. **MODELO DE DADOS MÍNIMO** — para cada campo, que problema concreto resolve. Campo sem justificativa sai.
8. **O QUE SAIU** — o que a arquitetura anterior tinha e não precisa mais existir. Esta seção é obrigatória e uma arquitetura que só cresce está errada.
9. **MODOS DE FALHA** — red team: lixão de memória, recuperação irrelevante, inferência virando fato, contradição silenciosa, hook quebrando o trabalho, latência, vazamento entre projetos, git poluído, e o usuário deixando de entender o próprio sistema. Para cada um: probabilidade, impacto, mitigação.
10. **GATES** — a sequência de implementação. Cada gate com `OBJETIVO · ENTRA · AÇÃO · SAI · TESTE · PRONTO QUANDO`. Um gate só termina com resultado observável, não com arquivo criado.
11. **AGORA / DEPOIS / MAIS TARDE / REJEITADO** — máximo uma prioridade em AGORA.

## Condição final

Prefira a arquitetura pequena que ele entende, usa e confia à arquitetura tecnicamente impressionante. O produto não é memória sofisticada: é **continuidade cognitiva**. Se a resposta a *"depois de construído, isso deixa o trabalho perceptivelmente melhor sem ficar mais difícil de manter?"* for não, não construa.

---

# PROMPT C — MINERAÇÃO DE REPOSITÓRIO

**Quando:** para cada repo que você quer avaliar ou canibalizar. Rode uma vez por repo, sempre com o mesmo formato, para que as fichas sejam comparáveis.
**Substitua:** `{{REPO}}`.

---

Audite o repositório `{{REPO}}` em **modo leitura**. Não clone para modificar, não abra PR, não proponha código ainda.

## 1. O que ele é de fato

Não analise pelo README. O README vende; o código entrega. Inspecione: estrutura de diretórios, scripts reais, configuração, testes, issues abertas relevantes e commits recentes.

Classifique cada capacidade que você atribuir ao projeto:

```
IMPLEMENTADO   existe no código e funciona
DOCUMENTADO    o README afirma, o código não mostra
PROPOSTO       roadmap, issue, intenção
PRESUMIDO      você deduziu — marque e trate como frágil
```

**Onde documentação e implementação divergirem, a implementação vence.** Diga explicitamente onde divergem: essa diferença costuma ser o achado mais útil da auditoria.

## 2. Reconstrua a arquitetura

Em prosa curta e um diagrama de texto: que problema resolve, como funciona, onde mora o estado, o que acontece automaticamente, o que depende do usuário lembrar de acionar, e o que simplesmente não existe.

Essa última distinção é crítica. Um comando que o usuário precisa digitar não é automação — é uma convenção com boa documentação.

## 3. Sinais de saúde

Manutenção (último commit, cadência, issues sem resposta), licença, dependências e o que elas arrastam, requisitos de runtime e **se roda no meu ambiente concreto** (Windows 11, caminhos com espaço e acento), superfície de segurança (executa código? guarda credencial? automatiza navegador? pede chave de API?), e reversibilidade (quanto custa sair depois de seis meses de uso).

Um projeto com muitas estrelas e três meses sem commit é um risco, não um selo de qualidade. Número de estrelas não é evidência de nada além de atenção — não use como argumento.

## 4. Cruzamento com o nosso sistema

Para cada capacidade nossa, uma linha:

| Capacidade | Repo | Nós | Lacuna real? | Impacto | Decisão |
|---|---|---|---|---|---|

Lacuna: `NENHUMA · BAIXA · MÉDIA · ALTA`.
Decisão: `MANTER · ADAPTAR · ADICIONAR · SUBSTITUIR · ADIAR · REMOVER`.

Duas perguntas fecham a ficha:

> **Depois que este repo está instalado e funcionando corretamente, que problemas continuam existindo?**
>
> **Quais desses o nosso sistema realmente resolve — e quais nós estaríamos reinventando à toa?**

Se o repo já resolve bem, **não reconstrua**. Anote como componente adotado ou como padrão a copiar, e siga.

## 5. Saída

```
1  VEREDITO           adotar · canibalizar padrões · estudar · ignorar — e por quê
2  O QUE É            arquitetura real, não a prometida
3  RESOLVE BEM        o que não devemos reconstruir
4  LACUNAS            só as comprováveis
5  O QUE ROUBAR       padrões, decisões de design, trechos, convenções
6  O QUE REJEITAR     e o motivo — dogmas embutidos contam
7  RISCOS             manutenção, dependência, segurança, lock-in
8  DECISÃO POR PEÇA   a tabela acima
9  UMA LINHA          a frase que resume o que esse repo ensinou
```

Se o veredito for "ignorar", pare em três parágrafos. Auditoria longa de repo irrelevante é a forma mais elegante de procrastinar.
