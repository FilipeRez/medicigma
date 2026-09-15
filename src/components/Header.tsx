import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ChevronDown, 
  Check, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  X,
  ExternalLink,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { DIRECT_IMAGES, CLINIC_UNITS } from '../data/mockData';
import { ClinicConfig, DeviceMode } from '../types';

interface HeaderProps {
  clinicConfig?: ClinicConfig;
  deviceMode?: DeviceMode;
  onDeviceModeChange?: (mode: DeviceMode) => void;
  onSearchClick?: () => void;
  onQuickRecibo?: () => void;
  onOpenDirectImages?: () => void;
  onShowToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  clinicConfig,
  deviceMode = 'desktop',
  onDeviceModeChange = (_mode: DeviceMode) => {},
  onSearchClick = () => {},
  onQuickRecibo = () => {},
  onOpenDirectImages,
  onShowToast = () => {},
}) => {
  const [selectedUnit, setSelectedUnit] = useState(CLINIC_UNITS[0]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Glosa TISS Recebida',
      desc: 'SulAmérica lote #988 exige justificativa clínica.',
      time: 'Há 12 min',
      unread: true,
    },
    {
      id: '2',
      title: 'Conciliação Automática OK',
      desc: '18 repasses bancários conciliados via OFX.',
      time: 'Há 45 min',
      unread: true,
    },
    {
      id: '3',
      title: 'DMED 2024 Auditada',
      desc: 'Certificado ICP-Brasil pronto para transmissão.',
      time: 'Há 2 horas',
      unread: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left side: Brand, Clinic Selector & Search */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Mobile Brand (if sidebar not present) */}
        <div className="flex items-center gap-2.5 lg:hidden shrink-0">
          <img
            src={clinicConfig?.logoUrl || DIRECT_IMAGES.logoMedFinance}
            alt="MedFinance"
            className="h-7 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Clinic Unit Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUnitDropdown(!showUnitDropdown)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-semibold transition-colors group cursor-pointer max-w-[200px] sm:max-w-none"
            title="Trocar Unidade da Clínica"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="truncate">{selectedUnit.name}</span>
            <span className="hidden sm:inline text-slate-400 font-normal text-[11px]">| {selectedUnit.code}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform" />
          </button>

          {showUnitDropdown && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Unidades do Grupo Hospitalar
                </span>
              </div>
              {CLINIC_UNITS.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setShowUnitDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-teal-50/50 transition-colors text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{unit.name}</span>
                    <span className="text-[11px] text-slate-500">{unit.code}</span>
                  </div>
                  {unit.id === selectedUnit.id && (
                    <Check className="w-4 h-4 text-teal-600" />
                  )}
                </button>
              ))}
              <div className="p-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
                <div className="flex items-center gap-1.5 text-[11px] text-teal-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Isolamento Multi-tenant ativado</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Input (Desktop) */}
        <div className="hidden md:block relative w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            onClick={onSearchClick}
            placeholder="Buscar transação, CRM, paciente..."
            className="w-full h-9 pl-9 pr-12 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white transition-all cursor-pointer"
            readOnly
          />
          <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 border border-slate-300 rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Device View Switcher, Compliance, Notifications & Doctor Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Switcher Toggle (Useful to view exact Mobile and Desktop screens as requested!) */}
        <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => onDeviceModeChange('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              deviceMode === 'desktop'
                ? 'bg-white text-teal-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Visualização Layout Desktop Completo"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => onDeviceModeChange('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              deviceMode === 'mobile'
                ? 'bg-white text-teal-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Visualização Mockup Mobile App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* CFM Compliance Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-[11px] font-semibold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>CFM 2.217/18 & LGPD</span>
        </div>

        {/* Direct Image Links Button */}
        {onOpenDirectImages && (
          <button
            onClick={onOpenDirectImages}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/80 text-xs font-semibold transition-colors cursor-pointer"
            title="Ver links diretos das imagens HTML"
          >
            <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden md:inline">Links Imagens</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notificações e Avisos Financeiros"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900">Notificações e Auditoria</span>
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
                  <div
                    key={item.id}
                    className={`py-2.5 px-1 flex flex-col gap-0.5 ${item.unread ? 'bg-teal-50/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Auditoria criptografada em tempo real</span>
                <button
                  onClick={() => setShowNotificationPanel(false)}
                  className="text-slate-600 font-semibold hover:text-slate-900"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Doctor User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 sm:gap-2.5 pl-1 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <div className="relative">
              <img
                src={DIRECT_IMAGES.avatarIsabella}
                alt="Dra. Isabella Silva"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-teal-100 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-teal-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold ring-2 ring-white">
                ✓
              </span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">Dra. Isabella Silva</span>
              <span className="text-[11px] text-teal-700 font-medium leading-tight">Cardiologia • Acesso Médico</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <img
                  src={DIRECT_IMAGES.avatarIsabella}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900">Dra. Isabella Silva</span>
                  <span className="text-[11px] text-slate-500 font-mono">CRM/SP 142.890</span>
                  <span className="text-[10px] text-teal-600 font-medium">Cardiologista Credenciada</span>
                </div>
              </div>

              <div className="py-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-teal-50 text-teal-900 font-medium">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-[11px]">Sigilo Ativo: Visão Restrita</span>
                </div>
                <div className="px-2 py-1 text-[11px] text-slate-500">
                  Email: isabella.silva@saorafael.med.br
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Versão 3.8.4 Pro</span>
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
