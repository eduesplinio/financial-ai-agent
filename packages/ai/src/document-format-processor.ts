import fs from 'fs';
import pdfParse from 'pdf-parse';
import * as cheerio from 'cheerio';

export type SupportedFormat = 'pdf' | 'html' | 'md' | 'txt';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export function extractTextFromHTML(html: string): string {
  const $ = cheerio.load(html);
  return $('body').text();
}

export function extractTextFromMarkdown(md: string): string {
  // Simples: remove cabeçalhos, converte listas, etc. Pode usar 'marked' ou outro parser se quiser mais robustez
  return md
    .replace(/[#*>\-]/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function extractTextFromTXT(txt: string): string {
  return txt.trim();
}

export async function extractText(
  filePath: string,
  format: SupportedFormat
): Promise<string> {
  if (format === 'pdf') {
    const buffer = fs.readFileSync(filePath);
    return await extractTextFromPDF(buffer);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (format === 'html') return extractTextFromHTML(content);
  if (format === 'md') return extractTextFromMarkdown(content);
  return extractTextFromTXT(content);
}
