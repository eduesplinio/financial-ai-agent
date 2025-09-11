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
  const result = categorizer.predict(desc);
  console.log(`Description: ${desc}`);
  console.log(
    `Predicted category: ${result.category}, Confidence: ${result.confidence}`
  );
  console.log('---');
});
