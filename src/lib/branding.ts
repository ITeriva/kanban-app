export const appBrand = {
  name: "Ops Board",
  contextLabel: "Operação da squad de TI",
  workspaceLabel: "Squad de TI",
  description:
    "Plataforma interna para gestão de projetos, tarefas, sprints e fluxos operacionais da squad de TI.",
  summary:
    "Projetos internos, backlog, sprints e documentação operacional em um só lugar.",
  accessDomain: "kanban.app",
  storageNamespace: "ops-board",
  defaultUserTitle: "Squad de TI",
  bootstrapAdminTitle: "Admin da plataforma",
} as const;

export function buildPlatformEmail(localBase: string) {
  return `${localBase}@${appBrand.accessDomain}`;
}
