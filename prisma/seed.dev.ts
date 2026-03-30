import {
  FlowchartScopeType,
  FlowchartType,
  PrismaClient,
  ProjectRole,
  ProjectStatus,
  ProjectVisibility,
  SprintStatus,
  TaskPriority,
  TaskStatus,
  TaskVisibility,
} from "@prisma/client";
import { addDays, subDays } from "date-fns";
import { demoUsers, SEED_DEFAULT_PASSWORD } from "../src/lib/demo-users";
import {
  createFlowchartEdge,
  createFlowchartNode,
  type FlowchartContent,
} from "../src/lib/flowcharts";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

type TaskSeedSpec = {
  code: string;
  projectSlug: string;
  sprintName?: string;
  creatorEmail: string;
  title: string;
  summary: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: TaskVisibility;
  estimatePoints: number;
  startOffsetDays: number;
  dueOffsetDays: number;
  completedOffsetDays?: number;
  assignees: string[];
  tags: string[];
  checklist: Array<{
    content: string;
    done: boolean;
  }>;
  comments: Array<{
    authorEmail: string;
    content: string;
  }>;
  history: Array<{
    actorEmail: string;
    type: string;
    description: string;
  }>;
  dependencyCodes?: string[];
};

const teamSpecs = [
  {
    name: "Produto & Fluxos",
    slug: "produto-fluxos",
    summary: "Responsável pela experiência, navegação e clareza operacional da plataforma.",
    focus: "Fluxos internos, páginas e consistência visual.",
    members: [
      { email: "marina@kanban.app", isLead: true },
      { email: "ana.rocha@kanban.app", isLead: false },
      { email: "leonardo@kanban.app", isLead: false },
    ],
  },
  {
    name: "Engenharia de Plataforma",
    slug: "engenharia",
    summary: "Implementação full-stack, integrações e qualidade técnica da plataforma interna.",
    focus: "Next.js, Prisma, autenticação e entrega contínua.",
    members: [
      { email: "leonardo@kanban.app", isLead: true },
      { email: "bruno@kanban.app", isLead: false },
      { email: "caio@kanban.app", isLead: false },
      { email: "fernanda@kanban.app", isLead: false },
    ],
  },
  {
    name: "Operações & Indicadores",
    slug: "dados-planejamento",
    summary: "Métricas, agenda operacional, painéis e leitura de andamento da squad.",
    focus: "Calendário, dashboard e acompanhamento gerencial.",
    members: [
      { email: "gabriel@kanban.app", isLead: true },
      { email: "rafaela@kanban.app", isLead: false },
      { email: "marina@kanban.app", isLead: false },
      { email: "helena@kanban.app", isLead: false },
    ],
  },
] as const;

const projectSpecs = [
  {
    name: "Ops Board Core",
    slug: "ops-board-core",
    summary: "Plataforma principal que consolida projetos, tarefas, equipes e calendário.",
    description:
      "Projeto central do produto. Reúne a shell do app, regras de acesso e visão operacional da squad.",
    status: ProjectStatus.ACTIVE,
    visibility: ProjectVisibility.WORKSPACE,
    ownerEmail: "leonardo@kanban.app",
    teamSlug: "engenharia",
    startOffsetDays: -24,
    dueOffsetDays: 55,
    members: [
      { email: "leonardo@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "marina@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "ana.rocha@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "bruno@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "caio@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "fernanda@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "gabriel@kanban.app", role: ProjectRole.PROJECT_VIEWER },
      { email: "helena@kanban.app", role: ProjectRole.PROJECT_VIEWER },
    ],
  },
  {
    name: "Painel Operacional",
    slug: "painel-entregas",
    summary: "Visão de métricas, leitura gerencial e acompanhamento por sprint.",
    description:
      "Área dedicada ao dashboard de evolução, indicadores da operação e síntese para gestão.",
    status: ProjectStatus.ACTIVE,
    visibility: ProjectVisibility.PROJECT_MEMBERS,
    ownerEmail: "marina@kanban.app",
    teamSlug: "dados-planejamento",
    startOffsetDays: -18,
    dueOffsetDays: 35,
    members: [
      { email: "marina@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "gabriel@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "bruno@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "fernanda@kanban.app", role: ProjectRole.PROJECT_VIEWER },
      { email: "helena@kanban.app", role: ProjectRole.PROJECT_VIEWER },
    ],
  },
  {
    name: "Agenda da Squad",
    slug: "agenda-squad",
    summary: "Organização da agenda operacional, marcos internos e janelas de entrega.",
    description:
      "Projeto mais enxuto para consolidar rituais, checkpoints e visão mensal da operação.",
    status: ProjectStatus.PLANNING,
    visibility: ProjectVisibility.PROJECT_MEMBERS,
    ownerEmail: "gabriel@kanban.app",
    teamSlug: "dados-planejamento",
    startOffsetDays: -7,
    dueOffsetDays: 42,
    members: [
      { email: "gabriel@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "rafaela@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "ana.rocha@kanban.app", role: ProjectRole.PROJECT_MEMBER },
      { email: "marina@kanban.app", role: ProjectRole.PROJECT_VIEWER },
      { email: "helena@kanban.app", role: ProjectRole.PROJECT_VIEWER },
    ],
  },
  {
    name: "Governança de Entregas",
    slug: "governanca-entregas",
    summary: "Gestão de riscos, alinhamentos estratégicos e preparo de rollout.",
    description:
      "Espaço reservado para lideranças e gestão acompanharem riscos, checklists críticos e decisões operacionais.",
    status: ProjectStatus.ACTIVE,
    visibility: ProjectVisibility.LEADERS_ONLY,
    ownerEmail: "leonardo@kanban.app",
    teamSlug: "produto-fluxos",
    startOffsetDays: -10,
    dueOffsetDays: 25,
    members: [
      { email: "leonardo@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "marina@kanban.app", role: ProjectRole.PROJECT_MANAGER },
      { email: "helena@kanban.app", role: ProjectRole.PROJECT_VIEWER },
    ],
  },
] as const;

const sprintSpecs = [
  {
    projectSlug: "ops-board-core",
    name: "Sprint Fundação da Plataforma",
    goal: "Consolidar arquitetura, autenticação e base de dados.",
    status: SprintStatus.COMPLETED,
    startOffsetDays: -24,
    endOffsetDays: -11,
  },
  {
    projectSlug: "ops-board-core",
    name: "Sprint Operação Inicial",
    goal: "Subir shell do produto, páginas base e seed de validação.",
    status: SprintStatus.ACTIVE,
    startOffsetDays: -10,
    endOffsetDays: 4,
  },
  {
    projectSlug: "painel-entregas",
    name: "Sprint Indicadores Operacionais",
    goal: "Entregar cards, gráfico de status e visão gerencial.",
    status: SprintStatus.ACTIVE,
    startOffsetDays: -6,
    endOffsetDays: 8,
  },
  {
    projectSlug: "agenda-squad",
    name: "Sprint Agenda Integrada",
    goal: "Organizar visão mensal e marcos internos prioritários.",
    status: SprintStatus.PLANNED,
    startOffsetDays: 2,
    endOffsetDays: 16,
  },
] as const;

const tagSpecs = [
  { name: "Arquitetura", color: "#8b5cf6" },
  { name: "Frontend", color: "#38bdf8" },
  { name: "Backend", color: "#f97316" },
  { name: "Dados", color: "#22c55e" },
  { name: "Documentação", color: "#f59e0b" },
  { name: "Planejamento", color: "#ec4899" },
] as const;

const boardColumns = [
  { name: "Backlog", position: 0, taskStatus: TaskStatus.BACKLOG },
  { name: "A fazer", position: 1, taskStatus: TaskStatus.TODO },
  { name: "Em andamento", position: 2, taskStatus: TaskStatus.IN_PROGRESS },
  { name: "Em revisão", position: 3, taskStatus: TaskStatus.REVIEW },
  { name: "Concluído", position: 4, taskStatus: TaskStatus.DONE },
] as const;

const taskSpecs: TaskSeedSpec[] = [
  {
    code: "OPS-001",
    projectSlug: "ops-board-core",
    sprintName: "Sprint Fundação da Plataforma",
    creatorEmail: "leonardo@kanban.app",
    title: "Definir arquitetura simplificada da plataforma",
    summary: "Fechar estrutura sem multi-tenant e responsabilidades por camada.",
    description:
      "Mapear o domínio final do produto, remover abstrações desnecessárias e documentar as decisões que sustentam a plataforma interna.",
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 5,
    startOffsetDays: -23,
    dueOffsetDays: -18,
    completedOffsetDays: -18,
    assignees: ["leonardo@kanban.app", "marina@kanban.app"],
    tags: ["Arquitetura", "Planejamento"],
    checklist: [
      { content: "Eliminar conceitos de tenant e workspace dinâmico", done: true },
      { content: "Definir entidades da plataforma", done: true },
      { content: "Aprovar direção da arquitetura com a squad", done: true },
    ],
    comments: [
      {
        authorEmail: "marina@kanban.app",
        content: "A simplificação deixou o fluxo mais claro para evolução e operação contínua.",
      },
    ],
    history: [
      {
        actorEmail: "leonardo@kanban.app",
        type: "created",
        description: "Criou a tarefa para consolidar o escopo técnico da plataforma.",
      },
      {
        actorEmail: "marina@kanban.app",
        type: "completed",
        description: "Validou a arquitetura final e marcou a tarefa como concluída.",
      },
    ],
  },
  {
    code: "OPS-002",
    projectSlug: "ops-board-core",
    sprintName: "Sprint Operação Inicial",
    creatorEmail: "leonardo@kanban.app",
    title: "Modelar schema Prisma sem multi-tenant",
    summary: "Representar usuários, projetos, sprints, board e tarefas no PostgreSQL.",
    description:
      "Criar um schema simples, coeso e preparado para seed e autenticação básica.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.URGENT,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 8,
    startOffsetDays: -9,
    dueOffsetDays: 2,
    assignees: ["caio@kanban.app", "leonardo@kanban.app"],
    tags: ["Backend", "Arquitetura"],
    checklist: [
      { content: "Criar enums de roles e visibilidade", done: true },
      { content: "Modelar relações principais do domínio", done: true },
      { content: "Revisar integridade e índices principais", done: false },
    ],
    comments: [
      {
        authorEmail: "caio@kanban.app",
        content: "Os relacionamentos estão prontos, faltam apenas os ajustes finos de migração.",
      },
    ],
    history: [
      {
        actorEmail: "leonardo@kanban.app",
        type: "created",
        description: "Abriu a tarefa para estruturar o banco do projeto.",
      },
      {
        actorEmail: "caio@kanban.app",
        type: "status_changed",
        description: "Moveu a tarefa para em andamento durante a sprint atual.",
      },
    ],
    dependencyCodes: ["OPS-001"],
  },
  {
    code: "OPS-003",
    projectSlug: "ops-board-core",
    sprintName: "Sprint Operação Inicial",
    creatorEmail: "marina@kanban.app",
    title: "Montar shell inicial do dashboard",
    summary: "Criar layout lateral, páginas base e visual corporativo escuro.",
    description:
      "Estruturar a navegação principal do app com MUI e uma experiência consistente entre dashboard, projetos e tarefas.",
    status: TaskStatus.REVIEW,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 5,
    startOffsetDays: -8,
    dueOffsetDays: 1,
    assignees: ["bruno@kanban.app", "ana.rocha@kanban.app"],
    tags: ["Frontend", "Planejamento"],
    checklist: [
      { content: "Definir navegação lateral", done: true },
      { content: "Criar componentes reutilizáveis de página", done: true },
      { content: "Validar linguagem visual da plataforma", done: false },
    ],
    comments: [
      {
        authorEmail: "ana.rocha@kanban.app",
        content: "A direção está boa. Quero revisar o tratamento dos cards antes de fechar.",
      },
    ],
    history: [
      {
        actorEmail: "marina@kanban.app",
        type: "created",
        description: "Criou a estrutura inicial da tarefa de UI.",
      },
      {
        actorEmail: "bruno@kanban.app",
        type: "status_changed",
        description: "Enviou a shell para revisão após fechar a navegação base.",
      },
    ],
    dependencyCodes: ["OPS-002"],
  },
  {
    code: "OPS-004",
    projectSlug: "ops-board-core",
    sprintName: "Sprint Operação Inicial",
    creatorEmail: "fernanda@kanban.app",
    title: "Configurar seed com dados reais da squad",
    summary: "Popular o ambiente com dados úteis para validar a aplicação.",
    description:
      "Criar seed contendo usuários, times, projetos, sprints, tarefas, comentários e checklist com contexto operacional real.",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 3,
    startOffsetDays: -4,
    dueOffsetDays: 3,
    assignees: ["fernanda@kanban.app", "gabriel@kanban.app"],
    tags: ["Dados", "Documentação"],
    checklist: [
      { content: "Definir 9 usuários e roles", done: true },
      { content: "Criar projetos e sprints de validação", done: false },
      { content: "Revisar tarefas e comentários gerados", done: false },
    ],
    comments: [
      {
        authorEmail: "gabriel@kanban.app",
        content: "Assim que o schema estabilizar eu fecho a base de dados de validação.",
      },
    ],
    history: [
      {
        actorEmail: "fernanda@kanban.app",
        type: "created",
        description: "Criou a tarefa para garantir um seed rico para validação do produto.",
      },
    ],
    dependencyCodes: ["OPS-002"],
  },
  {
    code: "OPS-005",
    projectSlug: "painel-entregas",
    sprintName: "Sprint Indicadores Operacionais",
    creatorEmail: "marina@kanban.app",
    title: "Criar cards de métricas de entrega",
    summary: "Exibir volume de tarefas, andamento e ritmo de sprint no dashboard.",
    description:
      "Montar visão executiva simples com indicadores que mostrem progresso da operação e gargalos da sprint.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 5,
    startOffsetDays: -5,
    dueOffsetDays: 5,
    assignees: ["gabriel@kanban.app", "bruno@kanban.app"],
    tags: ["Dados", "Frontend"],
    checklist: [
      { content: "Definir indicadores principais", done: true },
      { content: "Criar gráfico de status por tarefa", done: false },
      { content: "Ajustar leitura para gestão", done: false },
    ],
    comments: [
      {
        authorEmail: "gabriel@kanban.app",
        content: "Já tenho os números agregados, falta finalizar a apresentação na UI.",
      },
    ],
    history: [
      {
        actorEmail: "marina@kanban.app",
        type: "created",
        description: "Abriu o trabalho para fechar a visão analítica da operação.",
      },
      {
        actorEmail: "gabriel@kanban.app",
        type: "status_changed",
        description: "Iniciou a construção do painel de métricas.",
      },
    ],
    dependencyCodes: ["OPS-004"],
  },
  {
    code: "OPS-006",
    projectSlug: "painel-entregas",
    sprintName: "Sprint Indicadores Operacionais",
    creatorEmail: "marina@kanban.app",
    title: "Ajustar leitura gerencial do painel",
    summary: "Refinar a experiência de acompanhamento com linguagem mais executiva.",
    description:
      "Reduzir ruído operacional e priorizar uma leitura clara para gestão acompanhar decisões e risco.",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    visibility: TaskVisibility.ASSIGNEES,
    estimatePoints: 3,
    startOffsetDays: -2,
    dueOffsetDays: 7,
    assignees: ["marina@kanban.app", "helena@kanban.app"],
    tags: ["Planejamento", "Dados"],
    checklist: [
      { content: "Reduzir termos técnicos nas métricas", done: false },
      { content: "Destacar próximos marcos", done: false },
    ],
    comments: [
      {
        authorEmail: "helena@kanban.app",
        content: "Quero uma visão rápida de avanço, riscos e próximos passos.",
      },
    ],
    history: [
      {
        actorEmail: "marina@kanban.app",
        type: "created",
        description: "Criou a tarefa após feedback gerencial sobre o painel.",
      },
    ],
    dependencyCodes: ["OPS-005"],
  },
  {
    code: "OPS-007",
    projectSlug: "agenda-squad",
    sprintName: "Sprint Agenda Integrada",
    creatorEmail: "gabriel@kanban.app",
    title: "Consolidar agenda da squad e sprints",
    summary: "Juntar marcos operacionais com o plano interno da squad.",
    description:
      "Criar uma agenda única que conecte rituais, checkpoints internos e entregas do produto.",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 5,
    startOffsetDays: 1,
    dueOffsetDays: 10,
    assignees: ["rafaela@kanban.app", "gabriel@kanban.app"],
    tags: ["Planejamento", "Dados"],
    checklist: [
      { content: "Mapear datas dos rituais internos", done: false },
      { content: "Cruzar cronograma do produto com marcos operacionais", done: false },
      { content: "Publicar visão mensal inicial", done: false },
    ],
    comments: [
      {
        authorEmail: "rafaela@kanban.app",
        content: "Já levantei os eventos fixos, vou amarrar com as sprints da squad.",
      },
    ],
    history: [
      {
        actorEmail: "gabriel@kanban.app",
        type: "created",
        description: "Abriu a frente de calendário para integrar datas críticas.",
      },
    ],
    dependencyCodes: ["OPS-004"],
  },
  {
    code: "OPS-008",
    projectSlug: "agenda-squad",
    sprintName: "Sprint Agenda Integrada",
    creatorEmail: "ana.rocha@kanban.app",
    title: "Desenhar visão mensal do calendário",
    summary: "Estruturar um calendário simples, elegante e consistente com o dashboard.",
    description:
      "Criar a visualização mensal do calendário preservando a linguagem visual do produto e a leitura rápida.",
    status: TaskStatus.BACKLOG,
    priority: TaskPriority.MEDIUM,
    visibility: TaskVisibility.PROJECT,
    estimatePoints: 3,
    startOffsetDays: 4,
    dueOffsetDays: 14,
    assignees: ["ana.rocha@kanban.app"],
    tags: ["Frontend", "Planejamento"],
    checklist: [
      { content: "Definir grid mensal", done: false },
      { content: "Tratar eventos e prazos no mesmo componente", done: false },
    ],
    comments: [],
    history: [
      {
        actorEmail: "ana.rocha@kanban.app",
        type: "created",
        description: "Criou a ideia de UI para a futura visão mensal.",
      },
    ],
    dependencyCodes: ["OPS-007"],
  },
  {
    code: "OPS-009",
    projectSlug: "governanca-entregas",
    creatorEmail: "leonardo@kanban.app",
    title: "Preparar checklist de rollout interno",
    summary: "Consolidar entregáveis, materiais e revisões necessárias para publicação interna.",
    description:
      "Organizar os itens críticos de rollout em uma checklist visível apenas para lideranças e gestão.",
    status: TaskStatus.TODO,
    priority: TaskPriority.URGENT,
    visibility: TaskVisibility.LEADERS_ONLY,
    estimatePoints: 5,
    startOffsetDays: -1,
    dueOffsetDays: 12,
    assignees: ["leonardo@kanban.app", "marina@kanban.app"],
    tags: ["Documentação", "Planejamento"],
    checklist: [
      { content: "Revisar roteiro de rollout", done: false },
      { content: "Fechar materiais de suporte", done: false },
      { content: "Validar narrativa do produto", done: false },
    ],
    comments: [
      {
        authorEmail: "helena@kanban.app",
        content: "Quero acompanhar os itens críticos, mas sem misturar com as tarefas operacionais.",
      },
    ],
    history: [
      {
        actorEmail: "leonardo@kanban.app",
        type: "created",
        description: "Criou uma checklist restrita para a preparação do rollout.",
      },
    ],
    dependencyCodes: ["OPS-010"],
  },
  {
    code: "OPS-010",
    projectSlug: "governanca-entregas",
    creatorEmail: "marina@kanban.app",
    title: "Revisar riscos e plano de contingência",
    summary: "Atualizar riscos do projeto e respostas para atrasos ou bloqueios.",
    description:
      "Levantar riscos de prazo, integração e apresentação, com uma resposta simples para cada cenário.",
    status: TaskStatus.REVIEW,
    priority: TaskPriority.HIGH,
    visibility: TaskVisibility.LEADERS_ONLY,
    estimatePoints: 3,
    startOffsetDays: -6,
    dueOffsetDays: 6,
    assignees: ["leonardo@kanban.app"],
    tags: ["Arquitetura", "Planejamento"],
    checklist: [
      { content: "Listar riscos por frente", done: true },
      { content: "Definir responsáveis", done: true },
      { content: "Validar plano com gestão", done: false },
    ],
    comments: [
      {
        authorEmail: "marina@kanban.app",
        content: "A base está pronta. Falta alinhar os riscos mais críticos com a gestão.",
      },
    ],
    history: [
      {
        actorEmail: "marina@kanban.app",
        type: "created",
        description: "Criou a revisão de riscos para a frente de governança.",
      },
      {
        actorEmail: "leonardo@kanban.app",
        type: "status_changed",
        description: "Moveu a tarefa para revisão após consolidar o plano inicial.",
      },
    ],
  },
];

const projectFlowchartSpecs: Array<{
  projectSlug: string;
  creatorEmail: string;
  name: string;
  description: string;
  content: FlowchartContent;
}> = [
  {
    projectSlug: "ops-board-core",
    creatorEmail: "marina@kanban.app",
    name: "Fluxo de entrega da plataforma",
    description: "Visão manual do caminho entre arquitetura, implementação, revisão e seed de validação.",
    content: {
      nodes: [
        {
          ...createFlowchartNode({
            type: "SWIMLANE",
            label: "Produto & UX",
            color: "violet",
            position: { x: 60, y: 60 },
            size: { width: 300, height: 520 },
          }),
          id: "lane-mvp-produto",
        },
        {
          ...createFlowchartNode({
            type: "SWIMLANE",
            label: "Engenharia",
            color: "violet",
            position: { x: 390, y: 60 },
            size: { width: 300, height: 520 },
          }),
          id: "lane-mvp-engenharia",
        },
        {
          ...createFlowchartNode({
            type: "START_END",
            label: "Escopo aprovado",
            color: "gold",
            position: { x: 100, y: 120 },
          }),
          id: "node-mvp-start",
        },
        {
          ...createFlowchartNode({
            type: "PROCESS",
            label: "Desenhar arquitetura simplificada",
            color: "slate",
            position: { x: 100, y: 260 },
          }),
          id: "node-mvp-brief",
        },
        {
          ...createFlowchartNode({
            type: "SUBPROCESS",
            label: "Implementar módulo full-stack",
            color: "slate",
            position: { x: 430, y: 260 },
          }),
          id: "node-mvp-build",
        },
        {
          ...createFlowchartNode({
            type: "DECISION",
            label: "Revisao visual aprovada?",
            color: "violet",
            position: { x: 450, y: 430 },
          }),
          id: "node-mvp-review",
        },
        {
          ...createFlowchartNode({
            type: "DOCUMENT",
            label: "Seed e roteiro de rollout",
            color: "mint",
            position: { x: 760, y: 260 },
          }),
          id: "node-mvp-seed",
        },
      ],
      edges: [
        {
          ...createFlowchartEdge({
            source: "node-mvp-start",
            target: "node-mvp-brief",
          }),
          id: "edge-mvp-0",
        },
        {
          ...createFlowchartEdge({
            source: "node-mvp-brief",
            target: "node-mvp-build",
          }),
          id: "edge-mvp-1",
        },
        {
          ...createFlowchartEdge({
            source: "node-mvp-build",
            target: "node-mvp-review",
          }),
          id: "edge-mvp-2",
        },
        {
          ...createFlowchartEdge({
            source: "node-mvp-review",
            target: "node-mvp-seed",
            label: "Sim",
            accent: "gold",
          }),
          id: "edge-mvp-3",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 0.76 },
    },
  },
  {
    projectSlug: "painel-entregas",
    creatorEmail: "gabriel@kanban.app",
    name: "Leitura gerencial do painel",
    description: "Diagrama manual para explicar como os dados chegam à visão gerencial do painel.",
    content: {
      nodes: [
        {
          ...createFlowchartNode({
            type: "DATA_IO",
            label: "Tarefas e sprints",
            color: "gold",
            position: { x: 100, y: 100 },
          }),
          id: "node-metricas-tarefas",
        },
        {
          ...createFlowchartNode({
            type: "PROCESS",
            label: "Agregacao de indicadores",
            color: "slate",
            position: { x: 400, y: 100 },
          }),
          id: "node-metricas-agregacao",
        },
        {
          ...createFlowchartNode({
            type: "DOCUMENT",
            label: "Cards de progresso",
            color: "mint",
            position: { x: 720, y: 60 },
          }),
          id: "node-metricas-cards",
        },
        {
          ...createFlowchartNode({
            type: "TEXT",
            label: "Alertas e gargalos para gestão",
            color: "rose",
            position: { x: 700, y: 220 },
          }),
          id: "node-metricas-alertas",
        },
      ],
      edges: [
        {
          ...createFlowchartEdge({
            source: "node-metricas-tarefas",
            target: "node-metricas-agregacao",
          }),
          id: "edge-metricas-1",
        },
        {
          ...createFlowchartEdge({
            source: "node-metricas-agregacao",
            target: "node-metricas-cards",
          }),
          id: "edge-metricas-2",
        },
        {
          ...createFlowchartEdge({
            source: "node-metricas-agregacao",
            target: "node-metricas-alertas",
            label: "Leitura executiva",
            lineStyle: "dashed",
            accent: "neutral",
          }),
          id: "edge-metricas-3",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 0.9 },
    },
  },
];

const taskFlowchartSpecs: Array<{
  taskCode: string;
  creatorEmail: string;
  name: string;
  description: string;
  content: FlowchartContent;
}> = [
  {
    taskCode: "OPS-002",
    creatorEmail: "caio@kanban.app",
    name: "Diagrama · OPS-002",
    description: "Recorte manual da modelagem do schema Prisma para a frente técnica.",
    content: {
      nodes: [
        {
          ...createFlowchartNode({
            type: "MANUAL_OPERATION",
            label: "Definir enums de role e visibilidade",
            color: "gold",
            position: { x: 100, y: 120 },
          }),
          id: "node-schema-enums",
        },
        {
          ...createFlowchartNode({
            type: "SUBPROCESS",
            label: "Modelar entidades principais",
            color: "slate",
            position: { x: 410, y: 120 },
          }),
          id: "node-schema-models",
        },
        {
          ...createFlowchartNode({
            type: "DOCUMENT",
            label: "Indices, migracao e seed",
            color: "violet",
            position: { x: 740, y: 120 },
          }),
          id: "node-schema-indexes",
        },
      ],
      edges: [
        {
          ...createFlowchartEdge({
            source: "node-schema-enums",
            target: "node-schema-models",
          }),
          id: "edge-schema-1",
        },
        {
          ...createFlowchartEdge({
            source: "node-schema-models",
            target: "node-schema-indexes",
          }),
          id: "edge-schema-2",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 0.92 },
    },
  },
];

const workspaceFlowchartSpecs: Array<{
  creatorEmail: string;
  name: string;
  description: string;
  content: FlowchartContent;
}> = [
  {
    creatorEmail: "leonardo@kanban.app",
    name: "Mapa geral do rollout",
    description: "Canvas solto para preparar narrativa, riscos e pontos de validação do rollout interno.",
    content: {
      nodes: [
        {
          ...createFlowchartNode({
            type: "START_END",
            label: "Rollout interno",
            color: "gold",
            position: { x: 120, y: 120 },
          }),
          id: "node-rollout-start",
        },
        {
          ...createFlowchartNode({
            type: "PROCESS",
            label: "Contextualizar operação e impacto",
            color: "slate",
            position: { x: 420, y: 120 },
          }),
          id: "node-rollout-contexto",
        },
        {
          ...createFlowchartNode({
            type: "DOCUMENT",
            label: "Mostrar plataforma em uso",
            color: "mint",
            position: { x: 760, y: 120 },
          }),
          id: "node-rollout-demo",
        },
        {
          ...createFlowchartNode({
            type: "NOTE",
            label: "Levar roteiro de validacao e dados seedados",
            color: "gold",
            position: { x: 760, y: 320 },
          }),
          id: "node-rollout-note",
        },
      ],
      edges: [
        {
          ...createFlowchartEdge({
            source: "node-rollout-start",
            target: "node-rollout-contexto",
          }),
          id: "edge-rollout-1",
        },
        {
          ...createFlowchartEdge({
            source: "node-rollout-contexto",
            target: "node-rollout-demo",
          }),
          id: "edge-rollout-2",
        },
        {
          ...createFlowchartEdge({
            source: "node-rollout-demo",
            target: "node-rollout-note",
            lineStyle: "dashed",
            accent: "gold",
          }),
          id: "edge-rollout-3",
        },
      ],
      viewport: { x: 0, y: 0, zoom: 0.88 },
    },
  },
];

async function resetDatabase() {
  await prisma.flowchart.deleteMany();
  await prisma.taskHistory.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.taskChecklistItem.deleteMany();
  await prisma.taskAssignee.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.taskTag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.boardColumn.deleteMany();
  await prisma.board.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

export async function main() {
  await resetDatabase();

  const passwordHash = await hashPassword(SEED_DEFAULT_PASSWORD);

  const users = new Map<string, { id: string; name: string }>();

  for (const user of demoUsers) {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        title: user.title,
        avatarColor: user.avatarColor,
      },
    });

    users.set(user.email, { id: created.id, name: created.name });
  }

  const teams = new Map<string, { id: string; name: string }>();

  for (const team of teamSpecs) {
    const createdTeam = await prisma.team.create({
      data: {
        name: team.name,
        slug: team.slug,
        summary: team.summary,
        focus: team.focus,
      },
    });

    teams.set(team.slug, { id: createdTeam.id, name: createdTeam.name });

    await prisma.teamMember.createMany({
      data: team.members.map((member) => ({
        teamId: createdTeam.id,
        userId: users.get(member.email)!.id,
        isLead: member.isLead,
      })),
    });
  }

  const projects = new Map<string, { id: string; name: string }>();

  for (const project of projectSpecs) {
    const createdProject = await prisma.project.create({
      data: {
        name: project.name,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        status: project.status,
        visibility: project.visibility,
        ownerId: users.get(project.ownerEmail)!.id,
        teamId: teams.get(project.teamSlug)?.id,
        startDate: subDays(new Date(), Math.abs(project.startOffsetDays)),
        dueDate: addDays(new Date(), project.dueOffsetDays),
      },
    });

    projects.set(project.slug, { id: createdProject.id, name: createdProject.name });

    await prisma.projectMember.createMany({
      data: project.members.map((member) => ({
        projectId: createdProject.id,
        userId: users.get(member.email)!.id,
        role: member.role,
      })),
    });
  }

  const sprints = new Map<string, { id: string; projectSlug: string }>();

  for (const sprint of sprintSpecs) {
    const createdSprint = await prisma.sprint.create({
      data: {
        name: sprint.name,
        goal: sprint.goal,
        status: sprint.status,
        projectId: projects.get(sprint.projectSlug)!.id,
        startDate:
          sprint.startOffsetDays < 0
            ? subDays(new Date(), Math.abs(sprint.startOffsetDays))
            : addDays(new Date(), sprint.startOffsetDays),
        endDate:
          sprint.endOffsetDays < 0
            ? subDays(new Date(), Math.abs(sprint.endOffsetDays))
            : addDays(new Date(), sprint.endOffsetDays),
      },
    });

    sprints.set(sprint.name, { id: createdSprint.id, projectSlug: sprint.projectSlug });
  }

  const columnsByProject = new Map<string, Map<TaskStatus, string>>();

  for (const project of projectSpecs) {
    const board = await prisma.board.create({
      data: {
        name: `${project.name} Board`,
        projectId: projects.get(project.slug)!.id,
        columns: {
          create: boardColumns.map((column) => ({
            name: column.name,
            position: column.position,
            taskStatus: column.taskStatus,
          })),
        },
      },
      include: {
        columns: true,
      },
    });

    columnsByProject.set(
      project.slug,
      new Map(board.columns.map((column) => [column.taskStatus, column.id])),
    );
  }

  const tags = new Map<string, string>();

  for (const tag of tagSpecs) {
    const createdTag = await prisma.tag.create({
      data: tag,
    });

    tags.set(tag.name, createdTag.id);
  }

  const createdTasks = new Map<string, { id: string; projectSlug: string; title: string }>();

  for (const task of taskSpecs) {
    const projectId = projects.get(task.projectSlug)!.id;
    const sprintId = task.sprintName ? sprints.get(task.sprintName)?.id : undefined;
    const boardColumnId = columnsByProject.get(task.projectSlug)?.get(task.status);

    const createdTask = await prisma.task.create({
      data: {
        code: task.code,
        title: task.title,
        summary: task.summary,
        description: task.description,
        status: task.status,
        priority: task.priority,
        visibility: task.visibility,
        estimatePoints: task.estimatePoints,
        projectId,
        sprintId,
        boardColumnId,
        creatorId: users.get(task.creatorEmail)!.id,
        startDate:
          task.startOffsetDays < 0
            ? subDays(new Date(), Math.abs(task.startOffsetDays))
            : addDays(new Date(), task.startOffsetDays),
        dueDate:
          task.dueOffsetDays < 0
            ? subDays(new Date(), Math.abs(task.dueOffsetDays))
            : addDays(new Date(), task.dueOffsetDays),
        completedAt:
          task.completedOffsetDays === undefined
            ? null
            : task.completedOffsetDays < 0
              ? subDays(new Date(), Math.abs(task.completedOffsetDays))
              : addDays(new Date(), task.completedOffsetDays),
        assignees: {
          create: task.assignees.map((email) => ({
            userId: users.get(email)!.id,
          })),
        },
        tags: {
          create: task.tags.map((name) => ({
            tagId: tags.get(name)!,
          })),
        },
        checklistItems: {
          create: task.checklist.map((item, index) => ({
            content: item.content,
            done: item.done,
            position: index,
          })),
        },
        comments: {
          create: task.comments.map((comment) => ({
            content: comment.content,
            authorId: users.get(comment.authorEmail)!.id,
          })),
        },
        historyEntries: {
          create: task.history.map((entry) => ({
            type: entry.type,
            description: entry.description,
            actorId: users.get(entry.actorEmail)!.id,
          })),
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    createdTasks.set(task.code, {
      id: createdTask.id,
      projectSlug: task.projectSlug,
      title: createdTask.title,
    });
  }

  for (const task of taskSpecs) {
    const currentTask = createdTasks.get(task.code);

    if (!currentTask || !task.dependencyCodes?.length) {
      continue;
    }

    for (const dependencyCode of task.dependencyCodes) {
      const dependencyTask = createdTasks.get(dependencyCode);

      if (!dependencyTask || dependencyTask.projectSlug !== currentTask.projectSlug) {
        continue;
      }

      await prisma.taskDependency.create({
        data: {
          taskId: currentTask.id,
          dependsOnTaskId: dependencyTask.id,
        },
      });
    }
  }

  for (const flowchart of projectFlowchartSpecs) {
    await prisma.flowchart.create({
      data: {
        name: flowchart.name,
        description: flowchart.description,
        type: FlowchartType.MANUAL,
        scopeType: FlowchartScopeType.PROJECT,
        projectId: projects.get(flowchart.projectSlug)!.id,
        createdById: users.get(flowchart.creatorEmail)!.id,
        contentJson: flowchart.content,
      },
    });
  }

  for (const flowchart of taskFlowchartSpecs) {
    await prisma.flowchart.create({
      data: {
        name: flowchart.name,
        description: flowchart.description,
        type: FlowchartType.MANUAL,
        scopeType: FlowchartScopeType.TASK,
        taskId: createdTasks.get(flowchart.taskCode)!.id,
        createdById: users.get(flowchart.creatorEmail)!.id,
        contentJson: flowchart.content,
      },
    });
  }

  for (const flowchart of workspaceFlowchartSpecs) {
    await prisma.flowchart.create({
      data: {
        name: flowchart.name,
        description: flowchart.description,
        type: FlowchartType.MANUAL,
        scopeType: FlowchartScopeType.WORKSPACE,
        createdById: users.get(flowchart.creatorEmail)!.id,
        contentJson: flowchart.content,
      },
    });
  }

  console.log("Seed finalizado.");
  console.log(`Usuários criados: ${demoUsers.length}`);
  console.log(`Senha padrão: ${SEED_DEFAULT_PASSWORD}`);
  await prisma.$disconnect();
}
