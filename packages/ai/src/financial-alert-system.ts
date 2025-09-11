import {
  FinancialPatternAnalyzer,
  PatternChange,
  FinancialSummary,
} from './financial-pattern-analyzer';
import type { Transaction } from '../../open-finance/src/types';

/**
 * Interface de configuração de alertas financeiros
 */
export interface FinancialAlertConfig {
  thresholds: {
    expenseIncrease: number; // % de aumento considerado significativo
    incomeDecrease: number; // % de diminuição considerada significativa
    categoryVariation: number; // % de variação em categoria considerada significativa
    lowSavingsRate: number; // % abaixo da qual a taxa de economia gera alerta
    highCategoryConcentration: number; // % acima da qual a concentração em uma categoria gera alerta
  };
  benchmarkThreshold: number; // % acima do benchmark que gera alerta
  alertTypes: {
    expenseIncrease: boolean;
    incomeDecrease: boolean;
    categoryVariation: boolean;
    lowSavingsRate: boolean;
    highCategoryConcentration: boolean;
    benchmarkComparison: boolean;
  };
}

/**
 * Interface para alertas financeiros
 */
export interface FinancialAlert {
  id: string;
  userId: string;
  type:
    | 'expense_increase'
    | 'income_decrease'
    | 'category_variation'
    | 'low_savings_rate'
    | 'high_category_concentration'
    | 'benchmark_comparison';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  details: any;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
}

/**
 * Classe para gerenciar sistema de alertas financeiros
 */
export class FinancialAlertSystem {
  private analyzer: FinancialPatternAnalyzer;
  private config: FinancialAlertConfig;

  constructor(
    analyzer: FinancialPatternAnalyzer,
    config: FinancialAlertConfig
  ) {
    this.analyzer = analyzer;
    this.config = config;
  }

  /**
   * Gera alertas com base nas mudanças de padrões financeiros
   */
  generateAlerts(
    userId: string,
    currentSummary: FinancialSummary,
    previousSummary: FinancialSummary,
    patternChanges: PatternChange[],
    benchmarks?: any[]
  ): FinancialAlert[] {
    const alerts: FinancialAlert[] = [];
    const timestamp = new Date();

    // Alertas baseados em mudanças de padrão
    if (
      this.config.alertTypes.expenseIncrease ||
      this.config.alertTypes.incomeDecrease ||
      this.config.alertTypes.categoryVariation
    ) {
      patternChanges.forEach(change => {
        if (change.isSignificant) {
          if (
            change.type === 'expense' &&
            change.percentChange > 0 &&
            this.config.alertTypes.expenseIncrease
          ) {
            alerts.push({
              id: `expense_increase_${timestamp.getTime()}`,
              userId,
              type: 'expense_increase',
              severity:
                change.percentChange >
                this.config.thresholds.expenseIncrease * 1.5
                  ? 'critical'
                  : 'warning',
              message: `Aumento significativo de ${change.percentChange.toFixed(1)}% nas despesas totais`,
              details: {
                previousValue: change.previousValue,
                currentValue: change.currentValue,
                percentChange: change.percentChange,
              },
              timestamp,
              read: false,
              dismissed: false,
            });
          }

          if (
            change.type === 'income' &&
            change.percentChange < 0 &&
            this.config.alertTypes.incomeDecrease
          ) {
            alerts.push({
              id: `income_decrease_${timestamp.getTime()}`,
              userId,
              type: 'income_decrease',
              severity:
                Math.abs(change.percentChange) >
                this.config.thresholds.incomeDecrease * 1.5
                  ? 'critical'
                  : 'warning',
              message: `Diminuição significativa de ${Math.abs(change.percentChange).toFixed(1)}% na receita total`,
              details: {
                previousValue: change.previousValue,
                currentValue: change.currentValue,
                percentChange: change.percentChange,
              },
              timestamp,
              read: false,
              dismissed: false,
            });
          }

          if (
            change.type === 'category' &&
            this.config.alertTypes.categoryVariation
          ) {
            const severity =
              Math.abs(change.percentChange) >
              this.config.thresholds.categoryVariation * 2
                ? 'critical'
                : 'warning';
            const direction = change.percentChange > 0 ? 'aumento' : 'redução';

            alerts.push({
              id: `category_variation_${change.category}_${timestamp.getTime()}`,
              userId,
              type: 'category_variation',
              severity,
              message: `${direction.charAt(0).toUpperCase() + direction.slice(1)} significativo de ${Math.abs(change.percentChange).toFixed(1)}% na categoria "${change.category}"`,
              details: {
                category: change.category,
                previousValue: change.previousValue,
                currentValue: change.currentValue,
                percentChange: change.percentChange,
              },
              timestamp,
              read: false,
              dismissed: false,
            });
          }
        }
      });
    }

    // Alerta de baixa taxa de economia
    if (
      this.config.alertTypes.lowSavingsRate &&
      currentSummary.savingsRate < this.config.thresholds.lowSavingsRate
    ) {
      alerts.push({
        id: `low_savings_rate_${timestamp.getTime()}`,
        userId,
        type: 'low_savings_rate',
        severity: currentSummary.savingsRate < 0 ? 'critical' : 'warning',
        message:
          currentSummary.savingsRate < 0
            ? `Taxa de economia negativa: ${currentSummary.savingsRate.toFixed(1)}% (você está gastando mais do que ganha)`
            : `Taxa de economia baixa: ${currentSummary.savingsRate.toFixed(1)}% (recomendado: pelo menos ${this.config.thresholds.lowSavingsRate}%)`,
        details: {
          currentSavingsRate: currentSummary.savingsRate,
          recommendedRate: this.config.thresholds.lowSavingsRate,
          totalIncome: currentSummary.totalIncome,
          totalExpenses: currentSummary.totalExpenses,
        },
        timestamp,
        read: false,
        dismissed: false,
      });
    }

    // Alerta de alta concentração em uma categoria
    if (this.config.alertTypes.highCategoryConcentration) {
      const topExpenseCategory = [...currentSummary.expensesByCategory].sort(
        (a, b) => b.percentOfTotal - a.percentOfTotal
      )[0];

      if (
        topExpenseCategory &&
        topExpenseCategory.percentOfTotal >
          this.config.thresholds.highCategoryConcentration
      ) {
        alerts.push({
          id: `high_concentration_${topExpenseCategory.category}_${timestamp.getTime()}`,
          userId,
          type: 'high_category_concentration',
          severity:
            topExpenseCategory.percentOfTotal >
            this.config.thresholds.highCategoryConcentration * 1.5
              ? 'warning'
              : 'info',
          message: `Alta concentração de gastos: ${topExpenseCategory.percentOfTotal.toFixed(1)}% em "${topExpenseCategory.category}"`,
          details: {
            category: topExpenseCategory.category,
            percentOfTotal: topExpenseCategory.percentOfTotal,
            totalAmount: topExpenseCategory.totalAmount,
          },
          timestamp,
          read: false,
          dismissed: false,
        });
      }
    }

    // Alertas baseados em comparação com benchmarks
    if (this.config.alertTypes.benchmarkComparison && benchmarks) {
      benchmarks.forEach(benchmark => {
        if (benchmark.comparison > this.config.benchmarkThreshold) {
          alerts.push({
            id: `benchmark_${benchmark.category}_${timestamp.getTime()}`,
            userId,
            type: 'benchmark_comparison',
            severity:
              benchmark.comparison > this.config.benchmarkThreshold * 2
                ? 'warning'
                : 'info',
            message: `Seus gastos em "${benchmark.category}" estão ${benchmark.comparison.toFixed(1)}% acima da média do mercado`,
            details: {
              category: benchmark.category,
              userAmount: benchmark.userAmount,
              averageAmount: benchmark.averageAmount,
              percentAboveAverage: benchmark.comparison,
            },
            timestamp,
            read: false,
            dismissed: false,
          });
        }
      });
    }

    return alerts;
  }

  /**
   * Processa transações e gera alertas automaticamente
   */
  processTransactionsForAlerts(
    userId: string,
    currentTransactions: Transaction[],
    previousTransactions: Transaction[],
    options?: {
      startDate?: Date;
      endDate?: Date;
      benchmarks?: Record<
        string,
        { average: number; median: number; percentiles: number[] }
      >;
    }
  ): FinancialAlert[] {
    const startDate = options?.startDate || new Date();
    const endDate = options?.endDate || new Date();

    // Gera relatório financeiro completo
    const reportOptions: {
      previousPeriodTransactions?: Transaction[];
      includeBenchmarks?: boolean;
      includeInsights?: boolean;
      benchmarks?: Record<
        string,
        { average: number; median: number; percentiles: number[] }
      >;
    } = {
      previousPeriodTransactions: previousTransactions,
      includeInsights: false,
    };

    if (options?.benchmarks) {
      reportOptions.includeBenchmarks = true;
      reportOptions.benchmarks = options.benchmarks;
    }

    const report = this.analyzer.generateFinancialReport(
      currentTransactions,
      startDate,
      endDate,
      reportOptions
    );

    if (!report.patternChanges) {
      return [];
    }

    // Obtém o resumo do período anterior
    const previousPeriodEndDate = new Date(startDate);
    previousPeriodEndDate.setDate(previousPeriodEndDate.getDate() - 1);

    const previousPeriodStartDate = new Date(previousPeriodEndDate);
    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    previousPeriodStartDate.setDate(
      previousPeriodStartDate.getDate() - daysDiff
    );

    const previousSummary = this.analyzer.calculateFinancialSummary(
      previousTransactions,
      previousPeriodStartDate,
      previousPeriodEndDate
    );

    // Gera alertas baseados nas mudanças
    return this.generateAlerts(
      userId,
      report.summary,
      previousSummary,
      report.patternChanges,
      report.benchmarks
    );
  }
}
