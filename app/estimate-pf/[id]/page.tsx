"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Loader2, ArrowLeft, Sparkles, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EstimateHistoriaDto {
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
}

interface EstimationResult {
  pf: number
  tempo_pf: string
}

interface Historia {
  id: string
  titulo: string
  descricao: string
  projetoId: string
  equipeId: string
}

const contadores = [
  {
    key: "ee_td",
    label: "EE - Tipos de Dados",
    tooltip:
      "Quantidade de tipos de dados únicos (campos) processados pela entrada externa. Conte apenas os campos que o usuário pode inserir ou modificar.",
  },
  {
    key: "ee_ar",
    label: "EE - Arquivos Referenciados",
    tooltip: "Quantidade de arquivos lógicos (tabelas/entidades) que são lidos ou atualizados pela entrada externa.",
  },
  {
    key: "se_td",
    label: "SE - Tipos de Dados",
    tooltip:
      "Quantidade de campos únicos exibidos na saída externa. Conte campos calculados, recuperados ou derivados apresentados ao usuário.",
  },
  {
    key: "se_ar",
    label: "SE - Arquivos Referenciados",
    tooltip: "Quantidade de arquivos lógicos (tabelas/entidades) que são consultados para gerar a saída externa.",
  },
  {
    key: "ce_td",
    label: "CE - Tipos de Dados",
    tooltip:
      "Quantidade de campos únicos exibidos na consulta externa. Conte apenas campos de dados, não campos de navegação.",
  },
  {
    key: "ce_ar",
    label: "CE - Arquivos Referenciados",
    tooltip: "Quantidade de arquivos lógicos (tabelas/entidades) consultados para realizar a consulta externa.",
  },
  {
    key: "ali_td",
    label: "ALI - Tipos de Dados",
    tooltip:
      "Quantidade de campos únicos armazenados no arquivo lógico interno. Conte todos os campos reconhecidos pelo usuário.",
  },
  {
    key: "ali_ar",
    label: "ALI - Arquivos Referenciados",
    tooltip: "Quantidade de subgrupos lógicos (registros relacionados) dentro do arquivo lógico interno.",
  },
  {
    key: "aie_td",
    label: "AIE - Tipos de Dados",
    tooltip: "Quantidade de campos únicos no arquivo de interface externa que são utilizados pela aplicação.",
  },
  {
    key: "aie_ar",
    label: "AIE - Arquivos Referenciados",
    tooltip: "Quantidade de subgrupos lógicos (registros relacionados) dentro do arquivo de interface externa.",
  },
]

export default function EstimatePFPage() {
  const router = useRouter()
  const params = useParams()
  const historiaId = params.id as string

  const [historia, setHistoria] = useState<Historia | null>(null)
  const [formData, setFormData] = useState<EstimateHistoriaDto>({
    ee_td: 0,
    ee_ar: 0,
    se_td: 0,
    se_ar: 0,
    ce_td: 0,
    ce_ar: 0,
    ali_td: 0,
    ali_ar: 0,
    aie_td: 0,
    aie_ar: 0,
  })

  const [result, setResult] = useState<EstimationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (historiaId) {
      fetchHistoria()
    }
  }, [historiaId])

  const fetchHistoria = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`http://localhost:4000/historias/${historiaId}`)
      if (!response.ok) {
        throw new Error("História não encontrada")
      }
      const data = await response.json()
      setHistoria(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: keyof EstimateHistoriaDto, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`http://localhost:4000/historias/${historiaId}/estimativa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao calcular estimativa")
      }

      const data: EstimationResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    router.push("/historias")
  }

  if (loadingData) {
    return (
      <Layout title="Estimativa PF" subtitle="Carregando história...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando história...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error && !historia) {
    return (
      <Layout title="Erro" subtitle="História não encontrada">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <Calculator className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">História não encontrada</h3>
            <p className="text-gray-600">{error}</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Histórias
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`Estimativa PF - ${historia?.titulo || "História"}`}
      subtitle="Calcule os pontos de função da história"
    >
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="max-w-4xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contadores */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Contadores de Função
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Defina os valores para cada tipo de função
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contadores.map((contador) => (
                      <div key={contador.key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={contador.key}>{contador.label}</Label>
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
                              <p className="text-sm">{contador.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id={contador.key}
                          type="number"
                          min="0"
                          value={formData[contador.key as keyof EstimateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof EstimateHistoriaDto,
                              Number.parseInt(e.target.value) || 0,
                            )
                          }
                          className="border-gray-200 focus:border-green-500"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
                className="px-8 py-3 text-lg font-semibold bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Calcular PF
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
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Erro:</span>
                      <span>{error}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
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
                      <Sparkles className="h-6 w-6" />
                      Estimativa PF Calculada!
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Resultados da análise de pontos de função
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-6 bg-white rounded-xl shadow-md"
                      >
                        <div className="text-3xl font-bold text-blue-600 mb-2">{result.pf}</div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Pontos de Função</div>
                        <div className="mt-2 text-xs text-gray-500">Complexidade do projeto</div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center p-6 bg-white rounded-xl shadow-md"
                      >
                        <div className="text-3xl font-bold text-green-600 mb-2">{result.tempo_pf}h</div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Tempo Estimado</div>
                        <div className="mt-2 text-xs text-gray-500">Baseado na linguagem</div>
                      </motion.div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleBackToList}
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        Voltar para Lista
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </Layout>
  )
}
