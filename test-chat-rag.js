#!/usr/bin/env node

import 'dotenv/config';
import { ConversationalAgent } from './packages/ai/src/conversation/conversational-agent.js';

async function testChatRAG() {
  console.log('🧪 Testando Chat com RAG...\n');

  try {
    // Inicializar o agente
    const agent = new ConversationalAgent(process.env.OPENAI_API_KEY);

    // Criar sessão de teste
    const session = {
      id: 'test-session',
      userId: 'test-user',
      messages: [],
      context: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Pergunta de teste
    const question = 'Como investir na bolsa de valores?';
    console.log(`❓ Pergunta: ${question}\n`);

    // Processar mensagem
    const response = await agent.processMessage(question, session);

    console.log('🤖 Resposta:');
    console.log(response.message.content);
    console.log('\n📚 Fontes encontradas:');
    if (response.message.sources && response.message.sources.length > 0) {
      response.message.sources.forEach((source, index) => {
        console.log(`   ${index + 1}. ${source.title} (${source.relevance})`);
      });
    } else {
      console.log('   Nenhuma fonte específica encontrada');
    }

    console.log(
      '\n🎯 Confiança:',
      response.message.metadata?.confidence || 'N/A'
    );
    console.log('✅ Teste concluído!');
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testChatRAG().catch(console.error);
