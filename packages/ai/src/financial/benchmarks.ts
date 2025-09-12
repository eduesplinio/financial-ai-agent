import { FinancialBenchmark } from './pattern-analyzer';

/**
 * Interface para o provedor de dados de benchmarks financeiros
 */
export interface BenchmarkProvider {
  /**
   * Obtém os dados de benchmark para uma categoria específica
   */
  getBenchmarkForCategory(
    category: string,
    options?: {
      region?: string;
      income?: number;
      familySize?: number;
      age?: number;
    }
  ): Promise<{
    average: number;
    median: number;
    percentiles: number[];
  } | null>;

  /**
   * Obtém dados de benchmark para múltiplas categorias
   */
  getBenchmarksForCategories(
    categories: string[],
    options?: {
      region?: string;
      income?: number;
      familySize?: number;
      age?: number;
    }
  ): Promise<
    Record<
      string,
      {
        average: number;
        median: number;
        percentiles: number[];
      }
    >
  >;
}

/**
 * Implementação de benchmarks estáticos para demonstração
 */
export class StaticBenchmarkProvider implements BenchmarkProvider {
  private benchmarkData: Record<
    string,
    {
      average: number;
      median: number;
      percentiles: number[];
    }
  > = {
    Moradia: {
      average: 1500,
      median: 1300,
      percentiles: [500, 750, 900, 1100, 1300, 1500, 1800, 2200, 2800, 4000],
    },
    Alimentação: {
      average: 800,
      median: 720,
      percentiles: [300, 400, 500, 600, 720, 800, 950, 1100, 1400, 2000],
    },
    Transporte: {
      average: 500,
      median: 450,
      percentiles: [150, 250, 350, 400, 450, 500, 600, 750, 950, 1500],
    },
    Lazer: {
      average: 350,
      median: 300,
      percentiles: [100, 150, 200, 250, 300, 350, 450, 600, 800, 1200],
    },
    Saúde: {
      average: 400,
      median: 350,
      percentiles: [100, 150, 200, 250, 350, 400, 500, 650, 900, 1500],
    },
    Educação: {
      average: 600,
      median: 500,
      percentiles: [0, 200, 300, 400, 500, 600, 800, 1000, 1500, 2500],
    },
    Serviços: {
      average: 300,
      median: 250,
      percentiles: [80, 120, 150, 200, 250, 300, 350, 450, 600, 900],
    },
    Investimentos: {
      average: 500,
      median: 350,
      percentiles: [0, 100, 200, 300, 350, 500, 700, 1000, 1500, 3000],
    },
    Dívidas: {
      average: 450,
      median: 400,
      percentiles: [0, 100, 200, 300, 400, 450, 600, 800, 1200, 2000],
    },
    Outros: {
      average: 200,
      median: 150,
      percentiles: [50, 80, 100, 120, 150, 200, 250, 350, 500, 800],
    },
  };

  /**
   * Ajusta os valores de benchmark com base nas opções fornecidas
   */
  private adjustBenchmark(
    benchmark: {
      average: number;
      median: number;
      percentiles: number[];
    },
    options?: {
      region?: string;
      income?: number;
      familySize?: number;
      age?: number;
    }
  ): {
    average: number;
    median: number;
    percentiles: number[];
  } {
    // Fatores de ajuste
    let regionFactor = 1.0;
    let incomeFactor = 1.0;
    let sizeFactor = 1.0;

    // Ajuste por região
    if (options?.region) {
      switch (options.region.toLowerCase()) {
        case 'sudeste':
          regionFactor = 1.2; // 20% mais caro
          break;
        case 'sul':
          regionFactor = 1.1; // 10% mais caro
          break;
        case 'nordeste':
          regionFactor = 0.9; // 10% mais barato
          break;
        case 'norte':
          regionFactor = 0.85; // 15% mais barato
          break;
        case 'centro-oeste':
          regionFactor = 1.0; // referência
          break;
        default:
          regionFactor = 1.0;
      }
    }

    // Ajuste por renda
    if (options?.income) {
      if (options.income > 15000) {
        incomeFactor = 1.5; // Renda alta
      } else if (options.income > 8000) {
        incomeFactor = 1.2; // Renda média-alta
      } else if (options.income > 4000) {
        incomeFactor = 1.0; // Renda média
      } else if (options.income > 2000) {
        incomeFactor = 0.8; // Renda média-baixa
      } else {
        incomeFactor = 0.6; // Renda baixa
      }
    }

    // Ajuste por tamanho da família
    if (options?.familySize) {
      sizeFactor = 0.7 + options.familySize * 0.15; // Base 0.7 + 15% por pessoa
    }

    // Calcula o fator composto
    const compositeFactor = regionFactor * incomeFactor * sizeFactor;

    // Aplica o fator composto
    return {
      average: benchmark.average * compositeFactor,
      median: benchmark.median * compositeFactor,
      percentiles: benchmark.percentiles.map(p => p * compositeFactor),
    };
  }

  /**
   * Obtém os dados de benchmark para uma categoria específica
   */
  async getBenchmarkForCategory(
    category: string,
    options?: {
      region?: string;
      income?: number;
      familySize?: number;
      age?: number;
    }
  ): Promise<{
    average: number;
    median: number;
    percentiles: number[];
  } | null> {
    // Busca os dados para a categoria
    const benchmark = this.benchmarkData[category];
    if (!benchmark) return null;

    // Retorna os dados ajustados
    return this.adjustBenchmark(benchmark, options);
  }

  /**
   * Obtém dados de benchmark para múltiplas categorias
   */
  async getBenchmarksForCategories(
    categories: string[],
    options?: {
      region?: string;
      income?: number;
      familySize?: number;
      age?: number;
    }
  ): Promise<
    Record<
      string,
      {
        average: number;
        median: number;
        percentiles: number[];
      }
    >
  > {
    const result: Record<
      string,
      {
        average: number;
        median: number;
        percentiles: number[];
      }
    > = {};

    for (const category of categories) {
      const benchmark = await this.getBenchmarkForCategory(category, options);
      if (benchmark) {
        result[category] = benchmark;
      }
    }

    return result;
  }
}

/**
 * Factory para criar provedores de benchmark
 */
export function createBenchmarkProvider(): BenchmarkProvider {
  // Por enquanto, retornamos apenas o provedor estático
  return new StaticBenchmarkProvider();
}
