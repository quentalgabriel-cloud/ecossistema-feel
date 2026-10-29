// Eventos instrumentáveis do Meu Universo (handoff § 14.1). Sem serviço externo:
// os eventos ficam numa fila em memória (window.__feelTelemetria) para teste e
// pesquisa de usabilidade. Nunca registrar coordenada, texto digitado ou dado
// sensível — só o nome do evento e identificadores de demonstração.

export type EventoTelemetria =
  | "convite_aberto"
  | "onboarding_iniciado"
  | "interesse_selecionado"
  | "onboarding_concluido"
  | "universo_aberto"
  | "perspectiva_trocada"
  | "bolha_selecionada"
  | "contexto_focado"
  | "nivel_zoom_trocado"
  | "detalhes_abertos"
  | "explicacao_sugestao_aberta"
  | "entidade_salva"
  | "modo_lista_aberto"
  | "camera_recentrada"
  | "navegacao_voltar";

type Dados = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    __feelTelemetria?: { evento: EventoTelemetria; dados?: Dados; em: number }[];
  }
}

export function registrar(evento: EventoTelemetria, dados?: Dados) {
  if (typeof window === "undefined") return;
  const fila = (window.__feelTelemetria ??= []);
  fila.push({ evento, dados, em: Date.now() });
  if (fila.length > 500) fila.shift();
}
