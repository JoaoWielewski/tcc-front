"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Calculator, History, Target, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EstimAÍ</h1>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer"
              >
                <Link href="/cadastro">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Estimativa de Histórias
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Centralize e otimize suas estimativas de histórias. Análises inteligentes para estimativas mais precisas.
          </p>
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg cursor-pointer"
            >
              <Link href="/historias">
                Acessar Sistema
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Como o EstimAÍ funciona</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para estimativas mais precisas e eficientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Centralização */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Centralização</CardTitle>
                <CardDescription className="text-gray-600">
                  Diferentes tipos de estimativa em um só lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Centraliza diferentes tipos de estimativa, facilitando todo o processo com Pontos de Função, Pontos de
                  Caso de Uso e Planning Poker integrados.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transparência */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Transparência</CardTitle>
                <CardDescription className="text-gray-600">Cálculos claros e compreensíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Deixa o mais transparente possível os cálculos que estão acontecendo por trás e como é chegado nos
                  resultados das estimativas.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Agilidade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Agilidade</CardTitle>
                <CardDescription className="text-gray-600">Estimativas mais rápidas com dados prontos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Permite realizar as estimativas de forma muito mais rápida já tendo todos os dados do projeto e equipe
                  já prontos e organizados.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Histórico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Histórico Completo</CardTitle>
                <CardDescription className="text-gray-600">Todos os dados organizados e acessíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Mantém todo o histórico de todos os projetos, equipes, histórias e estimativas de diferentes técnicas
                  para consulta e análise.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Análise Comparativa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Análise Comparativa</CardTitle>
                <CardDescription className="text-gray-600">Compare técnicas e melhore a precisão</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Considerando várias histórias, permite análises de qual técnica de estimativa se aproximou mais do
                  tempo real, priorizando os melhores resultados.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Planning Poker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Planning Poker</CardTitle>
                <CardDescription className="text-gray-600">Ferramenta integrada para equipes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Permite realizar o Planning Poker integrado, fazendo com que não seja necessário usar outra
                  ferramenta, economizando tempo e dinheiro.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Resultado</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">O que você ganha usando o EstimAÍ</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Estimativas Mais Precisas e Eficientes</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Estimativas muito mais fáceis de fazer, de forma muito mais rápida e gerando resultados muito
                        mais certeiros. O que gera <strong>diminuição de prejuízos por estimativas erradas</strong>.
                      </p>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">+Rápido</div>
                          <div className="text-sm text-blue-800">Processo otimizado</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">+Preciso</div>
                          <div className="text-sm text-green-800">Análises inteligentes</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">-Prejuízos</div>
                          <div className="text-sm text-purple-800">Estimativas certeiras</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Pronto para otimizar suas estimativas?</h2>
          <p className="text-xl mb-8 opacity-90">
            Comece a usar o EstimAÍ e transforme a forma como sua equipe estima projetos
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 cursor-pointer"
          >
            <Link href="/historias">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h3 className="text-xl font-bold">EstimAÍ</h3>
            </div>
            <p className="text-gray-400 mb-4">Estimativa de histórias mais precisas e eficientes</p>
            <p className="text-gray-500 text-sm">&copy; 2024 EstimAÍ. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
