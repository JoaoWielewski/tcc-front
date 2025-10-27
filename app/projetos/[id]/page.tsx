"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit,
  Trash2,
  Calendar,
  Loader2,
  AlertTriangle,
  Plus,
  Users,
  FolderOpen,
  ArrowLeft,
  FileText,
  Clock,
} from "lucide-react"
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

interface Log {
  id: string
  projetoId: string
  descricao: string
  criado_em: string
}

interface Projeto {
  id: string
  titulo: string
  descricao: string
  linguagem?: string
  criado_em: string
  logs?: Log[]
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
  sistema_distribuido?: number
  requisitos_performance?: number
  eficiencia_usuario_final?: number
  complexidade_processamento?: number
  reusabilidade_extra?: number
  facilidade_instalacao_extra?: number
  facilidade_uso?: number
  portabilidade?: number
  facilidade_mudancas?: number
  conexoes_simultaneas?: number
  requisitos_seguranca?: number
  acesso_componentes_terceiros?: number
  treinamento_especializado?: number
}

interface Equipe {
  id: string
  titulo: string
  descricao: string
  projetoId: string
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

export default function ProjetoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingEquipes, setLoadingEquipes] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteEquipeId, setDeleteEquipeId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProjeto = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:4000/projetos/${id}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar projeto")
      }
      const data = await response.json()
      setProjeto(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const fetchEquipes = async () => {
    try {
      setLoadingEquipes(true)
      const response = await fetch(`http://localhost:4000/equipes?projetoId=${id}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar equipes")
      }
      const data = await response.json()
      setEquipes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoadingEquipes(false)
    }
  }

  const handleDeleteEquipe = async (equipeId: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`http://localhost:4000/equipes/${equipeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar equipe")
      }

      const success = await response.json()
      if (success) {
        setEquipes((prev) => prev.filter((equipe) => equipe.id !== equipeId))
        setDeleteEquipeId(null)
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

  useEffect(() => {
    if (id) {
      fetchProjeto()
      fetchEquipes()
    }
  }, [id])

  if (loading) {
    return (
      <Layout title="Carregando Projeto - EstimAÍ" subtitle="Carregando informações do projeto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!projeto) {
    return (
      <Layout title="Projeto não encontrado - EstimAÍ" subtitle="O projeto solicitado não foi encontrado">
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600">Projeto não encontrado</h3>
            <p className="text-gray-500">O projeto que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => router.push("/projetos")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${projeto.titulo} - EstimAÍ`} subtitle="Detalhes, equipes e histórico do projeto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/projetos")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Projetos
          </Button>
          <Button
            onClick={() => router.push(`/projetos/edit/${projeto.id}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Projeto
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

        {/* Project Details, Teams and Logs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Equipes ({equipes.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Histórico ({projeto.logs?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {projeto.titulo}
                </CardTitle>
                <CardDescription className="text-blue-100">Criado em {formatDate(projeto.criado_em)}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
                  <p className="text-gray-600">{projeto.descricao}</p>
                </div>
                {projeto.linguagem && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Linguagem</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {projeto.linguagem}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end">
              <Button
                onClick={() => router.push(`/projetos/${id}/equipes/create`)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Equipe
              </Button>
            </div>

            {/* Teams Grid */}
            {loadingEquipes ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-gray-600">Carregando equipes...</p>
                </div>
              </div>
            ) : equipes.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">Nenhuma equipe encontrada</h3>
                  <p className="text-gray-500">Comece criando a primeira equipe para este projeto</p>
                  <Button
                    onClick={() => router.push(`/projetos/${id}/equipes/create`)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Equipe
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipes.map((equipe, index) => (
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
                            onClick={() => router.push(`/projetos/${id}/equipes/edit/${equipe.id}`)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => setDeleteEquipeId(equipe.id)}
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
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {!projeto.logs || projeto.logs.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">Nenhum histórico disponível</h3>
                  <p className="text-gray-500">
                    As alterações realizadas neste projeto aparecerão aqui automaticamente
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {projeto.logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-blue-100 rounded-full">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-medium mb-1">{log.descricao}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(log.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteEquipeId} onOpenChange={() => setDeleteEquipeId(null)}>
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
                onClick={() => deleteEquipeId && handleDeleteEquipe(deleteEquipeId)}
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
