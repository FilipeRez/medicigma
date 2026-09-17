import React, { useMemo, useState } from 'react';
import { Receipt, Download, Check, TriangleAlert, Percent, Wallet } from 'lucide-react';
import { useApp } from '../state/AppState';
import { RepasseRow, Transaction } from '../types';

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const MONTH_LABELS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const monthLabel = (ym: string) => {
  const [y, m] = ym.split('-');
  return `${MONTH_LABELS[Number(m) - 1]} de ${y}`;
};

interface RepassesViewProps {
  onShowToast: (msg: string) => void;
}

export const RepassesView: React.FC<RepassesViewProps> = ({ onShowToast }) => {
  const { data, update, isRestrictedToOwnProduction } = useApp();

  const months = useMemo(() => {
    const set = new Set(data.transactions.map((t) => t.isoDate.slice(0, 7)));
    return Array.from(set).sort().reverse();
  }, [data.transactions]);

  // Abre no mês corrente; se ele não tiver lançamento, no último mês já vencido.
  // Sem isso a tela nasceria num mês futuro vazio, por causa de contas a vencer.
  const mesPadrao = useMemo(() => {
    const corrente = new Date().toISOString().slice(0, 7);
    if (months.includes(corrente)) return corrente;
    return months.find((m) => m <= corrente) ?? months[0] ?? corrente;
  }, [months]);

  const [month, setMonth] = useState(mesPadrao);
  const activeMonth = months.includes(month) ? month : mesPadrao;

  const rows = useMemo<RepasseRow[]>(() => {
    const doMes = data.transactions.filter((t) => t.isoDate.startsWith(activeMonth));

    return data.professionals
      .filter((p) => typeof p.repassePercent === 'number')
      .map((p) => {
        const minhas = doMes.filter((t) => t.professionalId === p.id && t.type === 'receita');
        const glosado = minhas
          .filter((t) => t.status === 'Glosa')
          .reduce((acc, t) => acc + t.amount, 0);
        const producao = minhas.reduce((acc, t) => acc + t.amount, 0);
        const base = producao - glosado;
        const percent = p.repassePercent ?? 0;
        const repasse = (base * percent) / 100;
        const jaPago = doMes.some(
          (t) => t.method === 'Repasse' && t.professionalId === p.id && t.status === 'Pago'
        );
        return {
          professional: p,
          producao,
          glosado,
          base,
          percent,
          repasse,
          clinica: base - repasse,
          atendimentos: minhas.length,
          status: jaPago ? 'Pago' : 'Pendente',
        };
      })
      .filter((r) => r.atendimentos > 0 || r.status === 'Pago')
      .sort((a, b) => b.repasse - a.repasse);
  }, [data.transactions, data.professionals, activeMonth]);

  const totais = rows.reduce(
    (acc, r) => ({
      producao: acc.producao + r.producao,
      glosado: acc.glosado + r.glosado,
      repasse: acc.repasse + r.repasse,
      clinica: acc.clinica + r.clinica,
    }),
    { producao: 0, glosado: 0, repasse: 0, clinica: 0 }
  );

  const marcarPago = (row: RepasseRow) => {
    const lancamento: Transaction = {
      id: `rep-${row.professional.id}-${activeMonth}`,
      title: `Repasse ${row.percent}% — ${row.professional.name}`,
      subtitle: `Competência ${monthLabel(activeMonth)} • ${row.atendimentos} lançamentos`,
      category: 'Repasse Corpo Clínico',
      type: 'despesa',
      amount: -row.repasse,
      date: `Pago • ${monthLabel(activeMonth)}`,
      isoDate: `${activeMonth}-28`,
      status: 'Pago',
      method: 'Repasse',
      badgeLabel: 'Repasse liquidado',
      professionalId: row.professional.id,
    };
    update({ transactions: [lancamento, ...data.transactions] });
    onShowToast(`Repasse de ${row.professional.name} registrado como pago.`);
  };

  const exportarCsv = () => {
    const linhas = [
      ['Profissional', 'CRM', 'Atendimentos', 'Producao', 'Glosado', 'Base', 'Percentual', 'Repasse', 'Clinica', 'Status'],
      ...rows.map((r) => [
        r.professional.name,
        r.professional.crm ?? '',
        String(r.atendimentos),
        r.producao.toFixed(2),
        r.glosado.toFixed(2),
        r.base.toFixed(2),
        `${r.percent}%`,
        r.repasse.toFixed(2),
        r.clinica.toFixed(2),
        r.status,
      ]),
    ];
    const csv = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repasses-${activeMonth}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    onShowToast('Planilha de repasses exportada.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-display font-bold text-slate-900">
            Produção & Repasses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo sobre a produção lançada, descontadas as glosas do período.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeMonth}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/25 cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
          <button
            onClick={exportarCsv}
            disabled={rows.length === 0}
            className="h-9 px-3 flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-teal-500 hover:text-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Produção do período', value: totais.producao, icon: Wallet, tone: 'text-slate-900' },
          { label: 'Glosado (fora da base)', value: totais.glosado, icon: TriangleAlert, tone: 'text-amber-700' },
          { label: 'A repassar', value: totais.repasse, icon: Receipt, tone: 'text-teal-700' },
          { label: 'Retenção da clínica', value: totais.clinica, icon: Percent, tone: 'text-indigo-700' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1.5">
              <card.icon className="w-3.5 h-3.5" />
              <span className="truncate">{card.label}</span>
            </div>
            <p className={`text-base sm:text-lg font-bold tabular-nums ${card.tone}`}>{brl(card.value)}</p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">Nenhuma produção lançada em {monthLabel(activeMonth)}.</p>
          <p className="text-xs text-slate-500 mt-1">Escolha outro período no seletor acima.</p>
        </div>
      ) : (
        <>
          {/* Tabela — telas largas */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Profissional</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Atend.</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Produção</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Glosado</th>
                  <th className="px-3 py-2.5 font-semibold text-right">%</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Repasse</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Clínica</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.professional.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {r.professional.avatarUrl ? (
                          <img src={r.professional.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold flex items-center justify-center">
                            {r.professional.initials}
                          </span>
                        )}
                        <span className="flex flex-col">
                          <span className="font-semibold text-slate-900">{r.professional.name}</span>
                          <span className="text-[11px] text-slate-500">{r.professional.specialty}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{r.atendimentos}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-slate-900">{brl(r.producao)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-amber-700">
                      {r.glosado ? `- ${brl(r.glosado)}` : '—'}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{r.percent}%</td>
                    <td className="px-3 py-3 text-right tabular-nums font-bold text-teal-700">{brl(r.repasse)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{brl(r.clinica)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'Pago' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                          <Check className="w-3 h-3" /> Pago
                        </span>
                      ) : isRestrictedToOwnProduction ? (
                        <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                          Pendente
                        </span>
                      ) : (
                        <button
                          onClick={() => marcarPago(r)}
                          className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] transition cursor-pointer"
                        >
                          Marcar pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartões — celular */}
          <div className="md:hidden space-y-2.5">
            {rows.map((r) => (
              <div key={r.professional.id} className="bg-white rounded-xl border border-slate-200 p-3.5">
                <div className="flex items-center gap-2.5 mb-3">
                  {r.professional.avatarUrl ? (
                    <img src={r.professional.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center">
                      {r.professional.initials}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{r.professional.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {r.atendimentos} lançamento{r.atendimentos === 1 ? '' : 's'} • {r.percent}%
                    </p>
                  </div>
                  {r.status === 'Pago' && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                      Pago
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg py-2">
                    <p className="text-[10px] text-slate-500">Produção</p>
                    <p className="text-[11px] font-bold text-slate-900 tabular-nums">{brl(r.producao)}</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg py-2">
                    <p className="text-[10px] text-teal-700">Repasse</p>
                    <p className="text-[11px] font-bold text-teal-800 tabular-nums">{brl(r.repasse)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg py-2">
                    <p className="text-[10px] text-slate-500">Clínica</p>
                    <p className="text-[11px] font-bold text-slate-900 tabular-nums">{brl(r.clinica)}</p>
                  </div>
                </div>
                {r.status === 'Pendente' && !isRestrictedToOwnProduction && (
                  <button
                    onClick={() => marcarPago(r)}
                    className="mt-2.5 w-full h-9 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Marcar repasse como pago
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
