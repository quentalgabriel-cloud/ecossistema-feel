import { describe, expect, it } from "vitest";

import { dadosDemo, regrasSugestao, relacoesDemo } from "@/data/universo/demo";
import type { Relacao } from "@/data/universo/tipos";

import {
  enquadrar,
  interpolarCamera,
  mundoParaTela,
  telaParaMundo,
  zoomNoPonto,
  ZOOM_MAX,
  ZOOM_MIN,
} from "./camera";
import { montarCena, relacoesDeEscolhas, sugestoesAtivas } from "./cena";
import { acimaDoTeto, ESCALA, raioBolha, variacaoPercentual } from "./escala";
import { aparencia, aposAcao, PESOS, pesoPorProvas } from "./estadoVerdade";
import { empacotarEspiral, geometriaGrupos, layoutMeuUniverso } from "./layout";
import { nivelEfetivo, nivelInicial, proximoNivel } from "./zoomSemantico";

describe("escala da bolha", () => {
  it("respeita os limites", () => {
    expect(raioBolha(1)).toBeCloseTo(ESCALA.minRaio);
    expect(raioBolha(10000)).toBeCloseTo(ESCALA.maxRaio);
    expect(raioBolha(50000)).toBeCloseTo(ESCALA.maxRaio);
    expect(raioBolha(0)).toBeCloseTo(ESCALA.minRaio);
  });

  it("sem contagem vira tamanho neutro, não zero", () => {
    expect(raioBolha(null)).toBe(ESCALA.raioNeutro);
  });

  it("cresce com a contagem (monotônica)", () => {
    const valores = [1, 40, 250, 1800, 10000].map((n) => raioBolha(n));
    for (let i = 1; i < valores.length; i++) expect(valores[i]).toBeGreaterThan(valores[i - 1]);
  });

  it("avisa teto e só calcula variação com os dois lados", () => {
    expect(acimaDoTeto(12000)).toBe(true);
    expect(acimaDoTeto(null)).toBe(false);
    expect(variacaoPercentual(250, 310)).toBe(24);
    expect(variacaoPercentual(null, 310)).toBeNull();
  });
});

describe("câmera", () => {
  const c = { x: 120, y: -40, k: 1.7 };

  it("mundo ↔ tela é ida e volta exata", () => {
    const p = { x: 33.3, y: -12.5 };
    const v = telaParaMundo(c, mundoParaTela(c, p));
    expect(v.x).toBeCloseTo(p.x);
    expect(v.y).toBeCloseTo(p.y);
  });

  it("zoom mantém o ponto focal sob o cursor", () => {
    const foco = { x: 200, y: 310 };
    const antes = telaParaMundo(c, foco);
    const depois = zoomNoPonto(c, foco, 2.4);
    const m = telaParaMundo(depois, foco);
    expect(m.x).toBeCloseTo(antes.x);
    expect(m.y).toBeCloseTo(antes.y);
  });

  it("limita o zoom", () => {
    expect(zoomNoPonto(c, { x: 0, y: 0 }, 99).k).toBe(ZOOM_MAX);
    expect(zoomNoPonto(c, { x: 0, y: 0 }, 0.001).k).toBe(ZOOM_MIN);
  });

  it("enquadrar centraliza a caixa", () => {
    const cam = enquadrar(
      { minX: -100, minY: -50, maxX: 100, maxY: 50 },
      { largura: 400, altura: 800 },
    );
    const centro = mundoParaTela(cam, { x: 0, y: 0 });
    expect(centro.x).toBeCloseTo(200);
    expect(centro.y).toBeCloseTo(400);
  });

  it("interpolação começa e termina nas câmeras dadas", () => {
    const a = { x: 0, y: 0, k: 1 };
    const b = { x: -300, y: 120, k: 2 };
    expect(interpolarCamera(a, b, 0)).toEqual(a);
    expect(interpolarCamera(a, b, 1)).toEqual(b);
    const meio = interpolarCamera(a, b, 0.5, { x: 200, y: 400 });
    expect(meio.k).toBeCloseTo(Math.SQRT2);
  });
});

describe("zoom semântico", () => {
  it("histerese: perto do limiar não oscila", () => {
    let n = nivelInicial(1.66);
    expect(n).toBe("detalhe");
    // descer um pouco abaixo da entrada não sai do detalhe
    n = proximoNivel(n, 1.55);
    expect(n).toBe("detalhe");
    n = proximoNivel(n, 1.6);
    expect(n).toBe("detalhe");
    // só sai abaixo do limiar de saída
    n = proximoNivel(n, 1.44);
    expect(n).toBe("contexto");
    // e não volta antes do limiar de entrada
    n = proximoNivel(n, 1.6);
    expect(n).toBe("contexto");
  });

  it("zoom muito baixo cai direto no macro", () => {
    expect(proximoNivel("detalhe", 0.4)).toBe("macro");
  });

  it("foco explícito também decide a camada", () => {
    expect(nivelEfetivo("macro", "detalhe")).toBe("detalhe");
    expect(nivelEfetivo("detalhe", "contexto")).toBe("detalhe");
    expect(nivelEfetivo("contexto", null)).toBe("contexto");
  });
});

describe("estado de verdade", () => {
  it("sugestão é a única com vidro e contorno tracejado", () => {
    expect(aparencia("sugerido")).toMatchObject({
      vidro: true,
      tracejado: true,
      preenchimento: "nenhum",
    });
    for (const e of ["declarado", "em_processo", "confirmado", "assinado"] as const) {
      expect(aparencia(e).vidro).toBe(false);
    }
  });

  it("preenchimento segue a verificação", () => {
    expect(aparencia("declarado").preenchimento).toBe("nenhum");
    expect(aparencia("em_processo").preenchimento).toBe("emProcesso");
    expect(aparencia("confirmado").preenchimento).toBe("verificado");
  });

  it("peso = densidade de provas", () => {
    expect(pesoPorProvas(0)).toBe(PESOS.registro);
    expect(pesoPorProvas(3)).toBe(PESOS.acumulo);
    expect(pesoPorProvas(6)).toBe(PESOS.recorrencia);
  });

  it("ação da pessoa nunca promove a confirmado", () => {
    expect(aposAcao("sugerido", "identificar")).toBe("declarado");
    expect(aposAcao("declarado", "participar")).toBe("em_processo");
    expect(aposAcao("em_processo", "identificar")).toBe("em_processo");
    expect(aposAcao("confirmado", "participar")).toBe("confirmado");
    expect(aposAcao("sugerido", "descartar")).toBeNull();
  });
});

describe("layout", () => {
  it("empacota sem sobreposição", () => {
    const c = empacotarEspiral([40, 30, 60, 20, 50], 10);
    for (let i = 0; i < c.length; i++)
      for (let j = i + 1; j < c.length; j++)
        expect(Math.hypot(c[i].x - c[j].x, c[i].y - c[j].y)).toBeGreaterThanOrEqual(
          c[i].r + c[j].r + 10 - 1e-6,
        );
  });

  it("mesma entrada → mesmas coordenadas", () => {
    const a = geometriaGrupos(dadosDemo.grupos, { imagem: 4, som: 3 });
    const b = geometriaGrupos(dadosDemo.grupos, { imagem: 4, som: 3 });
    expect([...a.values()]).toEqual([...b.values()]);
  });

  it("entidade nova não move as que já estavam", () => {
    const geo = geometriaGrupos(dadosDemo.grupos.slice(0, 2), { imagem: 4, som: 3 });
    const inicio = [
      { id: "fotografia-documental", grupoId: "imagem" },
      { id: "batuque-quintal", grupoId: "som" },
    ];
    const r1 = layoutMeuUniverso(geo, inicio, null);
    const r2 = layoutMeuUniverso(
      geo,
      [{ id: "cineclube-rua", grupoId: "imagem" }, ...inicio],
      r1.vagas,
    );
    expect(r2.nos.get("fotografia-documental")).toEqual(r1.nos.get("fotografia-documental"));
    expect(r2.nos.get("batuque-quintal")).toEqual(r1.nos.get("batuque-quintal"));
    expect(r2.nos.has("cineclube-rua")).toBe(true);
  });
});

describe("cena", () => {
  const base = {
    dados: dadosDemo,
    regras: regrasSugestao,
    descartadas: new Set<string>(),
    contagens: new Map(dadosDemo.comunidades.map((c) => [c.entidadeId, c.membrosConfirmados])),
    nomeNucleo: "Você",
    vagasAnteriores: null,
  };
  const relDemo = new Map<string, Relacao>(relacoesDemo.map((r) => [r.entidadeId, r]));

  it("escolher um interesse declara — não filia", () => {
    const rel = relacoesDeEscolhas(["cineclube-rua"]);
    expect(rel.get("cineclube-rua")?.estado).toBe("declarado");
  });

  it("Meu Universo não mostra sugestões", () => {
    const cena = montarCena({ ...base, perspectiva: "meu-universo", relacoes: relDemo });
    expect(cena.bolhas.some((b) => b.estado === "sugerido")).toBe(false);
    expect(cena.bolhas.filter((b) => b.tipo === "grupo").length).toBeGreaterThanOrEqual(4);
  });

  it("Descobrir só sugere com evidência no universo da pessoa", () => {
    const so = relacoesDeEscolhas(["cozinha-mercado"]);
    const s = sugestoesAtivas(regrasSugestao, so, new Set());
    expect(s.map((x) => x.entidadeId)).toEqual(["cafe-especial"]);
    expect(s[0].evidencias).toEqual(["cozinha-mercado"]);
  });

  it("sugestão descartada some", () => {
    const so = relacoesDeEscolhas(["cozinha-mercado"]);
    expect(sugestoesAtivas(regrasSugestao, so, new Set(["cafe-especial"]))).toHaveLength(0);
  });

  it("Comunidades: sem contagem fica neutro, nunca zero", () => {
    const cena = montarCena({ ...base, perspectiva: "comunidades", relacoes: relDemo });
    const semContagem = cena.bolhas.find((b) => b.id === "caminhada-centro")!;
    expect(semContagem.membros).toBeNull();
    expect(semContagem.r).toBe(ESCALA.raioNeutro);
  });
});
