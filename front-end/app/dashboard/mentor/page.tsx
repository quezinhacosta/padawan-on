"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  UserCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Mail, 
  Plus, 
  ArrowRight,
  Activity,
  MessageSquare,
  ShieldAlert
} from "lucide-react"
import MicroChatModal from "../../components/MicroChatModal"

interface CalouroItem {
  id: number
  nome: string
  email: string
  ra: string
  curso: string
  periodo: string
  usuario_id?: number
}

interface GrupoData {
  id: number
  nome: string
  descricao: string
  status: string
  admin_nome?: string
  proximo_encontro?: string
}

interface Movimentacao {
  id: number
  tipo: string
  descricao: string
  created_at: string
  usuario_nome?: string
}

interface MentorData {
  mentor: {
    id: number
    nome: string
    email: string
    ra: string
    disponivel: boolean | number
    max_calouros: number
    especialidades: string
  }
  grupo: GrupoData | null
  totalCalouros: number
  maxCalouros: number
  disponivel: boolean
  encontrosAgendadosCount: number
  encontrosRealizadosCount: number
  proximosEncontros: any[]
  calouros: CalouroItem[]
  movimentacoes: Movimentacao[]
}

export default function MentorDashboard() {
  const router = useRouter()
  const [data, setData] = useState<MentorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatCalouro, setChatCalouro] = useState<CalouroItem | null>(null)

  useEffect(() => {
    carregarResumo()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarResumo = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboard/mentor-resumo', { headers: getHeaders() })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDisponibilidade = async () => {
    if (!data?.mentor?.id) return
    const novoStatus = !data.disponivel

    try {
      const res = await fetch(`/api/mentores/${data.mentor.id}/disponibilidade`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ disponivel: novoStatus })
      })
      if (res.ok) {
        setData({
          ...data,
          disponivel: novoStatus,
          mentor: { ...data.mentor, disponivel: novoStatus }
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
        Carregando painel do mentor...
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
            <UserCheck size={28} color="#d3fc72" /> Olá, {data?.mentor?.nome || "Mentor"}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Acompanhamento de Calouros • {data?.grupo ? data.grupo.nome : "Aguardando Alocação em Grupo"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={handleToggleDisponibilidade}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: data?.disponivel ? "rgba(211,252,114,0.15)" : "rgba(255,107,107,0.15)",
              border: `1px solid ${data?.disponivel ? "rgba(211,252,114,0.3)" : "rgba(255,107,107,0.3)"}`,
              color: data?.disponivel ? "#d3fc72" : "#ff6b6b",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            {data?.disponivel ? "Disponível para Mentoria" : "Ocupado / Indisponível"}
          </button>
          <button
            onClick={() => router.push("/dashboard/encontros")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
              border: "none",
              color: "black",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Plus size={16} /> Agendar Encontro
          </button>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "20px 24px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#a78bfa", fontWeight: "600", letterSpacing: "1px" }}>
            Grupo em que Você Está Inserido
          </span>
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginTop: "2px" }}>
            {data?.grupo ? data.grupo.nome : "Sem Grupo Atribuído"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "2px" }}>
            {data?.grupo?.descricao || "Você atua sob orientação do Administrador do programa."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {data?.grupo?.admin_nome && (
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Administrador do Grupo:</span>
              <p style={{ color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}>{data.grupo.admin_nome}</p>
            </div>
          )}
          <span style={{
            padding: "6px 14px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            background: "rgba(211,252,114,0.15)",
            color: "#d3fc72"
          }}>
            Vínculo Permanente
          </span>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Users size={20} color="#d3fc72" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Meus Calouros no Grupo</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.totalCalouros || 0} / {data?.maxCalouros || 5}
          </p>
          <p style={{ color: "#d3fc72", fontSize: "12px", marginTop: "4px" }}>
            Sob sua mentoria direta
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Clock size={20} color="#a78bfa" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Encontros Agendados</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.encontrosAgendadosCount || 0}
          </p>
          <p style={{ color: "#a78bfa", fontSize: "12px", marginTop: "4px" }}>
            Reuniões do seu grupo
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <CheckCircle2 size={20} color="#4ecdc4" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Encontros Realizados</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.encontrosRealizadosCount || 0}
          </p>
          <p style={{ color: "#4ecdc4", fontSize: "12px", marginTop: "4px" }}>
            Sessões concluídas
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="#d3fc72" /> Meus Calouros (Micro-Chat & Feedback)
            </h3>
            <button
              onClick={() => router.push("/dashboard/meus-calouros")}
              style={{
                background: "transparent",
                border: "none",
                color: "#d3fc72",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Ver todos <ArrowRight size={14} />
            </button>
          </div>

          {!data?.calouros || data.calouros.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              Nenhum calouro vinculado ao seu grupo no momento.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.calouros.map((c) => (
                <div key={c.id} style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{c.nome}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                      RA: {c.ra} • {c.curso}
                    </p>
                  </div>
                  <button
                    onClick={() => setChatCalouro(c)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      background: "rgba(211,252,114,0.1)",
                      border: "1px solid rgba(211,252,114,0.3)",
                      color: "#d3fc72",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <MessageSquare size={13} /> Micro-Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color="#a78bfa" /> Movimentações do Seu Grupo
            </h3>
          </div>

          {!data?.movimentacoes || data.movimentacoes.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              Nenhuma movimentação registrada recentemente neste grupo.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.movimentacoes.map((mov) => (
                <div key={mov.id} style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <p style={{ color: "white", fontSize: "13px" }}>{mov.descricao}</p>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px", display: "block" }}>
                    {new Date(mov.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color="#d3fc72" /> Próximos Encontros do Grupo
          </h3>
          <button
            onClick={() => router.push("/dashboard/encontros")}
            style={{
              background: "transparent",
              border: "none",
              color: "#d3fc72",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Gerenciar agenda <ArrowRight size={14} />
          </button>
        </div>

        {!data?.proximosEncontros || data.proximosEncontros.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            Nenhum encontro agendado para seu grupo. Clique em "Agendar Encontro" para criar uma nova sessão.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {data.proximosEncontros.map((enc) => (
              <div key={enc.id} style={{
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)"
              }}>
                <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{enc.titulo}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={12} /> {enc.local} • {new Date(enc.data_hora).toLocaleString('pt-BR')}
                </p>
                {enc.tema && (
                  <span style={{
                    display: "inline-block",
                    marginTop: "6px",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    background: "rgba(211,252,114,0.1)",
                    color: "#d3fc72",
                    fontSize: "11px"
                  }}>
                    Tema: {enc.tema}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {chatCalouro && (
        <MicroChatModal
          destinatarioId={chatCalouro.usuario_id || chatCalouro.id}
          destinatarioNome={chatCalouro.nome}
          destinatarioRole="Calouro"
          grupoId={data?.grupo?.id || null}
          onClose={() => setChatCalouro(null)}
        />
      )}
    </div>
  )
}