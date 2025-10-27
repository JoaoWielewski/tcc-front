import { Layout } from "@/components/layout"

export default function TaxaHorasLoading() {
  return (
    <Layout title="Estimativa de Esforço por Linguagem/Método" subtitle="Carregando...">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600">Carregando taxas...</p>
        </div>
      </div>
    </Layout>
  )
}
