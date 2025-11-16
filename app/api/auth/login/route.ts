import { NextRequest, NextResponse } from 'next/server'
import { getUserWithPassword, initializeDatabase } from '@/lib/db'
import bcrypt from 'bcryptjs'

let dbInitialized = false

async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseInitialized()
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await getUserWithPassword(username)

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Retornar informações do usuário (sem a senha)
    return NextResponse.json({
      id: user.id,
      username: user.username,
      is_admin: user.is_admin,
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}

