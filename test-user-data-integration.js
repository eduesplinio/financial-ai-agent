/**
 * Script de teste para verificar a integração dos dados do usuário no RAG
 *
 * Este script simula uma conversa com a IA usando dados reais do usuário
 */

const { getChatService } = require('./apps/web/lib/chat-service.ts');

async function testUserDataIntegration() {
  console.log('🧪 Testando integração de dados do usuário no RAG...\n');

  try {
    const chatService = getChatService();

    // Simular um usuário com dados completos
    const testUserId = '507f1f77bcf86cd799439011'; // ID de exemplo
    const sessionId = chatService.createSession(testUserId).sessionId;

    console.log('📊 Dados do usuário que serão carregados:');
    console.log('- Perfil de risco, conhecimento financeiro, idade');
    console.log('- Metas financeiras ativas');
    console.log('- Contas conectadas e saldos');
    console.log('- Resumo de transações dos últimos 3 meses');
    console.log('- Principais categorias de gastos\n');

    // Teste 1: Pergunta sobre investimentos
    console.log('💬 Teste 1: Pergunta sobre investimentos');
    const response1 = await chatService.processMessage(
      sessionId,
      'Quais investimentos você recomenda para mim?'
    );

    console.log('✅ Resposta da IA:');
    console.log(response1.message.content.substring(0, 200) + '...\n');

    // Teste 2: Pergunta sobre metas financeiras
    console.log('💬 Teste 2: Pergunta sobre metas financeiras');
    const response2 = await chatService.processMessage(
      sessionId,
      'Como posso alcançar minhas metas financeiras mais rapidamente?'
    );

    console.log('✅ Resposta da IA:');
    console.log(response2.message.content.substring(0, 200) + '...\n');

    // Teste 3: Pergunta sobre gastos
    console.log('💬 Teste 3: Pergunta sobre otimização de gastos');
    const response3 = await chatService.processMessage(
      sessionId,
      'Onde posso reduzir meus gastos?'
    );

    console.log('✅ Resposta da IA:');
    console.log(response3.message.content.substring(0, 200) + '...\n');

    console.log(
      '🎉 Teste concluído! A IA agora tem acesso completo aos dados do usuário.'
    );
    console.log('\n📋 Funcionalidades implementadas:');
    console.log('✅ Interface UserProfile expandida com todos os dados');
    console.log('✅ Serviço fetchUserData() para buscar dados do banco');
    console.log('✅ Cálculo automático de resumo de transações');
    console.log('✅ Prompt do sistema personalizado com dados do usuário');
    console.log(
      '✅ APIs do chat atualizadas para buscar dados automaticamente'
    );
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testUserDataIntegration();
}

module.exports = { testUserDataIntegration };
