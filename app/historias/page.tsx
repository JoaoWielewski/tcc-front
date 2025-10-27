"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Calculator, Users, Clock, Loader2, Trash2, Edit, Target, Play, Square } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"
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

interface Historia {
  id: string
  titulo: string
  descricao: string
  criado_em: string
  pf?: number
  tempo_pf?: string
  pcu?: number
  tempo_pcu?: string
  sp?: number
  tempo_sp?: string
  tempo_real?: string
  projeto?: {
    titulo: string
  }
  equipe?: {
    titulo: string
  }
  sessaoAtiva?: boolean
  sessaoId?: string
}

interface Sessao {
  id: string
  historiaId: string
  criado_em: string
}

export default function HistoryListPage() {
  const router = useRouter()
  const { toasts, addToast } = useToast()
  const [historias, setHistorias] = useState<Historia[]>([])
  const [filteredHistorias, setFilteredHistorias] = useState<Historia[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [startingSessionId, setStartingSessionId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    historiaId: string
    titulo: string
    action: "start" | "end" | null
  }>({
    open: false,
    historiaId: "",
    titulo: "",
    action: null,
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userId = localStorage.getItem("userId")

    if (!isLoggedIn || !userId) {
      router.push("/login")
      return
    }

    fetchHistorias()
  }, [router])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHistorias(historias)
    } else {
      const filtered = historias.filter(
        (historia) =>
          historia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          historia.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          historia.projeto?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          historia.equipe?.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredHistorias(filtered)
    }
  }, [searchTerm, historias])

  const fetchHistorias = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId")
      const response = await fetch(`http://localhost:4000/historias?usuarioId=${userId}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar histórias")
      }
      const data = await response.json()

      const historiasWithSessions = await Promise.all(
        data.map(async (historia: Historia) => {
          try {
            const sessaoResponse = await fetch(`http://localhost:4000/sessoes/historia/${historia.id}`)
            if (sessaoResponse.ok) {
              try {
                const sessao: Sessao | null = await sessaoResponse.json()
                if (sessao) {
                  return {
                    ...historia,
                    sessaoAtiva: true,
                    sessaoId: sessao.id,
                  }
                }
              } catch (jsonError) {
                console.log(`Nenhuma sessão ativa para história ${historia.id}`)
              }
            }
          } catch (error) {
            console.error(`Erro ao verificar sessão para história ${historia.id}:`, error)
          }
          return {
            ...historia,
            sessaoAtiva: false,
            sessaoId: undefined,
          }
        }),
      )

      setHistorias(historiasWithSessions)
      setFilteredHistorias(historiasWithSessions)
    } catch (error) {
      console.error("Erro ao buscar histórias:", error)
      addToast({
        type: "error",
        title: "Erro ao carregar histórias",
        description: "Não foi possível carregar a lista de histórias.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    router.push("/create")
  }

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`)
  }

  const handleEditTempoReal = (id: string) => {
    router.push(`/historias/${id}/tempo-real`)
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir a história "${titulo}"?`)) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`http://localhost:4000/historias/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir história")
      }

      setHistorias((prev) => prev.filter((h) => h.id !== id))
      setFilteredHistorias((prev) => prev.filter((h) => h.id !== id))

      addToast({
        type: "success",
        title: "História excluída!",
        description: `A história "${titulo}" foi excluída com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao excluir história:", error)
      addToast({
        type: "error",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a história.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleStartPlanningPoker = async (historiaId: string, titulo: string) => {
    setConfirmDialog({
      open: true,
      historiaId,
      titulo,
      action: "start",
    })
  }

  const handleEndPlanningPoker = async (historiaId: string, titulo: string) => {
    setConfirmDialog({
      open: true,
      historiaId,
      titulo,
      action: "end",
    })
  }

  const handleConfirmAction = async () => {
    const { historiaId, titulo, action } = confirmDialog

    if (action === "start") {
      try {
        setStartingSessionId(historiaId)
        const response = await fetch(`http://localhost:4000/sessoes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ historiaId }),
        })

        if (!response.ok) {
          throw new Error("Erro ao iniciar sessão")
        }

        const sessao: Sessao = await response.json()

        setHistorias((prev) =>
          prev.map((h) => (h.id === historiaId ? { ...h, sessaoAtiva: true, sessaoId: sessao.id } : h)),
        )
        setFilteredHistorias((prev) =>
          prev.map((h) => (h.id === historiaId ? { ...h, sessaoAtiva: true, sessaoId: sessao.id } : h)),
        )

        addToast({
          type: "success",
          title: "Sessão iniciada!",
          description: `Sessão de Planning Poker iniciada para "${titulo}".`,
        })
      } catch (error) {
        console.error("Erro ao iniciar sessão:", error)
        addToast({
          type: "error",
          title: "Erro ao iniciar sessão",
          description: "Não foi possível iniciar a sessão de Planning Poker.",
        })
      } finally {
        setStartingSessionId(null)
      }
    } else if (action === "end") {
      try {
        setStartingSessionId(historiaId)

        const historia = historias.find((h) => h.id === historiaId)
        if (!historia?.sessaoId) {
          throw new Error("Sessão não encontrada")
        }

        const response = await fetch(`http://localhost:4000/sessoes/${historia.sessaoId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erro ao encerrar sessão")
        }

        const result = await response.json()

        if (result.sucesso) {
          setHistorias((prev) =>
            prev.map((h) => (h.id === historiaId ? { ...h, sessaoAtiva: false, sessaoId: undefined } : h)),
          )
          setFilteredHistorias((prev) =>
            prev.map((h) => (h.id === historiaId ? { ...h, sessaoAtiva: false, sessaoId: undefined } : h)),
          )

          addToast({
            type: "success",
            title: "Sessão encerrada!",
            description: `Sessão de Planning Poker encerrada para "${titulo}".`,
          })
        } else {
          throw new Error("Falha ao encerrar sessão")
        }
      } catch (error) {
        console.error("Erro ao encerrar sessão:", error)
        addToast({
          type: "error",
          title: "Erro ao encerrar sessão",
          description: "Não foi possível encerrar a sessão de Planning Poker.",
        })
      } finally {
        setStartingSessionId(null)
      }
    }

    setConfirmDialog({ open: false, historiaId: "", titulo: "", action: null })
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
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  if (loading) {
    return (
      <Layout title="Histórias" subtitle="Carregando histórias...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando histórias...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Histórias" subtitle="Gerencie suas histórias de usuário">
      <ToastContainer toasts={toasts} />

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, historiaId: "", titulo: "", action: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "start"
                ? "Iniciar sessão de Planning Poker"
                : "Encerrar sessão de Planning Poker"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "start"
                ? `Deseja iniciar uma sessão de Planning Poker para a história "${confirmDialog.titulo}"?`
                : `Deseja encerrar a sessão de Planning Poker para a história "${confirmDialog.titulo}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar histórias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova História
          </Button>
        </motion.div>

        <AnimatePresence>
          {filteredHistorias.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? "Nenhuma história encontrada" : "Nenhuma história cadastrada"}
                </h3>
                <p className="text-gray-400">
                  {searchTerm ? "Tente ajustar os termos de busca" : "Comece criando sua primeira história de usuário"}
                </p>
              </div>
              {!searchTerm && (
                <Button onClick={handleCreateNew} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira História
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistorias.map((historia, index) => (
                <motion.div
                  key={historia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                            {historia.titulo}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1">
                            {formatDate(historia.criado_em)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">{historia.descricao}</p>

                      <div className="flex flex-wrap gap-2">
                        {historia.projeto && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {historia.projeto.titulo}
                          </Badge>
                        )}
                        {historia.equipe && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {historia.equipe.titulo}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Calculator className="h-3 w-3 text-blue-600" />
                            <span className="font-medium text-blue-800">PF</span>
                          </div>
                          <div className="text-blue-600 font-bold">{historia.pf || "--"}</div>
                          <div className="text-blue-500 text-xs">
                            {historia.tempo_pf ? `${historia.tempo_pf}h` : "--"}
                          </div>
                        </div>

                        <div className="bg-purple-50 p-2 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="h-3 w-3 text-purple-600" />
                            <span className="font-medium text-purple-800">PCU</span>
                          </div>
                          <div className="text-purple-600 font-bold">{historia.pcu || "--"}</div>
                          <div className="text-purple-500 text-xs">
                            {historia.tempo_pcu ? `${historia.tempo_pcu}h` : "--"}
                          </div>
                        </div>

                        <div className="bg-green-50 p-2 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-800">PH</span>
                          </div>
                          <div className="text-green-600 font-bold">{historia.sp || "--"}</div>
                          <div className="text-green-500 text-xs">
                            {historia.tempo_sp ? `${historia.tempo_sp}h` : "--"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-600" />
                            <span className="text-xs font-medium text-amber-800">Tempo Real</span>
                          </div>
                          <div className="text-amber-600 font-bold text-sm">
                            {historia.tempo_real ? `${historia.tempo_real}h` : "--"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {!historia.sessaoAtiva ? (
                            <Button
                              onClick={() => handleStartPlanningPoker(historia.id, historia.titulo)}
                              disabled={startingSessionId === historia.id}
                              className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                              {startingSessionId === historia.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="mr-2 h-4 w-4" />
                              )}
                              <span className="hidden sm:inline">Iniciar sessão</span>
                              <span className="sm:hidden">Iniciar</span>
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleEndPlanningPoker(historia.id, historia.titulo)}
                              disabled={startingSessionId === historia.id}
                              className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                            >
                              {startingSessionId === historia.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Square className="mr-2 h-4 w-4" />
                              )}
                              <span className="hidden sm:inline">Encerrar sessão</span>
                              <span className="sm:hidden">Encerrar</span>
                            </Button>
                          )}

                          <Button
                            onClick={() => handleEditTempoReal(historia.id)}
                            variant="outline"
                            className="w-full sm:flex-1 border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">
                              {historia.tempo_real ? "Editar tempo real" : "Adicionar tempo real"}
                            </span>
                            <span className="sm:hidden">Tempo real</span>
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handleEdit(historia.id)}
                            variant="outline"
                            className="w-full sm:flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>

                          <Button
                            onClick={() => handleDelete(historia.id, historia.titulo)}
                            variant="outline"
                            disabled={deletingId === historia.id}
                            className="w-full sm:flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                          >
                            {deletingId === historia.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}
