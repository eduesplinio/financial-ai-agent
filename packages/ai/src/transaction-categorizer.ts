import { preprocessDescription } from './transaction-preprocess';
import { TfIdf, BayesClassifier } from 'natural';

export interface TrainingSample {
  description: string;
  category: string;
}

export class TransactionCategorizer {
  private tfidf: TfIdf;
  private classifier: BayesClassifier;

  constructor() {
    this.tfidf = new TfIdf();
    this.classifier = new BayesClassifier();
  }

  train(samples: TrainingSample[]) {
    samples.forEach(({ description, category }) => {
      const tokens = preprocessDescription(description).join(' ');
      this.tfidf.addDocument(tokens, category);
      this.classifier.addDocument(tokens, category);
    });
    this.classifier.train();
  }

  predict(description: string) {
    const tokens = preprocessDescription(description).join(' ');
    const category = this.classifier.classify(tokens);
    const classifications = this.classifier.getClassifications(tokens);
    const confidence =
      classifications.find(c => c.label === category)?.value ?? 0;
    return { category, confidence };
  }
}

// Example usage:
// const categorizer = new TransactionCategorizer();
// categorizer.train([
//   { description: 'Pagamento de boleto bancário no Itaú', category: 'Pagamento' },
//   { description: 'Compra no supermercado Extra', category: 'Mercado' },
//   { description: 'PIX enviado para Maria', category: 'Transferência' },
// ]);
// const result = categorizer.predict('Pagamento de conta de luz');
// console.log(result);
