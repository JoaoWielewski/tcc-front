"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calculator, Clock, CheckCircle, Loader2, Sparkles, ArrowLeft, Users, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CreateHistoriaDto {
  titulo: string
  descricao: string
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
  linguagem?: string
  // Novas características do projeto
  sistema_distribuido?: number
  requisitos_performance?: number
  eficiencia_usuario_final?: number
  complexidade_processamento?: number
  reusabilidade_codigo?: number
  facilidade_instalacao?: number
  facilidade_uso?: number
  portabilidade?: number
  facilidade_mudancas?: number
  conexoes_simultaneas?: number
  requisitos_seguranca?: number
  acesso_componentes_terceiros?: number
  necessidade_treinamento?: number
  // Dados da equipe
  familiaridade_metodologia?: number
  experiencia_dominio?: number
  experiencia_tecnologia?: number
  estabilidade_requisitos?: number
  experiencia_equipe?: number
  participacao_cliente?: number
  motivacao_equipe?: number
  pressao_prazos?: number
  // Contadores de atores
  atores_simples?: number
  atores_medios?: number
  atores_complexos?: number
  // Contadores de casos de uso
  casos_uso_simples?: number
  casos_uso_medios?: number
  casos_uso_complexos?: number
}

interface EstimationResult {
  pf: number
  tempo_pf: number
}

const linguagens = [
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "C#",
  ".NET",
  "C# / .NET",
  "PHP",
  "C++",
  "C",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "Ruby",
  "R",
  "Scala",
  "Objective-C",
  "MATLAB",
  "Perl",
  "Haskell",
  "SQL (procedural)",
]

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
      "Considere a facilidade de uso, interface intuitiva, automação de tarefas, e recursos que aumentam a produtividade do usuário final.",
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
      "Considere algoritmos complexos, cálculos matemáticos avançados, processamento de IA/ML, ou lógicas de negócio sofisticadas.",
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
      "Considere a simplicidade do processo de instalação, configuração inicial, deploy automatizado, ou containerização (Docker, etc.).",
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
      "Considere se o sistema será usado em diferentes localizações geográficas, fusos horários, idiomas, ou se precisa de distribuição global.",
  },
  {
    key: "facil_mudanca",
    label: "Fácil Mudança",
    tooltip:
      "Avalie a flexibilidade para modificações futuras, extensibilidade, arquitetura modular, e facilidade para implementar novos requisitos.",
  },
]

// Adicionar as novas características do projeto
const caracteristicasAdicionais = [
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
      "Considere necessidades específicas de latência, throughput, escalabilidade horizontal/vertical, e otimizações de performance críticas.",
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
      "Considere algoritmos complexos, processamento de big data, machine learning, análises estatísticas, ou cálculos computacionalmente intensivos.",
  },
  {
    key: "reusabilidade_codigo",
    label: "Reusabilidade",
    tooltip:
      "Avalie o nível de modularização, padrões de design, bibliotecas compartilhadas, e componentes que podem ser reutilizados.",
  },
  {
    key: "facilidade_instalacao",
    label: "Facilidade de instalação",
    tooltip:
      "Considere automação de deploy, containerização, scripts de instalação, documentação, e simplicidade do processo de setup.",
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
      "Considere compatibilidade entre diferentes sistemas operacionais, browsers, dispositivos, ou ambientes de execução.",
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
      "Considere a capacidade de suportar múltiplos usuários conectados simultaneamente, sessões concorrentes, e gerenciamento de estado.",
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
      "Considere integrações com APIs externas, serviços de terceiros, bancos de dados externos, ou dependências de sistemas externos.",
  },
  {
    key: "necessidade_treinamento",
    label: "Necessidade de treinamento especializado",
    tooltip:
      "Avalie se o sistema requer conhecimento técnico específico, treinamento especializado, ou expertise em tecnologias particulares.",
  },
]

// Adicionar os dados da equipe
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
    key: "experiencia_equipe",
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

const contadores = [
  { key: "ee_td", label: "EE - Tipos de Dados" },
  { key: "ee_ar", label: "EE - Arquivos Referenciados" },
  { key: "se_td", label: "SE - Tipos de Dados" },
  { key: "se_ar", label: "SE - Arquivos Referenciados" },
  { key: "ce_td", label: "CE - Tipos de Dados" },
  { key: "ce_ar", label: "CE - Arquivos Referenciados" },
  { key: "ali_td", label: "ALI - Tipos de Dados" },
  { key: "ali_ar", label: "ALI - Arquivos Referenciados" },
  { key: "aie_td", label: "AIE - Tipos de Dados" },
  { key: "aie_ar", label: "AIE - Arquivos Referenciados" },
]

const contadoresAtores = [
  { key: "atores_simples", label: "Atores Simples" },
  { key: "atores_medios", label: "Atores Médios" },
  { key: "atores_complexos", label: "Atores Complexos" },
]

const contadoresCasosUso = [
  { key: "casos_uso_simples", label: "Casos de Uso Simples" },
  { key: "casos_uso_medios", label: "Casos de Uso Médios" },
  { key: "casos_uso_complexos", label: "Casos de Uso Complexos" },
]

export default function CreateStoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateHistoriaDto>({
    titulo: "",
    descricao: "",
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
    linguagem: "",
    // Novas características do projeto
    sistema_distribuido: 0,
    requisitos_performance: 0,
    eficiencia_usuario_final: 0,
    complexidade_processamento: 0,
    reusabilidade_codigo: 0,
    facilidade_instalacao: 0,
    facilidade_uso: 0,
    portabilidade: 0,
    facilidade_mudancas: 0,
    conexoes_simultaneas: 0,
    requisitos_seguranca: 0,
    acesso_componentes_terceiros: 0,
    necessidade_treinamento: 0,
    // Dados da equipe
    familiaridade_metodologia: 0,
    experiencia_dominio: 0,
    experiencia_tecnologia: 0,
    estabilidade_requisitos: 0,
    experiencia_equipe: 0,
    participacao_cliente: 0,
    motivacao_equipe: 0,
    pressao_prazos: 0,
    // Contadores de atores
    atores_simples: 0,
    atores_medios: 0,
    atores_complexos: 0,
    // Contadores de casos de uso
    casos_uso_simples: 0,
    casos_uso_medios: 0,
    casos_uso_complexos: 0,
  })

  const [result, setResult] = useState<EstimationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof CreateHistoriaDto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSliderChange = (field: keyof CreateHistoriaDto, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value[0],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Filtrar apenas os campos que o backend aceita
      const backendData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        ee_td: formData.ee_td,
        ee_ar: formData.ee_ar,
        se_td: formData.se_td,
        se_ar: formData.se_ar,
        ce_td: formData.ce_td,
        ce_ar: formData.ce_ar,
        ali_td: formData.ali_td,
        ali_ar: formData.ali_ar,
        aie_td: formData.aie_td,
        aie_ar: formData.aie_ar,
        comm_dados: formData.comm_dados,
        proc_distribuido: formData.proc_distribuido,
        performance: formData.performance,
        uso_config: formData.uso_config,
        volume_transacoes: formData.volume_transacoes,
        entrada_online: formData.entrada_online,
        eficiencia_usuario: formData.eficiencia_usuario,
        atualizacao_online: formData.atualizacao_online,
        proc_complexo: formData.proc_complexo,
        reusabilidade: formData.reusabilidade,
        facil_instalacao: formData.facil_instalacao,
        facil_operacao: formData.facil_operacao,
        multiplos_locais: formData.multiplos_locais,
        facil_mudanca: formData.facil_mudanca,
        linguagem: formData.linguagem,
      }

      const response = await fetch("http://localhost:3000/historias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar e estimar história")
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
    router.push("/")
  }

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Button onClick={handleBackToList} variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Lista
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Calculator className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nova História
                </h1>
              </div>
              <p className="text-lg text-gray-600">Crie e estime uma nova história usando pontos de função</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da História */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
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

            {/* Contadores */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Contadores de Função da História
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Defina os valores para cada tipo de função
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contadores.map((contador) => (
                      <div key={contador.key} className="space-y-2">
                        <Label htmlFor={contador.key}>{contador.label}</Label>
                        <Input
                          id={contador.key}
                          type="number"
                          min="0"
                          value={formData[contador.key as keyof CreateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof CreateHistoriaDto,
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

            {/* Contadores de Atores */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contadores de Atores da História
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Defina a quantidade de atores por complexidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contadoresAtores.map((contador) => (
                      <div key={contador.key} className="space-y-2">
                        <Label htmlFor={contador.key}>{contador.label}</Label>
                        <Input
                          id={contador.key}
                          type="number"
                          min="0"
                          value={formData[contador.key as keyof CreateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof CreateHistoriaDto,
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.27 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Contadores de Casos de Uso da História
                  </CardTitle>
                  <CardDescription className="text-teal-100">
                    Defina a quantidade de casos de uso por complexidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contadoresCasosUso.map((contador) => (
                      <div key={contador.key} className="space-y-2">
                        <Label htmlFor={contador.key}>{contador.label}</Label>
                        <Input
                          id={contador.key}
                          type="number"
                          min="0"
                          value={formData[contador.key as keyof CreateHistoriaDto] as number}
                          onChange={(e) =>
                            handleInputChange(
                              contador.key as keyof CreateHistoriaDto,
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

            {/* Características do Projeto */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Características do Projeto
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Características do projeto e linguagem de programação
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Linguagem */}
                  <div className="space-y-2">
                    <Label>Linguagem de Programação</Label>
                    <Select value={formData.linguagem} onValueChange={(value) => handleInputChange("linguagem", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500">
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

                  <Separator />

                  {/* Características */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Características do Sistema (0-5)</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {caracteristicas.map((caracteristica) => (
                        <div key={caracteristica.key} className="space-y-3">
                          <div className="flex items-center justify-between">
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
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {formData[caracteristica.key as keyof CreateHistoriaDto] as number}
                            </Badge>
                          </div>
                          <Slider
                            value={[formData[caracteristica.key as keyof CreateHistoriaDto] as number]}
                            onValueChange={(value) =>
                              handleSliderChange(caracteristica.key as keyof CreateHistoriaDto, value)
                            }
                            max={5}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 - Não presente</span>
                            <span>5 - Essencial</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-lg font-semibold text-gray-800">Características Adicionais (0-5)</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {caracteristicasAdicionais.map((caracteristica) => (
                        <div key={caracteristica.key} className="space-y-3">
                          <div className="flex items-center justify-between">
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
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {formData[caracteristica.key as keyof CreateHistoriaDto] as number}
                            </Badge>
                          </div>
                          <Slider
                            value={[formData[caracteristica.key as keyof CreateHistoriaDto] as number]}
                            onValueChange={(value) =>
                              handleSliderChange(caracteristica.key as keyof CreateHistoriaDto, value)
                            }
                            max={5}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 - Não presente</span>
                            <span>5 - Essencial</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Características da Equipe */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Características da Equipe
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Características da equipe de desenvolvimento
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
                              {formData[item.key as keyof CreateHistoriaDto] as number}
                            </Badge>
                          </div>
                          <Slider
                            value={[formData[item.key as keyof CreateHistoriaDto] as number]}
                            onValueChange={(value) => handleSliderChange(item.key as keyof CreateHistoriaDto, value)}
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
              transition={{ delay: 0.45 }}
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
                    Processando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Criar e Estimar
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
                      História Criada com Sucesso!
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

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg"
                    >
                      <div className="text-center text-sm text-gray-700">
                        <strong>Projeto:</strong> {formData.titulo}
                        {formData.linguagem && (
                          <>
                            {" • "}
                            <strong>Linguagem:</strong> {formData.linguagem}
                          </>
                        )}
                      </div>
                    </motion.div>

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleBackToList}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Lista
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}
