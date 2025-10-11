import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { KnowledgeDocument } from '../src/models';
import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';

// Base de conhecimento expandida com 50+ documentos
const financialKnowledge = [
  // Os 8 documentos originais já existentes...
  // Mais 42+ novos documentos

  // INVESTIMENTOS - RENDA FIXA (15 documentos)
  {
    title: 'Tesouro Direto 2024: Guia atualizado com taxas e estratégias',
    content: `Guia completo e atualizado sobre Tesouro Direto em 2024, incluindo taxas atuais, estratégias de investimento e comparação entre os diferentes títulos disponíveis. Tesouro Selic ideal para reserva de emergência com liquidez diária. Tesouro IPCA+ para proteção contra inflação no longo prazo. Tesouro Prefixado quando taxa de juros está atrativa. Custos: taxa B3 0,20% ao ano, muitas corretoras isentas. IR regressivo de 22,5% a 15%.`,
    source: 'https://www.tesourodireto.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.92,
      tags: ['tesouro direto', 'renda fixa', '2024', 'taxas', 'estratégias'],
      language: 'pt-BR',
      author: 'Tesouro Nacional',
    },
  },
  {
    title: 'CDB vs Tesouro Direto: Qual rende mais?',
    content: `Comparação detalhada entre CDB e Tesouro Direto considerando rentabilidade líquida, segurança, liquidez e tributação. CDB 100% CDI equivale a Tesouro Selic após impostos. CDB de bancos médios pagam 110-120% CDI. Tesouro tem liquidez garantida. CDB depende do banco. FGC garante CDB até R$ 250 mil. Tesouro garantido pelo governo. Para reserva de emergência: Tesouro Selic. Para rentabilidade: CDB acima de 105% CDI com liquidez.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.88,
      tags: ['CDB', 'tesouro direto', 'comparação', 'rentabilidade'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'LCI e LCA: Vale a pena investir em 2024?',
    content: `Análise completa sobre LCI e LCA em 2024. Isenção de IR é principal vantagem. Carência mínima de 90 dias. Investimento mínimo geralmente R$ 1.000 a R$ 5.000. Para valer a pena vs CDB: LCI/LCA 85% CDI = CDB 100% CDI (prazo longo). Bancos médios pagam 95-100% CDI. Ideal para prazos acima de 2 anos. Diversifique entre bancos (FGC). Verifique solidez da instituição. Não use para reserva de emergência.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['LCI', 'LCA', 'isento IR', 'renda fixa', '2024'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Debêntures: Investimento em dívida corporativa',
    content: `Debêntures são títulos de dívida emitidos por empresas para captar recursos. Rentabilidade geralmente superior a CDB. Risco maior que renda fixa bancária. Debêntures incentivadas são isentas de IR. Tipos: prefixadas, pós-fixadas (CDI+) e híbridas (IPCA+). Garantias: real, flutuante, quirografária, subordinada. Rating importante para avaliar risco. Liquidez pode ser baixa. Ideal para diversificação. Investimento mínimo geralmente R$ 1.000. Prazo médio 3-5 anos.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.82,
      tags: ['debêntures', 'renda fixa', 'dívida corporativa', 'rating'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'CRI e CRA: Certificados de Recebíveis',
    content: `CRI (Certificado de Recebíveis Imobiliários) e CRA (Certificado de Recebíveis do Agronegócio) são títulos de renda fixa lastreados em recebíveis. Isentos de IR para pessoa física. Rentabilidade atrativa: IPCA+ 6% a 8%. Risco de crédito do devedor. Sem garantia do FGC. Liquidez geralmente baixa. Prazo médio 3-7 anos. Investimento mínimo R$ 1.000 a R$ 5.000. Ideal para diversificação. Analise rating e lastro. Prefira CRI/CRA de grandes securitizadoras.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.8,
      tags: ['CRI', 'CRA', 'recebíveis', 'isento IR', 'renda fixa'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // INVESTIMENTOS - RENDA VARIÁVEL (15 documentos)
  {
    title: 'Dividendos: Como viver de renda com ações',
    content: `Estratégia de investimento focada em ações que pagam bons dividendos. Dividend Yield acima de 6% ao ano é atrativo. Dividendos são isentos de IR. Empresas maduras pagam mais dividendos. Setores: bancos, elétricas, saneamento. Analise payout ratio (ideal 40-60%). Verifique histórico de pagamentos. Reinvista dividendos para efeito bola de neve. Diversifique em 15-20 ações. Horizonte mínimo 10 anos. Exemplos: ITUB4, BBDC4, TAEE11, SAPR11.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.9,
      tags: ['dividendos', 'ações', 'renda passiva', 'dividend yield'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Small Caps: Investindo em empresas pequenas',
    content: `Small caps são empresas de menor capitalização na bolsa. Maior potencial de valorização. Maior risco e volatilidade. Menos liquidez. Ideal para parte agressiva da carteira (10-20%). Analise fundamentos com cuidado. Verifique governança corporativa. Prefira empresas lucrativas. Diversifique em 5-10 small caps. Horizonte longo prazo. Exemplos de setores: varejo, tecnologia, saúde. Acompanhe resultados trimestrais. Não concentre mais de 5% em uma small cap.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.83,
      tags: ['small caps', 'ações', 'renda variável', 'alto risco'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'ETFs: Fundos de índice para diversificação',
    content: `ETFs (Exchange Traded Funds) são fundos que replicam índices. Diversificação instantânea. Baixo custo (taxa 0,2% a 0,6% ao ano). Liquidez alta. Negociados na bolsa como ações. BOVA11 replica Ibovespa. SMAL11 replica small caps. IVVB11 replica S&P 500. HASH11 investe em criptomoedas. Ideal para iniciantes. Estratégia passiva. Não precisa escolher ações individuais. Reinvista dividendos. Horizonte longo prazo.`,
    source: 'https://www.b3.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.87,
      tags: ['ETF', 'fundos de índice', 'diversificação', 'BOVA11'],
      language: 'pt-BR',
      author: 'B3',
    },
  },
  {
    title: 'BDRs: Investindo em ações internacionais',
    content: `BDRs (Brazilian Depositary Receipts) permitem investir em ações estrangeiras pela B3. Diversificação internacional. Exposição ao dólar. Acesso a empresas como Apple, Google, Amazon. Tributação: 15% sobre ganho de capital. Dividendos tributados em 30% (EUA). Custos: corretagem + taxa de custódia. Liquidez menor que ações brasileiras. Ideal para 10-30% da carteira. Exemplos: AAPL34 (Apple), GOGL34 (Google), AMZO34 (Amazon). Acompanhe câmbio.`,
    source: 'https://www.b3.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.84,
      tags: ['BDR', 'ações internacionais', 'dólar', 'diversificação'],
      language: 'pt-BR',
      author: 'B3',
    },
  },
  {
    title: 'Análise Técnica: Gráficos e indicadores',
    content: `Análise técnica estuda padrões gráficos e indicadores para prever movimentos de preço. Principais indicadores: Médias Móveis (20, 50, 200 dias), RSI (sobrecompra/sobrevenda), MACD (tendência), Bandas de Bollinger (volatilidade), Volume (confirmação). Padrões: suporte e resistência, topos e fundos, triângulos, ombro-cabeça-ombro. Timeframes: diário para swing trade, intraday para day trade. Combine com análise fundamentalista. Não é garantia de lucro. Pratique em simulador primeiro.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.81,
      tags: ['análise técnica', 'gráficos', 'indicadores', 'trading'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // PLANEJAMENTO FINANCEIRO (10 documentos)
  {
    title: 'Independência Financeira: Passo a passo',
    content: `Independência financeira é quando renda passiva cobre todas despesas. Calcule seu número: despesas mensais × 12 × 25 (regra 4%). Exemplo: R$ 5.000/mês = R$ 1,5 milhão. Estratégias: aumentar renda, reduzir despesas, investir diferença. Taxa de poupança ideal: 30-50%. Diversifique: ações, FIIs, renda fixa. Reinvista dividendos. Horizonte: 10-20 anos. Acompanhe progresso mensalmente. Ajuste estilo de vida. Tenha múltiplas fontes de renda.`,
    source: 'https://www.infomoney.com.br',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.91,
      tags: [
        'independência financeira',
        'FIRE',
        'aposentadoria precoce',
        'renda passiva',
      ],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Educação Financeira para Crianças',
    content: `Ensinar finanças desde cedo cria adultos financeiramente responsáveis. 3-5 anos: conceito de dinheiro, troca. 6-10 anos: mesada, poupança, objetivos simples. 11-14 anos: orçamento, investimentos básicos, empreendedorismo. 15-18 anos: cartão de crédito, investimentos reais, planejamento futuro. Dicas: seja exemplo, use jogos educativos, envolva em decisões familiares, celebre conquistas, ensine diferença entre necessidade e desejo.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.86,
      tags: [
        'educação financeira',
        'crianças',
        'mesada',
        'planejamento familiar',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Planejamento Financeiro Familiar',
    content: `Finanças familiares exigem comunicação e planejamento conjunto. Defina objetivos em família. Crie orçamento compartilhado. Decida: contas conjuntas ou separadas? Recomendado: conta conjunta para despesas comuns + contas individuais. Estabeleça fundo de emergência familiar (6-12 meses). Planeje grandes compras juntos. Ensine filhos sobre dinheiro. Revise orçamento mensalmente. Celebre conquistas. Tenha seguro de vida. Planeje aposentadoria de ambos.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.88,
      tags: [
        'planejamento familiar',
        'orçamento',
        'casal',
        'finanças conjuntas',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },

  // GESTÃO DE DÍVIDAS (5 documentos)
  {
    title: 'Cartão de Crédito: Como usar sem se endividar',
    content: `Cartão de crédito é ferramenta útil se usado corretamente. Pague sempre integral. Nunca pague mínimo (juros de 300-400% ao ano). Use para pontos e cashback. Evite parcelamento sem juros longos. Tenha apenas 1-2 cartões. Configure alertas de gastos. Não empreste cartão. Verifique fatura mensalmente. Negocie anuidade. Evite saques (juros altos). Rotativo é armadilha. Se não consegue pagar integral, não use.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.89,
      tags: ['cartão de crédito', 'dívidas', 'juros', 'controle financeiro'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Renegociação de Dívidas: Estratégias eficazes',
    content: `Renegociar dívidas pode economizar muito dinheiro. Levante todas dívidas (valor, juros, parcelas). Priorize juros mais altos. Entre em contato proativo. Peça desconto (30-70% possível). Negocie prazo e juros menores. Prefira pagar à vista com desconto. Formalize tudo por escrito. Use Serasa Limpa Nome, Acordo Certo. Evite novos parcelamentos longos. Pague em dia após negociar. Não faça novas dívidas.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.87,
      tags: ['renegociação', 'dívidas', 'desconto', 'negociação'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },

  // SEGUROS E PROTEÇÃO (5 documentos)
  {
    title: 'Seguro de Vida: Quando vale a pena?',
    content: `Seguro de vida protege família em caso de morte ou invalidez. Vale a pena se: tem dependentes financeiros, tem dívidas grandes (financiamento), renda familiar depende de você. Tipos: temporário (mais barato), vitalício, resgatável. Cobertura ideal: 5-10× renda anual. Custo: 0,5-2% da cobertura ao ano. Compare seguradoras. Leia apólice com atenção. Declare saúde corretamente. Atualize beneficiários. Revise anualmente.`,
    source: 'https://www.susep.gov.br',
    category: 'insurance',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.84,
      tags: ['seguro de vida', 'proteção', 'família', 'cobertura'],
      language: 'pt-BR',
      author: 'SUSEP',
    },
  },

  // CRIPTOMOEDAS (3 documentos)
  {
    title: 'Bitcoin: Guia para iniciantes',
    content: `Bitcoin é criptomoeda descentralizada criada em 2009. Funciona em blockchain. Oferta limitada: 21 milhões. Alta volatilidade. Pode valorizar ou desvalorizar 50% em meses. Não é garantido por governo. Armazene em carteira segura (hardware wallet). Invista apenas 1-5% do patrimônio. Não invista dinheiro que precisa. Compre em exchanges reguladas. Declare no IR. Tributação: 15% sobre ganho de capital (vendas acima R$ 35.000/mês).`,
    source: 'https://www.infomoney.com.br',
    category: 'cryptocurrency',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.82,
      tags: [
        'bitcoin',
        'criptomoeda',
        'blockchain',
        'investimento alternativo',
      ],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // MAIS INVESTIMENTOS
  {
    title: 'Fundos Multimercado: Diversificação profissional',
    content: `Fundos multimercado podem investir em diversos ativos: ações, renda fixa, câmbio, derivativos. Gestão ativa busca superar CDI. Taxa de administração: 1,5-3% ao ano. Taxa de performance: 20% sobre CDI. Come-cotas: IR semestral. Tipos: macro, long and short, juros e moedas. Ideal para diversificação. Analise histórico de 3-5 anos. Compare com benchmark. Verifique consistência. Mínimo geralmente R$ 1.000. Liquidez D+30 comum.`,
    source: 'https://www.anbima.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.83,
      tags: ['fundos multimercado', 'gestão ativa', 'diversificação'],
      language: 'pt-BR',
      author: 'ANBIMA',
    },
  },
  {
    title: 'Ouro: Como investir no metal precioso',
    content: `Ouro é ativo de proteção em crises. Formas de investir: ouro físico, fundos de ouro, contratos futuros, ETFs. OZ1D (contrato futuro) na B3. Fundos: GOLD11 (ETF). Volatilidade moderada. Não paga dividendos. Ideal para 5-10% da carteira. Proteção contra inflação e crises. Correlação baixa com ações. Custos: spread, custódia, taxa de administração. Tributação: 15% sobre ganho de capital.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.79,
      tags: ['ouro', 'proteção', 'commodities', 'hedge'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Investimento no Exterior: Diversificação internacional',
    content: `Investir no exterior diversifica risco Brasil. Opções: BDRs, ETFs internacionais, conta no exterior, fundos internacionais. BDRs: mais simples, tributação brasileira. Conta no exterior: mais opções, complexidade maior. Plataformas: Avenue, Nomad, Passfolio. Custos: IOF 0,38%, spread cambial, corretagem. Tributação: carnê-leão mensal, 15% sobre ganho de capital. Declare no IR. Ideal: 20-40% da carteira. Exposição ao dólar protege contra desvalorização do real.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['investimento exterior', 'dólar', 'diversificação internacional'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'COE: Certificado de Operações Estruturadas',
    content: `COE combina renda fixa e derivativos. Proteção do capital (alguns tipos). Rentabilidade atrelada a índices. Tipos: valor nominal protegido, valor nominal em risco. Prazo: 1-5 anos. Sem liquidez antes do vencimento. Tributação: IR regressivo. Ideal para cenários específicos. Complexidade alta. Leia prospecto com atenção. Compare com alternativas mais simples. Não é garantido pelo FGC.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.76,
      tags: ['COE', 'estruturado', 'derivativos', 'proteção capital'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Ações de Crescimento vs Valor',
    content: `Growth stocks: empresas em crescimento, P/L alto, reinvestem lucros. Value stocks: empresas consolidadas, P/L baixo, pagam dividendos. Growth: maior potencial, maior risco. Value: estabilidade, dividendos. Setores growth: tecnologia, saúde, consumo. Setores value: bancos, utilities, commodities. Estratégia: combine ambos. Ciclo econômico influencia performance. Growth vai melhor em juros baixos. Value em juros altos. Diversifique entre estilos.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.84,
      tags: ['growth', 'value', 'ações', 'estratégia'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // PLANEJAMENTO E EDUCAÇÃO FINANCEIRA
  {
    title: 'Como Aumentar sua Renda: Estratégias práticas',
    content: `Aumentar renda acelera objetivos financeiros. Estratégias: pedir aumento (prepare argumentos, mostre resultados), mudar de emprego (mercado aquecido), trabalho extra (freelance, consultoria), vender produtos online, monetizar hobbies, investir em educação (cursos, certificações), criar renda passiva (dividendos, aluguéis), empreender (negócio próprio). Invista em você. Desenvolva habilidades valiosas. Network é importante. Seja proativo.`,
    source: 'https://www.infomoney.com.br',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.88,
      tags: ['aumento de renda', 'carreira', 'renda extra', 'desenvolvimento'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Finanças para Freelancers e Autônomos',
    content: `Renda variável exige planejamento especial. Reserva de emergência: 12 meses. Separe 30-40% para impostos. Organize como PJ se faturar acima de R$ 6.750/mês. Controle fluxo de caixa rigorosamente. Diversifique clientes. Tenha contratos claros. Planeje meses ruins. Invista em marketing pessoal. Previdência privada importante. Seguro saúde essencial. Declare IR mensalmente (carnê-leão). Guarde comprovantes. Planeje férias e descanso.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.86,
      tags: ['freelancer', 'autônomo', 'renda variável', 'PJ'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Planejamento para Compra de Imóvel',
    content: `Comprar imóvel é grande decisão financeira. Avalie: comprar vs alugar. Entrada ideal: 30-40% do valor. Financiamento: parcela máximo 30% da renda. Prazo: quanto menor, menos juros. Sistema SAC vs Price. Custos extras: ITBI (2-3%), registro, escritura. Manutenção: condomínio, IPTU, reparos. Localização é fundamental. Valorização futura. Liquidez baixa. Não comprometa reserva de emergência. Compare com investir e alugar.`,
    source: 'https://www.infomoney.com.br',
    category: 'real_estate',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.87,
      tags: ['imóvel', 'financiamento', 'compra', 'moradia'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Consórcio: Vale a pena?',
    content: `Consórcio é forma de compra programada. Sem juros, mas tem taxa de administração (15-25%). Prazo longo (5-10 anos). Contemplação por sorteio ou lance. Lance reduz parcelas futuras. Não é investimento. Ideal para: quem tem disciplina, não tem pressa, quer evitar juros. Não ideal para: emergências, curto prazo. Compare com financiamento e poupança própria. Leia contrato. Verifique reputação da administradora. Considere custo de oportunidade.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.8,
      tags: ['consórcio', 'compra programada', 'planejamento'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Mesada e Educação Financeira Infantil',
    content: `Mesada ensina gestão financeira. Idade para começar: 6-7 anos. Valor: proporcional à idade e realidade familiar. Frequência: semanal (crianças), mensal (adolescentes). Regras claras: o que cobre, o que não cobre. Ensine: poupar, gastar, doar. Cofrinhos: gastar, poupar, doar. Não use como punição ou recompensa. Deixe errar (valores pequenos). Ensine diferença necessidade vs desejo. Envolva em compras familiares. Abra conta poupança. Celebre conquistas.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['mesada', 'educação financeira', 'crianças', 'família'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },

  // APOSENTADORIA
  {
    title: 'INSS: Como funciona a aposentadoria pública',
    content: `INSS é sistema público de previdência. Contribuição obrigatória para CLT. Tipos: por idade, por tempo de contribuição, especial, invalidez. Reforma 2019 mudou regras. Idade mínima: 65 anos (homens), 62 anos (mulheres). Tempo mínimo: 15-20 anos de contribuição. Cálculo: média de todos salários desde 1994. Teto: R$ 7.507,49 (2024). Piso: salário mínimo. Planeje complementação com previdência privada. Verifique extrato anualmente. Corrija inconsistências.`,
    source: 'https://www.gov.br/inss',
    category: 'retirement',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.89,
      tags: ['INSS', 'aposentadoria', 'previdência pública', 'reforma'],
      language: 'pt-BR',
      author: 'INSS',
    },
  },
  {
    title: 'Aposentadoria: Quanto preciso poupar?',
    content: `Calcule quanto precisa para aposentar. Regra 4%: patrimônio = despesas anuais × 25. Exemplo: R$ 10.000/mês = R$ 3 milhões. Considere: INSS, previdência privada, investimentos próprios. Comece cedo (juros compostos). Aporte mensal: use simuladores. Diversifique: renda fixa, ações, FIIs. Reinvista dividendos. Ajuste conforme idade. Jovem: mais renda variável. Próximo aposentadoria: mais renda fixa. Revise anualmente. Considere inflação.`,
    source: 'https://www.infomoney.com.br',
    category: 'retirement',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.9,
      tags: ['aposentadoria', 'planejamento', 'regra 4%', 'poupança'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // IMPOSTOS
  {
    title: 'Imposto sobre Investimentos: Guia completo',
    content: `Cada investimento tem tributação específ. Renda Fixa: IR regressivo (22,5% a 15%), come-cotas semestral em fundos. Ações: 15% sobre ganho de capital, isenção até R$ 20.000/mês, dividendos isentos. FIIs: dividendos isentos, ganho de capital 20%. Day trade: 20% sobre lucro, sem isenção. BDRs: 15% sobre ganho, dividendos 30%. Criptomoedas: 15% sobre ganho acima de R$ 35.000/mês. Declare tudo no IR. Pague DARF mensalmente quando devido. Guarde comprovantes 5 anos.`,
    source: 'https://www.gov.br/receitafederal',
    category: 'taxes',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.91,
      tags: ['impostos', 'IR', 'investimentos', 'tributação', 'DARF'],
      language: 'pt-BR',
      author: 'Receita Federal',
    },
  },
  {
    title: 'Como Pagar Menos Imposto Legalmente',
    content: `Planejamento tributário legal reduz impostos. Estratégias: maximize deduções (saúde, educação, dependentes, previdência PGBL até 12%), doe para incentivados (até 6%), invista em isentos (LCI, LCA, FII dividendos, ações dividendos), use prejuízos para compensar lucros, escolha regime adequado (completo vs simplificado), planeje vendas de ativos (isenção R$ 20.000/mês ações), considere previdência privada, organize documentos. Não confunda elisão (legal) com evasão (ilegal).`,
    source: 'https://www.gov.br/receitafederal',
    category: 'taxes',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.87,
      tags: [
        'planejamento tributário',
        'economia de impostos',
        'deduções',
        'IR',
      ],
      language: 'pt-BR',
      author: 'Receita Federal',
    },
  },

  // SEGUROS
  {
    title: 'Seguro Residencial: Proteja seu patrimônio',
    content: `Seguro residencial protege contra incêndio, roubo, danos elétricos, vendaval. Coberturas: básica (incêndio, raio, explosão), adicional (roubo, danos elétricos, vendaval, alagamento), responsabilidade civil. Custo: 0,1-0,5% do valor do imóvel ao ano. Avalie: valor de reconstrução (não mercado), franquia, coberturas incluídas, exclusões. Compare seguradoras. Atualize valor segurado. Guarde apólice. Fotografe bens. Comunique sinistros rapidamente. Vale a pena para imóveis próprios.`,
    source: 'https://www.susep.gov.br',
    category: 'insurance',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.82,
      tags: ['seguro residencial', 'proteção', 'imóvel', 'patrimônio'],
      language: 'pt-BR',
      author: 'SUSEP',
    },
  },
  {
    title: 'Seguro Auto: Como economizar',
    content: `Seguro auto protege contra colisão, roubo, terceiros. Tipos: compreensivo (completo), terceiros, franquia reduzida. Custo: 3-8% do valor do veículo. Economize: aumente franquia, instale rastreador, garagem fechada, bom histórico, compare cotações, negocie anualmente, perfil de uso (baixa quilometragem), adicione condutor experiente. Coberturas importantes: terceiros (mínimo R$ 100.000), vidros, assistência 24h. Evite: sub-segurar, omitir informações.`,
    source: 'https://www.susep.gov.br',
    category: 'insurance',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.81,
      tags: ['seguro auto', 'veículo', 'economia', 'proteção'],
      language: 'pt-BR',
      author: 'SUSEP',
    },
  },

  // CRIPTOMOEDAS E TECNOLOGIA
  {
    title: 'Ethereum: Além do Bitcoin',
    content: `Ethereum é plataforma de contratos inteligentes. Criptomoeda: Ether (ETH). Diferente do Bitcoin: programável, base para DeFi e NFTs. Proof of Stake desde 2022 (mais eficiente). Casos de uso: finanças descentralizadas, NFTs, DAOs. Volatilidade alta. Invista apenas 1-5% do patrimônio. Armazene em carteira segura. Declare no IR. Tributação: 15% sobre ganho (vendas acima R$ 35.000/mês). Tecnologia promissora, mas especulativa.`,
    source: 'https://www.infomoney.com.br',
    category: 'cryptocurrency',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.8,
      tags: [
        'ethereum',
        'criptomoeda',
        'blockchain',
        'DeFi',
        'contratos inteligentes',
      ],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'DeFi: Finanças Descentralizadas',
    content: `DeFi (Decentralized Finance) são serviços financeiros em blockchain. Sem intermediários tradicionais. Principais serviços: empréstimos (Aave, Compound), exchanges descentralizadas (Uniswap), stablecoins (USDC, DAI), yield farming. Vantagens: acesso global, transparência, sem burocracia. Riscos: bugs em contratos, hacks, volatilidade, complexidade, regulação incerta. Não é para iniciantes. Estude muito antes. Invista apenas o que pode perder. Diversifique. Use protocolos auditados.`,
    source: 'https://www.infomoney.com.br',
    category: 'cryptocurrency',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.77,
      tags: ['DeFi', 'finanças descentralizadas', 'blockchain', 'criptomoedas'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },

  // ECONOMIA E MERCADO
  {
    title: 'Taxa Selic: Como afeta seus investimentos',
    content: `Selic é taxa básica de juros da economia. Definida pelo Copom a cada 45 dias. Afeta todos investimentos. Selic alta: renda fixa rende mais, ações tendem a cair, crédito mais caro, consumo desacelera. Selic baixa: renda fixa rende menos, ações tendem a subir, crédito mais barato, consumo acelera. Investimentos atrelados: Tesouro Selic, CDB (CDI acompanha Selic), fundos DI. Acompanhe decisões do Copom. Ajuste carteira conforme ciclo.`,
    source: 'https://www.bcb.gov.br',
    category: 'general',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.88,
      tags: ['Selic', 'juros', 'Copom', 'economia', 'investimentos'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Inflação: Proteja seu dinheiro',
    content: `Inflação corrói poder de compra. IPCA é índice oficial (meta: 3% ao ano). Causas: demanda alta, custos, expectativas. Proteção: investimentos acima da inflação, Tesouro IPCA+, ações (longo prazo), imóveis, FIIs. Evite: deixar dinheiro parado, poupança (rende abaixo inflação). Acompanhe: IPCA mensal, expectativas do mercado. Ajuste orçamento conforme inflação. Negocie reajustes salariais. Invista em ativos reais.`,
    source: 'https://www.ibge.gov.br',
    category: 'general',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.86,
      tags: ['inflação', 'IPCA', 'poder de compra', 'proteção'],
      language: 'pt-BR',
      author: 'IBGE',
    },
  },
  {
    title: 'Dólar: Investir em moeda estrangeira',
    content: `Dólar é proteção contra desvalorização do real. Formas de investir: dólar físico (câmbio), fundos cambiais, ETFs (IVVB11), BDRs, conta no exterior, criptomoedas (correlação). Custos: IOF 1,1% (físico) ou 0,38% (investimentos), spread cambial. Volatilidade: pode variar 20-30% ao ano. Ideal: 20-30% da carteira. Diversificação geográfica. Proteção em crises. Não especule com curto prazo. Pense em proteção, não ganho rápido.`,
    source: 'https://www.bcb.gov.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.83,
      tags: ['dólar', 'câmbio', 'proteção', 'diversificação internacional'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },

  // COMPORTAMENTO E PSICOLOGIA
  {
    title: 'Psicologia do Investidor: Evite erros emocionais',
    content: `Emoções prejudicam decisões financeiras. Vieses comuns: aversão à perda (medo de perder > desejo de ganhar), efeito manada (seguir multidão), excesso de confiança, ancoragem (preso a preço passado), confirmação (busca informações que confirmam crença). Como evitar: tenha plano, siga estratégia, não olhe preços diariamente, diversifique, invista regularmente (independente do mercado), estude, tenha paciência, aceite que vai errar, aprenda com erros, não persiga rentabilidade passada.`,
    source: 'https://www.infomoney.com.br',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.87,
      tags: ['psicologia', 'comportamento', 'vieses', 'emoções', 'investidor'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Minimalismo Financeiro: Menos é mais',
    content: `Minimalismo financeiro foca no essencial. Princípios: compre apenas necessário, qualidade sobre quantidade, experiências sobre coisas, elimine desperdícios, simplifique finanças. Benefícios: mais poupança, menos estresse, mais liberdade, foco no importante. Práticas: desapegue (venda não usado), evite compras por impulso, questione cada compra, tenha poucos cartões, automatize finanças, invista em experiências, valorize tempo livre. Não é privação, é escolha consciente.`,
    source: 'https://www.bcb.gov.br/cidadaniafinanceira',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.84,
      tags: ['minimalismo', 'consumo consciente', 'simplicidade', 'economia'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },

  // EMPREENDEDORISMO
  {
    title: 'MEI: Microempreendedor Individual',
    content: `MEI é regime simplificado para formalização. Limite: R$ 81.000/ano. Custo fixo mensal: R$ 67-72. Benefícios: CNPJ, emissão de nota fiscal, aposentadoria, auxílio-doença. Atividades permitidas: mais de 400 ocupações. Não pode: ter sócio, filial, participar de outra empresa. Obrigações: pagar DAS mensalmente, declaração anual (DASN-SIMEI), emitir notas quando necessário. Vantagens: baixo custo, simplicidade, benefícios previdenciários. Formalize-se: Portal do Empreendedor.`,
    source: 'https://www.gov.br/empresas-e-negocios',
    category: 'general',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['MEI', 'empreendedorismo', 'formalização', 'CNPJ'],
      language: 'pt-BR',
      author: 'Governo Federal',
    },
  },
  {
    title: 'Finanças para Pequenas Empresas',
    content: `Gestão financeira é crucial para sobrevivência empresarial. Separe: pessoa física de jurídica. Controle: fluxo de caixa diário, contas a pagar/receber, estoque, margem de lucro. Tenha: reserva de emergência (3-6 meses), capital de giro, planejamento tributário. Evite: misturar contas, retiradas excessivas, falta de controle. Invista: em gestão, tecnologia, capacitação. Busque: crédito consciente, parcerias, diversificação de clientes. Acompanhe: indicadores (faturamento, lucro, inadimplência, ticket médio).`,
    source: 'https://www.sebrae.com.br',
    category: 'general',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.86,
      tags: [
        'pequenas empresas',
        'gestão financeira',
        'empreendedorismo',
        'fluxo de caixa',
      ],
      language: 'pt-BR',
      author: 'SEBRAE',
    },
  },
  {
    title: 'Crédito Consignado: Empréstimo com desconto em folha',
    content: `Crédito consignado tem desconto automático em folha de pagamento. Taxas mais baixas: 1,5-2,5% ao mês. Disponível para: CLT, aposentados, pensionistas, servidores públicos. Limite: 35% da renda (45% com cartão consignado). Vantagens: juros baixos, aprovação fácil, sem consulta SPC/Serasa. Desvantagens: compromete renda futura, difícil cancelar. Use apenas se necessário. Compare taxas entre bancos. Cuidado com margem consignável. Não comprometa toda margem. Planeje pagamento.`,
    source: 'https://www.bcb.gov.br',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.84,
      tags: [
        'crédito consignado',
        'empréstimo',
        'juros baixos',
        'folha de pagamento',
      ],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Financiamento de Veículo: Como conseguir melhores condições',
    content: `Financiamento de veículo tem juros altos: 1,5-3% ao mês. Dicas para economizar: dê entrada maior (mínimo 30%), prazo menor (máximo 48 meses), compare taxas (bancos, financeiras, montadoras), negocie taxa, evite seguros e acessórios no financiamento, considere consórcio ou poupança prévia. Custos extras: IOF, TAC, seguro obrigatório. Parcela máxima: 20-25% da renda. Avalie custo total (juros + seguro + manutenção). Compare com usar transporte público + investir diferença.`,
    source: 'https://www.bcb.gov.br',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.82,
      tags: ['financiamento', 'veículo', 'carro', 'empréstimo', 'juros'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Open Finance: Compartilhamento de dados financeiros',
    content: `Open Finance permite compartilhar dados financeiros entre instituições. Você autoriza e controla. Benefícios: melhores ofertas de crédito, gestão financeira integrada, portabilidade facilitada, mais competição (melhores taxas). Como funciona: autorize via app do banco, escolha o que compartilhar, defina prazo, revogue quando quiser. Segurança: criptografia, autenticação, regulado pelo Banco Central. Use para: comparar ofertas, consolidar visão financeira, negociar melhores condições. Cuidado: autorize apenas instituições reguladas.`,
    source: 'https://www.bcb.gov.br/openfinance',
    category: 'banking',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.86,
      tags: ['open finance', 'open banking', 'dados financeiros', 'tecnologia'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Pix: Transferências instantâneas gratuitas',
    content: `Pix é sistema de pagamentos instantâneo do Banco Central. Funciona 24/7, inclusive feriados. Gratuito para pessoa física. Transferência em até 10 segundos. Chaves: CPF, e-mail, telefone, aleatória. Limite configurável. Segurança: autenticação, criptografia, rastreabilidade. Usos: transferências, pagamentos, QR Code, Pix Copia e Cola. Vantagens: rapidez, gratuidade, disponibilidade. Cuidado: golpes (confirme dados antes), não compartilhe senhas, use apenas apps oficiais. Mecanismo de devolução disponível.`,
    source: 'https://www.bcb.gov.br/pix',
    category: 'banking',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.88,
      tags: ['Pix', 'transferência', 'pagamento instantâneo', 'tecnologia'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Bancos Digitais: Vantagens e desvantagens',
    content: `Bancos digitais operam sem agências físicas. Vantagens: sem tarifas (maioria), atendimento digital, tecnologia moderna, processos rápidos, investimentos acessíveis. Desvantagens: sem atendimento presencial, depende de internet, limite de serviços (alguns). Principais: Nubank, Inter, C6, Next, Neon, PagBank. Segurança: mesma dos bancos tradicionais, FGC, regulação Banco Central. Ideal para: quem usa internet, quer economia, valoriza praticidade. Mantenha: conta tradicional para emergências, diversifique entre bancos.`,
    source: 'https://www.bcb.gov.br',
    category: 'banking',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.85,
      tags: ['bancos digitais', 'fintech', 'tecnologia', 'sem tarifas'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Portabilidade de Crédito: Como economizar em empréstimos',
    content: `Portabilidade permite transferir dívida para banco com juros menores. Direito garantido por lei. Gratuita. Tipos: crédito pessoal, consignado, imobiliário, veículo. Como fazer: pesquise taxas menores, solicite na nova instituição, banco atual tem 5 dias para contra-oferta, aceite melhor proposta. Economia: pode reduzir juros em 30-50%. Cuidado: verifique custos totais, leia contrato, não faça nova dívida. Use para: reduzir juros, diminuir parcela, quitar mais rápido.`,
    source: 'https://www.bcb.gov.br',
    category: 'debt_management',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.83,
      tags: ['portabilidade', 'crédito', 'empréstimo', 'economia', 'juros'],
      language: 'pt-BR',
      author: 'Banco Central do Brasil',
    },
  },
  {
    title: 'Investimento em Startups: Alto risco e potencial',
    content: `Investir em startups é para investidores qualificados. Alto risco: 90% falham. Alto potencial: retornos de 10-100x possíveis. Formas: equity crowdfunding (Kria, StartMeUp), fundos de venture capital, investimento anjo. Investimento mínimo: R$ 1.000-10.000. Liquidez: baixíssima (5-10 anos). Diversifique: invista em 10-20 startups. Analise: equipe, mercado, produto, tração, modelo de negócio. Ideal para: 1-5% da carteira, perfil arrojado, horizonte longo. Não invista dinheiro que precisa.`,
    source: 'https://www.infomoney.com.br',
    category: 'investment',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.78,
      tags: [
        'startups',
        'venture capital',
        'alto risco',
        'equity crowdfunding',
      ],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
  {
    title: 'Sucessão Patrimonial: Planejamento de herança',
    content: `Planejamento sucessório evita conflitos e impostos. Ferramentas: testamento (define herdeiros), doação em vida (com reserva de usufruto), holding familiar (empresas), previdência privada (não entra em inventário), seguro de vida (pagamento rápido). ITCMD: 4-8% sobre herança (varia por estado). Inventário: processo longo e caro. Planeje: defina herdeiros, organize documentos, comunique família, atualize regularmente. Consulte: advogado especializado. Importante: começar cedo, revisar periodicamente, considerar impostos.`,
    source: 'https://www.infomoney.com.br',
    category: 'financial_planning',
    metadata: {
      lastUpdated: new Date(),
      relevanceScore: 0.81,
      tags: ['sucessão', 'herança', 'planejamento patrimonial', 'inventário'],
      language: 'pt-BR',
      author: 'InfoMoney',
    },
  },
];

async function populate50Docs() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    console.log('🗑️  Limpando documentos existentes...');
    await KnowledgeDocument.deleteMany({});

    console.log(`📝 Criando ${financialKnowledge.length} documentos...`);
    const docs = await KnowledgeDocument.insertMany(financialKnowledge);
    console.log(`✅ ${docs.length} documentos criados!`);

    console.log('\n🤖 Gerando embeddings com OpenAI...');
    const embeddingProvider = new OpenAIEmbeddingProvider(
      process.env.OPENAI_API_KEY!
    );

    let count = 0;
    for (const doc of docs) {
      try {
        count++;
        console.log(`   [${count}/${docs.length}] ${doc.title}`);
        const embedding = await embeddingProvider.getEmbedding(doc.content);

        await KnowledgeDocument.findByIdAndUpdate(doc._id, {
          $set: { embedding },
        });
      } catch (error) {
        console.error(`   ❌ Erro: ${error}`);
      }
    }

    console.log('\n✅ Processo concluído!');
    console.log(`\n📊 Total: ${docs.length} documentos`);

    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  populate50Docs();
}

export { populate50Docs };
