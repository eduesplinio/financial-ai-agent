/**
 * Test script for Chat RAG Service
 * Tests integration with MongoDB collections
 */

import 'dotenv/config';
import { ChatRAGService } from '../lib/chat-rag-service';

async function testChatRAG() {
  console.log('🧪 Testing Chat RAG Service...\n');

  const chatService = new ChatRAGService();

  // Test user ID (replace with actual user ID from your database)
  const testUserId = '68c2a35df7eb84f5a4af8560';

  // Test 1: Question about financial concepts
  console.log('📝 Test 1: Question about financial concepts');
  console.log('Question: "O que é investimento?"');
  console.log('---');

  try {
    const generator = await chatService.processMessage(
      testUserId,
      'O que é investimento?'
    );
    for await (const chunk of generator) {
      if (chunk.type === 'chunk') {
        process.stdout.write(chunk.content);
      } else if (chunk.type === 'complete') {
        console.log('\n\n📚 Sources:');
        chunk.sources?.forEach(source => {
          console.log(`  - ${source.title}: ${source.url}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }

  console.log('\n\n---\n');

  // Test 2: Question about transactions
  console.log('📝 Test 2: Question about transactions');
  console.log('Question: "Quanto gastei em restaurantes?"');
  console.log('---');

  try {
    const generator = await chatService.processMessage(
      testUserId,
      'Quanto gastei em restaurantes?'
    );
    for await (const chunk of generator) {
      if (chunk.type === 'chunk') {
        process.stdout.write(chunk.content);
      } else if (chunk.type === 'complete') {
        console.log('\n\n📚 Sources:');
        chunk.sources?.forEach(source => {
          console.log(`  - ${source.title}: ${source.url}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Test 2 failed:', error);
  }

  console.log('\n\n---\n');

  // Test 3: Hybrid question
  console.log('📝 Test 3: Hybrid question (concepts + transactions)');
  console.log(
    'Question: "Como posso investir melhor considerando meus gastos?"'
  );
  console.log('---');

  try {
    const generator = await chatService.processMessage(
      testUserId,
      'Como posso investir melhor considerando meus gastos?'
    );
    for await (const chunk of generator) {
      if (chunk.type === 'chunk') {
        process.stdout.write(chunk.content);
      } else if (chunk.type === 'complete') {
        console.log('\n\n📚 Sources:');
        chunk.sources?.forEach(source => {
          console.log(`  - ${source.title}: ${source.url}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Test 3 failed:', error);
  }

  console.log('\n\n✅ All tests completed!');
}

testChatRAG().catch(console.error);
