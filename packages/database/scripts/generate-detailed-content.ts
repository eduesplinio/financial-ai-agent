/**
 * Generate detailed content for existing documents using GPT
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateDetailedContent(
  title: string,
  shortContent: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Você é um especialista em educação financeira. Expanda o conteúdo fornecido em um texto detalhado de 600-800 caracteres, mantendo linguagem clara e objetiva em português brasileiro.',
      },
      {
        role: 'user',
        content: `Título: ${title}\n\nConteúdo atual: ${shortContent}\n\nExpanda este conteúdo em um texto educativo detalhado de 600-800 caracteres.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || shortContent;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function expandAllDocuments() {
  console.log('🚀 Expanding all documents with detailed content...\n');

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    const docs = await collection.find({}).toArray();
    console.log(`📚 Found ${docs.length} documents to expand\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];

      try {
        console.log(`📝 [${i + 1}/${docs.length}] Expanding: "${doc.title}"`);
        console.log(`   Current length: ${doc.content.length} chars`);

        // Generate detailed content
        const detailedContent = await generateDetailedContent(
          doc.title,
          doc.content
        );
        console.log(`   New length: ${detailedContent.length} chars`);

        // Generate new embedding
        const textToEmbed = `${doc.title}\n\n${detailedContent}`;
        const embedding = await generateEmbedding(textToEmbed);

        // Update document
        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              content: detailedContent,
              embedding: embedding,
              'metadata.wordCount': detailedContent.split(' ').length,
              'metadata.readingTime': Math.ceil(
                detailedContent.split(' ').length / 200
              ),
              updatedAt: new Date(),
            },
          }
        );

        console.log(`   ✅ Updated\n`);
        successCount++;

        // Delay to avoid rate limits
        if ((i + 1) % 5 === 0) {
          console.log(`⏸️  Pausing... (${i + 1}/${docs.length} processed)\n`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error}\n`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully expanded: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    console.log('🎉 Expansion completed!');
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

if (require.main === module) {
  expandAllDocuments().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
