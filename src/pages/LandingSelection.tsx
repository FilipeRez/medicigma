import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, ArrowRight, Building2, Stethoscope, ShieldCheck } from 'lucide-react';
import { DIRECT_IMAGES } from '../data/mockData';
import { ESCRITORIO } from '../data/clinics';
import { useApp } from '../state/AppState';

export const LandingSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const abrir = (portal: 'admin' | 'app') =>
    navigate(user ? `/${portal}` : `/login?portal=${portal}`);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 sm:p-6 text-slate-900 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <img
            src={DIRECT_IMAGES.logoMedFinance}
            alt="MedFinance"
            className="h-10 sm:h-12 w-auto mx-auto mb-5 drop-shadow-sm"
          />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">
            Gestão financeira de clínicas
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Um escritório contábil, várias clínicas-clientes — cada uma com base de dados
            separada e acesso próprio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => abrir('admin')}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 cursor-pointer overflow-hidden flex flex-col items-center text-center hover:border-blue-200"
          >
            <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
            <span className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Monitor className="w-7 h-7 sm:w-8 sm:h-8" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-700 transition-colors">
              Portal da Contabilidade
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Visão por cliente: contas a pagar e receber, pacientes, repasses do corpo clínico,
              DRE e níveis de acesso.
            </p>
            <span className="mt-auto flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm bg-blue-50/60 px-4 py-2 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Building2 className="w-4 h-4" />
              Entrar no painel <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => abrir('app')}
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 cursor-pointer overflow-hidden flex flex-col items-center text-center hover:border-teal-200"
          >
            <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80" />
            <span className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-7 h-7 sm:w-8 sm:h-8" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 group-hover:text-teal-700 transition-colors">
              App do Médico
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              O que o médico vê no celular: a produção dele, os repasses do período e os
              recibos dos pacientes — só isso.
            </p>
            <span className="mt-auto flex items-center justify-center gap-2 text-teal-600 font-semibold text-sm bg-teal-50/60 px-4 py-2 rounded-lg group-hover:bg-teal-100 transition-colors">
              <Stethoscope className="w-4 h-4" />
              Abrir aplicativo <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            {ESCRITORIO.responsavel}
          </span>
          <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
            Demonstração com dados fictícios. Algumas ações (XML do TISS, assinatura digital da
            DMED, protocolo de glosa) ainda são simuladas.
          </p>
        </div>
      </div>
    </div>
  );
};
