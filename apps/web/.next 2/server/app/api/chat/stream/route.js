'use strict';
(() => {
  var e = {};
  ((e.id = 480),
    (e.ids = [480]),
    (e.modules = {
      38013: e => {
        e.exports = require('mongodb');
      },
      72934: e => {
        e.exports = require('next/dist/client/components/action-async-storage.external.js');
      },
      54580: e => {
        e.exports = require('next/dist/client/components/request-async-storage.external.js');
      },
      45869: e => {
        e.exports = require('next/dist/client/components/static-generation-async-storage.external.js');
      },
      30517: e => {
        e.exports = require('next/dist/compiled/next-server/app-route.runtime.prod.js');
      },
      39491: e => {
        e.exports = require('assert');
      },
      14300: e => {
        e.exports = require('buffer');
      },
      6113: e => {
        e.exports = require('crypto');
      },
      82361: e => {
        e.exports = require('events');
      },
      13685: e => {
        e.exports = require('http');
      },
      95687: e => {
        e.exports = require('https');
      },
      63477: e => {
        e.exports = require('querystring');
      },
      57310: e => {
        e.exports = require('url');
      },
      73837: e => {
        e.exports = require('util');
      },
      59796: e => {
        e.exports = require('zlib');
      },
      87615: (e, t, r) => {
        (r.r(t),
          r.d(t, {
            headerHooks: () => g,
            originalPathname: () => h,
            patchFetch: () => y,
            requestAsyncStorage: () => d,
            routeModule: () => c,
            serverHooks: () => m,
            staticGenerationAsyncStorage: () => p,
            staticGenerationBailout: () => f,
          }));
        var n = {};
        (r.r(n), r.d(n, { GET: () => l }));
        var a = r(36621),
          s = r(36844),
          o = r(84827),
          i = r(78892),
          u = r(41239);
        async function l(e) {
          try {
            if (!(await (0, i.getServerSession)(u.Lz)))
              return new Response('Unauthorized', { status: 401 });
            let { searchParams: t } = new URL(e.url),
              r = t.get('message');
            if (!r) return new Response('Message is required', { status: 400 });
            let n = new ReadableStream({
              start(e) {
                let t = !1,
                  n = [],
                  a = () => {
                    ((t = !0), n.forEach(e => clearTimeout(e)));
                  };
                try {
                  e.enqueue(`data: ${JSON.stringify({ type: 'typing', content: 'Assistente est\xe1 processando sua pergunta...' })}

`);
                } catch (e) {
                  a();
                  return;
                }
                let s =
                    `Recebi sua pergunta: "${r}". Esta \xe9 uma resposta simulada que ser\xe1 substitu\xedda pela integra\xe7\xe3o real com o sistema RAG e LLM. A resposta est\xe1 sendo transmitida em tempo real via Server-Sent Events.`.split(
                      ' '
                    ),
                  o = '';
                s.forEach((r, i) => {
                  let u = setTimeout(() => {
                    if (!t)
                      try {
                        if (
                          ((o += (i > 0 ? ' ' : '') + r),
                          e.enqueue(`data: ${JSON.stringify({ type: 'chunk', content: r + (i < s.length - 1 ? ' ' : ''), isComplete: i === s.length - 1 })}

`),
                          i === s.length - 1)
                        ) {
                          let r = setTimeout(() => {
                            if (!t)
                              try {
                                (e.enqueue(`data: ${JSON.stringify({
                                  type: 'complete',
                                  content: o,
                                  sources: [
                                    {
                                      title: 'Documento Financeiro 1',
                                      url: '#',
                                    },
                                    {
                                      title: 'Regulamenta\xe7\xe3o Banc\xe1ria',
                                      url: '#',
                                    },
                                  ],
                                })}

`),
                                  e.close(),
                                  (t = !0));
                              } catch (e) {
                                a();
                              }
                          }, 100);
                          n.push(r);
                        }
                      } catch (e) {
                        a();
                      }
                  }, 100 * i);
                  n.push(u);
                });
              },
              cancel() {},
            });
            return new Response(n, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control',
              },
            });
          } catch (e) {
            return (
              console.error('Chat stream API error:', e),
              new Response('Internal server error', { status: 500 })
            );
          }
        }
        let c = new a.AppRouteRouteModule({
            definition: {
              kind: s.x.APP_ROUTE,
              page: '/api/chat/stream/route',
              pathname: '/api/chat/stream',
              filename: 'route',
              bundlePath: 'app/api/chat/stream/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/chat/stream/route.ts',
            nextConfigOutput: '',
            userland: n,
          }),
          {
            requestAsyncStorage: d,
            staticGenerationAsyncStorage: p,
            serverHooks: m,
            headerHooks: g,
            staticGenerationBailout: f,
          } = c,
          h = '/api/chat/stream/route';
        function y() {
          return (0, o.patchFetch)({
            serverHooks: m,
            staticGenerationAsyncStorage: p,
          });
        }
      },
      41239: (e, t, r) => {
        r.d(t, { I8: () => p, Lz: () => d });
        var n = r(78892),
          a = r.n(n),
          s = r(21339),
          o = r(38013),
          i = r(42150),
          u = r.n(i);
        async function l() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new o.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let c = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, s.Z)({
                name: 'credentials',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  password: { label: 'Password', type: 'password' },
                },
                async authorize(e) {
                  if (!e?.email || !e?.password) return null;
                  try {
                    console.log('\uD83D\uDD10 Tentando autenticar:', e.email);
                    let { client: t, db: r } = await l(),
                      n = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!n || !n.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await t.close(),
                        null
                      );
                    if (!(await u().compare(e.password, n.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await t.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        n.email
                      ),
                      await t.close(),
                      {
                        id: n._id.toString(),
                        email: n.email,
                        name: n.name,
                        role: n.role || 'user',
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
              jwt: async ({ token: e, user: t, account: r }) => (
                t && ((e.id = t.id), (e.role = t.role)),
                e
              ),
              session: async ({ session: e, token: t }) => (
                e.user && ((e.user.id = t.id), (e.user.role = t.role)),
                e
              ),
              async redirect({ url: e, baseUrl: t }) {
                if (e.startsWith('/auth') || e === t || '/' === e)
                  return `${t}/dashboard`;
                if (e.startsWith('/')) return `${t}${e}`;
                try {
                  if (new URL(e).origin === t) return e;
                } catch (e) {
                  console.error('Erro ao analisar URL:', e);
                }
                return `${t}/dashboard`;
              },
            },
            pages: { signIn: '/auth/signin', error: '/auth/signin' },
            cookies: {
              sessionToken: {
                name: `${c ? '__Secure-' : ''}next-auth.session-token`,
                options: {
                  httpOnly: !0,
                  sameSite: 'lax',
                  path: '/',
                  secure: c,
                },
              },
            },
            debug: !1,
            logger: {
              error(e, t) {
                console.error('Auth error:', e, t);
              },
              warn(e) {
                console.warn('Auth warning:', e);
              },
              debug(e, t) {
                t
                  ? console.debug('Auth debug:', e, t)
                  : console.debug('Auth debug:', e);
              },
            },
            secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
          },
          { auth: p, signIn: m, signOut: g } = a()(d);
      },
      5216: (e, t) => {
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            DYNAMIC_ERROR_CODE: function () {
              return r;
            },
            DynamicServerError: function () {
              return n;
            },
          }));
        let r = 'DYNAMIC_SERVER_USAGE';
        class n extends Error {
          constructor(e) {
            (super('Dynamic server usage: ' + e), (this.digest = r));
          }
        }
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      30129: (e, t, r) => {
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'staticGenerationBailout', {
            enumerable: !0,
            get: function () {
              return i;
            },
          }));
        let n = r(5216),
          a = r(45869);
        class s extends Error {
          constructor(...e) {
            (super(...e), (this.code = 'NEXT_STATIC_GEN_BAILOUT'));
          }
        }
        function o(e, t) {
          let { dynamic: r, link: n } = t || {};
          return (
            'Page' +
            (r ? ' with `dynamic = "' + r + '"`' : '') +
            " couldn't be rendered statically because it used `" +
            e +
            '`.' +
            (n ? ' See more info here: ' + n : '')
          );
        }
        let i = (e, t) => {
          let { dynamic: r, link: i } = void 0 === t ? {} : t,
            u = a.staticGenerationAsyncStorage.getStore();
          if (!u) return !1;
          if (u.forceStatic) return !0;
          if (u.dynamicShouldError)
            throw new s(o(e, { link: i, dynamic: null != r ? r : 'error' }));
          let l = o(e, {
            dynamic: r,
            link: 'https://nextjs.org/docs/messages/dynamic-server-error',
          });
          if (
            (null == u.postpone || u.postpone.call(u, e),
            (u.revalidate = 0),
            u.isStaticGeneration)
          ) {
            let t = new n.DynamicServerError(l);
            throw (
              (u.dynamicUsageDescription = e),
              (u.dynamicUsageStack = t.stack),
              t
            );
          }
          return !1;
        };
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      36621: (e, t, r) => {
        e.exports = r(30517);
      },
    }));
  var t = require('../../../../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    n = t.X(0, [775, 286, 778], () => r(87615));
  module.exports = n;
})();
