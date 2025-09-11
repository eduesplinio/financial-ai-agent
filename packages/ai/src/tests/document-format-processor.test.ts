import {
  extractTextFromPDF,
  extractTextFromHTML,
  extractTextFromMarkdown,
  extractTextFromTXT,
} from '../document-format-processor';
import fs from 'fs';

describe('document-format-processor', () => {
  it('should extract text from TXT', () => {
    const txt = 'Exemplo de texto simples.';
    expect(extractTextFromTXT(txt)).toBe('Exemplo de texto simples.');
  });

  it('should extract text from Markdown', () => {
    const md = '# Título\n\nTexto **importante**.';
    expect(extractTextFromMarkdown(md)).toContain('Título');
    expect(extractTextFromMarkdown(md)).toContain('Texto importante.');
  });

  it('should extract text from HTML', () => {
    const html = '<html><body><h1>Olá</h1><p>Financeiro</p></body></html>';
    expect(extractTextFromHTML(html)).toContain('Olá');
    expect(extractTextFromHTML(html)).toContain('Financeiro');
  });

  it.skip('should extract text from PDF', async () => {
    // Para testar PDF, coloque um arquivo de exemplo em src/tests/exemplo.pdf
    const buffer = fs.readFileSync(__dirname + '/exemplo.pdf');
    const text = await extractTextFromPDF(buffer);
    expect(text.length).toBeGreaterThan(10);
  });
});
