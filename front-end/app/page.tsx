"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, GraduationCap, Users, UserCheck, UserPlus, ArrowRight } from "lucide-react"
import styles from "./page.module.css"

type UserRole = "ORIENTADOR" | "ADMINISTRADOR" | "MENTOR" | "CALOURO"

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

    if (!formData.ra || !formData.senha) {
      setErro("Preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ra: formData.ra,
          senha: formData.senha,
          role: formData.role || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.error || 'Erro ao fazer login')
        setIsLoading(false)
        return
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      localStorage.setItem('user', JSON.stringify(data.usuario))

      const role = data.usuario.role
      if (role === "ORIENTADOR") {
        router.push("/dashboard")
      } else if (role === "ADMINISTRADOR") {
        router.push("/dashboard/administrador")
      } else if (role === "MENTOR") {
        router.push("/dashboard/mentor")
      } else if (role === "CALOURO") {
        router.push("/dashboard/calouro")
      }

    } catch (error) {
      setErro('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBrand}>
          <div className={styles.brandHeader}>
            <div className={styles.brandIcon}>
              <GraduationCap size={32} />
            </div>
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
            <div className={styles.brandCard}>
              <div className={styles.brandCardIcon}>
                <Shield size={24} />
              </div>
              <p className={styles.brandCardLabel}>Orientadores</p>
              <p className={styles.brandCardDesc}>Gestão</p>
            </div>
            <div className={styles.brandCard}>
              <div className={styles.brandCardIcon}>
                <UserCheck size={24} />
              </div>
              <p className={styles.brandCardLabel}>Mentores</p>
              <p className={styles.brandCardDesc}>Acompanhamento</p>
            </div>
            <div className={styles.brandCard}>
              <div className={styles.brandCardIcon}>
                <Users size={24} />
              </div>
              <p className={styles.brandCardLabel}>Calouros</p>
              <p className={styles.brandCardDesc}>Suporte</p>
            </div>
          </div>
        </div>

        <div className={styles.loginFormWrapper}>
          <div className={styles.loginFormHeader}>
            <span className={styles.badgeModern}>
              <Shield size={14} style={{ marginRight: "6px" }} />
              Acesso Seguro
            </span>
            <h3 className={styles.loginFormTitle}>
              Bem-vindo de volta
            </h3>
            <p className={styles.loginFormSubtitle}>
              Entre com suas credenciais acadêmicas
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
                RA / Matrícula ou E-mail
              </label>
              <input
                type="text"
                placeholder="Digite seu RA ou e-mail institucional"
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
                disabled={isLoading}
              >
                <option value="">
                  Identificar automaticamente ou selecionar
                </option>
                <option value="ORIENTADOR">
                  Orientador Geral
                </option>
                <option value="ADMINISTRADOR">
                  Administrador
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
                  Cadastre-se como Calouro
                </Link>
              </p>
              <p className={styles.loginCredits}>
                SGA - Sistema de Gestão de Apadrinhamento • UNICAP
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className={styles.loginPageFooter}>
        © 2026 SGA • UNICAP
      </footer>
    </div>
  )
}