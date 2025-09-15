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

const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  marketing: z.boolean(),
  largeTransactions: z.boolean(),
  unusualSpending: z.boolean(),
  goalProgress: z.boolean(),
  budgetExceeded: z.boolean(),
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
    const collection = db.collection('notification_settings');

    const settings = await collection.findOne({ userId: session.user.id });

    await client.close();

    if (!settings) {
      // Retornar configurações padrão se não existir
      const defaultSettings = {
        email: true,
        push: true,
        marketing: false,
        largeTransactions: true,
        unusualSpending: true,
        goalProgress: true,
        budgetExceeded: true,
      };
      return NextResponse.json(defaultSettings);
    }

    // Remove campos internos do MongoDB
    const { _id, userId, ...settingsData } = settings;
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
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
    const validationResult = notificationSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const collection = db.collection('notification_settings');

    const settingsData = {
      ...validationResult.data,
      userId: session.user.id,
      updatedAt: new Date(),
    };

    await collection.replaceOne({ userId: session.user.id }, settingsData, {
      upsert: true,
    });

    await client.close();

    // Remove campos internos antes de retornar
    const { userId, updatedAt, ...responseData } = settingsData;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
