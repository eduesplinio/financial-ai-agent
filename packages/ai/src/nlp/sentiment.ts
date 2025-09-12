// Sistema de detecção de sentimento para personalização

export type Sentiment = 'positivo' | 'negativo' | 'neutro';

const positiveWords = [
  'bom',
  'ótimo',
  'excelente',
  'positivo',
  'ganhei',
  'lucro',
  'feliz',
  'satisfeito',
  'conquistei',
  'melhorei',
  'cresci',
  'economizei',
  'parabéns',
  'sucesso',
  'vantagem',
  'benefício',
  'ganho',
  'melhoria',
  'progresso',
  'meta atingida',
  'conquista',
];

const negativeWords = [
  'ruim',
  'péssimo',
  'negativo',
  'perdi',
  'prejuízo',
  'triste',
  'insatisfeito',
  'dificuldade',
  'problema',
  'piorou',
  'dívida',
  'gastei demais',
  'alerta',
  'risco',
  'perda',
  'fracasso',
  'meta não atingida',
  'erro',
  'falha',
  'desvantagem',
];

export function detectSentiment(text: string): {
  sentiment: Sentiment;
  score: number;
} {
  const lowerText = text.toLowerCase();
  let score = 0;

  for (const word of positiveWords) {
    if (lowerText.includes(word)) score++;
  }
  for (const word of negativeWords) {
    if (lowerText.includes(word)) score--;
  }

  let sentiment: Sentiment = 'neutro';
  if (score > 0) sentiment = 'positivo';
  if (score < 0) sentiment = 'negativo';

  return { sentiment, score };
}
