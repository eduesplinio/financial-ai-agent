(() => {
  var e = {};
  ((e.id = 820),
    (e.ids = [820, 660]),
    (e.modules = {
      97176: (e, t, r) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'default', {
            enumerable: !0,
            get: function () {
              return l;
            },
          }));
        let n = r(55248)._(r(16689)),
          o = r(75171);
        async function a(e) {
          let { Component: t, ctx: r } = e;
          return { pageProps: await (0, o.loadGetInitialProps)(t, r) };
        }
        class l extends n.default.Component {
          render() {
            let { Component: e, pageProps: t } = this.props;
            return n.default.createElement(e, t);
          }
        }
        ((l.origGetInitialProps = a),
          (l.getInitialProps = a),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      70684: (e, t, r) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'default', {
            enumerable: !0,
            get: function () {
              return s;
            },
          }));
        let n = r(55248),
          o = n._(r(16689)),
          a = n._(r(98218)),
          l = {
            400: 'Bad Request',
            404: 'This page could not be found',
            405: 'Method Not Allowed',
            500: 'Internal Server Error',
          };
        function i(e) {
          let { res: t, err: r } = e;
          return {
            statusCode:
              t && t.statusCode ? t.statusCode : r ? r.statusCode : 404,
          };
        }
        let u = {
          error: {
            fontFamily:
              'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
            height: '100vh',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
          desc: { lineHeight: '48px' },
          h1: {
            display: 'inline-block',
            margin: '0 20px 0 0',
            paddingRight: 23,
            fontSize: 24,
            fontWeight: 500,
            verticalAlign: 'top',
          },
          h2: { fontSize: 14, fontWeight: 400, lineHeight: '28px' },
          wrap: { display: 'inline-block' },
        };
        class s extends o.default.Component {
          render() {
            let { statusCode: e, withDarkMode: t = !0 } = this.props,
              r =
                this.props.title || l[e] || 'An unexpected error has occurred';
            return o.default.createElement(
              'div',
              { style: u.error },
              o.default.createElement(
                a.default,
                null,
                o.default.createElement(
                  'title',
                  null,
                  e
                    ? e + ': ' + r
                    : 'Application error: a client-side exception has occurred'
                )
              ),
              o.default.createElement(
                'div',
                { style: u.desc },
                o.default.createElement('style', {
                  dangerouslySetInnerHTML: {
                    __html:
                      'body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}' +
                      (t
                        ? '@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}'
                        : ''),
                  },
                }),
                e
                  ? o.default.createElement(
                      'h1',
                      { className: 'next-error-h1', style: u.h1 },
                      e
                    )
                  : null,
                o.default.createElement(
                  'div',
                  { style: u.wrap },
                  o.default.createElement(
                    'h2',
                    { style: u.h2 },
                    this.props.title || e
                      ? r
                      : o.default.createElement(
                          o.default.Fragment,
                          null,
                          'Application error: a client-side exception has occurred (see the browser console for more information)'
                        ),
                    '.'
                  )
                )
              )
            );
          }
        }
        ((s.displayName = 'ErrorPage'),
          (s.getInitialProps = i),
          (s.origGetInitialProps = i),
          ('function' == typeof t.default ||
            ('object' == typeof t.default && null !== t.default)) &&
            void 0 === t.default.__esModule &&
            (Object.defineProperty(t.default, '__esModule', { value: !0 }),
            Object.assign(t.default, t),
            (e.exports = t.default)));
      },
      65812: (e, t) => {
        'use strict';
        function r(e) {
          let {
            ampFirst: t = !1,
            hybrid: r = !1,
            hasQuery: n = !1,
          } = void 0 === e ? {} : e;
          return t || (r && n);
        }
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'isInAmpMode', {
            enumerable: !0,
            get: function () {
              return r;
            },
          }));
      },
      98218: (e, t, r) => {
        'use strict';
        function n(e, t) {
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
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          (function (e, t) {
            for (var r in t)
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
          })(t, {
            defaultHead: function () {
              return d;
            },
            default: function () {
              return g;
            },
          }));
        let o = r(55248),
          a = r(60112)._(r(16689)),
          l = o._(r(69955)),
          i = r(37473),
          u = r(67218),
          s = r(65812);
        function d(e) {
          void 0 === e && (e = !1);
          let t = [a.default.createElement('meta', { charSet: 'utf-8' })];
          return (
            e ||
              t.push(
                a.default.createElement('meta', {
                  name: 'viewport',
                  content: 'width=device-width',
                })
              ),
            t
          );
        }
        function c(e, t) {
          return 'string' == typeof t || 'number' == typeof t
            ? e
            : t.type === a.default.Fragment
              ? e.concat(
                  a.default.Children.toArray(t.props.children).reduce(
                    (e, t) =>
                      'string' == typeof t || 'number' == typeof t
                        ? e
                        : e.concat(t),
                    []
                  )
                )
              : e.concat(t);
        }
        r(95211);
        let f = ['name', 'httpEquiv', 'charSet', 'itemProp'];
        function p(e, t) {
          let { inAmpMode: r } = t;
          return e
            .reduce(c, [])
            .reverse()
            .concat(d(r).reverse())
            .filter(
              (function () {
                let e = new Set(),
                  t = new Set(),
                  r = new Set(),
                  n = {};
                return o => {
                  let a = !0,
                    l = !1;
                  if (
                    o.key &&
                    'number' != typeof o.key &&
                    o.key.indexOf('$') > 0
                  ) {
                    l = !0;
                    let t = o.key.slice(o.key.indexOf('$') + 1);
                    e.has(t) ? (a = !1) : e.add(t);
                  }
                  switch (o.type) {
                    case 'title':
                    case 'base':
                      t.has(o.type) ? (a = !1) : t.add(o.type);
                      break;
                    case 'meta':
                      for (let e = 0, t = f.length; e < t; e++) {
                        let t = f[e];
                        if (o.props.hasOwnProperty(t)) {
                          if ('charSet' === t) r.has(t) ? (a = !1) : r.add(t);
                          else {
                            let e = o.props[t],
                              r = n[t] || new Set();
                            ('name' !== t || !l) && r.has(e)
                              ? (a = !1)
                              : (r.add(e), (n[t] = r));
                          }
                        }
                      }
                  }
                  return a;
                };
              })()
            )
            .reverse()
            .map((e, t) => {
              let o = e.key || t;
              if (
                !r &&
                'link' === e.type &&
                e.props.href &&
                [
                  'https://fonts.googleapis.com/css',
                  'https://use.typekit.net/',
                ].some(t => e.props.href.startsWith(t))
              ) {
                let t = (function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = null != arguments[t] ? arguments[t] : {};
                    t % 2
                      ? n(Object(r), !0).forEach(function (t) {
                          var n, o;
                          ((n = t),
                            (o = r[t]),
                            (n = (function (e) {
                              var t = (function (e, t) {
                                if ('object' != typeof e || null === e)
                                  return e;
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
                        : n(Object(r)).forEach(function (t) {
                            Object.defineProperty(
                              e,
                              t,
                              Object.getOwnPropertyDescriptor(r, t)
                            );
                          });
                  }
                  return e;
                })({}, e.props || {});
                return (
                  (t['data-href'] = t.href),
                  (t.href = void 0),
                  (t['data-optimized-fonts'] = !0),
                  a.default.cloneElement(e, t)
                );
              }
              return a.default.cloneElement(e, { key: o });
            });
        }
        let g = function (e) {
          let { children: t } = e,
            r = (0, a.useContext)(i.AmpStateContext),
            n = (0, a.useContext)(u.HeadManagerContext);
          return a.default.createElement(
            l.default,
            {
              reduceComponentsToState: p,
              headManager: n,
              inAmpMode: (0, s.isInAmpMode)(r),
            },
            t
          );
        };
        ('function' == typeof t.default ||
          ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
      },
      69955: (e, t, r) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'default', {
            enumerable: !0,
            get: function () {
              return l;
            },
          }));
        let n = r(16689),
          o = () => {},
          a = () => {};
        function l(e) {
          var t;
          let { headManager: r, reduceComponentsToState: l } = e;
          function i() {
            if (r && r.mountedInstances) {
              let t = n.Children.toArray(
                Array.from(r.mountedInstances).filter(Boolean)
              );
              r.updateHead(l(t, e));
            }
          }
          return (
            null == r || null == (t = r.mountedInstances) || t.add(e.children),
            i(),
            o(() => {
              var t;
              return (
                null == r ||
                  null == (t = r.mountedInstances) ||
                  t.add(e.children),
                () => {
                  var t;
                  null == r ||
                    null == (t = r.mountedInstances) ||
                    t.delete(e.children);
                }
              );
            }),
            o(
              () => (
                r && (r._pendingUpdate = i),
                () => {
                  r && (r._pendingUpdate = i);
                }
              )
            ),
            a(
              () => (
                r &&
                  r._pendingUpdate &&
                  (r._pendingUpdate(), (r._pendingUpdate = null)),
                () => {
                  r &&
                    r._pendingUpdate &&
                    (r._pendingUpdate(), (r._pendingUpdate = null));
                }
              )
            ),
            null
          );
        }
      },
      95211: (e, t) => {
        'use strict';
        (Object.defineProperty(t, '__esModule', { value: !0 }),
          Object.defineProperty(t, 'warnOnce', {
            enumerable: !0,
            get: function () {
              return r;
            },
          }));
        let r = e => {};
      },
      71077: (e, t) => {
        'use strict';
        Object.defineProperty(t, 'l', {
          enumerable: !0,
          get: function () {
            return function e(t, r) {
              return r in t
                ? t[r]
                : 'then' in t && 'function' == typeof t.then
                  ? t.then(t => e(t, r))
                  : 'function' == typeof t && 'default' === r
                    ? t
                    : void 0;
            };
          },
        });
      },
      77054: (e, t, r) => {
        'use strict';
        (r.r(t),
          r.d(t, {
            config: () => b,
            default: () => c,
            getServerSideProps: () => g,
            getStaticPaths: () => p,
            getStaticProps: () => f,
            reportWebVitals: () => m,
            routeModule: () => O,
            unstable_getServerProps: () => v,
            unstable_getServerSideProps: () => _,
            unstable_getStaticParams: () => P,
            unstable_getStaticPaths: () => h,
            unstable_getStaticProps: () => y,
          }));
        var n = r(71444),
          o = r(91004),
          a = r(71077),
          l = r(94396),
          i = r.n(l),
          u = r(97176),
          s = r.n(u),
          d = r(70684);
        let c = (0, a.l)(d, 'default'),
          f = (0, a.l)(d, 'getStaticProps'),
          p = (0, a.l)(d, 'getStaticPaths'),
          g = (0, a.l)(d, 'getServerSideProps'),
          b = (0, a.l)(d, 'config'),
          m = (0, a.l)(d, 'reportWebVitals'),
          y = (0, a.l)(d, 'unstable_getStaticProps'),
          h = (0, a.l)(d, 'unstable_getStaticPaths'),
          P = (0, a.l)(d, 'unstable_getStaticParams'),
          v = (0, a.l)(d, 'unstable_getServerProps'),
          _ = (0, a.l)(d, 'unstable_getServerSideProps'),
          O = new n.PagesRouteModule({
            definition: {
              kind: o.x.PAGES,
              page: '/_error',
              pathname: '/_error',
              bundlePath: '',
              filename: '',
            },
            components: { App: s(), Document: i() },
            userland: d,
          });
      },
      91004: (e, t) => {
        'use strict';
        var r;
        (Object.defineProperty(t, 'x', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }),
          (function (e) {
            ((e.PAGES = 'PAGES'),
              (e.PAGES_API = 'PAGES_API'),
              (e.APP_PAGE = 'APP_PAGE'),
              (e.APP_ROUTE = 'APP_ROUTE'));
          })(r || (r = {})));
      },
      37473: (e, t, r) => {
        'use strict';
        e.exports = r(71444).vendored.contexts.AmpContext;
      },
      67218: (e, t, r) => {
        'use strict';
        e.exports = r(71444).vendored.contexts.HeadManagerContext;
      },
      62785: e => {
        'use strict';
        e.exports = require('next/dist/compiled/next-server/pages.runtime.prod.js');
      },
      16689: e => {
        'use strict';
        e.exports = require('react');
      },
      71017: e => {
        'use strict';
        e.exports = require('path');
      },
      60112: (e, t) => {
        'use strict';
        function r(e) {
          if ('function' != typeof WeakMap) return null;
          var t = new WeakMap(),
            n = new WeakMap();
          return (r = function (e) {
            return e ? n : t;
          })(e);
        }
        t._ = t._interop_require_wildcard = function (e, t) {
          if (!t && e && e.__esModule) return e;
          if (null === e || ('object' != typeof e && 'function' != typeof e))
            return { default: e };
          var n = r(t);
          if (n && n.has(e)) return n.get(e);
          var o = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var l in e)
            if ('default' !== l && Object.prototype.hasOwnProperty.call(e, l)) {
              var i = a ? Object.getOwnPropertyDescriptor(e, l) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(o, l, i)
                : (o[l] = e[l]);
            }
          return ((o.default = e), n && n.set(e, o), o);
        };
      },
    }));
  var t = require('../webpack-runtime.js');
  t.C(e);
  var r = e => t((t.s = e)),
    n = t.X(0, [396], () => r(77054));
  module.exports = n;
})();
