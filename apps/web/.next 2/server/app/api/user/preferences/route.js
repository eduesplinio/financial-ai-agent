'use strict';
(() => {
  var e = {};
  ((e.id = 826),
    (e.ids = [826]),
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
      45783: (e, o, r) => {
        (r.r(o),
          r.d(o, {
            headerHooks: () => A,
            originalPathname: () => x,
            patchFetch: () => I,
            requestAsyncStorage: () => h,
            routeModule: () => O,
            serverHooks: () => v,
            staticGenerationAsyncStorage: () => w,
            staticGenerationBailout: () => j,
          }));
        var n = {};
        (r.r(n), r.d(n, { GET: () => b, PUT: () => P }));
        var t = r(36621),
          s = r(36844),
          a = r(84827),
          i = r(3387),
          l = r(78892),
          c = r(41239),
          u = r(38013),
          d = r(16063),
          p = r(79605);
        function g(e, o) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (o &&
              (n = n.filter(function (o) {
                return Object.getOwnPropertyDescriptor(e, o).enumerable;
              })),
              r.push.apply(r, n));
          }
          return r;
        }
        function f(e) {
          for (var o = 1; o < arguments.length; o++) {
            var r = null != arguments[o] ? arguments[o] : {};
            o % 2
              ? g(Object(r), !0).forEach(function (o) {
                  var n, t;
                  ((n = o),
                    (t = r[o]),
                    (n = (function (e) {
                      var o = (function (e, o) {
                        if ('object' != typeof e || null === e) return e;
                        var r = e[Symbol.toPrimitive];
                        if (void 0 !== r) {
                          var n = r.call(e, o || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === o ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof o ? o : String(o);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: t,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = t));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : g(Object(r)).forEach(function (o) {
                    Object.defineProperty(
                      e,
                      o,
                      Object.getOwnPropertyDescriptor(r, o)
                    );
                  });
          }
          return e;
        }
        let m = new u.MongoClient(process.env.MONGODB_URI),
          y = d.Ry({
            theme: d.Km(['light', 'dark', 'system']).optional(),
            language: d.Km(['pt-BR', 'en-US']).optional(),
            notifications: d
              .Ry({
                email: d.O7().optional(),
                push: d.O7().optional(),
                marketing: d.O7().optional(),
                largeTransactions: d.O7().optional(),
                unusualSpending: d.O7().optional(),
                goalProgress: d.O7().optional(),
                budgetExceeded: d.O7().optional(),
                sms: d.O7().optional(),
                budgetAlerts: d.O7().optional(),
                goalReminders: d.O7().optional(),
                anomalyDetection: d.O7().optional(),
              })
              .optional(),
            currency: d.Z_().optional(),
            timezone: d.Z_().optional(),
            privacy: d
              .Ry({
                dataSharing: d.O7().optional(),
                analytics: d.O7().optional(),
                marketing: d.O7().optional(),
              })
              .optional(),
          });
        async function P(e) {
          try {
            let o = await (0, l.getServerSession)(c.Lz);
            if (!o?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let r = o.user.id;
            console.log(
              '[API Preferences] ID do usu\xe1rio para atualiza\xe7\xe3o:',
              r
            );
            let n = await e.json();
            console.log('[API Preferences] Payload recebido:', n);
            let t = y.parse(n);
            (await m.connect(),
              console.log(
                '[API Preferences] Conex\xe3o com MongoDB estabelecida'
              ));
            let s = m.db(),
              a = s.collection('users'),
              d = await a.findOne({ _id: new u.ObjectId(r) });
            (console.log(
              '[API Preferences] Usu\xe1rio antes da atualiza\xe7\xe3o:',
              d ? `ID: ${d._id}, Email: ${d.email}` : 'N\xe3o encontrado'
            ),
              console.log(
                '[API Preferences] Prefer\xeancias antes:',
                d?.preferences
              ));
            let p = await a.findOne({ _id: new u.ObjectId(r) }),
              g = p?.preferences || {},
              P = f(
                f({}, g),
                {},
                {
                  notifications: t.notifications
                    ? f(
                        f({}, g.notifications || {}),
                        Object.entries(t.notifications).reduce(
                          (e, [o, r]) => (void 0 !== r && (e[o] = r), e),
                          {}
                        )
                      )
                    : g.notifications,
                  privacy: t.privacy
                    ? f(
                        f({}, g.privacy || {}),
                        Object.entries(t.privacy).reduce(
                          (e, [o, r]) => (void 0 !== r && (e[o] = r), e),
                          {}
                        )
                      )
                    : g.privacy,
                  theme: void 0 !== t.theme ? t.theme : g.theme,
                  language: void 0 !== t.language ? t.language : g.language,
                  currency: void 0 !== t.currency ? t.currency : g.currency,
                  timezone: void 0 !== t.timezone ? t.timezone : g.timezone,
                }
              ),
              b = await a.updateOne(
                { _id: new u.ObjectId(r) },
                { $set: { preferences: P, updatedAt: new Date() } }
              );
            console.log('[API Preferences] Resultado da atualiza\xe7\xe3o:', b);
            let O = await a.findOne({ _id: new u.ObjectId(r) });
            if (
              (console.log(
                '[API Preferences] Usu\xe1rio ap\xf3s atualiza\xe7\xe3o:',
                O ? `ID: ${O._id}, Email: ${O.email}` : 'N\xe3o encontrado'
              ),
              console.log(
                '[API Preferences] Prefer\xeancias ap\xf3s atualiza\xe7\xe3o:'
              ),
              console.log('- Objeto completo:', O?.preferences),
              O?.preferences?.notifications)
            ) {
              let e = O.preferences.notifications;
              (console.log('- Notifica\xe7\xf5es (detalhadas):'),
                console.log('  email:', typeof e.email, e.email),
                console.log('  push:', typeof e.push, e.push),
                console.log('  marketing:', typeof e.marketing, e.marketing),
                console.log(
                  '  largeTransactions:',
                  typeof e.largeTransactions,
                  e.largeTransactions
                ),
                console.log(
                  '  unusualSpending:',
                  typeof e.unusualSpending,
                  e.unusualSpending
                ),
                console.log(
                  '  goalProgress:',
                  typeof e.goalProgress,
                  e.goalProgress
                ),
                console.log(
                  '  budgetExceeded:',
                  typeof e.budgetExceeded,
                  e.budgetExceeded
                ),
                console.log(
                  '  budgetAlerts:',
                  typeof e.budgetAlerts,
                  e.budgetAlerts
                ),
                console.log(
                  '  goalReminders:',
                  typeof e.goalReminders,
                  e.goalReminders
                ),
                console.log(
                  '  anomalyDetection:',
                  typeof e.anomalyDetection,
                  e.anomalyDetection
                ),
                console.log('  sms:', typeof e.sms, e.sms));
            }
            if (O?.preferences?.privacy) {
              let e = O.preferences.privacy;
              (console.log('- Privacy (detalhada):'),
                console.log('  analytics:', typeof e.analytics, e.analytics),
                console.log('  marketing:', typeof e.marketing, e.marketing),
                console.log(
                  '  dataSharing:',
                  typeof e.dataSharing,
                  e.dataSharing
                ));
            }
            let h = s.collection('user_preferences');
            return (
              await h.findOneAndUpdate(
                { userId: r },
                {
                  $set: f(f({}, t), {}, { updatedAt: new Date() }),
                  $setOnInsert: { userId: r, createdAt: new Date() },
                },
                { upsert: !0, returnDocument: 'after' }
              ),
              console.log(
                '[API Preferences] Prefer\xeancias salvas com sucesso'
              ),
              i.Z.json(
                {
                  message: 'Prefer\xeancias salvas com sucesso',
                  preferences: t,
                },
                { status: 200 }
              )
            );
          } catch (e) {
            if (
              (console.error('Preferences save error:', e), e instanceof p.jm)
            )
              return i.Z.json(
                { message: 'Dados inv\xe1lidos', errors: e.errors },
                { status: 400 }
              );
            return i.Z.json(
              { message: 'Erro interno do servidor' },
              { status: 500 }
            );
          } finally {
            await m.close();
          }
        }
        async function b() {
          try {
            let e = await (0, l.getServerSession)(c.Lz);
            if (!e?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let o = e.user.id;
            (console.log('[API Preferences GET] ID do usu\xe1rio:', o),
              console.log('[API Preferences GET] Sess\xe3o do usu\xe1rio:', e),
              await m.connect(),
              console.log(
                '[API Preferences GET] Conex\xe3o com MongoDB estabelecida'
              ));
            let r = m.db(),
              n = r.collection('users'),
              t = await n.findOne({ _id: new u.ObjectId(o) });
            if (
              (console.log(
                '[API Preferences GET] Usu\xe1rio encontrado:',
                t ? `ID: ${t._id}, Email: ${t.email}` : 'N\xe3o encontrado'
              ),
              t && t.preferences)
            ) {
              if (
                (console.log(
                  '[API Preferences GET] Prefer\xeancias encontradas no documento do usu\xe1rio:',
                  t.preferences
                ),
                t.preferences.notifications)
              ) {
                let e = t.preferences.notifications;
                (console.log(
                  '[API Preferences GET] Notifica\xe7\xf5es (detalhadas):'
                ),
                  console.log(
                    '  largeTransactions:',
                    typeof e.largeTransactions,
                    e.largeTransactions
                  ),
                  console.log(
                    '  unusualSpending:',
                    typeof e.unusualSpending,
                    e.unusualSpending
                  ),
                  console.log(
                    '  goalProgress:',
                    typeof e.goalProgress,
                    e.goalProgress
                  ),
                  console.log(
                    '  budgetExceeded:',
                    typeof e.budgetExceeded,
                    e.budgetExceeded
                  ),
                  console.log(
                    '  budgetAlerts:',
                    typeof e.budgetAlerts,
                    e.budgetAlerts
                  ),
                  console.log(
                    '  goalReminders:',
                    typeof e.goalReminders,
                    e.goalReminders
                  ),
                  console.log(
                    '  anomalyDetection:',
                    typeof e.anomalyDetection,
                    e.anomalyDetection
                  ));
              }
              return i.Z.json(t.preferences, { status: 200 });
            }
            console.log(
              '[API Preferences GET] Prefer\xeancias n\xe3o encontradas no documento do usu\xe1rio, buscando na collection antiga'
            );
            let s = r.collection('user_preferences'),
              a = await s.findOne({ userId: o });
            if (
              (console.log(
                '[API Preferences GET] Resultado da busca na collection antiga:',
                a ? 'Encontrado' : 'N\xe3o encontrado'
              ),
              !a)
            )
              return (
                console.log(
                  '[API Preferences GET] Retornando prefer\xeancias padr\xe3o'
                ),
                i.Z.json(
                  {
                    theme: 'system',
                    language: 'pt-BR',
                    notifications: {
                      email: !0,
                      push: !0,
                      marketing: !1,
                      largeTransactions: !0,
                      unusualSpending: !0,
                      goalProgress: !0,
                      budgetExceeded: !0,
                    },
                  },
                  { status: 200 }
                )
              );
            return (
              console.log(
                '[API Preferences GET] Retornando prefer\xeancias da collection antiga'
              ),
              i.Z.json(a, { status: 200 })
            );
          } catch (e) {
            return (
              console.error('Preferences fetch error:', e),
              i.Z.json({ message: 'Erro interno do servidor' }, { status: 500 })
            );
          } finally {
            await m.close();
          }
        }
        let O = new t.AppRouteRouteModule({
            definition: {
              kind: s.x.APP_ROUTE,
              page: '/api/user/preferences/route',
              pathname: '/api/user/preferences',
              filename: 'route',
              bundlePath: 'app/api/user/preferences/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/preferences/route.ts',
            nextConfigOutput: '',
            userland: n,
          }),
          {
            requestAsyncStorage: h,
            staticGenerationAsyncStorage: w,
            serverHooks: v,
            headerHooks: A,
            staticGenerationBailout: j,
          } = O,
          x = '/api/user/preferences/route';
        function I() {
          return (0, a.patchFetch)({
            serverHooks: v,
            staticGenerationAsyncStorage: w,
          });
        }
      },
      41239: (e, o, r) => {
        r.d(o, { I8: () => p, Lz: () => d });
        var n = r(78892),
          t = r.n(n),
          s = r(21339),
          a = r(38013),
          i = r(42150),
          l = r.n(i);
        async function c() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new a.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let u = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
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
                    let { client: o, db: r } = await c(),
                      n = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!n || !n.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await o.close(),
                        null
                      );
                    if (!(await l().compare(e.password, n.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await o.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        n.email
                      ),
                      await o.close(),
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
              jwt: async ({ token: e, user: o, account: r }) => (
                o && ((e.id = o.id), (e.role = o.role)),
                e
              ),
              session: async ({ session: e, token: o }) => (
                e.user && ((e.user.id = o.id), (e.user.role = o.role)),
                e
              ),
              async redirect({ url: e, baseUrl: o }) {
                if (e.startsWith('/auth') || e === o || '/' === e)
                  return `${o}/dashboard`;
                if (e.startsWith('/')) return `${o}${e}`;
                try {
                  if (new URL(e).origin === o) return e;
                } catch (e) {
                  console.error('Erro ao analisar URL:', e);
                }
                return `${o}/dashboard`;
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
              error(e, o) {
                console.error('Auth error:', e, o);
              },
              warn(e) {
                console.warn('Auth warning:', e);
              },
              debug(e, o) {
                o
                  ? console.debug('Auth debug:', e, o)
                  : console.debug('Auth debug:', e);
              },
            },
            secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
          },
          { auth: p, signIn: g, signOut: f } = t()(d);
      },
    }));
  var o = require('../../../../webpack-runtime.js');
  o.C(e);
  var r = e => o((o.s = e)),
    n = o.X(0, [775, 286, 778, 321, 13], () => r(45783));
  module.exports = n;
})();
