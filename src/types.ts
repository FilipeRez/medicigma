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
  date: string;
  status: 'Liquidado' | 'Pendente' | 'Pago' | 'Glosa';
  method: 'Pix' | 'Boleto' | 'Cartão' | 'TISS' | 'Repasse';
  badgeLabel?: string;
  xmlTag?: boolean;
  glosaCode?: string;
  deadline?: string;
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
