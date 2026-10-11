"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, ArrowLeft } from "lucide-react"

export default function Cadastro() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomeUsuario: "",
    nomeCompleto: "",
    email: "",
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

    if (formData.senha.length < 4) {
      setErro("A senha deve ter pelo menos 4 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeUsuario: formData.nomeUsuario,
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          ra: formData.ra,
          senha: formData.senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.error || 'Erro ao realizar cadastro')
        setIsLoading(false)
        return
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      localStorage.setItem('user', JSON.stringify(data.usuario))
      router.push("/dashboard/calouro")
    } catch (error) {
      setErro('Erro ao conectar com o servidor. Verifique se o backend está ativo.')
    } finally {
      setIsLoading(false)
    }
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
        maxWidth: "500px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px",
          padding: "40px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
              <UserPlus size={14} />
              Cadastro de Ingressante
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
              Criar Conta de Calouro
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px", fontSize: "14px" }}>
              Acesso exclusivo para novos alunos do curso
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
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
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
                value={formData.nomeUsuario}
                onChange={(e) => setFormData({ ...formData, nomeUsuario: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
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
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                E-mail Institucional (Opcional)
              </label>
              <input
                type="email"
                placeholder="exemplo@unicap.br"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                RA / Matrícula
              </label>
              <input
                type="text"
                placeholder="Digite seu RA institucional"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
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
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px"
              }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha de acesso"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
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
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                required
              />
            </div>

            {erro && (
              <div style={{
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,0,0,0.2)",
                color: "#ff6b6b",
                fontSize: "13px",
                textAlign: "center"
              }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
                color: "black",
                fontWeight: "600",
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px"
              }}
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>

            <div style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)"
            }}>
              Já tem uma conta?{" "}
              <Link href="/" style={{
                color: "#d3fc72",
                textDecoration: "none",
                fontWeight: "500"
              }}>
                Faça login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}