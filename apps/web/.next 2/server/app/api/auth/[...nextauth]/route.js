'use strict';
(() => {
  var e = {};
  ((e.id = 912),
    (e.ids = [912]),
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
      68872: (e, t, r) => {
        (r.r(t),
          r.d(t, {
            headerHooks: () => g,
            originalPathname: () => m,
            patchFetch: () => y,
            requestAsyncStorage: () => d,
            routeModule: () => c,
            serverHooks: () => f,
            staticGenerationAsyncStorage: () => p,
            staticGenerationBailout: () => h,
          }));
        var o = {};
        (r.r(o), r.d(o, { GET: () => l, POST: () => l }));
        var a = r(36621),
          n = r(36844),
          s = r(84827),
          i = r(41666),
          u = r(41239);
        let l = (0, i.default)(u.Lz),
          c = new a.AppRouteRouteModule({
            definition: {
              kind: n.x.APP_ROUTE,
              page: '/api/auth/[...nextauth]/route',
              pathname: '/api/auth/[...nextauth]',
              filename: 'route',
              bundlePath: 'app/api/auth/[...nextauth]/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/auth/[...nextauth]/route.ts',
            nextConfigOutput: '',
            userland: o,
          }),
          {
            requestAsyncStorage: d,
            staticGenerationAsyncStorage: p,
            serverHooks: f,
            headerHooks: g,
            staticGenerationBailout: h,
          } = c,
          m = '/api/auth/[...nextauth]/route';
        function y() {
          return (0, s.patchFetch)({
            serverHooks: f,
            staticGenerationAsyncStorage: p,
          });
        }
      },
      41239: (e, t, r) => {
        r.d(t, { I8: () => p, Lz: () => d });
        var o = r(78892),
          a = r.n(o),
          n = r(21339),
          s = r(38013),
          i = r(42150),
          u = r.n(i);
        async function l() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new s.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let c = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, n.Z)({
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
                      o = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!o || !o.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await t.close(),
                        null
                      );
                    if (!(await u().compare(e.password, o.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await t.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        o.email
                      ),
                      await t.close(),
                      {
                        id: o._id.toString(),
                        email: o.email,
                        name: o.name,
                        role: o.role || 'user',
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
          { auth: p, signIn: f, signOut: g } = a()(d);
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
              return o;
            },
          }));
        let r = 'DYNAMIC_SERVER_USAGE';
        class o extends Error {
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
        let o = r(5216),
          a = r(45869);
        class n extends Error {
          constructor(...e) {
            (super(...e), (this.code = 'NEXT_STATIC_GEN_BAILOUT'));
          }
        }
        function s(e, t) {
          let { dynamic: r, link: o } = t || {};
          return (
            'Page' +
            (r ? ' with `dynamic = "' + r + '"`' : '') +
            " couldn't be rendered statically because it used `" +
            e +
            '`.' +
            (o ? ' See more info here: ' + o : '')
          );
        }
        let i = (e, t) => {
          let { dynamic: r, link: i } = void 0 === t ? {} : t,
            u = a.staticGenerationAsyncStorage.getStore();
          if (!u) return !1;
          if (u.forceStatic) return !0;
          if (u.dynamicShouldError)
            throw new n(s(e, { link: i, dynamic: null != r ? r : 'error' }));
          let l = s(e, {
            dynamic: r,
            link: 'https://nextjs.org/docs/messages/dynamic-server-error',
          });
          if (
            (null == u.postpone || u.postpone.call(u, e),
            (u.revalidate = 0),
            u.isStaticGeneration)
          ) {
            let t = new o.DynamicServerError(l);
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
    o = t.X(0, [775, 286, 778], () => r(68872));
  module.exports = o;
})();
