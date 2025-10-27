"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Save, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Historia {
  id: string
  titulo: string
  descricao: string
  tempo_real?: string
}

export default function EditTempoRealPage() {
  const router = useRouter()
  const params = useParams()
  const { toasts, addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [historia, setHistoria] = useState<Historia | null>(null)
  const [tempoReal, setTempoReal] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (params.id) {
      fetchHistoria()
    }
  }, [params.id])

  const fetchHistoria = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:4000/historias/${params.id}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar história")
      }
      const data = await response.json()
      setHistoria(data)
      setTempoReal(data.tempo_real || "")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      addToast({
        type: "error",
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da história.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setTempoReal(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!tempoReal || Number.parseFloat(tempoReal) <= 0) {
      addToast({
        type: "warning",
        title: "Atenção",
        description: "Por favor, informe um tempo válido maior que zero.",
      })
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/historias/${params.id}/tempo-real`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempo_real: Number.parseFloat(tempoReal),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar tempo real")
      }

      addToast({
        type: "success",
        title: "Tempo real atualizado!",
        description: "O tempo real da história foi salvo com sucesso.",
      })

      // Redirecionar imediatamente para a listagem de histórias
      router.push("/historias")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o tempo real.",
      })
      setSaving(false)
    }
  }

  const handleBackToList = () => {
    router.push("/historias")
  }

  if (loading) {
    return (
      <Layout title="Tempo Real" subtitle="Carregando dados...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto" />
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
              <div className="text-red-700">
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
    <Layout title="Editar Tempo Real" subtitle={`Editando: ${historia?.titulo}`}>
      <ToastContainer toasts={toasts} />

      <div className="max-w-2xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tempo Real */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tempo Real de Desenvolvimento
                </CardTitle>
                <CardDescription className="text-amber-50">
                  Informe o tempo real gasto no desenvolvimento desta história
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tempo_real" className="text-gray-700">
                    Tempo Real (em horas)
                  </Label>
                  <Input
                    id="tempo_real"
                    type="number"
                    step="0.5"
                    min="0"
                    value={tempoReal}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Ex: 8.5"
                    required
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <p className="text-sm text-gray-600">
                    Informe o tempo total gasto no desenvolvimento, incluindo análise, implementação e testes
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              className="px-8 py-3 text-lg font-semibold bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50"
              disabled={saving}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || !tempoReal || Number.parseFloat(tempoReal) <= 0}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Salvar Tempo Real
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
      </div>
    </Layout>
  )
}
