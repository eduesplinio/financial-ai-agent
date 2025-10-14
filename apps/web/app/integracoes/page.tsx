import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';
import { IntegracoesClient } from './integracoes-client';

export const metadata: Metadata = {
  title: getPageTitle('integracoes'),
};

export default function IntegracoesPage() {
  return <IntegracoesClient />;
}
