'use strict';
(() => {
  var e = {};
  ((e.id = 365),
    (e.ids = [365]),
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
      11151: (e, t, n) => {
        (n.r(t),
          n.d(t, {
            headerHooks: () => v,
            originalPathname: () => x,
            patchFetch: () => D,
            requestAsyncStorage: () => y,
            routeModule: () => w,
            serverHooks: () => b,
            staticGenerationAsyncStorage: () => h,
            staticGenerationBailout: () => O,
          }));
        var r = {};
        (n.r(r), n.d(r, { GET: () => _, POST: () => p }));
        var o = n(36621),
          a = n(36844),
          s = n(84827),
          i = n(3387),
          l = n(78892),
          c = n(41239),
          u = n(38013);
        let d = process.env.MONGODB_URI;
        if (!d)
          throw Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
          );
        async function p(e) {
          try {
            let t;
            let n = await (0, l.getServerSession)(c.Lz);
            if (!n?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let { action: r } = await e.json(),
              o = new u.MongoClient(d);
            await o.connect();
            let a = o.db();
            switch (r) {
              case 'export':
                t = await f(a, n.user.id);
                break;
              case 'delete':
                t = await g(a, n.user.id);
                break;
              case 'portability':
                t = await m(a, n.user.id);
                break;
              default:
                return (
                  await o.close(),
                  i.Z.json(
                    { message: 'A\xe7\xe3o inv\xe1lida' },
                    { status: 400 }
                  )
                );
            }
            return (await o.close(), t);
          } catch (e) {
            return (
              console.error('LGPD action error:', e),
              i.Z.json({ message: 'Erro interno do servidor' }, { status: 500 })
            );
          }
        }
        async function f(e, t) {
          let n = {};
          for (let r of [
            'users',
            'user_preferences',
            'user_consents',
            'user_consent_history',
            'notification_settings',
            'financial_profiles',
          ]) {
            let o = await e.collection(r).find({ userId: t }).toArray();
            n[r] = o;
          }
          let r = await e
            .collection('users')
            .findOne({ _id: new u.ObjectId(t) });
          r && (n.user_profile = r);
          let o = {
            exportedAt: new Date().toISOString(),
            userId: t,
            data: n,
            description:
              'Exporta\xe7\xe3o completa dos dados pessoais conforme LGPD',
            lgpd_compliance: {
              legal_basis: 'Art. 15, LGPD - Direito de acesso',
              export_type: 'complete',
              retention_policy:
                'Dados mantidos enquanto conta ativa ou conforme obriga\xe7\xe3o legal',
            },
          };
          return new Response(JSON.stringify(o, null, 2), {
            status: 200,
            headers: {
              'Content-Disposition': `attachment; filename="meus-dados-${Date.now()}.json"`,
              'Content-Type': 'application/json',
            },
          });
        }
        async function m(e, t) {
          let n = await e
              .collection('users')
              .findOne({ _id: new u.ObjectId(t) }),
            r = await e.collection('user_preferences').findOne({ userId: t }),
            o = await e.collection('user_consents').findOne({ userId: t }),
            a = await e
              .collection('notification_settings')
              .findOne({ userId: t }),
            s = await e.collection('financial_profiles').findOne({ userId: t }),
            i = {
              format_version: '1.0',
              export_date: new Date().toISOString(),
              user_profile: {
                name: n?.name,
                email: n?.email,
                created_at: n?.createdAt,
              },
              preferences: r ? { theme: r.theme, language: r.language } : null,
              notifications: a || null,
              financial_profile: s
                ? {
                    monthly_income: s.monthlyIncome,
                    risk_profile: s.riskProfile,
                    investment_experience: s.investmentExperience,
                    spending_categories: s.spendingCategories,
                    emergency_fund: s.emergencyFund,
                  }
                : null,
              privacy_settings: o
                ? {
                    analytics_consent: o.analytics,
                    marketing_consent: o.marketing,
                    data_processing_consent: o.dataProcessing,
                    last_updated: o.updatedAt,
                  }
                : null,
              export_info: {
                lgpd_compliance: !0,
                format: 'JSON estruturado para portabilidade',
                usage:
                  'Dados exportados em formato leg\xedvel por m\xe1quina conforme Art. 18, LGPD',
              },
            };
          return new Response(JSON.stringify(i, null, 2), {
            status: 200,
            headers: {
              'Content-Disposition': `attachment; filename="dados-portaveis-${Date.now()}.json"`,
              'Content-Type': 'application/json',
            },
          });
        }
        async function g(e, t) {
          let n = new u.MongoClient(d);
          await n.connect();
          let r = await n.startSession();
          try {
            return (
              await r.withTransaction(async () => {
                for (let n of [
                  'user_preferences',
                  'user_consents',
                  'user_consent_history',
                  'notification_settings',
                  'financial_profiles',
                ])
                  await e.collection(n).deleteMany({ userId: t });
                (await e.collection('users').updateOne(
                  { _id: new u.ObjectId(t) },
                  {
                    $set: {
                      deleted: !0,
                      deletedAt: new Date(),
                      name: '[USU\xc1RIO REMOVIDO]',
                      email: `deleted-${t}@removed.local`,
                    },
                  }
                ),
                  await e.collection('data_deletion_log').insertOne({
                    userId: t,
                    deletedAt: new Date(),
                    reason: 'user_request',
                    status: 'completed',
                  }));
              }),
              i.Z.json(
                {
                  message: 'Dados removidos com sucesso conforme LGPD',
                  deletion_id: `DEL-${Date.now()}-${t.slice(-6)}`,
                },
                { status: 200 }
              )
            );
          } catch (e) {
            return (
              console.error('Delete user data error:', e),
              i.Z.json({ message: 'Erro ao remover dados' }, { status: 500 })
            );
          } finally {
            (await r.endSession(), await n.close());
          }
        }
        async function _() {
          try {
            let e = await (0, l.getServerSession)(c.Lz);
            if (!e?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let t = new u.MongoClient(d);
            await t.connect();
            let n = t.db(),
              r = await n
                .collection('user_consent_history')
                .find({ userId: e.user.id })
                .sort({ updatedAt: -1 })
                .limit(10)
                .toArray(),
              o = {};
            for (let t of [
              'user_preferences',
              'user_consents',
              'notification_settings',
              'financial_profiles',
            ]) {
              let r = await n
                .collection(t)
                .countDocuments({ userId: e.user.id });
              o[t] = r;
            }
            return (
              await t.close(),
              i.Z.json(
                {
                  consent_history: r,
                  data_available: o,
                  lgpd_rights: {
                    access: !0,
                    correction: !0,
                    deletion: !0,
                    portability: !0,
                    information: !0,
                  },
                },
                { status: 200 }
              )
            );
          } catch (e) {
            return (
              console.error('LGPD info fetch error:', e),
              i.Z.json({ message: 'Erro interno do servidor' }, { status: 500 })
            );
          }
        }
        let w = new o.AppRouteRouteModule({
            definition: {
              kind: a.x.APP_ROUTE,
              page: '/api/user/data-management/route',
              pathname: '/api/user/data-management',
              filename: 'route',
              bundlePath: 'app/api/user/data-management/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/data-management/route.ts',
            nextConfigOutput: '',
            userland: r,
          }),
          {
            requestAsyncStorage: y,
            staticGenerationAsyncStorage: h,
            serverHooks: b,
            headerHooks: v,
            staticGenerationBailout: O,
          } = w,
          x = '/api/user/data-management/route';
        function D() {
          return (0, s.patchFetch)({
            serverHooks: b,
            staticGenerationAsyncStorage: h,
          });
        }
      },
      41239: (e, t, n) => {
        n.d(t, { I8: () => p, Lz: () => d });
        var r = n(78892),
          o = n.n(r),
          a = n(21339),
          s = n(38013),
          i = n(42150),
          l = n.n(i);
        async function c() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new s.MongoClient(process.env.MONGODB_URI);
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
                    let { client: t, db: n } = await c(),
                      r = await n
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!r || !r.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await t.close(),
                        null
                      );
                    if (!(await l().compare(e.password, r.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await t.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        r.email
                      ),
                      await t.close(),
                      {
                        id: r._id.toString(),
                        email: r.email,
                        name: r.name,
                        role: r.role || 'user',
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
              jwt: async ({ token: e, user: t, account: n }) => (
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
          { auth: p, signIn: f, signOut: m } = o()(d);
      },
      5216: (e, t) => {
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var n in t)
              Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
          })(t, {
            DYNAMIC_ERROR_CODE: function () {
              return n;
            },
            DynamicServerError: function () {
              return r;
            },
          }));
        let n = 'DYNAMIC_SERVER_USAGE';
        class r extends Error {
          constructor(e) {
            (super('Dynamic server usage: ' + e), (this.digest = n));
          }
        }
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      30129: (e, t, n) => {
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'staticGenerationBailout', {
            enumerable: !0,
            get: function () {
              return i;
            },
          }));
        let r = n(5216),
          o = n(45869);
        class a extends Error {
          constructor(...e) {
            (super(...e), (this.code = 'NEXT_STATIC_GEN_BAILOUT'));
          }
        }
        function s(e, t) {
          let { dynamic: n, link: r } = t || {};
          return (
            'Page' +
            (n ? ' with `dynamic = "' + n + '"`' : '') +
            " couldn't be rendered statically because it used `" +
            e +
            '`.' +
            (r ? ' See more info here: ' + r : '')
          );
        }
        let i = (e, t) => {
          let { dynamic: n, link: i } = void 0 === t ? {} : t,
            l = o.staticGenerationAsyncStorage.getStore();
          if (!l) return !1;
          if (l.forceStatic) return !0;
          if (l.dynamicShouldError)
            throw new a(s(e, { link: i, dynamic: null != n ? n : 'error' }));
          let c = s(e, {
            dynamic: n,
            link: 'https://nextjs.org/docs/messages/dynamic-server-error',
          });
          if (
            (null == l.postpone || l.postpone.call(l, e),
            (l.revalidate = 0),
            l.isStaticGeneration)
          ) {
            let t = new r.DynamicServerError(c);
            throw (
              (l.dynamicUsageDescription = e),
              (l.dynamicUsageStack = t.stack),
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
  var t = require('../../../../webpack-runtime.js');
  t.C(e);
  var n = e => t((t.s = e)),
    r = t.X(0, [775, 286, 778, 321], () => n(11151));
  module.exports = r;
})();
