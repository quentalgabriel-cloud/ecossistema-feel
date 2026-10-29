# supabase/ — o núcleo da Feel no projeto `feel`

Decisão: **D-19** (`docs/decisoes/log.md`). Só tabelas novas. As tabelas da v12
(`feel_profiles`, `feel_user_preferences`, `feel_workspace_projects`) e as da Geração 1
(`perfis`, `provas`, `assinaturas`, `oportunidades`) não são tocadas.

## Migrações

| Arquivo | O que faz | Estado no `feel` |
|---|---|---|
| `migrations/20261029120000_feel_nucleo.sql` | `feel_relacoes`, `feel_trabalhos`, `feel_acordos`, `feel_assinaturas`, `feel_convites`, todas com RLS; trigger das regras do ciclo; RPCs `feel_carimbar_acordo`, `feel_convidar`, `feel_aceitar_convite`, `feel_assinar` | aplicada (`feel_nucleo`) |
| `migrations/20261029130000_feel_convite_previa.sql` | `feel_ver_convite`: quem cria vê o combinado carimbado antes de aceitar | aplicada (`feel_convite_previa`) |

Migração aplicada não se edita: correção entra como migração nova.

Para aplicar num projeto novo: `supabase db push` (CLI) ou colar os arquivos, em ordem, no
SQL Editor.

### As regras que moram no banco

- **Relações:** a pessoa só grava `declarado` ou `em_processo`, com `provas = 0`.
  `assinado` e as provas só nascem de `feel_assinar`.
- **Acordo:** só por `feel_carimbar_acordo`, com a data do servidor. Um trigger impede
  qualquer `update`, inclusive do dono do banco.
- **Estágios:** só andam para a frente.
  - `rascunho → proposta` acontece pelo carimbo.
  - `proposta → aceita` acontece pelo convite.
  - `entregue → encerrado` acontece com as duas assinaturas.
  - O contratante move só `aceita → em_andamento → entregue`.
- **Necessidade:** congela depois do acordo. O funil só é medido com o trabalho em curso.
  O veredito só é escrito na entrega e antes da primeira assinatura.
- **Assinatura:** exige e-mail confirmado (JWT `is_anonymous = false`). Com os dois lados,
  o trabalho se encerra e `feel_relacoes` dos **dois** recebe `assinado`, provas + 1, no
  primeiro nicho da necessidade.
- **Quem cria:** entra só pelo convite (token uuid, válido por 14 dias). O contratante não
  aceita o próprio convite, e um convite aceito não troca de dono.

O verificador de segurança do Supabase avisa que as funções `feel_*` (`security definer`)
podem ser executadas por quem está logado. Isso é intencional: elas são o único caminho de
escrita para acordo, convite e assinatura. O anônimo não tem acesso, e cada uma confere
quem chama.

## Teste das regras

`testes/nucleo.sql` cobre 30 casos: o que pode e o que não pode em relações, trabalho,
acordo, convite e assinaturas. Ele cria três usuários de teste (contratante, quem cria e
um intruso), simula cada um com `set local role authenticated` +
`request.jwt.claims` e, no fim, dispara um erro de propósito. Assim **tudo é desfeito**,
inclusive os usuários.

Como rodar: colar no SQL Editor do projeto e executar. O resultado aparece na mensagem do
erro, que começa com `RESULTADO`, uma linha por caso (`ok — …` ou `FALHOU — …`).

> Estado em 2026-10-29: **ainda não rodado** no `feel`. O painel pede confirmação para
> rodar SQL que grava em `auth.users`, e o pedido expirou nas três tentativas desta
> sessão.

## Passos no painel (fora do código)

1. **Ligar a entrada anônima:** projeto `feel` → Authentication → Sign In / Providers →
   "Allow anonymous sign-ins". Sem isso, o app segue no modo local ("Demonstração · neste
   aparelho") e não grava nada no banco.
2. **Endereços de volta do e-mail:** Authentication → URL Configuration. Incluir a URL do
   app em Redirect URLs, com `/trabalhos` e `/trabalhos/convite/*`. O link de confirmação
   volta para lá.
3. **SMTP próprio:** Authentication → Emails → SMTP. O SMTP padrão do Supabase só entrega
   para membros da organização e tem limite baixo por hora. Para quem é de fora assinar,
   é preciso um provedor próprio.
4. **Recomendado:** CAPTCHA (Authentication → Attack Protection), contra criação de contas
   anônimas em massa. Contas anônimas antigas sem trabalho podem ser apagadas
   periodicamente.

## O app

`web/src/lib/supabase/` cuida da configuração (URL e **chave publicável**, que é pública
por natureza), do cliente carregado sob demanda e da sessão anônima com queda para o modo
local. `NEXT_PUBLIC_FEEL_REMOTO=0` força o modo local. A chave secreta (`service_role`)
nunca entra em `web/`.
