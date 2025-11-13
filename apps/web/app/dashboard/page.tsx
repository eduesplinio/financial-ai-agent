import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getDashboardData } from '@/lib/server/dashboard-data';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: getPageTitle('dashboard'),
};

export const revalidate = 60;

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect('/auth/signin');
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="w-full px-4 lg:px-8 py-6">
        <DashboardClient data={data} />
      </div>
    </AuthGuard>
  );
}
