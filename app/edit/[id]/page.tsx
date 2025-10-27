"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Loader2, ArrowLeft, FileText, FolderOpen, Users, Sparkles, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface UpdateHistoriaDto {
  titulo?: string
  descricao?: string
  projetoId?: string
  equipeId?: string
  // Campos PF
  ee_td?: number
  ee_ar?: number
  se_td?: number
  se_ar?: number
  ce_td?: number
  ce_ar?: number
  ali_td?: number
  ali_ar?: number
  aie_td?: number
  aie_ar?: number
  // Campos PCU
  atores_simples?: number
  atores_medios?: number
  atores_complexos?: number
  casos_simples?: number
  casos_medios?: number
  casos_complexos?: number
}

interface Historia {
  id: string
  titulo: string
  descricao: string
  projetoId: string
  equipeId: string
  criado_em: string
  // Campos PF
  ee_td?: number
  ee_ar?: number
  se_td?: number
  se_ar?: number
  ce_td?: number
  ce_ar?: number
  ali_td?: number
  ali_ar?: number
  aie_td?: number
  aie_ar?: number
  // Campos PCU
  atores_simples?: number
  atores_medios?: number
  atores_complexos?: number
  casos_simples?: number
  casos_medios?: number
  casos_complexos?: number
  pf?: number
  tempo_pf?: string
  pcu?: number
  tempo_pcu?: string
  projeto?: {
    id: string
    titulo: string
  }
  equipe?: {
    id: string
    titulo: string
  }
}

interface Projeto {
  id: string
  titulo: string
  descricao: string
}

interface Equipe {
  id: string
  titulo: string
  descricao: string
  projetoId: string
}

interface EstimationResult {
  id: string
  pf?: number
  tempo_pf?: string
  pcu?: number
  tempo_pcu?: string
}

const contadoresPF = [
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

const contadoresAtores = [
  {
    key: "atores_simples",
    label: "Atores Simples",
    tooltip: "Quantidade de atores que interagem via API ou protocolo já definido",
  },
  {
    key: "atores_medios",
    label: "Atores Médios",
    tooltip: "Quantidade de atores que interagem via linha de comando ou protocolo elaborado",
  },
  {
    key: "atores_complexos",
    label: "Atores Complexos",
    tooltip: "Quantidade de atores que interagem via interface gráfica ou web",
  },
]

const contadoresCasosUso = [
  {
    key: "casos_simples",
    label: "Casos de Uso Simples",
    tooltip: "Quantidade de casos de uso com até 3 transações e poucos cenários alternativos",
  },
  {
    key: "casos_medios",
    label: "Casos de Uso Médios",
    tooltip: "Quantidade de casos de uso com 4 a 7 transações ou cenários alternativos relevantes",
  },
  {
    key: "casos_complexos",
    label: "Casos de Uso Complexos",
    tooltip: "Quantidade de casos de uso com 8+ transações ou muitos caminhos alternativos",
  },
]

export default function EditStoryPage() {
  const router = useRouter()
  const params = useParams()
  const { toasts, addToast } = useToast()
  const [historia, setHistoria] = useState<Historia | null>(null)
  const [formData, setFormData] = useState<UpdateHistoriaDto>({
    titulo: "",
    descricao: "",
    projetoId: "",
    equipeId: "",
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
    atores_simples: 0,
    atores_medios: 0,
    atores_complexos: 0,
    casos_simples: 0,
    casos_medios: 0,
    casos_complexos: 0,
  })

  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [loadingEquipes, setLoadingEquipes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EstimationResult | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchData()
    }
  }, [params.id])

  useEffect(() => {
    if (formData.projetoId && formData.projetoId !== "") {
      fetchEquipes(formData.projetoId)
    } else {
      setEquipes([])
      setFormData((prev) => ({ ...prev, equipeId: "" }))
    }
  }, [formData.projetoId])

  const fetchData = async () => {
    try {
      setLoadingData(true)

      // Buscar história
      const historiaResponse = await fetch(`http://localhost:4000/historias/${params.id}`)
      if (!historiaResponse.ok) {
        throw new Error("História não encontrada")
      }
      const historiaData = await historiaResponse.json()
      setHistoria(historiaData)

      // Definir dados do formulário com todos os campos
      const newFormData: UpdateHistoriaDto = {
        titulo: historiaData.titulo || "",
        descricao: historiaData.descricao || "",
        projetoId: historiaData.projetoId || "",
        equipeId: historiaData.equipeId || "",
        ee_td: historiaData.ee_td || 0,
        ee_ar: historiaData.ee_ar || 0,
        se_td: historiaData.se_td || 0,
        se_ar: historiaData.se_ar || 0,
        ce_td: historiaData.ce_td || 0,
        ce_ar: historiaData.ce_ar || 0,
        ali_td: historiaData.ali_td || 0,
        ali_ar: historiaData.ali_ar || 0,
        aie_td: historiaData.aie_td || 0,
        aie_ar: historiaData.aie_ar || 0,
        atores_simples: historiaData.atores_simples || 0,
        atores_medios: historiaData.atores_medios || 0,
        atores_complexos: historiaData.atores_complexos || 0,
        casos_simples: historiaData.casos_simples || 0,
        casos_medios: historiaData.casos_medios || 0,
        casos_complexos: historiaData.casos_complexos || 0,
      }
      setFormData(newFormData)

      // Buscar projetos com usuarioId
      const usuarioId = localStorage.getItem("userId")
      const response = await fetch(`http://localhost:4000/projetos?usuarioId=${usuarioId}`)

      if (!response.ok) {
        throw new Error("Erro ao carregar projetos")
      }
      const projetosData = await response.json()
      setProjetos(projetosData)

      // Buscar equipes do projeto atual da história (se existir)
      if (historiaData.projetoId) {
        await fetchEquipes(historiaData.projetoId)
      }
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

  const fetchEquipes = async (projetoId: string) => {
    if (!projetoId || projetoId === "") {
      return
    }

    try {
      setLoadingEquipes(true)
      const response = await fetch(`http://localhost:4000/equipes?projetoId=${projetoId}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar equipes")
      }
      const data = await response.json()
      setEquipes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar equipes")
      addToast({
        type: "error",
        title: "Erro ao carregar equipes",
        description: "Não foi possível carregar as equipes do projeto.",
      })
    } finally {
      setLoadingEquipes(false)
    }
  }

  const handleInputChange = (field: keyof UpdateHistoriaDto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Se mudou o projeto, limpar a equipe selecionada
    if (field === "projetoId") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        equipeId: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`http://localhost:4000/historias/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar história")
      }

      const data: EstimationResult = await response.json()
      setResult(data)

      addToast({
        type: "success",
        title: "História atualizada!",
        description: "As alterações foram salvas com sucesso.",
      })

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/historias")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    router.push("/historias")
  }

  if (loadingData) {
    return (
      <Layout title="Editar História" subtitle="Carregando dados...">
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
    <Layout title="Editar História" subtitle={`Editando: ${historia?.titulo}`}>
      <ToastContainer toasts={toasts} />
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="max-w-5xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da História */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dados da História
                  </CardTitle>
                  <CardDescription className="text-blue-100">Informações básicas sobre a história</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título da História</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => handleInputChange("titulo", e.target.value)}
                      placeholder="Digite o título da história..."
                      required
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      placeholder="Descreva detalhadamente a história..."
                      rows={4}
                      required
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seleção de Projeto e Equipe */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Projeto e Equipe
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Selecione o projeto e a equipe responsável
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Projeto</Label>
                    <Select value={formData.projetoId} onValueChange={(value) => handleInputChange("projetoId", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-green-500">
                        <SelectValue placeholder="Selecione o projeto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projetos.map((projeto) => (
                          <SelectItem key={projeto.id} value={projeto.id}>
                            {projeto.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Equipe</Label>
                    <Select
                      value={formData.equipeId}
                      onValueChange={(value) => handleInputChange("equipeId", value)}
                      disabled={!formData.projetoId || loadingEquipes}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-green-500">
                        <SelectValue
                          placeholder={
                            !formData.projetoId
                              ? "Primeiro selecione um projeto"
                              : loadingEquipes
                                ? "Carregando equipes..."
                                : "Selecione a equipe..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {equipes.map((equipe) => (
                          <SelectItem key={equipe.id} value={equipe.id}>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              {equipe.titulo}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contadores de Pontos de Função */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Estimativa PF - Contadores de Função
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Defina os valores para calcular os pontos de função
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contadoresPF.map((contador) => (
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
                          value={formData[contador.key as keyof UpdateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof UpdateHistoriaDto,
                              Number.parseInt(e.target.value) || 0,
                            )
                          }
                          className="border-gray-200 focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contadores de PCU - Atores */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Estimativa PCU - Contadores de Atores
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Defina a quantidade de atores por complexidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contadoresAtores.map((contador) => (
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
                          value={formData[contador.key as keyof UpdateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof UpdateHistoriaDto,
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

            {/* Contadores de PCU - Casos de Uso */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Estimativa PCU - Contadores de Casos de Uso
                  </CardTitle>
                  <CardDescription className="text-teal-100">
                    Defina a quantidade de casos de uso por complexidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contadoresCasosUso.map((contador) => (
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
                          value={formData[contador.key as keyof UpdateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof UpdateHistoriaDto,
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
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
                className="px-8 py-3 text-lg font-semibold bg-transparent"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || !formData.titulo || !formData.descricao || !formData.projetoId || !formData.equipeId
                }
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Salvando e Calculando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Salvar e Recalcular
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
                className="max-w-4xl mx-auto"
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                      <CheckCircle className="h-6 w-6" />
                      História Atualizada com Sucesso!
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Estimativas recalculadas automaticamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {result.pf !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-center p-6 bg-white rounded-xl shadow-md"
                        >
                          <div className="text-3xl font-bold text-purple-600 mb-2">{result.pf}</div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">Pontos de Função</div>
                        </motion.div>
                      )}

                      {result.tempo_pf && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-center p-6 bg-white rounded-xl shadow-md"
                        >
                          <div className="text-3xl font-bold text-green-600 mb-2">{result.tempo_pf}h</div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">Tempo PF</div>
                        </motion.div>
                      )}

                      {result.pcu !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-center p-6 bg-white rounded-xl shadow-md"
                        >
                          <div className="text-3xl font-bold text-indigo-600 mb-2">{result.pcu}</div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">Pontos de Caso de Uso</div>
                        </motion.div>
                      )}

                      {result.tempo_pcu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-center p-6 bg-white rounded-xl shadow-md"
                        >
                          <div className="text-3xl font-bold text-teal-600 mb-2">{result.tempo_pcu}h</div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">Tempo PCU</div>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                      Redirecionando para a lista de histórias...
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
