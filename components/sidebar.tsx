"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calculator, FileText, FolderOpen, Plus, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isProfessional, setIsProfessional] = useState(false)

  useEffect(() => {
    // Verificar se o usuário é profissional (tem equipeId)
    const equipeId = localStorage.getItem("equipeId")
    setIsProfessional(!!equipeId)
  }, [])

  // Navegação para administradores
  const adminNavigation = [
    {
      name: "Histórias",
      href: "/historias",
      icon: FileText,
      current: false,
    },
    {
      name: "Projetos",
      href: "/projetos",
      icon: FolderOpen,
      current: false,
      children: [
        { name: "Todos os Projetos", href: "/projetos" },
        { name: "Novo Projeto", href: "/projetos/create" },
      ],
    },
    {
      name: "Estimativa de Esforço por Linguagem/Método",
      href: "/taxa-horas",
      icon: Clock,
      current: false,
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: Calculator,
      current: false,
    },
  ]

  // Navegação para profissionais
  const professionalNavigation = [
    {
      name: "Sessões de Planning Poker Ativas",
      href: "/planning-poker",
      icon: Users,
      current: false,
    },
  ]

  const navigation = isProfessional ? professionalNavigation : adminNavigation

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-white/80 backdrop-blur-sm", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EstimAÍ
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === item.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:text-gray-900",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Quick Actions - apenas para administradores */}
      {!isProfessional && (
        <>
          <Separator />
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ações Rápidas</p>
            <Button
              asChild
              size="sm"
              className="w-full justify-start bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Nova História
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
