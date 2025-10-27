import { Layout } from "@/components/layout"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <Layout title="Tempo Real" subtitle="Carregando...">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto" />
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    </Layout>
  )
}
