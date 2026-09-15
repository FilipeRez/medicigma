import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Stethoscope,
  TrendingUp,
  Receipt,
  Search,
  Mic,
  FolderOpen,
  FileCheck,
  History,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Patient } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  onOpenNewPatient: () => void;
  onOpenDmedModal: (patient?: Patient) => void;
  onWhatsAppCharge: (patient: Patient) => void;
  onShowToast: (msg: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onOpenNewPatient,
  onOpenDmedModal,
  onWhatsAppCharge,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'settled' | 'particular' | 'convenio'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  const toggleDrawer = (id: string) => {
    setOpenDrawerId(openDrawerId === id ? null : id);
  };

  const filteredPatients = patients.filter((p) => {
    if (filter === 'pending' && p.statusType === 'settled') return false;
    if (filter === 'settled' && p.statusType !== 'settled') return false;
    if (filter === 'particular' && p.planType !== 'Particular') return false;
    if (filter === 'convenio' && p.planType !== 'Convênio') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.recordNumber.toLowerCase().includes(q) ||
        p.plan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-3.5 max-w-4xl mx-auto w-full pb-20">
      {/* Title & New Patient Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            Módulo Clínico & Financeiro
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Carteira de Pacientes
          </h1>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="h-9 sm:h-10 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Novo</span>
        </button>
      </div>

      {/* Stats Horizontal Scroll */}
      <div className="w-full overflow-x-auto no-scrollbar py-1 flex gap-2.5 snap-x">
        {/* Ativos */}
        <div className="snap-start shrink-0 w-36 bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Ativos</span>
            <span className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 font-display">342</span>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className="text-teal-700 font-bold">+12%</span>
              <span className="text-slate-400">vs mês ant.</span>
            </div>
          </div>
        </div>

        {/* Consultas */}
        <div className="snap-start shrink-0 w-36 bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Consultas</span>
            <span className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
              <Stethoscope className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 font-display">118</span>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className="text-teal-700 font-bold">94%</span>
              <span className="text-slate-400">taxa pres.</span>
            </div>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="snap-start shrink-0 w-40 bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Ticket Médio</span>
            <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 font-display">R$ 580</span>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className="text-teal-700 font-bold">Estável</span>
              <span className="text-slate-400">consultas</span>
            </div>
          </div>
        </div>

        {/* Orçamentos */}
        <div className="snap-start shrink-0 w-44 bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Orçamentos</span>
            <span className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Receipt className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 font-display">R$ 14.200</span>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className="text-teal-700 font-bold">5 propostas</span>
              <span className="text-slate-400">abertas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input & Audio */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, CPF ou prontuário..."
            className="w-full h-10 pl-10 pr-10 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs sm:text-sm border border-slate-200 shadow-2xs focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all"
          />
          <button
            onClick={() => onShowToast('Reconhecimento de voz para prontuário pronto')}
            className="w-8 h-8 absolute right-1.5 top-1 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors"
            title="Busca por voz"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Todos ({patients.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Com Pendência (14)
          </button>
          <button
            onClick={() => setFilter('settled')}
            className={`h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              filter === 'settled'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Em Dia (328)
          </button>
          <button
            onClick={() => setFilter('particular')}
            className={`h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              filter === 'particular'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Particular
          </button>
          <button
            onClick={() => setFilter('convenio')}
            className={`h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              filter === 'convenio'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Convênio
          </button>
        </div>
      </div>

      {/* Patient Cards List */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => {
          const isDrawerOpen = openDrawerId === patient.id;

          return (
            <div
              key={patient.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          patient.statusType === 'settled'
                            ? 'bg-teal-600'
                            : patient.statusType === 'glosa'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {patient.name}
                    </h2>
                    <span className="text-[11px] text-slate-500 truncate">
                      Prontuário {patient.recordNumber} • {patient.plan}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    patient.statusType === 'settled'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : patient.statusType === 'glosa'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {patient.statusType === 'settled' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {patient.statusBadge}
                </span>
              </div>

              {/* LTV & Last Date Box */}
              <div className="mt-3 bg-slate-50 rounded-lg p-2.5 flex items-center justify-between border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Valor Total Acumulado (LTV)
                  </span>
                  <span className="text-sm font-bold text-teal-700 font-display">
                    {formatBRL(patient.ltv)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {patient.statusType === 'glosa' ? 'Status Glosa' : 'Última Consulta'}
                  </span>
                  <span
                    className={`font-medium ${
                      patient.statusType === 'glosa'
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    {patient.statusType === 'glosa' ? 'Recursar Guia' : patient.lastDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => onShowToast(`Abrindo prontuário eletrônico de ${patient.name}`)}
                  className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 justify-center cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-slate-500" />
                  <span>Prontuário</span>
                </button>

                {patient.statusType === 'glosa' ? (
                  <button
                    onClick={() => onWhatsAppCharge(patient)}
                    className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 justify-center cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Cobrança Whats</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenDmedModal(patient)}
                    className="h-9 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 justify-center cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-teal-700" />
                    <span>Recibo DMED</span>
                  </button>
                )}

                <button
                  onClick={() => toggleDrawer(patient.id)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isDrawerOpen
                      ? 'bg-teal-50 border-teal-300 text-teal-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-teal-700'
                  }`}
                  title="Histórico Financeiro"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>

              {/* Expandable Financial Drawer */}
              {isDrawerOpen && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-slate-800">
                      Extrato Clínico & Procedimentos
                    </span>
                    <span className="text-[11px] text-teal-700 font-medium">
                      DMED 2024 Auditado
                    </span>
                  </div>

                  {patient.glosaDetail && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1">
                      <div className="flex items-center justify-between font-semibold text-rose-800">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Motivo {patient.glosaDetail.code}:
                        </span>
                        <span>Prazo: {patient.glosaDetail.deadlineDays} dias</span>
                      </div>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        {patient.glosaDetail.reason}
                      </p>
                    </div>
                  )}

                  {patient.procedures.map((proc, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-lg p-2.5 flex justify-between items-center border border-slate-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{proc.title}</span>
                        <span
                          className={`text-[11px] ${
                            proc.isPending ? 'text-rose-600 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {proc.detail}
                        </span>
                      </div>
                      <span
                        className={`font-bold font-display ${
                          proc.isPending ? 'text-rose-600' : 'text-teal-700'
                        }`}
                      >
                        {formatBRL(proc.value)}
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onWhatsAppCharge(patient)}
                      className="w-full h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enviar Cobrança / Lembrete por WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
