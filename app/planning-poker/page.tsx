"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Sessao {
  id: string
  equipeId: string
  historiaId: string
  titulo: string
  criado_em: Date
}

export default function PlanningPokerPage() {
  const router = useRouter()
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está logado e é profissional
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const equipeId = localStorage.getItem("equipeId")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (!equipeId) {
      // Se não tem equipeId, é administrador - redirecionar para histórias
      router.push("/historias")
      return
    }

    const fetchSessoes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:4000/sessoes?equipeId=${equipeId}`)
        if (response.ok) {
          const data: Sessao[] = await response.json()
          setSessoes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar sessões:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessoes()
  }, [router])

  const handleJoinSession = (sessaoId: string) => {
    router.push(`/planning-poker/${sessaoId}`)
  }

  return (
    <Layout title="Sessões de Planning Poker Ativas" subtitle="Participe das sessões de estimativa da sua equipe">
      <div className="space-y-6">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Carregando sessões...</p>
          </motion.div>
        ) : sessoes.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma sessão ativa no momento</h3>
            <p className="text-gray-500">Aguarde o início de uma nova sessão de Planning Poker</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessoes.map((sessao, index) => (
              <motion.div
                key={sessao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      {sessao.titulo}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      Criada em {new Date(sessao.criado_em).toLocaleString("pt-BR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleJoinSession(sessao.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Participar da Sessão
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
