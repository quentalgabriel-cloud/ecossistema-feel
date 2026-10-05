// Página de verificação dos tokens — não é peça de marca, é prova de que
// DESIGN.md -> web/ está funcionando (Fase 1). Boards reais vêm na Fase 2,
// sob a skill feel-diagram.

const COLORS = [
  "paper",
  "tint",
  "bone",
  "steel",
  "ink",
  "line",
  "lineDashed",
  "textBody",
] as const;

const TYPE_STYLES = [
  { className: "text-style-h1", label: "h1 — 62px / 600" },
  { className: "text-style-h2", label: "h2 — 42px / 600" },
  { className: "text-style-body-lg", label: "body-lg — 17px / 400" },
  { className: "text-style-body-md", label: "body-md — 15px / 400" },
  { className: "text-style-ui", label: "ui — 16px / 500" },
  { className: "text-style-label-caps", label: "LABEL-CAPS — 11px / 500" },
  { className: "text-style-data", label: "data — 12,345" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-paper px-xl py-section">
      <header className="mb-xl">
        <p className="text-style-label-caps text-steel">Fase 1 — verificação de tokens</p>
        <h1 className="text-style-h1 text-ink mt-sm">Feel</h1>
        <p className="text-style-body-lg text-textBody mt-sm max-w-[640px]">
          Gerado de <code className="text-style-data">DESIGN.md</code> via{" "}
          <code className="text-style-data">npm run tokens</code>. Nenhum valor
          replicado à mão (D-08).
        </p>
      </header>

      <section className="mb-xl">
        <h2 className="text-style-h2 text-ink mb-md">Cor — dosagem 90 / 8 / 2</h2>
        <div className="flex flex-wrap gap-sm">
          {COLORS.map((name) => (
            <div key={name} className="w-[120px]">
              <div
                className="h-[72px] rounded-md border border-line"
                style={{ backgroundColor: `var(--color-${name})` }}
              />
              <p className="text-style-data text-steel mt-xs">{name}</p>
            </div>
          ))}
          {/* Regra do anel: um único elemento coral nesta composição. */}
          <div className="w-[120px]">
            <div className="h-[72px] rounded-md bg-coral" />
            <p className="text-style-data text-coral mt-xs">coral (único)</p>
          </div>
        </div>
      </section>

      <section className="mb-xl">
        <h2 className="text-style-h2 text-ink mb-md">Tipografia</h2>
        <div className="flex flex-col gap-sm">
          {TYPE_STYLES.map(({ className, label }) => (
            <p key={className} className={`${className} text-ink`}>
              {label}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-style-h2 text-ink mb-md">Raio e espaço</h2>
        <div className="flex gap-sm">
          {(["sm", "md", "lg", "xl", "pill"] as const).map((name) => (
            <div
              key={name}
              className="flex h-[56px] w-[56px] items-center justify-center border border-line bg-bone"
              style={{ borderRadius: `var(--radius-${name})` }}
            >
              <span className="text-style-data text-steel">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
