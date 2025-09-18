'use strict';
(() => {
  var e = {};
  ((e.id = 69),
    (e.ids = [69]),
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
      95717: (e, r, o) => {
        (o.r(r),
          o.d(r, {
            headerHooks: () => O,
            originalPathname: () => v,
            patchFetch: () => y,
            requestAsyncStorage: () => h,
            routeModule: () => m,
            serverHooks: () => b,
            staticGenerationAsyncStorage: () => x,
            staticGenerationBailout: () => I,
          }));
        var t = {};
        (o.r(t), o.d(t, { GET: () => f, PUT: () => w }));
        var n = o(36621),
          s = o(36844),
          a = o(84827),
          i = o(3387),
          c = o(78892),
          l = o(41239),
          u = o(38013),
          d = o(16063);
        let p = process.env.MONGODB_URI;
        if (!p)
          throw Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
          );
        let g = d.Ry({
          email: d.O7(),
          push: d.O7(),
          marketing: d.O7(),
          largeTransactions: d.O7(),
          unusualSpending: d.O7(),
          goalProgress: d.O7(),
          budgetExceeded: d.O7(),
        });
        async function f(e) {
          try {
            let e = await (0, c.getServerSession)(l.Lz);
            if (!e?.user?.id)
              return i.Z.json({ error: 'Unauthorized' }, { status: 401 });
            let r = new u.MongoClient(p);
            await r.connect();
            let o = r.db().collection('users'),
              t = await o.findOne({ _id: new u.ObjectId(e.user.id) });
            if (
              (await r.close(),
              !t || !t.preferences || !t.preferences.notifications)
            )
              return i.Z.json({
                email: !0,
                push: !0,
                marketing: !1,
                largeTransactions: !0,
                unusualSpending: !0,
                goalProgress: !0,
                budgetExceeded: !0,
              });
            return i.Z.json(t.preferences.notifications);
          } catch (e) {
            return (
              console.error('Error fetching notification settings:', e),
              i.Z.json({ error: 'Internal server error' }, { status: 500 })
            );
          }
        }
        async function w(e) {
          try {
            let r = await (0, c.getServerSession)(l.Lz);
            if (!r?.user?.id)
              return i.Z.json({ error: 'Unauthorized' }, { status: 401 });
            let o = r.user.id;
            console.log(
              '[API Notifications] ID do usu\xe1rio para atualiza\xe7\xe3o:',
              o
            );
            let t = await e.json();
            console.log('[API Notifications] Payload recebido:', t);
            let n = g.safeParse(t);
            if (!n.success)
              return (
                console.log(
                  '[API Notifications] Dados inv\xe1lidos:',
                  n.error.errors
                ),
                i.Z.json(
                  { error: 'Invalid data', details: n.error.errors },
                  { status: 400 }
                )
              );
            let s = new u.MongoClient(p);
            (await s.connect(),
              console.log(
                '[API Notifications] Conex\xe3o com MongoDB estabelecida'
              ));
            let a = s.db().collection('users'),
              d = await a.findOne({ _id: new u.ObjectId(o) });
            (console.log(
              '[API Notifications] Usu\xe1rio antes da atualiza\xe7\xe3o:',
              d ? `ID: ${d._id}, Email: ${d.email}` : 'N\xe3o encontrado'
            ),
              console.log(
                '[API Notifications] Prefer\xeancias de notifica\xe7\xe3o antes:',
                d?.preferences?.notifications
              ));
            let f = await a.updateOne(
              { _id: new u.ObjectId(o) },
              {
                $set: {
                  'preferences.notifications': n.data,
                  'preferences.updatedAt': new Date(),
                },
              }
            );
            console.log(
              '[API Notifications] Resultado da atualiza\xe7\xe3o:',
              f
            );
            let w = await a.findOne({ _id: new u.ObjectId(o) });
            return (
              console.log(
                '[API Notifications] Usu\xe1rio ap\xf3s atualiza\xe7\xe3o:',
                w ? `ID: ${w._id}, Email: ${w.email}` : 'N\xe3o encontrado'
              ),
              console.log(
                '[API Notifications] Prefer\xeancias de notifica\xe7\xe3o ap\xf3s:',
                w?.preferences?.notifications
              ),
              await s.close(),
              console.log('[API Notifications] Conex\xe3o com MongoDB fechada'),
              i.Z.json({ success: !0, data: n.data })
            );
          } catch (e) {
            return (
              console.error('Error updating notification settings:', e),
              i.Z.json({ error: 'Internal server error' }, { status: 500 })
            );
          }
        }
        let m = new n.AppRouteRouteModule({
            definition: {
              kind: s.x.APP_ROUTE,
              page: '/api/user/notifications/route',
              pathname: '/api/user/notifications',
              filename: 'route',
              bundlePath: 'app/api/user/notifications/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/user/notifications/route.ts',
            nextConfigOutput: '',
            userland: t,
          }),
          {
            requestAsyncStorage: h,
            staticGenerationAsyncStorage: x,
            serverHooks: b,
            headerHooks: O,
            staticGenerationBailout: I,
          } = m,
          v = '/api/user/notifications/route';
        function y() {
          return (0, a.patchFetch)({
            serverHooks: b,
            staticGenerationAsyncStorage: x,
          });
        }
      },
      41239: (e, r, o) => {
        o.d(r, { I8: () => p, Lz: () => d });
        var t = o(78892),
          n = o.n(t),
          s = o(21339),
          a = o(38013),
          i = o(42150),
          c = o.n(i);
        async function l() {
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
                    let { client: r, db: o } = await l(),
                      t = await o
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
                    if (!(await c().compare(e.password, t.password)))
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
              jwt: async ({ token: e, user: r, account: o }) => (
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
          { auth: p, signIn: g, signOut: f } = n()(d);
      },
    }));
  var r = require('../../../../webpack-runtime.js');
  r.C(e);
  var o = e => r((r.s = e)),
    t = r.X(0, [775, 286, 778, 321, 13], () => o(95717));
  module.exports = t;
})();
