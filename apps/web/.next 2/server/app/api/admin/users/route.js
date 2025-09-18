'use strict';
(() => {
  var e = {};
  ((e.id = 628),
    (e.ids = [628]),
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
      39833: (e, r, t) => {
        (t.r(r),
          t.d(r, {
            headerHooks: () => S,
            originalPathname: () => m,
            patchFetch: () => O,
            requestAsyncStorage: () => E,
            routeModule: () => p,
            serverHooks: () => A,
            staticGenerationAsyncStorage: () => f,
            staticGenerationBailout: () => g,
          }));
        var s = {};
        (t.r(s), t.d(s, { GET: () => d, PUT: () => _ }));
        var n = t(36621),
          o = t(36844),
          a = t(84827),
          i = t(3387),
          u = t(38013),
          l = t(60957);
        let c = new u.MongoClient(process.env.MONGODB_URI);
        async function d(e) {
          return (0, l.QO)(e, (0, l.MH)('admin'), async e => {
            try {
              await c.connect();
              let e = c.db().collection('users'),
                r = await e.find({}, { projection: { password: 0 } }).toArray();
              return i.Z.json({ users: r, total: r.length });
            } catch (e) {
              return (
                console.error('Error fetching users:', e),
                i.Z.json(
                  { message: 'Erro interno do servidor' },
                  { status: 500 }
                )
              );
            } finally {
              await c.close();
            }
          });
        }
        async function _(e) {
          return (0, l.QO)(e, (0, l.MH)('admin'), async r => {
            try {
              let { userId: r, updates: t } = await e.json();
              if (!r || !t)
                return i.Z.json(
                  { message: 'userId e updates s\xe3o obrigat\xf3rios' },
                  { status: 400 }
                );
              await c.connect();
              let s = c.db().collection('users'),
                n = { name: t.name, role: t.role, updatedAt: new Date() };
              Object.keys(n).forEach(e => {
                void 0 === n[e] && delete n[e];
              });
              let o = await s.updateOne({ _id: r }, { $set: n });
              if (0 === o.matchedCount)
                return i.Z.json(
                  { message: 'Usu\xe1rio n\xe3o encontrado' },
                  { status: 404 }
                );
              return i.Z.json({
                message: 'Usu\xe1rio atualizado com sucesso',
                modifiedCount: o.modifiedCount,
              });
            } catch (e) {
              return (
                console.error('Error updating user:', e),
                i.Z.json(
                  { message: 'Erro interno do servidor' },
                  { status: 500 }
                )
              );
            } finally {
              await c.close();
            }
          });
        }
        let p = new n.AppRouteRouteModule({
            definition: {
              kind: o.x.APP_ROUTE,
              page: '/api/admin/users/route',
              pathname: '/api/admin/users',
              filename: 'route',
              bundlePath: 'app/api/admin/users/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/admin/users/route.ts',
            nextConfigOutput: '',
            userland: s,
          }),
          {
            requestAsyncStorage: E,
            staticGenerationAsyncStorage: f,
            serverHooks: A,
            headerHooks: S,
            staticGenerationBailout: g,
          } = p,
          m = '/api/admin/users/route';
        function O() {
          return (0, a.patchFetch)({
            serverHooks: A,
            staticGenerationAsyncStorage: f,
          });
        }
      },
      60957: (e, r, t) => {
        t.d(r, { MH: () => u, QO: () => l, Ql: () => i });
        var s = t(3387),
          n = t(41239),
          o = t(43485);
        async function a(e) {
          let r = await (0, n.I8)();
          return r?.user
            ? ((e.user = r.user), e)
            : s.Z.json({ message: 'N\xe3o autorizado' }, { status: 401 });
        }
        function i(e) {
          return async r => {
            let t = await a(r);
            if (t instanceof s.Z) return t;
            let n = t.user;
            return (0, o.Fs)(n.role, e)
              ? t
              : s.Z.json({ message: 'Acesso negado' }, { status: 403 });
          };
        }
        function u(e) {
          return async r => {
            let t = await a(r);
            return t instanceof s.Z
              ? t
              : t.user.role !== e
                ? s.Z.json(
                    {
                      message: `Acesso restrito a usu\xe1rios com fun\xe7\xe3o: ${e}`,
                    },
                    { status: 403 }
                  )
                : t;
          };
        }
        async function l(e, r, t) {
          let n = await r(e);
          return n instanceof s.Z ? n : t(n);
        }
      },
      41239: (e, r, t) => {
        t.d(r, { I8: () => _, Lz: () => d });
        var s = t(78892),
          n = t.n(s),
          o = t(21339),
          a = t(38013),
          i = t(42150),
          u = t.n(i);
        async function l() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new a.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let c = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, o.Z)({
                name: 'credentials',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  password: { label: 'Password', type: 'password' },
                },
                async authorize(e) {
                  if (!e?.email || !e?.password) return null;
                  try {
                    console.log('\uD83D\uDD10 Tentando autenticar:', e.email);
                    let { client: r, db: t } = await l(),
                      s = await t
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!s || !s.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await r.close(),
                        null
                      );
                    if (!(await u().compare(e.password, s.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await r.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        s.email
                      ),
                      await r.close(),
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
              jwt: async ({ token: e, user: r, account: t }) => (
                r && ((e.id = r.id), (e.role = r.role)),
                e
              ),
              session: async ({ session: e, token: r }) => (
                e.user && ((e.user.id = r.id), (e.user.role = r.role)),
                e
              ),
              async redirect({ url: e, baseUrl: r }) {
                if (e.startsWith('/auth') || e === r || '/' === e)
                  return `${r}/dashboard`;
                if (e.startsWith('/')) return `${r}${e}`;
                try {
                  if (new URL(e).origin === r) return e;
                } catch (e) {
                  console.error('Erro ao analisar URL:', e);
                }
                return `${r}/dashboard`;
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
              error(e, r) {
                console.error('Auth error:', e, r);
              },
              warn(e) {
                console.warn('Auth warning:', e);
              },
              debug(e, r) {
                r
                  ? console.debug('Auth debug:', e, r)
                  : console.debug('Auth debug:', e);
              },
            },
            secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
          },
          { auth: _, signIn: p, signOut: E } = n()(d);
      },
      43485: (e, r, t) => {
        t.d(r, { Fs: () => i, y3: () => n });
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
          o = [
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
          a = {
            [s.USER]: o,
            [s.SUPPORT]: [
              ...o,
              n.READ_USER_PROFILES,
              n.UPDATE_USER_PROFILES,
              n.READ_USER_TRANSACTIONS,
              n.ASSIST_USERS,
            ],
            [s.ADMIN]: [...Object.values(n)],
          };
        function i(e, r) {
          return (a[e] || []).includes(r);
        }
      },
      5216: (e, r) => {
        (Object.defineProperty(r, '__esModule', { value: !0 }),
          (function (e, r) {
            for (var t in r)
              Object.defineProperty(e, t, { enumerable: !0, get: r[t] });
          })(r, {
            DYNAMIC_ERROR_CODE: function () {
              return t;
            },
            DynamicServerError: function () {
              return s;
            },
          }));
        let t = 'DYNAMIC_SERVER_USAGE';
        class s extends Error {
          constructor(e) {
            (super('Dynamic server usage: ' + e), (this.digest = t));
          }
        }
        ('function' == typeof r.default ||
          ('object' == typeof r.default && null !== r.default)) &&
          void 0 === r.default.__esModule &&
          (Object.defineProperty(r.default, '__esModule', { value: !0 }),
          Object.assign(r.default, r),
          (e.exports = r.default));
      },
      30129: (e, r, t) => {
        (Object.defineProperty(r, '__esModule', { value: !0 }),
          Object.defineProperty(r, 'staticGenerationBailout', {
            enumerable: !0,
            get: function () {
              return i;
            },
          }));
        let s = t(5216),
          n = t(45869);
        class o extends Error {
          constructor(...e) {
            (super(...e), (this.code = 'NEXT_STATIC_GEN_BAILOUT'));
          }
        }
        function a(e, r) {
          let { dynamic: t, link: s } = r || {};
          return (
            'Page' +
            (t ? ' with `dynamic = "' + t + '"`' : '') +
            " couldn't be rendered statically because it used `" +
            e +
            '`.' +
            (s ? ' See more info here: ' + s : '')
          );
        }
        let i = (e, r) => {
          let { dynamic: t, link: i } = void 0 === r ? {} : r,
            u = n.staticGenerationAsyncStorage.getStore();
          if (!u) return !1;
          if (u.forceStatic) return !0;
          if (u.dynamicShouldError)
            throw new o(a(e, { link: i, dynamic: null != t ? t : 'error' }));
          let l = a(e, {
            dynamic: t,
            link: 'https://nextjs.org/docs/messages/dynamic-server-error',
          });
          if (
            (null == u.postpone || u.postpone.call(u, e),
            (u.revalidate = 0),
            u.isStaticGeneration)
          ) {
            let r = new s.DynamicServerError(l);
            throw (
              (u.dynamicUsageDescription = e),
              (u.dynamicUsageStack = r.stack),
              r
            );
          }
          return !1;
        };
        ('function' == typeof r.default ||
          ('object' == typeof r.default && null !== r.default)) &&
          void 0 === r.default.__esModule &&
          (Object.defineProperty(r.default, '__esModule', { value: !0 }),
          Object.assign(r.default, r),
          (e.exports = r.default));
      },
    }));
  var r = require('../../../../webpack-runtime.js');
  r.C(e);
  var t = e => r((r.s = e)),
    s = r.X(0, [775, 286, 778, 321], () => t(39833));
  module.exports = s;
})();
