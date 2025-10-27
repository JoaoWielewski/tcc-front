"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Clock, ArrowLeft, Loader2, CheckCircle, AlertTriangle, Users, Timer, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Historia {
  id: string
  titulo: string
  descricao: string
  projetoId: string
  equipeId: string
  criado_em: string
  pf?: number
  tempo_pf?: string
  pcu?: number
  tempo_pcu?: string
  tempo_real?: string
  projeto?: {
    id: string
    titulo: string
  }
  equipe?: {
    id: string
    titulo: string
  }
}

interface UpdateHistoriaDto {
  tempo_real?: string
}

export default function StoryDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { toasts, addToast } = useToast()

  const [historia, setHistoria] = useState<Historia | null>(null)
  const [formData, setFormData] = useState<UpdateHistoriaDto>({
    tempo_real: "",
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("estimativas")

  useEffect(() => {
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const fetchData = async () => {
    try {
      setLoadingData(true)

      // Buscar história
      const historiaResponse = await fetch(`http://localhost:4000/historias/${params.id}`)
      if (!historiaResponse.ok) {
        throw new Error("História não encontrada")
      }
      const historiaData = await historiaResponse.json()

      // Buscar equipe específica se existir equipeId
      let equipeData = null
      if (historiaData.equipeId) {
        try {
          const equipeResponse = await fetch(`http://localhost:4000/equipes/${historiaData.equipeId}`)
          if (equipeResponse.ok) {
            equipeData = await equipeResponse.json()
          }
        } catch (err) {
          console.warn("Erro ao buscar equipe:", err)
        }
      }

      // Buscar projeto específico se existir projetoId
      let projetoData = null
      if (historiaData.projetoId) {
        try {
          const projetoResponse = await fetch(`http://localhost:4000/projetos/${historiaData.projetoId}`)
          if (projetoResponse.ok) {
            projetoData = await projetoResponse.json()
          }
        } catch (err) {
          console.warn("Erro ao buscar projeto:", err)
        }
      }

      // Atualizar história com dados completos
      const historiaCompleta = {
        ...historiaData,
        equipe: equipeData,
        projeto: projetoData,
      }

      setHistoria(historiaCompleta)
      setFormData({
        tempo_real: historiaData.tempo_real || "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados da história.",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: keyof UpdateHistoriaDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:4000/historias/${params.id}/tempo-real`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempo_real: Number(formData.tempo_real),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar tempo real")
      }

      const result = await response.json()

      // Atualizar a história com o novo tempo real
      if (historia) {
        setHistoria({
          ...historia,
          tempo_real: result.tempo_real?.toString() || formData.tempo_real,
        })
      }

      addToast({
        type: "success",
        title: "Tempo real salvo!",
        description: "O tempo real foi registrado com sucesso.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao salvar tempo real",
        description: "Não foi possível salvar o tempo real.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEstimatePF = () => {
    router.push(`/estimate-pf/${params.id}`)
  }

  const handleEstimatePCU = () => {
    router.push(`/estimate-pcu/${params.id}`)
  }

  const handleBackToList = () => {
    router.push("/historias")
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

  if (loadingData) {
    return (
      <Layout title="Detalhes da História" subtitle="Carregando dados...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando dados da história...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error && !historia) {
    return (
      <Layout title="Erro" subtitle="História não encontrada">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">História não encontrada</h3>
                <p className="mb-4">{error}</p>
                <Button onClick={handleBackToList} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar à Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Detalhes da História" subtitle={historia?.titulo || "Carregando..."}>
      <ToastContainer toasts={toasts} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com informações básicas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">{historia?.titulo}</CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    Criado em {historia?.criado_em && formatDate(historia.criado_em)}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleBackToList}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Estimativas atuais */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Pontos de Função
                  </h4>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{historia?.pf || "--"}</div>
                    <div className="text-sm text-blue-700">
                      Tempo: {historia?.tempo_pf ? `${historia.tempo_pf}h` : "--"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Pontos de Caso de Uso
                  </h4>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{historia?.pcu || "--"}</div>
                    <div className="text-sm text-purple-700">
                      Tempo: {historia?.tempo_pcu ? `${historia.tempo_pcu}h` : "--"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Pontos de História
                  </h4>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">--</div>
                    <div className="text-sm text-green-700">Tempo: --</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tempo Real
                  </h4>
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {historia?.tempo_real ? `${historia.tempo_real}h` : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs para diferentes seções */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="estimativas" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Estimativas
              </TabsTrigger>
              <TabsTrigger value="tempo-real" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Tempo Real
              </TabsTrigger>
            </TabsList>

            {/* Tab: Estimativas */}
            <TabsContent value="estimativas" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estimativa PF */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg h-28 flex flex-col justify-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Pontos de Função
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Estimativa baseada em análise de pontos de função
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{historia?.pf || "--"}</div>
                      <div className="text-sm text-gray-600 mb-4">
                        Tempo estimado: {historia?.tempo_pf ? `${historia.tempo_pf}h` : "--"}
                      </div>
                      <Button
                        onClick={handleEstimatePF}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        {historia?.pf ? "Re-estimar PF" : "Estimar PF"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimativa PCU */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg h-28 flex flex-col justify-center">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Pontos de Caso de Uso
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Estimativa baseada em análise de casos de uso
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{historia?.pcu || "--"}</div>
                      <div className="text-sm text-gray-600 mb-4">
                        Tempo estimado: {historia?.tempo_pcu ? `${historia.tempo_pcu}h` : "--"}
                      </div>
                      <Button
                        onClick={handleEstimatePCU}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {historia?.pcu ? "Re-estimar PCU" : "Estimar PCU"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimativa PH */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg h-28 flex flex-col justify-center">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Pontos de História
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Estimativa baseada em pontos de história
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">--</div>
                      <div className="text-sm text-gray-600 mb-4">Tempo estimado: --</div>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                        <Target className="mr-2 h-4 w-4" />
                        Estimar PH
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Tempo Real */}
            <TabsContent value="tempo-real" className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Tempo Real de Execução
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Registre o tempo real gasto na execução da história
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSaveData} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tempo_real">Tempo Real (em horas)</Label>
                      <Input
                        id="tempo_real"
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.tempo_real}
                        onChange={(e) => handleInputChange("tempo_real", e.target.value)}
                        placeholder="Ex: 8.5"
                        className="border-gray-200 focus:border-amber-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Salvar Tempo Real
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
      </div>
    </Layout>
  )
}
