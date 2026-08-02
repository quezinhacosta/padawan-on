"use client"

import { useState } from "react"

interface CalouroInfo {
  nome: string
  ra: string
  curso: string
  periodo: string
  mentor: {
    nome: string
    email: string
    disponivel: boolean
  } | null
}

interface Encontro {
  id: string
  titulo: string
  descricao: string
  data: string
  status: "AGENDADO" | "REALIZADO" | "CANCELADO"
  local: string
}

interface Recurso {
  id: string
  titulo: string
  tipo: "VIDEO" | "DOCUMENTO" | "LINK" | "EXERCICIO"
  descricao: string
}

export default function CalouroDashboard() {
  const [calouro] = useState<CalouroInfo>({
    nome: "Maria Santos",
    ra: "2024001",
    curso: "Ciência da Computação",
    periodo: "1º Período",
    mentor: {
      nome: "João Silva",
      email: "joao.silva@unicap.br",
      disponivel: true
    }
  })

  const [encontros] = useState<Encontro[]>([
    {
      id: "1",
      titulo: "Introdução à Programação",
      descricao: "Primeiro encontro para introdução aos conceitos básicos de programação",
      data: "2024-12-15T14:00:00",
      status: "AGENDADO",
      local: "Sala 301 - Bloco A"
    },
    {
      id: "2",
      titulo: "Revisão de Prova",
      descricao: "Revisão para a prova de Algoritmos",
      data: "2024-12-10T10:00:00",
      status: "REALIZADO",
      local: "Sala 205 - Bloco B"
    },
    {
      id: "3",
      titulo: "Projeto Final",
      descricao: "Acompanhamento do projeto final da disciplina",
      data: "2024-12-20T16:00:00",
      status: "AGENDADO",
      local: "Sala 301 - Bloco A"
    }
  ])

  const [recursos] = useState<Recurso[]>([
    {
      id: "1",
      titulo: "Algoritmos e Lógica de Programação",
      tipo: "DOCUMENTO",
      descricao: "Material completo sobre algoritmos para iniciantes"
    },
    {
      id: "2",
      titulo: "Introdução ao Python",
      tipo: "VIDEO",
      descricao: "Vídeo tutorial de Python para iniciantes"
    },
    {
      id: "3",
      titulo: "Lista de Exercícios",
      tipo: "EXERCICIO",
      descricao: "Exercícios para praticar lógica de programação"
    },
    {
      id: "4",
      titulo: "Documentação Oficial",
      tipo: "LINK",
      descricao: "Links úteis para documentação das tecnologias"
    }
  ])

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            👋 Olá, {calouro.nome}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {calouro.curso} - {calouro.periodo} • RA: {calouro.ra}
          </p>
        </div>
        <button style={{
          padding: "10px 20px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #5531cc, #3d1f99)",
          color: "white",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          💬 Falar com Mentor
        </button>
      </div>

      {/* Informações do Mentor */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "4px" }}>
              🧑‍🎓 Seu Mentor
            </p>
            <h3 style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
              {calouro.mentor?.nome}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              📧 {calouro.mentor?.email}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500",
              background: calouro.mentor?.disponivel ? "rgba(211,252,114,0.2)" : "rgba(255,107,107,0.2)",
              color: calouro.mentor?.disponivel ? "#d3fc72" : "#ff6b6b"
            }}>
              {calouro.mentor?.disponivel ? "🟢 Disponível" : "🔴 Ocupado"}
            </span>
            <div style={{ marginTop: "8px" }}>
              <button style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "12px"
              }}>
                Ver Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Progresso */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <CalouroCard
          icon="📚"
          label="Encontros"
          value="12"
          detail="Próximo: Amanhã"
          color="#d3fc72"
        />
        <CalouroCard
          icon="⭐"
          label="Progresso"
          value="65%"
          detail="4 módulos concluídos"
          color="#5531cc"
        />
        <CalouroCard
          icon="📝"
          label="Atividades"
          value="8"
          detail="3 pendentes"
          color="#ff6b6b"
        />
      </div>

      {/* Próximos Encontros */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
            📅 Próximos Encontros
          </h3>
          <button style={{
            padding: "4px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: "12px"
          }}>
            Ver todos
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {encontros.map((encontro) => (
            <div key={encontro.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div>
                <p style={{ color: "white", fontSize: "16px", fontWeight: "500" }}>
                  {encontro.titulo}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  📍 {encontro.local} • {new Date(encontro.data).toLocaleString('pt-BR')}
                </p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                  {encontro.descricao}
                </p>
              </div>
              <span style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                background: encontro.status === "AGENDADO" ? "rgba(211,252,114,0.2)" :
                          encontro.status === "REALIZADO" ? "rgba(85,49,204,0.2)" :
                          "rgba(255,107,107,0.2)",
                color: encontro.status === "AGENDADO" ? "#d3fc72" :
                       encontro.status === "REALIZADO" ? "#5531cc" :
                       "#ff6b6b"
              }}>
                {encontro.status === "AGENDADO" ? "📌 Agendado" :
                 encontro.status === "REALIZADO" ? "✅ Realizado" :
                 "❌ Cancelado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recursos Disponíveis */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
            📚 Recursos Disponíveis
          </h3>
          <button style={{
            padding: "4px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: "12px"
          }}>
            Ver todos
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px"
        }}>
          {recursos.map((recurso) => (
            <div key={recurso.id} style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)"
              e.currentTarget.style.transform = "translateY(0)"
            }}>
              <div style={{
                fontSize: "32px",
                marginBottom: "8px"
              }}>
                {recurso.tipo === "VIDEO" && "🎥"}
                {recurso.tipo === "DOCUMENTO" && "📄"}
                {recurso.tipo === "LINK" && "🔗"}
                {recurso.tipo === "EXERCICIO" && "✏️"}
              </div>
              <h4 style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                {recurso.titulo}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                {recurso.descricao}
              </p>
              <span style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px"
              }}>
                {recurso.tipo === "VIDEO" && " Vídeo"}
                {recurso.tipo === "DOCUMENTO" && " Documento"}
                {recurso.tipo === "LINK" && "Link"}
                {recurso.tipo === "EXERCICIO" && "Exercício"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CalouroCard({ icon, label, value, detail, color }: any) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <span style={{ fontSize: "24px" }}>{icon}</span>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>{label}</p>
      </div>
      <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{value}</p>
      <p style={{ color: color, fontSize: "12px", marginTop: "4px" }}>{detail}</p>
    </div>
  )
}