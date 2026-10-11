"use client"

import { useState, useEffect } from "react"
import { Settings, User, Building, CheckCircle2 } from "lucide-react"

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null)
  const [salvo, setSalvo] = useState(false)
  const [config, setConfig] = useState({
    semestre: "2026.1",
    departamento: "Ciência da Computação",
    instituicao: "Universidade Católica de Pernambuco (UNICAP)",
    maxCalourosPadrao: 5,
    notificacoesEmail: true
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) setUser(JSON.parse(stored))
    } catch (err) {}
  }, [])

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <Settings size={28} color="#d3fc72" /> Configurações da Plataforma
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
          Parâmetros do programa de extensão, semestre vigente e preferências
        </p>
      </div>

      <div style={{
        maxWidth: "680px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {salvo && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "10px",
            background: "rgba(211,252,114,0.15)",
            border: "1px solid rgba(211,252,114,0.3)",
            color: "#d3fc72",
            fontSize: "14px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            <CheckCircle2 size={18} /> Configurações salvas com sucesso!
          </div>
        )}

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={18} color="#d3fc72" /> Perfil Conectado
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Nome: <span style={{ color: "white", fontWeight: "500" }}>{user?.nome || user?.nome_completo || "Usuário"}</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              RA: <span style={{ color: "white", fontWeight: "500" }}>{user?.ra}</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              E-mail: <span style={{ color: "white", fontWeight: "500" }}>{user?.email}</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Função: <span style={{ color: "#d3fc72", fontWeight: "600" }}>{user?.role}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Building size={18} color="#d3fc72" /> Dados do Programa de Extensão
          </h3>

          <div>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Semestre Vigente
            </label>
            <input
              type="text"
              value={config.semestre}
              onChange={(e) => setConfig({ ...config, semestre: e.target.value })}
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
            />
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Departamento / Curso
            </label>
            <input
              type="text"
              value={config.departamento}
              onChange={(e) => setConfig({ ...config, departamento: e.target.value })}
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
            />
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Instituição de Ensino
            </label>
            <input
              type="text"
              value={config.instituicao}
              onChange={(e) => setConfig({ ...config, instituicao: e.target.value })}
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
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
              color: "black",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "8px"
            }}
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  )
}
