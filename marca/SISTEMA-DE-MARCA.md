# Projeto — Identidade visual Feel

Este projeto é o **sistema de marca da Feel** (branded house para economia criativa). Toda peça criada aqui segue o Sistema de Marca v2.

## Fontes da verdade
- **`DESIGN.md`** (raiz) — tokens (cores, tipografia, raio, espaçamento) + gramática + componentes + racional. Formato google-labs `design.md`. É o handoff legível por máquina; consultar antes de definir qualquer valor.
- **`Feel — Índice.dc.html`** (raiz) — o índice dos cinco espaços (00-tese · 01-marca · 02-feelworks · 03-feelmakers · 04-parcerias).
- **`00-tese/Feel — Tese Estratégica.dc.html`** — a tese de negócio (o porquê): a Feel como infraestrutura de reputação, confiança e coordenação. Contém também o `Feel — Plano de Produção.dc.html` (waves + prompts-semente).
- **`01-marca/Feel - Sistema de Marca.dc.html`** — o manual + a constituição: leis, dosagem, teste, índice das obras e regras de evolução (a antiga Creative Constitution foi fundida na abertura/estrutura deste doc).
- **`01-marca/Feel - Gramática do Fio.dc.html`** — a prova de que o fio gera o sistema (5:8:5, traço, ícones).
- **`EVOLUTION.md`** — o processo: toda peça nova segue o loop contexto → gerar → avaliar (O Teste) → remover 30% → travar.

## Diretrizes travadas (v2)
- **Princípio-raiz:** a Feel revela, não cria — e **o design revela, nunca grita**. Essencialismo: toda peça deve poder perder 30% e melhorar.
- **Dosagem 90 / 8 / 2:** 90% neutros, coral ≤ 8% (regra do anel: **um elemento coral por composição**), glass ≤ 2% e só como estado de "descoberta".
- **Modos:** claro (paper) é o default do sistema; **ink escuro só para palco/evento/FeelMakers**.
- **Tipografia:** só **Archivo** (display/texto) + **IBM Plex Mono** (dados/labels, números tabulares). Hierarquia por peso/escala/espaço, nunca por trocar fonte. Nunca Space Grotesk/Inter/JetBrains.
- **Logo:** monocromático é o padrão; bicolor é exceção de campanha; a anatomia f/l + ee não se mexe.
- **O fio:** consequência, não origem — gesto dos "ee" (cicloide). Assinatura é o padrão; estrutural só em timeline; topografia só em capa/palco. Ícones derivam do gesto — nunca packs prontos. **Gramática travada:** proporção 5:8:5, corte assimétrico, terminal redondo r=0.5u, o fio nunca fecha.
- **Motion:** a marca **se desenha** (desenhar · revelar · conectar · respirar · deslizar · entrelaçar). Proibido: explodir, quicar, girar sem motivo, piscar.
- **Amber (#F0A63B):** exclusivo do FeelMakers; nunca com coral na mesma peça.
- **Voz:** marca = Feel; convite = "Segue a Feel"; "Segue o fio" é camada descoberta, nunca explicada. Registro builder (lastro, prova, obra, ritmo). A voz sugere, não explica; sempre o fato ("34 provas assinadas"), nunca "plataforma que conecta".
- **Fotografia:** documental, em relação; nunca stock de creator com ring light, 3D decorativo ou mockup brilhante de SaaS.

## O teste (aplicar antes de entregar)
Sem logo / sem cor / sem efeitos / em P&B / paleta copiada — ainda parece Feel e continua elegante? Se não, remove 30% e refaz.

## Ambiente
Designs são Design Components (`.dc.html`) com **estilo inline** — o `DESIGN.md` é documentação/handoff, não fonte de runtime; replicar os valores dele à mão nos estilos inline. Manter `a`/`a:hover`/`::selection` no coral do sistema.
