// Teste do orquestrador de serviços (versão simples para demonstração)

// Mock simples do orquestrador
class ServiceOrchestrator {
  async processQuery(userId, query) {
    const startTime = Date.now();

    // Simular análise NLP
    let type = 'info';
    if (
      query.includes('analise') ||
      query.includes('padrões') ||
      query.includes('gastos')
    ) {
      type = 'analysis';
    } else if (query.includes('recomenda') || query.includes('investimento')) {
      type = 'recommendation';
    }

    // Simular roteamento
    let response;
    switch (type) {
      case 'analysis':
        response = {
          type: 'analysis',
          data: {
            message: 'Analisando seus padrões financeiros...',
            analysis: 'Seus gastos com alimentação aumentaram 15% este mês.',
          },
          source: 'pattern-analysis',
          confidence: 0.9,
        };
        break;
      case 'recommendation':
        response = {
          type: 'recommendation',
          data: {
            message: 'Com base no seu perfil, recomendo...',
            recommendations: [
              'Diversificar investimentos',
              'Reduzir gastos variáveis',
            ],
          },
          source: 'recommendation-engine',
          confidence: 0.85,
        };
        break;
      default:
        response = {
          type: 'info',
          data: {
            message: 'Aqui estão as informações solicitadas.',
            entities: query.includes('R$') ? ['valor detectado'] : [],
          },
          source: 'info-service',
          confidence: 0.8,
        };
    }

    return {
      response,
      context: { messages: [{ text: query, timestamp: Date.now() }] },
      processingTime: Date.now() - startTime,
    };
  }
}

async function testOrchestrator() {
  const orchestrator = new ServiceOrchestrator();
  const userId = 'test-user';

  const queries = [
    'Qual meu saldo atual?',
    'Analise meus gastos do último mês',
    'Que investimento você recomenda?',
    'Transferi R$ 500 em 15/09/2025 para alimentação',
  ];

  console.log('🚀 Testando Orquestrador de Serviços\n');

  for (const query of queries) {
    console.log(`📝 Query: "${query}"`);

    try {
      const result = await orchestrator.processQuery(userId, query);

      console.log(`⚡ Tipo: ${result.response.type}`);
      console.log(`🎯 Fonte: ${result.response.source}`);
      console.log(`📊 Confiança: ${result.response.confidence}`);
      console.log(`⏱️ Tempo: ${result.processingTime}ms`);
      console.log(`💬 Resposta:`, result.response.data);
      console.log(
        `📜 Contexto: ${result.context?.messages?.length || 0} mensagens`
      );

      if (result.fallbackUsed) {
        console.log('⚠️ Fallback usado');
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
    }

    console.log('---\n');
  }
}

if (require.main === module) {
  testOrchestrator().catch(console.error);
}
