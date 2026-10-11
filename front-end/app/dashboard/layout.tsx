"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  GraduationCap, 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  User as UserIcon
} from "lucide-react"

type UserRole = "ORIENTADOR" | "MENTOR" | "CALOURO"

interface User {
  id: string | number
  nome?: string
  nome_completo?: string
  nome_usuario?: string
  role: UserRole
  ra?: string
  email?: string
  foto_perfil?: string
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
          width: "36px",
          height: "36px",
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
      <aside style={{
        width: "280px",
        background: "rgba(255,255,255,0.02)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #d3fc72, #5531cc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black"
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: "bold", lineHeight: "1.2" }}>
              <span style={{ color: "#d3fc72" }}>SGA</span>
              <span style={{ color: "white" }}> ON</span>
            </h2>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              UNICAP • Ciência da Computação
            </span>
          </div>
        </div>

        <div style={{
          padding: "14px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: user.role === "ORIENTADOR" 
                ? "linear-gradient(135deg, #d3fc72, #a8e04a)" 
                : user.role === "MENTOR"
                ? "linear-gradient(135deg, #a78bfa, #5531cc)"
                : "linear-gradient(135deg, #ff8787, #e03131)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: user.role === "ORIENTADOR" ? "black" : "white",
              overflow: "hidden",
              flexShrink: 0
            }}>
              {user.foto_perfil ? (
                <img
                  src={user.foto_perfil}
                  alt={displayName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                userInitial
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ 
                color: "white", 
                fontWeight: "600", 
                fontSize: "13px", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis" 
              }}>
                {displayName}
              </p>
              <p style={{ 
                color: "rgba(255,255,255,0.5)", 
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
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

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {user.role === "ORIENTADOR" && (
            <>
              <DashboardNavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Visão Geral" />
              <DashboardNavItem href="/dashboard/mentores" icon={<UserCheck size={18} />} label="Mentores" />
              <DashboardNavItem href="/dashboard/calouros" icon={<Users size={18} />} label="Calouros" />
              <DashboardNavItem href="/dashboard/grupos" icon={<Users size={18} />} label="Grupos" />
              <DashboardNavItem href="/dashboard/encontros" icon={<Calendar size={18} />} label="Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon={<BookOpen size={18} />} label="Recursos" />
              <DashboardNavItem href="/dashboard/relatorios" icon={<BarChart3 size={18} />} label="Relatórios" />
              <DashboardNavItem href="/dashboard/configuracoes" icon={<Settings size={18} />} label="Minha Conta" />
            </>
          )}

          {user.role === "MENTOR" && (
            <>
              <DashboardNavItem href="/dashboard/mentor" icon={<LayoutDashboard size={18} />} label="Meu Painel" />
              <DashboardNavItem href="/dashboard/meus-calouros" icon={<Users size={18} />} label="Meus Calouros" />
              <DashboardNavItem href="/dashboard/encontros" icon={<Calendar size={18} />} label="Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon={<BookOpen size={18} />} label="Recursos" />
              <DashboardNavItem href="/dashboard/relatorios" icon={<BarChart3 size={18} />} label="Relatórios" />
              <DashboardNavItem href="/dashboard/configuracoes" icon={<Settings size={18} />} label="Minha Conta" />
            </>
          )}

          {user.role === "CALOURO" && (
            <>
              <DashboardNavItem href="/dashboard/calouro" icon={<LayoutDashboard size={18} />} label="Meu Painel" />
              <DashboardNavItem href="/dashboard/meu-mentor" icon={<UserCheck size={18} />} label="Meu Mentor" />
              <DashboardNavItem href="/dashboard/encontros" icon={<Calendar size={18} />} label="Meus Encontros" />
              <DashboardNavItem href="/dashboard/recursos" icon={<BookOpen size={18} />} label="Biblioteca" />
              <DashboardNavItem href="/dashboard/configuracoes" icon={<Settings size={18} />} label="Minha Conta" />
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(255,0,0,0.1)",
            border: "1px solid rgba(255,0,0,0.2)",
            color: "#ff6b6b",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
        >
          <LogOut size={16} />
          Sair da Plataforma
        </button>
      </aside>

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

function DashboardNavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      style={{
        padding: "10px 14px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: isActive ? "white" : "rgba(255,255,255,0.6)",
        background: isActive ? "rgba(211,252,114,0.12)" : "transparent",
        border: isActive ? "1px solid rgba(211,252,114,0.25)" : "1px solid transparent",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: isActive ? "600" : "400",
        transition: "all 0.2s ease"
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
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