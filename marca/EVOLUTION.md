# Feel — Plano de Evolução (auto-promptável)

> Objetivo: evoluir a Feel para um sistema **coerente, robusto e memorável**, fácil de aplicar e focado no essencial. Este arquivo é o plano *e* o executor: cada Loop traz um prompt pronto para colar. O estado vive nos **arquivos**, não no chat.

---

## 0. O HARNESS (contexto fixo de toda rodada)

O harness é o mínimo de contexto + regras que toda rodada carrega. Ele é o que torna cada Loop barato, repetível e coerente — sem depender da memória da conversa.

**Arquivos-fonte (ler sempre, nesta ordem):**
1. `DESIGN.md` — tokens + racional (a verdade legível por máquina).
2. `CLAUDE.md` — diretrizes travadas v2 (as leis).
3. `01-marca/Feel - Sistema de Marca.dc.html` — o manual aplicado + a constituição (constituição, obras e regras de evolução foram fundidas aqui).
4. `assets/` — logo, wordmarks, símbolo.

**Estrutura de arquivos (jul 2026 · reestruturação em pastas):** o projeto vive em cinco espaços autossuficientes, indexados por `Feel — Índice.dc.html` na raiz.
- `00-tese/` — a tese de negócio (o porquê): a Feel como infraestrutura de reputação e confiança. Problema, teste da tese, moat, sequência, PMF, categoria, narrativas, mapa do sistema. É o ápice que une os demais. Inclui o **Plano de Produção** (`Feel — Plano de Produção.dc.html`): backlog por público, waves de produção com paralelismo, tiers de modelo e prompts-semente para rodar frentes em paralelo.
- `01-marca/` — o sistema: Sistema de Marca (hub), Gramática do Fio, Componentes, e as obras (Deck, Grid, Materialidade, Palco FeelMakers).
- `02-feelworks/` — o produto/app: telas (perfil creator, perfil assessor) + estratégia. *R2: fundir a estratégia (3→1) e criar wireframe + inventário de telas.*
- `03-feelmakers/` — o físico (Patteo), num workspace único `Feel - FeelMakers — Espaço (Patteo).dc.html`: conceito, leitura da planta real, princípio de ocupação, zoneamento térreo/mezanino, as 7 áreas, telas de cena, 9 frentes de receita, riscos, operação enxuta com IA, fases + projeção e valor por stakeholder. *(R3 concluída: fusão dos 3 docs.)*
- `04-parcerias/` — externo: Feel × Você.
- Cada pasta tem cópias próprias de `support.js` / `image-slot.js` / `deck-stage.js`; `01-marca/` tem cópia própria de `assets/`.
- Removidos: `Creative Constitution` (fundida no Sistema de Marca), o print duplicado e `Feel × Liquid Glass` (violavam a v2).

**Contrato do harness (preâmbulo de todo self-prompt):**
> Você é o Diretor Criativo da Feel. Leia `DESIGN.md` e `CLAUDE.md` antes de tudo. Produza em Design Component (`.dc.html`) com estilo inline. Uma peça por arquivo. A marca revela, não grita — essencialismo: se dá pra remover 30% e melhorar, remova. Antes de entregar, rode **O Teste**.

---

## 1. O LOOP (engenharia de loop)

Toda unidade de trabalho segue o mesmo ciclo fechado — um "reward loop" com avaliador determinístico:

```
CONTEXTO → GERAR → AVALIAR → CORRIGIR → TRAVAR
   (harness)  (peça)   (O Teste)  (−30%)    (arquivo + DESIGN.md)
```

**Avaliador (O Teste — função de recompensa, 5 perguntas):**
1. Sem o logotipo — ainda parece Feel?
2. Sem a cor — ainda parece Feel?
3. Sem os efeitos — ainda comunica clareza?
4. Em P&B — continua elegante?
5. Se copiarem a paleta — sobra algo impossível de copiar?

**Regra de iteração:** qualquer "não" = a peça depende de superfície. Remova 30%, reforce o estrutural, repita. Só trava com 5 "sim".

**Higiene (harness otimizado):**
- Cada Loop entra com contexto limpo e sai gravando no arquivo — o chat não guarda estado.
- Um entregável = um arquivo. Versione (`… v2`) em vez de sobrescrever explorações.
- Ao fechar um Loop, atualize `DESIGN.md` (tokens/regras novas) — o harness evolui junto.

---

## 2. OS LOOPS (sequência)

Ordem deliberada: **primeiro a gramática (o moat), depois a superfície.** Não pular para aplicações antes do Loop 1/2 fecharem.

### ✅ Loop 0 — Harness — FEITO
`DESIGN.md` + `CLAUDE.md` criados. Baseline travada.

> **STATUS GERAL (jul 2026): loops de sistema concluídos + reestruturação em pastas em andamento.**
> Sistema travado no `DESIGN.md`. Peças novas seguem o loop da seção 1 usando o Sistema de Marca como contexto.
>
> **Reestruturação (Rodadas):** R1 ✅ pastas/espaços + limpeza + fusão da Constituição no Sistema de Marca + índice-mestre. R2 ⏳ FeelWorks: fundir estratégia (3→1) + wireframe/inventário. R3 ✅ FeelMakers/Patteo: fusão 3→1 (workspace único do espaço). R4 ⏳ polir Parcerias + rodar O Teste no conjunto.

---

### Loop 1 — A gramática do fio (o motor gerador) · *o mais importante*
**Fecha as lacunas nº 1 e 2** (o fio ainda é decoração; a identidade não passa no teste "sem logo").
**Entregável:** `Feel - Gramática do Fio.dc.html` — prova visual de que a geometria do wordmark (a cicloide dos "ee") **gera** grid, molduras, ícones e o esqueleto de layout. Define: raio mínimo, espessura, ângulo de cruzamento, como o fio entra/sai do quadro, como vira grade.
**Critério de saída:** removendo logo e coral, uma peça ainda se reconhece como Feel só pela estrutura.

> **PROMPT:** [harness] Atue como Diretor Criativo. Construa `Feel - Gramática do Fio.dc.html`: um estudo que prove que o fio NÃO é ornamento, e sim a lei geradora do sistema. Derive da cicloide do símbolo: (a) um grid proprietário; (b) o raio/peso/terminal dos ícones; (c) uma "assinatura estrutural" de layout que sobreviva sem logo e sem cor. Nada de aplicações ainda. Rode O Teste (foco perguntas 1 e 5).

---

### Loop 2 — Sistema visual (DNA + transformação visível)
**Fecha a lacuna nº 3** (o sistema parece concluído; a Lei 1 pede "sempre em transformação").
**Entregável:** `Feel - Componentes.dc.html` — botões, chips, cards, inputs, listas, timeline de Lastro — todos derivados da gramática do Loop 1. Inclui o mecanismo de "estado em processo" (fio entrando/saindo, glass de descoberta) como padrão, não exceção. Atualizar seção *Components* do `DESIGN.md`.
**Critério de saída:** teste 3 (sem efeitos, ainda comunica clareza) + componentes visivelmente do mesmo DNA.

> **PROMPT:** [harness] Com base em `Feel - Gramática do Fio.dc.html`, construa `Feel - Componentes.dc.html`: kit de componentes (botão 1/2/3, chip, card, input+estados, lista, divisor, timeline de Lastro) todos gerados pela gramática do fio. Encene "transformação" como estado padrão. Depois, adicione a seção Components ao DESIGN.md. Rode O Teste.

---

### Loop 3 — Aplicações (robustez)
Testa o sistema sob pressão real. **Fecha a lacuna "materialização".**
**Entregáveis (um arquivo cada):** `Feel - Deck Institucional.dc.html`; `Feel - Perfil FeelWorks.dc.html` (modo claro); `Feel - Palco FeelMakers.dc.html` (modo escuro + amber); `Feel - Grid Social.dc.html` ("segue o fio").
**Critério de saída:** cada peça passa nas 5 perguntas E parece irmã das outras sem repetir layout.

> **PROMPT (repetir por peça):** [harness] Usando `Feel - Componentes.dc.html`, construa `<PEÇA>`. Modo <claro/escuro> conforme o braço. Coral pela regra do anel; amber só em FeelMakers. Rode O Teste antes de entregar.

---

### Loop 4 — Materialidade & ambiente
**Fecha a lacuna nº 4** (a aposta não-testada: "é um ambiente, não uma interface").
**Entregável:** `Feel - Materialidade.dc.html` — mockups em papel não revestido, tecido cru, metal escovado, sinalização, palco (usar `image-slot` para materiais reais + o tratamento fotográfico do `DESIGN.md`).
**Critério de saída:** a marca parece tocável fora da tela.

> **PROMPT:** [harness] Construa `Feel - Materialidade.dc.html`: aplique o sistema em papel/tecido/metal/sinalização/palco, com slots para fotos reais e o tratamento documental do DESIGN.md. Sem mockup brilhante de SaaS. Rode O Teste.

---

### Loop 5 — Refinamento + Creative Constitution
Consolidação atemporal. **Entregáveis:** varredura removendo tendências passageiras; rodar O Teste em todo o conjunto; e `Feel - Creative Constitution.dc.html` — o documento único e definitivo que qualquer equipe/modelo futuro usa (torna a dependência de um modelo específico desnecessária).
**Critério de saída:** diff do `DESIGN.md` sem regressões; todo o conjunto passa nas 5 perguntas.

> **PROMPT:** [harness] Revise todas as peças; remova o que for tendência, reforce o atemporal. Depois consolide tudo em `Feel - Creative Constitution.dc.html` — a constituição criativa da Feel (filosofia → gramática → sistema → aplicações → regras de evolução). Rode O Teste no conjunto inteiro.

---

## 3. PRINCÍPIO DE PARADA
A força da Feel está na **coerência do ecossistema**, não num símbolo. Pare de abstrair quando o Loop 1 fechar — a partir daí é disciplina, não genialidade. Cada Loop entrega algo aplicável; nenhum Loop depende de "acertar o logo".

---

## 4. Reestruturação em espaços (pós-Loop 5)
Projeto reorganizado em pastas: `00-tese/` · `01-marca/` · `02-feelworks/` · `03-feelmakers/` · `04-parcerias/` · `05-narrativas/` + índice-mestre. Fusões: Constituição→abertura do Sistema de Marca; 3 docs de estratégia FeelWorks→1; 3 docs Patteo→1. Wave 1–4 do `Feel - Plano de Produção.dc.html` concluídas: narrativas por público, telas de produto (onboarding, edição, área pessoal, descoberta/prova), materialidade/social/palco confirmados sem duplicar, O Teste rodado no conjunto. Pendente fora deste sistema: modelo financeiro, registros (INPI/domínios).
