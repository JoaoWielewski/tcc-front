"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, CheckCircle, Loader2, ArrowLeft, AlertTriangle, Eye, EyeOff, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"

interface CreateEquipeUsuarioDto {
  equipeId: string
  email: string
  name: string
}

interface CreateUsuarioResponse {
  id: string
  senhaTemporaria: string
}

interface Projeto {
  id: string
  titulo: string
  descricao: string
}

interface Equipe {
  id: string
  titulo: string
  descricao: string
  projetoId: string
}

export default function CreateProfissionalEquipePage() {
  const router = useRouter()
  const params = useParams()
  const projetoId = params.id as string
  const equipeId = params.equipeId as string

  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [equipe, setEquipe] = useState<Equipe | null>(null)
  const [formData, setFormData] = useState<CreateEquipeUsuarioDto>({
    equipeId: equipeId,
    email: "",
    name: "",
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<CreateUsuarioResponse | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)

        // Fetch projeto
        const projetoResponse = await fetch(`http://localhost:4000/projetos/${projetoId}`)
        if (!projetoResponse.ok) {
          throw new Error("Erro ao carregar projeto")
        }
        const projetoData = await projetoResponse.json()
        setProjeto(projetoData)

        // Fetch equipe
        const equipeResponse = await fetch(`http://localhost:4000/equipes/${equipeId}`)
        if (!equipeResponse.ok) {
          throw new Error("Erro ao carregar equipe")
        }
        const equipeData = await equipeResponse.json()
        setEquipe(equipeData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoadingData(false)
      }
    }

    if (projetoId && equipeId) {
      fetchData()
    }
  }, [projetoId, equipeId])

  const handleInputChange = (field: keyof CreateEquipeUsuarioDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:4000/usuarios/equipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar profissional")
      }

      const result: CreateUsuarioResponse = await response.json()
      setCreatedUser(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToProfessionals = () => {
    router.push(`/projetos/${projetoId}/equipes/${equipeId}/usuarios?success=usuario-criado`)
  }

  const handleBackToProfessionalsWithoutSuccess = () => {
    router.push(`/projetos/${projetoId}/equipes/${equipeId}/usuarios`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loadingData) {
    return (
      <Layout title="Adicionar Profissional - EstimAÍ" subtitle="Carregando informações">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Se o profissional foi criado com sucesso, mostrar os dados
  if (createdUser) {
    return (
      <Layout
        title={`Profissional Criado - ${equipe?.titulo || "Equipe"} - EstimAÍ`}
        subtitle="Profissional adicionado à equipe com sucesso"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Profissional Criado com Sucesso!
                </CardTitle>
                <CardDescription className="text-green-100">
                  O profissional foi adicionado à equipe {equipe?.titulo}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Dados de Acesso</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Email:</Label>
                          <p className="font-mono text-sm">{formData.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(formData.email)}
                          className="text-blue-600"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded border">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-600">Senha Temporária:</Label>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm">
                              {showPassword ? createdUser.senhaTemporaria : "••••••••"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdUser.senhaTemporaria)}
                          className="text-blue-600"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold text-amber-800">Importante:</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Compartilhe estes dados com o profissional. A senha temporária deve ser alterada no primeiro
                          acesso.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleBackToProfessionals}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Concluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`Adicionar Profissional - ${equipe?.titulo || "Equipe"} - EstimAÍ`}
      subtitle={`Adicione um novo profissional à equipe ${equipe?.titulo || ""}`}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={() => router.push("/projetos")}>
            Projetos
          </Button>
          <span>/</span>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/projetos/${projetoId}`)}>
            {projeto?.titulo}
          </Button>
          <span>/</span>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/projetos/${projetoId}/equipes`)}>
            Equipes
          </Button>
          <span>/</span>
          <Button variant="ghost" size="sm" onClick={handleBackToProfessionalsWithoutSuccess}>
            {equipe?.titulo}
          </Button>
          <span>/</span>
          <span className="font-medium">Novo Profissional</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados do Profissional */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Dados do Profissional
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Informações do profissional que será adicionado à equipe {equipe?.titulo}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Digite o nome do profissional..."
                    required
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Digite o email do profissional..."
                    required
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-semibold text-blue-800">Informação:</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Uma senha temporária será gerada automaticamente para o profissional. Ele deverá alterá-la no
                        primeiro acesso.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToProfessionalsWithoutSuccess}
              className="px-8 py-3 text-lg font-semibold bg-transparent"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.email || !formData.name}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Criar Profissional
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Erro:</span>
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}
