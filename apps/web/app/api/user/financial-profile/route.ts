import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient } from 'mongodb';
import { z } from 'zod';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const financialProfileSchema = z.object({
  monthlyIncome: z.number().min(0),
  spendingCategories: z.object({
    housing: z.number().min(0),
    food: z.number().min(0),
    transport: z.number().min(0),
    entertainment: z.number().min(0),
    healthcare: z.number().min(0),
    education: z.number().min(0),
    other: z.number().min(0),
  }),
  riskProfile: z.enum(['conservative', 'moderate', 'aggressive']),
  financialGoals: z.array(z.string()),
  emergencyFund: z.number().min(0),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const collection = db.collection('financial_profiles');

    const profile = await collection.findOne({ userId: session.user.id });

    await client.close();

    if (!profile) {
      // Retornar perfil padrão se não existir
      return NextResponse.json({
        monthlyIncome: 0,
        spendingCategories: {
          housing: 0,
          food: 0,
          transport: 0,
          entertainment: 0,
          healthcare: 0,
          education: 0,
          other: 0,
        },
        riskProfile: 'moderate',
        financialGoals: [],
        emergencyFund: 0,
        investmentExperience: 'beginner',
      });
    }

    // Remove campos internos do MongoDB
    const { _id, userId, ...profileData } = profile;
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching financial profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validar dados de entrada
    const validationResult = financialProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const collection = db.collection('financial_profiles');

    const profileData = {
      ...validationResult.data,
      userId: session.user.id,
      updatedAt: new Date(),
    };

    await collection.replaceOne({ userId: session.user.id }, profileData, {
      upsert: true,
    });

    await client.close();

    // Remove campos internos antes de retornar
    const { userId, updatedAt, ...responseData } = profileData;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating financial profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
