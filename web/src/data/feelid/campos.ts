import { feelidCopy } from "@/content/feelid.pt-BR";
import type { CampoVerso, Carta } from "./tipos";

/** Cada tipo diz quais campos vão para o verso; o chassi só desenha a lista. */
export function camposDoVerso(carta: Carta): CampoVerso[] {
  switch (carta.tipo) {
    case "perfil": {
      const r = feelidCopy.verso.perfil;
      const v = carta.verso;
      return [
        { rotulo: r.momento, valor: v.momento },
        { rotulo: r.repertorio, valor: v.repertorio },
        { rotulo: r.praca, valor: v.praca },
        { rotulo: r.disponibilidade, valor: v.disponibilidade },
        { rotulo: r.lastro, valor: v.lastro },
      ];
    }
    case "habilidade": {
      const r = feelidCopy.verso.habilidade;
      const v = carta.verso;
      return [
        { rotulo: r.descricao, valor: v.descricao },
        { rotulo: r.contextos, valor: v.contextos },
        { rotulo: r.lastro, valor: v.lastro },
      ];
    }
    case "lugar": {
      const r = feelidCopy.verso.lugar;
      const v = carta.verso;
      return [
        { rotulo: r.endereco, valor: v.endereco },
        { rotulo: r.praca, valor: v.praca },
        { rotulo: r.usos, valor: v.usos },
        { rotulo: r.lastro, valor: v.lastro },
      ];
    }
  }
}
