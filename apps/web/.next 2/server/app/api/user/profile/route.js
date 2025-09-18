'use strict';
(() => {
  var e = {};
  ((e.id = 70),
    (e.ids = [70]),
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
      65331: (e, o, r) => {
        (r.r(o),
          r.d(o, {
            headerHooks: () => x,
            originalPathname: () => O,
            patchFetch: () => I,
            requestAsyncStorage: () => y,
            routeModule: () => P,
            serverHooks: () => v,
            staticGenerationAsyncStorage: () => h,
            staticGenerationBailout: () => j,
          }));
        var t = {};
        (r.r(t), r.d(t, { GET: () => w, PUT: () => b }));
        var n = r(36621),
          i = r(36844),
          a = r(84827),
          s = r(3387),
          l = r(41239),
          u = r(38013),
          c = r(16063),
          d = r(79605);
        function p(e, o) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(e);
            (o &&
              (t = t.filter(function (o) {
                return Object.getOwnPropertyDescriptor(e, o).enumerable;
              })),
              r.push.apply(r, t));
          }
          return r;
        }
        function f(e) {
          for (var o = 1; o < arguments.length; o++) {
            var r = null != arguments[o] ? arguments[o] : {};
            o % 2
              ? p(Object(r), !0).forEach(function (o) {
                  var t, n;
                  ((t = o),
                    (n = r[o]),
                    (t = (function (e) {
                      var o = (function (e, o) {
                        if ('object' != typeof e || null === e) return e;
                        var r = e[Symbol.toPrimitive];
                        if (void 0 !== r) {
                          var t = r.call(e, o || 'default');
                          if ('object' != typeof t) return t;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === o ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof o ? o : String(o);
                    })(t)) in e
                      ? Object.defineProperty(e, t, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[t] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : p(Object(r)).forEach(function (o) {
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
          g = c.Ry({
            name: c.Z_().min(2, 'Nome deve ter pelo menos 2 caracteres'),
            email: c.Z_().email('Email inv\xe1lido'),
            profile: c
              .Ry({
                riskTolerance: c
                  .Km(['conservative', 'moderate', 'aggressive'])
                  .optional(),
                financialGoals: c.IX(c.Z_()).optional(),
                incomeRange: c.Z_().optional(),
                ageGroup: c.Z_().optional(),
                financialKnowledgeLevel: c
                  .Km(['beginner', 'intermediate', 'advanced'])
                  .optional(),
                monthlyIncome: c.Rx().min(0).optional(),
                spendingCategories: c
                  .Ry({
                    housing: c.Rx().min(0),
                    food: c.Rx().min(0),
                    transport: c.Rx().min(0),
                    entertainment: c.Rx().min(0),
                    healthcare: c.Rx().min(0),
                    education: c.Rx().min(0),
                    other: c.Rx().min(0),
                  })
                  .optional(),
                emergencyFund: c.Rx().min(0).optional(),
                investmentExperience: c
                  .Km(['beginner', 'intermediate', 'advanced'])
                  .optional(),
              })
              .optional(),
          });
        async function b(e) {
          try {
            let o = await (0, l.I8)();
            if (!o?.user?.id)
              return s.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let r = o.user.id;
            console.log(
              '[API Profile] ID do usu\xe1rio para atualiza\xe7\xe3o:',
              r
            );
            let t = await e.json();
            console.log('[API Profile] Payload recebido:', t);
            let { name: n, email: i, profile: a } = g.parse(t);
            (await m.connect(),
              console.log('[API Profile] Conex\xe3o com MongoDB estabelecida'));
            let c = m.db().collection('users'),
              d = await c.findOne({ _id: new u.ObjectId(r) });
            if (
              (console.log(
                '[API Profile] Usu\xe1rio antes da atualiza\xe7\xe3o:',
                d ? `ID: ${d._id}, Email: ${d.email}` : 'N\xe3o encontrado'
              ),
              i !== o.user.email &&
                (await c.findOne({
                  email: i,
                  _id: { $ne: new u.ObjectId(r) },
                })))
            )
              return (
                console.log(
                  '[API Profile] Email j\xe1 em uso por outro usu\xe1rio:',
                  i
                ),
                s.Z.json(
                  {
                    message:
                      'Este email j\xe1 est\xe1 sendo usado por outro usu\xe1rio',
                  },
                  { status: 400 }
                )
              );
            let p = { name: n, email: i, updatedAt: new Date() };
            if (a) {
              if (
                (console.log('[API Profile] Atualizando profile:', a),
                d?.profile)
              ) {
                console.log(
                  '[API Profile] Combinando com dados do profile existente'
                );
                let e = d.profile;
                p.profile = f(f({}, e), a);
              } else p.profile = a;
            } else
              d?.profile
                ? (console.log('[API Profile] Mantendo profile existente'),
                  (p.profile = d.profile))
                : (console.log('[API Profile] Criando profile vazio'),
                  (p.profile = {}));
            let b = await c.updateOne(
              { _id: new u.ObjectId(r) },
              { $set: p, $unset: { perfil: '' } }
            );
            console.log('[API Profile] Resultado da atualiza\xe7\xe3o:', b);
            let w = await c.findOne({ _id: new u.ObjectId(r) });
            if (
              (console.log(
                '[API Profile] Usu\xe1rio ap\xf3s atualiza\xe7\xe3o:',
                w
                  ? `ID: ${w._id}, Email: ${w.email}, Nome: ${w.name}`
                  : 'N\xe3o encontrado'
              ),
              console.log(
                '[API Profile] Perfil ap\xf3s atualiza\xe7\xe3o:',
                w?.perfil
              ),
              0 === b.matchedCount)
            )
              return (
                console.log(
                  '[API Profile] Usu\xe1rio n\xe3o encontrado ap\xf3s tentativa de atualiza\xe7\xe3o'
                ),
                s.Z.json(
                  { message: 'Usu\xe1rio n\xe3o encontrado' },
                  { status: 404 }
                )
              );
            return (
              console.log('[API Profile] Perfil atualizado com sucesso'),
              s.Z.json(
                { message: 'Perfil atualizado com sucesso' },
                { status: 200 }
              )
            );
          } catch (e) {
            if ((console.error('Profile update error:', e), e instanceof d.jm))
              return s.Z.json(
                { message: 'Dados inv\xe1lidos', errors: e.errors },
                { status: 400 }
              );
            return s.Z.json(
              { message: 'Erro interno do servidor' },
              { status: 500 }
            );
          } finally {
            await m.close();
          }
        }
        async function w() {
          try {
            let e = await (0, l.I8)();
            if (!e?.user?.id)
              return s.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            await m.connect();
            let o = m.db().collection('users'),
              r = await o.findOne(
                { _id: new u.ObjectId(e.user.id) },
                { projection: { password: 0 } }
              );
            if (!r)
              return s.Z.json(
                { message: 'Usu\xe1rio n\xe3o encontrado' },
                { status: 404 }
              );
            return s.Z.json(r, { status: 200 });
          } catch (e) {
            return (
              console.error('Profile fetch error:', e),
              s.Z.json({ message: 'Erro interno do servidor' }, { status: 500 })
            );
          } finally {
            await m.close();
          }
        }
        let P = new n.AppRouteRouteModule({
            definition: {
              kind: i.x.APP_ROUTE,
              page: '/api/user/profile/route',
              pathname: '/api/user/profile',
              filename: 'route',
              bundlePath: 'app/api/user/profile/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/profile/route.ts',
            nextConfigOutput: '',
            userland: t,
          }),
          {
            requestAsyncStorage: y,
            staticGenerationAsyncStorage: h,
            serverHooks: v,
            headerHooks: x,
            staticGenerationBailout: j,
          } = P,
          O = '/api/user/profile/route';
        function I() {
          return (0, a.patchFetch)({
            serverHooks: v,
            staticGenerationAsyncStorage: h,
          });
        }
      },
      41239: (e, o, r) => {
        r.d(o, { I8: () => p, Lz: () => d });
        var t = r(78892),
          n = r.n(t),
          i = r(21339),
          a = r(38013),
          s = r(42150),
          l = r.n(s);
        async function u() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new a.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let c = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, i.Z)({
                name: 'credentials',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  password: { label: 'Password', type: 'password' },
                },
                async authorize(e) {
                  if (!e?.email || !e?.password) return null;
                  try {
                    console.log('\uD83D\uDD10 Tentando autenticar:', e.email);
                    let { client: o, db: r } = await u(),
                      t = await r
                        .collection('users')
                        .findOne({ email: e.email.toLowerCase() });
                    if (!t || !t.password)
                      return (
                        console.log(
                          '❌ Usu\xe1rio n\xe3o encontrado ou sem senha'
                        ),
                        await o.close(),
                        null
                      );
                    if (!(await l().compare(e.password, t.password)))
                      return (
                        console.log('❌ Senha inv\xe1lida'),
                        await o.close(),
                        null
                      );
                    return (
                      console.log(
                        '✅ Autentica\xe7\xe3o bem-sucedida para:',
                        t.email
                      ),
                      await o.close(),
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
          { auth: p, signIn: f, signOut: m } = n()(d);
      },
    }));
  var o = require('../../../../webpack-runtime.js');
  o.C(e);
  var r = e => o((o.s = e)),
    t = o.X(0, [775, 286, 778, 321, 13], () => r(65331));
  module.exports = t;
})();
