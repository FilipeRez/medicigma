export type TabType = 'inicio' | 'financas' | 'pacientes' | 'repasses' | 'relatorios' | 'acessos' | 'whitelabel';

export type DeviceMode = 'auto' | 'desktop' | 'mobile';

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: 'Médico Associado' | 'Sócio Administrador' | 'Recepção / Faturamento' | 'Médico Credenciado';
  specialty: string;
  crm?: string;
  rqe?: string;
  financialScope: 'Apenas Produção Própria - Restrito' | 'Faturamento Total - Irrestrito' | 'Lançamento de Contas e Recibos';
  status: 'Ativo' | 'Inativo' | 'Pendente';
  avatarUrl?: string;
  initials?: string;
  color?: string;
  lastAudit?: string;
  /** Percentual da produção que fica com o profissional (o resto é da clínica). */
  repassePercent?: number;
}

export interface Patient {
  id: string;
  name: string;
  recordNumber: string;
  plan: string;
  planType: 'Particular' | 'Convênio';
  statusBadge: string;
  statusType: 'pending' | 'settled' | 'glosa';
  ltv: number;
  lastDate: string;
  avatarUrl: string;
  initials?: string;
  procedures: {
    title: string;
    detail: string;
    value: number;
    isPending?: boolean;
  }[];
  glosaDetail?: {
    code: string;
    reason: string;
    deadlineDays: number;
    amount: number;
  };
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'receita' | 'despesa';
  amount: number;
  /** Rótulo exibido na interface ("Hoje, 10:42", "Vence 05/12"). */
  date: string;
  /** Data real no formato YYYY-MM-DD — é o que alimenta relatórios e repasses. */
  isoDate: string;
  status: 'Liquidado' | 'Pendente' | 'Pago' | 'Glosa';
  method: 'Pix' | 'Boleto' | 'Cartão' | 'TISS' | 'Repasse';
  badgeLabel?: string;
  xmlTag?: boolean;
  glosaCode?: string;
  deadline?: string;
  /** Profissional que produziu a receita — base do cálculo de repasse. */
  professionalId?: string;
}

export interface ClinicConfig {
  name: string;
  unit: string;
  cnpj: string;
  subdomain: string;
  logoUrl: string;
  primaryColor: string;
  primaryColorName: string;
  isWhiteLabelActive: boolean;
}

/** O dado mutável de um tenant — o que é persistido e o que as telas editam. */
export interface ClinicData {
  config: ClinicConfig;
  professionals: Professional[];
  patients: Patient[];
  transactions: Transaction[];
}

/** Uma clínica-cliente do escritório contábil. Cada uma é um tenant isolado. */
export interface Clinic extends ClinicData {
  id: string;
  shortName: string;
  segment: string;
}

export type UserRole = 'escritorio' | 'clinica' | 'medico';

export interface DemoUser {
  id: string;
  login: string;
  password: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl?: string;
  initials?: string;
  /** Clínicas que este usuário enxerga. O escritório vê todas; os demais, uma só. */
  clinicIds: string[];
  /** Para o perfil médico: de quem é a produção visível. */
  professionalId?: string;
  description: string;
}

export interface Session {
  userId: string;
  activeClinicId: string;
}

/** Linha da tela de Repasses, calculada a partir de transações e profissionais. */
export interface RepasseRow {
  professional: Professional;
  producao: number;
  glosado: number;
  base: number;
  percent: number;
  repasse: number;
  clinica: number;
  atendimentos: number;
  status: 'Pendente' | 'Pago';
}
