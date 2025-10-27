"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, Loader2, AlertTriangle, Plus, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Layout } from "@/components/layout"

interface Equipe {
  id: string
  titulo: string
  descricao: string
  criado_em: string
  familiaridade_metodologia?: number
  experiencia_dominio?: number
  experiencia_tecnologia?: number
  estabilidade_requisitos?: number
  experiencia_geral?: number
  participacao_cliente?: number
  motivacao_equipe?: number
  pressao_prazos?: number
}

export default function EquipesListPage() {
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const fetchEquipes = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:4000/equipes")
      if (!response.ok) {
        throw new Error("Erro ao carregar equipes")
      }
      const data = await response.json()
      setEquipes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`http://localhost:4000/equipes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar equipe")
      }

      const success = await response.json()
      if (success) {
        setEquipes((prev) => prev.filter((equipe) => equipe.id !== id))
        setDeleteId(null)
      } else {
        throw new Error("Falha ao deletar equipe")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar")
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Data inválida"
      }
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  const calculateTeamScore = (equipe: Equipe) => {
    const scores = [
      equipe.familiaridade_metodologia || 0,
      equipe.experiencia_dominio || 0,
      equipe.experiencia_tecnologia || 0,
      equipe.estabilidade_requisitos || 0,
      equipe.experiencia_geral || 0,
      equipe.participacao_cliente || 0,
      equipe.motivacao_equipe || 0,
      5 - (equipe.pressao_prazos || 0), // Inverte pressão de prazos (menos pressão = melhor)
    ]
    return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
  }

  useEffect(() => {
    fetchEquipes()
  }, [])

  if (loading) {
    return (
      <Layout title="Equipes - EstimAÍ" subtitle="Gerencie suas equipes de desenvolvimento no EstimAÍ">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando equipes do EstimAÍ...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Equipes - EstimAÍ" subtitle="Gerencie suas equipes de desenvolvimento no EstimAÍ">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/equipes/create")}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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

        {/* Teams Grid */}
        {equipes.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600">Nenhuma equipe encontrada</h3>
              <p className="text-gray-500">Comece criando sua primeira equipe no EstimAÍ</p>
              <Button
                onClick={() => router.push("/equipes/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Equipe
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipes.map((equipe, index) => {
              const teamScore = calculateTeamScore(equipe)
              const scoreColor = teamScore >= 4 ? "text-green-600" : teamScore >= 3 ? "text-yellow-600" : "text-red-600"
              const scoreBg = teamScore >= 4 ? "bg-green-50" : teamScore >= 3 ? "bg-yellow-50" : "bg-red-50"

              return (
                <motion.div
                  key={equipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-gray-800 truncate flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            {equipe.titulo}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {equipe.descricao}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em {formatDate(equipe.criado_em)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => router.push(`/equipes/edit/${equipe.id}`)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => setDeleteId(equipe.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}
