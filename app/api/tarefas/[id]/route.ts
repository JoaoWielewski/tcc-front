import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://localhost:3000"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('a')
    const response = await fetch(`${API_BASE_URL}/tarefas/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log(response)

    if (!response.ok) {
      throw new Error("Erro ao buscar tarefa")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na API de tarefa:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/tarefas/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Erro ao atualizar tarefa")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na API de atualização:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_BASE_URL}/tarefas/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao deletar tarefa")
    }

    const success = await response.json()
    return NextResponse.json(success)
  } catch (error) {
    console.error("Erro na API de deleção:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
