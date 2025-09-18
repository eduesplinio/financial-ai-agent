'use strict';
(() => {
  var e = {};
  ((e.id = 254),
    (e.ids = [254]),
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
      57349: (e, t, r) => {
        (r.r(t),
          r.d(t, {
            headerHooks: () => A,
            originalPathname: () => O,
            patchFetch: () => R,
            requestAsyncStorage: () => p,
            routeModule: () => _,
            serverHooks: () => S,
            staticGenerationAsyncStorage: () => E,
            staticGenerationBailout: () => f,
          }));
        var s = {};
        (r.r(s), r.d(s, { GET: () => c, POST: () => d }));
        var n = r(36621),
          a = r(36844),
          o = r(84827),
          i = r(3387),
          u = r(60957),
          l = r(43485);
        async function c(e) {
          return (0, u.QO)(e, (0, u.Ql)(l.y3.READ_OWN_PROFILE), async e =>
            i.Z.json({
              message: 'RBAC test successful!',
              user: e.user,
              permission: l.y3.READ_OWN_PROFILE,
              timestamp: new Date().toISOString(),
            })
          );
        }
        async function d(e) {
          return (0, u.QO)(e, (0, u.Ql)(l.y3.READ_ALL_USERS), async e =>
            i.Z.json({
              message: 'Admin RBAC test successful!',
              user: e.user,
              permission: l.y3.READ_ALL_USERS,
              timestamp: new Date().toISOString(),
            })
          );
        }
        let _ = new n.AppRouteRouteModule({
            definition: {
              kind: a.x.APP_ROUTE,
              page: '/api/test-rbac/route',
              pathname: '/api/test-rbac',
              filename: 'route',
              bundlePath: 'app/api/test-rbac/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/test-rbac/route.ts',
            nextConfigOutput: '',
            userland: s,
          }),
          {
            requestAsyncStorage: p,
            staticGenerationAsyncStorage: E,
            serverHooks: S,
            headerHooks: A,
            staticGenerationBailout: f,
          } = _,
          O = '/api/test-rbac/route';
        function R() {
          return (0, o.patchFetch)({
            serverHooks: S,
            staticGenerationAsyncStorage: E,
          });
        }
      },
      60957: (e, t, r) => {
        r.d(t, { MH: () => u, QO: () => l, Ql: () => i });
        var s = r(3387),
          n = r(41239),
          a = r(43485);
        async function o(e) {
          let t = await (0, n.I8)();
          return t?.user
            ? ((e.user = t.user), e)
            : s.Z.json({ message: 'N\xe3o autorizado' }, { status: 401 });
        }
        function i(e) {
          return async t => {
            let r = await o(t);
            if (r instanceof s.Z) return r;
            let n = r.user;
            return (0, a.Fs)(n.role, e)
              ? r
              : s.Z.json({ message: 'Acesso negado' }, { status: 403 });
          };
        }
        function u(e) {
          return async t => {
            let r = await o(t);
            return r instanceof s.Z
              ? r
              : r.user.role !== e
                ? s.Z.json(
                    {
                      message: `Acesso restrito a usu\xe1rios com fun\xe7\xe3o: ${e}`,
                    },
                    { status: 403 }
                  )
                : r;
          };
        }
        async function l(e, t, r) {
          let n = await t(e);
          return n instanceof s.Z ? n : r(n);
        }
      },
      41239: (e, t, r) => {
        r.d(t, { I8: () => _, Lz: () => d });
        var s = r(78892),
          n = r.n(s),
          a = r(21339),
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
                    let { client: t, db: r } = await l(),
                      s = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!s || !s.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await t.close(),
                        null
                      );
                    if (!(await u().compare(e.password, s.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await t.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        s.email
                      ),
                      await t.close(),
                      {
                        id: s._id.toString(),
                        email: s.email,
                        name: s.name,
                        role: s.role || 'user',
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
          { auth: _, signIn: p, signOut: E } = n()(d);
      },
      43485: (e, t, r) => {
        r.d(t, { Fs: () => i, y3: () => n });
        let s = (function (e) {
            return (
              (e.USER = 'user'),
              (e.ADMIN = 'admin'),
              (e.SUPPORT = 'support'),
              e
            );
          })({}),
          n = (function (e) {
            return (
              (e.READ_OWN_PROFILE = 'read:own_profile'),
              (e.UPDATE_OWN_PROFILE = 'update:own_profile'),
              (e.READ_OWN_TRANSACTIONS = 'read:own_transactions'),
              (e.CREATE_OWN_TRANSACTIONS = 'create:own_transactions'),
              (e.READ_OWN_GOALS = 'read:own_goals'),
              (e.CREATE_OWN_GOALS = 'create:own_goals'),
              (e.UPDATE_OWN_GOALS = 'update:own_goals'),
              (e.DELETE_OWN_GOALS = 'delete:own_goals'),
              (e.USE_CHAT = 'use:chat'),
              (e.READ_ALL_USERS = 'read:all_users'),
              (e.UPDATE_ALL_USERS = 'update:all_users'),
              (e.DELETE_USERS = 'delete:users'),
              (e.READ_ALL_TRANSACTIONS = 'read:all_transactions'),
              (e.READ_SYSTEM_LOGS = 'read:system_logs'),
              (e.MANAGE_SYSTEM_SETTINGS = 'manage:system_settings'),
              (e.READ_USER_PROFILES = 'read:user_profiles'),
              (e.UPDATE_USER_PROFILES = 'update:user_profiles'),
              (e.READ_USER_TRANSACTIONS = 'read:user_transactions'),
              (e.ASSIST_USERS = 'assist:users'),
              e
            );
          })({}),
          a = [
            n.READ_OWN_PROFILE,
            n.UPDATE_OWN_PROFILE,
            n.READ_OWN_TRANSACTIONS,
            n.CREATE_OWN_TRANSACTIONS,
            n.READ_OWN_GOALS,
            n.CREATE_OWN_GOALS,
            n.UPDATE_OWN_GOALS,
            n.DELETE_OWN_GOALS,
            n.USE_CHAT,
          ],
          o = {
            [s.USER]: a,
            [s.SUPPORT]: [
              ...a,
              n.READ_USER_PROFILES,
              n.UPDATE_USER_PROFILES,
              n.READ_USER_TRANSACTIONS,
              n.ASSIST_USERS,
            ],
            [s.ADMIN]: [...Object.values(n)],
          };
        function i(e, t) {
          return (o[e] || []).includes(t);
        }
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
              return s;
            },
          }));
        let r = 'DYNAMIC_SERVER_USAGE';
        class s extends Error {
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
        let s = r(5216),
          n = r(45869);
        class a extends Error {
          constructor(...e) {
            (super(...e), (this.code = 'NEXT_STATIC_GEN_BAILOUT'));
          }
        }
        function o(e, t) {
          let { dynamic: r, link: s } = t || {};
          return (
            'Page' +
            (r ? ' with `dynamic = "' + r + '"`' : '') +
            " couldn't be rendered statically because it used `" +
            e +
            '`.' +
            (s ? ' See more info here: ' + s : '')
          );
        }
        let i = (e, t) => {
          let { dynamic: r, link: i } = void 0 === t ? {} : t,
            u = n.staticGenerationAsyncStorage.getStore();
          if (!u) return !1;
          if (u.forceStatic) return !0;
          if (u.dynamicShouldError)
            throw new a(o(e, { link: i, dynamic: null != r ? r : 'error' }));
          let l = o(e, {
            dynamic: r,
            link: 'https://nextjs.org/docs/messages/dynamic-server-error',
          });
          if (
            (null == u.postpone || u.postpone.call(u, e),
            (u.revalidate = 0),
            u.isStaticGeneration)
          ) {
            let t = new s.DynamicServerError(l);
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
    }));
  var t = require('../../../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    s = t.X(0, [775, 286, 778, 321], () => r(57349));
  module.exports = s;
})();
