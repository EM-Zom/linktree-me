# Configuração do Banco de Dados PostgreSQL

## Conexão Configurada

O projeto está configurado para usar PostgreSQL com a seguinte conexão:

```
postgresql://linktree:EnioMz1993@145.223.94.223:54322/linktree
```

## Estrutura da Tabela

A tabela `links` é criada automaticamente na primeira requisição com a seguinte estrutura:

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  editable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Índices Criados

Para melhor performance nas buscas, os seguintes índices são criados:

- `idx_links_title` - Índice no campo title
- `idx_links_url` - Índice no campo url

## Funcionalidades

- ✅ Criação automática da tabela na primeira requisição
- ✅ Pool de conexões para melhor performance
- ✅ Tratamento de erros robusto
- ✅ Fechamento adequado de conexões
- ✅ Suporte a operações CRUD completas

## Variáveis de Ambiente

A conexão está configurada no arquivo `.env.local`:

```
DATABASE_URL=postgresql://linktree:EnioMz1993@145.223.94.223:54322/linktree
```

## Notas

- A tabela é criada automaticamente na primeira requisição à API
- Os dados são persistidos permanentemente no banco
- O sistema usa connection pooling para otimizar performance
- Todas as operações são assíncronas e tratam erros adequadamente

