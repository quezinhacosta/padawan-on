-- =============================================
-- BANCO DE DADOS SGA
-- =============================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario TEXT UNIQUE NOT NULL,
    nome_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    ra TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ORIENTADOR', 'MENTOR', 'CALOURO')),
    ativo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    disponivel INTEGER DEFAULT 1,
    max_calouros INTEGER DEFAULT 5,
    especialidades TEXT,
    avaliacao_media REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calouros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    curso TEXT NOT NULL,
    periodo TEXT NOT NULL,
    data_ingresso DATE DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS orientadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    departamento TEXT,
    cargo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. GRUPOS
CREATE TABLE IF NOT EXISTS grupos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    mentor_id INTEGER REFERENCES mentores(id) ON DELETE SET NULL,
    orientador_id INTEGER REFERENCES orientadores(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDENTE',
    descricao TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_finalizacao DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calouros_grupos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    calouro_id INTEGER REFERENCES calouros(id) ON DELETE CASCADE,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_saida DATETIME,
    status TEXT DEFAULT 'ATIVO',
    UNIQUE(calouro_id, grupo_id)
);

CREATE TABLE IF NOT EXISTS encontros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_hora DATETIME NOT NULL,
    duracao INTEGER DEFAULT 60,
    local TEXT,
    status TEXT DEFAULT 'AGENDADO',
    tema TEXT,
    criado_por INTEGER REFERENCES usuarios(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. FREQUENCIA
CREATE TABLE IF NOT EXISTS frequencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encontro_id INTEGER REFERENCES encontros(id) ON DELETE CASCADE,
    calouro_id INTEGER REFERENCES calouros(id) ON DELETE CASCADE,
    presente INTEGER DEFAULT 0,
    observacao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(encontro_id, calouro_id)
);

CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    dados TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tipo TEXT,
    descricao TEXT,
    url TEXT,
    criado_por INTEGER REFERENCES usuarios(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ra ON usuarios(ra);