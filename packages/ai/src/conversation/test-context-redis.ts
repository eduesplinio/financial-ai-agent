// Teste de integração do contexto conversacional com Redis
const { handleUserMessage } = require('./chat-handler');

async function runTest() {
  const userId = 'user123';
  const messages = [
    'Qual meu saldo?',
    'Transferi R$ 500 para alimentação.',
    'Como está meu progresso financeiro?',
  ];

  for (const msg of messages) {
    const result = await handleUserMessage(userId, msg);
    console.log('Resposta:', result.reply);
    console.log('Contexto:', result.context);
    console.log('---');
  }
}

if (require.main === module) {
  runTest();
}
