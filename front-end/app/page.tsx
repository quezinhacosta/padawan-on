"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UserRole = "ORIENTADOR" | "MENTOR" | "CALOURO"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    ra: "",
    senha: "",
    role: "" as UserRole | "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const userData = {
        id: "1",
        nome: formData.nome || "Usuário",
        ra: formData.ra,
        role: formData.role,
      }
      localStorage.setItem("user", JSON.stringify(userData))
    
      if (formData.role === "ORIENTADOR") {
        router.push("/dashboard")
      } else if (formData.role === "MENTOR") {
        router.push("/dashboard/mentor")
      } else if (formData.role === "CALOURO") {
        router.push("/dashboard/calouro")
      } else {
        router.push("/")
      }
    }, 1500)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 30% 50%, #5531cc33 0%, transparent 60%)",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 70% 50%, #d3fc7211 0%, transparent 60%)",
      }} />
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "1200px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "center"
      }}>
      
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #d3fc72, #5531cc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: "32px" }}>🎓</span>
            </div>
            <div>
              <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
                <span style={{ color: "#d3fc72" }}>Padawan</span>
                <span style={{ color: "white" }}> ON</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                Sistema de Gestão
              </p>
            </div>
          </div>
          <div>
            <h2 style={{
              fontSize: "64px",
              fontWeight: "bold",
              lineHeight: 1.1
            }}>
              <span style={{ color: "white" }}>Programa</span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, #d3fc72, #5531cc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Padawan</span>
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
              marginTop: "16px",
              maxWidth: "400px"
            }}>
              Plataforma integrada para orientadores, mentores e calouros do programa de extensão da UNICAP
            </p>
          </div>

          {/* Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px"
          }}>
            {[
              { label: "Orientadores", desc: "Gestão" },
              { label: "Mentores", desc: "Acompanhamento" },
              { label: "Calouros", desc: "Suporte" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{item.label}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito - Login */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px",
          padding: "48px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(211,252,114,0.1)",
              color: "#d3fc72",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "16px"
            }}>
               Acesso Seguro
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
              Bem-vindo de volta
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              Entre com suas credenciais
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Nome (opcional para teste) */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                  Nome (opcional)
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            {/* RA */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                 RA / Matrícula
              </label>
              <input
                type="text"
                placeholder="Digite seu RA"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                value={formData.ra}
                onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                 Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                 Tipo de Usuário
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                required
              >
                <option value="" style={{ background: "#1a1a1a" }}>Selecione seu perfil</option>
                <option value="ORIENTADOR" style={{ background: "#1a1a1a" }}>Orientador</option>
                <option value="MENTOR" style={{ background: "#1a1a1a" }}>Mentor</option>
                <option value="CALOURO" style={{ background: "#1a1a1a" }}> Calouro</option>
              </select>
            </div>

            {/* Botão */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
                color: "black",
                fontWeight: "600",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              disabled={isLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)"
                e.currentTarget.style.boxShadow = "0 0 40px rgba(211,252,114,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTop: "2px solid black",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite"
                  }} />
                  Ficando ON...
                </>
              ) : (
                <>
                  Ficar ON
                </>
              )}
            </button>

            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)"
            }}>
              Não tem uma conta?{" "}
              <Link href="/cadastro" style={{
                color: "#d3fc72",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#a8e04a"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#d3fc72"}
              >
                Cadastre-se
              </Link>
            </div>

            <p style={{
              textAlign: "center",
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "8px"
            }}>
              Programa de Extensão Padawan<br />
              <span style={{ color: "#5531cc" }}>Ciência da Computação - UNICAP</span>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: "24px",
        left: 0,
        right: 0,
        textAlign: "center",
        color: "rgba(255,255,255,0.1)",
        fontSize: "12px"
      }}>
        © 2024 Padawan ON
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}