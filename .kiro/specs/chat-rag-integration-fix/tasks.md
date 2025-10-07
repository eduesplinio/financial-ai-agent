# Plano de Implementação - Correção Chat RAG

- [x] 1. Refatorar ChatRAGService para usar dados do banco
  - Remover array `financialKnowledge` hardcoded do método `getDocumentContext()`
  - Implementar busca real em knowledge_documents usando `VectorSearchService.semanticSearch()`
  - Integrar com `RAGService.hybridFinancialSearch()` para busca combinada
  - _Requirements: 1, 2, 3, 11_

- [x] 2. Atualizar método processMessage para usar RAGService
  - Substituir lógica atual por chamada a `RAGService.hybridFinancialSearch()`
  - Passar parâmetros corretos: `message`, `userId`, `options`
  - Tratar resultados retornados (documents + transactions)
  - _Requirements: 2, 3_

- [x] 3. Refatorar buildContext para usar TODOS os dados das collections
  - Remover lógica de keyword matching manual
  - Usar documentos COMPLETOS retornados pelo VectorSearchService (não apenas title/content)
  - Formatar contexto com TODOS os campos: documents.title, documents.content, documents.source, documents.category, documents.metadata
  - Incluir transações COMPLETAS: transaction.description, transaction.amount, transaction.date, transaction.category, transaction.merchant, transaction.accountName, transaction.source
  - Garantir que o contexto inclui informações ricas para o LLM responder adequadamente
  - _Requirements: 1, 2, 11_

- [x] 4. Atualizar buildSources para incluir fontes completas
  - Extrair TODOS os campos relevantes de cada documento: source URL, title, category, metadata
  - Incluir informações completas das transações: contagem, categorias, valores totais
  - Manter link para /transactions com contexto adicional
  - Garantir que as fontes mostram de onde vieram os dados (collection + campos específicos)
  - _Requirements: 5_

- [x] 5. Implementar tratamento de erros adequado
  - Try-catch ao redor de `RAGService.hybridFinancialSearch()`
  - Retornar mensagem apropriada se não houver resultados
  - Logar erros sem expor detalhes ao usuário
  - Não usar fallback para respostas genéricas do LLM
  - _Requirements: 6_

- [x] 6. Verificar e executar script de seed
  - Executar `packages/database/scripts/populate-knowledge-documents.ts`
  - Verificar se documentos foram inseridos na collection `knowledgedocuments`
  - Confirmar que embeddings foram gerados corretamente
  - _Requirements: 12_

- [x] 7. Testar integração end-to-end
  - Testar pergunta sobre conceitos financeiros (ex: "O que é Tesouro Direto?")
  - Testar pergunta sobre transações (ex: "Quanto gastei em restaurantes?")
  - Testar pergunta híbrida (ex: "Como investir considerando meus gastos?")
  - Verificar que fontes são retornadas corretamente
  - _Requirements: 1, 2, 5_

- [x] 8. Validar que não há mais código hardcoded
  - Buscar por arrays hardcoded no código
  - Confirmar que todas as respostas vêm do banco
  - Verificar logs para garantir que VectorSearchService está sendo usado
  - _Requirements: 11_
