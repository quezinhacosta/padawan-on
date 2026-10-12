"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Trash2, Calendar, UserCheck, FileText, Download, Printer, MessageSquare } from "lucide-react"
import MicroChatModal from "../../components/MicroChatModal"

interface CalouroMembro {
  calouro_id: number
  usuario_id?: number
  nome: string
  ra: string
  email: string
}

interface Grupo {
  id: number
  nome: string
  mentor_id: number | null
  mentor_usuario_id?: number | null
  mentor_nome: string | null
  mentor_email: string | null
  admin_nome?: string | null
  status: "ATIVO" | "PENDENTE" | "FINALIZADO"
  descricao: string
  data_criacao: string
  proximo_encontro: string | null
  calouros: CalouroMembro[]
}

interface MentorOption {
  id: number
  nome: string
  disponivel: boolean
}

interface CalouroOption {
  id: number
  nome: string
  ra: string
  grupo_id: number | null
}

interface AdminOption {
  id: number
  nome: string
}

export default function GruposPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [mentores, setMentores] = useState<MentorOption[]>([])
  const [administradores, setAdministradores] = useState<AdminOption[]>([])
  const [calourosDisponiveis, setCalourosDisponiveis] = useState<CalouroOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")
  const [chatTarget, setChatTarget] = useState<{ id: number; nome: string; role: string; grupoId: number } | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    mentorId: "",
    adminId: "",
    descricao: "",
    calouroIds: [] as number[]
  })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored))
      } catch (e) {}
    }
    carregarDados()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      const headers = getHeaders()

      const resGrupos = await fetch('/api/grupos', { headers })
      if (resGrupos.ok) {
        const data = await resGrupos.json()
        setGrupos(data)
      }

      const resMentores = await fetch('/api/mentores', { headers })
      if (resMentores.ok) {
        const data = await resMentores.json()
        setMentores(data)
      }

      const resUsuarios = await fetch('/api/usuarios?role=ADMINISTRADOR', { headers })
      if (resUsuarios.ok) {
        const dataU = await resUsuarios.json()
        setAdministradores(dataU.map((u: any) => ({ id: u.id, nome: u.nome_completo })))
      }

      const resCalouros = await fetch('/api/calouros', { headers })
      if (resCalouros.ok) {
        const data: CalouroOption[] = await resCalouros.json()
        setCalourosDisponiveis(data)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCalouro = (id: number) => {
    if (formData.calouroIds.includes(id)) {
      setFormData({
        ...formData,
        calouroIds: formData.calouroIds.filter(cId => cId !== id)
      })
    } else {
      setFormData({
        ...formData,
        calouroIds: [...formData.calouroIds, id]
      })
    }
  }

  const handleCriarGrupo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.nome.trim()) {
      setErro("Informe o nome do grupo.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/grupos', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          nome: formData.nome,
          mentorId: formData.mentorId ? Number(formData.mentorId) : null,
          adminId: formData.adminId ? Number(formData.adminId) : null,
          descricao: formData.descricao,
          calouroIds: formData.calouroIds
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao criar grupo.')
        setIsSubmitting(false)
        return
      }

      setFormData({
        nome: "",
        mentorId: "",
        adminId: "",
        descricao: "",
        calouroIds: []
      })
      setShowModal(false)
      carregarDados()
    } catch (err) {
      setErro("Erro de conexão ao salvar grupo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExcluirGrupo = async (id: number, nome: string) => {
    if (!confirm(`Deseja realmente remover o grupo "${nome}"? Esta ação não pode ser desfeita.`)) return

    try {
      const res = await fetch(`/api/grupos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setGrupos(grupos.filter(g => g.id !== id))
      }
    } catch (err) {
    }
  }

  const handleGerarRelatorioPdf = async (grupoId: number) => {
    try {
      const res = await fetch(`/api/grupos/${grupoId}/relatorio-frequencia`, {
        headers: getHeaders()
      })
      if (!res.ok) {
        alert("Não foi possível carregar os dados de frequência do grupo.")
        return
      }

      const data = await res.json()
      const { grupo, totalEncontros, encontrosRealizados, totalCalouros, taxaEngajamentoGeral, calouros, encontros } = data

      const printWindow = window.open('', '_blank', 'width=900,height=700')
      if (!printWindow) {
        alert("Por favor, permita pop-ups para gerar e imprimir o PDF.")
        return
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>Relatório de Frequência - ${grupo.nome}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #111;
              background: #fff;
              line-height: 1.5;
            }
            .header {
              border-bottom: 2px solid #222;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0 0 5px 0;
              font-size: 24px;
              color: #111;
            }
            .header p {
              margin: 2px 0;
              font-size: 13px;
              color: #555;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 25px;
            }
            .metric-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 12px;
              text-align: center;
              background: #f9f9f9;
            }
            .metric-card .val {
              font-size: 22px;
              font-weight: bold;
              margin: 4px 0;
              color: #000;
            }
            .metric-card .lbl {
              font-size: 11px;
              color: #666;
              text-transform: uppercase;
            }
            h2 {
              font-size: 16px;
              margin-top: 25px;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              font-size: 13px;
            }
            th, td {
              border: 1px solid #e0e0e0;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background: #f2f2f2;
              font-weight: 600;
            }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
            }
            .badge-high { background: #dcfce7; color: #15803d; }
            .badge-mid { background: #fef9c3; color: #a16207; }
            .badge-low { background: #fee2e2; color: #b91c1c; }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #eee;
              font-size: 11px;
              color: #888;
              display: flex;
              justifyContent: space-between;
            }
            @media print {
              body { margin: 15mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button onclick="window.print()" style="padding: 8px 18px; font-size: 14px; font-weight: bold; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
              Salvar / Imprimir como PDF
            </button>
          </div>

          <div class="header">
            <h1>Relatório Consolidado de Frequência e Engajamento</h1>
            <p><strong>Programa Padawan ON</strong> • Universidade Católica de Pernambuco (UNICAP)</p>
            <p><strong>Grupo:</strong> ${grupo.nome} • <strong>Mentor:</strong> ${grupo.mentor_nome || "Não atribuído"} (${grupo.mentor_email || "-"})</p>
            <p><strong>Status do Grupo:</strong> ${grupo.status}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="lbl">Total de Encontros</div>
              <div class="val">${totalEncontros}</div>
            </div>
            <div class="metric-card">
              <div class="lbl">Encontros Realizados</div>
              <div class="val">${encontrosRealizados}</div>
            </div>
            <div class="metric-card">
              <div class="lbl">Calouros Vinculados</div>
              <div class="val">${totalCalouros}</div>
            </div>
            <div class="metric-card">
              <div class="lbl">Engajamento Médio</div>
              <div class="val" style="color: ${taxaEngajamentoGeral >= 75 ? '#15803d' : '#a16207'}">${taxaEngajamentoGeral}%</div>
            </div>
          </div>

          <h2>Frequência Nominal dos Calouros</h2>
          <table>
            <thead>
              <tr>
                <th>Nome do Calouro</th>
                <th>RA</th>
                <th>E-mail</th>
                <th>Presenças Registradas</th>
                <th>Total Encontros</th>
                <th>Engajamento</th>
              </tr>
            </thead>
            <tbody>
              ${calouros.length === 0 ? '<tr><td colspan="6" style="text-align:center; color:#888;">Nenhum calouro vinculado a este grupo.</td></tr>' : ''}
              ${calouros.map((c: any) => `
                <tr>
                  <td><strong>${c.nome}</strong></td>
                  <td>${c.ra}</td>
                  <td>${c.email}</td>
                  <td>${c.presencas}</td>
                  <td>${c.totalEncontros}</td>
                  <td>
                    <span class="badge ${c.porcentagemEngajamento >= 75 ? 'badge-high' : c.porcentagemEngajamento >= 50 ? 'badge-mid' : 'badge-low'}">
                      ${c.porcentagemEngajamento}%
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Histórico de Encontros de Tutoria</h2>
          <table>
            <thead>
              <tr>
                <th>Título da Sessão</th>
                <th>Data e Horário</th>
                <th>Local / Modalidade</th>
                <th>Status</th>
                <th>Quórum Presente</th>
              </tr>
            </thead>
            <tbody>
              ${encontros.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:#888;">Nenhum encontro agendado para este grupo.</td></tr>' : ''}
              ${encontros.map((e: any) => `
                <tr>
                  <td><strong>${e.titulo}</strong></td>
                  <td>${new Date(e.data_hora).toLocaleString('pt-BR')}</td>
                  <td>${e.local || 'Online'}</td>
                  <td>${e.status}</td>
                  <td>${e.presentesCount} / ${e.totalEsperado} alunos</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <span>Padawan ON • Relatório Oficial de Extensão Acadêmica</span>
            <span>Gerado em: ${new Date().toLocaleString('pt-BR')}</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `

      printWindow.document.open()
      printWindow.document.write(htmlContent)
      printWindow.document.close()
    } catch (err) {
      alert("Erro ao processar relatório em PDF.")
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
            {currentUser?.role === "ADMINISTRADOR" ? "Meu Grupo de Mentoria" : "Gerenciar Grupos de Mentoria"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
            {currentUser?.role === "ADMINISTRADOR"
              ? "Gerencie os membros, mentores e calouros sob sua administração direta"
              : "Crie novos grupos com administradores, vincule mentores e aloque calouros do programa"}
          </p>
        </div>
        {(currentUser?.role === "ORIENTADOR" || currentUser?.role === "ADMINISTRADOR") && (
          <button
            onClick={() => {
              setErro("")
              setShowModal(true)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
              color: "black",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Plus size={16} /> Formar Novo Grupo
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando grupos...
        </div>
      ) : grupos.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "50px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <p style={{ fontSize: "16px", color: "white", marginBottom: "6px" }}>Nenhum grupo cadastrado</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
            Crie o primeiro grupo clicando no botão acima.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "20px"
        }}>
          {grupos.map((grupo) => (
            <div key={grupo.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}>
                <div>
                  <h3 style={{ color: "white", fontSize: "17px", fontWeight: "600" }}>
                    {grupo.nome}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
                      Mentor: <span style={{ color: "#d3fc72" }}>{grupo.mentor_nome || "Não atribuído"}</span>
                    </p>
                    {grupo.mentor_usuario_id && (
                      <button
                        onClick={() => setChatTarget({
                          id: grupo.mentor_usuario_id!,
                          nome: grupo.mentor_nome || "Mentor",
                          role: "MENTOR",
                          grupoId: grupo.id
                        })}
                        style={{
                          padding: "2px 6px",
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
                        title="Abrir Micro-Chat com Mentor"
                      >
                        <MessageSquare size={11} /> Chat
                      </button>
                    )}
                  </div>
                  {grupo.admin_nome && (
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>
                      Administrador: <span style={{ color: "white" }}>{grupo.admin_nome}</span>
                    </p>
                  )}
                  {grupo.descricao && (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "4px" }}>
                      {grupo.descricao}
                    </p>
                  )}
                </div>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  background: grupo.status === "ATIVO" ? "rgba(211,252,114,0.15)" : "rgba(255,165,0,0.15)",
                  color: grupo.status === "ATIVO" ? "#d3fc72" : "#ffa500"
                }}>
                  {grupo.status}
                </span>
              </div>

              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "8px" }}>
                  Calouros Vinculados ({grupo.calouros.length}):
                </p>
                {grupo.calouros.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
                    Nenhum calouro adicionado ainda.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {grupo.calouros.map((calouro) => (
                      <span key={calouro.calouro_id} style={{
                        padding: "3px 8px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.06)",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.8)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        {calouro.nome}
                        {calouro.usuario_id && (
                          <button
                            onClick={() => setChatTarget({
                              id: calouro.usuario_id!,
                              nome: calouro.nome,
                              role: "CALOURO",
                              grupoId: grupo.id
                            })}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#d3fc72",
                              cursor: "pointer",
                              padding: "0 2px",
                              display: "inline-flex",
                              alignItems: "center"
                            }}
                            title={`Abrir Micro-Chat com ${calouro.nome}`}
                          >
                            <MessageSquare size={10} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "14px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                marginTop: "auto"
              }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                    Próximo encontro
                  </p>
                  <p style={{ color: "white", fontSize: "12px", fontWeight: "500" }}>
                    {grupo.proximo_encontro 
                      ? new Date(grupo.proximo_encontro).toLocaleString('pt-BR') 
                      : "Nenhum agendado"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => handleGerarRelatorioPdf(grupo.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "rgba(211,252,114,0.1)",
                      border: "1px solid rgba(211,252,114,0.25)",
                      color: "#d3fc72",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}
                    title="Baixar Relatório de Frequência em PDF"
                  >
                    <FileText size={13} /> Relatório PDF
                  </button>
                  {(currentUser?.role === "ORIENTADOR" || currentUser?.role === "ADMINISTRADOR") && (
                    <button
                      onClick={() => handleExcluirGrupo(grupo.id, grupo.nome)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,0,0,0.1)",
                        border: "1px solid rgba(255,0,0,0.2)",
                        color: "#ff6b6b",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px"
                      }}
                      title="Excluir Grupo"
                    >
                      <Trash2 size={13} /> Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#121212",
            borderRadius: "18px",
            padding: "28px",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
              Formar Novo Grupo
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "18px" }}>
              Atribua um mentor e selecione os calouros participantes.
            </p>

            {erro && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,0,0,0.2)",
                color: "#ff6b6b",
                fontSize: "13px",
                marginBottom: "14px"
              }}>
                {erro}
              </div>
            )}

            <form onSubmit={handleCriarGrupo} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  placeholder="Nome do grupo de mentoria"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none"
                  }}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              {currentUser?.role === 'ORIENTADOR' && administradores.length > 0 && (
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Administrador / Líder do Grupo
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none"
                    }}
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                  >
                    <option value="">Atribuir administrador...</option>
                    {administradores.map((adm) => (
                      <option key={adm.id} value={adm.id}>
                        {adm.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Mentor Responsável
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none"
                  }}
                  value={formData.mentorId}
                  onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                >
                  <option value="">Selecione um mentor...</option>
                  {mentores.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} {m.disponivel ? "(Disponível)" : "(Ocupado)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Descrição / Objetivo do Grupo
                </label>
                <textarea
                  placeholder="Objetivos do grupo"
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    resize: "none"
                  }}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Calouros para Inserir no Grupo:
                </label>
                <div style={{
                  maxHeight: "140px",
                  overflowY: "auto",
                  padding: "8px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  {calourosDisponiveis.length === 0 ? (
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                      Nenhum calouro cadastrado no sistema.
                    </span>
                  ) : (
                    calourosDisponiveis.map((calouro) => (
                      <label key={calouro.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: "white",
                        cursor: "pointer",
                        padding: "3px"
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.calouroIds.includes(calouro.id)}
                          onChange={() => handleToggleCalouro(calouro.id)}
                          style={{ accentColor: "#d3fc72" }}
                        />
                        <span>{calouro.nome} (RA: {calouro.ra})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
                    border: "none",
                    color: "black",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Salvar Grupo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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