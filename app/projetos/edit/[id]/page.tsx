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
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FolderOpen,
  CheckCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"

interface Log {
  id: string
  projetoId: string
  descricao: string
  criado_em: string
}

interface UpdateProjetoDto {
  titulo?: string
  descricao?: string
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
  linguagem?: string
  linguagem_outra?: string
  tempo_horas_por_pf?: number
  tempo_horas_por_pcu?: number
  logs?: Log[]
}

interface UpdateProjetoWithLogDto extends UpdateProjetoDto {
  logDescricao: string
}

interface TaxaHorasRecord {
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

const linguagens = [
  "Java",
  "Python",
  "Javascript",
  "Typescript",
  "C#",
  "PHP",
  "C++",
  "C",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "Ruby",
  "Outra",
]

// Mapeamento de linguagem para chave no TaxaHorasRecord
const linguagemToKey: Record<string, keyof TaxaHorasRecord> = {
  Java: "java",
  Python: "python",
  Javascript: "javascript",
  Typescript: "typescript",
  "C#": "csharp",
  PHP: "php",
  "C++": "cplusplus",
  C: "c",
  Go: "go",
  Rust: "rust",
  Kotlin: "kotlin",
  Swift: "swift",
  Ruby: "ruby",
}

const caracteristicas = [
  {
    key: "comm_dados",
    label: "Comunicação de Dados",
    tooltip:
      "Considere se o sistema precisa se comunicar com outros sistemas, APIs externas, ou transferir dados entre diferentes módulos. Avalie a complexidade e frequência dessas comunicações.",
  },
  {
    key: "proc_distribuido",
    label: "Processamento Distribuído",
    tooltip:
      "Avalie se o processamento é distribuído entre múltiplos servidores, microserviços, ou se utiliza computação em nuvem. Considere a complexidade da arquitetura distribuída.",
  },
  {
    key: "performance",
    label: "Performance",
    tooltip:
      "Considere os requisitos de velocidade, tempo de resposta, throughput e otimização. Avalie se há necessidade de processamento em tempo real ou alta performance.",
  },
  {
    key: "uso_config",
    label: "Uso de Configuração",
    tooltip:
      "Avalie a necessidade de configurações personalizáveis, arquivos de configuração, variáveis de ambiente, ou parametrizações do sistema.",
  },
  {
    key: "volume_transacoes",
    label: "Volume de Transações",
    tooltip:
      "Considere a quantidade de transações simultâneas, picos de uso, e a capacidade de processamento necessária para lidar com alto volume de dados.",
  },
  {
    key: "entrada_online",
    label: "Entrada Online",
    tooltip:
      "Avalie se o sistema possui interfaces web, aplicativos móveis, ou outras formas de entrada de dados em tempo real pelos usuários.",
  },
  {
    key: "eficiencia_usuario",
    label: "Eficiência do Usuário",
    tooltip:
      "Avalie a facilidade de uso, interface intuitiva, automação de tarefas, e recursos que aumentam a produtividade do usuário final.",
  },
  {
    key: "atualizacao_online",
    label: "Atualização Online",
    tooltip:
      "Avalie se o sistema permite atualizações em tempo real, sincronização de dados, ou modificações sem interrupção do serviço.",
  },
  {
    key: "proc_complexo",
    label: "Processamento Complexo",
    tooltip:
      "Avalie algoritmos complexos, cálculos matemáticos avançados, processamento de IA/ML, ou lógicas de negócio sofisticadas.",
  },
  {
    key: "reusabilidade",
    label: "Reusabilidade",
    tooltip:
      "Avalie se o código/componentes podem ser reutilizados em outros projetos, se há modularização, ou se segue padrões de design reutilizáveis.",
  },
  {
    key: "facil_instalacao",
    label: "Fácil Instalação",
    tooltip:
      "Avalie a simplicidade do processo de instalação, configuração inicial, deploy automatizado, ou containerização (Docker, etc.).",
  },
  {
    key: "facil_operacao",
    label: "Fácil Operação",
    tooltip:
      "Avalie a facilidade de manutenção, monitoramento, logs, dashboards administrativos, e operações do dia a dia do sistema.",
  },
  {
    key: "multiplos_locais",
    label: "Múltiplos Locais",
    tooltip:
      "Avalie se o sistema será usado em diferentes localizações geográficas, fusos horários, idiomas, ou se precisa de distribuição global.",
  },
  {
    key: "facil_mudanca",
    label: "Fácil Mudança",
    tooltip:
      "Avalie a flexibilidade para modificações futuras, extensibilidade, arquitetura modular, e facilidade para implementar novos requisitos.",
  },
  {
    key: "sistema_distribuido",
    label: "Sistema distribuído",
    tooltip:
      "Avalie se o sistema utiliza arquitetura de microserviços, computação distribuída, ou processamento paralelo em múltiplos nós.",
  },
  {
    key: "requisitos_performance",
    label: "Requisitos de performance",
    tooltip:
      "Avalie necessidades específicas de latência, throughput, escalabilidade horizontal/vertical, e otimizações de performance críticas.",
  },
  {
    key: "eficiencia_usuario_final",
    label: "Eficiência do usuário final",
    tooltip:
      "Avalie recursos de UX/UI, automação de workflows, atalhos, personalização, e funcionalidades que otimizam a experiência do usuário.",
  },
  {
    key: "complexidade_processamento",
    label: "Complexidade de processamento interno",
    tooltip:
      "Avalie algoritmos complexos, processamento de big data, machine learning, análises estatísticas, ou cálculos computacionalmente intensivos.",
  },
  {
    key: "reusabilidade_extra",
    label: "Reusabilidade",
    tooltip:
      "Avalie o nível de modularização, padrões de design, bibliotecas compartilhadas, e componentes que podem ser reutilizados.",
  },
  {
    key: "facilidade_instalacao_extra",
    label: "Facilidade de instalação",
    tooltip:
      "Avalie automação de deploy, containerização, scripts de instalação, documentação, e simplicidade do processo de setup.",
  },
  {
    key: "facilidade_uso",
    label: "Facilidade de uso",
    tooltip:
      "Avalie intuitividade da interface, curva de aprendizado, documentação do usuário, e acessibilidade do sistema.",
  },
  {
    key: "portabilidade",
    label: "Portabilidade",
    tooltip:
      "Avalie compatibilidade entre diferentes sistemas operacionais, browsers, dispositivos, ou ambientes de execução.",
  },
  {
    key: "facilidade_mudancas",
    label: "Facilidade de mudanças",
    tooltip:
      "Avalie arquitetura flexível, baixo acoplamento, alta coesão, e facilidade para implementar modificações e evoluções.",
  },
  {
    key: "conexoes_simultaneas",
    label: "Conexões simultâneas",
    tooltip:
      "Avalie a capacidade de suportar múltiplos usuários conectados simultaneamente, sessões concorrentes, e gerenciamento de estado.",
  },
  {
    key: "requisitos_seguranca",
    label: "Requisitos de segurança",
    tooltip:
      "Avalie necessidades de autenticação, autorização, criptografia, auditoria, compliance, e proteção contra vulnerabilidades.",
  },
  {
    key: "acesso_componentes_terceiros",
    label: "Acesso direto a componentes de terceiros (APIs, banco de dados, etc.)",
    tooltip:
      "Avalie integrações com APIs externas, serviços de terceiros, bancos de dados externos, ou dependências de sistemas externos.",
  },
  {
    key: "treinamento_especializado",
    label: "Necessidade de treinamento especializado",
    tooltip:
      "Avalie se o sistema requer conhecimento técnico específico, treinamento especializado, ou expertise em tecnologias particulares.",
  },
]

export default function EditProjetoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [formData, setFormData] = useState<UpdateProjetoDto>({
    titulo: "",
    descricao: "",
    comm_dados: 0,
    proc_distribuido: 0,
    performance: 0,
    uso_config: 0,
    volume_transacoes: 0,
    entrada_online: 0,
    eficiencia_usuario: 0,
    atualizacao_online: 0,
    proc_complexo: 0,
    reusabilidade: 0,
    facil_instalacao: 0,
    facil_operacao: 0,
    multiplos_locais: 0,
    facil_mudanca: 0,
    sistema_distribuido: 0,
    requisitos_performance: 0,
    eficiencia_usuario_final: 0,
    complexidade_processamento: 0,
    reusabilidade_extra: 0,
    facilidade_instalacao_extra: 0,
    facilidade_uso: 0,
    portabilidade: 0,
    facilidade_mudancas: 0,
    conexoes_simultaneas: 0,
    requisitos_seguranca: 0,
    acesso_componentes_terceiros: 0,
    treinamento_especializado: 0,
    linguagem: "",
    linguagem_outra: "",
    tempo_horas_por_pf: undefined,
    tempo_horas_por_pcu: undefined,
    logs: [],
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [taxasHoras, setTaxasHoras] = useState<TaxaHorasRecord | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [logDescricao, setLogDescricao] = useState("")
  const [pendingFormData, setPendingFormData] = useState<UpdateProjetoDto | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const usuarioId = localStorage.getItem("userId")
        if (!usuarioId) {
          throw new Error("Usuário não identificado")
        }

        // Buscar taxas de horas
        const taxasResponse = await fetch(`http://localhost:4000/usuarios/${usuarioId}/taxa-horas`)
        if (!taxasResponse.ok) {
          throw new Error("Erro ao carregar taxas de horas")
        }
        const taxasData = await taxasResponse.json()
        setTaxasHoras(taxasData)

        // Buscar projeto
        const projetoResponse = await fetch(`http://localhost:4000/projetos/${id}`)
        if (!projetoResponse.ok) {
          throw new Error("Erro ao carregar projeto")
        }
        const projetoData = await projetoResponse.json()

        // Verificar se a linguagem retornada é uma das opções padrão
        const linguagemPadrao = linguagens.includes(projetoData.linguagem)

        if (linguagemPadrao) {
          setFormData({
            ...projetoData,
            logs: projetoData.logs || [],
          })
        } else {
          // Se não for padrão, definir como "Outra" e colocar o valor em linguagem_outra
          setFormData({
            ...projetoData,
            linguagem: "Outra",
            linguagem_outra: projetoData.linguagem,
            logs: projetoData.logs || [],
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoadingData(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleInputChange = (field: keyof UpdateProjetoDto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSliderChange = (field: keyof UpdateProjetoDto, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value[0],
    }))
  }

  const handleLanguageChange = (linguagem: string) => {
    if (!taxasHoras) {
      setError("Taxas de horas não carregadas")
      return
    }

    let horasPorPF = 0
    if (linguagem !== "Outra") {
      const key = linguagemToKey[linguagem]
      if (key) {
        horasPorPF = taxasHoras[key]
      }
    }

    setFormData((prev) => ({
      ...prev,
      linguagem,
      linguagem_outra: linguagem === "Outra" ? prev.linguagem_outra : "",
      tempo_horas_por_pf: horasPorPF,
      tempo_horas_por_pcu: taxasHoras.pcu,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Preparar dados e abrir modal
    const dataToSend = {
      ...formData,
      linguagem: formData.linguagem === "Outra" ? formData.linguagem_outra : formData.linguagem,
    }
    delete dataToSend.linguagem_outra

    setPendingFormData(dataToSend)
    setShowLogModal(true)
  }

  const handleConfirmUpdate = async () => {
    if (!logDescricao.trim()) {
      setError("Por favor, descreva a alteração realizada")
      return
    }

    if (!pendingFormData) {
      setError("Dados do formulário não encontrados")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const dataWithLog: UpdateProjetoWithLogDto = {
        ...pendingFormData,
        logDescricao: logDescricao.trim(),
      }

      const response = await fetch(`http://localhost:4000/projetos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithLog),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar projeto")
      }

      // Fechar modal e redirecionar
      setShowLogModal(false)
      setLogDescricao("")
      setPendingFormData(null)
      router.push("/projetos?success=projeto-atualizado")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelUpdate = () => {
    setShowLogModal(false)
    setLogDescricao("")
    setPendingFormData(null)
    setError(null)
  }

  const handleBackToList = () => {
    router.push("/projetos")
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
      <Layout title="Editar Projeto" subtitle="Atualize as informações do projeto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Editar Projeto" subtitle="Atualize as informações do projeto">
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="max-w-4xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados do Projeto */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Dados do Projeto
                  </CardTitle>
                  <CardDescription className="text-blue-100">Informações básicas sobre o projeto</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título do Projeto</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo || ""}
                      onChange={(e) => handleInputChange("titulo", e.target.value)}
                      placeholder="Digite o título do projeto..."
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
                      placeholder="Descreva detalhadamente o projeto..."
                      rows={4}
                      required
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Linguagem de Programação</Label>
                    <Select value={formData.linguagem || ""} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Selecione a linguagem..." />
                      </SelectTrigger>
                      <SelectContent>
                        {linguagens.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo para especificar "Outra" linguagem */}
                  {formData.linguagem === "Outra" && (
                    <div className="space-y-2">
                      <Label htmlFor="linguagem_outra">Especifique a linguagem</Label>
                      <Input
                        id="linguagem_outra"
                        value={formData.linguagem_outra || ""}
                        onChange={(e) => handleInputChange("linguagem_outra", e.target.value)}
                        placeholder="Digite o nome da linguagem..."
                        required
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Campos de Horas por PF e PCU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tempo_horas_por_pf">Horas por Ponto de Função (h/PF)</Label>
                      <Input
                        id="tempo_horas_por_pf"
                        type="number"
                        step="0.1"
                        value={formData.tempo_horas_por_pf || ""}
                        onChange={(e) =>
                          handleInputChange("tempo_horas_por_pf", Number.parseFloat(e.target.value) || 0)
                        }
                        placeholder="Ex: 9.0"
                        disabled={!formData.linguagem}
                        className="border-gray-200 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempo_horas_por_pcu">Horas por Ponto de Caso de Uso (h/PCU)</Label>
                      <Input
                        id="tempo_horas_por_pcu"
                        type="number"
                        step="0.1"
                        value={formData.tempo_horas_por_pcu || ""}
                        onChange={(e) =>
                          handleInputChange("tempo_horas_por_pcu", Number.parseFloat(e.target.value) || 0)
                        }
                        placeholder="Ex: 20.0"
                        disabled={!formData.linguagem}
                        className="border-gray-200 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Características do Projeto */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Características do Projeto
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Defina as características técnicas do projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Características do Sistema (0-5)</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {caracteristicas.map((caracteristica) => (
                        <div key={caracteristica.key} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">{caracteristica.label}</Label>
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
                                <p className="text-sm">{caracteristica.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="space-y-2">
                            <Slider
                              value={[(formData[caracteristica.key as keyof UpdateProjetoDto] as number) || 0]}
                              onValueChange={(value) =>
                                handleSliderChange(caracteristica.key as keyof UpdateProjetoDto, value)
                              }
                              max={5}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between items-center text-xs">
                              {[0, 1, 2, 3, 4, 5].map((num) => (
                                <span
                                  key={num}
                                  className={
                                    (formData[caracteristica.key as keyof UpdateProjetoDto] as number) === num
                                      ? "text-purple-700 font-bold text-base"
                                      : "text-gray-500"
                                  }
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
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
                    Atualizar Projeto
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Histórico de Alterações */}
          {formData.logs && formData.logs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Histórico de Alterações
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    {formData.logs.length}{" "}
                    {formData.logs.length === 1 ? "alteração registrada" : "alterações registradas"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {formData.logs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 bg-blue-100 rounded-full flex-shrink-0">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-medium mb-1 break-words">{log.descricao}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(log.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Modal de Log de Alteração */}
          <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Descrever Alteração
                </DialogTitle>
                <DialogDescription>
                  Descreva brevemente as alterações realizadas neste projeto para manter um histórico organizado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="log-descricao">Descrição da Alteração *</Label>
                  <Textarea
                    id="log-descricao"
                    value={logDescricao}
                    onChange={(e) => setLogDescricao(e.target.value)}
                    placeholder="Ex: Ajustadas características de performance e segurança..."
                    rows={4}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={handleCancelUpdate} disabled={loading}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmUpdate}
                  disabled={loading || !logDescricao.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Atualização
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
        </div>
      </TooltipProvider>
    </Layout>
  )
}
