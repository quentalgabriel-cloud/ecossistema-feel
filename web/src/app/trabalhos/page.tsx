import type { Metadata } from "next";

import { TrabalhosApp } from "@/components/trabalhos/TrabalhosApp";

export const metadata: Metadata = {
  title: "Trabalhos — Feel",
  robots: { index: false, follow: false },
};

export default function PaginaTrabalhos() {
  return <TrabalhosApp />;
}
