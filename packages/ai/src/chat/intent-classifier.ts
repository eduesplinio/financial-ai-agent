/**
 * Intent Classification for Financial Chat
 *
 * Classifies user messages into financial intents to provide better responses
 */

export enum FinancialIntent {
  EXPENSE_ANALYSIS = 'expense_analysis',
  INCOME_ANALYSIS = 'income_analysis',
  INVESTMENT_ADVICE = 'investment_advice',
  BUDGET_PLANNING = 'budget_planning',
  TRANSACTION_SEARCH = 'transaction_search',
  SAVINGS_ADVICE = 'savings_advice',
  FINANCIAL_EDUCATION = 'financial_education',
  GOAL_SETTING = 'goal_setting',
  DEBT_MANAGEMENT = 'debt_management',
  GENERAL_QUESTION = 'general_question',
}

export interface IntentClassification {
  intent: FinancialIntent;
  confidence: number;
  entities: {
    amount?: number;
    category?: string;
    timeframe?: string;
    date?: string;
  };
}

export class IntentClassifier {
  private patterns: Record<FinancialIntent, RegExp[]> = {
    [FinancialIntent.EXPENSE_ANALYSIS]: [
      /gast(o|ei|amos|ou)|despesa|custo|saída|dinheiro.*gast/i,
      /analis(e|ar).*gast|gast.*anális/i,
      /onde.*gast|em que.*gast/i,
      /quanto.*gast|gast.*quanto/i,
      /categoria.*gast|gast.*categoria/i,
    ],
    [FinancialIntent.INCOME_ANALYSIS]: [
      /renda|receita|ganho|salário|entrada.*dinheiro/i,
      /quanto.*ganho|ganho.*quanto/i,
      /analis(e|ar).*renda|renda.*anális/i,
      /fonte.*renda|renda.*fonte/i,
    ],
    [FinancialIntent.INVESTMENT_ADVICE]: [
      /invest(ir|imento)|aplicaç(ão|ões)|renda.*fixa|ações|fundos/i,
      /como.*invest|invest.*como/i,
      /onde.*invest|invest.*onde/i,
      /melhor.*invest|invest.*melhor/i,
      /tesouro.*direto|cdb|lci|lca/i,
    ],
    [FinancialIntent.BUDGET_PLANNING]: [
      /orçamento|planejamento.*financeiro|plano.*financeiro/i,
      /como.*organizar.*dinheiro|organizar.*finanças/i,
      /controle.*financeiro|controlar.*gastos/i,
    ],
    [FinancialIntent.TRANSACTION_SEARCH]: [
      /transaç(ão|ões)|movimentaç(ão|ões)|histórico/i,
      /mostr(e|ar).*transaç|transaç.*mostr/i,
      /buscar.*transaç|encontrar.*transaç/i,
      /últim(a|o).*transaç|transaç.*últim/i,
    ],
    [FinancialIntent.SAVINGS_ADVICE]: [
      /economizar|poupar|guardar.*dinheiro|reserva/i,
      /como.*economizar|economizar.*como/i,
      /dicas.*economia|economia.*dicas/i,
      /reduzir.*gastos|diminuir.*gastos/i,
    ],
    [FinancialIntent.FINANCIAL_EDUCATION]: [
      /o que é|como funciona|explicar|ensinar/i,
      /não entendo|não sei|dúvida/i,
      /conceito|definição|significado/i,
    ],
    [FinancialIntent.GOAL_SETTING]: [
      /meta|objetivo|sonho.*financeiro|plano.*futuro/i,
      /quero.*comprar|quero.*juntar/i,
      /quanto.*preciso.*juntar|juntar.*quanto/i,
    ],
    [FinancialIntent.DEBT_MANAGEMENT]: [
      /dívida|débito|empréstimo|financiamento/i,
      /pagar.*dívida|quitar.*dívida/i,
      /negociar.*dívida|renegociar/i,
    ],
    [FinancialIntent.GENERAL_QUESTION]: [
      /olá|oi|bom dia|boa tarde|boa noite/i,
      /ajuda|ajudar|pode.*ajudar/i,
      /obrigad(o|a)|valeu|legal/i,
    ],
  };

  /**
   * Classify user message intent
   */
  classify(message: string): IntentClassification {
    const normalizedMessage = message.toLowerCase().trim();

    let bestMatch: FinancialIntent = FinancialIntent.GENERAL_QUESTION;
    let maxScore = 0;

    // Check each intent pattern
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      let score = 0;

      for (const pattern of patterns) {
        if (pattern.test(normalizedMessage)) {
          score += 1;
        }
      }

      // Normalize score by number of patterns
      const normalizedScore = score / patterns.length;

      if (normalizedScore > maxScore) {
        maxScore = normalizedScore;
        bestMatch = intent as FinancialIntent;
      }
    }

    // Extract entities
    const entities = this.extractEntities(normalizedMessage);

    return {
      intent: bestMatch,
      confidence: Math.min(maxScore * 2, 1), // Scale confidence
      entities,
    };
  }

  /**
   * Extract entities from message
   */
  private extractEntities(message: string): IntentClassification['entities'] {
    const entities: IntentClassification['entities'] = {};

    // Extract amounts (R$ 100, 100 reais, etc.)
    const amountPatterns = [
      /r\$\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i,
      /(\d+(?:\.\d{3})*(?:,\d{2})?)\s*reais?/i,
      /(\d+(?:\.\d{3})*(?:,\d{2})?)\s*mil/i,
    ];

    for (const pattern of amountPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        let amount = parseFloat(match[1].replace('.', '').replace(',', '.'));
        if (message.includes('mil')) {
          amount *= 1000;
        }
        entities.amount = amount;
        break;
      }
    }

    // Extract categories
    const categoryPatterns = [
      /restaurante|comida|alimentação/i,
      /transporte|uber|combustível/i,
      /casa|moradia|aluguel/i,
      /saúde|médico|farmácia/i,
      /educação|curso|escola/i,
      /lazer|entretenimento|cinema/i,
      /roupas|vestuário|shopping/i,
    ];

    const categoryMap: Record<string, string> = {
      'restaurante|comida|alimentação': 'Alimentação',
      'transporte|uber|combustível': 'Transporte',
      'casa|moradia|aluguel': 'Moradia',
      'saúde|médico|farmácia': 'Saúde',
      'educação|curso|escola': 'Educação',
      'lazer|entretenimento|cinema': 'Lazer',
      'roupas|vestuário|shopping': 'Vestuário',
    };

    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (new RegExp(pattern, 'i').test(message)) {
        entities.category = category;
        break;
      }
    }

    // Extract timeframes
    const timeframePatterns = [
      { pattern: /mês passado|último mês/i, value: 'last_month' },
      { pattern: /este mês|mês atual/i, value: 'this_month' },
      { pattern: /semana passada|última semana/i, value: 'last_week' },
      { pattern: /esta semana|semana atual/i, value: 'this_week' },
      { pattern: /ano passado|último ano/i, value: 'last_year' },
      { pattern: /este ano|ano atual/i, value: 'this_year' },
    ];

    for (const { pattern, value } of timeframePatterns) {
      if (pattern.test(message)) {
        entities.timeframe = value;
        break;
      }
    }

    return entities;
  }

  /**
   * Get search filters based on intent and entities
   */
  getSearchFilters(classification: IntentClassification) {
    const filters: any = {};

    // Add category filter
    if (classification.entities.category) {
      filters.categories = [classification.entities.category];
    }

    // Add amount range filter
    if (classification.entities.amount) {
      const amount = classification.entities.amount;
      filters.amountRange = {
        min: amount * 0.8, // 20% tolerance
        max: amount * 1.2,
      };
    }

    // Add date range filter based on timeframe
    if (classification.entities.timeframe) {
      const now = new Date();

      switch (classification.entities.timeframe) {
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filters.dateRange = { start: lastMonth, end: lastMonthEnd };
          break;

        case 'this_month':
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          filters.dateRange = { start: thisMonth, end: now };
          break;

        case 'last_week':
          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filters.dateRange = { start: lastWeek, end: now };
          break;

        // Add more timeframe cases as needed
      }
    }

    return filters;
  }
}

export default IntentClassifier;
