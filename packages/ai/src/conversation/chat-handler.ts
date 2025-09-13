// Integração do pipeline NLP ao sistema de chat com persistência Redis
const { FinancialNLPPipeline } = require('../nlp/pipeline');
const { ConversationMemoryRedis } = require('./context-redis');

const pipeline = new FinancialNLPPipeline();
const memory = new ConversationMemoryRedis();

async function handleUserMessage(userId, text) {
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

module.exports = { handleUserMessage };
