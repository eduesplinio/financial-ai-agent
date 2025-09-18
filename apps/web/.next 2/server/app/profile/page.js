(() => {
  var e = {};
  ((e.id = 178),
    (e.ids = [178]),
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
      11298: (e, r, t) => {
        'use strict';
        (t.r(r),
          t.d(r, {
            GlobalError: () => s.a,
            __next_app__: () => f,
            originalPathname: () => u,
            pages: () => d,
            routeModule: () => m,
            tree: () => c,
          }));
        var n = t(34701),
          a = t(36844),
          i = t(17688),
          s = t.n(i),
          o = t(52631),
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
        t.d(r, l);
        let c = [
            '',
            {
              children: [
                'profile',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(t.bind(t, 79738)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/profile/page.tsx',
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(t.t.bind(t, 36165, 23)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/layout.tsx',
              ],
              error: [
                () => Promise.resolve().then(t.bind(t, 39269)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx',
              ],
              loading: [
                () => Promise.resolve().then(t.bind(t, 83411)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx',
              ],
              'not-found': [
                () => Promise.resolve().then(t.bind(t, 39432)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx',
              ],
            },
          ],
          d = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/profile/page.tsx',
          ],
          u = '/profile/page',
          f = { require: t, loadChunk: () => Promise.resolve() },
          m = new n.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: '/profile/page',
              pathname: '/profile',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: c },
          });
      },
      63982: (e, r, t) => {
        (Promise.resolve().then(t.bind(t, 13621)),
          Promise.resolve().then(t.bind(t, 59121)));
      },
      13621: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { ProfileContent: () => k }));
        var n = t(39222),
          a = t(12363),
          i = t(68144),
          s = t(20753),
          o = t(1874),
          l = t(71625),
          c = t(24662),
          d = t(73793);
        let u = ['className', 'variant'];
        function f(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        let m = {
          default: 'bg-primary text-primary-foreground hover:bg-primary/80',
          secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          destructive:
            'bg-destructive text-destructive-foreground hover:bg-destructive/80',
          outline:
            'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        };
        function p(e) {
          let { className: r, variant: t = 'default' } = e,
            n = (function (e, r) {
              if (null == e) return {};
              var t,
                n,
                a = (function (e, r) {
                  if (null == e) return {};
                  var t,
                    n,
                    a = {},
                    i = Object.keys(e);
                  for (n = 0; n < i.length; n++)
                    ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
                  return a;
                })(e, r);
              if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (n = 0; n < i.length; n++)
                  ((t = i[n]),
                    !(r.indexOf(t) >= 0) &&
                      Object.prototype.propertyIsEnumerable.call(e, t) &&
                      (a[t] = e[t]));
              }
              return a;
            })(e, u);
          return d.jsx(
            'div',
            (function (e) {
              for (var r = 1; r < arguments.length; r++) {
                var t = null != arguments[r] ? arguments[r] : {};
                r % 2
                  ? f(Object(t), !0).forEach(function (r) {
                      var n, a;
                      ((n = r),
                        (a = t[r]),
                        (n = (function (e) {
                          var r = (function (e, r) {
                            if ('object' != typeof e || null === e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                              var n = t.call(e, r || 'default');
                              if ('object' != typeof n) return n;
                              throw TypeError(
                                '@@toPrimitive must return a primitive value.'
                              );
                            }
                            return ('string' === r ? String : Number)(e);
                          })(e, 'string');
                          return 'symbol' == typeof r ? r : String(r);
                        })(n)) in e
                          ? Object.defineProperty(e, n, {
                              value: a,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (e[n] = a));
                    })
                  : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(t)
                      )
                    : f(Object(t)).forEach(function (r) {
                        Object.defineProperty(
                          e,
                          r,
                          Object.getOwnPropertyDescriptor(t, r)
                        );
                      });
              }
              return e;
            })(
              {
                className: (0, c.cn)(
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  m[t],
                  r
                ),
              },
              n
            )
          );
        }
        var b = t(23211),
          y = t(28285),
          g = t(64541),
          v = t(6147);
        let h = (0, v.Z)('user', [
          [
            'path',
            { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' },
          ],
          ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
        ]);
        var x = t(45277);
        let j = (0, v.Z)('piggy-bank', [
            [
              'path',
              {
                d: 'M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z',
                key: '1piglc',
              },
            ],
            ['path', { d: 'M16 10h.01', key: '1m94wz' }],
            ['path', { d: 'M2 8v1a2 2 0 0 0 2 2h1', key: '1env43' }],
          ]),
          O = (0, v.Z)('square-pen', [
            [
              'path',
              {
                d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
                key: '1m0v6g',
              },
            ],
            [
              'path',
              {
                d: 'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z',
                key: 'ohrbg2',
              },
            ],
          ]),
          w = (0, v.Z)('save', [
            [
              'path',
              {
                d: 'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
                key: '1c8476',
              },
            ],
            [
              'path',
              { d: 'M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7', key: '1ydtos' },
            ],
            ['path', { d: 'M7 3v4a1 1 0 0 0 1 1h7', key: 't51u73' }],
          ]),
          N = (0, v.Z)('x', [
            ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
            ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
          ]);
        function P(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        function S(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? P(Object(t), !0).forEach(function (r) {
                  var n, a;
                  ((n = r),
                    (a = t[r]),
                    (n = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var n = t.call(e, r || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : P(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        function k() {
          let { data: e } = (0, n.useSession)(),
            { 0: r, 1: t } = (0, a.useState)(!1),
            { 0: c, 1: u } = (0, a.useState)(''),
            { 0: f, 1: m } = (0, a.useState)(!1),
            { 0: v, 1: P } = (0, a.useState)(!0),
            { 0: k, 1: E } = (0, a.useState)({
              userName: '',
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
              financialKnowledgeLevel: 'intermediate',
            }),
            { 0: D, 1: C } = (0, a.useState)(k);
          (0, a.useEffect)(() => {
            e?.user?.id && I();
          }, [e]);
          let I = async () => {
              try {
                P(!0);
                let r = await fetch('/api/user/financial-profile');
                if (r.ok) {
                  let t = await r.json(),
                    n = {
                      userName: e?.user?.name || '',
                      monthlyIncome: t.monthlyIncome || 0,
                      spendingCategories: t.spendingCategories || {
                        housing: 0,
                        food: 0,
                        transport: 0,
                        entertainment: 0,
                        healthcare: 0,
                        education: 0,
                        other: 0,
                      },
                      emergencyFund: t.emergencyFund || 0,
                      riskProfile: t.riskProfile || 'moderate',
                      financialGoals: t.financialGoals || [],
                      financialKnowledgeLevel:
                        t.investmentExperience || 'beginner',
                      investmentExperience:
                        t.investmentExperience || 'beginner',
                    };
                  (E(n), C(n));
                }
              } catch (e) {
                console.error('Error loading financial profile:', e);
              } finally {
                P(!1);
              }
            },
            _ = async () => {
              t(!0);
              try {
                let e = {
                  monthlyIncome: D.monthlyIncome,
                  spendingCategories: D.spendingCategories,
                  emergencyFund: D.emergencyFund,
                  riskProfile: D.riskProfile,
                  financialGoals: D.financialGoals,
                  investmentExperience: D.financialKnowledgeLevel,
                };
                ((
                  await fetch('/api/user/financial-profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(e),
                  })
                ).ok
                  ? (E(D),
                    m(!1),
                    u('Perfil financeiro atualizado com sucesso!'))
                  : u('Erro ao salvar perfil financeiro'),
                  setTimeout(() => u(''), 3e3));
              } catch (e) {
                u('Erro ao salvar perfil');
              } finally {
                t(!1);
              }
            },
            R = e =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(e),
            Z = e => {
              switch (e) {
                case 'beginner':
                  return 'Iniciante';
                case 'intermediate':
                  return 'Intermedi\xe1rio';
                case 'advanced':
                  return 'Avan\xe7ado';
                default:
                  return 'N\xe3o definido';
              }
            };
          return e?.user
            ? (0, d.jsxs)('div', {
                className: 'w-full px-4 lg:px-8 py-6',
                children: [
                  (0, d.jsxs)('div', {
                    className: 'mb-8',
                    children: [
                      d.jsx('h1', {
                        className: 'text-xl font-semibold',
                        children: 'Meu Perfil',
                      }),
                      d.jsx('p', {
                        className: 'text-muted-foreground',
                        children:
                          'Visualize e personalize seu perfil financeiro para uma experi\xeancia personalizada',
                      }),
                    ],
                  }),
                  c &&
                    d.jsx('div', {
                      className:
                        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
                      children: (0, d.jsxs)('div', {
                        className:
                          'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center',
                        children: [
                          d.jsx(g.Z, {
                            className: 'h-5 w-5 mr-2 text-green-500',
                          }),
                          d.jsx('span', {
                            className: 'font-medium',
                            children: c,
                          }),
                        ],
                      }),
                    }),
                  d.jsx(y.Zb, {
                    className: 'mb-8 border-none shadow-md',
                    children: d.jsx(y.aY, {
                      className: 'pt-6',
                      children: (0, d.jsxs)('div', {
                        className:
                          'flex flex-col md:flex-row items-center gap-6',
                        children: [
                          d.jsx('div', {
                            className:
                              'w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20',
                            children: e.user.name
                              ? e.user.name.substring(0, 1).toUpperCase()
                              : d.jsx(h, { size: 36 }),
                          }),
                          (0, d.jsxs)('div', {
                            className: 'flex-1 space-y-3',
                            children: [
                              (0, d.jsxs)('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  d.jsx('h2', {
                                    className:
                                      'text-xl font-bold text-foreground',
                                    children:
                                      e.user.name || 'Nome n\xe3o informado',
                                  }),
                                  d.jsx('div', {}),
                                ],
                              }),
                              d.jsx('div', {
                                className: 'text-muted-foreground',
                                children: (0, d.jsxs)('div', {
                                  className: 'flex items-center',
                                  children: [
                                    d.jsx(x.Z, { className: 'h-4 w-4 mr-2' }),
                                    e.user.email,
                                  ],
                                }),
                              }),
                              (0, d.jsxs)('div', {
                                className: 'flex flex-wrap gap-2 pt-2',
                                children: [
                                  (0, d.jsxs)(p, {
                                    variant: 'outline',
                                    className:
                                      'border-primary/20 text-primary hover:bg-primary/10',
                                    children: [
                                      d.jsx(h, { className: 'h-3 w-3 mr-1' }),
                                      'Membro desde 2025',
                                    ],
                                  }),
                                  (0, d.jsxs)(p, {
                                    variant: 'outline',
                                    className:
                                      'border-green-500/20 text-green-500 hover:bg-green-500/10',
                                    children: [
                                      d.jsx(g.Z, { className: 'h-3 w-3 mr-1' }),
                                      'Perfil Completo',
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                  d.jsx('div', {
                    className: 'mt-6 mb-10',
                    children: d.jsx(b.Z, {}),
                  }),
                  (0, d.jsxs)(y.Zb, {
                    className: 'mb-8 shadow-md overflow-hidden',
                    children: [
                      d.jsx(y.Ol, {
                        className: 'bg-primary/5 border-b border-border',
                        children: (0, d.jsxs)('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            (0, d.jsxs)('div', {
                              children: [
                                (0, d.jsxs)(y.ll, {
                                  className:
                                    'text-lg font-medium flex items-center',
                                  children: [
                                    d.jsx(j, {
                                      className: 'h-5 w-5 mr-2 text-primary',
                                    }),
                                    'Detalhes do Perfil Financeiro',
                                  ],
                                }),
                                d.jsx(y.SZ, {
                                  className: 'mt-1',
                                  children:
                                    'Informa\xe7\xf5es importantes sobre seu perfil financeiro',
                                }),
                              ],
                            }),
                            f
                              ? (0, d.jsxs)('div', {
                                  className: 'flex gap-2',
                                  children: [
                                    (0, d.jsxs)(i.z, {
                                      onClick: _,
                                      disabled: r,
                                      className:
                                        'bg-primary hover:bg-primary/90',
                                      children: [
                                        d.jsx(w, { className: 'h-4 w-4 mr-2' }),
                                        r
                                          ? (0, d.jsxs)('span', {
                                              className: 'flex items-center',
                                              children: [
                                                d.jsx('span', {
                                                  className:
                                                    'animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full',
                                                }),
                                                'Salvando',
                                              ],
                                            })
                                          : 'Salvar Altera\xe7\xf5es',
                                      ],
                                    }),
                                    (0, d.jsxs)(i.z, {
                                      variant: 'outline',
                                      onClick: () => {
                                        (C(k), m(!1));
                                      },
                                      className: 'border-border',
                                      children: [
                                        d.jsx(N, { className: 'h-4 w-4 mr-2' }),
                                        'Cancelar',
                                      ],
                                    }),
                                  ],
                                })
                              : (0, d.jsxs)(i.z, {
                                  variant: 'outline',
                                  onClick: () => m(!0),
                                  className:
                                    'bg-background hover:bg-primary/10 text-primary border-primary/20',
                                  children: [
                                    d.jsx(O, { className: 'h-4 w-4 mr-2' }),
                                    'Personalizar Perfil',
                                  ],
                                }),
                          ],
                        }),
                      }),
                      d.jsx(y.aY, {
                        className: 'pt-6 pb-8',
                        children: v
                          ? (0, d.jsxs)('div', {
                              className:
                                'flex flex-col items-center justify-center py-16',
                              children: [
                                d.jsx('div', {
                                  className:
                                    'animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500',
                                }),
                                d.jsx('p', {
                                  className: 'mt-4 text-gray-500',
                                  children:
                                    'Carregando seu perfil financeiro...',
                                }),
                              ],
                            })
                          : (0, d.jsxs)(d.Fragment, {
                              children: [
                                (0, d.jsxs)('div', {
                                  className: 'mb-8',
                                  children: [
                                    d.jsx('h3', {
                                      className:
                                        'text-base font-medium mb-4 border-b pb-2',
                                      children:
                                        'Informa\xe7\xf5es Financeiras B\xe1sicas',
                                    }),
                                    (0, d.jsxs)('div', {
                                      className:
                                        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                                      children: [
                                        (0, d.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            d.jsx(o._, {
                                              htmlFor: 'monthlyIncome',
                                              className: 'text-sm block mb-2',
                                              children: 'Renda Mensal',
                                            }),
                                            f
                                              ? (0, d.jsxs)('div', {
                                                  className:
                                                    'mt-1 relative rounded-md shadow-sm',
                                                  children: [
                                                    d.jsx('div', {
                                                      className:
                                                        'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
                                                      children: d.jsx('span', {
                                                        className:
                                                          'text-gray-500 sm:text-sm',
                                                        children: 'R$',
                                                      }),
                                                    }),
                                                    d.jsx(s.I, {
                                                      id: 'monthlyIncome',
                                                      type: 'number',
                                                      value: D.monthlyIncome,
                                                      onChange: e =>
                                                        C(
                                                          S(
                                                            S({}, D),
                                                            {},
                                                            {
                                                              monthlyIncome:
                                                                Number(
                                                                  e.target.value
                                                                ),
                                                            }
                                                          )
                                                        ),
                                                      placeholder: '0,00',
                                                      className: 'pl-10',
                                                    }),
                                                  ],
                                                })
                                              : d.jsx('p', {
                                                  className:
                                                    'text-xl font-semibold text-green-600',
                                                  children: R(k.monthlyIncome),
                                                }),
                                          ],
                                        }),
                                        (0, d.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            d.jsx(o._, {
                                              htmlFor: 'emergencyFund',
                                              className: 'text-sm block mb-2',
                                              children: 'Reserva',
                                            }),
                                            f
                                              ? (0, d.jsxs)('div', {
                                                  className:
                                                    'mt-1 relative rounded-md shadow-sm',
                                                  children: [
                                                    d.jsx('div', {
                                                      className:
                                                        'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
                                                      children: d.jsx('span', {
                                                        className:
                                                          'text-gray-500 sm:text-sm',
                                                        children: 'R$',
                                                      }),
                                                    }),
                                                    d.jsx(s.I, {
                                                      id: 'emergencyFund',
                                                      type: 'number',
                                                      value: D.emergencyFund,
                                                      onChange: e =>
                                                        C(
                                                          S(
                                                            S({}, D),
                                                            {},
                                                            {
                                                              emergencyFund:
                                                                Number(
                                                                  e.target.value
                                                                ),
                                                            }
                                                          )
                                                        ),
                                                      placeholder: '0,00',
                                                      className: 'pl-10',
                                                    }),
                                                  ],
                                                })
                                              : d.jsx('p', {
                                                  className:
                                                    'text-xl font-semibold text-blue-600',
                                                  children: R(k.emergencyFund),
                                                }),
                                          ],
                                        }),
                                        (0, d.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            d.jsx(o._, {
                                              htmlFor: 'riskProfile',
                                              className: 'text-sm block mb-2',
                                              children: 'Perfil de Risco',
                                            }),
                                            f
                                              ? (0, d.jsxs)(l.Ph, {
                                                  value: D.riskProfile,
                                                  onValueChange: e =>
                                                    C(
                                                      S(
                                                        S({}, D),
                                                        {},
                                                        { riskProfile: e }
                                                      )
                                                    ),
                                                  children: [
                                                    d.jsx(l.i4, {
                                                      className: 'w-full',
                                                      children: d.jsx(l.ki, {
                                                        placeholder:
                                                          'Selecione...',
                                                      }),
                                                    }),
                                                    (0, d.jsxs)(l.Bw, {
                                                      children: [
                                                        d.jsx(l.Ql, {
                                                          value: 'conservative',
                                                          children:
                                                            'Conservador',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'moderate',
                                                          children: 'Moderado',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'aggressive',
                                                          children: 'Agressivo',
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                })
                                              : d.jsx(p, {
                                                  className: (e => {
                                                    switch (e) {
                                                      case 'conservative':
                                                        return 'bg-green-100 text-green-800';
                                                      case 'moderate':
                                                        return 'bg-yellow-100 text-yellow-800';
                                                      case 'aggressive':
                                                        return 'bg-red-100 text-red-800';
                                                      default:
                                                        return 'bg-secondary text-secondary-foreground';
                                                    }
                                                  })(k.riskProfile),
                                                  children: (e => {
                                                    switch (e) {
                                                      case 'conservative':
                                                        return 'Conservador';
                                                      case 'moderate':
                                                        return 'Moderado';
                                                      case 'aggressive':
                                                        return 'Agressivo';
                                                      default:
                                                        return 'N\xe3o definido';
                                                    }
                                                  })(k.riskProfile),
                                                }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, d.jsxs)('div', {
                                  className: 'mb-8',
                                  children: [
                                    d.jsx('h3', {
                                      className:
                                        'text-base font-medium mb-4 border-b pb-2',
                                      children: 'Conhecimento e Experi\xeancia',
                                    }),
                                    (0, d.jsxs)('div', {
                                      className:
                                        'grid grid-cols-1 md:grid-cols-2 gap-6',
                                      children: [
                                        (0, d.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            d.jsx(o._, {
                                              htmlFor:
                                                'financialKnowledgeLevel',
                                              className: 'text-sm block mb-2',
                                              children:
                                                'N\xedvel de Conhecimento Financeiro',
                                            }),
                                            f
                                              ? (0, d.jsxs)(l.Ph, {
                                                  value:
                                                    D.financialKnowledgeLevel,
                                                  onValueChange: e =>
                                                    C(
                                                      S(
                                                        S({}, D),
                                                        {},
                                                        {
                                                          financialKnowledgeLevel:
                                                            e,
                                                        }
                                                      )
                                                    ),
                                                  children: [
                                                    d.jsx(l.i4, {
                                                      className: 'w-full',
                                                      children: d.jsx(l.ki, {
                                                        placeholder:
                                                          'Selecione...',
                                                      }),
                                                    }),
                                                    (0, d.jsxs)(l.Bw, {
                                                      children: [
                                                        d.jsx(l.Ql, {
                                                          value: 'beginner',
                                                          children: 'Iniciante',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'intermediate',
                                                          children:
                                                            'Intermedi\xe1rio',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'advanced',
                                                          children:
                                                            'Avan\xe7ado',
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                })
                                              : d.jsx('div', {
                                                  className:
                                                    'flex items-center',
                                                  children: d.jsx('span', {
                                                    className:
                                                      'px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary',
                                                    children: Z(
                                                      k.financialKnowledgeLevel
                                                    ),
                                                  }),
                                                }),
                                          ],
                                        }),
                                        (0, d.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            d.jsx(o._, {
                                              htmlFor: 'investmentExperience',
                                              className: 'text-sm block mb-2',
                                              children:
                                                'Experi\xeancia em Investimentos',
                                            }),
                                            f
                                              ? (0, d.jsxs)(l.Ph, {
                                                  value:
                                                    D.investmentExperience ||
                                                    'beginner',
                                                  onValueChange: e =>
                                                    C(
                                                      S(
                                                        S({}, D),
                                                        {},
                                                        {
                                                          investmentExperience:
                                                            e,
                                                        }
                                                      )
                                                    ),
                                                  children: [
                                                    d.jsx(l.i4, {
                                                      className: 'w-full',
                                                      children: d.jsx(l.ki, {
                                                        placeholder:
                                                          'Selecione...',
                                                      }),
                                                    }),
                                                    (0, d.jsxs)(l.Bw, {
                                                      children: [
                                                        d.jsx(l.Ql, {
                                                          value: 'beginner',
                                                          children: 'Iniciante',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'intermediate',
                                                          children:
                                                            'Intermedi\xe1rio',
                                                        }),
                                                        d.jsx(l.Ql, {
                                                          value: 'advanced',
                                                          children:
                                                            'Avan\xe7ado',
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                })
                                              : d.jsx('div', {
                                                  className:
                                                    'flex items-center',
                                                  children: d.jsx('span', {
                                                    className:
                                                      'px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary',
                                                    children: Z(
                                                      k.investmentExperience ||
                                                        'beginner'
                                                    ),
                                                  }),
                                                }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                      }),
                    ],
                  }),
                ],
              })
            : d.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-background',
                children: (0, d.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    d.jsx('div', {
                      className:
                        'animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto',
                    }),
                    d.jsx('p', {
                      className: 'mt-4 text-muted-foreground',
                      children: 'Carregando perfil...',
                    }),
                  ],
                }),
              });
        }
      },
      28285: (e, r, t) => {
        'use strict';
        t.d(r, {
          Ol: () => y,
          SZ: () => v,
          Zb: () => b,
          aY: () => h,
          ll: () => g,
        });
        var n = t(12363),
          a = t(24662),
          i = t(73793);
        let s = ['className'],
          o = ['className'],
          l = ['className'],
          c = ['className'],
          d = ['className'],
          u = ['className'];
        function f(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        function m(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? f(Object(t), !0).forEach(function (r) {
                  var n, a;
                  ((n = r),
                    (a = t[r]),
                    (n = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var n = t.call(e, r || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : f(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        function p(e, r) {
          if (null == e) return {};
          var t,
            n,
            a = (function (e, r) {
              if (null == e) return {};
              var t,
                n,
                a = {},
                i = Object.keys(e);
              for (n = 0; n < i.length; n++)
                ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
              return a;
            })(e, r);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            for (n = 0; n < i.length; n++)
              ((t = i[n]),
                !(r.indexOf(t) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, t) &&
                  (a[t] = e[t]));
          }
          return a;
        }
        let b = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = p(e, s);
          return i.jsx(
            'div',
            m(
              {
                ref: r,
                className: (0, a.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  t
                ),
              },
              n
            )
          );
        });
        b.displayName = 'Card';
        let y = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = p(e, o);
          return i.jsx(
            'div',
            m(
              {
                ref: r,
                className: (0, a.cn)('flex flex-col space-y-1.5 p-6', t),
              },
              n
            )
          );
        });
        y.displayName = 'CardHeader';
        let g = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = p(e, l);
          return i.jsx(
            'h3',
            m(
              {
                ref: r,
                className: (0, a.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  t
                ),
              },
              n
            )
          );
        });
        g.displayName = 'CardTitle';
        let v = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = p(e, c);
          return i.jsx(
            'p',
            m(
              {
                ref: r,
                className: (0, a.cn)('text-sm text-muted-foreground', t),
              },
              n
            )
          );
        });
        v.displayName = 'CardDescription';
        let h = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = p(e, d);
          return i.jsx(
            'div',
            m({ ref: r, className: (0, a.cn)('p-6 pt-0', t) }, n)
          );
        });
        ((h.displayName = 'CardContent'),
          (n.forwardRef((e, r) => {
            let { className: t } = e,
              n = p(e, u);
            return i.jsx(
              'div',
              m(
                {
                  ref: r,
                  className: (0, a.cn)('flex items-center p-6 pt-0', t),
                },
                n
              )
            );
          }).displayName = 'CardFooter'));
      },
      20753: (e, r, t) => {
        'use strict';
        t.d(r, { I: () => l });
        var n = t(12363),
          a = t(24662),
          i = t(73793);
        let s = ['className', 'type'];
        function o(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        let l = n.forwardRef((e, r) => {
          let { className: t, type: n } = e,
            l = (function (e, r) {
              if (null == e) return {};
              var t,
                n,
                a = (function (e, r) {
                  if (null == e) return {};
                  var t,
                    n,
                    a = {},
                    i = Object.keys(e);
                  for (n = 0; n < i.length; n++)
                    ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
                  return a;
                })(e, r);
              if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (n = 0; n < i.length; n++)
                  ((t = i[n]),
                    !(r.indexOf(t) >= 0) &&
                      Object.prototype.propertyIsEnumerable.call(e, t) &&
                      (a[t] = e[t]));
              }
              return a;
            })(e, s);
          return i.jsx(
            'input',
            (function (e) {
              for (var r = 1; r < arguments.length; r++) {
                var t = null != arguments[r] ? arguments[r] : {};
                r % 2
                  ? o(Object(t), !0).forEach(function (r) {
                      var n, a;
                      ((n = r),
                        (a = t[r]),
                        (n = (function (e) {
                          var r = (function (e, r) {
                            if ('object' != typeof e || null === e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                              var n = t.call(e, r || 'default');
                              if ('object' != typeof n) return n;
                              throw TypeError(
                                '@@toPrimitive must return a primitive value.'
                              );
                            }
                            return ('string' === r ? String : Number)(e);
                          })(e, 'string');
                          return 'symbol' == typeof r ? r : String(r);
                        })(n)) in e
                          ? Object.defineProperty(e, n, {
                              value: a,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (e[n] = a));
                    })
                  : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(t)
                      )
                    : o(Object(t)).forEach(function (r) {
                        Object.defineProperty(
                          e,
                          r,
                          Object.getOwnPropertyDescriptor(t, r)
                        );
                      });
              }
              return e;
            })(
              {
                type: n,
                className: (0, a.cn)(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  t
                ),
                ref: r,
              },
              l
            )
          );
        });
        l.displayName = 'Input';
      },
      1874: (e, r, t) => {
        'use strict';
        t.d(r, { _: () => p });
        var n = t(12363),
          a = t(49277),
          i = t(73793);
        function s(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        function o(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? s(Object(t), !0).forEach(function (r) {
                  var n, a;
                  ((n = r),
                    (a = t[r]),
                    (n = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var n = t.call(e, r || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : s(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        var l = n.forwardRef((e, r) =>
          (0, i.jsx)(
            a.WV.label,
            o(
              o({}, e),
              {},
              {
                ref: r,
                onMouseDown: r => {
                  r.target.closest('button, input, select, textarea') ||
                    (e.onMouseDown?.(r),
                    !r.defaultPrevented && r.detail > 1 && r.preventDefault());
                },
              }
            )
          )
        );
        l.displayName = 'Label';
        var c = t(57630),
          d = t(24662);
        let u = ['className'];
        function f(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        let m = (0, c.j)(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          ),
          p = n.forwardRef((e, r) => {
            let { className: t } = e,
              n = (function (e, r) {
                if (null == e) return {};
                var t,
                  n,
                  a = (function (e, r) {
                    if (null == e) return {};
                    var t,
                      n,
                      a = {},
                      i = Object.keys(e);
                    for (n = 0; n < i.length; n++)
                      ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
                    return a;
                  })(e, r);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < i.length; n++)
                    ((t = i[n]),
                      !(r.indexOf(t) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, t) &&
                        (a[t] = e[t]));
                }
                return a;
              })(e, u);
            return i.jsx(
              l,
              (function (e) {
                for (var r = 1; r < arguments.length; r++) {
                  var t = null != arguments[r] ? arguments[r] : {};
                  r % 2
                    ? f(Object(t), !0).forEach(function (r) {
                        var n, a;
                        ((n = r),
                          (a = t[r]),
                          (n = (function (e) {
                            var r = (function (e, r) {
                              if ('object' != typeof e || null === e) return e;
                              var t = e[Symbol.toPrimitive];
                              if (void 0 !== t) {
                                var n = t.call(e, r || 'default');
                                if ('object' != typeof n) return n;
                                throw TypeError(
                                  '@@toPrimitive must return a primitive value.'
                                );
                              }
                              return ('string' === r ? String : Number)(e);
                            })(e, 'string');
                            return 'symbol' == typeof r ? r : String(r);
                          })(n)) in e
                            ? Object.defineProperty(e, n, {
                                value: a,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0,
                              })
                            : (e[n] = a));
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(t)
                        )
                      : f(Object(t)).forEach(function (r) {
                          Object.defineProperty(
                            e,
                            r,
                            Object.getOwnPropertyDescriptor(t, r)
                          );
                        });
                }
                return e;
              })({ ref: r, className: (0, d.cn)(m(), t) }, n)
            );
          });
        p.displayName = l.displayName;
      },
      71625: (e, r, t) => {
        'use strict';
        t.d(r, {
          Bw: () => P,
          Ph: () => x,
          Ql: () => S,
          i4: () => O,
          ki: () => j,
        });
        var n = t(12363),
          a = t(57094),
          i = t(5552),
          s = t(17057),
          o = t(46580),
          l = t(24662),
          c = t(73793);
        let d = ['className', 'children'],
          u = ['className'],
          f = ['className'],
          m = ['className', 'children', 'position'],
          p = ['className'],
          b = ['className', 'children'],
          y = ['className'];
        function g(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        function v(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? g(Object(t), !0).forEach(function (r) {
                  var n, a;
                  ((n = r),
                    (a = t[r]),
                    (n = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var n = t.call(e, r || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : g(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        function h(e, r) {
          if (null == e) return {};
          var t,
            n,
            a = (function (e, r) {
              if (null == e) return {};
              var t,
                n,
                a = {},
                i = Object.keys(e);
              for (n = 0; n < i.length; n++)
                ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
              return a;
            })(e, r);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            for (n = 0; n < i.length; n++)
              ((t = i[n]),
                !(r.indexOf(t) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, t) &&
                  (a[t] = e[t]));
          }
          return a;
        }
        let x = a.fC;
        a.ZA;
        let j = a.B4,
          O = n.forwardRef((e, r) => {
            let { className: t, children: n } = e,
              s = h(e, d);
            return (0, c.jsxs)(
              a.xz,
              v(
                v(
                  {
                    ref: r,
                    className: (0, l.cn)(
                      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
                      t
                    ),
                  },
                  s
                ),
                {},
                {
                  children: [
                    n,
                    c.jsx(a.JO, {
                      asChild: !0,
                      children: c.jsx(i.Z, { className: 'h-4 w-4 opacity-50' }),
                    }),
                  ],
                }
              )
            );
          });
        O.displayName = a.xz.displayName;
        let w = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = h(e, u);
          return c.jsx(
            a.u_,
            v(
              v(
                {
                  ref: r,
                  className: (0, l.cn)(
                    'flex cursor-default items-center justify-center py-1',
                    t
                  ),
                },
                n
              ),
              {},
              { children: c.jsx(s.Z, { className: 'h-4 w-4' }) }
            )
          );
        });
        w.displayName = a.u_.displayName;
        let N = n.forwardRef((e, r) => {
          let { className: t } = e,
            n = h(e, f);
          return c.jsx(
            a.$G,
            v(
              v(
                {
                  ref: r,
                  className: (0, l.cn)(
                    'flex cursor-default items-center justify-center py-1',
                    t
                  ),
                },
                n
              ),
              {},
              { children: c.jsx(i.Z, { className: 'h-4 w-4' }) }
            )
          );
        });
        N.displayName = a.$G.displayName;
        let P = n.forwardRef((e, r) => {
          let { className: t, children: n, position: i = 'popper' } = e,
            s = h(e, m);
          return c.jsx(a.h_, {
            children: (0, c.jsxs)(
              a.VY,
              v(
                v(
                  {
                    ref: r,
                    className: (0, l.cn)(
                      'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-[#1C2D38] text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                      'popper' === i &&
                        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                      t
                    ),
                    position: i,
                  },
                  s
                ),
                {},
                {
                  children: [
                    c.jsx(w, {}),
                    c.jsx(a.l_, {
                      className: (0, l.cn)(
                        'p-1',
                        'popper' === i &&
                          'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                      ),
                      children: n,
                    }),
                    c.jsx(N, {}),
                  ],
                }
              )
            ),
          });
        });
        ((P.displayName = a.VY.displayName),
          (n.forwardRef((e, r) => {
            let { className: t } = e,
              n = h(e, p);
            return c.jsx(
              a.__,
              v(
                {
                  ref: r,
                  className: (0, l.cn)(
                    'py-1.5 pl-8 pr-2 text-sm font-semibold',
                    t
                  ),
                },
                n
              )
            );
          }).displayName = a.__.displayName));
        let S = n.forwardRef((e, r) => {
          let { className: t, children: n } = e,
            i = h(e, b);
          return (0, c.jsxs)(
            a.ck,
            v(
              v(
                {
                  ref: r,
                  className: (0, l.cn)(
                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    t
                  ),
                },
                i
              ),
              {},
              {
                children: [
                  c.jsx('span', {
                    className:
                      'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
                    children: c.jsx(a.wU, {
                      children: c.jsx(o.Z, { className: 'h-4 w-4' }),
                    }),
                  }),
                  c.jsx(a.eT, { children: n }),
                ],
              }
            )
          );
        });
        ((S.displayName = a.ck.displayName),
          (n.forwardRef((e, r) => {
            let { className: t } = e,
              n = h(e, y);
            return c.jsx(
              a.Z0,
              v(
                { ref: r, className: (0, l.cn)('-mx-1 my-1 h-px bg-muted', t) },
                n
              )
            );
          }).displayName = a.Z0.displayName));
      },
      23211: (e, r, t) => {
        'use strict';
        t.d(r, { Z: () => b });
        var n = t(12363),
          a = t(49277),
          i = t(73793);
        let s = ['decorative', 'orientation'];
        function o(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        function l(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? o(Object(t), !0).forEach(function (r) {
                  var n, a;
                  ((n = r),
                    (a = t[r]),
                    (n = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var n = t.call(e, r || 'default');
                          if ('object' != typeof n) return n;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(n)) in e
                      ? Object.defineProperty(e, n, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[n] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : o(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        var c = 'horizontal',
          d = ['horizontal', 'vertical'],
          u = n.forwardRef((e, r) => {
            let { decorative: t, orientation: n = c } = e,
              o = (function (e, r) {
                if (null == e) return {};
                var t,
                  n,
                  a = (function (e, r) {
                    if (null == e) return {};
                    var t,
                      n,
                      a = {},
                      i = Object.keys(e);
                    for (n = 0; n < i.length; n++)
                      ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
                    return a;
                  })(e, r);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < i.length; n++)
                    ((t = i[n]),
                      !(r.indexOf(t) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, t) &&
                        (a[t] = e[t]));
                }
                return a;
              })(e, s),
              u = d.includes(n) ? n : c;
            return (0, i.jsx)(
              a.WV.div,
              l(
                l(
                  l(
                    { 'data-orientation': u },
                    t
                      ? { role: 'none' }
                      : {
                          'aria-orientation': 'vertical' === u ? u : void 0,
                          role: 'separator',
                        }
                  ),
                  o
                ),
                {},
                { ref: r }
              )
            );
          });
        u.displayName = 'Separator';
        var f = t(24662);
        let m = ['className', 'orientation', 'decorative'];
        function p(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (r &&
              (n = n.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, n));
          }
          return t;
        }
        let b = n.forwardRef((e, r) => {
          let {
              className: t,
              orientation: n = 'horizontal',
              decorative: a = !0,
            } = e,
            s = (function (e, r) {
              if (null == e) return {};
              var t,
                n,
                a = (function (e, r) {
                  if (null == e) return {};
                  var t,
                    n,
                    a = {},
                    i = Object.keys(e);
                  for (n = 0; n < i.length; n++)
                    ((t = i[n]), r.indexOf(t) >= 0 || (a[t] = e[t]));
                  return a;
                })(e, r);
              if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (n = 0; n < i.length; n++)
                  ((t = i[n]),
                    !(r.indexOf(t) >= 0) &&
                      Object.prototype.propertyIsEnumerable.call(e, t) &&
                      (a[t] = e[t]));
              }
              return a;
            })(e, m);
          return i.jsx(
            u,
            (function (e) {
              for (var r = 1; r < arguments.length; r++) {
                var t = null != arguments[r] ? arguments[r] : {};
                r % 2
                  ? p(Object(t), !0).forEach(function (r) {
                      var n, a;
                      ((n = r),
                        (a = t[r]),
                        (n = (function (e) {
                          var r = (function (e, r) {
                            if ('object' != typeof e || null === e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                              var n = t.call(e, r || 'default');
                              if ('object' != typeof n) return n;
                              throw TypeError(
                                '@@toPrimitive must return a primitive value.'
                              );
                            }
                            return ('string' === r ? String : Number)(e);
                          })(e, 'string');
                          return 'symbol' == typeof r ? r : String(r);
                        })(n)) in e
                          ? Object.defineProperty(e, n, {
                              value: a,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (e[n] = a));
                    })
                  : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(t)
                      )
                    : p(Object(t)).forEach(function (r) {
                        Object.defineProperty(
                          e,
                          r,
                          Object.getOwnPropertyDescriptor(t, r)
                        );
                      });
              }
              return e;
            })(
              {
                ref: r,
                decorative: a,
                orientation: n,
                className: (0, f.cn)(
                  'shrink-0 bg-border',
                  'horizontal' === n ? 'h-[1px] w-full' : 'h-full w-[1px]',
                  t
                ),
              },
              s
            )
          );
        });
        b.displayName = u.displayName;
      },
      64541: (e, r, t) => {
        'use strict';
        t.d(r, { Z: () => n });
        let n = (0, t(6147).Z)('circle-check-big', [
          ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
          ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
        ]);
      },
      45277: (e, r, t) => {
        'use strict';
        t.d(r, { Z: () => n });
        let n = (0, t(6147).Z)('mail', [
          [
            'path',
            { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7', key: '132q7q' },
          ],
          [
            'rect',
            {
              x: '2',
              y: '4',
              width: '20',
              height: '16',
              rx: '2',
              key: 'izxlao',
            },
          ],
        ]);
      },
      79738: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { default: () => d }));
        var n = t(12475),
          a = t(33445);
        let i = (0, a.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/profile/profile-content.tsx`
          ),
          { __esModule: s, $$typeof: o } = i;
        i.default;
        let l = (0, a.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/profile/profile-content.tsx#ProfileContent`
        );
        var c = t(65657);
        function d() {
          return c.jsx(n.a, { requireAuth: !0, children: c.jsx(l, {}) });
        }
      },
    }));
  var r = require('../../webpack-runtime.js');
  r.C(e);
  var t = e => r((r.s = e)),
    n = r.X(0, [775, 204, 234, 751], () => t(11298));
  module.exports = n;
})();
