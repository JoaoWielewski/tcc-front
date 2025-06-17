"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Plus, Edit, Trash2, Calendar, Loader2, AlertTriangle } from "lucide-react"
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

interface Historia {
  id: string
  titulo: string
  descricao: string
  linguagem?: string
  pf: number
  tempo_pf: string
  criado_em: string
  ee_td: number
  ee_ar: number
  se_td: number
  se_ar: number
  ce_td: number
  ce_ar: number
  ali_td: number
  ali_ar: number
  aie_td: number
  aie_ar: number
  comm_dados?: number
  proc_distribuido?: number
  performance?: number
  uso_config?: number
  volume_transacoes?: number
  entrada_online?: number
  eficiencia_usuario?: number
  atualizacao_online?: number
  proc_complexo?: number
  reusabilidade?: number
  facil_instalacao?: number
  facil_operacao?: number
  multiplos_locais?: number
  facil_mudanca?: number
}

export default function HistoryListPage() {
  const [historias, setHistorias] = useState<Historia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const fetchHistorias = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/historias")
      if (!response.ok) {
        throw new Error("Erro ao carregar histórias")
      }
      const data = await response.json()
      setHistorias(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`http://localhost:3000/historias/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar história")
      }

      const success = await response.json()
      if (success) {
        setHistorias((prev) => prev.filter((historia) => historia.id !== id))
        setDeleteId(null)
      } else {
        throw new Error("Falha ao deletar história")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar")
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    fetchHistorias()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-gray-600">Carregando histórias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EstimAÍ
              </h1>
            </div>
            <p className="text-lg text-gray-600 mt-2">Gerencie suas estimativas de histórias</p>
          </div>

          <Button
            onClick={() => router.push("/create")}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova História
          </Button>
        </motion.div>

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

        {/* Stories Grid */}
        {historias.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600">Nenhuma história encontrada</h3>
              <p className="text-gray-500">Comece criando sua primeira estimativa de história</p>
              <Button
                onClick={() => router.push("/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira História
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historias.map((historia, index) => (
              <motion.div
                key={historia.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-gray-800 truncate">{historia.titulo}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {historia.descricao}
                        </CardDescription>
                      </div>
                      {historia.linguagem && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 shrink-0">
                          {historia.linguagem}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{historia.pf}</div>
                        <div className="text-xs text-blue-700 uppercase tracking-wide">PF</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{historia.tempo_pf}h</div>
                        <div className="text-xs text-green-700 uppercase tracking-wide">Tempo</div>
                      </div>
                    </div>

                    {/* Expanded Metrics */}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium">Tempo PF:</span>
                        <span className="font-bold text-blue-700">{historia.tempo_pf}h</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                        <span className="font-medium">Tempo UseCase:</span>
                        <span className="font-bold text-purple-700">--</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="font-medium">Tempo Story Points:</span>
                        <span className="font-bold text-green-700">--</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                        <span className="font-medium">Tempo Real:</span>
                        <span className="font-bold text-amber-700">--</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Criado em {formatDate(historia.criado_em)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => router.push(`/edit/${historia.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => setDeleteId(historia.id)}
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
            ))}
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
                Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.
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
    </div>
  )
}
