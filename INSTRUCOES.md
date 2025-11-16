# Instruções de Uso

## Como Ativar o Modo Administrador

Para acessar o painel administrativo, você precisa ativar o modo administrador. Siga estes passos:

1. Abra o site no navegador
2. Abra o Console do Desenvolvedor (F12 ou Cmd+Option+I no Mac)
3. Na aba Console, digite:
```javascript
localStorage.setItem('isAdmin', 'true')
```
4. Pressione Enter
5. Recarregue a página (F5 ou Cmd+R)

Agora você verá o ícone de configurações (⚙️) no canto superior direito do header, que permite acessar o painel administrativo.

## Funcionalidades do Painel Administrativo

- **Gerenciar Permissões**: Defina quais links podem ser editados por usuários não-administradores
- **Bloquear/Desbloquear**: Clique no ícone de cadeado para alternar entre editável e bloqueado
- **Salvar Alterações**: Clique em "Salvar" para aplicar as mudanças

## Estrutura das Abas

### Aba "Links"
- Visualiza todos os links compartilhados
- Clique em um link para abri-lo em nova aba
- Links bloqueados mostram um ícone de cadeado

### Aba "Adicionar"
- Adicione novos links
- Edite links existentes (quando permitido)
- Validação automática de URLs

## Notas Importantes

- Os dados são armazenados em memória durante o desenvolvimento
- Ao reiniciar o servidor, os dados serão resetados
- Em produção, configure um banco de dados real para persistência

