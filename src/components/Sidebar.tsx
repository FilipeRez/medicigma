import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Users,
  Receipt,
  BarChart3,
  ShieldCheck,
  Palette,
  Settings,
  ChevronsUpDown,
  ShieldAlert,
} from 'lucide-react';
import { DIRECT_IMAGES } from '../data/mockData';
import { TabType, ClinicConfig } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  clinicConfig?: ClinicConfig;
  clinicName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  clinicConfig,
  clinicName,
}) => {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-[#f8fafc] border-r border-slate-200/80 z-40 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Logo Header */}
        <div className="h-16 px-5 border-b border-slate-200/60 flex items-center bg-white">
          <img
            src={clinicConfig?.logoUrl || DIRECT_IMAGES.logoMedFinance}
            alt="MedFinance Clinical Suite"
            className="h-8 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Clinic Short Selector */}
        <div className="px-4 py-3 border-b border-slate-200/60 bg-slate-50/50">
          <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-teal-500 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {clinicName || clinicConfig?.name || 'São Rafael • Jardins'}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  Matriz Hospitalar
                </span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 py-3 space-y-1 text-xs">
          <button
            onClick={() => onSelectTab('inicio')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'inicio'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="flex-1">Dashboard Geral</span>
            {activeTab === 'inicio' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectTab('financas')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'financas'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="flex-1">Contas a Pagar & Receber</span>
            {activeTab === 'financas' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectTab('pacientes')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'pacientes'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="flex-1">Pacientes & Atendimentos</span>
            {activeTab === 'pacientes' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectTab('repasses')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'repasses'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span className="flex-1">Produção & Repasses</span>
            {activeTab === 'repasses' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectTab('relatorios')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'relatorios'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="flex-1">Relatórios & DRE</span>
            {activeTab === 'relatorios' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Configuração & Gestão
            </span>
          </div>

          <button
            onClick={() => onSelectTab('acessos')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'acessos'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="flex-1">Níveis de Acesso</span>
            {activeTab === 'acessos' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          <button
            onClick={() => onSelectTab('whitelabel')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
              activeTab === 'whitelabel'
                ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="flex-1">White-Label & Marca</span>
            {activeTab === 'whitelabel' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/80 bg-white">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-800">LGPD Multi-tenant</span>
              <span className="text-[10px] text-slate-500">Criptografia Ativa</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <button
          onClick={() => onSelectTab('whitelabel')}
          className="mt-2 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Configurações Gerais</span>
        </button>
      </div>
    </aside>
  );
};
