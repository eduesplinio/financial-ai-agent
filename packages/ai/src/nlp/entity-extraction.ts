// Extração de entidades financeiras: valores, datas, categorias

export interface FinancialEntities {
  valores: string[];
  datas: string[];
  categorias: string[];
}

export function extractFinancialEntities(text: string): FinancialEntities {
  // Regex para valores monetários (R$ 1.234,56, 1234.56, etc)
  const valores = Array.from(
    text.matchAll(
      /(R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g
    ),
    m => m[0]
  );

  // Regex para datas (dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd)
  const datas = Array.from(
    text.matchAll(/(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})/g),
    m => m[0]
  );

  // Regex simples para categorias financeiras comuns
  const categorias = Array.from(
    text.matchAll(
      /(alimentação|transporte|moradia|saúde|educação|lazer|investimento|salário|imposto|empréstimo|cartão)/gi
    ),
    m => m[0].toLowerCase()
  );

  return { valores, datas, categorias };
}
