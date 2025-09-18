(() => {
  var e = {};
  ((e.id = 122),
    (e.ids = [122]),
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
      7825: (e, t, n) => {
        'use strict';
        (n.r(t),
          n.d(t, {
            GlobalError: () => i.a,
            __next_app__: () => m,
            originalPathname: () => u,
            pages: () => d,
            routeModule: () => p,
            tree: () => c,
          }));
        var r = n(34701),
          s = n(36844),
          a = n(17688),
          i = n.n(a),
          o = n(52631),
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
        n.d(t, l);
        let c = [
            '',
            {
              children: [
                'integracoes',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(n.bind(n, 23178)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/integracoes/page.tsx',
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(n.t.bind(n, 36165, 23)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/layout.tsx',
              ],
              error: [
                () => Promise.resolve().then(n.bind(n, 39269)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx',
              ],
              loading: [
                () => Promise.resolve().then(n.bind(n, 83411)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx',
              ],
              'not-found': [
                () => Promise.resolve().then(n.bind(n, 39432)),
                '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx',
              ],
            },
          ],
          d = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/integracoes/page.tsx',
          ],
          u = '/integracoes/page',
          m = { require: n, loadChunk: () => Promise.resolve() },
          p = new r.AppPageRouteModule({
            definition: {
              kind: s.x.APP_PAGE,
              page: '/integracoes/page',
              pathname: '/integracoes',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: c },
          });
      },
      72103: (e, t, n) => {
        Promise.resolve().then(n.bind(n, 78597));
      },
      41741: (e, t, n) => {
        Promise.resolve().then(n.bind(n, 85555));
      },
      48995: (e, t, n) => {
        Promise.resolve().then(n.bind(n, 11417));
      },
      55885: (e, t, n) => {
        (Promise.resolve().then(n.t.bind(n, 55440, 23)),
          Promise.resolve().then(n.t.bind(n, 93643, 23)),
          Promise.resolve().then(n.t.bind(n, 27905, 23)),
          Promise.resolve().then(n.t.bind(n, 89875, 23)),
          Promise.resolve().then(n.t.bind(n, 90237, 23)),
          Promise.resolve().then(n.t.bind(n, 19576, 23)));
      },
      9708: () => {},
      78597: (e, t, n) => {
        'use strict';
        (n.r(t), n.d(t, { default: () => u }));
        var r = n(12363),
          s = n(3299),
          a = n.n(s),
          i = n(68144),
          o = n(81407),
          l = n(32769),
          c = n(39222),
          d = n(73793);
        function u({ error: e, reset: t }) {
          let { data: n, status: s } = (0, c.useSession)();
          return (
            (0, r.useEffect)(() => {
              console.error('Erro da aplica\xe7\xe3o:', e);
            }, [e]),
            d.jsx('div', {
              className:
                'min-h-screen flex items-center justify-center bg-gray-50',
              children: (0, d.jsxs)('div', {
                className: 'text-center max-w-lg px-6',
                children: [
                  d.jsx('div', {
                    className: 'mb-6',
                    children: d.jsx('div', {
                      className: 'inline-flex rounded-full bg-red-100 p-4',
                      children: d.jsx('div', {
                        className: 'rounded-full bg-red-200 p-4',
                        children: d.jsx('svg', {
                          xmlns: 'http://www.w3.org/2000/svg',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          strokeWidth: 1.5,
                          stroke: 'currentColor',
                          className: 'h-6 w-6 text-red-600',
                          children: d.jsx('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            d: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
                          }),
                        }),
                      }),
                    }),
                  }),
                  d.jsx('h1', {
                    className:
                      'mt-3 text-2xl font-semibold text-gray-800 md:text-3xl',
                    children: 'Algo deu errado',
                  }),
                  d.jsx('p', {
                    className: 'mt-4 text-gray-600',
                    children:
                      'Ocorreu um erro ao tentar carregar esta p\xe1gina.',
                  }),
                  !1,
                  (0, d.jsxs)('div', {
                    className:
                      'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                    children: [
                      (0, d.jsxs)(i.z, {
                        onClick: () => t(),
                        variant: 'outline',
                        className: 'flex items-center gap-2',
                        children: [
                          d.jsx(o.Z, { className: 'h-4 w-4' }),
                          'Tentar novamente',
                        ],
                      }),
                      d.jsx(a(), {
                        href: 'authenticated' === s ? '/dashboard' : '/',
                        children: (0, d.jsxs)(i.z, {
                          className: 'flex items-center gap-2',
                          children: [
                            d.jsx(l.Z, { className: 'h-4 w-4' }),
                            'authenticated' === s
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
      85555: (e, t, n) => {
        'use strict';
        (n.r(t), n.d(t, { default: () => s }));
        var r = n(73793);
        function s() {
          return r.jsx('div', {
            className:
              'min-h-screen flex items-center justify-center bg-background',
            children: (0, r.jsxs)('div', {
              className: 'text-center',
              children: [
                r.jsx('div', {
                  className:
                    'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto',
                }),
                r.jsx('p', {
                  className: 'mt-6 text-lg text-muted-foreground',
                  children: 'Carregando...',
                }),
              ],
            }),
          });
        }
      },
      11417: (e, t, n) => {
        'use strict';
        (n.r(t), n.d(t, { default: () => m }));
        var r = n(39222),
          s = n(3299),
          a = n.n(s),
          i = n(68144),
          o = n(81407),
          l = n(32769),
          c = n(12363),
          d = n(49026),
          u = n(73793);
        function m() {
          let { data: e, status: t } = (0, r.useSession)();
          (0, d.t)();
          let { 0: n, 1: s } = (0, c.useState)(!1);
          return ((0, c.useEffect)(() => {
            s(!0);
          }, []),
          n)
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
                        u.jsx(a(), {
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
      68144: (e, t, n) => {
        'use strict';
        n.d(t, { z: () => u });
        var r = n(12363),
          s = n(67031),
          a = n(57630),
          i = n(24662),
          o = n(73793);
        let l = ['className', 'variant', 'size', 'asChild'];
        function c(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            (t &&
              (r = r.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, r));
          }
          return n;
        }
        let d = (0, a.j)(
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
          u = r.forwardRef((e, t) => {
            let { className: n, variant: r, size: a, asChild: u = !1 } = e,
              m = (function (e, t) {
                if (null == e) return {};
                var n,
                  r,
                  s = (function (e, t) {
                    if (null == e) return {};
                    var n,
                      r,
                      s = {},
                      a = Object.keys(e);
                    for (r = 0; r < a.length; r++)
                      ((n = a[r]), t.indexOf(n) >= 0 || (s[n] = e[n]));
                    return s;
                  })(e, t);
                if (Object.getOwnPropertySymbols) {
                  var a = Object.getOwnPropertySymbols(e);
                  for (r = 0; r < a.length; r++)
                    ((n = a[r]),
                      !(t.indexOf(n) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, n) &&
                        (s[n] = e[n]));
                }
                return s;
              })(e, l),
              p = u ? s.g7 : 'button';
            return o.jsx(
              p,
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? c(Object(n), !0).forEach(function (t) {
                        var r, s;
                        ((r = t),
                          (s = n[t]),
                          (r = (function (e) {
                            var t = (function (e, t) {
                              if ('object' != typeof e || null === e) return e;
                              var n = e[Symbol.toPrimitive];
                              if (void 0 !== n) {
                                var r = n.call(e, t || 'default');
                                if ('object' != typeof r) return r;
                                throw TypeError(
                                  '@@toPrimitive must return a primitive value.'
                                );
                              }
                              return ('string' === t ? String : Number)(e);
                            })(e, 'string');
                            return 'symbol' == typeof t ? t : String(t);
                          })(r)) in e
                            ? Object.defineProperty(e, r, {
                                value: s,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0,
                              })
                            : (e[r] = s));
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(n)
                        )
                      : c(Object(n)).forEach(function (t) {
                          Object.defineProperty(
                            e,
                            t,
                            Object.getOwnPropertyDescriptor(n, t)
                          );
                        });
                }
                return e;
              })(
                {
                  className: (0, i.cn)(
                    d({ variant: r, size: a, className: n })
                  ),
                  ref: t,
                },
                m
              )
            );
          });
        u.displayName = 'Button';
      },
      49026: (e, t, n) => {
        'use strict';
        n.d(t, { t: () => s });
        var r = n(12363);
        function s() {
          let { 0: e, 1: t } = (0, r.useState)(!1);
          return ((0, r.useEffect)(() => (t(!0), () => t(!1)), []), e);
        }
      },
      24662: (e, t, n) => {
        'use strict';
        n.d(t, { cn: () => a });
        var r = n(32296),
          s = n(94172);
        function a(...e) {
          return (0, s.m6)((0, r.W)(e));
        }
      },
      39269: (e, t, n) => {
        'use strict';
        (n.r(t),
          n.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
        let r = (0, n(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
          ),
          { __esModule: s, $$typeof: a } = r,
          i = r.default;
      },
      23178: (e, t, n) => {
        'use strict';
        (n.r(t), n.d(t, { default: () => s }));
        var r = n(65657);
        function s() {
          return (0, r.jsxs)('div', {
            className: 'p-8',
            children: [
              r.jsx('h1', {
                className: 'text-2xl font-bold mb-4',
                children: 'Integra\xe7\xf5es Banc\xe1rias',
              }),
              r.jsx('p', {
                className: 'text-muted-foreground mb-2',
                children:
                  'Aqui voc\xea poder\xe1 conectar e gerenciar integra\xe7\xf5es com bancos e institui\xe7\xf5es financeiras.',
              }),
            ],
          });
        }
      },
      36165: () => {
        throw Error(
          'Module build failed (from ../../node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/loader/index.js):\nSyntaxError: "next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict\n    at PluginPass.ImportDeclaration (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/plugins/next-font-unsupported.js:22:33)\n    at n (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:106935)\n    at NodePath._call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21196)\n    at NodePath.call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21020)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22092)\n    at TraversalContext.visitQueue (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15150)\n    at TraversalContext.visitMultiple (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:14751)\n    at TraversalContext.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15421)\n    at traverseNode (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:104193)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22241)'
        );
      },
      83411: (e, t, n) => {
        'use strict';
        (n.r(t),
          n.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
        let r = (0, n(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
          ),
          { __esModule: s, $$typeof: a } = r,
          i = r.default;
      },
      39432: (e, t, n) => {
        'use strict';
        (n.r(t),
          n.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
        let r = (0, n(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
          ),
          { __esModule: s, $$typeof: a } = r,
          i = r.default;
      },
      65657: (e, t, n) => {
        'use strict';
        e.exports = n(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var t = require('../../webpack-runtime.js');
  t.C(e);
  var n = e => t((t.s = e)),
    r = t.X(0, [775, 204], () => n(7825));
  module.exports = r;
})();
