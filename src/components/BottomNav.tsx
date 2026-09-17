import React from 'react';
import { LayoutDashboard, Receipt, Plus, Users, BarChart3 } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onQuickRecibo: () => void;
}

const ESQUERDA: { tab: TabType; label: string; icon: React.ElementType }[] = [
  { tab: 'inicio', label: 'Início', icon: LayoutDashboard },
  { tab: 'repasses', label: 'Repasses', icon: Receipt },
];

const DIREITA: { tab: TabType; label: string; icon: React.ElementType }[] = [
  { tab: 'pacientes', label: 'Pacientes', icon: Users },
  { tab: 'relatorios', label: 'Relatórios', icon: BarChart3 },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, onQuickRecibo }) => {
  const item = (entry: { tab: TabType; label: string; icon: React.ElementType }) => {
    const Icon = entry.icon;
    const ativo = activeTab === entry.tab || (entry.tab === 'inicio' && activeTab === 'financas');
    return (
      <button
        key={entry.tab}
        onClick={() => onSelectTab(entry.tab)}
        className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
          ativo ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Icon className={`w-5 h-5 mb-0.5 ${ativo ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px]">{entry.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(11,28,48,0.06)] px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto">
        {ESQUERDA.map(item)}

        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={onQuickRecibo}
            aria-label="Emitir recibo"
            className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[11px] text-slate-500 mt-1 font-medium">Recibo</span>
        </div>

        {DIREITA.map(item)}
      </div>
    </nav>
  );
};
