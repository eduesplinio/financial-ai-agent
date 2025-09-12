// Exemplo de integração do pipeline NLP ao sistema de chat
import { FinancialNLPPipeline } from '../nlp/pipeline';
import { ConversationMemory } from './context';

const pipeline = new FinancialNLPPipeline();
const memory = new ConversationMemory();

export async function handleUserMessage(userId: string, text: string) {
  // Processa mensagem com NLP
  const nlpResult = await pipeline.analyzeIntent({ text });
  // Adiciona mensagem e resultado NLP ao contexto
  memory.addMessage(userId, text, nlpResult);
  // Retorna resposta (exemplo simples)
  return {
    reply: `Entendi sua intenção: ${nlpResult.type}`,
    nlp: nlpResult,
    context: memory.getContext(userId),
  };
}
