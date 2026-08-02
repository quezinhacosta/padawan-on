"use client"

import { useState } from "react"

interface Mentor {
  id: string
  nome: string
  ra: string
  email: string
  cursos: string[]
  disponivel: boolean
  calourosAtendidos: number
}

export default function MentoresPage() {
  const [mentores, setMentores] = useState<Mentor[]>([
    {
      id: "1",
      nome: "João Silva",
      ra: "2021001",
      email: "joao@unicap.br",
      cursos: ["Ciência da Computação"],
      disponivel: true,
      calourosAtendidos: 3
    },
    {
      id: "2",
      nome: "Maria Santos",
      ra: "2021002",
      email: "maria@unicap.br",
      cursos: ["Ciência da Computação"],
      disponivel: false,
      calourosAtendidos: 5
    },
  ])

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            🧑‍🎓 Gerenciar Mentores
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>
            Gerencie todos os mentores do programa
          </p>
        </div>
        <button style={{
          padding: "10px 24px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
          color: "black",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          fontSize: "14px"
        }}>
          + Adicionar Mentor
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Buscar mentor..."
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            fontSize: "14px",
            flex: 1,
            minWidth: "200px"
          }}
        />
        <select style={{
          padding: "8px 16px",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "white",
          fontSize: "14px"
        }}>
          <option value="">Todos os status</option>
          <option value="disponivel">Disponível</option>
          <option value="indisponivel">Indisponível</option>
        </select>
      </div>

      {/* Lista de Mentores */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mentores.map((mentor) => (
          <div key={mentor.id} style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                <span style={{ fontSize: "20px" }}>🧑‍🎓</span>
                <h3 style={{ color: "white", fontWeight: "600" }}>{mentor.nome}</h3>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  background: mentor.disponivel ? "rgba(211,252,114,0.2)" : "rgba(255,107,107,0.2)",
                  color: mentor.disponivel ? "#d3fc72" : "#ff6b6b"
                }}>
                  {mentor.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "16px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                <span>📧 {mentor.email}</span>
                <span>🆔 {mentor.ra}</span>
                <span>👶 {mentor.calourosAtendidos} calouros</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                cursor: "pointer",
                fontSize: "12px"
              }}>
                Ver Perfil
              </button>
              <button style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(85,49,204,0.2)",
                border: "1px solid rgba(85,49,204,0.3)",
                color: "#5531cc",
                cursor: "pointer",
                fontSize: "12px"
              }}>
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}