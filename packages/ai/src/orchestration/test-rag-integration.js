// Teste da integração RAG com orquestrador
async function testRAGIntegration() {
  console.log('🔍 Testando Integração RAG + Orquestrador\n');

  // Mock simples do sistema RAG
  const mockRAGService = {
    async semanticSearch(query, filters) {
      console.log(`   RAG buscando por: "${query}"`);
      console.log(`   Filtros aplicados:`, filters);

      // Simular resultados baseados na query
      if (
        query.toLowerCase().includes('investimento') ||
        query.toLowerCase().includes('investir')
      ) {
        return [
          {
            document: {
              title: 'Guia de Investimentos para Iniciantes',
              content:
                'Os investimentos podem ser divididos em renda fixa e variável. Para iniciantes, recomenda-se começar com renda fixa.',
              source: 'CVM - Comissão de Valores Mobiliários',
              category: 'investimentos',
            },
            score: 0.92,
          },
          {
            document: {
              title: 'Perfil de Investidor',
              content:
                'Determine seu perfil: conservador, moderado ou arrojado antes de investir.',
              source: 'ANBIMA',
              category: 'perfil-risco',
            },
            score: 0.85,
          },
        ];
      }

      if (
        query.toLowerCase().includes('economia') ||
        query.toLowerCase().includes('poupança')
      ) {
        return [
          {
            document: {
              title: 'Como Fazer uma Reserva de Emergência',
              content:
                'A reserva de emergência deve ter de 6 a 12 meses de gastos mensais em investimentos líquidos.',
              source: 'Banco Central do Brasil',
              category: 'poupança',
            },
            score: 0.88,
          },
        ];
      }

      // Resultados gerais
      return [
        {
          document: {
            title: 'Educação Financeira Básica',
            content:
              'Entender conceitos básicos de finanças é fundamental para tomar boas decisões.',
            source: 'FEBRABAN',
            category: 'educacao',
          },
          score: 0.7,
        },
      ];
    },
  };

  // Classe simplificada para teste
  class SimpleRAGOrchestrator {
    constructor(ragService) {
      this.ragService = ragService;
    }

    async processFinancialQuery(userId, query) {
      console.log(`👤 Usuário ${userId} perguntou: "${query}"`);

      try {
        const results = await this.ragService.semanticSearch(query, {
          categories: ['investimentos', 'economia', 'financas'],
          limit: 5,
        });

        return {
          type: 'info',
          data: {
            message: 'Encontrei informações relevantes sobre sua consulta:',
            results: results.slice(0, 2), // Top 2 resultados
            query: query,
          },
          source: 'rag-system',
          confidence: results.length > 0 ? 0.9 : 0.3,
          resultCount: results.length,
        };
      } catch (error) {
        return {
          type: 'error',
          data: { message: 'Erro ao buscar informações.' },
          source: 'fallback',
          confidence: 0,
        };
      }
    }
  }

  // Executar testes
  const orchestrator = new SimpleRAGOrchestrator(mockRAGService);

  const testQueries = [
    'Como devo começar a investir?',
    'Qual é a melhor forma de economizar dinheiro?',
    'O que é renda fixa?',
    'Como definir metas financeiras?',
  ];

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`\n📋 Teste ${i + 1}/${testQueries.length}`);

    const result = await orchestrator.processFinancialQuery('user123', query);

    console.log(`✅ Tipo de resposta: ${result.type}`);
    console.log(`🎯 Fonte: ${result.source}`);
    console.log(`📊 Confiança: ${result.confidence}`);
    console.log(`📄 Resultados encontrados: ${result.resultCount || 0}`);

    if (result.data.results && result.data.results.length > 0) {
      console.log(`📚 Documentos relevantes:`);
      result.data.results.forEach((doc, idx) => {
        console.log(
          `   ${idx + 1}. ${doc.document.title} (score: ${doc.score})`
        );
        console.log(`      "${doc.document.content.substring(0, 80)}..."`);
      });
    }

    console.log('---');
  }

  console.log('\n🎉 Teste de integração RAG concluído com sucesso!');
}

if (require.main === module) {
  testRAGIntegration().catch(console.error);
}
