((exports.id = 751),
  (exports.ids = [751]),
  (exports.modules = {
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
      (r.r(t), r.d(t, { default: () => u }));
      var n = r(12363),
        s = r(3299),
        a = r.n(s),
        i = r(68144),
        o = r(81407),
        l = r(32769),
        d = r(39222),
        c = r(73793);
      function u({ error: e, reset: t }) {
        let { data: r, status: s } = (0, d.useSession)();
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
                    c.jsx(a(), {
                      href: 'authenticated' === s ? '/dashboard' : '/',
                      children: (0, c.jsxs)(i.z, {
                        className: 'flex items-center gap-2',
                        children: [
                          c.jsx(l.Z, { className: 'h-4 w-4' }),
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
    85555: (e, t, r) => {
      'use strict';
      (r.r(t), r.d(t, { default: () => s }));
      var n = r(73793);
      function s() {
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
        s = r(3299),
        a = r.n(s),
        i = r(68144),
        o = r(81407),
        l = r(32769),
        d = r(12363),
        c = r(49026),
        u = r(73793);
      function m() {
        let { data: e, status: t } = (0, n.useSession)();
        (0, c.t)();
        let { 0: r, 1: s } = (0, d.useState)(!1);
        return ((0, d.useEffect)(() => {
          s(!0);
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
    59121: (e, t, r) => {
      'use strict';
      (r.r(t), r.d(t, { AuthGuard: () => l }));
      var n = r(39222),
        s = r(69557),
        a = r(12363),
        i = r(49026),
        o = r(73793);
      function l({
        children: e,
        requireAuth: t = !0,
        requiredRole: r,
        fallbackUrl: l = '/auth/signin',
      }) {
        let { data: d, status: c } = (0, n.useSession)(),
          u = (0, s.useRouter)(),
          m = (0, i.t)();
        (0, a.useEffect)(() => {
          if ('loading' !== c) {
            if (!t && 'authenticated' === c) {
              '/dashboard' !== window.location.pathname &&
                u.replace('/dashboard');
              return;
            }
            if (t && 'unauthenticated' === c) {
              window.location.pathname.startsWith('/auth/signin') ||
                u.replace(l);
              return;
            }
            if (
              'authenticated' === c &&
              d &&
              (m && localStorage.setItem('userAuthenticated', 'true'),
              r && d.user.role !== r)
            ) {
              u.push('/dashboard');
              return;
            }
          }
        }, [c, d, t, r, u, l]);
        let { 0: b, 1: x } = (0, a.useState)(!1);
        return (
          (0, a.useEffect)(() => {
            m && x('true' === localStorage.getItem('userAuthenticated'));
          }, [m]),
          (0, o.jsxs)(o.Fragment, {
            children: [
              'loading' === c &&
                !b &&
                (0, o.jsxs)('div', {
                  className:
                    'flex flex-col items-center justify-center min-h-screen',
                  children: [
                    o.jsx('div', {
                      className:
                        'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500',
                    }),
                    o.jsx('p', {
                      className: 'mt-6 text-lg text-gray-600',
                      children: 'Verificando autentica\xe7\xe3o...',
                    }),
                  ],
                }),
              'unauthenticated' === c &&
                t &&
                o.jsx('div', {
                  className:
                    'min-h-screen flex items-center justify-center bg-gray-50',
                  children: (0, o.jsxs)('div', {
                    className: 'text-center',
                    children: [
                      o.jsx('div', {
                        className: 'mb-4',
                        children: o.jsx('svg', {
                          className: 'mx-auto h-12 w-12 text-red-400',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          stroke: 'currentColor',
                          children: o.jsx('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: 2,
                            d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
                          }),
                        }),
                      }),
                      o.jsx('h3', {
                        className: 'text-lg font-medium text-gray-900 mb-2',
                        children: 'Acesso Restrito',
                      }),
                      o.jsx('p', {
                        className: 'text-gray-600 mb-4',
                        children:
                          'Voc\xea precisa estar logado para acessar esta p\xe1gina.',
                      }),
                      o.jsx('button', {
                        onClick: () => u.push('/auth/signin'),
                        className:
                          'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700',
                        children: 'Fazer Login',
                      }),
                    ],
                  }),
                }),
              'authenticated' === c &&
                r &&
                d?.user.role !== r &&
                o.jsx('div', {
                  className:
                    'min-h-screen flex items-center justify-center bg-gray-50',
                  children: (0, o.jsxs)('div', {
                    className: 'text-center',
                    children: [
                      o.jsx('div', {
                        className: 'mb-4',
                        children: o.jsx('svg', {
                          className: 'mx-auto h-12 w-12 text-yellow-400',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          stroke: 'currentColor',
                          children: o.jsx('path', {
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: 2,
                            d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                          }),
                        }),
                      }),
                      o.jsx('h3', {
                        className: 'text-lg font-medium text-gray-900 mb-2',
                        children: 'Acesso Negado',
                      }),
                      (0, o.jsxs)('p', {
                        className: 'text-gray-600 mb-4',
                        children: [
                          'Voc\xea n\xe3o tem permiss\xe3o para acessar esta p\xe1gina.',
                          o.jsx('br', {}),
                          'Permiss\xe3o necess\xe1ria:',
                          ' ',
                          o.jsx('span', {
                            className: 'font-semibold',
                            children: r,
                          }),
                          o.jsx('br', {}),
                          'Sua permiss\xe3o atual:',
                          ' ',
                          o.jsx('span', {
                            className: 'font-semibold',
                            children: d?.user.role,
                          }),
                        ],
                      }),
                      o.jsx('button', {
                        onClick: () => u.push('/dashboard'),
                        className:
                          'bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700',
                        children: 'Voltar ao Dashboard',
                      }),
                    ],
                  }),
                }),
              (('authenticated' === c && (!r || d?.user.role === r)) ||
                ('loading' === c && b && t) ||
                (!t && 'unauthenticated' === c)) &&
                e,
            ],
          })
        );
      }
    },
    68144: (e, t, r) => {
      'use strict';
      r.d(t, { z: () => u });
      var n = r(12363),
        s = r(67031),
        a = r(57630),
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
      let c = (0, a.j)(
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
          let { className: r, variant: n, size: a, asChild: u = !1 } = e,
            m = (function (e, t) {
              if (null == e) return {};
              var r,
                n,
                s = (function (e, t) {
                  if (null == e) return {};
                  var r,
                    n,
                    s = {},
                    a = Object.keys(e);
                  for (n = 0; n < a.length; n++)
                    ((r = a[n]), t.indexOf(r) >= 0 || (s[r] = e[r]));
                  return s;
                })(e, t);
              if (Object.getOwnPropertySymbols) {
                var a = Object.getOwnPropertySymbols(e);
                for (n = 0; n < a.length; n++)
                  ((r = a[n]),
                    !(t.indexOf(r) >= 0) &&
                      Object.prototype.propertyIsEnumerable.call(e, r) &&
                      (s[r] = e[r]));
              }
              return s;
            })(e, l),
            b = u ? s.g7 : 'button';
          return o.jsx(
            b,
            (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? d(Object(r), !0).forEach(function (t) {
                      var n, s;
                      ((n = t),
                        (s = r[t]),
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
                              value: s,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                            })
                          : (e[n] = s));
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
                className: (0, i.cn)(c({ variant: n, size: a, className: r })),
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
      r.d(t, { t: () => s });
      var n = r(12363);
      function s() {
        let { 0: e, 1: t } = (0, n.useState)(!1);
        return ((0, n.useEffect)(() => (t(!0), () => t(!1)), []), e);
      }
    },
    24662: (e, t, r) => {
      'use strict';
      r.d(t, { cn: () => a });
      var n = r(32296),
        s = r(94172);
      function a(...e) {
        return (0, s.m6)((0, n.W)(e));
      }
    },
    39269: (e, t, r) => {
      'use strict';
      (r.r(t),
        r.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
      let n = (0, r(33445).createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
        ),
        { __esModule: s, $$typeof: a } = n,
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
        r.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
      let n = (0, r(33445).createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
        ),
        { __esModule: s, $$typeof: a } = n,
        i = n.default;
    },
    39432: (e, t, r) => {
      'use strict';
      (r.r(t),
        r.d(t, { $$typeof: () => a, __esModule: () => s, default: () => i }));
      let n = (0, r(33445).createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
        ),
        { __esModule: s, $$typeof: a } = n,
        i = n.default;
    },
    12475: (e, t, r) => {
      'use strict';
      r.d(t, { a: () => o });
      var n = r(33445);
      let s = (0, n.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/components/auth/auth-guard.tsx`
        ),
        { __esModule: a, $$typeof: i } = s;
      s.default;
      let o = (0, n.createProxy)(
        String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/components/auth/auth-guard.tsx#AuthGuard`
      );
    },
  }));
