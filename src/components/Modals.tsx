import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Lock,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Download,
  Share2,
  AlertCircle,
  Copy,
  Receipt,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  CreditCard,
  Building,
  Check,
} from 'lucide-react';
import { Professional, Patient, Transaction } from '../types';

/* =========================================================================
   1. CONVIDAR PROFISSIONAL MODAL
   ========================================================================= */
interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (prof: Partial<Professional>) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [crm, setCrm] = useState('');
  const [role, setRole] = useState<Professional['role']>('Médico Associado');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    let scope: Professional['financialScope'] = 'Apenas Produção Própria - Restrito';
    if (role === 'Sócio Administrador') scope = 'Faturamento Total - Irrestrito';
    if (role === 'Recepção / Faturamento') scope = 'Lançamento de Contas e Recibos';

    onInvite({
      name,
      email,
      role,
      crm: crm || undefined,
      specialty: role.includes('Médico') ? 'Clínica Geral' : 'Operação & Atendimento',
      financialScope: scope,
      status: 'Ativo',
    });
    setName('');
    setEmail('');
    setCrm('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Convidar Novo Profissional
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Dr. Roberto Guimarães"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">E-mail Profissional</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="medico@clinica.com"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">CRM com UF</label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                placeholder="CRM: 000.000-SP"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Perfil de Acesso & Escopo</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
            >
              <option value="Médico Associado">Médico Associado (Apenas Produção Própria - Restrito)</option>
              <option value="Médico Credenciado">Médico Credenciado (Honorários Próprios)</option>
              <option value="Recepção / Faturamento">Recepção / Faturamento (Operacional POS)</option>
              <option value="Sócio Administrador">Sócio Administrador (Faturamento Global Total)</option>
            </select>
          </div>

          <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg flex items-start gap-2">
            <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-teal-900 leading-snug">
              O convidado receberá um link seguro de validação em conformidade com as normas do CFM e LGPD.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
            >
              Enviar Convite Seguro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   2. EDITAR PERMISSÃO DE PROFISSIONAL MODAL
   ========================================================================= */
interface EditProfessionalModalProps {
  professional: Professional | null;
  onClose: () => void;
  onSave: (updated: Professional) => void;
}

export const EditProfessionalModal: React.FC<EditProfessionalModalProps> = ({
  professional,
  onClose,
  onSave,
}) => {
  if (!professional) return null;

  const [role, setRole] = useState(professional.role);
  const [scope, setScope] = useState(professional.financialScope);
  const [status, setStatus] = useState(professional.status);

  const handleSave = () => {
    onSave({
      ...professional,
      role,
      financialScope: scope,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Editar Governança & Acesso
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs space-y-3">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">{professional.name}</span>
            <span className="text-slate-500">{professional.email}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Papel Institucional</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Médico Associado">Médico Associado</option>
              <option value="Sócio Administrador">Sócio Administrador</option>
              <option value="Recepção / Faturamento">Recepção / Faturamento</option>
              <option value="Médico Credenciado">Médico Credenciado</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Escopo Financeiro</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Apenas Produção Própria - Restrito">Apenas Produção Própria - Restrito</option>
              <option value="Faturamento Total - Irrestrito">Faturamento Total - Irrestrito</option>
              <option value="Lançamento de Contas e Recibos">Lançamento de Contas e Recibos</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status Cadastral</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('Ativo')}
                className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                  status === 'Ativo' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Ativo
              </button>
              <button
                type="button"
                onClick={() => setStatus('Inativo')}
                className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                  status === 'Inativo' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Inativo
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. LOG DE AUDITORIA MODAL
   ========================================================================= */
interface AuditLogModalProps {
  professional: Professional | null;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ professional, onClose }) => {
  if (!professional) return null;

  const logs = [
    {
      action: 'Acesso ao demonstrativo de repasses Out/2024',
      ip: '189.40.12.88 (São Paulo, SP)',
      date: 'Hoje, 09:14:22',
      status: 'Autorizado CFM',
    },
    {
      action: 'Consulta a 14 prontuários vinculados',
      ip: '189.40.12.88 (São Paulo, SP)',
      date: 'Hoje, 08:30:10',
      status: 'Conformidade LGPD',
    },
    {
      action: 'Validação de Token e Assinatura Digital ICP-Brasil',
      ip: '177.192.4.11',
      date: 'Ontem, 17:45:00',
      status: 'Sucesso',
    },
    {
      action: 'Tentativa de visualização de faturamento global',
      ip: '177.192.4.11',
      date: '10/10/2024, 11:20:00',
      status: 'Bloqueado por Política de Sigilo',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Trilha de Auditoria & Segurança
              </h3>
              <span className="text-[11px] text-slate-500">
                {professional.name} • {professional.crm || professional.role}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
          {logs.map((log, i) => (
            <div
              key={i}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{log.action}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    log.status.includes('Bloqueado')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>IP: {log.ip}</span>
                <span>{log.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-400">Imutável via Hash SHA-256</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. RECIBO DMED / CARNÊ-LEÃO MODAL
   ========================================================================= */
interface DmedReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  onShowToast: (msg: string) => void;
}

export const DmedReceiptModal: React.FC<DmedReceiptModalProps> = ({
  isOpen,
  onClose,
  patient,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const receiptCode = 'DMED-2024-SP84-' + Math.floor(100000 + Math.random() * 900000);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(receiptCode);
    onShowToast('Código de autenticação DMED copiado!');
  };

  const handleDownloadPdf = () => {
    onShowToast('Demonstrativo DMED com assinatura digital baixado!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Emissão DMED / Carnê-Leão
              </h3>
              <span className="text-[11px] text-slate-500">
                Recibo Médico Fiscal Válido na Receita Federal
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-200/80">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Profissional Emitente:</span>
            <span className="font-semibold text-slate-900">Dra. Isabella Silva</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">CRM / UF:</span>
            <span className="font-mono text-slate-900">142.890 - SP</span>
          </div>
          {patient && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Paciente Beneficiário:</span>
              <span className="font-semibold text-slate-900">{patient.name}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Código Receita Federal:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-teal-700">{receiptCode}</span>
              <button
                onClick={handleCopyCode}
                className="text-slate-400 hover:text-teal-700 cursor-pointer"
                title="Copiar código"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleDownloadPdf}
            className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Gerar PDF com Assinatura ICP-Brasil</span>
          </button>
          <button
            onClick={() => {
              onShowToast('Comprovante encaminhado ao e-mail do contador.');
              onClose();
            }}
            className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Enviar Diretamente ao Contador</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. NOVO LANÇAMENTO (RECEITA OU DESPESA) MODAL
   ========================================================================= */
interface NewTransactionModalProps {
  isOpen: boolean;
  initialType?: 'receita' | 'despesa';
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  initialType = 'receita',
  onClose,
  onAddTransaction,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'receita' | 'despesa'>(initialType);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(type === 'receita' ? 'Consulta Particular' : 'Manutenção & Suprimentos');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Transaction['method']>('Pix');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(',', '.'));
    if (isNaN(num) || num <= 0) return;

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      title,
      subtitle: subtitle || 'Lançamento manual validado',
      category,
      type,
      amount: type === 'receita' ? num : -num,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: type === 'receita' ? 'Liquidado' : 'Pago',
      method,
      badgeLabel: type === 'receita' ? 'Liquidado' : 'Pago',
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Novo Lançamento Financeiro
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setType('receita')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                type === 'receita' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Receita (+)
            </button>
            <button
              type="button"
              onClick={() => setType('despesa')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                type === 'despesa' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Despesa (-)
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Título / Descrição</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Consulta Dra. Isabella ou Compra de Eletrodos"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Paciente ou Fornecedor</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Carlos Eduardo Lima ou MedTech Brasil"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="450.00"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Forma de Liquidação</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer"
              >
                <option value="Pix">Pix Instantâneo</option>
                <option value="Cartão">Cartão / POS</option>
                <option value="Boleto">Boleto Bancário</option>
                <option value="TISS">Guia TISS Convênio</option>
                <option value="Repasse">Repasse Médico</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Salvar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   6. TISS STATUS MODAL
   ========================================================================= */
interface TissModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const TissModal: React.FC<TissModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Módulo TISS & Faturamento Eletrônico
              </h3>
              <span className="text-[11px] text-slate-500">Padrão ANS TISS 4.01.00</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl flex justify-between items-center">
            <div>
              <span className="font-bold text-teal-950 block">Lote Aberto #1042</span>
              <span className="text-[11px] text-teal-800">14 atendimentos Bradesco Saúde</span>
            </div>
            <span className="font-bold text-teal-900 font-display">R$ 2.380,00</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>Status Validador ANS:</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Sem Erros de Schema
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Assinaturas digitais e termos de consentimento TISS vinculados aos prontuários.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              onShowToast('Lote XML TISS exportado com sucesso.');
              onClose();
            }}
            className="flex-1 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-center"
          >
            Exportar XML para Operadora
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. NOVO PACIENTE MODAL
   ========================================================================= */
interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (p: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [planType, setPlanType] = useState<'Particular' | 'Convênio'>('Convênio');
  const [planName, setPlanName] = useState('Bradesco Saúde');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newPat: Patient = {
      id: 'p-' + Date.now(),
      name,
      recordNumber: '#' + Math.floor(4000 + Math.random() * 2000),
      plan: planType === 'Particular' ? 'Particular VIP' : planName,
      planType,
      statusBadge: 'Em Dia',
      statusType: 'settled',
      ltv: 450.0,
      lastDate: 'Hoje',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      procedures: [
        {
          title: 'Primeira Consulta Cardiológica',
          detail: 'Cadastro rápido realizado',
          value: 450.0,
        },
      ],
    };

    onAddPatient(newPat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Cadastro Rápido de Paciente
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mariana Vasconcelos"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tipo de Atendimento</label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value as any)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 cursor-pointer"
              >
                <option value="Convênio">Convênio TISS</option>
                <option value="Particular">Particular</option>
              </select>
            </div>
          </div>

          {planType === 'Convênio' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operadora / Convênio</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Ex: SulAmérica, Unimed, Bradesco"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Cadastrar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   8. TRANSACTION ACTION BOTTOM SHEET MODAL (Context Menu)
   ========================================================================= */
interface ActionMenuSheetProps {
  transaction: Transaction | null;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

export const ActionMenuSheet: React.FC<ActionMenuSheetProps> = ({
  transaction,
  onClose,
  onActionSelect,
}) => {
  if (!transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-2 max-w-lg mx-auto animate-in slide-in-from-bottom duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-1" />

        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-sm font-bold text-slate-900 block font-display">
              Opções do Lançamento
            </span>
            <span className="text-xs text-slate-500 truncate max-w-xs block">
              {transaction.title} ({transaction.amount > 0 ? `+R$ ${transaction.amount}` : `-R$ ${Math.abs(transaction.amount)}`})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1 py-1 text-xs">
          <button
            onClick={() => onActionSelect('Conciliar com Extrato')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Conciliar com Extrato Bancário (OFX)</span>
          </button>

          <button
            onClick={() => onActionSelect('Anexar Comprovante')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Anexar Comprovante ou NF-e</span>
          </button>

          <button
            onClick={() => onActionSelect('Emitir Recibo com Assinatura')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-teal-600" />
            <span>Emitir Recibo Médico com Assinatura Digital</span>
          </button>

          <button
            onClick={() => onActionSelect('Cancelar Lançamento')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-left text-rose-600 font-medium transition-colors cursor-pointer mt-1"
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Cancelar ou Estornar Lançamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
