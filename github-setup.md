# Configuração do Repositório GitHub

## Passos para conectar ao GitHub:

1. Crie o repositório no GitHub com o nome: `financial-ai-agent`

2. Execute os seguintes comandos no terminal:

```bash
# Adicionar o remote origin (substitua SEU_USERNAME pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USERNAME/financial-ai-agent.git

# Renomear a branch principal para main (se necessário)
git branch -M main

# Fazer o push inicial
git push -u origin main
```

## Alternativa com SSH (se você tem chave SSH configurada):

```bash
# Adicionar o remote origin com SSH
git remote add origin git@github.com:SEU_USERNAME/financial-ai-agent.git

# Fazer o push inicial
git push -u origin main
```

## Verificar o status atual:

```bash
# Ver o status do repositório
git status

# Ver os remotes configurados
git remote -v

# Ver o histórico de commits
git log --oneline
```

## Próximos passos após o push:

1. Configure branch protection rules
2. Adicione colaboradores (se necessário)
3. Configure GitHub Actions (opcional)
4. Adicione issues templates
5. Configure Dependabot para atualizações de dependências