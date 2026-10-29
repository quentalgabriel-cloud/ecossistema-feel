import { describe, expect, it } from "vitest";

import { perfisDemo } from "@/data/trabalhos/demo";
import type { Trabalho } from "@/data/trabalhos/tipos";
import { dadosDemo, regrasSugestao } from "@/data/universo/demo";
import { montarCena, relacoesDeEscolhas } from "@/lib/universo/cena";

import {
  assinar,
  avancar,
  carimbarAcordo,
  novoTrabalho,
  provaCompleta,
  registrarVeredito,
} from "./ciclo";
import { compor, engajamentoImplausivel, leituraPares, medianasPorPorte, porteDe } from "./compor";
import {
  clientesParaSePagar,
  contatosNecessarios,
  custoPorCliente,
  lerValor,
  portaoAberto,
} from "./economia";
import { entender, faltando } from "./entender";
import { aplicarProvas } from "./evidencia";
import { provasDe } from "./memoria";

const AGORA = "2026-10-29T12:00:00.000Z";

describe("entender", () => {
  it("tira objetivo, praça, nicho e prazo do texto, com o trecho que sustentou", () => {
    const e = entender("Quero levar gente pra minha cafeteria no Recife Antigo em dezembro.");
    expect(e.objetivo).toBe("visitas");
    expect(e.praca).toBe("Recife");
    expect(e.trechos.praca).toBe("Recife Antigo");
    expect(e.trechos.nichos).toEqual(["cafe"]);
    expect(e.nichos).toEqual(["cafe-especial"]);
    expect(e.prazo).toBe("Dezembro");
    expect(faltando(e)).toEqual([]);
  });

  it("cita o trecho como a pessoa escreveu, com acento", () => {
    const e = entender("Um Café em OLINDA no São João");
    expect(e.trechos.nichos).toEqual(["Café"]);
    expect(e.trechos.praca).toBe("OLINDA");
    expect(e.trechos.prazo).toBe("São João");
  });

  it("ignora acento e caixa", () => {
    const e = entender("LANÇAMENTO de cardápio no restaurante em OLINDA no São João");
    expect(e.objetivo).toBe("lancamento");
    expect(e.praca).toBe("Olinda");
    expect(e.nichos).toContain("cozinha-mercado");
    expect(e.prazo).toBe("São João");
  });

  it("texto vago vira perguntas, não suposições", () => {
    const e = entender("Preciso de ajuda");
    expect(e.objetivo).toBeNull();
    expect(e.praca).toBeNull();
    expect(e.nichos).toEqual([]);
    expect(faltando(e)).toEqual(["objetivo", "praca", "nichos", "prazo"]);
  });
});

describe("economia", () => {
  it("portão só abre com ticket, conversão e orçamento", () => {
    expect(portaoAberto({ ticketMedio: 40, conversaoDe10: 2, orcamento: 2000 })).toBe(true);
    expect(portaoAberto({ ticketMedio: null, conversaoDe10: 2, orcamento: 2000 })).toBe(false);
    expect(portaoAberto({ ticketMedio: 40, conversaoDe10: 11, orcamento: 2000 })).toBe(false);
  });

  it("clientes para se pagar e contatos necessários arredondam para cima", () => {
    expect(clientesParaSePagar(2000, 45)).toBe(45);
    expect(contatosNecessarios(45, 2)).toBe(225);
    expect(clientesParaSePagar(2000, 0)).toBeNull();
    expect(contatosNecessarios(null, 2)).toBeNull();
  });

  it("custo por cliente usa gasto efetivo e não divide por zero", () => {
    expect(custoPorCliente({ contatos: 90, agendados: 30, clientes: 20, gasto: 1800 })).toBe(90);
    expect(custoPorCliente({ contatos: 90, agendados: 30, clientes: 0, gasto: 1800 })).toBeNull();
    expect(custoPorCliente({ contatos: 90, agendados: 30, clientes: 20, gasto: null })).toBeNull();
  });

  it("lê valor digitado em formato brasileiro", () => {
    expect(lerValor("1.200,50")).toBe(1200.5);
    expect(lerValor("R$ 180")).toBe(180);
    expect(lerValor("")).toBeNull();
    expect(Number.isNaN(lerValor("abc"))).toBe(true);
  });
});

describe("compor", () => {
  const e = entender("Quero levar gente pra minha cafeteria no Recife Antigo em dezembro.");
  const eco = { ticketMedio: 40, conversaoDe10: 2, orcamento: 2000 };
  const c = compor(perfisDemo, e, eco);

  it("todo mundo termina dentro ou fora — e quem fica fora tem motivo", () => {
    expect(c.incluidos.length + c.excluidos.length).toBe(perfisDemo.length);
    for (const x of c.excluidos) expect(x.motivo.tipo).toBeTruthy();
  });

  it("praça, agenda e orçamento decidem quem fica de fora", () => {
    const motivo = (id: string) => c.excluidos.find((x) => x.perfilId === id)?.motivo.tipo;
    expect(motivo("mel")).toBe("fora_da_praca"); // Jaboatão
    expect(motivo("juca")).toBe("sem_dado");
    expect(motivo("davi")).toBe("sem_relacao");
  });

  it("nenhum incluído carrega nota: só motivos", () => {
    for (const i of c.incluidos) {
      expect(Object.keys(i).sort()).toEqual(["motivos", "parcial", "perfilId", "verificar"]);
      expect(i.motivos[0].tipo).toBe("nicho");
    }
  });

  it("engajamento implausível entra marcado para verificar", () => {
    const nara = c.incluidos.find((i) => i.perfilId === "nara");
    expect(nara?.verificar).toBe(true);
    expect(engajamentoImplausivel(perfisDemo.find((p) => p.id === "nara")!)).toBe(true);
  });

  it("ordem é estável e declarada: mais provas primeiro", () => {
    expect(compor(perfisDemo, e, eco)).toEqual(c);
    const provas = c.incluidos.map(
      (i) => perfisDemo.find((p) => p.id === i.perfilId)!.provasAssinadas,
    );
    expect([...provas].sort((a, b) => b - a)).toEqual(provas);
  });

  it("pares: medianas saem do próprio conjunto, por porte", () => {
    const m = medianasPorPorte(perfisDemo);
    expect(m.has("pequeno")).toBe(true);
    expect(porteDe(820)).toBe("pequeno");
    expect(porteDe(null)).toBeNull();
    const lia = perfisDemo.find((p) => p.id === "lia")!;
    expect(leituraPares(lia, m)).not.toBeNull();
  });
});

describe("ciclo", () => {
  const base = (): Trabalho => ({
    ...novoTrabalho("t1", AGORA),
    entendimento: entender("cafeteria no Recife Antigo em dezembro"),
  });
  const dados = {
    perfilId: "bia",
    entregaveis: ["Reels"],
    direitos: "organico" as const,
    prazo: "Dezembro",
    esperamos: "20 clientes novos citando o cupom",
    erramosSe: "menos de 8 clientes com o cupom",
  };

  it("acordo exige 'Esperamos' e 'Erramos se'", () => {
    const r = carimbarAcordo(base(), { ...dados, erramosSe: "  " }, AGORA);
    expect(r).toEqual({ ok: false, erro: "acordo_incompleto" });
  });

  it("acordo carimbado é imutável e não recarimba", () => {
    const r = carimbarAcordo(base(), dados, AGORA);
    if (!r.ok) throw new Error(r.erro);
    expect(r.trabalho.estagio).toBe("proposta");
    expect(Object.isFrozen(r.trabalho.acordo)).toBe(true);
    expect(() => {
      (r.trabalho.acordo as { erramosSe: string }).erramosSe = "outra coisa";
    }).toThrow();
    expect(carimbarAcordo(r.trabalho, dados, AGORA)).toEqual({
      ok: false,
      erro: "acordo_ja_carimbado",
    });
  });

  it("estágios só andam para a frente e só com acordo", () => {
    expect(avancar(base())).toEqual({ ok: false, erro: "transicao_invalida" });
    let t = (carimbarAcordo(base(), dados, AGORA) as { trabalho: Trabalho }).trabalho;
    for (const esperado of ["aceita", "em_andamento", "entregue"]) {
      const r = avancar(t);
      if (!r.ok) throw new Error(r.erro);
      t = r.trabalho;
      expect(t.estagio).toBe(esperado);
    }
    expect(avancar(t)).toEqual({ ok: false, erro: "transicao_invalida" });
  });

  it("prova só existe com as duas assinaturas, depois do veredito", () => {
    let t = (carimbarAcordo(base(), dados, AGORA) as { trabalho: Trabalho }).trabalho;
    t = { ...t, estagio: "entregue" };
    expect(assinar(t, "contratante", AGORA)).toEqual({ ok: false, erro: "sem_veredito" });
    t = (registrarVeredito(t, "Vieram 23 clientes com o cupom.") as { trabalho: Trabalho })
      .trabalho;
    t = (assinar(t, "contratante", AGORA) as { trabalho: Trabalho }).trabalho;
    expect(provaCompleta(t)).toBe(false);
    expect(t.estagio).toBe("entregue");
    expect(assinar(t, "contratante", AGORA)).toEqual({ ok: false, erro: "ja_assinado" });
    expect(registrarVeredito(t, "mudando o veredito")).toEqual({ ok: false, erro: "ja_assinado" });
    t = (assinar(t, "profissional", AGORA) as { trabalho: Trabalho }).trabalho;
    expect(provaCompleta(t)).toBe(true);
    expect(t.estagio).toBe("encerrado");
  });
});

describe("evidence loop", () => {
  it("prova assinada vira 'assinado' no Meu Universo, com provas+1", () => {
    const t: Trabalho = {
      ...novoTrabalho("t1", AGORA),
      entendimento: entender("cafeteria no Recife Antigo"),
      acordo: Object.freeze({
        perfilId: "bia",
        entregaveis: ["Reels"],
        direitos: "organico",
        prazo: "",
        esperamos: "x",
        erramosSe: "y",
        carimbadoEm: AGORA,
      }),
      estagio: "encerrado",
      veredito: "ok",
      assinaturas: { contratante: AGORA, profissional: AGORA },
    };
    const provas = provasDe({ atual: null, encerrados: [t] });
    expect(provas).toHaveLength(1);
    expect(provas[0].entidadeId).toBe("cafe-especial");

    const relacoes = aplicarProvas(
      relacoesDeEscolhas(["cafe-especial", "cozinha-mercado"]),
      provas,
    );
    const cena = montarCena({
      dados: dadosDemo,
      perspectiva: "meu-universo",
      relacoes,
      regras: regrasSugestao,
      descartadas: new Set(),
      contagens: new Map(),
      nomeNucleo: "Você",
      vagasAnteriores: null,
    });
    const cafe = cena.bolhas.find((b) => b.id === "cafe-especial")!;
    expect(cafe.estado).toBe("assinado");
    expect(cafe.provas).toBe(1);
  });

  it("sem as duas assinaturas, não há prova", () => {
    const t: Trabalho = {
      ...novoTrabalho("t2", AGORA),
      entendimento: entender("cafeteria"),
      assinaturas: { contratante: AGORA, profissional: null },
    };
    expect(provasDe({ atual: t, encerrados: [] })).toHaveLength(0);
  });
});
