(() => {
  var e = {};
  ((e.id = 385),
    (e.ids = [385]),
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
      49500: (e, s, t) => {
        'use strict';
        (t.r(s),
          t.d(s, {
            GlobalError: () => i.a,
            __next_app__: () => m,
            originalPathname: () => u,
            pages: () => c,
            routeModule: () => p,
            tree: () => d,
          }));
        var r = t(34701),
          a = t(36844),
          n = t(17688),
          i = t.n(n),
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
        t.d(s, l);
        let d = [
            '',
            {
              children: [
                'privacy',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(t.bind(t, 80883)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/privacy/page.tsx',
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
          c = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/privacy/page.tsx',
          ],
          u = '/privacy/page',
          m = { require: t, loadChunk: () => Promise.resolve() },
          p = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: '/privacy/page',
              pathname: '/privacy',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      72103: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 78597));
      },
      41741: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 85555));
      },
      48995: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 11417));
      },
      40088: (e, s, t) => {
        Promise.resolve().then(t.bind(t, 40321));
      },
      55885: (e, s, t) => {
        (Promise.resolve().then(t.t.bind(t, 55440, 23)),
          Promise.resolve().then(t.t.bind(t, 93643, 23)),
          Promise.resolve().then(t.t.bind(t, 27905, 23)),
          Promise.resolve().then(t.t.bind(t, 89875, 23)),
          Promise.resolve().then(t.t.bind(t, 90237, 23)),
          Promise.resolve().then(t.t.bind(t, 19576, 23)));
      },
      9708: () => {},
      78597: (e, s, t) => {
        'use strict';
        (t.r(s), t.d(s, { default: () => u }));
        var r = t(12363),
          a = t(3299),
          n = t.n(a),
          i = t(68144),
          o = t(81407),
          l = t(32769),
          d = t(39222),
          c = t(73793);
        function u({ error: e, reset: s }) {
          let { data: t, status: a } = (0, d.useSession)();
          return (
            (0, r.useEffect)(() => {
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
                        onClick: () => s(),
                        variant: 'outline',
                        className: 'flex items-center gap-2',
                        children: [
                          c.jsx(o.Z, { className: 'h-4 w-4' }),
                          'Tentar novamente',
                        ],
                      }),
                      c.jsx(n(), {
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
      85555: (e, s, t) => {
        'use strict';
        (t.r(s), t.d(s, { default: () => a }));
        var r = t(73793);
        function a() {
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
      11417: (e, s, t) => {
        'use strict';
        (t.r(s), t.d(s, { default: () => m }));
        var r = t(39222),
          a = t(3299),
          n = t.n(a),
          i = t(68144),
          o = t(81407),
          l = t(32769),
          d = t(12363),
          c = t(49026),
          u = t(73793);
        function m() {
          let { data: e, status: s } = (0, r.useSession)();
          (0, c.t)();
          let { 0: t, 1: a } = (0, d.useState)(!1);
          return ((0, d.useEffect)(() => {
            a(!0);
          }, []),
          t)
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
                        u.jsx(n(), {
                          href: 'authenticated' === s ? '/dashboard' : '/',
                          children: (0, u.jsxs)(i.z, {
                            className: 'flex items-center gap-2',
                            children: [
                              u.jsx(l.Z, { className: 'h-4 w-4' }),
                              'authenticated' === s
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
      40321: (e, s, t) => {
        'use strict';
        (t.r(s), t.d(s, { PrivacyContent: () => n }));
        var r = t(28285),
          a = t(73793);
        function n() {
          return (0, a.jsxs)('div', {
            className: 'w-full px-4 lg:px-8 py-6',
            children: [
              (0, a.jsxs)('div', {
                className: 'mb-8',
                children: [
                  a.jsx('h1', {
                    className: 'text-xl font-semibold',
                    children: 'Pol\xedtica de Privacidade',
                  }),
                  a.jsx('p', {
                    className: 'text-muted-foreground',
                    children:
                      'Como coletamos, usamos e protegemos seus dados pessoais',
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Informa\xe7\xf5es que Coletamos',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Coletamos informa\xe7\xf5es pessoais, financeiras e t\xe9cnicas para oferecer nossos servi\xe7os.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children:
                              'Nome completo, email e prefer\xeancias de notifica\xe7\xe3o',
                          }),
                          a.jsx('li', {
                            children:
                              'Informa\xe7\xf5es financeiras fornecidas voluntariamente',
                          }),
                          a.jsx('li', {
                            children:
                              'Dados t\xe9cnicos como endere\xe7o IP e logs de acesso',
                          }),
                          a.jsx('li', {
                            children:
                              'Dados de transa\xe7\xf5es banc\xe1rias integradas via Open Finance',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Como Usamos Seus Dados',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Utilizamos seus dados para personalizar sua experi\xeancia, garantir seguran\xe7a e melhorar nossos servi\xe7os.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children:
                              'Presta\xe7\xe3o de servi\xe7os financeiros personalizados',
                          }),
                          a.jsx('li', {
                            children:
                              'Autentica\xe7\xe3o e seguran\xe7a da conta',
                          }),
                          a.jsx('li', {
                            children:
                              'Comunica\xe7\xe3o sobre atualiza\xe7\xf5es importantes',
                          }),
                          a.jsx('li', {
                            children:
                              'Gera\xe7\xe3o de insights financeiros e relat\xf3rios',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Prote\xe7\xe3o de Dados',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Implementamos medidas t\xe9cnicas e organizacionais para proteger suas informa\xe7\xf5es.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children:
                              'Criptografia de dados sens\xedveis em tr\xe2nsito e em repouso',
                          }),
                          a.jsx('li', {
                            children: 'Auditorias regulares de seguran\xe7a',
                          }),
                          a.jsx('li', {
                            children:
                              'Controle de acesso baseado em pap\xe9is (RBAC)',
                          }),
                          a.jsx('li', {
                            children:
                              'Detec\xe7\xe3o e resposta a incidentes de seguran\xe7a',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Compartilhamento de Dados',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Compartilhamos seus dados apenas quando necess\xe1rio e autorizado.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children:
                              'Prestadores de servi\xe7o com contratos r\xedgidos',
                          }),
                          a.jsx('li', {
                            children:
                              'Obriga\xe7\xf5es legais e regulat\xf3rias',
                          }),
                          a.jsx('li', {
                            children:
                              'Preven\xe7\xe3o de fraudes e seguran\xe7a',
                          }),
                          a.jsx('li', {
                            children:
                              'Transa\xe7\xf5es financeiras autorizadas pelo usu\xe1rio',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Direitos do Usu\xe1rio',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Voc\xea tem os seguintes direitos sob a LGPD:',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', { children: 'Acesso aos seus dados' }),
                          a.jsx('li', {
                            children: 'Corre\xe7\xe3o de informa\xe7\xf5es',
                          }),
                          a.jsx('li', {
                            children: 'Exclus\xe3o de dados pessoais',
                          }),
                          a.jsx('li', { children: 'Portabilidade de dados' }),
                          a.jsx('li', {
                            children: 'Revoga\xe7\xe3o de consentimento',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Reten\xe7\xe3o de Dados',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Mantemos seus dados apenas pelo tempo necess\xe1rio para cumprir nossas obriga\xe7\xf5es legais e contratuais.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children: 'Dados da conta: enquanto ativa',
                          }),
                          a.jsx('li', {
                            children: 'Dados financeiros: 5 anos',
                          }),
                          a.jsx('li', {
                            children: 'Logs de seguran\xe7a: 1 ano',
                          }),
                          a.jsx('li', {
                            children:
                              'Dados de marketing: at\xe9 revoga\xe7\xe3o do consentimento',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)(r.Zb, {
                className: 'mb-8 shadow-md',
                children: [
                  a.jsx(r.Ol, {
                    children: a.jsx(r.ll, {
                      className: 'text-lg font-medium flex items-center gap-2',
                      children: 'Conformidade com a LGPD',
                    }),
                  }),
                  (0, a.jsxs)(r.aY, {
                    className: 'space-y-4',
                    children: [
                      a.jsx('p', {
                        className: 'text-sm text-muted-foreground',
                        children:
                          'Estamos comprometidos com a conformidade com a LGPD e outras regulamenta\xe7\xf5es aplic\xe1veis.',
                      }),
                      (0, a.jsxs)('ul', {
                        className:
                          'list-disc list-inside space-y-1 text-muted-foreground',
                        children: [
                          a.jsx('li', {
                            children:
                              'Consentimento expl\xedcito para coleta e uso de dados',
                          }),
                          a.jsx('li', {
                            children: 'Minimiza\xe7\xe3o de dados coletados',
                          }),
                          a.jsx('li', {
                            children:
                              'Transpar\xeancia nas pr\xe1ticas de dados',
                          }),
                          a.jsx('li', {
                            children:
                              'Relat\xf3rios de auditoria dispon\xedveis mediante solicita\xe7\xe3o',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
        }
      },
      68144: (e, s, t) => {
        'use strict';
        t.d(s, { z: () => u });
        var r = t(12363),
          a = t(67031),
          n = t(57630),
          i = t(24662),
          o = t(73793);
        let l = ['className', 'variant', 'size', 'asChild'];
        function d(e, s) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            (s &&
              (r = r.filter(function (s) {
                return Object.getOwnPropertyDescriptor(e, s).enumerable;
              })),
              t.push.apply(t, r));
          }
          return t;
        }
        let c = (0, n.j)(
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
          u = r.forwardRef((e, s) => {
            let { className: t, variant: r, size: n, asChild: u = !1 } = e,
              m = (function (e, s) {
                if (null == e) return {};
                var t,
                  r,
                  a = (function (e, s) {
                    if (null == e) return {};
                    var t,
                      r,
                      a = {},
                      n = Object.keys(e);
                    for (r = 0; r < n.length; r++)
                      ((t = n[r]), s.indexOf(t) >= 0 || (a[t] = e[t]));
                    return a;
                  })(e, s);
                if (Object.getOwnPropertySymbols) {
                  var n = Object.getOwnPropertySymbols(e);
                  for (r = 0; r < n.length; r++)
                    ((t = n[r]),
                      !(s.indexOf(t) >= 0) &&
                        Object.prototype.propertyIsEnumerable.call(e, t) &&
                        (a[t] = e[t]));
                }
                return a;
              })(e, l),
              p = u ? a.g7 : 'button';
            return o.jsx(
              p,
              (function (e) {
                for (var s = 1; s < arguments.length; s++) {
                  var t = null != arguments[s] ? arguments[s] : {};
                  s % 2
                    ? d(Object(t), !0).forEach(function (s) {
                        var r, a;
                        ((r = s),
                          (a = t[s]),
                          (r = (function (e) {
                            var s = (function (e, s) {
                              if ('object' != typeof e || null === e) return e;
                              var t = e[Symbol.toPrimitive];
                              if (void 0 !== t) {
                                var r = t.call(e, s || 'default');
                                if ('object' != typeof r) return r;
                                throw TypeError(
                                  '@@toPrimitive must return a primitive value.'
                                );
                              }
                              return ('string' === s ? String : Number)(e);
                            })(e, 'string');
                            return 'symbol' == typeof s ? s : String(s);
                          })(r)) in e
                            ? Object.defineProperty(e, r, {
                                value: a,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0,
                              })
                            : (e[r] = a));
                      })
                    : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(t)
                        )
                      : d(Object(t)).forEach(function (s) {
                          Object.defineProperty(
                            e,
                            s,
                            Object.getOwnPropertyDescriptor(t, s)
                          );
                        });
                }
                return e;
              })(
                {
                  className: (0, i.cn)(
                    c({ variant: r, size: n, className: t })
                  ),
                  ref: s,
                },
                m
              )
            );
          });
        u.displayName = 'Button';
      },
      28285: (e, s, t) => {
        'use strict';
        t.d(s, {
          Ol: () => b,
          SZ: () => h,
          Zb: () => f,
          aY: () => j,
          ll: () => g,
        });
        var r = t(12363),
          a = t(24662),
          n = t(73793);
        let i = ['className'],
          o = ['className'],
          l = ['className'],
          d = ['className'],
          c = ['className'],
          u = ['className'];
        function m(e, s) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            (s &&
              (r = r.filter(function (s) {
                return Object.getOwnPropertyDescriptor(e, s).enumerable;
              })),
              t.push.apply(t, r));
          }
          return t;
        }
        function p(e) {
          for (var s = 1; s < arguments.length; s++) {
            var t = null != arguments[s] ? arguments[s] : {};
            s % 2
              ? m(Object(t), !0).forEach(function (s) {
                  var r, a;
                  ((r = s),
                    (a = t[s]),
                    (r = (function (e) {
                      var s = (function (e, s) {
                        if ('object' != typeof e || null === e) return e;
                        var t = e[Symbol.toPrimitive];
                        if (void 0 !== t) {
                          var r = t.call(e, s || 'default');
                          if ('object' != typeof r) return r;
                          throw TypeError(
                            '@@toPrimitive must return a primitive value.'
                          );
                        }
                        return ('string' === s ? String : Number)(e);
                      })(e, 'string');
                      return 'symbol' == typeof s ? s : String(s);
                    })(r)) in e
                      ? Object.defineProperty(e, r, {
                          value: a,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[r] = a));
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(t)
                  )
                : m(Object(t)).forEach(function (s) {
                    Object.defineProperty(
                      e,
                      s,
                      Object.getOwnPropertyDescriptor(t, s)
                    );
                  });
          }
          return e;
        }
        function x(e, s) {
          if (null == e) return {};
          var t,
            r,
            a = (function (e, s) {
              if (null == e) return {};
              var t,
                r,
                a = {},
                n = Object.keys(e);
              for (r = 0; r < n.length; r++)
                ((t = n[r]), s.indexOf(t) >= 0 || (a[t] = e[t]));
              return a;
            })(e, s);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            for (r = 0; r < n.length; r++)
              ((t = n[r]),
                !(s.indexOf(t) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(e, t) &&
                  (a[t] = e[t]));
          }
          return a;
        }
        let f = r.forwardRef((e, s) => {
          let { className: t } = e,
            r = x(e, i);
          return n.jsx(
            'div',
            p(
              {
                ref: s,
                className: (0, a.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  t
                ),
              },
              r
            )
          );
        });
        f.displayName = 'Card';
        let b = r.forwardRef((e, s) => {
          let { className: t } = e,
            r = x(e, o);
          return n.jsx(
            'div',
            p(
              {
                ref: s,
                className: (0, a.cn)('flex flex-col space-y-1.5 p-6', t),
              },
              r
            )
          );
        });
        b.displayName = 'CardHeader';
        let g = r.forwardRef((e, s) => {
          let { className: t } = e,
            r = x(e, l);
          return n.jsx(
            'h3',
            p(
              {
                ref: s,
                className: (0, a.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  t
                ),
              },
              r
            )
          );
        });
        g.displayName = 'CardTitle';
        let h = r.forwardRef((e, s) => {
          let { className: t } = e,
            r = x(e, d);
          return n.jsx(
            'p',
            p(
              {
                ref: s,
                className: (0, a.cn)('text-sm text-muted-foreground', t),
              },
              r
            )
          );
        });
        h.displayName = 'CardDescription';
        let j = r.forwardRef((e, s) => {
          let { className: t } = e,
            r = x(e, c);
          return n.jsx(
            'div',
            p({ ref: s, className: (0, a.cn)('p-6 pt-0', t) }, r)
          );
        });
        ((j.displayName = 'CardContent'),
          (r.forwardRef((e, s) => {
            let { className: t } = e,
              r = x(e, u);
            return n.jsx(
              'div',
              p(
                {
                  ref: s,
                  className: (0, a.cn)('flex items-center p-6 pt-0', t),
                },
                r
              )
            );
          }).displayName = 'CardFooter'));
      },
      49026: (e, s, t) => {
        'use strict';
        t.d(s, { t: () => a });
        var r = t(12363);
        function a() {
          let { 0: e, 1: s } = (0, r.useState)(!1);
          return ((0, r.useEffect)(() => (s(!0), () => s(!1)), []), e);
        }
      },
      24662: (e, s, t) => {
        'use strict';
        t.d(s, { cn: () => n });
        var r = t(32296),
          a = t(94172);
        function n(...e) {
          return (0, a.m6)((0, r.W)(e));
        }
      },
      39269: (e, s, t) => {
        'use strict';
        (t.r(s),
          t.d(s, { $$typeof: () => n, __esModule: () => a, default: () => i }));
        let r = (0, t(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
          ),
          { __esModule: a, $$typeof: n } = r,
          i = r.default;
      },
      36165: () => {
        throw Error(
          'Module build failed (from ../../node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/loader/index.js):\nSyntaxError: "next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict\n    at PluginPass.ImportDeclaration (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/plugins/next-font-unsupported.js:22:33)\n    at n (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:106935)\n    at NodePath._call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21196)\n    at NodePath.call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21020)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22092)\n    at TraversalContext.visitQueue (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15150)\n    at TraversalContext.visitMultiple (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:14751)\n    at TraversalContext.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15421)\n    at traverseNode (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:104193)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22241)'
        );
      },
      83411: (e, s, t) => {
        'use strict';
        (t.r(s),
          t.d(s, { $$typeof: () => n, __esModule: () => a, default: () => i }));
        let r = (0, t(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
          ),
          { __esModule: a, $$typeof: n } = r,
          i = r.default;
      },
      39432: (e, s, t) => {
        'use strict';
        (t.r(s),
          t.d(s, { $$typeof: () => n, __esModule: () => a, default: () => i }));
        let r = (0, t(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
          ),
          { __esModule: a, $$typeof: n } = r,
          i = r.default;
      },
      80883: (e, s, t) => {
        'use strict';
        (t.r(s), t.d(s, { default: () => c }));
        var r = t(11085),
          a = t(33445);
        let n = (0, a.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/privacy/privacy-content.tsx`
          ),
          { __esModule: i, $$typeof: o } = n;
        n.default;
        let l = (0, a.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/privacy/privacy-content.tsx#PrivacyContent`
        );
        var d = t(65657);
        function c() {
          return d.jsx(r.Suspense, {
            fallback: d.jsx('div', {
              className: 'min-h-screen flex items-center justify-center',
              children: d.jsx('div', {
                className:
                  'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
              }),
            }),
            children: d.jsx(l, {}),
          });
        }
      },
      65657: (e, s, t) => {
        'use strict';
        e.exports = t(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
    }));
  var s = require('../../webpack-runtime.js');
  s.C(e);
  var t = e => s((s.s = e)),
    r = s.X(0, [775, 204], () => t(49500));
  module.exports = r;
})();
