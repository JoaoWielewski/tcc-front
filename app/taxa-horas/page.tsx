"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, X, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TaxaHoras {
  java: number
  python: number
  javascript: number
  typescript: number
  csharp: number
  php: number
  cplusplus: number
  c: number
  go: number
  rust: number
  kotlin: number
  swift: number
  ruby: number
  pcu: number
}

const tecnologias = [
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
  { key: "typescript", label: "TypeScript" },
  { key: "csharp", label: "C#" },
  { key: "php", label: "PHP" },
  { key: "cplusplus", label: "C++" },
  { key: "c", label: "C" },
  { key: "go", label: "Go" },
  { key: "rust", label: "Rust" },
  { key: "kotlin", label: "Kotlin" },
  { key: "swift", label: "Swift" },
  { key: "ruby", label: "Ruby" },
  { key: "pcu", label: "PCU (Pontos de Caso de Uso)" },
]

export default function TaxaHorasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [taxas, setTaxas] = useState<TaxaHoras>({
    java: 0,
    python: 0,
    javascript: 0,
    typescript: 0,
    csharp: 0,
    php: 0,
    cplusplus: 0,
    c: 0,
    go: 0,
    rust: 0,
    kotlin: 0,
    swift: 0,
    ruby: 0,
    pcu: 0,
  })
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applyingTaxa, setApplyingTaxa] = useState(false)
  const [currentTaxaKey, setCurrentTaxaKey] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se é profissional e redirecionar
    const equipeId = localStorage.getItem("equipeId")
    if (equipeId) {
      router.push("/planning-poker")
      return
    }

    fetchTaxas()
  }, [router])

  const fetchTaxas = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }

      const response = await fetch(`http://localhost:4000/usuarios/${userId}/taxa-horas`)

      if (!response.ok) {
        throw new Error("Erro ao buscar taxas")
      }

      const data = await response.json()

      if (data) {
        setTaxas(data)
      }
    } catch (error) {
      console.error("Erro ao buscar taxas:", error)
      setError("Erro ao carregar taxas de horas")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (key: string) => {
    setEditingKey(key)
    setEditValue(taxas[key as keyof TaxaHoras].toString())
    setError(null)
    setSuccess(null)
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditValue("")
    setError(null)
    setSuccess(null)
  }

  const checkForExistingProjects = async (key: string) => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return false

      const body = key === "pcu" ? { usuarioId: userId, pcu: true } : { usuarioId: userId, linguagem: key }

      const response = await fetch("http://localhost:4000/projetos/verificar-taxa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error("Erro ao verificar projetos")
      }

      const data = await response.json()
      return data.possuiProjetos
    } catch (error) {
      console.error("Erro ao verificar projetos:", error)
      return false
    }
  }

  const applyTaxaToProjects = async () => {
    if (!currentTaxaKey) return

    try {
      setApplyingTaxa(true)
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const body =
        currentTaxaKey === "pcu" ? { usuarioId: userId, pcu: true } : { usuarioId: userId, linguagem: currentTaxaKey }

      const response = await fetch("http://localhost:4000/projetos/taxa/aplicar-taxa", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error("Erro ao aplicar taxa")
      }

      const data = await response.json()
      setSuccess(`Taxa aplicada com sucesso! ${data.atualizados} projeto(s) atualizado(s).`)
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Erro ao aplicar taxa:", error)
      setError("Erro ao aplicar taxa aos projetos existentes")
    } finally {
      setApplyingTaxa(false)
      setShowApplyModal(false)
      setCurrentTaxaKey(null)
    }
  }

  const handleSave = async (key: string) => {
    try {
      setSavingKey(key)
      setError(null)
      setSuccess(null)

      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }

      const numValue = Number.parseFloat(editValue) || 0

      // Criar o objeto com todas as taxas atuais, atualizando apenas a que está sendo editada
      const updatedTaxas = {
        ...taxas,
        [key]: numValue,
      }

      const response = await fetch(`http://localhost:4000/usuarios/${userId}/taxa-horas`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaxas),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar taxa")
      }

      // Atualizar o estado local
      setTaxas(updatedTaxas)
      setSuccess("Taxa atualizada com sucesso!")
      setEditingKey(null)
      setEditValue("")

      // Verificar se há projetos existentes com essa linguagem/pcu
      const hasProjects = await checkForExistingProjects(key)
      if (hasProjects) {
        setCurrentTaxaKey(key)
        setShowApplyModal(true)
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Erro ao salvar taxa:", error)
      setError("Erro ao atualizar taxa de horas")
    } finally {
      setSavingKey(null)
    }
  }

  const getTecnologiaLabel = (key: string) => {
    const tech = tecnologias.find((t) => t.key === key)
    return tech?.label || key
  }

  if (loading) {
    return (
      <Layout title="Estimativa de Esforço por Linguagem/Método" subtitle="Carregando...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-lg text-gray-600">Carregando taxas...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title="Estimativa de Esforço por Linguagem/Método"
      subtitle="Configure quantas horas cada ponto representa para cada tecnologia"
    >
      <div className="space-y-4">
        {/* Mensagens de Feedback */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Grid de Tecnologias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tecnologias.map((tech) => {
            const isEditing = editingKey === tech.key
            const isSaving = savingKey === tech.key

            return (
              <Card key={tech.key} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-base">{tech.label}</CardTitle>
                  <CardDescription className="text-xs">Horas por ponto</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="space-y-2">
                    <Label htmlFor={tech.key} className="text-xs">
                      Taxa de Horas
                    </Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          id={tech.key}
                          type="number"
                          step="0.1"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="text-base font-semibold h-9"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(tech.key)}
                            disabled={isSaving}
                            className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {isSaving ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-8 text-xs bg-transparent"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {taxas[tech.key as keyof TaxaHoras].toFixed(1)}
                          <span className="text-xs text-gray-500 ml-1">horas</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(tech.key)} className="h-7 w-7 p-0">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Informações Adicionais */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-blue-800 text-base">💡 Dica</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-sm text-blue-700">
              Ajuste a taxa de horas se perceber que precisam ser ajustadas para as estimativas ficarem mais próximas do
              tempo real. Você pode usar as análises para sugerir alterações baseadas no histórico de projetos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação para Aplicar Taxa */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Aplicar taxa aos projetos existentes?
            </DialogTitle>
            <DialogDescription className="pt-4">
              Você possui projetos existentes que utilizam <strong>{getTecnologiaLabel(currentTaxaKey || "")}</strong>.
              Deseja aplicar a nova taxa de horas a esses projetos?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowApplyModal(false)
                setCurrentTaxaKey(null)
              }}
              disabled={applyingTaxa}
            >
              Não, manter como está
            </Button>
            <Button onClick={applyTaxaToProjects} disabled={applyingTaxa} className="bg-blue-600 hover:bg-blue-700">
              {applyingTaxa ? "Aplicando..." : "Sim, aplicar aos projetos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
