# Links Emergência - Plataforma para Médicos Emergencistas

Uma plataforma estilo Linktree desenvolvida especificamente para médicos emergencistas, com foco em design mobile-first e tema de emergência.

## Características

- 📱 **Design Mobile-First**: Interface otimizada para dispositivos móveis
- 🚨 **Tema de Emergência**: Cores e design inspirados em emergências médicas
- 🔗 **Gerenciamento de Links**: Adicione, edite e organize links importantes
- 👨‍⚕️ **Painel Administrativo**: Controle quais links podem ser editados por usuários
- 🔒 **Sistema de Permissões**: Links podem ser bloqueados para edição por usuários não-administradores

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons

## Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Produção

```bash
npm run build
npm start
```

## Funcionalidades

### Aba Principal (Links)
- Visualização de todos os links compartilhados
- Acesso rápido aos links com um clique
- Indicadores visuais para links bloqueados

### Aba Adicionar/Editar
- Formulário para adicionar novos links
- Edição de links existentes (quando permitido)
- Validação de URLs

### Painel Administrativo
- Acesso apenas para administradores
- Controle de permissões de edição por link
- Interface intuitiva para gerenciar bloqueios

## Modo Administrador

Para ativar o modo administrador, execute no console do navegador:

```javascript
localStorage.setItem('isAdmin', 'true')
```

Recarregue a página para ver o botão de configurações no header.

## Estrutura do Projeto

```
linktree/
├── app/
│   ├── api/
│   │   └── links/
│   │       ├── route.ts          # GET, POST /api/links
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/links/:id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Página principal
├── components/
│   ├── AdminPanel.tsx            # Painel administrativo
│   ├── LinkCard.tsx              # Card de link
│   └── LinkForm.tsx              # Formulário de link
└── ...
```

## Notas

- O banco de dados atual é simulado em memória. Em produção, substitua por um banco de dados real (PostgreSQL, MongoDB, etc.)
- O sistema de autenticação é simplificado. Em produção, implemente autenticação adequada (NextAuth.js, Auth0, etc.)
- Os dados são perdidos ao reiniciar o servidor. Configure persistência adequada para produção.

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

