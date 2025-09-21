# Configuração do Open Finance Brasil

Este documento explica como configurar a integração real com o Open Finance Brasil usando o ambiente sandbox.

## 🏦 O que é o Open Finance Brasil?

O Open Finance Brasil é uma iniciativa do Banco Central que permite o compartilhamento de dados financeiros entre instituições autorizadas, proporcionando maior transparência e competitividade no setor financeiro.

## 🔧 Configuração do Ambiente Sandbox

### 1. Obter Credenciais

Para usar o Open Finance Brasil, você precisa:

1. **Registrar-se no Portal Oficial**: https://portal.openfinancebrasil.com.br/
2. **Criar uma aplicação** no ambiente sandbox
3. **Obter credenciais** (Client ID e Client Secret)

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Open Finance Brasil - Sandbox Configuration
OPEN_FINANCE_CLIENT_ID=your-sandbox-client-id
OPEN_FINANCE_CLIENT_SECRET=your-sandbox-client-secret

# URLs do ambiente sandbox (oficiais)
OPEN_FINANCE_SANDBOX_BASE_URL=https://api.sandbox.openfinancebrasil.com.br
OPEN_FINANCE_SANDBOX_AUTH_URL=https://auth.sandbox.openfinancebrasil.com.br

# Configurações de desenvolvimento
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Instituições Suportadas

O sistema suporta as seguintes instituições financeiras:

- **Banco do Brasil** (001)
- **Caixa Econômica Federal** (104)
- **Bradesco** (237)
- **Itaú Unibanco** (341)
- **Santander** (033)
- **Nubank** (260)
- **Banco Inter** (077)
- **BTG Pactual** (208)

## 🚀 Como Funciona

### Fluxo OAuth2 Real

1. **Usuário clica em "Conectar"** em uma instituição
2. **Sistema cria consentimento** conforme especificação Open Finance
3. **Redireciona para autorização** da instituição financeira
4. **Usuário autoriza** o acesso aos dados
5. **Instituição retorna** com código de autorização
6. **Sistema troca código por token** de acesso
7. **Conta é conectada** e dados são sincronizados

### Scopes Disponíveis

- `openid`: Identificação do usuário
- `accounts`: Dados de contas bancárias
- `credit-cards-accounts`: Dados de cartões de crédito
- `customers`: Dados do cliente
- `consent`: Gerenciamento de consentimentos
- `investments`: Dados de investimentos (algumas instituições)

## 📊 Dados Disponíveis

### Contas Bancárias

- Saldo atual
- Limite disponível
- Histórico de transações
- Informações da conta

### Transações

- Valor e tipo
- Data e hora
- Categoria automática
- Descrição detalhada

### Cartões de Crédito

- Limite total
- Limite disponível
- Fatura atual
- Histórico de compras

## 🔒 Segurança e Conformidade

### LGPD Compliance

- Consentimento explícito do usuário
- Transparência no uso dos dados
- Direito ao esquecimento
- Portabilidade dos dados

### Segurança

- Tokens de acesso com expiração
- Refresh tokens automáticos
- Criptografia em trânsito e repouso
- Auditoria completa de acessos

## 🧪 Testando a Integração

### 1. Ambiente de Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
pnpm dev
```

### 2. Testar Conexão

1. Acesse `/integrations`
2. Clique em "Conectar" em qualquer instituição
3. Será redirecionado para a página de autorização
4. Autorize o acesso (ambiente sandbox)
5. Retornará com conta conectada

### 3. Verificar Dados

- Contas aparecerão na interface
- Transações serão sincronizadas
- Dados estarão disponíveis para análise

## 🐛 Troubleshooting

### Erro de Credenciais

```
Error: Invalid client credentials
```

**Solução**: Verifique se as credenciais estão corretas no `.env.local`

### Erro de Redirect URI

```
Error: Invalid redirect_uri
```

**Solução**: Certifique-se de que `NEXTAUTH_URL` está configurado corretamente

### Erro de Instituição

```
Error: Institution not supported
```

**Solução**: Verifique se a instituição está na lista de suportadas

## 📚 Recursos Adicionais

- [Documentação Oficial Open Finance](https://openfinancebrasil.org.br/)
- [Portal de Desenvolvedores](https://portal.openfinancebrasil.com.br/)
- [Especificações Técnicas](https://openfinancebrasil.org.br/documentacao/)
- [Ambiente Sandbox](https://sandbox.openfinancebrasil.com.br/)

## 🤝 Suporte

Para dúvidas sobre a implementação:

- Consulte a documentação do pacote `@financial-ai/open-finance`
- Verifique os logs do servidor para erros detalhados
- Teste com diferentes instituições para identificar problemas específicos
