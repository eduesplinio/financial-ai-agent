import { preprocessDescription } from './transaction-preprocess';
import { TfIdf, BayesClassifier } from 'natural';

export interface TrainingSample {
  description: string;
  category: string;
}

export class TransactionCategorizer {
  /**
   * Retrain the model with a new batch of samples (e.g., after collecting feedbacks).
   */
  retrain(samples: TrainingSample[]) {
    this.classifier = new BayesClassifier();
    this.tfidf = new TfIdf();
    this.train(samples);
  }
  /**
   * Receives user feedback and updates the classifier with the correct category.
   * This enables continuous improvement of the model.
   */
  addFeedback(description: string, correctCategory: string) {
    const tokens = preprocessDescription(description).join(' ');
    this.classifier.addDocument(tokens, correctCategory);
    this.classifier.train();
  }
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

  predict(description: string, options?: { confidenceThreshold?: number }) {
    const tokens = preprocessDescription(description).join(' ');
    const category = this.classifier.classify(tokens);
    const classifications = this.classifier.getClassifications(tokens);
    const confidence =
      classifications.find(c => c.label === category)?.value ?? 0;
    const threshold = options?.confidenceThreshold ?? 0.5;
    if (confidence < threshold) {
      return { category: 'manual', confidence, fallback: true };
    }
    return { category, confidence, fallback: false };
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
