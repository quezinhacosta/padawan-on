"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

type UserRole = "ORIENTADOR" | "MENTOR" | "CALOURO"

interface User {
  id: string | number
  nome?: string
  nome_completo?: string
  nome_usuario?: string
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
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          router.push("/")
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
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

  const displayName = user.nome || user.nome_completo || user.nome_usuario || "Usuário"
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div style={{
      minHeight: "100vh",
      background: "black",
      display: "flex",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "280px",
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px",
            height: "42px",
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
            <h2 style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.2" }}>
              <span style={{ color: "#d3fc72" }}>Padawan</span>
              <span style={{ color: "white" }}> ON</span>
            </h2>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              UNICAP • Ciência da Comp.
            </span>
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
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: user.role === "ORIENTADOR" 
                ? "linear-gradient(135deg, #d3fc72, #a8e04a)" 
                : user.role === "MENTOR"
                ? "linear-gradient(135deg, #a78bfa, #5531cc)"
                : "linear-gradient(135deg, #ff8787, #e03131)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: user.role === "ORIENTADOR" ? "black" : "white"
            }}>
              {userInitial}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ 
                color: "white", 
                fontWeight: "600", 
                fontSize: "14px", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis" 
              }}>
                {displayName}
              </p>
              <p style={{ 
                color: "rgba(255,255,255,0.5)", 
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "2px"
              }}>
                <span style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: user.role === "ORIENTADOR" ? "#d3fc72" : user.role === "MENTOR" ? "#a78bfa" : "#ff8787"
                }} />
                {user.role === "ORIENTADOR" ? "Orientador" : 
                 user.role === "MENTOR" ? "Mentor" : "Calouro"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {user.role === "ORIENTADOR" && (
            <>
              <DashboardNavItem href="/dashboard" icon="📊" label="Visão Geral" />
              <DashboardNavItem href="/dashboard/mentores" icon="🧑‍🎓" label="Mentores" />
              <DashboardNavItem href="/dashboard/calouros" icon="👶" label="Calouros" />
              <DashboardNavItem href="/dashboard/grupos" icon="👥" label="Grupos" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon="📚" label="Recursos" />
              <DashboardNavItem href="/dashboard/relatorios" icon="📈" label="Relatórios" />
              <DashboardNavItem href="/dashboard/configuracoes" icon="⚙️" label="Configurações" />
            </>
          )}

          {user.role === "MENTOR" && (
            <>
              <DashboardNavItem href="/dashboard/mentor" icon="📊" label="Meu Painel" />
              <DashboardNavItem href="/dashboard/meus-calouros" icon="👶" label="Meus Calouros" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon="📚" label="Recursos" />
              <DashboardNavItem href="/dashboard/relatorios" icon="📈" label="Relatórios" />
            </>
          )}

          {user.role === "CALOURO" && (
            <>
              <DashboardNavItem href="/dashboard/calouro" icon="📊" label="Meu Painel" />
              <DashboardNavItem href="/dashboard/meu-mentor" icon="🧑‍🎓" label="Meu Mentor" />
              <DashboardNavItem href="/dashboard/encontros" icon="📅" label="Meus Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon="📚" label="Biblioteca" />
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
          🚪 Sair da Plataforma
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{
        marginLeft: "280px",
        flex: 1,
        padding: "32px",
        minHeight: "100vh"
      }}>
        {children}
      </main>

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
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: isActive ? "white" : "rgba(255,255,255,0.6)",
        background: isActive ? "rgba(211,252,114,0.12)" : "transparent",
        border: isActive ? "1px solid rgba(211,252,114,0.25)" : "1px solid transparent",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive ? "600" : "400",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)"
          e.currentTarget.style.color = "white"
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent"
          e.currentTarget.style.color = "rgba(255,255,255,0.6)"
        }
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span>{label}</span>
      {isActive && (
        <span style={{
          marginLeft: "auto",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#d3fc72"
        }} />
      )}
    </Link>
  )
}