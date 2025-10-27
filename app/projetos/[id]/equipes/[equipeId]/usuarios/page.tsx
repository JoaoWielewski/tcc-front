"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Trash2, Loader2, ArrowLeft, Mail, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Usuario {
  id: string
  name: string | null
  email: string
  criado_em: Date
}

interface Equipe {
  id: string
  titulo: string
  descricao: string
  projetoId: string
}

interface Projeto {
  id: string
  titulo: string
  descricao: string
}

export default function ProfissionaisEquipePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toasts, addToast } = useToast()
  const projetoId = params.id as string
  const equipeId = params.equipeId as string
  const hasShownToast = useRef(false)

  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [equipe, setEquipe] = useState<Equipe | null>(null)
  const [profissionais, setProfissionais] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Verificar parâmetros de sucesso na URL apenas uma vez
  useEffect(() => {
    const success = searchParams.get("success")
    if (success && !hasShownToast.current) {
      hasShownToast.current = true

      switch (success) {
        case "usuario-criado":
          addToast({
            type: "success",
            title: "Profissional criado com sucesso!",
            description: "O profissional foi adicionado à equipe.",
          })
          break
      }

      // Limpar parâmetro da URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("success")
      window.history.replaceState({}, "", newUrl.toString())
    }
  }, [searchParams, addToast])

  useEffect(() => {
    if (projetoId && equipeId) {
      fetchData()
    }
  }, [projetoId, equipeId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Buscar projeto
      const projetoResponse = await fetch(`http://localhost:4000/projetos/${projetoId}`)
      if (!projetoResponse.ok) {
        throw new Error("Projeto não encontrado")
      }
      const projetoData = await projetoResponse.json()
      setProjeto(projetoData)

      // Buscar equipe
      const equipeResponse = await fetch(`http://localhost:4000/equipes/${equipeId}`)
      if (!equipeResponse.ok) {
        throw new Error("Equipe não encontrada")
      }
      const equipeData = await equipeResponse.json()
      setEquipe(equipeData)

      // Buscar profissionais da equipe
      const profissionaisResponse = await fetch(`http://localhost:4000/usuarios?equipeId=${equipeId}`)
      if (!profissionaisResponse.ok) {
        throw new Error("Erro ao carregar profissionais")
      }
      const profissionaisData = await profissionaisResponse.json()
      setProfissionais(profissionaisData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string, email: string) => {
    const displayName = name || email
    if (!confirm(`Tem certeza que deseja remover "${displayName}" da equipe?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/usuarios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao remover profissional")
      }

      setProfissionais((prev) => prev.filter((profissional) => profissional.id !== id))
      addToast({
        type: "success",
        title: "Profissional removido",
        description: `"${displayName}" foi removido da equipe com sucesso.`,
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Erro ao remover profissional",
        description: "Não foi possível remover o profissional. Tente novamente.",
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredProfissionais = profissionais.filter(
    (profissional) =>
      (profissional.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      profissional.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Layout title="Profissionais da Equipe" subtitle="Carregando informações...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando profissionais...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Erro" subtitle="Não foi possível carregar as informações">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <Users className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600">{error}</p>
          </div>
          <Button onClick={() => router.push(`/projetos/${projetoId}/equipes`)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Equipes
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`Profissionais - ${equipe?.titulo || "Equipe"}`}
      subtitle={`Gerencie os profissionais da equipe ${equipe?.titulo || ""}`}
    >
      <ToastContainer toasts={toasts} />

      <div className="space-y-6">
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
          <span className="font-medium">{equipe?.titulo}</span>
          <span>/</span>
          <span>Profissionais</span>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar profissionais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => router.push(`/projetos/${projetoId}/equipes/${equipeId}/usuarios/create`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Profissional
          </Button>
        </div>

        {/* Professionals Grid */}
        {filteredProfissionais.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "Nenhum profissional encontrado" : "Nenhum profissional cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Tente ajustar os termos de busca"
                : "Comece adicionando o primeiro profissional para esta equipe"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push(`/projetos/${projetoId}/equipes/${equipeId}/usuarios/create`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Profissional
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProfissionais.map((profissional, index) => (
                <motion.div
                  key={profissional.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {profissional.name || "Sem nome"}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {profissional.email}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>Criado em {formatDate(profissional.criado_em)}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Users className="mr-1 h-3 w-3" />
                            Ativo
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(profissional.id, profissional.name || "", profissional.email)}
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  )
}
