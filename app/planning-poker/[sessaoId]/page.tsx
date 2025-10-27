"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { io, type Socket } from "socket.io-client"
import { Users, Eye, Send, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Participante {
  usuarioId: string
  nome: string
  votou: boolean
  voto?: number
}

interface SessionState {
  sessaoId: string
  historiaId: string
  titulo: string
  participantes: Participante[]
  cartasReveladas: boolean
  storyPointFinal?: number
}

export default function PlanningPokerSessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessaoId = params.sessaoId as string

  const [socket, setSocket] = useState<Socket | null>(null)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [myVote, setMyVote] = useState<string>("")
  const [finalStoryPoint, setFinalStoryPoint] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Get user info from localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const storedUserId = localStorage.getItem("userId")
    const storedUserName = localStorage.getItem("userName")

    if (!isLoggedIn || !storedUserId) {
      router.push("/login")
      return
    }

    setUserId(storedUserId)
    setUserName(storedUserName || "Usuário")

    // Connect to WebSocket
    const newSocket = io("http://localhost:4000")

    newSocket.on("connect", () => {
      setConnected(true)

      // Join session
      newSocket.emit("sessao:entrar", {
        sessaoId,
        usuarioId: storedUserId,
        nome: storedUserName || "Usuário",
      })
    })

    newSocket.on("disconnect", () => {
      setConnected(false)
    })

    // Listen for session state updates
    newSocket.on("sessao:estado-atualizado", (state: SessionState) => {
      setSessionState(state)

      // Check if current user has voted
      const currentUser = state.participantes.find((p) => p.usuarioId === storedUserId)
      if (currentUser?.votou) {
        setHasVoted(true)
      } else {
        setHasVoted(false)
        setMyVote("")
      }
    })

    // Listen for participants updates
    newSocket.on("sessao:participantes-atualizado", (state: SessionState) => {
      setSessionState(state)
    })

    // Listen for vote registered
    newSocket.on("sessao:voto-registrado", ({ usuarioId: votedUserId }: { usuarioId: string }) => {
      setSessionState((prev) => {
        if (!prev) return null
        return {
          ...prev,
          participantes: prev.participantes.map((p) => (p.usuarioId === votedUserId ? { ...p, votou: true } : p)),
        }
      })
    })

    // Listen for cards revealed
    newSocket.on("sessao:cartas-reveladas", (state: SessionState) => {
      setSessionState(state)
    })

    // Listen for story point defined
    newSocket.on(
      "sessao:story-point-definido",
      ({ sessaoId: sid, historiaId, valor }: { sessaoId: string; historiaId: string; valor: number }) => {
        setSessionState((prev) => (prev ? { ...prev, storyPointFinal: valor } : null))
      },
    )

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [sessaoId, router])

  const handleVote = () => {
    if (!socket || !myVote || hasVoted) return

    const voteValue = Number.parseFloat(myVote)
    if (isNaN(voteValue)) {
      alert("Por favor, insira um número válido")
      return
    }

    socket.emit("sessao:selecionar", {
      sessaoId,
      usuarioId: userId,
      valor: voteValue,
    })

    setHasVoted(true)
  }

  const handleReveal = () => {
    if (!socket) return
    socket.emit("sessao:revelar", { sessaoId })
  }

  const handleDefineFinalStoryPoint = () => {
    if (!socket || !finalStoryPoint) return

    const finalValue = Number.parseFloat(finalStoryPoint)
    if (isNaN(finalValue)) {
      alert("Por favor, insira um número válido")
      return
    }

    socket.emit("sessao:definir-story-point", {
      sessaoId,
      valor: finalValue,
    })
  }

  const handleResetRound = () => {
    if (!socket) return
    socket.emit("sessao:resetar", { sessaoId })
  }

  if (!sessionState) {
    return (
      <Layout title="Planning Poker" subtitle="Carregando sessão...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      </Layout>
    )
  }

  const allVoted = sessionState.participantes.length > 0 && sessionState.participantes.every((p) => p.votou)
  const canReveal = allVoted && !sessionState.cartasReveladas

  return (
    <Layout title={sessionState.titulo} subtitle="Sessão de Planning Poker">
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/planning-poker")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">{connected ? "Conectado" : "Desconectado"}</span>
          </div>
        </div>

        {/* Voting Section */}
        {!sessionState.cartasReveladas && (
          <Card>
            <CardHeader>
              <CardTitle>Sua Estimativa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vote">Digite seu voto (em pontos)</Label>
                <div className="flex gap-2">
                  <Input
                    id="vote"
                    type="number"
                    placeholder="Ex: 5"
                    value={myVote}
                    onChange={(e) => setMyVote(e.target.value)}
                    disabled={hasVoted}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleVote}
                    disabled={!myVote || hasVoted}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {hasVoted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Votado
                      </>
                    ) : (
                      "Votar"
                    )}
                  </Button>
                </div>
              </div>
              {hasVoted && <p className="text-sm text-green-600">✓ Seu voto foi registrado e está oculto</p>}
            </CardContent>
          </Card>
        )}

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes ({sessionState.participantes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {sessionState.participantes.map((participante) => (
                  <motion.div
                    key={participante.usuarioId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {participante.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{participante.nome}</span>
                    </div>
                    <div>
                      {sessionState.cartasReveladas && participante.voto !== undefined ? (
                        <motion.div
                          initial={{ rotateY: 180 }}
                          animate={{ rotateY: 0 }}
                          transition={{ duration: 0.6 }}
                          className="relative h-16 w-12 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border-2 border-purple-600 overflow-hidden"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-purple-600">{participante.voto}</span>
                          </div>
                          <div className="absolute top-1 left-1 right-1 bottom-1 border border-purple-200 rounded" />
                        </motion.div>
                      ) : participante.votou ? (
                        <div className="relative h-16 w-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-lg shadow-lg overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
                            <div className="absolute top-1 left-1 right-1 bottom-1 border-2 border-white/30 rounded" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">?</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 w-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <span className="text-gray-400 text-xl">?</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Reveal Button */}
        {!sessionState.cartasReveladas && (
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleReveal}
                disabled={!canReveal}
                className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
              >
                <Eye className="h-4 w-4" />
                {canReveal ? "Revelar Cartas" : "Aguardando todos votarem..."}
              </Button>
              {!allVoted && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  {sessionState.participantes.filter((p) => p.votou).length} de {sessionState.participantes.length}{" "}
                  votaram
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Final Story Point or Reset Round */}
        {sessionState.cartasReveladas && (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionState.storyPointFinal !== undefined ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-2">Pontos de História Definido:</p>
                  <p className="text-4xl font-bold text-green-600">{sessionState.storyPointFinal}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="finalStoryPoint">Valor final acordado pela equipe</Label>
                    <div className="flex gap-2">
                      <Input
                        id="finalStoryPoint"
                        type="number"
                        placeholder="Ex: 8"
                        value={finalStoryPoint}
                        onChange={(e) => setFinalStoryPoint(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleDefineFinalStoryPoint}
                        disabled={!finalStoryPoint}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Definir
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Ou</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetRound}
                    variant="outline"
                    className="w-full gap-2 border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Votar novamente
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
