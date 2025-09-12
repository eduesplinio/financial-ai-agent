import type { Transaction } from '../../../open-finance/src/types';
import {
  differenceInDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Tipos de frequência para análise
 */
export enum TimeFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/**
 * Interface para métricas financeiras por categoria
 */
export interface CategoryMetrics {
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentOfTotal: number;
  trend?: number; // % de aumento/diminuição em relação ao período anterior
}

/**
 * Interface para resumo financeiro de um período
 */
export interface FinancialSummary {
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number; // % de economia (receitas - despesas) / receitas
  largestExpenseCategory: string;
  largestExpenseAmount: number;
  expensesByCategory: CategoryMetrics[];
  incomeByCategory: CategoryMetrics[];
  trends: {
    incomeChange: number; // % em relação ao período anterior
    expenseChange: number; // % em relação ao período anterior
    netCashFlowChange: number; // % em relação ao período anterior
  };
}

/**
 * Interface para detectar mudanças significativas nos padrões
 */
export interface PatternChange {
  type: 'income' | 'expense' | 'category';
  category?: string;
  previousValue: number;
  currentValue: number;
  percentChange: number;
  isSignificant: boolean; // Mudança superior a um limiar (ex: 20%)
  message: string;
}

/**
 * Interface para benchmark financeiro
 */
export interface FinancialBenchmark {
  category: string;
  averageAmount: number; // Média do mercado para esta categoria
  medianAmount: number; // Mediana do mercado para esta categoria
  percentile: number; // Em qual percentil o usuário está (0-100)
  comparison: number; // % acima/abaixo da média do mercado
}

/**
 * Classe para análise de padrões financeiros
 */
export class FinancialPatternAnalyzer {
  /**
   * Calcula métricas financeiras por categoria
   */
  calculateCategoryMetrics(
    transactions: Transaction[],
    totalSum: number
  ): CategoryMetrics[] {
    // Agrupa transações por categoria
    const categorized: Record<string, { totalAmount: number; count: number }> =
      {};

    transactions.forEach(transaction => {
      const category = transaction.category || 'Não categorizado';
      const amount = Math.abs(transaction.transactionAmount);

      if (!categorized[category]) {
        categorized[category] = { totalAmount: 0, count: 0 };
      }

      categorized[category].totalAmount += amount;
      categorized[category].count += 1;
    });

    // Converte para array e calcula métricas adicionais
    return Object.entries(categorized).map(([category, data]) => ({
      category,
      totalAmount: data.totalAmount,
      transactionCount: data.count,
      averageAmount: data.totalAmount / data.count,
      percentOfTotal: (data.totalAmount / totalSum) * 100,
    }));
  }

  /**
   * Calcula resumo financeiro para um período específico
   */
  calculateFinancialSummary(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    previousPeriodTransactions?: Transaction[]
  ): FinancialSummary {
    // Filtra transações do período
    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Separa receitas e despesas
    const incomeTransactions = periodTransactions.filter(
      t => t.creditDebitType === 'CREDIT'
    );
    const expenseTransactions = periodTransactions.filter(
      t => t.creditDebitType === 'DEBIT'
    );

    // Calcula totais
    const totalIncome = incomeTransactions.reduce(
      (sum, t) => sum + t.transactionAmount,
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + Math.abs(t.transactionAmount),
      0
    );

    // Calcula métricas por categoria
    const expensesByCategory = this.calculateCategoryMetrics(
      expenseTransactions,
      totalExpenses
    );
    const incomeByCategory = this.calculateCategoryMetrics(
      incomeTransactions,
      totalIncome
    );

    // Encontra maior categoria de despesa
    let largestExpenseCategory = '';
    let largestExpenseAmount = 0;

    expensesByCategory.forEach(category => {
      if (category.totalAmount > largestExpenseAmount) {
        largestExpenseAmount = category.totalAmount;
        largestExpenseCategory = category.category;
      }
    });

    // Calcula tendências com base no período anterior
    const trends = { incomeChange: 0, expenseChange: 0, netCashFlowChange: 0 };

    if (previousPeriodTransactions) {
      const prevIncome = previousPeriodTransactions
        .filter(t => t.creditDebitType === 'CREDIT')
        .reduce((sum, t) => sum + t.transactionAmount, 0);

      const prevExpenses = previousPeriodTransactions
        .filter(t => t.creditDebitType === 'DEBIT')
        .reduce((sum, t) => sum + Math.abs(t.transactionAmount), 0);

      const prevNetCashFlow = prevIncome - prevExpenses;

      // Calcula variações percentuais
      trends.incomeChange = prevIncome
        ? ((totalIncome - prevIncome) / prevIncome) * 100
        : 0;
      trends.expenseChange = prevExpenses
        ? ((totalExpenses - prevExpenses) / prevExpenses) * 100
        : 0;

      const netCashFlow = totalIncome - totalExpenses;
      trends.netCashFlowChange =
        prevNetCashFlow && prevNetCashFlow !== 0
          ? ((netCashFlow - prevNetCashFlow) / Math.abs(prevNetCashFlow)) * 100
          : 0;
    }

    // Compila o resumo financeiro
    return {
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
      largestExpenseCategory,
      largestExpenseAmount,
      expensesByCategory,
      incomeByCategory,
      trends,
    };
  }

  /**
   * Calcula resumo financeiro mensal
   */
  calculateMonthlySummary(
    transactions: Transaction[],
    date: Date = new Date()
  ): FinancialSummary {
    const startOfCurrentMonth = startOfMonth(date);
    const endOfCurrentMonth = endOfMonth(date);

    // Calcula o período anterior para comparação
    const startOfPreviousMonth = startOfMonth(subMonths(date, 1));
    const endOfPreviousMonth = endOfMonth(subMonths(date, 1));

    // Filtra transações do mês anterior
    const previousMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate);
      return (
        transactionDate >= startOfPreviousMonth &&
        transactionDate <= endOfPreviousMonth
      );
    });

    return this.calculateFinancialSummary(
      transactions,
      startOfCurrentMonth,
      endOfCurrentMonth,
      previousMonthTransactions
    );
  }

  /**
   * Detecta mudanças significativas nos padrões financeiros
   */
  detectPatternChanges(
    currentSummary: FinancialSummary,
    previousSummary: FinancialSummary,
    thresholdPercent: number = 20
  ): PatternChange[] {
    const changes: PatternChange[] = [];

    // Verifica mudança na receita total
    const incomeChange = {
      type: 'income' as const,
      previousValue: previousSummary.totalIncome,
      currentValue: currentSummary.totalIncome,
      percentChange: previousSummary.totalIncome
        ? ((currentSummary.totalIncome - previousSummary.totalIncome) /
            previousSummary.totalIncome) *
          100
        : 0,
      isSignificant: false,
      message: '',
    };

    incomeChange.isSignificant =
      Math.abs(incomeChange.percentChange) >= thresholdPercent;
    incomeChange.message =
      incomeChange.percentChange > 0
        ? `Aumento significativo de receita: ${incomeChange.percentChange.toFixed(1)}%`
        : `Diminuição significativa de receita: ${Math.abs(incomeChange.percentChange).toFixed(1)}%`;

    if (incomeChange.isSignificant) {
      changes.push(incomeChange);
    }

    // Verifica mudança nas despesas totais
    const expenseChange = {
      type: 'expense' as const,
      previousValue: previousSummary.totalExpenses,
      currentValue: currentSummary.totalExpenses,
      percentChange: previousSummary.totalExpenses
        ? ((currentSummary.totalExpenses - previousSummary.totalExpenses) /
            previousSummary.totalExpenses) *
          100
        : 0,
      isSignificant: false,
      message: '',
    };

    expenseChange.isSignificant =
      Math.abs(expenseChange.percentChange) >= thresholdPercent;
    expenseChange.message =
      expenseChange.percentChange > 0
        ? `Aumento significativo de despesas: ${expenseChange.percentChange.toFixed(1)}%`
        : `Diminuição significativa de despesas: ${Math.abs(expenseChange.percentChange).toFixed(1)}%`;

    if (expenseChange.isSignificant) {
      changes.push(expenseChange);
    }

    // Verifica mudanças por categoria de despesa
    currentSummary.expensesByCategory.forEach(currentCat => {
      const previousCat = previousSummary.expensesByCategory.find(
        c => c.category === currentCat.category
      );

      if (previousCat && previousCat.totalAmount > 0) {
        const percentChange =
          ((currentCat.totalAmount - previousCat.totalAmount) /
            previousCat.totalAmount) *
          100;

        if (Math.abs(percentChange) >= thresholdPercent) {
          changes.push({
            type: 'category',
            category: currentCat.category,
            previousValue: previousCat.totalAmount,
            currentValue: currentCat.totalAmount,
            percentChange,
            isSignificant: true,
            message:
              percentChange > 0
                ? `Aumento significativo em ${currentCat.category}: ${percentChange.toFixed(1)}%`
                : `Diminuição significativa em ${currentCat.category}: ${Math.abs(percentChange).toFixed(1)}%`,
          });
        }
      }
    });

    return changes;
  }

  /**
   * Compara gastos com benchmarks do mercado
   * Os benchmarks são valores simulados para fins de demonstração
   */
  compareWithBenchmarks(
    summary: FinancialSummary,
    marketBenchmarks: Record<
      string,
      { average: number; median: number; percentiles: number[] }
    >
  ): FinancialBenchmark[] {
    const benchmarks: FinancialBenchmark[] = [];

    summary.expensesByCategory.forEach(category => {
      const benchmark = marketBenchmarks[category.category];

      if (benchmark) {
        // Calcula em qual percentil o gasto do usuário está
        let percentile = 0;
        if (benchmark && benchmark.percentiles) {
          for (let i = 0; i < benchmark.percentiles.length; i++) {
            const value = benchmark.percentiles?.[i];
            if (typeof value === 'number' && category.totalAmount <= value) {
              percentile = (i + 1) * 10; // Considerando que os percentiles são 10, 20, ..., 100
              break;
            }
          }
        }

        benchmarks.push({
          category: category.category,
          averageAmount: benchmark.average,
          medianAmount: benchmark.median,
          percentile,
          comparison:
            ((category.totalAmount - benchmark.average) / benchmark.average) *
            100,
        });
      }
    });

    return benchmarks;
  }

  /**
   * Gera insights proativos baseados na análise de padrões financeiros
   */
  generateInsights(
    summary: FinancialSummary,
    patternChanges: PatternChange[],
    benchmarks?: FinancialBenchmark[]
  ): string[] {
    const insights: string[] = [];

    // Analisa fluxo de caixa
    if (summary.netCashFlow < 0) {
      insights.push(
        `Alerta: Seu saldo financeiro está negativo em R$ ${Math.abs(summary.netCashFlow).toFixed(2)} neste período.`
      );
    } else if (summary.savingsRate < 10) {
      insights.push(
        `Sua taxa de economia está em ${summary.savingsRate.toFixed(1)}%, abaixo da meta recomendada de 20%.`
      );
    } else if (summary.savingsRate > 20) {
      insights.push(
        `Parabéns! Sua taxa de economia de ${summary.savingsRate.toFixed(1)}% está acima da meta recomendada.`
      );
    }

    // Analisa mudanças significativas
    patternChanges.forEach(change => {
      if (change.isSignificant) {
        insights.push(change.message);
      }
    });

    // Analisa distribuição de gastos
    const topExpenses = [...summary.expensesByCategory]
      .sort((a, b) => b.percentOfTotal - a.percentOfTotal)
      .slice(0, 3);

    if (
      topExpenses.length > 0 &&
      topExpenses[0] &&
      topExpenses[0].percentOfTotal > 40
    ) {
      insights.push(
        `${topExpenses[0].percentOfTotal.toFixed(1)}% dos seus gastos estão concentrados em "${topExpenses[0].category}".`
      );
    }

    // Compara com benchmarks
    if (benchmarks) {
      benchmarks.forEach(benchmark => {
        if (benchmark.comparison > 30) {
          insights.push(
            `Seus gastos em "${benchmark.category}" estão ${benchmark.comparison.toFixed(1)}% acima da média.`
          );
        } else if (benchmark.comparison < -30) {
          insights.push(
            `Seus gastos em "${benchmark.category}" estão ${Math.abs(benchmark.comparison).toFixed(1)}% abaixo da média.`
          );
        }
      });
    }

    return insights;
  }

  /**
   * Gera um relatório financeiro personalizado
   */
  generateFinancialReport(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    options?: {
      includeBenchmarks?: boolean;
      includeInsights?: boolean;
      previousPeriodTransactions?: Transaction[];
      benchmarks?: Record<
        string,
        { average: number; median: number; percentiles: number[] }
      >;
    }
  ): {
    summary: FinancialSummary;
    patternChanges?: PatternChange[];
    benchmarks?: FinancialBenchmark[];
    insights?: string[];
  } {
    const summary = this.calculateFinancialSummary(
      transactions,
      startDate,
      endDate,
      options?.previousPeriodTransactions
    );

    const result: {
      summary: FinancialSummary;
      patternChanges?: PatternChange[];
      benchmarks?: FinancialBenchmark[];
      insights?: string[];
    } = { summary };

    // Calcula mudanças de padrões se houver transações do período anterior
    if (options?.previousPeriodTransactions) {
      const previousPeriodEndDate = new Date(startDate);
      previousPeriodEndDate.setDate(previousPeriodEndDate.getDate() - 1);

      const previousPeriodStartDate = new Date(previousPeriodEndDate);
      previousPeriodStartDate.setDate(
        previousPeriodStartDate.getDate() - differenceInDays(endDate, startDate)
      );

      const previousSummary = this.calculateFinancialSummary(
        options.previousPeriodTransactions,
        previousPeriodStartDate,
        previousPeriodEndDate
      );

      result.patternChanges = this.detectPatternChanges(
        summary,
        previousSummary
      );
    }

    // Compara com benchmarks se solicitado
    if (options?.includeBenchmarks && options?.benchmarks) {
      result.benchmarks = this.compareWithBenchmarks(
        summary,
        options.benchmarks
      );
    }

    // Gera insights se solicitado
    if (options?.includeInsights) {
      result.insights = this.generateInsights(
        summary,
        result.patternChanges || [],
        result.benchmarks
      );
    }

    return result;
  }
}
