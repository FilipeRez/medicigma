import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Users,
  Receipt,
  BarChart3,
  ShieldCheck,
  Palette,
  ShieldAlert,
  X,
} from 'lucide-react';
import { DIRECT_IMAGES } from '../data/mockData';
import { ESCRITORIO } from '../data/clinics';
import { TabType, ClinicConfig } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  clinicConfig?: ClinicConfig;
  isOpen?: boolean;
  onClose?: () => void;
  canManage?: boolean;
}

const ITENS: { tab: TabType; label: string; icon: React.ElementType; manage?: boolean }[] = [
  { tab: 'inicio', label: 'Dashboard Geral', icon: LayoutDashboard },
  { tab: 'financas', label: 'Contas a Pagar & Receber', icon: Wallet },
  { tab: 'pacientes', label: 'Pacientes & Atendimentos', icon: Users },
  { tab: 'repasses', label: 'Produção & Repasses', icon: Receipt },
  { tab: 'relatorios', label: 'Relatórios & DRE', icon: BarChart3 },
  { tab: 'acessos', label: 'Níveis de Acesso', icon: ShieldCheck, manage: true },
  { tab: 'whitelabel', label: 'White-Label & Marca', icon: Palette, manage: true },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  clinicConfig,
  isOpen = false,
  onClose = () => {},
  canManage = true,
}) => {
  const itens = ITENS.filter((i) => !i.manage || canManage);
  const gestao = itens.filter((i) => i.manage);
  const operacao = itens.filter((i) => !i.manage);

  const botao = (item: (typeof ITENS)[number]) => {
    const Icon = item.icon;
    const ativo = activeTab === item.tab;
    return (
      <button
        key={item.tab}
        onClick={() => onSelectTab(item.tab)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left cursor-pointer ${
          ativo
            ? 'bg-teal-600 text-white font-semibold shadow-2xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        {ativo && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </button>
    );
  };

  return (
    <>
      {/* Fundo escurecido — só existe quando o menu abre no celular */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#f8fafc] border-r border-slate-200/80 z-50 flex flex-col justify-between select-none transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col min-h-0">
          <div className="h-16 px-5 border-b border-slate-200/60 flex items-center justify-between bg-white">
            <img
              src={clinicConfig?.logoUrl || DIRECT_IMAGES.logoMedFinance}
              alt="MedFinance Clinical Suite"
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-slate-200/60 bg-slate-50/50">
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {clinicConfig?.name ?? 'Clínica'}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">{ESCRITORIO.name}</span>
                </span>
              </div>
            </div>
          </div>

          <nav className="px-3 py-3 space-y-1 text-xs overflow-y-auto">
            {operacao.map(botao)}
            {gestao.length > 0 && (
              <>
                <div className="pt-3 pb-1 px-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Configuração & Gestão
                  </span>
                </div>
                {gestao.map(botao)}
              </>
            )}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200/80 bg-white">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800">Base isolada por cliente</span>
                <span className="text-[10px] text-slate-500">Dados fictícios de demonstração</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </aside>
    </>
  );
};
