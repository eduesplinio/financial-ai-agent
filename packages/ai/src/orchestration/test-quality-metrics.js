// Teste das métricas de qualidade do orquestrador
async function testQualityMetrics() {
  console.log('📊 Testando Sistema de Métricas de Qualidade\n');

  // Mock da classe QualityMonitor
  class QualityMonitor {
    constructor() {
      this.metrics = [];
    }

    recordMetric(metric) {
      this.metrics.push({
        ...metric,
        timestamp: new Date(),
      });
    }

    calculateRelevanceScore(query, response, nlpResult) {
      let score = 0.5; // Base score

      // Bonus por entidades extraídas
      if (nlpResult.entities && Object.keys(nlpResult.entities).length > 0) {
        score += 0.2;
      }

      // Bonus por confiança do NLP
      if (nlpResult.confidence && nlpResult.confidence > 0.7) {
        score += 0.15;
      }

      // Bonus por resultados RAG relevantes
      if (response.data?.results && response.data.results.length > 0) {
        const avgRAGScore =
          response.data.results.reduce(
            (sum, result) => sum + (result.score || 0),
            0
          ) / response.data.results.length;
        score += avgRAGScore * 0.15;
      }

      return Math.min(1.0, score);
    }

    getMetricsSummary() {
      if (this.metrics.length === 0) {
        return {
          totalQueries: 0,
          averageResponseTime: 0,
          averageConfidence: 0,
          successRate: 0,
          topSources: [],
        };
      }

      const totalQueries = this.metrics.length;
      const averageResponseTime =
        this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalQueries;
      const averageConfidence =
        this.metrics.reduce((sum, m) => sum + m.confidence, 0) / totalQueries;
      const successRate =
        this.metrics.filter(m => m.errorRate === 0).length / totalQueries;

      // Top sources
      const sourceMap = new Map();
      this.metrics.forEach(metric => {
        metric.sourcesUsed.forEach(source => {
          if (!sourceMap.has(source)) {
            sourceMap.set(source, { count: 0, totalConfidence: 0 });
          }
          const sourceData = sourceMap.get(source);
          sourceData.count++;
          sourceData.totalConfidence += metric.confidence;
        });
      });

      const topSources = Array.from(sourceMap.entries())
        .map(([source, data]) => ({
          source,
          count: data.count,
          avgConfidence: data.totalConfidence / data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        totalQueries,
        averageResponseTime: Math.round(averageResponseTime),
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        successRate: Math.round(successRate * 100) / 100,
        topSources,
      };
    }

    getAlerts() {
      const alerts = [];
      if (this.metrics.length === 0) return alerts;

      const recent = this.metrics.slice(-10);
      const avgConfidence =
        recent.reduce((sum, m) => sum + m.confidence, 0) / recent.length;

      if (avgConfidence < 0.5) {
        alerts.push({
          type: 'low-confidence',
          message: `Confiança média baixa: ${Math.round(avgConfidence * 100)}%`,
          severity: 'high',
        });
      }

      const avgResponseTime =
        recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;
      if (avgResponseTime > 2000) {
        alerts.push({
          type: 'slow-response',
          message: `Tempo de resposta alto: ${Math.round(avgResponseTime)}ms`,
          severity: 'medium',
        });
      }

      return alerts;
    }
  }

  // Simular orquestrador com métricas
  const monitor = new QualityMonitor();

  // Simular diferentes cenários de consultas
  const testScenarios = [
    {
      query: 'Como investir em renda fixa?',
      nlpResult: {
        type: 'informacao',
        confidence: 0.85,
        entities: { categorias: ['investimento'] },
      },
      response: {
        data: {
          results: [
            { score: 0.92, document: { title: 'Renda Fixa' } },
            { score: 0.78, document: { title: 'Investimentos' } },
          ],
        },
      },
      responseTime: 450,
      source: 'rag-system',
    },
    {
      query: 'Qual meu saldo?',
      nlpResult: { type: 'informacao', confidence: 0.9, entities: {} },
      response: { data: { balance: 'R$ 1.500,00' } },
      responseTime: 120,
      source: 'account-service',
    },
    {
      query: 'Como economizar dinheiro?',
      nlpResult: {
        type: 'recomendacao',
        confidence: 0.75,
        entities: { categorias: ['economia'] },
      },
      response: {
        data: {
          results: [{ score: 0.65, document: { title: 'Dicas de Economia' } }],
        },
      },
      responseTime: 680,
      source: 'rag-system',
    },
    {
      query: 'Transferir R$ 200 para João',
      nlpResult: {
        type: 'informacao',
        confidence: 0.95,
        entities: { valores: ['R$ 200'], pessoas: ['João'] },
      },
      response: { data: { status: 'success' } },
      responseTime: 1200,
      source: 'transaction-service',
    },
    {
      query: 'Texto confuso sem sentido',
      nlpResult: { type: 'informacao', confidence: 0.25, entities: {} },
      response: { data: { message: 'Não entendi' } },
      responseTime: 200,
      source: 'fallback',
    },
  ];

  console.log('⚡ Processando consultas e coletando métricas...\n');

  // Processar cada cenário
  testScenarios.forEach((scenario, index) => {
    console.log(`🔄 Consulta ${index + 1}: "${scenario.query}"`);

    const relevanceScore = monitor.calculateRelevanceScore(
      scenario.query,
      scenario.response,
      scenario.nlpResult
    );

    const metric = {
      responseTime: scenario.responseTime,
      confidence: scenario.nlpResult.confidence,
      relevanceScore: relevanceScore,
      sourcesUsed: [scenario.source],
      fallbacksTriggered: scenario.source === 'fallback' ? 1 : 0,
      errorRate: scenario.source === 'fallback' ? 0.1 : 0,
    };

    monitor.recordMetric(metric);

    console.log(`   ⏱️  Tempo: ${scenario.responseTime}ms`);
    console.log(
      `   🎯 Confiança: ${Math.round(scenario.nlpResult.confidence * 100)}%`
    );
    console.log(`   📈 Relevância: ${Math.round(relevanceScore * 100)}%`);
    console.log(`   🔧 Fonte: ${scenario.source}`);
    console.log('');
  });

  // Gerar relatório de métricas
  console.log('📋 RELATÓRIO DE QUALIDADE\n');
  const summary = monitor.getMetricsSummary();

  console.log(`📊 Total de consultas: ${summary.totalQueries}`);
  console.log(`⏰ Tempo médio de resposta: ${summary.averageResponseTime}ms`);
  console.log(
    `🎯 Confiança média: ${Math.round(summary.averageConfidence * 100)}%`
  );
  console.log(`✅ Taxa de sucesso: ${Math.round(summary.successRate * 100)}%`);

  if (summary.topSources.length > 0) {
    console.log(`\n🏆 TOP FONTES DE DADOS:`);
    summary.topSources.forEach((source, idx) => {
      console.log(
        `   ${idx + 1}. ${source.source}: ${source.count} consultas (${Math.round(source.avgConfidence * 100)}% confiança média)`
      );
    });
  }

  // Verificar alertas
  console.log('\n🚨 ALERTAS DE QUALIDADE:');
  const alerts = monitor.getAlerts();

  if (alerts.length === 0) {
    console.log('   ✅ Nenhum alerta de qualidade detectado');
  } else {
    alerts.forEach(alert => {
      const emoji =
        alert.severity === 'high'
          ? '🔴'
          : alert.severity === 'medium'
            ? '🟡'
            : '🟢';
      console.log(
        `   ${emoji} [${alert.severity.toUpperCase()}] ${alert.type}: ${alert.message}`
      );
    });
  }

  console.log('\n🎉 Teste de métricas de qualidade concluído!');
}

if (require.main === module) {
  testQualityMetrics().catch(console.error);
}
