"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UserRole = "ORIENTADOR" | "MENTOR" | "CALOURO"

interface User {
  id: string
  nome: string
  role: UserRole
  ra?: string
  email?: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulando busca do usuário logado
    // Depois substituir por chamada real à API
    const fetchUser = async () => {
      // Simulação - pegar do localStorage ou contexto
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // Redirecionar para login se não estiver logado
        router.push("/")
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #d3fc72",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "black",
      display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "280px",
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        position: "fixed",
        height: "100vh",
        overflow: "auto"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #d3fc72, #5531cc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            🎓
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
              <span style={{ color: "#d3fc72" }}>Padawan</span>
              <span style={{ color: "white" }}> ON</span>
            </h2>
          </div>
        </div>

        {/* Perfil do Usuário */}
        <div style={{
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d3fc72, #5531cc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "black"
            }}>
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                {user.nome}
              </p>
              <p style={{ 
                color: "rgba(255,255,255,0.4)", 
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: user.role === "ORIENTADOR" ? "#d3fc72" : user.role === "MENTOR" ? "#5531cc" : "#ff6b6b"
                }} />
                {user.role === "ORIENTADOR" ? "👨‍🏫 Orientador" : 
                 user.role === "MENTOR" ? "🧑‍🎓 Mentor" : "👶 Calouro"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <DashboardNavItem href="/dashboard" icon="📊" label="Visão Geral" />
          
          {user.role === "ORIENTADOR" && (
            <>
              <DashboardNavItem href="/dashboard/mentores" icon="🧑‍🎓" label="Mentores" />
              <DashboardNavItem href="/dashboard/calouros" icon="👶" label="Calouros" />
              <DashboardNavItem href="/dashboard/grupos" icon="👥" label="Grupos" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Encontros" />
              <DashboardNavItem href="/dashboard/relatorios" icon="📊" label="Relatórios" />
              <DashboardNavItem href="/dashboard/configuracoes" icon="⚙️" label="Configurações" />
            </>
          )}

          {user.role === "MENTOR" && (
            <>
              <DashboardNavItem href="/dashboard/meus-calouros" icon="👶" label="Meus Calouros" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Meus Encontros" />
              <DashboardNavItem href="/dashboard/relatorios" icon="📊" label="Meus Relatórios" />
            </>
          )}

          {user.role === "CALOURO" && (
            <>
              <DashboardNavItem href="/dashboard/meu-mentor" icon="🧑‍🎓" label="Meu Mentor" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Meus Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon="📚" label="Recursos" />
            </>
          )}
        </nav>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,0,0,0.1)",
            border: "1px solid rgba(255,0,0,0.2)",
            color: "#ff6b6b",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,0,0,0.2)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,0,0,0.1)"
          }}
        >
          🚪 Sair
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div style={{
        marginLeft: "280px",
        flex: 1,
        padding: "32px",
        minHeight: "100vh"
      }}>
        {children}
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

function DashboardNavItem({ href, icon, label }: { href: string, icon: string, label: string }) {
  const router = useRouter()
  const isActive = typeof window !== "undefined" && window.location.pathname === href

  return (
    <Link
      href={href}
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: isActive ? "white" : "rgba(255,255,255,0.5)",
        background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
        border: isActive ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive ? "600" : "400",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)"
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent"
        }
      }}
    >
      <span style={{ fontSize: "20px" }}>{icon}</span>
      {label}
      {isActive && (
        <span style={{
          marginLeft: "auto",
          width: "4px",
          height: "24px",
          borderRadius: "2px",
          background: "#d3fc72"
        }} />
      )}
    </Link>
  )
}