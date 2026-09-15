import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Calendar,
  ArrowDown,
  ArrowUp,
  Clock,
  Search,
  SlidersHorizontal,
  X,
  MoreVertical,
  Plus,
  CheckCircle2,
  Hourglass,
  ReceiptText,
  AlertTriangle,
  Download,
  FileCode,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { Transaction } from '../types';

interface FinancesViewProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
  onOpenActionMenu: (tx: Transaction) => void;
  onRecursoGlosa: (tx: Transaction) => void;
  onShowToast: (msg: string) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  transactions,
  onOpenNewTransaction,
  onOpenActionMenu,
  onRecursoGlosa,
  onShowToast,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = Nov
  const [privacyActive, setPrivacyActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'receber' | 'pagar' | 'ofx'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const months = [
    'Janeiro 2024', 'Fevereiro 2024', 'Março 2024', 'Abril 2024',
    'Maio 2024', 'Junho 2024', 'Julho 2024', 'Agosto 2024',
    'Setembro 2024', 'Outubro 2024', 'Novembro 2024', 'Dezembro 2024'
  ];

  const formatMoney = (val: number) => {
    if (privacyActive) return 'R$ ••••••••';
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(absVal);
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const formatAbsoluteMoney = (val: number) => {
    if (privacyActive) return 'R$ ••••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type
    if (activeFilter === 'receber' && tx.type !== 'receita') return false;
    if (activeFilter === 'pagar' && tx.type !== 'despesa') return false;
    if (activeFilter === 'ofx' && tx.method !== 'Pix' && tx.method !== 'Boleto') return false;

    // Search query
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.subtitle.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Titulo', 'Descricao', 'Categoria', 'Tipo', 'Valor', 'Status', 'Data'];
    const rows = filteredTransactions.map(t => [
      t.id,
      `"${t.title}"`,
      `"${t.subtitle}"`,
      `"${t.category}"`,
      t.type,
      t.amount,
      t.status,
      t.date
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financeiro-saorafael-${months[currentMonthIndex].replace(' ', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Relatório CSV baixado com sucesso!');
  };

  return (
    <div className="flex flex-col gap-3.5 max-w-4xl mx-auto w-full pb-20">
      {/* Month Navigation & Privacy Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {months[currentMonthIndex]}
            </span>
          </div>
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            setPrivacyActive(!privacyActive);
            onShowToast(privacyActive ? 'Valores visíveis' : 'Valores ocultados por segurança');
          }}
          className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/60 flex items-center gap-1.5 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          title="Ocultar/Exibir valores numéricos"
        >
          {privacyActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>Valores</span>
        </button>
      </div>

      {/* Main Projected Balance Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saldo Previsto do Mês
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
            +14.2%
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-teal-700 tracking-tight font-display">
            {formatAbsoluteMoney(17880)}
          </span>
          <span className="text-xs text-slate-400">fluxo líquido</span>
        </div>

        {/* Sub-metrics: Receber vs Pagar */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
          {/* A Receber */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-teal-700 mb-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider">A Receber</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 font-display">
              {formatAbsoluteMoney(31800)}
            </span>
            <span className="text-[11px] text-slate-500">24 títulos previstos</span>
          </div>

          {/* A Pagar */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100 relative">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1 text-rose-600">
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">A Pagar</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 font-display">
              {formatAbsoluteMoney(13920)}
            </span>
            <div className="flex items-center gap-1 text-rose-600 text-[11px] font-semibold">
              <Clock className="w-3 h-3" />
              <span>1 boleto hoje</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          onClick={() => setActiveFilter('todos')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'todos'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Todos <span className="ml-1 opacity-80 text-[10px]">{transactions.length}</span>
        </button>

        <button
          onClick={() => setActiveFilter('receber')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'receber'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Receber (+)
        </button>

        <button
          onClick={() => setActiveFilter('pagar')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'pagar'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Pagar (-)
        </button>

        <button
          onClick={() => setActiveFilter('ofx')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'ofx'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span>Conciliação OFX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        </button>
      </div>

      {/* Search and Advanced Filter Trigger */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transação, paciente ou convênio..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => onShowToast('Filtro avançado por data e plano ativo')}
          className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-teal-600 shadow-2xs transition-colors cursor-pointer"
          title="Filtro avançado"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Transaction Feed Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Lançamentos Recentes ({filteredTransactions.length})
        </span>
        <button
          onClick={exportCSV}
          className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
            Nenhuma transação encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      tx.type === 'receita'
                        ? 'bg-teal-50 text-teal-700'
                        : tx.status === 'Glosa'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {tx.type === 'receita' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : tx.status === 'Glosa' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <ReceiptText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {tx.title}
                      </span>
                      {tx.xmlTag && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                          XML
                        </span>
                      )}
                      {tx.glosaCode && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          {tx.glosaCode}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 truncate">{tx.subtitle}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-bold font-display ${
                      tx.type === 'receita'
                        ? 'text-teal-700'
                        : tx.status === 'Glosa'
                        ? 'text-amber-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {formatMoney(tx.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400">{tx.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[11px] flex items-center gap-1 ${
                      tx.status === 'Liquidado' || tx.status === 'Pago'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : tx.status === 'Glosa'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.badgeLabel || tx.status}
                  </span>

                  {/* Method Badge */}
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                    {tx.method === 'Pix' && '⚡ Pix Instantâneo'}
                    {tx.method === 'Boleto' && '📄 Boleto Bancário'}
                    {tx.method === 'TISS' && '🏥 Faturamento Eletrônico'}
                    {tx.method === 'Repasse' && '👨‍⚕️ Repasse Produção'}
                    {tx.method === 'Cartão' && '💳 POS / Cartão'}
                  </span>

                  {/* If Glosa, show Quick Recorrer Button */}
                  {tx.status === 'Glosa' && (
                    <button
                      onClick={() => onRecursoGlosa(tx)}
                      className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Recorrer
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onOpenActionMenu(tx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Opções do lançamento"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Fast Action Button (+ Lançamento) */}
      <div className="fixed right-5 bottom-20 z-30">
        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition-all cursor-pointer font-semibold text-xs tracking-wide"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Lançamento</span>
        </button>
      </div>
    </div>
  );
};
