"use client"

import { useState, useEffect } from "react"

interface CalouroMembro {
  calouro_id: number
  nome: string
  ra: string
  email: string
}

interface Grupo {
  id: number
  nome: string
  mentor_id: number | null
  mentor_nome: string | null
  mentor_email: string | null
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

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [mentores, setMentores] = useState<MentorOption[]>([])
  const [calourosDisponiveis, setCalourosDisponiveis] = useState<CalouroOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    mentorId: "",
    descricao: "",
    calouroIds: [] as number[]
  })

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

      // Buscar Grupos
      const resGrupos = await fetch('/api/grupos', { headers })
      if (resGrupos.ok) {
        const data = await resGrupos.json()
        setGrupos(data)
      }

      // Buscar Mentores
      const resMentores = await fetch('/api/mentores', { headers })
      if (resMentores.ok) {
        const data = await resMentores.json()
        setMentores(data)
      }

      // Buscar Calouros
      const resCalouros = await fetch('/api/calouros', { headers })
      if (resCalouros.ok) {
        const data: CalouroOption[] = await resCalouros.json()
        setCalourosDisponiveis(data)
      }
    } catch (err) {
      console.error("Erro ao carregar dados dos grupos:", err)
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

      // Limpar formulário e recarregar
      setFormData({
        nome: "",
        mentorId: "",
        descricao: "",
        calouroIds: []
      })
      setShowModal(false)
      carregarDados()
    } catch (err) {
      console.error("Erro ao salvar grupo:", err)
      setErro("Erro de conexão ao salvar grupo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExcluirGrupo = async (id: number, nome: string) => {
    if (!confirm(`Deseja realmente remover o grupo "${nome}"?`)) return

    try {
      const res = await fetch(`/api/grupos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setGrupos(grupos.filter(g => g.id !== id))
      }
    } catch (err) {
      console.error("Erro ao excluir grupo:", err)
    }
  }

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
            👥 Gerenciar Grupos de Mentoria
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Crie novos grupos, vincule mentores e aloque os calouros do programa
          </p>
        </div>
        <button
          onClick={() => {
            setErro("")
            setShowModal(true)
          }}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
            color: "black",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 0 25px rgba(211,252,114,0.2)"
          }}
        >
          + Formar Novo Grupo
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando grupos...
        </div>
      ) : grupos.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.1)"
        }}>
          <p style={{ fontSize: "20px", color: "white", marginBottom: "8px" }}>Nenhum grupo cadastrado</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px" }}>
            Crie o primeiro grupo clicando no botão acima.
          </p>
        </div>
      ) : (
        /* Grid de Grupos */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "20px"
        }}>
          {grupos.map((grupo) => (
            <div key={grupo.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transition: "all 0.2s ease"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}>
                <div>
                  <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                    {grupo.nome}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>
                    👨‍🏫 Mentor: <span style={{ color: "#d3fc72" }}>{grupo.mentor_nome || "Não atribuído"}</span>
                  </p>
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
                  background: grupo.status === "ATIVO" ? "rgba(211,252,114,0.15)" :
                            grupo.status === "PENDENTE" ? "rgba(255,165,0,0.15)" :
                            "rgba(255,107,107,0.15)",
                  color: grupo.status === "ATIVO" ? "#d3fc72" :
                         grupo.status === "PENDENTE" ? "#ffa500" :
                         "#ff6b6b"
                }}>
                  {grupo.status === "ATIVO" ? "✅ Ativo" :
                   grupo.status === "PENDENTE" ? "⏳ Pendente" :
                   "❌ Finalizado"}
                </span>
              </div>

              {/* Membros Calouros */}
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "8px" }}>
                  Calouros Vinculados ({grupo.calouros.length}):
                </p>
                {grupo.calouros.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", fontStyle: "italic" }}>
                    Nenhum calouro adicionado ainda.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {grupo.calouros.map((calouro) => (
                      <span key={calouro.calouro_id} style={{
                        padding: "4px 10px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.06)",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.8)",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}>
                        👶 {calouro.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Próximo Encontro e Ações */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                marginTop: "auto"
              }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                    📅 Próximo encontro
                  </p>
                  <p style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>
                    {grupo.proximo_encontro 
                      ? new Date(grupo.proximo_encontro).toLocaleString('pt-BR') 
                      : "Nenhum agendado"}
                  </p>
                </div>
                <button
                  onClick={() => handleExcluirGrupo(grupo.id, grupo.nome)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,0,0,0.1)",
                    border: "1px solid rgba(255,0,0,0.2)",
                    color: "#ff6b6b",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Grupo */}
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
            borderRadius: "20px",
            padding: "32px",
            maxWidth: "520px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "6px" }}>
              Formar Novo Grupo
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px" }}>
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
                marginBottom: "16px"
              }}>
                {erro}
              </div>
            )}

            <form onSubmit={handleCriarGrupo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Grupo Ada Lovelace"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Mentor Responsável
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                  value={formData.mentorId}
                  onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                >
                  <option value="">Selecione um mentor...</option>
                  {mentores.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} {m.disponivel ? "🟢 (Disponível)" : "🔴 (Ocupado)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Descrição / Objetivo do Grupo
                </label>
                <textarea
                  placeholder="Ex: Foco em nivelamento de programação e integração acadêmica..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none"
                  }}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              {/* Seleção de Calouros */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Calouros para Inserir no Grupo:
                </label>
                <div style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  padding: "8px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  {calourosDisponiveis.map((calouro) => (
                    <label key={calouro.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      color: "white",
                      cursor: "pointer",
                      padding: "4px"
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.calouroIds.includes(calouro.id)}
                        onChange={() => handleToggleCalouro(calouro.id)}
                        style={{ accentColor: "#d3fc72" }}
                      />
                      <span>{calouro.nome} (RA: {calouro.ra})</span>
                      {calouro.grupo_id && (
                        <span style={{ fontSize: "11px", color: "#ffa500", marginLeft: "auto" }}>
                          (já em outro grupo)
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Botões do Modal */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
                    border: "none",
                    color: "black",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px"
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
    </div>
  )
}