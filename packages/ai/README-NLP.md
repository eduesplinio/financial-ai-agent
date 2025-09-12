# Pipeline NLP para Agente Financeiro

Este módulo implementa um pipeline de Processamento de Linguagem Natural (NLP) para agentes conversacionais financeiros. Ele realiza:

- Normalização de texto PT-BR
- Extração de entidades financeiras (valores, datas, categorias)
- Classificação de intenção (informação, análise, recomendação)
- Detecção de sentimento

## Exemplo de uso

```typescript
import { FinancialNLPPipeline } from './src/nlp/pipeline';

const pipeline = new FinancialNLPPipeline();
const input = { text: 'Transferi R$ 1.200,00 em 12/09/2025 para alimentação.' };
pipeline.analyzeIntent(input).then(result => {
  console.log(result);
  // {
  //   type: 'informacao',
  //   confidence: 0.3,
  //   entities: {
  //     valores: ['r$ 120000'],
  //     datas: ['12/09/2025'],
  //     categorias: ['alimentacao']
  //   },
  //   sentiment: 'neutro',
  //   sentimentScore: 0
  // }
});
```

## Integração

O pipeline pode ser integrado a qualquer backend Node.js/TypeScript para análise de consultas financeiras em português.

## Arquivos principais

- `src/nlp/pipeline.ts`: pipeline principal
- `src/nlp/entity-extraction.ts`: extração de entidades
- `src/nlp/classification.ts`: classificação de intenção
- `src/nlp/normalize-ptbr.ts`: normalização PT-BR
- `src/nlp/sentiment.ts`: detecção de sentimento

## Testes

Os testes unitários estão em `tests/nlp/pipeline.test.ts`.

---

Dúvidas ou sugestões? Consulte o README principal do projeto.
