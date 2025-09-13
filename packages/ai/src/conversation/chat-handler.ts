// Integração do pipeline NLP ao sistema de chat com persistência Redis
const { FinancialNLPPipeline } = require('../nlp/pipeline');
const { ConversationMemoryRedis } = require('./context-redis');

const pipeline = new FinancialNLPPipeline();
const memory = new ConversationMemoryRedis();

const { nlpPipeline } = require('../nlp/pipeline');
const { RedisContextManager } = require('./context-redis');

// Integração da pipeline NLP com o chat
export async function handleUserMessage(userId: string, text: string) {
  // Processa mensagem com NLP
  const nlpResult = await pipeline.analyzeIntent({ text });
  // Adiciona mensagem e resultado NLP ao contexto (Redis)
  await memory.addMessage(userId, text, nlpResult);
  // Retorna resposta (exemplo simples)
  const context = await memory.getContext(userId);
  return {
    reply: `Entendi sua intenção: ${nlpResult.type}`,
    nlp: nlpResult,
    context,
  };
}

// module.exports = { handleUserMessage };
