"use client";

import { useCallback, useState } from "react";

import {
  atualizarMemoria,
  type PreferenciaMovimento,
  type PreferenciaTema,
} from "@/lib/universo/memoria";

import { usePrefereMovimentoReduzido } from "./usePrefereMovimentoReduzido";

// Tema e movimento espelham `feel_user_preferences` (theme/motion: system | …)
// do Supabase `feel`. Por enquanto vivem só neste aparelho.

export function usePreferencias(inicial: {
  tema: PreferenciaTema;
  movimento: PreferenciaMovimento;
}) {
  const [tema, setTemaEstado] = useState(inicial.tema);
  const [movimento, setMovimentoEstado] = useState(inicial.movimento);
  const sistemaReduzido = usePrefereMovimentoReduzido();

  const setTema = useCallback((t: PreferenciaTema) => {
    setTemaEstado(t);
    atualizarMemoria({ tema: t });
  }, []);

  const setMovimento = useCallback((m: PreferenciaMovimento) => {
    setMovimentoEstado(m);
    atualizarMemoria({ movimento: m });
  }, []);

  const reduzido = movimento === "reduzido" || (movimento === "sistema" && sistemaReduzido);

  return { tema, setTema, movimento, setMovimento, reduzido };
}
