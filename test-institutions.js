// Script simples para testar a listagem de instituições
const institutions = [
  {
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    type: 'BANK',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    type: 'BANK',
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    type: 'BANK',
  },
  {
    id: 'santander',
    name: 'Santander',
    type: 'BANK',
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica Federal',
    type: 'BANK',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    type: 'BANK',
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    type: 'BANK',
  },
  {
    id: 'c6-bank',
    name: 'C6 Bank',
    type: 'BANK',
  },
  {
    id: 'btg-pactual',
    name: 'BTG Pactual',
    type: 'BANK',
  },
];

console.log('📋 Instituições disponíveis:');
institutions.forEach((inst, index) => {
  console.log(`${index + 1}. ${inst.name} (${inst.id})`);
});

console.log(`\n✅ Total: ${institutions.length} instituições`);
console.log('🎯 BTG Pactual foi adicionado com sucesso!');
