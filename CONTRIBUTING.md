# Contribuindo para o Financial AI Agent

Obrigado por considerar contribuir para o Financial AI Agent! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/financial-ai-agent.git
cd financial-ai-agent
```

### 2. Configuração do Ambiente
```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local

# Iniciar serviços Docker
docker-compose up -d

# Executar setup
./scripts/setup-dev.sh
```

### 3. Criar Branch
```bash
# Criar branch para sua feature/fix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-fix
```

### 4. Desenvolvimento
- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Mantenha commits pequenos e focados
- Use mensagens de commit convencionais

### 5. Testes
```bash
# Executar todos os testes
npm run test

# Executar linting
npm run lint

# Verificar tipos
npm run type-check
```

### 6. Commit e Push
```bash
# Adicionar mudanças
git add .

# Commit com mensagem convencional
git commit -m "feat: adicionar nova funcionalidade"

# Push para seu fork
git push origin feature/nome-da-feature
```

### 7. Pull Request
- Abra um PR do seu fork para o repositório principal
- Preencha o template de PR
- Aguarde review e feedback

## 📝 Padrões de Código

### Mensagens de Commit
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação, sem mudança de lógica
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` tarefas de manutenção

### Código TypeScript
- Use TypeScript rigoroso
- Prefira interfaces a types quando possível
- Documente funções complexas
- Use nomes descritivos para variáveis e funções

### React/Next.js
- Use componentes funcionais com hooks
- Prefira Server Components quando possível
- Use Tailwind CSS para styling
- Mantenha componentes pequenos e focados

### Testes
- Escreva testes para toda nova funcionalidade
- Use Testing Library para testes de componentes
- Mantenha cobertura acima de 80%
- Teste casos de erro e edge cases

## 🏗️ Estrutura do Projeto

```
financial-ai-agent/
├── apps/web/           # Frontend Next.js
├── packages/
│   ├── shared/         # Tipos e utilitários
│   ├── database/       # Modelos de dados
│   ├── ai/            # Sistema RAG
│   └── open-finance/  # Integração bancária
└── docs/              # Documentação
```

## 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado
2. Use o template de issue para bugs
3. Inclua informações do ambiente
4. Forneça passos para reproduzir
5. Adicione screenshots se relevante

## 💡 Sugerindo Features

1. Verifique se a feature já foi sugerida
2. Use o template de issue para features
3. Explique o problema que resolve
4. Descreva a solução proposta
5. Considere alternativas

## 🔒 Segurança

Para reportar vulnerabilidades de segurança:
- NÃO abra issues públicas
- Envie email para: security@financial-ai.com
- Inclua detalhes da vulnerabilidade
- Aguarde resposta antes de divulgar

## 📋 Checklist para PRs

- [ ] Código segue os padrões do projeto
- [ ] Testes passam localmente
- [ ] Novos testes adicionados
- [ ] Documentação atualizada
- [ ] Sem warnings de linting
- [ ] PR template preenchido

## 🤝 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite feedback construtivo
- Foque no que é melhor para a comunidade
- Mantenha discussões técnicas e profissionais

## 📞 Suporte

- GitHub Issues: Para bugs e features
- Discussions: Para perguntas gerais
- Email: support@financial-ai.com

---

Obrigado por contribuir! 🚀