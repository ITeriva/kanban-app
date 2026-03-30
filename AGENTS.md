# AGENTS.md

## Visão do projeto

Este projeto é uma plataforma interna de gestão da squad de TI.

O objetivo é oferecer um workspace simples, funcional e bonito para organizar:

- projetos
- tarefas
- equipes
- sprints
- calendário
- dashboard
- fluxos
- documentação operacional do time

Este projeto **não é multi-tenant**.
Existe apenas um workspace.

## Objetivos principais

- Entregar uma aplicação funcional e utilizável para operação interna
- Priorizar simplicidade e usabilidade
- Manter uma UI inspirada no Notion, mas adaptada para um produto web real
- Evitar arquitetura enterprise desnecessária
- Manter regras de visualização por role
- Permitir evolução futura sem complicar o MVP

## Stack

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- MUI
- TanStack Query
- dnd-kit
- Recharts

## Arquitetura

Este projeto deve ser implementado como uma aplicação simplificada, preferencialmente full-stack com Next.js.

### Responsabilidades

- Banco: persistência, relações, integridade estrutural
- Backend/server side: regras de negócio, autenticação, autorização, CRUDs
- Frontend: UI, navegação, formulários, feedback visual

Não colocar regra principal de negócio no frontend.
Não usar stored procedures como camada principal de negócio.

## Modelo de usuários e roles

### Roles globais

- ADMIN
- MEMBER
- COLLABORATOR
- ADVISOR

### Significado

- ADMIN: administra o workspace e vê tudo
- MEMBER: membro operacional fixo da squad
- COLLABORATOR: usuário temporário ou de apoio, vê apenas o que participa
- ADVISOR: perfil de gestão/acompanhamento, com visão mais gerencial e de leitura

## Roles por projeto

- PROJECT_MANAGER
- PROJECT_MEMBER
- PROJECT_VIEWER

## Visibilidade

### Projeto

- WORKSPACE
- PROJECT_MEMBERS
- LEADERS_ONLY

### Tarefa

- PROJECT
- ASSIGNEES
- LEADERS_ONLY

## Entidades principais

- User
- Team
- TeamMember
- Project
- ProjectMember
- Sprint
- Board
- BoardColumn
- Task
- TaskAssignee
- TaskComment
- TaskChecklistItem
- Tag
- TaskTag
- TaskHistory

## Funcionalidades principais do MVP

- login
- dashboard
- projetos
- tarefas
- equipes
- sprints
- calendário
- checklist
- comentários
- board/lista/cronograma
- painel admin simples

## Regras de produto

- Não existe multi-tenant
- Não existe company ativa
- O sistema é um único workspace
- ADMIN vê e gerencia tudo
- MEMBER vê e opera no que é do workspace e dos projetos em que participa
- COLLABORATOR vê apenas projetos e tarefas em que está incluído
- ADVISOR tem visão de leitura e acompanhamento

## Páginas esperadas

- /login
- /dashboard
- /projects
- /projects/[id]
- /tasks
- /teams
- /sprints
- /calendar
- /admin

## UX e UI

- manter dark mode e suporte futuro a light mode
- visual corporativo, limpo e elegante
- inspiração no Notion, sem copiar literalmente
- projeto abre em página completa
- tarefa abre preferencialmente em drawer lateral
- formulários leves
- propriedades editáveis no topo das páginas
- listas, boards e cronogramas devem ser consistentes entre si

## Padrões de implementação

- usar TypeScript estrito
- usar componentes reutilizáveis
- evitar duplicação
- centralizar permissões em funções/services claras
- usar TanStack Query para dados assíncronos
- tratar loading/error/empty states
- evitar estilos hardcoded quando houver tema
- comentar apenas quando realmente necessário

## Seed esperado

Criar seed inicial com usuários suficientes para cobrir cenários reais da squad:

- admins
- membros
- colaborador
- gestão

Também criar:

- equipes
- projetos
- tarefas
- sprints
- tags
- checklist
- boards
- fluxos manuais

Os dados precisam ser úteis para validação real da aplicação em ambiente local.

## Comandos e workflow

- instalar dependências
- rodar Prisma generate
- rodar migrate
- rodar seed
- subir aplicação localmente

Sempre prefira mudanças incrementais.
Não reescreva grandes partes sem necessidade.
Explique decisões importantes antes de mudanças estruturais maiores.
