#!/usr/bin/env node

/**
 * Script para testar a integração do Chat IA
 *
 * Uso: node scripts/test-chat-ai.js
 */

const { ConversationalAgent } = require('@financial-ai/ai');

async function testChatAI() {
  console.log('🤖 Testando integração do Chat IA...\n');

  // Verificar se a chave da OpenAI está configurada
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    console.error(
      '❌ Erro: OPENAI_API_KEY não encontrada nas variáveis de ambiente'
    );
    console.log('💡 Configure a variável OPENAI_API_KEY no arquivo .env.local');
    process.exit(1);
  }

  try {
    // Criar instância do agente
    const agent = new ConversationalAgent(openaiApiKey);
    console.log('✅ Agente conversacional inicializado');

    // Criar sessão de teste
    const session = agent.createSession('test-user');
    console.log('✅ Sessão de teste criada:', session.sessionId);

    // Testar algumas perguntas
    const testQuestions = [
      'Olá, como você pode me ajudar?',
      'O que é um CDB?',
      'Como calcular minha reserva de emergência?',
      'Quais são os tipos de investimento em renda fixa?',
    ];

    console.log('\n📝 Testando perguntas...\n');

    for (const question of testQuestions) {
      console.log(`👤 Usuário: ${question}`);

      const response = await agent.processMessage(question, session);

      console.log(`🤖 Assistente: ${response.message.content}`);
      console.log(
        `📊 Confiança: ${(response.message.metadata?.confidence || 0) * 100}%`
      );
      console.log(
        `⏱️  Tempo: ${response.message.metadata?.processingTime || 0}ms`
      );

      if (response.message.sources && response.message.sources.length > 0) {
        console.log(
          `📚 Fontes: ${response.message.sources.length} documento(s) citado(s)`
        );
      }

      console.log('---\n');
    }

    console.log('✅ Teste concluído com sucesso!');
    console.log('\n💡 Para usar no navegador:');
    console.log('1. Configure OPENAI_API_KEY no .env.local');
    console.log('2. Execute: pnpm dev');
    console.log('3. Acesse: http://localhost:3000/chat');
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);

    if (error.message.includes('API key')) {
      console.log(
        '💡 Verifique se sua chave da OpenAI está correta e tem créditos disponíveis'
      );
    }

    process.exit(1);
  }
}

// Executar teste
testChatAI();
