import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { KnowledgeDocument } from '../src/models';

async function populateKnowledgeDocuments() {
  await mongoConnection.connect();

  const docs = [
    {
      title: 'Como investir na bolsa de valores',
      content:
        'Investir na bolsa exige planejamento e conhecimento dos ativos...',
      source: 'https://meusite.com/manual',
      category: 'investment',
      embedding: Array(1536).fill(0.01),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.9,
        tags: ['investimento', 'bolsa'],
        language: 'pt-BR',
        wordCount: 12,
        readingTime: 1,
        author: 'Equipe Financeiro',
      },
    },
    {
      title: 'Planejamento financeiro pessoal',
      content:
        'O planejamento financeiro é essencial para atingir objetivos...',
      source: 'https://meusite.com/manual',
      category: 'financial_planning',
      embedding: Array(1536).fill(0.02),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.8,
        tags: ['planejamento', 'pessoal'],
        language: 'pt-BR',
        wordCount: 10,
        readingTime: 1,
        author: 'Equipe Financeiro',
      },
    },
    {
      title: 'Impostos e declaração de renda',
      content:
        'Entenda como declarar seus impostos corretamente e evitar problemas com a Receita Federal...',
      source: 'https://meusite.com/impostos',
      category: 'taxes',
      embedding: Array(1536).fill(0.03),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.7,
        tags: ['impostos', 'renda'],
        language: 'pt-BR',
        wordCount: 15,
        readingTime: 2,
        author: 'Equipe Fiscal',
      },
    },
    {
      title: 'Como funciona o crédito imobiliário',
      content:
        'O crédito imobiliário é uma modalidade de financiamento para aquisição de imóveis...',
      source: 'https://meusite.com/credito-imobiliario',
      category: 'real_estate',
      embedding: Array(1536).fill(0.04),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.6,
        tags: ['imobiliário', 'financiamento'],
        language: 'pt-BR',
        wordCount: 20,
        readingTime: 2,
        author: 'Equipe Imóveis',
      },
    },
    {
      title: 'Fundamentos de criptomoedas',
      content:
        'Criptomoedas são ativos digitais que utilizam criptografia para segurança...',
      source: 'https://meusite.com/criptomoedas',
      category: 'cryptocurrency',
      embedding: Array(1536).fill(0.05),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.85,
        tags: ['cripto', 'blockchain'],
        language: 'pt-BR',
        wordCount: 18,
        readingTime: 2,
        author: 'Equipe Cripto',
      },
    },
    {
      title: 'Seguros: proteção financeira',
      content:
        'Os seguros são instrumentos importantes para proteger seu patrimônio e família...',
      source: 'https://meusite.com/seguros',
      category: 'insurance',
      embedding: Array(1536).fill(0.06),
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.75,
        tags: ['seguros', 'proteção'],
        language: 'pt-BR',
        wordCount: 14,
        readingTime: 1,
        author: 'Equipe Seguros',
      },
    },
  ];

  await KnowledgeDocument.insertMany(docs);
  console.log('✅ Knowledge documents populados com sucesso!');
  await mongoConnection.disconnect();
}

if (require.main === module) {
  populateKnowledgeDocuments();
}
