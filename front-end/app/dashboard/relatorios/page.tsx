"use client"

import { useState, useEffect } from "react"

interface ReportStats {
  totalMentores: number
  mentoresDisponiveis: number
  totalCalouros: number
  calourosSemGrupo: number
  totalGrupos: number
  gruposAtivos: number
  encontrosHoje: number
  taxaSucesso: number
}

export default function RelatoriosPage() {
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [grupos, setGrupos] = useState<any[]>([])
  const [encontros, setEncontros] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarRelatorios()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarRelatorios = async () => {
    setIsLoading(true)
    try {
      const headers = getHeaders()

      const [resStats, resGrupos, resEnc] = await Promise.all([
        fetch('/api/dashboard/stats', { headers }),
        fetch('/api/grupos', { headers }),
        fetch('/api/encontros', { headers })
      ])

      if (resStats.ok) setStats(await resStats.json())
      if (resGrupos.ok) setGrupos(await resGrupos.json())
      if (resEnc.ok) setEncontros(await resEnc.json())
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const calourosComGrupo = (stats?.totalCalouros || 0) - (stats?.calourosSemGrupo || 0)
  const taxaAlocacao = stats?.totalCalouros ? Math.round((calourosComGrupo / stats.totalCalouros) * 100) : 0

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
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            📈 Relatórios e Indicadores do Programa
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Métricas consolidadas de desempenho, assiduidade e integração dos calouros
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          🖨️ Exportar / Imprimir
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
          Compilando relatórios...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Cartões de Indicadores */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px"
          }}>
            <MetricCard
              titulo="Taxa de Alocação"
              valor={`${taxaAlocacao}%`}
              descricao={`${calourosComGrupo} de ${stats?.totalCalouros} calouros apadrinhados`}
              cor="#d3fc72"
            />
            <MetricCard
              titulo="Grupos Ativos"
              valor={stats?.gruposAtivos || 0}
              descricao={`${stats?.totalGrupos} grupos registrados`}
              cor="#a78bfa"
            />
            <MetricCard
              titulo="Total de Encontros"
              valor={encontros.length}
              descricao={`${encontros.filter(e => e.status === "REALIZADO").length} encontros realizados`}
              cor="#4ecdc4"
            />
            <MetricCard
              titulo="Aproveitamento"
              valor={`${stats?.taxaSucesso || 95}%`}
              descricao="Assiduidade média dos calouros"
              cor="#ff8787"
            />
          </div>

          {/* Desempenho por Grupo */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              👥 Desempenho por Grupo de Mentoria
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                    <th style={{ padding: "12px 16px" }}>Grupo</th>
                    <th style={{ padding: "12px 16px" }}>Mentor Responsável</th>
                    <th style={{ padding: "12px 16px" }}>Calouros</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grupos.map((g) => (
                    <tr key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", color: "white" }}>
                      <td style={{ padding: "14px 16px", fontWeight: "600" }}>{g.nome}</td>
                      <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.8)" }}>
                        {g.mentor_nome || "Não atribuído"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ color: "#d3fc72", fontWeight: "600" }}>{g.calouros?.length || 0}</span> calouros
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          background: g.status === "ATIVO" ? "rgba(211,252,114,0.15)" : "rgba(255,165,0,0.15)",
                          color: g.status === "ATIVO" ? "#d3fc72" : "#ffa500"
                        }}>
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ titulo, valor, descricao, cor }: any) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(255,255,255,0.05)"
    }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{titulo}</p>
      <p style={{ fontSize: "32px", fontWeight: "bold", color: "white", marginTop: "4px" }}>{valor}</p>
      <p style={{ color: cor, fontSize: "12px", marginTop: "6px" }}>{descricao}</p>
    </div>
  )
}

