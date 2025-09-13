// Métricas de qualidade e monitoramento para o orquestrador de serviços
// Sistema de medição de performance, confiança e satisfação do usuário

export interface QualityMetrics {
  responseTime: number;
  confidence: number;
  relevanceScore: number;
  userSatisfaction?: number;
  sourcesUsed: string[];
  fallbacksTriggered: number;
  errorRate: number;
  timestamp: Date;
}

export interface MetricsSummary {
  totalQueries: number;
  averageResponseTime: number;
  averageConfidence: number;
  averageRelevance: number;
  successRate: number;
  topSources: Array<{ source: string; count: number; avgConfidence: number }>;
  qualityTrend: 'improving' | 'stable' | 'declining';
  period: {
    start: Date;
    end: Date;
  };
}

export class QualityMonitor {
  private metrics: QualityMetrics[] = [];
  private readonly maxStoredMetrics = 10000;

  recordMetric(metric: QualityMetrics): void {
    this.metrics.push({
      ...metric,
      timestamp: new Date(),
    });

    // Manter apenas as métricas mais recentes
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(-this.maxStoredMetrics);
    }
  }

  calculateRelevanceScore(
    query: string,
    response: any,
    nlpResult: any
  ): number {
    let score = 0.5; // Base score

    // Bonus por entidades extraídas correspondendo à resposta
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
          (sum: number, result: any) => sum + (result.score || 0),
          0
        ) / response.data.results.length;
      score += avgRAGScore * 0.15;
    }

    return Math.min(1.0, score);
  }

  getMetricsSummary(
    startDate: Date = new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: Date = new Date()
  ): MetricsSummary {
    const filteredMetrics = this.metrics.filter(
      m => m.timestamp >= startDate && m.timestamp <= endDate
    );

    if (filteredMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageResponseTime: 0,
        averageConfidence: 0,
        averageRelevance: 0,
        successRate: 0,
        topSources: [],
        qualityTrend: 'stable',
        period: { start: startDate, end: endDate },
      };
    }

    const totalQueries = filteredMetrics.length;
    const averageResponseTime =
      filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0) /
      totalQueries;

    const averageConfidence =
      filteredMetrics.reduce((sum, m) => sum + m.confidence, 0) / totalQueries;

    const averageRelevance =
      filteredMetrics.reduce((sum, m) => sum + m.relevanceScore, 0) /
      totalQueries;

    const successRate =
      filteredMetrics.filter(m => m.errorRate === 0).length / totalQueries;

    // Top sources
    const sourceMap = new Map<
      string,
      { count: number; totalConfidence: number }
    >();
    filteredMetrics.forEach(metric => {
      metric.sourcesUsed.forEach(source => {
        if (!sourceMap.has(source)) {
          sourceMap.set(source, { count: 0, totalConfidence: 0 });
        }
        const sourceData = sourceMap.get(source)!;
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
      .slice(0, 5);

    // Quality trend (simplificado)
    const qualityTrend = this.calculateQualityTrend(filteredMetrics);

    return {
      totalQueries,
      averageResponseTime,
      averageConfidence,
      averageRelevance,
      successRate,
      topSources,
      qualityTrend,
      period: { start: startDate, end: endDate },
    };
  }

  private calculateQualityTrend(
    metrics: QualityMetrics[]
  ): 'improving' | 'stable' | 'declining' {
    if (metrics.length < 10) return 'stable';

    const midPoint = Math.floor(metrics.length / 2);
    const firstHalf = metrics.slice(0, midPoint);
    const secondHalf = metrics.slice(midPoint);

    const avgConfidenceFirst =
      firstHalf.reduce((sum, m) => sum + m.confidence, 0) / firstHalf.length;
    const avgConfidenceSecond =
      secondHalf.reduce((sum, m) => sum + m.confidence, 0) / secondHalf.length;

    const difference = avgConfidenceSecond - avgConfidenceFirst;

    if (difference > 0.05) return 'improving';
    if (difference < -0.05) return 'declining';
    return 'stable';
  }

  getAlerts(): Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }> {
    const recent = this.metrics.slice(-100); // Últimas 100 consultas
    const alerts = [];

    if (recent.length === 0) return alerts;

    // Alert para baixa confiança
    const avgConfidence =
      recent.reduce((sum, m) => sum + m.confidence, 0) / recent.length;
    if (avgConfidence < 0.5) {
      alerts.push({
        type: 'low-confidence',
        message: `Confiança média muito baixa: ${(avgConfidence * 100).toFixed(1)}%`,
        severity: 'high' as const,
      });
    }

    // Alert para alto tempo de resposta
    const avgResponseTime =
      recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;
    if (avgResponseTime > 2000) {
      alerts.push({
        type: 'slow-response',
        message: `Tempo de resposta alto: ${avgResponseTime.toFixed(0)}ms`,
        severity: 'medium' as const,
      });
    }

    // Alert para alta taxa de erro
    const errorRate =
      recent.filter(m => m.errorRate > 0).length / recent.length;
    if (errorRate > 0.1) {
      alerts.push({
        type: 'high-error-rate',
        message: `Taxa de erro elevada: ${(errorRate * 100).toFixed(1)}%`,
        severity: 'high' as const,
      });
    }

    return alerts;
  }
}
