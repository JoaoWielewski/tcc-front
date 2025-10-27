"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, CheckCircle, Loader2, ArrowLeft, Users, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"

interface EstimateHistoriaUCPDto {
  atores_simples: number
  atores_medios: number
  atores_complexos: number
  casos_simples: number
  casos_medios: number
  casos_complexos: number
}

interface EstimationResult {
  pcu: number
  tempo_pcu: string
}

interface Historia {
  id: string
  titulo: string
  descricao: string
  projetoId: string
  equipeId: string
}

const contadoresAtores = [
  { key: "atores_simples", label: "Atores Simples" },
  { key: "atores_medios", label: "Atores Médios" },
  { key: "atores_complexos", label: "Atores Complexos" },
]

const contadoresCasosUso = [
  { key: "casos_simples", label: "Casos de Uso Simples" },
  { key: "casos_medios", label: "Casos de Uso Médios" },
  { key: "casos_complexos", label: "Casos de Uso Complexos" },
]

export default function EstimatePCUPage() {
  const router = useRouter()
  const params = useParams()
  const historiaId = params.id as string

  const [historia, setHistoria] = useState<Historia | null>(null)
  const [formData, setFormData] = useState<EstimateHistoriaUCPDto>({
    atores_simples: 0,
    atores_medios: 0,
    atores_complexos: 0,
    casos_simples: 0,
    casos_medios: 0,
    casos_complexos: 0,
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

  const handleInputChange = (field: keyof EstimateHistoriaUCPDto, value: number) => {
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
      const response = await fetch(`http://localhost:4000/historias/${historiaId}/estimativa-pcu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao calcular estimativa PCU")
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
      <Layout title="Estimativa PCU" subtitle="Carregando história...">
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
      title={`Estimativa PCU - ${historia?.titulo || "História"}`}
      subtitle="Calcule os pontos de caso de uso da história"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contadores de Atores */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contadores de Atores
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Defina a quantidade de atores por complexidade
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contadoresAtores.map((contador) => (
                    <div key={contador.key} className="space-y-2">
                      <Label htmlFor={contador.key} className="flex items-center gap-2">
                        {contador.label}
                        <div className="relative group">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {contador.key === "atores_simples" &&
                              "Quantidade de atores que interagem via API ou protocolo já definido"}
                            {contador.key === "atores_medios" &&
                              "Quantidade de atores que interagem via linha de comando ou protocolo elaborado"}
                            {contador.key === "atores_complexos" &&
                              "Quantidade de atores que interagem via interface gráfica ou web"}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </Label>
                      <Input
                        id={contador.key}
                        type="number"
                        min="0"
                        value={formData[contador.key as keyof EstimateHistoriaUCPDto] as number}
                        onChange={(e) =>
                          handleInputChange(
                            contador.key as keyof EstimateHistoriaUCPDto,
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-gray-200 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contadores de Casos de Uso */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Contadores de Casos de Uso
                </CardTitle>
                <CardDescription className="text-teal-100">
                  Defina a quantidade de casos de uso por complexidade
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contadoresCasosUso.map((contador) => (
                    <div key={contador.key} className="space-y-2">
                      <Label htmlFor={contador.key} className="flex items-center gap-2">
                        {contador.label}
                        <div className="relative group">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {contador.key === "casos_simples" &&
                              "Quantidade de casos de uso com até 3 transações e poucos cenários alternativos"}
                            {contador.key === "casos_medios" &&
                              "Quantidade de casos de uso com 4 a 7 transações ou cenários alternativos relevantes"}
                            {contador.key === "casos_complexos" &&
                              "Quantidade de casos de uso com 8+ transações ou muitos caminhos alternativos"}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </Label>
                      <Input
                        id={contador.key}
                        type="number"
                        min="0"
                        value={formData[contador.key as keyof EstimateHistoriaUCPDto] as number}
                        onChange={(e) =>
                          handleInputChange(
                            contador.key as keyof EstimateHistoriaUCPDto,
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-gray-200 focus:border-teal-500"
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
            transition={{ delay: 0.4 }}
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular PCU
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
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Users className="h-6 w-6" />
                    Estimativa PCU Calculada!
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Resultados da análise de pontos de caso de uso
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
                      <div className="text-3xl font-bold text-purple-600 mb-2">{result.pcu}</div>
                      <div className="text-sm text-gray-600 uppercase tracking-wide">Pontos de Caso de Uso</div>
                      <div className="mt-2 text-xs text-gray-500">Complexidade dos casos de uso</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center p-6 bg-white rounded-xl shadow-md"
                    >
                      <div className="text-3xl font-bold text-pink-600 mb-2">{result.tempo_pcu}h</div>
                      <div className="text-sm text-gray-600 uppercase tracking-wide">Tempo Estimado</div>
                      <div className="mt-2 text-xs text-gray-500">Baseado na equipe</div>
                    </motion.div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={handleBackToList}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
    </Layout>
  )
}
