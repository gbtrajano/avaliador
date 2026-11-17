"use client";

import { useEffect, useState } from "react";
import type { Avaliacao } from "../data";
import { nf, dataLabel, TRONCO_SUSPEITO } from "../_lib/formato";
import { Badge } from "./badge";

function Linha({
  rotulo,
  valor,
  classe,
}: {
  rotulo: string;
  valor: string;
  classe?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-slate-500">{rotulo}</dt>
      <dd className="flex items-center gap-2 text-right text-sm font-semibold tabular-nums text-slate-900">
        {valor}
        {classe ? <Badge texto={classe} /> : null}
      </dd>
    </div>
  );
}

function ModalAvaliacao({
  avaliacao,
  aoFechar,
}: {
  avaliacao: Avaliacao;
  aoFechar: () => void;
}) {
  const data = dataLabel(avaliacao.dataISO);
  const c = avaliacao.composicao;

  const linhasComposicao: Array<{
    rotulo: string;
    valor: string;
    classe?: string;
  }> = [
    {
      rotulo: "Peso",
      valor: `${nf(1).format(c.pesoKg)} kg`,
      classe: c.classificacaoPeso,
    },
    {
      rotulo: "IMC",
      valor: nf(2).format(c.imc),
      classe: c.classificacaoImc,
    },
    {
      rotulo: "Gordura corporal",
      valor: `${nf(2).format(c.gorduraPercentual)}% · ${nf(2).format(c.gorduraKg)} kg`,
      classe: c.classificacaoGordura,
    },
    {
      rotulo: "Massa magra",
      valor: `${nf(2).format(c.massaMagraKg)} kg · ${nf(2).format(c.massaMagraPercentual)}%`,
    },
    {
      rotulo: "RCQ (cintura/quadril)",
      valor: nf(2).format(c.rcq),
      classe: c.classificacaoRcq,
    },
    {
      rotulo: "Metabolismo basal sugerido",
      valor: `${nf(0).format(c.metabolismoBasalSugeridoKcal)} kcal`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={aoFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Dados completos da avaliação de ${data}`}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Dados completos da avaliação
            </p>
            <h3 className="text-lg font-bold text-slate-900">{data}</h3>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto px-5 py-4">
          <p className="mb-3 text-sm text-slate-500">
            {avaliacao.idade} anos · altura {nf(2).format(avaliacao.alturaM)} m
          </p>

          {/* Composição */}
          <h4 className="text-sm font-bold text-slate-900">
            Composição corporal
          </h4>
          <dl className="mt-1 divide-y divide-slate-100">
            {linhasComposicao.map((linha) => (
              <Linha key={linha.rotulo} {...linha} />
            ))}
          </dl>

          {/* Perímetros */}
          <h4 className="mt-5 text-sm font-bold text-slate-900">
            Perímetros (cm)
          </h4>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(avaliacao.perimetros).map(([chave, valor]) => (
              <div
                key={chave}
                className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
              >
                <p className="text-[11px] font-medium text-slate-500">
                  {chave}
                  {TRONCO_SUSPEITO.has(chave) && valor < 60 ? (
                    <span
                      className="ml-1 font-bold text-amber-600"
                      title="Valor possivelmente registrado em polegadas"
                    >
                      *
                    </span>
                  ) : null}
                </p>
                <p className="text-sm font-bold tabular-nums text-slate-900">
                  {nf(1).format(valor)}
                </p>
              </div>
            ))}
          </div>
          {Object.entries(avaliacao.perimetros).some(
            ([chave, valor]) => TRONCO_SUSPEITO.has(chave) && valor < 60,
          ) ? (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
              * Medidas de peitoral, cintura, abdômen e quadril aparentam ter
              sido registradas em <strong>polegadas</strong> nesta avaliação.
            </p>
          ) : null}

          {/* Anamnese */}
          <h4 className="mt-5 text-sm font-bold text-slate-900">Hábitos</h4>
          <dl className="mt-1 divide-y divide-slate-100">
            {avaliacao.anamnese.map((item, i) => (
              <Linha
                key={i}
                rotulo={item.pergunta}
                valor={item.resposta}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function CartaoDataAnterior({ avaliacao }: { avaliacao: Avaliacao }) {
  const [aberto, setAberto] = useState(false);

  // Bloqueia o scroll do fundo e fecha com a tecla Esc enquanto o modal está aberto
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        title="Clique para ver todos os dados desta avaliação"
        className="group rounded-xl bg-white/10 px-4 py-2.5 text-left ring-1 ring-white/20 transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
          Avaliação anterior
        </p>
        <p className="text-lg font-bold tabular-nums text-white">
          {dataLabel(avaliacao.dataISO)}
          <span
            aria-hidden
            className="ml-2 inline-block text-emerald-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            ↗
          </span>
        </p>
        <p className="mt-0.5 text-[10px] font-medium text-emerald-300/90">
          Clique para ver os dados completos
        </p>
      </button>

      {aberto ? (
        <ModalAvaliacao avaliacao={avaliacao} aoFechar={() => setAberto(false)} />
      ) : null}
    </>
  );
}
