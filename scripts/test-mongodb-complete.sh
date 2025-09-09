#!/bin/bash
# Script para executar todos os testes do projeto MongoDB

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navegar até o diretório database
cd "$(dirname "$0")/../packages/database"

# Cabeçalho
echo -e "${YELLOW}=======================================================${NC}"
echo -e "${YELLOW}     EXECUTANDO TESTES DE BANCO DE DADOS MONGODB        ${NC}"
echo -e "${YELLOW}=======================================================${NC}"

# Executar todos os testes
echo -e "${GREEN}Executando testes simples (sem asserções complexas)...${NC}"
npx jest src/__tests__/models.simple.test.ts --verbose || {
  echo -e "${RED}Falha nos testes simples!${NC}"
  exit 1
}

echo -e "${GREEN}Executando testes de conexão...${NC}"
npx jest src/__tests__/connection.test.ts --verbose || {
  echo -e "${RED}Falha nos testes de conexão!${NC}"
  exit 1
}

echo -e "${GREEN}Executando testes de vector search...${NC}"
npx jest src/__tests__/vector-search.test.ts --verbose || {
  echo -e "${RED}Falha nos testes de vector search!${NC}"
  exit 1
}

# Mensagem final de sucesso
echo -e "${YELLOW}=======================================================${NC}"
echo -e "${GREEN}TODOS OS TESTES PASSARAM COM SUCESSO!${NC}"
echo -e "${YELLOW}=======================================================${NC}"

echo "A implementação do MongoDB Atlas está completa e validada."
