import { Suspense } from 'react';
import ConnectClientPage from './ConnectClientPage';

type ConnectPageProps = {
  searchParams: {
    sessionId?: string;
    connectToken?: string;
    redirectUri?: string;
    institutionId?: string;
  };
};

export default function ConnectPage({ searchParams }: ConnectPageProps) {
  return (
    <Suspense fallback={<div />}>
      <ConnectClientPage
        sessionId={searchParams.sessionId || ''}
        connectToken={searchParams.connectToken || ''}
        redirectUri={
          searchParams.redirectUri || 'linio://integrations/callback'
        }
        institutionId={searchParams.institutionId || ''}
        scriptURL={
          process.env.NEXT_PUBLIC_PLUGGY_CONNECT_CDN ||
          'https://cdn.pluggy.ai/pluggy-connect/latest/pluggy-connect.js'
        }
      />
    </Suspense>
  );
}
