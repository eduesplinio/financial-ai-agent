import { KnowledgeBaseUpdater } from '../rag/knowledge-base-updater';
import { calculateQualityMetrics } from '../utils/quality-metrics';
import path from 'path';

describe('KnowledgeBaseUpdater - Quality Metrics', () => {
  const testFile = path.join(__dirname, 'fixtures', 'test.txt');
  const options = {
    watchDir: path.dirname(testFile),
    formats: ['txt'] as ('txt' | 'pdf' | 'html' | 'md')[],
    embeddingApiKey: 'sk-test', // Use a mock or test key
  };
  const updater = new KnowledgeBaseUpdater(options);

  it('should calculate quality metrics for a valid TXT file', async () => {
    const result = await updater.processFile(testFile, 'txt');
    expect(result.metrics).toBeDefined();
    expect(result.metrics.format).toBe('txt');
    expect(result.metrics.chunkCount).toBeGreaterThan(0);
    expect(result.metrics.coverage).toBeGreaterThan(0);
    expect(result.metrics.embeddingCompleteness).toBeGreaterThanOrEqual(0);
    expect(result.metrics.extractionSuccess).toBe(true);
  });

  it('should handle extraction error and set metrics accordingly', async () => {
    const result = await updater.processFile('nonexistent.txt', 'txt');
    expect(result.metrics.extractionSuccess).toBe(false);
    expect(result.metrics.chunkCount).toBe(0);
    expect(result.metrics.coverage).toBe(0);
    expect(result.metrics.embeddingCompleteness).toBe(0);
  });
});
