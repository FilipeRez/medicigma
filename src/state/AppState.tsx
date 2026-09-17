import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CLINICS, findUser, getClinic, getUserById } from '../data/clinics';
import { Clinic, ClinicData, DemoUser, Session } from '../types';

const SESSION_KEY = 'medicigma:session';
const dataKey = (clinicId: string) => `medicigma:data:${clinicId}`;

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo anônimo ou armazenamento cheio: a demo segue, só não persiste */
  }
}

function seedOf(clinic: Clinic): ClinicData {
  return {
    config: clinic.config,
    professionals: clinic.professionals,
    patients: clinic.patients,
    transactions: clinic.transactions,
  };
}

/** Carrega o que o usuário já mexeu nesta clínica; se nunca mexeu, usa o seed. */
function loadData(clinicId: string): ClinicData {
  return readJson<ClinicData>(dataKey(clinicId)) ?? seedOf(getClinic(clinicId));
}

interface AppContextValue {
  user: DemoUser | null;
  clinic: Clinic;
  /** Dados já filtrados pelo que o perfil logado tem direito de ver. */
  data: ClinicData;
  /** Dados completos da clínica, sem o recorte do perfil. */
  fullData: ClinicData;
  clinics: Clinic[];
  isRestrictedToOwnProduction: boolean;
  login: (login: string, password: string) => boolean;
  logout: () => void;
  setActiveClinic: (id: string) => void;
  update: (patch: Partial<ClinicData>) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(() => readJson<Session>(SESSION_KEY));
  const user = session ? getUserById(session.userId) ?? null : null;
  const activeClinicId = session?.activeClinicId ?? CLINICS[0].id;

  const [fullData, setFullData] = useState<ClinicData>(() => loadData(activeClinicId));

  // Ao trocar de clínica, troca a base carregada — é o isolamento entre clientes.
  useEffect(() => {
    setFullData(loadData(activeClinicId));
  }, [activeClinicId]);

  useEffect(() => {
    if (session) writeJson(dataKey(activeClinicId), fullData);
  }, [fullData, activeClinicId, session]);

  const login = useCallback((loginName: string, password: string) => {
    const found = findUser(loginName, password);
    if (!found) return false;
    const next: Session = { userId: found.id, activeClinicId: found.clinicIds[0] };
    setSession(next);
    writeJson(SESSION_KEY, next);
    setFullData(loadData(next.activeClinicId));
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignora */
    }
  }, []);

  const setActiveClinic = useCallback(
    (id: string) => {
      setSession((current) => {
        if (!current) return current;
        const allowed = getUserById(current.userId)?.clinicIds ?? [];
        if (!allowed.includes(id)) return current;
        const next = { ...current, activeClinicId: id };
        writeJson(SESSION_KEY, next);
        return next;
      });
    },
    []
  );

  const update = useCallback((patch: Partial<ClinicData>) => {
    setFullData((current) => ({ ...current, ...patch }));
  }, []);

  const resetDemo = useCallback(() => {
    CLINICS.forEach((c) => {
      try {
        localStorage.removeItem(dataKey(c.id));
      } catch {
        /* ignora */
      }
    });
    setFullData(seedOf(getClinic(activeClinicId)));
  }, [activeClinicId]);

  const clinic = getClinic(activeClinicId);
  const isRestrictedToOwnProduction = user?.role === 'medico';

  const data = useMemo<ClinicData>(() => {
    if (!isRestrictedToOwnProduction || !user?.professionalId) return fullData;
    const mine = user.professionalId;
    return {
      ...fullData,
      transactions: fullData.transactions.filter((t) => t.professionalId === mine),
      professionals: fullData.professionals.filter((p) => p.id === mine),
    };
  }, [fullData, isRestrictedToOwnProduction, user]);

  const clinics = useMemo(
    () => CLINICS.filter((c) => user?.clinicIds.includes(c.id)),
    [user]
  );

  const value: AppContextValue = {
    user,
    clinic,
    data,
    fullData,
    clinics,
    isRestrictedToOwnProduction,
    login,
    logout,
    setActiveClinic,
    update,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de AppStateProvider');
  return ctx;
}
