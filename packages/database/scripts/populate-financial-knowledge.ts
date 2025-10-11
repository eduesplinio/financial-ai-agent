import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { KnowledgeDocument } from '../src/models';
import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';

const financialKnowledge = [
  {
    title: 'Como investir melhor seu dinheiro',
    content: `Para investir melhor seu dinheiro, siga estas diretrizes fundamentais:

1. **Defina seus objetivos financeiros**: Antes de investir, determine o que você quer alcançar (aposentadoria, compra de imóvel, reserva de emergência, etc.) e em quanto tempo.

2. **Conheça seu perfil de investidor**: Avalie sua tolerância ao risco (conservador, moderado ou arrojado) para escolher investimentos adequados.

3. **Crie uma reserva de emergência**: Mantenha de 6 a 12 meses de despesas em investimentos líquidos e seguros (Tesouro Selic, CDB de liquidez diária).

4. **Diversifique seus investimentos**: Não coloque todo seu dinheiro em um único tipo de investimento. Distribua entre:
   - Renda Fixa: Tesouro Direto, CDBs, LCIs, LCAs
   - Renda Variável: Ações, Fundos Imobiliários (FIIs)
   - Fundos de Investimento: Multimercados, DI

5. **Considere o prazo**: Investimentos de curto prazo (até 2 anos) devem ser mais conservadores. Para longo prazo (acima de 5 anos), você pode assumir mais riscos.

6. **Acompanhe regularmente**: Revise seus investimentos periodicamente e rebalanceie sua carteira conforme necessário.

7. **Estude antes de investir**: Entenda os produtos financeiros, taxas, impostos e riscos envolvidos.

8. **Comece pequeno**: Não precisa ter muito dinheiro para começar. Muitos investimentos permitem aplicações a partir de R$ 30.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.95,
      tags: [
        'investimento',
        'diversificação',
        'planejamento',
        'renda fixa',
        'renda variável',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Tesouro Direto: Investimento seguro e acessível',
    content: `O Tesouro Direto é um programa do Tesouro Nacional que permite a compra de títulos públicos federais por pessoas físicas pela internet.

**Tipos de Títulos:**

1. **Tesouro Selic (LFT)**: 
   - Rentabilidade: Acompanha a taxa Selic
   - Ideal para: Reserva de emergência e curto prazo
   - Risco: Muito baixo
   - Liquidez: Diária

2. **Tesouro Prefixado (LTN)**:
   - Rentabilidade: Taxa fixa definida no momento da compra
   - Ideal para: Objetivos de médio prazo com taxa atrativa
   - Risco: Baixo a médio (se vender antes do vencimento)

3. **Tesouro IPCA+ (NTN-B)**:
   - Rentabilidade: IPCA + taxa fixa
   - Ideal para: Proteção contra inflação e longo prazo
   - Risco: Baixo a médio

**Vantagens:**
- Segurança: Garantido pelo Tesouro Nacional
- Acessibilidade: Investimento mínimo de cerca de R$ 30
- Liquidez: Pode resgatar a qualquer momento
- Rentabilidade: Geralmente superior à poupança

**Como investir:**
1. Abra conta em uma corretora
2. Acesse o site do Tesouro Direto
3. Escolha o título adequado ao seu objetivo
4. Defina o valor e confirme a compra

**Custos:**
- Taxa da B3: 0,20% ao ano sobre o valor investido
- Taxa da corretora: Muitas não cobram
- Imposto de Renda: Regressivo de 22,5% a 15% conforme o prazo`,
    source: 'https://www.tesourodireto.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.9,
      tags: [
        'tesouro direto',
        'renda fixa',
        'títulos públicos',
        'investimento seguro',
      ],
      language: 'pt-BR',
      author: 'Tesouro Nacional',
    },
  },
  {
    title: 'Reserva de Emergência: Por que e como construir',
    content: `A reserva de emergência é um fundo financeiro destinado a cobrir despesas inesperadas ou perda de renda, sem precisar recorrer a empréstimos ou vender investimentos de longo prazo.

**Por que ter uma reserva de emergência?**
- Proteção contra imprevistos (desemprego, problemas de saúde, reparos urgentes)
- Evita endividamento em situações de crise
- Proporciona tranquilidade e segurança financeira
- Permite aproveitar oportunidades sem comprometer outros investimentos

**Quanto guardar?**
- Mínimo: 3 meses de despesas mensais
- Recomendado: 6 meses de despesas
- Ideal: 12 meses de despesas (para autônomos ou renda variável)

**Onde investir a reserva de emergência?**
Priorize liquidez e segurança:
1. **Tesouro Selic**: Rentabilidade acompanha a Selic, liquidez diária
2. **CDB de liquidez diária**: Prefira bancos grandes, com cobertura do FGC
3. **Fundos DI**: Baixa taxa de administração, liquidez diária

**Características importantes:**
- Alta liquidez (resgate rápido)
- Baixo risco
- Rentabilidade acima da inflação
- Sem carência

**Como construir:**
1. Calcule suas despesas mensais essenciais
2. Defina sua meta (6 a 12 meses)
3. Estabeleça um valor mensal para poupar
4. Automatize os aportes
5. Mantenha disciplina até atingir a meta

**Quando usar:**
- Perda de emprego ou redução de renda
- Emergências médicas não cobertas por plano
- Reparos urgentes em casa ou veículo
- Oportunidades únicas de investimento

**Quando NÃO usar:**
- Compras não essenciais
- Viagens de lazer
- Troca de eletrônicos funcionais
- Investimentos de risco`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.95,
      tags: [
        'reserva de emergência',
        'planejamento financeiro',
        'segurança financeira',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Fundos Imobiliários (FIIs): Renda passiva com imóveis',
    content: `Fundos Imobiliários (FIIs) são investimentos coletivos que aplicam recursos em empreendimentos imobiliários, permitindo que você invista no mercado imobiliário sem comprar um imóvel físico.

**Tipos de FIIs:**

1. **Fundos de Tijolo**: Investem em imóveis físicos
   - Shoppings, escritórios, galpões logísticos
   - Renda: Aluguéis dos imóveis

2. **Fundos de Papel**: Investem em títulos do setor imobiliário
   - CRIs, LCIs, debêntures
   - Renda: Juros dos títulos

3. **Fundos de Fundos (FOFs)**: Investem em cotas de outros FIIs
   - Diversificação automática

**Vantagens:**
- Renda passiva mensal (dividendos isentos de IR para pessoa física)
- Liquidez: Negociados na bolsa
- Diversificação: Acesso a múltiplos imóveis
- Gestão profissional
- Investimento inicial baixo (a partir de R$ 100)
- Não precisa se preocupar com manutenção

**Desvantagens:**
- Volatilidade: Preço das cotas oscila
- Risco de vacância (imóveis desocupados)
- Taxa de administração
- Ganho de capital tributado em 20%

**Como escolher um FII:**
1. Analise o dividend yield (DY)
2. Verifique a qualidade dos imóveis/inquilinos
3. Avalie a taxa de vacância
4. Considere a liquidez do fundo
5. Analise o histórico de distribuição
6. Diversifique entre diferentes tipos e setores

**Tributação:**
- Dividendos: Isentos de IR
- Ganho de capital: 20% de IR na venda
- Darf: Responsabilidade do investidor

**Para quem é indicado:**
- Investidores que buscam renda passiva
- Perfil moderado a arrojado
- Horizonte de médio a longo prazo
- Quem deseja exposição ao mercado imobiliário`,
    source: 'https://www.b3.com.br/fundos-imobiliarios',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: [
        'fundos imobiliários',
        'FII',
        'renda passiva',
        'dividendos',
        'imóveis',
      ],
      language: 'pt-BR',
      author: 'B3 - Bolsa de Valores',
    },
  },
  {
    title: 'Ações: Investindo em empresas',
    content: `Ações são pequenas partes do capital de uma empresa. Ao comprar ações, você se torna sócio da empresa e pode lucrar com sua valorização e distribuição de lucros.

**Tipos de Ações:**

1. **Ações Ordinárias (ON)**: Terminam em 3
   - Direito a voto nas assembleias
   - Tag along de 80% (mínimo)

2. **Ações Preferenciais (PN)**: Terminam em 4
   - Preferência no recebimento de dividendos
   - Geralmente não têm direito a voto

**Formas de Ganhar:**

1. **Valorização**: Comprar barato e vender caro
2. **Dividendos**: Distribuição de lucros
3. **Juros sobre Capital Próprio (JCP)**: Forma de remuneração

**Como Analisar Ações:**

**Análise Fundamentalista:**
- P/L (Preço/Lucro): Quanto menor, mais barata
- P/VP (Preço/Valor Patrimonial): Compara preço com patrimônio
- ROE (Return on Equity): Rentabilidade sobre patrimônio
- Dividend Yield: Retorno em dividendos
- Dívida Líquida/EBITDA: Nível de endividamento

**Análise Técnica:**
- Gráficos de preço
- Médias móveis
- Suportes e resistências
- Volume de negociação

**Estratégias:**

1. **Buy and Hold**: Comprar e manter no longo prazo
2. **Day Trade**: Compra e venda no mesmo dia
3. **Swing Trade**: Operações de dias a semanas
4. **Dividendos**: Foco em empresas pagadoras

**Riscos:**
- Volatilidade alta
- Risco de perda do capital
- Risco da empresa (falência, má gestão)
- Risco de mercado (crises econômicas)

**Dicas para Iniciantes:**
1. Estude antes de investir
2. Comece com pouco dinheiro
3. Diversifique (10-15 ações diferentes)
4. Invista em empresas que você conhece
5. Pense no longo prazo
6. Não invista dinheiro que você precisa
7. Controle suas emoções

**Tributação:**
- Dividendos: Isentos de IR
- Ganho de capital: 15% a 20% conforme valor
- Isenção: Vendas até R$ 20.000/mês
- Day trade: 20% sobre lucro`,
    source: 'https://www.b3.com.br/acoes',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.9,
      tags: [
        'ações',
        'bolsa de valores',
        'renda variável',
        'dividendos',
        'análise fundamentalista',
      ],
      language: 'pt-BR',
      author: 'B3 - Bolsa de Valores',
    },
  },
  {
    title: 'Planejamento Financeiro Pessoal: Guia Completo',
    content: `O planejamento financeiro pessoal é o processo de organizar suas finanças para alcançar objetivos de curto, médio e longo prazo.

**Passos para um Planejamento Eficaz:**

**1. Diagnóstico Financeiro:**
- Liste todas as fontes de renda
- Registre todas as despesas (fixas e variáveis)
- Calcule seu patrimônio líquido (ativos - passivos)
- Identifique dívidas e seus custos

**2. Defina Objetivos:**
- Curto prazo (até 1 ano): Viagem, curso, eletrônico
- Médio prazo (1-5 anos): Carro, entrada de imóvel
- Longo prazo (5+ anos): Aposentadoria, faculdade dos filhos

**3. Crie um Orçamento:**
- Método 50/30/20:
  * 50% - Necessidades (moradia, alimentação, transporte)
  * 30% - Desejos (lazer, hobbies)
  * 20% - Poupança e investimentos

**4. Elimine Dívidas:**
- Priorize dívidas com juros mais altos
- Negocie condições melhores
- Evite novas dívidas
- Use método bola de neve ou avalanche

**5. Construa Reserva de Emergência:**
- 6 a 12 meses de despesas
- Investimentos líquidos e seguros
- Antes de investir em renda variável

**6. Invista Regularmente:**
- Automatize aportes mensais
- Diversifique investimentos
- Revise periodicamente
- Rebalanceie quando necessário

**7. Proteja seu Patrimônio:**
- Seguro de vida
- Seguro saúde
- Seguro residencial
- Previdência privada

**8. Planeje a Aposentadoria:**
- Comece cedo
- Calcule quanto precisará
- Diversifique fontes de renda
- Considere INSS + previdência privada

**Ferramentas Úteis:**
- Planilhas de controle
- Aplicativos de finanças
- Conta digital separada para investimentos
- Alertas de gastos

**Erros Comuns a Evitar:**
- Não ter objetivos claros
- Gastar mais do que ganha
- Não ter reserva de emergência
- Investir sem conhecimento
- Não diversificar
- Deixar dinheiro parado na conta corrente
- Não revisar o planejamento

**Revisão Periódica:**
- Mensal: Acompanhe despesas e receitas
- Trimestral: Avalie progresso dos objetivos
- Anual: Rebalanceie investimentos e ajuste metas`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.95,
      tags: [
        'planejamento financeiro',
        'orçamento',
        'objetivos financeiros',
        'controle de gastos',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'CDB, LCI e LCA: Entenda as diferenças',
    content: `CDB, LCI e LCA são investimentos de renda fixa emitidos por bancos. Entenda as características de cada um:

**CDB (Certificado de Depósito Bancário):**
- Emitido por bancos
- Rentabilidade: Prefixada, pós-fixada (CDI) ou híbrida (IPCA+)
- Tributação: IR regressivo (22,5% a 15%)
- Garantia: FGC até R$ 250.000 por CPF e instituição
- Liquidez: Varia (diária, 30 dias, no vencimento)
- Investimento mínimo: A partir de R$ 100

**Tipos de CDB:**
1. Prefixado: Taxa fixa (ex: 12% ao ano)
2. Pós-fixado: % do CDI (ex: 110% do CDI)
3. Híbrido: IPCA + taxa fixa (ex: IPCA + 5%)

**LCI (Letra de Crédito Imobiliário):**
- Emitida por bancos
- Lastreada em créditos imobiliários
- Rentabilidade: Geralmente % do CDI
- Tributação: ISENTO de IR
- Garantia: FGC até R$ 250.000
- Liquidez: Geralmente no vencimento
- Carência mínima: 90 dias
- Investimento mínimo: A partir de R$ 1.000

**LCA (Letra de Crédito do Agronegócio):**
- Emitida por bancos
- Lastreada em créditos do agronegócio
- Rentabilidade: Geralmente % do CDI
- Tributação: ISENTO de IR
- Garantia: FGC até R$ 250.000
- Liquidez: Geralmente no vencimento
- Carência mínima: 90 dias
- Investimento mínimo: A partir de R$ 1.000

**Comparação:**

| Característica | CDB | LCI/LCA |
|---------------|-----|---------|
| IR | Sim (22,5% a 15%) | Não |
| Liquidez | Mais opções | Menos opções |
| Rentabilidade | Geralmente maior | Menor (mas isento) |
| Investimento mínimo | Menor | Maior |
| Carência | Varia | Mínimo 90 dias |

**Quando escolher cada um:**

**CDB:**
- Quando precisa de liquidez
- Investimento inicial menor
- Prazo mais curto (menos de 2 anos)

**LCI/LCA:**
- Quando não precisa de liquidez imediata
- Prazo mais longo (acima de 2 anos)
- Aproveitar isenção de IR

**Cálculo de Equivalência:**
Para comparar CDB com LCI/LCA, considere o IR:
- CDB 100% CDI = LCI/LCA 77,5% CDI (até 180 dias)
- CDB 100% CDI = LCI/LCA 82,5% CDI (181-360 dias)
- CDB 100% CDI = LCI/LCA 85% CDI (361-720 dias)
- CDB 100% CDI = LCI/LCA 87,5% CDI (acima de 720 dias)

**Dicas:**
1. Compare rentabilidade líquida (após IR)
2. Verifique a solidez do banco emissor
3. Diversifique entre instituições
4. Atenção ao prazo e liquidez
5. Leia o regulamento antes de investir`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['CDB', 'LCI', 'LCA', 'renda fixa', 'investimento bancário'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Como sair das dívidas: Estratégias eficazes',
    content: `Sair das dívidas exige planejamento, disciplina e estratégia. Siga este guia para recuperar sua saúde financeira:

**1. Faça um Diagnóstico Completo:**
- Liste todas as dívidas (valor, juros, parcelas)
- Calcule o total devido
- Identifique as dívidas mais caras (maiores juros)
- Avalie sua capacidade de pagamento

**2. Priorize as Dívidas:**

**Método Avalanche (mais econômico):**
- Pague primeiro as dívidas com maiores juros
- Mantém pagamento mínimo das outras
- Economiza mais dinheiro no longo prazo

**Método Bola de Neve (mais motivador):**
- Pague primeiro as menores dívidas
- Gera vitórias rápidas e motivação
- Libera parcelas para atacar dívidas maiores

**3. Negocie com Credores:**
- Entre em contato proativamente
- Peça desconto no valor total
- Negocie prazo e juros menores
- Prefira pagar à vista com desconto
- Formalize tudo por escrito

**4. Aumente sua Renda:**
- Trabalhos extras (freelance, bicos)
- Venda itens não utilizados
- Monetize hobbies
- Peça aumento ou promoção

**5. Reduza Despesas:**
- Corte gastos supérfluos
- Renegocie contratos (internet, telefone)
- Cozinhe em casa
- Use transporte público
- Cancele assinaturas não essenciais

**6. Evite Novas Dívidas:**
- Corte cartões de crédito (deixe apenas um)
- Use dinheiro ou débito
- Evite parcelamentos
- Não empreste dinheiro
- Crie um fundo de emergência

**7. Crie um Orçamento Realista:**
- 70% - Despesas essenciais
- 30% - Pagamento de dívidas
- Ajuste conforme necessário

**Ordem de Prioridade de Pagamento:**
1. Dívidas com garantia (imóvel, veículo)
2. Cheque especial e cartão de crédito rotativo
3. Empréstimos pessoais
4. Carnês e crediários
5. Dívidas com amigos/família

**Programas de Renegociação:**
- Serasa Limpa Nome
- Acordo Certo (Bradesco)
- Negocie Online (Itaú)
- Feirão Limpa Nome
- Procon (para casos complexos)

**Sinais de Alerta:**
- Pagar apenas o mínimo do cartão
- Usar crédito para despesas básicas
- Atrasar contas regularmente
- Não saber quanto deve
- Receber ligações de cobrança

**Quando Buscar Ajuda:**
- Dívidas superiores a 30% da renda
- Impossibilidade de pagar o mínimo
- Múltiplas dívidas atrasadas
- Estresse e ansiedade constantes

**Recursos Úteis:**
- Consumidor.gov.br
- Procon
- Serasa
- Aplicativos de controle financeiro

**Após Quitar as Dívidas:**
1. Comemore a conquista
2. Crie reserva de emergência
3. Estabeleça novos objetivos
4. Mantenha controle financeiro
5. Invista regularmente`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.9,
      tags: ['dívidas', 'negociação', 'controle financeiro', 'economia'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
];

async function populateFinancialKnowledge() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    console.log('🗑️  Limpando documentos existentes...');
    await KnowledgeDocument.deleteMany({});

    console.log('📝 Criando documentos sem embeddings...');
    const docs = await KnowledgeDocument.insertMany(financialKnowledge);
    console.log(`✅ ${docs.length} documentos criados com sucesso!`);

    console.log('\n🤖 Gerando embeddings com OpenAI...');
    const embeddingProvider = new OpenAIEmbeddingProvider(
      process.env.OPENAI_API_KEY!
    );

    for (const doc of docs) {
      try {
        console.log(`   Gerando embedding para: "${doc.title}"`);
        const embedding = await embeddingProvider.getEmbedding(doc.content);

        console.log(`   Embedding gerado com ${embedding.length} dimensões`);

        await KnowledgeDocument.findByIdAndUpdate(doc._id, {
          $set: { embedding },
        });

        console.log(`   ✅ Salvo no banco`);
      } catch (error) {
        console.error(
          `   ❌ Erro ao gerar embedding para "${doc.title}":`,
          error
        );
      }
    }

    console.log('\n✅ Processo concluído!');
    console.log('\n📊 Resumo:');
    console.log(`   Total de documentos: ${docs.length}`);
    console.log(
      `   Categorias: ${[...new Set(docs.map(d => d.category))].join(', ')}`
    );

    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Erro ao popular base de conhecimento:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  populateFinancialKnowledge();
}

export { populateFinancialKnowledge };
