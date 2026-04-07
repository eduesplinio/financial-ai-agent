'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    PluggyConnect?: new (config: Record<string, unknown>) => {
      init: () => Promise<void>;
      destroy?: () => Promise<void>;
    };
  }
}

type ConnectClientPageProps = {
  sessionId: string;
  connectToken: string;
  redirectUri: string;
  institutionId: string;
  scriptURL: string;
};

export default function ConnectClientPage({
  sessionId,
  connectToken,
  redirectUri,
  scriptURL,
}: ConnectClientPageProps) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!sessionId || !connectToken || startedRef.current) {
      if (!sessionId || !connectToken) {
        window.location.replace(
          `${redirectUri}?status=error&message=${encodeURIComponent('Sessão inválida.')}`
        );
      }
      return;
    }

    startedRef.current = true;
    let destroyed = false;
    let instance: {
      init: () => Promise<void>;
      destroy?: () => Promise<void>;
    } | null = null;

    const finish = (url: string) => {
      if (!destroyed) {
        window.location.replace(url);
      }
    };

    const finalize = async (itemId: string) => {
      const response = await fetch('/v1/integrations/connect/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, itemId }),
      });
      const payload = await response.json();
      finish(
        payload.redirectURL || `${redirectUri}?status=success&itemId=${itemId}`
      );
    };

    const boot = async () => {
      await loadPluggyScript(scriptURL);
      if (!window.PluggyConnect) {
        finish(
          `${redirectUri}?status=error&message=${encodeURIComponent('Widget Pluggy indisponível.')}`
        );
        return;
      }

      instance = new window.PluggyConnect({
        connectToken,
        includeSandbox: false,
        allowFullscreen: true,
        onSuccess: async (payload: { item?: { id?: string } }) => {
          const itemId = payload?.item?.id;
          if (!itemId) {
            finish(
              `${redirectUri}?status=error&message=${encodeURIComponent('Item Pluggy ausente.')}`
            );
            return;
          }
          await finalize(itemId);
        },
        onError: async (error: {
          message?: string;
          data?: { item?: { id?: string } };
        }) => {
          const itemId = error?.data?.item?.id;
          if (itemId) {
            await finalize(itemId);
            return;
          }
          finish(
            `${redirectUri}?status=error&message=${encodeURIComponent(
              error?.message || 'Falha ao conectar conta.'
            )}`
          );
        },
        onClose: () => {
          finish(`${redirectUri}?status=cancelled`);
        },
      });

      await instance.init();
    };

    void boot();

    return () => {
      destroyed = true;
      void instance?.destroy?.();
    };
  }, [connectToken, redirectUri, scriptURL, sessionId]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f4f1ea',
        color: '#1f2937',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <p>Abrindo Pluggy Connect...</p>
    </main>
  );
}

async function loadPluggyScript(scriptURL: string) {
  if (window.PluggyConnect) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-pluggy-connect]'
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('script error')),
        {
          once: true,
        }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = scriptURL;
    script.async = true;
    script.dataset.pluggyConnect = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('script error'));
    document.head.appendChild(script);
  });
}
