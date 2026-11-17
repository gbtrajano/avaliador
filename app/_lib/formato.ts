export const nf = (dec: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

export function dataLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export const sinal = (d: number) => (d > 0 ? "+" : d < 0 ? "-" : "=");

export function delta(antes: number, depois: number, dec = 1): string {
  const d = depois - antes;
  return `${sinal(d)}${nf(dec).format(Math.abs(d))}`;
}

export const COR_BADGE: Record<string, string> = {
  "Peso normal": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Bom: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Baixo: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Abaixo: "bg-amber-100 text-amber-800 ring-amber-200",
  Alto: "bg-rose-100 text-rose-800 ring-rose-200",
  Acima: "bg-rose-100 text-rose-800 ring-rose-200",
};

// Medidas de tronco da avaliação antiga que aparentam ter sido anotadas em polegadas
export const TRONCO_SUSPEITO = new Set([
  "Peitoral",
  "Cintura",
  "Abdômen",
  "Quadril",
]);
