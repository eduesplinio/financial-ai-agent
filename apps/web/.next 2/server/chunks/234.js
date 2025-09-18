((exports.id = 234),
  (exports.ids = [234]),
  (exports.modules = {
    46580: (e, t, r) => {
      'use strict';
      r.d(t, { Z: () => n });
      let n = (0, r(6147).Z)('check', [
        ['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }],
      ]);
    },
    5552: (e, t, r) => {
      'use strict';
      r.d(t, { Z: () => n });
      let n = (0, r(6147).Z)('chevron-down', [
        ['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }],
      ]);
    },
    17057: (e, t, r) => {
      'use strict';
      r.d(t, { Z: () => n });
      let n = (0, r(6147).Z)('chevron-up', [
        ['path', { d: 'm18 15-6-6-6 6', key: '153udz' }],
      ]);
    },
    69557: (e, t, r) => {
      e.exports = r(53651);
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
      r.d(t, { b: () => c });
      var n = r(12363),
        o = r(73793);
      let i = ['scope', 'children'];
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
      function a(e) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
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
      function c(e, t = []) {
        let r = [],
          l = () => {
            let t = r.map(e => n.createContext(e));
            return function (r) {
              let o = r?.[e] || t;
              return n.useMemo(
                () => ({ [`__scope${e}`]: a(a({}, r), {}, { [e]: o }) }),
                [r, o]
              );
            };
          };
        return (
          (l.scopeName = e),
          [
            function (t, l) {
              let a = n.createContext(l),
                c = r.length;
              r = [...r, l];
              let u = t => {
                let { scope: r, children: l } = t,
                  u = (function (e, t) {
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
                  })(t, i),
                  s = r?.[e]?.[c] || a,
                  f = n.useMemo(() => u, Object.values(u));
                return (0, o.jsx)(s.Provider, { value: f, children: l });
              };
              return (
                (u.displayName = t + 'Provider'),
                [
                  u,
                  function (r, o) {
                    let i = o?.[e]?.[c] || a,
                      u = n.useContext(i);
                    if (u) return u;
                    if (void 0 !== l) return l;
                    throw Error(`\`${r}\` must be used within \`${t}\``);
                  },
                ]
              );
            },
            (function (...e) {
              let t = e[0];
              if (1 === e.length) return t;
              let r = () => {
                let r = e.map(e => ({ useScope: e(), scopeName: e.scopeName }));
                return function (e) {
                  let o = r.reduce((t, { useScope: r, scopeName: n }) => {
                    let o = r(e)[`__scope${n}`];
                    return a(a({}, t), o);
                  }, {});
                  return n.useMemo(
                    () => ({ [`__scope${t.scopeName}`]: o }),
                    [o]
                  );
                };
              };
              return ((r.scopeName = t.scopeName), r);
            })(l, ...t),
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
      r.d(t, { WV: () => s, jH: () => f });
      var n = r(12363),
        o = r(46525),
        i = r(67031),
        l = r(73793);
      let a = ['asChild'];
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
      function u(e) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : c(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var s = [
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
              })(e, a),
              c = o ? r : t;
            return (0, l.jsx)(c, u(u({}, i), {}, { ref: n }));
          });
        return (
          (o.displayName = `Primitive.${t}`),
          u(u({}, e), {}, { [t]: o })
        );
      }, {});
      function f(e, t) {
        e && o.flushSync(() => e.dispatchEvent(t));
      }
    },
    57094: (e, t, r) => {
      'use strict';
      r.d(t, {
        VY: () => nY,
        ZA: () => nX,
        JO: () => nK,
        ck: () => nG,
        wU: () => nQ,
        eT: () => nJ,
        __: () => nq,
        h_: () => nZ,
        fC: () => nB,
        $G: () => n1,
        u_: () => n0,
        Z0: () => n2,
        xz: () => nz,
        B4: () => n$,
        l_: () => nU,
      });
      var n,
        o,
        i,
        l = r(12363),
        a = r.t(l, 2),
        c = r(46525),
        u = r(42404),
        s = r(42482),
        f = r(38254),
        d = r(18927),
        p = r(67031),
        v = r(73793);
      let m = ['scope', 'children'];
      function y(e, t, r) {
        if (!t.has(e))
          throw TypeError(
            'attempted to ' + r + ' private field on non-instance'
          );
        return t.get(e);
      }
      function b(e, t) {
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
      function h(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? b(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : b(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      Map;
      var g = r(6449),
        w = r(49277),
        O = r(52769);
      let j = [
        'disableOutsidePointerEvents',
        'onEscapeKeyDown',
        'onPointerDownOutside',
        'onFocusOutside',
        'onInteractOutside',
        'onDismiss',
      ];
      function x(e, t) {
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
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? x(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : x(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var S = 'dismissableLayer.update',
        E = l.createContext({
          layers: new Set(),
          layersWithOutsidePointerEventsDisabled: new Set(),
          branches: new Set(),
        }),
        C = l.forwardRef((e, t) => {
          let {
              disableOutsidePointerEvents: r = !1,
              onEscapeKeyDown: n,
              onPointerDownOutside: i,
              onFocusOutside: a,
              onInteractOutside: c,
              onDismiss: u,
            } = e,
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
            })(e, j),
            p = l.useContext(E),
            [m, y] = l.useState(null),
            b = m?.ownerDocument ?? globalThis?.document,
            [, h] = l.useState({}),
            g = (0, d.e)(t, e => y(e)),
            x = Array.from(p.layers),
            [C] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1),
            k = x.indexOf(C),
            T = m ? x.indexOf(m) : -1,
            A = p.layersWithOutsidePointerEventsDisabled.size > 0,
            M = T >= k,
            N = (function (e, t = globalThis?.document) {
              let r = (0, O.W)(e),
                n = l.useRef(!1),
                o = l.useRef(() => {});
              return (
                l.useEffect(() => {
                  let e = e => {
                      if (e.target && !n.current) {
                        let n = function () {
                            D('dismissableLayer.pointerDownOutside', r, i, {
                              discrete: !0,
                            });
                          },
                          i = { originalEvent: e };
                        'touch' === e.pointerType
                          ? (t.removeEventListener('click', o.current),
                            (o.current = n),
                            t.addEventListener('click', o.current, {
                              once: !0,
                            }))
                          : n();
                      } else t.removeEventListener('click', o.current);
                      n.current = !1;
                    },
                    i = window.setTimeout(() => {
                      t.addEventListener('pointerdown', e);
                    }, 0);
                  return () => {
                    (window.clearTimeout(i),
                      t.removeEventListener('pointerdown', e),
                      t.removeEventListener('click', o.current));
                  };
                }, [t, r]),
                { onPointerDownCapture: () => (n.current = !0) }
              );
            })(e => {
              let t = e.target,
                r = [...p.branches].some(e => e.contains(t));
              !M || r || (i?.(e), c?.(e), e.defaultPrevented || u?.());
            }, b),
            L = (function (e, t = globalThis?.document) {
              let r = (0, O.W)(e),
                n = l.useRef(!1);
              return (
                l.useEffect(() => {
                  let e = e => {
                    e.target &&
                      !n.current &&
                      D(
                        'dismissableLayer.focusOutside',
                        r,
                        { originalEvent: e },
                        { discrete: !1 }
                      );
                  };
                  return (
                    t.addEventListener('focusin', e),
                    () => t.removeEventListener('focusin', e)
                  );
                }, [t, r]),
                {
                  onFocusCapture: () => (n.current = !0),
                  onBlurCapture: () => (n.current = !1),
                }
              );
            })(e => {
              let t = e.target;
              [...p.branches].some(e => e.contains(t)) ||
                (a?.(e), c?.(e), e.defaultPrevented || u?.());
            }, b);
          return (
            (function (e, t = globalThis?.document) {
              let r = (0, O.W)(e);
              l.useEffect(() => {
                let e = e => {
                  'Escape' === e.key && r(e);
                };
                return (
                  t.addEventListener('keydown', e, { capture: !0 }),
                  () => t.removeEventListener('keydown', e, { capture: !0 })
                );
              }, [r, t]);
            })(e => {
              T !== p.layers.size - 1 ||
                (n?.(e), !e.defaultPrevented && u && (e.preventDefault(), u()));
            }, b),
            l.useEffect(() => {
              if (m)
                return (
                  r &&
                    (0 === p.layersWithOutsidePointerEventsDisabled.size &&
                      ((o = b.body.style.pointerEvents),
                      (b.body.style.pointerEvents = 'none')),
                    p.layersWithOutsidePointerEventsDisabled.add(m)),
                  p.layers.add(m),
                  R(),
                  () => {
                    r &&
                      1 === p.layersWithOutsidePointerEventsDisabled.size &&
                      (b.body.style.pointerEvents = o);
                  }
                );
            }, [m, b, r, p]),
            l.useEffect(
              () => () => {
                m &&
                  (p.layers.delete(m),
                  p.layersWithOutsidePointerEventsDisabled.delete(m),
                  R());
              },
              [m, p]
            ),
            l.useEffect(() => {
              let e = () => h({});
              return (
                document.addEventListener(S, e),
                () => document.removeEventListener(S, e)
              );
            }, []),
            (0, v.jsx)(
              w.WV.div,
              P(
                P({}, f),
                {},
                {
                  ref: g,
                  style: P(
                    { pointerEvents: A ? (M ? 'auto' : 'none') : void 0 },
                    e.style
                  ),
                  onFocusCapture: (0, s.Mj)(e.onFocusCapture, L.onFocusCapture),
                  onBlurCapture: (0, s.Mj)(e.onBlurCapture, L.onBlurCapture),
                  onPointerDownCapture: (0, s.Mj)(
                    e.onPointerDownCapture,
                    N.onPointerDownCapture
                  ),
                }
              )
            )
          );
        });
      function R() {
        let e = new CustomEvent(S);
        document.dispatchEvent(e);
      }
      function D(e, t, r, { discrete: n }) {
        let o = r.originalEvent.target,
          i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
        (t && o.addEventListener(e, t, { once: !0 }),
          n ? (0, w.jH)(o, i) : o.dispatchEvent(i));
      }
      ((C.displayName = 'DismissableLayer'),
        (l.forwardRef((e, t) => {
          let r = l.useContext(E),
            n = l.useRef(null),
            o = (0, d.e)(t, n);
          return (
            l.useEffect(() => {
              let e = n.current;
              if (e)
                return (
                  r.branches.add(e),
                  () => {
                    r.branches.delete(e);
                  }
                );
            }, [r.branches]),
            (0, v.jsx)(w.WV.div, P(P({}, e), {}, { ref: o }))
          );
        }).displayName = 'DismissableLayerBranch'));
      var k = 0;
      function T() {
        let e = document.createElement('span');
        return (
          e.setAttribute('data-radix-focus-guard', ''),
          (e.tabIndex = 0),
          (e.style.outline = 'none'),
          (e.style.opacity = '0'),
          (e.style.position = 'fixed'),
          (e.style.pointerEvents = 'none'),
          e
        );
      }
      let A = ['loop', 'trapped', 'onMountAutoFocus', 'onUnmountAutoFocus'];
      function M(e, t) {
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
      function N(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? M(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : M(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var L = 'focusScope.autoFocusOnMount',
        W = 'focusScope.autoFocusOnUnmount',
        _ = { bubbles: !1, cancelable: !0 },
        I = l.forwardRef((e, t) => {
          let {
              loop: r = !1,
              trapped: n = !1,
              onMountAutoFocus: o,
              onUnmountAutoFocus: i,
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
            })(e, A),
            [c, u] = l.useState(null),
            s = (0, O.W)(o),
            f = (0, O.W)(i),
            p = l.useRef(null),
            m = (0, d.e)(t, e => u(e)),
            y = l.useRef({
              paused: !1,
              pause() {
                this.paused = !0;
              },
              resume() {
                this.paused = !1;
              },
            }).current;
          (l.useEffect(() => {
            if (n) {
              let e = function (e) {
                  if (y.paused || !c) return;
                  let t = e.target;
                  c.contains(t)
                    ? (p.current = t)
                    : H(p.current, { select: !0 });
                },
                t = function (e) {
                  if (y.paused || !c) return;
                  let t = e.relatedTarget;
                  null === t || c.contains(t) || H(p.current, { select: !0 });
                };
              (document.addEventListener('focusin', e),
                document.addEventListener('focusout', t));
              let r = new MutationObserver(function (e) {
                if (document.activeElement === document.body)
                  for (let t of e) t.removedNodes.length > 0 && H(c);
              });
              return (
                c && r.observe(c, { childList: !0, subtree: !0 }),
                () => {
                  (document.removeEventListener('focusin', e),
                    document.removeEventListener('focusout', t),
                    r.disconnect());
                }
              );
            }
          }, [n, c, y.paused]),
            l.useEffect(() => {
              if (c) {
                B.add(y);
                let e = document.activeElement;
                if (!c.contains(e)) {
                  let t = new CustomEvent(L, _);
                  (c.addEventListener(L, s),
                    c.dispatchEvent(t),
                    t.defaultPrevented ||
                      ((function (e, { select: t = !1 } = {}) {
                        let r = document.activeElement;
                        for (let n of e)
                          if (
                            (H(n, { select: t }), document.activeElement !== r)
                          )
                            return;
                      })(
                        F(c).filter(e => 'A' !== e.tagName),
                        { select: !0 }
                      ),
                      document.activeElement === e && H(c)));
                }
                return () => {
                  (c.removeEventListener(L, s),
                    setTimeout(() => {
                      let t = new CustomEvent(W, _);
                      (c.addEventListener(W, f),
                        c.dispatchEvent(t),
                        t.defaultPrevented ||
                          H(e ?? document.body, { select: !0 }),
                        c.removeEventListener(W, f),
                        B.remove(y));
                    }, 0));
                };
              }
            }, [c, s, f, y]));
          let b = l.useCallback(
            e => {
              if ((!r && !n) || y.paused) return;
              let t = 'Tab' === e.key && !e.altKey && !e.ctrlKey && !e.metaKey,
                o = document.activeElement;
              if (t && o) {
                let t = e.currentTarget,
                  [n, i] = (function (e) {
                    let t = F(e);
                    return [V(t, e), V(t.reverse(), e)];
                  })(t);
                n && i
                  ? e.shiftKey || o !== i
                    ? e.shiftKey &&
                      o === n &&
                      (e.preventDefault(), r && H(i, { select: !0 }))
                    : (e.preventDefault(), r && H(n, { select: !0 }))
                  : o === t && e.preventDefault();
              }
            },
            [r, n, y.paused]
          );
          return (0, v.jsx)(
            w.WV.div,
            N(N({ tabIndex: -1 }, a), {}, { ref: m, onKeyDown: b })
          );
        });
      function F(e) {
        let t = [],
          r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: e => {
              let t = 'INPUT' === e.tagName && 'hidden' === e.type;
              return e.disabled || e.hidden || t
                ? NodeFilter.FILTER_SKIP
                : e.tabIndex >= 0
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_SKIP;
            },
          });
        for (; r.nextNode(); ) t.push(r.currentNode);
        return t;
      }
      function V(e, t) {
        for (let r of e)
          if (
            !(function (e, { upTo: t }) {
              if ('hidden' === getComputedStyle(e).visibility) return !0;
              for (; e && (void 0 === t || e !== t); ) {
                if ('none' === getComputedStyle(e).display) return !0;
                e = e.parentElement;
              }
              return !1;
            })(r, { upTo: t })
          )
            return r;
      }
      function H(e, { select: t = !1 } = {}) {
        if (e && e.focus) {
          var r;
          let n = document.activeElement;
          (e.focus({ preventScroll: !0 }),
            e !== n &&
              (r = e) instanceof HTMLInputElement &&
              'select' in r &&
              t &&
              e.select());
        }
      }
      I.displayName = 'FocusScope';
      var B = (function () {
        let e = [];
        return {
          add(t) {
            let r = e[0];
            (t !== r && r?.pause(), (e = z(e, t)).unshift(t));
          },
          remove(t) {
            ((e = z(e, t)), e[0]?.resume());
          },
        };
      })();
      function z(e, t) {
        let r = [...e],
          n = r.indexOf(t);
        return (-1 !== n && r.splice(n, 1), r);
      }
      var $ = r(85995),
        K = a[' useId '.trim().toString()] || (() => void 0),
        Z = 0;
      function Y(e) {
        let [t, r] = l.useState(K());
        return (
          (0, $.b)(() => {
            e || r(e => e ?? String(Z++));
          }, [e]),
          e || (t ? `radix-${t}` : '')
        );
      }
      function U(e, t) {
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
      let X = ['top', 'right', 'bottom', 'left'],
        q = Math.min,
        G = Math.max,
        J = Math.round,
        Q = Math.floor,
        ee = e => ({ x: e, y: e }),
        et = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
        er = { start: 'end', end: 'start' };
      function en(e, t) {
        return 'function' == typeof e ? e(t) : e;
      }
      function eo(e) {
        return e.split('-')[0];
      }
      function ei(e) {
        return e.split('-')[1];
      }
      function el(e) {
        return 'x' === e ? 'y' : 'x';
      }
      function ea(e) {
        return 'y' === e ? 'height' : 'width';
      }
      let ec = new Set(['top', 'bottom']);
      function eu(e) {
        return ec.has(eo(e)) ? 'y' : 'x';
      }
      function es(e) {
        return e.replace(/start|end/g, e => er[e]);
      }
      let ef = ['left', 'right'],
        ed = ['right', 'left'],
        ep = ['top', 'bottom'],
        ev = ['bottom', 'top'];
      function em(e) {
        return e.replace(/left|right|bottom|top/g, e => et[e]);
      }
      function ey(e) {
        return 'number' != typeof e
          ? (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? U(Object(r), !0).forEach(function (t) {
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
                    : U(Object(r)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(r, t)
                        );
                      });
              }
              return e;
            })({ top: 0, right: 0, bottom: 0, left: 0 }, e)
          : { top: e, right: e, bottom: e, left: e };
      }
      function eb(e) {
        let { x: t, y: r, width: n, height: o } = e;
        return {
          width: n,
          height: o,
          top: r,
          left: t,
          right: t + n,
          bottom: r + o,
          x: t,
          y: r,
        };
      }
      let eh = [
          'mainAxis',
          'crossAxis',
          'fallbackPlacements',
          'fallbackStrategy',
          'fallbackAxisSideDirection',
          'flipAlignment',
        ],
        eg = ['strategy'],
        ew = ['mainAxis', 'crossAxis', 'limiter'],
        eO = ['apply'];
      function ej(e, t) {
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
      function ex(e, t) {
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
      function eP(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ex(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : ex(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      function eS(e, t, r) {
        let n,
          { reference: o, floating: i } = e,
          l = eu(t),
          a = el(eu(t)),
          c = ea(a),
          u = eo(t),
          s = 'y' === l,
          f = o.x + o.width / 2 - i.width / 2,
          d = o.y + o.height / 2 - i.height / 2,
          p = o[c] / 2 - i[c] / 2;
        switch (u) {
          case 'top':
            n = { x: f, y: o.y - i.height };
            break;
          case 'bottom':
            n = { x: f, y: o.y + o.height };
            break;
          case 'right':
            n = { x: o.x + o.width, y: d };
            break;
          case 'left':
            n = { x: o.x - i.width, y: d };
            break;
          default:
            n = { x: o.x, y: o.y };
        }
        switch (ei(t)) {
          case 'start':
            n[a] -= p * (r && s ? -1 : 1);
            break;
          case 'end':
            n[a] += p * (r && s ? -1 : 1);
        }
        return n;
      }
      let eE = async (e, t, r) => {
        let {
            placement: n = 'bottom',
            strategy: o = 'absolute',
            middleware: i = [],
            platform: l,
          } = r,
          a = i.filter(Boolean),
          c = await (null == l.isRTL ? void 0 : l.isRTL(t)),
          u = await l.getElementRects({
            reference: e,
            floating: t,
            strategy: o,
          }),
          { x: s, y: f } = eS(u, n, c),
          d = n,
          p = {},
          v = 0;
        for (let r = 0; r < a.length; r++) {
          let { name: i, fn: m } = a[r],
            {
              x: y,
              y: b,
              data: h,
              reset: g,
            } = await m({
              x: s,
              y: f,
              initialPlacement: n,
              placement: d,
              strategy: o,
              middlewareData: p,
              rects: u,
              platform: l,
              elements: { reference: e, floating: t },
            });
          ((s = null != y ? y : s),
            (f = null != b ? b : f),
            (p = eP(eP({}, p), {}, { [i]: eP(eP({}, p[i]), h) })),
            g &&
              v <= 50 &&
              (v++,
              'object' == typeof g &&
                (g.placement && (d = g.placement),
                g.rects &&
                  (u =
                    !0 === g.rects
                      ? await l.getElementRects({
                          reference: e,
                          floating: t,
                          strategy: o,
                        })
                      : g.rects),
                ({ x: s, y: f } = eS(u, d, c))),
              (r = -1)));
        }
        return { x: s, y: f, placement: d, strategy: o, middlewareData: p };
      };
      async function eC(e, t) {
        var r;
        void 0 === t && (t = {});
        let { x: n, y: o, platform: i, rects: l, elements: a, strategy: c } = e,
          {
            boundary: u = 'clippingAncestors',
            rootBoundary: s = 'viewport',
            elementContext: f = 'floating',
            altBoundary: d = !1,
            padding: p = 0,
          } = en(t, e),
          v = ey(p),
          m = a[d ? ('floating' === f ? 'reference' : 'floating') : f],
          y = eb(
            await i.getClippingRect({
              element:
                null ==
                  (r = await (null == i.isElement ? void 0 : i.isElement(m))) ||
                r
                  ? m
                  : m.contextElement ||
                    (await (null == i.getDocumentElement
                      ? void 0
                      : i.getDocumentElement(a.floating))),
              boundary: u,
              rootBoundary: s,
              strategy: c,
            })
          ),
          b =
            'floating' === f
              ? {
                  x: n,
                  y: o,
                  width: l.floating.width,
                  height: l.floating.height,
                }
              : l.reference,
          h = await (null == i.getOffsetParent
            ? void 0
            : i.getOffsetParent(a.floating)),
          g = ((await (null == i.isElement ? void 0 : i.isElement(h))) &&
            (await (null == i.getScale ? void 0 : i.getScale(h)))) || {
            x: 1,
            y: 1,
          },
          w = eb(
            i.convertOffsetParentRelativeRectToViewportRelativeRect
              ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
                  elements: a,
                  rect: b,
                  offsetParent: h,
                  strategy: c,
                })
              : b
          );
        return {
          top: (y.top - w.top + v.top) / g.y,
          bottom: (w.bottom - y.bottom + v.bottom) / g.y,
          left: (y.left - w.left + v.left) / g.x,
          right: (w.right - y.right + v.right) / g.x,
        };
      }
      function eR(e, t) {
        return {
          top: e.top - t.height,
          right: e.right - t.width,
          bottom: e.bottom - t.height,
          left: e.left - t.width,
        };
      }
      function eD(e) {
        return X.some(t => e[t] >= 0);
      }
      let ek = new Set(['left', 'top']);
      async function eT(e, t) {
        let { placement: r, platform: n, elements: o } = e,
          i = await (null == n.isRTL ? void 0 : n.isRTL(o.floating)),
          l = eo(r),
          a = ei(r),
          c = 'y' === eu(r),
          u = ek.has(l) ? -1 : 1,
          s = i && c ? -1 : 1,
          f = en(t, e),
          {
            mainAxis: d,
            crossAxis: p,
            alignmentAxis: v,
          } = 'number' == typeof f
            ? { mainAxis: f, crossAxis: 0, alignmentAxis: null }
            : {
                mainAxis: f.mainAxis || 0,
                crossAxis: f.crossAxis || 0,
                alignmentAxis: f.alignmentAxis,
              };
        return (
          a && 'number' == typeof v && (p = 'end' === a ? -1 * v : v),
          c ? { x: p * s, y: d * u } : { x: d * u, y: p * s }
        );
      }
      function eA(e) {
        var t;
        return ((t = 0), '#document');
      }
      function eM(e) {
        var t;
        return (
          (null == e || null == (t = e.ownerDocument)
            ? void 0
            : t.defaultView) || window
        );
      }
      function eN(e) {
        var t, r;
        return null == (t = ((r = 0), e.document || window.document))
          ? void 0
          : t.documentElement;
      }
      let eL = new Set(['inline', 'contents']);
      function eW(e) {
        let { overflow: t, overflowX: r, overflowY: n, display: o } = eK(e);
        return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && !eL.has(o);
      }
      let e_ = [':popover-open', ':modal'];
      function eI(e) {
        return e_.some(t => {
          try {
            return e.matches(t);
          } catch (e) {
            return !1;
          }
        });
      }
      let eF = ['transform', 'translate', 'scale', 'rotate', 'perspective'],
        eV = [
          'transform',
          'translate',
          'scale',
          'rotate',
          'perspective',
          'filter',
        ],
        eH = ['paint', 'layout', 'strict', 'content'];
      function eB() {
        return (
          'undefined' != typeof CSS &&
          !!CSS.supports &&
          CSS.supports('-webkit-backdrop-filter', 'none')
        );
      }
      let ez = new Set(['html', 'body', '#document']);
      function e$(e) {
        return ez.has(eA(e));
      }
      function eK(e) {
        return eM(e).getComputedStyle(e);
      }
      function eZ(e) {
        return { scrollLeft: e.scrollX, scrollTop: e.scrollY };
      }
      function eY(e) {
        return 'html' === eA(e) ? e : e.assignedSlot || e.parentNode || eN(e);
      }
      function eU(e, t, r) {
        var n;
        (void 0 === t && (t = []), void 0 === r && (r = !0));
        let o = (function e(t) {
            var r;
            let n = eY(t);
            return ((r = n), ez.has(eA(r)))
              ? t.ownerDocument
                ? t.ownerDocument.body
                : t.body
              : e(n);
          })(e),
          i = o === (null == (n = e.ownerDocument) ? void 0 : n.body),
          l = eM(o);
        if (i) {
          let e = eX(l);
          return t.concat(
            l,
            l.visualViewport || [],
            eW(o) ? o : [],
            e && r ? eU(e) : []
          );
        }
        return t.concat(o, eU(o, [], r));
      }
      function eX(e) {
        return e.parent && Object.getPrototypeOf(e.parent)
          ? e.frameElement
          : null;
      }
      function eq(e, t) {
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
      function eG(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? eq(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : eq(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      function eJ(e) {
        return e.contextElement;
      }
      function eQ(e) {
        return (eJ(e), ee(1));
      }
      let e0 = ee(0);
      function e1(e) {
        let t = eM(e);
        return eB() && t.visualViewport
          ? { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop }
          : e0;
      }
      function e2(e, t, r, n) {
        var o;
        (void 0 === t && (t = !1), void 0 === r && (r = !1));
        let i = e.getBoundingClientRect(),
          l = eJ(e),
          a = ee(1);
        t && (n || (a = eQ(e)));
        let c = (void 0 === (o = r) && (o = !1), n && (!o || n === eM(l)) && o)
            ? e1(l)
            : ee(0),
          u = (i.left + c.x) / a.x,
          s = (i.top + c.y) / a.y,
          f = i.width / a.x,
          d = i.height / a.y;
        if (l) {
          let e = eM(l),
            t = eX(e);
          for (; t && n && n !== e; ) {
            let r = eQ(t),
              n = t.getBoundingClientRect(),
              o = eK(t),
              i = n.left + (t.clientLeft + parseFloat(o.paddingLeft)) * r.x,
              l = n.top + (t.clientTop + parseFloat(o.paddingTop)) * r.y;
            ((u *= r.x),
              (s *= r.y),
              (f *= r.x),
              (d *= r.y),
              (u += i),
              (s += l),
              (t = eX((e = eM(t)))));
          }
        }
        return eb({ width: f, height: d, x: u, y: s });
      }
      function e5(e, t) {
        let r = eZ(e).scrollLeft;
        return t ? t.left + r : e2(eN(e)).left + r;
      }
      function e3(e, t) {
        let r = e.getBoundingClientRect();
        return { x: r.left + t.scrollLeft - e5(e, r), y: r.top + t.scrollTop };
      }
      function e6(e, t, r) {
        let n;
        if ('viewport' === t)
          n = (function (e, t) {
            let r = eM(e),
              n = eN(e),
              o = r.visualViewport,
              i = n.clientWidth,
              l = n.clientHeight,
              a = 0,
              c = 0;
            if (o) {
              ((i = o.width), (l = o.height));
              let e = eB();
              (!e || (e && 'fixed' === t)) &&
                ((a = o.offsetLeft), (c = o.offsetTop));
            }
            let u = e5(n);
            if (u <= 0) {
              let e = n.ownerDocument,
                t = e.body,
                r = getComputedStyle(t),
                o =
                  ('CSS1Compat' === e.compatMode &&
                    parseFloat(r.marginLeft) + parseFloat(r.marginRight)) ||
                  0,
                l = Math.abs(n.clientWidth - t.clientWidth - o);
              l <= 25 && (i -= l);
            } else u <= 25 && (i += u);
            return { width: i, height: l, x: a, y: c };
          })(e, r);
        else if ('document' === t)
          n = (function (e) {
            let t = eN(e),
              r = eZ(e),
              n = e.ownerDocument.body,
              o = G(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth),
              i = G(
                t.scrollHeight,
                t.clientHeight,
                n.scrollHeight,
                n.clientHeight
              ),
              l = -r.scrollLeft + e5(e),
              a = -r.scrollTop;
            return (
              'rtl' === eK(n).direction &&
                (l += G(t.clientWidth, n.clientWidth) - o),
              { width: o, height: i, x: l, y: a }
            );
          })(eN(e));
        else {
          let r = e1(e);
          n = { x: t.x - r.x, y: t.y - r.y, width: t.width, height: t.height };
        }
        return eb(n);
      }
      function e4(e, t) {
        let r = eM(e);
        if (eI(e)) return r;
        {
          var n;
          let t = eY(e);
          for (; t && ((n = t), !ez.has(eA(n))); ) t = eY(t);
          return r;
        }
      }
      let e7 = async function (e) {
          let t = this.getOffsetParent || e4,
            r = this.getDimensions,
            n = await r(e.floating);
          return {
            reference: (function (e, t, r) {
              let n = eN(t),
                o = 'fixed' === r,
                i = e2(e, !0, o, t),
                l = { scrollLeft: 0, scrollTop: 0 },
                a = ee(0);
              if (!o) {
                ('body' !== eA(t) || eW(n)) && (l = eZ(t));
                n && (a.x = e5(n));
              }
              o && n && (a.x = e5(n));
              let c = !n || o ? ee(0) : e3(n, l);
              return {
                x: i.left + l.scrollLeft - a.x - c.x,
                y: i.top + l.scrollTop - a.y - c.y,
                width: i.width,
                height: i.height,
              };
            })(e.reference, await t(e.floating), e.strategy),
            floating: { x: 0, y: 0, width: n.width, height: n.height },
          };
        },
        e9 = {
          convertOffsetParentRelativeRectToViewportRelativeRect: function (e) {
            let { elements: t, rect: r, offsetParent: n, strategy: o } = e,
              i = 'fixed' === o,
              l = eN(n),
              a = !!t && eI(t.floating);
            if (n === l || (a && i)) return r;
            let c = { scrollLeft: 0, scrollTop: 0 },
              u = ee(1),
              s = ee(0);
            i || (('body' !== eA(n) || eW(l)) && (c = eZ(n)));
            let f = !l || i ? ee(0) : e3(l, c);
            return {
              width: r.width * u.x,
              height: r.height * u.y,
              x: r.x * u.x - c.scrollLeft * u.x + s.x + f.x,
              y: r.y * u.y - c.scrollTop * u.y + s.y + f.y,
            };
          },
          getDocumentElement: eN,
          getClippingRect: function (e) {
            let { element: t, boundary: r, rootBoundary: n, strategy: o } = e,
              i = [
                ...('clippingAncestors' === r
                  ? eI(t)
                    ? []
                    : (function (e, t) {
                        let r = t.get(e);
                        if (r) return r;
                        let n = eU(e, [], !1).filter(e => !1);
                        return (
                          'fixed' === eK(e).position && eY(e),
                          t.set(e, n),
                          n
                        );
                      })(t, this._c)
                  : [].concat(r)),
                n,
              ],
              l = i[0],
              a = i.reduce(
                (e, r) => {
                  let n = e6(t, r, o);
                  return (
                    (e.top = G(n.top, e.top)),
                    (e.right = q(n.right, e.right)),
                    (e.bottom = q(n.bottom, e.bottom)),
                    (e.left = G(n.left, e.left)),
                    e
                  );
                },
                e6(t, l, o)
              );
            return {
              width: a.right - a.left,
              height: a.bottom - a.top,
              x: a.left,
              y: a.top,
            };
          },
          getOffsetParent: e4,
          getElementRects: e7,
          getClientRects: function (e) {
            return Array.from(e.getClientRects());
          },
          getDimensions: function (e) {
            let { width: t, height: r } = (function (e) {
              let t = eK(e),
                r = parseFloat(t.width) || 0,
                n = parseFloat(t.height) || 0,
                o = r,
                i = n,
                l = J(r) !== o || J(n) !== i;
              return (l && ((r = o), (n = i)), { width: r, height: n, $: l });
            })(e);
            return { width: t, height: r };
          },
          getScale: eQ,
          isElement: function (e) {
            return !1;
          },
          isRTL: function (e) {
            return 'rtl' === eK(e).direction;
          },
        };
      function e8(e, t) {
        return (
          e.x === t.x &&
          e.y === t.y &&
          e.width === t.width &&
          e.height === t.height
        );
      }
      let te = e => ({
          name: 'arrow',
          options: e,
          async fn(t) {
            let {
                x: r,
                y: n,
                placement: o,
                rects: i,
                platform: l,
                elements: a,
                middlewareData: c,
              } = t,
              { element: u, padding: s = 0 } = en(e, t) || {};
            if (null == u) return {};
            let f = ey(s),
              d = { x: r, y: n },
              p = el(eu(o)),
              v = ea(p),
              m = await l.getDimensions(u),
              y = 'y' === p,
              b = y ? 'clientHeight' : 'clientWidth',
              h = i.reference[v] + i.reference[p] - d[p] - i.floating[v],
              g = d[p] - i.reference[p],
              w = await (null == l.getOffsetParent
                ? void 0
                : l.getOffsetParent(u)),
              O = w ? w[b] : 0;
            (O && (await (null == l.isElement ? void 0 : l.isElement(w)))) ||
              (O = a.floating[b] || i.floating[v]);
            let j = O / 2 - m[v] / 2 - 1,
              x = q(f[y ? 'top' : 'left'], j),
              P = q(f[y ? 'bottom' : 'right'], j),
              S = O - m[v] - P,
              E = O / 2 - m[v] / 2 + (h / 2 - g / 2),
              C = G(x, q(E, S)),
              R =
                !c.arrow &&
                null != ei(o) &&
                E !== C &&
                i.reference[v] / 2 - (E < x ? x : P) - m[v] / 2 < 0,
              D = R ? (E < x ? E - x : E - S) : 0;
            return {
              [p]: d[p] + D,
              data: eP(
                { [p]: C, centerOffset: E - C - D },
                R && { alignmentOffset: D }
              ),
              reset: R,
            };
          },
        }),
        tt = (e, t, r) => {
          let n = new Map(),
            o = eG({ platform: e9 }, r),
            i = eG(eG({}, o.platform), {}, { _c: n });
          return eE(e, t, eG(eG({}, o), {}, { platform: i }));
        };
      function tr(e, t) {
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
      function tn(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? tr(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : tr(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var to =
        'undefined' != typeof document ? l.useLayoutEffect : function () {};
      function ti(e, t) {
        let r, n, o;
        if (e === t) return !0;
        if (typeof e != typeof t) return !1;
        if ('function' == typeof e && e.toString() === t.toString()) return !0;
        if (e && t && 'object' == typeof e) {
          if (Array.isArray(e)) {
            if ((r = e.length) !== t.length) return !1;
            for (n = r; 0 != n--; ) if (!ti(e[n], t[n])) return !1;
            return !0;
          }
          if ((r = (o = Object.keys(e)).length) !== Object.keys(t).length)
            return !1;
          for (n = r; 0 != n--; )
            if (!{}.hasOwnProperty.call(t, o[n])) return !1;
          for (n = r; 0 != n--; ) {
            let r = o[n];
            if (('_owner' !== r || !e.$$typeof) && !ti(e[r], t[r])) return !1;
          }
          return !0;
        }
        return e != e && t != t;
      }
      function tl(e, t) {
        return Math.round(1 * t) / 1;
      }
      function ta(e) {
        let t = l.useRef(e);
        return (
          to(() => {
            t.current = e;
          }),
          t
        );
      }
      let tc = e => ({
          name: 'arrow',
          options: e,
          fn(t) {
            let { element: r, padding: n } = 'function' == typeof e ? e(t) : e;
            return r && {}.hasOwnProperty.call(r, 'current')
              ? null != r.current
                ? te({ element: r.current, padding: n }).fn(t)
                : {}
              : r
                ? te({ element: r, padding: n }).fn(t)
                : {};
          },
        }),
        tu = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = 0),
                  {
                    name: 'offset',
                    options: e,
                    async fn(t) {
                      var r, n;
                      let { x: o, y: i, placement: l, middlewareData: a } = t,
                        c = await eT(t, e);
                      return l ===
                        (null == (r = a.offset) ? void 0 : r.placement) &&
                        null != (n = a.arrow) &&
                        n.alignmentOffset
                        ? {}
                        : {
                            x: o + c.x,
                            y: i + c.y,
                            data: eP(eP({}, c), {}, { placement: l }),
                          };
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        ts = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = {}),
                  {
                    name: 'shift',
                    options: e,
                    async fn(t) {
                      let { x: r, y: n, placement: o } = t,
                        i = en(e, t),
                        {
                          mainAxis: l = !0,
                          crossAxis: a = !1,
                          limiter: c = {
                            fn: e => {
                              let { x: t, y: r } = e;
                              return { x: t, y: r };
                            },
                          },
                        } = i,
                        u = ej(i, ew),
                        s = { x: r, y: n },
                        f = await eC(t, u),
                        d = eu(eo(o)),
                        p = el(d),
                        v = s[p],
                        m = s[d];
                      if (l) {
                        let e = 'y' === p ? 'top' : 'left',
                          t = 'y' === p ? 'bottom' : 'right',
                          r = v + f[e],
                          n = v - f[t];
                        v = G(r, q(v, n));
                      }
                      if (a) {
                        let e = 'y' === d ? 'top' : 'left',
                          t = 'y' === d ? 'bottom' : 'right',
                          r = m + f[e],
                          n = m - f[t];
                        m = G(r, q(m, n));
                      }
                      let y = c.fn(eP(eP({}, t), {}, { [p]: v, [d]: m }));
                      return eP(
                        eP({}, y),
                        {},
                        {
                          data: {
                            x: y.x - r,
                            y: y.y - n,
                            enabled: { [p]: l, [d]: a },
                          },
                        }
                      );
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        tf = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = {}),
                  {
                    options: e,
                    fn(t) {
                      let {
                          x: r,
                          y: n,
                          placement: o,
                          rects: i,
                          middlewareData: l,
                        } = t,
                        {
                          offset: a = 0,
                          mainAxis: c = !0,
                          crossAxis: u = !0,
                        } = en(e, t),
                        s = { x: r, y: n },
                        f = eu(o),
                        d = el(f),
                        p = s[d],
                        v = s[f],
                        m = en(a, t),
                        y =
                          'number' == typeof m
                            ? { mainAxis: m, crossAxis: 0 }
                            : eP({ mainAxis: 0, crossAxis: 0 }, m);
                      if (c) {
                        let e = 'y' === d ? 'height' : 'width',
                          t = i.reference[d] - i.floating[e] + y.mainAxis,
                          r = i.reference[d] + i.reference[e] - y.mainAxis;
                        p < t ? (p = t) : p > r && (p = r);
                      }
                      if (u) {
                        var b, h;
                        let e = 'y' === d ? 'width' : 'height',
                          t = ek.has(eo(o)),
                          r =
                            i.reference[f] -
                            i.floating[e] +
                            ((t && (null == (b = l.offset) ? void 0 : b[f])) ||
                              0) +
                            (t ? 0 : y.crossAxis),
                          n =
                            i.reference[f] +
                            i.reference[e] +
                            (t
                              ? 0
                              : (null == (h = l.offset) ? void 0 : h[f]) || 0) -
                            (t ? y.crossAxis : 0);
                        v < r ? (v = r) : v > n && (v = n);
                      }
                      return { [d]: p, [f]: v };
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        td = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = {}),
                  {
                    name: 'flip',
                    options: e,
                    async fn(t) {
                      var r, n, o, i, l;
                      let {
                          placement: a,
                          middlewareData: c,
                          rects: u,
                          initialPlacement: s,
                          platform: f,
                          elements: d,
                        } = t,
                        p = en(e, t),
                        {
                          mainAxis: v = !0,
                          crossAxis: m = !0,
                          fallbackPlacements: y,
                          fallbackStrategy: b = 'bestFit',
                          fallbackAxisSideDirection: h = 'none',
                          flipAlignment: g = !0,
                        } = p,
                        w = ej(p, eh);
                      if (null != (r = c.arrow) && r.alignmentOffset) return {};
                      let O = eo(a),
                        j = eu(s),
                        x = eo(s) === s,
                        P = await (null == f.isRTL
                          ? void 0
                          : f.isRTL(d.floating)),
                        S =
                          y ||
                          (x || !g
                            ? [em(s)]
                            : (function (e) {
                                let t = em(e);
                                return [es(e), t, es(t)];
                              })(s)),
                        E = 'none' !== h;
                      !y &&
                        E &&
                        S.push(
                          ...(function (e, t, r, n) {
                            let o = ei(e),
                              i = (function (e, t, r) {
                                switch (e) {
                                  case 'top':
                                  case 'bottom':
                                    if (r) return t ? ed : ef;
                                    return t ? ef : ed;
                                  case 'left':
                                  case 'right':
                                    return t ? ep : ev;
                                  default:
                                    return [];
                                }
                              })(eo(e), 'start' === r, n);
                            return (
                              o &&
                                ((i = i.map(e => e + '-' + o)),
                                t && (i = i.concat(i.map(es)))),
                              i
                            );
                          })(s, g, h, P)
                        );
                      let C = [s, ...S],
                        R = await eC(t, w),
                        D = [],
                        k = (null == (n = c.flip) ? void 0 : n.overflows) || [];
                      if ((v && D.push(R[O]), m)) {
                        let e = (function (e, t, r) {
                          void 0 === r && (r = !1);
                          let n = ei(e),
                            o = el(eu(e)),
                            i = ea(o),
                            l =
                              'x' === o
                                ? n === (r ? 'end' : 'start')
                                  ? 'right'
                                  : 'left'
                                : 'start' === n
                                  ? 'bottom'
                                  : 'top';
                          return (
                            t.reference[i] > t.floating[i] && (l = em(l)),
                            [l, em(l)]
                          );
                        })(a, u, P);
                        D.push(R[e[0]], R[e[1]]);
                      }
                      if (
                        ((k = [...k, { placement: a, overflows: D }]),
                        !D.every(e => e <= 0))
                      ) {
                        let e =
                            ((null == (o = c.flip) ? void 0 : o.index) || 0) +
                            1,
                          t = C[e];
                        if (
                          t &&
                          (!('alignment' === m && j !== eu(t)) ||
                            k.every(
                              e => eu(e.placement) !== j || e.overflows[0] > 0
                            ))
                        )
                          return {
                            data: { index: e, overflows: k },
                            reset: { placement: t },
                          };
                        let r =
                          null ==
                          (i = k
                            .filter(e => e.overflows[0] <= 0)
                            .sort((e, t) => e.overflows[1] - t.overflows[1])[0])
                            ? void 0
                            : i.placement;
                        if (!r)
                          switch (b) {
                            case 'bestFit': {
                              let e =
                                null ==
                                (l = k
                                  .filter(e => {
                                    if (E) {
                                      let t = eu(e.placement);
                                      return t === j || 'y' === t;
                                    }
                                    return !0;
                                  })
                                  .map(e => [
                                    e.placement,
                                    e.overflows
                                      .filter(e => e > 0)
                                      .reduce((e, t) => e + t, 0),
                                  ])
                                  .sort((e, t) => e[1] - t[1])[0])
                                  ? void 0
                                  : l[0];
                              e && (r = e);
                              break;
                            }
                            case 'initialPlacement':
                              r = s;
                          }
                        if (a !== r) return { reset: { placement: r } };
                      }
                      return {};
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        tp = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = {}),
                  {
                    name: 'size',
                    options: e,
                    async fn(t) {
                      var r, n;
                      let o, i;
                      let {
                          placement: l,
                          rects: a,
                          platform: c,
                          elements: u,
                        } = t,
                        s = en(e, t),
                        { apply: f = () => {} } = s,
                        d = ej(s, eO),
                        p = await eC(t, d),
                        v = eo(l),
                        m = ei(l),
                        y = 'y' === eu(l),
                        { width: b, height: h } = a.floating;
                      'top' === v || 'bottom' === v
                        ? ((o = v),
                          (i =
                            m ===
                            ((await (null == c.isRTL
                              ? void 0
                              : c.isRTL(u.floating)))
                              ? 'start'
                              : 'end')
                              ? 'left'
                              : 'right'))
                        : ((i = v), (o = 'end' === m ? 'top' : 'bottom'));
                      let g = h - p.top - p.bottom,
                        w = b - p.left - p.right,
                        O = q(h - p[o], g),
                        j = q(b - p[i], w),
                        x = !t.middlewareData.shift,
                        P = O,
                        S = j;
                      if (
                        (null != (r = t.middlewareData.shift) &&
                          r.enabled.x &&
                          (S = w),
                        null != (n = t.middlewareData.shift) &&
                          n.enabled.y &&
                          (P = g),
                        x && !m)
                      ) {
                        let e = G(p.left, 0),
                          t = G(p.right, 0),
                          r = G(p.top, 0),
                          n = G(p.bottom, 0);
                        y
                          ? (S =
                              b -
                              2 *
                                (0 !== e || 0 !== t
                                  ? e + t
                                  : G(p.left, p.right)))
                          : (P =
                              h -
                              2 *
                                (0 !== r || 0 !== n
                                  ? r + n
                                  : G(p.top, p.bottom)));
                      }
                      await f(
                        eP(
                          eP({}, t),
                          {},
                          { availableWidth: S, availableHeight: P }
                        )
                      );
                      let E = await c.getDimensions(u.floating);
                      return b !== E.width || h !== E.height
                        ? { reset: { rects: !0 } }
                        : {};
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        tv = (e, t) =>
          tn(
            tn(
              {},
              (function (e) {
                return (
                  void 0 === e && (e = {}),
                  {
                    name: 'hide',
                    options: e,
                    async fn(t) {
                      let { rects: r } = t,
                        n = en(e, t),
                        { strategy: o = 'referenceHidden' } = n,
                        i = ej(n, eg);
                      switch (o) {
                        case 'referenceHidden': {
                          let e = eR(
                            await eC(
                              t,
                              eP(eP({}, i), {}, { elementContext: 'reference' })
                            ),
                            r.reference
                          );
                          return {
                            data: {
                              referenceHiddenOffsets: e,
                              referenceHidden: eD(e),
                            },
                          };
                        }
                        case 'escaped': {
                          let e = eR(
                            await eC(t, eP(eP({}, i), {}, { altBoundary: !0 })),
                            r.floating
                          );
                          return {
                            data: { escapedOffsets: e, escaped: eD(e) },
                          };
                        }
                        default:
                          return {};
                      }
                    },
                  }
                );
              })(e)
            ),
            {},
            { options: [e, t] }
          ),
        tm = (e, t) => tn(tn({}, tc(e)), {}, { options: [e, t] }),
        ty = ['children', 'width', 'height'];
      function tb(e, t) {
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
      function th(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? tb(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : tb(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var tg = l.forwardRef((e, t) => {
        let { children: r, width: n = 10, height: o = 5 } = e,
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
          })(e, ty);
        return (0, v.jsx)(
          w.WV.svg,
          th(
            th({}, i),
            {},
            {
              ref: t,
              width: n,
              height: o,
              viewBox: '0 0 30 10',
              preserveAspectRatio: 'none',
              children: e.asChild
                ? r
                : (0, v.jsx)('polygon', { points: '0,0 30,0 15,10' }),
            }
          )
        );
      });
      tg.displayName = 'Arrow';
      let tw = ['__scopePopper', 'virtualRef'],
        tO = [
          '__scopePopper',
          'side',
          'sideOffset',
          'align',
          'alignOffset',
          'arrowPadding',
          'avoidCollisions',
          'collisionBoundary',
          'collisionPadding',
          'sticky',
          'hideWhenDetached',
          'updatePositionStrategy',
          'onPlaced',
        ],
        tj = ['__scopePopper'];
      function tx(e, t) {
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
      function tP(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? tx(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : tx(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      function tS(e, t) {
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
      var tE = 'Popper',
        [tC, tR] = (0, f.b)(tE),
        [tD, tk] = tC(tE),
        tT = e => {
          let { __scopePopper: t, children: r } = e,
            [n, o] = l.useState(null);
          return (0, v.jsx)(tD, {
            scope: t,
            anchor: n,
            onAnchorChange: o,
            children: r,
          });
        };
      tT.displayName = tE;
      var tA = 'PopperAnchor',
        tM = l.forwardRef((e, t) => {
          let { __scopePopper: r, virtualRef: n } = e,
            o = tS(e, tw),
            i = tk(tA, r),
            a = l.useRef(null),
            c = (0, d.e)(t, a),
            u = l.useRef(null);
          return (
            l.useEffect(() => {
              let e = u.current;
              ((u.current = n?.current || a.current),
                e !== u.current && i.onAnchorChange(u.current));
            }),
            n ? null : (0, v.jsx)(w.WV.div, tP(tP({}, o), {}, { ref: c }))
          );
        });
      tM.displayName = tA;
      var tN = 'PopperContent',
        [tL, tW] = tC(tN),
        t_ = l.forwardRef((e, t) => {
          let {
              __scopePopper: r,
              side: n = 'bottom',
              sideOffset: o = 0,
              align: i = 'center',
              alignOffset: a = 0,
              arrowPadding: u = 0,
              avoidCollisions: s = !0,
              collisionBoundary: f = [],
              collisionPadding: p = 0,
              sticky: m = 'partial',
              hideWhenDetached: y = !1,
              updatePositionStrategy: b = 'optimized',
              onPlaced: h,
            } = e,
            g = tS(e, tO),
            j = tk(tN, r),
            [x, P] = l.useState(null),
            S = (0, d.e)(t, e => P(e)),
            [E, C] = l.useState(null),
            R = (function (e) {
              let [t, r] = l.useState(void 0);
              return (
                (0, $.b)(() => {
                  if (e) {
                    r({ width: e.offsetWidth, height: e.offsetHeight });
                    let t = new ResizeObserver(t => {
                      let n, o;
                      if (!Array.isArray(t) || !t.length) return;
                      let i = t[0];
                      if ('borderBoxSize' in i) {
                        let e = i.borderBoxSize,
                          t = Array.isArray(e) ? e[0] : e;
                        ((n = t.inlineSize), (o = t.blockSize));
                      } else ((n = e.offsetWidth), (o = e.offsetHeight));
                      r({ width: n, height: o });
                    });
                    return (
                      t.observe(e, { box: 'border-box' }),
                      () => t.unobserve(e)
                    );
                  }
                  r(void 0);
                }, [e]),
                t
              );
            })(E),
            D = R?.width ?? 0,
            k = R?.height ?? 0,
            T =
              'number' == typeof p
                ? p
                : tP({ top: 0, right: 0, bottom: 0, left: 0 }, p),
            A = Array.isArray(f) ? f : [f],
            M = A.length > 0,
            N = { padding: T, boundary: A.filter(tH), altBoundary: M },
            {
              refs: L,
              floatingStyles: W,
              placement: _,
              isPositioned: I,
              middlewareData: F,
            } = (function (e) {
              void 0 === e && (e = {});
              let {
                  placement: t = 'bottom',
                  strategy: r = 'absolute',
                  middleware: n = [],
                  platform: o,
                  elements: { reference: i, floating: a } = {},
                  transform: u = !0,
                  whileElementsMounted: s,
                  open: f,
                } = e,
                [d, p] = l.useState({
                  x: 0,
                  y: 0,
                  strategy: r,
                  placement: t,
                  middlewareData: {},
                  isPositioned: !1,
                }),
                [v, m] = l.useState(n);
              ti(v, n) || m(n);
              let [y, b] = l.useState(null),
                [h, g] = l.useState(null),
                w = l.useCallback(e => {
                  e !== P.current && ((P.current = e), b(e));
                }, []),
                O = l.useCallback(e => {
                  e !== S.current && ((S.current = e), g(e));
                }, []),
                j = i || y,
                x = a || h,
                P = l.useRef(null),
                S = l.useRef(null),
                E = l.useRef(d),
                C = null != s,
                R = ta(s),
                D = ta(o),
                k = ta(f),
                T = l.useCallback(() => {
                  if (!P.current || !S.current) return;
                  let e = { placement: t, strategy: r, middleware: v };
                  (D.current && (e.platform = D.current),
                    tt(P.current, S.current, e).then(e => {
                      let t = tn(
                        tn({}, e),
                        {},
                        { isPositioned: !1 !== k.current }
                      );
                      A.current &&
                        !ti(E.current, t) &&
                        ((E.current = t),
                        c.flushSync(() => {
                          p(t);
                        }));
                    }));
                }, [v, t, r, D, k]);
              to(() => {
                !1 === f &&
                  E.current.isPositioned &&
                  ((E.current.isPositioned = !1),
                  p(e => tn(tn({}, e), {}, { isPositioned: !1 })));
              }, [f]);
              let A = l.useRef(!1);
              (to(
                () => (
                  (A.current = !0),
                  () => {
                    A.current = !1;
                  }
                ),
                []
              ),
                to(() => {
                  if ((j && (P.current = j), x && (S.current = x), j && x)) {
                    if (R.current) return R.current(j, x, T);
                    T();
                  }
                }, [j, x, T, R, C]));
              let M = l.useMemo(
                  () => ({
                    reference: P,
                    floating: S,
                    setReference: w,
                    setFloating: O,
                  }),
                  [w, O]
                ),
                N = l.useMemo(() => ({ reference: j, floating: x }), [j, x]),
                L = l.useMemo(() => {
                  let e = { position: r, left: 0, top: 0 };
                  if (!N.floating) return e;
                  let t = tl(N.floating, d.x),
                    n = tl(N.floating, d.y);
                  return u
                    ? tn(
                        tn({}, e),
                        {},
                        { transform: 'translate(' + t + 'px, ' + n + 'px)' },
                        (N.floating, !1)
                      )
                    : { position: r, left: t, top: n };
                }, [r, u, N.floating, d.x, d.y]);
              return l.useMemo(
                () =>
                  tn(
                    tn({}, d),
                    {},
                    { update: T, refs: M, elements: N, floatingStyles: L }
                  ),
                [d, T, M, N, L]
              );
            })({
              strategy: 'fixed',
              placement: n + ('center' !== i ? '-' + i : ''),
              whileElementsMounted: (...e) =>
                (function (e, t, r, n) {
                  let o;
                  void 0 === n && (n = {});
                  let {
                      ancestorScroll: i = !0,
                      ancestorResize: l = !0,
                      elementResize: a = 'function' == typeof ResizeObserver,
                      layoutShift: c = 'function' ==
                        typeof IntersectionObserver,
                      animationFrame: u = !1,
                    } = n,
                    s = eJ(e),
                    f = i || l ? [...(s ? eU(s) : []), ...eU(t)] : [];
                  f.forEach(e => {
                    (i && e.addEventListener('scroll', r, { passive: !0 }),
                      l && e.addEventListener('resize', r));
                  });
                  let d =
                      s && c
                        ? (function (e, t) {
                            let r,
                              n = null,
                              o = eN(e);
                            function i() {
                              var e;
                              (clearTimeout(r),
                                null == (e = n) || e.disconnect(),
                                (n = null));
                            }
                            return (
                              (function l(a, c) {
                                (void 0 === a && (a = !1),
                                  void 0 === c && (c = 1),
                                  i());
                                let u = e.getBoundingClientRect(),
                                  { left: s, top: f, width: d, height: p } = u;
                                if ((a || t(), !d || !p)) return;
                                let v = Q(f),
                                  m = Q(o.clientWidth - (s + d)),
                                  y = {
                                    rootMargin:
                                      -v +
                                      'px ' +
                                      -m +
                                      'px ' +
                                      -Q(o.clientHeight - (f + p)) +
                                      'px ' +
                                      -Q(s) +
                                      'px',
                                    threshold: G(0, q(1, c)) || 1,
                                  },
                                  b = !0;
                                function h(t) {
                                  let n = t[0].intersectionRatio;
                                  if (n !== c) {
                                    if (!b) return l();
                                    n
                                      ? l(!1, n)
                                      : (r = setTimeout(() => {
                                          l(!1, 1e-7);
                                        }, 1e3));
                                  }
                                  (1 !== n ||
                                    e8(u, e.getBoundingClientRect()) ||
                                    l(),
                                    (b = !1));
                                }
                                try {
                                  n = new IntersectionObserver(
                                    h,
                                    eG(eG({}, y), {}, { root: o.ownerDocument })
                                  );
                                } catch (e) {
                                  n = new IntersectionObserver(h, y);
                                }
                                n.observe(e);
                              })(!0),
                              i
                            );
                          })(s, r)
                        : null,
                    p = -1,
                    v = null;
                  a &&
                    ((v = new ResizeObserver(e => {
                      let [n] = e;
                      (n &&
                        n.target === s &&
                        v &&
                        (v.unobserve(t),
                        cancelAnimationFrame(p),
                        (p = requestAnimationFrame(() => {
                          var e;
                          null == (e = v) || e.observe(t);
                        }))),
                        r());
                    })),
                    s && !u && v.observe(s),
                    v.observe(t));
                  let m = u ? e2(e) : null;
                  return (
                    u &&
                      (function t() {
                        let n = e2(e);
                        (m && !e8(m, n) && r(),
                          (m = n),
                          (o = requestAnimationFrame(t)));
                      })(),
                    r(),
                    () => {
                      var e;
                      (f.forEach(e => {
                        (i && e.removeEventListener('scroll', r),
                          l && e.removeEventListener('resize', r));
                      }),
                        null == d || d(),
                        null == (e = v) || e.disconnect(),
                        (v = null),
                        u && cancelAnimationFrame(o));
                    }
                  );
                })(...e, { animationFrame: 'always' === b }),
              elements: { reference: j.anchor },
              middleware: [
                tu({ mainAxis: o + k, alignmentAxis: a }),
                s &&
                  ts(
                    tP(
                      {
                        mainAxis: !0,
                        crossAxis: !1,
                        limiter: 'partial' === m ? tf() : void 0,
                      },
                      N
                    )
                  ),
                s && td(tP({}, N)),
                tp(
                  tP(
                    tP({}, N),
                    {},
                    {
                      apply: ({
                        elements: e,
                        rects: t,
                        availableWidth: r,
                        availableHeight: n,
                      }) => {
                        let { width: o, height: i } = t.reference,
                          l = e.floating.style;
                        (l.setProperty(
                          '--radix-popper-available-width',
                          `${r}px`
                        ),
                          l.setProperty(
                            '--radix-popper-available-height',
                            `${n}px`
                          ),
                          l.setProperty(
                            '--radix-popper-anchor-width',
                            `${o}px`
                          ),
                          l.setProperty(
                            '--radix-popper-anchor-height',
                            `${i}px`
                          ));
                      },
                    }
                  )
                ),
                E && tm({ element: E, padding: u }),
                tB({ arrowWidth: D, arrowHeight: k }),
                y && tv(tP({ strategy: 'referenceHidden' }, N)),
              ],
            }),
            [V, H] = tz(_),
            B = (0, O.W)(h);
          (0, $.b)(() => {
            I && B?.();
          }, [I, B]);
          let z = F.arrow?.x,
            K = F.arrow?.y,
            Z = F.arrow?.centerOffset !== 0,
            [Y, U] = l.useState();
          return (
            (0, $.b)(() => {
              x && U(window.getComputedStyle(x).zIndex);
            }, [x]),
            (0, v.jsx)('div', {
              ref: L.setFloating,
              'data-radix-popper-content-wrapper': '',
              style: tP(
                tP({}, W),
                {},
                {
                  transform: I ? W.transform : 'translate(0, -200%)',
                  minWidth: 'max-content',
                  zIndex: Y,
                  '--radix-popper-transform-origin': [
                    F.transformOrigin?.x,
                    F.transformOrigin?.y,
                  ].join(' '),
                },
                F.hide?.referenceHidden && {
                  visibility: 'hidden',
                  pointerEvents: 'none',
                }
              ),
              dir: e.dir,
              children: (0, v.jsx)(tL, {
                scope: r,
                placedSide: V,
                onArrowChange: C,
                arrowX: z,
                arrowY: K,
                shouldHideArrow: Z,
                children: (0, v.jsx)(
                  w.WV.div,
                  tP(
                    tP({ 'data-side': V, 'data-align': H }, g),
                    {},
                    {
                      ref: S,
                      style: tP(
                        tP({}, g.style),
                        {},
                        { animation: I ? void 0 : 'none' }
                      ),
                    }
                  )
                ),
              }),
            })
          );
        });
      t_.displayName = tN;
      var tI = 'PopperArrow',
        tF = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' },
        tV = l.forwardRef(function (e, t) {
          let { __scopePopper: r } = e,
            n = tS(e, tj),
            o = tW(tI, r),
            i = tF[o.placedSide];
          return (0, v.jsx)('span', {
            ref: o.onArrowChange,
            style: {
              position: 'absolute',
              left: o.arrowX,
              top: o.arrowY,
              [i]: 0,
              transformOrigin: {
                top: '',
                right: '0 0',
                bottom: 'center 0',
                left: '100% 0',
              }[o.placedSide],
              transform: {
                top: 'translateY(100%)',
                right: 'translateY(50%) rotate(90deg) translateX(-50%)',
                bottom: 'rotate(180deg)',
                left: 'translateY(50%) rotate(-90deg) translateX(50%)',
              }[o.placedSide],
              visibility: o.shouldHideArrow ? 'hidden' : void 0,
            },
            children: (0, v.jsx)(
              tg,
              tP(
                tP({}, n),
                {},
                { ref: t, style: tP(tP({}, n.style), {}, { display: 'block' }) }
              )
            ),
          });
        });
      function tH(e) {
        return null !== e;
      }
      tV.displayName = tI;
      var tB = e => ({
        name: 'transformOrigin',
        options: e,
        fn(t) {
          let { placement: r, rects: n, middlewareData: o } = t,
            i = o.arrow?.centerOffset !== 0,
            l = i ? 0 : e.arrowWidth,
            a = i ? 0 : e.arrowHeight,
            [c, u] = tz(r),
            s = { start: '0%', center: '50%', end: '100%' }[u],
            f = (o.arrow?.x ?? 0) + l / 2,
            d = (o.arrow?.y ?? 0) + a / 2,
            p = '',
            v = '';
          return (
            'bottom' === c
              ? ((p = i ? s : `${f}px`), (v = `${-a}px`))
              : 'top' === c
                ? ((p = i ? s : `${f}px`), (v = `${n.floating.height + a}px`))
                : 'right' === c
                  ? ((p = `${-a}px`), (v = i ? s : `${d}px`))
                  : 'left' === c &&
                    ((p = `${n.floating.width + a}px`), (v = i ? s : `${d}px`)),
            { data: { x: p, y: v } }
          );
        },
      });
      function tz(e) {
        let [t, r = 'center'] = e.split('-');
        return [t, r];
      }
      let t$ = ['container'];
      function tK(e, t) {
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
      function tZ(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? tK(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : tK(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var tY = l.forwardRef((e, t) => {
        let { container: r } = e,
          n = (function (e, t) {
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
          })(e, t$),
          [o, i] = l.useState(!1);
        (0, $.b)(() => i(!0), []);
        let a = r || (o && globalThis?.document?.body);
        return a
          ? c.createPortal(
              (0, v.jsx)(w.WV.div, tZ(tZ({}, n), {}, { ref: t })),
              a
            )
          : null;
      });
      tY.displayName = 'Portal';
      var tU = a[' useInsertionEffect '.trim().toString()] || $.b;
      function tX({
        prop: e,
        defaultProp: t,
        onChange: r = () => {},
        caller: n,
      }) {
        let [o, i, a] = (function ({ defaultProp: e, onChange: t }) {
            let [r, n] = l.useState(e),
              o = l.useRef(r),
              i = l.useRef(t);
            return (
              tU(() => {
                i.current = t;
              }, [t]),
              l.useEffect(() => {
                o.current !== r && (i.current?.(r), (o.current = r));
              }, [r, o]),
              [r, n, i]
            );
          })({ defaultProp: t, onChange: r }),
          c = void 0 !== e,
          u = c ? e : o;
        {
          let t = l.useRef(void 0 !== e);
          l.useEffect(() => {
            let e = t.current;
            if (e !== c) {
              let t = c ? 'controlled' : 'uncontrolled';
              console.warn(
                `${n} is changing from ${e ? 'controlled' : 'uncontrolled'} to ${t}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
              );
            }
            t.current = c;
          }, [c, n]);
        }
        return [
          u,
          l.useCallback(
            t => {
              if (c) {
                let r = 'function' == typeof t ? t(e) : t;
                r !== e && a.current?.(r);
              } else i(t);
            },
            [c, e, i, a]
          ),
        ];
      }
      function tq(e, t) {
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
      function tG(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? tq(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : tq(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      Symbol('RADIX:SYNC_STATE');
      var tJ = Object.freeze({
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      });
      l.forwardRef((e, t) =>
        (0, v.jsx)(
          w.WV.span,
          tG(tG({}, e), {}, { ref: t, style: tG(tG({}, tJ), e.style) })
        )
      ).displayName = 'VisuallyHidden';
      var tQ = new WeakMap(),
        t0 = new WeakMap(),
        t1 = {},
        t2 = 0,
        t5 = function (e) {
          return e && (e.host || t5(e.parentNode));
        },
        t3 = function (e, t, r, n) {
          var o = (Array.isArray(e) ? e : [e])
            .map(function (e) {
              if (t.contains(e)) return e;
              var r = t5(e);
              return r && t.contains(r)
                ? r
                : (console.error(
                    'aria-hidden',
                    e,
                    'in not contained inside',
                    t,
                    '. Doing nothing'
                  ),
                  null);
            })
            .filter(function (e) {
              return !!e;
            });
          t1[r] || (t1[r] = new WeakMap());
          var i = t1[r],
            l = [],
            a = new Set(),
            c = new Set(o),
            u = function (e) {
              !e || a.has(e) || (a.add(e), u(e.parentNode));
            };
          o.forEach(u);
          var s = function (e) {
            !e ||
              c.has(e) ||
              Array.prototype.forEach.call(e.children, function (e) {
                if (a.has(e)) s(e);
                else
                  try {
                    var t = e.getAttribute(n),
                      o = null !== t && 'false' !== t,
                      c = (tQ.get(e) || 0) + 1,
                      u = (i.get(e) || 0) + 1;
                    (tQ.set(e, c),
                      i.set(e, u),
                      l.push(e),
                      1 === c && o && t0.set(e, !0),
                      1 === u && e.setAttribute(r, 'true'),
                      o || e.setAttribute(n, 'true'));
                  } catch (t) {
                    console.error('aria-hidden: cannot operate on ', e, t);
                  }
              });
          };
          return (
            s(t),
            a.clear(),
            t2++,
            function () {
              (l.forEach(function (e) {
                var t = tQ.get(e) - 1,
                  o = i.get(e) - 1;
                (tQ.set(e, t),
                  i.set(e, o),
                  t || (t0.has(e) || e.removeAttribute(n), t0.delete(e)),
                  o || e.removeAttribute(r));
              }),
                --t2 ||
                  ((tQ = new WeakMap()),
                  (tQ = new WeakMap()),
                  (t0 = new WeakMap()),
                  (t1 = {})));
            }
          );
        },
        t6 = function (e, t, r) {
          void 0 === r && (r = 'data-aria-hidden');
          var n,
            o = Array.from(Array.isArray(e) ? e : [e]),
            i =
              t ||
              ((n = e),
              'undefined' == typeof document
                ? null
                : (Array.isArray(n) ? n[0] : n).ownerDocument.body);
          return i
            ? (o.push.apply(
                o,
                Array.from(i.querySelectorAll('[aria-live], script'))
              ),
              t3(o, i, r, 'aria-hidden'))
            : function () {
                return null;
              };
        },
        t4 = function () {
          return (t4 =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var o in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
              return e;
            }).apply(this, arguments);
        };
      function t7(e, t) {
        var r = {};
        for (var n in e)
          Object.prototype.hasOwnProperty.call(e, n) &&
            0 > t.indexOf(n) &&
            (r[n] = e[n]);
        if (null != e && 'function' == typeof Object.getOwnPropertySymbols)
          for (
            var o = 0, n = Object.getOwnPropertySymbols(e);
            o < n.length;
            o++
          )
            0 > t.indexOf(n[o]) &&
              Object.prototype.propertyIsEnumerable.call(e, n[o]) &&
              (r[n[o]] = e[n[o]]);
        return r;
      }
      (Object.create, Object.create);
      var t9 =
          ('function' == typeof SuppressedError && SuppressedError,
          'right-scroll-bar-position'),
        t8 = 'width-before-scroll-bar';
      function re(e, t) {
        return ('function' == typeof e ? e(t) : e && (e.current = t), e);
      }
      var rt = l.useEffect,
        rr = new WeakMap();
      function rn(e) {
        return e;
      }
      var ro = (function (e) {
          void 0 === e && (e = {});
          var t,
            r,
            n,
            o =
              (void 0 === t && (t = rn),
              (r = []),
              (n = !1),
              {
                read: function () {
                  if (n)
                    throw Error(
                      'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.'
                    );
                  return r.length ? r[r.length - 1] : null;
                },
                useMedium: function (e) {
                  var o = t(e, n);
                  return (
                    r.push(o),
                    function () {
                      r = r.filter(function (e) {
                        return e !== o;
                      });
                    }
                  );
                },
                assignSyncMedium: function (e) {
                  for (n = !0; r.length; ) {
                    var t = r;
                    ((r = []), t.forEach(e));
                  }
                  r = {
                    push: function (t) {
                      return e(t);
                    },
                    filter: function () {
                      return r;
                    },
                  };
                },
                assignMedium: function (e) {
                  n = !0;
                  var t = [];
                  if (r.length) {
                    var o = r;
                    ((r = []), o.forEach(e), (t = r));
                  }
                  var i = function () {
                      var r = t;
                      ((t = []), r.forEach(e));
                    },
                    l = function () {
                      return Promise.resolve().then(i);
                    };
                  (l(),
                    (r = {
                      push: function (e) {
                        (t.push(e), l());
                      },
                      filter: function (e) {
                        return ((t = t.filter(e)), r);
                      },
                    }));
                },
              });
          return ((o.options = t4({ async: !0, ssr: !1 }, e)), o);
        })(),
        ri = function () {},
        rl = l.forwardRef(function (e, t) {
          var r,
            n,
            o,
            i,
            a = l.useRef(null),
            c = l.useState({
              onScrollCapture: ri,
              onWheelCapture: ri,
              onTouchMoveCapture: ri,
            }),
            u = c[0],
            s = c[1],
            f = e.forwardProps,
            d = e.children,
            p = e.className,
            v = e.removeScrollBar,
            m = e.enabled,
            y = e.shards,
            b = e.sideCar,
            h = e.noRelative,
            g = e.noIsolation,
            w = e.inert,
            O = e.allowPinchZoom,
            j = e.as,
            x = e.gapMode,
            P = t7(e, [
              'forwardProps',
              'children',
              'className',
              'removeScrollBar',
              'enabled',
              'shards',
              'sideCar',
              'noRelative',
              'noIsolation',
              'inert',
              'allowPinchZoom',
              'as',
              'gapMode',
            ]),
            S =
              ((r = [a, t]),
              (n = function (e) {
                return r.forEach(function (t) {
                  return re(t, e);
                });
              }),
              ((o = (0, l.useState)(function () {
                return {
                  value: null,
                  callback: n,
                  facade: {
                    get current() {
                      return o.value;
                    },
                    set current(value) {
                      var e = o.value;
                      e !== value && ((o.value = value), o.callback(value, e));
                    },
                  },
                };
              })[0]).callback = n),
              (i = o.facade),
              rt(
                function () {
                  var e = rr.get(i);
                  if (e) {
                    var t = new Set(e),
                      n = new Set(r),
                      o = i.current;
                    (t.forEach(function (e) {
                      n.has(e) || re(e, null);
                    }),
                      n.forEach(function (e) {
                        t.has(e) || re(e, o);
                      }));
                  }
                  rr.set(i, r);
                },
                [r]
              ),
              i),
            E = t4(t4({}, P), u);
          return l.createElement(
            l.Fragment,
            null,
            m &&
              l.createElement(b, {
                sideCar: ro,
                removeScrollBar: v,
                shards: y,
                noRelative: h,
                noIsolation: g,
                inert: w,
                setCallbacks: s,
                allowPinchZoom: !!O,
                lockRef: a,
                gapMode: x,
              }),
            f
              ? l.cloneElement(l.Children.only(d), t4(t4({}, E), { ref: S }))
              : l.createElement(
                  void 0 === j ? 'div' : j,
                  t4({}, E, { className: p, ref: S }),
                  d
                )
          );
        });
      ((rl.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 }),
        (rl.classNames = { fullWidth: t8, zeroRight: t9 }));
      var ra = function (e) {
        var t = e.sideCar,
          r = t7(e, ['sideCar']);
        if (!t)
          throw Error(
            'Sidecar: please provide `sideCar` property to import the right car'
          );
        var n = t.read();
        if (!n) throw Error('Sidecar medium not found');
        return l.createElement(n, t4({}, r));
      };
      ra.isSideCarExport = !0;
      var rc = function () {
          var e = 0,
            t = null;
          return {
            add: function (n) {
              if (
                0 == e &&
                (t = (function () {
                  if (!document) return null;
                  var e = document.createElement('style');
                  e.type = 'text/css';
                  var t = i || r.nc;
                  return (t && e.setAttribute('nonce', t), e);
                })())
              ) {
                var o, l;
                ((o = t).styleSheet
                  ? (o.styleSheet.cssText = n)
                  : o.appendChild(document.createTextNode(n)),
                  (l = t),
                  (
                    document.head || document.getElementsByTagName('head')[0]
                  ).appendChild(l));
              }
              e++;
            },
            remove: function () {
              --e ||
                !t ||
                (t.parentNode && t.parentNode.removeChild(t), (t = null));
            },
          };
        },
        ru = function () {
          var e = rc();
          return function (t, r) {
            l.useEffect(
              function () {
                return (
                  e.add(t),
                  function () {
                    e.remove();
                  }
                );
              },
              [t && r]
            );
          };
        },
        rs = function () {
          var e = ru();
          return function (t) {
            return (e(t.styles, t.dynamic), null);
          };
        },
        rf = { left: 0, top: 0, right: 0, gap: 0 },
        rd = rs(),
        rp = 'data-scroll-locked',
        rv = function (e, t, r, n) {
          var o = e.left,
            i = e.top,
            l = e.right,
            a = e.gap;
          return (
            void 0 === r && (r = 'margin'),
            '\n  .'
              .concat('with-scroll-bars-hidden', ' {\n   overflow: hidden ')
              .concat(n, ';\n   padding-right: ')
              .concat(a, 'px ')
              .concat(n, ';\n  }\n  body[')
              .concat(rp, '] {\n    overflow: hidden ')
              .concat(n, ';\n    overscroll-behavior: contain;\n    ')
              .concat(
                [
                  t && 'position: relative '.concat(n, ';'),
                  'margin' === r &&
                    '\n    padding-left: '
                      .concat(o, 'px;\n    padding-top: ')
                      .concat(i, 'px;\n    padding-right: ')
                      .concat(
                        l,
                        'px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: '
                      )
                      .concat(a, 'px ')
                      .concat(n, ';\n    '),
                  'padding' === r &&
                    'padding-right: '.concat(a, 'px ').concat(n, ';'),
                ]
                  .filter(Boolean)
                  .join(''),
                '\n  }\n  \n  .'
              )
              .concat(t9, ' {\n    right: ')
              .concat(a, 'px ')
              .concat(n, ';\n  }\n  \n  .')
              .concat(t8, ' {\n    margin-right: ')
              .concat(a, 'px ')
              .concat(n, ';\n  }\n  \n  .')
              .concat(t9, ' .')
              .concat(t9, ' {\n    right: 0 ')
              .concat(n, ';\n  }\n  \n  .')
              .concat(t8, ' .')
              .concat(t8, ' {\n    margin-right: 0 ')
              .concat(n, ';\n  }\n  \n  body[')
              .concat(rp, '] {\n    ')
              .concat('--removed-body-scroll-bar-size', ': ')
              .concat(a, 'px;\n  }\n')
          );
        },
        rm = function () {
          var e = parseInt(document.body.getAttribute(rp) || '0', 10);
          return isFinite(e) ? e : 0;
        },
        ry = function () {
          l.useEffect(function () {
            return (
              document.body.setAttribute(rp, (rm() + 1).toString()),
              function () {
                var e = rm() - 1;
                e <= 0
                  ? document.body.removeAttribute(rp)
                  : document.body.setAttribute(rp, e.toString());
              }
            );
          }, []);
        },
        rb = function (e) {
          var t = e.noRelative,
            r = e.noImportant,
            n = e.gapMode,
            o = void 0 === n ? 'margin' : n;
          ry();
          var i = l.useMemo(
            function () {
              return rf;
            },
            [o]
          );
          return l.createElement(rd, {
            styles: rv(i, !t, o, r ? '' : '!important'),
          });
        },
        rh = function (e, t) {
          if (!(e instanceof Element)) return !1;
          var r = window.getComputedStyle(e);
          return (
            'hidden' !== r[t] &&
            !(
              r.overflowY === r.overflowX &&
              'TEXTAREA' !== e.tagName &&
              'visible' === r[t]
            )
          );
        },
        rg = function (e, t) {
          var r = t.ownerDocument,
            n = t;
          do {
            if (
              ('undefined' != typeof ShadowRoot &&
                n instanceof ShadowRoot &&
                (n = n.host),
              rw(e, n))
            ) {
              var o = rO(e, n);
              if (o[1] > o[2]) return !0;
            }
            n = n.parentNode;
          } while (n && n !== r.body);
          return !1;
        },
        rw = function (e, t) {
          return 'v' === e ? rh(t, 'overflowY') : rh(t, 'overflowX');
        },
        rO = function (e, t) {
          return 'v' === e
            ? [t.scrollTop, t.scrollHeight, t.clientHeight]
            : [t.scrollLeft, t.scrollWidth, t.clientWidth];
        },
        rj = function (e, t, r, n, o) {
          var i,
            l =
              ((i = window.getComputedStyle(t).direction),
              'h' === e && 'rtl' === i ? -1 : 1),
            a = l * n,
            c = r.target,
            u = t.contains(c),
            s = !1,
            f = a > 0,
            d = 0,
            p = 0;
          do {
            if (!c) break;
            var v = rO(e, c),
              m = v[0],
              y = v[1] - v[2] - l * m;
            (m || y) && rw(e, c) && ((d += y), (p += m));
            var b = c.parentNode;
            c = b && b.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? b.host : b;
          } while (
            (!u && c !== document.body) ||
            (u && (t.contains(c) || t === c))
          );
          return (
            f && ((o && 1 > Math.abs(d)) || (!o && a > d))
              ? (s = !0)
              : !f && ((o && 1 > Math.abs(p)) || (!o && -a > p)) && (s = !0),
            s
          );
        },
        rx = function (e) {
          return 'changedTouches' in e
            ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
            : [0, 0];
        },
        rP = function (e) {
          return [e.deltaX, e.deltaY];
        },
        rS = function (e) {
          return e && 'current' in e ? e.current : e;
        },
        rE = 0,
        rC = [];
      let rR =
        (ro.useMedium(function (e) {
          var t = l.useRef([]),
            r = l.useRef([0, 0]),
            n = l.useRef(),
            o = l.useState(rE++)[0],
            i = l.useState(rs)[0],
            a = l.useRef(e);
          (l.useEffect(
            function () {
              a.current = e;
            },
            [e]
          ),
            l.useEffect(
              function () {
                if (e.inert) {
                  document.body.classList.add('block-interactivity-'.concat(o));
                  var t = (function (e, t, r) {
                    if (r || 2 == arguments.length)
                      for (var n, o = 0, i = t.length; o < i; o++)
                        (!n && o in t) ||
                          (n || (n = Array.prototype.slice.call(t, 0, o)),
                          (n[o] = t[o]));
                    return e.concat(n || Array.prototype.slice.call(t));
                  })([e.lockRef.current], (e.shards || []).map(rS), !0).filter(
                    Boolean
                  );
                  return (
                    t.forEach(function (e) {
                      return e.classList.add('allow-interactivity-'.concat(o));
                    }),
                    function () {
                      (document.body.classList.remove(
                        'block-interactivity-'.concat(o)
                      ),
                        t.forEach(function (e) {
                          return e.classList.remove(
                            'allow-interactivity-'.concat(o)
                          );
                        }));
                    }
                  );
                }
              },
              [e.inert, e.lockRef.current, e.shards]
            ));
          var c = l.useCallback(function (e, t) {
              if (
                ('touches' in e && 2 === e.touches.length) ||
                ('wheel' === e.type && e.ctrlKey)
              )
                return !a.current.allowPinchZoom;
              var o,
                i = rx(e),
                l = r.current,
                c = 'deltaX' in e ? e.deltaX : l[0] - i[0],
                u = 'deltaY' in e ? e.deltaY : l[1] - i[1],
                s = e.target,
                f = Math.abs(c) > Math.abs(u) ? 'h' : 'v';
              if ('touches' in e && 'h' === f && 'range' === s.type) return !1;
              var d = rg(f, s);
              if (!d) return !0;
              if (
                (d ? (o = f) : ((o = 'v' === f ? 'h' : 'v'), (d = rg(f, s))),
                !d)
              )
                return !1;
              if (
                (!n.current &&
                  'changedTouches' in e &&
                  (c || u) &&
                  (n.current = o),
                !o)
              )
                return !0;
              var p = n.current || o;
              return rj(p, t, e, 'h' === p ? c : u, !0);
            }, []),
            u = l.useCallback(function (e) {
              if (rC.length && rC[rC.length - 1] === i) {
                var r = 'deltaY' in e ? rP(e) : rx(e),
                  n = t.current.filter(function (t) {
                    var n;
                    return (
                      t.name === e.type &&
                      (t.target === e.target || e.target === t.shadowParent) &&
                      (n = t.delta)[0] === r[0] &&
                      n[1] === r[1]
                    );
                  })[0];
                if (n && n.should) {
                  e.cancelable && e.preventDefault();
                  return;
                }
                if (!n) {
                  var o = (a.current.shards || [])
                    .map(rS)
                    .filter(Boolean)
                    .filter(function (t) {
                      return t.contains(e.target);
                    });
                  (o.length > 0 ? c(e, o[0]) : !a.current.noIsolation) &&
                    e.cancelable &&
                    e.preventDefault();
                }
              }
            }, []),
            s = l.useCallback(function (e, r, n, o) {
              var i = {
                name: e,
                delta: r,
                target: n,
                should: o,
                shadowParent: (function (e) {
                  for (var t = null; null !== e; )
                    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)),
                      (e = e.parentNode));
                  return t;
                })(n),
              };
              (t.current.push(i),
                setTimeout(function () {
                  t.current = t.current.filter(function (e) {
                    return e !== i;
                  });
                }, 1));
            }, []),
            f = l.useCallback(function (e) {
              ((r.current = rx(e)), (n.current = void 0));
            }, []),
            d = l.useCallback(function (t) {
              s(t.type, rP(t), t.target, c(t, e.lockRef.current));
            }, []),
            p = l.useCallback(function (t) {
              s(t.type, rx(t), t.target, c(t, e.lockRef.current));
            }, []);
          l.useEffect(function () {
            return (
              rC.push(i),
              e.setCallbacks({
                onScrollCapture: d,
                onWheelCapture: d,
                onTouchMoveCapture: p,
              }),
              document.addEventListener('wheel', u, !1),
              document.addEventListener('touchmove', u, !1),
              document.addEventListener('touchstart', f, !1),
              function () {
                ((rC = rC.filter(function (e) {
                  return e !== i;
                })),
                  document.removeEventListener('wheel', u, !1),
                  document.removeEventListener('touchmove', u, !1),
                  document.removeEventListener('touchstart', f, !1));
              }
            );
          }, []);
          var v = e.removeScrollBar,
            m = e.inert;
          return l.createElement(
            l.Fragment,
            null,
            m
              ? l.createElement(i, {
                  styles: '\n  .block-interactivity-'
                    .concat(
                      o,
                      ' {pointer-events: none;}\n  .allow-interactivity-'
                    )
                    .concat(o, ' {pointer-events: all;}\n'),
                })
              : null,
            v
              ? l.createElement(rb, {
                  noRelative: e.noRelative,
                  gapMode: e.gapMode,
                })
              : null
          );
        }),
        ra);
      var rD = l.forwardRef(function (e, t) {
        return l.createElement(rl, t4({}, e, { ref: t, sideCar: rR }));
      });
      rD.classNames = rl.classNames;
      let rk = ['__scopeSelect', 'disabled'],
        rT = ['__scopeSelect', 'className', 'style', 'children', 'placeholder'],
        rA = ['__scopeSelect', 'children'],
        rM = [
          '__scopeSelect',
          'position',
          'onCloseAutoFocus',
          'onEscapeKeyDown',
          'onPointerDownOutside',
          'side',
          'sideOffset',
          'align',
          'alignOffset',
          'arrowPadding',
          'collisionBoundary',
          'collisionPadding',
          'sticky',
          'hideWhenDetached',
          'avoidCollisions',
        ],
        rN = ['__scopeSelect', 'onPlaced'],
        rL = ['__scopeSelect', 'align', 'collisionPadding'],
        rW = ['__scopeSelect', 'nonce'],
        r_ = ['__scopeSelect'],
        rI = ['__scopeSelect'],
        rF = ['__scopeSelect', 'value', 'disabled', 'textValue'],
        rV = ['__scopeSelect', 'className', 'style'],
        rH = ['__scopeSelect'],
        rB = ['__scopeSelect', 'onAutoScroll'],
        rz = ['__scopeSelect'],
        r$ = ['__scopeSelect'],
        rK = ['__scopeSelect', 'value'];
      function rZ(e, t) {
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
      function rY(e, t) {
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
      function rU(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? rY(Object(r), !0).forEach(function (t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : rY(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var rX = [' ', 'Enter', 'ArrowUp', 'ArrowDown'],
        rq = [' ', 'Enter'],
        rG = 'Select',
        [rJ, rQ, r0] = (function (e) {
          let t = e + 'CollectionProvider',
            [r, n] = (0, f.b)(t),
            [o, i] = r(t, {
              collectionRef: { current: null },
              itemMap: new Map(),
            }),
            a = e => {
              let { scope: t, children: r } = e,
                n = l.useRef(null),
                i = l.useRef(new Map()).current;
              return (0, v.jsx)(o, {
                scope: t,
                itemMap: i,
                collectionRef: n,
                children: r,
              });
            };
          a.displayName = t;
          let c = e + 'CollectionSlot',
            u = (0, p.Z8)(c),
            s = l.forwardRef((e, t) => {
              let { scope: r, children: n } = e,
                o = i(c, r),
                l = (0, d.e)(t, o.collectionRef);
              return (0, v.jsx)(u, { ref: l, children: n });
            });
          s.displayName = c;
          let y = e + 'CollectionItemSlot',
            b = 'data-radix-collection-item',
            g = (0, p.Z8)(y),
            w = l.forwardRef((e, t) => {
              let { scope: r, children: n } = e,
                o = (function (e, t) {
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
                })(e, m),
                a = l.useRef(null),
                c = (0, d.e)(t, a),
                u = i(y, r);
              return (
                l.useEffect(
                  () => (
                    u.itemMap.set(a, h({ ref: a }, o)),
                    () => void u.itemMap.delete(a)
                  )
                ),
                (0, v.jsx)(
                  g,
                  h(h({}, { [b]: '' }), {}, { ref: c, children: n })
                )
              );
            });
          return (
            (w.displayName = y),
            [
              { Provider: a, Slot: s, ItemSlot: w },
              function (t) {
                let r = i(e + 'CollectionConsumer', t);
                return l.useCallback(() => {
                  let e = r.collectionRef.current;
                  if (!e) return [];
                  let t = Array.from(e.querySelectorAll(`[${b}]`));
                  return Array.from(r.itemMap.values()).sort(
                    (e, r) =>
                      t.indexOf(e.ref.current) - t.indexOf(r.ref.current)
                  );
                }, [r.collectionRef, r.itemMap]);
              },
              n,
            ]
          );
        })(rG),
        [r1, r2] = (0, f.b)(rG, [r0, tR]),
        r5 = tR(),
        [r3, r6] = r1(rG),
        [r4, r7] = r1(rG),
        r9 = e => {
          let {
              __scopeSelect: t,
              children: r,
              open: n,
              defaultOpen: o,
              onOpenChange: i,
              value: a,
              defaultValue: c,
              onValueChange: u,
              dir: s,
              name: f,
              autoComplete: d,
              disabled: p,
              required: m,
              form: y,
            } = e,
            b = r5(t),
            [h, w] = l.useState(null),
            [O, j] = l.useState(null),
            [x, P] = l.useState(!1),
            S = (0, g.gm)(s),
            [E, C] = tX({
              prop: n,
              defaultProp: o ?? !1,
              onChange: i,
              caller: rG,
            }),
            [R, D] = tX({ prop: a, defaultProp: c, onChange: u, caller: rG }),
            k = l.useRef(null),
            T = !h || y || !!h.closest('form'),
            [A, M] = l.useState(new Set()),
            N = Array.from(A)
              .map(e => e.props.value)
              .join(';');
          return (0, v.jsx)(
            tT,
            rU(
              rU({}, b),
              {},
              {
                children: (0, v.jsxs)(r3, {
                  required: m,
                  scope: t,
                  trigger: h,
                  onTriggerChange: w,
                  valueNode: O,
                  onValueNodeChange: j,
                  valueNodeHasChildren: x,
                  onValueNodeHasChildrenChange: P,
                  contentId: Y(),
                  value: R,
                  onValueChange: D,
                  open: E,
                  onOpenChange: C,
                  dir: S,
                  triggerPointerDownPosRef: k,
                  disabled: p,
                  children: [
                    (0, v.jsx)(rJ.Provider, {
                      scope: t,
                      children: (0, v.jsx)(r4, {
                        scope: e.__scopeSelect,
                        onNativeOptionAdd: l.useCallback(e => {
                          M(t => new Set(t).add(e));
                        }, []),
                        onNativeOptionRemove: l.useCallback(e => {
                          M(t => {
                            let r = new Set(t);
                            return (r.delete(e), r);
                          });
                        }, []),
                        children: r,
                      }),
                    }),
                    T
                      ? (0, v.jsxs)(
                          nI,
                          {
                            'aria-hidden': !0,
                            required: m,
                            tabIndex: -1,
                            name: f,
                            autoComplete: d,
                            value: R,
                            onChange: e => D(e.target.value),
                            disabled: p,
                            form: y,
                            children: [
                              void 0 === R
                                ? (0, v.jsx)('option', { value: '' })
                                : null,
                              Array.from(A),
                            ],
                          },
                          N
                        )
                      : null,
                  ],
                }),
              }
            )
          );
        };
      r9.displayName = rG;
      var r8 = 'SelectTrigger',
        ne = l.forwardRef((e, t) => {
          let { __scopeSelect: r, disabled: n = !1 } = e,
            o = rZ(e, rk),
            i = r5(r),
            a = r6(r8, r),
            c = a.disabled || n,
            u = (0, d.e)(t, a.onTriggerChange),
            f = rQ(r),
            p = l.useRef('touch'),
            [m, y, b] = nV(e => {
              let t = f().filter(e => !e.disabled),
                r = t.find(e => e.value === a.value),
                n = nH(t, e, r);
              void 0 !== n && a.onValueChange(n.value);
            }),
            h = e => {
              (c || (a.onOpenChange(!0), b()),
                e &&
                  (a.triggerPointerDownPosRef.current = {
                    x: Math.round(e.pageX),
                    y: Math.round(e.pageY),
                  }));
            };
          return (0, v.jsx)(
            tM,
            rU(
              rU({ asChild: !0 }, i),
              {},
              {
                children: (0, v.jsx)(
                  w.WV.button,
                  rU(
                    rU(
                      {
                        type: 'button',
                        role: 'combobox',
                        'aria-controls': a.contentId,
                        'aria-expanded': a.open,
                        'aria-required': a.required,
                        'aria-autocomplete': 'none',
                        dir: a.dir,
                        'data-state': a.open ? 'open' : 'closed',
                        disabled: c,
                        'data-disabled': c ? '' : void 0,
                        'data-placeholder': nF(a.value) ? '' : void 0,
                      },
                      o
                    ),
                    {},
                    {
                      ref: u,
                      onClick: (0, s.Mj)(o.onClick, e => {
                        (e.currentTarget.focus(),
                          'mouse' !== p.current && h(e));
                      }),
                      onPointerDown: (0, s.Mj)(o.onPointerDown, e => {
                        p.current = e.pointerType;
                        let t = e.target;
                        (t.hasPointerCapture(e.pointerId) &&
                          t.releasePointerCapture(e.pointerId),
                          0 === e.button &&
                            !1 === e.ctrlKey &&
                            'mouse' === e.pointerType &&
                            (h(e), e.preventDefault()));
                      }),
                      onKeyDown: (0, s.Mj)(o.onKeyDown, e => {
                        let t = '' !== m.current;
                        (e.ctrlKey ||
                          e.altKey ||
                          e.metaKey ||
                          1 !== e.key.length ||
                          y(e.key),
                          (!t || ' ' !== e.key) &&
                            rX.includes(e.key) &&
                            (h(), e.preventDefault()));
                      }),
                    }
                  )
                ),
              }
            )
          );
        });
      ne.displayName = r8;
      var nt = 'SelectValue',
        nr = l.forwardRef((e, t) => {
          let {
              __scopeSelect: r,
              className: n,
              style: o,
              children: i,
              placeholder: l = '',
            } = e,
            a = rZ(e, rT),
            c = r6(nt, r),
            { onValueNodeHasChildrenChange: u } = c,
            s = void 0 !== i,
            f = (0, d.e)(t, c.onValueNodeChange);
          return (
            (0, $.b)(() => {
              u(s);
            }, [u, s]),
            (0, v.jsx)(
              w.WV.span,
              rU(
                rU({}, a),
                {},
                {
                  ref: f,
                  style: { pointerEvents: 'none' },
                  children: nF(c.value)
                    ? (0, v.jsx)(v.Fragment, { children: l })
                    : i,
                }
              )
            )
          );
        });
      nr.displayName = nt;
      var nn = l.forwardRef((e, t) => {
        let { __scopeSelect: r, children: n } = e,
          o = rZ(e, rA);
        return (0, v.jsx)(
          w.WV.span,
          rU(rU({ 'aria-hidden': !0 }, o), {}, { ref: t, children: n || '▼' })
        );
      });
      nn.displayName = 'SelectIcon';
      var no = e => (0, v.jsx)(tY, rU({ asChild: !0 }, e));
      no.displayName = 'SelectPortal';
      var ni = 'SelectContent',
        nl = l.forwardRef((e, t) => {
          let r = r6(ni, e.__scopeSelect),
            [n, o] = l.useState();
          return ((0, $.b)(() => {
            o(new DocumentFragment());
          }, []),
          r.open)
            ? (0, v.jsx)(ns, rU(rU({}, e), {}, { ref: t }))
            : n
              ? c.createPortal(
                  (0, v.jsx)(na, {
                    scope: e.__scopeSelect,
                    children: (0, v.jsx)(rJ.Slot, {
                      scope: e.__scopeSelect,
                      children: (0, v.jsx)('div', { children: e.children }),
                    }),
                  }),
                  n
                )
              : null;
        });
      nl.displayName = ni;
      var [na, nc] = r1(ni),
        nu = (0, p.Z8)('SelectContent.RemoveScroll'),
        ns = l.forwardRef((e, t) => {
          let {
              __scopeSelect: r,
              position: n = 'item-aligned',
              onCloseAutoFocus: o,
              onEscapeKeyDown: i,
              onPointerDownOutside: a,
              side: c,
              sideOffset: u,
              align: f,
              alignOffset: p,
              arrowPadding: m,
              collisionBoundary: y,
              collisionPadding: b,
              sticky: h,
              hideWhenDetached: g,
              avoidCollisions: w,
            } = e,
            O = rZ(e, rM),
            j = r6(ni, r),
            [x, P] = l.useState(null),
            [S, E] = l.useState(null),
            R = (0, d.e)(t, e => P(e)),
            [D, A] = l.useState(null),
            [M, N] = l.useState(null),
            L = rQ(r),
            [W, _] = l.useState(!1),
            F = l.useRef(!1);
          (l.useEffect(() => {
            if (x) return t6(x);
          }, [x]),
            l.useEffect(() => {
              let e = document.querySelectorAll('[data-radix-focus-guard]');
              return (
                document.body.insertAdjacentElement('afterbegin', e[0] ?? T()),
                document.body.insertAdjacentElement('beforeend', e[1] ?? T()),
                k++,
                () => {
                  (1 === k &&
                    document
                      .querySelectorAll('[data-radix-focus-guard]')
                      .forEach(e => e.remove()),
                    k--);
                }
              );
            }, []));
          let V = l.useCallback(
              e => {
                let [t, ...r] = L().map(e => e.ref.current),
                  [n] = r.slice(-1),
                  o = document.activeElement;
                for (let r of e)
                  if (
                    r === o ||
                    (r?.scrollIntoView({ block: 'nearest' }),
                    r === t && S && (S.scrollTop = 0),
                    r === n && S && (S.scrollTop = S.scrollHeight),
                    r?.focus(),
                    document.activeElement !== o)
                  )
                    return;
              },
              [L, S]
            ),
            H = l.useCallback(() => V([D, x]), [V, D, x]);
          l.useEffect(() => {
            W && H();
          }, [W, H]);
          let { onOpenChange: B, triggerPointerDownPosRef: z } = j;
          (l.useEffect(() => {
            if (x) {
              let e = { x: 0, y: 0 },
                t = t => {
                  e = {
                    x: Math.abs(Math.round(t.pageX) - (z.current?.x ?? 0)),
                    y: Math.abs(Math.round(t.pageY) - (z.current?.y ?? 0)),
                  };
                },
                r = r => {
                  (e.x <= 10 && e.y <= 10
                    ? r.preventDefault()
                    : x.contains(r.target) || B(!1),
                    document.removeEventListener('pointermove', t),
                    (z.current = null));
                };
              return (
                null !== z.current &&
                  (document.addEventListener('pointermove', t),
                  document.addEventListener('pointerup', r, {
                    capture: !0,
                    once: !0,
                  })),
                () => {
                  (document.removeEventListener('pointermove', t),
                    document.removeEventListener('pointerup', r, {
                      capture: !0,
                    }));
                }
              );
            }
          }, [x, B, z]),
            l.useEffect(() => {
              let e = () => B(!1);
              return (
                window.addEventListener('blur', e),
                window.addEventListener('resize', e),
                () => {
                  (window.removeEventListener('blur', e),
                    window.removeEventListener('resize', e));
                }
              );
            }, [B]));
          let [$, K] = nV(e => {
              let t = L().filter(e => !e.disabled),
                r = t.find(e => e.ref.current === document.activeElement),
                n = nH(t, e, r);
              n && setTimeout(() => n.ref.current.focus());
            }),
            Z = l.useCallback(
              (e, t, r) => {
                let n = !F.current && !r;
                ((void 0 !== j.value && j.value === t) || n) &&
                  (A(e), n && (F.current = !0));
              },
              [j.value]
            ),
            Y = l.useCallback(() => x?.focus(), [x]),
            U = l.useCallback(
              (e, t, r) => {
                let n = !F.current && !r;
                ((void 0 !== j.value && j.value === t) || n) && N(e);
              },
              [j.value]
            ),
            X = 'popper' === n ? nd : nf,
            q =
              X === nd
                ? {
                    side: c,
                    sideOffset: u,
                    align: f,
                    alignOffset: p,
                    arrowPadding: m,
                    collisionBoundary: y,
                    collisionPadding: b,
                    sticky: h,
                    hideWhenDetached: g,
                    avoidCollisions: w,
                  }
                : {};
          return (0, v.jsx)(na, {
            scope: r,
            content: x,
            viewport: S,
            onViewportChange: E,
            itemRefCallback: Z,
            selectedItem: D,
            onItemLeave: Y,
            itemTextRefCallback: U,
            focusSelectedItem: H,
            selectedItemText: M,
            position: n,
            isPositioned: W,
            searchRef: $,
            children: (0, v.jsx)(rD, {
              as: nu,
              allowPinchZoom: !0,
              children: (0, v.jsx)(I, {
                asChild: !0,
                trapped: j.open,
                onMountAutoFocus: e => {
                  e.preventDefault();
                },
                onUnmountAutoFocus: (0, s.Mj)(o, e => {
                  (j.trigger?.focus({ preventScroll: !0 }), e.preventDefault());
                }),
                children: (0, v.jsx)(C, {
                  asChild: !0,
                  disableOutsidePointerEvents: !0,
                  onEscapeKeyDown: i,
                  onPointerDownOutside: a,
                  onFocusOutside: e => e.preventDefault(),
                  onDismiss: () => j.onOpenChange(!1),
                  children: (0, v.jsx)(
                    X,
                    rU(
                      rU(
                        rU(
                          {
                            role: 'listbox',
                            id: j.contentId,
                            'data-state': j.open ? 'open' : 'closed',
                            dir: j.dir,
                            onContextMenu: e => e.preventDefault(),
                          },
                          O
                        ),
                        q
                      ),
                      {},
                      {
                        onPlaced: () => _(!0),
                        ref: R,
                        style: rU(
                          {
                            display: 'flex',
                            flexDirection: 'column',
                            outline: 'none',
                          },
                          O.style
                        ),
                        onKeyDown: (0, s.Mj)(O.onKeyDown, e => {
                          let t = e.ctrlKey || e.altKey || e.metaKey;
                          if (
                            ('Tab' === e.key && e.preventDefault(),
                            t || 1 !== e.key.length || K(e.key),
                            ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                              e.key
                            ))
                          ) {
                            let t = L()
                              .filter(e => !e.disabled)
                              .map(e => e.ref.current);
                            if (
                              (['ArrowUp', 'End'].includes(e.key) &&
                                (t = t.slice().reverse()),
                              ['ArrowUp', 'ArrowDown'].includes(e.key))
                            ) {
                              let r = e.target,
                                n = t.indexOf(r);
                              t = t.slice(n + 1);
                            }
                            (setTimeout(() => V(t)), e.preventDefault());
                          }
                        }),
                      }
                    )
                  ),
                }),
              }),
            }),
          });
        });
      ns.displayName = 'SelectContentImpl';
      var nf = l.forwardRef((e, t) => {
        let { __scopeSelect: r, onPlaced: n } = e,
          o = rZ(e, rN),
          i = r6(ni, r),
          a = nc(ni, r),
          [c, s] = l.useState(null),
          [f, p] = l.useState(null),
          m = (0, d.e)(t, e => p(e)),
          y = rQ(r),
          b = l.useRef(!1),
          h = l.useRef(!0),
          {
            viewport: g,
            selectedItem: O,
            selectedItemText: j,
            focusSelectedItem: x,
          } = a,
          P = l.useCallback(() => {
            if (i.trigger && i.valueNode && c && f && g && O && j) {
              let e = i.trigger.getBoundingClientRect(),
                t = f.getBoundingClientRect(),
                r = i.valueNode.getBoundingClientRect(),
                o = j.getBoundingClientRect();
              if ('rtl' !== i.dir) {
                let n = o.left - t.left,
                  i = r.left - n,
                  l = e.left - i,
                  a = e.width + l,
                  s = Math.max(a, t.width),
                  f = window.innerWidth - 10,
                  d = (0, u.u)(i, [10, Math.max(10, f - s)]);
                ((c.style.minWidth = a + 'px'), (c.style.left = d + 'px'));
              } else {
                let n = t.right - o.right,
                  i = window.innerWidth - r.right - n,
                  l = window.innerWidth - e.right - i,
                  a = e.width + l,
                  s = Math.max(a, t.width),
                  f = window.innerWidth - 10,
                  d = (0, u.u)(i, [10, Math.max(10, f - s)]);
                ((c.style.minWidth = a + 'px'), (c.style.right = d + 'px'));
              }
              let l = y(),
                a = window.innerHeight - 20,
                s = g.scrollHeight,
                d = window.getComputedStyle(f),
                p = parseInt(d.borderTopWidth, 10),
                v = parseInt(d.paddingTop, 10),
                m = parseInt(d.borderBottomWidth, 10),
                h = p + v + s + parseInt(d.paddingBottom, 10) + m,
                w = Math.min(5 * O.offsetHeight, h),
                x = window.getComputedStyle(g),
                P = parseInt(x.paddingTop, 10),
                S = parseInt(x.paddingBottom, 10),
                E = e.top + e.height / 2 - 10,
                C = O.offsetHeight / 2,
                R = p + v + (O.offsetTop + C);
              if (R <= E) {
                let e = l.length > 0 && O === l[l.length - 1].ref.current;
                c.style.bottom = '0px';
                let t = f.clientHeight - g.offsetTop - g.offsetHeight;
                c.style.height =
                  R + Math.max(a - E, C + (e ? S : 0) + t + m) + 'px';
              } else {
                let e = l.length > 0 && O === l[0].ref.current;
                c.style.top = '0px';
                let t = Math.max(E, p + g.offsetTop + (e ? P : 0) + C);
                ((c.style.height = t + (h - R) + 'px'),
                  (g.scrollTop = R - E + g.offsetTop));
              }
              ((c.style.margin = '10px 0'),
                (c.style.minHeight = w + 'px'),
                (c.style.maxHeight = a + 'px'),
                n?.(),
                requestAnimationFrame(() => (b.current = !0)));
            }
          }, [y, i.trigger, i.valueNode, c, f, g, O, j, i.dir, n]);
        (0, $.b)(() => P(), [P]);
        let [S, E] = l.useState();
        (0, $.b)(() => {
          f && E(window.getComputedStyle(f).zIndex);
        }, [f]);
        let C = l.useCallback(
          e => {
            e && !0 === h.current && (P(), x?.(), (h.current = !1));
          },
          [P, x]
        );
        return (0, v.jsx)(np, {
          scope: r,
          contentWrapper: c,
          shouldExpandOnScrollRef: b,
          onScrollButtonChange: C,
          children: (0, v.jsx)('div', {
            ref: s,
            style: {
              display: 'flex',
              flexDirection: 'column',
              position: 'fixed',
              zIndex: S,
            },
            children: (0, v.jsx)(
              w.WV.div,
              rU(
                rU({}, o),
                {},
                {
                  ref: m,
                  style: rU(
                    { boxSizing: 'border-box', maxHeight: '100%' },
                    o.style
                  ),
                }
              )
            ),
          }),
        });
      });
      nf.displayName = 'SelectItemAlignedPosition';
      var nd = l.forwardRef((e, t) => {
        let {
            __scopeSelect: r,
            align: n = 'start',
            collisionPadding: o = 10,
          } = e,
          i = rZ(e, rL),
          l = r5(r);
        return (0, v.jsx)(
          t_,
          rU(
            rU(rU({}, l), i),
            {},
            {
              ref: t,
              align: n,
              collisionPadding: o,
              style: rU(rU({ boxSizing: 'border-box' }, i.style), {
                '--radix-select-content-transform-origin':
                  'var(--radix-popper-transform-origin)',
                '--radix-select-content-available-width':
                  'var(--radix-popper-available-width)',
                '--radix-select-content-available-height':
                  'var(--radix-popper-available-height)',
                '--radix-select-trigger-width':
                  'var(--radix-popper-anchor-width)',
                '--radix-select-trigger-height':
                  'var(--radix-popper-anchor-height)',
              }),
            }
          )
        );
      });
      nd.displayName = 'SelectPopperPosition';
      var [np, nv] = r1(ni, {}),
        nm = 'SelectViewport',
        ny = l.forwardRef((e, t) => {
          let { __scopeSelect: r, nonce: n } = e,
            o = rZ(e, rW),
            i = nc(nm, r),
            a = nv(nm, r),
            c = (0, d.e)(t, i.onViewportChange),
            u = l.useRef(0);
          return (0, v.jsxs)(v.Fragment, {
            children: [
              (0, v.jsx)('style', {
                dangerouslySetInnerHTML: {
                  __html:
                    '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}',
                },
                nonce: n,
              }),
              (0, v.jsx)(rJ.Slot, {
                scope: r,
                children: (0, v.jsx)(
                  w.WV.div,
                  rU(
                    rU(
                      {
                        'data-radix-select-viewport': '',
                        role: 'presentation',
                      },
                      o
                    ),
                    {},
                    {
                      ref: c,
                      style: rU(
                        {
                          position: 'relative',
                          flex: 1,
                          overflow: 'hidden auto',
                        },
                        o.style
                      ),
                      onScroll: (0, s.Mj)(o.onScroll, e => {
                        let t = e.currentTarget,
                          { contentWrapper: r, shouldExpandOnScrollRef: n } = a;
                        if (n?.current && r) {
                          let e = Math.abs(u.current - t.scrollTop);
                          if (e > 0) {
                            let n = window.innerHeight - 20,
                              o = Math.max(
                                parseFloat(r.style.minHeight),
                                parseFloat(r.style.height)
                              );
                            if (o < n) {
                              let i = o + e,
                                l = Math.min(n, i),
                                a = i - l;
                              ((r.style.height = l + 'px'),
                                '0px' === r.style.bottom &&
                                  ((t.scrollTop = a > 0 ? a : 0),
                                  (r.style.justifyContent = 'flex-end')));
                            }
                          }
                        }
                        u.current = t.scrollTop;
                      }),
                    }
                  )
                ),
              }),
            ],
          });
        });
      ny.displayName = nm;
      var nb = 'SelectGroup',
        [nh, ng] = r1(nb),
        nw = l.forwardRef((e, t) => {
          let { __scopeSelect: r } = e,
            n = rZ(e, r_),
            o = Y();
          return (0, v.jsx)(nh, {
            scope: r,
            id: o,
            children: (0, v.jsx)(
              w.WV.div,
              rU(rU({ role: 'group', 'aria-labelledby': o }, n), {}, { ref: t })
            ),
          });
        });
      nw.displayName = nb;
      var nO = 'SelectLabel',
        nj = l.forwardRef((e, t) => {
          let { __scopeSelect: r } = e,
            n = rZ(e, rI),
            o = ng(nO, r);
          return (0, v.jsx)(w.WV.div, rU(rU({ id: o.id }, n), {}, { ref: t }));
        });
      nj.displayName = nO;
      var nx = 'SelectItem',
        [nP, nS] = r1(nx),
        nE = l.forwardRef((e, t) => {
          let {
              __scopeSelect: r,
              value: n,
              disabled: o = !1,
              textValue: i,
            } = e,
            a = rZ(e, rF),
            c = r6(nx, r),
            u = nc(nx, r),
            f = c.value === n,
            [p, m] = l.useState(i ?? ''),
            [y, b] = l.useState(!1),
            h = (0, d.e)(t, e => u.itemRefCallback?.(e, n, o)),
            g = Y(),
            O = l.useRef('touch'),
            j = () => {
              o || (c.onValueChange(n), c.onOpenChange(!1));
            };
          if ('' === n)
            throw Error(
              'A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.'
            );
          return (0, v.jsx)(nP, {
            scope: r,
            value: n,
            disabled: o,
            textId: g,
            isSelected: f,
            onItemTextChange: l.useCallback(e => {
              m(t => t || (e?.textContent ?? '').trim());
            }, []),
            children: (0, v.jsx)(rJ.ItemSlot, {
              scope: r,
              value: n,
              disabled: o,
              textValue: p,
              children: (0, v.jsx)(
                w.WV.div,
                rU(
                  rU(
                    {
                      role: 'option',
                      'aria-labelledby': g,
                      'data-highlighted': y ? '' : void 0,
                      'aria-selected': f && y,
                      'data-state': f ? 'checked' : 'unchecked',
                      'aria-disabled': o || void 0,
                      'data-disabled': o ? '' : void 0,
                      tabIndex: o ? void 0 : -1,
                    },
                    a
                  ),
                  {},
                  {
                    ref: h,
                    onFocus: (0, s.Mj)(a.onFocus, () => b(!0)),
                    onBlur: (0, s.Mj)(a.onBlur, () => b(!1)),
                    onClick: (0, s.Mj)(a.onClick, () => {
                      'mouse' !== O.current && j();
                    }),
                    onPointerUp: (0, s.Mj)(a.onPointerUp, () => {
                      'mouse' === O.current && j();
                    }),
                    onPointerDown: (0, s.Mj)(a.onPointerDown, e => {
                      O.current = e.pointerType;
                    }),
                    onPointerMove: (0, s.Mj)(a.onPointerMove, e => {
                      ((O.current = e.pointerType),
                        o
                          ? u.onItemLeave?.()
                          : 'mouse' === O.current &&
                            e.currentTarget.focus({ preventScroll: !0 }));
                    }),
                    onPointerLeave: (0, s.Mj)(a.onPointerLeave, e => {
                      e.currentTarget === document.activeElement &&
                        u.onItemLeave?.();
                    }),
                    onKeyDown: (0, s.Mj)(a.onKeyDown, e => {
                      (u.searchRef?.current !== '' && ' ' === e.key) ||
                        (rq.includes(e.key) && j(),
                        ' ' === e.key && e.preventDefault());
                    }),
                  }
                )
              ),
            }),
          });
        });
      nE.displayName = nx;
      var nC = 'SelectItemText',
        nR = l.forwardRef((e, t) => {
          let { __scopeSelect: r, className: n, style: o } = e,
            i = rZ(e, rV),
            a = r6(nC, r),
            u = nc(nC, r),
            s = nS(nC, r),
            f = r7(nC, r),
            [p, m] = l.useState(null),
            y = (0, d.e)(
              t,
              e => m(e),
              s.onItemTextChange,
              e => u.itemTextRefCallback?.(e, s.value, s.disabled)
            ),
            b = p?.textContent,
            h = l.useMemo(
              () =>
                (0, v.jsx)(
                  'option',
                  { value: s.value, disabled: s.disabled, children: b },
                  s.value
                ),
              [s.disabled, s.value, b]
            ),
            { onNativeOptionAdd: g, onNativeOptionRemove: O } = f;
          return (
            (0, $.b)(() => (g(h), () => O(h)), [g, O, h]),
            (0, v.jsxs)(v.Fragment, {
              children: [
                (0, v.jsx)(
                  w.WV.span,
                  rU(rU({ id: s.textId }, i), {}, { ref: y })
                ),
                s.isSelected && a.valueNode && !a.valueNodeHasChildren
                  ? c.createPortal(i.children, a.valueNode)
                  : null,
              ],
            })
          );
        });
      nR.displayName = nC;
      var nD = 'SelectItemIndicator',
        nk = l.forwardRef((e, t) => {
          let { __scopeSelect: r } = e,
            n = rZ(e, rH);
          return nS(nD, r).isSelected
            ? (0, v.jsx)(
                w.WV.span,
                rU(rU({ 'aria-hidden': !0 }, n), {}, { ref: t })
              )
            : null;
        });
      nk.displayName = nD;
      var nT = 'SelectScrollUpButton',
        nA = l.forwardRef((e, t) => {
          let r = nc(nT, e.__scopeSelect),
            n = nv(nT, e.__scopeSelect),
            [o, i] = l.useState(!1),
            a = (0, d.e)(t, n.onScrollButtonChange);
          return (
            (0, $.b)(() => {
              if (r.viewport && r.isPositioned) {
                let e = function () {
                    i(t.scrollTop > 0);
                  },
                  t = r.viewport;
                return (
                  e(),
                  t.addEventListener('scroll', e),
                  () => t.removeEventListener('scroll', e)
                );
              }
            }, [r.viewport, r.isPositioned]),
            o
              ? (0, v.jsx)(
                  nL,
                  rU(
                    rU({}, e),
                    {},
                    {
                      ref: a,
                      onAutoScroll: () => {
                        let { viewport: e, selectedItem: t } = r;
                        e && t && (e.scrollTop = e.scrollTop - t.offsetHeight);
                      },
                    }
                  )
                )
              : null
          );
        });
      nA.displayName = nT;
      var nM = 'SelectScrollDownButton',
        nN = l.forwardRef((e, t) => {
          let r = nc(nM, e.__scopeSelect),
            n = nv(nM, e.__scopeSelect),
            [o, i] = l.useState(!1),
            a = (0, d.e)(t, n.onScrollButtonChange);
          return (
            (0, $.b)(() => {
              if (r.viewport && r.isPositioned) {
                let e = function () {
                    let e = t.scrollHeight - t.clientHeight;
                    i(Math.ceil(t.scrollTop) < e);
                  },
                  t = r.viewport;
                return (
                  e(),
                  t.addEventListener('scroll', e),
                  () => t.removeEventListener('scroll', e)
                );
              }
            }, [r.viewport, r.isPositioned]),
            o
              ? (0, v.jsx)(
                  nL,
                  rU(
                    rU({}, e),
                    {},
                    {
                      ref: a,
                      onAutoScroll: () => {
                        let { viewport: e, selectedItem: t } = r;
                        e && t && (e.scrollTop = e.scrollTop + t.offsetHeight);
                      },
                    }
                  )
                )
              : null
          );
        });
      nN.displayName = nM;
      var nL = l.forwardRef((e, t) => {
          let { __scopeSelect: r, onAutoScroll: n } = e,
            o = rZ(e, rB),
            i = nc('SelectScrollButton', r),
            a = l.useRef(null),
            c = rQ(r),
            u = l.useCallback(() => {
              null !== a.current &&
                (window.clearInterval(a.current), (a.current = null));
            }, []);
          return (
            l.useEffect(() => () => u(), [u]),
            (0, $.b)(() => {
              let e = c().find(e => e.ref.current === document.activeElement);
              e?.ref.current?.scrollIntoView({ block: 'nearest' });
            }, [c]),
            (0, v.jsx)(
              w.WV.div,
              rU(
                rU({ 'aria-hidden': !0 }, o),
                {},
                {
                  ref: t,
                  style: rU({ flexShrink: 0 }, o.style),
                  onPointerDown: (0, s.Mj)(o.onPointerDown, () => {
                    null === a.current &&
                      (a.current = window.setInterval(n, 50));
                  }),
                  onPointerMove: (0, s.Mj)(o.onPointerMove, () => {
                    (i.onItemLeave?.(),
                      null === a.current &&
                        (a.current = window.setInterval(n, 50)));
                  }),
                  onPointerLeave: (0, s.Mj)(o.onPointerLeave, () => {
                    u();
                  }),
                }
              )
            )
          );
        }),
        nW = l.forwardRef((e, t) => {
          let { __scopeSelect: r } = e,
            n = rZ(e, rz);
          return (0, v.jsx)(
            w.WV.div,
            rU(rU({ 'aria-hidden': !0 }, n), {}, { ref: t })
          );
        });
      nW.displayName = 'SelectSeparator';
      var n_ = 'SelectArrow';
      l.forwardRef((e, t) => {
        let { __scopeSelect: r } = e,
          n = rZ(e, r$),
          o = r5(r),
          i = r6(n_, r),
          l = nc(n_, r);
        return i.open && 'popper' === l.position
          ? (0, v.jsx)(tV, rU(rU(rU({}, o), n), {}, { ref: t }))
          : null;
      }).displayName = n_;
      var nI = l.forwardRef((e, t) => {
        let { __scopeSelect: r, value: n } = e,
          o = rZ(e, rK),
          i = l.useRef(null),
          a = (0, d.e)(t, i),
          c = (function (e) {
            let t = l.useRef({ value: e, previous: e });
            return l.useMemo(
              () => (
                t.current.value !== e &&
                  ((t.current.previous = t.current.value),
                  (t.current.value = e)),
                t.current.previous
              ),
              [e]
            );
          })(n);
        return (
          l.useEffect(() => {
            let e = i.current;
            if (!e) return;
            let t = Object.getOwnPropertyDescriptor(
              window.HTMLSelectElement.prototype,
              'value'
            ).set;
            if (c !== n && t) {
              let r = new Event('change', { bubbles: !0 });
              (t.call(e, n), e.dispatchEvent(r));
            }
          }, [c, n]),
          (0, v.jsx)(
            w.WV.select,
            rU(
              rU({}, o),
              {},
              { style: rU(rU({}, tJ), o.style), ref: a, defaultValue: n }
            )
          )
        );
      });
      function nF(e) {
        return '' === e || void 0 === e;
      }
      function nV(e) {
        let t = (0, O.W)(e),
          r = l.useRef(''),
          n = l.useRef(0),
          o = l.useCallback(
            e => {
              let o = r.current + e;
              (t(o),
                (function e(t) {
                  ((r.current = t),
                    window.clearTimeout(n.current),
                    '' !== t &&
                      (n.current = window.setTimeout(() => e(''), 1e3)));
                })(o));
            },
            [t]
          ),
          i = l.useCallback(() => {
            ((r.current = ''), window.clearTimeout(n.current));
          }, []);
        return (
          l.useEffect(() => () => window.clearTimeout(n.current), []),
          [r, o, i]
        );
      }
      function nH(e, t, r) {
        var n;
        let o = t.length > 1 && Array.from(t).every(e => e === t[0]) ? t[0] : t,
          i =
            ((n = Math.max(r ? e.indexOf(r) : -1, 0)),
            e.map((t, r) => e[(n + r) % e.length]));
        1 === o.length && (i = i.filter(e => e !== r));
        let l = i.find(e =>
          e.textValue.toLowerCase().startsWith(o.toLowerCase())
        );
        return l !== r ? l : void 0;
      }
      nI.displayName = 'SelectBubbleInput';
      var nB = r9,
        nz = ne,
        n$ = nr,
        nK = nn,
        nZ = no,
        nY = nl,
        nU = ny,
        nX = nw,
        nq = nj,
        nG = nE,
        nJ = nR,
        nQ = nk,
        n0 = nA,
        n1 = nN,
        n2 = nW;
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
