#!/bin/bash

# Script simplificado para upload no GitHub
# Execute: ./upload-to-github.sh SEU_USERNAME_GITHUB

REPO_NAME="linktree-me"

if [ -z "$1" ]; then
    echo "❌ Erro: Username do GitHub não fornecido"
    echo ""
    echo "Uso: ./upload-to-github.sh SEU_USERNAME_GITHUB"
    echo ""
    echo "Exemplo: ./upload-to-github.sh eniomz"
    exit 1
fi

GITHUB_USER="$1"

echo "🚀 Configurando repositório GitHub: ${REPO_NAME}"
echo "👤 Username: ${GITHUB_USER}"
echo ""

# Remover remote existente se houver
if git remote get-url origin &>/dev/null; then
    echo "🔄 Removendo remote existente..."
    git remote remove origin
fi

# Adicionar novo remote
echo "📦 Adicionando remote..."
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "✅ Remote configurado!"
echo ""

# Tentar criar via GitHub CLI se disponível
if command -v gh &> /dev/null && gh auth status &> /dev/null 2>&1; then
    echo "🔨 Tentando criar repositório via GitHub CLI..."
    if gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push 2>/dev/null; then
        echo ""
        echo "🎉 Sucesso! Repositório criado e código enviado!"
        echo "📍 Acesse: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        exit 0
    fi
fi

echo "📝 Próximos passos:"
echo ""
echo "1. Crie o repositório no GitHub:"
echo "   👉 https://github.com/new"
echo "   - Nome: ${REPO_NAME}"
echo "   - NÃO marque 'Add a README file'"
echo "   - Clique em 'Create repository'"
echo ""
echo "2. Execute o push:"
echo "   git push -u origin main"
echo ""

