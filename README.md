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

- [Padawan ON](#padawan-on)
  - [Indice](#indice)
  - [Sobre o Projeto](#sobre-o-projeto)
    - [Objetivos](#objetivos)
  - [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Funcionalidades por Perfil](#funcionalidades-por-perfil)
    - [1. Para Administradores](#1-para-administradores)
    - [2. Para Mentores (Veteranos)](#2-para-mentores-veteranos)
    - [3. Para Calouros (Ingressantes)](#3-para-calouros-ingressantes)
  - [Cadastro e Credenciais](#cadastro-e-credenciais)
  - [Pre-requisitos](#pre-requisitos)
  - [Instalacao e Execucao](#instalacao-e-execucao)
    - [Opcao 1: Execucao Local](#opcao-1-execucao-local)
      - [1. Clone o repositorio:](#1-clone-o-repositorio)
      - [2. Configure e Inicie o Backend:](#2-configure-e-inicie-o-backend)
      - [3. Configure e Inicie o Frontend:](#3-configure-e-inicie-o-frontend)
    - [Opcao 2: Execucao com Docker Compose](#opcao-2-execucao-com-docker-compose)
  - [Documentacao da API REST](#documentacao-da-api-rest)
    - [Autenticacao (`/api/auth`)](#autenticacao-apiauth)
    - [Dashboard \& Metricas (`/api/dashboard`)](#dashboard--metricas-apidashboard)
    - [Mentores (`/api/mentores`)](#mentores-apimentores)
    - [Calouros (`/api/calouros`)](#calouros-apicalouros)
    - [Grupos (`/api/grupos`)](#grupos-apigrupos)
    - [Encontros e Frequencia (`/api/encontros`)](#encontros-e-frequencia-apiencontros)
    - [Recursos Educacionais (`/api/recursos`)](#recursos-educacionais-apirecursos)
  - [Estrutura de Diretorios](#estrutura-de-diretorios)

---

## Sobre o Projeto

O **Padawan ON** e um ecossistema projetado para mitigar a evasao universitaria e acelerar a adaptacao academica e social dos novos alunos de Ciencia da Computacao. A plataforma conecta de forma organizada **Administradores**, **Mentores (veteranos)** e **Calouros (ingressantes)**, provendo visibilidade analitica em tempo real, registros de encontros, biblioteca de recursos, controle de assiduidade e remocao completa de entidades.

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

A plataforma estrutura-se sobre a seguinte hierarquia estrita de autoridade:
**Orientador -> Administrador -> Grupos -> Mentores -> Calouros**

### 1. Para o Orientador Geral
- **Autoridade Maxima:** O Orientador possui gestao irrestrita sobre absolutamente toda a plataforma.
- **Conta Pre-cadastrada:** Possui perfil permanente inicializado no banco de dados.
- **Gestao Completa:** Pode criar, editar e excluir qualquer entidade do sistema (administradores, mentores, calouros, grupos, encontros e recursos).
- **Formacao de Grupos:** Cria os grupos e designa seus administradores/lideres e mentores responsaveis.
- **Visibilidade Global:** Acessa relatorios consolidados, auditoria de atividades e logs de todos os grupos.

### 2. Para os Administradores
- **Gestao de Grupos e Equipes:** Administram os grupos, selecionam mentores e alocam calouros.
- **Direitos Amplos:** Podem cadastrar novos administradores, mentores e calouros, agendar encontros e excluir registros operacionais.
- **Restricao ao Orientador:** Administradores nao tem permissao para editar ou excluir a conta do Orientador Geral.
- **Escopo Delimitado:** O administrador acompanha a situacao e movimentacoes dos grupos sob sua gestao direta.

### 3. Para Mentores (Veteranos)
- **Gestao Exclusiva de Calouros:** Os mentores gerenciam unicamente os calouros aos quais estao atrelados. Mentores nao administram grupos nem tem permissoes de gestao de outros usuarios.
- **Vinculo ao Grupo:** O mentor visualiza a situacao e as movimentacoes unicamente do grupo no qual esta inserido, sem acesso a dados de outros grupos.
- **Micro-Chat e Feedbacks:** Comunica-se com seus calouros atraves do Micro-Chat integrado, com envio de mensagens e acoes rapidas de feedback pre-definidas ("Preciso falar com voce!", "Como estao os estudos essa semana?", etc.).
- **Encontros e Presenca:** Conduz reunioes de tutoria e registra a frequencia dos seus calouros.

### 4. Para Calouros (Ingressantes)
- **Visualizacao Exclusiva:** O calouro possui acesso restrito unicamente aos seus encontros com o mentor designado, feedbacks e a biblioteca de recursos.
- **Micro-Chat com Mentor:** Interage com o mentor atraves do Micro-Chat com respostas e feedbacks pre-formatados.
- **Confirmacao de Encontros:** Aceita ou recusa convites para encontros de mentoria e envia avaliacoes.
- **Auto-Cadastro:** Pode realizar seu cadastro inicial informando RA e dados academicos.

---

## Sistema de Micro-Chat e Feedbacks Integrados

O sistema elimina canais externos e adota um canal de **Micro-Chat em tempo real** entre participantes autorizados:
- **Feedbacks Rapidos:** Botoes de envio com um clique para comunicacoes frequentes:
  - "Preciso falar com voce!"
  - "Ola! Como estao os estudos essa semana?"
  - "Obrigado pelo apoio no ultimo encontro!"
  - "Gostaria de tirar uma duvida sobre a materia."
  - "Excelente conducao do encontro de hoje!"
  - "Quando sera nossa proxima sessao de tutoria?"
  - "Material de estudo recebido e revisado com sucesso."
- **Isolamento e Seguranca:** Mensagens sao auditadas e segregadas por remetente, destinatario e grupo de mentoria.
- **Registro Permanente:** O historico de comunicacoes fica registrado na base de dados relacional.

---

## Cadastro e Credenciais

- **Cadastro Publico (`/cadastro`):** Restrito exclusivamente a **Calouros** e **Mentores**.
- **Gestao de Administradores:** Realizada internamente pelo Orientador Geral ou por Administradores vigentes.
- **Credenciais Iniciais Pré-cadastradas:** O banco de dados e inicializado com a conta de Orientador Geral de Quezia:

| Papel | Nome | Usuario | E-mail | RA | Senha |
|---|---|---|---|---|---|
| **Orientador Geral** | Quezia | `quezia` | `quezia@unicap.br` | `2011` | `2011` |

O login pode ser realizado informando tanto o E-mail institucional (`quezia@unicap.br`) quanto o RA (`2011`).

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
- `PUT /api/auth/perfil`: Atualiza nome, e-mail, senha e foto de perfil do usuario autenticado.

### Dashboard & Metricas (`/api/dashboard`)
- `GET /api/dashboard/stats`: Indicadores consolidados para Administradores.
- `GET /api/dashboard/atividades`: Log recente de eventos da plataforma e movimentacoes gerais.
- `GET /api/dashboard/admin-resumo`: Resumo analitico e movimentacoes do grupo do Administrador.
- `GET /api/dashboard/mentor-resumo`: Resumo analitico, calouros e movimentacoes do grupo do Mentor.
- `GET /api/dashboard/calouro-resumo`: Resumo das mentorias e reunioes do calouro autenticado.

### Micro-Chat & Mensagens (`/api/mensagens`)
- `GET /api/mensagens?destinatarioId=:id`: Retorna o historico de mensagens e feedbacks entre os dois usuarios.
- `GET /api/mensagens?grupoId=:id`: Retorna o historico de comunicacoes associadas a determinado grupo.
- `POST /api/mensagens`: Envia nova mensagem ou feedback pre-formatado para um membro da equipe.

### Administradores (`/api/administradores`)
- `GET /api/administradores`: Lista todos os administradores com grupos sob gestao.
- `GET /api/administradores/:id`: Dados detalhados do administrador.
- `POST /api/administradores`: Cadastra novo administrador com credenciais e departamento.
- `PUT /api/administradores/:id`: Atualiza departamento e cargo do administrador.
- `DELETE /api/administradores/:id`: Exclui administrador e desvincula grupos correspondentes.

### Mentores (`/api/mentores`)
- `GET /api/mentores`: Lista todos os mentores com contagem de alunos atendidos.
- `GET /api/mentores/meus-calouros`: Lista calouros do mentor logado.
- `POST /api/mentores`: Cadastra novo mentor.
- `PATCH /api/mentores/:id/disponibilidade`: Alterna status disponivel/ocupado.
- `DELETE /api/mentores/:id`: Remove mentor e desvincula grupos/relacoes.

### Calouros (`/api/calouros`)
- `GET /api/calouros`: Lista calouros e situacao de alocacao de grupo.
- `GET /api/calouros/meu-perfil`: Dados do mentor e grupo do calouro logado.
- `POST /api/calouros`: Cadastra novo calouro.
- `DELETE /api/calouros/:id`: Remove calouro e limpa participacoes de grupos e presencas.

### Grupos (`/api/grupos`)
- `GET /api/grupos`: Lista grupos (filtrados por escopo administrativo do usuario).
- `GET /api/grupos/:id/relatorio-frequencia`: Retorna metricas consolidadas, lista de encontros e frequencia nominal dos calouros para emissao de relatorio/PDF.
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
│   │   │   └── page.tsx          # Visao Geral do Administrador
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