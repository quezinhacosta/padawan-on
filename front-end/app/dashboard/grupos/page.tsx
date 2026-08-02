"use client"

import { useState } from "react"

interface Grupo {
  id: string
  nome: string
  mentor: string
  calouros: string[]
  status: "ATIVO" | "PENDENTE" | "FINALIZADO"
  dataCriacao: string
  proximoEncontro: string
}

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([
    {
      id: "1",
      nome: "Grupo Alpha",
      mentor: "João Silva",
      calouros: ["Ana Oliveira", "Paulo Souza", "Maria Santos"],
      status: "ATIVO",
      dataCriacao: "2024-12-01",
      proximoEncontro: "2024-12-15 14:00"
    },
    {
      id: "2",
      nome: "Grupo Beta",
      mentor: "Maria Santos",
      calouros: ["Carlos Lima", "Fernanda Costa"],
      status: "PENDENTE",
      dataCriacao: "2024-12-05",
      proximoEncontro: "2024-12-18 15:30"
    },
  ])

  const [showModal, setShowModal] = useState(false)

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
            👥 Gerenciar Grupos
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>
            Crie e gerencie grupos de mentoria
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
            color: "black",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          + Formar Novo Grupo
        </button>
      </div>

      {/* Grid de Grupos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px"
      }}>
        {grupos.map((grupo) => (
          <div key={grupo.id} style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "12px"
            }}>
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                  {grupo.nome}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  👨‍🏫 Mentor: {grupo.mentor}
                </p>
              </div>
              <span style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                background: grupo.status === "ATIVO" ? "rgba(211,252,114,0.2)" :
                          grupo.status === "PENDENTE" ? "rgba(255,165,0,0.2)" :
                          "rgba(255,107,107,0.2)",
                color: grupo.status === "ATIVO" ? "#d3fc72" :
                       grupo.status === "PENDENTE" ? "#ffa500" :
                       "#ff6b6b"
              }}>
                {grupo.status === "ATIVO" ? "✅ Ativo" :
                 grupo.status === "PENDENTE" ? "⏳ Pendente" :
                 "❌ Finalizado"}
              </span>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "4px" }}>
                Calouros ({grupo.calouros.length}):
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {grupo.calouros.map((calouro, index) => (
                  <span key={index} style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.6)"
                  }}>
                    {calouro}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                  📅 Próximo encontro
                </p>
                <p style={{ color: "white", fontSize: "14px" }}>
                  {new Date(grupo.proximoEncontro).toLocaleString('pt-BR')}
                </p>
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
                  Ver Detalhes
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
                  Gerenciar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação de Grupo (simplificado) */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#1a1a1a",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
              Formar Novo Grupo
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>
              Selecione um mentor e os calouros para formar um novo grupo
            </p>

            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", display: "block", marginBottom: "4px" }}>
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Grupo Alpha"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", display: "block", marginBottom: "4px" }}>
                  Mentor Responsável
                </label>
                <select style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08