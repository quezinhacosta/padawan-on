"use client"

import { useState, useEffect } from "react"
import { Shield, Plus, Search, Trash2, Mail, Users, Edit3 } from "lucide-react"

interface Administrador {
  id: number
  usuario_id: number
  nome: string
  nome_usuario: string
  ra: string
  email: string
  departamento: string
  cargo: string
  grupos_count: number
  grupo_nome: string | null
  ativo: boolean | number
}

export default function AdministradoresAdminPage() {
  const [administradores, setAdministradores] = useState<Administrador[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeUsuario: "",
    ra: "",
    email: "",
    senha: "admin",
    departamento: "Ciência da Computação",
    cargo: "Líder / Administrador de Grupo"
  })

  useEffect(() => {
    carregarAdministradores()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarAdministradores = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/administradores', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setAdministradores(data)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirAdministrador = async (id: number, nome: string) => {
    if (!confirm(`Deseja realmente remover o administrador "${nome}"? Esta ação removerá sua conta e desvinculará grupos associados.`)) return

    try {
      const res = await fetch(`/api/administradores/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (res.ok) {
        setAdministradores(administradores.filter(a => a.id !== id))
      } else {
        const data = await res.json()
        alert(data.message || data.error || 'Erro ao excluir administrador.')
      }
    } catch (err) {
      alert('Erro de conexão ao excluir administrador.')
    }
  }

  const handleCadastrarAdministrador = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.nomeCompleto || !formData.ra || !formData.email) {
      setErro("Nome completo, RA e e-mail institucional são obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/administradores', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.message || data.error || 'Erro ao cadastrar administrador.')
        setIsSubmitting(false)
        return
      }

      setShowModal(false)
      setFormData({
        nomeCompleto: "",
        nomeUsuario: "",
        ra: "",
        email: "",
        senha: "admin",
        departamento: "Ciência da Computação",
        cargo: "Líder / Administrador de Grupo"
      })
      carregarAdministradores()
    } catch (err) {
      setErro("Erro ao conectar com o servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const administradoresFiltrados = administradores.filter(admin => {
    const termo = busca.toLowerCase()
    return (
      (admin.nome || '').toLowerCase().includes(termo) ||
      (admin.ra || '').toLowerCase().includes(termo) ||
      (admin.email || '').toLowerCase().includes(termo) ||
      (admin.cargo || '').toLowerCase().includes(termo) ||
      (admin.grupo_nome || '').toLowerCase().includes(termo)
    )
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
            Administradores do Programa
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
            Cadastre novos administradores de grupos, designe cargos e gerencie a liderança das equipes
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
            background: "linear-gradient(135deg, #60a5fa, #2563eb)",
            color: "white",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Plus size={16} /> Novo Administrador
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
            placeholder="Buscar administrador por nome, RA, e-mail ou grupo..."
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
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando administradores...
        </div>
      ) : administradoresFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "12px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          Nenhum administrador cadastrado no momento. Clique no botão acima para adicionar.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {administradoresFiltrados.map((admin) => (
            <div key={admin.id} style={{
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
                  <Shield size={18} color="#60a5fa" />
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{admin.nome}</h3>
                  <span style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    background: admin.grupo_nome ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.08)",
                    color: admin.grupo_nome ? "#60a5fa" : "rgba(255,255,255,0.6)"
                  }}>
                    {admin.grupo_nome ? `Grupo: ${admin.grupo_nome}` : "Sem Grupo Atribuído"}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                  <span>E-mail: {admin.email}</span>
                  <span>RA: {admin.ra}</span>
                  <span>Cargo: {admin.cargo}</span>
                  <span>Departamento: {admin.departamento}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleExcluirAdministrador(admin.id, admin.nome)}
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
                  title="Excluir Administrador"
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
              Cadastrar Novo Administrador
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "18px" }}>
              Adicione um administrador para gerenciar grupos e mentores do programa.
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

            <form onSubmit={handleCadastrarAdministrador} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silveira"
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
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Nome de Usuário (Login)
                </label>
                <input
                  type="text"
                  placeholder="Ex: carlos.silveira (opcional, padrão usa início do e-mail)"
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
                  value={formData.nomeUsuario}
                  onChange={(e) => setFormData({ ...formData, nomeUsuario: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    RA / Matrícula
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 202401"
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
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Senha Inicial
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Senha de acesso"
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
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: carlos@unicap.br"
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Departamento
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
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    Cargo
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
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
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
                    background: "linear-gradient(135deg, #60a5fa, #2563eb)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Administrador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

