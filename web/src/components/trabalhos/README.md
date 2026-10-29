# Trabalhos — o ciclo do negócio

Rota: `/trabalhos` (`noindex`). Navegação do núcleo: **Rede** (`/universo`) · **Trabalhos**.
Fontes: Handoff Mestre § 5, § 15–16 e § 21. Os perfis são de demonstração (primeiro nome +
"(demo)", sem foto, sem @), e não há IA. O trabalho mora neste aparelho ou na conta da
pessoa (ver "Na conta").

```
O que precisa acontecer → Quem faz sentido → O combinado → Acontecendo → O que voltou
     (necessidade)           (composição)       (acordo)      (trabalho)    (prova)
```

## As regras que a tela não deixa quebrar

| Regra | Onde mora |
|---|---|
| "Entendemos assim…" por **regra** contra o catálogo, citando o trecho como a pessoa escreveu | `lib/trabalhos/entender.ts` |
| **Portão econômico:** sem ticket, conversão e orçamento, não há composição | `lib/trabalhos/economia.ts` (`portaoAberto`) |
| "Para se pagar: N clientes ≈ M contatos", só com o que foi digitado | `clientesParaSePagar`, `contatosNecessarios` |
| Composição **sem nota**: cada pessoa entra com motivos ou fica de fora com um motivo | `lib/trabalhos/compor.ts` |
| Engajamento só contra **pares do mesmo porte**; a mediana sai do próprio conjunto | `medianasPorPorte`, `leituraPares` |
| Engajamento implausível vira "vale verificar", nunca vantagem | `engajamentoImplausivel` |
| "Esperamos / Erramos se" obrigatórios; o acordo carimbado é congelado | `lib/trabalhos/ciclo.ts` (`carimbarAcordo`) |
| Funil **medido**: o que não foi medido fica em branco | `Funil` (null), `MedicaoFunil` |
| **Custo por cliente = gasto efetivo ÷ clientes**, não orçamento declarado | `custoPorCliente` |
| Prova só com veredito + as duas assinaturas; depois de assinar, o veredito não muda | `registrarVeredito`, `assinar` |
| **Evidence loop:** prova assinada vira `assinado` (provas+1) no Meu Universo e conta no lastro da FEEL ID | `lib/trabalhos/evidencia.ts`, `provasDe` |

## Desenho

- Um coral por passo: o botão que avança (Entender, Ver quem faz sentido, Seguir para o
  combinado, Carimbar, próximo estágio, Registrar veredito, Assino como contratante). Na
  tela da prova, o coral é o símbolo na carta, e os botões ficam em contorno.
- Glifo **Prova** (LINGUAGEM § 2): dois arcos da cicloide cruzando a 32° (`glifoProva`),
  desenhados por `stroke-dashoffset`.
- Mesma camada semântica do Meu Universo (`--tema-*`, D-18): claro, escuro e movimento
  reduzido.

## Na conta (D-19)

`TrabalhosApp` escolhe onde o trabalho mora pela sessão (`lib/supabase/sessao.ts`):

- **Neste aparelho** (selo "Demonstração · neste aparelho"): sem entrada anônima no
  projeto ou sem rede. É o comportamento da Onda 2: a pessoa faz os dois lados, e a
  assinatura de quem criou é simulada.
- **Na conta** (selo "Salvo na sua conta"): `repositorioRemoto` em
  `lib/trabalhos/repositorio.ts`.
  - O rascunho é gravado com espera, e o carimbo leva a data do servidor.
  - Em "Proposta enviada", no lugar de "Marcar como aceita" aparece **"Convidar quem
    cria"**, que gera o link `/trabalhos/convite/[token]`.
  - Quem cria abre o link (`ConviteRecebido.tsx`), vê o combinado carimbado antes de
    aceitar, aceita, acompanha e assina.
  - Não há simulação na conta.
  - Ao voltar para a aba, o trabalho é relido.

Assinar pede **e-mail confirmado**: a sessão anônima recebe "Para assinar, confirme seu
e-mail" (`Conta.tsx`), e o link de confirmação volta para a mesma tela. As regras puras
de `ciclo.ts` validam antes; o banco valida de novo e tem a palavra final
(`supabase/README.md`).

## Limitações

- Na demonstração, a pessoa faz os dois lados: os estágios e a assinatura de quem criou
  são simulados e rotulados assim.
- Neste aparelho, um trabalho por vez (`feel:trabalhos:v1`). Na conta, a tela mostra o
  mais recente; os encerrados contam no lastro.
- O vocabulário de extração cobre só o catálogo de demonstração e a RMR (mais Caruaru, para
  exercitar o "fora da praça").
