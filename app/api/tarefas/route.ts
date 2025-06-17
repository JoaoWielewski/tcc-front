import { NextResponse } from "next/server"

const API_BASE_URL = "http://localhost:3000"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/tarefas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na API de tarefas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
