import { TransactionCreateSchema } from '../../database/src/models';

// Exemplo de validação usando TransactionCreateSchema
const valid = TransactionCreateSchema.safeParse({
  userId: 'user123',
  accountId: 'acc456',
  amount: 100.0,
  currency: 'BRL',
  date: new Date(),
  description: 'Pagamento de boleto bancário no Itaú',
});

console.log('Validação:', valid.success);
if (!valid.success) {
  console.error(valid.error);
} else {
  console.log('Objeto válido:', valid.data);
}
