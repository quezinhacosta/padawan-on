"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"

type UserRole = "ORIENTADOR" | "MENTOR" | "CALOURO"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [formData, setFormData] = useState({
    ra: "",
    senha: "",
    role: "" as UserRole | "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErro("")

    // Validações básicas
    if (!formData.ra || !formData.senha || !formData.role) {
      setErro("Preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      // Fazer requisição para o backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ra: formData.ra,
          senha: formData.senha,
          role: formData.role,
        }),
      })

      const data = await response.json()

      // Verificar se a requisição foi bem sucedida
      if (!response.ok) {
        setErro(data.error || 'Erro ao fazer login')
        setIsLoading(false)
        return
      }

      // Salvar dados do usuário e token
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      localStorage.setItem('user', JSON.stringify(data.usuario))

      // Redirecionar baseado no role
      if (formData.role === "ORIENTADOR") {
        router.push("/dashboard")
      } else if (formData.role === "MENTOR") {
        router.push("/dashboard/mentor")
      } else if (formData.role === "CALOURO") {
        router.push("/dashboard/calouro")
      }

    } catch (error) {
      console.error('Erro no login:', error)
      setErro('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Left Side - Branding */}
        <div className={styles.loginBrand}>
          <div className={styles.brandHeader}>
            <div className={styles.brandIcon}>P</div>
            <div>
              <h1 className={styles.brandTitle}>
                <span className={styles.brandHighlight}>SGA</span>
              </h1>
            </div>
          </div>

          <div className={styles.brandContent}>
            <h2 className={styles.brandHeadline}>
              <span>Sistema de Gestão de</span>
              <br />
              <span className={styles.textGradient}>Apadrinhamento</span>
            </h2>
            <p className={styles.brandDescription}>
              Plataforma integrada para orientadores, mentores e calouros.
            </p>
          </div>

          <div className={styles.brandCards}>
            {[
              { 
                label: "Orientadores", 
                desc: "Gestão", 
                icon: "O" 
              },
              { 
                label: "Mentores", 
                desc: "Acompanhamento", 
                icon: "M" 
              },
              { 
                label: "Calouros", 
                desc: "Suporte", 
                icon: "C" 
              },
            ].map((item, index) => (
              <div key={index} className={styles.brandCard}>
                <div className={styles.brandCardIcon}>
                  {item.icon}
                </div>
                <p className={styles.brandCardLabel}>
                  {item.label}
                </p>
                <p className={styles.brandCardDesc}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.loginFormWrapper}>
          <div className={styles.loginFormHeader}>
            <span className={styles.badgeModern}>
              Acesso Seguro
            </span>
            <h3 className={styles.loginFormTitle}>
              Bem-vindo de volta
            </h3>
            <p className={styles.loginFormSubtitle}>
              Entre com suas credenciais
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {erro && (
              <div className={styles.errorMessage}>
                {erro}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.labelModern}>
                RA / Matrícula
              </label>
              <input
                type="text"
                placeholder="Digite seu RA"
                className={styles.inputModern}
                value={formData.ra}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  ra: e.target.value 
                })}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelModern}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className={styles.inputModern}
                value={formData.senha}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  senha: e.target.value 
                })}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.labelModern}>
                Tipo de Usuário
              </label>
              <select
                className={styles.selectModern}
                value={formData.role}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  role: e.target.value as UserRole 
                })}
                required
                disabled={isLoading}
              >
                <option value="">
                  Selecione seu perfil
                </option>
                <option value="ORIENTADOR">
                  Orientador
                </option>
                <option value="MENTOR">
                  Mentor
                </option>
                <option value="CALOURO">
                  Calouro
                </option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.loadingSpinner} />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <div className={styles.loginFooter}>
              <p>
                Não tem uma conta?{" "}
                <Link href="/cadastro" className={styles.linkModern}>
                  Cadastre-se
                </Link>
              </p>
              <p className={styles.loginCredits}>
                SGA - Sistema de Gestão de Apadrinhamento
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className={styles.loginPageFooter}>
        © 2026 SGA
      </footer>
    </div>
  )
}