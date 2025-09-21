import 'dotenv/config';
import { OpenAIEmbeddingProvider } from '../rag/embedding-generator';

async function populateKnowledgeWithRealEmbeddings() {
  console.log('🚀 Iniciando população de documentos com embeddings reais...');

  const embeddingProvider = new OpenAIEmbeddingProvider(
    process.env.OPENAI_API_KEY!
  );

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
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.95,
        tags: ['investimento', 'bolsa', 'ações', 'iniciantes'],
        language: 'pt-BR',
        author: 'Equipe Financeiro',
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
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.9,
        tags: ['planejamento', 'orçamento', 'controle', 'metas'],
        language: 'pt-BR',
        author: 'Banco Central do Brasil',
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
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.92,
        tags: ['tesouro', 'renda-fixa', 'títulos-públicos', 'iniciantes'],
        language: 'pt-BR',
        author: 'Tesouro Nacional',
      },
    },
    {
      title: 'Fundos de Investimento - Conceitos Básicos',
      content: `Fundos de investimento são veículos que reúnem recursos de vários investidores para aplicar em diferentes ativos.

## Tipos de Fundos

### Fundos de Renda Fixa
- **Objetivo**: Preservar capital com baixo risco
- **Aplicação**: Títulos públicos e privados
- **Risco**: Baixo
- **Liquidez**: Alta

### Fundos Multimercado
- **Objetivo**: Diversificar entre diferentes classes de ativos
- **Aplicação**: Ações, renda fixa, commodities, moedas
- **Risco**: Médio a alto
- **Liquidez**: Média

### Fundos de Ações
- **Objetivo**: Aproveitar crescimento do mercado acionário
- **Aplicação**: Apenas ações
- **Risco**: Alto
- **Liquidez**: Média

### Fundos Imobiliários (FIIs)
- **Objetivo**: Investir em imóveis sem comprar propriedades
- **Aplicação**: Imóveis comerciais e residenciais
- **Risco**: Médio
- **Liquidez**: Alta (negociados na bolsa)

## Taxas Importantes
- **Taxa de administração**: Cobrada sobre o patrimônio
- **Taxa de performance**: Cobrada sobre lucros acima da meta
- **Taxa de entrada/saída**: Cobrada nas aplicações/resgates

## Vantagens
- Gestão profissional
- Diversificação automática
- Baixo valor mínimo
- Liquidez (dependendo do tipo)

## Desvantagens
- Taxas podem reduzir rentabilidade
- Menor controle sobre aplicações
- Performance depende da gestão

**Dica**: Compare sempre as taxas antes de investir. Taxas altas podem comprometer significativamente seus retornos.`,
      source: 'https://www.cvm.gov.br/',
      category: 'investment',
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.88,
        tags: ['fundos', 'investimento', 'diversificação', 'gestão'],
        language: 'pt-BR',
        author: 'CVM - Comissão de Valores Mobiliários',
      },
    },
    {
      title: 'Como Declarar Imposto de Renda',
      content: `A declaração do Imposto de Renda é obrigatória para quem recebeu rendimentos acima de R$ 28.559,70 em 2023.

## Quem Deve Declarar
- Rendimentos tributáveis acima de R$ 28.559,70
- Rendimentos isentos acima de R$ 40.000,00
- Possui bens acima de R$ 300.000,00
- Realizou operações na bolsa de valores
- Recebeu rendimentos de pessoa jurídica

## Documentos Necessários
- Comprovantes de rendimento (salário, aluguéis, investimentos)
- Comprovantes de despesas dedutíveis
- Informações sobre dependentes
- Comprovantes de pagamentos de impostos

## Principais Deduções
- **Gastos com saúde**: Sem limite
- **Educação**: Até R$ 3.561,50 por dependente
- **Previdência privada**: Até 12% da renda bruta
- **Dependentes**: R$ 2.275,08 por dependente

## Prazos Importantes
- **Entrega**: Até 31 de maio
- **Restituição**: A partir de junho
- **Malha fina**: Verificação automática

## Dicas para Evitar Problemas
- Mantenha todos os comprovantes
- Declare todos os rendimentos
- Verifique os dados antes de enviar
- Use o programa oficial da Receita Federal

## Penalidades
- Multa de 1% ao mês sobre o imposto devido
- Multa mínima de R$ 165,74
- Multa máxima de 20% do imposto devido

**Importante**: A declaração deve ser entregue mesmo que não haja imposto a pagar.`,
      source: 'https://www.gov.br/receitafederal/pt-br',
      category: 'taxes',
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.85,
        tags: ['imposto-renda', 'declaração', 'deduções', 'prazo'],
        language: 'pt-BR',
        author: 'Receita Federal',
      },
    },
  ];

  console.log(`📝 Processando ${documents.length} documentos...`);

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    if (!doc) continue;

    console.log(
      `\n🔄 Processando documento ${i + 1}/${documents.length}: "${doc.title}"`
    );

    try {
      // Generate embedding for the document content
      console.log('  📊 Gerando embedding...');
      const embedding = await embeddingProvider.getEmbedding(doc.content);

      // Create document with embedding
      const documentWithEmbedding = {
        title: doc.title,
        content: doc.content,
        source: doc.source,
        category: doc.category as
          | 'investment'
          | 'financial_planning'
          | 'budgeting'
          | 'taxes'
          | 'insurance'
          | 'retirement'
          | 'debt_management'
          | 'banking'
          | 'cryptocurrency'
          | 'real_estate'
          | 'general',
        embedding: embedding,
        metadata: {
          ...doc.metadata,
          wordCount: doc.content.split(' ').length,
          readingTime: Math.ceil(doc.content.split(' ').length / 200),
        },
      };

      // Save to database
      console.log('  💾 Salvando no banco de dados...');
      const { KnowledgeDocumentService } = await import(
        '@financial-ai/database'
      );
      const savedDoc = await KnowledgeDocumentService.create(
        documentWithEmbedding
      );

      console.log(`  ✅ Documento salvo com ID: ${savedDoc._id}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(
        `  ❌ Erro ao processar documento "${doc?.title || 'desconhecido'}":`,
        error
      );
    }
  }

  console.log('\n🎉 População de documentos concluída!');
  console.log('📊 Verificando estatísticas...');

  try {
    const { KnowledgeDocumentService } = await import('@financial-ai/database');
    const stats = await KnowledgeDocumentService.findAll(1, 100);
    console.log(`📈 Total de documentos na base: ${stats.total}`);
  } catch (error) {
    console.error('❌ Erro ao verificar estatísticas:', error);
  }
}

if (require.main === module) {
  populateKnowledgeWithRealEmbeddings().catch(console.error);
}

export { populateKnowledgeWithRealEmbeddings };
