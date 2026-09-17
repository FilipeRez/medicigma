import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { FinancesView } from './components/FinancesView';
import { PatientsView } from './components/PatientsView';
import { GovernanceView } from './components/GovernanceView';
import { RepassesView } from './components/RepassesView';
import { RelatoriosView } from './components/RelatoriosView';
import { LandingSelection } from './pages/LandingSelection';
import { LoginPage } from './pages/LoginPage';
import { AppStateProvider, useApp } from './state/AppState';
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
import { TabType, Professional, Patient, Transaction } from './types';

function AppContent() {
  const { data, update, user } = useApp();
  const { config: clinicConfig, professionals, patients, transactions } = data;

  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleInviteProfessional = (payload: Partial<Professional>) => {
    const newProf: Professional = {
      id: 'prof-' + Date.now(),
      name: payload.name || 'Novo Médico',
      email: payload.email || 'medico@clinica.com.br',
      role: payload.role || 'Médico Associado',
      specialty: payload.specialty || 'Clínica Geral',
      crm: payload.crm,
      financialScope: payload.financialScope || 'Apenas Produção Própria - Restrito',
      status: 'Ativo',
      initials: (payload.name || 'NM').split(' ').map((n) => n[0]).slice(0, 2).join(''),
      color: 'teal',
      repassePercent: 70,
    };
    update({ professionals: [newProf, ...professionals] });
    showToast(`Convite seguro enviado com sucesso para ${payload.email}`);
  };

  const handleUpdateProfessional = (updated: Professional) => {
    update({ professionals: professionals.map((p) => (p.id === updated.id ? updated : p)) });
    showToast(`Permissões de ${updated.name} atualizadas.`);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    update({ transactions: [newTx, ...transactions] });
    showToast(
      `${newTx.type === 'receita' ? 'Receita' : 'Despesa'} de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Math.abs(newTx.amount))} registrada!`
    );
  };

  const handleAddPatient = (newPat: Patient) => {
    update({ patients: [newPat, ...patients] });
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
    const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      Math.abs(tx.amount)
    );
    showToast(`Recurso da glosa de ${valor} protocolado junto à operadora TISS.`);
  };

  const location = useLocation();
  const isWebAdmin = location.pathname.startsWith('/admin');
  const isMobileApp = location.pathname.startsWith('/app');
  const canManage = user?.role !== 'medico';

  return (
    <div
      className={`min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900 ${
        isMobileApp ? 'max-w-md mx-auto shadow-2xl relative bg-slate-50' : ''
      }`}
    >
      {isWebAdmin && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          clinicConfig={clinicConfig}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          canManage={canManage}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all ${isWebAdmin ? 'md:pl-[260px]' : ''}`}>
        <Header
          onShowToast={showToast}
          deviceMode={isMobileApp ? 'mobile' : 'desktop'}
          onOpenMenu={isWebAdmin ? () => setIsSidebarOpen(true) : undefined}
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

          {activeTab === 'repasses' && <RepassesView onShowToast={showToast} />}

          {activeTab === 'relatorios' && <RelatoriosView onShowToast={showToast} />}

          {(activeTab === 'acessos' || activeTab === 'whitelabel') && canManage && (
            <GovernanceView
              section={activeTab === 'whitelabel' ? 'whitelabel' : 'acessos'}
              professionals={professionals}
              clinicConfig={clinicConfig}
              onUpdateClinicConfig={(config) => update({ config })}
              onOpenInviteModal={() => setIsInviteOpen(true)}
              onOpenEditProfessional={(prof) => setEditingProfessional(prof)}
              onOpenAuditLog={(prof) => setAuditLogProfessional(prof)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

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

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

/** Sem sessão nenhum portal abre — é justamente o que a demonstração precisa mostrar. */
const RequireAuth: React.FC<{ portal: 'admin' | 'app'; children: React.ReactNode }> = ({
  portal,
  children,
}) => {
  const { user } = useApp();
  if (!user) return <Navigate to={`/login?portal=${portal}`} replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Routes>
          <Route path="/" element={<LandingSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <RequireAuth portal="admin">
                <AppContent />
              </RequireAuth>
            }
          />
          <Route
            path="/app/*"
            element={
              <RequireAuth portal="app">
                <AppContent />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppStateProvider>
    </BrowserRouter>
  );
}
