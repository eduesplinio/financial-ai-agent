import { chunkFinancialDocument } from '../rag/chunking';

describe('chunkFinancialDocument', () => {
  it('should split a financial document into semantic chunks', () => {
    const text = `Resumo Financeiro

Receita total: R$ 10.000

Despesas:

Investimentos

Ações: R$ 3.000
Fundos: R$ 1.000
`;
    const chunks = chunkFinancialDocument(text, {
      minLength: 20,
      maxLength: 80,
    });
    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeGreaterThanOrEqual(20);
      expect(chunk.content.length).toBeLessThanOrEqual(80);
      expect(chunk.id).toMatch(/^chunk_\d+$/);
    }
  });
});
