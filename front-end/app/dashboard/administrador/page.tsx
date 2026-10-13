"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  Users, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  Plus, 
  FileText, 
  Activity, 
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import MicroChatModal from "../../components/MicroChatModal"

interface CalouroMembro {
  calouro_id: number
  usuario_id?: number
  nome: string
  ra: string
  email: string
}

interface GrupoAtivo {
  id: number
  nome: string
  descricao: string
  status: string
  mentor_id: number | null
  mentor_nome: string | null
  mentor_email: string | null
  mentor_usuario_id?: number | null
  proximo_encontro: string | null
  calouros: CalouroMembro[]
}

interface EncontroItem {
  id: number
  titulo: string
  descricao: string
  data_hora: string
  duracao: number
  local: string
  status: "AGENDADO" | "REALIZADO" | "CANCELADO"
  presentes_count: number
  total_esperado: number
}

interface Movimentacao {
  id: number
  tipo: string
  descricao: string
  created_at: string
}

export default function AdministradorPainelPage() {
  const router = useRouter()
  const [data, setData] = useState<{
    admin: any
    grupoAtivo: GrupoAtivo | null
    totalCalouros: number
    totalEncontros: number
    encontrosAgendados: EncontroItem[]
    encontrosRealizados: EncontroItem[]
    calouros: CalouroMembro[]
    movimentacoes: Movimentacao[]
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [chatTarget, setChatTarget] = useState<{ id: number; nome: string; role: string; grupoId: number } | null>(null)

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
      const res = await fetch('/api/dashboard/admin-resumo', { headers: getHeaders() })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleGerarRelatorioPdf = async (grupoId: number) => {
    try {
      const res = await fetch(`/api/grupos/${grupoId}/relatorio-frequencia`, { headers: getHeaders() })
      if (!res.ok) return
      const rel = await res.json()
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Frequência - ${rel.grupo.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
            .meta { display: flex; gap: 24px; font-size: 13px; margin-bottom: 20px; }
            .metric-box { display: inline-block; padding: 10px 18px; background: #f4f4f4; border-radius: 8px; margin-right: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background: #f8f8f8; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório Oficial de Frequência - Padawan ON</h1>
            <p>Universidade Católica de Pernambuco • Ciência da Computação</p>
          </div>
          <div class="meta">
            <div><strong>Grupo:</strong> ${rel.grupo.nome}</div>
            <div><strong>Mentor:</strong> ${rel.grupo.mentor_nome || "Não atribuído"}</div>
            <div><strong>Administrador:</strong> ${rel.grupo.admin_nome || "Administrador do Grupo"}</div>
          </div>
          <div>
            <div class="metric-box">
              <div style="font-size: 11px; color: #666;">Encontros Realizados</div>
              <div style="font-size: 18px; font-weight: bold;">${rel.totalEncontrosRealizados}</div>
            </div>
            <div class="metric-box">
              <div style="font-size: 11px; color: #666;">Taxa de Engajamento</div>
              <div style="font-size: 18px; font-weight: bold;">${rel.porcentagemPresencaGeral}%</div>
            </div>
            <div class="metric-box">
              <div style="font-size: 11px; color: #666;">Calouros Vinculados</div>
              <div style="font-size: 18px; font-weight: bold;">${rel.totalCalouros}</div>
            </div>
          </div>
          <h2 style="font-size: 15px; margin-top: 24px;">Frequência Nominal dos Calouros</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>RA</th>
                <th>Presenças</th>
                <th>Encontros</th>
                <th>Taxa</th>
              </tr>
            </thead>
            <tbody>
              ${(((rel.frequenciaPorCalouro || rel.calouros || []) as any[]).map((c: any) => `
                <tr>
                  <td>${c.nome}</td>
                  <td>${c.ra}</td>
                  <td>${c.presencas}</td>
                  <td>${c.total_encontros ?? c.totalEncontros ?? 0}</td>
                  <td><strong>${c.taxa_frequencia ?? c.porcentagemEngajamento ?? 0}%</strong></td>
                </tr>
              `).join(''))}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `)
      printWindow.document.close()
    } catch (err) {
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.4)" }}>
        Carregando painel do administrador...
      </div>
    )
  }

  const grupo = data?.grupoAtivo

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={28} color="#60a5fa" /> Olá, {data?.admin?.nome || "Administrador"}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Painel Administrativo do Grupo • {grupo ? grupo.nome : "Aguardando Vínculo de Grupo"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={carregarResumo}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#60a5fa",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <RefreshCw size={14} /> Atualizar
          </button>
          <button
            onClick={() => router.push("/dashboard/encontros")}
            style={{
              padding: "10px 18px",
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
        padding: "22px 26px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "600", letterSpacing: "1px" }}>
            Grupo Sob Sua Administração
          </span>
          <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginTop: "2px" }}>
            {grupo ? grupo.nome : "Nenhum Grupo Atribuído"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>
            {grupo?.descricao || "O Orientador Geral formará seu grupo de mentoria com os veteranos."}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              Mentor Designado:
            </span>
            <span style={{ color: "#d3fc72", fontWeight: "600", fontSize: "13px" }}>
              {grupo?.mentor_nome || "Não atribuído"}
            </span>
            {grupo?.mentor_usuario_id && (
              <button
                onClick={() => setChatTarget({
                  id: grupo.mentor_usuario_id!,
                  nome: grupo.mentor_nome || "Mentor",
                  role: "MENTOR",
                  grupoId: grupo.id
                })}
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "rgba(211,252,114,0.12)",
                  border: "1px solid rgba(211,252,114,0.3)",
                  color: "#d3fc72",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <MessageSquare size={11} /> Micro-Chat
              </button>
            )}
          </div>
        </div>

        {grupo && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => handleGerarRelatorioPdf(grupo.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(211,252,114,0.1)",
                border: "1px solid rgba(211,252,114,0.25)",
                color: "#d3fc72",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <FileText size={13} /> Relatório PDF
            </button>
            <button
              onClick={() => router.push("/dashboard/grupos")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(96,165,250,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "#60a5fa",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Gerenciar Calouros
            </button>
          </div>
        )}
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
            <Users size={20} color="#60a5fa" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Calouros no Grupo</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.totalCalouros || 0}
          </p>
          <p style={{ color: "#60a5fa", fontSize: "12px", marginTop: "4px" }}>
            Alocados sob sua liderança
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Calendar size={20} color="#d3fc72" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Encontros Realizados</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.encontrosRealizados?.length || 0}
          </p>
          <p style={{ color: "#d3fc72", fontSize: "12px", marginTop: "4px" }}>
            Com registro de presença
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
            {data?.encontrosAgendados?.length || 0}
          </p>
          <p style={{ color: "#a78bfa", fontSize: "12px", marginTop: "4px" }}>
            Sessões programadas
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "20px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              Calouros Integrantes do Grupo ({data?.calouros?.length || 0})
            </h3>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              Canal de Feedbacks
            </span>
          </div>

          {!data?.calouros || data.calouros.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              Nenhum calouro vinculado ao seu grupo ainda.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.calouros.map((calouro) => (
                <div key={calouro.calouro_id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                      {calouro.nome}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                      RA: {calouro.ra} • {calouro.email}
                    </p>
                  </div>
                  {calouro.usuario_id && (
                    <button
                      onClick={() => setChatTarget({
                        id: calouro.usuario_id!,
                        nome: calouro.nome,
                        role: "CALOURO",
                        grupoId: grupo?.id || 0
                      })}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "rgba(96,165,250,0.12)",
                        border: "1px solid rgba(96,165,250,0.25)",
                        color: "#60a5fa",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <MessageSquare size={13} /> Micro-Chat
                    </button>
                  )}
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
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              Movimentações do Seu Grupo
            </h3>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              Isolamento de Escopo
            </span>
          </div>

          {!data?.movimentacoes || data.movimentacoes.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              Nenhuma movimentação registrada neste grupo.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.movimentacoes.map((mov) => (
                <div key={mov.id} style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.03)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start"
                }}>
                  <Activity size={15} color="#60a5fa" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p style={{ color: "white", fontSize: "12px", lineHeight: "1.4" }}>
                      {mov.descricao}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "2px" }}>
                      {new Date(mov.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {chatTarget && (
        <MicroChatModal
          onClose={() => setChatTarget(null)}
          destinatarioId={chatTarget.id}
          destinatarioNome={chatTarget.nome}
          destinatarioRole={chatTarget.role}
          grupoId={chatTarget.grupoId}
        />
      )}
    </div>
  )
}

