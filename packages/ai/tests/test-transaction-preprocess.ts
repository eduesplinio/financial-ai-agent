import { preprocessDescription } from '../src/transaction-preprocess';

// Teste simples do pipeline
const testCases = [
  'Pagamento de boleto bancário no Itaú',
  'Transferência recebida de João Silva',
  'Compra no supermercado Extra',
  'PIX enviado para Maria',
];

testCases.forEach(desc => {
  const tokens = preprocessDescription(desc);
  console.log(`Descrição: ${desc}`);
  console.log(`Tokens:`, tokens);
  console.log('---');
});
