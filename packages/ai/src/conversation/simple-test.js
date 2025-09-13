// Teste simples de contexto conversacional com Redis (CommonJS)
async function simpleTest() {
  console.log('Teste de contexto conversacional');

  // Mock do pipeline NLP (sem dependências)
  const mockNLP = {
    analyzeIntent: async input => ({
      type: 'informacao',
      confidence: 0.8,
      entities: { valores: [], datas: [], categorias: [] },
      sentiment: 'neutro',
      sentimentScore: 0,
    }),
  };

  // Mock do Redis memory (sem dependência Redis)
  const mockMemory = {
    context: new Map(),
    async getContext(userId) {
      if (!this.context.has(userId)) {
        this.context.set(userId, { userId, messages: [], profile: {} });
      }
      return this.context.get(userId);
    },
    async addMessage(userId, text, nlp) {
      const ctx = await this.getContext(userId);
      ctx.messages.push({ text, timestamp: Date.now(), nlp });
    },
  };

  // Simular handleUserMessage
  async function handleUserMessage(userId, text) {
    const nlpResult = await mockNLP.analyzeIntent({ text });
    await mockMemory.addMessage(userId, text, nlpResult);
    const context = await mockMemory.getContext(userId);
    return {
      reply: `Entendi sua intenção: ${nlpResult.type}`,
      nlp: nlpResult,
      context,
    };
  }

  // Executar teste
  const userId = 'user123';
  const messages = [
    'Qual meu saldo?',
    'Transferi R$ 500 para alimentação.',
    'Como está meu progresso financeiro?',
  ];

  for (const msg of messages) {
    const result = await handleUserMessage(userId, msg);
    console.log('Mensagem:', msg);
    console.log('Resposta:', result.reply);
    console.log('Contexto tem', result.context.messages.length, 'mensagens');
    console.log('---');
  }

  console.log('Teste concluído com sucesso!');
}

simpleTest().catch(console.error);
