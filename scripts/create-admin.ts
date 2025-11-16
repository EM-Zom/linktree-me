import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://linktree:EnioMz1993@145.223.94.223:54322/linktree',
  ssl: false,
})

async function createAdmin() {
  try {
    const client = await pool.connect()
    
    // Criar tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const username = 'eniomz'
    const password = '@EnioMz1993'
    
    // Verificar se usuário já existe
    const existingUser = await client.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Usuário admin já existe. Atualizando senha...')
      const passwordHash = await bcrypt.hash(password, 10)
      await client.query(
        'UPDATE users SET password_hash = $1, is_admin = true WHERE username = $2',
        [passwordHash, username]
      )
      console.log('✅ Senha do admin atualizada com sucesso!')
    } else {
      // Criar hash da senha
      const passwordHash = await bcrypt.hash(password, 10)
      
      // Inserir usuário admin
      await client.query(
        'INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3)',
        [username, passwordHash, true]
      )
      console.log('✅ Usuário admin criado com sucesso!')
    }

    console.log(`\n📋 Credenciais:`)
    console.log(`   Username: ${username}`)
    console.log(`   Senha: ${password}`)
    console.log(`   Admin: Sim\n`)

    client.release()
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
    await pool.end()
    process.exit(1)
  }
}

createAdmin()

