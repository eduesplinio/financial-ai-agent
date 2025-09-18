(() => {
  var e = {};
  ((e.id = 639),
    (e.ids = [639]),
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
      64725: (e, s, r) => {
        'use strict';
        (r.r(s),
          r.d(s, {
            GlobalError: () => i.a,
            __next_app__: () => p,
            originalPathname: () => u,
            pages: () => d,
            routeModule: () => x,
            tree: () => c,
          }));
        var t = r(34701),
          a = r(36844),
          n = r(17688),
          i = r.n(n),
          l = r(52631),
          o = {};
        for (let e in l)
          0 >
            [
              'default',
              'tree',
              'pages',
              'GlobalError',
              'originalPathname',
              '__next_app__',
              'routeModule',
            ].indexOf(e) && (o[e] = () => l[e]);
        r.d(s, o);
        let c = [
            '',
            {
              children: [
                'goals',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(r.bind(r, 58211)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/goals/page.tsx',
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(r.t.bind(r, 36165, 23)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/layout.tsx',
              ],
              error: [
                () => Promise.resolve().then(r.bind(r, 39269)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx',
              ],
              loading: [
                () => Promise.resolve().then(r.bind(r, 83411)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx',
              ],
              'not-found': [
                () => Promise.resolve().then(r.bind(r, 39432)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx',
              ],
            },
          ],
          d = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/goals/page.tsx',
          ],
          u = '/goals/page',
          p = { require: r, loadChunk: () => Promise.resolve() },
          x = new t.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: '/goals/page',
              pathname: '/goals',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: c },
          });
      },
      62250: (e, s, r) => {
        (Promise.resolve().then(r.bind(r, 45386)),
          Promise.resolve().then(r.bind(r, 59121)));
      },
      45386: (e, s, r) => {
        'use strict';
        (r.r(s), r.d(s, { GoalsContent: () => c }));
        var t = r(39222),
          a = r(28285),
          n = r(68144),
          i = r(3299),
          l = r.n(i),
          o = r(73793);
        function c() {
          let { data: e } = (0, t.useSession)();
          return e?.user
            ? (0, o.jsxs)('div', {
                className: 'w-full px-4 lg:px-8 py-8',
                children: [
                  (0, o.jsxs)('div', {
                    className: 'mb-8',
                    children: [
                      o.jsx('h1', {
                        className: 'text-xl font-semibold',
                        children: 'Metas Financeiras',
                      }),
                      o.jsx('p', {
                        className: 'text-muted-foreground',
                        children:
                          'Defina e acompanhe seus objetivos financeiros',
                      }),
                    ],
                  }),
                  (0, o.jsxs)('div', {
                    className:
                      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                    children: [
                      (0, o.jsxs)(a.Zb, {
                        children: [
                          (0, o.jsxs)(a.Ol, {
                            children: [
                              o.jsx(a.ll, {
                                children: 'Reserva de Emerg\xeancia',
                              }),
                              o.jsx(a.SZ, { children: 'Meta: R$ 10.000,00' }),
                            ],
                          }),
                          o.jsx(a.aY, {
                            children: (0, o.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, o.jsxs)('div', {
                                  className: 'flex justify-between text-sm',
                                  children: [
                                    o.jsx('span', { children: 'Progresso' }),
                                    o.jsx('span', { children: '0%' }),
                                  ],
                                }),
                                o.jsx('div', {
                                  className:
                                    'w-full bg-gray-200 rounded-full h-2',
                                  children: o.jsx('div', {
                                    className: 'bg-blue-600 h-2 rounded-full',
                                    style: { width: '0%' },
                                  }),
                                }),
                                o.jsx('p', {
                                  className: 'text-sm text-muted-foreground',
                                  children: 'R$ 0,00 de R$ 10.000,00',
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, o.jsxs)(a.Zb, {
                        children: [
                          (0, o.jsxs)(a.Ol, {
                            children: [
                              o.jsx(a.ll, { children: 'Viagem' }),
                              o.jsx(a.SZ, { children: 'Meta: R$ 5.000,00' }),
                            ],
                          }),
                          o.jsx(a.aY, {
                            children: (0, o.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, o.jsxs)('div', {
                                  className: 'flex justify-between text-sm',
                                  children: [
                                    o.jsx('span', { children: 'Progresso' }),
                                    o.jsx('span', { children: '0%' }),
                                  ],
                                }),
                                o.jsx('div', {
                                  className:
                                    'w-full bg-gray-200 rounded-full h-2',
                                  children: o.jsx('div', {
                                    className: 'bg-green-600 h-2 rounded-full',
                                    style: { width: '0%' },
                                  }),
                                }),
                                o.jsx('p', {
                                  className: 'text-sm text-muted-foreground',
                                  children: 'R$ 0,00 de R$ 5.000,00',
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, o.jsxs)(a.Zb, {
                        children: [
                          (0, o.jsxs)(a.Ol, {
                            children: [
                              o.jsx(a.ll, { children: 'Investimentos' }),
                              o.jsx(a.SZ, { children: 'Meta: R$ 20.000,00' }),
                            ],
                          }),
                          o.jsx(a.aY, {
                            children: (0, o.jsxs)('div', {
                              className: 'space-y-2',
                              children: [
                                (0, o.jsxs)('div', {
                                  className: 'flex justify-between text-sm',
                                  children: [
                                    o.jsx('span', { children: 'Progresso' }),
                                    o.jsx('span', { children: '0%' }),
                                  ],
                                }),
                                o.jsx('div', {
                                  className:
                                    'w-full bg-gray-200 rounded-full h-2',
                                  children: o.jsx('div', {
                                    className: 'bg-purple-600 h-2 rounded-full',
                                    style: { width: '0%' },
                                  }),
                                }),
                                o.jsx('p', {
                                  className: 'text-sm text-muted-foreground',
                                  children: 'R$ 0,00 de R$ 20.000,00',
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  o.jsx('div', {
                    className: 'mt-8',
                    children: (0, o.jsxs)(a.Zb, {
                      children: [
                        (0, o.jsxs)(a.Ol, {
                          children: [
                            o.jsx(a.ll, {
                              children: 'Funcionalidade em Desenvolvimento',
                            }),
                            o.jsx(a.SZ, {
                              children:
                                'Esta p\xe1gina est\xe1 sendo desenvolvida',
                            }),
                          ],
                        }),
                        (0, o.jsxs)(a.aY, {
                          className: 'space-y-4',
                          children: [
                            o.jsx('p', {
                              className: 'text-muted-foreground',
                              children: 'Em breve voc\xea poder\xe1:',
                            }),
                            (0, o.jsxs)('ul', {
                              className:
                                'list-disc list-inside space-y-2 text-sm text-muted-foreground',
                              children: [
                                o.jsx('li', {
                                  children:
                                    'Criar metas financeiras personalizadas',
                                }),
                                o.jsx('li', {
                                  children:
                                    'Acompanhar progresso em tempo real',
                                }),
                                o.jsx('li', {
                                  children:
                                    'Receber notifica\xe7\xf5es de marcos',
                                }),
                                o.jsx('li', {
                                  children: 'Definir prazos para suas metas',
                                }),
                                o.jsx('li', {
                                  children:
                                    'Visualizar hist\xf3rico de conquistas',
                                }),
                              ],
                            }),
                            o.jsx(l(), {
                              href: '/dashboard',
                              children: o.jsx(n.z, {
                                variant: 'outline',
                                children: 'Voltar ao Dashboard',
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              })
            : o.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: (0, o.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    o.jsx('div', {
                      className:
                        'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto',
                    }),
                    o.jsx('p', {
                      className: 'mt-4 text-gray-600',
                      children: 'Carregando metas...',
                    }),
                  ],
                }),
              });
        }
      },
      28285: (e, s, r) => {
        'use strict';
        r.d(s, {
          Ol: () => h,
          SZ: () => j,
          Zb: () => f,
          aY: () => b,
          ll: () => g,
        });
        var t = r(12363),
          a = r(24662),
          n = r(73793);
        let i = ['className'],
          l = ['className'],
          o = ['className'],
          c = ['className'],
          d = ['className'],
          u = ['className'];
        function p(e, s) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(e);
            (s &&
              (t = t.filter(function (s) {
                return Object.getOwnPropertyDescriptor(e, s).enumerable;
              })),
              r.push.apply(r, t));
          }
          return r;
        }
        function x(e) {
          for (var s = 1; s < arguments.length; s++) {
            var r = null != arguments[s] ? arguments[s] : {};
            s % 2
              ? p(Object(r), !0).forEach(function (s) {
                  var t, a;
                  ((t = s),
                    (a = r[s]),
                    (t = (function (e) {
                      var s = (function (e, s) {
                        if ('object' != typeof e || null === e) return e;
                        var r = e[Symbol.toPrimitive];
                        if (void 0 !== r) {
                          var t = r.call(e, s || 'default');
                          if ('object' != typeof t) return t;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === s ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof s ? s : String(s);
                    })(t)) in e
                      ? Object.defineProperty(e, t, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[t] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : p(Object(r)).forEach(function (s) {
                    Object.defineProperty(
                      e,
                      s,
                      Object.getOwnPropertyDescriptor(r, s)
                    );
                  });
          }
          return e;
        }
        function m(e, s) {
          if (null == e) return {};
          var r,
            t,
            a = (function (e, s) {
              if (null == e) return {};
              var r,
                t,
                a = {},
                n = Object.keys(e);
              for (t = 0; t < n.length; t++)
                ((r = n[t]), s.indexOf(r) >= 0 || (a[r] = e[r]));
              return a;
            })(e, s);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            for (t = 0; t < n.length; t++)
              ((r = n[t]),
                !(s.indexOf(r) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, r) &&
                  (a[r] = e[r]));
          }
          return a;
        }
        let f = t.forwardRef((e, s) => {
          let { className: r } = e,
            t = m(e, i);
          return n.jsx(
            'div',
            x(
              {
                ref: s,
                className: (0, a.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  r
                ),
              },
              t
            )
          );
        });
        f.displayName = 'Card';
        let h = t.forwardRef((e, s) => {
          let { className: r } = e,
            t = m(e, l);
          return n.jsx(
            'div',
            x(
              {
                ref: s,
                className: (0, a.cn)('flex flex-col space-y-1.5 p-6', r),
              },
              t
            )
          );
        });
        h.displayName = 'CardHeader';
        let g = t.forwardRef((e, s) => {
          let { className: r } = e,
            t = m(e, o);
          return n.jsx(
            'h3',
            x(
              {
                ref: s,
                className: (0, a.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  r
                ),
              },
              t
            )
          );
        });
        g.displayName = 'CardTitle';
        let j = t.forwardRef((e, s) => {
          let { className: r } = e,
            t = m(e, c);
          return n.jsx(
            'p',
            x(
              {
                ref: s,
                className: (0, a.cn)('text-sm text-muted-foreground', r),
              },
              t
            )
          );
        });
        j.displayName = 'CardDescription';
        let b = t.forwardRef((e, s) => {
          let { className: r } = e,
            t = m(e, d);
          return n.jsx(
            'div',
            x({ ref: s, className: (0, a.cn)('p-6 pt-0', r) }, t)
          );
        });
        ((b.displayName = 'CardContent'),
          (t.forwardRef((e, s) => {
            let { className: r } = e,
              t = m(e, u);
            return n.jsx(
              'div',
              x(
                {
                  ref: s,
                  className: (0, a.cn)('flex items-center p-6 pt-0', r),
                },
                t
              )
            );
          }).displayName = 'CardFooter'));
      },
      69557: (e, s, r) => {
        e.exports = r(53651);
      },
      58211: (e, s, r) => {
        'use strict';
        (r.r(s), r.d(s, { default: () => d }));
        var t = r(12475),
          a = r(33445);
        let n = (0, a.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/goals/goals-content.tsx`
          ),
          { __esModule: i, $$typeof: l } = n;
        n.default;
        let o = (0, a.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/goals/goals-content.tsx#GoalsContent`
        );
        var c = r(65657);
        function d() {
          return c.jsx(t.a, { requireAuth: !0, children: c.jsx(o, {}) });
        }
      },
      65657: (e, s, r) => {
        'use strict';
        e.exports = r(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var s = require('../../webpack-runtime.js');
  s.C(e);
  var r = e => s((s.s = e)),
    t = s.X(0, [775, 204, 751], () => r(64725));
  module.exports = t;
})();
