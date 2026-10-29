import s from "./universo.module.css";

// Ícones de controle (cromo de interface, não peça de marca): traço 1.6,
// terminal redondo, cor = currentColor. Sem biblioteca de ícones (D-17: sem lucide).

type Nome =
  | "mais"
  | "menos"
  | "recentrar"
  | "lista"
  | "espaco"
  | "busca"
  | "ajustes"
  | "fechar"
  | "voltar";

const TRACOS: Record<Nome, string[]> = {
  mais: ["M12 5v14", "M5 12h14"],
  menos: ["M5 12h14"],
  recentrar: [
    "M12 3v4",
    "M12 17v4",
    "M3 12h4",
    "M17 12h4",
    "M12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5",
  ],
  lista: ["M8 7h12", "M8 12h12", "M8 17h12", "M4 7h.01", "M4 12h.01", "M4 17h.01"],
  espaco: [
    "M9 9.5a3.5 3.5 0 1 1 0 .01",
    "M16.5 15a2.5 2.5 0 1 1 0 .01",
    "M6.5 17.5a1.5 1.5 0 1 1 0 .01",
  ],
  busca: ["M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13", "M15.5 15.5L20 20"],
  ajustes: ["M4 7h10", "M18 7h2", "M4 17h4", "M12 17h8", "M16 5v4", "M10 15v4"],
  fechar: ["M6 6l12 12", "M18 6L6 18"],
  voltar: ["M15 5l-7 7l7 7"],
};

export function Icone({ nome }: { nome: Nome }) {
  return (
    <svg className={s.icone} viewBox="0 0 24 24" aria-hidden focusable="false">
      {TRACOS[nome].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
