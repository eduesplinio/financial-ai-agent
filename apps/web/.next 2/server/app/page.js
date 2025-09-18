(() => {
  var e = {};
  ((e.id = 931),
    (e.ids = [931]),
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
      73203: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, {
            GlobalError: () => s.a,
            __next_app__: () => f,
            originalPathname: () => c,
            pages: () => d,
            routeModule: () => p,
            tree: () => u,
          }));
        var n = r(34701),
          o = r(36844),
          i = r(17688),
          s = r.n(i),
          a = r(52631),
          l = {};
        for (let e in a)
          0 >
            [
              'default',
              'tree',
              'pages',
              'GlobalError',
              'originalPathname',
              '__next_app__',
              'routeModule',
            ].indexOf(e) && (l[e] = () => a[e]);
        r.d(t, l);
        let u = [
            '',
            {
              children: [
                '__PAGE__',
                {},
                {
                  page: [
                    () => Promise.resolve().then(r.bind(r, 36079)),
                    '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/page.tsx',
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
          d = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/page.tsx',
          ],
          c = '/page',
          f = { require: r, loadChunk: () => Promise.resolve() },
          p = new n.AppPageRouteModule({
            definition: {
              kind: o.x.APP_PAGE,
              page: '/page',
              pathname: '/',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: u },
          });
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
      78597: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => c }));
        var n = r(12363),
          o = r(3299),
          i = r.n(o),
          s = r(68144),
          a = r(81407),
          l = r(32769),
          u = r(39222),
          d = r(73793);
        function c({ error: e, reset: t }) {
          let { data: r, status: o } = (0, u.useSession)();
          return (
            (0, n.useEffect)(() => {
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
                      (0, d.jsxs)(s.z, {
                        onClick: () => t(),
                        variant: 'outline',
                        className: 'flex items-center gap-2',
                        children: [
                          d.jsx(a.Z, { className: 'h-4 w-4' }),
                          'Tentar novamente',
                        ],
                      }),
                      d.jsx(i(), {
                        href: 'authenticated' === o ? '/dashboard' : '/',
                        children: (0, d.jsxs)(s.z, {
                          className: 'flex items-center gap-2',
                          children: [
                            d.jsx(l.Z, { className: 'h-4 w-4' }),
                            'authenticated' === o
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
        (r.r(t), r.d(t, { default: () => o }));
        var n = r(73793);
        function o() {
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
        (r.r(t), r.d(t, { default: () => f }));
        var n = r(39222),
          o = r(3299),
          i = r.n(o),
          s = r(68144),
          a = r(81407),
          l = r(32769),
          u = r(12363),
          d = r(49026),
          c = r(73793);
        function f() {
          let { data: e, status: t } = (0, n.useSession)();
          (0, d.t)();
          let { 0: r, 1: o } = (0, u.useState)(!1);
          return ((0, u.useEffect)(() => {
            o(!0);
          }, []),
          r)
            ? c.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: (0, c.jsxs)('div', {
                  className: 'text-center max-w-lg px-6',
                  children: [
                    c.jsx('div', {
                      className: 'mb-6',
                      children: c.jsx('div', {
                        className: 'inline-flex rounded-full bg-blue-100 p-4',
                        children: c.jsx('div', {
                          className: 'rounded-full bg-blue-200 p-4',
                          children: c.jsx('svg', {
                            xmlns: 'http://www.w3.org/2000/svg',
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            strokeWidth: 1.5,
                            stroke: 'currentColor',
                            className: 'h-6 w-6 text-blue-600',
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
                      children: 'P\xe1gina n\xe3o encontrada',
                    }),
                    c.jsx('p', {
                      className: 'mt-4 text-gray-600',
                      children:
                        'A p\xe1gina que voc\xea est\xe1 procurando n\xe3o existe ou foi movida.',
                    }),
                    (0, c.jsxs)('div', {
                      className:
                        'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                      children: [
                        (0, c.jsxs)(s.z, {
                          onClick: () => window.history.back(),
                          variant: 'outline',
                          className: 'flex items-center gap-2',
                          children: [
                            c.jsx(a.Z, { className: 'h-4 w-4' }),
                            'Voltar',
                          ],
                        }),
                        c.jsx(i(), {
                          href: 'authenticated' === t ? '/dashboard' : '/',
                          children: (0, c.jsxs)(s.z, {
                            className: 'flex items-center gap-2',
                            children: [
                              c.jsx(l.Z, { className: 'h-4 w-4' }),
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
            : c.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: c.jsx('div', {
                  className:
                    'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500',
                }),
              });
        }
      },
      68144: (e, t, r) => {
        'use strict';
        r.d(t, { z: () => c });
        var n = r(12363),
          o = r(67031),
          i = r(57630),
          s = r(24662),
          a = r(73793);
        let l = ['className', 'variant', 'size', 'asChild'];
        function u(e, t) {
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
        let d = (0, i.j)(
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
          c = n.forwardRef((e, t) => {
            let { className: r, variant: n, size: i, asChild: c = !1 } = e,
              f = (function (e, t) {
                if (null == e) return {};
                var r,
                  n,
                  o = (function (e, t) {
                    if (null == e) return {};
                    var r,
                      n,
                      o = {},
                      i = Object.keys(e);
                    for (n = 0; n < i.length; n++)
                      ((r = i[n]), t.indexOf(r) >= 0 || (o[r] = e[r]));
                    return o;
                  })(e, t);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(e);
                  for (n = 0; n < i.length; n++)
                    ((r = i[n]),
                      !(t.indexOf(r) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, r) &&
                        (o[r] = e[r]));
                }
                return o;
              })(e, l),
              p = c ? o.g7 : 'button';
            return a.jsx(
              p,
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? u(Object(r), !0).forEach(function (t) {
                        var n, o;
                        ((n = t),
                          (o = r[t]),
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
                                value: o,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0,
                              })
                            : (e[n] = o));
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(r)
                        )
                      : u(Object(r)).forEach(function (t) {
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
                  className: (0, s.cn)(
                    d({ variant: n, size: i, className: r })
                  ),
                  ref: t,
                },
                f
              )
            );
          });
        c.displayName = 'Button';
      },
      49026: (e, t, r) => {
        'use strict';
        r.d(t, { t: () => o });
        var n = r(12363);
        function o() {
          let { 0: e, 1: t } = (0, n.useState)(!1);
          return ((0, n.useEffect)(() => (t(!0), () => t(!1)), []), e);
        }
      },
      24662: (e, t, r) => {
        'use strict';
        r.d(t, { cn: () => i });
        var n = r(32296),
          o = r(94172);
        function i(...e) {
          return (0, o.m6)((0, n.W)(e));
        }
      },
      39269: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => s }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          s = n.default;
      },
      36165: () => {
        throw Error(
          'Module build failed (from ../../node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/loader/index.js):\nSyntaxError: "next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict\n    at PluginPass.ImportDeclaration (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/plugins/next-font-unsupported.js:22:33)\n    at n (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:106935)\n    at NodePath._call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21196)\n    at NodePath.call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21020)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22092)\n    at TraversalContext.visitQueue (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15150)\n    at TraversalContext.visitMultiple (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:14751)\n    at TraversalContext.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15421)\n    at traverseNode (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:104193)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22241)'
        );
      },
      83411: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => s }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          s = n.default;
      },
      39432: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => s }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          s = n.default;
      },
      36079: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => o }));
        var n = r(75696);
        function o() {
          (0, n.redirect)('/auth/signin');
        }
      },
      88551: (e, t, r) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'bailoutToClientRendering', {
            enumerable: !0,
            get: function () {
              return i;
            },
          }));
        let n = r(5293),
          o = r(45869);
        function i() {
          let e = o.staticGenerationAsyncStorage.getStore();
          (null == e || !e.forceStatic) &&
            (null == e ? void 0 : e.isStaticGeneration) &&
            (0, n.throwWithNoSSR)();
        }
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      82303: (e, t, r) => {
        'use strict';
        function n(e) {}
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'clientHookInServerComponentError', {
            enumerable: !0,
            get: function () {
              return n;
            },
          }),
          r(23299),
          r(11085),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      11852: (e, t, r) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            ReadonlyURLSearchParams: function () {
              return p;
            },
            useSearchParams: function () {
              return m;
            },
            usePathname: function () {
              return b;
            },
            ServerInsertedHTMLContext: function () {
              return l.ServerInsertedHTMLContext;
            },
            useServerInsertedHTML: function () {
              return l.useServerInsertedHTML;
            },
            useRouter: function () {
              return x;
            },
            useParams: function () {
              return g;
            },
            useSelectedLayoutSegments: function () {
              return v;
            },
            useSelectedLayoutSegment: function () {
              return _;
            },
            redirect: function () {
              return u.redirect;
            },
            permanentRedirect: function () {
              return u.permanentRedirect;
            },
            RedirectType: function () {
              return u.RedirectType;
            },
            notFound: function () {
              return d.notFound;
            },
          }));
        let n = r(11085),
          o = r(75606),
          i = r(73847),
          s = r(82303),
          a = r(34211),
          l = r(54344),
          u = r(9863),
          d = r(13453),
          c = Symbol('internal for urlsearchparams readonly');
        function f() {
          return Error('ReadonlyURLSearchParams cannot be modified');
        }
        class p {
          [Symbol.iterator]() {
            return this[c][Symbol.iterator]();
          }
          append() {
            throw f();
          }
          delete() {
            throw f();
          }
          set() {
            throw f();
          }
          sort() {
            throw f();
          }
          constructor(e) {
            ((this[c] = e),
              (this.entries = e.entries.bind(e)),
              (this.forEach = e.forEach.bind(e)),
              (this.get = e.get.bind(e)),
              (this.getAll = e.getAll.bind(e)),
              (this.has = e.has.bind(e)),
              (this.keys = e.keys.bind(e)),
              (this.values = e.values.bind(e)),
              (this.toString = e.toString.bind(e)),
              (this.size = e.size));
          }
        }
        function m() {
          (0, s.clientHookInServerComponentError)('useSearchParams');
          let e = (0, n.useContext)(i.SearchParamsContext),
            t = (0, n.useMemo)(() => (e ? new p(e) : null), [e]);
          {
            let { bailoutToClientRendering: e } = r(88551);
            e();
          }
          return t;
        }
        function b() {
          return (
            (0, s.clientHookInServerComponentError)('usePathname'),
            (0, n.useContext)(i.PathnameContext)
          );
        }
        function x() {
          (0, s.clientHookInServerComponentError)('useRouter');
          let e = (0, n.useContext)(o.AppRouterContext);
          if (null === e)
            throw Error('invariant expected app router to be mounted');
          return e;
        }
        function g() {
          (0, s.clientHookInServerComponentError)('useParams');
          let e = (0, n.useContext)(o.GlobalLayoutRouterContext),
            t = (0, n.useContext)(i.PathParamsContext);
          return (0, n.useMemo)(
            () =>
              (null == e ? void 0 : e.tree)
                ? (function e(t, r) {
                    for (let n of (void 0 === r && (r = {}),
                    Object.values(t[1]))) {
                      let t = n[0],
                        o = Array.isArray(t),
                        i = o ? t[1] : t;
                      !i ||
                        i.startsWith('__PAGE__') ||
                        (o && ('c' === t[2] || 'oc' === t[2])
                          ? (r[t[0]] = t[1].split('/'))
                          : o && (r[t[0]] = t[1]),
                        (r = e(n, r)));
                    }
                    return r;
                  })(e.tree)
                : t,
            [null == e ? void 0 : e.tree, t]
          );
        }
        function v(e) {
          (void 0 === e && (e = 'children'),
            (0, s.clientHookInServerComponentError)(
              'useSelectedLayoutSegments'
            ));
          let { tree: t } = (0, n.useContext)(o.LayoutRouterContext);
          return (function e(t, r, n, o) {
            let i;
            if ((void 0 === n && (n = !0), void 0 === o && (o = []), n))
              i = t[1][r];
            else {
              var s;
              let e = t[1];
              i = null != (s = e.children) ? s : Object.values(e)[0];
            }
            if (!i) return o;
            let l = i[0],
              u = (0, a.getSegmentValue)(l);
            return !u || u.startsWith('__PAGE__')
              ? o
              : (o.push(u), e(i, r, !1, o));
          })(t, e);
        }
        function _(e) {
          (void 0 === e && (e = 'children'),
            (0, s.clientHookInServerComponentError)(
              'useSelectedLayoutSegment'
            ));
          let t = v(e);
          return 0 === t.length ? null : t[0];
        }
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      13453: (e, t) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            notFound: function () {
              return n;
            },
            isNotFoundError: function () {
              return o;
            },
          }));
        let r = 'NEXT_NOT_FOUND';
        function n() {
          let e = Error(r);
          throw ((e.digest = r), e);
        }
        function o(e) {
          return (null == e ? void 0 : e.digest) === r;
        }
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      79528: (e, t) => {
        'use strict';
        var r;
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'RedirectStatusCode', {
            enumerable: !0,
            get: function () {
              return r;
            },
          }),
          (function (e) {
            ((e[(e.SeeOther = 303)] = 'SeeOther'),
              (e[(e.TemporaryRedirect = 307)] = 'TemporaryRedirect'),
              (e[(e.PermanentRedirect = 308)] = 'PermanentRedirect'));
          })(r || (r = {})),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      9863: (e, t, r) => {
        'use strict';
        var n;
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            RedirectType: function () {
              return n;
            },
            getRedirectError: function () {
              return l;
            },
            redirect: function () {
              return u;
            },
            permanentRedirect: function () {
              return d;
            },
            isRedirectError: function () {
              return c;
            },
            getURLFromRedirectError: function () {
              return f;
            },
            getRedirectTypeFromError: function () {
              return p;
            },
            getRedirectStatusCodeFromError: function () {
              return m;
            },
          }));
        let o = r(54580),
          i = r(72934),
          s = r(79528),
          a = 'NEXT_REDIRECT';
        function l(e, t, r) {
          void 0 === r && (r = s.RedirectStatusCode.TemporaryRedirect);
          let n = Error(a);
          n.digest = a + ';' + t + ';' + e + ';' + r + ';';
          let i = o.requestAsyncStorage.getStore();
          return (i && (n.mutableCookies = i.mutableCookies), n);
        }
        function u(e, t) {
          void 0 === t && (t = 'replace');
          let r = i.actionAsyncStorage.getStore();
          throw l(
            e,
            t,
            (null == r ? void 0 : r.isAction)
              ? s.RedirectStatusCode.SeeOther
              : s.RedirectStatusCode.TemporaryRedirect
          );
        }
        function d(e, t) {
          void 0 === t && (t = 'replace');
          let r = i.actionAsyncStorage.getStore();
          throw l(
            e,
            t,
            (null == r ? void 0 : r.isAction)
              ? s.RedirectStatusCode.SeeOther
              : s.RedirectStatusCode.PermanentRedirect
          );
        }
        function c(e) {
          if ('string' != typeof (null == e ? void 0 : e.digest)) return !1;
          let [t, r, n, o] = e.digest.split(';', 4),
            i = Number(o);
          return (
            t === a &&
            ('replace' === r || 'push' === r) &&
            'string' == typeof n &&
            !isNaN(i) &&
            i in s.RedirectStatusCode
          );
        }
        function f(e) {
          return c(e) ? e.digest.split(';', 3)[2] : null;
        }
        function p(e) {
          if (!c(e)) throw Error('Not a redirect error');
          return e.digest.split(';', 2)[1];
        }
        function m(e) {
          if (!c(e)) throw Error('Not a redirect error');
          return Number(e.digest.split(';', 4)[3]);
        }
        ((function (e) {
          ((e.push = 'push'), (e.replace = 'replace'));
        })(n || (n = {})),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      34211: (e, t) => {
        'use strict';
        function r(e) {
          return Array.isArray(e) ? e[1] : e;
        }
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'getSegmentValue', {
            enumerable: !0,
            get: function () {
              return r;
            },
          }),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      75606: (e, t, r) => {
        'use strict';
        e.exports = r(34701).vendored.contexts.AppRouterContext;
      },
      73847: (e, t, r) => {
        'use strict';
        e.exports = r(34701).vendored.contexts.HooksClientContext;
      },
      54344: (e, t, r) => {
        'use strict';
        e.exports = r(34701).vendored.contexts.ServerInsertedHtml;
      },
      5293: (e, t) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            NEXT_DYNAMIC_NO_SSR_CODE: function () {
              return r;
            },
            throwWithNoSSR: function () {
              return n;
            },
          }));
        let r = 'NEXT_DYNAMIC_NO_SSR_CODE';
        function n() {
          let e = Error(r);
          throw ((e.digest = r), e);
        }
      },
      75696: (e, t, r) => {
        e.exports = r(11852);
      },
      23299: (e, t, r) => {
        'use strict';
        function n(e) {
          return e && e.__esModule ? e : { default: e };
        }
        (r.r(t), r.d(t, { _: () => n, _interop_require_default: () => n }));
      },
    }));
  var t = require('../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    n = t.X(0, [775, 204], () => r(73203));
  module.exports = n;
})();
