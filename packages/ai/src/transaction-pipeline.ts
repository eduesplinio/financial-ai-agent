import { preprocessDescription } from './transaction-preprocess';

// Exemplo de pipeline para processar uma transação
export function preprocessTransaction(transaction: { description: string }) {
  return {
    ...transaction,
    tokens: preprocessDescription(transaction.description),
  };
}

// Exemplo de uso:
// const result = preprocessTransaction({ description: 'Pagamento de boleto bancário no Itaú' });
// console.log(result.tokens); // ['pagamento', 'boleto', 'bancário', 'itaú']
