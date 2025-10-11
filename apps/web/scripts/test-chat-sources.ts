import 'dotenv/config';

// Test the question detection logic
const testQuestions = [
  // Concept questions (should NOT include transactions)
  { question: 'O que é MEI?', expectedType: 'concept' },
  { question: 'Como funciona o Tesouro Direto?', expectedType: 'concept' },
  { question: 'Explique o que é Bitcoin', expectedType: 'concept' },
  { question: 'Qual a diferença entre CDB e LCI?', expectedType: 'concept' },
  { question: 'Quais são os tipos de investimento?', expectedType: 'concept' },

  // Personal data questions (should include transactions)
  { question: 'Quanto gastei com casa?', expectedType: 'personal' },
  { question: 'Qual meu saldo?', expectedType: 'personal' },
  { question: 'Meus gastos do mês', expectedType: 'personal' },
  { question: 'Quanto tenho em investimentos?', expectedType: 'personal' },

  // Mixed questions (should include both)
  { question: 'Como posso investir melhor?', expectedType: 'mixed' },
  { question: 'Devo investir em ações?', expectedType: 'mixed' },
];

console.log('🧪 Testando detecção de tipo de pergunta\n');

testQuestions.forEach(({ question, expectedType }) => {
  const isConceptQuestion =
    /^(o que é|o que são|como funciona|explique|qual a diferença|quais são os tipos)/i.test(
      question
    );
  const isPersonalDataQuestion =
    /^(quanto|qual meu|meu saldo|meus gastos|minhas|meus)/i.test(question);

  let detectedType = 'mixed';
  if (isConceptQuestion) detectedType = 'concept';
  else if (isPersonalDataQuestion) detectedType = 'personal';

  const match = detectedType === expectedType;
  const icon = match ? '✅' : '❌';

  console.log(`${icon} "${question}"`);
  console.log(`   Esperado: ${expectedType} | Detectado: ${detectedType}`);
  console.log(`   Incluir transações: ${!isConceptQuestion}`);
  console.log('');
});
