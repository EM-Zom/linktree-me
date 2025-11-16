import { NextRequest, NextResponse } from 'next/server'
import { updateLink, deleteLink, initializeDatabase } from '@/lib/db'

// Inicializar banco na primeira requisição
let dbInitialized = false

async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDatabaseInitialized()
    const body = await request.json()
    const updatedLink = await updateLink(params.id, {
      title: body.title,
      url: body.url,
      editable: body.editable,
    })

    if (!updatedLink) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Erro ao atualizar link:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar link' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDatabaseInitialized()
    const success = await deleteLink(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar link:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar link' },
      { status: 500 }
    )
  }
}

