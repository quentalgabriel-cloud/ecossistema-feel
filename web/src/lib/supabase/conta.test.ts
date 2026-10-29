import { describe, expect, it, vi } from "vitest";

import type { Trabalho } from "@/data/trabalhos/tipos";
import { novoTrabalho } from "@/lib/trabalhos/ciclo";
import {
  memoriaDeLinhas,
  repositorioRemoto,
  trabalhoDeLinha,
  type LinhaTrabalho,
} from "@/lib/trabalhos/repositorio";
import { aplicarRemotas } from "@/lib/universo/repositorioRelacoes";

import { configSupabase } from "./config";
import { abrirSessao, pedirEmail } from "./sessao";

// Testes da camada da conta (D-19) sem rede: um cliente falso que só registra o que
// foi pedido e devolve o que cada caso manda.

type Resposta = { data: unknown; error: { message: string; status?: number } | null };

/** Construtor de consulta encadeável: cada método registra a chamada; await devolve a resposta. */
function consulta(resposta: Resposta, registro: string[][]) {
  const q: Record<string, unknown> = {};
  for (const m of [
    "select",
    "insert",
    "upsert",
    "update",
    "delete",
    "eq",
    "order",
    "limit",
    "single",
  ])
    q[m] = (...args: unknown[]) => {
      registro.push([m, JSON.stringify(args)]);
      return q;
    };
  q.then = (ok: (r: Resposta) => unknown) => Promise.resolve(resposta).then(ok);
  return q;
}

function clienteFalso(respostas: { tabela?: Resposta; rpc?: Record<string, Resposta> }) {
  const registro: string[][] = [];
  const cliente = {
    from: vi.fn((tabela: string) => {
      registro.push(["from", tabela]);
      return consulta(respostas.tabela ?? { data: [{ id: "x" }], error: null }, registro);
    }),
    rpc: vi.fn(async (nome: string, args: unknown) => {
      registro.push(["rpc", nome, JSON.stringify(args)]);
      return respostas.rpc?.[nome] ?? { data: null, error: { message: "sem resposta" } };
    }),
  };
  return { cliente: cliente as never, registro, rpc: cliente.rpc };
}

const linha: LinhaTrabalho = {
  id: "11111111-1111-4111-8111-111111111111",
  criado_em: "2026-10-29T10:00:00Z",
  texto: "cafeteria no Recife Antigo",
  entendimento: {
    objetivo: "visitas",
    praca: "Recife",
    nichos: ["cafe-especial"],
    prazo: null,
    trechos: {},
  },
  economia: { ticketMedio: 45, conversaoDe10: 3 },
  funil: { clientes: 23, gasto: 1840 },
  estagio: "entregue",
  veredito: "Vieram 23 clientes.",
  feel_acordos: {
    perfil_demo: "bia",
    entregaveis: ["Reels"],
    direitos: "organico",
    prazo: "Dezembro",
    esperamos: "20 clientes",
    erramos_se: "menos de 8",
    carimbado_em: "2026-10-29T10:05:00Z",
  },
  feel_assinaturas: [{ lado: "contratante", assinado_em: "2026-10-29T12:00:00Z" }],
};

describe("config", () => {
  it("usa o projeto feel por padrão e aceita sobrescrever", () => {
    expect(configSupabase({})?.url).toContain("supabase.co");
    expect(configSupabase({ url: "https://outro.example", chave: "k" })).toEqual({
      url: "https://outro.example",
      chave: "k",
    });
  });
  it("NEXT_PUBLIC_FEEL_REMOTO=0 força o modo local", () => {
    expect(configSupabase({ remoto: "0" })).toBeNull();
  });
});

describe("sessão: anônimo primeiro, local quando não dá", () => {
  const auth = (over: Record<string, unknown>) =>
    ({
      auth: {
        getSession: async () => ({ data: { session: null } }),
        signInAnonymously: async () => ({
          data: { user: { id: "u1", is_anonymous: true } },
          error: null,
        }),
        ...over,
      },
    }) as never;

  it("sem cliente: local, desligado", async () => {
    expect(await abrirSessao(null)).toEqual({ modo: "local", motivo: "desligado" });
  });

  it("reaproveita a sessão guardada (e lê se ainda é anônima)", async () => {
    const s = await abrirSessao(
      auth({
        getSession: async () => ({
          data: { session: { user: { id: "u2", is_anonymous: false } } },
        }),
      }),
    );
    expect(s).toMatchObject({ modo: "remoto", usuarioId: "u2", anonimo: false });
  });

  it("entra anônima quando não há sessão", async () => {
    expect(await abrirSessao(auth({}))).toMatchObject({
      modo: "remoto",
      usuarioId: "u1",
      anonimo: true,
    });
  });

  it("projeto com entrada anônima desligada (422): local, sem_anonimo", async () => {
    const s = await abrirSessao(
      auth({
        signInAnonymously: async () => ({
          data: { user: null },
          error: { message: "Anonymous sign-ins are disabled", status: 422 },
        }),
      }),
    );
    expect(s).toEqual({ modo: "local", motivo: "sem_anonimo" });
  });

  it("projeto avisa que a entrada anônima está desligada: nem tenta entrar", async () => {
    const signInAnonymously = vi.fn();
    const s = await abrirSessao(auth({ signInAnonymously }), 1000, async () => false);
    expect(s).toEqual({ modo: "local", motivo: "sem_anonimo" });
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("rede caída, erro 5xx ou demora: local, sem_rede", async () => {
    const falhou = auth({
      getSession: async () => {
        throw new Error("Failed to fetch");
      },
    });
    expect(await abrirSessao(falhou)).toEqual({ modo: "local", motivo: "sem_rede" });
    const servidor = auth({
      signInAnonymously: async () => ({
        data: { user: null },
        error: { message: "x", status: 500 },
      }),
    });
    expect(await abrirSessao(servidor)).toEqual({ modo: "local", motivo: "sem_rede" });
    const lento = auth({ getSession: () => new Promise(() => {}) });
    expect(await abrirSessao(lento, 10)).toEqual({ modo: "local", motivo: "sem_rede" });
  });

  it("pedirEmail valida antes de chamar e repassa o endereço de volta", async () => {
    const updateUser = vi.fn(async () => ({ error: null }));
    const c = { auth: { updateUser } } as never;
    expect(await pedirEmail(c, "sem-arroba", "https://x/trabalhos")).toEqual({
      ok: false,
      erro: "invalido",
    });
    expect(updateUser).not.toHaveBeenCalled();
    expect(await pedirEmail(c, " a@b.co ", "https://x/trabalhos")).toEqual({ ok: true });
    expect(updateUser).toHaveBeenCalledWith(
      { email: "a@b.co" },
      { emailRedirectTo: "https://x/trabalhos" },
    );
  });
});

describe("linhas do banco ↔ Trabalho", () => {
  it("monta o trabalho com acordo, funil medido e assinaturas", () => {
    const t = trabalhoDeLinha(linha);
    expect(t.acordo).toMatchObject({ perfilId: "bia", erramosSe: "menos de 8" });
    expect(Object.isFrozen(t.acordo)).toBe(true);
    expect(t.funil).toEqual({ contatos: null, agendados: null, clientes: 23, gasto: 1840 });
    expect(t.economia).toEqual({ ticketMedio: 45, conversaoDe10: 3, orcamento: null });
    expect(t.assinaturas).toEqual({ contratante: "2026-10-29T12:00:00Z", profissional: null });
  });

  it("aceita o acordo como lista e trabalho sem acordo", () => {
    expect(
      trabalhoDeLinha({ ...linha, feel_acordos: [linha.feel_acordos as never] }).acordo?.perfilId,
    ).toBe("bia");
    expect(trabalhoDeLinha({ ...linha, feel_acordos: [] }).acordo).toBeNull();
  });

  it("o mais recente é o atual; só encerrados viram histórico", () => {
    const m = memoriaDeLinhas([
      linha,
      { ...linha, id: "a", estagio: "encerrado" },
      { ...linha, id: "b", estagio: "rascunho" },
    ]);
    expect(m.atual?.id).toBe(linha.id);
    expect(m.encerrados.map((t) => t.id)).toEqual(["a"]);
  });
});

describe("repositório remoto", () => {
  const sessao = { usuarioId: "u1", anonimo: false };
  const pronto = (): Trabalho => ({
    ...novoTrabalho("t1", "2026-10-29T10:00:00Z"),
    texto: "x",
    entendimento: linha.entendimento,
  });

  it("carimbo grava o rascunho, chama o servidor e fica com a data dele", async () => {
    const { cliente, registro } = clienteFalso({
      rpc: { feel_carimbar_acordo: { data: "2026-10-29T10:05:00+00:00", error: null } },
    });
    const repo = repositorioRemoto(cliente, sessao, "https://feel.app");
    const r = await repo.carimbar(
      pronto(),
      {
        perfilId: "bia",
        entregaveis: ["Reels"],
        direitos: "organico",
        prazo: "",
        esperamos: "20",
        erramosSe: "8",
      },
      "2026-10-29T09:00:00Z",
    );
    expect(r.ok && r.trabalho.acordo?.carimbadoEm).toBe("2026-10-29T10:05:00+00:00");
    expect(r.ok && r.trabalho.estagio).toBe("proposta");
    const ordem = registro.map((x) => x[0]);
    expect(ordem.indexOf("upsert")).toBeLessThan(ordem.indexOf("rpc"));
  });

  it("acordo incompleto não chega ao servidor", async () => {
    const { cliente, rpc } = clienteFalso({});
    const repo = repositorioRemoto(cliente, sessao, "https://feel.app");
    const r = await repo.carimbar(
      pronto(),
      {
        perfilId: "bia",
        entregaveis: [],
        direitos: "organico",
        prazo: "",
        esperamos: "",
        erramosSe: "",
      },
      "agora",
    );
    expect(r).toEqual({ ok: false, erro: "acordo_incompleto" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("de proposta para aceita, só pelo convite", async () => {
    const { cliente, registro } = clienteFalso({});
    const repo = repositorioRemoto(cliente, sessao, "https://feel.app");
    const t = { ...trabalhoDeLinha(linha), estagio: "proposta" as const };
    expect(await repo.avancar(t)).toEqual({ ok: false, erro: "transicao_invalida" });
    expect(registro).toEqual([]);
  });

  it("banco que não muda nenhuma linha é erro, não sucesso silencioso", async () => {
    const { cliente } = clienteFalso({ tabela: { data: [], error: null } });
    const repo = repositorioRemoto(cliente, sessao, "https://feel.app");
    const t = { ...trabalhoDeLinha(linha), estagio: "em_andamento" as const, veredito: null };
    expect(await repo.avancar(t)).toEqual({ ok: false, erro: "servidor" });
  });

  it("sessão anônima não assina: pede e-mail sem chamar o servidor", async () => {
    const { cliente, rpc } = clienteFalso({});
    const repo = repositorioRemoto(cliente, { usuarioId: "u1", anonimo: true }, "https://feel.app");
    const t = { ...trabalhoDeLinha(linha), assinaturas: { contratante: null, profissional: null } };
    expect(await repo.assinar(t, "contratante", "agora")).toEqual({
      ok: false,
      erro: "pede_email",
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("encerrado só quando o servidor confirma as duas assinaturas", async () => {
    const t = { ...trabalhoDeLinha(linha), assinaturas: { contratante: null, profissional: null } };
    const umLado = clienteFalso({ rpc: { feel_assinar: { data: "entregue", error: null } } });
    const r1 = await repositorioRemoto(umLado.cliente, sessao, "").assinar(
      t,
      "contratante",
      "agora",
    );
    expect(r1.ok && r1.trabalho.estagio).toBe("entregue");
    const dois = clienteFalso({ rpc: { feel_assinar: { data: "encerrado", error: null } } });
    const r2 = await repositorioRemoto(dois.cliente, sessao, "").assinar(t, "contratante", "agora");
    expect(r2.ok && r2.trabalho.estagio).toBe("encerrado");
  });

  it("convite vira link para a rota de quem cria", async () => {
    const { cliente } = clienteFalso({ rpc: { feel_convidar: { data: "tok-123", error: null } } });
    const repo = repositorioRemoto(cliente, sessao, "https://feel.app");
    expect(await repo.convidar(trabalhoDeLinha(linha))).toBe(
      "https://feel.app/trabalhos/convite/tok-123",
    );
  });
});

describe("relações da conta", () => {
  it("o verificado vem do banco; o só declarado segue o aparelho", () => {
    const base = new Map([
      [
        "cafe-especial",
        {
          entidadeId: "cafe-especial",
          tipo: "identifica_se" as const,
          estado: "declarado" as const,
          provas: 0,
        },
      ],
    ]);
    const saida = aplicarRemotas(base, [
      { entidadeId: "cafe-especial", tipo: "contribui", estado: "assinado", provas: 1 },
      { entidadeId: "removida", tipo: "identifica_se", estado: "declarado", provas: 0 },
    ]);
    expect(saida.get("cafe-especial")).toMatchObject({ estado: "assinado", provas: 1 });
    expect(saida.has("removida")).toBe(false);
  });
});
