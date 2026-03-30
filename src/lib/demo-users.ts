import { GlobalRole } from "@prisma/client";
import { buildPlatformEmail } from "@/lib/branding";

export const SEED_DEFAULT_PASSWORD =
  process.env.SEED_DEFAULT_PASSWORD ?? "kanban2026";

export const demoUsers = [
  {
    name: "Leonardo Bouzan",
    email: buildPlatformEmail("leonardo"),
    role: GlobalRole.ADMIN,
    title: "Coordenador de operações",
    avatarColor: "#2563eb",
  },
  {
    name: "Marina Costa",
    email: buildPlatformEmail("marina"),
    role: GlobalRole.ADMIN,
    title: "Líder de produto interno",
    avatarColor: "#7c3aed",
  },
  {
    name: "Ana Luiza Rocha",
    email: buildPlatformEmail("ana.rocha"),
    role: GlobalRole.MEMBER,
    title: "UX e design de fluxos",
    avatarColor: "#db2777",
  },
  {
    name: "Bruno Nascimento",
    email: buildPlatformEmail("bruno"),
    role: GlobalRole.MEMBER,
    title: "Frontend",
    avatarColor: "#0f766e",
  },
  {
    name: "Caio Mendes",
    email: buildPlatformEmail("caio"),
    role: GlobalRole.MEMBER,
    title: "Backend e automações",
    avatarColor: "#ea580c",
  },
  {
    name: "Fernanda Lima",
    email: buildPlatformEmail("fernanda"),
    role: GlobalRole.MEMBER,
    title: "Qualidade e operação",
    avatarColor: "#0284c7",
  },
  {
    name: "Gabriel Alves",
    email: buildPlatformEmail("gabriel"),
    role: GlobalRole.MEMBER,
    title: "Dados e indicadores",
    avatarColor: "#65a30d",
  },
  {
    name: "Rafaela Torres",
    email: buildPlatformEmail("rafaela"),
    role: GlobalRole.COLLABORATOR,
    title: "Colaboração em processos",
    avatarColor: "#f59e0b",
  },
  {
    name: "Helena Martins",
    email: buildPlatformEmail("helena"),
    role: GlobalRole.ADVISOR,
    title: "Gestão e acompanhamento",
    avatarColor: "#64748b",
  },
] as const;
