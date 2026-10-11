"use client"

import { useState, useEffect } from "react"

interface Mentor {
  id: number
  usuario_id: number
  nome: string
  ra: string
  email: string
  disponivel: boolean | number
  max_calouros: number
  especialidades: string
  calouros_atendidos: number
  ativo: boolean | number
}

export default function MentoresAdminPage() {
  const [mentores, setMentores] = useState<Mentor[]>([])
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeUsuario: "",
    ra: "",
    email: "",
    senha: "123456",
    maxCalouros: 5,
    especialidades: ""
  })

  useEffect(() => {
    carregarMentores()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarMentores = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/mentores', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setMentores(data)
      }
    } catch (err) {
      console.error("Erro ao carregar mentores:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDisponibilidade = async (id: number, atual: boolean | number) => {
    try {
      const res = await fetch(`/api/mentores/${id}/disponibilidade`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ disponivel: !atual })
      })
      if (res.ok) {
        setMentores(mentores.map(m => m.id === id ? { ...m, disponivel: !atual } : m))
      }
    } catch (err) {
      console.error("Erro ao alterar disponibilidade:", err)
    }
  }

  const handleCadastrarMentor = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.nomeCompleto || !formData.ra) {
      setErro("Nome completo e RA são obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/mentores', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao cadastrar mentor.')
        setIsSubmitting(false)
        return
      }

      setFormData({
        nomeCompleto: "",
        nomeUsuario: "",
        ra: "",
        email: "",
        senha: "123456",
        maxCalouros: 5,
        especialidades: ""
      })
      setShowModal(false)
      carregarMentores()
    } catch (err) {
      setErro("Erro de conexão ao salvar mentor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const mentoresFiltrados = mentores.filter(m => {
    const matchesBusca = (m.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (m.ra || "").includes(busca) ||
                         (m.especialidades || "").toLowerCase().includes(busca.toLowerCase())
    const matchesStatus = filtroStatus === "" ? true :
                          filtroStatus === "disponivel" ? !!m.disponivel :
                          !m.disponivel
    return matchesBusca && matchesStatus
  })

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
            🧑‍🎓 Gerenciamento de Mentores
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Cadastre novos alunos mentores, defina limites de vagas e acompanhe a disponibilidade
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
          + Adicionar Mentor
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Buscar por nome, RA ou especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            fontSize: "14px",
            flex: 1,
            minWidth: "240px",
            outline: "none"
          }}
        />
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
          <option value="disponivel">Apenas Disponíveis</option>
          <option value="indisponivel">Apenas Ocupados</option>
        </select>
      </div>

      {/* Lista de Mentores */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando mentores...
        </div>
      ) : mentoresFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          Nenhum mentor encontrado com os filtros aplicados.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mentoresFiltrados.map((mentor) => (
            <div key={mentor.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "20px" }}>🧑‍🎓</span>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>{mentor.nome}</h3>
                  <button
                    onClick={() => handleToggleDisponibilidade(mentor.id, mentor.disponivel)}
                    style={{
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "500",
                      background: mentor.disponivel ? "rgba(211,252,114,0.15)" : "rgba(255,107,107,0.15)",
                      color: mentor.disponivel ? "#d3fc72" : "#ff6b6b",
                      border: "none",
                      cursor: "pointer"
                    }}
                    title="Clique para alternar disponibilidade"
                  >
                    {mentor.disponivel ? "🟢 Disponível" : "🔴 Ocupado"}
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                  <span>📧 {mentor.email}</span>
                  <span>🆔 RA: {mentor.ra}</span>
                  <span>👶 {mentor.calouros_atendidos || 0} / {mentor.max_calouros} calouros</span>
                  {mentor.especialidades && (
                    <span style={{ color: "#a78bfa" }}>💡 {mentor.especialidades}</span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleToggleDisponibilidade(mentor.id, mentor.disponivel)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Alternar Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Adicionar Mentor */}
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
            maxWidth: "480px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <h2 style={{ color: "white", fontSize: "22px", fontWeight: "bold", marginBottom: "6px" }}>
              Cadastrar Novo Mentor
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px" }}>
              Preencha os dados do veterano para integrá-lo ao programa.
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

            <form onSubmit={handleCadastrarMentor} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lucas Ferreira"
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
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                    RA / Matrícula *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2022005"
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
                    value={formData.ra}
                    onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                    Máx. de Calouros
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
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
                    value={formData.maxCalouros}
                    onChange={(e) => setFormData({ ...formData, maxCalouros: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  E-mail Institucional (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="lucas@unicap.br"
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Especialidades / Tecnologias
                </label>
                <input
                  type="text"
                  placeholder="Ex: Python, Algoritmos, Java, Web"
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
                  value={formData.especialidades}
                  onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 16px",
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
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
                    border: "none",
                    color: "black",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

