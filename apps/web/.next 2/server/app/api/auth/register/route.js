'use strict';
(() => {
  var e = {};
  ((e.id = 2),
    (e.ids = [2]),
    (e.modules = {
      38013: e => {
        e.exports = require('mongodb');
      },
      30517: e => {
        e.exports = require('next/dist/compiled/next-server/app-route.runtime.prod.js');
      },
      6113: e => {
        e.exports = require('crypto');
      },
      15287: (e, t, r) => {
        let s;
        (r.r(t),
          r.d(t, {
            headerHooks: () => v,
            originalPathname: () => x,
            patchFetch: () => b,
            requestAsyncStorage: () => h,
            routeModule: () => g,
            serverHooks: () => f,
            staticGenerationAsyncStorage: () => w,
            staticGenerationBailout: () => j,
          }));
        var a = {};
        (r.r(a), r.d(a, { POST: () => m }));
        var o = r(36621),
          i = r(36844),
          n = r(84827),
          u = r(3387),
          c = r(38013),
          p = r(42150),
          d = r.n(p);
        async function l() {
          return (
            s ||
              ((s = new c.MongoClient(process.env.MONGODB_URI)),
              await s.connect()),
            { client: s, db: s.db('financial_ai') }
          );
        }
        async function m(e) {
          try {
            let { name: t, email: r, password: s } = await e.json();
            if (!t || !r || !s)
              return u.Z.json(
                { message: 'Todos os campos s\xe3o obrigat\xf3rios' },
                { status: 400 }
              );
            if (s.length < 6)
              return u.Z.json(
                { message: 'Senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
              );
            let { db: a } = await l();
            if (await a.collection('users').findOne({ email: r.toLowerCase() }))
              return u.Z.json(
                { message: 'Usu\xe1rio j\xe1 existe com este email' },
                { status: 409 }
              );
            let o = await d().hash(s, 12),
              i = await a.collection('users').insertOne({
                name: t,
                email: r.toLowerCase(),
                password: o,
                role: 'user',
                createdAt: new Date(),
              });
            return u.Z.json(
              {
                message: 'Usu\xe1rio criado com sucesso',
                user: {
                  id: i.insertedId.toString(),
                  name: t,
                  email: r.toLowerCase(),
                },
              },
              { status: 201 }
            );
          } catch (e) {
            return u.Z.json(
              { message: 'Erro interno do servidor' },
              { status: 500 }
            );
          }
        }
        let g = new o.AppRouteRouteModule({
            definition: {
              kind: i.x.APP_ROUTE,
              page: '/api/auth/register/route',
              pathname: '/api/auth/register',
              filename: 'route',
              bundlePath: 'app/api/auth/register/route',
            },
            resolvedPagePath:
              '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/api/auth/register/route.ts',
            nextConfigOutput: '',
            userland: a,
          }),
          {
            requestAsyncStorage: h,
            staticGenerationAsyncStorage: w,
            serverHooks: f,
            headerHooks: v,
            staticGenerationBailout: j,
          } = g,
          x = '/api/auth/register/route';
        function b() {
          return (0, n.patchFetch)({
            serverHooks: f,
            staticGenerationAsyncStorage: w,
          });
        }
      },
    }));
  var t = require('../../../../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    s = t.X(0, [775, 286, 321], () => r(15287));
  module.exports = s;
})();
