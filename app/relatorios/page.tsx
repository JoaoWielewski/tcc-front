"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileBarChart, TrendingUp, Target, Info } from "lucide-react"
import { Layout } from "@/components/layout"
import { ToastContainer, useToast } from "@/components/toast"

interface Projeto {
  id: string
  titulo: string
}

interface Equipe {
  id: string
  titulo: string
}

interface Comparacao {
  metodo: string
  historias_consideradas: number
  total_tempo_real: number
  total_tempo_estimado: number
  proximidade_percentual: number
  ajuste_percentual: number
  horas_por_ponto_atual: number
  horas_por_ponto_sugerido: number
}

interface Relatorio {
  filtro: {
    tipo: string
    id: string
  }
  total_historias: number
  comparacoes: Comparacao[]
  metodo_mais_proximo: string
}

export default function RelatoriosPage() {
  const { toasts, addToast } = useToast()

  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [selectedProjeto, setSelectedProjeto] = useState<string>("default")
  const [selectedEquipe, setSelectedEquipe] = useState<string>("default")
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProjetos, setLoadingProjetos] = useState(true)
  const [loadingEquipes, setLoadingEquipes] = useState(false)

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          addToast({
            type: "error",
            title: "Erro: Usuário não autenticado",
          })
          return
        }

        const response = await fetch(`http://localhost:4000/projetos?usuarioId=${userId}`)
        if (!response.ok) throw new Error("Erro ao carregar projetos")

        const data = await response.json()
        setProjetos(data)
      } catch (error) {
        console.error("Erro ao carregar projetos:", error)
        addToast({
          type: "error",
          title: "Erro ao carregar projetos",
        })
      } finally {
        setLoadingProjetos(false)
      }
    }

    fetchProjetos()
  }, [addToast])

  useEffect(() => {
    if (!selectedProjeto || selectedProjeto === "default") {
      setEquipes([])
      setSelectedEquipe("default")
      return
    }

    const fetchEquipes = async () => {
      setLoadingEquipes(true)
      try {
        const response = await fetch(`http://localhost:4000/equipes?projetoId=${selectedProjeto}`)
        if (!response.ok) throw new Error("Erro ao carregar equipes")

        const data = await response.json()
        setEquipes(data)
      } catch (error) {
        console.error("Erro ao carregar equipes:", error)
        addToast({
          type: "error",
          title: "Erro ao carregar equipes",
        })
      } finally {
        setLoadingEquipes(false)
      }
    }

    fetchEquipes()
  }, [selectedProjeto, addToast])

  const handleGerarRelatorio = async () => {
    if (!selectedProjeto || selectedProjeto === "default") {
      addToast({
        type: "error",
        title: "Selecione um projeto",
      })
      return
    }

    setLoading(true)
    setRelatorio(null)

    try {
      const params = new URLSearchParams()
      if (selectedEquipe && selectedEquipe !== "default") {
        params.append("equipeId", selectedEquipe)
      } else {
        params.append("projetoId", selectedProjeto)
      }

      const response = await fetch(`http://localhost:4000/historias/relatorio?${params.toString()}`)
      if (!response.ok) throw new Error("Erro ao gerar relatório")

      const data = await response.json()
      setRelatorio(data)
      addToast({
        type: "success",
        title: "Relatório gerado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      addToast({
        type: "error",
        title: "Erro ao gerar relatório",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMetodoNome = (metodo: string) => {
    const nomes: Record<string, string> = {
      pf: "Pontos de Função (PF)",
      pcu: "Pontos de Caso de Uso (PCU)",
      sp: "Story Points (SP)",
    }
    return nomes[metodo] || metodo.toUpperCase()
  }

  return (
    <Layout title="Relatórios" subtitle="Análise de precisão das estimativas">
      <ToastContainer toasts={toasts} />

      <div className="container mx-auto p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold">Relatórios de Estimativas</h1>
            <p className="text-xs text-gray-600">Compare a precisão dos métodos de estimativa</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-3">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-gray-700">
                <p>
                  Este relatório compara a precisão dos métodos de estimativa (PF, PCU e SP) em relação ao tempo real
                  gasto nas histórias, ajudando a identificar qual método está sendo mais eficaz para o projeto ou
                  equipe específica.
                </p>
                <p className="text-gray-600">
                  <strong>Nota:</strong> Quando nenhuma equipe é selecionada, apenas PF e PCU são comparados, pois SP
                  (Story Points) está associado a equipes específicas.
                </p>
                <p className="text-gray-600">
                  O relatório também sugere ajustes nas taxas de horas por ponto para tornar as próximas estimativas
                  mais precisas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Selecione os Filtros</CardTitle>
            <CardDescription className="text-xs">Escolha o projeto e opcionalmente uma equipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              {/* Seleção de Projeto */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Projeto *</label>
                <Select value={selectedProjeto} onValueChange={setSelectedProjeto} disabled={loadingProjetos}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder={loadingProjetos ? "Carregando..." : "Selecione um projeto"} />
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

              {/* Seleção de Equipe */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Equipe (opcional)</label>
                <Select
                  value={selectedEquipe}
                  onValueChange={setSelectedEquipe}
                  disabled={!selectedProjeto || selectedProjeto === "default" || loadingEquipes}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue
                      placeholder={
                        !selectedProjeto || selectedProjeto === "default"
                          ? "Selecione um projeto primeiro"
                          : loadingEquipes
                            ? "Carregando..."
                            : "Todas as equipes"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Todas as equipes</SelectItem>
                    {equipes.map((equipe) => (
                      <SelectItem key={equipe.id} value={equipe.id}>
                        {equipe.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGerarRelatorio}
              disabled={!selectedProjeto || selectedProjeto === "default" || loading}
              className="w-full md:w-auto h-8 text-sm bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileBarChart className="mr-2 h-3 w-3" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados do Relatório */}
        {relatorio && (
          <div className="space-y-3">
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                  <Target className="h-4 w-4" />
                  Método mais preciso para este filtro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-green-700">{getMetodoNome(relatorio.metodo_mais_proximo)}</p>
              </CardContent>
            </Card>

            {/* Comparações */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {relatorio.comparacoes.map((comparacao) => (
                <Card
                  key={comparacao.metodo}
                  className={comparacao.metodo === relatorio.metodo_mais_proximo ? "border-green-500" : ""}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{getMetodoNome(comparacao.metodo)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Precisão */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">Precisão</span>
                        <span className="font-bold text-blue-600">{comparacao.proximidade_percentual.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                          style={{ width: `${Math.min(comparacao.proximidade_percentual, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Adjustment Suggestion */}
                    {comparacao.proximidade_percentual < 95 && (
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-amber-900">
                          <TrendingUp className="h-3 w-3" />
                          Ajuste Sugerido
                        </div>
                        <div className="flex justify-between items-baseline">
                          <div>
                            <p className="text-xs text-gray-600">Atual</p>
                            <p className="text-sm font-bold">{comparacao.horas_por_ponto_atual}h/pt</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Sugerido</p>
                            <p className="text-sm font-bold text-amber-700">
                              {comparacao.horas_por_ponto_sugerido.toFixed(2)}h/pt
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
