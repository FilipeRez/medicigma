import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, Building2, Stethoscope, Briefcase, TriangleAlert } from 'lucide-react';
import { DEMO_USERS } from '../data/clinics';
import { DIRECT_IMAGES } from '../data/mockData';
import { useApp } from '../state/AppState';
import { UserRole } from '../types';

const ROLE_ICON: Record<UserRole, React.ElementType> = {
  escritorio: Briefcase,
  clinica: Building2,
  medico: Stethoscope,
};

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const portal = params.get('portal') === 'app' ? '/app' : '/admin';

  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginName, password)) {
      navigate(portal);
    } else {
      setError('Usuário ou senha incorretos. Use uma das contas de demonstração abaixo.');
    }
  };

  const quickLogin = (user: (typeof DEMO_USERS)[number]) => {
    login(user.login, user.password);
    navigate(user.role === 'medico' ? '/app' : portal);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={DIRECT_IMAGES.logoMedFinance} alt="MedFinance" className="h-10 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold text-slate-900">Acesso ao portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cada cliente enxerga apenas os próprios dados.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="login">
              Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="login"
                value={loginName}
                onChange={(e) => {
                  setLoginName(e.target.value);
                  setError(null);
                }}
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="contador"
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="senha">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="senha"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="demo"
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Entrar <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Contas de demonstração
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((u) => {
              const Icon = ROLE_ICON[u.role];
              return (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u)}
                  className="w-full text-left bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:border-teal-500 hover:shadow-sm transition cursor-pointer"
                >
                  <span className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900 truncate">{u.roleLabel}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{u.description}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {u.login} / {u.password}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-px text-amber-600" />
          <span>
            <strong>Demonstração.</strong> O login é simulado no próprio navegador e os dados são
            fictícios. Não representa segurança real nem armazena informação de paciente.
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Isolamento por cliente • LGPD por desenho</span>
        </div>
      </div>
    </div>
  );
};
