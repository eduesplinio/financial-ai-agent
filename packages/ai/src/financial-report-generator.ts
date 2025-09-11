import {
  FinancialPatternAnalyzer,
  FinancialSummary,
  CategoryMetrics,
  FinancialBenchmark,
} from './financial-pattern-analyzer';
import type { Transaction } from '../../open-finance/src/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Tipos de formato para relatórios
 */
export enum ReportFormat {
  JSON = 'json',
  HTML = 'html',
  TEXT = 'text',
  CSV = 'csv',
}

/**
 * Interface de configuração para relatórios personalizados
 */
export interface ReportConfig {
  title?: string;
  includeIncome?: boolean;
  includeExpenses?: boolean;
  includeCategories?: boolean;
  includeTrends?: boolean;
  includeBenchmarks?: boolean;
  includeInsights?: boolean;
  periodDescription?: string;
  logo?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}

/**
 * Classe para geração de relatórios financeiros personalizados
 */
export class FinancialReportGenerator {
  private analyzer: FinancialPatternAnalyzer;

  constructor(analyzer: FinancialPatternAnalyzer) {
    this.analyzer = analyzer;
  }

  /**
   * Gera um relatório financeiro personalizado
   */
  generateReport(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    format: ReportFormat = ReportFormat.JSON,
    config: ReportConfig = {},
    options?: {
      previousPeriodTransactions?: Transaction[];
      benchmarks?: Record<
        string,
        { average: number; median: number; percentiles: number[] }
      >;
    }
  ): string {
    const reportOptions: {
      previousPeriodTransactions?: Transaction[];
      includeBenchmarks?: boolean;
      includeInsights?: boolean;
      benchmarks?: Record<
        string,
        { average: number; median: number; percentiles: number[] }
      >;
    } = {};

    if (options?.previousPeriodTransactions) {
      reportOptions.previousPeriodTransactions =
        options.previousPeriodTransactions;
    }

    if (options?.benchmarks && config.includeBenchmarks) {
      reportOptions.includeBenchmarks = true;
      reportOptions.benchmarks = options.benchmarks;
    }

    if (config.includeInsights) {
      reportOptions.includeInsights = true;
    }

    // Gera dados do relatório usando o analisador
    const report = this.analyzer.generateFinancialReport(
      transactions,
      startDate,
      endDate,
      reportOptions
    );

    // Formata o relatório de acordo com o formato solicitado
    switch (format) {
      case ReportFormat.HTML:
        return this.formatAsHTML(report, config);
      case ReportFormat.TEXT:
        return this.formatAsText(report, config);
      case ReportFormat.CSV:
        return this.formatAsCSV(report, config);
      case ReportFormat.JSON:
      default:
        return this.formatAsJSON(report, config);
    }
  }

  /**
   * Formata o relatório como JSON
   */
  private formatAsJSON(
    report: {
      summary: FinancialSummary;
      patternChanges?: any[];
      benchmarks?: FinancialBenchmark[];
      insights?: string[];
    },
    config: ReportConfig
  ): string {
    const result: any = {
      title: config.title || 'Relatório Financeiro',
      period: {
        startDate: format(report.summary.startDate, 'yyyy-MM-dd'),
        endDate: format(report.summary.endDate, 'yyyy-MM-dd'),
        description:
          config.periodDescription ||
          `${format(report.summary.startDate, 'dd/MM/yyyy')} a ${format(report.summary.endDate, 'dd/MM/yyyy')}`,
      },
    };

    if (config.includeIncome !== false) {
      result.income = {
        total: report.summary.totalIncome,
        byCategory: report.summary.incomeByCategory,
      };
    }

    if (config.includeExpenses !== false) {
      result.expenses = {
        total: report.summary.totalExpenses,
        byCategory: report.summary.expensesByCategory,
        largestCategory: {
          name: report.summary.largestExpenseCategory,
          amount: report.summary.largestExpenseAmount,
        },
      };
    }

    result.summary = {
      netCashFlow: report.summary.netCashFlow,
      savingsRate: report.summary.savingsRate,
    };

    if (config.includeTrends !== false && report.summary.trends) {
      result.trends = report.summary.trends;
    }

    if (config.includeBenchmarks && report.benchmarks) {
      result.benchmarks = report.benchmarks;
    }

    if (config.includeInsights && report.insights) {
      result.insights = report.insights;
    }

    return JSON.stringify(result, null, 2);
  }

  /**
   * Formata o relatório como HTML
   */
  private formatAsHTML(
    report: {
      summary: FinancialSummary;
      patternChanges?: any[];
      benchmarks?: FinancialBenchmark[];
      insights?: string[];
    },
    config: ReportConfig
  ): string {
    const primaryColor = config.branding?.primaryColor || '#1E40AF';
    const secondaryColor = config.branding?.secondaryColor || '#3B82F6';
    const fontFamily =
      config.branding?.fontFamily ||
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title || 'Relatório Financeiro'}</title>
  <style>
    body {
      font-family: ${fontFamily};
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .report-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .report-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 20px;
    }
    .report-header h1 {
      color: ${primaryColor};
      margin-bottom: 10px;
    }
    .report-period {
      color: #666;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .summary-box {
      background-color: ${primaryColor};
      color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
    }
    .summary-item {
      text-align: center;
    }
    .summary-item .label {
      font-size: 14px;
      opacity: 0.9;
    }
    .summary-item .value {
      font-size: 24px;
      font-weight: bold;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: ${primaryColor};
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background-color: ${secondaryColor};
      color: white;
      text-align: left;
      padding: 12px;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .chart-container {
      height: 300px;
      margin-bottom: 30px;
    }
    .insights-container {
      background-color: #f0f7ff;
      border-left: 4px solid ${primaryColor};
      padding: 15px;
      margin-bottom: 30px;
      border-radius: 0 8px 8px 0;
    }
    .insights-container p {
      margin: 8px 0;
    }
    .trend-positive {
      color: #10B981;
    }
    .trend-negative {
      color: #EF4444;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      ${config.logo ? `<img src="${config.logo}" alt="Logo" height="50">` : ''}
      <h1>${config.title || 'Relatório Financeiro'}</h1>
      <div class="report-period">${config.periodDescription || `Período: ${format(report.summary.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(report.summary.endDate, 'dd/MM/yyyy', { locale: ptBR })}`}</div>
    </div>
    
    <div class="summary-box">
      <div class="summary-item">
        <div class="label">Receitas</div>
        <div class="value">R$ ${report.summary.totalIncome.toLocaleString('pt-BR')}</div>
      </div>
      <div class="summary-item">
        <div class="label">Despesas</div>
        <div class="value">R$ ${report.summary.totalExpenses.toLocaleString('pt-BR')}</div>
      </div>
      <div class="summary-item">
        <div class="label">Saldo</div>
        <div class="value">R$ ${report.summary.netCashFlow.toLocaleString('pt-BR')}</div>
      </div>
      <div class="summary-item">
        <div class="label">Taxa de Economia</div>
        <div class="value">${report.summary.savingsRate.toFixed(1)}%</div>
      </div>
    </div>
`;

    // Seção de Insights
    if (
      config.includeInsights &&
      report.insights &&
      report.insights.length > 0
    ) {
      html += `
    <div class="section">
      <h2 class="section-title">Insights Financeiros</h2>
      <div class="insights-container">
        ${report.insights.map(insight => `<p>⚡ ${insight}</p>`).join('')}
      </div>
    </div>
`;
    }

    // Seção de Despesas
    if (config.includeExpenses !== false) {
      html += `
    <div class="section">
      <h2 class="section-title">Despesas por Categoria</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Valor</th>
            <th>% do Total</th>
            <th>Qtde. Transações</th>
          </tr>
        </thead>
        <tbody>
          ${report.summary.expensesByCategory
            .map(
              category => `
          <tr>
            <td>${category.category}</td>
            <td>R$ ${category.totalAmount.toLocaleString('pt-BR')}</td>
            <td>${category.percentOfTotal.toFixed(1)}%</td>
            <td>${category.transactionCount}</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
`;
    }

    // Seção de Receitas
    if (config.includeIncome !== false) {
      html += `
    <div class="section">
      <h2 class="section-title">Receitas por Categoria</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Valor</th>
            <th>% do Total</th>
            <th>Qtde. Transações</th>
          </tr>
        </thead>
        <tbody>
          ${report.summary.incomeByCategory
            .map(
              category => `
          <tr>
            <td>${category.category}</td>
            <td>R$ ${category.totalAmount.toLocaleString('pt-BR')}</td>
            <td>${category.percentOfTotal.toFixed(1)}%</td>
            <td>${category.transactionCount}</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
`;
    }

    // Seção de Tendências
    if (config.includeTrends !== false && report.summary.trends) {
      html += `
    <div class="section">
      <h2 class="section-title">Tendências</h2>
      <table>
        <thead>
          <tr>
            <th>Métrica</th>
            <th>Variação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Receitas</td>
            <td class="${report.summary.trends.incomeChange >= 0 ? 'trend-positive' : 'trend-negative'}">
              ${report.summary.trends.incomeChange >= 0 ? '↑' : '↓'} ${Math.abs(report.summary.trends.incomeChange).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Despesas</td>
            <td class="${report.summary.trends.expenseChange <= 0 ? 'trend-positive' : 'trend-negative'}">
              ${report.summary.trends.expenseChange <= 0 ? '↓' : '↑'} ${Math.abs(report.summary.trends.expenseChange).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Fluxo de Caixa</td>
            <td class="${report.summary.trends.netCashFlowChange >= 0 ? 'trend-positive' : 'trend-negative'}">
              ${report.summary.trends.netCashFlowChange >= 0 ? '↑' : '↓'} ${Math.abs(report.summary.trends.netCashFlowChange).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
`;
    }

    // Seção de Benchmarks
    if (
      config.includeBenchmarks &&
      report.benchmarks &&
      report.benchmarks.length > 0
    ) {
      html += `
    <div class="section">
      <h2 class="section-title">Comparação com a Média do Mercado</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Seu Gasto</th>
            <th>Média do Mercado</th>
            <th>Diferença</th>
          </tr>
        </thead>
        <tbody>
          ${report.benchmarks
            .map(
              benchmark => `
          <tr>
            <td>${benchmark.category}</td>
            <td>R$ ${(report.summary.expensesByCategory.find(c => c.category === benchmark.category)?.totalAmount || 0).toLocaleString('pt-BR')}</td>
            <td>R$ ${benchmark.averageAmount.toLocaleString('pt-BR')}</td>
            <td class="${benchmark.comparison <= 0 ? 'trend-positive' : 'trend-negative'}">
              ${benchmark.comparison <= 0 ? '↓' : '↑'} ${Math.abs(benchmark.comparison).toFixed(1)}%
            </td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
`;
    }

    html += `
    <div class="footer">
      Relatório gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
    </div>
  </div>
</body>
</html>
`;

    return html;
  }

  /**
   * Formata o relatório como texto simples
   */
  private formatAsText(
    report: {
      summary: FinancialSummary;
      patternChanges?: any[];
      benchmarks?: FinancialBenchmark[];
      insights?: string[];
    },
    config: ReportConfig
  ): string {
    const periodText =
      config.periodDescription ||
      `${format(report.summary.startDate, 'dd/MM/yyyy')} a ${format(report.summary.endDate, 'dd/MM/yyyy')}`;

    let text = `${config.title || 'RELATÓRIO FINANCEIRO'}\n`;
    text += `${'='.repeat((config.title || 'RELATÓRIO FINANCEIRO').length)}\n\n`;
    text += `Período: ${periodText}\n\n`;

    // Resumo geral
    text += `RESUMO\n------\n`;
    text += `Receitas: R$ ${report.summary.totalIncome.toLocaleString('pt-BR')}\n`;
    text += `Despesas: R$ ${report.summary.totalExpenses.toLocaleString('pt-BR')}\n`;
    text += `Saldo: R$ ${report.summary.netCashFlow.toLocaleString('pt-BR')}\n`;
    text += `Taxa de Economia: ${report.summary.savingsRate.toFixed(1)}%\n\n`;

    // Insights
    if (
      config.includeInsights &&
      report.insights &&
      report.insights.length > 0
    ) {
      text += `INSIGHTS\n--------\n`;
      report.insights.forEach(insight => {
        text += `* ${insight}\n`;
      });
      text += `\n`;
    }

    // Despesas por categoria
    if (config.includeExpenses !== false) {
      text += `DESPESAS POR CATEGORIA\n---------------------\n`;
      report.summary.expensesByCategory.forEach(category => {
        text += `${category.category}: R$ ${category.totalAmount.toLocaleString('pt-BR')} (${category.percentOfTotal.toFixed(1)}%)\n`;
      });
      text += `\n`;
    }

    // Receitas por categoria
    if (config.includeIncome !== false) {
      text += `RECEITAS POR CATEGORIA\n--------------------\n`;
      report.summary.incomeByCategory.forEach(category => {
        text += `${category.category}: R$ ${category.totalAmount.toLocaleString('pt-BR')} (${category.percentOfTotal.toFixed(1)}%)\n`;
      });
      text += `\n`;
    }

    // Tendências
    if (config.includeTrends !== false && report.summary.trends) {
      text += `TENDÊNCIAS\n----------\n`;
      text += `Receitas: ${report.summary.trends.incomeChange >= 0 ? '+' : ''}${report.summary.trends.incomeChange.toFixed(1)}%\n`;
      text += `Despesas: ${report.summary.trends.expenseChange >= 0 ? '+' : ''}${report.summary.trends.expenseChange.toFixed(1)}%\n`;
      text += `Fluxo de Caixa: ${report.summary.trends.netCashFlowChange >= 0 ? '+' : ''}${report.summary.trends.netCashFlowChange.toFixed(1)}%\n\n`;
    }

    // Benchmarks
    if (
      config.includeBenchmarks &&
      report.benchmarks &&
      report.benchmarks.length > 0
    ) {
      text += `COMPARAÇÃO COM O MERCADO\n------------------------\n`;
      report.benchmarks.forEach(benchmark => {
        text += `${benchmark.category}: ${benchmark.comparison <= 0 ? '-' : '+'}${Math.abs(benchmark.comparison).toFixed(1)}% em relação à média\n`;
      });
      text += `\n`;
    }

    text += `Relatório gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}\n`;

    return text;
  }

  /**
   * Formata o relatório como CSV
   */
  private formatAsCSV(
    report: {
      summary: FinancialSummary;
      patternChanges?: any[];
      benchmarks?: FinancialBenchmark[];
      insights?: string[];
    },
    config: ReportConfig
  ): string {
    let csv = '';

    // Informações gerais
    csv += 'Tipo,Valor\n';
    csv += `Período,${format(report.summary.startDate, 'dd/MM/yyyy')} a ${format(report.summary.endDate, 'dd/MM/yyyy')}\n`;
    csv += `Receitas,${report.summary.totalIncome}\n`;
    csv += `Despesas,${report.summary.totalExpenses}\n`;
    csv += `Saldo,${report.summary.netCashFlow}\n`;
    csv += `Taxa de Economia,${report.summary.savingsRate}\n\n`;

    // Despesas por categoria
    if (config.includeExpenses !== false) {
      csv += '\nDespesas por Categoria\n';
      csv += 'Categoria,Valor,Percentual,Quantidade de Transações\n';
      report.summary.expensesByCategory.forEach(category => {
        csv += `${category.category},${category.totalAmount},${category.percentOfTotal},${category.transactionCount}\n`;
      });
    }

    // Receitas por categoria
    if (config.includeIncome !== false) {
      csv += '\nReceitas por Categoria\n';
      csv += 'Categoria,Valor,Percentual,Quantidade de Transações\n';
      report.summary.incomeByCategory.forEach(category => {
        csv += `${category.category},${category.totalAmount},${category.percentOfTotal},${category.transactionCount}\n`;
      });
    }

    // Tendências
    if (config.includeTrends !== false && report.summary.trends) {
      csv += '\nTendências\n';
      csv += 'Métrica,Variação Percentual\n';
      csv += `Receitas,${report.summary.trends.incomeChange}\n`;
      csv += `Despesas,${report.summary.trends.expenseChange}\n`;
      csv += `Fluxo de Caixa,${report.summary.trends.netCashFlowChange}\n`;
    }

    // Benchmarks
    if (
      config.includeBenchmarks &&
      report.benchmarks &&
      report.benchmarks.length > 0
    ) {
      csv += '\nComparação com o Mercado\n';
      csv += 'Categoria,Seu Gasto,Média do Mercado,Diferença Percentual\n';
      report.benchmarks.forEach(benchmark => {
        const userAmount =
          report.summary.expensesByCategory.find(
            c => c.category === benchmark.category
          )?.totalAmount || 0;
        csv += `${benchmark.category},${userAmount},${benchmark.averageAmount},${benchmark.comparison}\n`;
      });
    }

    return csv;
  }
}
