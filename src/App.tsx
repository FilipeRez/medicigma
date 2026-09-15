import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { FinancesView } from './components/FinancesView';
import { PatientsView } from './components/PatientsView';
import { GovernanceView } from './components/GovernanceView';
import { LandingSelection } from './pages/LandingSelection';
import {
  InviteModal,
  EditProfessionalModal,
  AuditLogModal,
  DmedReceiptModal,
  NewTransactionModal,
  TissModal,
  NewPatientModal,
  ActionMenuSheet,
} from './components/Modals';
import {
  INITIAL_CLINIC_CONFIG,
  INITIAL_PROFESSIONALS,
  INITIAL_PATIENTS,
  INITIAL_TRANSACTIONS,
  DIRECT_IMAGES,
} from './data/mockData';
import { TabType, Professional, Patient, Transaction, ClinicConfig } from './types';
import { Image } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig>(INITIAL_CLINIC_CONFIG);
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Modal States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [auditLogProfessional, setAuditLogProfessional] = useState<Professional | null>(null);
  const [isDmedOpen, setIsDmedOpen] = useState(false);
  const [dmedPatient, setDmedPatient] = useState<Patient | null>(null);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'receita' | 'despesa'>('receita');
  const [isTissOpen, setIsTissOpen] = useState(false);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [actionMenuTx, setActionMenuTx] = useState<Transaction | null>(null);
  const [showDirectImagesModal, setShowDirectImagesModal] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleInviteProfessional = (data: Partial<Professional>) => {
    const newProf: Professional = {
      id: 'prof-' + Date.now(),
      name: data.name || 'Novo Médico',
      email: data.email || 'medico@saorafael.com.br',
      role: data.role || 'Médico Associado',
      specialty: data.specialty || 'Clínica Geral',
      crm: data.crm,
      financialScope: data.financialScope || 'Apenas Produção Própria - Restrito',
      status: 'Ativo',
      initials: (data.name || 'NM').split(' ').map((n) => n[0]).slice(0, 2).join(''),
      color: 'teal',
    };
    setProfessionals([newProf, ...professionals]);
    showToast(`Convite seguro enviado com sucesso para ${data.email}`);
  };

  const handleUpdateProfessional = (updated: Professional) => {
    setProfessionals(professionals.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Permissões de ${updated.name} atualizadas.`);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    showToast(
      `${newTx.type === 'receita' ? 'Receita' : 'Despesa'} de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Math.abs(newTx.amount))} registrada!`
    );
  };

  const handleAddPatient = (newPat: Patient) => {
    setPatients([newPat, ...patients]);
    showToast(`Paciente ${newPat.name} cadastrado com prontuário ${newPat.recordNumber}`);
  };

  const handleWhatsAppCharge = (patient: Patient) => {
    const text = encodeURIComponent(
      `Olá, ${patient.name}! Aqui é da ${clinicConfig.name}. Constatamos uma pendência referente ao atendimento clínico do dia ${patient.lastDate}. Para emitirmos seu Recibo DMED para o IRPF, por favor confirme a liquidação pelo link seguro.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast(`Cobrança via WhatsApp iniciada para ${patient.name}`);
  };

  const handleRecursoGlosa = (tx: Transaction) => {
    showToast(`Recurso da glosa de R$ 720,00 protocolado junto à operadora TISS.`);
  };

  const location = useLocation();
  const isWebAdmin = location.pathname.startsWith('/admin');
  const isMobileApp = location.pathname.startsWith('/app');
  
  if (location.pathname === '/') {
    return <LandingSelection />;
  }

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900 ${isMobileApp ? 'max-w-md mx-auto shadow-2xl relative bg-slate-50' : ''}`}>
      {/* Admin Web Sidebar (Only on /admin) */}
      {isWebAdmin && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          clinicConfig={clinicConfig}
          clinicName={clinicConfig.name}
        />
      )}

      {/* Main Layout Container */}
      <div className={`flex-1 flex flex-col transition-all ${isWebAdmin ? 'md:pl-64' : ''}`}>
        
        {/* Header - customized for platform */}
        <Header
          clinicConfig={clinicConfig}
          onOpenDirectImages={() => setShowDirectImagesModal(true)}
          onShowToast={showToast}
          deviceMode={isMobileApp ? 'mobile' : 'desktop'}
        />

        <main className={`flex-1 ${isMobileApp ? 'p-3 pb-24' : 'p-3.5 sm:p-5 lg:p-6 pb-24 md:pb-8'}`}>
          {activeTab === 'inicio' && (
            <DashboardView
              onOpenNewTransaction={(type) => {
                setTransactionType(type);
                setIsNewTransactionOpen(true);
              }}
              onOpenDmedModal={() => {
                setDmedPatient(null);
                setIsDmedOpen(true);
              }}
              onOpenTissModal={() => setIsTissOpen(true)}
              onViewAllTransactions={() => setActiveTab('financas')}
            />
          )}

          {activeTab === 'financas' && (
            <FinancesView
              transactions={transactions}
              onOpenNewTransaction={() => {
                setTransactionType('receita');
                setIsNewTransactionOpen(true);
              }}
              onOpenActionMenu={(tx) => setActionMenuTx(tx)}
              onRecursoGlosa={handleRecursoGlosa}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'pacientes' && (
            <PatientsView
              patients={patients}
              onOpenNewPatient={() => setIsNewPatientOpen(true)}
              onOpenDmedModal={(patient) => {
                setDmedPatient(patient || null);
                setIsDmedOpen(true);
              }}
              onWhatsAppCharge={handleWhatsAppCharge}
              onShowToast={showToast}
            />
          )}

          {(activeTab === 'acessos' || activeTab === 'whitelabel') && isWebAdmin && (
            <GovernanceView
              professionals={professionals}
              clinicConfig={clinicConfig}
              onUpdateClinicConfig={setClinicConfig}
              onOpenInviteModal={() => setIsInviteOpen(true)}
              onOpenEditProfessional={(prof) => setEditingProfessional(prof)}
              onOpenAuditLog={(prof) => setAuditLogProfessional(prof)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav (Only on /app) */}
      {isMobileApp && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onQuickRecibo={() => {
            setDmedPatient(null);
            setIsDmedOpen(true);
          }}
        />
      )}

      {/* MODALS */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} onInvite={handleInviteProfessional} />
      <EditProfessionalModal professional={editingProfessional} onClose={() => setEditingProfessional(null)} onSave={handleUpdateProfessional} />
      <AuditLogModal professional={auditLogProfessional} onClose={() => setAuditLogProfessional(null)} />
      <DmedReceiptModal isOpen={isDmedOpen} onClose={() => setIsDmedOpen(false)} patient={dmedPatient} onShowToast={showToast} />
      <NewTransactionModal isOpen={isNewTransactionOpen} initialType={transactionType} onClose={() => setIsNewTransactionOpen(false)} onAddTransaction={handleAddTransaction} />
      <TissModal isOpen={isTissOpen} onClose={() => setIsTissOpen(false)} onShowToast={showToast} />
      <NewPatientModal isOpen={isNewPatientOpen} onClose={() => setIsNewPatientOpen(false)} onAddPatient={handleAddPatient} />
      <ActionMenuSheet transaction={actionMenuTx} onClose={() => setActionMenuTx(null)} onActionSelect={(action) => { showToast(`Ação executada: ${action}`); setActionMenuTx(null); }} />

      {/* Direct Links Modal */}
      {showDirectImagesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">Links Diretos das Imagens HTML</h3>
                </div>
              </div>
              <button onClick={() => setShowDirectImagesModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {Object.entries(DIRECT_IMAGES).map(([key, url]) => (
                <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={url} alt={key} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-300" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 block truncate">{key}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">{url}</span>
                    </div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(url); showToast(`Link de ${key} copiado!`); }} className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-teal-700 font-semibold shrink-0 cursor-pointer">Copiar URL</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

