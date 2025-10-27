"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Edit, Trash2, Loader2, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Equipe {
  id: string
  titulo: string
  descricao: string
  projetoId: string
  createdAt: string
  updatedAt: string
}

interface Projeto {
  id: string
  titulo: string
  descricao: string
}

export default function EquipesProjetoPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toasts, addToast } = useToast()
  const projetoId = params.id as string
  const hasShownToast = useRef(false)

  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Verificar parâmetros de sucesso na URL apenas uma vez
  useEffect(() => {
    const success = searchParams.get("success")
    if (success && !hasShownToast.current) {
      hasShownToast.current = true

      switch (success) {
        case "equipe-criada":
          addToast({
            type: "success",
            title: "Equipe criada com sucesso!",
            description: "A equipe foi adicionada ao projeto.",
          })
          break
        case "equipe-atualizada":
          addToast({
            type: "success",
            title: "Equipe atualizada com sucesso!",
            description: "As alterações foram salvas.",
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
    if (projetoId) {
      fetchData()
    }
  }, [projetoId])

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

      // Buscar equipes do projeto
      const equipesResponse = await fetch(`http://localhost:4000/equipes?projetoId=${projetoId}`)
      if (!equipesResponse.ok) {
        throw new Error("Erro ao carregar equipes")
      }
      const equipesData = await equipesResponse.json()
      setEquipes(equipesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do projeto.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir a equipe "${titulo}"?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/equipes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir equipe")
      }

      setEquipes((prev) => prev.filter((equipe) => equipe.id !== id))
      addToast({
        type: "success",
        title: "Equipe excluída",
        description: `A equipe "${titulo}" foi removida com sucesso.`,
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Erro ao excluir equipe",
        description: "Não foi possível excluir a equipe. Tente novamente.",
      })
    }
  }

  const filteredEquipes = equipes.filter(
    (equipe) =>
      equipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipe.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Layout title="Equipes do Projeto" subtitle="Carregando informações...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando equipes...</p>
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
            <h3 className="text-xl font-semibold mb-2">Erro ao carregar projeto</h3>
            <p className="text-gray-600">{error}</p>
          </div>
          <Button onClick={() => router.push("/projetos")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`Equipes - ${projeto?.titulo || "Projeto"}`}
      subtitle={`Gerencie as equipes do projeto ${projeto?.titulo || ""}`}
    >
      <ToastContainer toasts={toasts} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={() => router.push("/projetos")}>
            Projetos
          </Button>
          <span>/</span>
          <span className="font-medium">{projeto?.titulo}</span>
          <span>/</span>
          <span>Equipes</span>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar equipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => router.push(`/projetos/${projetoId}/equipes/create`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Button>
        </div>

        {/* Teams Grid */}
        {filteredEquipes.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "Nenhuma equipe encontrada" : "Nenhuma equipe cadastrada"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Tente ajustar os termos de busca" : "Comece criando a primeira equipe para este projeto"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push(`/projetos/${projetoId}/equipes/create`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Equipe
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredEquipes.map((equipe, index) => (
                <motion.div
                  key={equipe.id}
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
                            {equipe.titulo}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{equipe.descricao}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Users className="mr-1 h-3 w-3" />
                            Equipe
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/projetos/${projetoId}/equipes/${equipe.id}/usuarios`)}
                            className="flex-1"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Profissionais
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/projetos/${projetoId}/equipes/edit/${equipe.id}`)}
                            className="flex-1"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(equipe.id, equipe.titulo)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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
