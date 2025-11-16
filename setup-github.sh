#!/bin/bash

REPO_NAME="linktree-me"

echo "🚀 Configurando repositório GitHub: ${REPO_NAME}"
echo ""

# Tentar descobrir o username do GitHub
GITHUB_USER=""
if command -v gh &> /dev/null; then
    echo "📦 GitHub CLI encontrado, verificando autenticação..."
    if gh auth status &> /dev/null; then
        GITHUB_USER=$(gh api user --jq .login 2>/dev/null)
        if [ ! -z "$GITHUB_USER" ]; then
            echo "✅ Usuário GitHub detectado: ${GITHUB_USER}"
        fi
    fi
fi

# Se não encontrou, pedir ao usuário
if [ -z "$GITHUB_USER" ]; then
    echo "❓ Não foi possível detectar seu username do GitHub automaticamente."
    echo ""
    read -p "Digite seu username do GitHub: " GITHUB_USER
fi

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Username não fornecido. Abortando."
    exit 1
fi

echo ""
echo "📦 Configurando remote..."
# Remover remote existente se houver
git remote remove origin 2>/dev/null

# Adicionar novo remote
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "✅ Remote configurado: https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo ""

# Tentar criar o repositório via GitHub CLI se disponível
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    echo "🔨 Tentando criar repositório no GitHub..."
    if gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push 2>/dev/null; then
        echo ""
        echo "🎉 Sucesso! Repositório criado e código enviado!"
        echo "📍 Acesse: https://github.com/${GITHUB_USER}/${REPO_NAME}"
        exit 0
    else
        echo "⚠️  Não foi possível criar automaticamente. Siga os passos abaixo:"
    fi
fi

echo ""
echo "📝 Próximos passos MANUAIS:"
echo ""
echo "1. Crie o repositório no GitHub:"
echo "   👉 https://github.com/new"
echo "   - Nome: ${REPO_NAME}"
echo "   - Visibilidade: Público ou Privado"
echo "   - NÃO marque 'Add a README file'"
echo "   - Clique em 'Create repository'"
echo ""
echo "2. Após criar, execute:"
echo "   git push -u origin main"
echo ""
echo "Ou execute este script novamente após criar o repositório."

