((exports.id = 6),
  (exports.ids = [6]),
  (exports.modules = {
    31975: (t, e, r) => {
      /*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ if (
        !globalThis.DOMException
      )
        try {
          let { MessageChannel: t } = r(71267),
            e = new t().port1,
            i = new ArrayBuffer();
          e.postMessage(i, [i, i]);
        } catch (t) {
          'DOMException' === t.constructor.name &&
            (globalThis.DOMException = t.constructor);
        }
      t.exports = globalThis.DOMException;
    },
    48006: (t, e, r) => {
      'use strict';
      r.d(e, { fileFromPath: () => y });
      var i,
        o,
        a = r(57147),
        n = r(71017),
        s = r(31975),
        c = r(65510);
      let l = t => Object.prototype.toString.call(t).slice(8, -1).toLowerCase(),
        f = function (t) {
          if ('object' !== l(t)) return !1;
          let e = Object.getPrototypeOf(t);
          return (
            null == e ||
            (e.constructor && e.constructor.toString()) === Object.toString()
          );
        };
      function u(t, e) {
        var r = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          (e &&
            (i = i.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            r.push.apply(r, i));
        }
        return r;
      }
      function p(t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? u(Object(r), !0).forEach(function (e) {
                var i, o;
                ((i = e),
                  (o = r[e]),
                  (i = (function (t) {
                    var e = (function (t, e) {
                      if ('object' != typeof t || null === t) return t;
                      var r = t[Symbol.toPrimitive];
                      if (void 0 !== r) {
                        var i = r.call(t, e || 'default');
                        if ('object' != typeof i) return i;
                        throw TypeError(
                          '@@toPrimitive must return a primitive value.'
                        );
                      }
                      return ('string' === e ? String : Number)(t);
                    })(t, 'string');
                    return 'symbol' == typeof e ? e : String(e);
                  })(i)) in t
                    ? Object.defineProperty(t, i, {
                        value: o,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (t[i] = o));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
              : u(Object(r)).forEach(function (e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(r, e)
                  );
                });
        }
        return t;
      }
      r(52568);
      var d = function (t, e, r, i, o) {
          if ('m' === i) throw TypeError('Private method is not writable');
          if ('a' === i && !o)
            throw TypeError('Private accessor was defined without a setter');
          if ('function' == typeof e ? t !== e || !o : !e.has(t))
            throw TypeError(
              'Cannot write private member to an object whose class did not declare it'
            );
          return (
            'a' === i ? o.call(t, r) : o ? (o.value = r) : e.set(t, r),
            r
          );
        },
        h = function (t, e, r, i) {
          if ('a' === r && !i)
            throw TypeError('Private accessor was defined without a getter');
          if ('function' == typeof e ? t !== e || !i : !e.has(t))
            throw TypeError(
              'Cannot read private member from an object whose class did not declare it'
            );
          return 'm' === r ? i : 'a' === r ? i.call(t) : i ? i.value : e.get(t);
        };
      class b {
        constructor(t) {
          (i.set(this, void 0),
            o.set(this, void 0),
            d(this, i, t.path, 'f'),
            d(this, o, t.start || 0, 'f'),
            (this.name = (0, n.basename)(h(this, i, 'f'))),
            (this.size = t.size),
            (this.lastModified = t.lastModified));
        }
        slice(t, e) {
          return new b({
            path: h(this, i, 'f'),
            lastModified: this.lastModified,
            size: e - t,
            start: t,
          });
        }
        async *stream() {
          let { mtimeMs: t } = await a.promises.stat(h(this, i, 'f'));
          if (t > this.lastModified)
            throw new s(
              'The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.',
              'NotReadableError'
            );
          this.size &&
            (yield* (0, a.createReadStream)(h(this, i, 'f'), {
              start: h(this, o, 'f'),
              end: h(this, o, 'f') + this.size - 1,
            }));
        }
        get [((i = new WeakMap()), (o = new WeakMap()), Symbol.toStringTag)]() {
          return 'File';
        }
      }
      async function y(t, e, r) {
        let i = await a.promises.stat(t);
        return (function (t, { mtimeMs: e, size: r }, i, o = {}) {
          let a;
          f(i) ? ([o, a] = [i, void 0]) : (a = i);
          let n = new b({ path: t, size: r, lastModified: e });
          return (
            a || (a = n.name),
            new c.$([n], a, p(p({}, o), {}, { lastModified: n.lastModified }))
          );
        })(t, i, e, r);
      }
    },
  }));
