#!/bin/bash
# Script para executar os testes simplificados de MongoDB

# Navegar até o diretório database
cd "$(dirname "$0")/../packages/database"

# Executa os testes usando o arquivo simplificado
npx jest src/__tests__/models.simple.test.ts --verbose

echo "Testes simplificados concluídos!"
