import { COR_BADGE } from "../_lib/formato";

export function Badge({ texto }: { texto: string }) {
  const cor = COR_BADGE[texto] ?? "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${cor}`}
    >
      {texto}
    </span>
  );
}
