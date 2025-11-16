import { NextRequest, NextResponse } from 'next/server'
import { updateLink, deleteLink } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedLink = updateLink(params.id, {
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
    const success = deleteLink(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Link não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar link' },
      { status: 500 }
    )
  }
}

