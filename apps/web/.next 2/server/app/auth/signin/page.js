(() => {
  var e = {};
  ((e.id = 98),
    (e.ids = [98]),
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
      39029: (e, r, t) => {
        'use strict';
        (t.r(r),
          t.d(r, {
            GlobalError: () => i.a,
            __next_app__: () => p,
            originalPathname: () => c,
            pages: () => u,
            routeModule: () => m,
            tree: () => d,
          }));
        var n = t(34701),
          s = t(36844),
          a = t(17688),
          i = t.n(a),
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
        let d = [
            '',
            {
              children: [
                'auth',
                {
                  children: [
                    'signin',
                    {
                      children: [
                        '__PAGE__',
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(t.bind(t, 51733)),
                            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/page.tsx',
                          ],
                        },
                      ],
                    },
                    {
                      loading: [
                        () => Promise.resolve().then(t.bind(t, 7790)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/loading.tsx',
                      ],
                    },
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(t.bind(t, 20770)),
                    '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/layout.tsx',
                  ],
                },
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
          u = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/page.tsx',
          ],
          c = '/auth/signin/page',
          p = { require: t, loadChunk: () => Promise.resolve() },
          m = new n.AppPageRouteModule({
            definition: {
              kind: s.x.APP_PAGE,
              page: '/auth/signin/page',
              pathname: '/auth/signin',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      28436: (e, r, t) => {
        Promise.resolve().then(t.bind(t, 3857));
      },
      75738: (e, r, t) => {
        (Promise.resolve().then(t.bind(t, 66410)),
          Promise.resolve().then(t.bind(t, 59121)));
      },
      3857: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { default: () => s }));
        var n = t(73793);
        function s() {
          return n.jsx('div', {
            className:
              'min-h-screen flex items-center justify-center bg-background',
            children: (0, n.jsxs)('div', {
              className: 'text-center',
              children: [
                n.jsx('div', {
                  className:
                    'animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto',
                }),
                n.jsx('p', {
                  className: 'mt-6 text-lg text-muted-foreground',
                  children: 'Carregando...',
                }),
              ],
            }),
          });
        }
      },
      66410: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { LoginForm: () => i }));
        var n = t(12363),
          s = t(39222),
          a = t(73793);
        function i() {
          let { 0: e, 1: r } = (0, n.useState)(''),
            { 0: t, 1: i } = (0, n.useState)(''),
            { 0: o, 1: l } = (0, n.useState)(''),
            { 0: d, 1: u } = (0, n.useState)(!1),
            { 0: c, 1: p } = (0, n.useState)(!1),
            m = async r => {
              (r.preventDefault(), u(!0), l(''));
              try {
                await fetch('/api/auth/signout', {
                  method: 'POST',
                  credentials: 'same-origin',
                });
                let r = await (0, s.signIn)('credentials', {
                  email: e.trim(),
                  password: t,
                  redirect: !1,
                  callbackUrl: '/dashboard',
                });
                if ((console.log('Resultado do login:', r), r?.error))
                  (l('Email ou senha incorretos'), u(!1));
                else if (r?.ok || r?.url) {
                  (u(!0),
                    p(!0),
                    setTimeout(() => {
                      window.location.href = r?.url || '/dashboard';
                    }, 800));
                  return;
                } else {
                  (u(!0),
                    p(!0),
                    setTimeout(() => {
                      window.location.href = '/dashboard';
                    }, 800));
                  return;
                }
              } catch (e) {
                (console.error('Erro no login:', e),
                  l('Erro de conex\xe3o. Tente novamente.'));
              } finally {
                u(!1);
              }
            };
          return c
            ? a.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-background',
                children: (0, a.jsxs)('div', {
                  className: 'text-center',
                  children: [
                    a.jsx('div', {
                      className:
                        'animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto',
                    }),
                    a.jsx('p', {
                      className: 'mt-6 text-lg text-muted-foreground',
                      children: 'Redirecionando para o Dashboard...',
                    }),
                  ],
                }),
              })
            : a.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-background',
                children: (0, a.jsxs)('div', {
                  className: 'max-w-md w-full p-8 bg-card rounded-lg shadow',
                  children: [
                    a.jsx('h2', {
                      className:
                        'text-center text-3xl font-bold text-card-foreground mb-8',
                      children: 'Entrar',
                    }),
                    (0, a.jsxs)('form', {
                      onSubmit: m,
                      className: 'space-y-6',
                      children: [
                        o &&
                          a.jsx('div', {
                            className:
                              'bg-destructive/10 border-l-4 border-destructive p-4 dark:bg-destructive/20',
                            children: a.jsx('p', {
                              className: 'text-sm text-destructive font-medium',
                              children: o,
                            }),
                          }),
                        a.jsx('div', {
                          children: a.jsx('input', {
                            type: 'email',
                            required: !0,
                            value: e,
                            onChange: e => r(e.target.value),
                            className:
                              'w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-background',
                            placeholder: 'Email',
                            disabled: d,
                          }),
                        }),
                        a.jsx('div', {
                          children: a.jsx('input', {
                            type: 'password',
                            required: !0,
                            value: t,
                            onChange: e => i(e.target.value),
                            className:
                              'w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-background',
                            placeholder: 'Senha',
                            disabled: d,
                          }),
                        }),
                        a.jsx('button', {
                          type: 'submit',
                          disabled: d,
                          className:
                            'w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center',
                          children: d
                            ? (0, a.jsxs)(a.Fragment, {
                                children: [
                                  a.jsx('div', {
                                    className:
                                      'animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2',
                                  }),
                                  'Entrando...',
                                ],
                              })
                            : 'Login',
                        }),
                      ],
                    }),
                  ],
                }),
              });
        }
      },
      69557: (e, r, t) => {
        e.exports = t(53651);
      },
      20770: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { default: () => s }));
        var n = t(65657);
        function s({ children: e }) {
          return n.jsx('div', {
            className: 'min-h-screen bg-background',
            children: e,
          });
        }
      },
      7790: (e, r, t) => {
        'use strict';
        (t.r(r),
          t.d(r, { $$typeof: () => a, __esModule: () => s, default: () => i }));
        let n = (0, t(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/loading.tsx`
          ),
          { __esModule: s, $$typeof: a } = n,
          i = n.default;
      },
      51733: (e, r, t) => {
        'use strict';
        (t.r(r), t.d(r, { default: () => u }));
        var n = t(12475),
          s = t(33445);
        let a = (0, s.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/login-form.tsx`
          ),
          { __esModule: i, $$typeof: o } = a;
        a.default;
        let l = (0, s.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signin/login-form.tsx#LoginForm`
        );
        var d = t(65657);
        function u() {
          return d.jsx(n.a, { requireAuth: !1, children: d.jsx(l, {}) });
        }
      },
      65657: (e, r, t) => {
        'use strict';
        e.exports = t(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var r = require('../../../webpack-runtime.js');
  r.C(e);
  var t = e => r((r.s = e)),
    n = r.X(0, [775, 204, 751], () => t(39029));
  module.exports = n;
})();
