import { FinancialNLPPipeline, NLPPipelineInput } from '../../src/nlp/pipeline';

describe('FinancialNLPPipeline', () => {
  const pipeline = new FinancialNLPPipeline();

  it('deve classificar consulta de informação', async () => {
    const input: NLPPipelineInput = { text: 'Qual meu saldo atual?' };
    const result = await pipeline.analyzeIntent(input);
    expect(result.type).toBe('informacao');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.entities).toBeDefined();
    expect(result.entities!.valores.length).toBe(0);
  });

  it('deve classificar consulta de análise', async () => {
    const input: NLPPipelineInput = {
      text: 'Me mostre a tendência dos meus gastos mensais.',
    };
    const result = await pipeline.analyzeIntent(input);
    expect(result.type).toBe('analise');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('deve classificar consulta de recomendação', async () => {
    const input: NLPPipelineInput = {
      text: 'Qual o melhor investimento para mim?',
    };
    const result = await pipeline.analyzeIntent(input);
    expect(result.type).toBe('recomendacao');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('deve extrair valores e datas', async () => {
    const input: NLPPipelineInput = {
      text: 'Transferi R$ 1.200,00 em 12/09/2025 para alimentação.',
    };
    const result = await pipeline.analyzeIntent(input);
    console.log('Resultado NLP:', result);
    expect(result.entities).toBeDefined();
    expect(result.entities!.valores).toContain('r$ 120000');
    expect(result.entities!.datas).toContain('12/09/2025');
    expect(result.entities!.categorias).toContain('alimentacao');
  });

  it('deve detectar sentimento positivo', async () => {
    const input: NLPPipelineInput = {
      text: 'Estou muito satisfeito com meu progresso financeiro!',
    };
    const result = await pipeline.analyzeIntent(input);
    expect(result.sentiment).toBe('positivo');
    expect(result.sentimentScore).toBeGreaterThan(0);
  });

  it('deve detectar sentimento negativo', async () => {
    const input: NLPPipelineInput = {
      text: 'Estou preocupado com minha dívida.',
    };
    const result = await pipeline.analyzeIntent(input);
    expect(result.sentiment).toBe('negativo');
    expect(result.sentimentScore).toBeLessThan(0);
  });
});
