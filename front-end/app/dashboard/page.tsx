"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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

interface EncontroRecente {
  id: string
  mentor: string
  calouro: string
  data: string
  status: "REALIZADO" | "PENDENTE" | "CANCELADO"
  tema: string
}

interface AtividadeRecente {
  id: string
  tipo: "MENTOR_ADICIONADO" | "CALOURO_ADICIONADO" | "GRUPO_CRIADO" | "ENCONTRO_MARCADO"
  descricao: string
  data: string
  usuario: string
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
  const [encontrosRecentes, setEncontrosRecentes] = useState<EncontroRecente[]>([])
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([])
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "mes">("semana")

  useEffect(() => {
    // Simulando dados da API
    carregarDados()
  }, [])

  const carregarDados = () => {
    setStats({
      totalMentores: 24,
      totalCalouros: 156,
      totalGrupos: 18,
      encontrosHoje: 7,
      gruposAtivos: 15,
      mentoresDisponiveis: 10,
      calourosSemGrupo: 23,
      taxaSucesso: 92
    })

    setEncontrosRecentes([
      { 
        id: "1", 
        mentor: "João Silva", 
        calouro: "Maria Santos", 
        data: "2024-12-10T14:00:00", 
        status: "REALIZADO",
        tema: "Introdução à Programação"
      },
      { 
        id: "2", 
        mentor: "Pedro Costa", 
        calouro: "Ana Oliveira", 
        data: "2024-12-10T15:30:00", 
        status: "PENDENTE",
        tema: "Revisão de Prova"
      },
      { 
        id: "3", 
        mentor: "Carlos Lima", 
        calouro: "Paulo Souza", 
        data: "2024-12-10T16:00:00", 
        status: "CANCELADO",
        tema: "Projeto Final"
      },
      { 
        id: "4", 
        mentor: "Mariana Costa", 
        calouro: "Julia Ferreira", 
        data: "2024-12-11T10:00:00", 
        status: "PENDENTE",
        tema: "Algoritmos"
      },
    ])

    setAtividadesRecentes([
      {
        id: "1",
        tipo: "GRUPO_CRIADO",
        descricao: "Novo grupo formado com mentor João Silva e 3 calouros",
        data: "2024-12-10T09:00:00",
        usuario: "Admin"
      },
      {
        id: "2",
        tipo: "MENTOR_ADICIONADO",
        descricao: "Mariana Costa foi adicionada como mentora",
        data: "2024-12-09T16:30:00",
        usuario: "Admin"
      },
      {
        id: "3",
        tipo: "ENCONTRO_MARCADO",
        descricao: "Encontro agendado entre Pedro Costa e Ana Oliveira",
        data: "2024-12-09T14:00:00",
        usuario: "Pedro Costa"
      },
      {
        id: "4",
        tipo: "CALOURO_ADICIONADO",
        descricao: "Novo calouro cadastrado: Rafael Santos",
        data: "2024-12-08T11:00:00",
        usuario: "Admin"
      },
    ])
  }

  return (
    <div>
      {/* Header com período */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            📊 Visão Geral do Programa
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Acompanhe todas as métricas e atividades do programa Padawan
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPeriodo("hoje")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: periodo === "hoje" ? "rgba(211,252,114,0.2)" : "transparent",
              color: periodo === "hoje" ? "#d3fc72" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriodo("semana")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: periodo === "semana" ? "rgba(211,252,114,0.2)" : "transparent",
              color: periodo === "semana" ? "#d3fc72" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriodo("mes")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: periodo === "mes" ? "rgba(211,252,114,0.2)" : "transparent",
              color: periodo === "mes" ? "#d3fc72" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Mês
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <StatCard
          icon="👥"
          label="Mentores"
          value={stats.totalMentores}
          detail={`${stats.mentoresDisponiveis} disponíveis`}
          color="#5531cc"
        />
        <StatCard
          icon="👶"
          label="Calouros"
          value={stats.totalCalouros}
          detail={`${stats.calourosSemGrupo} sem grupo`}
          color="#d3fc72"
        />
        <StatCard
          icon="🤝"
          label="Grupos"
          value={stats.gruposAtivos}
          detail={`${stats.totalGrupos} total`}
          color="#ff6b6b"
        />
        <StatCard
          icon="📅"
          label="Encontros Hoje"
          value={stats.encontrosHoje}
          detail={`${stats.taxaSucesso}% taxa de sucesso`}
          color="#4ecdc4"
        />
      </div>

      {/* Gráfico de Progresso (simplificado) */}
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
            📈 Progresso do Programa
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <ProgressBar label="Calouros com Mentoria" value={85} color="#d3fc72" />
            <ProgressBar label="Grupos Ativos" value={83} color="#5531cc" />
            <ProgressBar label="Encontros Realizados" value={72} color="#4ecdc4" />
            <ProgressBar label="Satisfação dos Calouros" value={91} color="#ff6b6b" />
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
            🎯 Status do Programa
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <StatusItem label="Mentores Ativos" value={stats.mentoresDisponiveis} total={stats.totalMentores} />
            <StatusItem label="Grupos Formados" value={stats.gruposAtivos} total={stats.totalCalouros} />
            <StatusItem label="Encontros Realizados" value={45} total={62} />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <QuickAction
          icon="👤"
          title="Adicionar Mentor"
          description="Novo mentor no programa"
          onClick={() => router.push("/dashboard/mentores")}
          color="#5531cc"
        />
        <QuickAction
          icon="👶"
          title="Adicionar Calouro"
          description="Novo calouro cadastrado"
          onClick={() => router.push("/dashboard/calouros")}
          color="#d3fc72"
        />
        <QuickAction
          icon="👥"
          title="Formar Grupo"
          description="Criar novo grupo de mentoria"
          onClick={() => router.push("/dashboard/grupos")}
          color="#ff6b6b"
        />
        <QuickAction
          icon="📊"
          title="Relatórios"
          description="Gerar relatórios do programa"
          onClick={() => router.push("/dashboard/relatorios")}
          color="#4ecdc4"
        />
      </div>

      {/* Encontros Recentes e Atividades */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
      }}>
        {/* Encontros Recentes */}
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
              📅 Encontros Recentes
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
            {encontrosRecentes.slice(0, 3).map((encontro) => (
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
                    {encontro.mentor} → {encontro.calouro}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                    📚 {encontro.tema} • {new Date(encontro.data).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  background: encontro.status === "REALIZADO" ? "rgba(211,252,114,0.2)" :
                            encontro.status === "PENDENTE" ? "rgba(85,49,204,0.2)" :
                            "rgba(255,107,107,0.2)",
                  color: encontro.status === "REALIZADO" ? "#d3fc72" :
                         encontro.status === "PENDENTE" ? "#5531cc" :
                         "#ff6b6b"
                }}>
                  {encontro.status === "REALIZADO" ? "✅ Realizado" :
                   encontro.status === "PENDENTE" ? "⏳ Pendente" :
                   "❌ Cancelado"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
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
              🔄 Atividades Recentes
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
              Ver todas
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {atividadesRecentes.slice(0, 3).map((atividade) => (
              <div key={atividade.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.03)"
              }}>
                <span style={{ fontSize: "20px" }}>
                  {atividade.tipo === "MENTOR_ADICIONADO" && "🧑‍🎓"}
                  {atividade.tipo === "CALOURO_ADICIONADO" && "👶"}
                  {atividade.tipo === "GRUPO_CRIADO" && "👥"}
                  {atividade.tipo === "ENCONTRO_MARCADO" && "📅"}
                </span>
                <div>
                  <p style={{ color: "white", fontSize: "14px" }}>{atividade.descricao}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                    {new Date(atividade.data).toLocaleString('pt-BR')} • por {atividade.usuario}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componentes auxiliares
function StatCard({ icon, label, value, detail, color }: any) {
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
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)"
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = `0 0 40px ${color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)"
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
      <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
        {title}
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>{description}</p>
    </div>
  )
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "4px"
      }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{label}</span>
        <span style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{value}%</span>
      </div>
      <div style={{
        width: "100%",
        height: "6px",
        borderRadius: "3px",
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: "3px",
          background: color,
          transition: "width 1s ease"
        }} />
      </div>
    </div>
  )
}

function StatusItem({ label, value, total }: any) {
  const percentage = Math.round((value / total) * 100)
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