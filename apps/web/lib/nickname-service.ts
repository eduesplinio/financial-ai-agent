// Serviço avançado de apelidos - implementação futura
export class NicknameService {
  // Salvar preferência do usuário
  static async saveUserNickname(userId: string, nickname: string) {
    // Salvar no banco: user_preferences { user_id, preferred_nickname }
  }

  // Detectar apelido por contexto da conversa
  static detectNicknameFromMessage(message: string): string | null {
    const patterns = [
      /me chame de (\w+)/i,
      /pode me chamar de (\w+)/i,
      /meu nome é (\w+)/i,
      /sou o (\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Machine Learning approach (futuro)
  static async learnFromInteractions(userId: string, interactions: any[]) {
    // Analisar padrões de como a pessoa gosta de ser chamada
    // Treinar modelo baseado em feedback positivo/negativo
  }
}
