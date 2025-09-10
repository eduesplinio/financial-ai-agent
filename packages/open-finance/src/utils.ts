/**
 * Utilitários compartilhados para o pacote Open Finance
 */

/**
 * Serviço de logging simplificado
 */
export const logger = {
  info: (message: string) => console.info(`[OpenFinance] ${message}`),
  warn: (message: string) => console.warn(`[OpenFinance] ${message}`),
  error: (message: string) => console.error(`[OpenFinance] ${message}`),
  debug: (message: string) => console.debug(`[OpenFinance] ${message}`),
};
