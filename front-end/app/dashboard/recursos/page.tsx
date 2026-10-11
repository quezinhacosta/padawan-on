"use client"

import { useState, useEffect } from "react"

interface Recurso {
  id: number
  titulo: string
  tipo: "DOCUMENTO" | "VIDEO" | "LINK" | "EXERCICIO"
  descricao: string
  url: string
  autor_nome: string | null
  created_at: string
}

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [filtroTipo, setFiltroTipo] = useState("")
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "DOCUMENTO",
    descricao: "",
    url: ""
  })

  useEffect(() => {
    carregarRecursos()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarRecursos = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/recursos', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setRecursos(data)
      }
    } catch (err) {
      console.error("Erro ao carregar recursos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCadastrarRecurso = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!formData.titulo || !formData.url) {
      setErro("Título e Link (URL) são obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/recursos', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao cadastrar recurso.')
        setIsSubmitting(false)
        return
      }

      setFormData({
        titulo: "",
        tipo: "DOCUMENTO",
        descricao: "",
        url: ""
      })
      setShowModal(false)
      carregarRecursos()
    } catch (err) {
      setErro("Erro de conexão ao salvar recurso.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const recursosFiltrados = recursos.filter(r => {
    const matchesBusca = (r.titulo || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (r.descricao || "").toLowerCase().includes(busca.toLowerCase())
    const matchesTipo = !filtroTipo || r.tipo === filtroTipo
    return matchesBusca && matchesTipo
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
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            📚 Biblioteca de Recursos Educacionais
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Materiais de apoio, vídeos, tutoriais e listas de exercícios selecionados para os calouros
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
          + Adicionar Recurso
        </button>
      </div>

      {/* Barra de Pesquisa e Filtro */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Buscar recurso por palavra-chave..."
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
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
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
          <option value="">Todos os tipos</option>
          <option value="DOCUMENTO">📄 Documentos / PDFs</option>
          <option value="VIDEO">🎥 Vídeos / Videoaulas</option>
          <option value="EXERCICIO">✏️ Listas de Exercícios</option>
          <option value="LINK">🔗 Links e Portais</option>
        </select>
      </div>

      {/* Grid de Recursos */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Carregando materiais...
        </div>
      ) : recursosFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "50px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          Nenhum recurso encontrado com os filtros aplicados.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "18px"
        }}>
          {recursosFiltrados.map((rec) => (
            <div key={rec.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              transition: "all 0.2s ease"
            }}>
              <div style={{ fontSize: "32px" }}>
                {rec.tipo === "VIDEO" && "🎥"}
                {rec.tipo === "DOCUMENTO" && "📄"}
                {rec.tipo === "LINK" && "🔗"}
                {rec.tipo === "EXERCICIO" && "✏️"}
              </div>

              <div>
                <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                  {rec.titulo}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.4" }}>
                  {rec.descricao}
                </p>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  color: "#d3fc72",
                  fontSize: "11px",
                  fontWeight: "500"
                }}>
                  {rec.tipo}
                </span>

                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(85,49,204,0.2)",
                    border: "1px solid rgba(85,49,204,0.3)",
                    color: "#a78bfa",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}
                >
                  Acessar ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Adicionar Recurso */}
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
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginBottom: "6px" }}>
              Adicionar Material Educacional
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px" }}>
              Compartilhe apostilas, links, tutoriais ou listas de exercícios com os estudantes.
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

            <form onSubmit={handleCadastrarRecurso} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Título do Recurso *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tutorial Prático de Git e GitHub"
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
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Tipo de Conteúdo
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
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                >
                  <option value="DOCUMENTO">📄 Documento / PDF</option>
                  <option value="VIDEO">🎥 Vídeo / Aula</option>
                  <option value="EXERCICIO">✏️ Lista de Exercícios</option>
                  <option value="LINK">🔗 Link Útil / Documentação</option>
                </select>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Link / URL do Material *
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/material"
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
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                  Breve Descrição
                </label>
                <textarea
                  placeholder="Explique resumidamente o conteúdo e a finalidade deste recurso..."
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
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
                  {isSubmitting ? "Salvando..." : "Salvar Recurso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

