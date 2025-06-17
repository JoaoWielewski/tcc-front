"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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

export default function EditarTarefaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Dados do projeto
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState("")

  // Características do projeto
  const [comunicacaoDados, setComunicacaoDados] = useState(0)
  const [processamentoDistribuido, setProcessamentoDistribuido] = useState(0)
  const [performance, setPerformance] = useState(0)
  const [configuracaoEquipamento, setConfiguracaoEquipamento] = useState(0)
  const [volumeTransacoes, setVolumeTransacoes] = useState(0)
  const [entradaDadosOnline, setEntradaDadosOnline] = useState(0)
  const [eficienciaUsuario, setEficienciaUsuario] = useState(0)
  const [atualizacaoOnline, setAtualizacaoOnline] = useState(0)
  const [complexidadeProcessamento, setComplexidadeProcessamento] = useState(0)
  const [reusabilidade, setReusabilidade] = useState(0)
  const [facilidadeInstalacao, setFacilidadeInstalacao] = useState(0)
  const [facilidadeOperacao, setFacilidadeOperacao] = useState(0)
  const [multiplosLocais, setMultiplosLocais] = useState(0)
  const [facilidadeMudancas, setFacilidadeMudancas] = useState(0)

  // Novas características do projeto
  const [sistemaDistribuido, setSistemaDistribuido] = useState(0)
  const [requisitoPerformance, setRequisitoPerformance] = useState(0)
  const [eficienciaUsuarioFinal, setEficienciaUsuarioFinal] = useState(0)
  const [complexidadeProcessamentoInterno, setComplexidadeProcessamentoInterno] = useState(0)
  const [reusabilidadeNova, setReusabilidadeNova] = useState(0)
  const [facilidadeInstalacaoNova, setFacilidadeInstalacaoNova] = useState(0)
  const [facilidadeUso, setFacilidadeUso] = useState(0)
  const [portabilidade, setPortabilidade] = useState(0)
  const [facilidadeMudancasNova, setFacilidadeMudancasNova] = useState(0)
  const [conexoesSimultaneas, setConexoesSimultaneas] = useState(0)
  const [requisitoSeguranca, setRequisitoSeguranca] = useState(0)
  const [acessoComponentesTerceiros, setAcessoComponentesTerceiros] = useState(0)
  const [treinamentoEspecializado, setTreinamentoEspecializado] = useState(0)

  // Dados da equipe
  const [familiaridadeMetodologia, setFamiliaridadeMetodologia] = useState(0)
  const [experienciaDominio, setExperienciaDominio] = useState(0)
  const [experienciaTecnologia, setExperienciaTecnologia] = useState(0)
  const [estabilidadeRequisitos, setEstabilidadeRequisitos] = useState(0)
  const [experienciaEquipe, setExperienciaEquipe] = useState(0)
  const [participacaoCliente, setParticipacaoCliente] = useState(0)
  const [motivacaoEquipe, setMotivacaoEquipe] = useState(0)
  const [pressaoPrazos, setPressaoPrazos] = useState(0)

  useEffect(() => {
    const fetchTarefa = async () => {
      try {
        const response = await fetch(`/api/tarefas/${params.id}`)
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefa")
        }
        const data: Tarefa = await response.json()

        // Preencher os dados básicos
        setNome(data.nome)
        setDescricao(data.descricao)
        setStatus(data.status)

        // Preencher as características se existirem
        if (data.caracteristicas) {
          setComunicacaoDados(data.caracteristicas.comunicacaoDados)
          setProcessamentoDistribuido(data.caracteristicas.processamentoDistribuido)
          setPerformance(data.caracteristicas.performance)
          setConfiguracaoEquipamento(data.caracteristicas.configuracaoEquipamento)
          setVolumeTransacoes(data.caracteristicas.volumeTransacoes)
          setEntradaDadosOnline(data.caracteristicas.entradaDadosOnline)
          setEficienciaUsuario(data.caracteristicas.eficienciaUsuario)
          setAtualizacaoOnline(data.caracteristicas.atualizacaoOnline)
          setComplexidadeProcessamento(data.caracteristicas.complexidadeProcessamento)
          setReusabilidade(data.caracteristicas.reusabilidade)
          setFacilidadeInstalacao(data.caracteristicas.facilidadeInstalacao)
          setFacilidadeOperacao(data.caracteristicas.facilidadeOperacao)
          setMultiplosLocais(data.caracteristicas.multiplosLocais)
          setFacilidadeMudancas(data.caracteristicas.facilidadeMudancas)
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/tarefas/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          descricao,
          status,
          caracteristicas: {
            comunicacaoDados,
            processamentoDistribuido,
            performance,
            configuracaoEquipamento,
            volumeTransacoes,
            entradaDadosOnline,
            eficienciaUsuario,
            atualizacaoOnline,
            complexidadeProcessamento,
            reusabilidade,
            facilidadeInstalacao,
            facilidadeOperacao,
            multiplosLocais,
            facilidadeMudancas,
          },
          // Não enviamos os novos campos para o backend ainda
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar tarefa")
      }

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso",
      })

      router.push(`/tarefas/${params.id}`)
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderSlider = (value: number, onChange: (value: number) => void, label: string) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Slider min={0} max={5} step={1} value={[value]} onValueChange={(values) => onChange(values[0])} />
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Tarefa</CardTitle>
          <CardDescription>Atualize os dados da tarefa</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Tarefa</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluída">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Características do Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSlider(comunicacaoDados, setComunicacaoDados, "Comunicação de Dados")}
                {renderSlider(processamentoDistribuido, setProcessamentoDistribuido, "Processamento Distribuído")}
                {renderSlider(performance, setPerformance, "Performance")}
                {renderSlider(configuracaoEquipamento, setConfiguracaoEquipamento, "Configuração do Equipamento")}
                {renderSlider(volumeTransacoes, setVolumeTransacoes, "Volume de Transações")}
                {renderSlider(entradaDadosOnline, setEntradaDadosOnline, "Entrada de Dados Online")}
                {renderSlider(eficienciaUsuario, setEficienciaUsuario, "Eficiência do Usuário")}
                {renderSlider(atualizacaoOnline, setAtualizacaoOnline, "Atualização Online")}
                {renderSlider(complexidadeProcessamento, setComplexidadeProcessamento, "Complexidade de Processamento")}
                {renderSlider(reusabilidade, setReusabilidade, "Reusabilidade")}
                {renderSlider(facilidadeInstalacao, setFacilidadeInstalacao, "Facilidade de Instalação")}
                {renderSlider(facilidadeOperacao, setFacilidadeOperacao, "Facilidade de Operação")}
                {renderSlider(multiplosLocais, setMultiplosLocais, "Múltiplos Locais")}
                {renderSlider(facilidadeMudancas, setFacilidadeMudancas, "Facilidade de Mudanças")}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Características Adicionais do Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSlider(sistemaDistribuido, setSistemaDistribuido, "Sistema Distribuído")}
                {renderSlider(requisitoPerformance, setRequisitoPerformance, "Requisitos de Performance")}
                {renderSlider(eficienciaUsuarioFinal, setEficienciaUsuarioFinal, "Eficiência do Usuário Final")}
                {renderSlider(
                  complexidadeProcessamentoInterno,
                  setComplexidadeProcessamentoInterno,
                  "Complexidade de Processamento Interno",
                )}
                {renderSlider(reusabilidadeNova, setReusabilidadeNova, "Reusabilidade")}
                {renderSlider(facilidadeInstalacaoNova, setFacilidadeInstalacaoNova, "Facilidade de Instalação")}
                {renderSlider(facilidadeUso, setFacilidadeUso, "Facilidade de Uso")}
                {renderSlider(portabilidade, setPortabilidade, "Portabilidade")}
                {renderSlider(facilidadeMudancasNova, setFacilidadeMudancasNova, "Facilidade de Mudanças")}
                {renderSlider(conexoesSimultaneas, setConexoesSimultaneas, "Conexões Simultâneas")}
                {renderSlider(requisitoSeguranca, setRequisitoSeguranca, "Requisitos de Segurança")}
                {renderSlider(
                  acessoComponentesTerceiros,
                  setAcessoComponentesTerceiros,
                  "Acesso Direto a Componentes de Terceiros",
                )}
                {renderSlider(
                  treinamentoEspecializado,
                  setTreinamentoEspecializado,
                  "Necessidade de Treinamento Especializado",
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Dados da Equipe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSlider(
                  familiaridadeMetodologia,
                  setFamiliaridadeMetodologia,
                  "Familiaridade com a Metodologia de Desenvolvimento",
                )}
                {renderSlider(experienciaDominio, setExperienciaDominio, "Experiência com o Domínio da Aplicação")}
                {renderSlider(
                  experienciaTecnologia,
                  setExperienciaTecnologia,
                  "Experiência com a Tecnologia Utilizada",
                )}
                {renderSlider(estabilidadeRequisitos, setEstabilidadeRequisitos, "Estabilidade dos Requisitos")}
                {renderSlider(experienciaEquipe, setExperienciaEquipe, "Experiência Geral da Equipe")}
                {renderSlider(participacaoCliente, setParticipacaoCliente, "Participação do Cliente")}
                {renderSlider(motivacaoEquipe, setMotivacaoEquipe, "Motivação da Equipe")}
                {renderSlider(pressaoPrazos, setPressaoPrazos, "Pressão de Prazos")}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
