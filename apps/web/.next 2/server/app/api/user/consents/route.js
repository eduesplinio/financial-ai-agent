'use strict';
(() => {
  var e = {};
  ((e.id = 329),
    (e.ids = [329]),
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
      93370: (e, t, n) => {
        (n.r(t),
          n.d(t, {
            headerHooks: () => A,
            originalPathname: () => I,
            patchFetch: () => x,
            requestAsyncStorage: () => h,
            routeModule: () => O,
            serverHooks: () => P,
            staticGenerationAsyncStorage: () => v,
            staticGenerationBailout: () => j,
          }));
        var o = {};
        (n.r(o), n.d(o, { GET: () => y, PUT: () => b }));
        var s = n(36621),
          r = n(36844),
          a = n(84827),
          i = n(3387),
          c = n(78892),
          l = n(41239),
          u = n(38013),
          d = n(16063),
          p = n(79605);
        function g(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            (t &&
              (o = o.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, o));
          }
          return n;
        }
        function m(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? g(Object(n), !0).forEach(function (t) {
                  var o, s;
                  ((o = t),
                    (s = n[t]),
                    (o = (function (e) {
                      var t = (function (e, t) {
                        if ('object' != typeof e || null === e) return e;
                        var n = e[Symbol.toPrimitive];
                        if (void 0 !== n) {
                          var o = n.call(e, t || 'default');
                          if ('object' != typeof o) return o;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === t ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof t ? t : String(t);
                    })(o)) in e
                      ? Object.defineProperty(e, o, {
                          value: s,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[o] = s));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(n)
                  )
                : g(Object(n)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(n, t)
                    );
                  });
          }
          return e;
        }
        let w = process.env.MONGODB_URI;
        if (!w)
          throw Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
          );
        let f = d.Ry({
          dataProcessing: d.O7(),
          analytics: d.O7(),
          marketing: d.O7(),
        });
        async function b(e) {
          try {
            let t = await (0, c.getServerSession)(l.Lz);
            if (!t?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let n = t.user.id;
            console.log(
              '[API Consents] ID do usu\xe1rio para atualiza\xe7\xe3o:',
              n
            );
            let o = await e.json();
            console.log('[API Consents] Payload recebido:', o);
            let s = f.parse(o),
              r = new u.MongoClient(w);
            (await r.connect(),
              console.log(
                '[API Consents] Conex\xe3o com MongoDB estabelecida'
              ));
            let a = r.db(),
              d = a.collection('users'),
              p = await d.findOne({ _id: new u.ObjectId(n) });
            (console.log(
              '[API Consents] Usu\xe1rio antes da atualiza\xe7\xe3o:',
              p ? `ID: ${p._id}, Email: ${p.email}` : 'N\xe3o encontrado'
            ),
              console.log('[API Consents] Consentimentos antes:', p?.consents));
            let g = await d.updateOne(
              { _id: new u.ObjectId(n) },
              { $set: { consents: s, updatedAt: new Date() } }
            );
            console.log('[API Consents] Resultado da atualiza\xe7\xe3o:', g);
            let b = await d.findOne({ _id: new u.ObjectId(n) });
            (console.log(
              '[API Consents] Usu\xe1rio ap\xf3s atualiza\xe7\xe3o:',
              b ? `ID: ${b._id}, Email: ${b.email}` : 'N\xe3o encontrado'
            ),
              console.log(
                '[API Consents] Consentimentos ap\xf3s atualiza\xe7\xe3o:',
                b?.consents
              ));
            let y = a.collection('user_consents'),
              O = a.collection('user_consent_history'),
              h = new Date(),
              v = m(
                m({ userId: t.user.id }, s),
                {},
                {
                  updatedAt: h,
                  ipAddress:
                    e.headers.get('x-forwarded-for') ||
                    e.headers.get('x-real-ip') ||
                    'unknown',
                  userAgent: e.headers.get('user-agent') || 'unknown',
                }
              ),
              P = await y.findOne({ userId: t.user.id }),
              A = await y.findOneAndUpdate(
                { userId: t.user.id },
                { $set: v, $setOnInsert: { createdAt: h } },
                { upsert: !0, returnDocument: 'after' }
              );
            return (
              P
                ? Object.keys(s).some(e => P[e] !== s[e]) &&
                  (await O.insertOne(
                    m(
                      m({}, v),
                      {},
                      {
                        action: 'updated',
                        previousState: {
                          dataProcessing: P.dataProcessing,
                          analytics: P.analytics,
                          marketing: P.marketing,
                        },
                      }
                    )
                  ))
                : await O.insertOne(
                    m(m({}, v), {}, { action: 'created', previousState: null })
                  ),
              await r.close(),
              i.Z.json(
                { message: 'Consentimentos salvos com sucesso', consents: A },
                { status: 200 }
              )
            );
          } catch (e) {
            if ((console.error('Consents save error:', e), e instanceof p.jm))
              return i.Z.json(
                { message: 'Dados inv\xe1lidos', errors: e.errors },
                { status: 400 }
              );
            return i.Z.json(
              { message: 'Erro interno do servidor' },
              { status: 500 }
            );
          }
        }
        async function y() {
          try {
            let e = await (0, c.getServerSession)(l.Lz);
            if (!e?.user?.id)
              return i.Z.json(
                { message: 'N\xe3o autorizado' },
                { status: 401 }
              );
            let t = e.user.id;
            console.log('[API Consents GET] ID do usu\xe1rio:', t);
            let n = new u.MongoClient(w);
            (await n.connect(),
              console.log(
                '[API Consents GET] Conex\xe3o com MongoDB estabelecida'
              ));
            let o = n.db(),
              s = o.collection('users'),
              r = await s.findOne({ _id: new u.ObjectId(t) });
            if (
              (console.log(
                '[API Consents GET] Usu\xe1rio encontrado:',
                r ? `ID: ${r._id}, Email: ${r.email}` : 'N\xe3o encontrado'
              ),
              r && r.consents)
            )
              return (
                console.log(
                  '[API Consents GET] Consentimentos encontrados no documento do usu\xe1rio:',
                  r.consents
                ),
                await n.close(),
                i.Z.json(r.consents, { status: 200 })
              );
            console.log(
              '[API Consents GET] Consentimentos n\xe3o encontrados no documento do usu\xe1rio, buscando na collection antiga'
            );
            let a = o.collection('user_consents'),
              d = await a.findOne(
                { userId: t },
                {
                  projection: { _id: 0, userId: 0, ipAddress: 0, userAgent: 0 },
                }
              );
            if (
              (console.log(
                '[API Consents GET] Resultado da busca na collection antiga:',
                d ? 'Encontrado' : 'N\xe3o encontrado'
              ),
              await n.close(),
              !d)
            ) {
              let e = {
                dataProcessing: !0,
                analytics: !1,
                marketing: !1,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              return (
                console.log(
                  '[API Consents GET] Retornando consentimentos padr\xe3o'
                ),
                i.Z.json(e, { status: 200 })
              );
            }
            return (
              console.log(
                '[API Consents GET] Retornando consentimentos da collection antiga'
              ),
              i.Z.json(d, { status: 200 })
            );
          } catch (e) {
            return (
              console.error('Consents fetch error:', e),
              i.Z.json({ message: 'Erro interno do servidor' }, { status: 500 })
            );
          }
        }
        let O = new s.AppRouteRouteModule({
            definition: {
              kind: r.x.APP_ROUTE,
              page: '/api/user/consents/route',
              pathname: '/api/user/consents',
              filename: 'route',
              bundlePath: 'app/api/user/consents/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/consents/route.ts',
            nextConfigOutput: '',
            userland: o,
          }),
          {
            requestAsyncStorage: h,
            staticGenerationAsyncStorage: v,
            serverHooks: P,
            headerHooks: A,
            staticGenerationBailout: j,
          } = O,
          I = '/api/user/consents/route';
        function x() {
          return (0, a.patchFetch)({
            serverHooks: P,
            staticGenerationAsyncStorage: v,
          });
        }
      },
      41239: (e, t, n) => {
        n.d(t, { I8: () => p, Lz: () => d });
        var o = n(78892),
          s = n.n(o),
          r = n(21339),
          a = n(38013),
          i = n(42150),
          c = n.n(i);
        async function l() {
          console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
          let e = new a.MongoClient(process.env.MONGODB_URI);
          return (await e.connect(), { client: e, db: e.db('financial_ai') });
        }
        let u = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !1,
          d = {
            session: { strategy: 'jwt', maxAge: 2592e3, updateAge: 86400 },
            providers: [
              (0, r.Z)({
                name: 'credentials',
                credentials: {
                  email: { label: 'Email', type: 'email' },
                  password: { label: 'Password', type: 'password' },
                },
                async authorize(e) {
                  if (!e?.email || !e?.password) return null;
                  try {
                    console.log('\uD83D\uDD10 Tentando autenticar:', e.email);
                    let { client: t, db: n } = await l(),
                      o = await n
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
                    if (!(await c().compare(e.password, o.password)))
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
          { auth: p, signIn: g, signOut: m } = s()(d);
      },
    }));
  var t = require('../../../../webpack-runtime.js');
  t.C(e);
  var n = e => t((t.s = e)),
    o = t.X(0, [775, 286, 778, 321, 13], () => n(93370));
  module.exports = o;
})();
