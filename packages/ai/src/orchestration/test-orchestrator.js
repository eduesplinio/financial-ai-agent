// Teste do orquestrador de serviços
import { ServiceOrchestrator } from './service-orchestrator';

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
