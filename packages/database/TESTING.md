# Guia de Testes do Módulo de Banco de Dados

Este documento complementa o README principal do pacote database e foca especificamente na execução e entendimento dos testes.

## Estrutura dos Testes

Os testes foram organizados da seguinte forma:

- `__tests__/connection.test.ts`: Testes da classe MongoDBConnection e suas funcionalidades
- `__tests__/models.simple.test.ts`: Testes dos modelos de dados sem aninhamento
- `__tests__/vector-search.test.ts`: Testes da funcionalidade de pesquisa vetorial (requer MongoDB Atlas)

## Execução dos Testes

### Testes Básicos (Localmente)

Para executar os testes básicos que não dependem do MongoDB Atlas:

```bash
# Na raiz do projeto
./scripts/test-mongodb-basic.sh
```

Este script executa os seguintes testes:

- Testes dos modelos de dados: 19 testes
- Testes da conexão: 9 testes

### Testes de Modelos

Os testes foram estruturados para evitar problemas com testes aninhados. O arquivo `models.simple.test.ts` contém todos os testes de modelos e é a referência principal para testes de banco de dados.

Para executar apenas estes testes:

```bash
npx jest packages/database/src/__tests__/models.simple.test.ts
```

Ou utilize o script:

```bash
./scripts/run-simple-tests.sh
```

### Testes de Vector Search

Os testes de pesquisa vetorial requerem um cluster MongoDB Atlas configurado com índices vetoriais. Para executar estes testes:

1. Configure as variáveis de ambiente necessárias:

```bash
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/database
VECTOR_SEARCH_INDEX=vector_index
```

2. Execute os testes específicos:

```bash
npx jest packages/database/src/__tests__/vector-search.test.ts
```

## Compreendendo a Cobertura de Testes

Atualmente, os testes cobrem:

1. **Conexão MongoDB**:
   - Criação e gerenciamento da instância singleton
   - Conexão e desconexão
   - Reconexão automática
   - Validação de URI e opções
   - Health checks

2. **Modelos de Dados**:
   - Criação, leitura, atualização e remoção (CRUD)
   - Validação de schema com Zod
   - Soft delete e restauração
   - Relacionamentos entre modelos

3. **Vector Search**:
   - Pesquisa semântica
   - Atualização de embeddings
   - Criação e gerenciamento de índices vetoriais

## Boas Práticas de Teste

Os testes foram refatorados seguindo estas boas práticas:

1. **Evitar Testes Aninhados**: Os testes foram simplificados para evitar problemas de contexto e execução com testes aninhados.

2. **Setup/Teardown Consistente**: Cada teste configura seu próprio ambiente e limpa após a execução.

3. **Testes Isolados**: Cada teste é independente e não depende do estado de outros testes.

4. **MongoDB Memory Server**: Os testes usam um servidor MongoDB em memória para simular o banco de dados real sem necessidade de conexão externa.

5. **Asserções Claras**: Cada teste tem asserções específicas e claras para facilitar o diagnóstico de problemas.

## Depuração de Falhas nos Testes

Se um teste falhar, siga estas etapas:

1. Verifique se o teste está sendo executado isoladamente:

```bash
npx jest -t "nome do teste" --verbose
```

2. Verifique se todas as dependências estão sendo configuradas corretamente antes do teste.

3. Certifique-se de que o teardown limpa adequadamente após o teste.

4. Para problemas relacionados ao MongoDB Atlas, verifique as credenciais e configurações do cluster.

## Conclusão

A implementação do MongoDB Atlas e dos modelos de dados foi validada com sucesso através dos testes. A estrutura atual garante a robustez do sistema em diferentes cenários de uso.

Para contribuições futuras, certifique-se de adicionar testes correspondentes para qualquer nova funcionalidade ou correção de bugs.
