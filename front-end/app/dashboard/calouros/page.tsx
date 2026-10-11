"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Search, Trash2, Mail, GraduationCap } from "lucide-react"

interface Calouro {
  id: number
  usuario_id: number
  nome: string
  ra: string
  email: string
  curso: string
  periodo: string
  data_ingresso: string
  grupo_id: number | null
  grupo_nome: string | null
  mentor_nome: string | null
  mentor_email: string | null
  ativo: boolean | number
}

export default function CalourosAdminPage() {
  const [calouros, setCalouros] = useState<Calouro[]>([])
  const [busca, setBusca] = useState("")
  const [filtroGrupo, setFiltroGrupo] = useState("")
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
    curso: "Ciência da Computação",
    periodo: "1º Período"
  })

  useEffect(() => {
    carregarCalouros()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarCalouros = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/calouros', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setCalouros(data)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirCalouro = async (id: number, nome: string) => {
    if (!confirm(`Deseja realmente remover o calouro "${nome}"? Esta ação removerá seus vínculos.`)) return

    try {
      const res = await fetch(`/api/calouros/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setCalouros(calouros.filter(c => c.id !== id))
      }
    } catch (err) {
    }
  }

  const handleCadastrarCalouro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.nomeCompleto || !formData.ra) {
      setErro("Nome completo e RA são obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/calouros', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao cadastrar calouro.')
        setIsSubmitting(false)
        return
      }

      setFormData({
        nomeCompleto: "",
        nomeUsuario: "",
        ra: "",
        email: "",
        senha: "123456",
        curso: "Ciência da Computação",
        periodo: "1º Período"
      })
      setShowModal(false)
      carregarCalouros()
    } catch (err) {
      setErro("Erro de conexão ao salvar calouro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calourosFiltrados = calouros.filter(c => {
    const matchesBusca = (c.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (c.ra || "").includes(busca) ||
                         (c.grupo_nome || "").toLowerCase().includes(busca.toLowerCase())
    const matchesGrupo = filtroGrupo === "" ? true :
                         filtroGrupo === "com_grupo" ? !!c.grupo_id :
                         !c.grupo_id
    return matchesBusca && matchesGrupo
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
            Gerenciamento de Calouros
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
            Acompanhe o ingresso dos alunos, verifique vínculos de mentoria e aloque calouros
          </p>
        </div>
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
          <Plus size={16} /> Adicionar Calouro
        </button>
      </div>

      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>
        <div style={{
          flex: 1,
          minWidth: "240px",
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Search size={16} style={{ position: "absolute", left: "14px", color: "rgba(255,255,255,0.4)" }} />
          <input
            type="text"
            placeholder="Buscar calouro por nome, RA ou grupo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
        <select
          value={filtroGrupo}
          onChange={(e) => setFiltroGrupo(e.target.value)}
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
          <option value="">Todos os calouros</option>
          <option value="sem_grupo">Sem Grupo (Aguardando Alocação)</option>
          <option value="com_grupo">Com Grupo Ativo</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando calouros...
        </div>
      ) : calourosFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          Nenhum calouro cadastrado no momento.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {calourosFiltrados.map((calouro) => (
            <div key={calouro.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              padding: "18px 22px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                  <Users size={18} color="#d3fc72" />
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{calouro.nome}</h3>
                  <span style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    background: calouro.grupo_id ? "rgba(211,252,114,0.15)" : "rgba(255,107,107,0.15)",
                    color: calouro.grupo_id ? "#d3fc72" : "#ff6b6b"
                  }}>
                    {calouro.grupo_id ? `Grupo: ${calouro.grupo_nome}` : "Sem Grupo"}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                  <span>E-mail: {calouro.email}</span>
                  <span>RA: {calouro.ra}</span>
                  <span>Curso: {calouro.curso} ({calouro.periodo})</span>
                  {calouro.mentor_nome && (
                    <span style={{ color: "#a78bfa" }}>Mentor: {calouro.mentor_nome}</span>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleExcluirCalouro(calouro.id, calouro.nome)}
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
                  title="Excluir Calouro"
                >
                  <Trash2 size={14} /> Excluir
                </button>
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
            maxWidth: "480px",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
              Cadastrar Novo Calouro
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "18px" }}>
              Registre um ingressante no sistema para vinculação a mentores.
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

            <form onSubmit={handleCadastrarCalouro} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Nome do calouro"
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
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  RA / Matrícula
                </label>
                <input
                  type="text"
                  placeholder="Matrícula institucional"
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
                  value={formData.ra}
                  onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  placeholder="aluno@unicap.br"
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Curso
                  </label>
                  <input
                    type="text"
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
                    value={formData.curso}
                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Período
                  </label>
                  <input
                    type="text"
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
                    value={formData.periodo}
                    onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                  />
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
                  {isSubmitting ? "Salvando..." : "Salvar Calouro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
