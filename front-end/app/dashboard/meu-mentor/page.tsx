"use client"

import { useState, useEffect } from "react"
import { UserCheck, Mail, MessageSquare } from "lucide-react"
import MicroChatModal from "../../components/MicroChatModal"

interface CalouroPerfil {
  mentor_id: number | null
  mentor_usuario_id: number | null
  mentor_nome: string | null
  mentor_email: string | null
  mentor_disponivel: boolean | number | null
  grupo_id: number | null
  grupo_nome: string | null
}

export default function MeuMentorPage() {
  const [perfil, setPerfil] = useState<CalouroPerfil | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    carregarPerfil()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarPerfil = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/calouros/meu-perfil', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setPerfil(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <UserCheck size={28} color="#d3fc72" /> Informações do Meu Mentor
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
          Detalhes de contato e canal de apoio para tirar dúvidas acadêmicas
        </p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
          Carregando informações do mentor...
        </div>
      ) : !perfil?.mentor_nome ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          <p style={{ fontSize: "18px", color: "white", marginBottom: "6px" }}>
            Você ainda não possui um mentor atribuído.
          </p>
          <p style={{ fontSize: "14px" }}>
            A coordenação de apadrinhamento alocará seu grupo em breve. Fique atento aos comunicados!
          </p>
        </div>
      ) : (
        <div style={{
          maxWidth: "600px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "20px",
          padding: "32px",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d3fc72, #5531cc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "black"
            }}>
              {perfil.mentor_nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                {perfil.mentor_nome}
              </h2>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Mentor do {perfil.grupo_nome}
              </span>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                background: perfil.mentor_disponivel ? "rgba(211,252,114,0.2)" : "rgba(255,107,107,0.2)",
                color: perfil.mentor_disponivel ? "#d3fc72" : "#ff6b6b"
              }}>
                {perfil.mentor_disponivel ? "Disponível" : "Ocupado"}
              </span>
            </div>
          </div>

          <div style={{
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "14px"
          }}>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Canal Oficial de Comunicação:
            </p>
            <p style={{ color: "#d3fc72", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
              <Mail size={16} /> {perfil.mentor_email}
            </p>
          </div>

          <button
            onClick={() => setShowChat(true)}
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
              color: "black",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 0 25px rgba(211,252,114,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <MessageSquare size={16} /> Abrir Micro-Chat & Feedbacks
          </button>

          {showChat && perfil.mentor_usuario_id && (
            <MicroChatModal
              destinatarioId={perfil.mentor_usuario_id}
              destinatarioNome={perfil.mentor_nome}
              destinatarioRole="Mentor"
              grupoId={perfil.grupo_id}
              onClose={() => setShowChat(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
