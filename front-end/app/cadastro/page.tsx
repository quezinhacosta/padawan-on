"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Cadastro() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomeUsuario: "",
    nomeCompleto: "",
    ra: "",
    senha: "",
    confirmarSenha: "",
  })
  const [erro, setErro] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem")
      return
    }

    if (formData.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/calouro")
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
      {/* Fundo com efeitos */}
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

      {/* Conteúdo principal */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "500px",
      }}>
        {/* Card de Cadastro */}
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
              Cadastro
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
              Criar conta
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              Apenas calouros podem se cadastrar
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Nome de Usuário */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                 Nome de Usuário
              </label>
              <input
                type="text"
                placeholder="Escolha um nome de usuário"
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
                value={formData.nomeUsuario}
                onChange={(e) => setFormData({ ...formData, nomeUsuario: e.target.value })}
                required
              />
            </div>

            {/* Nome Completo */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
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
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                required
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
                placeholder="Crie uma senha (mínimo 6 caracteres)"
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
                minLength={6}
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                Confirmar Senha
              </label>
              <input
                type="password"
                placeholder="Digite a senha novamente"
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
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                required
              />
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div style={{
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,0,0,0.2)",
                color: "#ff6b6b",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {erro}
              </div>
            )}

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
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </button>

            {/* Link para login */}
            <div style={{
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)"
            }}>
              Já tem uma conta?{" "}
              <Link href="/" style={{
                color: "#d3fc72",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#a8e04a"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#d3fc72"}
              >
                Faça login
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