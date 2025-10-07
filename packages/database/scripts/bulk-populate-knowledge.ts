/**
 * Bulk populate 100+ financial knowledge documents with real embeddings
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// 100 documentos de conhecimento financeiro
const DOCUMENTS = [
  // Investimentos (20 docs)
  {
    title: 'Tesouro Direto - Guia Completo',
    content:
      'O Tesouro Direto é um programa do Tesouro Nacional para venda de títulos públicos federais a pessoas físicas pela internet. Os títulos são considerados os investimentos mais seguros do mercado brasileiro.',
    source: 'https://www.tesourodireto.com.br/',
    category: 'investment',
  },
  {
    title: 'CDB - Certificado de Depósito Bancário',
    content:
      'CDB é um título de renda fixa emitido por bancos para captar recursos. Protegido pelo FGC até R$ 250 mil por CPF e instituição.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'LCI e LCA - Letras de Crédito',
    content:
      'LCI e LCA são títulos de renda fixa isentos de IR para pessoa física, lastreados em créditos imobiliários e do agronegócio.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Fundos de Investimento',
    content:
      'Fundos são condomínios que reúnem recursos de investidores para aplicar em diversos ativos, geridos por profissionais.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Ações - Renda Variável',
    content:
      'Ações representam partes do capital de empresas. Negociadas na B3, oferecem potencial de retorno superior no longo prazo.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Dividendos',
    content:
      'Dividendos são lucros distribuídos por empresas aos acionistas, isentos de IR para pessoa física.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'ETFs - Exchange Traded Funds',
    content:
      'ETFs são fundos de índice negociados em bolsa, oferecendo diversificação instantânea com baixo custo.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Fundos Imobiliários - FIIs',
    content:
      'FIIs investem em imóveis ou títulos do setor imobiliário, distribuindo rendimentos mensais isentos de IR.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Debêntures',
    content:
      'Debêntures são títulos de dívida emitidos por empresas para captar recursos, oferecendo juros aos investidores.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'COE - Certificado de Operações Estruturadas',
    content:
      'COE combina renda fixa e variável, com proteção do capital investido e potencial de ganhos atrelados a índices.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Previdência Privada - PGBL e VGBL',
    content:
      'PGBL e VGBL são planos de previdência complementar para aposentadoria, com benefícios fiscais e diferentes tributações.',
    source: 'https://www.susep.gov.br/',
    category: 'retirement',
  },
  {
    title: 'Tesouro RendA+',
    content:
      'Tesouro RendA+ é um título público para aposentadoria, pagando renda mensal após o vencimento.',
    source: 'https://www.tesourodireto.com.br/',
    category: 'retirement',
  },
  {
    title: 'Tesouro Educa+',
    content:
      'Tesouro Educa+ é voltado para educação dos filhos, com pagamentos programados para custear estudos.',
    source: 'https://www.tesourodireto.com.br/',
    category: 'financial_planning',
  },
  {
    title: 'Poupança',
    content:
      'Caderneta de poupança é o investimento mais tradicional, com liquidez diária e rendimento de 70% da Selic + TR.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Ouro como Investimento',
    content:
      'Ouro é ativo de proteção contra inflação e crises, podendo ser investido via fundos, ETFs ou contratos futuros.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Criptomoedas - Bitcoin',
    content:
      'Bitcoin é a primeira criptomoeda descentralizada, criada em 2009, funcionando como reserva de valor digital.',
    source: 'https://bitcoin.org/',
    category: 'cryptocurrency',
  },
  {
    title: 'Ethereum e Smart Contracts',
    content:
      'Ethereum é uma blockchain que permite contratos inteligentes e aplicações descentralizadas (DApps).',
    source: 'https://ethereum.org/',
    category: 'cryptocurrency',
  },
  {
    title: 'Stablecoins',
    content:
      'Stablecoins são criptomoedas atreladas a moedas fiduciárias, oferecendo estabilidade de preço.',
    source: 'https://www.coinbase.com/',
    category: 'cryptocurrency',
  },
  {
    title: 'DeFi - Finanças Descentralizadas',
    content:
      'DeFi são serviços financeiros em blockchain sem intermediários, incluindo empréstimos, câmbio e investimentos.',
    source: 'https://defipulse.com/',
    category: 'cryptocurrency',
  },
  {
    title: 'NFTs - Tokens Não Fungíveis',
    content:
      'NFTs são ativos digitais únicos registrados em blockchain, representando arte, colecionáveis e propriedades digitais.',
    source: 'https://opensea.io/',
    category: 'cryptocurrency',
  },

  // Planejamento Financeiro (15 docs)
  {
    title: 'Orçamento Pessoal',
    content:
      'Orçamento é o controle de receitas e despesas, fundamental para saúde financeira e realização de objetivos.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'budgeting',
  },
  {
    title: 'Regra 50-30-20',
    content:
      'Regra 50-30-20 divide renda em: 50% necessidades, 30% desejos e 20% investimentos e poupança.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'budgeting',
  },
  {
    title: 'Reserva de Emergência',
    content:
      'Reserva de emergência deve cobrir 6 a 12 meses de despesas, investida em ativos líquidos e seguros.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
  },
  {
    title: 'Metas Financeiras SMART',
    content:
      'Metas SMART são Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais, facilitando o planejamento.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
  },
  {
    title: 'Controle de Gastos',
    content:
      'Controlar gastos envolve categorizar despesas, identificar supérfluos e estabelecer limites por categoria.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'budgeting',
  },
  {
    title: 'Endividamento Consciente',
    content:
      'Dívidas devem ser evitadas ou usadas estrategicamente, priorizando pagamento de juros altos.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'debt_management',
  },
  {
    title: 'Score de Crédito',
    content:
      'Score é pontuação que indica probabilidade de pagamento, influenciando aprovação de crédito e taxas.',
    source: 'https://www.serasa.com.br/',
    category: 'debt_management',
  },
  {
    title: 'Renegociação de Dívidas',
    content:
      'Renegociar dívidas pode reduzir juros e parcelar débitos, facilitando quitação e recuperação financeira.',
    source: 'https://www.serasa.com.br/',
    category: 'debt_management',
  },
  {
    title: 'Cartão de Crédito - Uso Consciente',
    content:
      'Cartão deve ser usado com planejamento, pagando fatura integral para evitar juros rotativos altíssimos.',
    source: 'https://www.bcb.gov.br/',
    category: 'debt_management',
  },
  {
    title: 'Empréstimo Consignado',
    content:
      'Consignado tem desconto em folha, oferecendo taxas menores que outras modalidades de crédito.',
    source: 'https://www.bcb.gov.br/',
    category: 'debt_management',
  },
  {
    title: 'Financiamento Imobiliário',
    content:
      'Financiamento imobiliário permite compra de imóvel com pagamento parcelado, usando o imóvel como garantia.',
    source: 'https://www.caixa.gov.br/',
    category: 'real_estate',
  },
  {
    title: 'FGTS - Fundo de Garantia',
    content:
      'FGTS pode ser usado para compra de imóvel, aposentadoria ou saque em situações específicas.',
    source: 'https://www.caixa.gov.br/',
    category: 'real_estate',
  },
  {
    title: 'Consórcio',
    content:
      'Consórcio é forma de aquisição de bens sem juros, através de sorteios ou lances entre participantes.',
    source: 'https://www.bcb.gov.br/',
    category: 'financial_planning',
  },
  {
    title: 'Educação Financeira Infantil',
    content:
      'Ensinar finanças para crianças desenvolve consciência sobre dinheiro, poupança e consumo responsável.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
  },
  {
    title: 'Sucessão Patrimonial',
    content:
      'Planejamento sucessório organiza transmissão de patrimônio, reduzindo custos e conflitos familiares.',
    source: 'https://www.ibdfam.org.br/',
    category: 'financial_planning',
  },

  // Impostos (15 docs)
  {
    title: 'Imposto de Renda Pessoa Física',
    content:
      'IRPF é tributo federal sobre renda e proventos, com alíquotas progressivas de 0% a 27,5%.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Declaração de IR - Obrigatoriedade',
    content:
      'Deve declarar quem recebeu mais de R$ 28.559,70 em 2023, possui bens acima de R$ 300 mil ou operou na bolsa.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Deduções no IR',
    content:
      'Podem ser deduzidas despesas com saúde, educação, dependentes e previdência privada (PGBL).',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'IR sobre Investimentos',
    content:
      'Renda fixa: 22,5% a 15% conforme prazo. Ações: 15% sobre ganhos. Dividendos são isentos.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Come-Cotas',
    content:
      'Come-cotas é antecipação de IR em fundos, cobrada semestralmente em maio e novembro.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Isenção de IR',
    content:
      'São isentos: poupança, LCI, LCA, CRI, CRA, dividendos e vendas de ações até R$ 20 mil/mês.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'DARF - Documento de Arrecadação',
    content:
      'DARF é usado para pagar impostos sobre ganhos em investimentos, com vencimento até último dia útil do mês seguinte.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Malha Fina',
    content:
      'Malha fina é revisão da Receita Federal quando há inconsistências na declaração de IR.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'Restituição do IR',
    content:
      'Restituição devolve imposto pago a mais, depositado conforme lote de processamento da declaração.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },
  {
    title: 'MEI - Microempreendedor Individual',
    content:
      'MEI é regime simplificado para faturamento até R$ 81 mil/ano, com tributação fixa mensal.',
    source: 'https://www.gov.br/empresas-e-negocios/',
    category: 'taxes',
  },
  {
    title: 'Simples Nacional',
    content:
      'Simples unifica tributos para empresas com faturamento até R$ 4,8 milhões/ano.',
    source: 'https://www.gov.br/empresas-e-negocios/',
    category: 'taxes',
  },
  {
    title: 'INSS - Contribuição Previdenciária',
    content:
      'INSS garante aposentadoria e benefícios, com alíquotas de 7,5% a 14% sobre salário.',
    source: 'https://www.gov.br/inss/',
    category: 'taxes',
  },
  {
    title: 'IPTU - Imposto Predial',
    content:
      'IPTU é tributo municipal sobre propriedade de imóveis urbanos, calculado sobre valor venal.',
    source: 'https://www.prefeitura.sp.gov.br/',
    category: 'taxes',
  },
  {
    title: 'IPVA - Imposto sobre Veículos',
    content:
      'IPVA é tributo estadual sobre propriedade de veículos, com alíquotas variando por estado.',
    source: 'https://www.fazenda.sp.gov.br/',
    category: 'taxes',
  },
  {
    title: 'IOF - Imposto sobre Operações Financeiras',
    content:
      'IOF incide sobre crédito, câmbio e investimentos resgatados em menos de 30 dias.',
    source: 'https://www.gov.br/receitafederal/',
    category: 'taxes',
  },

  // Seguros (10 docs)
  {
    title: 'Seguro de Vida',
    content:
      'Seguro de vida protege dependentes financeiramente em caso de morte ou invalidez do segurado.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Residencial',
    content:
      'Seguro residencial cobre danos ao imóvel por incêndio, roubo, desastres naturais e responsabilidade civil.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Auto',
    content:
      'Seguro auto cobre danos ao veículo, terceiros e oferece assistência 24h, sendo obrigatório em financiamentos.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Saúde',
    content:
      'Plano de saúde garante atendimento médico-hospitalar, com cobertura conforme contrato e ANS.',
    source: 'https://www.ans.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Viagem',
    content:
      'Seguro viagem cobre despesas médicas, extravio de bagagem e cancelamentos durante viagens.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Empresarial',
    content:
      'Seguro empresarial protege patrimônio, responsabilidade civil e interrupção de negócios.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Garantia',
    content:
      'Seguro garantia substitui caução em contratos, garantindo cumprimento de obrigações.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Prestamista',
    content:
      'Seguro prestamista quita dívidas em caso de morte ou invalidez, protegendo família e patrimônio.',
    source: 'https://www.susep.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Odontológico',
    content:
      'Plano odontológico cobre tratamentos dentários, com rede credenciada e carências.',
    source: 'https://www.ans.gov.br/',
    category: 'insurance',
  },
  {
    title: 'Seguro Desemprego',
    content:
      'Seguro desemprego é benefício temporário para trabalhadores demitidos sem justa causa.',
    source: 'https://www.gov.br/trabalho/',
    category: 'insurance',
  },

  // Mercado Financeiro (15 docs)
  {
    title: 'Ibovespa - Índice da Bolsa',
    content:
      'Ibovespa é principal índice da B3, medindo desempenho das ações mais negociadas.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Taxa Selic',
    content:
      'Selic é taxa básica de juros da economia, definida pelo Copom, influenciando todos os juros do país.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'CDI - Certificado de Depósito Interbancário',
    content:
      'CDI é taxa de empréstimos entre bancos, referência para rentabilidade de renda fixa.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'IPCA - Inflação Oficial',
    content:
      'IPCA mede inflação oficial do Brasil, calculado pelo IBGE, base para metas do Banco Central.',
    source: 'https://www.ibge.gov.br/',
    category: 'investment',
  },
  {
    title: 'Copom - Comitê de Política Monetária',
    content:
      'Copom define taxa Selic a cada 45 dias, buscando controlar inflação e estimular economia.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Dólar e Câmbio',
    content:
      'Taxa de câmbio é preço de moedas estrangeiras, influenciada por economia, política e fluxo de capitais.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Risco País',
    content:
      'Risco país mede probabilidade de calote da dívida soberana, afetando investimentos estrangeiros.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
  {
    title: 'Rating de Crédito',
    content:
      'Rating avalia capacidade de pagamento de países e empresas, influenciando custo de captação.',
    source: 'https://www.moodys.com/',
    category: 'investment',
  },
  {
    title: 'Mercado Futuro',
    content:
      'Mercado futuro negocia contratos de compra/venda futura de ativos, usado para hedge e especulação.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Opções - Derivativos',
    content:
      'Opções dão direito de comprar/vender ativo por preço fixo, usadas para proteção ou alavancagem.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Day Trade',
    content:
      'Day trade é compra e venda de ativos no mesmo dia, buscando lucro com oscilações de curto prazo.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Swing Trade',
    content:
      'Swing trade mantém posições por dias ou semanas, aproveitando tendências de médio prazo.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Buy and Hold',
    content:
      'Buy and hold é estratégia de longo prazo, mantendo investimentos por anos para valorização e dividendos.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Análise Fundamentalista',
    content:
      'Análise fundamentalista avalia valor intrínseco de empresas através de balanços e indicadores financeiros.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Análise Técnica',
    content:
      'Análise técnica estuda gráficos e padrões de preço para prever movimentos futuros do mercado.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },

  // Conceitos Avançados (15 docs)
  {
    title: 'Diversificação de Carteira',
    content:
      'Diversificar é distribuir investimentos em diferentes ativos e classes, reduzindo risco total da carteira.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Alocação de Ativos',
    content:
      'Alocação define percentual de cada classe de ativo na carteira conforme perfil e objetivos do investidor.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Rebalanceamento',
    content:
      'Rebalancear é ajustar carteira periodicamente para manter alocação original, vendendo valorizados e comprando desvalorizados.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Juros Compostos',
    content:
      'Juros compostos são juros sobre juros, fazendo dinheiro crescer exponencialmente ao longo do tempo.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
  },
  {
    title: 'Valor Presente e Futuro',
    content:
      'Valor presente desconta fluxos futuros, enquanto valor futuro projeta crescimento com juros compostos.',
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
  },
  {
    title: 'TIR - Taxa Interna de Retorno',
    content:
      'TIR é taxa que iguala valor presente de entradas e saídas, medindo rentabilidade de investimentos.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'VPL - Valor Presente Líquido',
    content:
      'VPL traz fluxos futuros a valor presente, indicando viabilidade de projetos e investimentos.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Payback',
    content:
      'Payback é tempo necessário para recuperar investimento inicial através dos retornos gerados.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Volatilidade',
    content:
      'Volatilidade mede oscilação de preços, indicando risco de um ativo ou carteira de investimentos.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Índice Sharpe',
    content:
      'Índice Sharpe mede retorno ajustado ao risco, comparando excesso de retorno com volatilidade.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Beta de Ações',
    content:
      'Beta mede sensibilidade de ação em relação ao mercado, indicando risco sistemático.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Correlação de Ativos',
    content:
      'Correlação mede como ativos se movem juntos, importante para diversificação eficiente.',
    source: 'https://www.anbima.com.br/',
    category: 'investment',
  },
  {
    title: 'Hedge - Proteção',
    content:
      'Hedge é estratégia para proteger carteira contra riscos específicos usando derivativos ou ativos correlacionados.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Alavancagem Financeira',
    content:
      'Alavancagem usa capital de terceiros para amplificar retornos, mas também aumenta riscos proporcionalmente.',
    source: 'https://www.b3.com.br/',
    category: 'investment',
  },
  {
    title: 'Liquidez de Ativos',
    content:
      'Liquidez é facilidade de converter ativo em dinheiro sem perda significativa de valor.',
    source: 'https://www.bcb.gov.br/',
    category: 'investment',
  },
];

async function bulkPopulate() {
  console.log('🚀 Starting bulk population of 100 documents...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    // Check existing documents
    const existingCount = await collection.countDocuments();
    console.log(`📚 Existing documents: ${existingCount}\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < DOCUMENTS.length; i++) {
      const doc = DOCUMENTS[i];

      try {
        // Check if document already exists
        const existing = await collection.findOne({ title: doc.title });
        if (existing) {
          console.log(
            `⏭️  [${i + 1}/${DOCUMENTS.length}] Skipping "${doc.title}" (already exists)`
          );
          skippedCount++;
          continue;
        }

        console.log(
          `📝 [${i + 1}/${DOCUMENTS.length}] Processing: "${doc.title}"`
        );

        // Generate embedding
        const textToEmbed = `${doc.title}\n\n${doc.content}`;
        const embedding = await generateEmbedding(textToEmbed);

        // Insert document
        await collection.insertOne({
          ...doc,
          embedding,
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.9,
            tags: [],
            language: 'pt-BR',
            wordCount: doc.content.split(' ').length,
            readingTime: Math.ceil(doc.content.split(' ').length / 200),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`   ✅ Inserted with ${embedding.length}D embedding\n`);
        successCount++;

        // Delay to avoid rate limits
        if ((i + 1) % 10 === 0) {
          console.log(
            `⏸️  Pausing for rate limit... (${i + 1}/${DOCUMENTS.length} processed)\n`
          );
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error}\n`);
        errorCount++;
      }
    }

    const finalCount = await collection.countDocuments();

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully inserted: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exist): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Total documents in DB: ${finalCount}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('🎉 Bulk population completed successfully!');
      console.log(
        '💡 Your knowledge base now has comprehensive financial content!'
      );
    }
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

if (require.main === module) {
  bulkPopulate().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
