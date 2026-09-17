import React, { useMemo, useState } from 'react';
import { Download, Table2, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../state/AppState';

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const mesCurto = (ym: string) => `${MESES_CURTOS[Number(ym.slice(5, 7)) - 1]}/${ym.slice(2, 4)}`;

/** Cores das séries — par validado para daltonismo sobre superfície clara. */
const COR_RECEITA = '#0D9488';
const COR_DESPESA = '#B45309';

interface MesResumo {
  ym: string;
  receita: number;
  despesa: number;
  glosa: number;
  resultado: number;
}

export const RelatoriosView: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { data, clinic } = useApp();
  const [modoTabela, setModoTabela] = useState(false);

  const meses = useMemo<MesResumo[]>(() => {
    const mapa = new Map<string, MesResumo>();
    data.transactions.forEach((t) => {
      const ym = t.isoDate.slice(0, 7);
      const atual = mapa.get(ym) ?? { ym, receita: 0, despesa: 0, glosa: 0, resultado: 0 };
      if (t.type === 'receita') {
        if (t.status === 'Glosa') atual.glosa += t.amount;
        else atual.receita += t.amount;
      } else {
        atual.despesa += Math.abs(t.amount);
      }
      mapa.set(ym, atual);
    });
    // Meses futuros ficam de fora: eles só têm contas a vencer, e entrariam
    // no consolidado como prejuízo de um período que ainda nem começou.
    const corrente = new Date().toISOString().slice(0, 7);
    return Array.from(mapa.values())
      .filter((m) => m.ym <= corrente)
      .map((m) => ({ ...m, resultado: m.receita - m.despesa }))
      .sort((a, b) => a.ym.localeCompare(b.ym))
      .slice(-6);
  }, [data.transactions]);

  const [mesAtivo, setMesAtivo] = useState<string | null>(null);
  const foco = meses.find((m) => m.ym === mesAtivo) ?? meses[meses.length - 1];

  const totais = meses.reduce(
    (acc, m) => ({
      receita: acc.receita + m.receita,
      despesa: acc.despesa + m.despesa,
      glosa: acc.glosa + m.glosa,
    }),
    { receita: 0, despesa: 0, glosa: 0 }
  );
  const resultado = totais.receita - totais.despesa;
  const margem = totais.receita > 0 ? (resultado / totais.receita) * 100 : 0;

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    data.transactions
      .filter((t) => t.type === 'despesa')
      .forEach((t) => mapa.set(t.category, (mapa.get(t.category) ?? 0) + Math.abs(t.amount)));
    return Array.from(mapa.entries())
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);
  }, [data.transactions]);

  const maiorCategoria = porCategoria[0]?.valor ?? 1;
  const maiorBarra = Math.max(...meses.map((m) => Math.max(m.receita, m.despesa)), 1);

  const exportarDre = () => {
    const linhas = [
      ['Competencia', 'Receita', 'Glosas', 'Despesas', 'Resultado'],
      ...meses.map((m) => [
        m.ym,
        m.receita.toFixed(2),
        m.glosa.toFixed(2),
        m.despesa.toFixed(2),
        m.resultado.toFixed(2),
      ]),
      ['TOTAL', totais.receita.toFixed(2), totais.glosa.toFixed(2), totais.despesa.toFixed(2), resultado.toFixed(2)],
    ];
    const csv = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dre-${clinic.id}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    onShowToast('DRE exportado em CSV.');
  };

  // Geometria do gráfico de barras agrupadas.
  const W = 640;
  const H = 200;
  const PAD_B = 22;
  const PAD_T = 8;
  const alturaUtil = H - PAD_B - PAD_T;
  const larguraGrupo = W / Math.max(meses.length, 1);
  const larguraBarra = Math.min(26, larguraGrupo / 3.2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-display font-bold text-slate-900">Relatórios & DRE</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidado dos últimos {meses.length} meses de {clinic.config.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModoTabela((v) => !v)}
            className="h-9 px-3 flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-teal-500 hover:text-teal-700 transition cursor-pointer"
          >
            {modoTabela ? <BarChart3 className="w-3.5 h-3.5" /> : <Table2 className="w-3.5 h-3.5" />}
            {modoTabela ? 'Gráfico' : 'Tabela'}
          </button>
          <button
            onClick={exportarDre}
            className="h-9 px-3 flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-teal-500 hover:text-teal-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Números de destaque */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Receita do período</p>
          <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">{brl(totais.receita)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Despesas</p>
          <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">{brl(totais.despesa)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Resultado</p>
          <p
            className={`text-base sm:text-lg font-bold tabular-nums ${
              resultado >= 0 ? 'text-teal-700' : 'text-rose-700'
            }`}
          >
            {brl(resultado)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5">
          <p className="text-[11px] font-medium text-slate-500 mb-1">Margem</p>
          <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums flex items-center gap-1">
            {margem >= 0 ? (
              <TrendingUp className="w-4 h-4 text-teal-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            )}
            {margem.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Receitas x despesas por mês */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900">Receitas e despesas por mês</h2>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COR_RECEITA }} /> Receitas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COR_DESPESA }} /> Despesas
            </span>
          </div>
        </div>

        {modoTabela ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-500 text-left border-b border-slate-200">
                <tr>
                  <th className="py-2 font-semibold">Competência</th>
                  <th className="py-2 font-semibold text-right">Receitas</th>
                  <th className="py-2 font-semibold text-right">Glosas</th>
                  <th className="py-2 font-semibold text-right">Despesas</th>
                  <th className="py-2 font-semibold text-right">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meses.map((m) => (
                  <tr key={m.ym}>
                    <td className="py-2 font-medium text-slate-900">{mesCurto(m.ym)}</td>
                    <td className="py-2 text-right tabular-nums text-slate-700">{brl(m.receita)}</td>
                    <td className="py-2 text-right tabular-nums text-amber-700">
                      {m.glosa ? brl(m.glosa) : '—'}
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-700">{brl(m.despesa)}</td>
                    <td
                      className={`py-2 text-right tabular-nums font-semibold ${
                        m.resultado >= 0 ? 'text-teal-700' : 'text-rose-700'
                      }`}
                    >
                      {brl(m.resultado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 sm:h-52" role="img" aria-label="Receitas e despesas por mês">
              {/* grade recessiva */}
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <line
                  key={f}
                  x1={0}
                  x2={W}
                  y1={PAD_T + alturaUtil * (1 - f)}
                  y2={PAD_T + alturaUtil * (1 - f)}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
              ))}
              <line x1={0} x2={W} y1={PAD_T + alturaUtil} y2={PAD_T + alturaUtil} stroke="#cbd5e1" strokeWidth={1} />

              {meses.map((m, i) => {
                const centro = larguraGrupo * i + larguraGrupo / 2;
                const hR = (m.receita / maiorBarra) * alturaUtil;
                const hD = (m.despesa / maiorBarra) * alturaUtil;
                const ativo = foco?.ym === m.ym;
                return (
                  <g
                    key={m.ym}
                    onMouseEnter={() => setMesAtivo(m.ym)}
                    onClick={() => setMesAtivo(m.ym)}
                    className="cursor-pointer"
                  >
                    {/* alvo de toque maior que a marca */}
                    <rect x={larguraGrupo * i} y={0} width={larguraGrupo} height={H} fill="transparent" />
                    {ativo && (
                      <rect
                        x={larguraGrupo * i + 2}
                        y={PAD_T}
                        width={larguraGrupo - 4}
                        height={alturaUtil}
                        fill="#f1f5f9"
                        rx={6}
                      />
                    )}
                    <rect
                      x={centro - larguraBarra - 1}
                      y={PAD_T + alturaUtil - hR}
                      width={larguraBarra}
                      height={Math.max(hR, 1)}
                      fill={COR_RECEITA}
                      rx={4}
                    />
                    <rect
                      x={centro + 1}
                      y={PAD_T + alturaUtil - hD}
                      width={larguraBarra}
                      height={Math.max(hD, 1)}
                      fill={COR_DESPESA}
                      rx={4}
                    />
                    <text
                      x={centro}
                      y={H - 6}
                      textAnchor="middle"
                      className="fill-slate-500"
                      style={{ fontSize: 11 }}
                    >
                      {mesCurto(m.ym)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* leitura do mês em foco — funciona igual no toque e no mouse */}
            {foco && (
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                <span className="text-xs font-bold text-slate-900">{mesCurto(foco.ym)}</span>
                <span className="text-[11px] text-slate-600">
                  Receitas <strong className="text-slate-900 tabular-nums">{brl(foco.receita)}</strong>
                </span>
                <span className="text-[11px] text-slate-600">
                  Despesas <strong className="text-slate-900 tabular-nums">{brl(foco.despesa)}</strong>
                </span>
                <span className="text-[11px] text-slate-600">
                  Resultado{' '}
                  <strong className={`tabular-nums ${foco.resultado >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                    {brl(foco.resultado)}
                  </strong>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Despesas por categoria */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Para onde vai a despesa</h2>
        {porCategoria.length === 0 ? (
          <p className="text-xs text-slate-500">Nenhuma despesa lançada no período.</p>
        ) : (
          <div className="space-y-2.5">
            {porCategoria.map((c) => (
              <div key={c.categoria}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-xs text-slate-700 truncate">{c.categoria}</span>
                  <span className="text-xs font-semibold text-slate-900 tabular-nums shrink-0">
                    {brl(c.valor)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((c.valor / maiorCategoria) * 100, 2)}%`,
                      background: COR_DESPESA,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DRE resumido */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Demonstrativo do período</h2>
        <dl className="text-xs divide-y divide-slate-100">
          {[
            ['Receita bruta de serviços', totais.receita, 'text-slate-900'],
            ['(–) Glosas em aberto', -totais.glosa, 'text-amber-700'],
            ['(=) Receita líquida', totais.receita - totais.glosa, 'text-slate-900'],
            ['(–) Despesas operacionais', -totais.despesa, 'text-slate-900'],
          ].map(([label, valor, cor]) => (
            <div key={label as string} className="flex items-center justify-between py-2">
              <dt className="text-slate-600">{label as string}</dt>
              <dd className={`font-semibold tabular-nums ${cor as string}`}>{brl(valor as number)}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5 bg-slate-50 -mx-4 px-4 mt-1">
            <dt className="font-bold text-slate-900">Resultado do período</dt>
            <dd className={`font-bold tabular-nums ${resultado >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
              {brl(resultado)}
            </dd>
          </div>
        </dl>
        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
          Demonstrativo gerencial, calculado sobre os lançamentos desta clínica. Não substitui a
          escrituração contábil nem a apuração fiscal.
        </p>
      </div>
    </div>
  );
};
