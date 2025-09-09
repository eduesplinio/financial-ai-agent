import { withRetry, calculateBackoff, RateLimiter, delay } from '../src/retry';

// Fazer mock da função de delay para não precisar realmente aguardar
jest.mock('../src/retry', () => {
  const originalModule = jest.requireActual('../src/retry');
  return {
    ...originalModule,
    delay: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Retry Logic', () => {
  test('calculateBackoff deve retornar valor dentro dos limites', () => {
    const baseDelay = 1000;
    const maxDelay = 10000;

    // Primeira tentativa
    const attempt1 = calculateBackoff(1, baseDelay, maxDelay);
    expect(attempt1).toBeGreaterThanOrEqual(baseDelay);
    expect(attempt1).toBeLessThanOrEqual(baseDelay * 2);

    // Terceira tentativa
    const attempt3 = calculateBackoff(3, baseDelay, maxDelay);
    expect(attempt3).toBeGreaterThanOrEqual(baseDelay * 4);
    expect(attempt3).toBeLessThanOrEqual(maxDelay);
  });

  test('withRetry deve repetir a função em caso de erro', async () => {
    const mockFn = jest.fn();

    // A função falha nas primeiras 2 chamadas e sucede na terceira
    mockFn
      .mockRejectedValueOnce(new Error('Falha 1'))
      .mockRejectedValueOnce(new Error('Falha 2'))
      .mockResolvedValueOnce('Sucesso');

    const onRetry = jest.fn();

    const result = await withRetry(mockFn, {
      maxRetries: 3,
      baseDelay: 100,
      onRetry,
      retryableErrors: ['Falha'],
    });

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(result).toBe('Sucesso');
  });

  test('withRetry deve lançar erro após exceder maxRetries', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Sempre falha'));

    await expect(
      withRetry(mockFn, {
        maxRetries: 2,
        baseDelay: 100,
        retryableErrors: ['Sempre falha'],
      })
    ).rejects.toThrow('Sempre falha');

    expect(mockFn).toHaveBeenCalledTimes(3); // Tentativa inicial + 2 retries
  });
});

describe('RateLimiter', () => {
  // Array para armazenar instâncias do RateLimiter que precisam ser limpas
  const limiters: RateLimiter[] = [];

  // Cleanup após todos os testes para garantir que não fiquem temporizadores ativos
  afterAll(() => {
    limiters.forEach(limiter => limiter.cleanup());
  });

  test('deve respeitar o limite de tokens', async () => {
    // Configurando o limiter com maxTokens=2
    const limiter = new RateLimiter({ maxTokens: 2 });
    limiters.push(limiter);

    // Criar spies para verificar se os métodos são chamados
    jest.spyOn(limiter, 'acquire'); // Adquirir tokens
    await limiter.acquire();
    await limiter.acquire();

    // Deveria ter consumido 2 tokens
    expect(limiter['tokenBucket']).toBe(0);

    // O próximo acquire deve ser enfileirado
    const promise = limiter.acquire();

    // Esse promise não deve resolver imediatamente
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    // Verificar que o promise não resolveu ainda
    await Promise.resolve();
    expect(resolved).toBe(false);

    // Simular reposição de tokens
    limiter['tokenBucket'] = 1;
    limiter['processQueue']();

    // Agora o promise deve resolver
    await promise;
    expect(resolved).toBe(true);
  });

  test('execute deve executar função após adquirir token', async () => {
    const limiter = new RateLimiter({ maxTokens: 1 });
    limiters.push(limiter);
    const mockFn = jest.fn().mockResolvedValue('resultado');

    // Espionar o método acquire
    jest.spyOn(limiter, 'acquire');

    // Executar função
    const result = await limiter.execute(mockFn);

    // Verificar que acquire foi chamado e a função mockFn também
    expect(limiter.acquire).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe('resultado');
  });
});
