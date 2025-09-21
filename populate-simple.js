const { MongoClient } = require('mongodb');
require('dotenv').config();

async function populateSimple() {
  console.log('🚀 Populando base de conhecimento simples...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Conectando ao MongoDB Atlas...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas\n');

    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    // Clear existing documents
    console.log('🧹 Limpando documentos existentes...');
    await collection.deleteMany({});
    console.log('✅ Documentos limpos\n');

    // Insert sample documents
    console.log('📚 Inserindo documentos de conhecimento...');
    const documents = [
      {
        title: 'Como investir na bolsa de valores',
        content: `Investir na bolsa de valores é uma forma de fazer seu dinheiro trabalhar para você. Para começar, você precisa:

1. **Abrir uma conta em uma corretora**: Escolha uma corretora credenciada pela CVM (Comissão de Valores Mobiliários).

2. **Definir seu perfil de investidor**: 
   - Conservador: Prefere segurança e baixo risco
   - Moderado: Equilibra risco e retorno
   - Arrojado: Aceita maior risco em busca de maiores retornos

3. **Diversificar seus investimentos**: Não coloque todo seu dinheiro em uma única ação ou setor.

4. **Estudar antes de investir**: Conheça as empresas, analise os fundamentos e acompanhe o mercado.

**Riscos importantes**:
- Perda de capital
- Volatilidade do mercado
- Necessidade de conhecimento técnico

**Dicas para iniciantes**:
- Comece com valores pequenos
- Use stop loss para limitar perdas
- Mantenha disciplina emocional
- Invista apenas o que pode perder`,
        source:
          'https://www.b3.com.br/pt_br/produtos-e-servicos/trading/renda-variavel/',
        category: 'investment',
        embedding: Array(1536).fill(0.01), // Mock embedding
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.95,
          tags: ['investimento', 'bolsa', 'ações', 'iniciantes'],
          language: 'pt-BR',
          author: 'Equipe Financeiro',
          wordCount: 150,
          readingTime: 1,
        },
      },
      {
        title: 'Planejamento financeiro pessoal',
        content: `O planejamento financeiro pessoal é essencial para alcançar seus objetivos de vida. Aqui está um guia completo:

## 1. Controle de Gastos
- Registre todas as suas receitas e despesas
- Use aplicativos de controle financeiro
- Categorize seus gastos (essenciais, supérfluos, investimentos)

## 2. Orçamento 50/30/20
- 50% para necessidades essenciais (moradia, alimentação, transporte)
- 30% para desejos e lazer
- 20% para poupança e investimentos

## 3. Reserva de Emergência
- Mantenha 3 a 6 meses de gastos em aplicações de baixo risco
- Use conta poupança ou CDB de liquidez diária
- Nunca invista sua reserva de emergência

## 4. Metas Financeiras
- Defina objetivos claros e mensuráveis
- Estabeleça prazos realistas
- Monitore o progresso regularmente

## 5. Investimentos
- Comece cedo para aproveitar o juros compostos
- Diversifique entre renda fixa e variável
- Considere seu perfil de risco

**Benefícios do planejamento**:
- Redução do estresse financeiro
- Maior controle sobre o futuro
- Possibilidade de realizar sonhos
- Independência financeira`,
        source:
          'https://www.bcb.gov.br/estabilidadefinanceira/educacaofinanceira',
        category: 'financial_planning',
        embedding: Array(1536).fill(0.02), // Mock embedding
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.9,
          tags: ['planejamento', 'orçamento', 'controle', 'metas'],
          language: 'pt-BR',
          author: 'Banco Central do Brasil',
          wordCount: 200,
          readingTime: 2,
        },
      },
      {
        title: 'Tesouro Direto - Guia Completo',
        content: `O Tesouro Direto é o programa do governo federal que permite a pessoas físicas comprar títulos públicos diretamente.

## Tipos de Títulos Disponíveis

### Tesouro Selic (LFT)
- **Características**: Pós-fixado, acompanha a taxa Selic
- **Risco**: Baixo
- **Liquidez**: Alta
- **Ideal para**: Reserva de emergência

### Tesouro IPCA+ (NTN-B)
- **Características**: Pós-fixado, acompanha a inflação + taxa fixa
- **Risco**: Baixo a médio
- **Liquidez**: Média
- **Ideal para**: Proteção contra inflação

### Tesouro Prefixado (LTN)
- **Características**: Taxa fixa conhecida desde o início
- **Risco**: Médio
- **Liquidez**: Média
- **Ideal para**: Objetivos com prazo definido

## Como Investir
1. Abra conta em uma instituição autorizada
2. Transfira recursos para a conta
3. Escolha o título adequado ao seu perfil
4. Defina o valor e prazo
5. Confirme a operação

## Vantagens
- Garantia do governo federal
- Baixo valor mínimo (R$ 30)
- Transparência total
- Sem taxas de administração

## Riscos
- Risco de crédito mínimo (governo federal)
- Risco de mercado (variação de preços)
- Risco de liquidez (se vender antes do vencimento)

**Dica**: Para iniciantes, comece com Tesouro Selic para entender o funcionamento.`,
        source: 'https://www.tesourodireto.com.br/',
        category: 'investment',
        embedding: Array(1536).fill(0.03), // Mock embedding
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.92,
          tags: ['tesouro', 'renda-fixa', 'títulos-públicos', 'iniciantes'],
          language: 'pt-BR',
          author: 'Tesouro Nacional',
          wordCount: 250,
          readingTime: 2,
        },
      },
    ];

    const result = await collection.insertMany(documents);
    console.log(
      `✅ ${result.insertedCount} documentos inseridos com sucesso!\n`
    );

    // Verify insertion
    const totalDocs = await collection.countDocuments();
    const docsWithEmbeddings = await collection.countDocuments({
      embedding: { $exists: true, $ne: null },
    });

    console.log('📊 Verificação final:');
    console.log(`   - Total de documentos: ${totalDocs}`);
    console.log(`   - Documentos com embeddings: ${docsWithEmbeddings}`);
    console.log(
      `   - Cobertura de embeddings: ${((docsWithEmbeddings / totalDocs) * 100).toFixed(1)}%\n`
    );

    console.log('🎉 Base de conhecimento populada com sucesso!');
    console.log('💡 Agora o chat pode usar RAG para respostas especializadas.');
  } catch (error) {
    console.error('❌ Erro ao popular base:', error);
  } finally {
    await client.close();
  }
}

populateSimple().catch(console.error);
