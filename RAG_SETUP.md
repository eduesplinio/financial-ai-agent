# 🧠 Configuração RAG - Retrieval-Augmented Generation

## 📋 Visão Geral

O sistema RAG (Retrieval-Augmented Generation) foi implementado para tornar o chat um **especialista financeiro** que responde com base em documentos de conhecimento específicos sobre finanças brasileiras.

## 🏗️ Arquitetura RAG

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Usuário       │───▶│  Conversational  │───▶│   RAG Service   │
│   (Pergunta)    │    │     Agent        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  LLM Service     │    │ Vector Search   │
                       │  (GPT-4)         │    │ (MongoDB Atlas) │
                       └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Response       │    │ Knowledge       │
                       │  Generator      │    │ Documents       │
                       └──────────────────┘    └─────────────────┘
```

## 🚀 Configuração Inicial

### 1. Configurar Base de Conhecimento

Execute o script para popular a base de conhecimento com documentos financeiros:

```bash
pnpm setup:rag
```

Este script irá:

- ✅ Conectar ao MongoDB Atlas
- ✅ Criar índice de busca vetorial
- ✅ Popular documentos com embeddings reais
- ✅ Verificar configuração

### 2. Documentos de Conhecimento Incluídos

O sistema inclui documentos especializados sobre:

- **📈 Investimentos**: Bolsa de valores, Tesouro Direto, Fundos
- **💰 Planejamento Financeiro**: Orçamento, metas, reserva de emergência
- **📋 Impostos**: Declaração de renda, deduções, prazos
- **🏦 Produtos Financeiros**: CDB, LCI, LCA, Fundos Imobiliários
- **🎯 Perfis de Investidor**: Conservador, moderado, arrojado

## 🔍 Como Funciona

### 1. Busca Semântica

- Usuário faz pergunta sobre finanças
- Sistema gera embedding da pergunta
- Busca documentos similares no MongoDB Atlas Vector Search
- Retorna documentos mais relevantes

### 2. Geração de Resposta

- Combina documentos encontrados com contexto da conversa
- Usa GPT-4 com prompt especializado em finanças
- Gera resposta com citações das fontes
- Calcula confiança baseada na relevância

### 3. Fallback Inteligente

- Se não encontrar documentos relevantes, usa dados mock
- Se busca vetorial falhar, usa OpenAI diretamente
- Sempre mantém especialização financeira

## 📊 Exemplos de Uso

### Perguntas que o RAG responde bem:

```
❓ "Como investir na bolsa de valores?"
❓ "Qual a diferença entre Tesouro Selic e IPCA+?"
❓ "Como declarar imposto de renda?"
❓ "O que são fundos de investimento?"
❓ "Como fazer planejamento financeiro?"
```

### Respostas incluem:

- ✅ **Informações precisas** baseadas em documentos
- ✅ **Citações das fontes** (Banco Central, CVM, etc.)
- ✅ **Explicações didáticas** em português brasileiro
- ✅ **Riscos e considerações** importantes
- ✅ **Links para fontes oficiais**

## 🛠️ Manutenção

### Adicionar Novos Documentos

1. Edite `packages/ai/src/scripts/populate-knowledge-with-embeddings.ts`
2. Adicione novos documentos na array `documents`
3. Execute `pnpm setup:rag` novamente

### Verificar Status

```bash
# Verificar documentos na base
pnpm run test:mongodb-complete

# Verificar busca vetorial
pnpm run test:vector-search
```

## 🔧 Troubleshooting

### Problema: "No vector search results"

**Solução**: Execute `pnpm setup:rag` para popular a base

### Problema: "Vector search failed"

**Solução**: Verifique conexão MongoDB Atlas e índice vetorial

### Problema: Respostas genéricas

**Solução**: Verifique se documentos têm embeddings válidos

## 📈 Métricas de Qualidade

O sistema monitora:

- **Cobertura de embeddings**: % de documentos com embeddings
- **Relevância média**: Score de similaridade das buscas
- **Taxa de citação**: % de respostas com fontes
- **Confiança**: Score geral de qualidade da resposta

## 🎯 Benefícios

- ✅ **Especialização**: Respostas focadas em finanças brasileiras
- ✅ **Precisão**: Baseadas em documentos oficiais
- ✅ **Transparência**: Sempre cita fontes
- ✅ **Atualização**: Fácil adicionar novos conhecimentos
- ✅ **Robustez**: Fallbacks para garantir funcionamento

---

**🎉 Agora o chat é um verdadeiro especialista financeiro!**

Execute `pnpm setup:rag` e teste perguntas sobre investimentos, planejamento financeiro e economia brasileira.
