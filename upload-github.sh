#!/bin/bash

# Script para fazer upload do projeto para o GitHub

REPO_NAME="linktree-me"
GITHUB_USER=$(git config user.name 2>/dev/null || echo "")

echo "🚀 Preparando upload para GitHub..."
echo ""

# Verificar se já existe remote
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' já existe. Removendo..."
    git remote remove origin
fi

# Adicionar remote
echo "📦 Adicionando remote GitHub..."
git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Crie o repositório '${REPO_NAME}' no GitHub:"
echo "   - Acesse: https://github.com/new"
echo "   - Nome do repositório: ${REPO_NAME}"
echo "   - NÃO inicialize com README, .gitignore ou licença"
echo ""
echo "2. Execute o comando para fazer push:"
echo "   git push -u origin main"
echo ""
echo "Ou execute este script novamente após criar o repositório."

