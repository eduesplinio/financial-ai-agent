'use strict';
(() => {
  var e = {};
  ((e.id = 878),
    (e.ids = [878]),
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
      41254: (e, r, n) => {
        (n.r(r),
          n.d(r, {
            headerHooks: () => P,
            originalPathname: () => I,
            patchFetch: () => j,
            requestAsyncStorage: () => w,
            routeModule: () => b,
            serverHooks: () => x,
            staticGenerationAsyncStorage: () => v,
            staticGenerationBailout: () => O,
          }));
        var t = {};
        (n.r(t), n.d(t, { GET: () => h, PUT: () => y }));
        var o = n(36621),
          a = n(36844),
          i = n(84827),
          s = n(3387),
          l = n(78892),
          c = n(41239),
          u = n(38013),
          d = n(16063);
        function p(e, r) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(e);
            (r &&
              (t = t.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              n.push.apply(n, t));
          }
          return n;
        }
        function f(e) {
          for (var r = 1; r < arguments.length; r++) {
            var n = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? p(Object(n), !0).forEach(function (r) {
                  var t, o;
                  ((t = r),
                    (o = n[r]),
                    (t = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var n = e[Symbol.toPrimitive];
                        if (void 0 !== n) {
                          var t = n.call(e, r || 'default');
                          if ('object' != typeof t) return t;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(t)) in e
                      ? Object.defineProperty(e, t, {
                          value: o,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[t] = o));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(n)
                  )
                : p(Object(n)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(n, r)
                    );
                  });
          }
          return e;
        }
        let g = process.env.MONGODB_URI;
        if (!g)
          throw Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
          );
        let m = d.Ry({
          monthlyIncome: d.Rx().min(0),
          spendingCategories: d.Ry({
            housing: d.Rx().min(0),
            food: d.Rx().min(0),
            transport: d.Rx().min(0),
            entertainment: d.Rx().min(0),
            healthcare: d.Rx().min(0),
            education: d.Rx().min(0),
            other: d.Rx().min(0),
          }),
          riskProfile: d.Km(['conservative', 'moderate', 'aggressive']),
          financialGoals: d.IX(d.Z_()),
          emergencyFund: d.Rx().min(0),
          investmentExperience: d.Km(['beginner', 'intermediate', 'advanced']),
        });
        async function h(e) {
          try {
            let e = await (0, l.getServerSession)(c.Lz);
            if (!e?.user?.id)
              return s.Z.json({ error: 'Unauthorized' }, { status: 401 });
            let r = new u.MongoClient(g);
            await r.connect();
            let n = r.db().collection('users'),
              t = await n.findOne({ _id: new u.ObjectId(e.user.id) });
            if ((await r.close(), !t || !t.profile))
              return s.Z.json({
                monthlyIncome: 0,
                spendingCategories: {
                  housing: 0,
                  food: 0,
                  transport: 0,
                  entertainment: 0,
                  healthcare: 0,
                  education: 0,
                  other: 0,
                },
                riskProfile: 'moderate',
                financialGoals: [],
                emergencyFund: 0,
                investmentExperience: 'beginner',
              });
            let o = t.profile,
              a = {
                monthlyIncome: o.monthlyIncome || 0,
                spendingCategories: o.spendingCategories || {
                  housing: 0,
                  food: 0,
                  transport: 0,
                  entertainment: 0,
                  healthcare: 0,
                  education: 0,
                  other: 0,
                },
                riskProfile: o.riskTolerance || 'moderate',
                financialGoals: o.financialGoals || [],
                emergencyFund: o.emergencyFund || 0,
                investmentExperience: o.financialKnowledgeLevel || 'beginner',
              };
            return s.Z.json(a);
          } catch (e) {
            return (
              console.error('Error fetching financial profile:', e),
              s.Z.json({ error: 'Internal server error' }, { status: 500 })
            );
          }
        }
        async function y(e) {
          try {
            let r = await (0, l.getServerSession)(c.Lz);
            if (!r?.user?.id)
              return s.Z.json({ error: 'Unauthorized' }, { status: 401 });
            let n = r.user.id;
            console.log('[API] ID do usu\xe1rio para atualiza\xe7\xe3o:', n);
            let t = await e.json();
            console.log('[API] Payload recebido para financialProfile:', t);
            let o = m.safeParse(t);
            if (!o.success)
              return (
                console.log('[API] Dados inv\xe1lidos:', o.error.errors),
                s.Z.json(
                  { error: 'Invalid data', details: o.error.errors },
                  { status: 400 }
                )
              );
            let a = new u.MongoClient(g);
            (await a.connect(),
              console.log('[API] Conex\xe3o com MongoDB estabelecida'));
            let i = a.db().collection('users'),
              d = await i.findOne({ _id: new u.ObjectId(n) });
            (console.log(
              '[API] Usu\xe1rio antes da atualiza\xe7\xe3o:',
              d ? `ID: ${d._id}, Email: ${d.email}` : 'N\xe3o encontrado'
            ),
              console.log(
                '[API] financialProfile antes:',
                d?.financialProfile
              ));
            let p = await i.updateOne(
              { _id: new u.ObjectId(n) },
              {
                $set: {
                  profile: f(
                    f({}, d?.profile || {}),
                    {},
                    {
                      monthlyIncome: o.data.monthlyIncome,
                      spendingCategories: o.data.spendingCategories,
                      emergencyFund: o.data.emergencyFund,
                      riskTolerance: o.data.riskProfile,
                      financialGoals: o.data.financialGoals,
                      financialKnowledgeLevel: o.data.investmentExperience,
                    }
                  ),
                  updatedAt: new Date(),
                },
                $unset: { perfil: '' },
              }
            );
            console.log('[API] Resultado da atualiza\xe7\xe3o:', p);
            let h = await i.findOne({ _id: new u.ObjectId(n) });
            return (
              console.log(
                '[API] Usu\xe1rio ap\xf3s atualiza\xe7\xe3o:',
                h ? `ID: ${h._id}, Email: ${h.email}` : 'N\xe3o encontrado'
              ),
              console.log(
                '[API] financialProfile ap\xf3s atualiza\xe7\xe3o:',
                h?.financialProfile
              ),
              await a.close(),
              console.log('[API] Conex\xe3o com MongoDB fechada'),
              s.Z.json({ success: !0, data: o.data })
            );
          } catch (e) {
            return (
              console.error('[API] Erro ao atualizar financialProfile:', e),
              s.Z.json({ error: 'Internal server error' }, { status: 500 })
            );
          }
        }
        let b = new o.AppRouteRouteModule({
            definition: {
              kind: a.x.APP_ROUTE,
              page: '/api/user/financial-profile/route',
              pathname: '/api/user/financial-profile',
              filename: 'route',
              bundlePath: 'app/api/user/financial-profile/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/financial-profile/route.ts',
            nextConfigOutput: '',
            userland: t,
          }),
          {
            requestAsyncStorage: w,
            staticGenerationAsyncStorage: v,
            serverHooks: x,
            headerHooks: P,
            staticGenerationBailout: O,
          } = b,
          I = '/api/user/financial-profile/route';
        function j() {
          return (0, i.patchFetch)({
            serverHooks: x,
            staticGenerationAsyncStorage: v,
          });
        }
      },
      41239: (e, r, n) => {
        n.d(r, { I8: () => p, Lz: () => d });
        var t = n(78892),
          o = n.n(t),
          a = n(21339),
          i = n(38013),
          s = n(42150),
          l = n.n(s);
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
                    let { client: r, db: n } = await c(),
                      t = await n
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!t || !t.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await r.close(),
                        null
                      );
                    if (!(await l().compare(e.password, t.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await r.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        t.email
                      ),
                      await r.close(),
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
              jwt: async ({ token: e, user: r, account: n }) => (
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
          { auth: p, signIn: f, signOut: g } = o()(d);
      },
    }));
  var r = require('../../../../webpack-runtime.js');
  r.C(e);
  var n = e => r((r.s = e)),
    t = r.X(0, [775, 286, 778, 321, 13], () => n(41254));
  module.exports = t;
})();
