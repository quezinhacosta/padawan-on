# Padawan ON

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/seu-usuario/padawan-on)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightblue)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)](https://www.docker.com/)

> Plataforma de gestao e acompanhamento do programa de apadrinhamento e extensao academica de calouros do curso de Ciencia da Computacao da **UNICAP** (Universidade Catolica de Pernambuco).

---

## Indice

- [Sobre o Projeto](#sobre-o-projeto)
  - [Objetivos](#objetivos)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Funcionalidades por Perfil](#funcionalidades-por-perfil)
  - [Orientador (Administrador)](#1-para-orientadores-administradores)
  - [Mentor (Veterano)](#2-para-mentores)
  - [Calouro (Ingressante)](#3-para-calouros)
- [Credenciais do Administrador](#credenciais-do-administrador)
- [Pre-requisitos](#pre-requisitos)
- [Instalacao e Execucao](#instalacao-e-execucao)
  - [Opcao 1: Execucao Local](#opcao-1-execucao-local)
  - [Opcao 2: Execucao com Docker Compose](#opcao-2-execucao-com-docker-compose)
- [Documentacao da API REST](#documentacao-da-api-rest)
- [Estrutura de Diretorios](#estrutura-de-diretorios)
- [Licenca](#licenca)

---

## Sobre o Projeto

O **Padawan ON** e um ecossistema projetado para mitigar a evasao universitaria e acelerar a adaptacao academica e social dos novos alunos de Ciencia da Computacao. A plataforma conecta de forma organizada **Orientadores**, **Mentores (veteranos)** e **Calouros (ingressantes)**, provendo visibilidade analitica em tempo real, registros de encontros, biblioteca de recursos, controle de assiduidade e remocao completa de entidades.

### Objetivos

- **Integracao:** Conectar calouros a veteranos experientes com base em especialidades e cursos.
- **Acompanhamento:** Monitorar assiduidade em encontros de tutoria e metricas de acolhimento.
- **Gestao Agil:** Automatizar formacao de grupos de mentoria e alocacao de alunos sem mentor.
- **Acessibilidade:** Centralizar materiais de estudo (apostilas, listas de exercicios, videoaulas e links).
- **Controle Total:** Permitir cadastro e exclusao de calouros, mentores, grupos, encontros e materiais.

---

## Arquitetura e Tecnologias

A aplicacao segue uma arquitetura desacoplada entre Frontend e Backend com persistencia relacional:

### Frontend
- **Framework:** Next.js 16 (App Router com Turbopack)
- **Biblioteca UI:** React 19 com TypeScript
- **Iconografia:** `lucide-react` (iconografia moderna em SVG sem dependencias de emojis)
- **Estilizacao:** Tailwind CSS + Design System Dark Moderno (Neon Lime `#d3fc72` e Deep Purple `#5531cc`)
- **Autenticacao no Cliente:** Armazenamento de Token JWT e dados do perfil via LocalStorage

### Backend
- **Runtime:** Node.js (compativel com Node 20 LTS e Node 22+)
- **Servidor HTTP:** Express.js com middlewares de CORS, JSON parser e tratamento de erros
- **Seguranca:** Autenticacao por JSON Web Tokens (JWT) e hash de senhas com `bcryptjs`
- **Banco de Dados Relacional:**
  - **SQLite:** Driver duplo resiliente (`better-sqlite3` ou fallback embutido `node:sqlite`) que executa sem configuracoes externas.
  - **PostgreSQL 16:** Suportado para orquestracao em conteineres via Docker Compose.
- **Auditoria:** Registro automatico de atividades do sistema (`atividades`).

---

## Funcionalidades por Perfil

### 1. Para Orientadores (Administradores)
- **Dashboard Executivo:** Metricas em tempo real (total de mentores, calouros, grupos ativos, taxa de assiduidade e metas do semestre).
- **Gerenciamento de Mentores (`/dashboard/mentores`):** Listagem, busca textual, filtro de disponibilidade, cadastro e exclusao de mentores com confirmacao.
- **Gerenciamento de Calouros (`/dashboard/calouros`):** Listagem completa com identificacao de alunos aguardando mentor ou alocados, cadastro e exclusao.
- **Formacao de Grupos (`/dashboard/grupos`):** Modal de criacao, associacao de mentor, selecao multipla de calouros e exclusao de grupos.
- **Agenda e Presenca (`/dashboard/encontros`):** Agendamento de sessoes com registro de presenca e exclusao de encontros.
- **Biblioteca Educacional (`/dashboard/recursos`):** Curadoria, publicacao e exclusao de materiais de apoio.
- **Relatorios Consolidados (`/dashboard/relatorios`):** Indicadores do semestre, tabela de rendimento e exportacao/impressao.
- **Configuracoes Gerais (`/dashboard/configuracoes`):** Ajustes de parametros do programa e semestre vigente.

### 2. Para Mentores
- **Painel Personalizado (`/dashboard/mentor`):** Resumo com contagem de alunos sob sua tutela, proximas reunioes e toggle de status (Disponivel / Ocupado).
- **Meus Calouros (`/dashboard/meus-calouros`):** Informacoes detalhadas dos alunos do grupo com canal direto de contato por e-mail.
- **Encontros:** Criacao de reunioes para o seu proprio grupo e marcacao de lista de presenca.
- **Acesso a Recursos:** Consulta e publicacao de materiais de apoio para seus calouros.

### 3. Para Calouros
- **Painel do Calouro (`/dashboard/calouro`):** Boas-vindas, informacoes de contato do mentor atribuido e status do grupo.
- **Meu Mentor (`/dashboard/meu-mentor`):** Perfil do veterano responsavel e botao de contato rapido via e-mail.
- **Proximos Encontros:** Agenda com data, horario, duracao e local/link da tutoria.
- **Biblioteca de Estudos (`/dashboard/recursos`):** Acesso a videoaulas, listas de exercicios, apostilas em PDF e links.
- **Auto-Cadastro (`/cadastro`):** Formulario de registro exclusivo para ingressantes.

---

## Credenciais do Administrador

O banco de dados contem o registro inicial da conta administradora:

| Papel | Nome | Usuario | E-mail | RA | Senha |
|---|---|---|---|---|---|
| **Orientador (Admin)** | Quezia | `quezia` | `quezia@unicap.br` | `2011` | `2011` |

Na tela de login (`/`), o botao de atalho preenche automaticamente as credenciais da administradora Quezia. E possivel realizar o login informando tanto o E-mail quanto o RA.

---

## Pre-requisitos

- **Node.js** (v18, v20 LTS ou v22+)
- **npm** (v9 ou superior)
- **Git**
- *(Opcional)* **Docker & Docker Compose** para execucao em conteineres

---

## Instalacao e Execucao

### Opcao 1: Execucao Local

#### 1. Clone o repositorio:
```bash
git clone https://github.com/seu-usuario/padawan-on.git
cd padawan-on
```

#### 2. Configure e Inicie o Backend:
```bash
cd back-end

# Instale as dependencias
npm install

# Inicialize o banco com a conta administradora
npm run db:seed

# Inicie o servidor da API (porta 5000)
npm start
# ou em modo desenvolvimento:
npm run dev
```
O servidor estara acessivel em `http://localhost:5000`.

#### 3. Configure e Inicie o Frontend:
Abra outro terminal:
```bash
cd front-end

# Instale as dependencias
npm install

# Inicie o servidor Next.js (porta 3000)
npm run dev
```
Acesse a aplicacao no navegador em: **`http://localhost:3000`**

---

### Opcao 2: Execucao com Docker Compose

Para subir a infraestrutura:

```bash
docker compose up --build
```

Servicos:
- **Frontend Next.js:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **PostgreSQL 16:** `localhost:5432`
- **pgAdmin 4:** `http://localhost:5050`

---

## Documentacao da API REST

Todas as rotas autenticadas requerem o cabecalho HTTP:
`Authorization: Bearer <token_jwt>`

### Autenticacao (`/api/auth`)
- `POST /api/auth/login`: Realiza login por RA ou E-mail e Senha. Retorna Token JWT e objeto do usuario.
- `POST /api/auth/register`: Registro de calouro com hash bcrypt da senha.
- `GET /api/auth/me`: Retorna os dados do usuario logado.

### Dashboard & Metricas (`/api/dashboard`)
- `GET /api/dashboard/stats`: Indicadores consolidados para Orientadores.
- `GET /api/dashboard/atividades`: Log recente de eventos da plataforma.
- `GET /api/dashboard/mentor-resumo`: Resumo analitico do mentor autenticado.
- `GET /api/dashboard/calouro-resumo`: Resumo das mentorias e reunioes do calouro autenticado.

### Mentores (`/api/mentores`)
- `GET /api/mentores`: Lista todos os mentores com contagem de alunos atendidos.
- `GET /api/mentores/meus-calouros`: Lista calouros do mentor logado.
- `POST /api/mentores`: Cadastra novo mentor (exclusivo Orientador).
- `PATCH /api/mentores/:id/disponibilidade`: Alterna status disponivel/ocupado.
- `DELETE /api/mentores/:id`: Remove mentor e desvincula grupos/relacoes.

### Calouros (`/api/calouros`)
- `GET /api/calouros`: Lista calouros e situacao de alocacao de grupo.
- `GET /api/calouros/meu-perfil`: Dados do mentor e grupo do calouro logado.
- `POST /api/calouros`: Cadastra novo calouro (exclusivo Orientador).
- `DELETE /api/calouros/:id`: Remove calouro e limpa participacoes de grupos e presencas.

### Grupos (`/api/grupos`)
- `GET /api/grupos`: Lista grupos com mentor e calouros membros.
- `POST /api/grupos`: Cria grupo, associa mentor e vincula calouros em lote.
- `POST /api/grupos/:id/calouros`: Adiciona calouro individual ao grupo.
- `DELETE /api/grupos/:id/calouros/:calouroId`: Remove calouro do grupo.
- `DELETE /api/grupos/:id`: Remove o grupo e desvincula membros.

### Encontros e Frequencia (`/api/encontros`)
- `GET /api/encontros`: Lista encontros com filtros por grupo, mentor ou calouro.
- `POST /api/encontros`: Agenda encontro de tutoria.
- `GET /api/encontros/:id`: Detalhes do encontro e lista nominal de presenca.
- `POST /api/encontros/:id/frequencia`: Salva lista de presenca dos calouros.
- `DELETE /api/encontros/:id`: Cancela e exclui o encontro.

### Recursos Educacionais (`/api/recursos`)
- `GET /api/recursos`: Lista materiais por categoria (DOCUMENTO, VIDEO, LINK, EXERCICIO).
- `POST /api/recursos`: Cadastra novo material de estudo.
- `DELETE /api/recursos/:id`: Remove material.

---

## Estrutura de Diretorios

```text
padawan-on/
├── back-end/
│   ├── src/
│   │   ├── database/
│   │   │   ├── index.js          # Conexao SQLite com fallback duplo
│   │   │   ├── schema.sql        # Modelagem DDL relacional
│   │   │   ├── createTables.js   # Script de verificacao de tabelas
│   │   │   └── seed.js           # Inicializador exclusivo da conta administradora Quezia
│   │   ├── middleware/
│   │   │   └── auth.js           # Verificacao JWT e controle de papeis (RBAC)
│   │   └── routes/
│   │       ├── authRoutes.js     # Login por RA/E-mail, cadastro e perfil
│   │       ├── usuarioRoutes.js  # Gestao de usuarios
│   │       ├── mentorRoutes.js   # Gestao, disponibilidade e exclusao de mentores
│   │       ├── calouroRoutes.js  # Gestao, vinculos e exclusao de calouros
│   │       ├── grupoRoutes.js    # Criacao, gestao e exclusao de grupos
│   │       ├── encontroRoutes.js # Agenda, presenca e exclusao de encontros
│   │       ├── recursoRoutes.js  # Biblioteca e exclusao de recursos
│   │       └── dashboardRoutes.js# Metricas analiticas
│   ├── server.js                 # Ponto de entrada da API Express
│   ├── Dockerfile
│   └── package.json
│
├── front-end/
│   ├── app/
│   │   ├── cadastro/             # Auto-cadastro de calouros
│   │   ├── dashboard/
│   │   │   ├── calouro/          # Painel individual do Calouro
│   │   │   ├── calouros/         # Gestao e exclusao de calouros
│   │   │   ├── mentor/           # Painel individual do Mentor
│   │   │   ├── mentores/         # Gestao e exclusao de mentores
│   │   │   ├── grupos/           # Criacao e exclusao de grupos
│   │   │   ├── encontros/        # Agenda, presenca e exclusao de encontros
│   │   │   ├── recursos/         # Biblioteca e exclusao de recursos
│   │   │   ├── relatorios/       # Relatorios analiticos e indicadores
│   │   │   ├── configuracoes/    # Parametros do sistema
│   │   │   ├── meus-calouros/    # Alunos sob mentoria
│   │   │   ├── meu-mentor/       # Perfil do mentor
│   │   │   ├── layout.tsx        # Shell de navegacao com Lucide icons
│   │   │   └── page.tsx          # Visao Geral do Orientador
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Login com preenchimento da conta Quezia
│   │   └── globals.css           # Estilizacao global Dark Theme
│   ├── Dockerfile
│   ├── next.config.js            # Proxy reverso /api -> Backend
│   └── package.json
│
├── docker-compose.yml            # Orquestracao de conteineres
└── README.md                     # Documentacao do projeto
```

---

## Licenca

Este projeto e desenvolvido para o programa de extensao universitaria do curso de Ciencia da Computacao da **UNICAP** e e distribuido sob a licenca [MIT](LICENSE).