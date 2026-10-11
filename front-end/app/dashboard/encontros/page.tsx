"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Trash2, Clock, CheckCircle2, ClipboardCheck, MapPin, Users } from "lucide-react"

interface Encontro {
  id: number
  grupo_id: number
  grupo_nome: string
  mentor_nome: string
  titulo: string
  descricao: string
  data_hora: string
  duracao: number
  local: string
  status: "AGENDADO" | "REALIZADO" | "CANCELADO"
  tema: string
  presentes_count: number
  total_esperado: number
  frequencia?: {
    calouro_id: number
    nome_completo: string
    ra: string
    presente: number
    observacao: string
  }[]
}

interface GrupoOption {
  id: number
  nome: string
  mentor_nome: string
}

export default function EncontrosPage() {
  const [encontros, setEncontros] = useState<Encontro[]>([])
  const [grupos, setGrupos] = useState<GrupoOption[]>([])
  const [filtroStatus, setFiltroStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showModalAgendar, setShowModalAgendar] = useState(false)
  const [showModalFrequencia, setShowModalFrequencia] = useState<Encontro | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  const [formData, setFormData] = useState({
    grupoId: "",
    titulo: "",
    descricao: "",
    dataHora: "",
    duracao: 60,
    local: "Google Meet / Sala 301 Bloco A",
    tema: ""
  })

  const [frequenciaRegistros, setFrequenciaRegistros] = useState<{ calouroId: number; presente: number; observacao: string }[]>([])

  useEffect(() => {
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

      const resEnc = await fetch('/api/encontros', { headers })
      if (resEnc.ok) {
        const data = await resEnc.json()
        setEncontros(data)
      }

      const resGrupos = await fetch('/api/grupos', { headers })
      if (resGrupos.ok) {
        const dataG = await resGrupos.json()
        setGrupos(dataG)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirEncontro = async (id: number, titulo: string) => {
    if (!confirm(`Deseja realmente remover o encontro "${titulo}"?`)) return

    try {
      const res = await fetch(`/api/encontros/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setEncontros(encontros.filter(e => e.id !== id))
      }
    } catch (err) {
    }
  }

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.grupoId || !formData.titulo || !formData.dataHora) {
      setErro("Grupo, título e data/hora são obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/encontros', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao agendar encontro.')
        setIsSubmitting(false)
        return
      }

      setFormData({
        grupoId: "",
        titulo: "",
        descricao: "",
        dataHora: "",
        duracao: 60,
        local: "Google Meet / Sala 301 Bloco A",
        tema: ""
      })
      setShowModalAgendar(false)
      carregarDados()
    } catch (err) {
      setErro("Erro de conexão ao agendar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const abrirModalFrequencia = async (encontroId: number) => {
    try {
      const res = await fetch(`/api/encontros/${encontroId}`, { headers: getHeaders() })
      if (res.ok) {
        const encCompleto: Encontro = await res.json()
        setShowModalFrequencia(encCompleto)
        if (encCompleto.frequencia) {
          setFrequenciaRegistros(
            encCompleto.frequencia.map(f => ({
              calouroId: f.calouro_id,
              presente: f.presente,
              observacao: f.observacao || ""
            }))
          )
        }
      }
    } catch (err) {
    }
  }

  const handleSalvarFrequencia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showModalFrequencia) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/encontros/${showModalFrequencia.id}/frequencia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ registros: frequenciaRegistros })
      })

      if (res.ok) {
        setShowModalFrequencia(null)
        carregarDados()
      }
    } catch (err) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTogglePresenca = (calouroId: number) => {
    setFrequenciaRegistros(prev =>
      prev.map(item =>
        item.calouroId === calouroId ? { ...item, presente: item.presente === 1 ? 0 : 1 } : item
      )
    )
  }

  const encontrosFiltrados = encontros.filter(e => {
    if (!filtroStatus) return true
    return e.status === filtroStatus
  })

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
            Gestão de Encontros e Frequência
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
            Agende reuniões de mentoria, controle a assiduidade e registre temas abordados
          </p>
        </div>
        <button
          onClick={() => {
            setErro("")
            setShowModalAgendar(true)
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
          <Plus size={16} /> Agendar Novo Encontro
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            fontSize: "14px",
            outline: "none"
          }}
        >
          <option value="">Todos os status</option>
          <option value="AGENDADO">Apenas Agendados</option>
          <option value="REALIZADO">Apenas Realizados</option>
          <option value="CANCELADO">Apenas Cancelados</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando encontros...
        </div>
      ) : encontrosFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "50px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "14px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          Nenhum encontro registrado no momento.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {encontrosFiltrados.map((enc) => (
            <div key={enc.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "14px",
              padding: "18px 22px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <Calendar size={18} color="#d3fc72" />
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{enc.titulo}</h3>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    background: enc.status === "REALIZADO" ? "rgba(211,252,114,0.15)" :
                              enc.status === "AGENDADO" ? "rgba(85,49,204,0.25)" :
                              "rgba(255,107,107,0.15)",
                    color: enc.status === "REALIZADO" ? "#d3fc72" :
                           enc.status === "AGENDADO" ? "#a78bfa" :
                           "#ff6b6b"
                  }}>
                    {enc.status === "REALIZADO" ? "Realizado" :
                     enc.status === "AGENDADO" ? "Agendado" :
                     "Cancelado"}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                  <span>Grupo: {enc.grupo_nome}</span>
                  {enc.mentor_nome && <span>Mentor: {enc.mentor_nome}</span>}
                  <span>Local: {enc.local}</span>
                  <span>Data: {new Date(enc.data_hora).toLocaleString('pt-BR')} ({enc.duracao} min)</span>
                  {enc.status === "REALIZADO" && (
                    <span style={{ color: "#d3fc72" }}>
                      Presença: {enc.presentes_count} / {enc.total_esperado}
                    </span>
                  )}
                </div>
                {enc.descricao && (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "6px" }}>
                    {enc.descricao}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => abrirModalFrequencia(enc.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(211,252,114,0.1)",
                    border: "1px solid rgba(211,252,114,0.25)",
                    color: "#d3fc72",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <ClipboardCheck size={14} /> Presença
                </button>
                <button
                  onClick={() => handleExcluirEncontro(enc.id, enc.titulo)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: "rgba(255,0,0,0.1)",
                    border: "1px solid rgba(255,0,0,0.2)",
                    color: "#ff6b6b",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title="Excluir Encontro"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModalAgendar && (
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
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
              Agendar Encontro
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "18px" }}>
              Preencha os dados da sessão de tutoria.
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

            <form onSubmit={handleAgendar} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Grupo Participante
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
                  value={formData.grupoId}
                  onChange={(e) => setFormData({ ...formData, grupoId: e.target.value })}
                  required
                >
                  <option value="">Selecione o grupo...</option>
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nome} {g.mentor_nome ? `(Mentor: ${g.mentor_nome})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Título do Encontro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tira-dúvidas de Programação"
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
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Data e Horário
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "12px",
                      outline: "none"
                    }}
                    value={formData.dataHora}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
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
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Local ou Link
                </label>
                <input
                  type="text"
                  placeholder="Sala ou link do Meet"
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
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Tema / Assunto
                </label>
                <input
                  type="text"
                  placeholder="Tema da mentoria"
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
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModalAgendar(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
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
                >
                  {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalFrequencia && (
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
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <h2 style={{ color: "white", fontSize: "19px", fontWeight: "bold", marginBottom: "4px" }}>
              Registro de Presença
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "18px" }}>
              Encontro: {showModalFrequencia.titulo}
            </p>

            <form onSubmit={handleSalvarFrequencia}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "240px",
                overflowY: "auto",
                marginBottom: "18px"
              }}>
                {frequenciaRegistros.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "center" }}>
                    Nenhum calouro vinculado a este grupo.
                  </p>
                ) : (
                  frequenciaRegistros.map((item) => {
                    const info = showModalFrequencia.frequencia?.find(f => f.calouro_id === item.calouroId)
                    return (
                      <div key={item.calouroId} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}>
                        <div>
                          <p style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>
                            {info?.nome_completo || `Calouro #${item.calouroId}`}
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>
                            RA: {info?.ra}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePresenca(item.calouroId)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "none",
                            background: item.presente === 1 ? "rgba(211,252,114,0.2)" : "rgba(255,107,107,0.2)",
                            color: item.presente === 1 ? "#d3fc72" : "#ff6b6b",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          {item.presente === 1 ? "Presente" : "Ausente"}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModalFrequencia(null)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
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
                >
                  {isSubmitting ? "Salvando..." : "Salvar Presenças"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
