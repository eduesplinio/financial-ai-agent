(() => {
  var e = {};
  ((e.id = 3),
    (e.ids = [3]),
    (e.modules = {
      47849: e => {
        'use strict';
        e.exports = require('next/dist/client/components/action-async-storage.external');
      },
      72934: e => {
        'use strict';
        e.exports = require('next/dist/client/components/action-async-storage.external.js');
      },
      55403: e => {
        'use strict';
        e.exports = require('next/dist/client/components/request-async-storage.external');
      },
      54580: e => {
        'use strict';
        e.exports = require('next/dist/client/components/request-async-storage.external.js');
      },
      94749: e => {
        'use strict';
        e.exports = require('next/dist/client/components/static-generation-async-storage.external');
      },
      45869: e => {
        'use strict';
        e.exports = require('next/dist/client/components/static-generation-async-storage.external.js');
      },
      20399: e => {
        'use strict';
        e.exports = require('next/dist/compiled/next-server/app-page.runtime.prod.js');
      },
      11744: (e, r, s) => {
        'use strict';
        (s.r(r),
          s.d(r, {
            GlobalError: () => i.a,
            __next_app__: () => p,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => m,
            tree: () => d,
          }));
        var t = s(34701),
          n = s(36844),
          a = s(17688),
          i = s.n(a),
          o = s(52631),
          l = {};
        for (let e in o)
          0 >
            [
              'default',
              'tree',
              'pages',
              'GlobalError',
              'originalPathname',
              '__next_app__',
              'routeModule',
            ].indexOf(e) && (l[e] = () => o[e]);
        s.d(r, l);
        let d = [
            '',
            {
              children: [
                'admin',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(s.bind(s, 11857)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/admin/page.tsx',
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(s.t.bind(s, 36165, 23)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/layout.tsx',
              ],
              error: [
                () => Promise.resolve().then(s.bind(s, 39269)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx',
              ],
              loading: [
                () => Promise.resolve().then(s.bind(s, 83411)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx',
              ],
              'not-found': [
                () => Promise.resolve().then(s.bind(s, 39432)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx',
              ],
            },
          ],
          c = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/admin/page.tsx',
          ],
          u = '/admin/page',
          p = { require: s, loadChunk: () => Promise.resolve() },
          m = new t.AppPageRouteModule({
            definition: {
              kind: n.x.APP_PAGE,
              page: '/admin/page',
              pathname: '/admin',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      59999: (e, r, s) => {
        (Promise.resolve().then(s.bind(s, 68652)),
          Promise.resolve().then(s.bind(s, 59121)));
      },
      68652: (e, r, s) => {
        'use strict';
        (s.r(r), s.d(r, { AdminContent: () => i }));
        var t = s(39222),
          n = s(28285),
          a = s(73793);
        function i() {
          let { data: e } = (0, t.useSession)();
          return e?.user
            ? (0, a.jsxs)('div', {
                className: 'container mx-auto py-8 px-4',
                children: [
                  (0, a.jsxs)('div', {
                    className: 'mb-8',
                    children: [
                      a.jsx('h1', {
                        className: 'text-3xl font-bold',
                        children: 'Painel Administrativo',
                      }),
                      a.jsx('p', {
                        className: 'text-muted-foreground',
                        children:
                          'Gerencie usu\xe1rios e configura\xe7\xf5es do sistema',
                      }),
                    ],
                  }),
                  (0, a.jsxs)('div', {
                    className:
                      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                    children: [
                      (0, a.jsxs)(n.Zb, {
                        children: [
                          (0, a.jsxs)(n.Ol, {
                            children: [
                              a.jsx(n.ll, { children: 'Usu\xe1rios' }),
                              a.jsx(n.SZ, {
                                children: 'Gerencie contas de usu\xe1rio',
                              }),
                            ],
                          }),
                          a.jsx(n.aY, {
                            children: a.jsx('p', {
                              className: 'text-sm text-muted-foreground',
                              children:
                                'Visualize, edite e gerencie contas de usu\xe1rio',
                            }),
                          }),
                        ],
                      }),
                      (0, a.jsxs)(n.Zb, {
                        children: [
                          (0, a.jsxs)(n.Ol, {
                            children: [
                              a.jsx(n.ll, { children: 'Logs do Sistema' }),
                              a.jsx(n.SZ, {
                                children: 'Monitore atividades do sistema',
                              }),
                            ],
                          }),
                          a.jsx(n.aY, {
                            children: a.jsx('p', {
                              className: 'text-sm text-muted-foreground',
                              children:
                                'Visualize logs de seguran\xe7a e auditoria',
                            }),
                          }),
                        ],
                      }),
                      (0, a.jsxs)(n.Zb, {
                        children: [
                          (0, a.jsxs)(n.Ol, {
                            children: [
                              a.jsx(n.ll, { children: 'Configura\xe7\xf5es' }),
                              a.jsx(n.SZ, {
                                children: 'Configure par\xe2metros do sistema',
                              }),
                            ],
                          }),
                          a.jsx(n.aY, {
                            children: a.jsx('p', {
                              className: 'text-sm text-muted-foreground',
                              children:
                                'Ajuste configura\xe7\xf5es globais do sistema',
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.jsx('div', {
                    className: 'mt-8',
                    children: (0, a.jsxs)(n.Zb, {
                      children: [
                        (0, a.jsxs)(n.Ol, {
                          children: [
                            a.jsx(n.ll, {
                              children: 'Informa\xe7\xf5es do Administrador',
                            }),
                            a.jsx(n.SZ, {
                              children:
                                'Detalhes da sua sess\xe3o administrativa',
                            }),
                          ],
                        }),
                        a.jsx(n.aY, {
                          children: (0, a.jsxs)('div', {
                            className: 'space-y-2',
                            children: [
                              (0, a.jsxs)('p', {
                                children: [
                                  a.jsx('strong', { children: 'Nome:' }),
                                  ' ',
                                  e.user.name,
                                ],
                              }),
                              (0, a.jsxs)('p', {
                                children: [
                                  a.jsx('strong', { children: 'Email:' }),
                                  ' ',
                                  e.user.email,
                                ],
                              }),
                              (0, a.jsxs)('p', {
                                children: [
                                  a.jsx('strong', {
                                    children: 'Fun\xe7\xe3o:',
                                  }),
                                  ' ',
                                  e.user.role,
                                ],
                              }),
                              (0, a.jsxs)('p', {
                                children: [
                                  a.jsx('strong', { children: 'ID:' }),
                                  ' ',
                                  e.user.id,
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  }),
                ],
              })
            : a.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: (0, a.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    a.jsx('div', {
                      className:
                        'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto',
                    }),
                    a.jsx('p', {
                      className: 'mt-4 text-gray-600',
                      children: 'Carregando painel administrativo...',
                    }),
                  ],
                }),
              });
        }
      },
      28285: (e, r, s) => {
        'use strict';
        s.d(r, {
          Ol: () => g,
          SZ: () => h,
          Zb: () => f,
          aY: () => b,
          ll: () => j,
        });
        var t = s(12363),
          n = s(24662),
          a = s(73793);
        let i = ['className'],
          o = ['className'],
          l = ['className'],
          d = ['className'],
          c = ['className'],
          u = ['className'];
        function p(e, r) {
          var s = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(e);
            (r &&
              (t = t.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              s.push.apply(s, t));
          }
          return s;
        }
        function m(e) {
          for (var r = 1; r < arguments.length; r++) {
            var s = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? p(Object(s), !0).forEach(function (r) {
                  var t, n;
                  ((t = r),
                    (n = s[r]),
                    (t = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var s = e[Symbol.toPrimitive];
                        if (void 0 !== s) {
                          var t = s.call(e, r || 'default');
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
                    Object.getOwnPropertyDescriptors(s)
                  )
                : p(Object(s)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(s, r)
                    );
                  });
          }
          return e;
        }
        function x(e, r) {
          if (null == e) return {};
          var s,
            t,
            n = (function (e, r) {
              if (null == e) return {};
              var s,
                t,
                n = {},
                a = Object.keys(e);
              for (t = 0; t < a.length; t++)
                ((s = a[t]), r.indexOf(s) >= 0 || (n[s] = e[s]));
              return n;
            })(e, r);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (t = 0; t < a.length; t++)
              ((s = a[t]),
                !(r.indexOf(s) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, s) &&
                  (n[s] = e[s]));
          }
          return n;
        }
        let f = t.forwardRef((e, r) => {
          let { className: s } = e,
            t = x(e, i);
          return a.jsx(
            'div',
            m(
              {
                ref: r,
                className: (0, n.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  s
                ),
              },
              t
            )
          );
        });
        f.displayName = 'Card';
        let g = t.forwardRef((e, r) => {
          let { className: s } = e,
            t = x(e, o);
          return a.jsx(
            'div',
            m(
              {
                ref: r,
                className: (0, n.cn)('flex flex-col space-y-1.5 p-6', s),
              },
              t
            )
          );
        });
        g.displayName = 'CardHeader';
        let j = t.forwardRef((e, r) => {
          let { className: s } = e,
            t = x(e, l);
          return a.jsx(
            'h3',
            m(
              {
                ref: r,
                className: (0, n.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  s
                ),
              },
              t
            )
          );
        });
        j.displayName = 'CardTitle';
        let h = t.forwardRef((e, r) => {
          let { className: s } = e,
            t = x(e, d);
          return a.jsx(
            'p',
            m(
              {
                ref: r,
                className: (0, n.cn)('text-sm text-muted-foreground', s),
              },
              t
            )
          );
        });
        h.displayName = 'CardDescription';
        let b = t.forwardRef((e, r) => {
          let { className: s } = e,
            t = x(e, c);
          return a.jsx(
            'div',
            m({ ref: r, className: (0, n.cn)('p-6 pt-0', s) }, t)
          );
        });
        ((b.displayName = 'CardContent'),
          (t.forwardRef((e, r) => {
            let { className: s } = e,
              t = x(e, u);
            return a.jsx(
              'div',
              m(
                {
                  ref: r,
                  className: (0, n.cn)('flex items-center p-6 pt-0', s),
                },
                t
              )
            );
          }).displayName = 'CardFooter'));
      },
      69557: (e, r, s) => {
        e.exports = s(53651);
      },
      11857: (e, r, s) => {
        'use strict';
        (s.r(r), s.d(r, { default: () => c }));
        var t = s(12475),
          n = s(33445);
        let a = (0, n.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/admin/admin-content.tsx`
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let l = (0, n.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/admin/admin-content.tsx#AdminContent`
        );
        var d = s(65657);
        function c() {
          return d.jsx(t.a, {
            requireAuth: !0,
            requiredRole: 'admin',
            children: d.jsx(l, {}),
          });
        }
      },
      65657: (e, r, s) => {
        'use strict';
        e.exports = s(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var r = require('../../webpack-runtime.js');
  r.C(e);
  var s = e => r((r.s = e)),
    t = r.X(0, [775, 204, 751], () => s(11744));
  module.exports = t;
})();
