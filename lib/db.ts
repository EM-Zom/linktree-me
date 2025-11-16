import { Pool, QueryResult } from 'pg'

export interface Link {
  id: string
  title: string
  url: string
  editable: boolean
  category?: string
}

// Configuração da conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://linktree:EnioMz1993@145.223.94.223:54322/linktree',
  ssl: false, // Ajuste para true se necessário
})

// Inicializar o banco de dados (criar tabela se não existir)
export async function initializeDatabase() {
  try {
    const client = await pool.connect()
    
    // Criar tabela de links
    await client.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        editable BOOLEAN DEFAULT true,
        category VARCHAR(50) DEFAULT 'normal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Adicionar coluna category se não existir (para migração)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
          WHERE table_name='links' AND column_name='category') THEN
          ALTER TABLE links ADD COLUMN category VARCHAR(50) DEFAULT 'normal';
        END IF;
      END $$;
    `)
    
    // Criar tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Criar índices para melhor performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_links_title ON links(title);
      CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `)
    
    client.release()
    console.log('✅ Banco de dados inicializado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
    throw error
  }
}

export async function getAllLinks(category?: string): Promise<Link[]> {
  try {
    let query = 'SELECT id::text, title, url, editable, COALESCE(category, \'normal\') as category FROM links'
    const params: any[] = []
    
    if (category) {
      query += ' WHERE COALESCE(category, \'normal\') = $1'
      params.push(category)
    }
    
    query += ' ORDER BY title ASC'
    
    const result: QueryResult = await pool.query(query, params)
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      editable: row.editable,
      category: row.category || 'normal',
    }))
  } catch (error) {
    console.error('Erro ao buscar links:', error)
    throw error
  }
}

export async function getLinkById(id: string): Promise<Link | null> {
  try {
    const result: QueryResult = await pool.query(
      'SELECT id::text, title, url, editable, COALESCE(category, \'normal\') as category FROM links WHERE id = $1',
      [parseInt(id)]
    )
    if (result.rows.length === 0) {
      return null
    }
    const row = result.rows[0]
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      editable: row.editable,
      category: row.category || 'normal',
    }
  } catch (error) {
    console.error('Erro ao buscar link por ID:', error)
    throw error
  }
}

export async function createLink(link: Omit<Link, 'id'>): Promise<Link> {
  try {
    const result: QueryResult = await pool.query(
      'INSERT INTO links (title, url, editable, category) VALUES ($1, $2, $3, $4) RETURNING id::text, title, url, editable, COALESCE(category, \'normal\') as category',
      [link.title, link.url, link.editable ?? true, link.category || 'normal']
    )
    return {
      ...result.rows[0],
      category: result.rows[0].category || 'normal',
    }
  } catch (error) {
    console.error('Erro ao criar link:', error)
    throw error
  }
}

export async function updateLink(id: string, updates: Partial<Omit<Link, 'id'>>): Promise<Link | null> {
  try {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount}`)
      values.push(updates.title)
      paramCount++
    }
    if (updates.url !== undefined) {
      fields.push(`url = $${paramCount}`)
      values.push(updates.url)
      paramCount++
    }
    if (updates.editable !== undefined) {
      fields.push(`editable = $${paramCount}`)
      values.push(updates.editable)
      paramCount++
    }
    if (updates.category !== undefined) {
      fields.push(`category = $${paramCount}`)
      values.push(updates.category)
      paramCount++
    }

    if (fields.length === 0) {
      return await getLinkById(id)
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(parseInt(id)) // Converter string para número

    const result: QueryResult = await pool.query(
      `UPDATE links SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id::text, title, url, editable, COALESCE(category, 'normal') as category`,
      values
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Erro ao atualizar link:', error)
    throw error
  }
}

export async function deleteLink(id: string): Promise<boolean> {
  try {
    const result: QueryResult = await pool.query(
      'DELETE FROM links WHERE id = $1',
      [parseInt(id)]
    )
    return result.rowCount !== null && result.rowCount > 0
  } catch (error) {
    console.error('Erro ao deletar link:', error)
    throw error
  }
}

// Funções de autenticação
export interface User {
  id: number
  username: string
  is_admin: boolean
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const result: QueryResult = await pool.query(
      'SELECT id, username, is_admin FROM users WHERE username = $1',
      [username]
    )
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    throw error
  }
}

export async function getUserWithPassword(username: string): Promise<{ id: number; username: string; password_hash: string; is_admin: boolean } | null> {
  try {
    const result: QueryResult = await pool.query(
      'SELECT id, username, password_hash, is_admin FROM users WHERE username = $1',
      [username]
    )
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  } catch (error) {
    console.error('Erro ao buscar usuário com senha:', error)
    throw error
  }
}

export async function createUser(username: string, passwordHash: string, isAdmin: boolean = false): Promise<User> {
  try {
    const result: QueryResult = await pool.query(
      'INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING id, username, is_admin',
      [username, passwordHash, isAdmin]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}

// Fechar conexão ao encerrar
process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await pool.end()
  process.exit(0)
})
