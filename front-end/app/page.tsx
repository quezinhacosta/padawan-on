"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  LogIn, 
  Users, 
  BookOpen, 
  Award,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react"

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
      if (formData.role === "ORIENTADOR") {
        router.push("/dashboard/orientador")
      } else if (formData.role === "MENTOR") {
        router.push("/dashboard/mentor")
      } else if (formData.role === "CALOURO") {
        router.push("/dashboard/calouro")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-40%] right-[-20%] w-[800px] h-[800px] bg-[#5531cc] rounded-full blur-[120px] opacity-20 animate-float" />
        <div className="absolute bottom-[-40%] left-[-20%] w-[800px] h-[800px] bg-[#d3fc72] rounded-full blur-[120px] opacity-10 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5531cc] rounded-full blur-[100px] opacity-5" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full max-w-6xl mx-auto">
          
          {/* Left Side */}
          <div className="space-y-12">
            {/* Logo */}
            <div className="flex items-center gap-4 animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d3fc72] to-[#5531cc] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">
                  <span className="text-[#d3fc72]">Padawan</span>
                  <span className="text-white"> ON</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-[#d3fc72]" />
                  <span className="text-sm text-white/40">Sistema de Gestão</span>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-6 animate-slide-up animation-delay-200">
              <h2 className="text-7xl font-bold leading-[1.1]">
                <span className="text-white">Programa</span>
                <br />
                <span className="gradient-text">Padawan</span>
              </h2>
              <p className="text-lg text-white/50 max-w-md leading-relaxed">
                Plataforma integrada para orientadores, mentores e calouros do programa de extensão da UNICAP
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 animate-slide-up animation-delay-400">
              {[
                { icon: Users, label: "Orientadores", desc: "Gestão" },
                { icon: BookOpen, label: "Mentores", desc: "Acompanhamento" },
                { icon: Award, label: "Calouros", desc: "Suporte" },
              ].map((item, i) => (
                <div key={i} className="card-modern p-5 group">
                  <item.icon className="w-6 h-6 text-[#d3fc72] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-white/30 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="card-modern p-8 lg:p-10 animate-slide-up animation-delay-600">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#d3fc72]/10 text-[#d3fc72] px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-[#d3fc72]/10">
                <Zap className="w-3 h-3" />
                Acesso Seguro
              </div>
              <h3 className="text-2xl font-bold text-white">Bem-vindo de volta</h3>
              <p className="text-white/40 mt-1 text-sm">Entre com suas credenciais</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  className="input-modern w-full px-4 py-3 rounded-xl text-white placeholder-white/30"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              {/* RA */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  <Mail className="w-4 h-4 inline mr-2" />
                  RA / Matrícula
                </label>
                <input
                  type="text"
                  placeholder="Digite seu RA"
                  className="input-modern w-full px-4 py-3 rounded-xl text-white placeholder-white/30"
                  value={formData.ra}
                  onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className="input-modern w-full px-4 py-3 rounded-xl text-white placeholder-white/30"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Tipo de Usuário
                </label>
                <select
                  className="input-modern w-full px-4 py-3 rounded-xl text-white bg-black/50"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  required
                >
                  <option value="" className="bg-black">Selecione seu perfil</option>
                  <option value="ORIENTADOR" className="bg-black">👨‍🏫 Orientador</option>
                  <option value="MENTOR" className="bg-black">🧑‍🎓 Mentor</option>
                  <option value="CALOURO" className="bg-black">👶 Calouro</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar no Sistema
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer */}
              <div className="text-center text-xs text-white/30 pt-2">
                <p>
                  Programa de Extensão Padawan
                  <br />
                  <span className="text-[#5531cc]">Ciência da Computação - UNICAP</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-white/10 text-sm">
        <p>© 2024 Padawan ON</p>
      </div>
    </div>
  )
}