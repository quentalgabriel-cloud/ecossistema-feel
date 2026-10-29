import { NICHOS, OBJETIVOS, PRACAS, PRAZOS } from "@/data/trabalhos/demo";
import type { Entendimento } from "@/data/trabalhos/tipos";

// "Entendemos assim…" (Handoff Mestre § 16.4): a necessidade começa em linguagem
// natural. Aqui o entendimento é por regra, contra o vocabulário do catálogo —
// previsível, testável e sem IA. Cada campo guarda o trecho que o sustentou, para
// a pessoa ver por que entendemos assim e corrigir.

export const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Primeiro termo encontrado (o mais longo primeiro, para "recife antigo" vencer "recife"). */
function achar<T extends { termos: string[] }>(
  texto: string,
  regras: T[],
): { regra: T; termo: string } | null {
  const candidatos = regras
    .flatMap((regra) => regra.termos.map((termo) => ({ regra, termo })))
    .sort((a, b) => b.termo.length - a.termo.length);
  for (const c of candidatos) if (texto.includes(c.termo)) return c;
  return null;
}

/**
 * O trecho como a pessoa escreveu (com acento e caixa), a partir do termo achado
 * no texto normalizado. Normaliza caractere a caractere para manter os índices.
 */
export function trechoOriginal(textoBruto: string, termo: string): string {
  let normal = "";
  const origem: number[] = [];
  [...textoBruto].forEach((ch, i) => {
    for (const n of normalizar(ch)) {
      normal += n;
      origem.push(i);
    }
  });
  const ini = normal.indexOf(termo);
  if (ini < 0) return termo;
  const chars = [...textoBruto];
  return chars.slice(origem[ini], origem[ini + termo.length - 1] + 1).join("");
}

export function entender(textoBruto: string): Entendimento {
  const texto = normalizar(textoBruto);
  const original = (termo: string) => trechoOriginal(textoBruto, termo);
  const objetivo = achar(texto, OBJETIVOS);
  const praca = achar(texto, PRACAS);
  const prazo = achar(texto, PRAZOS);
  const nichos: string[] = [];
  const trechosNichos: string[] = [];
  for (const regra of NICHOS) {
    const termo = regra.termos.find((t) => texto.includes(t));
    if (termo && !nichos.includes(regra.entidade)) {
      nichos.push(regra.entidade);
      trechosNichos.push(termo);
    }
  }
  return {
    objetivo: objetivo?.regra.objetivo ?? null,
    praca: praca?.regra.cidade ?? null,
    nichos,
    prazo: prazo?.regra.rotulo ?? null,
    trechos: {
      ...(objetivo ? { objetivo: original(objetivo.termo) } : {}),
      ...(praca ? { praca: original(praca.termo) } : {}),
      ...(prazo ? { prazo: original(prazo.termo) } : {}),
      ...(trechosNichos.length ? { nichos: trechosNichos.map(original) } : {}),
    },
  };
}

export type CampoFaltando = "objetivo" | "praca" | "nichos" | "prazo";

/** O que o texto não respondeu — vira pergunta, não formulário. */
export function faltando(e: Entendimento): CampoFaltando[] {
  const f: CampoFaltando[] = [];
  if (!e.objetivo) f.push("objetivo");
  if (!e.praca) f.push("praca");
  if (e.nichos.length === 0) f.push("nichos");
  if (!e.prazo) f.push("prazo");
  return f;
}
