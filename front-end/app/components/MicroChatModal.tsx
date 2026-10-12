"use client"

import { useState, useEffect } from "react"
import { Send, MessageSquare, X } from "lucide-react"

interface Mensagem {
  id: number
  remetente_id: number
  destinatario_id: number
  remetente_nome: string
  remetente_role: string
  conteudo: string
  tipo: string
  created_at: string
}

interface MicroChatModalProps {
  destinatarioId: number
  destinatarioNome: string
  destinatarioRole: string
  grupoId?: number | null
  onClose: () => void
}

const FEEDBACKS_PRONTOS = [
  "Preciso falar com você!",
  "Olá! Como estão os estudos essa semana?",
  "Obrigado pelo apoio no último encontro!",
  "Gostaria de tirar uma dúvida sobre a matéria.",
  "Excelente condução do encontro de hoje!",
  "Quando será nossa próxima sessão de tutoria?",
  "Material de estudo recebido e revisado com sucesso."
]

export default function MicroChatModal({
  destinatarioId,
  destinatarioNome,
  destinatarioRole,
  grupoId,
  onClose
}: MicroChatModalProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [texto, setTexto] = useState("")
  const [isEnviando, setIsEnviando] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setCurrentUserId(u.id)
      } catch (e) {}
    }
    carregarMensagens()
  }, [destinatarioId])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarMensagens = async () => {
    try {
      const res = await fetch(`/api/mensagens?destinatarioId=${destinatarioId}`, {
        headers: getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        setMensagens(data)
      }
    } catch (e) {}
  }

  const handleEnviar = async (conteudoMensagem: string) => {
    const msg = (conteudoMensagem || texto).trim()
    if (!msg) return

    setIsEnviando(true)
    try {
      const res = await fetch('/api/mensagens', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          grupoId: grupoId || null,
          destinatarioId,
          conteudo: msg,
          tipo: 'CHAT'
        })
      })
      if (res.ok) {
        setTexto("")
        carregarMensagens()
      }
    } catch (e) {
    } finally {
      setIsEnviando(false)
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "20px"
    }}>
      <div style={{
        background: "#121212",
        borderRadius: "18px",
        width: "100%",
        maxWidth: "520px",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 20px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageSquare size={18} color="#d3fc72" />
              Micro-Chat & Feedbacks
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>
              Conversa com {destinatarioNome} ({destinatarioRole})
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {mensagens.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              Nenhuma mensagem ainda. Envie uma interação ou escolha um feedback pronto abaixo!
            </div>
          ) : (
            mensagens.map((msg) => {
              const ehMinha = msg.remetente_id === currentUserId
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: ehMinha ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: ehMinha ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: ehMinha ? "rgba(211,252,114,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${ehMinha ? "rgba(211,252,114,0.3)" : "rgba(255,255,255,0.08)"}`,
                    color: "white",
                    fontSize: "13px"
                  }}
                >
                  <p style={{ 
                    fontSize: "11px", 
                    color: ehMinha ? "#d3fc72" : "#a78bfa",
                    fontWeight: "600",
                    marginBottom: "4px" 
                  }}>
                    {ehMinha ? "Você" : msg.remetente_nome}
                  </p>
                  <p style={{ lineHeight: "1.4" }}>{msg.conteudo}</p>
                  <span style={{ 
                    display: "block", 
                    textAlign: "right", 
                    fontSize: "10px", 
                    color: "rgba(255,255,255,0.3)", 
                    marginTop: "4px" 
                  }}>
                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })
          )}
        </div>

        <div style={{
          padding: "10px 16px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.05)"
        }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
            Feedbacks rápidos e interações prontas:
          </p>
          <div style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "6px"
          }}>
            {FEEDBACKS_PRONTOS.map((fb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleEnviar(fb)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "5px 10px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                {fb}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEnviar(texto)
          }}
          style={{
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: "8px"
          }}
        >
          <input
            type="text"
            placeholder="Digite sua mensagem ou feedback..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              fontSize: "13px",
              outline: "none"
            }}
          />
          <button
            type="submit"
            disabled={isEnviando || !texto.trim()}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              background: "#d3fc72",
              color: "black",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: isEnviando || !texto.trim() ? 0.5 : 1
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  )
}

