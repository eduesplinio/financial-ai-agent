(() => {
  var e = {};
  ((e.id = 938),
    (e.ids = [938]),
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
      88501: (e, r, t) => {
        'use strict';
        (t.r(r),
          t.d(r, {
            GlobalError: () => i.a,
            __next_app__: () => m,
            originalPathname: () => u,
            pages: () => d,
            routeModule: () => p,
            tree: () => l,
          }));
        var s = t(34701),
          n = t(36844),
          a = t(17688),
          i = t.n(a),
          o = t(52631),
          c = {};
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
            ].indexOf(e) && (c[e] = () => o[e]);
        t.d(r, c);
        let l = [
            '',
            {
              children: [
                'settings',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(t.bind(t, 93754)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/settings/page.tsx',
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
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/settings/page.tsx',
          ],
          u = '/settings/page',
          m = { require: t, loadChunk: () => Promise.resolve() },
          p = new s.AppPageRouteModule({
            definition: {
              kind: n.x.APP_PAGE,
              page: '/settings/page',
              pathname: '/settings',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: l },
          });
      },
      30868: (e, r, t) => {
        (Promise.resolve().then(t.bind(t, 77863)),
          Promise.resolve().then(t.bind(t, 59121)));
      },
      77863: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { SettingsContent: () => P }));
        var s = t(12363),
          n = t(39222),
          a = t(28285),
          i = t(68144),
          o = t(1874),
          c = t(24662),
          l = t(73793);
        let d = ['className', 'checked', 'onCheckedChange', 'disabled'];
        function u(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        function m(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? u(Object(t), !0).forEach(function (r) {
                  var s, n;
                  ((s = r),
                    (n = t[r]),
                    (s = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var s = t.call(e, r || 'default');
                          if ('object' != typeof s) return s;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(s)) in e
                      ? Object.defineProperty(e, s, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[s] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : u(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        let p = s.forwardRef((e, r) => {
          let {
              className: t,
              checked: s = !1,
              onCheckedChange: n,
              disabled: a = !1,
            } = e,
            i = (function (e, r) {
              if (null == e) return {};
              var t,
                s,
                n = (function (e, r) {
                  if (null == e) return {};
                  var t,
                    s,
                    n = {},
                    a = Object.keys(e);
                  for (s = 0; s < a.length; s++)
                    ((t = a[s]), r.indexOf(t) >= 0 || (n[t] = e[t]));
                  return n;
                })(e, r);
              if (Object.getOwnPropertySymbols) {
                var a = Object.getOwnPropertySymbols(e);
                for (s = 0; s < a.length; s++)
                  ((t = a[s]),
                    !(r.indexOf(t) >= 0) &&
                      Object.prototype.propertyIsEnumerable.call(e, t) &&
                      (n[t] = e[t]));
              }
              return n;
            })(e, d);
          return l.jsx(
            'button',
            m(
              m(
                {
                  type: 'button',
                  role: 'switch',
                  'aria-checked': s,
                  disabled: a,
                  className: (0, c.cn)(
                    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
                    s ? 'bg-primary' : 'bg-input',
                    t
                  ),
                  onClick: () => n?.(!s),
                  ref: r,
                },
                i
              ),
              {},
              {
                children: l.jsx('span', {
                  className: (0, c.cn)(
                    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
                    s ? 'translate-x-5' : 'translate-x-0'
                  ),
                }),
              }
            )
          );
        });
        p.displayName = 'Switch';
        var f = t(64541),
          b = t(6147);
        let g = (0, b.Z)('shield', [
            [
              'path',
              {
                d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
                key: 'oel41y',
              },
            ],
          ]),
          h = (0, b.Z)('download', [
            ['path', { d: 'M12 15V3', key: 'm9g1x1' }],
            [
              'path',
              { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', key: 'ih7n3h' },
            ],
            ['path', { d: 'm7 10 5 5 5-5', key: 'brsn70' }],
          ]),
          x = (0, b.Z)('eye', [
            [
              'path',
              {
                d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
                key: '1nclc0',
              },
            ],
            ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
          ]),
          y = (0, b.Z)('trash', [
            [
              'path',
              { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' },
            ],
            ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
            [
              'path',
              { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' },
            ],
          ]),
          j = (0, b.Z)('bell', [
            ['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0', key: 'vwvbt9' }],
            [
              'path',
              {
                d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
                key: '11g9vi',
              },
            ],
          ]);
        var v = t(45277);
        let w = (0, b.Z)('smartphone', [
          [
            'rect',
            {
              width: '14',
              height: '20',
              x: '5',
              y: '2',
              rx: '2',
              ry: '2',
              key: '1yt0o3',
            },
          ],
          ['path', { d: 'M12 18h.01', key: 'mhygvu' }],
        ]);
        function O(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        function N(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? O(Object(t), !0).forEach(function (r) {
                  var s, n;
                  ((s = r),
                    (n = t[r]),
                    (s = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var s = t.call(e, r || 'default');
                          if ('object' != typeof s) return s;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(s)) in e
                      ? Object.defineProperty(e, s, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[s] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : O(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        function P() {
          let { data: e } = (0, n.useSession)(),
            { 0: r, 1: t } = (0, s.useState)(!1),
            { 0: c, 1: d } = (0, s.useState)(''),
            { 0: u, 1: m } = (0, s.useState)(!0),
            { 0: b, 1: O } = (0, s.useState)({
              email: !0,
              push: !0,
              marketing: !1,
              largeTransactions: !0,
              unusualSpending: !0,
              goalProgress: !0,
              budgetExceeded: !0,
            }),
            { 0: P, 1: k } = (0, s.useState)({
              analytics: !1,
              marketing: !1,
              dataProcessing: !0,
            });
          (0, s.useEffect)(() => {
            e?.user?.id && S();
          }, [e]);
          let S = async () => {
              try {
                m(!0);
                let e = await fetch('/api/user/preferences');
                if (e.ok) {
                  let r = (await e.json()).preferences || {};
                  (r.notifications &&
                    O({
                      email:
                        void 0 === r.notifications.email ||
                        r.notifications.email,
                      push:
                        void 0 === r.notifications.push || r.notifications.push,
                      marketing:
                        void 0 !== r.notifications.marketing &&
                        r.notifications.marketing,
                      largeTransactions:
                        void 0 !== r.notifications.largeTransactions
                          ? r.notifications.largeTransactions
                          : void 0 === r.notifications.budgetAlerts ||
                            r.notifications.budgetAlerts,
                      unusualSpending:
                        void 0 !== r.notifications.unusualSpending
                          ? r.notifications.unusualSpending
                          : void 0 === r.notifications.anomalyDetection ||
                            r.notifications.anomalyDetection,
                      goalProgress:
                        void 0 !== r.notifications.goalProgress
                          ? r.notifications.goalProgress
                          : void 0 === r.notifications.goalReminders ||
                            r.notifications.goalReminders,
                      budgetExceeded:
                        void 0 !== r.notifications.budgetExceeded
                          ? r.notifications.budgetExceeded
                          : void 0 === r.notifications.budgetAlerts ||
                            r.notifications.budgetAlerts,
                    }),
                    r.privacy &&
                      k({
                        dataProcessing: !0,
                        analytics:
                          void 0 !== r.privacy.analytics && r.privacy.analytics,
                        marketing:
                          void 0 !== r.privacy.marketing && r.privacy.marketing,
                      }));
                }
              } catch (e) {
                console.error('Error loading user settings:', e);
              } finally {
                m(!1);
              }
            },
            { 0: C, 1: E } = (0, s.useState)(!1),
            D = async () => {
              E(!0);
              try {
                let e = {
                  notifications: {
                    email: b.email,
                    push: b.push,
                    marketing: b.marketing,
                    largeTransactions: !0 === b.largeTransactions,
                    unusualSpending: !0 === b.unusualSpending,
                    goalProgress: !0 === b.goalProgress,
                    budgetExceeded: !0 === b.budgetExceeded,
                    budgetAlerts: !0 === b.largeTransactions,
                    anomalyDetection: !0 === b.unusualSpending,
                    goalReminders: !0 === b.goalProgress,
                    sms: !1,
                  },
                };
                console.log(
                  'Enviando payload de notifica\xe7\xf5es:',
                  JSON.stringify(e, null, 2)
                );
                let r = await fetch('/api/user/preferences', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(e),
                });
                (r.ok
                  ? (d(
                      'Configura\xe7\xf5es de notifica\xe7\xe3o salvas com sucesso!'
                    ),
                    console.log('Notifica\xe7\xf5es salvas:', e))
                  : (d('Erro ao salvar configura\xe7\xf5es'),
                    console.error(
                      'Erro ao salvar notifica\xe7\xf5es:',
                      r.statusText
                    )),
                  setTimeout(() => d(''), 3e3));
              } catch (e) {
                (console.error('Erro ao salvar notifica\xe7\xf5es:', e),
                  d('Erro ao salvar configura\xe7\xf5es'));
              } finally {
                E(!1);
              }
            },
            T = async (e, r) => {
              if ('dataProcessing' === e && !r) {
                d(
                  'Processamento de dados essenciais n\xe3o pode ser desabilitado'
                );
                return;
              }
              t(!0);
              try {
                let t = N(N({}, P), {}, { [e]: r });
                k(t);
                let s = {
                  privacy: {
                    analytics: t.analytics,
                    marketing: t.marketing,
                    dataSharing: !1,
                  },
                };
                ((
                  await fetch('/api/user/preferences', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(s),
                  })
                ).ok
                  ? d(
                      `Consentimento ${r ? 'concedido' : 'revogado'} com sucesso!`
                    )
                  : d('Erro ao atualizar consentimento'),
                  setTimeout(() => d(''), 3e3));
              } catch (e) {
                d('Erro ao atualizar consentimento');
              } finally {
                t(!1);
              }
            },
            R = async e => {
              if (
                'delete' !== e ||
                window.confirm(
                  'Esta a\xe7\xe3o ir\xe1 excluir permanentemente todos os seus dados. Esta a\xe7\xe3o n\xe3o pode ser desfeita. Tem certeza?'
                )
              ) {
                t(!0);
                try {
                  let r = await fetch('/api/user/data-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: e }),
                  });
                  if (r.ok) {
                    if ('export' === e) {
                      let e = await r.blob(),
                        t = window.URL.createObjectURL(e),
                        s = document.createElement('a');
                      ((s.href = t),
                        (s.download = `meus-dados-${Date.now()}.json`),
                        document.body.appendChild(s),
                        s.click(),
                        window.URL.revokeObjectURL(t),
                        document.body.removeChild(s),
                        d('Download dos seus dados iniciado!'));
                    } else
                      'delete' === e &&
                        (d('Conta exclu\xedda com sucesso. Redirecionando...'),
                        setTimeout(() => {
                          window.location.href = '/auth/signin';
                        }, 2e3));
                  } else d('Erro ao processar solicita\xe7\xe3o');
                  setTimeout(() => d(''), 3e3);
                } catch (e) {
                  d('Erro interno do servidor');
                } finally {
                  t(!1);
                }
              }
            };
          return e?.user
            ? u
              ? (0, l.jsxs)('div', {
                  className: 'w-full px-4 lg:px-8 py-6',
                  children: [
                    (0, l.jsxs)('div', {
                      className: 'mb-8',
                      children: [
                        l.jsx('h1', {
                          className: 'text-xl font-semibold',
                          children: 'Configura\xe7\xf5es',
                        }),
                        l.jsx('p', {
                          className: 'text-muted-foreground',
                          children:
                            'Gerencie suas prefer\xeancias e configura\xe7\xf5es da conta',
                        }),
                      ],
                    }),
                    l.jsx('div', {
                      className: 'flex justify-center py-16',
                      children: l.jsx('div', {
                        className:
                          'animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500',
                      }),
                    }),
                  ],
                })
              : (0, l.jsxs)('div', {
                  className: 'w-full px-4 lg:px-8 py-6',
                  children: [
                    (0, l.jsxs)('div', {
                      className: 'mb-8',
                      children: [
                        l.jsx('h1', {
                          className: 'text-xl font-semibold',
                          children: 'Configura\xe7\xf5es',
                        }),
                        l.jsx('p', {
                          className: 'text-muted-foreground',
                          children:
                            'Gerencie suas prefer\xeancias e configura\xe7\xf5es da conta',
                        }),
                      ],
                    }),
                    c &&
                      l.jsx('div', {
                        className:
                          'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
                        children: (0, l.jsxs)('div', {
                          className:
                            'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center',
                          children: [
                            l.jsx(f.Z, {
                              className: 'h-5 w-5 mr-2 text-green-500',
                            }),
                            l.jsx('span', {
                              className: 'font-medium',
                              children: c,
                            }),
                          ],
                        }),
                      }),
                    (0, l.jsxs)('div', {
                      className: 'space-y-8',
                      children: [
                        (0, l.jsxs)(a.Zb, {
                          className: 'mb-8 shadow-md overflow-hidden',
                          children: [
                            l.jsx(a.Ol, {
                              className: 'bg-primary/5 border-b border-border',
                              children: l.jsx('div', {
                                className: 'flex items-center justify-between',
                                children: (0, l.jsxs)('div', {
                                  children: [
                                    (0, l.jsxs)(a.ll, {
                                      className:
                                        'text-lg font-medium flex items-center',
                                      children: [
                                        l.jsx(g, {
                                          className:
                                            'h-5 w-5 mr-2 text-primary',
                                        }),
                                        'Privacidade e Dados Pessoais',
                                      ],
                                    }),
                                    l.jsx(a.SZ, {
                                      className: 'mt-1',
                                      children:
                                        'Gerencie seus dados pessoais e consentimentos conforme a LGPD',
                                    }),
                                  ],
                                }),
                              }),
                            }),
                            (0, l.jsxs)(a.aY, {
                              className: 'pt-6 pb-8',
                              children: [
                                (0, l.jsxs)('div', {
                                  className: 'space-y-4',
                                  children: [
                                    l.jsx('div', {
                                      className:
                                        'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: (0, l.jsxs)('div', {
                                        className:
                                          'flex items-center justify-between',
                                        children: [
                                          (0, l.jsxs)('div', {
                                            children: [
                                              l.jsx(o._, {
                                                className: 'font-medium',
                                                children: 'Dados Essenciais',
                                              }),
                                              l.jsx('p', {
                                                className:
                                                  'text-sm text-muted-foreground mt-1',
                                                children:
                                                  'Dados necess\xe1rios para funcionamento b\xe1sico (login, transa\xe7\xf5es)',
                                              }),
                                            ],
                                          }),
                                          (0, l.jsxs)('div', {
                                            className:
                                              'flex items-center gap-2',
                                            children: [
                                              l.jsx(p, {
                                                checked: !0,
                                                disabled: !0,
                                              }),
                                              l.jsx('span', {
                                                className:
                                                  'text-xs text-green-600 font-medium',
                                                children: 'Obrigat\xf3rio',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    }),
                                    l.jsx('div', {
                                      className:
                                        'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: (0, l.jsxs)('div', {
                                        className:
                                          'flex items-center justify-between',
                                        children: [
                                          (0, l.jsxs)('div', {
                                            children: [
                                              l.jsx(o._, {
                                                className: 'font-medium',
                                                children:
                                                  'Analytics e Melhorias',
                                              }),
                                              l.jsx('p', {
                                                className:
                                                  'text-sm text-muted-foreground mt-1',
                                                children:
                                                  'Dados an\xf4nimos para melhorar a experi\xeancia do usu\xe1rio',
                                              }),
                                            ],
                                          }),
                                          l.jsx(p, {
                                            checked: P.analytics,
                                            onCheckedChange: e =>
                                              T('analytics', e),
                                            disabled: r,
                                          }),
                                        ],
                                      }),
                                    }),
                                    l.jsx('div', {
                                      className:
                                        'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: (0, l.jsxs)('div', {
                                        className:
                                          'flex items-center justify-between',
                                        children: [
                                          (0, l.jsxs)('div', {
                                            children: [
                                              l.jsx(o._, {
                                                className: 'font-medium',
                                                children:
                                                  'Comunica\xe7\xf5es de Marketing',
                                              }),
                                              l.jsx('p', {
                                                className:
                                                  'text-sm text-muted-foreground mt-1',
                                                children:
                                                  'Ofertas personalizadas e comunica\xe7\xf5es promocionais',
                                              }),
                                            ],
                                          }),
                                          l.jsx(p, {
                                            checked: P.marketing,
                                            onCheckedChange: e =>
                                              T('marketing', e),
                                            disabled: r,
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                                (0, l.jsxs)('div', {
                                  className: 'pt-6 mt-2',
                                  children: [
                                    l.jsx('h3', {
                                      className:
                                        'text-base font-medium mb-4 border-b pb-2',
                                      children: 'Gerenciar Seus Dados',
                                    }),
                                    (0, l.jsxs)('div', {
                                      className:
                                        'grid grid-cols-1 md:grid-cols-3 gap-3',
                                      children: [
                                        (0, l.jsxs)(i.z, {
                                          variant: 'outline',
                                          className:
                                            'flex items-center gap-2 bg-card border-border hover:bg-primary/10 text-primary',
                                          onClick: () => R('export'),
                                          disabled: r,
                                          children: [
                                            l.jsx(h, { className: 'h-4 w-4' }),
                                            'Baixar Dados',
                                          ],
                                        }),
                                        (0, l.jsxs)(i.z, {
                                          variant: 'outline',
                                          className:
                                            'flex items-center gap-2 bg-card border-border hover:bg-primary/10 text-primary',
                                          onClick: () =>
                                            (window.location.href = '/privacy'),
                                          children: [
                                            l.jsx(x, { className: 'h-4 w-4' }),
                                            'Ver Pol\xedtica',
                                          ],
                                        }),
                                        (0, l.jsxs)(i.z, {
                                          variant: 'destructive',
                                          className:
                                            'flex items-center gap-2 bg-red-500 border-red-500 hover:bg-red-600 text-white',
                                          onClick: () => R('delete'),
                                          disabled: r,
                                          children: [
                                            l.jsx(y, { className: 'h-4 w-4' }),
                                            'Excluir Conta',
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, l.jsxs)(a.Zb, {
                          className: 'mb-8 shadow-md overflow-hidden',
                          children: [
                            l.jsx(a.Ol, {
                              className: 'bg-primary/5 border-b border-border',
                              children: l.jsx('div', {
                                className: 'flex items-center justify-between',
                                children: (0, l.jsxs)('div', {
                                  children: [
                                    (0, l.jsxs)(a.ll, {
                                      className:
                                        'text-lg font-medium flex items-center',
                                      children: [
                                        l.jsx(j, {
                                          className:
                                            'h-5 w-5 mr-2 text-primary',
                                        }),
                                        'Notifica\xe7\xf5es',
                                      ],
                                    }),
                                    l.jsx(a.SZ, {
                                      className: 'mt-1',
                                      children:
                                        'Configure como e quando receber notifica\xe7\xf5es',
                                    }),
                                  ],
                                }),
                              }),
                            }),
                            (0, l.jsxs)(a.aY, {
                              className: 'pt-6 pb-8',
                              children: [
                                (0, l.jsxs)('div', {
                                  className: 'space-y-4',
                                  children: [
                                    (0, l.jsxs)('div', {
                                      className:
                                        'flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: [
                                        (0, l.jsxs)('div', {
                                          className: 'space-y-0.5',
                                          children: [
                                            (0, l.jsxs)(o._, {
                                              className:
                                                'flex items-center gap-2',
                                              children: [
                                                l.jsx(v.Z, {
                                                  className:
                                                    'h-4 w-4 text-primary',
                                                }),
                                                'Notifica\xe7\xf5es por Email',
                                              ],
                                            }),
                                            l.jsx('p', {
                                              className:
                                                'text-sm text-muted-foreground',
                                              children:
                                                'Receba alertas importantes por email',
                                            }),
                                          ],
                                        }),
                                        l.jsx(p, {
                                          checked: b.email,
                                          onCheckedChange: e =>
                                            O(N(N({}, b), {}, { email: e })),
                                        }),
                                      ],
                                    }),
                                    (0, l.jsxs)('div', {
                                      className:
                                        'flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: [
                                        (0, l.jsxs)('div', {
                                          className: 'space-y-0.5',
                                          children: [
                                            (0, l.jsxs)(o._, {
                                              className:
                                                'flex items-center gap-2',
                                              children: [
                                                l.jsx(w, {
                                                  className:
                                                    'h-4 w-4 text-primary',
                                                }),
                                                'Notifica\xe7\xf5es Push',
                                              ],
                                            }),
                                            l.jsx('p', {
                                              className:
                                                'text-sm text-muted-foreground',
                                              children:
                                                'Receba notifica\xe7\xf5es no navegador',
                                            }),
                                          ],
                                        }),
                                        l.jsx(p, {
                                          checked: b.push,
                                          onCheckedChange: e =>
                                            O(N(N({}, b), {}, { push: e })),
                                        }),
                                      ],
                                    }),
                                    (0, l.jsxs)('div', {
                                      className:
                                        'flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                      children: [
                                        (0, l.jsxs)('div', {
                                          className: 'space-y-0.5',
                                          children: [
                                            l.jsx(o._, {
                                              children: 'Emails Promocionais',
                                            }),
                                            l.jsx('p', {
                                              className:
                                                'text-sm text-muted-foreground',
                                              children:
                                                'Receba dicas financeiras e novidades',
                                            }),
                                          ],
                                        }),
                                        l.jsx(p, {
                                          checked: b.marketing,
                                          onCheckedChange: e =>
                                            O(
                                              N(N({}, b), {}, { marketing: e })
                                            ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, l.jsxs)('div', {
                                  className: 'pt-6 mt-2',
                                  children: [
                                    l.jsx('h3', {
                                      className:
                                        'text-base font-medium mb-4 border-b pb-2',
                                      children: 'Alertas Espec\xedficos',
                                    }),
                                    (0, l.jsxs)('div', {
                                      className:
                                        'grid grid-cols-1 md:grid-cols-2 gap-4',
                                      children: [
                                        (0, l.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            l.jsx(o._, {
                                              className:
                                                'text-sm font-medium mb-3 block',
                                              children: 'Transa\xe7\xf5es',
                                            }),
                                            (0, l.jsxs)('div', {
                                              className: 'space-y-3',
                                              children: [
                                                (0, l.jsxs)('div', {
                                                  className:
                                                    'flex items-center justify-between',
                                                  children: [
                                                    l.jsx('label', {
                                                      className: 'text-sm',
                                                      children:
                                                        'Transa\xe7\xf5es grandes (>R$ 1.000)',
                                                    }),
                                                    l.jsx(p, {
                                                      checked:
                                                        b.largeTransactions,
                                                      onCheckedChange: e =>
                                                        O(
                                                          N(
                                                            N({}, b),
                                                            {},
                                                            {
                                                              largeTransactions:
                                                                e,
                                                            }
                                                          )
                                                        ),
                                                    }),
                                                  ],
                                                }),
                                                (0, l.jsxs)('div', {
                                                  className:
                                                    'flex items-center justify-between',
                                                  children: [
                                                    l.jsx('label', {
                                                      className: 'text-sm',
                                                      children:
                                                        'Gastos incomuns',
                                                    }),
                                                    l.jsx(p, {
                                                      checked:
                                                        b.unusualSpending,
                                                      onCheckedChange: e =>
                                                        O(
                                                          N(
                                                            N({}, b),
                                                            {},
                                                            {
                                                              unusualSpending:
                                                                e,
                                                            }
                                                          )
                                                        ),
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, l.jsxs)('div', {
                                          className:
                                            'bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow',
                                          children: [
                                            l.jsx(o._, {
                                              className:
                                                'text-sm font-medium mb-3 block',
                                              children: 'Metas e Or\xe7amento',
                                            }),
                                            (0, l.jsxs)('div', {
                                              className: 'space-y-3',
                                              children: [
                                                (0, l.jsxs)('div', {
                                                  className:
                                                    'flex items-center justify-between',
                                                  children: [
                                                    l.jsx('label', {
                                                      className: 'text-sm',
                                                      children:
                                                        'Progresso das metas',
                                                    }),
                                                    l.jsx(p, {
                                                      checked: b.goalProgress,
                                                      onCheckedChange: e =>
                                                        O(
                                                          N(
                                                            N({}, b),
                                                            {},
                                                            { goalProgress: e }
                                                          )
                                                        ),
                                                    }),
                                                  ],
                                                }),
                                                (0, l.jsxs)('div', {
                                                  className:
                                                    'flex items-center justify-between',
                                                  children: [
                                                    l.jsx('label', {
                                                      className: 'text-sm',
                                                      children:
                                                        'Or\xe7amento excedido',
                                                    }),
                                                    l.jsx(p, {
                                                      checked: b.budgetExceeded,
                                                      onCheckedChange: e =>
                                                        O(
                                                          N(
                                                            N({}, b),
                                                            {},
                                                            {
                                                              budgetExceeded: e,
                                                            }
                                                          )
                                                        ),
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                l.jsx('div', {
                                  className: 'pt-6 mt-2',
                                  children: l.jsx(i.z, {
                                    onClick: D,
                                    disabled: r,
                                    className: 'bg-primary hover:bg-primary/90',
                                    children: r
                                      ? (0, l.jsxs)('span', {
                                          className: 'flex items-center',
                                          children: [
                                            l.jsx('span', {
                                              className:
                                                'animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full',
                                            }),
                                            'Salvando',
                                          ],
                                        })
                                      : 'Salvar Configura\xe7\xf5es de Notifica\xe7\xe3o',
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        l.jsx('div', {
                          className:
                            'text-xs text-muted-foreground py-4 border-t mt-8',
                          children: l.jsx('p', {}),
                        }),
                      ],
                    }),
                  ],
                })
            : l.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-background',
                children: (0, l.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    l.jsx('div', {
                      className:
                        'animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto',
                    }),
                    l.jsx('p', {
                      className: 'mt-4 text-muted-foreground',
                      children: 'Carregando configura\xe7\xf5es...',
                    }),
                  ],
                }),
              });
        }
      },
      28285: (e, r, t) => {
        'use strict';
        t.d(r, {
          Ol: () => g,
          SZ: () => x,
          Zb: () => b,
          aY: () => y,
          ll: () => h,
        });
        var s = t(12363),
          n = t(24662),
          a = t(73793);
        let i = ['className'],
          o = ['className'],
          c = ['className'],
          l = ['className'],
          d = ['className'],
          u = ['className'];
        function m(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        function p(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? m(Object(t), !0).forEach(function (r) {
                  var s, n;
                  ((s = r),
                    (n = t[r]),
                    (s = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var s = t.call(e, r || 'default');
                          if ('object' != typeof s) return s;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(s)) in e
                      ? Object.defineProperty(e, s, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[s] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : m(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        function f(e, r) {
          if (null == e) return {};
          var t,
            s,
            n = (function (e, r) {
              if (null == e) return {};
              var t,
                s,
                n = {},
                a = Object.keys(e);
              for (s = 0; s < a.length; s++)
                ((t = a[s]), r.indexOf(t) >= 0 || (n[t] = e[t]));
              return n;
            })(e, r);
          if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (s = 0; s < a.length; s++)
              ((t = a[s]),
                !(r.indexOf(t) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, t) &&
                  (n[t] = e[t]));
          }
          return n;
        }
        let b = s.forwardRef((e, r) => {
          let { className: t } = e,
            s = f(e, i);
          return a.jsx(
            'div',
            p(
              {
                ref: r,
                className: (0, n.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  t
                ),
              },
              s
            )
          );
        });
        b.displayName = 'Card';
        let g = s.forwardRef((e, r) => {
          let { className: t } = e,
            s = f(e, o);
          return a.jsx(
            'div',
            p(
              {
                ref: r,
                className: (0, n.cn)('flex flex-col space-y-1.5 p-6', t),
              },
              s
            )
          );
        });
        g.displayName = 'CardHeader';
        let h = s.forwardRef((e, r) => {
          let { className: t } = e,
            s = f(e, c);
          return a.jsx(
            'h3',
            p(
              {
                ref: r,
                className: (0, n.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  t
                ),
              },
              s
            )
          );
        });
        h.displayName = 'CardTitle';
        let x = s.forwardRef((e, r) => {
          let { className: t } = e,
            s = f(e, l);
          return a.jsx(
            'p',
            p(
              {
                ref: r,
                className: (0, n.cn)('text-sm text-muted-foreground', t),
              },
              s
            )
          );
        });
        x.displayName = 'CardDescription';
        let y = s.forwardRef((e, r) => {
          let { className: t } = e,
            s = f(e, d);
          return a.jsx(
            'div',
            p({ ref: r, className: (0, n.cn)('p-6 pt-0', t) }, s)
          );
        });
        ((y.displayName = 'CardContent'),
          (s.forwardRef((e, r) => {
            let { className: t } = e,
              s = f(e, u);
            return a.jsx(
              'div',
              p(
                {
                  ref: r,
                  className: (0, n.cn)('flex items-center p-6 pt-0', t),
                },
                s
              )
            );
          }).displayName = 'CardFooter'));
      },
      1874: (e, r, t) => {
        'use strict';
        t.d(r, { _: () => f });
        var s = t(12363),
          n = t(49277),
          a = t(73793);
        function i(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        function o(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? i(Object(t), !0).forEach(function (r) {
                  var s, n;
                  ((s = r),
                    (n = t[r]),
                    (s = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var s = t.call(e, r || 'default');
                          if ('object' != typeof s) return s;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(s)) in e
                      ? Object.defineProperty(e, s, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[s] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : i(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        var c = s.forwardRef((e, r) =>
          (0, a.jsx)(
            n.WV.label,
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
        c.displayName = 'Label';
        var l = t(57630),
          d = t(24662);
        let u = ['className'];
        function m(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        let p = (0, l.j)(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          ),
          f = s.forwardRef((e, r) => {
            let { className: t } = e,
              s = (function (e, r) {
                if (null == e) return {};
                var t,
                  s,
                  n = (function (e, r) {
                    if (null == e) return {};
                    var t,
                      s,
                      n = {},
                      a = Object.keys(e);
                    for (s = 0; s < a.length; s++)
                      ((t = a[s]), r.indexOf(t) >= 0 || (n[t] = e[t]));
                    return n;
                  })(e, r);
                if (Object.getOwnPropertySymbols) {
                  var a = Object.getOwnPropertySymbols(e);
                  for (s = 0; s < a.length; s++)
                    ((t = a[s]),
                      !(r.indexOf(t) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, t) &&
                        (n[t] = e[t]));
                }
                return n;
              })(e, u);
            return a.jsx(
              c,
              (function (e) {
                for (var r = 1; r < arguments.length; r++) {
                  var t = null != arguments[r] ? arguments[r] : {};
                  r % 2
                    ? m(Object(t), !0).forEach(function (r) {
                        var s, n;
                        ((s = r),
                          (n = t[r]),
                          (s = (function (e) {
                            var r = (function (e, r) {
                              if ('object' != typeof e || null === e) return e;
                              var t = e[Symbol.toPrimitive];
                              if (void 0 !== t) {
                                var s = t.call(e, r || 'default');
                                if ('object' != typeof s) return s;
                                throw TypeError(
                                  '@@toPrimitive must return a primitive value.'
                                );
                              }
                              return ('string' === r ? String : Number)(e);
                            })(e, 'string');
                            return 'symbol' == typeof r ? r : String(r);
                          })(s)) in e
                            ? Object.defineProperty(e, s, {
                                value: n,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0,
                              })
                            : (e[s] = n));
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(t)
                        )
                      : m(Object(t)).forEach(function (r) {
                          Object.defineProperty(
                            e,
                            r,
                            Object.getOwnPropertyDescriptor(t, r)
                          );
                        });
                }
                return e;
              })({ ref: r, className: (0, d.cn)(p(), t) }, s)
            );
          });
        f.displayName = c.displayName;
      },
      64541: (e, r, t) => {
        'use strict';
        t.d(r, { Z: () => s });
        let s = (0, t(6147).Z)('circle-check-big', [
          ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
          ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
        ]);
      },
      45277: (e, r, t) => {
        'use strict';
        t.d(r, { Z: () => s });
        let s = (0, t(6147).Z)('mail', [
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
      69557: (e, r, t) => {
        e.exports = t(53651);
      },
      93754: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { default: () => d }));
        var s = t(12475),
          n = t(33445);
        let a = (0, n.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/settings/settings-content.tsx`
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let c = (0, n.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/settings/settings-content.tsx#SettingsContent`
        );
        var l = t(65657);
        function d() {
          return l.jsx(s.a, { requireAuth: !0, children: l.jsx(c, {}) });
        }
      },
      65657: (e, r, t) => {
        'use strict';
        e.exports = t(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
      49277: (e, r, t) => {
        'use strict';
        t.d(r, { WV: () => d, jH: () => u });
        var s = t(12363),
          n = t(46525),
          a = t(67031),
          i = t(73793);
        let o = ['asChild'];
        function c(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var s = Object.getOwnPropertySymbols(e);
            (r &&
              (s = s.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
              })),
              t.push.apply(t, s));
          }
          return t;
        }
        function l(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
              ? c(Object(t), !0).forEach(function (r) {
                  var s, n;
                  ((s = r),
                    (n = t[r]),
                    (s = (function (e) {
                      var r = (function (e, r) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var s = t.call(e, r || 'default');
                          if ('object' != typeof s) return s;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === r ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof r ? r : String(r);
                    })(s)) in e
                      ? Object.defineProperty(e, s, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[s] = n));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : c(Object(t)).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(t, r)
                    );
                  });
          }
          return e;
        }
        var d = [
          'a',
          'button',
          'div',
          'form',
          'h2',
          'h3',
          'img',
          'input',
          'label',
          'li',
          'nav',
          'ol',
          'p',
          'select',
          'span',
          'svg',
          'ul',
        ].reduce((e, r) => {
          let t = (0, a.Z8)(`Primitive.${r}`),
            n = s.forwardRef((e, s) => {
              let { asChild: n } = e,
                a = (function (e, r) {
                  if (null == e) return {};
                  var t,
                    s,
                    n = (function (e, r) {
                      if (null == e) return {};
                      var t,
                        s,
                        n = {},
                        a = Object.keys(e);
                      for (s = 0; s < a.length; s++)
                        ((t = a[s]), r.indexOf(t) >= 0 || (n[t] = e[t]));
                      return n;
                    })(e, r);
                  if (Object.getOwnPropertySymbols) {
                    var a = Object.getOwnPropertySymbols(e);
                    for (s = 0; s < a.length; s++)
                      ((t = a[s]),
                        !(r.indexOf(t) >= 0) &&
                          Object.prototype.propertyIsEnumerable.call(e, t) &&
                          (n[t] = e[t]));
                  }
                  return n;
                })(e, o),
                c = n ? t : r;
              return (0, i.jsx)(c, l(l({}, a), {}, { ref: s }));
            });
          return (
            (n.displayName = `Primitive.${r}`),
            l(l({}, e), {}, { [r]: n })
          );
        }, {});
        function u(e, r) {
          e && n.flushSync(() => e.dispatchEvent(r));
        }
      },
    }));
  var r = require('../../webpack-runtime.js');
  r.C(e);
  var t = e => r((r.s = e)),
    s = r.X(0, [775, 204, 751], () => t(88501));
  module.exports = s;
})();
