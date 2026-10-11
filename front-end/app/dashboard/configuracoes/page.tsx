"use client"

import { useState, useEffect, useRef } from "react"
import { Settings, User, Building, CheckCircle2, Camera, Lock, Mail, Save, AlertCircle } from "lucide-react"

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [perfilForm, setPerfilForm] = useState({
    nomeCompleto: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    fotoPerfil: ""
  })

  const [config, setConfig] = useState({
    semestre: "2026.1",
    departamento: "Ciência da Computação",
    instituicao: "Universidade Católica de Pernambuco (UNICAP)",
    maxCalourosPadrao: 5
  })

  useEffect(() => {
    carregarPerfilAtual()
  }, [])

  const getHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  const carregarPerfilAtual = async () => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const u = JSON.parse(stored)
        setUser(u)
        setPerfilForm(prev => ({
          ...prev,
          nomeCompleto: u.nome_completo || u.nome || "",
          email: u.email || "",
          fotoPerfil: u.foto_perfil || ""
        }))
      }

      const res = await fetch('/api/auth/me', { headers: getHeaders() })
      if (res.ok) {
        const data = await res.json()
        if (data.usuario) {
          setUser(data.usuario)
          localStorage.setItem("user", JSON.stringify(data.usuario))
          setPerfilForm(prev => ({
            ...prev,
            nomeCompleto: data.usuario.nome_completo || data.usuario.nome || "",
            email: data.usuario.email || "",
            fotoPerfil: data.usuario.foto_perfil || ""
          }))
        }
      }
    } catch (err) {}
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErro("Por favor, selecione um arquivo de imagem válido.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErro("A imagem selecionada deve ter no máximo 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setPerfilForm(prev => ({ ...prev, fotoPerfil: base64 }))
      setErro("")
    }
    reader.readAsDataURL(file)
  }

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!perfilForm.nomeCompleto.trim()) {
      setErro("O nome completo é obrigatório.")
      return
    }

    if (!perfilForm.email.trim()) {
      setErro("O e-mail é obrigatório.")
      return
    }

    if (perfilForm.novaSenha) {
      if (perfilForm.novaSenha.length < 4) {
        setErro("A nova senha deve possuir no mínimo 4 caracteres.")
        return
      }
      if (perfilForm.novaSenha !== perfilForm.confirmarSenha) {
        setErro("A confirmação da nova senha não confere.")
        return
      }
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/perfil', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          nomeCompleto: perfilForm.nomeCompleto,
          email: perfilForm.email,
          senhaAtual: perfilForm.senhaAtual || undefined,
          novaSenha: perfilForm.novaSenha || undefined,
          fotoPerfil: perfilForm.fotoPerfil
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || data.message || "Erro ao atualizar perfil.")
        setIsSubmitting(false)
        return
      }

      setUser(data.usuario)
      localStorage.setItem("user", JSON.stringify(data.usuario))
      setPerfilForm(prev => ({
        ...prev,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
      }))

      setSalvo(true)
      setTimeout(() => setSalvo(false), 4000)
    } catch (err) {
      setErro("Erro de conexão ao salvar alterações.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayName = user?.nome || user?.nome_completo || user?.nome_usuario || "Usuário"
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <Settings size={28} color="#d3fc72" /> Minha Conta e Configurações
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
          Altere suas informações pessoais, senha, e-mail e foto de perfil
        </p>
      </div>

      <div style={{
        maxWidth: "760px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {salvo && (
          <div style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(211,252,114,0.15)",
            border: "1px solid rgba(211,252,114,0.3)",
            color: "#d3fc72",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <CheckCircle2 size={18} /> Dados atualizados com sucesso!
          </div>
        )}

        {erro && (
          <div style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(255,0,0,0.1)",
            border: "1px solid rgba(255,0,0,0.2)",
            color: "#ff6b6b",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <AlertCircle size={18} /> {erro}
          </div>
        )}

        <form onSubmit={handleSalvarPerfil} style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "18px",
          padding: "28px",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "22px"
        }}>
          <h3 style={{ color: "white", fontSize: "17px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={20} color="#d3fc72" /> Dados Pessoais e Foto de Perfil
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: user?.role === "ORIENTADOR" 
                  ? "linear-gradient(135deg, #d3fc72, #a8e04a)" 
                  : user?.role === "MENTOR"
                  ? "linear-gradient(135deg, #a78bfa, #5531cc)"
                  : "linear-gradient(135deg, #ff8787, #e03131)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                color: user?.role === "ORIENTADOR" ? "black" : "white",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.1)"
              }}>
                {perfilForm.fotoPerfil ? (
                  <img
                    src={perfilForm.fotoPerfil}
                    alt={displayName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  userInitial
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#d3fc72",
                  border: "2px solid #121212",
                  color: "black",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Carregar nova foto"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <p style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>Foto do Perfil</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>
                PNG, JPG ou GIF até 5MB. Aparecerá no menu lateral e nos relatórios.
              </p>
              {perfilForm.fotoPerfil && (
                <button
                  type="button"
                  onClick={() => setPerfilForm(prev => ({ ...prev, fotoPerfil: "" }))}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                    marginTop: "6px"
                  }}
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={perfilForm.nomeCompleto}
                onChange={(e) => setPerfilForm({ ...perfilForm, nomeCompleto: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                E-mail Institucional *
              </label>
              <input
                type="email"
                value={perfilForm.email}
                onChange={(e) => setPerfilForm({ ...perfilForm, email: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                RA / Matrícula
              </label>
              <input
                type="text"
                value={user?.ra || ""}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "not-allowed"
                }}
              />
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Papel / Função
              </label>
              <input
                type="text"
                value={user?.role || ""}
                disabled
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#d3fc72",
                  fontWeight: "600",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "not-allowed"
                }}
              />
            </div>
          </div>

          <div style={{
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <h4 style={{ color: "white", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={16} color="#a78bfa" /> Alterar Senha (Opcional)
            </h4>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              Deixe em branco caso deseje manter a senha atual.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Senha Atual
                </label>
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={perfilForm.senhaAtual}
                  onChange={(e) => setPerfilForm({ ...perfilForm, senhaAtual: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 4 caracteres"
                  value={perfilForm.novaSenha}
                  onChange={(e) => setPerfilForm({ ...perfilForm, novaSenha: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Repita a nova senha"
                  value={perfilForm.confirmarSenha}
                  onChange={(e) => setPerfilForm({ ...perfilForm, confirmarSenha: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #d3fc72, #a8e04a)",
              color: "black",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              alignSelf: "flex-end"
            }}
          >
            <Save size={16} /> {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>

        {user?.role === "ORIENTADOR" && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "18px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}>
            <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building size={18} color="#d3fc72" /> Parâmetros do Programa de Extensão
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Semestre Vigente
                </label>
                <input
                  type="text"
                  value={config.semestre}
                  onChange={(e) => setConfig({ ...config, semestre: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Departamento / Curso
                </label>
                <input
                  type="text"
                  value={config.departamento}
                  onChange={(e) => setConfig({ ...config, departamento: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Instituição de Ensino
              </label>
              <input
                type="text"
                value={config.instituicao}
                onChange={(e) => setConfig({ ...config, instituicao: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
