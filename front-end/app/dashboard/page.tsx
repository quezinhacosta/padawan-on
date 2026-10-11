"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Calendar, 
  BarChart3, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Activity,
  ArrowRight
} from "lucide-react"

interface DashboardStats {
  totalMentores: number
  totalCalouros: number
  totalGrupos: number
  encontrosHoje: number
  gruposAtivos: number
  mentoresDisponiveis: number
  calourosSemGrupo: number
  taxaSucesso: number
}

interface EncontroItem {
  id: number | string
  titulo: string
  grupo_nome: string
  mentor_nome: string
  data_hora: string
  status: "AGENDADO" | "REALIZADO" | "CANCELADO"
  tema: string
  local: string
}

interface AtividadeItem {
  id: number | string
  tipo: string
  descricao: string
  created_at: string
  usuario_nome?: string
}

export default function DashboardHome() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalMentores: 0,
    totalCalouros: 0,
    totalGrupos: 0,
    encontrosHoje: 0,
    gruposAtivos: 0,
    mentoresDisponiveis: 0,
    calourosSemGrupo: 0,
    taxaSucesso: 0
  })
  const [encontrosRecentes, setEncontrosRecentes] = useState<EncontroItem[]>([])
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    try {
      const resStats = await fetch('/api/dashboard/stats', { headers })
      if (resStats.ok) {
        const dataStats = await resStats.json()
        setStats(dataStats)
      }

      const resEncontros = await fetch('/api/encontros', { headers })
      if (resEncontros.ok) {
        const dataEncontros = await resEncontros.json()
        setEncontrosRecentes(dataEncontros.slice(0, 4))
      }

      const resAtividades = await fetch('/api/dashboard/atividades', { headers })
      if (resAtividades.ok) {
        const dataAtividades = await resAtividades.json()
        setAtividadesRecentes(dataAtividades.slice(0, 4))
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "white" }}>
            Visão Geral do Programa
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
            Métricas em tempo real e monitoramento do programa de apadrinhamento UNICAP
          </p>
        </div>
        <button
          onClick={carregarDados}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#d3fc72",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <StatCard
          icon={<UserCheck size={22} color="#5531cc" />}
          label="Mentores"
          value={stats.totalMentores}
          detail={`${stats.mentoresDisponiveis} disponíveis`}
          color="#5531cc"
        />
        <StatCard
          icon={<Users size={22} color="#d3fc72" />}
          label="Calouros"
          value={stats.totalCalouros}
          detail={`${stats.calourosSemGrupo} sem grupo`}
          color="#d3fc72"
        />
        <StatCard
          icon={<Users size={22} color="#a78bfa" />}
          label="Grupos Ativos"
          value={stats.gruposAtivos}
          detail={`${stats.totalGrupos} cadastrados`}
          color="#a78bfa"
        />
        <StatCard
          icon={<Calendar size={22} color="#4ecdc4" />}
          label="Taxa de Frequência"
          value={`${stats.taxaSucesso}%`}
          detail={`${stats.encontrosHoje} encontros hoje`}
          color="#4ecdc4"
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
            Indicadores de Acolhimento
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <ProgressBar 
              label="Calouros Alocados em Grupos" 
              value={stats.totalCalouros > 0 ? Math.round(((stats.totalCalouros - stats.calourosSemGrupo) / stats.totalCalouros) * 100) : 0} 
              color="#d3fc72" 
            />
            <ProgressBar 
              label="Mentores com Vínculo Ativo" 
              value={stats.totalMentores > 0 ? Math.round(((stats.totalMentores - stats.mentoresDisponiveis) / stats.totalMentores) * 100) : 0} 
              color="#5531cc" 
            />
            <ProgressBar 
              label="Taxa de Assiduidade" 
              value={stats.taxaSucesso || 100} 
              color="#4ecdc4" 
            />
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
            Metas do Semestre
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <StatusItem label="Mentores Ativos" value={stats.mentoresDisponiveis} total={stats.totalMentores || 1} />
            <StatusItem label="Grupos Formados" value={stats.gruposAtivos} total={stats.totalGrupos || 1} />
            <StatusItem label="Calouros Atendidos" value={stats.totalCalouros - stats.calourosSemGrupo} total={stats.totalCalouros || 1} />
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <QuickAction
          icon={<UserCheck size={24} color="#a78bfa" />}
          title="Gerenciar Mentores"
          description="Visualizar e adicionar mentores"
          onClick={() => router.push("/dashboard/mentores")}
          color="#5531cc"
        />
        <QuickAction
          icon={<Users size={24} color="#d3fc72" />}
          title="Gerenciar Calouros"
          description="Acompanhar alunos ingressantes"
          onClick={() => router.push("/dashboard/calouros")}
          color="#d3fc72"
        />
        <QuickAction
          icon={<LayoutDashboard size={24} color="#ff8787" />}
          title="Formar Grupos"
          description="Criar e gerenciar equipes"
          onClick={() => router.push("/dashboard/grupos")}
          color="#ff6b6b"
        />
        <QuickAction
          icon={<Calendar size={24} color="#4ecdc4" />}
          title="Agendar Encontro"
          description="Criar e gerenciar reuniões"
          onClick={() => router.push("/dashboard/encontros")}
          color="#4ecdc4"
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
      }}>
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
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              Próximos Encontros
            </h3>
            <button 
              onClick={() => router.push("/dashboard/encontros")}
              style={{
                padding: "4px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
              Ver todos <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {encontrosRecentes.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Nenhum encontro agendado.</p>
            ) : (
              encontrosRecentes.map((encontro) => (
                <div key={encontro.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.03)"
                }}>
                  <div>
                    <p style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
                      {encontro.titulo}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                      {encontro.grupo_nome} {encontro.mentor_nome ? `• Mentor: ${encontro.mentor_nome}` : ''}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                      {encontro.local} • {new Date(encontro.data_hora).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    background: encontro.status === "REALIZADO" ? "rgba(211,252,114,0.15)" :
                              encontro.status === "AGENDADO" ? "rgba(85,49,204,0.25)" :
                              "rgba(255,107,107,0.15)",
                    color: encontro.status === "REALIZADO" ? "#d3fc72" :
                           encontro.status === "AGENDADO" ? "#a78bfa" :
                           "#ff6b6b"
                  }}>
                    {encontro.status === "REALIZADO" ? "Realizado" :
                     encontro.status === "AGENDADO" ? "Agendado" :
                     "Cancelado"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

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
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
              Registro de Atividades
            </h3>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              Histórico
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {atividadesRecentes.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Nenhuma atividade registrada.</p>
            ) : (
              atividadesRecentes.map((atividade) => (
                <div key={atividade.id} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.03)"
                }}>
                  <div style={{ marginTop: "2px", color: "#d3fc72" }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <p style={{ color: "white", fontSize: "13px", lineHeight: "1.4" }}>{atividade.descricao}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px" }}>
                      {new Date(atividade.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, detail, color }: any) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        {icon}
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{label}</p>
      </div>
      <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{value}</p>
      <p style={{ color: color, fontSize: "12px", marginTop: "4px" }}>{detail}</p>
    </div>
  )
}

function QuickAction({ icon, title, description, onClick, color }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "20px",
        border: `1px solid ${color}33`,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ marginBottom: "10px" }}>{icon}</div>
      <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>
        {title}
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{description}</p>
    </div>
  )
}

function ProgressBar({ label, value, color }: any) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100)
  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px"
      }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{label}</span>
        <span style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{safeValue}%</span>
      </div>
      <div style={{
        width: "100%",
        height: "6px",
        borderRadius: "3px",
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${safeValue}%`,
          height: "100%",
          borderRadius: "3px",
          background: color,
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  )
}

function StatusItem({ label, value, total }: any) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "1px solid rgba(255,255,255,0.03)"
    }}>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{label}</span>
      <div>
        <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{value}</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginLeft: "4px" }}>
          / {total} ({percentage}%)
        </span>
      </div>
    </div>
  )
}