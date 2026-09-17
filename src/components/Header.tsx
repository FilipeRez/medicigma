import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Check,
  ShieldCheck,
  Lock,
  Menu,
  LogOut,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DIRECT_IMAGES } from '../data/mockData';
import { ESCRITORIO } from '../data/clinics';
import { useApp } from '../state/AppState';
import { DeviceMode } from '../types';

interface HeaderProps {
  deviceMode?: DeviceMode;
  onShowToast?: (msg: string) => void;
  /** Só existe no portal web, para abrir o menu lateral no celular. */
  onOpenMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deviceMode = 'desktop',
  onShowToast = (_msg: string) => {},
  onOpenMenu,
}) => {
  const { user, clinic, clinics, setActiveClinic, logout, resetDemo } = useApp();
  const navigate = useNavigate();

  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Glosa TISS recebida',
      desc: 'Operadora exige justificativa clínica no lote em aberto.',
      time: 'Há 12 min',
      unread: true,
    },
    {
      id: '2',
      title: 'Repasses do mês calculados',
      desc: 'A produção do período já está fechada para conferência.',
      time: 'Há 45 min',
      unread: true,
    },
    {
      id: '3',
      title: 'DMED do exercício',
      desc: 'Recibos prontos para revisão da contabilidade.',
      time: 'Há 2 horas',
      unread: false,
    },
  ]);

  const markAllAsRead = () => setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  const unreadCount = notifications.filter((n) => n.unread).length;
  const podeTrocarClinica = clinics.length > 1;

  const sair = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <img
          src={clinic.config.logoUrl || DIRECT_IMAGES.logoMedFinance}
          alt="MedFinance"
          className="h-7 w-auto object-contain shrink-0 hidden sm:block md:hidden lg:hidden"
        />

        {/* Seletor de clínica-cliente */}
        <div className="relative min-w-0">
          <button
            onClick={() => podeTrocarClinica && setShowClinicDropdown(!showClinicDropdown)}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-800 text-xs font-semibold transition-colors max-w-[190px] sm:max-w-none ${
              podeTrocarClinica ? 'hover:bg-slate-100 cursor-pointer' : 'cursor-default'
            }`}
            title={podeTrocarClinica ? 'Trocar de clínica-cliente' : clinic.config.name}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">{clinic.config.name}</span>
            {podeTrocarClinica && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </button>

          {showClinicDropdown && podeTrocarClinica && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Clientes de {ESCRITORIO.name}
                </span>
              </div>
              {clinics.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveClinic(c.id);
                    setShowClinicDropdown(false);
                    onShowToast(`Base carregada: ${c.config.name}`);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-teal-50/50 transition-colors text-xs cursor-pointer"
                >
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-900 truncate">{c.config.name}</span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {c.segment} • CNPJ {c.config.cnpj}
                    </span>
                  </span>
                  {c.id === clinic.id && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              ))}
              <div className="p-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
                <div className="flex items-center gap-1.5 text-[11px] text-teal-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Cada cliente tem base isolada</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-[11px] font-semibold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>CFM 2.217/18 &amp; LGPD</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-teal-600 hover:underline font-medium cursor-pointer"
                >
                  Marcar lidas
                </button>
              </div>

              <div className="divide-y divide-slate-100 py-1 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className={`py-2.5 px-1 ${item.unread ? 'bg-teal-50/30' : ''}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Perfil e sessão */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 pl-1 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-teal-100"
              />
            ) : (
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-teal-100">
                {user?.initials ?? '??'}
              </span>
            )}
            <span className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</span>
              <span className="text-[11px] text-teal-700 font-medium leading-tight truncate max-w-[200px]">
                {user?.roleLabel}
              </span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-[min(17rem,calc(100vw-2rem))] bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center">
                    {user?.initials ?? '??'}
                  </span>
                )}
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">{user?.name}</span>
                  <span className="text-[11px] text-slate-500 truncate">{user?.roleLabel}</span>
                </div>
              </div>

              <div className="py-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-teal-50 text-teal-900 font-medium">
                  <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="text-[11px]">
                    {user?.role === 'escritorio'
                      ? `${clinics.length} clientes no escopo`
                      : user?.role === 'medico'
                        ? 'Visão restrita: produção própria'
                        : 'Visão completa desta clínica'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-slate-500">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{clinic.config.name}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    resetDemo();
                    setShowProfileDropdown(false);
                    onShowToast('Dados da demonstração restaurados.');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar dados de demonstração
                </button>
                <button
                  onClick={sair}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {deviceMode === 'mobile' && <span className="sr-only">Modo aplicativo</span>}
    </header>
  );
};
