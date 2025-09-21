#!/usr/bin/env node

import 'dotenv/config';
import mongoose from 'mongoose';

async function testAgentDirect() {
  try {
    console.log('🧪 Testando ConversationalAgent diretamente...\n');

    // Conectar à database correta
    const uri =
      'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('✅ Conectado à database financial_ai');

    // Verificar knowledge documents
    const db = mongoose.connection.db;
    const knowledgeDocs = await db
      .collection('knowledge_documents')
      .countDocuments();
    console.log(`📊 Knowledge Documents: ${knowledgeDocs}`);

    if (knowledgeDocs === 0) {
      console.log('❌ Nenhum documento encontrado!');
      return;
    }

    // Testar importação do ConversationalAgent
    console.log('\n🔍 Testando importação do ConversationalAgent...');
    try {
      const { ConversationalAgent } = await import(
        './packages/ai/src/conversation/conversational-agent.ts'
      );
      console.log('✅ ConversationalAgent importado com sucesso');

      // Criar instância
      const agent = new ConversationalAgent(process.env.OPENAI_API_KEY);
      console.log('✅ Instância criada com sucesso');

      // Testar processamento
      const session = {
        sessionId: 'test-session',
        userId: 'test-user',
        messages: [],
        context: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('\n🤖 Testando processamento de mensagem...');
      const response = await agent.processMessage(
        'Como investir na bolsa de valores?',
        session
      );

      console.log('✅ Resposta recebida:');
      console.log(
        `📝 Conteúdo: ${response.message.content.substring(0, 100)}...`
      );
      console.log(`📚 Fontes: ${response.message.sources?.length || 0}`);
      console.log(
        `🎯 Confiança: ${response.message.metadata?.confidence || 'N/A'}`
      );
    } catch (error) {
      console.error('❌ Erro no ConversationalAgent:', error.message);
      console.error('Stack:', error.stack);
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testAgentDirect();
