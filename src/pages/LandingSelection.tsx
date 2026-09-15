import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, ArrowRight, Building2, Stethoscope } from 'lucide-react';
import { DIRECT_IMAGES } from '../data/mockData';

export const LandingSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={DIRECT_IMAGES.logoMedFinance} 
            alt="MedFinance Logo" 
            className="h-12 w-auto mx-auto mb-6 drop-shadow-sm" 
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">
            Ecossistema de Gestão Clínica
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Selecione a plataforma desejada. Os dados são sincronizados em tempo real entre o portal web da contabilidade e o aplicativo do médico.
          </p>
        </div>

        {/* Portals */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Web Admin Portal */}
          <div 
            onClick={() => navigate('/admin')}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 cursor-pointer overflow-hidden flex flex-col items-center text-center hover:border-blue-200"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Monitor className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-700 transition-colors">
              Portal Contabilidade (Web)
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              Visão consolidada da clínica, emissão de Dmed, recursos de glosas, controle de permissionamento e faturamento de toda a rede.
            </p>
            <div className="mt-auto flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm bg-blue-50/50 px-4 py-2 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Building2 className="w-4 h-4" />
              Acessar Painel Web <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Doctor Mobile App */}
          <div 
            onClick={() => navigate('/app')}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 cursor-pointer overflow-hidden flex flex-col items-center text-center hover:border-teal-200"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-teal-700 transition-colors">
              App do Médico (Mobile)
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              Interface ágil para o médico anexar recibos, visualizar repasses do dia, emitir receitas e acompanhar a carteira de pacientes.
            </p>
            <div className="mt-auto flex items-center justify-center gap-2 text-teal-600 font-semibold text-sm bg-teal-50/50 px-4 py-2 rounded-lg group-hover:bg-teal-100 transition-colors">
              <Stethoscope className="w-4 h-4" />
              Acessar App Mobile <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-slate-400">
          Base de dados compartilhada • Multi-plataforma • Arquitetura Responsiva
        </div>
      </div>
    </div>
  );
};
