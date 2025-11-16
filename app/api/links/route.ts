import { NextRequest, NextResponse } from 'next/server'
import { getAllLinks, createLink } from '@/lib/db'

export async function GET() {
  const links = getAllLinks()
  return NextResponse.json(links)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newLink = createLink({
      title: body.title,
      url: body.url,
      editable: body.editable ?? true,
    })
    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar link' },
      { status: 500 }
    )
  }
}

