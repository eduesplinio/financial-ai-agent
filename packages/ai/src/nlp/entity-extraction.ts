// Extração de entidades financeiras: valores, datas, categorias

export interface FinancialEntities {
  valores: string[];
  datas: string[];
  categorias: string[];
}

export function extractFinancialEntities(text: string): FinancialEntities {
  // Normalizar texto para valores, datas e categorias
  let normText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,]/g, '')
    .toLowerCase();
  // Regex para valores monetários (r$ seguido de qualquer quantidade de dígitos)
  const valores = Array.from(normText.matchAll(/r\$\s?\d+/gi), m => m[0]);
  // Regex para datas (dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd)
  const datas = Array.from(
    normText.matchAll(
      /(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})/g
    ),
    m => m[0]
  );
  // Regex simples para categorias financeiras comuns (sem acentos)
  const categorias = Array.from(
    normText.matchAll(
      /(alimentacao|transporte|moradia|saude|educacao|lazer|investimento|salario|imposto|emprestimo|cartao)/gi
    ),
    m => m[0].toLowerCase()
  );
  return { valores, datas, categorias };
}
