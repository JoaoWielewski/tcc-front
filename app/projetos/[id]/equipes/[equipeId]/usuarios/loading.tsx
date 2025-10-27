import { Loader2 } from "lucide-react"
import { Layout } from "@/components/layout"

export default function Loading() {
  return (
    <Layout title="Profissionais da Equipe" subtitle="Carregando informações...">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    </Layout>
  )
}
