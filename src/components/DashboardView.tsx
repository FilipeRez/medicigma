import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Stethoscope,
  Building2,
  Calendar,
  Landmark,
  DollarSign,
  PiggyBank,
  Gavel,
  PlusCircle,
  FileSpreadsheet,
  Receipt,
  FileCheck,
  ShieldCheck,
  Wrench,
  CreditCard,
  Zap,
  ArrowRight,
  Repeat,
} from 'lucide-react';
import { Transaction } from '../types';
import { useApp } from '../state/AppState';

interface DashboardViewProps {
  onOpenNewTransaction: (type: 'receita' | 'despesa') => void;
  onOpenDmedModal: () => void;
  onOpenTissModal: () => void;
  onViewAllTransactions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewTransaction,
  onOpenDmedModal,
  onOpenTissModal,
  onViewAllTransactions,
}) => {
  const { data, user, clinic } = useApp();
  const [period, setPeriod] = useState<'mes' | 'hoje' | 'semana' | 'ano'>('mes');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const hojeIso = new Date().toISOString().slice(0, 10);

  /** Mês de referência: o corrente, ou o último com lançamento — a demo nunca abre vazia. */
  const mesRef = useMemo(() => {
    const meses = Array.from(new Set(data.transactions.map((t) => t.isoDate.slice(0, 7)))).sort();
    const corrente = hojeIso.slice(0, 7);
    if (meses.includes(corrente)) return corrente;
    return meses.filter((m) => m <= corrente).pop() ?? meses[meses.length - 1] ?? corrente;
  }, [data.transactions, hojeIso]);

  /** Interpreta YYYY-MM-DD no fuso local — new Date(iso) seria lido como UTC. */
  const dataLocal = (iso: string) => {
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d);
  };

  const noPeriodo = useMemo(() => {
    const limite = dataLocal(hojeIso);
    limite.setDate(limite.getDate() - 7);
    const inicioSemana = `${limite.getFullYear()}-${String(limite.getMonth() + 1).padStart(2, '0')}-${String(limite.getDate()).padStart(2, '0')}`;
    return data.transactions.filter((t) => {
      if (period === 'hoje') return t.isoDate === hojeIso;
      if (period === 'semana') return t.isoDate > inicioSemana && t.isoDate <= hojeIso;
      if (period === 'ano') return t.isoDate.slice(0, 4) === mesRef.slice(0, 4);
      return t.isoDate.slice(0, 7) === mesRef;
    });
  }, [data.transactions, period, mesRef, hojeIso]);

  const kpi = useMemo(() => {
    const receitas = noPeriodo.filter((t) => t.type === 'receita' && t.status !== 'Glosa');
    const despesas = noPeriodo.filter((t) => t.type === 'despesa');
    const faturamento = receitas.reduce((a, t) => a + t.amount, 0);
    const convenio = receitas.filter((t) => t.method === 'TISS').reduce((a, t) => a + t.amount, 0);
    const particular = faturamento - convenio;
    const aReceber = receitas.filter((t) => t.status === 'Pendente').reduce((a, t) => a + t.amount, 0);
    const aPagar = despesas.filter((t) => t.status === 'Pendente').reduce((a, t) => a + Math.abs(t.amount), 0);
    const totalDespesas = despesas.reduce((a, t) => a + Math.abs(t.amount), 0);
    const glosas = noPeriodo.filter((t) => t.status === 'Glosa').reduce((a, t) => a + Math.abs(t.amount), 0);
    const resultado = faturamento - totalDespesas;

    // Variação contra o mês anterior. Quando o mês exibido ainda está em curso,
    // a comparação é com o MESMO intervalo de dias do mês anterior — senão um mês
    // pela metade sempre pareceria queda diante de um mês fechado.
    const [ano, mes] = mesRef.split('-').map(Number);
    const anteriorData = new Date(ano, mes - 2, 1);
    const anteriorYm = `${anteriorData.getFullYear()}-${String(anteriorData.getMonth() + 1).padStart(2, '0')}`;
    const mesEmCurso = mesRef === hojeIso.slice(0, 7);
    const diaLimite = mesEmCurso ? Number(hojeIso.slice(8, 10)) : 31;
    const anterior = data.transactions
      .filter(
        (t) =>
          t.isoDate.slice(0, 7) === anteriorYm &&
          Number(t.isoDate.slice(8, 10)) <= diaLimite &&
          t.type === 'receita' &&
          t.status !== 'Glosa'
      )
      .reduce((a, t) => a + t.amount, 0);
    const variacao = anterior > 0 ? ((faturamento - anterior) / anterior) * 100 : 0;

    return {
      faturamento,
      convenio,
      particular,
      aReceber,
      aPagar,
      glosas,
      resultado,
      margem: faturamento > 0 ? (resultado / faturamento) * 100 : 0,
      anterior,
      variacao,
      comparacaoParcial: mesEmCurso,
      pctParticular: faturamento > 0 ? (particular / faturamento) * 100 : 0,
      pctConvenio: faturamento > 0 ? (convenio / faturamento) * 100 : 0,
      contagemReceber: receitas.filter((t) => t.status === 'Pendente').length,
      contagemPagar: despesas.filter((t) => t.status === 'Pendente').length,
    };
  }, [noPeriodo, data.transactions, mesRef, hojeIso]);

  /** Últimos 7 dias de entradas, direto dos lançamentos. */
  const dailyData = useMemo(() => {
    const dias: { day: string; value: number; height: number; isPeak?: boolean }[] = [];
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 6; i >= 0; i--) {
      const d = dataLocal(hojeIso);
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const value = data.transactions
        .filter((t) => t.isoDate === iso && t.type === 'receita' && t.status !== 'Glosa')
        .reduce((a, t) => a + t.amount, 0);
      dias.push({ day: nomes[d.getDay()], value, height: 0 });
    }
    const maior = Math.max(...dias.map((d) => d.value), 1);
    return dias.map((d) => ({
      ...d,
      height: Math.max((d.value / maior) * 100, 3),
      isPeak: d.value === maior && d.value > 0,
    }));
  }, [data.transactions, hojeIso]);

  const mediaDiaria = dailyData.reduce((a, d) => a + d.value, 0) / 7;

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    noPeriodo
      .filter((t) => t.type === 'receita' && t.status !== 'Glosa')
      .forEach((t) => mapa.set(t.category, (mapa.get(t.category) ?? 0) + t.amount));
    const total = Array.from(mapa.values()).reduce((a, v) => a + v, 0);
    return Array.from(mapa.entries())
      .map(([categoria, valor]) => ({
        categoria,
        valor,
        percentual: total > 0 ? (valor / total) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 4);
  }, [noPeriodo]);
  const profissional = data.professionals.find((p) => p.id === user?.professionalId);

  // O médico não enxerga as contas da clínica; para ele os dois últimos cartões
  // falam de repasse, que é o que de fato entra no bolso dele.
  const ehMedico = user?.role === 'medico';
  const percentRepasse = profissional?.repassePercent ?? 0;
  const repasseEstimado = (kpi.faturamento * percentRepasse) / 100;
  const retencaoClinica = kpi.faturamento - repasseEstimado;

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Doctor Greeting Card with Perspective Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            {user?.role === 'medico' ? 'Produção própria' : 'Visão da clínica'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <Building2 className="w-3 h-3 text-slate-500" />
            {clinic.shortName}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Olá, {user?.name.split(' ').slice(0, 2).join(' ')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
              {profissional?.crm && (
                <>
                  <span className="font-semibold text-teal-700 font-mono">CRM {profissional.crm}</span>
                  <span className="text-slate-300">•</span>
                </>
              )}
              <span>{profissional?.specialty ?? clinic.config.name}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Period Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setPeriod('mes')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            period === 'mes'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          Este Mês
        </button>
        <button
          onClick={() => setPeriod('hoje')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            period === 'hoje'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setPeriod('semana')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            period === 'semana'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          Esta Semana
        </button>
        <button
          onClick={() => setPeriod('ano')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            period === 'ano'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          Este Ano
        </button>
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      {/* Main Monthly Revenue Highlight */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {period === 'hoje' ? 'Faturamento de hoje' : period === 'semana' ? 'Faturamento da semana' : period === 'ano' ? 'Faturamento do ano' : 'Faturamento do mês'}
          </span>
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-xs border ${
              kpi.variacao >= 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {kpi.variacao >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {kpi.variacao >= 0 ? '+' : ''}{kpi.variacao.toFixed(1)}%
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {formatBRL(kpi.faturamento)}
          </span>
          <span className="text-xs text-slate-400">{kpi.anterior > 0
              ? `vs. ${formatBRL(kpi.anterior)}${kpi.comparacaoParcial ? ' no mesmo período' : ''}`
              : 'sem base anterior'}</span>
        </div>

        {/* Dual Bar Progress */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-teal-600 rounded-l-full transition-all duration-500"
              style={{ width: `${kpi.pctParticular}%` }}
              title="Particular (61.5%)"
            />
            <div
              className="h-full bg-sky-600 rounded-r-full transition-all duration-500"
              style={{ width: `${kpi.pctConvenio}%` }}
              title="Convênios TISS (38.5%)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="text-xs text-slate-600 font-medium">Particular (Direto)</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{formatBRL(kpi.particular)}</span>
              <span className="text-[11px] text-teal-700 font-semibold">{kpi.pctParticular.toFixed(1)}% do total</span>
            </div>

            <div className="flex flex-col bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                <span className="text-xs text-slate-600 font-medium">Convênios (TISS)</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{formatBRL(kpi.convenio)}</span>
              <span className="text-[11px] text-sky-700 font-semibold">{kpi.pctConvenio.toFixed(1)}% do total</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* A Receber */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
              Previsto
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">A Receber</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 block font-display">
              {formatBRL(kpi.aReceber)}
            </span>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{kpi.contagemReceber} lançamento{kpi.contagemReceber === 1 ? '' : 's'} em aberto</p>
          </div>
        </div>

        {/* A Pagar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800">
              Contas
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">{ehMedico ? 'Retenção da clínica' : 'A Pagar'}</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 block font-display">
              {formatBRL(ehMedico ? retencaoClinica : kpi.aPagar)}
            </span>
            <p className="text-[11px] text-rose-600 font-semibold truncate mt-0.5">
              {ehMedico
                ? `${100 - percentRepasse}% da produção`
                : `${kpi.contagemPagar} conta${kpi.contagemPagar === 1 ? '' : 's'} a vencer`}
            </p>
          </div>
        </div>

        {/* Resultado Líquido */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
              Líquido
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">{ehMedico ? 'Repasse estimado' : 'Resultado'}</span>
            <span className="text-base sm:text-lg font-bold text-teal-700 block font-display">
              {formatBRL(ehMedico ? repasseEstimado : kpi.resultado)}
            </span>
            <p className="text-[11px] text-emerald-700 font-medium truncate mt-0.5">
              {ehMedico ? `${percentRepasse}% da produção` : `Margem de ${kpi.margem.toFixed(1)}%`}
            </p>
          </div>
        </div>

        {/* Glosas Recurso */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
              TISS
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Glosas Recurso</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 block font-display">
              {formatBRL(kpi.glosas)}
            </span>
            <p className="text-[11px] text-amber-700 font-medium truncate mt-0.5">
              {kpi.faturamento > 0 ? ((kpi.glosas / kpi.faturamento) * 100).toFixed(1) : '0.0'}% da receita
            </p>
          </div>
        </div>
      </div>

      {/* Ações Frequentes */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ações Frequentes
          </span>
          <span className="text-xs text-teal-600 font-semibold cursor-pointer hover:underline">
            Personalizar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onOpenNewTransaction('receita')}
            className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-teal-50 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center text-teal-700 transition-colors mb-1.5">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-800 font-semibold">Nova Receita</span>
            <span className="text-[10px] text-slate-400">Pix, Particular, POS</span>
          </button>

          <button
            onClick={() => onOpenNewTransaction('despesa')}
            className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center text-rose-700 transition-colors mb-1.5">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-800 font-semibold">Nova Despesa</span>
            <span className="text-[10px] text-slate-400">Equipamentos, Boleto</span>
          </button>

          <button
            onClick={onOpenDmedModal}
            className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center text-sky-700 transition-colors mb-1.5">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-800 font-semibold">Recibo DMED</span>
            <span className="text-[10px] text-slate-400">Carnê-Leão e IRPF</span>
          </button>

          <button
            onClick={onOpenTissModal}
            className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center text-purple-700 transition-colors mb-1.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-800 font-semibold">Guia TISS</span>
            <span className="text-[10px] text-slate-400">Lotes XML e ANS</span>
          </button>
        </div>
      </div>

      {/* Produção & Repasses (Chart + Operators) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Produção & Repasses</h3>
            <p className="text-xs text-slate-500">Entradas diárias nos últimos 7 dias</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            Média {formatBRL(mediaDiaria)}/dia
          </span>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="pt-3">
          <div className="h-28 flex items-end justify-between gap-2 px-2 border-b border-slate-200 pb-2">
            {dailyData.map((d) => (
              <div
                key={d.day}
                className="flex-1 h-full flex flex-col items-center justify-end gap-1 group cursor-pointer"
                onMouseEnter={() => setHoveredDay(d.day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {hoveredDay === d.day && (
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shadow-2xs -mb-1">
                    {formatBRL(d.value)}
                  </span>
                )}
                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                    d.isPeak
                      ? 'bg-teal-600 ring-2 ring-teal-400/50'
                      : 'bg-teal-500/80 group-hover:bg-teal-600'
                  }`}
                  style={{ height: `${d.height}%` }}
                />
                <span
                  className={`text-[11px] ${
                    d.isPeak ? 'font-bold text-teal-800' : 'text-slate-500'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Receita por categoria — calculada sobre os lançamentos do período */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-2.5">
            Receita por categoria
          </span>

          {porCategoria.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhuma receita lançada neste período.</p>
          ) : (
            <div className="space-y-2.5 text-xs">
              {porCategoria.map((c) => (
                <div key={c.categoria}>
                  <div className="flex items-center justify-between mb-1 gap-3">
                    <span className="font-medium text-slate-800 truncate">{c.categoria}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 tabular-nums">{formatBRL(c.valor)}</span>
                      <span className="font-bold text-teal-700 tabular-nums">
                        {c.percentual.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-700 rounded-full"
                      style={{ width: `${Math.max(c.percentual, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vencimentos & Repasses Recent Feed */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Vencimentos & Repasses</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <button
            onClick={onViewAllTransactions}
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Extrato</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {/* Item 1 */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Ecoview Manutenção
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-50 text-rose-700 font-semibold">
                    Hoje
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Calibração Ultrassom Doppler</p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-bold text-rose-600 block">- R$ 1.850,00</span>
              <span className="text-[10px] text-slate-400">Boleto Itaú</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Rodrigo Cavalcante
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold">
                    Pix
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Consulta Particular Cardiologia</p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-bold text-teal-700 block">+ R$ 550,00</span>
              <span className="text-[10px] text-emerald-600 font-medium">Liquidado</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">Mariana Souza</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold">
                    Cartão
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Ecocardiograma com Laudo</p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-bold text-teal-700 block">+ R$ 780,00</span>
              <span className="text-[10px] text-emerald-600 font-medium">Liquidado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conciliação TISS Ativa Banner */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">Demonstração com dados fictícios</p>
            <p className="text-[11px] text-slate-500 truncate">
              Envio de XML ao convênio e assinatura de DMED ainda não estão implementados.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenTissModal}
          className="text-xs font-semibold text-teal-700 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 shrink-0 cursor-pointer shadow-2xs"
        >
          Ver o que falta
        </button>
      </div>
    </div>
  );
};
