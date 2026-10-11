"use client"

import { useState, useEffect } from "react"
import { Users, Mail, IdCard, Send } from "lucide-react"

interface Calouro {
  id: number
  nome: string
  email: string
  ra: string
  curso: string
  periodo: string
  grupo_nome: string
  grupo_id: number
}

export default function MeusCalourosPage() {
  const [calouros, setCalouros] = useState<Calouro[]>([])
  const [mentor, setMentor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarMeusCalouros()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarMeusCalouros = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/mentores/meus-calouros', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        setCalouros(data.calouros || [])
        setMentor(data.mentor || null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <Users size={28} color="#d3fc72" /> Meus Calouros Apadrinhados
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
          Estudantes vinculados sob sua mentoria no programa 
        </p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
          Carregando estudantes...
        </div>
      ) : calouros.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)"
        }}>
          <p style={{ fontSize: "18px", color: "white", marginBottom: "6px" }}>
            Nenhum calouro vinculado ao seu grupo ainda.
          </p>
          <p style={{ fontSize: "14px" }}>
            O orientador do programa fará a alocação de novos alunos em breve.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {calouros.map((calouro) => (
            <div key={calouro.id} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #d3fc72, #5531cc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "black"
                }}>
                  {calouro.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
                    {calouro.nome}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#a78bfa" }}>
                    {calouro.curso} • {calouro.periodo}
                  </span>
                </div>
              </div>

              <div style={{
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)"
              }}>
                <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={14} /> <span style={{ color: "white" }}>{calouro.email}</span>
                </p>
                <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <IdCard size={14} /> RA: <span style={{ color: "white" }}>{calouro.ra}</span>
                </p>
                <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={14} /> Grupo: <span style={{ color: "#d3fc72" }}>{calouro.grupo_nome}</span>
                </p>
              </div>

              <a
                href={`mailto:${calouro.email}?subject=Mentoria UNICAP - Contato`}
                style={{
                  marginTop: "auto",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "rgba(211,252,114,0.1)",
                  border: "1px solid rgba(211,252,114,0.25)",
                  color: "#d3fc72",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Send size={14} /> Enviar E-mail
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
