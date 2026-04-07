import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

export async function getAuthorizedUserId(request: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  const devKey = process.env.LINIO_DEV_KEY;
  const headerKey = request.headers.get('x-linio-dev-key');
  const headerUserId = request.headers.get('x-linio-dev-userid');
  const headerEmail = request.headers.get('x-linio-dev-email');

  if (devKey && headerKey && headerKey === devKey) {
    if (headerUserId) return headerUserId;

    if (headerEmail) {
      const db = await getDatabase();
      const user = await db.collection('users').findOne(
        { email: headerEmail.toLowerCase() },
        { projection: { _id: 1 } }
      );
      if (user?._id) return user._id.toString();
    }
  }

  return null;
}
