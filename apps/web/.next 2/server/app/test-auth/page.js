(() => {
  var e = {};
  ((e.id = 212),
    (e.ids = [212]),
    (e.modules = {
      38013: e => {
        'use strict';
        e.exports = require('mongodb');
      },
      47849: e => {
        'use strict';
        e.exports = require('next/dist/client/components/action-async-storage.external');
      },
      72934: e => {
        'use strict';
        e.exports = require('next/dist/client/components/action-async-storage.external.js');
      },
      55403: e => {
        'use strict';
        e.exports = require('next/dist/client/components/request-async-storage.external');
      },
      54580: e => {
        'use strict';
        e.exports = require('next/dist/client/components/request-async-storage.external.js');
      },
      94749: e => {
        'use strict';
        e.exports = require('next/dist/client/components/static-generation-async-storage.external');
      },
      45869: e => {
        'use strict';
        e.exports = require('next/dist/client/components/static-generation-async-storage.external.js');
      },
      20399: e => {
        'use strict';
        e.exports = require('next/dist/compiled/next-server/app-page.runtime.prod.js');
      },
      39491: e => {
        'use strict';
        e.exports = require('assert');
      },
      14300: e => {
        'use strict';
        e.exports = require('buffer');
      },
      6113: e => {
        'use strict';
        e.exports = require('crypto');
      },
      82361: e => {
        'use strict';
        e.exports = require('events');
      },
      13685: e => {
        'use strict';
        e.exports = require('http');
      },
      95687: e => {
        'use strict';
        e.exports = require('https');
      },
      63477: e => {
        'use strict';
        e.exports = require('querystring');
      },
      57310: e => {
        'use strict';
        e.exports = require('url');
      },
      73837: e => {
        'use strict';
        e.exports = require('util');
      },
      59796: e => {
        'use strict';
        e.exports = require('zlib');
      },
      56859: (e, s, r) => {
        'use strict';
        (r.r(s),
          r.d(s, {
            GlobalError: () => i.a,
            __next_app__: () => p,
            originalPathname: () => d,
            pages: () => u,
            routeModule: () => x,
            tree: () => c,
          }));
        var t = r(34701),
          n = r(36844),
          a = r(17688),
          i = r.n(a),
          o = r(52631),
          l = {};
        for (let e in o)
          0 >
            [
              'default',
              'tree',
              'pages',
              'GlobalError',
              'originalPathname',
              '__next_app__',
              'routeModule',
            ].indexOf(e) && (l[e] = () => o[e]);
        r.d(s, l);
        let c = [
            '',
            {
              children: [
                'test-auth',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(r.bind(r, 88911)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/test-auth/page.tsx',
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(r.t.bind(r, 36165, 23)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/layout.tsx',
              ],
              error: [
                () => Promise.resolve().then(r.bind(r, 39269)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx',
              ],
              loading: [
                () => Promise.resolve().then(r.bind(r, 83411)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx',
              ],
              'not-found': [
                () => Promise.resolve().then(r.bind(r, 39432)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx',
              ],
            },
          ],
          u = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/test-auth/page.tsx',
          ],
          d = '/test-auth/page',
          p = { require: r, loadChunk: () => Promise.resolve() },
          x = new t.AppPageRouteModule({
            definition: {
              kind: n.x.APP_PAGE,
              page: '/test-auth/page',
              pathname: '/test-auth',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: c },
          });
      },
      20449: (e, s, r) => {
        Promise.resolve().then(r.bind(r, 59121));
      },
      69557: (e, s, r) => {
        e.exports = r(53651);
      },
      88911: (e, s, r) => {
        'use strict';
        (r.r(s), r.d(s, { default: () => o }));
        var t = r(12475),
          n = r(41239),
          a = r(65657);
        async function i() {
          let e;
          let s = null;
          try {
            e = await (0, n.I8)();
          } catch (e) {
            s = e;
          }
          return (0, a.jsxs)('div', {
            className: 'container mx-auto py-8 px-4',
            children: [
              a.jsx('h1', {
                className: 'text-2xl font-bold mb-4',
                children: 'Teste de Autentica\xe7\xe3o',
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-4',
                children: [
                  (0, a.jsxs)('div', {
                    className: 'p-4 border rounded',
                    children: [
                      a.jsx('h2', {
                        className: 'font-semibold',
                        children: 'Status da Sess\xe3o:',
                      }),
                      a.jsx('p', {
                        children: e
                          ? '✅ Sess\xe3o encontrada'
                          : '❌ Nenhuma sess\xe3o',
                      }),
                    ],
                  }),
                  s &&
                    (0, a.jsxs)('div', {
                      className: 'p-4 border border-red-300 rounded bg-red-50',
                      children: [
                        a.jsx('h2', {
                          className: 'font-semibold text-red-600',
                          children: 'Erro:',
                        }),
                        a.jsx('pre', {
                          className: 'text-sm',
                          children: JSON.stringify(s, null, 2),
                        }),
                      ],
                    }),
                  e &&
                    (0, a.jsxs)('div', {
                      className:
                        'p-4 border border-green-300 rounded bg-green-50',
                      children: [
                        a.jsx('h2', {
                          className: 'font-semibold text-green-600',
                          children: 'Dados da Sess\xe3o:',
                        }),
                        a.jsx('pre', {
                          className: 'text-sm',
                          children: JSON.stringify(e, null, 2),
                        }),
                      ],
                    }),
                  (0, a.jsxs)('div', {
                    className: 'p-4 border rounded',
                    children: [
                      a.jsx('h2', {
                        className: 'font-semibold',
                        children: 'Vari\xe1veis de Ambiente:',
                      }),
                      (0, a.jsxs)('p', {
                        children: [
                          'NEXTAUTH_URL: ',
                          process.env.NEXTAUTH_URL || 'N\xe3o definida',
                        ],
                      }),
                      (0, a.jsxs)('p', {
                        children: [
                          'NEXTAUTH_SECRET:',
                          ' ',
                          process.env.NEXTAUTH_SECRET
                            ? 'Definida'
                            : 'N\xe3o definida',
                        ],
                      }),
                      (0, a.jsxs)('p', {
                        children: [
                          'MONGODB_URI: ',
                          process.env.MONGODB_URI
                            ? 'Definida'
                            : 'N\xe3o definida',
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
        }
        function o() {
          return a.jsx(t.a, { requiredRole: 'user', children: a.jsx(i, {}) });
        }
      },
      41239: (e, s, r) => {
        'use strict';
        r.d(s, { I8: () => p, Lz: () => d });
        var t = r(78892),
          n = r.n(t),
          a = r(21339),
          i = r(38013),
          o = r(42150),
          l = r.n(o);
        async function c() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new i.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let u = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, a.Z)({
                name: 'credentials',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  password: { label: 'Password', type: 'password' },
                },
                async authorize(e) {
                  if (!e?.email || !e?.password) return null;
                  try {
                    console.log('\uD83D\uDD10 Tentando autenticar:', e.email);
                    let { client: s, db: r } = await c(),
                      t = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!t || !t.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await s.close(),
                        null
                      );
                    if (!(await l().compare(e.password, t.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await s.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        t.email
                      ),
                      await s.close(),
                      {
                        id: t._id.toString(),
                        email: t.email,
                        name: t.name,
                        role: t.role || 'user',
                      }
                    );
                  } catch (e) {
                    return (
                      console.error('❌ Erro na autentica\xe7\xe3o:', e),
                      null
                    );
                  }
                },
              }),
            ],
            callbacks: {
              jwt: async ({ token: e, user: s, account: r }) => (
                s && ((e.id = s.id), (e.role = s.role)),
                e
              ),
              session: async ({ session: e, token: s }) => (
                e.user && ((e.user.id = s.id), (e.user.role = s.role)),
                e
              ),
              async redirect({ url: e, baseUrl: s }) {
                if (e.startsWith('/auth') || e === s || '/' === e)
                  return `${s}/dashboard`;
                if (e.startsWith('/')) return `${s}${e}`;
                try {
                  if (new URL(e).origin === s) return e;
                } catch (e) {
                  console.error('Erro ao analisar URL:', e);
                }
                return `${s}/dashboard`;
              },
            },
            pages: { signIn: '/auth/signin', error: '/auth/signin' },
            cookies: {
              sessionToken: {
                name: `${u ? '__Secure-' : ''}next-auth.session-token`,
                options: {
                  httpOnly: !0,
                  sameSite: 'lax',
                  path: '/',
                  secure: u,
                },
              },
            },
            debug: !1,
            logger: {
              error(e, s) {
                console.error('Auth error:', e, s);
              },
              warn(e) {
                console.warn('Auth warning:', e);
              },
              debug(e, s) {
                s
                  ? console.debug('Auth debug:', e, s)
                  : console.debug('Auth debug:', e);
              },
            },
            secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
          },
          { auth: p, signIn: x, signOut: m } = n()(d);
      },
      65657: (e, s, r) => {
        'use strict';
        e.exports = r(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var s = require('../../webpack-runtime.js');
  s.C(e);
  var r = e => s((s.s = e)),
    t = s.X(0, [775, 204, 286, 778, 751], () => r(56859));
  module.exports = t;
})();
