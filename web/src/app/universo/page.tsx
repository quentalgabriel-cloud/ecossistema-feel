import type { Metadata } from "next";

import { UniversoApp } from "@/components/universo/UniversoApp";

export const metadata: Metadata = {
  title: "Meu Universo — Feel",
  robots: { index: false, follow: false },
};

export default async function PaginaUniverso({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string | string[] }>;
}) {
  const { demo } = await searchParams;
  return <UniversoApp demonstracao={demo === "1"} />;
}
