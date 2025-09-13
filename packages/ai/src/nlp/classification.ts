// Sistema de classificação de consultas financeiras

export type QueryClass = 'informacao' | 'analise' | 'recomendacao';

interface QueryClassRule {
  type: QueryClass;
  keywords: string[];
}

const rules: QueryClassRule[] = [
  {
    type: 'informacao',
    keywords: [
      'saldo',
      'extrato',
      'quanto tenho',
      'informação',
      'dados',
      'detalhes',
      'mostrar',
      'listar',
      'consultar',
      'meu limite',
      'meu cartão',
      'meu empréstimo',
      'meu investimento',
      'meu financiamento',
      'meu débito',
      'meu crédito',
    ],
  },
  {
    type: 'analise',
    keywords: [
      'análise',
      'comparar',
      'tendência',
      'gastos',
      'desempenho',
      'histórico',
      'padrão',
      'estatística',
      'relatório',
      'quanto gastei',
      'quanto economizei',
      'quanto investi',
      'quanto paguei',
      'quanto recebi',
      'quanto perdi',
    ],
  },
  {
    type: 'recomendacao',
    keywords: [
      'recomendar',
      'sugestão',
      'o que fazer',
      'devo',
      'deveria',
      'melhor opção',
      'melhor investimento',
      'melhor escolha',
      'qual investir',
      'qual pagar',
      'qual economizar',
      'qual cartão usar',
      'qual banco escolher',
      'qual plano assinar',
    ],
  },
];

export function classifyQuery(text: string): {
  type: QueryClass;
  confidence: number;
} {
  const lowerText = text.toLowerCase();
  let bestMatch: QueryClass = 'informacao';
  let maxScore = 0;

  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lowerText.includes(kw)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule.type;
    }
  }

  const confidence = maxScore > 0 ? Math.min(1, maxScore / 3) : 0.3;
  return { type: bestMatch, confidence };
}
