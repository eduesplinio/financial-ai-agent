const text = 'Transferi R$ 1.200,00 em 12/09/2025 para alimentação.';
let normText = text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[.,]/g, '')
  .toLowerCase();
const valores = Array.from(normText.matchAll(/r\$\s?\d+/gi)).map(m => m[0]);
const datas = Array.from(
  normText.matchAll(
    /(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})/g
  )
).map(m => m[0]);
const categorias = Array.from(
  normText.matchAll(
    /(alimentacao|transporte|moradia|saude|educacao|lazer|investimento|salario|imposto|emprestimo|cartao)/gi
  )
).map(m => m[0]);
console.log('Texto normalizado:', normText);
console.log('Valores extraídos:', valores);
console.log('Datas extraídas:', datas);
console.log('Categorias extraídas:', categorias);
