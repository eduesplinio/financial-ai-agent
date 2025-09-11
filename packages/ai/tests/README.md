# AI Package Tests

This folder contains all test scripts for the AI transaction processing modules (duplicate detection, anomaly detection, scoring, alerts, dashboard, etc).

## How to run the tests

1. Make sure you have all dependencies installed:

   ```sh
   pnpm install
   ```

2. Run any test file using tsx:

   ```sh
   npx tsx packages/ai/tests/<test-file>.ts
   ```

   Example:

   ```sh
   npx tsx packages/ai/tests/test-transaction-anomaly.ts
   ```

You can add more test files to this folder as needed. All tests are written in TypeScript and can be run independently.
