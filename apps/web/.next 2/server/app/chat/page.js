(() => {
  var e = {};
  ((e.id = 929),
    (e.ids = [929]),
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
      18654: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, {
            GlobalError: () => a.a,
            __next_app__: () => p,
            originalPathname: () => d,
            pages: () => u,
            routeModule: () => f,
            tree: () => c,
          }));
        var n = r(34701),
          o = r(36844),
          i = r(17688),
          a = r.n(i),
          s = r(52631),
          l = {};
        for (let e in s)
          0 >
            [
              'default',
              'tree',
              'pages',
              'GlobalError',
              'originalPathname',
              '__next_app__',
              'routeModule',
            ].indexOf(e) && (l[e] = () => s[e]);
        r.d(t, l);
        let c = [
            '',
            {
              children: [
                'chat',
                {
                  children: [
                    '__PAGE__',
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(r.bind(r, 13929)),
                        '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/chat/page.tsx',
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
          u = [
            '/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/chat/page.tsx',
          ],
          d = '/chat/page',
          p = { require: r, loadChunk: () => Promise.resolve() },
          f = new n.AppPageRouteModule({
            definition: {
              kind: o.x.APP_PAGE,
              page: '/chat/page',
              pathname: '/chat',
              bundlePath: '',
              filename: '',
              appPaths: [],
            },
            userland: { loaderTree: c },
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
      18563: (e, t, r) => {
        Promise.resolve().then(r.bind(r, 2546));
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
        (r.r(t), r.d(t, { default: () => d }));
        var n = r(12363),
          o = r(3299),
          i = r.n(o),
          a = r(68144),
          s = r(81407),
          l = r(32769),
          c = r(39222),
          u = r(73793);
        function d({ error: e, reset: t }) {
          let { data: r, status: o } = (0, c.useSession)();
          return (
            (0, n.useEffect)(() => {
              console.error('Erro da aplica\xe7\xe3o:', e);
            }, [e]),
            u.jsx('div', {
              className:
                'min-h-screen flex items-center justify-center bg-gray-50',
              children: (0, u.jsxs)('div', {
                className: 'text-center max-w-lg px-6',
                children: [
                  u.jsx('div', {
                    className: 'mb-6',
                    children: u.jsx('div', {
                      className: 'inline-flex rounded-full bg-red-100 p-4',
                      children: u.jsx('div', {
                        className: 'rounded-full bg-red-200 p-4',
                        children: u.jsx('svg', {
                          xmlns: 'http://www.w3.org/2000/svg',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          strokeWidth: 1.5,
                          stroke: 'currentColor',
                          className: 'h-6 w-6 text-red-600',
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
                    children: 'Algo deu errado',
                  }),
                  u.jsx('p', {
                    className: 'mt-4 text-gray-600',
                    children:
                      'Ocorreu um erro ao tentar carregar esta p\xe1gina.',
                  }),
                  !1,
                  (0, u.jsxs)('div', {
                    className:
                      'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                    children: [
                      (0, u.jsxs)(a.z, {
                        onClick: () => t(),
                        variant: 'outline',
                        className: 'flex items-center gap-2',
                        children: [
                          u.jsx(s.Z, { className: 'h-4 w-4' }),
                          'Tentar novamente',
                        ],
                      }),
                      u.jsx(i(), {
                        href: 'authenticated' === o ? '/dashboard' : '/',
                        children: (0, u.jsxs)(a.z, {
                          className: 'flex items-center gap-2',
                          children: [
                            u.jsx(l.Z, { className: 'h-4 w-4' }),
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
        (r.r(t), r.d(t, { default: () => p }));
        var n = r(39222),
          o = r(3299),
          i = r.n(o),
          a = r(68144),
          s = r(81407),
          l = r(32769),
          c = r(12363),
          u = r(49026),
          d = r(73793);
        function p() {
          let { data: e, status: t } = (0, n.useSession)();
          (0, u.t)();
          let { 0: r, 1: o } = (0, c.useState)(!1);
          return ((0, c.useEffect)(() => {
            o(!0);
          }, []),
          r)
            ? d.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: (0, d.jsxs)('div', {
                  className: 'text-center max-w-lg px-6',
                  children: [
                    d.jsx('div', {
                      className: 'mb-6',
                      children: d.jsx('div', {
                        className: 'inline-flex rounded-full bg-blue-100 p-4',
                        children: d.jsx('div', {
                          className: 'rounded-full bg-blue-200 p-4',
                          children: d.jsx('svg', {
                            xmlns: 'http://www.w3.org/2000/svg',
                            fill: 'none',
                            viewBox: '0 0 24 24',
                            strokeWidth: 1.5,
                            stroke: 'currentColor',
                            className: 'h-6 w-6 text-blue-600',
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
                      children: 'P\xe1gina n\xe3o encontrada',
                    }),
                    d.jsx('p', {
                      className: 'mt-4 text-gray-600',
                      children:
                        'A p\xe1gina que voc\xea est\xe1 procurando n\xe3o existe ou foi movida.',
                    }),
                    (0, d.jsxs)('div', {
                      className:
                        'mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row',
                      children: [
                        (0, d.jsxs)(a.z, {
                          onClick: () => window.history.back(),
                          variant: 'outline',
                          className: 'flex items-center gap-2',
                          children: [
                            d.jsx(s.Z, { className: 'h-4 w-4' }),
                            'Voltar',
                          ],
                        }),
                        d.jsx(i(), {
                          href: 'authenticated' === t ? '/dashboard' : '/',
                          children: (0, d.jsxs)(a.z, {
                            className: 'flex items-center gap-2',
                            children: [
                              d.jsx(l.Z, { className: 'h-4 w-4' }),
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
            : d.jsx('div', {
                className:
                  'min-h-screen flex items-center justify-center bg-gray-50',
                children: d.jsx('div', {
                  className:
                    'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500',
                }),
              });
        }
      },
      2546: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { ChatInterface: () => ew }));
        var n = r(12363),
          o = r(28285),
          i = r(68144),
          a = r(20753),
          s = r(49277),
          l = r(18927),
          c = r(85995),
          u = e => {
            let { present: t, children: r } = e,
              o = (function (e) {
                var t, r;
                let [o, i] = n.useState(),
                  a = n.useRef(null),
                  s = n.useRef(e),
                  l = n.useRef('none'),
                  [u, p] =
                    ((t = e ? 'mounted' : 'unmounted'),
                    (r = {
                      mounted: {
                        UNMOUNT: 'unmounted',
                        ANIMATION_OUT: 'unmountSuspended',
                      },
                      unmountSuspended: {
                        MOUNT: 'mounted',
                        ANIMATION_END: 'unmounted',
                      },
                      unmounted: { MOUNT: 'mounted' },
                    }),
                    n.useReducer((e, t) => r[e][t] ?? e, t));
                return (
                  n.useEffect(() => {
                    let e = d(a.current);
                    l.current = 'mounted' === u ? e : 'none';
                  }, [u]),
                  (0, c.b)(() => {
                    let t = a.current,
                      r = s.current;
                    if (r !== e) {
                      let n = l.current,
                        o = d(t);
                      (e
                        ? p('MOUNT')
                        : 'none' === o || t?.display === 'none'
                          ? p('UNMOUNT')
                          : r && n !== o
                            ? p('ANIMATION_OUT')
                            : p('UNMOUNT'),
                        (s.current = e));
                    }
                  }, [e, p]),
                  (0, c.b)(() => {
                    if (o) {
                      let e;
                      let t = o.ownerDocument.defaultView ?? window,
                        r = r => {
                          let n = d(a.current).includes(
                            CSS.escape(r.animationName)
                          );
                          if (
                            r.target === o &&
                            n &&
                            (p('ANIMATION_END'), !s.current)
                          ) {
                            let r = o.style.animationFillMode;
                            ((o.style.animationFillMode = 'forwards'),
                              (e = t.setTimeout(() => {
                                'forwards' === o.style.animationFillMode &&
                                  (o.style.animationFillMode = r);
                              })));
                          }
                        },
                        n = e => {
                          e.target === o && (l.current = d(a.current));
                        };
                      return (
                        o.addEventListener('animationstart', n),
                        o.addEventListener('animationcancel', r),
                        o.addEventListener('animationend', r),
                        () => {
                          (t.clearTimeout(e),
                            o.removeEventListener('animationstart', n),
                            o.removeEventListener('animationcancel', r),
                            o.removeEventListener('animationend', r));
                        }
                      );
                    }
                    p('ANIMATION_END');
                  }, [o, p]),
                  {
                    isPresent: ['mounted', 'unmountSuspended'].includes(u),
                    ref: n.useCallback(e => {
                      ((a.current = e ? getComputedStyle(e) : null), i(e));
                    }, []),
                  }
                );
              })(t),
              i =
                'function' == typeof r
                  ? r({ present: o.isPresent })
                  : n.Children.only(r),
              a = (0, l.e)(
                o.ref,
                (function (e) {
                  let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
                    r = t && 'isReactWarning' in t && t.isReactWarning;
                  return r
                    ? e.ref
                    : (r =
                          (t = Object.getOwnPropertyDescriptor(
                            e,
                            'ref'
                          )?.get) &&
                          'isReactWarning' in t &&
                          t.isReactWarning)
                      ? e.props.ref
                      : e.props.ref || e.ref;
                })(i)
              );
            return 'function' == typeof r || o.isPresent
              ? n.cloneElement(i, { ref: a })
              : null;
          };
        function d(e) {
          return e?.animationName || 'none';
        }
        u.displayName = 'Presence';
        var p = r(38254),
          f = r(52769),
          m = r(6449),
          b = r(42404),
          v = r(42482),
          g = r(73793);
        let h = ['__scopeScrollArea', 'type', 'dir', 'scrollHideDelay'],
          y = ['__scopeScrollArea', 'children', 'nonce'],
          x = ['forceMount'],
          j = ['forceMount'],
          w = ['forceMount'],
          O = ['forceMount'],
          P = ['orientation'],
          S = ['sizes', 'onSizesChange'],
          N = ['sizes', 'onSizesChange'],
          _ = [
            '__scopeScrollArea',
            'sizes',
            'hasThumb',
            'onThumbChange',
            'onThumbPointerUp',
            'onThumbPointerDown',
            'onThumbPositionChange',
            'onDragScroll',
            'onWheelScroll',
            'onResize',
          ],
          D = ['forceMount'],
          E = ['__scopeScrollArea', 'style'],
          T = ['__scopeScrollArea'];
        function C(e, t) {
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
        function R(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? C(Object(r), !0).forEach(function (t) {
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
                : C(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        function k(e, t) {
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
        }
        var M = 'ScrollArea',
          [A, L] = (0, p.b)(M),
          [I, U] = A(M),
          z = n.forwardRef((e, t) => {
            let {
                __scopeScrollArea: r,
                type: o = 'hover',
                dir: i,
                scrollHideDelay: a = 600,
              } = e,
              c = k(e, h),
              [u, d] = n.useState(null),
              [p, f] = n.useState(null),
              [b, v] = n.useState(null),
              [y, x] = n.useState(null),
              [j, w] = n.useState(null),
              [O, P] = n.useState(0),
              [S, N] = n.useState(0),
              [_, D] = n.useState(!1),
              [E, T] = n.useState(!1),
              C = (0, l.e)(t, e => d(e)),
              M = (0, m.gm)(i);
            return (0, g.jsx)(I, {
              scope: r,
              type: o,
              dir: M,
              scrollHideDelay: a,
              scrollArea: u,
              viewport: p,
              onViewportChange: f,
              content: b,
              onContentChange: v,
              scrollbarX: y,
              onScrollbarXChange: x,
              scrollbarXEnabled: _,
              onScrollbarXEnabledChange: D,
              scrollbarY: j,
              onScrollbarYChange: w,
              scrollbarYEnabled: E,
              onScrollbarYEnabledChange: T,
              onCornerWidthChange: P,
              onCornerHeightChange: N,
              children: (0, g.jsx)(
                s.WV.div,
                R(
                  R({ dir: M }, c),
                  {},
                  {
                    ref: C,
                    style: R(
                      {
                        position: 'relative',
                        '--radix-scroll-area-corner-width': O + 'px',
                        '--radix-scroll-area-corner-height': S + 'px',
                      },
                      e.style
                    ),
                  }
                )
              ),
            });
          });
        z.displayName = M;
        var W = 'ScrollAreaViewport',
          H = n.forwardRef((e, t) => {
            let { __scopeScrollArea: r, children: o, nonce: i } = e,
              a = k(e, y),
              c = U(W, r),
              u = n.useRef(null),
              d = (0, l.e)(t, u, c.onViewportChange);
            return (0, g.jsxs)(g.Fragment, {
              children: [
                (0, g.jsx)('style', {
                  dangerouslySetInnerHTML: {
                    __html:
                      '[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}',
                  },
                  nonce: i,
                }),
                (0, g.jsx)(
                  s.WV.div,
                  R(
                    R({ 'data-radix-scroll-area-viewport': '' }, a),
                    {},
                    {
                      ref: d,
                      style: R(
                        {
                          overflowX: c.scrollbarXEnabled ? 'scroll' : 'hidden',
                          overflowY: c.scrollbarYEnabled ? 'scroll' : 'hidden',
                        },
                        e.style
                      ),
                      children: (0, g.jsx)('div', {
                        ref: c.onContentChange,
                        style: { minWidth: '100%', display: 'table' },
                        children: o,
                      }),
                    }
                  )
                ),
              ],
            });
          });
        H.displayName = W;
        var $ = 'ScrollAreaScrollbar',
          V = n.forwardRef((e, t) => {
            let { forceMount: r } = e,
              o = k(e, x),
              i = U($, e.__scopeScrollArea),
              { onScrollbarXEnabledChange: a, onScrollbarYEnabledChange: s } =
                i,
              l = 'horizontal' === e.orientation;
            return (
              n.useEffect(
                () => (
                  l ? a(!0) : s(!0),
                  () => {
                    l ? a(!1) : s(!1);
                  }
                ),
                [l, a, s]
              ),
              'hover' === i.type
                ? (0, g.jsx)(q, R(R({}, o), {}, { ref: t, forceMount: r }))
                : 'scroll' === i.type
                  ? (0, g.jsx)(F, R(R({}, o), {}, { ref: t, forceMount: r }))
                  : 'auto' === i.type
                    ? (0, g.jsx)(Y, R(R({}, o), {}, { ref: t, forceMount: r }))
                    : 'always' === i.type
                      ? (0, g.jsx)(X, R(R({}, o), {}, { ref: t }))
                      : null
            );
          });
        V.displayName = $;
        var q = n.forwardRef((e, t) => {
            let { forceMount: r } = e,
              o = k(e, j),
              i = U($, e.__scopeScrollArea),
              [a, s] = n.useState(!1);
            return (
              n.useEffect(() => {
                let e = i.scrollArea,
                  t = 0;
                if (e) {
                  let r = () => {
                      (window.clearTimeout(t), s(!0));
                    },
                    n = () => {
                      t = window.setTimeout(() => s(!1), i.scrollHideDelay);
                    };
                  return (
                    e.addEventListener('pointerenter', r),
                    e.addEventListener('pointerleave', n),
                    () => {
                      (window.clearTimeout(t),
                        e.removeEventListener('pointerenter', r),
                        e.removeEventListener('pointerleave', n));
                    }
                  );
                }
              }, [i.scrollArea, i.scrollHideDelay]),
              (0, g.jsx)(u, {
                present: r || a,
                children: (0, g.jsx)(
                  Y,
                  R(
                    R({ 'data-state': a ? 'visible' : 'hidden' }, o),
                    {},
                    { ref: t }
                  )
                ),
              })
            );
          }),
          F = n.forwardRef((e, t) => {
            var r;
            let { forceMount: o } = e,
              i = k(e, w),
              a = U($, e.__scopeScrollArea),
              s = 'horizontal' === e.orientation,
              l = ed(() => d('SCROLL_END'), 100),
              [c, d] =
                ((r = {
                  hidden: { SCROLL: 'scrolling' },
                  scrolling: {
                    SCROLL_END: 'idle',
                    POINTER_ENTER: 'interacting',
                  },
                  interacting: { SCROLL: 'interacting', POINTER_LEAVE: 'idle' },
                  idle: {
                    HIDE: 'hidden',
                    SCROLL: 'scrolling',
                    POINTER_ENTER: 'interacting',
                  },
                }),
                n.useReducer((e, t) => r[e][t] ?? e, 'hidden'));
            return (
              n.useEffect(() => {
                if ('idle' === c) {
                  let e = window.setTimeout(() => d('HIDE'), a.scrollHideDelay);
                  return () => window.clearTimeout(e);
                }
              }, [c, a.scrollHideDelay, d]),
              n.useEffect(() => {
                let e = a.viewport,
                  t = s ? 'scrollLeft' : 'scrollTop';
                if (e) {
                  let r = e[t],
                    n = () => {
                      let n = e[t];
                      (r !== n && (d('SCROLL'), l()), (r = n));
                    };
                  return (
                    e.addEventListener('scroll', n),
                    () => e.removeEventListener('scroll', n)
                  );
                }
              }, [a.viewport, s, d, l]),
              (0, g.jsx)(u, {
                present: o || 'hidden' !== c,
                children: (0, g.jsx)(
                  X,
                  R(
                    R(
                      { 'data-state': 'hidden' === c ? 'hidden' : 'visible' },
                      i
                    ),
                    {},
                    {
                      ref: t,
                      onPointerEnter: (0, v.Mj)(e.onPointerEnter, () =>
                        d('POINTER_ENTER')
                      ),
                      onPointerLeave: (0, v.Mj)(e.onPointerLeave, () =>
                        d('POINTER_LEAVE')
                      ),
                    }
                  )
                ),
              })
            );
          }),
          Y = n.forwardRef((e, t) => {
            let r = U($, e.__scopeScrollArea),
              { forceMount: o } = e,
              i = k(e, O),
              [a, s] = n.useState(!1),
              l = 'horizontal' === e.orientation,
              c = ed(() => {
                if (r.viewport) {
                  let e = r.viewport.offsetWidth < r.viewport.scrollWidth,
                    t = r.viewport.offsetHeight < r.viewport.scrollHeight;
                  s(l ? e : t);
                }
              }, 10);
            return (
              ep(r.viewport, c),
              ep(r.content, c),
              (0, g.jsx)(u, {
                present: o || a,
                children: (0, g.jsx)(
                  X,
                  R(
                    R({ 'data-state': a ? 'visible' : 'hidden' }, i),
                    {},
                    { ref: t }
                  )
                ),
              })
            );
          }),
          X = n.forwardRef((e, t) => {
            let { orientation: r = 'vertical' } = e,
              o = k(e, P),
              i = U($, e.__scopeScrollArea),
              a = n.useRef(null),
              s = n.useRef(0),
              [l, c] = n.useState({
                content: 0,
                viewport: 0,
                scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
              }),
              u = ea(l.viewport, l.content),
              d = R(
                R({}, o),
                {},
                {
                  sizes: l,
                  onSizesChange: c,
                  hasThumb: !!(u > 0 && u < 1),
                  onThumbChange: e => (a.current = e),
                  onThumbPointerUp: () => (s.current = 0),
                  onThumbPointerDown: e => (s.current = e),
                }
              );
            function p(e, t) {
              return (function (e, t, r, n = 'ltr') {
                let o = es(r),
                  i = t || o / 2,
                  a = r.scrollbar.paddingStart + i,
                  s = r.scrollbar.size - r.scrollbar.paddingEnd - (o - i),
                  l = r.content - r.viewport;
                return ec([a, s], 'ltr' === n ? [0, l] : [-1 * l, 0])(e);
              })(e, s.current, l, t);
            }
            return 'horizontal' === r
              ? (0, g.jsx)(
                  B,
                  R(
                    R({}, d),
                    {},
                    {
                      ref: t,
                      onThumbPositionChange: () => {
                        if (i.viewport && a.current) {
                          let e = el(i.viewport.scrollLeft, l, i.dir);
                          a.current.style.transform = `translate3d(${e}px, 0, 0)`;
                        }
                      },
                      onWheelScroll: e => {
                        i.viewport && (i.viewport.scrollLeft = e);
                      },
                      onDragScroll: e => {
                        i.viewport && (i.viewport.scrollLeft = p(e, i.dir));
                      },
                    }
                  )
                )
              : 'vertical' === r
                ? (0, g.jsx)(
                    Z,
                    R(
                      R({}, d),
                      {},
                      {
                        ref: t,
                        onThumbPositionChange: () => {
                          if (i.viewport && a.current) {
                            let e = el(i.viewport.scrollTop, l);
                            a.current.style.transform = `translate3d(0, ${e}px, 0)`;
                          }
                        },
                        onWheelScroll: e => {
                          i.viewport && (i.viewport.scrollTop = e);
                        },
                        onDragScroll: e => {
                          i.viewport && (i.viewport.scrollTop = p(e));
                        },
                      }
                    )
                  )
                : null;
          }),
          B = n.forwardRef((e, t) => {
            let { sizes: r, onSizesChange: o } = e,
              i = k(e, S),
              a = U($, e.__scopeScrollArea),
              [s, c] = n.useState(),
              u = n.useRef(null),
              d = (0, l.e)(t, u, a.onScrollbarXChange);
            return (
              n.useEffect(() => {
                u.current && c(getComputedStyle(u.current));
              }, [u]),
              (0, g.jsx)(
                K,
                R(
                  R({ 'data-orientation': 'horizontal' }, i),
                  {},
                  {
                    ref: d,
                    sizes: r,
                    style: R(
                      {
                        bottom: 0,
                        left:
                          'rtl' === a.dir
                            ? 'var(--radix-scroll-area-corner-width)'
                            : 0,
                        right:
                          'ltr' === a.dir
                            ? 'var(--radix-scroll-area-corner-width)'
                            : 0,
                        '--radix-scroll-area-thumb-width': es(r) + 'px',
                      },
                      e.style
                    ),
                    onThumbPointerDown: t => e.onThumbPointerDown(t.x),
                    onDragScroll: t => e.onDragScroll(t.x),
                    onWheelScroll: (t, r) => {
                      if (a.viewport) {
                        let n = a.viewport.scrollLeft + t.deltaX;
                        (e.onWheelScroll(n),
                          (function (e, t) {
                            return e > 0 && e < t;
                          })(n, r) && t.preventDefault());
                      }
                    },
                    onResize: () => {
                      u.current &&
                        a.viewport &&
                        s &&
                        o({
                          content: a.viewport.scrollWidth,
                          viewport: a.viewport.offsetWidth,
                          scrollbar: {
                            size: u.current.clientWidth,
                            paddingStart: ei(s.paddingLeft),
                            paddingEnd: ei(s.paddingRight),
                          },
                        });
                    },
                  }
                )
              )
            );
          }),
          Z = n.forwardRef((e, t) => {
            let { sizes: r, onSizesChange: o } = e,
              i = k(e, N),
              a = U($, e.__scopeScrollArea),
              [s, c] = n.useState(),
              u = n.useRef(null),
              d = (0, l.e)(t, u, a.onScrollbarYChange);
            return (
              n.useEffect(() => {
                u.current && c(getComputedStyle(u.current));
              }, [u]),
              (0, g.jsx)(
                K,
                R(
                  R({ 'data-orientation': 'vertical' }, i),
                  {},
                  {
                    ref: d,
                    sizes: r,
                    style: R(
                      {
                        top: 0,
                        right: 'ltr' === a.dir ? 0 : void 0,
                        left: 'rtl' === a.dir ? 0 : void 0,
                        bottom: 'var(--radix-scroll-area-corner-height)',
                        '--radix-scroll-area-thumb-height': es(r) + 'px',
                      },
                      e.style
                    ),
                    onThumbPointerDown: t => e.onThumbPointerDown(t.y),
                    onDragScroll: t => e.onDragScroll(t.y),
                    onWheelScroll: (t, r) => {
                      if (a.viewport) {
                        let n = a.viewport.scrollTop + t.deltaY;
                        (e.onWheelScroll(n),
                          (function (e, t) {
                            return e > 0 && e < t;
                          })(n, r) && t.preventDefault());
                      }
                    },
                    onResize: () => {
                      u.current &&
                        a.viewport &&
                        s &&
                        o({
                          content: a.viewport.scrollHeight,
                          viewport: a.viewport.offsetHeight,
                          scrollbar: {
                            size: u.current.clientHeight,
                            paddingStart: ei(s.paddingTop),
                            paddingEnd: ei(s.paddingBottom),
                          },
                        });
                    },
                  }
                )
              )
            );
          }),
          [G, J] = A($),
          K = n.forwardRef((e, t) => {
            let {
                __scopeScrollArea: r,
                sizes: o,
                hasThumb: i,
                onThumbChange: a,
                onThumbPointerUp: c,
                onThumbPointerDown: u,
                onThumbPositionChange: d,
                onDragScroll: p,
                onWheelScroll: m,
                onResize: b,
              } = e,
              h = k(e, _),
              y = U($, r),
              [x, j] = n.useState(null),
              w = (0, l.e)(t, e => j(e)),
              O = n.useRef(null),
              P = n.useRef(''),
              S = y.viewport,
              N = o.content - o.viewport,
              D = (0, f.W)(m),
              E = (0, f.W)(d),
              T = ed(b, 10);
            function C(e) {
              O.current &&
                p({
                  x: e.clientX - O.current.left,
                  y: e.clientY - O.current.top,
                });
            }
            return (
              n.useEffect(() => {
                let e = e => {
                  let t = e.target;
                  x?.contains(t) && D(e, N);
                };
                return (
                  document.addEventListener('wheel', e, { passive: !1 }),
                  () =>
                    document.removeEventListener('wheel', e, { passive: !1 })
                );
              }, [S, x, N, D]),
              n.useEffect(E, [o, E]),
              ep(x, T),
              ep(y.content, T),
              (0, g.jsx)(G, {
                scope: r,
                scrollbar: x,
                hasThumb: i,
                onThumbChange: (0, f.W)(a),
                onThumbPointerUp: (0, f.W)(c),
                onThumbPositionChange: E,
                onThumbPointerDown: (0, f.W)(u),
                children: (0, g.jsx)(
                  s.WV.div,
                  R(
                    R({}, h),
                    {},
                    {
                      ref: w,
                      style: R({ position: 'absolute' }, h.style),
                      onPointerDown: (0, v.Mj)(e.onPointerDown, e => {
                        0 === e.button &&
                          (e.target.setPointerCapture(e.pointerId),
                          (O.current = x.getBoundingClientRect()),
                          (P.current = document.body.style.webkitUserSelect),
                          (document.body.style.webkitUserSelect = 'none'),
                          y.viewport &&
                            (y.viewport.style.scrollBehavior = 'auto'),
                          C(e));
                      }),
                      onPointerMove: (0, v.Mj)(e.onPointerMove, C),
                      onPointerUp: (0, v.Mj)(e.onPointerUp, e => {
                        let t = e.target;
                        (t.hasPointerCapture(e.pointerId) &&
                          t.releasePointerCapture(e.pointerId),
                          (document.body.style.webkitUserSelect = P.current),
                          y.viewport && (y.viewport.style.scrollBehavior = ''),
                          (O.current = null));
                      }),
                    }
                  )
                ),
              })
            );
          }),
          Q = 'ScrollAreaThumb',
          ee = n.forwardRef((e, t) => {
            let { forceMount: r } = e,
              n = k(e, D),
              o = J(Q, e.__scopeScrollArea);
            return (0, g.jsx)(u, {
              present: r || o.hasThumb,
              children: (0, g.jsx)(et, R({ ref: t }, n)),
            });
          }),
          et = n.forwardRef((e, t) => {
            let { __scopeScrollArea: r, style: o } = e,
              i = k(e, E),
              a = U(Q, r),
              c = J(Q, r),
              { onThumbPositionChange: u } = c,
              d = (0, l.e)(t, e => c.onThumbChange(e)),
              p = n.useRef(void 0),
              f = ed(() => {
                p.current && (p.current(), (p.current = void 0));
              }, 100);
            return (
              n.useEffect(() => {
                let e = a.viewport;
                if (e) {
                  let t = () => {
                    if ((f(), !p.current)) {
                      let t = eu(e, u);
                      ((p.current = t), u());
                    }
                  };
                  return (
                    u(),
                    e.addEventListener('scroll', t),
                    () => e.removeEventListener('scroll', t)
                  );
                }
              }, [a.viewport, f, u]),
              (0, g.jsx)(
                s.WV.div,
                R(
                  R({ 'data-state': c.hasThumb ? 'visible' : 'hidden' }, i),
                  {},
                  {
                    ref: d,
                    style: R(
                      {
                        width: 'var(--radix-scroll-area-thumb-width)',
                        height: 'var(--radix-scroll-area-thumb-height)',
                      },
                      o
                    ),
                    onPointerDownCapture: (0, v.Mj)(
                      e.onPointerDownCapture,
                      e => {
                        let t = e.target.getBoundingClientRect(),
                          r = e.clientX - t.left,
                          n = e.clientY - t.top;
                        c.onThumbPointerDown({ x: r, y: n });
                      }
                    ),
                    onPointerUp: (0, v.Mj)(e.onPointerUp, c.onThumbPointerUp),
                  }
                )
              )
            );
          });
        ee.displayName = Q;
        var er = 'ScrollAreaCorner',
          en = n.forwardRef((e, t) => {
            let r = U(er, e.__scopeScrollArea),
              n = !!(r.scrollbarX && r.scrollbarY);
            return 'scroll' !== r.type && n
              ? (0, g.jsx)(eo, R(R({}, e), {}, { ref: t }))
              : null;
          });
        en.displayName = er;
        var eo = n.forwardRef((e, t) => {
          let { __scopeScrollArea: r } = e,
            o = k(e, T),
            i = U(er, r),
            [a, l] = n.useState(0),
            [c, u] = n.useState(0),
            d = !!(a && c);
          return (
            ep(i.scrollbarX, () => {
              let e = i.scrollbarX?.offsetHeight || 0;
              (i.onCornerHeightChange(e), u(e));
            }),
            ep(i.scrollbarY, () => {
              let e = i.scrollbarY?.offsetWidth || 0;
              (i.onCornerWidthChange(e), l(e));
            }),
            d
              ? (0, g.jsx)(
                  s.WV.div,
                  R(
                    R({}, o),
                    {},
                    {
                      ref: t,
                      style: R(
                        {
                          width: a,
                          height: c,
                          position: 'absolute',
                          right: 'ltr' === i.dir ? 0 : void 0,
                          left: 'rtl' === i.dir ? 0 : void 0,
                          bottom: 0,
                        },
                        e.style
                      ),
                    }
                  )
                )
              : null
          );
        });
        function ei(e) {
          return e ? parseInt(e, 10) : 0;
        }
        function ea(e, t) {
          let r = e / t;
          return isNaN(r) ? 0 : r;
        }
        function es(e) {
          let t = ea(e.viewport, e.content),
            r = e.scrollbar.paddingStart + e.scrollbar.paddingEnd;
          return Math.max((e.scrollbar.size - r) * t, 18);
        }
        function el(e, t, r = 'ltr') {
          let n = es(t),
            o = t.scrollbar.paddingStart + t.scrollbar.paddingEnd,
            i = t.scrollbar.size - o,
            a = t.content - t.viewport,
            s = (0, b.u)(e, 'ltr' === r ? [0, a] : [-1 * a, 0]);
          return ec([0, a], [0, i - n])(s);
        }
        function ec(e, t) {
          return r => {
            if (e[0] === e[1] || t[0] === t[1]) return t[0];
            let n = (t[1] - t[0]) / (e[1] - e[0]);
            return t[0] + n * (r - e[0]);
          };
        }
        var eu = (e, t = () => {}) => {
          let r = { left: e.scrollLeft, top: e.scrollTop },
            n = 0;
          return (
            (function o() {
              let i = { left: e.scrollLeft, top: e.scrollTop },
                a = r.left !== i.left,
                s = r.top !== i.top;
              ((a || s) && t(), (r = i), (n = window.requestAnimationFrame(o)));
            })(),
            () => window.cancelAnimationFrame(n)
          );
        };
        function ed(e, t) {
          let r = (0, f.W)(e),
            o = n.useRef(0);
          return (
            n.useEffect(() => () => window.clearTimeout(o.current), []),
            n.useCallback(() => {
              (window.clearTimeout(o.current),
                (o.current = window.setTimeout(r, t)));
            }, [r, t])
          );
        }
        function ep(e, t) {
          let r = (0, f.W)(t);
          (0, c.b)(() => {
            let t = 0;
            if (e) {
              let n = new ResizeObserver(() => {
                (cancelAnimationFrame(t),
                  (t = window.requestAnimationFrame(r)));
              });
              return (
                n.observe(e),
                () => {
                  (window.cancelAnimationFrame(t), n.unobserve(e));
                }
              );
            }
          }, [e, r]);
        }
        var ef = r(24662);
        let em = ['className', 'children'],
          eb = ['className', 'orientation'];
        function ev(e, t) {
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
        function eg(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? ev(Object(r), !0).forEach(function (t) {
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
                : ev(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        function eh(e, t) {
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
        }
        let ey = n.forwardRef((e, t) => {
          let { className: r, children: n } = e,
            o = eh(e, em);
          return (0, g.jsxs)(
            z,
            eg(
              eg(
                {
                  ref: t,
                  className: (0, ef.cn)('relative overflow-hidden', r),
                },
                o
              ),
              {},
              {
                children: [
                  g.jsx(H, {
                    className: 'h-full w-full rounded-[inherit]',
                    children: n,
                  }),
                  g.jsx(ex, {}),
                  g.jsx(en, {}),
                ],
              }
            )
          );
        });
        ey.displayName = z.displayName;
        let ex = n.forwardRef((e, t) => {
          let { className: r, orientation: n = 'vertical' } = e,
            o = eh(e, eb);
          return g.jsx(
            V,
            eg(
              eg(
                {
                  ref: t,
                  orientation: n,
                  className: (0, ef.cn)(
                    'flex touch-none select-none transition-colors',
                    'vertical' === n &&
                      'h-full w-2.5 border-l border-l-transparent p-[1px]',
                    'horizontal' === n &&
                      'h-2.5 border-t border-t-transparent p-[1px]',
                    r
                  ),
                },
                o
              ),
              {},
              {
                children: g.jsx(ee, {
                  className: 'relative flex-1 rounded-full bg-border',
                }),
              }
            )
          );
        });
        ex.displayName = V.displayName;
        var ej = r(23211);
        function ew({ userId: e = 'user-demo', onMessageSent: t }) {
          let { 0: r, 1: s } = (0, n.useState)([
              {
                id: '1',
                type: 'bot',
                content:
                  '\uD83E\uDD16 Ol\xe1! Sou seu assistente financeiro pessoal. Posso ajud\xe1-lo com consultas sobre transa\xe7\xf5es, investimentos, planejamento financeiro e muito mais. Como posso ajud\xe1-lo hoje?',
                timestamp: new Date(),
                metadata: { confidence: 1, source: 'greeting' },
              },
            ]),
            { 0: l, 1: c } = (0, n.useState)(''),
            { 0: u, 1: d } = (0, n.useState)(!1),
            { 0: p, 1: f } = (0, n.useState)(null),
            m = (0, n.useRef)(null),
            b = () => {
              m.current?.scrollIntoView({ behavior: 'smooth' });
            };
          (0, n.useEffect)(() => {
            b();
          }, [r]);
          let v = async e => {
              try {
                let t = await fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: e, sessionId: p }),
                });
                if (!t.ok) {
                  let e = await t.json();
                  throw Error(e.error || 'Failed to process message');
                }
                let r = await t.json();
                return (
                  f(r.sessionId),
                  {
                    id: r.message.id,
                    type: 'bot',
                    content: r.message.content,
                    timestamp: new Date(r.message.timestamp),
                    metadata: {
                      confidence: r.message.metadata?.confidence || 0.8,
                      source: 'ai-agent',
                      processingTime: r.message.metadata?.processingTime || 0,
                    },
                  }
                );
              } catch (e) {
                return (
                  console.error('Error processing message:', e),
                  {
                    id: Date.now().toString(),
                    type: 'bot',
                    content: `❌ Desculpe, ocorreu um erro ao processar sua mensagem: ${e instanceof Error ? e.message : 'Erro desconhecido'}. Tente novamente.`,
                    timestamp: new Date(),
                    metadata: {
                      confidence: 0,
                      source: 'error-handler',
                      processingTime: 0,
                    },
                  }
                );
              }
            },
            h = async () => {
              if (!l.trim() || u) return;
              let e = {
                id: Date.now().toString(),
                type: 'user',
                content: l.trim(),
                timestamp: new Date(),
              };
              s(t => [...t, e]);
              let r = l.trim();
              (c(''), d(!0));
              try {
                let e = await v(r);
                (s(t => [...t, e]), t?.(r));
              } catch (t) {
                let e = {
                  id: (Date.now() + 1).toString(),
                  type: 'bot',
                  content:
                    '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
                  timestamp: new Date(),
                  metadata: { confidence: 0, source: 'error-handler' },
                };
                s(t => [...t, e]);
              } finally {
                d(!1);
              }
            },
            y = e =>
              e.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            x = e =>
              e
                ? e >= 0.8
                  ? 'text-green-600'
                  : e >= 0.6
                    ? 'text-yellow-600'
                    : 'text-red-600'
                : 'text-muted-foreground';
          return (0, g.jsxs)(o.Zb, {
            className: 'flex flex-col h-[600px]',
            children: [
              g.jsx(o.Ol, {
                className: 'pb-3',
                children: (0, g.jsxs)(o.ll, {
                  className: 'flex items-center gap-2',
                  children: [
                    '\uD83E\uDD16 Assistente Financeiro IA',
                    (0, g.jsxs)('span', {
                      className: 'text-sm font-normal text-muted-foreground',
                      children: ['• ', r.length - 1, ' mensagens'],
                    }),
                  ],
                }),
              }),
              (0, g.jsxs)(o.aY, {
                className: 'flex-1 flex flex-col gap-4 p-0',
                children: [
                  g.jsx(ey, {
                    className: 'flex-1 px-4',
                    children: (0, g.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        r.map(e =>
                          g.jsx(
                            'div',
                            {
                              className: `flex ${'user' === e.type ? 'justify-end' : 'justify-start'}`,
                              children: (0, g.jsxs)('div', {
                                className: `max-w-[80%] rounded-lg px-4 py-2 ${'user' === e.type ? 'bg-primary text-primary-foreground' : 'bg-muted'}`,
                                children: [
                                  g.jsx('div', {
                                    className: 'text-sm whitespace-pre-wrap',
                                    children: e.content,
                                  }),
                                  (0, g.jsxs)('div', {
                                    className:
                                      'flex items-center justify-between mt-2 text-xs opacity-70',
                                    children: [
                                      g.jsx('span', {
                                        children: y(e.timestamp),
                                      }),
                                      e.metadata &&
                                        'bot' === e.type &&
                                        (0, g.jsxs)('div', {
                                          className: 'flex items-center gap-2',
                                          children: [
                                            (0, g.jsxs)('span', {
                                              className: x(
                                                e.metadata.confidence
                                              ),
                                              children: [
                                                (
                                                  100 *
                                                  (e.metadata.confidence || 0)
                                                ).toFixed(0),
                                                '%',
                                              ],
                                            }),
                                            e.metadata.processingTime &&
                                              (0, g.jsxs)('span', {
                                                className:
                                                  'text-muted-foreground',
                                                children: [
                                                  e.metadata.processingTime,
                                                  'ms',
                                                ],
                                              }),
                                          ],
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                            },
                            e.id
                          )
                        ),
                        u &&
                          g.jsx('div', {
                            className: 'flex justify-start',
                            children: g.jsx('div', {
                              className:
                                'bg-muted rounded-lg px-4 py-2 max-w-[80%]',
                              children: (0, g.jsxs)('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  g.jsx('div', {
                                    className: 'animate-pulse',
                                    children: '\uD83E\uDD16',
                                  }),
                                  g.jsx('span', {
                                    className: 'text-sm',
                                    children: 'Processando...',
                                  }),
                                  (0, g.jsxs)('div', {
                                    className: 'flex gap-1',
                                    children: [
                                      g.jsx('div', {
                                        className:
                                          'w-1 h-1 bg-current rounded-full animate-bounce',
                                        style: { animationDelay: '0ms' },
                                      }),
                                      g.jsx('div', {
                                        className:
                                          'w-1 h-1 bg-current rounded-full animate-bounce',
                                        style: { animationDelay: '150ms' },
                                      }),
                                      g.jsx('div', {
                                        className:
                                          'w-1 h-1 bg-current rounded-full animate-bounce',
                                        style: { animationDelay: '300ms' },
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          }),
                        g.jsx('div', { ref: m }),
                      ],
                    }),
                  }),
                  g.jsx(ej.Z, {}),
                  (0, g.jsxs)('div', {
                    className: 'p-4',
                    children: [
                      (0, g.jsxs)('div', {
                        className: 'flex gap-2',
                        children: [
                          g.jsx(a.I, {
                            value: l,
                            onChange: e => c(e.target.value),
                            onKeyPress: e => {
                              'Enter' !== e.key ||
                                e.shiftKey ||
                                (e.preventDefault(), h());
                            },
                            placeholder:
                              'Digite sua mensagem sobre finan\xe7as...',
                            disabled: u,
                            className: 'flex-1',
                          }),
                          g.jsx(i.z, {
                            onClick: h,
                            disabled: !l.trim() || u,
                            children: u ? '⏳' : '\uD83D\uDCE4',
                          }),
                        ],
                      }),
                      g.jsx('div', {
                        className: 'mt-2 text-xs text-muted-foreground',
                        children:
                          'Exemplos: "Qual meu saldo?", "Gastos em alimenta\xe7\xe3o", "Como investir R$ 1000?"',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
        }
      },
      68144: (e, t, r) => {
        'use strict';
        r.d(t, { z: () => d });
        var n = r(12363),
          o = r(67031),
          i = r(57630),
          a = r(24662),
          s = r(73793);
        let l = ['className', 'variant', 'size', 'asChild'];
        function c(e, t) {
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
        let u = (0, i.j)(
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
          d = n.forwardRef((e, t) => {
            let { className: r, variant: n, size: i, asChild: d = !1 } = e,
              p = (function (e, t) {
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
              f = d ? o.g7 : 'button';
            return s.jsx(
              f,
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? c(Object(r), !0).forEach(function (t) {
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
                      : c(Object(r)).forEach(function (t) {
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
                  className: (0, a.cn)(
                    u({ variant: n, size: i, className: r })
                  ),
                  ref: t,
                },
                p
              )
            );
          });
        d.displayName = 'Button';
      },
      28285: (e, t, r) => {
        'use strict';
        r.d(t, {
          Ol: () => v,
          SZ: () => h,
          Zb: () => b,
          aY: () => y,
          ll: () => g,
        });
        var n = r(12363),
          o = r(24662),
          i = r(73793);
        let a = ['className'],
          s = ['className'],
          l = ['className'],
          c = ['className'],
          u = ['className'],
          d = ['className'];
        function p(e, t) {
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
        function f(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? p(Object(r), !0).forEach(function (t) {
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
                : p(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        function m(e, t) {
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
        }
        let b = n.forwardRef((e, t) => {
          let { className: r } = e,
            n = m(e, a);
          return i.jsx(
            'div',
            f(
              {
                ref: t,
                className: (0, o.cn)(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  r
                ),
              },
              n
            )
          );
        });
        b.displayName = 'Card';
        let v = n.forwardRef((e, t) => {
          let { className: r } = e,
            n = m(e, s);
          return i.jsx(
            'div',
            f(
              {
                ref: t,
                className: (0, o.cn)('flex flex-col space-y-1.5 p-6', r),
              },
              n
            )
          );
        });
        v.displayName = 'CardHeader';
        let g = n.forwardRef((e, t) => {
          let { className: r } = e,
            n = m(e, l);
          return i.jsx(
            'h3',
            f(
              {
                ref: t,
                className: (0, o.cn)(
                  'text-base font-medium leading-tight tracking-normal',
                  r
                ),
              },
              n
            )
          );
        });
        g.displayName = 'CardTitle';
        let h = n.forwardRef((e, t) => {
          let { className: r } = e,
            n = m(e, c);
          return i.jsx(
            'p',
            f(
              {
                ref: t,
                className: (0, o.cn)('text-sm text-muted-foreground', r),
              },
              n
            )
          );
        });
        h.displayName = 'CardDescription';
        let y = n.forwardRef((e, t) => {
          let { className: r } = e,
            n = m(e, u);
          return i.jsx(
            'div',
            f({ ref: t, className: (0, o.cn)('p-6 pt-0', r) }, n)
          );
        });
        ((y.displayName = 'CardContent'),
          (n.forwardRef((e, t) => {
            let { className: r } = e,
              n = m(e, d);
            return i.jsx(
              'div',
              f(
                {
                  ref: t,
                  className: (0, o.cn)('flex items-center p-6 pt-0', r),
                },
                n
              )
            );
          }).displayName = 'CardFooter'));
      },
      20753: (e, t, r) => {
        'use strict';
        r.d(t, { I: () => l });
        var n = r(12363),
          o = r(24662),
          i = r(73793);
        let a = ['className', 'type'];
        function s(e, t) {
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
        let l = n.forwardRef((e, t) => {
          let { className: r, type: n } = e,
            l = (function (e, t) {
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
            })(e, a);
          return i.jsx(
            'input',
            (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? s(Object(r), !0).forEach(function (t) {
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
                    : s(Object(r)).forEach(function (t) {
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
                type: n,
                className: (0, o.cn)(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  r
                ),
                ref: t,
              },
              l
            )
          );
        });
        l.displayName = 'Input';
      },
      23211: (e, t, r) => {
        'use strict';
        r.d(t, { Z: () => b });
        var n = r(12363),
          o = r(49277),
          i = r(73793);
        let a = ['decorative', 'orientation'];
        function s(e, t) {
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
        function l(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? s(Object(r), !0).forEach(function (t) {
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
                : s(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        var c = 'horizontal',
          u = ['horizontal', 'vertical'],
          d = n.forwardRef((e, t) => {
            let { decorative: r, orientation: n = c } = e,
              s = (function (e, t) {
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
              })(e, a),
              d = u.includes(n) ? n : c;
            return (0, i.jsx)(
              o.WV.div,
              l(
                l(
                  l(
                    { 'data-orientation': d },
                    r
                      ? { role: 'none' }
                      : {
                          'aria-orientation': 'vertical' === d ? d : void 0,
                          role: 'separator',
                        }
                  ),
                  s
                ),
                {},
                { ref: t }
              )
            );
          });
        d.displayName = 'Separator';
        var p = r(24662);
        let f = ['className', 'orientation', 'decorative'];
        function m(e, t) {
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
        let b = n.forwardRef((e, t) => {
          let {
              className: r,
              orientation: n = 'horizontal',
              decorative: o = !0,
            } = e,
            a = (function (e, t) {
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
            })(e, f);
          return i.jsx(
            d,
            (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? m(Object(r), !0).forEach(function (t) {
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
                    : m(Object(r)).forEach(function (t) {
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
                ref: t,
                decorative: o,
                orientation: n,
                className: (0, p.cn)(
                  'shrink-0 bg-border',
                  'horizontal' === n ? 'h-[1px] w-full' : 'h-full w-[1px]',
                  r
                ),
              },
              a
            )
          );
        });
        b.displayName = d.displayName;
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
      13929: (e, t, r) => {
        'use strict';
        (r.r(t), r.d(t, { default: () => c }));
        var n = r(33445);
        let o = (0, n.createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/components/chat/chat-interface.tsx`
          ),
          { __esModule: i, $$typeof: a } = o;
        o.default;
        let s = (0, n.createProxy)(
          String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/components/chat/chat-interface.tsx#ChatInterface`
        );
        var l = r(65657);
        function c() {
          return (0, l.jsxs)('div', {
            className: 'p-8',
            children: [
              l.jsx('h1', {
                className: 'text-2xl font-bold mb-4',
                children: 'Chat IA',
              }),
              l.jsx('p', {
                className: 'text-muted-foreground mb-6',
                children:
                  'Converse com o agente financeiro inteligente para tirar d\xfavidas, pedir an\xe1lises ou recomenda\xe7\xf5es.',
              }),
              l.jsx(s, {}),
            ],
          });
        }
      },
      39269: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => a }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/error.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          a = n.default;
      },
      36165: () => {
        throw Error(
          'Module build failed (from ../../node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/loader/index.js):\nSyntaxError: "next/font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict\n    at PluginPass.ImportDeclaration (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/babel/plugins/next-font-unsupported.js:22:33)\n    at n (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:106935)\n    at NodePath._call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21196)\n    at NodePath.call (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:21020)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22092)\n    at TraversalContext.visitQueue (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15150)\n    at TraversalContext.visitMultiple (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:14751)\n    at TraversalContext.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:15421)\n    at traverseNode (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:104193)\n    at NodePath.visit (/Users/eduesplinio/Documents/financial-ai-agent/node_modules/.pnpm/next@14.0.4_@babel+core@7.28.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/babel/bundle.js:1871:22241)'
        );
      },
      83411: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => a }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/loading.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          a = n.default;
      },
      39432: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, { $$typeof: () => i, __esModule: () => o, default: () => a }));
        let n = (0, r(33445).createProxy)(
            String.raw`/Users/eduesplinio/Documents/financial-ai-agent/apps/web/app/not-found.tsx`
          ),
          { __esModule: o, $$typeof: i } = n,
          a = n.default;
      },
      65657: (e, t, r) => {
        'use strict';
        e.exports = r(34701).vendored['react-rsc'].ReactJsxRuntime;
      },
      42404: (e, t, r) => {
        'use strict';
        function n(e, [t, r]) {
          return Math.min(r, Math.max(t, e));
        }
        r.d(t, { u: () => n });
      },
      42482: (e, t, r) => {
        'use strict';
        function n(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
          return function (n) {
            if ((e?.(n), !1 === r || !n.defaultPrevented)) return t?.(n);
          };
        }
        r.d(t, { Mj: () => n });
      },
      38254: (e, t, r) => {
        'use strict';
        r.d(t, { b: () => l });
        var n = r(12363),
          o = r(73793);
        let i = ['scope', 'children'];
        function a(e, t) {
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
        function s(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? a(Object(r), !0).forEach(function (t) {
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
                : a(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        function l(e, t = []) {
          let r = [],
            a = () => {
              let t = r.map(e => n.createContext(e));
              return function (r) {
                let o = r?.[e] || t;
                return n.useMemo(
                  () => ({ [`__scope${e}`]: s(s({}, r), {}, { [e]: o }) }),
                  [r, o]
                );
              };
            };
          return (
            (a.scopeName = e),
            [
              function (t, a) {
                let s = n.createContext(a),
                  l = r.length;
                r = [...r, a];
                let c = t => {
                  let { scope: r, children: a } = t,
                    c = (function (e, t) {
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
                              Object.prototype.propertyIsEnumerable.call(
                                e,
                                r
                              ) &&
                              (o[r] = e[r]));
                      }
                      return o;
                    })(t, i),
                    u = r?.[e]?.[l] || s,
                    d = n.useMemo(() => c, Object.values(c));
                  return (0, o.jsx)(u.Provider, { value: d, children: a });
                };
                return (
                  (c.displayName = t + 'Provider'),
                  [
                    c,
                    function (r, o) {
                      let i = o?.[e]?.[l] || s,
                        c = n.useContext(i);
                      if (c) return c;
                      if (void 0 !== a) return a;
                      throw Error(`\`${r}\` must be used within \`${t}\``);
                    },
                  ]
                );
              },
              (function (...e) {
                let t = e[0];
                if (1 === e.length) return t;
                let r = () => {
                  let r = e.map(e => ({
                    useScope: e(),
                    scopeName: e.scopeName,
                  }));
                  return function (e) {
                    let o = r.reduce((t, { useScope: r, scopeName: n }) => {
                      let o = r(e)[`__scope${n}`];
                      return s(s({}, t), o);
                    }, {});
                    return n.useMemo(
                      () => ({ [`__scope${t.scopeName}`]: o }),
                      [o]
                    );
                  };
                };
                return ((r.scopeName = t.scopeName), r);
              })(a, ...t),
            ]
          );
        }
      },
      6449: (e, t, r) => {
        'use strict';
        r.d(t, { gm: () => i });
        var n = r(12363);
        r(73793);
        var o = n.createContext(void 0);
        function i(e) {
          let t = n.useContext(o);
          return e || t || 'ltr';
        }
      },
      49277: (e, t, r) => {
        'use strict';
        r.d(t, { WV: () => u, jH: () => d });
        var n = r(12363),
          o = r(46525),
          i = r(67031),
          a = r(73793);
        let s = ['asChild'];
        function l(e, t) {
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
        function c(e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? l(Object(r), !0).forEach(function (t) {
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
                : l(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
          }
          return e;
        }
        var u = [
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
        ].reduce((e, t) => {
          let r = (0, i.Z8)(`Primitive.${t}`),
            o = n.forwardRef((e, n) => {
              let { asChild: o } = e,
                i = (function (e, t) {
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
                })(e, s),
                l = o ? r : t;
              return (0, a.jsx)(l, c(c({}, i), {}, { ref: n }));
            });
          return (
            (o.displayName = `Primitive.${t}`),
            c(c({}, e), {}, { [t]: o })
          );
        }, {});
        function d(e, t) {
          e && o.flushSync(() => e.dispatchEvent(t));
        }
      },
      52769: (e, t, r) => {
        'use strict';
        r.d(t, { W: () => o });
        var n = r(12363);
        function o(e) {
          let t = n.useRef(e);
          return (
            n.useEffect(() => {
              t.current = e;
            }),
            n.useMemo(
              () =>
                (...e) =>
                  t.current?.(...e),
              []
            )
          );
        }
      },
      85995: (e, t, r) => {
        'use strict';
        r.d(t, { b: () => o });
        var n = r(12363),
          o = globalThis?.document ? n.useLayoutEffect : () => {};
      },
    }));
  var t = require('../../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    n = t.X(0, [775, 204], () => r(18654));
  module.exports = n;
})();
