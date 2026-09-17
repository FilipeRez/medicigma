import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Palette,
  Shield,
  BadgePercent,
  Stethoscope,
  KeyRound,
  Headphones,
  Filter,
  UserPlus,
  History,
  CheckCircle2,
  Building,
  Upload,
  Globe,
  Save,
  Check,
  FileText,
  Lock,
  Eye,
  Settings,
} from 'lucide-react';
import { Professional, ClinicConfig } from '../types';
import { DIRECT_IMAGES } from '../data/mockData';

interface GovernanceViewProps {
  /** Qual aba o menu lateral pediu — sem isso, clicar em White-Label não mudava a tela. */
  section?: 'acessos' | 'whitelabel';
  professionals: Professional[];
  clinicConfig: ClinicConfig;
  onUpdateClinicConfig: (config: ClinicConfig) => void;
  onOpenInviteModal: () => void;
  onOpenEditProfessional: (prof: Professional) => void;
  onOpenAuditLog: (prof: Professional) => void;
  onShowToast: (msg: string) => void;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({
  section = 'acessos',
  professionals,
  clinicConfig,
  onUpdateClinicConfig,
  onOpenInviteModal,
  onOpenEditProfessional,
  onOpenAuditLog,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'access' | 'whitelabel'>(
    section === 'whitelabel' ? 'whitelabel' : 'access'
  );

  useEffect(() => {
    setActiveTab(section === 'whitelabel' ? 'whitelabel' : 'access');
  }, [section]);
  const [roleFilter, setRoleFilter] = useState<'all' | 'medicos' | 'admins' | 'recepcao'>('all');
  const [clinicName, setClinicName] = useState(clinicConfig.name);
  const [selectedColor, setSelectedColor] = useState(clinicConfig.primaryColor);
  const [selectedColorName, setSelectedColorName] = useState(clinicConfig.primaryColorName);

  /** Contagens reais do quadro desta clínica. */
  const equipe = {
    total: professionals.length,
    ativos: professionals.filter((p) => p.status === 'Ativo').length,
    medicos: professionals.filter((p) => p.role.includes('Médico')).length,
    admins: professionals.filter((p) => p.role.includes('Administrador')).length,
    recepcao: professionals.filter((p) => p.role.includes('Recepção')).length,
  };
  const pctAtivos = equipe.total ? Math.round((equipe.ativos / equipe.total) * 100) : 0;

  const filteredProfessionals = professionals.filter((p) => {
    if (roleFilter === 'medicos') return p.role.includes('Médico');
    if (roleFilter === 'admins') return p.role.includes('Administrador');
    if (roleFilter === 'recepcao') return p.role.includes('Recepção');
    return true;
  });

  const handleSaveBrand = () => {
    onUpdateClinicConfig({
      ...clinicConfig,
      name: clinicName,
      primaryColor: selectedColor,
      primaryColorName: selectedColorName,
    });
    onShowToast('Identidade visual e configurações da unidade salvas com sucesso!');
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            onUpdateClinicConfig({
              ...clinicConfig,
              logoUrl: reader.result as string,
            });
            onShowToast('Logotipo atualizado com sucesso!');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full pb-20">
      {/* Header with Badges & Navigation Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              LGPD & Resolução CFM nº 2.217/18
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Módulo Corporativo & Governança</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Governança & Níveis de Acesso
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Configure as permissões dos profissionais credenciados garantindo sigilo patrimonial e consulte as credenciais com auditoria em tempo real.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl shrink-0 self-start md:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'access'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Níveis de Acesso & Membros</span>
          </button>

          <button
            onClick={() => setActiveTab('whitelabel')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'whitelabel'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-teal-600" />
            <span>Personalização White-Label</span>
          </button>
        </div>
      </div>

      {/* Institutional Security Directive Banner */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-start gap-3.5 shadow-2xs">
        <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wide">
              Diretriz de Sigilo Financeiro & Isolamento de Dados
            </h4>
            <p className="text-xs text-teal-900 mt-0.5 leading-relaxed">
              Médicos com perfil <strong className="text-teal-950 font-bold">“Médico Associado”</strong> visualizam estritamente os seus próprios atendimentos, pacientes vinculados e relatórios de repasses. Dados globais de faturamento da clínica são restritos a <strong>Sócios Administradores</strong>.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-900 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Base isolada: {clinicConfig.name}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Membros */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Total de Membros</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-display">{equipe.total}</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {pctAtivos}% ativos
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Colaboradores e Corpo Clínico</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <BadgePercent className="w-5 h-5" />
          </div>
        </div>

        {/* Médicos Associados */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Médicos Associados</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-display">{equipe.medicos}</span>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                Visão Restrita
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Acesso à produção própria</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        {/* Sócios Administradores */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Sócios Administradores</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-display">{equipe.admins}</span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                Faturamento Total
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Governança Irrestrita</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>

        {/* Recepção & Faturamento */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Recepção & Faturamento</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-display">{equipe.recepcao}</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                Operacional
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Lançamentos e POS</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Headphones className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB 1: MEMBERS TABLE & ACCESS SCOPES */}
      {activeTab === 'access' && (
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          {/* Header of the Table */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                Profissionais Credenciados & Perfis Ativos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audite as permissões de cada médico ou operador de {clinicConfig.name}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="h-9 pl-8 pr-8 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
                >
                  <option value="all">Todos os Perfis ({equipe.total})</option>
                  <option value="medicos">Médicos Associados</option>
                  <option value="admins">Sócios / Administradores</option>
                  <option value="recepcao">Recepção & Apoio</option>
                </select>
              </div>

              <button
                onClick={onOpenInviteModal}
                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Convidar Profissional</span>
              </button>
            </div>
          </div>

          {/* Table (Desktop and Wide Screens) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Profissional</th>
                  <th className="py-3 px-4">Papel / Perfil</th>
                  <th className="py-3 px-4">Especialidade & CRM</th>
                  <th className="py-3 px-4">Escopo Financeiro</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Professional Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {prof.avatarUrl ? (
                          <img
                            src={prof.avatarUrl}
                            alt={prof.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-${prof.color}-100 text-${prof.color}-700 font-bold flex items-center justify-center text-xs ring-2 ring-${prof.color}-50`}>
                            {prof.initials}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-900 block text-xs">
                            {prof.name}
                          </span>
                          <span className="text-slate-500 text-[11px]">{prof.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-[11px] ${
                          prof.role === 'Sócio Administrador'
                            ? 'bg-purple-50 border border-purple-200 text-purple-800'
                            : prof.role === 'Recepção / Faturamento'
                            ? 'bg-blue-50 border border-blue-200 text-blue-800'
                            : 'bg-teal-50 border border-teal-200 text-teal-800'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {prof.role}
                      </span>
                    </td>

                    {/* Specialty & CRM */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-medium text-slate-800 block">{prof.specialty}</span>
                        {prof.crm && (
                          <span className="text-slate-500 text-[11px]">
                            CRM: {prof.crm} {prof.rqe && `• RQE ${prof.rqe}`}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Financial Scope */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          prof.financialScope === 'Faturamento Total - Irrestrito'
                            ? 'bg-purple-50 border border-purple-200 text-purple-800'
                            : prof.financialScope === 'Lançamento de Contas e Recibos'
                            ? 'bg-slate-100 border border-slate-200 text-slate-700'
                            : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}
                      >
                        {prof.financialScope === 'Faturamento Total - Irrestrito' ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                        {prof.financialScope}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {prof.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenEditProfessional(prof)}
                          className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          title="Editar Permissão"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onOpenAuditLog(prof)}
                          className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                          title="Log de Auditoria"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Exibindo {filteredProfessionals.length} de {equipe.total} membro{equipe.total === 1 ? '' : 's'} cadastrado{equipe.total === 1 ? '' : 's'}</span>
          </div>
        </section>
      )}

      {/* TAB 2: WHITE-LABEL BRANDING & LIVE PREVIEW STUDIO */}
      {activeTab === 'whitelabel' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Customizer Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Configuração de Marca da Clínica
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Personalize o nome fantasia, logotipo oficial e paleta visual apresentada nos relatórios de repasse e comprovantes fiscais.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full shrink-0">
                White-Label Ativo
              </span>
            </div>

            {/* Clinic Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nome Fantasia da Unidade / Razão Social
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-teal-600 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Exibido no topo dos laudos, demonstrativos de repasses e e-mails aos pacientes.
              </p>
            </div>

            {/* Logo Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Logotipo Oficial para Documentos & Header
              </label>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src={clinicConfig?.logoUrl || DIRECT_IMAGES.logoMedFinance}
                      alt="Logo"
                      className="h-8 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-800 block truncate">
                      logo-{clinicConfig.subdomain.split('.')[0]}.svg
                    </span>
                    <span className="text-[11px] text-slate-400">Formato SVG Vetorial • Fundo Transparente</span>
                  </div>
                </div>
                <button
                  onClick={handleLogoUpload}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Substituir Logo</span>
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cor Primária do Portal & Relatórios
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Teal Clínico */}
                <div
                  onClick={() => {
                    setSelectedColor('#0D9488');
                    setSelectedColorName('Teal Clínico (Padrão)');
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedColor === '#0D9488'
                      ? 'border-2 border-teal-600 bg-teal-50/40 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0D9488] shadow-xs" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Teal Clínico</span>
                      <span className="text-[10px] text-slate-500 font-mono">#0D9488</span>
                    </div>
                  </div>
                  {selectedColor === '#0D9488' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  )}
                </div>

                {/* Azul Hospitalar */}
                <div
                  onClick={() => {
                    setSelectedColor('#0284C7');
                    setSelectedColorName('Azul Hospitalar');
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedColor === '#0284C7'
                      ? 'border-2 border-sky-600 bg-sky-50/40 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0284C7] shadow-xs" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Azul Hospitalar</span>
                      <span className="text-[10px] text-slate-500 font-mono">#0284C7</span>
                    </div>
                  </div>
                  {selectedColor === '#0284C7' && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  )}
                </div>

                {/* Navy Foco */}
                <div
                  onClick={() => {
                    setSelectedColor('#0F172A');
                    setSelectedColorName('Navy Corporativo');
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedColor === '#0F172A'
                      ? 'border-2 border-slate-900 bg-slate-50 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0F172A] shadow-xs" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Navy Corporativo</span>
                      <span className="text-[10px] text-slate-500 font-mono">#0F172A</span>
                    </div>
                  </div>
                  {selectedColor === '#0F172A' && (
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sincronizado automaticamente com o banco multi-tenant
              </span>
              <button
                onClick={handleSaveBrand}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>

          {/* Real-time PDF / Doctor Portal Live Preview (Painel Lateral) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900 font-display">
                  Prévia do Portal do Médico
                </h4>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Mockup PDF / Web
              </span>
            </div>

            {/* Document Mockup Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner space-y-3">
              {/* Document Header */}
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <img
                  src={clinicConfig?.logoUrl || DIRECT_IMAGES.logoMedFinance}
                  alt="Logo"
                  className="h-5 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                    {clinicName.trim() || 'Clínica Cardio Vida'}
                  </span>
                  <span className="text-[9px] text-slate-400 block">{clinicConfig?.cnpj || '00.000.000/0001-00'}</span>
                </div>
              </div>

              {/* Dynamic Accent Bar */}
              <div
                className="h-1 rounded-full w-full transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              />

              {/* Demonstrativo Repasse Sample */}
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Demonstrativo de Repasse
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Dra. Isabella Silva • CRM 142.890
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Competência: {new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>42 Consultas Especializadas</span>
                    <span className="font-semibold text-slate-900">R$ 18.900,00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>18 Exames (Ecocardiogramas)</span>
                    <span className="font-semibold text-slate-900">R$ 12.450,00</span>
                  </div>
                  <div className="flex justify-between text-rose-600 text-[11px]">
                    <span>Taxa Administrativa da Clínica (-25%)</span>
                    <span className="font-semibold">- R$ 7.837,50</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-800">Líquido Creditado</span>
                  <span
                    className="text-sm font-extrabold font-display transition-colors duration-300"
                    style={{ color: selectedColor }}
                  >
                    R$ 23.512,50
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  DMED Autenticada
                </span>
                <span>Visualização do Médico</span>
              </div>
            </div>

            {/* Custom Domain Subdomain Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-bold text-slate-800 block">Subdomínio Próprio (CNAME)</span>
                  <span className="text-[11px] text-slate-500 font-mono">{clinicConfig.subdomain}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                SSL Ativo
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
