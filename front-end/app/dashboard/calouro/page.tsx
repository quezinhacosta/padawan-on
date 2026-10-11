"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Users, Calendar, BookOpen, Star, Mail, MapPin, ExternalLink, ArrowRight, Video, FileText, PenTool, Link as LinkIcon } from "lucide-react"

interface CalouroSummary {
  calouro: {
    id: number
    nome: string
    ra: string
    curso: string
    periodo: string
  }
  mentor: {
    nome: string
    email: string
    disponivel: boolean
  } | null
  grupoNome: string | null
  encontrosCount: number
  encontrosRealizadosCount: number
  proximosEncontros: any[]
}

interface Recurso {
  id: number
  titulo: string
  tipo: "VIDEO" | "DOCUMENTO" | "LINK" | "EXERCICIO"
  descricao: string
  url: string
}

export default function CalouroDashboard() {
  const router = useRouter()
  const [data, setData] = useState<CalouroSummary | null>(null)
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      const headers = getHeaders()

      const resResumo = await fetch('/api/dashboard/calouro-resumo', { headers })
      if (resResumo.ok) {
        const jsonResumo = await resResumo.json()
        setData(jsonResumo)
      }

      const resRecursos = await fetch('/api/recursos', { headers })
      if (resRecursos.ok) {
        const jsonRecursos = await resRecursos.json()
        setRecursos(jsonRecursos.slice(0, 4))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "VIDEO":
        return <Video size={24} color="#d3fc72" />
      case "DOCUMENTO":
        return <FileText size={24} color="#60a5fa" />
      case "LINK":
        return <LinkIcon size={24} color="#a78bfa" />
      case "EXERCICIO":
        return <PenTool size={24} color="#f59e0b" />
      default:
        return <BookOpen size={24} color="#d3fc72" />
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
        Carregando painel do calouro...
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
            <User size={28} color="#d3fc72" /> Olá, {data?.calouro?.nome || "Calouro"}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {data?.calouro?.curso || "Ciência da Computação"} - {data?.calouro?.periodo || "1º Período"} • RA: {data?.calouro?.ra}
          </p>
        </div>

        {data?.mentor && (
          <a
            href={`mailto:${data.mentor.email}?subject=Mentoria Padawan ON - Dúvida`}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #5531cc, #3d1f99)",
              color: "white",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 0 25px rgba(85,49,204,0.3)"
            }}
          >
            <Mail size={16} /> Contatar Mentor
          </a>
        )}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px"
      }}>
        {data?.mentor ? (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "4px" }}>
                Seu Mentor Responsável {data.grupoNome ? `• ${data.grupoNome}` : ''}
              </p>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
                {data.mentor.nome}
              </h3>
              <p style={{ color: "#d3fc72", fontSize: "14px", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} /> {data.mentor.email}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                background: data.mentor.disponivel ? "rgba(211,252,114,0.2)" : "rgba(255,107,107,0.2)",
                color: data.mentor.disponivel ? "#d3fc72" : "#ff6b6b"
              }}>
                {data.mentor.disponivel ? "Disponível" : "Em atendimento"}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <p style={{ color: "#ffa500", fontSize: "15px", fontWeight: "500" }}>
              Você ainda não foi alocado em um grupo de mentoria.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "4px" }}>
              O coordenador do programa fará a vinculação em breve. Enquanto isso, aproveite os recursos educacionais abaixo!
            </p>
          </div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Calendar size={20} color="#d3fc72" />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Total de Encontros</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.encontrosCount || 0}
          </p>
          <p style={{ color: "#d3fc72", fontSize: "12px", marginTop: "4px" }}>
            {data?.encontrosRealizadosCount || 0} já realizados
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Star size={20} color="#a78bfa" />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Frequência</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {data?.encontrosCount && data.encontrosCount > 0 
              ? `${Math.round(((data.encontrosRealizadosCount || 0) / data.encontrosCount) * 100)}%` 
              : "100%"}
          </p>
          <p style={{ color: "#a78bfa", fontSize: "12px", marginTop: "4px" }}>
            Participação ativa
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <BookOpen size={20} color="#4ecdc4" />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Recursos Disponíveis</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
            {recursos.length}
          </p>
          <p style={{ color: "#4ecdc4", fontSize: "12px", marginTop: "4px" }}>
            Materiais de apoio
          </p>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color="#d3fc72" /> Próximos Encontros Agendados
          </h3>
          <button 
            onClick={() => router.push("/dashboard/encontros")}
            style={{
              padding: "4px 12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
            Ver todos <ArrowRight size={12} />
          </button>
        </div>

        {!data?.proximosEncontros || data.proximosEncontros.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            Nenhum encontro agendado no momento.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.proximosEncontros.map((encontro) => (
              <div key={encontro.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <p style={{ color: "white", fontSize: "15px", fontWeight: "500" }}>
                    {encontro.titulo}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <MapPin size={12} /> {encontro.local} • {new Date(encontro.data_hora).toLocaleString('pt-BR')}
                  </p>
                  {encontro.descricao && (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>
                      {encontro.descricao}
                    </p>
                  )}
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  background: "rgba(211,252,114,0.15)",
                  color: "#d3fc72"
                }}>
                  Confirmado
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={18} color="#d3fc72" /> Recursos Educacionais Recomendados
          </h3>
          <button 
            onClick={() => router.push("/dashboard/recursos")}
            style={{
              padding: "4px 12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
            Ver todos <ArrowRight size={12} />
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {recursos.map((recurso) => (
            <a
              key={recurso.id}
              href={recurso.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid rgba(255,255,255,0.05)",
                textDecoration: "none",
                display: "block",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                {getTipoIcon(recurso.tipo)}
              </div>
              <h4 style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                {recurso.titulo}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", lineHeight: "1.4" }}>
                {recurso.descricao}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}