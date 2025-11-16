# 🚀 Guia para Upload no GitHub

## Opção 1: Usando o Script Automático (Recomendado)

Se você souber seu username do GitHub, execute:

```bash
./upload-to-github.sh SEU_USERNAME_GITHUB
```

Exemplo:
```bash
./upload-to-github.sh eniomz
```

O script irá:
- Configurar o remote do GitHub
- Tentar criar o repositório automaticamente (se GitHub CLI estiver instalado)
- Fornecer instruções caso precise criar manualmente

## Opção 2: Manual (Passo a Passo)

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome do repositório**: `linktree-me`
3. **Descrição** (opcional): "Linktree para médicos emergencistas"
4. Escolha **Público** ou **Privado**
5. **NÃO marque** "Add a README file"
6. **NÃO marque** "Add .gitignore"
7. **NÃO marque** "Choose a license"
8. Clique em **"Create repository"**

### 2. Configurar Remote (se ainda não configurado)

```bash
git remote add origin https://github.com/SEU_USERNAME/linktree-me.git
```

Substitua `SEU_USERNAME` pelo seu username do GitHub.

### 3. Fazer Push

```bash
git push -u origin main
```

## Verificar Status

Para verificar se está tudo configurado:

```bash
git remote -v
```

Deve mostrar:
```
origin  https://github.com/SEU_USERNAME/linktree-me.git (fetch)
origin  https://github.com/SEU_USERNAME/linktree-me.git (push)
```

## Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USERNAME/linktree-me.git
```

### Erro: "repository not found"
- Verifique se o repositório foi criado no GitHub
- Verifique se o username está correto
- Verifique se você tem permissão para acessar o repositório

### Erro de autenticação
Se pedir usuário e senha:
- Use um **Personal Access Token** ao invés da senha
- Crie um token em: https://github.com/settings/tokens
- Selecione permissões: `repo`

## Status Atual

✅ Repositório Git inicializado
✅ Branch renomeada para `main`
✅ Todos os arquivos commitados
✅ Remote configurado (se você executou o script)

Próximo passo: Criar o repositório no GitHub e fazer push!

