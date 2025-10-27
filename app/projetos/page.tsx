"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FolderOpen, Plus, Search, Users, Edit, Trash2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Projeto {
  id: string
  titulo: string
  descricao: string
  linguagem?: string
  createdAt: string
  updatedAt: string
  _count?: {
    equipes: number
  }
}

export default function ProjetosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toasts, addToast } = useToast()
  const hasShownToast = useRef(false)

  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Verificar parâmetros de sucesso na URL apenas uma vez
  useEffect(() => {
    const success = searchParams.get("success")
    if (success && !hasShownToast.current) {
      hasShownToast.current = true

      switch (success) {
        case "projeto-criado":
          addToast({
            type: "success",
            title: "Projeto criado com sucesso!",
            description: "O projeto foi adicionado à sua lista.",
          })
          break
        case "projeto-atualizado":
          addToast({
            type: "success",
            title: "Projeto atualizado com sucesso!",
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
    fetchProjetos()
  }, [])

  const fetchProjetos = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId")
      const response = await fetch(`http://localhost:4000/projetos?usuarioId=${userId}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar projetos")
      }
      const data = await response.json()
      setProjetos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${titulo}"?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/projetos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir projeto")
      }

      setProjetos((prev) => prev.filter((projeto) => projeto.id !== id))
      addToast({
        type: "success",
        title: "Projeto excluído",
        description: `O projeto "${titulo}" foi removido com sucesso.`,
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto. Tente novamente.",
      })
    }
  }

  const filteredProjetos = projetos.filter(
    (projeto) =>
      projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (projeto.linguagem && projeto.linguagem.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <Layout title="Projetos" subtitle="Gerencie seus projetos de desenvolvimento">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando projetos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Projetos" subtitle="Gerencie seus projetos de desenvolvimento">
      <ToastContainer toasts={toasts} />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => router.push("/projetos/create")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        {/* Projects Grid */}
        {filteredProjetos.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Tente ajustar os termos de busca"
                : "Comece criando seu primeiro projeto de desenvolvimento"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push("/projetos/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjetos.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
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
                            {projeto.titulo}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">{projeto.descricao}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {projeto.linguagem && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              {projeto.linguagem}
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/projetos/${projeto.id}/equipes`)}
                            className="flex-1"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Equipes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/projetos/edit/${projeto.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(projeto.id, projeto.titulo)}
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
