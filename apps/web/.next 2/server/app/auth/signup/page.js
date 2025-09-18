(() => {
  var e = {};
  ((e.id = 271),
    (e.ids = [271]),
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
      6424: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, {
            GlobalError: () => i.a,
            __next_app__: () => m,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => p,
            tree: () => d,
          }));
        var n = r(34701),
          a = r(36844),
          s = r(17688),
          i = r.n(s),
          o = r(52631),
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
        r.d(t, l);
        let d = [
            '',
            {
              children: [
                'auth',
                {
                  children: [
                    'signup',
                    {
                      children: [
                        '__PAGE__',
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(r.bind(r, 56253)),
                            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signup/page.tsx',
                          ],
                        },
                      ],
                    },
                    {},
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(r.bind(r, 20770)),
                    '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/layout.tsx',
                  ],
                },
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
          c = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signup/page.tsx',
          ],
          u = '/auth/signup/page',
          m = { require: r, loadChunk: () => Promise.resolve() },
          p = new n.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: '/auth/signup/page',
              pathname: '/auth/signup',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      46535: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 48902));
      },
      72103: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 78597));
      },
      41741: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 85555));
      },
      48995: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 11417));
      },
      55885: (e, t, r) => {
        (Promise.resolve().then(r.t.bind(r, 55440, 23)),
          Promise.resolve().then(r.t.bind(r, 93643, 23)),
          Promise.resolve().then(r.t.bind(r, 27905, 23)),
          Promise.resolve().then(r.t.bind(r, 89875, 23)),
          Promise.resolve().then(r.t.bind(r, 90237, 23)),
          Promise.resolve().then(r.t.bind(r, 19576, 23)));
      },
      9708: () => {},
      48902: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => l }));
        var n = r(12363),
          a = r(69557),
          s = r(3299),
          i = r.n(s),
          o = r(73793);
        function l() {
          let { 0: e, 1: t } = (0, n.useState)(''),
            { 0: r, 1: s } = (0, n.useState)(''),
            { 0: l, 1: d } = (0, n.useState)(''),
            { 0: c, 1: u } = (0, n.useState)(''),
            { 0: m, 1: p } = (0, n.useState)(!1),
            x = (0, a.useRouter)(),
            b = async t => {
              (t.preventDefault(), p(!0), u(''));
              try {
                let t = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: e, email: r, password: l }),
                });
                if (t.ok)
                  (
                    await fetch('/api/auth/callback/credentials', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: r, password: l }),
                    })
                  ).ok
                    ? (x.push('/dashboard'), x.refresh())
                    : x.push(
                        '/auth/signin?message=Conta criada com sucesso. Fa\xe7a login.'
                      );
                else {
                  let e = await t.json();
                  (u(e.message || 'Erro ao criar conta'), p(!1));
                }
              } catch (e) {
                (u('Erro interno do servidor'), p(!1));
              }
            };
          return o.jsx('div', {
            className:
              'min-h-screen flex items-center justify-center bg-gray-50',
            children: (0, o.jsxs)('div', {
              className: 'max-w-md w-full space-y-8 p-8',
              children: [
                o.jsx('div', {
                  children: o.jsx('h2', {
                    className:
                      'mt-6 text-center text-3xl font-extrabold text-gray-900',
                    children: 'Criar nova conta',
                  }),
                }),
                (0, o.jsxs)('form', {
                  className: 'mt-8 space-y-6',
                  onSubmit: b,
                  children: [
                    c &&
                      o.jsx('div', {
                        className:
                          'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded',
                        children: c,
                      }),
                    (0, o.jsxs)('div', {
                      children: [
                        o.jsx('label', {
                          htmlFor: 'name',
                          className: 'sr-only',
                          children: 'Nome',
                        }),
                        o.jsx('input', {
                          id: 'name',
                          name: 'name',
                          type: 'text',
                          required: !0,
                          value: e,
                          onChange: e => t(e.target.value),
                          className:
                            'relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                          placeholder: 'Nome completo',
                        }),
                      ],
                    }),
                    (0, o.jsxs)('div', {
                      children: [
                        o.jsx('label', {
                          htmlFor: 'email',
                          className: 'sr-only',
                          children: 'Email',
                        }),
                        o.jsx('input', {
                          id: 'email',
                          name: 'email',
                          type: 'email',
                          required: !0,
                          value: r,
                          onChange: e => s(e.target.value),
                          className:
                            'relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                          placeholder: 'Email',
                        }),
                      ],
                    }),
                    (0, o.jsxs)('div', {
                      children: [
                        o.jsx('label', {
                          htmlFor: 'password',
                          className: 'sr-only',
                          children: 'Senha',
                        }),
                        o.jsx('input', {
                          id: 'password',
                          name: 'password',
                          type: 'password',
                          required: !0,
                          minLength: 6,
                          value: l,
                          onChange: e => d(e.target.value),
                          className:
                            'relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                          placeholder: 'Senha (m\xednimo 6 caracteres)',
                        }),
                      ],
                    }),
                    o.jsx('div', {
                      children: o.jsx('button', {
                        type: 'submit',
                        disabled: m,
                        className:
                          'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50',
                        children: m ? 'Criando conta...' : 'Criar conta',
                      }),
                    }),
                    o.jsx('div', {
                      className: 'text-center',
                      children: o.jsx(i(), {
                        href: '/auth/signin',
                        className:
                          'font-medium text-indigo-600 hover:text-indigo-500',
                        children: 'J\xe1 tem conta? Entrar',
                      }),
                    }),
                  ],
                }),
              ],
            }),
          });
        }
      },
      78597: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => u }));
        var n = r(12363),
          a = r(3299),
          s = r.n(a),
          i = r(68144),
          o = r(81407),
          l = r(32769),
          d = r(39222),
          c = r(73793);
        function u({ error: e, reset: t }) {
          let { data: r, status: a } = (0, d.useSession)();
          return (
            (0, n.useEffect)(() => {
              console.error('Erro da aplica\xe7\xe3o:', e);
            }, [e]),
            c.jsx('div', {
              className:
                'min-h-screen flex items-center justify-center bg-gray-50',
              children: (0, c.jsxs)('div', {
                className: 'text-center max-w-lg px-6',
                children: [
                  c.jsx('div', {
                    className: 'mb-6',
                    children: c.jsx('div', {
                      className: 'inline-flex rounded-full bg-red-100 p-4',
                      children: c.jsx('div', {
                        className: 'rounded-full bg-red-200 p-4',
                        children: c.jsx('svg', {
                          xmlns: 'http://www.w3.org/2000/svg',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          strokeWidth: 1.5,
                          stroke: 'currentColor',
                          className: 'h-6 w-6 text-red-600',
                          children: c.jsx('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            d: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
                          }),
                        }),
                      }),
                    }),
                  }),
                  c.jsx('h1', {
                    className:
                      'mt-3 text-2xl font-semibold text-gray-800 md:text-3xl',
                    children: 'Algo deu errado',
                  }),
                  c.jsx('p', {
                    className: 'mt-4 text-gray-600',
                    children:
                      'Ocorreu um erro ao tentar carregar esta p\xe1gina.',
                  }),
                  !1,
                  (0, c.jsxs)('div', {
                    className:
                      'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                    children: [
                      (0, c.jsxs)(i.z, {
                        onClick: () => t(),
                        variant: 'outline',
                        className: 'flex items-center gap-2',
                        children: [
                          c.jsx(o.Z, { className: 'h-4 w-4' }),
                          'Tentar novamente',
                        ],
                      }),
                      c.jsx(s(), {
                        href: 'authenticated' === a ? '/dashboard' : '/',
                        children: (0, c.jsxs)(i.z, {
                          className: 'flex items-center gap-2',
                          children: [
                            c.jsx(l.Z, { className: 'h-4 w-4' }),
                            'authenticated' === a
                              ? 'Voltar ao Dashboard'
                              : 'P\xe1gina Inicial',
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            })
          );
        }
      },
      85555: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => a }));
        var n = r(73793);
        function a() {
          return n.jsx('div', {
            className:
              'min-h-screen flex items-center justify-center bg-background',
            children: (0, n.jsxs)('div', {
              className: 'text-center',
              children: [
                n.jsx('div', {
                  className:
                    'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto',
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
      11417: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => m }));
        var n = r(39222),
          a = r(3299),
          s = r.n(a),
          i = r(68144),
          o = r(81407),
          l = r(32769),
          d = r(12363),
          c = r(49026),
          u = r(73793);
        function m() {
          let { data: e, status: t } = (0, n.useSession)();
          (0, c.t)();
          let { 0: r, 1: a } = (0, d.useState)(!1);
          return ((0, d.useEffect)(() => {
            a(!0);
          }, []),
          r)
            ? u.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: (0, u.jsxs)('div', {
                  className: 'text-center max-w-lg px-6',
                  children: [
                    u.jsx('div', {
                      className: 'mb-6',
                      children: u.jsx('div', {
                        className: 'inline-flex rounded-full bg-blue-100 p-4',
                        children: u.jsx('div', {
                          className: 'rounded-full bg-blue-200 p-4',
                          children: u.jsx('svg', {
                            xmlns: 'http://www.w3.org/2000/svg',
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            strokeWidth: 1.5,
                            stroke: 'currentColor',
                            className: 'h-6 w-6 text-blue-600',
                            children: u.jsx('path', {
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                              d: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
                            }),
                          }),
                        }),
                      }),
                    }),
                    u.jsx('h1', {
                      className:
                        'mt-3 text-2xl font-semibold text-gray-800 md:text-3xl',
                      children: 'P\xe1gina n\xe3o encontrada',
                    }),
                    u.jsx('p', {
                      className: 'mt-4 text-gray-600',
                      children:
                        'A p\xe1gina que voc\xea est\xe1 procurando n\xe3o existe ou foi movida.',
                    }),
                    (0, u.jsxs)('div', {
                      className:
                        'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                      children: [
                        (0, u.jsxs)(i.z, {
                          onClick: () => window.history.back(),
                          variant: 'outline',
                          className: 'flex items-center gap-2',
                          children: [
                            u.jsx(o.Z, { className: 'h-4 w-4' }),
                            'Voltar',
                          ],
                        }),
                        u.jsx(s(), {
                          href: 'authenticated' === t ? '/dashboard' : '/',
                          children: (0, u.jsxs)(i.z, {
                            className: 'flex items-center gap-2',
                            children: [
                              u.jsx(l.Z, { className: 'h-4 w-4' }),
                              'authenticated' === t
                                ? 'Ir para o Dashboard'
                                : 'Ir para a P\xe1gina Inicial',
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              })
            : u.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: u.jsx('div', {
                  className:
                    'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500',
                }),
              });
        }
      },
      68144: (e, t, r) => {
        'use strict';
        r.d(t, { z: () => u });
        var n = r(12363),
          a = r(67031),
          s = r(57630),
          i = r(24662),
          o = r(73793);
        let l = ['className', 'variant', 'size', 'asChild'];
        function d(e, t) {
          var r = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            (t &&
              (n = n.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              r.push.apply(r, n));
          }
          return r;
        }
        let c = (0, s.j)(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            {
              variants: {
                variant: {
                  default:
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                  destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                  outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                  secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  ghost: 'hover:bg-accent hover:text-accent-foreground',
                  link: 'text-primary underline-offset-4 hover:underline',
                },
                size: {
                  default: 'h-10 px-4 py-2',
                  sm: 'h-9 rounded-md px-3',
                  lg: 'h-11 rounded-md px-8',
                  icon: 'h-10 w-10',
                },
              },
              defaultVariants: { variant: 'default', size: 'default' },
            }
          ),
          u = n.forwardRef((e, t) => {
            let { className: r, variant: n, size: s, asChild: u = !1 } = e,
              m = (function (e, t) {
                if (null == e) return {};
                var r,
                  n,
                  a = (function (e, t) {
                    if (null == e) return {};
                    var r,
                      n,
                      a = {},
                      s = Object.keys(e);
                    for (n = 0; n < s.length; n++)
                      ((r = s[n]), t.indexOf(r) >= 0 || (a[r] = e[r]));
                    return a;
                  })(e, t);
                if (Object.getOwnPropertySymbols) {
                  var s = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < s.length; n++)
                    ((r = s[n]),
                      !(t.indexOf(r) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, r) &&
                        (a[r] = e[r]));
                }
                return a;
              })(e, l),
              p = u ? a.g7 : 'button';
            return o.jsx(
              p,
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? d(Object(r), !0).forEach(function (t) {
                        var n, a;
                        ((n = t),
                          (a = r[t]),
                          (n = (function (e) {
                            var t = (function (e, t) {
                              if ('object' != typeof e || null === e) return e;
                              var r = e[Symbol.toPrimitive];
                              if (void 0 !== r) {
                                var n = r.call(e, t || 'default');
                                if ('object' != typeof n) return n;
                                throw TypeError(
                                  '@@toPrimitive must return a primitive value.'
                                );
                              }
                              return ('string' === t ? String : Number)(e);
                            })(e, 'string');
                            return 'symbol' == typeof t ? t : String(t);
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
                          Object.getOwnPropertyDescriptors(r)
                        )
                      : d(Object(r)).forEach(function (t) {
                          Object.defineProperty(
                            e,
                            t,
                            Object.getOwnPropertyDescriptor(r, t)
                          );
                        });
                }
                return e;
              })(
                {
                  className: (0, i.cn)(
                    c({ variant: n, size: s, className: r })
                  ),
                  ref: t,
                },
                m
              )
            );
          });
        u.displayName = 'Button';
      },
      49026: (e, t, r) => {
        'use strict';
        r.d(t, { t: () => a });
        var n = r(12363);
        function a() {
          let { 0: e, 1: t } = (0, n.useState)(!1);
          return ((0, n.useEffect)(() => (t(!0), () => t(!1)), []), e);
        }
      },
      24662: (e, t, r) => {
        'use strict';
        r.d(t, { cn: () => s });
        var n = r(32296),
          a = r(94172);
        function s(...e) {
          return (0, a.m6)((0, n.W)(e));
        }
      },
      69557: (e, t, r) => {
        e.exports = r(53651);
      },
      20770: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => a }));
        var n = r(65657);
        function a({ children: e }) {
          return n.jsx('div', {
            className: 'min-h-screen bg-background',
            children: e,
          });
        }
      },
      56253: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => s, __esModule: () => a, default: () => i }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/auth/signup/page.tsx`
          ),
          { __esModule: a, $$typeof: s } = n,
          i = n.default;
      },
      39269: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => s, __esModule: () => a, default: () => i }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
          ),
          { __esModule: a, $$typeof: s } = n,
          i = n.default;
      },
      36165: () => {
        throw Error(
          'Module build failed (from ../../node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/loader/index.js):\nSyntaxError: "next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict\n    at PluginPass.ImportDeclaration (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/plugins/next-font-unsupported.js:22:33)\n    at n (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:106935)\n    at NodePath._call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21196)\n    at NodePath.call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21020)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22092)\n    at TraversalContext.visitQueue (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15150)\n    at TraversalContext.visitMultiple (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:14751)\n    at TraversalContext.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15421)\n    at traverseNode (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:104193)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22241)'
        );
      },
      83411: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => s, __esModule: () => a, default: () => i }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
          ),
          { __esModule: a, $$typeof: s } = n,
          i = n.default;
      },
      39432: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => s, __esModule: () => a, default: () => i }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
          ),
          { __esModule: a, $$typeof: s } = n,
          i = n.default;
      },
      65657: (e, t, r) => {
        'use strict';
        e.exports = r(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var t = require('../../../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    n = t.X(0, [775, 204], () => r(6424));
  module.exports = n;
})();
