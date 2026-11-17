import type { Metadata } from "next";
import { avaliacoes, aluno, meta, type Avaliacao } from "./data";
import { CartaoDataAnterior } from "./_components/modal-avaliacao";
import { Badge } from "./_components/badge";
import { Secao } from "./_components/secao";
import { nf, dataLabel, delta, TRONCO_SUSPEITO } from "./_lib/formato";

export const metadata: Metadata = {
  title: "Comparativo de Avaliações Físicas",
  description:
    "Comparativo entre duas avaliações físicas, apenas com medidas numéricas (sem fotos), para compartilhar com a nutrição.",
};

type LinhaComposicao = {
  rotulo: string;
  rotuloMobile?: string;
  dec: number;
  unidade: string;
  valor: (a: Avaliacao) => number;
  classificacao?: (a: Avaliacao) => string;
};

const LINHAS_COMPOSICAO: LinhaComposicao[] = [
  {
    rotulo: "Peso",
    dec: 1,
    unidade: "kg",
    valor: (a) => a.composicao.pesoKg,
    classificacao: (a) => a.composicao.classificacaoPeso,
  },
  {
    rotulo: "IMC",
    dec: 2,
    unidade: "",
    valor: (a) => a.composicao.imc,
    classificacao: (a) => a.composicao.classificacaoImc,
  },
  {
    rotulo: "Gordura corporal",
    rotuloMobile: "Gordura corporal (%)",
    dec: 2,
    unidade: "%",
    valor: (a) => a.composicao.gorduraPercentual,
    classificacao: (a) => a.composicao.classificacaoGordura,
  },
  {
    rotulo: "Gordura corporal",
    rotuloMobile: "Gordura corporal (kg)",
    dec: 2,
    unidade: "kg",
    valor: (a) => a.composicao.gorduraKg,
  },
  {
    rotulo: "Massa magra",
    rotuloMobile: "Massa magra (%)",
    dec: 2,
    unidade: "%",
    valor: (a) => a.composicao.massaMagraPercentual,
  },
  {
    rotulo: "Massa magra",
    rotuloMobile: "Massa magra (kg)",
    dec: 2,
    unidade: "kg",
    valor: (a) => a.composicao.massaMagraKg,
  },
  {
    rotulo: "RCQ (relação cintura/quadril)",
    rotuloMobile: "RCQ (cintura/quadril)",
    dec: 2,
    unidade: "",
    valor: (a) => a.composicao.rcq,
    classificacao: (a) => a.composicao.classificacaoRcq,
  },
  {
    rotulo: "Metabolismo basal sugerido",
    rotuloMobile: "Metabolismo basal (sugerido)",
    dec: 0,
    unidade: "kcal",
    valor: (a) => a.composicao.metabolismoBasalSugeridoKcal,
  },
];

const COR_DELTA_POSITIVO = "bg-emerald-50 text-emerald-700 ring-emerald-200";
const COR_DELTA_NEGATIVO = "bg-rose-50 text-rose-700 ring-rose-200";
const COR_DELTA_NEUTRO = "bg-slate-100 text-slate-500 ring-slate-200";

function corDelta(d: number): string {
  return d > 0
    ? COR_DELTA_POSITIVO
    : d < 0
      ? COR_DELTA_NEGATIVO
      : COR_DELTA_NEUTRO;
}

function textoCorDelta(d: number): string {
  return d > 0 ? "text-emerald-600" : d < 0 ? "text-rose-600" : "text-slate-400";
}

function CartaoMeta({
  pesoInicial,
  pesoAtual,
}: {
  pesoInicial: number;
  pesoAtual: number;
}) {
  const falta = meta.pesoKg - pesoAtual;
  const total = meta.pesoKg - pesoInicial;
  const progresso =
    total > 0
      ? Math.min(100, Math.max(0, ((pesoAtual - pesoInicial) / total) * 100))
      : 100;

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-4 text-white shadow-md sm:p-5 print:break-inside-avoid">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-xl ring-1 ring-white/30 sm:size-11 sm:text-2xl"
          >
            🎯
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-100 sm:text-xs">
              Meta de peso
            </p>
            <p className="text-xl font-bold leading-tight tabular-nums sm:text-2xl">
              {nf(1).format(meta.pesoKg)} kg{" "}
              <span className="text-sm font-medium tabular-nums text-emerald-100 sm:text-base">
                até {meta.prazo}
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-white/15 px-3.5 py-1.5 text-right ring-1 ring-white/30">
          <p className="text-[11px] font-medium text-emerald-100">
            {falta > 0 ? "Faltam" : "Diferença"}
          </p>
          <p className="text-base font-bold tabular-nums sm:text-lg">
            {falta > 0
              ? `${nf(1).format(falta)} kg`
              : `${nf(1).format(Math.abs(falta))} kg ${falta < 0 ? "abaixo" : ""} 🎉`}
          </p>
        </div>
      </div>

      <div className="mt-3.5">
        <div
          role="progressbar"
          aria-valuenow={Math.round(progresso)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso de ${nf(1).format(pesoInicial)} kg até a meta de ${nf(1).format(meta.pesoKg)} kg`}
          className="h-2.5 overflow-hidden rounded-full bg-white/20"
        >
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between gap-2 text-[11px] font-medium tabular-nums text-emerald-100 sm:text-xs">
          <span>{nf(1).format(pesoInicial)} kg · início</span>
          <span className="font-bold text-white">
            {nf(1).format(pesoAtual)} kg · {Math.round(progresso)}%
          </span>
          <span>{nf(1).format(meta.pesoKg)} kg · meta</span>
        </div>
      </div>
    </div>
  );
}

function CartaoDestaque({
  rotulo,
  antes,
  depois,
  deltaTexto,
  tom,
  detalhe,
  unidade,
}: {
  rotulo: string;
  antes: string;
  depois: string;
  deltaTexto: string;
  tom: "positivo" | "atencao";
  detalhe?: string;
  unidade?: string;
}) {
  const corTom =
    tom === "positivo"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4 print:break-inside-avoid">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
        {rotulo}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 sm:mt-1.5 sm:text-2xl">
        {depois}
        {unidade ? (
          <span className="ml-1 text-xs font-medium text-slate-400 sm:text-sm">
            {unidade}
          </span>
        ) : null}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 sm:text-xs ${corTom}`}
        >
          {deltaTexto}
        </span>
        <span className="text-[11px] text-slate-500 sm:text-xs">de {antes}</span>
      </div>
      {detalhe ? (
        <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs">
          {detalhe}
        </p>
      ) : null}
    </div>
  );
}

function CartaoComposicaoMobile({ linha }: { linha: LinhaComposicao }) {
  const antes = linha.valor(avaliacoes.anterior);
  const depois = linha.valor(avaliacoes.atual);
  const clsAtual = linha.classificacao?.(avaliacoes.atual);
  const clsAnterior = linha.classificacao?.(avaliacoes.anterior);
  const deltaTxt = `${delta(antes, depois, linha.dec)}${linha.unidade ? ` ${linha.unidade}` : ""}`;
  const valorComUnidade = (v: number) =>
    linha.unidade ? `${nf(linha.dec).format(v)} ${linha.unidade}` : nf(linha.dec).format(v);

  return (
    <div className="rounded-xl bg-slate-50 px-3.5 py-3 ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">
          {linha.rotuloMobile ?? linha.rotulo}
        </span>
        {clsAtual ? <Badge texto={clsAtual} /> : null}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="text-sm tabular-nums text-slate-500">
          {valorComUnidade(antes)}
          <span className="mx-1 text-slate-400">→</span>
          <span className="text-base font-bold text-slate-900">
            {valorComUnidade(depois)}
          </span>
        </p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ring-1 ${corDelta(depois - antes)}`}
        >
          {deltaTxt}
        </span>
      </div>
      {clsAnterior && clsAnterior !== clsAtual ? (
        <p className="mt-1 text-[11px] text-slate-400">
          antes: {clsAnterior}
        </p>
      ) : null}
    </div>
  );
}

function TilePerimetroMobile({
  chave,
  antes,
  depois,
}: {
  chave: string;
  antes: number | undefined;
  depois: number | undefined;
}) {
  const suspeito = antes != null && TRONCO_SUSPEITO.has(chave) && antes < 60;
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
      <p className="truncate text-[11px] font-medium text-slate-500" title={chave}>
        {chave}
        {suspeito ? (
          <span
            className="ml-1 font-bold text-amber-600"
            title="Valor possivelmente registrado em polegadas"
          >
            *
          </span>
        ) : null}
      </p>
      <div className="mt-1 flex items-end justify-between gap-1.5">
        <p className="text-lg font-bold leading-none tabular-nums text-slate-900">
          {depois != null ? nf(1).format(depois) : "—"}
          <span className="ml-0.5 text-[10px] font-medium text-slate-400">cm</span>
        </p>
        {antes != null && depois != null ? (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ring-1 ${corDelta(depois - antes)}`}
          >
            {delta(antes, depois, 1)}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] tabular-nums text-slate-400">
        antes: {antes != null ? nf(1).format(antes) : "—"} cm
      </p>
    </div>
  );
}

export default function Page() {
  const a = avaliacoes.anterior;
  const b = avaliacoes.atual;
  const dataAnterior = dataLabel(a.dataISO);
  const dataAtual = dataLabel(b.dataISO);

  const chavesPerimetros = Array.from(
    new Set([...Object.keys(a.perimetros), ...Object.keys(b.perimetros)]),
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-3 py-5 sm:px-6 sm:py-8">
      {/* Cabeçalho */}
      <header className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white shadow-md sm:p-6 print:bg-slate-900">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300 sm:text-xs">
            Comparativo de avaliações físicas
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl md:text-3xl">
            {aluno.nome}
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            {aluno.unidade} · {aluno.sexo} · {b.idade} anos
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:flex sm:flex-wrap sm:gap-3">
          <CartaoDataAnterior avaliacao={a} />
          <div className="min-w-0 rounded-xl bg-emerald-500/20 px-3.5 py-2.5 ring-1 ring-emerald-400/40 sm:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-200 sm:text-[11px]">
              Avaliação atual
            </p>
            <p className="text-lg font-bold tabular-nums">{dataAtual}</p>
          </div>
        </div>
      </header>

      {/* Meta */}
      <div className="mt-4 sm:mt-6">
        <CartaoMeta
          pesoInicial={a.composicao.pesoKg}
          pesoAtual={b.composicao.pesoKg}
        />
      </div>

      {/* Destaques */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-4 lg:grid-cols-4">
        <CartaoDestaque
          rotulo="Peso"
          antes={`${nf(1).format(a.composicao.pesoKg)} kg`}
          depois={nf(1).format(b.composicao.pesoKg)}
          deltaTexto={`${delta(a.composicao.pesoKg, b.composicao.pesoKg, 1)} kg`}
          tom="positivo"
          unidade="kg"
        />
        <CartaoDestaque
          rotulo="Massa magra"
          antes={`${nf(2).format(a.composicao.massaMagraKg)} kg`}
          depois={nf(2).format(b.composicao.massaMagraKg)}
          deltaTexto={`${delta(a.composicao.massaMagraKg, b.composicao.massaMagraKg, 2)} kg`}
          tom="positivo"
          unidade="kg"
          detalhe={`${nf(2).format(a.composicao.massaMagraPercentual)}% → ${nf(2).format(b.composicao.massaMagraPercentual)}%`}
        />
        <CartaoDestaque
          rotulo="Gordura corporal"
          antes={`${nf(2).format(a.composicao.gorduraPercentual)}%`}
          depois={`${nf(2).format(b.composicao.gorduraPercentual)}%`}
          deltaTexto={`${delta(a.composicao.gorduraPercentual, b.composicao.gorduraPercentual, 2)} p.p.`}
          tom="atencao"
          detalhe={`${nf(2).format(a.composicao.gorduraKg)} → ${nf(2).format(b.composicao.gorduraKg)} kg`}
        />
        <CartaoDestaque
          rotulo="IMC"
          antes={nf(2).format(a.composicao.imc)}
          depois={nf(2).format(b.composicao.imc)}
          deltaTexto={delta(a.composicao.imc, b.composicao.imc, 2)}
          tom="positivo"
          detalhe={b.composicao.classificacaoImc}
        />
      </div>

      {/* Composição corporal */}
      <div className="mt-4 sm:mt-6">
        <Secao
          titulo="Composição corporal"
          descricao={`Dobras cutâneas · ${dataAnterior} → ${dataAtual}`}
        >
          {/* Mobile: cards empilhados */}
          <div className="grid gap-2.5 sm:hidden">
            {LINHAS_COMPOSICAO.map((linha, i) => (
              <CartaoComposicaoMobile key={i} linha={linha} />
            ))}
          </div>

          {/* Tela grande: tabela */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-3 font-semibold">Medida</th>
                  <th className="pb-2 pr-3 text-right font-semibold">
                    {dataAnterior}
                  </th>
                  <th className="pb-2 pr-3 text-right font-semibold">
                    {dataAtual}
                  </th>
                  <th className="pb-2 pr-3 text-right font-semibold">Δ</th>
                  <th className="pb-2 text-right font-semibold">Classe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LINHAS_COMPOSICAO.map((linha, i) => {
                  const antes = linha.valor(a);
                  const depois = linha.valor(b);
                  const clsAtual = linha.classificacao?.(b);
                  const clsAnterior = linha.classificacao?.(a);
                  const deltaTxt = `${delta(antes, depois, linha.dec)}${linha.unidade ? ` ${linha.unidade}` : ""}`;
                  const unidadeCelula = (v: number) =>
                    linha.unidade
                      ? `${nf(linha.dec).format(v)} ${linha.unidade}`
                      : nf(linha.dec).format(v);
                  return (
                    <tr key={i} className="text-slate-700">
                      <td className="py-2.5 pr-3 font-medium text-slate-900">
                        {linha.rotulo}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums text-slate-500">
                        {unidadeCelula(antes)}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-semibold tabular-nums text-slate-900">
                        {unidadeCelula(depois)}
                      </td>
                      <td
                        className={`py-2.5 pr-3 text-right font-semibold tabular-nums ${textoCorDelta(depois - antes)}`}
                      >
                        {deltaTxt}
                      </td>
                      <td className="py-2.5 text-right">
                        {clsAnterior && clsAnterior !== clsAtual ? (
                          <span className="mr-1.5">
                            <Badge texto={clsAnterior} />
                          </span>
                        ) : null}
                        {clsAtual ? <Badge texto={clsAtual} /> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Secao>
      </div>

      {/* Perímetros */}
      <div className="mt-4 sm:mt-6">
        <Secao
          titulo="Perímetros"
          descricao={`Circunferências em centímetros · ${dataAnterior} → ${dataAtual}`}
        >
          {/* Mobile: grade de tiles */}
          <div className="grid grid-cols-2 gap-2.5 sm:hidden">
            {chavesPerimetros.map((chave) => (
              <TilePerimetroMobile
                key={chave}
                chave={chave}
                antes={a.perimetros[chave]}
                depois={b.perimetros[chave]}
              />
            ))}
          </div>

          {/* Tela grande: tabela */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-3 font-semibold">Medida</th>
                  <th className="pb-2 pr-3 text-right font-semibold">
                    {dataAnterior}
                  </th>
                  <th className="pb-2 pr-3 text-right font-semibold">
                    {dataAtual}
                  </th>
                  <th className="pb-2 text-right font-semibold">Δ (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chavesPerimetros.map((chave) => {
                  const antes = a.perimetros[chave];
                  const depois = b.perimetros[chave];
                  const suspeito =
                    antes != null && TRONCO_SUSPEITO.has(chave) && antes < 60;
                  return (
                    <tr key={chave} className="text-slate-700">
                      <td className="py-2.5 pr-3 font-medium text-slate-900">
                        {chave}
                        {suspeito ? (
                          <span
                            className="ml-1 font-bold text-amber-600"
                            title="Valor possivelmente registrado em polegadas"
                          >
                            *
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">
                        {antes != null ? nf(1).format(antes) : "—"}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-semibold tabular-nums text-slate-900">
                        {depois != null ? nf(1).format(depois) : "—"}
                      </td>
                      <td
                        className={`py-2.5 text-right font-semibold tabular-nums ${
                          antes != null && depois != null
                            ? textoCorDelta(depois - antes)
                            : "text-slate-400"
                        }`}
                      >
                        {antes != null && depois != null
                          ? delta(antes, depois, 1)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
            * Na avaliação de {dataAnterior}, as medidas de peitoral, cintura,
            abdômen e quadril aparentam ter sido registradas em{" "}
            <strong>polegadas</strong> pelo avaliador (ex.: cintura 28″ ≈ 71 cm,
            coerente com os 70 cm de {dataAtual}). As demais medidas estão em
            centímetros nas duas avaliações. Recomenda-se confirmar com o
            avaliador antes de usar esses quatro valores.
          </p>
        </Secao>
      </div>

      {/* Anamnese */}
      <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2">
        <Secao titulo={`Hábitos — ${dataAnterior}`}>
          <dl className="divide-y divide-slate-100">
            {a.anamnese.map((item, i) => (
              <div key={i} className="flex justify-between gap-3 py-2">
                <dt className="text-sm text-slate-500">{item.pergunta}</dt>
                <dd className="text-right text-sm font-semibold text-slate-800">
                  {item.resposta}
                </dd>
              </div>
            ))}
          </dl>
        </Secao>
        <Secao titulo={`Hábitos — ${dataAtual}`}>
          <dl className="divide-y divide-slate-100">
            {b.anamnese.map((item, i) => (
              <div key={i} className="flex justify-between gap-3 py-2">
                <dt className="text-sm text-slate-500">{item.pergunta}</dt>
                <dd className="text-right text-sm font-semibold text-slate-800">
                  {item.resposta}
                </dd>
              </div>
            ))}
          </dl>
        </Secao>
      </div>

      {/* Observações */}
      <div className="mt-4 sm:mt-6">
        <Secao titulo="Observações">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-600">
            <li>
              Altura registrada: {nf(2).format(a.alturaM)} m →{" "}
              {nf(2).format(b.alturaM)} m (provável variação de aferição).
            </li>
            <li>
              Composição corporal estimada por protocolo de dobras cutâneas nas
              duas avaliações.
            </li>
            <li>
              As fotos e imagens das avaliações foram{" "}
              <strong>intencionalmente omitidas</strong> deste documento, a
              pedido do aluno.
            </li>
            <li>
              Nenhuma medida ou dado de contato (telefone, e-mail, CPF) é
              exibido além do necessário.
            </li>
          </ul>
        </Secao>
      </div>

      <footer className="mt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-[11px] leading-relaxed text-slate-400 sm:mt-8 sm:text-xs print:hidden">
        Documento comparativo gerado a partir das avaliações físicas do NextFit
        ({aluno.unidade}) · {dataAnterior} e {dataAtual}
      </footer>
    </main>
  );
}
