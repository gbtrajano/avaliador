import type { Metadata } from "next";
import { avaliacoes, aluno, type Avaliacao } from "./data";
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
    dec: 2,
    unidade: "%",
    valor: (a) => a.composicao.gorduraPercentual,
    classificacao: (a) => a.composicao.classificacaoGordura,
  },
  {
    rotulo: "Gordura corporal",
    dec: 2,
    unidade: "kg",
    valor: (a) => a.composicao.gorduraKg,
  },
  {
    rotulo: "Massa magra",
    dec: 2,
    unidade: "%",
    valor: (a) => a.composicao.massaMagraPercentual,
  },
  {
    rotulo: "Massa magra",
    dec: 2,
    unidade: "kg",
    valor: (a) => a.composicao.massaMagraKg,
  },
  {
    rotulo: "RCQ (relação cintura/quadril)",
    dec: 2,
    unidade: "",
    valor: (a) => a.composicao.rcq,
    classificacao: (a) => a.composicao.classificacaoRcq,
  },
  {
    rotulo: "Metabolismo basal sugerido",
    dec: 0,
    unidade: "kcal",
    valor: (a) => a.composicao.metabolismoBasalSugeridoKcal,
  },
];

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
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 print:break-inside-avoid">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {rotulo}
      </p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-900">
        {depois}
        {unidade ? (
          <span className="ml-1 text-sm font-medium text-slate-400">
            {unidade}
          </span>
        ) : null}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${corTom}`}
        >
          {deltaTexto}
        </span>
        <span className="text-xs text-slate-500">de {antes}</span>
      </div>
      {detalhe ? <p className="mt-1.5 text-xs text-slate-500">{detalhe}</p> : null}
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
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      {/* Cabeçalho */}
      <header className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-md print:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Comparativo de avaliações físicas
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{aluno.nome}</h1>
          <p className="mt-1 text-sm text-slate-300">
            {aluno.unidade} · {aluno.sexo} · {b.idade} anos
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <CartaoDataAnterior avaliacao={a} />
          <div className="rounded-xl bg-emerald-500/20 px-4 py-2.5 ring-1 ring-emerald-400/40">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
              Avaliação atual
            </p>
            <p className="text-lg font-bold tabular-nums">{dataAtual}</p>
          </div>
        </div>
      </header>

      {/* Destaques */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          detalhe={`${nf(2).format(a.composicao.massaMagraPercentual)}% → ${nf(2).format(b.composicao.massaMagraPercentual)}% do peso`}
        />
        <CartaoDestaque
          rotulo="Gordura corporal"
          antes={`${nf(2).format(a.composicao.gorduraPercentual)}%`}
          depois={`${nf(2).format(b.composicao.gorduraPercentual)}%`}
          deltaTexto={`${delta(a.composicao.gorduraPercentual, b.composicao.gorduraPercentual, 2)} p.p.`}
          tom="atencao"
          detalhe={`${nf(2).format(a.composicao.gorduraKg)} kg → ${nf(2).format(b.composicao.gorduraKg)} kg`}
        />
        <CartaoDestaque
          rotulo="IMC"
          antes={nf(2).format(a.composicao.imc)}
          depois={nf(2).format(b.composicao.imc)}
          deltaTexto={delta(a.composicao.imc, b.composicao.imc, 2)}
          tom="positivo"
          detalhe={`${a.composicao.classificacaoImc} → ${b.composicao.classificacaoImc}`}
        />
      </div>

      {/* Composição corporal */}
      <div className="mt-6">
        <Secao
          titulo="Composição corporal"
          descricao={`Protocolo: dobras cutâneas · comparativo ${dataAnterior} → ${dataAtual}`}
        >
          <div className="overflow-x-auto">
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
                    linha.unidade ? `${nf(linha.dec).format(v)} ${linha.unidade}` : nf(linha.dec).format(v);
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
                        className={`py-2.5 pr-3 text-right font-semibold tabular-nums ${
                          depois - antes > 0
                            ? "text-emerald-600"
                            : depois - antes < 0
                              ? "text-rose-600"
                              : "text-slate-400"
                        }`}
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
      <div className="mt-6">
        <Secao
          titulo="Perímetros (circunferências)"
          descricao={`Valores em centímetros · comparativo ${dataAnterior} → ${dataAtual}`}
        >
          <div className="overflow-x-auto">
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
                          antes != null && depois != null && depois - antes > 0
                            ? "text-emerald-600"
                            : antes != null && depois != null && depois - antes < 0
                              ? "text-rose-600"
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
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Secao titulo={`Hábitos — ${dataAnterior}`}>
          <dl className="space-y-1.5 text-sm">
            {a.anamnese.map((item, i) => (
              <div key={i} className="flex justify-between gap-4">
                <dt className="text-slate-500">{item.pergunta}</dt>
                <dd className="text-right font-semibold text-slate-800">
                  {item.resposta}
                </dd>
              </div>
            ))}
          </dl>
        </Secao>
        <Secao titulo={`Hábitos — ${dataAtual}`}>
          <dl className="space-y-1.5 text-sm">
            {b.anamnese.map((item, i) => (
              <div key={i} className="flex justify-between gap-4">
                <dt className="text-slate-500">{item.pergunta}</dt>
                <dd className="text-right font-semibold text-slate-800">
                  {item.resposta}
                </dd>
              </div>
            ))}
          </dl>
        </Secao>
      </div>

      {/* Observações */}
      <div className="mt-6">
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

      <footer className="mt-8 pb-4 text-center text-xs text-slate-400 print:hidden">
        Documento comparativo gerado a partir das avaliações físicas do NextFit
        ({aluno.unidade}) · {dataAnterior} e {dataAtual}
      </footer>
    </main>
  );
}
