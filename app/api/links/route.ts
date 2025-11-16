import { NextRequest, NextResponse } from 'next/server'
import { getAllLinks, createLink, initializeDatabase } from '@/lib/db'

// Inicializar banco na primeira requisição
let dbInitialized = false

async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function GET() {
  try {
    await ensureDatabaseInitialized()
    const links = await getAllLinks()
    return NextResponse.json(links)
  } catch (error) {
    console.error('Erro ao buscar links:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseInitialized()
    const body = await request.json()
    const newLink = await createLink({
      title: body.title,
      url: body.url,
      editable: body.editable ?? true,
    })
    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar link:', error)
    return NextResponse.json(
      { error: 'Erro ao criar link' },
      { status: 500 }
    )
  }
}

