import type { Grupo, NoLayout } from "@/data/universo/tipos";

// Layout determinístico (handoff § 6.4–6.5). Nada de simulação de forças
// rodando para sempre: posições vêm de uma espiral de ouro com colisão resolvida
// na hora, sempre na mesma ordem. Mesma entrada → mesmas coordenadas.
//
// Estabilidade: a geometria de cada agrupamento sai do catálogo (estrutura),
// não do que está visível. Uma entidade nova ocupa a primeira vaga livre do seu
// agrupamento e ninguém mais se move. Recalcular tudo é um comando explícito
// (incrementar `versao`).

export const VERSAO_LAYOUT = 1;

const OURO = Math.PI * (3 - Math.sqrt(5));

export interface Circulo {
  x: number;
  y: number;
  r: number;
}

const sobrepoe = (a: Circulo, b: Circulo, folga: number) =>
  Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r + folga;

/** Coloca círculos, na ordem dada, na primeira posição livre de uma espiral. */
export function empacotarEspiral(raios: number[], folga = 16, passo = 6): Circulo[] {
  const postos: Circulo[] = [];
  for (const r of raios) {
    let i = 0;
    let c: Circulo = { x: 0, y: 0, r };
    // Limite alto e fixo: a espiral sempre encontra vaga, e o laço termina.
    while (postos.some((p) => sobrepoe(p, c, folga)) && i < 20000) {
      i++;
      const dist = passo * Math.sqrt(i) * 2;
      c = { x: Math.cos(i * OURO) * dist, y: Math.sin(i * OURO) * dist, r };
    }
    postos.push(c);
  }
  return postos;
}

export function raioEnvolvente(circulos: Circulo[], cx = 0, cy = 0): number {
  return circulos.reduce((m, c) => Math.max(m, Math.hypot(c.x - cx, c.y - cy) + c.r), 0);
}

export interface GeometriaGrupo {
  id: string;
  x: number;
  y: number;
  r: number;
  /** Vagas para entidades, em coordenadas do mundo. */
  vagas: { x: number; y: number }[];
}

export interface LayoutUniverso {
  versao: number;
  nucleo: Circulo;
  grupos: Map<string, GeometriaGrupo>;
  nos: Map<string, NoLayout>;
}

export const MEDIDAS = {
  raioNucleo: 46,
  raioEntidade: 24,
  /** Espaço reservado em volta de cada entidade para o rótulo. */
  folgaRotulo: 30,
  /** Altura do rótulo (nome em até duas linhas) embaixo da entidade. */
  alturaRotulo: 42,
  /** Largura que um rótulo ocupa — vizinhos no anel não podem ficar mais perto. */
  larguraRotulo: 150,
  raioAnelMin: 100,
  margemGrupo: 14,
  vaoNucleo: 70,
  vaoGrupos: 40,
} as const;

/**
 * Vagas de um agrupamento: a primeira no centro (quem chega primeiro fica no
 * meio), as outras num anel que começa embaixo e nunca passa pelo topo, onde
 * mora o nome do agrupamento.
 */
export function vagasEmFlor(n: number, m: typeof MEDIDAS = MEDIDAS): { x: number; y: number }[] {
  const vagas = [{ x: 0, y: 0 }];
  const noAnel = n - 1;
  if (noAnel <= 0) return vagas;
  const raio = Math.max(
    m.raioAnelMin,
    noAnel > 1 ? m.larguraRotulo / (2 * Math.sin(Math.PI / noAnel)) : 0,
  );
  for (let i = 0; i < noAnel; i++) {
    const ang = Math.PI / 2 + (i * 2 * Math.PI) / Math.max(noAnel, 3);
    vagas.push({ x: Math.cos(ang) * raio, y: Math.sin(ang) * raio });
  }
  return vagas;
}

/** Geometria fixa dos agrupamentos: depende só do catálogo e da ordem dos grupos. */
export function geometriaGrupos(
  grupos: Grupo[],
  capacidade: Record<string, number>,
  m = MEDIDAS,
): Map<string, GeometriaGrupo> {
  const locais = grupos.map((g) => {
    const vagas = vagasEmFlor(Math.max(2, capacidade[g.id] ?? 0), m);
    // O rótulo de cada entidade fica embaixo dela: a borda do agrupamento
    // precisa abraçar o rótulo também, não só o círculo.
    const r =
      vagas.reduce(
        (mx, v) => Math.max(mx, Math.hypot(v.x, v.y) + m.raioEntidade + m.alturaRotulo),
        0,
      ) + m.margemGrupo;
    return { g, vagas, r };
  });

  // Anel em volta do núcleo, ângulo fixo por posição no catálogo.
  const centros = locais.map(({ r }, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / locais.length;
    const d = m.raioNucleo + m.vaoNucleo + r;
    return { x: Math.cos(ang) * d, y: Math.sin(ang) * d, r };
  });

  // Afasta vizinhos que se tocam — sempre radialmente, número fixo de passos.
  for (let passo = 0; passo < 80; passo++) {
    let mexeu = false;
    for (let i = 0; i < centros.length; i++) {
      for (let j = i + 1; j < centros.length; j++) {
        const a = centros[i];
        const b = centros[j];
        if (!sobrepoe(a, b, m.vaoGrupos)) continue;
        mexeu = true;
        for (const c of [a, b]) {
          const d = Math.hypot(c.x, c.y) || 1;
          c.x += (c.x / d) * 4;
          c.y += (c.y / d) * 4;
        }
      }
    }
    if (!mexeu) break;
  }

  return new Map(
    locais.map(({ g, vagas, r }, i) => {
      const c = centros[i];
      return [
        g.id,
        { id: g.id, x: c.x, y: c.y, r, vagas: vagas.map((v) => ({ x: c.x + v.x, y: c.y + v.y })) },
      ];
    }),
  );
}

/** Vaga ocupada por cada entidade dentro do seu agrupamento — a memória do layout. */
export type MapaVagas = Map<string, { grupoId: string; vaga: number; versao: number }>;

/**
 * Posiciona as entidades visíveis nas vagas dos seus agrupamentos. Quem já tinha
 * vaga na mesma versão continua nela; quem chega pega a primeira vaga livre.
 */
export function layoutMeuUniverso(
  grupos: Map<string, GeometriaGrupo>,
  entidades: { id: string; grupoId: string }[],
  anterior: MapaVagas | null,
  versao = VERSAO_LAYOUT,
  m = MEDIDAS,
): { nos: Map<string, NoLayout>; vagas: MapaVagas } {
  const vagas: MapaVagas = new Map();
  const ocupadas = new Map<string, Set<number>>();
  const ocupar = (grupoId: string, vaga: number) => {
    if (!ocupadas.has(grupoId)) ocupadas.set(grupoId, new Set());
    ocupadas.get(grupoId)!.add(vaga);
  };

  // 1ª passada: preserva quem já estava.
  for (const e of entidades) {
    const ant = anterior?.get(e.id);
    const g = grupos.get(e.grupoId);
    if (!ant || !g || ant.versao !== versao || ant.grupoId !== e.grupoId) continue;
    if (ant.vaga >= g.vagas.length || ocupadas.get(g.id)?.has(ant.vaga)) continue;
    vagas.set(e.id, ant);
    ocupar(g.id, ant.vaga);
  }
  // 2ª passada: os novos, na ordem recebida.
  for (const e of entidades) {
    if (vagas.has(e.id)) continue;
    const g = grupos.get(e.grupoId);
    if (!g) continue;
    const usadas = ocupadas.get(g.id);
    const vaga = g.vagas.findIndex((_, i) => !usadas?.has(i));
    if (vaga < 0) continue; // agrupamento cheio: exige recálculo explícito
    vagas.set(e.id, { grupoId: g.id, vaga, versao });
    ocupar(g.id, vaga);
  }

  const nos = new Map<string, NoLayout>();
  for (const [id, { grupoId, vaga }] of vagas) {
    const p = grupos.get(grupoId)!.vagas[vaga];
    nos.set(id, { id, x: p.x, y: p.y, r: m.raioEntidade, versao });
  }
  return { nos, vagas };
}

/** Folga em volta de cada comunidade para o rótulo (nome + contagem) embaixo. */
const ROTULO_COMUNIDADE = 30;

/** Comunidades: tamanho = métrica declarada; ordem fixa do catálogo. */
export function layoutComunidades(
  itens: { id: string; r: number; rReserva?: number }[],
  versao = VERSAO_LAYOUT,
): Map<string, NoLayout> {
  // Reserva o maior raio que a bolha pode ter (ex.: depois da variação simulada),
  // para crescer sem empurrar ninguém.
  const postos = empacotarEspiral(
    itens.map((i) => Math.max(i.r, i.rReserva ?? 0) + ROTULO_COMUNIDADE),
    6,
  );
  return new Map(
    itens.map((it, i) => [it.id, { id: it.id, x: postos[i].x, y: postos[i].y, r: it.r, versao }]),
  );
}

/** Descobrir: sugestões em anel em volta do núcleo, ordem fixa. */
export function layoutAnel(
  ids: string[],
  raio: number,
  versao = VERSAO_LAYOUT,
  m = MEDIDAS,
): Map<string, NoLayout> {
  const n = Math.max(ids.length, 1);
  const circ = (raio * 2 + m.folgaRotulo * 2.2) * n;
  const d = Math.max(m.raioNucleo + m.vaoNucleo + raio, circ / (2 * Math.PI));
  return new Map(
    ids.map((id, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [id, { id, x: Math.cos(ang) * d, y: Math.sin(ang) * d, r: raio, versao }];
    }),
  );
}
