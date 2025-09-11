import { TransactionCategorizer } from './transaction-categorizer';

const categorizer = new TransactionCategorizer();
categorizer.train([
  {
    description: 'Pagamento de boleto bancário no Itaú',
    category: 'Pagamento',
  },
  { description: 'Compra no supermercado Extra', category: 'Mercado' },
  { description: 'PIX enviado para Maria', category: 'Transferência' },
  {
    description: 'Transferência recebida de João Silva',
    category: 'Recebimento',
  },
]);

const testCases = [
  'Pagamento de conta de luz',
  'Compra no Carrefour',
  'PIX para José',
  'Transferência recebida de Ana',
];

testCases.forEach(desc => {
  const result = categorizer.predict(desc, { confidenceThreshold: 0.5 });
  console.log(`Description: ${desc}`);
  if (result.fallback) {
    console.log(
      `Manual categorization required (confidence: ${result.confidence})`
    );
  } else {
    console.log(
      `Predicted category: ${result.category}, Confidence: ${result.confidence}`
    );
  }
  console.log('---');
});
