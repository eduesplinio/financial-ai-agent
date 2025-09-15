import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URI!);

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  profile: z
    .object({
      riskTolerance: z
        .enum(['conservative', 'moderate', 'aggressive'])
        .optional(),
      financialGoals: z.array(z.string()).optional(),
      incomeRange: z.string().optional(),
      ageGroup: z.string().optional(),
      financialKnowledgeLevel: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .optional(),
      // Campos adicionais que podem vir do financialProfile
      monthlyIncome: z.number().min(0).optional(),
      spendingCategories: z
        .object({
          housing: z.number().min(0),
          food: z.number().min(0),
          transport: z.number().min(0),
          entertainment: z.number().min(0),
          healthcare: z.number().min(0),
          education: z.number().min(0),
          other: z.number().min(0),
        })
        .optional(),
      emergencyFund: z.number().min(0).optional(),
      investmentExperience: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .optional(),
    })
    .optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API Profile] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API Profile] Payload recebido:', body);

    const { name, email, profile } = updateProfileSchema.parse(body);

    await client.connect();
    console.log('[API Profile] Conexão com MongoDB estabelecida');

    const db = client.db();
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Profile] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await users.findOne({
        email,
        _id: { $ne: new ObjectId(userId) },
      });
      if (existingUser) {
        console.log('[API Profile] Email já em uso por outro usuário:', email);
        return NextResponse.json(
          { message: 'Este email já está sendo usado por outro usuário' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const updateData: any = {
      name,
      email,
      updatedAt: new Date(),
    };

    // Se profile foi fornecido, adicionar ao update e combinar com os dados do perfil financeiro
    if (profile) {
      console.log('[API Profile] Atualizando profile:', profile);

      // Verificar se existe dados anteriores no perfil
      if (userBefore?.profile) {
        console.log('[API Profile] Combinando com dados do profile existente');
        const existingProfile = userBefore.profile;

        // Preservar campos que não foram atualizados
        updateData.profile = {
          ...existingProfile,
          ...profile,
        };
      } else {
        updateData.profile = profile;
      }
    } else if (userBefore?.profile) {
      // Se não veio um novo profile mas já existe um, manter o existente
      console.log('[API Profile] Mantendo profile existente');
      updateData.profile = userBefore.profile;
    } else {
      // Criar um profile vazio se não existir
      console.log('[API Profile] Criando profile vazio');
      updateData.profile = {};
    }

    // Update user com os novos dados
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: updateData,
        // Remover o campo perfil se existir (transição para profile)
        $unset: { perfil: '' },
      }
    );

    console.log('[API Profile] Resultado da atualização:', result);

    // Buscar o usuário após a atualização para confirmar
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Profile] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}, Nome: ${updatedUser.name}`
        : 'Não encontrado'
    );
    console.log('[API Profile] Perfil após atualização:', updatedUser?.perfil);

    if (result.matchedCount === 0) {
      console.log(
        '[API Profile] Usuário não encontrado após tentativa de atualização'
      );
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    console.log('[API Profile] Perfil atualizado com sucesso');
    return NextResponse.json(
      { message: 'Perfil atualizado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
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
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const user = await users.findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { password: 0 } } // Exclude password from response
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
