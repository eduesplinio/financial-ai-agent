#!/usr/bin/env node

import 'dotenv/config';
import mongoose from 'mongoose';

async function addMoreDocuments() {
  try {
    console.log('📚 Adicionando mais documentos financeiros...\n');

    // Conectar à database
    const uri =
      'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('✅ Conectado à database financial_ai');

    const db = mongoose.connection.db;

    // Verificar documentos existentes
    const existingCount = await db
      .collection('knowledge_documents')
      .countDocuments();
    console.log(`📊 Documentos existentes: ${existingCount}`);

    // Novos documentos financeiros simples
    const newDocuments = [
      {
        title: 'Análise Técnica - Conceitos Básicos',
        content:
          'A análise técnica é o estudo dos movimentos de preços e volumes para prever tendências futuras. Conceitos principais incluem suportes (níveis onde o preço tende a subir), resistências (níveis onde o preço tende a cair), médias móveis (média dos preços em um período), e indicadores como RSI e MACD. É usada para identificar pontos de entrada e saída em investimentos.',
        source: 'https://example.com/analise-tecnica',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: [
            'análise técnica',
            'suportes',
            'resistências',
            'médias móveis',
            'RSI',
            'MACD',
          ],
          author: 'Especialista em Análise Técnica',
          language: 'pt-BR',
          wordCount: 65,
          readingTime: 1,
        },
      },
      {
        title: 'Análise Fundamentalista - Métricas Importantes',
        content:
          'A análise fundamentalista avalia o valor real de uma empresa através de indicadores financeiros. Principais métricas incluem P/L (Preço sobre Lucro), ROE (Retorno sobre Patrimônio), P/VP (Preço sobre Valor Patrimonial), dividend yield (rendimento de dividendos), e crescimento de receita. Esta análise ajuda a identificar empresas subvalorizadas e com potencial de crescimento.',
        source: 'https://example.com/analise-fundamentalista',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: [
            'análise fundamentalista',
            'P/L',
            'ROE',
            'P/VP',
            'dividend yield',
            'valorização',
          ],
          author: 'Analista Fundamentalista',
          language: 'pt-BR',
          wordCount: 70,
          readingTime: 1,
        },
      },
      {
        title: 'Diversificação de Carteira - Estratégias',
        content:
          'Diversificar significa distribuir investimentos entre diferentes ativos, setores e regiões para reduzir riscos. Estratégias incluem: diversificação por setores (financeiro, consumo, tecnologia), por tamanho de empresa (grandes, médias, pequenas), por geografia (Brasil, exterior), e por tipo de ativo (ações, títulos, imóveis). A regra é não colocar mais de 5% em um único ativo.',
        source: 'https://example.com/diversificacao',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.85,
          tags: ['diversificação', 'carteira', 'risco', 'setores', 'geografia'],
          author: 'Gestor de Carteira',
          language: 'pt-BR',
          wordCount: 75,
          readingTime: 1,
        },
      },
      {
        title: 'Tesouro Direto - Tipos de Títulos',
        content:
          'O Tesouro Direto oferece títulos públicos do governo brasileiro. Principais tipos: Selic (acompanha taxa Selic, ideal para reserva de emergência), IPCA+ (protege da inflação com taxa fixa adicional), Prefixado (taxa fixa conhecida desde o início), e NTN-B (vinculado ao IPCA). Cada tipo tem características específicas de risco, liquidez e rentabilidade.',
        source: 'https://example.com/tesouro-direto-tipos',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: [
            'tesouro direto',
            'selic',
            'ipca+',
            'prefixado',
            'ntn-b',
            'títulos públicos',
          ],
          author: 'Especialista em Renda Fixa',
          language: 'pt-BR',
          wordCount: 80,
          readingTime: 1,
        },
      },
      {
        title: 'Gestão de Risco - Stop Loss e Take Profit',
        content:
          'Gestão de risco é fundamental para proteger o capital. Stop Loss é uma ordem para vender quando o preço cai abaixo de um nível definido, limitando perdas. Take Profit é uma ordem para vender quando o preço sobe acima de um nível definido, realizando lucros. A regra é arriscar no máximo 2% do capital por operação.',
        source: 'https://example.com/gestao-risco',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.85,
          tags: [
            'gestão de risco',
            'stop loss',
            'take profit',
            'proteção capital',
            'limite perdas',
          ],
          author: 'Especialista em Gestão de Risco',
          language: 'pt-BR',
          wordCount: 70,
          readingTime: 1,
        },
      },
      {
        title: 'ETFs - Fundos de Índice',
        content:
          'ETFs (Exchange Tradified Funds) são fundos que replicam índices como Ibovespa, S&P 500, ou setores específicos. Vantagens incluem diversificação automática, baixas taxas, liquidez diária, e transparência. Exemplos no Brasil: BOVA11 (Ibovespa), SMAL11 (Small Caps), HASH11 (Criptomoedas). Ideal para investidores que querem exposição ampla com simplicidade.',
        source: 'https://example.com/etfs-fundos-indice',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.8,
          tags: [
            'ETFs',
            'fundos índice',
            'ibovespa',
            'diversificação',
            'BOVA11',
            'SMAL11',
          ],
          author: 'Especialista em ETFs',
          language: 'pt-BR',
          wordCount: 75,
          readingTime: 1,
        },
      },
      {
        title: 'Reserva de Emergência - Como Montar',
        content:
          'Reserva de emergência é um valor guardado para imprevistos como desemprego, problemas de saúde, ou despesas urgentes. Deve cobrir de 3 a 6 meses de gastos essenciais. Deve ser investida em aplicações de alta liquidez e baixo risco como Tesouro Selic, CDB de bancos grandes, ou conta remunerada. Nunca deve ser investida em ações ou fundos de risco.',
        source: 'https://example.com/reserva-emergencia',
        category: 'financial_planning',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: [
            'reserva emergência',
            'imprevistos',
            'liquidez',
            'tesouro selic',
            'segurança',
          ],
          author: 'Consultor Financeiro',
          language: 'pt-BR',
          wordCount: 70,
          readingTime: 1,
        },
      },
      {
        title: 'Orçamento Pessoal - Controle de Gastos',
        content:
          'Orçamento pessoal é o controle de receitas e despesas para equilibrar as finanças. Método 50-30-20: 50% para necessidades (moradia, alimentação), 30% para desejos (lazer, hobbies), 20% para investimentos e poupança. Use planilhas ou apps para acompanhar gastos mensalmente. Revise e ajuste trimestralmente conforme mudanças na renda ou objetivos.',
        source: 'https://example.com/orcamento-pessoal',
        category: 'financial_planning',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.85,
          tags: [
            'orçamento',
            'controle gastos',
            '50-30-20',
            'receitas',
            'despesas',
          ],
          author: 'Planejador Financeiro',
          language: 'pt-BR',
          wordCount: 65,
          readingTime: 1,
        },
      },
      {
        title: 'Juros Compostos - Poder do Tempo',
        content:
          'Juros compostos são os juros sobre juros, criando crescimento exponencial do capital. Quanto mais tempo investido, maior o efeito. Exemplo: R$ 1.000 a 10% ao ano vira R$ 2.594 em 10 anos, R$ 6.727 em 20 anos. A regra dos 72: divida 72 pela taxa de juros para saber em quantos anos o dinheiro dobra. É a base da riqueza a longo prazo.',
        source: 'https://example.com/juros-compostos',
        category: 'financial_planning',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: [
            'juros compostos',
            'crescimento exponencial',
            'regra 72',
            'tempo',
            'riqueza',
          ],
          author: 'Especialista em Matemática Financeira',
          language: 'pt-BR',
          wordCount: 70,
          readingTime: 1,
        },
      },
      {
        title: 'Inflação - Impacto nos Investimentos',
        content:
          'Inflação é o aumento geral dos preços, corroendo o poder de compra do dinheiro. Para proteger investimentos da inflação, use títulos indexados ao IPCA como Tesouro IPCA+, CDBs IPCA+, ou fundos de inflação. A meta do governo é inflação de 3% ao ano. Investimentos em renda fixa devem superar a inflação para gerar ganho real.',
        source: 'https://example.com/inflacao-investimentos',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.8,
          tags: [
            'inflação',
            'IPCA',
            'poder compra',
            'tesouro ipca+',
            'proteção',
          ],
          author: 'Economista',
          language: 'pt-BR',
          wordCount: 65,
          readingTime: 1,
        },
      },
    ];

    console.log(`\n📝 Inserindo ${newDocuments.length} novos documentos...`);

    for (const doc of newDocuments) {
      await db.collection('knowledge_documents').insertOne(doc);
    }

    console.log(`✅ ${newDocuments.length} documentos inseridos com sucesso!`);

    // Verificar total
    const totalCount = await db
      .collection('knowledge_documents')
      .countDocuments();
    console.log(`📊 Total de documentos: ${totalCount}`);

    // Mostrar categorias
    const categories = await db
      .collection('knowledge_documents')
      .distinct('category');
    console.log(`📂 Categorias: ${categories.join(', ')}`);

    console.log('\n🎉 Base de conhecimento expandida com sucesso!');
    console.log(
      '💡 Agora o chat tem muito mais informações financeiras específicas.'
    );
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addMoreDocuments();
