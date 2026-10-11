# 🎓 Padawan ON

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/seu-usuario/padawan-on)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightblue)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)](https://www.docker.com/)

> Plataforma completa de gestão e acompanhamento do programa de apadrinhamento e extensão acadêmica de calouros do curso de Ciência da Computação da **UNICAP** (Universidade Católica de Pernambuco).

---

## 📌 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
  - [Objetivos](#objetivos)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Funcionalidades por Perfil](#-funcionalidades-por-perfil)
  - [Orientador (Administrador)](#1-para-orientadores-administradores)
  - [Mentor (Veterano)](#2-para-mentores)
  - [Calouro (Ingressante)](#3-para-calouros)
- [Credenciais Pré-configuradas (Seed de Teste)](#-credenciais-pré-configuradas-seed-de-teste)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
  - [Opção 1: Execução Local (Recomendada para Desenvolvimento)](#opção-1-execução-local-recomendada-para-desenvolvimento)
  - [Opção 2: Execução com Docker Compose](#opção-2-execução-com-docker-compose)
- [Documentação da API REST](#-documentação-da-api-rest)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Padawan ON** é um ecossistema integrado projetado para mitigar a evasão universitária e acelerar a adaptação acadêmica e social dos novos alunos de Ciência da Computação. A plataforma conecta de forma organizada **Orientadores**, **Mentores (veteranos)** e **Calouros (ingressantes)**, provendo visibilidade analítica em tempo real, registros de encontros, biblioteca de recursos e controle de assiduidade.

### Objetivos

- **Integração:** Conectar calouros a veteranos experientes com base em especialidades e cursos.
- **Acompanhamento:** Monitorar assiduidade em encontros de tutoria e métricas de acolhimento.
- **Gestão Ágil:** Automatizar formação de grupos de mentoria e alocação de alunos sem mentor.
- **Acessibilidade:** Centralizar materiais de estudo (apostilas, listas de exercícios, videoaulas e links).

---

## 🛠️ Arquitetura e Tecnologias

A aplicação segue uma arquitetura moderna desacoplada entre Frontend e Backend com persistência relacional resiliente:

### Frontend
- **Framework:** Next.js 16 (App Router com Turbopack)
- **Biblioteca UI:** React 19 com TypeScript
- **Estilização:** Tailwind CSS + CSS Modules e Design System Dark Moderno (Neon Lime `#d3fc72` e Deep Purple `#5531cc`)
- **Autenticação no Cliente:** Armazenamento seguro de Token JWT e dados do perfil via LocalStorage

### Backend
- **Runtime:** Node.js (compatível com Node 20 LTS e Node 22+)
- **Servidor HTTP:** Express.js com middlewares de CORS, JSON parser e Error Handling centralizado
- **Segurança:** Autenticação por JSON Web Tokens (JWT) e criptografia de senhas com `bcryptjs`
- **Banco de Dados Relacional:**
  - **SQLite (Zero Setup):** Driver duplo resiliente (`better-sqlite3` ou fallback nativo embutido `node:sqlite`) que executa out-of-the-box sem dependências externas de serviço.
  - **PostgreSQL 16:** Suportado para orquestração em contêineres via Docker Compose.
- **Auditoria:** Registro automático de atividades do sistema (`atividades`).

---

## 🚀 Funcionalidades por Perfil

### 1. Para Orientadores (Administradores)
- **Dashboard Executivo:** Métricas em tempo real (total de mentores, calouros, grupos ativos, taxa de assiduidade e metas do semestre).
- **Gerenciamento de Mentores (`/dashboard/mentores`):** Listagem, busca textual, filtro de disponibilidade e cadastro de novos veteranos.
- **Gerenciamento de Calouros (`/dashboard/calouros`):** Listagem completa com identificação rápida de alunos aguardando mentor ou já alocados.
- **Formação de Grupos (`/dashboard/grupos`):** Modal de criação em lote, associação de mentor e seleção múltipla de calouros.
- **Agenda e Presença (`/dashboard/encontros`):** Agendamento de sessões com registro de presença calouro a calouro.
- **Biblioteca Educacional (`/dashboard/recursos`):** Curadoria e publicação de materiais de apoio.
- **Relatórios Consolidados (`/dashboard/relatorios`):** Indicadores do semestre, tabela de rendimento e botão de exportação/impressão.
- **Configurações Gerais (`/dashboard/configuracoes`):** Ajustes de parâmetros do programa e semestre vigente.

### 2. Para Mentores
- **Painel Personalizado (`/dashboard/mentor`):** Resumo com contagem de alunos sob sua tutela, próximas reuniões e toggle dinâmico de status (Disponível / Ocupado).
- **Meus Calouros (`/dashboard/meus-calouros`):** Informações detalhadas dos alunos do grupo com canal direto de contato por e-mail.
- **Encontros:** Criação de reuniões para o seu próprio grupo e marcação de lista de presença.
- **Acesso a Recursos:** Consulta e publicação de materiais de apoio para seus calouros.

### 3. Para Calouros
- **Painel do Calouro (`/dashboard/calouro`):** Boas-vindas personalizadas, informações de contato do mentor atribuído e status do grupo.
- **Meu Mentor (`/dashboard/meu-mentor`):** Perfil do veterano responsável e botão de contato rápido via e-mail.
- **Próximos Encontros:** Agenda clara com data, horário, duração e local/link da tutoria.
- **Biblioteca de Estudos (`/dashboard/recursos`):** Acesso a videoaulas, listas de exercícios, apostilas em PDF e documentações.
- **Auto-Cadastro (`/cadastro`):** Formulário de registro exclusivo para ingressantes.

---

## 🔑 Credenciais Pré-configuradas (Seed de Teste)

O banco de dados de desenvolvimento já vem inicializado com contas representativas de cada perfil. A senha padrão para todas as contas de teste é: `123456`.

| Perfil | Nome | RA / Matrícula | E-mail | Senha |
|---|---|---|---|---|
| **Orientador** | Prof. Dr. Ricardo Silva | `1001` | `ricardo.silva@unicap.br` | `123456` |
| **Mentor** | Lucas Mendes | `2001` | `lucas.mendes@unicap.br` | `123456` |
| **Mentor** | Camila Rocha | `2002` | `camila.rocha@unicap.br` | `123456` |
| **Calouro (Alocado)** | Pedro Alves | `3001` | `pedro.alves@unicap.br` | `123456` |
| **Calouro (Alocado)** | Beatriz Lima | `3002` | `beatriz.lima@unicap.br` | `123456` |
| **Calouro (Sem Grupo)** | Thiago Moreira | `3005` | `thiago.moreira@unicap.br` | `123456` |

> 💡 **Dica de Usabilidade:** Na tela de login (`/`), há botões de preenchimento rápido para alternar instantaneamente entre Orientador, Mentor e Calouro!

---

## 📦 Pré-requisitos

- **[Node.js](https://nodejs.org/)** (v18, v20 LTS ou v22+)
- **[npm](https://www.npmjs.com/)** (v9 ou superior)
- **[Git](https://git-scm.com/)**
- *(Opcional)* **[Docker & Docker Compose](https://www.docker.com/)** para execução em contêineres

---

## 💻 Instalação e Execução

### Opção 1: Execução Local (Recomendada para Desenvolvimento)

#### 1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/padawan-on.git
cd padawan-on
```

#### 2. Configure e Inicie o Backend:
```bash
cd back-end

# Instale as dependências
npm install

# Popule o banco com o schema e os dados de teste
npm run db:seed

# Inicie o servidor da API (porta 5000)
npm start
# ou em modo desenvolvimento:
npm run dev
```
O servidor estará acessível em `http://localhost:5000`.

#### 3. Configure e Inicie o Frontend:
Abra outro terminal:
```bash
cd front-end

# Instale as dependências
npm install

# Inicie o servidor Next.js (porta 3000)
npm run dev
```
Acesse a aplicação no navegador em: **`http://localhost:3000`**

---

### Opção 2: Execução com Docker Compose

Para subir toda a infraestrutura com um único comando:

```bash
docker compose up --build
```

Serviços iniciados:
- **Frontend Next.js:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **PostgreSQL 16:** `localhost:5432`
- **pgAdmin 4:** `http://localhost:5050` (Login: `admin@unicap.br` | Senha: `admin_password`)

---

## 📡 Documentação da API REST

Todas as rotas (com exceção de login, registro e health check) requerem o cabeçalho HTTP:
`Authorization: Bearer <token_jwt>`

### Autenticação (`/api/auth`)
- `POST /api/auth/login`: Realiza login por RA e Senha. Retorna Token JWT e objeto do usuário.
- `POST /api/auth/register`: Registro de calouro com hash bcrypt da senha.
- `GET /api/auth/me`: Retorna os dados do usuário logado.

### Dashboard & Métricas (`/api/dashboard`)
- `GET /api/dashboard/stats`: Indicadores consolidados para Orientadores.
- `GET /api/dashboard/atividades`: Log recente de eventos da plataforma.
- `GET /api/dashboard/mentor-resumo`: Resumo analítico do mentor autenticado.
- `GET /api/dashboard/calouro-resumo`: Resumo das mentorias e reuniões do calouro autenticado.

### Mentores (`/api/mentores`)
- `GET /api/mentores`: Lista todos os mentores com contagem de alunos atendidos.
- `GET /api/mentores/meus-calouros`: Lista calouros do mentor logado.
- `POST /api/mentores`: Cadastra novo mentor (exclusivo Orientador).
- `PATCH /api/mentores/:id/disponibilidade`: Alterna status disponível/ocupado.

### Calouros (`/api/calouros`)
- `GET /api/calouros`: Lista calouros e situação de alocação de grupo.
- `GET /api/calouros/meu-perfil`: Dados do mentor e grupo do calouro logado.
- `POST /api/calouros`: Cadastra novo calouro (exclusivo Orientador).

### Grupos (`/api/grupos`)
- `GET /api/grupos`: Lista grupos com mentor e calouros membros.
- `POST /api/grupos`: Cria grupo, associa mentor e vincula calouros em lote.
- `POST /api/grupos/:id/calouros`: Adiciona calouro individual ao grupo.
- `DELETE /api/grupos/:id/calouros/:calouroId`: Remove calouro do grupo.
- `DELETE /api/grupos/:id`: Remove o grupo.

### Encontros e Frequência (`/api/encontros`)
- `GET /api/encontros`: Lista encontros com filtros por grupo, mentor ou calouro.
- `POST /api/encontros`: Agenda encontro de tutoria.
- `GET /api/encontros/:id`: Detalhes do encontro e lista nominal de presença.
- `POST /api/encontros/:id/frequencia`: Salva lista de presença dos calouros.
- `DELETE /api/encontros/:id`: Cancela/exclui o encontro.

### Recursos Educacionais (`/api/recursos`)
- `GET /api/recursos`: Lista materiais por categoria (DOCUMENTO, VIDEO, LINK, EXERCICIO).
- `POST /api/recursos`: Cadastra novo material de estudo.
- `DELETE /api/recursos/:id`: Remove material (exclusivo Orientador).

---

## 📁 Estrutura de Diretórios

```text
padawan-on/
├── back-end/
│   ├── src/
│   │   ├── database/
│   │   │   ├── index.js          # Conexão resiliente SQLite e queries parametrizadas
│   │   │   ├── schema.sql        # Modelagem DDL relacional
│   │   │   ├── createTables.js   # Script de criação de tabelas
│   │   │   └── seed.js           # Inicializador de dados de demonstração
│   │   ├── middleware/
│   │   │   └── auth.js           # Verificação JWT e controle de papéis (RBAC)
│   │   └── routes/
│   │       ├── authRoutes.js     # Login, cadastro e perfil
│   │       ├── usuarioRoutes.js  # CRUD e gerenciamento de usuários
│   │       ├── mentorRoutes.js   # Gestão de mentores e disponibilidade
│   │       ├── calouroRoutes.js  # Gestão de calouros e vínculos
│   │       ├── grupoRoutes.js    # Criação e gestão de grupos
│   │       ├── encontroRoutes.js # Agenda e controle de frequência
│   │       ├── recursoRoutes.js  # Biblioteca educacional
│   │       └── dashboardRoutes.js# Métricas e relatórios
│   ├── server.js                 # Ponto de entrada da API Express
│   ├── Dockerfile
│   └── package.json
│
├── front-end/
│   ├── app/
│   │   ├── cadastro/             # Página de cadastro para calouros
│   │   ├── dashboard/
│   │   │   ├── calouro/          # Painel individual do Calouro
│   │   │   ├── calouros/         # Gestão de calouros (Orientador)
│   │   │   ├── mentor/           # Painel individual do Mentor
│   │   │   ├── mentores/         # Gestão de mentores (Orientador)
│   │   │   ├── grupos/           # Formação e gestão de grupos
│   │   │   ├── encontros/        # Agendamento e lista de presença
│   │   │   ├── recursos/         # Biblioteca de recursos educacionais
│   │   │   ├── relatorios/       # Relatórios analíticos e indicadores
│   │   │   ├── configuracoes/    # Parâmetros do sistema
│   │   │   ├── meus-calouros/    # Alunos do mentor
│   │   │   ├── meu-mentor/       # Contato do mentor para o calouro
│   │   │   ├── layout.tsx        # Shell do dashboard com navegação por papel
│   │   │   └── page.tsx          # Visão Geral do Orientador
│   │   ├── layout.tsx            # Root Layout com fontes e estilos globais
│   │   ├── page.tsx              # Tela de Login com acesso rápido de teste
│   │   └── globals.css           # Tema moderno Dark / Lime / Purple
│   ├── Dockerfile
│   ├── next.config.js            # Proxy reverso /api -> Backend
│   └── package.json
│
├── docker-compose.yml            # Orquestração de Backend, Frontend, Postgres e pgAdmin
└── README.md                     # Documentação completa do projeto
```

---

## 📄 Licença

Este projeto é desenvolvido para o programa de extensão universitária do curso de Ciência da Computação da **UNICAP** e é distribuído sob a licença [MIT](LICENSE).