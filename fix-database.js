#!/usr/bin/env node

import 'dotenv/config';
import mongoose from 'mongoose';

async function fixDatabase() {
  try {
    console.log('🔧 Corrigindo configuração da database...');

    // URI corrigida com nome da database
    const correctUri =
      'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';

    console.log('📡 Conectando à database financial_ai...');
    await mongoose.connect(correctUri);
    console.log('✅ Conectado à database financial_ai');

    const db = mongoose.connection.db;
    console.log(`📊 Database atual: ${db.databaseName}`);

    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections encontradas:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Verificar knowledge documents
    const knowledgeDocs = await db
      .collection('knowledge_documents')
      .countDocuments();
    console.log(`\n📊 Knowledge Documents: ${knowledgeDocs}`);

    if (knowledgeDocs === 0) {
      console.log('\n📚 Populando knowledge documents...');

      const documents = [
        {
          title: 'Como investir na bolsa de valores',
          content:
            'Investir na bolsa de valores é uma estratégia de longo prazo que pode gerar bons retornos. Para começar, é importante entender os conceitos básicos como análise técnica e fundamentalista, diversificação de carteira, e gestão de risco. Recomenda-se começar com valores pequenos e estudar bastante antes de investir valores maiores.',
          source: 'https://example.com/bolsa-valores',
          category: 'investment',
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.9,
            tags: ['investimento', 'bolsa', 'ações'],
            author: 'Especialista Financeiro',
            language: 'pt-BR',
            wordCount: 50,
            readingTime: 1,
          },
        },
        {
          title: 'Planejamento financeiro pessoal',
          content:
            'O planejamento financeiro é fundamental para alcançar objetivos de longo prazo. Inclui criação de orçamento, controle de gastos, criação de reserva de emergência, e definição de metas financeiras. É importante revisar regularmente o plano e ajustar conforme necessário.',
          source: 'https://example.com/planejamento-financeiro',
          category: 'financial_planning',
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.85,
            tags: ['planejamento', 'orçamento', 'metas'],
            author: 'Consultor Financeiro',
            language: 'pt-BR',
            wordCount: 45,
            readingTime: 1,
          },
        },
        {
          title: 'Tesouro Direto - Guia Completo',
          content:
            'O Tesouro Direto é uma plataforma do governo brasileiro para compra de títulos públicos. Oferece segurança e liquidez, sendo ideal para investidores conservadores. Os principais títulos são Selic, IPCA+ e Prefixado, cada um com características específicas de rentabilidade e risco.',
          source: 'https://example.com/tesouro-direto',
          category: 'investment',
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.8,
            tags: ['tesouro', 'títulos', 'governo'],
            author: 'Especialista em Renda Fixa',
            language: 'pt-BR',
            wordCount: 55,
            readingTime: 1,
          },
        },
      ];

      for (const doc of documents) {
        await db.collection('knowledge_documents').insertOne(doc);
      }

      console.log(`✅ ${documents.length} documentos inseridos com sucesso!`);

      // Verificar novamente
      const newCount = await db
        .collection('knowledge_documents')
        .countDocuments();
      console.log(`📊 Total de documentos: ${newCount}`);
    }

    console.log('\n🎉 Database corrigida e populada com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixDatabase();
