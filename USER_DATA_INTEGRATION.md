# Integração de Dados do Usuário no RAG

## 🎯 Objetivo

Permitir que a IA tenha acesso completo aos dados do usuário para fornecer respostas personalizadas e contextualizadas.

## ✅ Implementações Realizadas

### 1. Interface UserProfile Expandida

- **Antes**: Apenas 3 campos básicos (riskTolerance, financialKnowledgeLevel, ageGroup)
- **Agora**: Interface completa com:
  - Dados básicos do perfil (risco, conhecimento, idade, renda)
  - Metas financeiras ativas com valores e prazos
  - Contas conectadas com saldos e tipos
  - Preferências de moeda, idioma e notificações
  - Resumo de transações dos últimos 3 meses
  - Principais categorias de gastos com percentuais

### 2. Serviço de Busca de Dados do Usuário

- **Método**: `fetchUserData(userId: string)`
- **Funcionalidades**:
  - Busca dados completos do usuário no MongoDB
  - Calcula resumo de transações automaticamente
  - Mapeia dados para formato padronizado
  - Trata casos de usuário não encontrado

### 3. Cálculo Automático de Resumo Financeiro

- **Método**: `calculateTransactionSummary(transactions)`
- **Métricas calculadas**:
  - Renda total dos últimos 3 meses
  - Gastos totais por categoria
  - Saldo líquido (renda - gastos)
  - Top 5 categorias de gastos com percentuais
  - Tendência financeira (crescimento/declínio/estável)

### 4. Prompt do Sistema Personalizado

- **Antes**: Prompt genérico com dados básicos
- **Agora**: Prompt detalhado incluindo:
  - Perfil completo do usuário
  - Metas financeiras ativas
  - Contas conectadas e saldos
  - Situação financeira recente
  - Instruções específicas de personalização

### 5. APIs do Chat Atualizadas

- **Arquivos modificados**:
  - `apps/web/app/api/chat/route.ts`
  - `apps/web/app/api/chat/stream/route.ts`
- **Mudança**: Removido TODO, agora o ChatService busca dados automaticamente

## 🔄 Fluxo de Funcionamento

1. **Usuário envia mensagem** → API do chat
2. **API identifica usuário** → através da sessão autenticada
3. **ChatService.processMessage()** → é chamado com sessionId
4. **fetchUserData()** → busca dados completos do usuário no MongoDB
5. **calculateTransactionSummary()** → calcula métricas financeiras
6. **Prompt personalizado** → é construído com dados do usuário
7. **IA responde** → com contexto personalizado

## 📊 Dados Disponíveis para a IA

### Perfil Básico

- Tolerância a risco (conservative/moderate/aggressive)
- Nível de conhecimento financeiro (beginner/intermediate/advanced)
- Faixa etária (18-25, 26-35, 36-45, 46-55, 56-65, 65+)
- Faixa de renda (0-2k, 2k-5k, 5k-10k, 10k-20k, 20k+)

### Metas Financeiras

- Título e descrição da meta
- Valor atual vs. valor alvo
- Data limite
- Categoria (savings, investment, debt_payment, purchase, emergency_fund)
- Prioridade (low, medium, high)
- Status (active, completed, paused, cancelled)

### Contas Conectadas

- Instituição financeira
- Tipo de conta (checking, savings, credit_card, investment, loan)
- Saldo atual
- Status ativo/inativo
- Data da última sincronização

### Situação Financeira Recente

- Renda total dos últimos 3 meses
- Gastos totais por categoria
- Saldo líquido mensal
- Tendência financeira
- Top 5 categorias de gastos com percentuais

## 🎯 Benefícios da Implementação

### Para o Usuário

- **Respostas personalizadas** baseadas no perfil real
- **Recomendações específicas** considerando metas ativas
- **Análise contextualizada** dos padrões de gastos
- **Sugestões realistas** baseadas na renda e situação financeira

### Para a IA

- **Contexto completo** para tomada de decisões
- **Dados estruturados** para análises precisas
- **Histórico financeiro** para identificar tendências
- **Metas claras** para priorizar recomendações

## 🧪 Como Testar

1. **Execute o script de teste**:

   ```bash
   node test-user-data-integration.js
   ```

2. **Teste via interface web**:
   - Faça login com um usuário que tenha dados completos
   - Envie perguntas como:
     - "Quais investimentos você recomenda para mim?"
     - "Como posso alcançar minhas metas financeiras?"
     - "Onde posso reduzir meus gastos?"

3. **Verifique as respostas**:
   - Devem mencionar dados específicos do usuário
   - Devem considerar metas financeiras ativas
   - Devem analisar padrões de gastos
   - Devem adaptar nível técnico ao conhecimento do usuário

## 🔧 Configuração Necessária

### Variáveis de Ambiente

- `OPENAI_API_KEY`: Chave da API OpenAI
- `MONGODB_URI`: String de conexão com MongoDB

### Dependências

- `@financial-ai/database`: Pacote de banco de dados
- `mongoose`: ODM para MongoDB
- `next-auth`: Autenticação

## 📝 Próximos Passos Sugeridos

1. **Cache de dados do usuário** para melhorar performance
2. **Atualização em tempo real** quando dados mudam
3. **Análise de tendências** mais sofisticada
4. **Alertas personalizados** baseados no perfil
5. **Recomendações proativas** baseadas em padrões identificados
