import React from 'react';
import {
  LayoutDashboard,
  WalletCards,
  Plus,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onQuickRecibo: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onQuickRecibo,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(11,28,48,0.06)] px-2">
      <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto">
        {/* Início */}
        <button
          onClick={() => onSelectTab('inicio')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            activeTab === 'inicio' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'inicio' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px]">Início</span>
        </button>

        {/* Finanças */}
        <button
          onClick={() => onSelectTab('financas')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            activeTab === 'financas' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <WalletCards className={`w-5 h-5 mb-0.5 ${activeTab === 'financas' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px]">Finanças</span>
        </button>

        {/* Center elevated + Recibo button */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={onQuickRecibo}
            aria-label="Novo Lançamento / Recibo"
            className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[11px] text-slate-500 mt-1 font-medium">Recibo</span>
        </div>

        {/* Pacientes */}
        <button
          onClick={() => onSelectTab('pacientes')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            activeTab === 'pacientes' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className={`w-5 h-5 mb-0.5 ${activeTab === 'pacientes' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px]">Pacientes</span>
        </button>

        {/* Acessos */}
        <button
          onClick={() => onSelectTab('acessos')}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
            activeTab === 'acessos' || activeTab === 'whitelabel'
              ? 'text-teal-700 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 mb-0.5 ${activeTab === 'acessos' || activeTab === 'whitelabel' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px]">Acessos</span>
        </button>
      </div>
    </nav>
  );
};
