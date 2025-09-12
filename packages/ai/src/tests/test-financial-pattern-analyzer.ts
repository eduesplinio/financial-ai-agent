import { FinancialPatternAnalyzer } from '../financial/pattern-analyzer';
import type { Transaction } from '../../../open-finance/src/types';

// Mock data
const mockTransactions: Transaction[] = [
  {
    transactionId: '001',
    accountId: 'acc001',
    type: 'PIX',
    creditDebitType: 'CREDIT',
    transactionAmount: 3000,
    currency: 'BRL',
    transactionDate: '2025-08-01',
    valueDate: '2025-08-01',
    description: 'Salário',
    status: 'COMPLETED',
    category: 'Salário',
  },
  {
    transactionId: '002',
    accountId: 'acc001',
    type: 'PIX',
    creditDebitType: 'DEBIT',
    transactionAmount: -800,
    currency: 'BRL',
    transactionDate: '2025-08-05',
    valueDate: '2025-08-05',
    description: 'Aluguel',
    status: 'COMPLETED',
    category: 'Moradia',
  },
  {
    transactionId: '003',
    accountId: 'acc001',
    type: 'PAYMENT',
    creditDebitType: 'DEBIT',
    transactionAmount: -400,
    currency: 'BRL',
    transactionDate: '2025-08-08',
    valueDate: '2025-08-08',
    description: 'Supermercado',
    status: 'COMPLETED',
    category: 'Alimentação',
  },
  {
    transactionId: '004',
    accountId: 'acc001',
    type: 'PAYMENT',
    creditDebitType: 'DEBIT',
    transactionAmount: -200,
    currency: 'BRL',
    transactionDate: '2025-08-15',
    valueDate: '2025-08-15',
    description: 'Internet',
    status: 'COMPLETED',
    category: 'Serviços',
  },
  {
    transactionId: '005',
    accountId: 'acc001',
    type: 'PAYMENT',
    creditDebitType: 'DEBIT',
    transactionAmount: -100,
    currency: 'BRL',
    transactionDate: '2025-08-20',
    valueDate: '2025-08-20',
    description: 'Jantar fora',
    status: 'COMPLETED',
    category: 'Alimentação',
  },
];

// Mock do mês anterior com variação para teste de tendências
const mockPreviousTransactions: Transaction[] = [
  {
    transactionId: '006',
    accountId: 'acc001',
    type: 'PIX',
    creditDebitType: 'CREDIT',
    transactionAmount: 2800,
    currency: 'BRL',
    transactionDate: '2025-07-01',
    valueDate: '2025-07-01',
    description: 'Salário',
    status: 'COMPLETED',
    category: 'Salário',
  },
  {
    transactionId: '007',
    accountId: 'acc001',
    type: 'PIX',
    creditDebitType: 'DEBIT',
    transactionAmount: -800,
    currency: 'BRL',
    transactionDate: '2025-07-05',
    valueDate: '2025-07-05',
    description: 'Aluguel',
    status: 'COMPLETED',
    category: 'Moradia',
  },
  {
    transactionId: '008',
    accountId: 'acc001',
    type: 'PAYMENT',
    creditDebitType: 'DEBIT',
    transactionAmount: -300,
    currency: 'BRL',
    transactionDate: '2025-07-10',
    valueDate: '2025-07-10',
    description: 'Supermercado',
    status: 'COMPLETED',
    category: 'Alimentação',
  },
  {
    transactionId: '009',
    accountId: 'acc001',
    type: 'PAYMENT',
    creditDebitType: 'DEBIT',
    transactionAmount: -200,
    currency: 'BRL',
    transactionDate: '2025-07-12',
    valueDate: '2025-07-12',
    description: 'Internet',
    status: 'COMPLETED',
    category: 'Serviços',
  },
];

// Mock de benchmarks do mercado
const mockBenchmarks = {
  Moradia: {
    average: 1000,
    median: 900,
    percentiles: [500, 700, 850, 950, 1100, 1300, 1500, 1800, 2000, 3000],
  },
  Alimentação: {
    average: 600,
    median: 550,
    percentiles: [300, 400, 500, 550, 600, 650, 700, 800, 1000, 1500],
  },
  Serviços: {
    average: 350,
    median: 300,
    percentiles: [100, 150, 200, 250, 300, 350, 400, 500, 700, 1000],
  },
};

describe('FinancialPatternAnalyzer', () => {
  let analyzer: FinancialPatternAnalyzer;

  beforeEach(() => {
    analyzer = new FinancialPatternAnalyzer();
  });

  test('calcula corretamente métricas por categoria', () => {
    const expenses = mockTransactions.filter(
      t => t.creditDebitType === 'DEBIT'
    );
    const totalExpenses = expenses.reduce(
      (sum, t) => sum + Math.abs(t.transactionAmount),
      0
    );

    const metrics = analyzer.calculateCategoryMetrics(expenses, totalExpenses);

    expect(metrics).toHaveLength(3); // Moradia, Alimentação, Serviços

    // Verifica a categoria 'Alimentação'
    const foodCategory = metrics.find(m => m.category === 'Alimentação');
    expect(foodCategory).toBeDefined();
    expect(foodCategory?.totalAmount).toBe(500); // 400 + 100
    expect(foodCategory?.transactionCount).toBe(2);
    expect(foodCategory?.averageAmount).toBe(250); // 500 / 2
    expect(foodCategory?.percentOfTotal).toBeCloseTo(33.33, 1); // (500 / 1500) * 100
  });

  test('calcula corretamente resumo financeiro do período', () => {
    const startDate = new Date('2025-08-01');
    const endDate = new Date('2025-08-31');

    const summary = analyzer.calculateFinancialSummary(
      mockTransactions,
      startDate,
      endDate,
      mockPreviousTransactions
    );

    expect(summary.totalIncome).toBe(3000);
    expect(summary.totalExpenses).toBe(1500);
    expect(summary.netCashFlow).toBe(1500);
    expect(summary.savingsRate).toBe(50); // (3000 - 1500) / 3000 * 100
    expect(summary.largestExpenseCategory).toBe('Moradia');
    expect(summary.largestExpenseAmount).toBe(800);

    // Verifica tendências
    expect(summary.trends.incomeChange).toBeCloseTo(7.14, 1); // ((3000 - 2800) / 2800) * 100
  });

  test('detecta mudanças significativas nos padrões', () => {
    const currentSummary = {
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-31'),
      totalIncome: 3000,
      totalExpenses: 1500,
      netCashFlow: 1500,
      savingsRate: 50,
      largestExpenseCategory: 'Moradia',
      largestExpenseAmount: 800,
      expensesByCategory: [
        {
          category: 'Moradia',
          totalAmount: 800,
          transactionCount: 1,
          averageAmount: 800,
          percentOfTotal: 53.33,
        },
        {
          category: 'Alimentação',
          totalAmount: 500,
          transactionCount: 2,
          averageAmount: 250,
          percentOfTotal: 33.33,
        },
      ],
      incomeByCategory: [
        {
          category: 'Salário',
          totalAmount: 3000,
          transactionCount: 1,
          averageAmount: 3000,
          percentOfTotal: 100,
        },
      ],
      trends: {
        incomeChange: 7.14,
        expenseChange: 0,
        netCashFlowChange: 0,
      },
    };

    const previousSummary = {
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-31'),
      totalIncome: 2800,
      totalExpenses: 1300,
      netCashFlow: 1500,
      savingsRate: 50,
      largestExpenseCategory: 'Moradia',
      largestExpenseAmount: 800,
      expensesByCategory: [
        {
          category: 'Moradia',
          totalAmount: 800,
          transactionCount: 1,
          averageAmount: 800,
          percentOfTotal: 61.54,
        },
        {
          category: 'Alimentação',
          totalAmount: 300,
          transactionCount: 1,
          averageAmount: 300,
          percentOfTotal: 23.08,
        },
      ],
      incomeByCategory: [
        {
          category: 'Salário',
          totalAmount: 2800,
          transactionCount: 1,
          averageAmount: 2800,
          percentOfTotal: 100,
        },
      ],
      trends: {
        incomeChange: 0,
        expenseChange: 0,
        netCashFlowChange: 0,
      },
    };

    const changes = analyzer.detectPatternChanges(
      currentSummary,
      previousSummary,
      15
    );

    // Deve detectar aumento significativo em 'Alimentação'
    const foodChange = changes.find(
      c => c.type === 'category' && c.category === 'Alimentação'
    );
    expect(foodChange).toBeDefined();
    expect(foodChange?.percentChange).toBeCloseTo(66.67, 1); // ((500 - 300) / 300) * 100
    expect(foodChange?.isSignificant).toBe(true);
  });

  test('compara corretamente com benchmarks', () => {
    const summary = {
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-08-31'),
      totalIncome: 3000,
      totalExpenses: 1500,
      netCashFlow: 1500,
      savingsRate: 50,
      largestExpenseCategory: 'Moradia',
      largestExpenseAmount: 800,
      expensesByCategory: [
        {
          category: 'Moradia',
          totalAmount: 800,
          transactionCount: 1,
          averageAmount: 800,
          percentOfTotal: 53.33,
        },
        {
          category: 'Alimentação',
          totalAmount: 500,
          transactionCount: 2,
          averageAmount: 250,
          percentOfTotal: 33.33,
        },
      ],
      incomeByCategory: [],
      trends: {
        incomeChange: 0,
        expenseChange: 0,
        netCashFlowChange: 0,
      },
    };

    const benchmarks = analyzer.compareWithBenchmarks(summary, mockBenchmarks);

    expect(benchmarks).toHaveLength(2);

    // Verifica benchmark de moradia
    const housingBenchmark = benchmarks.find(b => b.category === 'Moradia');
    expect(housingBenchmark).toBeDefined();
    expect(housingBenchmark?.averageAmount).toBe(1000);
    expect(housingBenchmark?.medianAmount).toBe(900);
    expect(housingBenchmark?.comparison).toBe(-20); // ((800 - 1000) / 1000) * 100
  });

  test('gera relatório financeiro completo', () => {
    const startDate = new Date('2025-08-01');
    const endDate = new Date('2025-08-31');

    const report = analyzer.generateFinancialReport(
      mockTransactions,
      startDate,
      endDate,
      {
        previousPeriodTransactions: mockPreviousTransactions,
        includeBenchmarks: true,
        includeInsights: true,
        benchmarks: mockBenchmarks,
      }
    );

    expect(report.summary).toBeDefined();
    expect(report.patternChanges).toBeDefined();
    expect(report.patternChanges?.length).toBeGreaterThan(0);
    expect(report.benchmarks).toBeDefined();
    expect(report.insights).toBeDefined();
    expect(report.insights?.length).toBeGreaterThan(0);
  });
});
