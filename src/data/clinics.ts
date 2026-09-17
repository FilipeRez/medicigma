import { Clinic, DemoUser, Professional, Transaction } from '../types';
import {
  DIRECT_IMAGES,
  INITIAL_CLINIC_CONFIG,
  INITIAL_PROFESSIONALS,
  INITIAL_PATIENTS,
  INITIAL_TRANSACTIONS,
} from './mockData';

/**
 * O escritório contábil é o tenant raiz. Cada clínica abaixo é um cliente dele,
 * com dados isolados: quem entra como clínica só enxerga a própria.
 */
export const ESCRITORIO = {
  name: 'Contabilidade Horizonte',
  cnpj: '29.184.552/0001-08',
  responsavel: 'Escritório contábil • 3 clínicas ativas',
};

/**
 * Gera o histórico dos meses anteriores de forma determinística, para que os
 * relatórios tenham série temporal de verdade sem inchar o arquivo de dados.
 * Mesma semente, mesmos números — o gráfico não muda a cada F5.
 */
function buildHistory(seed: number, professionals: Professional[]): Transaction[] {
  let state = seed;
  const rand = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };

  const medicos = professionals.filter((p) => p.repassePercent);
  const receitas = [
    { title: 'Consultas particulares do mês', category: 'Consulta Particular', method: 'Pix' as const },
    { title: 'Lote TISS consolidado', category: 'Convênio TISS', method: 'TISS' as const },
    { title: 'Exames e procedimentos', category: 'Exame Diagnóstico', method: 'Cartão' as const },
  ];
  const despesas = [
    { title: 'Folha e encargos', category: 'Pessoal', method: 'Boleto' as const },
    { title: 'Aluguel e condomínio', category: 'Ocupação', method: 'Boleto' as const },
    { title: 'Insumos e materiais', category: 'Insumos', method: 'Boleto' as const },
    { title: 'Repasse ao corpo clínico', category: 'Repasse Corpo Clínico', method: 'Repasse' as const },
  ];

  const out: Transaction[] = [];
  const meses = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  // No mês corrente os lançamentos ficam na primeira quinzena: nada liquidado no futuro.
  const corrente = (mes: string) => mes === meses[meses.length - 1];

  meses.forEach((mes, mi) => {
    const diasReceita = corrente(mes) ? [4, 9, 14] : [8, 15, 22];
    const diasDespesa = corrente(mes) ? [2, 5, 8, 11] : [5, 11, 17, 23];
    receitas.forEach((r, ri) => {
      const prof = medicos[(mi + ri) % Math.max(medicos.length, 1)];
      out.push({
        id: `h-${seed}-${mi}-r${ri}`,
        title: r.title,
        subtitle: prof ? `Produção de ${prof.name}` : 'Produção consolidada',
        category: r.category,
        type: 'receita',
        amount: Math.round((3200 + rand() * 5200) * 100) / 100,
        date: `${mes.slice(5)}/${mes.slice(0, 4)}`,
        isoDate: `${mes}-${String(diasReceita[ri]).padStart(2, '0')}`,
        status: 'Liquidado',
        method: r.method,
        badgeLabel: 'Liquidado',
        professionalId: prof?.id,
      });
    });
    despesas.forEach((d, di) => {
      out.push({
        id: `h-${seed}-${mi}-d${di}`,
        title: d.title,
        subtitle: 'Competência do mês',
        category: d.category,
        type: 'despesa',
        amount: -Math.round((1400 + rand() * 4600) * 100) / 100,
        date: `${mes.slice(5)}/${mes.slice(0, 4)}`,
        isoDate: `${mes}-${String(diasDespesa[di]).padStart(2, '0')}`,
        status: 'Pago',
        method: d.method,
        badgeLabel: 'Pago',
      });
    });
  });

  return out;
}

const CLINICA_CARDIO: Clinic = {
  id: 'cardio-vida',
  shortName: 'Cardio Vida',
  segment: 'Cardiologia',
  config: INITIAL_CLINIC_CONFIG,
  professionals: INITIAL_PROFESSIONALS,
  patients: INITIAL_PATIENTS,
  transactions: [...INITIAL_TRANSACTIONS, ...buildHistory(101, INITIAL_PROFESSIONALS)],
};

const ORTO_PROFESSIONALS: Professional[] = [
  {
    id: 'orto-1',
    name: 'Dr. Henrique Prado',
    email: 'henrique.prado@auroraorto.com.br',
    role: 'Sócio Administrador',
    specialty: 'Ortopedia & Traumatologia',
    crm: '77.215-SP',
    rqe: '4410',
    financialScope: 'Faturamento Total - Irrestrito',
    status: 'Ativo',
    initials: 'HP',
    color: 'purple',
    repassePercent: 60,
    lastAudit: 'Hoje, 08:20',
  },
  {
    id: 'orto-2',
    name: 'Dra. Larissa Monteiro',
    email: 'larissa.monteiro@auroraorto.com.br',
    role: 'Médico Associado',
    specialty: 'Medicina Física e Reabilitação',
    crm: '131.907-SP',
    financialScope: 'Apenas Produção Própria - Restrito',
    status: 'Ativo',
    initials: 'LM',
    color: 'teal',
    repassePercent: 70,
    lastAudit: 'Ontem, 17:05',
  },
  {
    id: 'orto-3',
    name: 'Paula Andrade',
    email: 'paula.andrade@auroraorto.com.br',
    role: 'Recepção / Faturamento',
    specialty: 'Agenda, convênios e recibos',
    financialScope: 'Lançamento de Contas e Recibos',
    status: 'Ativo',
    initials: 'PA',
    color: 'blue',
    lastAudit: 'Hoje, 09:48',
  },
];

const CLINICA_ORTO: Clinic = {
  id: 'aurora-orto',
  shortName: 'Aurora Orto',
  segment: 'Ortopedia',
  config: {
    name: 'Instituto Ortopédico Aurora',
    unit: 'Unidade Aurora • Sede',
    cnpj: '41.882.310/0001-77',
    subdomain: 'aurora.medicigma.app',
    logoUrl: DIRECT_IMAGES.logoMedFinance,
    primaryColor: '#4F46E5',
    primaryColorName: 'Índigo Aurora',
    isWhiteLabelActive: true,
  },
  professionals: ORTO_PROFESSIONALS,
  patients: [
    {
      id: 'op1',
      name: 'Renato Aguiar Lima',
      recordNumber: '#2214',
      plan: 'Amil Linha Azul',
      planType: 'Convênio',
      statusBadge: 'Em Dia',
      statusType: 'settled',
      ltv: 4120.0,
      lastDate: '12/09/2026',
      avatarUrl: DIRECT_IMAGES.patientMarcos,
      procedures: [
        { title: 'Artroscopia de joelho — pós-operatório', detail: 'Guia TISS #44120 • 12/09/2026', value: 2600.0 },
        { title: 'Sessões de fisioterapia (10x)', detail: 'Pacote liquidado • 20/08/2026', value: 1520.0 },
      ],
    },
    {
      id: 'op2',
      name: 'Vanessa Coelho Braga',
      recordNumber: '#2288',
      plan: 'Particular',
      planType: 'Particular',
      statusBadge: 'Parcela 1/2 (R$ 900)',
      statusType: 'pending',
      ltv: 1800.0,
      lastDate: '05/09/2026',
      avatarUrl: DIRECT_IMAGES.patientClaudia,
      procedures: [
        { title: 'Infiltração guiada por ultrassom', detail: 'Parcela 1 quitada • 05/09/2026', value: 900.0 },
        { title: 'Parcela 2 em aberto', detail: 'Vence 05/10/2026', value: 900.0, isPending: true },
      ],
    },
    {
      id: 'op3',
      name: 'Otávio Menezes Rocha',
      recordNumber: '#2301',
      plan: 'Unimed Regional',
      planType: 'Convênio',
      statusBadge: 'Glosa R$ 480,00',
      statusType: 'glosa',
      ltv: 2240.0,
      lastDate: '02/09/2026',
      avatarUrl: DIRECT_IMAGES.patientJulio,
      glosaDetail: {
        code: '1407',
        reason: 'Divergência entre código do procedimento e laudo anexado.',
        deadlineDays: 7,
        amount: 480.0,
      },
      procedures: [
        { title: 'Densitometria óssea', detail: 'Guia glosada • Protocolo #7712', value: 480.0, isPending: true },
        { title: 'Consulta ortopédica', detail: 'Liquidado pela operadora • 02/09/2026', value: 380.0 },
      ],
    },
  ],
  transactions: [],
};

const BEM_ESTAR_PROFESSIONALS: Professional[] = [
  {
    id: 'be-1',
    name: 'Dra. Sofia Nakamura',
    email: 'sofia.nakamura@bemestarmed.com.br',
    role: 'Sócio Administrador',
    specialty: 'Dermatologia Clínica',
    crm: '104.556-SP',
    rqe: '7729',
    financialScope: 'Faturamento Total - Irrestrito',
    status: 'Ativo',
    initials: 'SN',
    color: 'purple',
    repassePercent: 60,
    lastAudit: 'Hoje, 07:55',
  },
  {
    id: 'be-2',
    name: 'Dr. Tiago Belmonte',
    email: 'tiago.belmonte@bemestarmed.com.br',
    role: 'Médico Credenciado',
    specialty: 'Endocrinologia',
    crm: '156.043-SP',
    financialScope: 'Apenas Produção Própria - Restrito',
    status: 'Ativo',
    initials: 'TB',
    color: 'teal',
    repassePercent: 65,
    lastAudit: '10/09/2026',
  },
  {
    id: 'be-3',
    name: 'Rafael Duarte',
    email: 'rafael.duarte@bemestarmed.com.br',
    role: 'Recepção / Faturamento',
    specialty: 'Atendimento e faturamento',
    financialScope: 'Lançamento de Contas e Recibos',
    status: 'Pendente',
    initials: 'RD',
    color: 'blue',
    lastAudit: 'Convite enviado',
  },
];

const CLINICA_BEM_ESTAR: Clinic = {
  id: 'bem-estar',
  shortName: 'Bem-Estar',
  segment: 'Multiespecialidade',
  config: {
    name: 'Centro Médico Bem-Estar',
    unit: 'Unidade Bem-Estar • Sede',
    cnpj: '33.907.415/0001-52',
    subdomain: 'bemestar.medicigma.app',
    logoUrl: DIRECT_IMAGES.logoMedFinance,
    primaryColor: '#0891B2',
    primaryColorName: 'Ciano Bem-Estar',
    isWhiteLabelActive: false,
  },
  professionals: BEM_ESTAR_PROFESSIONALS,
  patients: [
    {
      id: 'bp1',
      name: 'Luciana Terra Ramos',
      recordNumber: '#5510',
      plan: 'Particular',
      planType: 'Particular',
      statusBadge: 'Em Dia',
      statusType: 'settled',
      ltv: 3260.0,
      lastDate: '15/09/2026',
      avatarUrl: DIRECT_IMAGES.patientBeatriz,
      procedures: [
        { title: 'Protocolo dermatológico completo', detail: 'Pix • 15/09/2026', value: 1860.0 },
        { title: 'Retorno e manutenção', detail: 'Cartão 2x • 01/08/2026', value: 1400.0 },
      ],
    },
    {
      id: 'bp2',
      name: 'Eduardo Pinheiro Sales',
      recordNumber: '#5527',
      plan: 'SulAmérica Direto',
      planType: 'Convênio',
      statusBadge: 'Aguardando convênio',
      statusType: 'pending',
      ltv: 980.0,
      lastDate: '11/09/2026',
      avatarUrl: DIRECT_IMAGES.doctorRoberto,
      procedures: [
        { title: 'Consulta endocrinológica', detail: 'Guia TISS #55210 • 11/09/2026', value: 520.0, isPending: true },
        { title: 'Exames laboratoriais', detail: 'Liquidado • 11/09/2026', value: 460.0 },
      ],
    },
    {
      id: 'bp3',
      name: 'Marina Castelo Bruno',
      recordNumber: '#5533',
      plan: 'Particular',
      planType: 'Particular',
      statusBadge: 'Parcela 3/4 (R$ 420)',
      statusType: 'pending',
      ltv: 1680.0,
      lastDate: '08/09/2026',
      avatarUrl: DIRECT_IMAGES.receptionCamila,
      procedures: [
        { title: 'Tratamento estético clínico', detail: 'Parcela 3 em aberto • Venc. 25/09', value: 420.0, isPending: true },
        { title: 'Parcelas 1 e 2 quitadas', detail: 'Cartão • 08/07 e 08/08/2026', value: 840.0 },
      ],
    },
  ],
  transactions: [],
};

/** Transações em destaque das clínicas 2 e 3 — o mês corrente que aparece nas listas. */
const ORTO_DESTAQUE: Transaction[] = [
  {
    id: 'otx-1', title: 'Artroscopia — Renato Aguiar', subtitle: 'Amil Linha Azul • Guia #44120',
    category: 'Procedimento Cirúrgico', type: 'receita', amount: 2600.0, date: 'Hoje, 09:15',
    isoDate: '2026-09-17', status: 'Liquidado', method: 'TISS', badgeLabel: 'Liquidado', professionalId: 'orto-1',
  },
  {
    id: 'otx-2', title: 'Infiltração guiada — Vanessa Coelho', subtitle: 'Particular • Parcela 1/2',
    category: 'Procedimento Ambulatorial', type: 'receita', amount: 900.0, date: 'Ontem, 14:40',
    isoDate: '2026-09-16', status: 'Liquidado', method: 'Cartão', badgeLabel: 'Liquidado', professionalId: 'orto-2',
  },
  {
    id: 'otx-3', title: 'Glosa densitometria — lote #7712', subtitle: 'Unimed Regional • código 1407',
    category: 'Recurso TISS', type: 'receita', amount: 480.0, date: 'Prazo: 7 dias',
    isoDate: '2026-09-12', status: 'Glosa', method: 'TISS', glosaCode: '1407', deadline: '7 dias',
    badgeLabel: 'Em Análise TISS', professionalId: 'orto-1',
  },
  {
    id: 'otx-4', title: 'Locação de sala cirúrgica', subtitle: 'Hospital parceiro • setembro',
    category: 'Ocupação', type: 'despesa', amount: -3800.0, date: 'Vence 28/09/2026',
    isoDate: '2026-09-28', status: 'Pendente', method: 'Boleto', badgeLabel: 'Boleto',
  },
  {
    id: 'otx-5', title: 'Fisioterapia — pacote 10 sessões', subtitle: 'Renato Aguiar • liquidado',
    category: 'Reabilitação', type: 'receita', amount: 1520.0, date: '20/08/2026',
    isoDate: '2026-08-20', status: 'Liquidado', method: 'Pix', badgeLabel: 'Liquidado', professionalId: 'orto-2',
  },
];

const BEM_ESTAR_DESTAQUE: Transaction[] = [
  {
    id: 'btx-1', title: 'Protocolo dermatológico — Luciana Terra', subtitle: 'Particular • Pix à vista',
    category: 'Procedimento Estético', type: 'receita', amount: 1860.0, date: 'Ontem, 11:20',
    isoDate: '2026-09-16', status: 'Liquidado', method: 'Pix', badgeLabel: 'Liquidado', professionalId: 'be-1',
  },
  {
    id: 'btx-2', title: 'Consulta endocrinológica — Eduardo Pinheiro', subtitle: 'SulAmérica Direto • Guia #55210',
    category: 'Convênio TISS', type: 'receita', amount: 520.0, date: 'Prev. 30/09/2026',
    isoDate: '2026-09-30', status: 'Pendente', method: 'TISS', xmlTag: true,
    badgeLabel: 'Pendente Convênio', professionalId: 'be-2',
  },
  {
    id: 'btx-3', title: 'Parcela 3/4 — Marina Castelo', subtitle: 'Particular • vence 25/09',
    category: 'Consulta Particular', type: 'receita', amount: 420.0, date: 'Vence 25/09/2026',
    isoDate: '2026-09-25', status: 'Pendente', method: 'Cartão', badgeLabel: 'A receber', professionalId: 'be-1',
  },
  {
    id: 'btx-4', title: 'Software de agenda e prontuário', subtitle: 'Assinatura mensal',
    category: 'Tecnologia', type: 'despesa', amount: -740.0, date: 'Pago 05/09/2026',
    isoDate: '2026-09-05', status: 'Pago', method: 'Cartão', badgeLabel: 'Pago',
  },
  {
    id: 'btx-5', title: 'Insumos dermatológicos', subtitle: 'Fornecedor homologado',
    category: 'Insumos', type: 'despesa', amount: -2180.0, date: 'Vence 30/09/2026',
    isoDate: '2026-09-30', status: 'Pendente', method: 'Boleto', badgeLabel: 'Boleto',
  },
];

CLINICA_ORTO.transactions = [...ORTO_DESTAQUE, ...buildHistory(202, ORTO_PROFESSIONALS)];
CLINICA_BEM_ESTAR.transactions = [...BEM_ESTAR_DESTAQUE, ...buildHistory(303, BEM_ESTAR_PROFESSIONALS)];

export const CLINICS: Clinic[] = [CLINICA_CARDIO, CLINICA_ORTO, CLINICA_BEM_ESTAR];

export const getClinic = (id: string): Clinic =>
  CLINICS.find((c) => c.id === id) ?? CLINICS[0];

/**
 * Contas da demonstração. Não é autenticação de verdade: a checagem acontece no
 * navegador e as senhas estão aqui no código. Serve para mostrar o isolamento
 * entre clientes, não para proteger nada.
 */
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'u-escritorio',
    login: 'contador',
    password: 'demo',
    name: 'Ana Ribeiro',
    role: 'escritorio',
    roleLabel: 'Contabilidade Horizonte • Sócia',
    initials: 'AR',
    clinicIds: CLINICS.map((c) => c.id),
    description: 'Enxerga as três clínicas-clientes e alterna entre elas.',
  },
  {
    id: 'u-clinica',
    login: 'clinica',
    password: 'demo',
    name: 'Dr. Marcos Vinicius',
    role: 'clinica',
    roleLabel: 'Clínica Cardio Vida • Sócio Administrador',
    avatarUrl: DIRECT_IMAGES.doctorMarcos,
    clinicIds: ['cardio-vida'],
    professionalId: 'prof-2',
    description: 'Vê apenas a própria clínica, com faturamento completo.',
  },
  {
    id: 'u-medico',
    login: 'medico',
    password: 'demo',
    name: 'Dra. Isabella Silva',
    role: 'medico',
    roleLabel: 'Clínica Cardio Vida • Médica associada',
    avatarUrl: DIRECT_IMAGES.avatarIsabella,
    clinicIds: ['cardio-vida'],
    professionalId: 'prof-1',
    description: 'Vê somente a produção e os repasses dela.',
  },
];

export const findUser = (login: string, password: string): DemoUser | undefined =>
  DEMO_USERS.find(
    (u) => u.login.toLowerCase() === login.trim().toLowerCase() && u.password === password
  );

export const getUserById = (id: string): DemoUser | undefined =>
  DEMO_USERS.find((u) => u.id === id);
