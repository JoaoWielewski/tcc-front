"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Tarefa {
  id: number
  nome: string
  descricao: string
  status: string
  tempo_pf: number
  tempo_uc?: number
  tempo_sp?: number
  tempo_real?: number
}

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await fetch("/api/tarefas")
        if (!response.ok) {
          throw new Error("Falha ao buscar tarefas")
        }
        const data = await response.json()
        setTarefas(data)
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as tarefas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTarefas()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <Link href="/tarefas/criar">
          <Button>Criar Nova Tarefa</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>Gerencie suas tarefas de projeto</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tarefas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tempo Est. (PF)</TableHead>
                  <TableHead>Tempo Est. (UC)</TableHead>
                  <TableHead>Tempo Est. (SP)</TableHead>
                  <TableHead>Tempo Real</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tarefas.map((tarefa) => (
                  <TableRow key={tarefa.id}>
                    <TableCell className="font-medium">
                      <Link href={`/tarefas/${tarefa.id}`} className="hover:underline">
                        {tarefa.nome}
                      </Link>
                    </TableCell>
                    <TableCell>{tarefa.descricao}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tarefa.status)}>{tarefa.status}</Badge>
                    </TableCell>
                    <TableCell>{tarefa.tempo_pf} horas</TableCell>
                    <TableCell>{tarefa.tempo_uc ? `${tarefa.tempo_uc} horas` : "N/A"}</TableCell>
                    <TableCell>{tarefa.tempo_sp ? `${tarefa.tempo_sp} horas` : "N/A"}</TableCell>
                    <TableCell>{tarefa.tempo_real ? `${tarefa.tempo_real} horas` : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Total de tarefas: {tarefas.length}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
