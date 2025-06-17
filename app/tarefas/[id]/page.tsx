"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface Tarefa {
  id: number
  nome: string
  descricao: string
  status: string
  tempo_pf: number
  tempo_uc?: number
  tempo_sp?: number
  tempo_real?: number
  caracteristicas?: {
    comunicacaoDados: number
    processamentoDistribuido: number
    performance: number
    configuracaoEquipamento: number
    volumeTransacoes: number
    entradaDadosOnline: number
    eficienciaUsuario: number
    atualizacaoOnline: number
    complexidadeProcessamento: number
    reusabilidade: number
    facilidadeInstalacao: number
    facilidadeOperacao: number
    multiplosLocais: number
    facilidadeMudancas: number
  }
}

export default function DetalheTarefaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [tarefa, setTarefa] = useState<Tarefa | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTarefa = async () => {
      try {
        const response = await fetch(`/api/tarefas/${params.id}`)
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefa")
        }
        const data = await response.json()
        setTarefa(data)
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes da tarefa",
          variant: "destructive",
        })
        router.push("/tarefas")
      } finally {
        setLoading(false)
      }
    }

    fetchTarefa()
  }, [params.id, router, toast])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500"
      case "em andamento":
        return "bg-blue-500"
      case "concluída":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return
    }

    try {
      const response = await fetch(`/api/tarefas/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir tarefa")
      }

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso",
      })

      router.push("/tarefas")
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!tarefa) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">Tarefa não encontrada</p>
              <Button className="mt-4" onClick={() => router.push("/tarefas")}>
                Voltar para Tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalhes da Tarefa</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/tarefas")}>
            Voltar
          </Button>
          <Button variant="outline" onClick={() => router.push(`/tarefas/${params.id}/editar`)}>
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{tarefa.nome}</CardTitle>
              <CardDescription className="mt-2">{tarefa.descricao}</CardDescription>
            </div>
            <Badge className={getStatusColor(tarefa.status)}>{tarefa.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Tempo Estimado (Pontos por Função)</h3>
              <p>{tarefa.tempo_pf} horas</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Tempo Estimado (Pontos de UseCase)</h3>
              <p>{tarefa.tempo_uc ? `${tarefa.tempo_uc} horas` : "N/A"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Tempo Estimado (Story Points)</h3>
              <p>{tarefa.tempo_sp ? `${tarefa.tempo_sp} horas` : "N/A"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Tempo Real de Execução</h3>
              <p>{tarefa.tempo_real ? `${tarefa.tempo_real} horas` : "N/A"}</p>
            </div>
          </div>

          {tarefa.caracteristicas && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Características do Projeto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Comunicação de Dados</p>
                    <p className="text-sm">{tarefa.caracteristicas.comunicacaoDados}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Processamento Distribuído</p>
                    <p className="text-sm">{tarefa.caracteristicas.processamentoDistribuido}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Performance</p>
                    <p className="text-sm">{tarefa.caracteristicas.performance}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Configuração do Equipamento</p>
                    <p className="text-sm">{tarefa.caracteristicas.configuracaoEquipamento}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Volume de Transações</p>
                    <p className="text-sm">{tarefa.caracteristicas.volumeTransacoes}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Entrada de Dados Online</p>
                    <p className="text-sm">{tarefa.caracteristicas.entradaDadosOnline}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Eficiência do Usuário</p>
                    <p className="text-sm">{tarefa.caracteristicas.eficienciaUsuario}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Atualização Online</p>
                    <p className="text-sm">{tarefa.caracteristicas.atualizacaoOnline}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Complexidade de Processamento</p>
                    <p className="text-sm">{tarefa.caracteristicas.complexidadeProcessamento}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reusabilidade</p>
                    <p className="text-sm">{tarefa.caracteristicas.reusabilidade}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Facilidade de Instalação</p>
                    <p className="text-sm">{tarefa.caracteristicas.facilidadeInstalacao}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Facilidade de Operação</p>
                    <p className="text-sm">{tarefa.caracteristicas.facilidadeOperacao}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Múltiplos Locais</p>
                    <p className="text-sm">{tarefa.caracteristicas.multiplosLocais}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Facilidade de Mudanças</p>
                    <p className="text-sm">{tarefa.caracteristicas.facilidadeMudancas}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">ID da Tarefa: {tarefa.id}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
