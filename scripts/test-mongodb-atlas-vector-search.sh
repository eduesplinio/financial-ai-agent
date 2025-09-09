#!/bin/bash

# Script para testar especificamente o Vector Search no MongoDB Atlas
# Este script requer uma conexão com MongoDB Atlas com Vector Search habilitado

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navegar até o diretório database
cd "$(dirname "$0")/../packages/database"

# Cabeçalho
echo -e "${YELLOW}=======================================================${NC}"
echo -e "${YELLOW}     TESTANDO VECTOR SEARCH NO MONGODB ATLAS            ${NC}"
echo -e "${YELLOW}=======================================================${NC}"

# Carregar configurações do arquivo .env.test
echo -e "${BLUE}Usando configurações do arquivo .env.test${NC}"
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
  echo -e "${GREEN}Arquivo .env.test carregado com sucesso${NC}"
else
  echo -e "${YELLOW}Arquivo .env.test não encontrado, verificando variável MONGODB_URI${NC}"
  
  # Verificar variável de ambiente MONGODB_URI como fallback
  if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}ERRO: A variável de ambiente MONGODB_URI não está definida${NC}"
    echo -e "${BLUE}Por favor, defina MONGODB_URI apontando para um cluster MongoDB Atlas com Vector Search habilitado${NC}"
    exit 1
  fi
fi

# Verificar se a URI aponta para MongoDB Atlas
if [[ ! "$MONGODB_URI" == *"mongodb+srv"* ]]; then
  echo -e "${YELLOW}AVISO: A URI fornecida não parece ser do MongoDB Atlas (não contém mongodb+srv)${NC}"
  echo -e "${YELLOW}Vector Search só funciona com MongoDB Atlas. Continuando mesmo assim...${NC}"
fi

# Exibir informações sobre a conexão (sem mostrar a senha)
SAFE_URI=$(echo $MONGODB_URI | sed 's/:[^:]*@/:\\*\\*\\*@/')
echo -e "${BLUE}Conectando a: ${SAFE_URI}${NC}"

echo -e "${GREEN}Conectando ao MongoDB Atlas...${NC}"

# Executar testes específicos de Vector Search
echo -e "${GREEN}Executando testes de Vector Search...${NC}"

# Executar o teste simplificado de Vector Search
npx jest src/__tests__/vector-search.simple.test.ts --verbose || {
  echo -e "${RED}ERRO: Os testes de Vector Search falharam${NC}"
  exit 1
}

echo -e "${GREEN}Todos os testes de Vector Search foram concluídos com sucesso!${NC}"

# Para testar funcionalidades específicas, descomente as linhas abaixo
# echo -e "${GREEN}Testando criação do índice de Vector Search...${NC}"
# npx jest src/__tests__/vector-search.simple.test.ts -t "should create vector search index" --verbose

# echo -e "${GREEN}Testando pesquisa semântica...${NC}"
# npx jest src/__tests__/vector-search.simple.test.ts -t "should find documents by vector similarity" --verbose

echo -e "${YELLOW}=======================================================${NC}"
echo -e "${GREEN}TESTES DE VECTOR SEARCH CONCLUÍDOS COM SUCESSO!${NC}"
echo -e "${YELLOW}=======================================================${NC}"
