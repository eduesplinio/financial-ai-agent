# Documento de Requisitos - Correção da Integração Chat RAG

## Introdução

Este documento define os requisitos para corrigir a implementação atual do chat integrado com RAG. A implementação atual possui limitações significativas: utiliza apenas busca de transações, não integra adequadamente com a base de conhecimento (knowledge_documents), possui conhecimento financeiro hardcoded ao invés de usar o Atlas Vector Search, e não aproveita toda a infraestrutura RAG já implementada nos pacotes `@/ai` e `@/database`.

O objetivo é refatorar o `chat-rag-service.ts` para utilizar corretamente:

- **Atlas Vector Search** para busca semântica em knowledge_documents
- **Transaction Vector Search** para busca de transações (já implementado)
- **Busca híbrida** combinando ambas as fontes de dados
- **RAGService** do pacote `@/ai` para orquestração adequada
- **Arquitetura modular** seguindo os padrões já estabelecidos no projeto

## Requisitos

### Requisito 1

**História do Usuário:** Como usuário, quero que o chat responda perguntas sobre educação financeira usando EXCLUSIVAMENTE a base de conhecimento real armazenada no MongoDB, para que eu receba informações atualizadas e confiáveis baseadas apenas em dados do banco.

#### Critérios de Aceitação

1. QUANDO o usuário faz uma pergunta sobre conceitos financeiros (ex: "O que é Tesouro Direto?") ENTÃO o sistema DEVE buscar documentos relevantes na collection `knowledgedocuments` usando Atlas Vector Search para busca semântica
2. QUANDO documentos relevantes são encontrados via vector search ENTÃO o sistema DEVE buscar os documentos completos na collection usando queries normais do MongoDB para obter todos os campos (title, content, source, category, metadata, etc)
3. QUANDO não há documentos relevantes (score < 0.7) ENTÃO o sistema DEVE responder "Não encontrei informações específicas sobre este tema na base de conhecimento. Por favor, reformule sua pergunta ou consulte outras fontes."
4. QUANDO múltiplos documentos são relevantes ENTÃO o sistema DEVE priorizar por score de similaridade e incluir os top 5 documentos completos
5. SE a base de conhecimento estiver vazia ENTÃO o sistema DEVE retornar erro informando que a base precisa ser populada antes de usar o chat
6. O sistema NÃO DEVE usar conhecimento hardcoded ou respostas genéricas do LLM sem contexto do banco
7. O Atlas Vector Search é usado APENAS para encontrar documentos semanticamente relevantes, mas os dados completos vêm de queries normais na collection

### Requisito 2

**História do Usuário:** Como usuário, quero que o chat combine informações da base de conhecimento com análise das minhas transações, para que eu receba respostas contextualizadas que relacionem teoria financeira com minha realidade.

#### Critérios de Aceitação

1. QUANDO o usuário faz uma pergunta que envolve tanto conceitos quanto dados pessoais (ex: "Como posso investir melhor considerando meus gastos?") ENTÃO o sistema DEVE realizar busca híbrida em knowledge_documents E transactions
2. QUANDO busca em transactions é feita ENTÃO o sistema DEVE usar Atlas Vector Search para encontrar transações semanticamente relevantes E buscar os dados completos das transações na collection (description, amount, date, category, merchant, accountName, etc)
3. QUANDO ambas as fontes retornam resultados ENTÃO o sistema DEVE combinar os contextos de forma coerente na resposta
4. QUANDO a pergunta é apenas sobre transações ENTÃO o sistema DEVE focar na busca de transactions
5. QUANDO a pergunta é apenas sobre conceitos ENTÃO o sistema DEVE focar na busca de knowledge_documents
6. SE a classificação de intenção falhar ENTÃO o sistema DEVE realizar busca híbrida por padrão
7. O Atlas Vector Search é usado para RANKING semântico, mas todos os campos das collections são consultados e disponibilizados

### Requisito 3

**História do Usuário:** Como desenvolvedor, quero que o chat-rag-service utilize o RAGService e VectorSearchService já implementados, para que não haja duplicação de código e a manutenção seja simplificada.

#### Critérios de Aceitação

1. QUANDO o chat precisa buscar documentos ENTÃO o sistema DEVE usar `VectorSearchService.semanticSearch()` do pacote `@/database`
2. QUANDO o chat precisa buscar transações ENTÃO o sistema DEVE usar `TransactionVectorSearchService.searchTransactions()` do pacote `@/database`
3. QUANDO o chat precisa orquestrar busca híbrida ENTÃO o sistema DEVE usar `RAGService.hybridFinancialSearch()` do pacote `@/ai`
4. QUANDO embeddings precisam ser gerados ENTÃO o sistema DEVE usar `OpenAIEmbeddingProvider` do pacote `@/ai`
5. SE houver necessidade de funcionalidades adicionais ENTÃO elas DEVEM ser implementadas nos serviços base, não no chat-rag-service

### Requisito 4

**História do Usuário:** Como usuário, quero que o chat classifique automaticamente minha intenção, para que a busca seja otimizada e eu receba respostas mais relevantes rapidamente.

#### Critérios de Aceitação

1. QUANDO o usuário envia uma mensagem ENTÃO o sistema DEVE classificar a intenção como: `transaction_query`, `financial_education`, `investment_advice`, `spending_analysis`, ou `general`
2. QUANDO a intenção é `transaction_query` ENTÃO o sistema DEVE priorizar busca em transactions com limite de 20 resultados
3. QUANDO a intenção é `financial_education` ENTÃO o sistema DEVE priorizar busca em knowledge_documents com limite de 5 documentos
4. QUANDO a intenção é `investment_advice` ou `spending_analysis` ENTÃO o sistema DEVE realizar busca híbrida
5. SE a classificação tiver baixa confiança (<0.6) ENTÃO o sistema DEVE realizar busca híbrida

### Requisito 5

**História do Usuário:** Como usuário, quero ver as fontes das informações fornecidas pelo chat, para que eu possa verificar a credibilidade e explorar mais sobre os tópicos.

#### Critérios de Aceitação

1. QUANDO a resposta usa knowledge_documents ENTÃO o sistema DEVE incluir título, categoria e source URL de cada documento
2. QUANDO a resposta usa transactions ENTÃO o sistema DEVE incluir contagem e link para a página de transações
3. QUANDO múltiplas fontes são usadas ENTÃO o sistema DEVE listar todas as fontes de forma organizada
4. QUANDO não há fontes ENTÃO o sistema DEVE indicar que a resposta é baseada em conhecimento geral do modelo
5. SE uma fonte não tiver URL ENTÃO o sistema DEVE incluir apenas título e categoria

### Requisito 6

**História do Usuário:** Como desenvolvedor, quero que o sistema tenha tratamento robusto de erros mantendo a integridade dos dados do banco, para que falhas sejam tratadas adequadamente sem recorrer a dados externos ou hardcoded.

#### Critérios de Aceitação

1. QUANDO a busca em knowledge_documents falhar ENTÃO o sistema DEVE continuar com busca de transactions se a pergunta for sobre transações
2. QUANDO a busca em transactions falhar ENTÃO o sistema DEVE continuar com knowledge_documents se a pergunta for sobre conceitos
3. QUANDO ambas as buscas falharem ENTÃO o sistema DEVE retornar erro informando que não foi possível acessar os dados, SEM usar conhecimento do LLM como fallback
4. QUANDO o LLM falhar ENTÃO o sistema DEVE retornar mensagem de erro amigável
5. SE houver erro de autenticação ENTÃO o sistema DEVE retornar erro 401 sem expor detalhes internos
6. O sistema NÃO DEVE usar fallback para respostas genéricas - todas as respostas DEVEM ser baseadas em dados do banco

### Requisito 7

**História do Usuário:** Como administrador, quero logs detalhados das operações do chat RAG, para que eu possa monitorar performance e debugar problemas.

#### Critérios de Aceitação

1. QUANDO uma busca é realizada ENTÃO o sistema DEVE logar: tipo de busca, query, número de resultados, tempo de execução
2. QUANDO há erro ENTÃO o sistema DEVE logar: tipo de erro, stack trace, contexto da operação
3. QUANDO a resposta é gerada ENTÃO o sistema DEVE logar: número de tokens usados, fontes utilizadas, tempo total
4. QUANDO há fallback ENTÃO o sistema DEVE logar o motivo e qual estratégia foi usada
5. SE logs sensíveis forem necessários ENTÃO o sistema DEVE sanitizar informações pessoais

### Requisito 8

**História do Usuário:** Como usuário, quero que o chat mantenha contexto da conversa, para que eu possa fazer perguntas de follow-up sem repetir informações.

#### Critérios de Aceitação

1. QUANDO o usuário faz uma pergunta de follow-up ENTÃO o sistema DEVE considerar mensagens anteriores da sessão
2. QUANDO há referências pronominais (ex: "e quanto a isso?") ENTÃO o sistema DEVE resolver usando contexto anterior
3. QUANDO a conversa muda de tópico ENTÃO o sistema DEVE atualizar o contexto adequadamente
4. QUANDO a sessão expira ENTÃO o sistema DEVE limpar o contexto e iniciar nova conversa
5. SE o contexto ficar muito grande ENTÃO o sistema DEVE manter apenas as últimas 10 mensagens

### Requisito 9

**História do Usuário:** Como desenvolvedor, quero que o sistema seja testável, para que eu possa garantir qualidade e evitar regressões.

#### Critérios de Aceitação

1. QUANDO testes unitários são executados ENTÃO o sistema DEVE permitir mock de VectorSearchService e TransactionVectorSearchService
2. QUANDO testes de integração são executados ENTÃO o sistema DEVE funcionar com banco de dados de teste
3. QUANDO testes end-to-end são executados ENTÃO o sistema DEVE simular fluxo completo de chat
4. QUANDO há mudanças no código ENTÃO os testes DEVEM detectar breaking changes
5. SE novos recursos forem adicionados ENTÃO testes correspondentes DEVEM ser criados

### Requisito 10

**História do Usuário:** Como usuário, quero que o chat seja performático, para que eu receba respostas rapidamente sem esperas longas.

#### Critérios de Aceitação

1. QUANDO uma pergunta simples é feita ENTÃO a resposta DEVE começar a ser transmitida em menos de 2 segundos
2. QUANDO buscas vetoriais são realizadas ENTÃO elas DEVEM ser executadas em paralelo quando possível
3. QUANDO o LLM está gerando resposta ENTÃO o sistema DEVE fazer streaming dos chunks imediatamente
4. QUANDO há cache disponível ENTÃO o sistema DEVE utilizá-lo para embeddings de queries frequentes
5. SE a operação demorar mais de 30 segundos ENTÃO o sistema DEVE retornar timeout com mensagem apropriada

### Requisito 11

**História do Usuário:** Como desenvolvedor, quero remover completamente todo conhecimento financeiro hardcoded do sistema, para que todas as informações venham exclusivamente do banco de dados MongoDB.

#### Critérios de Aceitação

1. QUANDO o sistema é refatorado ENTÃO todo o array `financialKnowledge` hardcoded no método `getDocumentContext()` DEVE ser removido
2. QUANDO documentos de conhecimento são necessários ENTÃO o sistema DEVE SEMPRE buscar na collection `knowledgedocuments` via VectorSearchService
3. QUANDO não há dados no banco ENTÃO o sistema DEVE falhar gracefully informando que a base precisa ser populada
4. QUANDO há necessidade de conhecimento padrão ENTÃO ele DEVE ser inserido no banco via scripts de seed, NÃO hardcoded no código
5. SE houver outros locais com dados hardcoded ENTÃO eles também DEVEM ser removidos e migrados para o banco
6. O sistema DEVE validar na inicialização se a collection `knowledgedocuments` possui dados, caso contrário, logar warning

### Requisito 12

**História do Usuário:** Como administrador, quero scripts de seed para popular a base de conhecimento, para que o sistema tenha dados iniciais sem depender de código hardcoded.

#### Critérios de Aceitação

1. QUANDO o sistema é instalado ENTÃO DEVE existir um script `populate-knowledge-documents.ts` para inserir conhecimento financeiro básico
2. QUANDO o script é executado ENTÃO ele DEVE inserir documentos com embeddings já gerados na collection `knowledgedocuments`
3. QUANDO documentos já existem ENTÃO o script DEVE verificar e não duplicar
4. QUANDO novos documentos são adicionados ENTÃO eles DEVEM seguir o schema `IKnowledgeDocument` com todos os campos obrigatórios
5. SE o script falhar ENTÃO ele DEVE fornecer mensagens de erro claras e rollback se necessário
