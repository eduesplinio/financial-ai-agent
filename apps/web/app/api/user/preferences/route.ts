import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import mongoose from 'mongoose';
// import { mongoConnection } from '@financial-ai/database';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['pt-BR', 'en-US']).optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      marketing: z.boolean().optional(),
      largeTransactions: z.boolean().optional(),
      unusualSpending: z.boolean().optional(),
      goalProgress: z.boolean().optional(),
      budgetExceeded: z.boolean().optional(),
      // Campos do modelo de dados atual
      sms: z.boolean().optional(),
      budgetAlerts: z.boolean().optional(),
      goalReminders: z.boolean().optional(),
      anomalyDetection: z.boolean().optional(),
    })
    .optional(),
  // Campos adicionais compatíveis com estrutura atual
  currency: z.string().optional(),
  timezone: z.string().optional(),
  privacy: z
    .object({
      dataSharing: z.boolean().optional(),
      analytics: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API Preferences] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API Preferences] Payload recebido:', body);

    const validatedData = preferencesSchema.parse(body);

    // MongoDB connection handled by mongoose
    console.log('[API Preferences] Conexão com MongoDB estabelecida');

    const db = mongoose.connection.db;

    // Atualizar diretamente na collection de usuários
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Preferences] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Preferences] Preferências antes:',
      userBefore?.preferences
    );

    // Atualizar o documento do usuário
    // Buscar dados atuais para fazer merge
    const currentUser = await users.findOne({ _id: new ObjectId(userId) });
    const currentPreferences = currentUser?.preferences || {};

    // Fazer merge dos dados atuais com os novos, com tratamento adequado para valores booleanos
    const mergedPreferences = {
      ...currentPreferences,
      // Não mesclar a raiz do objeto para evitar perda de estrutura
      // Se notifications foi fornecido no payload
      notifications: validatedData.notifications
        ? {
            // Mesclar com os valores existentes
            ...(currentPreferences.notifications || {}),
            // Sobrescrever com os novos valores, preservando valores false explícitos
            ...Object.entries(validatedData.notifications).reduce(
              (acc, [key, value]) => {
                // Apenas definir se o valor não for undefined
                if (value !== undefined) {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            ),
          }
        : currentPreferences.notifications,

      // Se privacy foi fornecido no payload
      privacy: validatedData.privacy
        ? {
            // Mesclar com os valores existentes
            ...(currentPreferences.privacy || {}),
            // Sobrescrever com os novos valores, preservando valores false explícitos
            ...Object.entries(validatedData.privacy).reduce(
              (acc, [key, value]) => {
                // Apenas definir se o valor não for undefined
                if (value !== undefined) {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            ),
          }
        : currentPreferences.privacy,

      // Preservar outros campos que possam ter sido fornecidos
      theme:
        validatedData.theme !== undefined
          ? validatedData.theme
          : currentPreferences.theme,
      language:
        validatedData.language !== undefined
          ? validatedData.language
          : currentPreferences.language,
      currency:
        validatedData.currency !== undefined
          ? validatedData.currency
          : currentPreferences.currency,
      timezone:
        validatedData.timezone !== undefined
          ? validatedData.timezone
          : currentPreferences.timezone,
    };

    const updateResult = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          preferences: mergedPreferences,
          updatedAt: new Date(),
        },
      }
    );

    console.log('[API Preferences] Resultado da atualização:', updateResult);

    // Buscar usuário após atualização para conferência
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Preferences] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}`
        : 'Não encontrado'
    );

    // Log detalhado das preferências atualizadas, focando em valores booleanos
    console.log('[API Preferences] Preferências após atualização:');
    console.log('- Objeto completo:', updatedUser?.preferences);

    if (updatedUser?.preferences?.notifications) {
      const notifications = updatedUser.preferences.notifications;
      console.log('- Notificações (detalhadas):');
      console.log('  email:', typeof notifications.email, notifications.email);
      console.log('  push:', typeof notifications.push, notifications.push);
      console.log(
        '  marketing:',
        typeof notifications.marketing,
        notifications.marketing
      );

      // Campos originais
      console.log(
        '  largeTransactions:',
        typeof notifications.largeTransactions,
        notifications.largeTransactions
      );
      console.log(
        '  unusualSpending:',
        typeof notifications.unusualSpending,
        notifications.unusualSpending
      );
      console.log(
        '  goalProgress:',
        typeof notifications.goalProgress,
        notifications.goalProgress
      );
      console.log(
        '  budgetExceeded:',
        typeof notifications.budgetExceeded,
        notifications.budgetExceeded
      );

      // Campos legados
      console.log(
        '  budgetAlerts:',
        typeof notifications.budgetAlerts,
        notifications.budgetAlerts
      );
      console.log(
        '  goalReminders:',
        typeof notifications.goalReminders,
        notifications.goalReminders
      );
      console.log(
        '  anomalyDetection:',
        typeof notifications.anomalyDetection,
        notifications.anomalyDetection
      );
      console.log('  sms:', typeof notifications.sms, notifications.sms);
    }

    if (updatedUser?.preferences?.privacy) {
      const privacy = updatedUser.preferences.privacy;
      console.log('- Privacy (detalhada):');
      console.log('  analytics:', typeof privacy.analytics, privacy.analytics);
      console.log('  marketing:', typeof privacy.marketing, privacy.marketing);
      console.log(
        '  dataSharing:',
        typeof privacy.dataSharing,
        privacy.dataSharing
      );
    }

    // Para compatibilidade, manter a atualização na tabela antiga também
    const preferences = db.collection('user_preferences');
    const result = await preferences.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userId,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    console.log('[API Preferences] Preferências salvas com sucesso');
    return NextResponse.json(
      {
        message: 'Preferências salvas com sucesso',
        preferences: validatedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Preferences save error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API Preferences GET] ID do usuário:', userId);
    console.log('[API Preferences GET] Sessão do usuário:', session);

    // MongoDB connection handled by mongoose
    console.log('[API Preferences GET] Conexão com MongoDB estabelecida');

    const db = mongoose.connection.db;

    // Primeiro buscar no documento do usuário
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    console.log(
      '[API Preferences GET] Usuário encontrado:',
      user ? `ID: ${user._id}, Email: ${user.email}` : 'Não encontrado'
    );

    if (user && user.preferences) {
      console.log(
        '[API Preferences GET] Preferências encontradas no documento do usuário:',
        user.preferences
      );

      // Log detalhado para debug
      if (user.preferences.notifications) {
        const notifications = user.preferences.notifications;
        console.log('[API Preferences GET] Notificações (detalhadas):');
        // Campos originais
        console.log(
          '  largeTransactions:',
          typeof notifications.largeTransactions,
          notifications.largeTransactions
        );
        console.log(
          '  unusualSpending:',
          typeof notifications.unusualSpending,
          notifications.unusualSpending
        );
        console.log(
          '  goalProgress:',
          typeof notifications.goalProgress,
          notifications.goalProgress
        );
        console.log(
          '  budgetExceeded:',
          typeof notifications.budgetExceeded,
          notifications.budgetExceeded
        );

        // Campos legados
        console.log(
          '  budgetAlerts:',
          typeof notifications.budgetAlerts,
          notifications.budgetAlerts
        );
        console.log(
          '  goalReminders:',
          typeof notifications.goalReminders,
          notifications.goalReminders
        );
        console.log(
          '  anomalyDetection:',
          typeof notifications.anomalyDetection,
          notifications.anomalyDetection
        );
      }

      return NextResponse.json(user.preferences, { status: 200 });
    }

    // Se não encontrar no documento principal, buscar na collection antiga
    console.log(
      '[API Preferences GET] Preferências não encontradas no documento do usuário, buscando na collection antiga'
    );
    const preferences = db.collection('user_preferences');
    const userPreferences = await preferences.findOne({
      userId: userId,
    });

    console.log(
      '[API Preferences GET] Resultado da busca na collection antiga:',
      userPreferences ? 'Encontrado' : 'Não encontrado'
    );

    if (!userPreferences) {
      // Retorna preferências padrão
      const defaultPreferences = {
        theme: 'system',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          marketing: false,
          largeTransactions: true,
          unusualSpending: true,
          goalProgress: true,
          budgetExceeded: true,
        },
      };

      console.log('[API Preferences GET] Retornando preferências padrão');
      return NextResponse.json(defaultPreferences, { status: 200 });
    }

    console.log(
      '[API Preferences GET] Retornando preferências da collection antiga'
    );
    return NextResponse.json(userPreferences, { status: 200 });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
