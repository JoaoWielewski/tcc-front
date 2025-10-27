"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, CheckCircle, Loader2, HelpCircle, AlertTriangle, Clock, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"

interface UpdateEquipeDto {
  titulo?: string
  descricao?: string
  familiaridade_metodologia?: number
  experiencia_dominio?: number
  experiencia_tecnologia?: number
  estabilidade_requisitos?: number
  experiencia_geral?: number
  participacao_cliente?: number
  motivacao_equipe?: number
  pressao_prazos?: number
  tempo_horas_por_sp?: number
}

const dadosEquipe = [
  {
    key: "familiaridade_metodologia",
    label: "Familiaridade com a metodologia de desenvolvimento",
    tooltip:
      "Avalie o conhecimento da equipe com a metodologia utilizada (Scrum, Kanban, etc.) e sua experiência em projetos similares.",
  },
  {
    key: "experiencia_dominio",
    label: "Experiência com o domínio da aplicação",
    tooltip:
      "Considere o conhecimento da equipe sobre o domínio de negócio, regras específicas, e experiência prévia em projetos do mesmo setor.",
  },
  {
    key: "experiencia_tecnologia",
    label: "Experiência com a tecnologia utilizada",
    tooltip:
      "Avalie o nível de expertise da equipe nas tecnologias, frameworks, e ferramentas que serão utilizadas no projeto.",
  },
  {
    key: "estabilidade_requisitos",
    label: "Estabilidade dos requisitos",
    tooltip:
      "Considere a clareza e estabilidade dos requisitos, frequência de mudanças, e qualidade da documentação disponível.",
  },
  {
    key: "experiencia_geral",
    label: "Experiência geral da equipe",
    tooltip:
      "Avalie o nível de senioridade, anos de experiência, e histórico de projetos bem-sucedidos da equipe de desenvolvimento.",
  },
  {
    key: "participacao_cliente",
    label: "Participação do cliente",
    tooltip:
      "Considere o nível de envolvimento do cliente, disponibilidade para feedback, clareza na comunicação, e suporte durante o desenvolvimento.",
  },
  {
    key: "motivacao_equipe",
    label: "Motivação da equipe",
    tooltip:
      "Avalie o engajamento, motivação, moral da equipe, e interesse no projeto. Considere fatores como ambiente de trabalho e desafios técnicos.",
  },
  {
    key: "pressao_prazos",
    label: "Pressão de prazos",
    tooltip:
      "Considere a pressão temporal, urgência do projeto, flexibilidade de cronograma, e impacto de possíveis atrasos no negócio.",
  },
]

export default function EditEquipePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [formData, setFormData] = useState<UpdateEquipeDto>({
    titulo: "",
    descricao: "",
    familiaridade_metodologia: 0,
    experiencia_dominio: 0,
    experiencia_tecnologia: 0,
    estabilidade_requisitos: 0,
    experiencia_geral: 0,
    participacao_cliente: 0,
    motivacao_equipe: 0,
    pressao_prazos: 0,
    tempo_horas_por_sp: undefined,
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchEquipe = async () => {
      try {
        setLoadingData(true)
        const response = await fetch(`http://localhost:4000/equipes/${id}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar equipe")
        }
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoadingData(false)
      }
    }

    if (id) {
      fetchEquipe()
    }
  }, [id])

  const handleInputChange = (field: keyof UpdateEquipeDto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSliderChange = (field: keyof UpdateEquipeDto, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value[0],
    }))
  }

  const handleHorasPorSpChange = (value: string) => {
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        tempo_horas_por_sp: undefined,
      }))
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue) && numValue > 0) {
        setFormData((prev) => ({
          ...prev,
          tempo_horas_por_sp: numValue,
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`http://localhost:4000/equipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar equipe")
      }

      const success = await response.json()
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/equipes")
        }, 2000)
      } else {
        throw new Error("Falha ao atualizar equipe")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Layout title="Editar Equipe - EstimAÍ" subtitle="Atualize as informações da equipe no EstimAÍ">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando equipe do EstimAÍ...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Editar Equipe - EstimAÍ" subtitle="Atualize as informações da equipe no EstimAÍ">
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="max-w-4xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da Equipe */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dados da Equipe
                  </CardTitle>
                  <CardDescription className="text-blue-100">Informações básicas sobre a equipe</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Nome da Equipe</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo || ""}
                      onChange={(e) => handleInputChange("titulo", e.target.value)}
                      placeholder="Digite o nome da equipe..."
                      required
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao || ""}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      placeholder="Descreva a equipe, suas especialidades e características..."
                      rows={4}
                      required
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Taxa de Horas por Story Point */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Taxa de Horas por Story Point
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Configure o tempo médio que a equipe leva por story point
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="tempo_horas_por_sp">Horas por Story Point</Label>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-gray-900 text-white p-3 rounded-md shadow-lg">
                          <p className="text-sm">
                            Define quantas horas em média a equipe leva para completar 1 story point. Este valor é
                            específico de cada equipe e deve ser ajustado com o tempo baseado no histórico real de
                            desenvolvimento.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="tempo_horas_por_sp"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.tempo_horas_por_sp ?? ""}
                      onChange={(e) => handleHorasPorSpChange(e.target.value)}
                      placeholder="Ex: 2.5"
                      className="border-gray-200 focus:border-purple-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 space-y-2">
                      <p className="font-medium">💡 Dica importante:</p>
                      <p>
                        Não existe um valor padrão para horas por story point, pois ele é totalmente específico de cada
                        equipe e varia de acordo com:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Complexidade das tarefas</li>
                        <li>Experiência da equipe</li>
                        <li>Stack tecnológica utilizada</li>
                        <li>Processos e metodologia</li>
                      </ul>
                      <p className="font-medium mt-3">
                        📊 Recomendação: Deixe em branco inicialmente e ajuste com o tempo baseado nas análises do
                        sistema após ter algumas histórias estimadas com story points.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Características da Equipe */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Características da Equipe
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Avalie as características e competências da equipe
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Fatores da Equipe (0-5)</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {dadosEquipe.map((item) => (
                        <div key={item.key} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">{item.label}</Label>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-xs bg-gray-900 text-white p-3 rounded-md shadow-lg"
                                >
                                  <p className="text-sm">{item.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              {(formData[item.key as keyof UpdateEquipeDto] as number) || 0}
                            </Badge>
                          </div>
                          <Slider
                            value={[(formData[item.key as keyof UpdateEquipeDto] as number) || 0]}
                            onValueChange={(value) => handleSliderChange(item.key as keyof UpdateEquipeDto, value)}
                            max={5}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 - Baixo</span>
                            <span>5 - Alto</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                disabled={loading || !formData.titulo || !formData.descricao}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Atualizar Equipe
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

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                      <CheckCircle className="h-6 w-6" />
                      Equipe Atualizada com Sucesso no EstimAÍ!
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Redirecionando para a lista de equipes do EstimAÍ...
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </Layout>
  )
}
