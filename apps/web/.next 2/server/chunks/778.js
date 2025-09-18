((exports.id = 778),
  (exports.ids = [778]),
  (exports.modules = {
    93975: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = t.hkdf = void 0));
      let n = r(72018);
      function o(e, t) {
        if ('string' == typeof e) return new TextEncoder().encode(e);
        if (!(e instanceof Uint8Array))
          throw TypeError(
            `"${t}"" must be an instance of Uint8Array or a string`
          );
        return e;
      }
      async function i(e, t, r, i, a) {
        return (0, n.default)(
          (function (e) {
            switch (e) {
              case 'sha256':
              case 'sha384':
              case 'sha512':
              case 'sha1':
                return e;
              default:
                throw TypeError('unsupported "digest" value');
            }
          })(e),
          (function (e) {
            let t = o(e, 'ikm');
            if (!t.byteLength)
              throw TypeError('"ikm" must be at least one byte in length');
            return t;
          })(t),
          o(r, 'salt'),
          (function (e) {
            let t = o(e, 'info');
            if (t.byteLength > 1024)
              throw TypeError('"info" must not contain more than 1024 bytes');
            return t;
          })(i),
          (function (e, t) {
            if ('number' != typeof e || !Number.isInteger(e) || e < 1)
              throw TypeError('"keylen" must be a positive integer');
            if (e > 255 * (parseInt(t.substr(3), 10) >> 3 || 20))
              throw TypeError('"keylen" too large');
            return e;
          })(a, e)
        );
      }
      ((t.hkdf = i), (t.default = i));
    },
    70308: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113);
      t.default = (e, t, r, o, i) => {
        let a = parseInt(e.substr(3), 10) >> 3 || 20,
          s = (0, n.createHmac)(e, r.byteLength ? r : new Uint8Array(a))
            .update(t)
            .digest(),
          c = Math.ceil(i / a),
          l = new Uint8Array(a * c + o.byteLength + 1),
          u = 0,
          d = 0;
        for (let t = 1; t <= c; t++)
          (l.set(o, d),
            (l[d + o.byteLength] = t),
            l.set(
              (0, n.createHmac)(e, s)
                .update(l.subarray(u, d + o.byteLength + 1))
                .digest(),
              d
            ),
            (u = d),
            (d += a));
        return l.slice(0, i);
      };
    },
    72018: (e, t, r) => {
      'use strict';
      let n;
      Object.defineProperty(t, '__esModule', { value: !0 });
      let o = r(6113),
        i = r(70308);
      ('function' != typeof o.hkdf ||
        process.versions.electron ||
        (n = async (...e) =>
          new Promise((t, r) => {
            o.hkdf(...e, (e, n) => {
              e ? r(e) : t(new Uint8Array(n));
            });
          })),
        (t.default = async (e, t, r, o, a) => (n || i.default)(e, t, r, o, a)));
    },
    29706: (e, t) => {
      'use strict';
      /*!
       * cookie
       * Copyright(c) 2012-2014 Roman Shtylman
       * Copyright(c) 2015 Douglas Christopher Wilson
       * MIT Licensed
       */ ((t.parse = function (e, t) {
        if ('string' != typeof e)
          throw TypeError('argument str must be a string');
        var r = {},
          o = e.length;
        if (o < 2) return r;
        var i = (t && t.decode) || u,
          a = 0,
          s = 0,
          d = 0;
        do {
          if (-1 === (s = e.indexOf('=', a))) break;
          if (-1 === (d = e.indexOf(';', a))) d = o;
          else if (s > d) {
            a = e.lastIndexOf(';', s - 1) + 1;
            continue;
          }
          var p = c(e, a, s),
            f = l(e, s, p),
            h = e.slice(p, f);
          if (!n.call(r, h)) {
            var y = c(e, s + 1, d),
              g = l(e, d, y);
            34 === e.charCodeAt(y) && 34 === e.charCodeAt(g - 1) && (y++, g--);
            var v = e.slice(y, g);
            r[h] = (function (e, t) {
              try {
                return t(e);
              } catch (t) {
                return e;
              }
            })(v, i);
          }
          a = d + 1;
        } while (a < o);
        return r;
      }),
        (t.serialize = function (e, t, n) {
          var c = (n && n.encode) || encodeURIComponent;
          if ('function' != typeof c)
            throw TypeError('option encode is invalid');
          if (!o.test(e)) throw TypeError('argument name is invalid');
          var l = c(t);
          if (!i.test(l)) throw TypeError('argument val is invalid');
          var u = e + '=' + l;
          if (!n) return u;
          if (null != n.maxAge) {
            var d = Math.floor(n.maxAge);
            if (!isFinite(d)) throw TypeError('option maxAge is invalid');
            u += '; Max-Age=' + d;
          }
          if (n.domain) {
            if (!a.test(n.domain)) throw TypeError('option domain is invalid');
            u += '; Domain=' + n.domain;
          }
          if (n.path) {
            if (!s.test(n.path)) throw TypeError('option path is invalid');
            u += '; Path=' + n.path;
          }
          if (n.expires) {
            var p = n.expires;
            if ('[object Date]' !== r.call(p) || isNaN(p.valueOf()))
              throw TypeError('option expires is invalid');
            u += '; Expires=' + p.toUTCString();
          }
          if (
            (n.httpOnly && (u += '; HttpOnly'),
            n.secure && (u += '; Secure'),
            n.partitioned && (u += '; Partitioned'),
            n.priority)
          )
            switch (
              'string' == typeof n.priority
                ? n.priority.toLowerCase()
                : n.priority
            ) {
              case 'low':
                u += '; Priority=Low';
                break;
              case 'medium':
                u += '; Priority=Medium';
                break;
              case 'high':
                u += '; Priority=High';
                break;
              default:
                throw TypeError('option priority is invalid');
            }
          if (n.sameSite)
            switch (
              'string' == typeof n.sameSite
                ? n.sameSite.toLowerCase()
                : n.sameSite
            ) {
              case !0:
              case 'strict':
                u += '; SameSite=Strict';
                break;
              case 'lax':
                u += '; SameSite=Lax';
                break;
              case 'none':
                u += '; SameSite=None';
                break;
              default:
                throw TypeError('option sameSite is invalid');
            }
          return u;
        }));
      var r = Object.prototype.toString,
        n = Object.prototype.hasOwnProperty,
        o = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,
        i =
          /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/,
        a =
          /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,
        s = /^[\u0020-\u003A\u003D-\u007E]*$/;
      function c(e, t, r) {
        do {
          var n = e.charCodeAt(t);
          if (32 !== n && 9 !== n) return t;
        } while (++t < r);
        return r;
      }
      function l(e, t, r) {
        for (; t > r; ) {
          var n = e.charCodeAt(--t);
          if (32 !== n && 9 !== n) return t + 1;
        }
        return r;
      }
      function u(e) {
        return -1 !== e.indexOf('%') ? decodeURIComponent(e) : e;
      }
    },
    21704: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.cryptoRuntime =
          t.base64url =
          t.generateSecret =
          t.generateKeyPair =
          t.errors =
          t.decodeJwt =
          t.decodeProtectedHeader =
          t.importJWK =
          t.importX509 =
          t.importPKCS8 =
          t.importSPKI =
          t.exportJWK =
          t.exportSPKI =
          t.exportPKCS8 =
          t.UnsecuredJWT =
          t.createRemoteJWKSet =
          t.createLocalJWKSet =
          t.EmbeddedJWK =
          t.calculateJwkThumbprintUri =
          t.calculateJwkThumbprint =
          t.EncryptJWT =
          t.SignJWT =
          t.GeneralSign =
          t.FlattenedSign =
          t.CompactSign =
          t.FlattenedEncrypt =
          t.CompactEncrypt =
          t.jwtDecrypt =
          t.jwtVerify =
          t.generalVerify =
          t.flattenedVerify =
          t.compactVerify =
          t.GeneralEncrypt =
          t.generalDecrypt =
          t.flattenedDecrypt =
          t.compactDecrypt =
            void 0));
      var n = r(65124);
      Object.defineProperty(t, 'compactDecrypt', {
        enumerable: !0,
        get: function () {
          return n.compactDecrypt;
        },
      });
      var o = r(88726);
      Object.defineProperty(t, 'flattenedDecrypt', {
        enumerable: !0,
        get: function () {
          return o.flattenedDecrypt;
        },
      });
      var i = r(54914);
      Object.defineProperty(t, 'generalDecrypt', {
        enumerable: !0,
        get: function () {
          return i.generalDecrypt;
        },
      });
      var a = r(63257);
      Object.defineProperty(t, 'GeneralEncrypt', {
        enumerable: !0,
        get: function () {
          return a.GeneralEncrypt;
        },
      });
      var s = r(40955);
      Object.defineProperty(t, 'compactVerify', {
        enumerable: !0,
        get: function () {
          return s.compactVerify;
        },
      });
      var c = r(81618);
      Object.defineProperty(t, 'flattenedVerify', {
        enumerable: !0,
        get: function () {
          return c.flattenedVerify;
        },
      });
      var l = r(40317);
      Object.defineProperty(t, 'generalVerify', {
        enumerable: !0,
        get: function () {
          return l.generalVerify;
        },
      });
      var u = r(39311);
      Object.defineProperty(t, 'jwtVerify', {
        enumerable: !0,
        get: function () {
          return u.jwtVerify;
        },
      });
      var d = r(64894);
      Object.defineProperty(t, 'jwtDecrypt', {
        enumerable: !0,
        get: function () {
          return d.jwtDecrypt;
        },
      });
      var p = r(68220);
      Object.defineProperty(t, 'CompactEncrypt', {
        enumerable: !0,
        get: function () {
          return p.CompactEncrypt;
        },
      });
      var f = r(16380);
      Object.defineProperty(t, 'FlattenedEncrypt', {
        enumerable: !0,
        get: function () {
          return f.FlattenedEncrypt;
        },
      });
      var h = r(80364);
      Object.defineProperty(t, 'CompactSign', {
        enumerable: !0,
        get: function () {
          return h.CompactSign;
        },
      });
      var y = r(2265);
      Object.defineProperty(t, 'FlattenedSign', {
        enumerable: !0,
        get: function () {
          return y.FlattenedSign;
        },
      });
      var g = r(63835);
      Object.defineProperty(t, 'GeneralSign', {
        enumerable: !0,
        get: function () {
          return g.GeneralSign;
        },
      });
      var v = r(81281);
      Object.defineProperty(t, 'SignJWT', {
        enumerable: !0,
        get: function () {
          return v.SignJWT;
        },
      });
      var m = r(27405);
      Object.defineProperty(t, 'EncryptJWT', {
        enumerable: !0,
        get: function () {
          return m.EncryptJWT;
        },
      });
      var b = r(62715);
      (Object.defineProperty(t, 'calculateJwkThumbprint', {
        enumerable: !0,
        get: function () {
          return b.calculateJwkThumbprint;
        },
      }),
        Object.defineProperty(t, 'calculateJwkThumbprintUri', {
          enumerable: !0,
          get: function () {
            return b.calculateJwkThumbprintUri;
          },
        }));
      var _ = r(13306);
      Object.defineProperty(t, 'EmbeddedJWK', {
        enumerable: !0,
        get: function () {
          return _.EmbeddedJWK;
        },
      });
      var w = r(41204);
      Object.defineProperty(t, 'createLocalJWKSet', {
        enumerable: !0,
        get: function () {
          return w.createLocalJWKSet;
        },
      });
      var O = r(96178);
      Object.defineProperty(t, 'createRemoteJWKSet', {
        enumerable: !0,
        get: function () {
          return O.createRemoteJWKSet;
        },
      });
      var S = r(75311);
      Object.defineProperty(t, 'UnsecuredJWT', {
        enumerable: !0,
        get: function () {
          return S.UnsecuredJWT;
        },
      });
      var E = r(75248);
      (Object.defineProperty(t, 'exportPKCS8', {
        enumerable: !0,
        get: function () {
          return E.exportPKCS8;
        },
      }),
        Object.defineProperty(t, 'exportSPKI', {
          enumerable: !0,
          get: function () {
            return E.exportSPKI;
          },
        }),
        Object.defineProperty(t, 'exportJWK', {
          enumerable: !0,
          get: function () {
            return E.exportJWK;
          },
        }));
      var k = r(63359);
      (Object.defineProperty(t, 'importSPKI', {
        enumerable: !0,
        get: function () {
          return k.importSPKI;
        },
      }),
        Object.defineProperty(t, 'importPKCS8', {
          enumerable: !0,
          get: function () {
            return k.importPKCS8;
          },
        }),
        Object.defineProperty(t, 'importX509', {
          enumerable: !0,
          get: function () {
            return k.importX509;
          },
        }),
        Object.defineProperty(t, 'importJWK', {
          enumerable: !0,
          get: function () {
            return k.importJWK;
          },
        }));
      var P = r(69292);
      Object.defineProperty(t, 'decodeProtectedHeader', {
        enumerable: !0,
        get: function () {
          return P.decodeProtectedHeader;
        },
      });
      var j = r(80967);
      (Object.defineProperty(t, 'decodeJwt', {
        enumerable: !0,
        get: function () {
          return j.decodeJwt;
        },
      }),
        (t.errors = r(17389)));
      var A = r(45440);
      Object.defineProperty(t, 'generateKeyPair', {
        enumerable: !0,
        get: function () {
          return A.generateKeyPair;
        },
      });
      var x = r(98132);
      (Object.defineProperty(t, 'generateSecret', {
        enumerable: !0,
        get: function () {
          return x.generateSecret;
        },
      }),
        (t.base64url = r(87762)));
      var T = r(92339);
      Object.defineProperty(t, 'cryptoRuntime', {
        enumerable: !0,
        get: function () {
          return T.default;
        },
      });
    },
    65124: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.compactDecrypt = void 0));
      let i = r(88726),
        a = r(17389),
        s = r(51274);
      async function c(e, t, r) {
        if (
          (e instanceof Uint8Array && (e = s.decoder.decode(e)),
          'string' != typeof e)
        )
          throw new a.JWEInvalid('Compact JWE must be a string or Uint8Array');
        let { 0: n, 1: c, 2: l, 3: u, 4: d, length: p } = e.split('.');
        if (5 !== p) throw new a.JWEInvalid('Invalid Compact JWE');
        let f = await (0, i.flattenedDecrypt)(
            {
              ciphertext: u,
              iv: l || void 0,
              protected: n || void 0,
              tag: d || void 0,
              encrypted_key: c || void 0,
            },
            t,
            r
          ),
          h = { plaintext: f.plaintext, protectedHeader: f.protectedHeader };
        return 'function' == typeof t ? o(o({}, h), {}, { key: f.key }) : h;
      }
      t.compactDecrypt = c;
    },
    68220: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.CompactEncrypt = void 0));
      let n = r(16380);
      class o {
        constructor(e) {
          this._flattened = new n.FlattenedEncrypt(e);
        }
        setContentEncryptionKey(e) {
          return (this._flattened.setContentEncryptionKey(e), this);
        }
        setInitializationVector(e) {
          return (this._flattened.setInitializationVector(e), this);
        }
        setProtectedHeader(e) {
          return (this._flattened.setProtectedHeader(e), this);
        }
        setKeyManagementParameters(e) {
          return (this._flattened.setKeyManagementParameters(e), this);
        }
        async encrypt(e, t) {
          let r = await this._flattened.encrypt(e, t);
          return [r.protected, r.encrypted_key, r.iv, r.ciphertext, r.tag].join(
            '.'
          );
        }
      }
      t.CompactEncrypt = o;
    },
    88726: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.flattenedDecrypt = void 0));
      let i = r(62447),
        a = r(23402),
        s = r(83830),
        c = r(17389),
        l = r(66286),
        u = r(25686),
        d = r(54595),
        p = r(51274),
        f = r(90303),
        h = r(60565),
        y = r(85904);
      async function g(e, t, r) {
        var n;
        let g, v, m, b, _, w, O;
        if (!(0, u.default)(e))
          throw new c.JWEInvalid('Flattened JWE must be an object');
        if (
          void 0 === e.protected &&
          void 0 === e.header &&
          void 0 === e.unprotected
        )
          throw new c.JWEInvalid('JOSE Header missing');
        if ('string' != typeof e.iv)
          throw new c.JWEInvalid(
            'JWE Initialization Vector missing or incorrect type'
          );
        if ('string' != typeof e.ciphertext)
          throw new c.JWEInvalid('JWE Ciphertext missing or incorrect type');
        if ('string' != typeof e.tag)
          throw new c.JWEInvalid(
            'JWE Authentication Tag missing or incorrect type'
          );
        if (void 0 !== e.protected && 'string' != typeof e.protected)
          throw new c.JWEInvalid('JWE Protected Header incorrect type');
        if (void 0 !== e.encrypted_key && 'string' != typeof e.encrypted_key)
          throw new c.JWEInvalid('JWE Encrypted Key incorrect type');
        if (void 0 !== e.aad && 'string' != typeof e.aad)
          throw new c.JWEInvalid('JWE AAD incorrect type');
        if (void 0 !== e.header && !(0, u.default)(e.header))
          throw new c.JWEInvalid(
            'JWE Shared Unprotected Header incorrect type'
          );
        if (void 0 !== e.unprotected && !(0, u.default)(e.unprotected))
          throw new c.JWEInvalid(
            'JWE Per-Recipient Unprotected Header incorrect type'
          );
        if (e.protected)
          try {
            let t = (0, i.decode)(e.protected);
            g = JSON.parse(p.decoder.decode(t));
          } catch {
            throw new c.JWEInvalid('JWE Protected Header is invalid');
          }
        if (!(0, l.default)(g, e.header, e.unprotected))
          throw new c.JWEInvalid(
            'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint'
          );
        let S = o(o(o({}, g), e.header), e.unprotected);
        if (
          ((0, h.default)(
            c.JWEInvalid,
            new Map(),
            null == r ? void 0 : r.crit,
            g,
            S
          ),
          void 0 !== S.zip)
        ) {
          if (!g || !g.zip)
            throw new c.JWEInvalid(
              'JWE "zip" (Compression Algorithm) Header MUST be integrity protected'
            );
          if ('DEF' !== S.zip)
            throw new c.JOSENotSupported(
              'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value'
            );
        }
        let { alg: E, enc: k } = S;
        if ('string' != typeof E || !E)
          throw new c.JWEInvalid('missing JWE Algorithm (alg) in JWE Header');
        if ('string' != typeof k || !k)
          throw new c.JWEInvalid(
            'missing JWE Encryption Algorithm (enc) in JWE Header'
          );
        let P =
            r &&
            (0, y.default)(
              'keyManagementAlgorithms',
              r.keyManagementAlgorithms
            ),
          j =
            r &&
            (0, y.default)(
              'contentEncryptionAlgorithms',
              r.contentEncryptionAlgorithms
            );
        if (P && !P.has(E))
          throw new c.JOSEAlgNotAllowed(
            '"alg" (Algorithm) Header Parameter not allowed'
          );
        if (j && !j.has(k))
          throw new c.JOSEAlgNotAllowed(
            '"enc" (Encryption Algorithm) Header Parameter not allowed'
          );
        if (void 0 !== e.encrypted_key)
          try {
            v = (0, i.decode)(e.encrypted_key);
          } catch {
            throw new c.JWEInvalid(
              'Failed to base64url decode the encrypted_key'
            );
          }
        let A = !1;
        'function' == typeof t && ((t = await t(g, e)), (A = !0));
        try {
          m = await (0, d.default)(E, t, v, S, r);
        } catch (e) {
          if (
            e instanceof TypeError ||
            e instanceof c.JWEInvalid ||
            e instanceof c.JOSENotSupported
          )
            throw e;
          m = (0, f.default)(k);
        }
        try {
          b = (0, i.decode)(e.iv);
        } catch {
          throw new c.JWEInvalid('Failed to base64url decode the iv');
        }
        try {
          _ = (0, i.decode)(e.tag);
        } catch {
          throw new c.JWEInvalid('Failed to base64url decode the tag');
        }
        let x = p.encoder.encode(
          null !== (n = e.protected) && void 0 !== n ? n : ''
        );
        w =
          void 0 !== e.aad
            ? (0, p.concat)(x, p.encoder.encode('.'), p.encoder.encode(e.aad))
            : x;
        try {
          O = (0, i.decode)(e.ciphertext);
        } catch {
          throw new c.JWEInvalid('Failed to base64url decode the ciphertext');
        }
        let T = await (0, a.default)(k, m, O, b, _, w);
        'DEF' === S.zip &&
          (T = await ((null == r ? void 0 : r.inflateRaw) || s.inflate)(T));
        let C = { plaintext: T };
        if (
          (void 0 !== e.protected && (C.protectedHeader = g), void 0 !== e.aad)
        )
          try {
            C.additionalAuthenticatedData = (0, i.decode)(e.aad);
          } catch {
            throw new c.JWEInvalid('Failed to base64url decode the aad');
          }
        return (void 0 !== e.unprotected &&
          (C.sharedUnprotectedHeader = e.unprotected),
        void 0 !== e.header && (C.unprotectedHeader = e.header),
        A)
          ? o(o({}, C), {}, { key: t })
          : C;
      }
      t.flattenedDecrypt = g;
    },
    16380: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.FlattenedEncrypt = t.unprotected = void 0));
      let i = r(62447),
        a = r(43178),
        s = r(83830),
        c = r(77098),
        l = r(20091),
        u = r(17389),
        d = r(66286),
        p = r(51274),
        f = r(60565);
      t.unprotected = Symbol();
      class h {
        constructor(e) {
          if (!(e instanceof Uint8Array))
            throw TypeError('plaintext must be an instance of Uint8Array');
          this._plaintext = e;
        }
        setKeyManagementParameters(e) {
          if (this._keyManagementParameters)
            throw TypeError(
              'setKeyManagementParameters can only be called once'
            );
          return ((this._keyManagementParameters = e), this);
        }
        setProtectedHeader(e) {
          if (this._protectedHeader)
            throw TypeError('setProtectedHeader can only be called once');
          return ((this._protectedHeader = e), this);
        }
        setSharedUnprotectedHeader(e) {
          if (this._sharedUnprotectedHeader)
            throw TypeError(
              'setSharedUnprotectedHeader can only be called once'
            );
          return ((this._sharedUnprotectedHeader = e), this);
        }
        setUnprotectedHeader(e) {
          if (this._unprotectedHeader)
            throw TypeError('setUnprotectedHeader can only be called once');
          return ((this._unprotectedHeader = e), this);
        }
        setAdditionalAuthenticatedData(e) {
          return ((this._aad = e), this);
        }
        setContentEncryptionKey(e) {
          if (this._cek)
            throw TypeError('setContentEncryptionKey can only be called once');
          return ((this._cek = e), this);
        }
        setInitializationVector(e) {
          if (this._iv)
            throw TypeError('setInitializationVector can only be called once');
          return ((this._iv = e), this);
        }
        async encrypt(e, r) {
          let n, h, y, g, v, m, b;
          if (
            !this._protectedHeader &&
            !this._unprotectedHeader &&
            !this._sharedUnprotectedHeader
          )
            throw new u.JWEInvalid(
              'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()'
            );
          if (
            !(0, d.default)(
              this._protectedHeader,
              this._unprotectedHeader,
              this._sharedUnprotectedHeader
            )
          )
            throw new u.JWEInvalid(
              'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint'
            );
          let _ = o(
            o(o({}, this._protectedHeader), this._unprotectedHeader),
            this._sharedUnprotectedHeader
          );
          if (
            ((0, f.default)(
              u.JWEInvalid,
              new Map(),
              null == r ? void 0 : r.crit,
              this._protectedHeader,
              _
            ),
            void 0 !== _.zip)
          ) {
            if (!this._protectedHeader || !this._protectedHeader.zip)
              throw new u.JWEInvalid(
                'JWE "zip" (Compression Algorithm) Header MUST be integrity protected'
              );
            if ('DEF' !== _.zip)
              throw new u.JOSENotSupported(
                'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value'
              );
          }
          let { alg: w, enc: O } = _;
          if ('string' != typeof w || !w)
            throw new u.JWEInvalid(
              'JWE "alg" (Algorithm) Header Parameter missing or invalid'
            );
          if ('string' != typeof O || !O)
            throw new u.JWEInvalid(
              'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid'
            );
          if ('dir' === w) {
            if (this._cek)
              throw TypeError(
                'setContentEncryptionKey cannot be called when using Direct Encryption'
              );
          } else if ('ECDH-ES' === w && this._cek)
            throw TypeError(
              'setContentEncryptionKey cannot be called when using Direct Key Agreement'
            );
          {
            let i;
            (({
              cek: h,
              encryptedKey: n,
              parameters: i,
            } = await (0, l.default)(
              w,
              O,
              e,
              this._cek,
              this._keyManagementParameters
            )),
              i &&
                (r && t.unprotected in r
                  ? this._unprotectedHeader
                    ? (this._unprotectedHeader = o(
                        o({}, this._unprotectedHeader),
                        i
                      ))
                    : this.setUnprotectedHeader(i)
                  : this._protectedHeader
                    ? (this._protectedHeader = o(
                        o({}, this._protectedHeader),
                        i
                      ))
                    : this.setProtectedHeader(i)));
          }
          if (
            (this._iv || (this._iv = (0, c.default)(O)),
            (g = this._protectedHeader
              ? p.encoder.encode(
                  (0, i.encode)(JSON.stringify(this._protectedHeader))
                )
              : p.encoder.encode('')),
            this._aad
              ? ((v = (0, i.encode)(this._aad)),
                (y = (0, p.concat)(
                  g,
                  p.encoder.encode('.'),
                  p.encoder.encode(v)
                )))
              : (y = g),
            'DEF' === _.zip)
          ) {
            let e = await ((null == r ? void 0 : r.deflateRaw) || s.deflate)(
              this._plaintext
            );
            ({ ciphertext: m, tag: b } = await (0, a.default)(
              O,
              e,
              h,
              this._iv,
              y
            ));
          } else
            ({ ciphertext: m, tag: b } = await (0, a.default)(
              O,
              this._plaintext,
              h,
              this._iv,
              y
            ));
          let S = {
            ciphertext: (0, i.encode)(m),
            iv: (0, i.encode)(this._iv),
            tag: (0, i.encode)(b),
          };
          return (
            n && (S.encrypted_key = (0, i.encode)(n)),
            v && (S.aad = v),
            this._protectedHeader && (S.protected = p.decoder.decode(g)),
            this._sharedUnprotectedHeader &&
              (S.unprotected = this._sharedUnprotectedHeader),
            this._unprotectedHeader && (S.header = this._unprotectedHeader),
            S
          );
        }
      }
      t.FlattenedEncrypt = h;
    },
    54914: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.generalDecrypt = void 0));
      let n = r(88726),
        o = r(17389),
        i = r(25686);
      async function a(e, t, r) {
        if (!(0, i.default)(e))
          throw new o.JWEInvalid('General JWE must be an object');
        if (!Array.isArray(e.recipients) || !e.recipients.every(i.default))
          throw new o.JWEInvalid('JWE Recipients missing or incorrect type');
        if (!e.recipients.length)
          throw new o.JWEInvalid('JWE Recipients has no members');
        for (let o of e.recipients)
          try {
            return await (0, n.flattenedDecrypt)(
              {
                aad: e.aad,
                ciphertext: e.ciphertext,
                encrypted_key: o.encrypted_key,
                header: o.header,
                iv: e.iv,
                protected: e.protected,
                tag: e.tag,
                unprotected: e.unprotected,
              },
              t,
              r
            );
          } catch {}
        throw new o.JWEDecryptionFailed();
      }
      t.generalDecrypt = a;
    },
    63257: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.GeneralEncrypt = void 0));
      let i = r(16380),
        a = r(17389),
        s = r(90303),
        c = r(66286),
        l = r(20091),
        u = r(62447),
        d = r(60565);
      class p {
        constructor(e, t, r) {
          ((this.parent = e), (this.key = t), (this.options = r));
        }
        setUnprotectedHeader(e) {
          if (this.unprotectedHeader)
            throw TypeError('setUnprotectedHeader can only be called once');
          return ((this.unprotectedHeader = e), this);
        }
        addRecipient(...e) {
          return this.parent.addRecipient(...e);
        }
        encrypt(...e) {
          return this.parent.encrypt(...e);
        }
        done() {
          return this.parent;
        }
      }
      class f {
        constructor(e) {
          ((this._recipients = []), (this._plaintext = e));
        }
        addRecipient(e, t) {
          let r = new p(this, e, { crit: null == t ? void 0 : t.crit });
          return (this._recipients.push(r), r);
        }
        setProtectedHeader(e) {
          if (this._protectedHeader)
            throw TypeError('setProtectedHeader can only be called once');
          return ((this._protectedHeader = e), this);
        }
        setSharedUnprotectedHeader(e) {
          if (this._unprotectedHeader)
            throw TypeError(
              'setSharedUnprotectedHeader can only be called once'
            );
          return ((this._unprotectedHeader = e), this);
        }
        setAdditionalAuthenticatedData(e) {
          return ((this._aad = e), this);
        }
        async encrypt(e) {
          var t, r, n;
          let p;
          if (!this._recipients.length)
            throw new a.JWEInvalid('at least one recipient must be added');
          if (
            ((e = { deflateRaw: null == e ? void 0 : e.deflateRaw }),
            1 === this._recipients.length)
          ) {
            let [t] = this._recipients,
              r = await new i.FlattenedEncrypt(this._plaintext)
                .setAdditionalAuthenticatedData(this._aad)
                .setProtectedHeader(this._protectedHeader)
                .setSharedUnprotectedHeader(this._unprotectedHeader)
                .setUnprotectedHeader(t.unprotectedHeader)
                .encrypt(t.key, o(o({}, t.options), e)),
              n = {
                ciphertext: r.ciphertext,
                iv: r.iv,
                recipients: [{}],
                tag: r.tag,
              };
            return (
              r.aad && (n.aad = r.aad),
              r.protected && (n.protected = r.protected),
              r.unprotected && (n.unprotected = r.unprotected),
              r.encrypted_key &&
                (n.recipients[0].encrypted_key = r.encrypted_key),
              r.header && (n.recipients[0].header = r.header),
              n
            );
          }
          for (let e = 0; e < this._recipients.length; e++) {
            let t = this._recipients[e];
            if (
              !(0, c.default)(
                this._protectedHeader,
                this._unprotectedHeader,
                t.unprotectedHeader
              )
            )
              throw new a.JWEInvalid(
                'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint'
              );
            let r = o(
                o(o({}, this._protectedHeader), this._unprotectedHeader),
                t.unprotectedHeader
              ),
              { alg: n } = r;
            if ('string' != typeof n || !n)
              throw new a.JWEInvalid(
                'JWE "alg" (Algorithm) Header Parameter missing or invalid'
              );
            if ('dir' === n || 'ECDH-ES' === n)
              throw new a.JWEInvalid(
                '"dir" and "ECDH-ES" alg may only be used with a single recipient'
              );
            if ('string' != typeof r.enc || !r.enc)
              throw new a.JWEInvalid(
                'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid'
              );
            if (p) {
              if (p !== r.enc)
                throw new a.JWEInvalid(
                  'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients'
                );
            } else p = r.enc;
            if (
              ((0, d.default)(
                a.JWEInvalid,
                new Map(),
                t.options.crit,
                this._protectedHeader,
                r
              ),
              void 0 !== r.zip &&
                (!this._protectedHeader || !this._protectedHeader.zip))
            )
              throw new a.JWEInvalid(
                'JWE "zip" (Compression Algorithm) Header MUST be integrity protected'
              );
          }
          let f = (0, s.default)(p),
            h = { ciphertext: '', iv: '', recipients: [], tag: '' };
          for (let a = 0; a < this._recipients.length; a++) {
            let s = this._recipients[a],
              c = {};
            h.recipients.push(c);
            let d = o(
              o(o({}, this._protectedHeader), this._unprotectedHeader),
              s.unprotectedHeader
            ).alg.startsWith('PBES2')
              ? 2048 + a
              : void 0;
            if (0 === a) {
              let t = await new i.FlattenedEncrypt(this._plaintext)
                .setAdditionalAuthenticatedData(this._aad)
                .setContentEncryptionKey(f)
                .setProtectedHeader(this._protectedHeader)
                .setSharedUnprotectedHeader(this._unprotectedHeader)
                .setUnprotectedHeader(s.unprotectedHeader)
                .setKeyManagementParameters({ p2c: d })
                .encrypt(
                  s.key,
                  o(o(o({}, s.options), e), {}, { [i.unprotected]: !0 })
                );
              ((h.ciphertext = t.ciphertext),
                (h.iv = t.iv),
                (h.tag = t.tag),
                t.aad && (h.aad = t.aad),
                t.protected && (h.protected = t.protected),
                t.unprotected && (h.unprotected = t.unprotected),
                (c.encrypted_key = t.encrypted_key),
                t.header && (c.header = t.header));
              continue;
            }
            let { encryptedKey: y, parameters: g } = await (0, l.default)(
              (null === (t = s.unprotectedHeader) || void 0 === t
                ? void 0
                : t.alg) ||
                (null === (r = this._protectedHeader) || void 0 === r
                  ? void 0
                  : r.alg) ||
                (null === (n = this._unprotectedHeader) || void 0 === n
                  ? void 0
                  : n.alg),
              p,
              s.key,
              f,
              { p2c: d }
            );
            ((c.encrypted_key = (0, u.encode)(y)),
              (s.unprotectedHeader || g) &&
                (c.header = o(o({}, s.unprotectedHeader), g)));
          }
          return h;
        }
      }
      t.GeneralEncrypt = f;
    },
    13306: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.EmbeddedJWK = void 0));
      let i = r(63359),
        a = r(25686),
        s = r(17389);
      async function c(e, t) {
        let r = o(o({}, e), null == t ? void 0 : t.header);
        if (!(0, a.default)(r.jwk))
          throw new s.JWSInvalid(
            '"jwk" (JSON Web Key) Header Parameter must be a JSON object'
          );
        let n = await (0, i.importJWK)(
          o(o({}, r.jwk), {}, { ext: !0 }),
          r.alg,
          !0
        );
        if (n instanceof Uint8Array || 'public' !== n.type)
          throw new s.JWSInvalid(
            '"jwk" (JSON Web Key) Header Parameter must be a public key'
          );
        return n;
      }
      t.EmbeddedJWK = c;
    },
    62715: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.calculateJwkThumbprintUri = t.calculateJwkThumbprint = void 0));
      let n = r(96833),
        o = r(62447),
        i = r(17389),
        a = r(51274),
        s = r(25686),
        c = (e, t) => {
          if ('string' != typeof e || !e)
            throw new i.JWKInvalid(`${t} missing or invalid`);
        };
      async function l(e, t) {
        let r;
        if (!(0, s.default)(e)) throw TypeError('JWK must be an object');
        if (
          (null != t || (t = 'sha256'),
          'sha256' !== t && 'sha384' !== t && 'sha512' !== t)
        )
          throw TypeError(
            'digestAlgorithm must one of "sha256", "sha384", or "sha512"'
          );
        switch (e.kty) {
          case 'EC':
            (c(e.crv, '"crv" (Curve) Parameter'),
              c(e.x, '"x" (X Coordinate) Parameter'),
              c(e.y, '"y" (Y Coordinate) Parameter'),
              (r = { crv: e.crv, kty: e.kty, x: e.x, y: e.y }));
            break;
          case 'OKP':
            (c(e.crv, '"crv" (Subtype of Key Pair) Parameter'),
              c(e.x, '"x" (Public Key) Parameter'),
              (r = { crv: e.crv, kty: e.kty, x: e.x }));
            break;
          case 'RSA':
            (c(e.e, '"e" (Exponent) Parameter'),
              c(e.n, '"n" (Modulus) Parameter'),
              (r = { e: e.e, kty: e.kty, n: e.n }));
            break;
          case 'oct':
            (c(e.k, '"k" (Key Value) Parameter'), (r = { k: e.k, kty: e.kty }));
            break;
          default:
            throw new i.JOSENotSupported(
              '"kty" (Key Type) Parameter missing or unsupported'
            );
        }
        let l = a.encoder.encode(JSON.stringify(r));
        return (0, o.encode)(await (0, n.default)(t, l));
      }
      async function u(e, t) {
        null != t || (t = 'sha256');
        let r = await l(e, t);
        return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${r}`;
      }
      ((t.calculateJwkThumbprint = l), (t.calculateJwkThumbprintUri = u));
    },
    41204: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createLocalJWKSet = t.LocalJWKSet = t.isJWKSLike = void 0));
      let i = r(63359),
        a = r(17389),
        s = r(25686);
      function c(e) {
        return (
          e && 'object' == typeof e && Array.isArray(e.keys) && e.keys.every(l)
        );
      }
      function l(e) {
        return (0, s.default)(e);
      }
      t.isJWKSLike = c;
      class u {
        constructor(e) {
          if (((this._cached = new WeakMap()), !c(e)))
            throw new a.JWKSInvalid('JSON Web Key Set malformed');
          this._jwks = (function (e) {
            return 'function' == typeof structuredClone
              ? structuredClone(e)
              : JSON.parse(JSON.stringify(e));
          })(e);
        }
        async getKey(e, t) {
          let { alg: r, kid: n } = o(o({}, e), null == t ? void 0 : t.header),
            i = (function (e) {
              switch ('string' == typeof e && e.slice(0, 2)) {
                case 'RS':
                case 'PS':
                  return 'RSA';
                case 'ES':
                  return 'EC';
                case 'Ed':
                  return 'OKP';
                default:
                  throw new a.JOSENotSupported(
                    'Unsupported "alg" value for a JSON Web Key Set'
                  );
              }
            })(r),
            s = this._jwks.keys.filter(e => {
              let t = i === e.kty;
              if (
                (t && 'string' == typeof n && (t = n === e.kid),
                t && 'string' == typeof e.alg && (t = r === e.alg),
                t && 'string' == typeof e.use && (t = 'sig' === e.use),
                t &&
                  Array.isArray(e.key_ops) &&
                  (t = e.key_ops.includes('verify')),
                t &&
                  'EdDSA' === r &&
                  (t = 'Ed25519' === e.crv || 'Ed448' === e.crv),
                t)
              )
                switch (r) {
                  case 'ES256':
                    t = 'P-256' === e.crv;
                    break;
                  case 'ES256K':
                    t = 'secp256k1' === e.crv;
                    break;
                  case 'ES384':
                    t = 'P-384' === e.crv;
                    break;
                  case 'ES512':
                    t = 'P-521' === e.crv;
                }
              return t;
            }),
            { 0: c, length: l } = s;
          if (0 === l) throw new a.JWKSNoMatchingKey();
          if (1 !== l) {
            let e = new a.JWKSMultipleMatchingKeys(),
              { _cached: t } = this;
            throw (
              (e[Symbol.asyncIterator] = async function* () {
                for (let e of s)
                  try {
                    yield await d(t, e, r);
                  } catch {
                    continue;
                  }
              }),
              e
            );
          }
          return d(this._cached, c, r);
        }
      }
      async function d(e, t, r) {
        let n = e.get(t) || e.set(t, {}).get(t);
        if (void 0 === n[r]) {
          let e = await (0, i.importJWK)(o(o({}, t), {}, { ext: !0 }), r);
          if (e instanceof Uint8Array || 'public' !== e.type)
            throw new a.JWKSInvalid(
              'JSON Web Key Set members must be public keys'
            );
          n[r] = e;
        }
        return n[r];
      }
      ((t.LocalJWKSet = u),
        (t.createLocalJWKSet = function (e) {
          let t = new u(e);
          return async function (e, r) {
            return t.getKey(e, r);
          };
        }));
    },
    96178: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createRemoteJWKSet = void 0));
      let n = r(3791),
        o = r(17389),
        i = r(41204);
      class a extends i.LocalJWKSet {
        constructor(e, t) {
          if ((super({ keys: [] }), (this._jwks = void 0), !(e instanceof URL)))
            throw TypeError('url must be an instance of URL');
          ((this._url = new URL(e.href)),
            (this._options = {
              agent: null == t ? void 0 : t.agent,
              headers: null == t ? void 0 : t.headers,
            }),
            (this._timeoutDuration =
              'number' == typeof (null == t ? void 0 : t.timeoutDuration)
                ? null == t
                  ? void 0
                  : t.timeoutDuration
                : 5e3),
            (this._cooldownDuration =
              'number' == typeof (null == t ? void 0 : t.cooldownDuration)
                ? null == t
                  ? void 0
                  : t.cooldownDuration
                : 3e4),
            (this._cacheMaxAge =
              'number' == typeof (null == t ? void 0 : t.cacheMaxAge)
                ? null == t
                  ? void 0
                  : t.cacheMaxAge
                : 6e5));
        }
        coolingDown() {
          return (
            'number' == typeof this._jwksTimestamp &&
            Date.now() < this._jwksTimestamp + this._cooldownDuration
          );
        }
        fresh() {
          return (
            'number' == typeof this._jwksTimestamp &&
            Date.now() < this._jwksTimestamp + this._cacheMaxAge
          );
        }
        async getKey(e, t) {
          (this._jwks && this.fresh()) || (await this.reload());
          try {
            return await super.getKey(e, t);
          } catch (r) {
            if (r instanceof o.JWKSNoMatchingKey && !1 === this.coolingDown())
              return (await this.reload(), super.getKey(e, t));
            throw r;
          }
        }
        async reload() {
          (this._pendingFetch &&
            ('undefined' != typeof WebSocketPair ||
              ('undefined' != typeof navigator &&
                'Cloudflare-Workers' === navigator.userAgent) ||
              ('undefined' != typeof EdgeRuntime &&
                'vercel' === EdgeRuntime)) &&
            (this._pendingFetch = void 0),
            this._pendingFetch ||
              (this._pendingFetch = (0, n.default)(
                this._url,
                this._timeoutDuration,
                this._options
              )
                .then(e => {
                  if (!(0, i.isJWKSLike)(e))
                    throw new o.JWKSInvalid('JSON Web Key Set malformed');
                  ((this._jwks = { keys: e.keys }),
                    (this._jwksTimestamp = Date.now()),
                    (this._pendingFetch = void 0));
                })
                .catch(e => {
                  throw ((this._pendingFetch = void 0), e);
                })),
            await this._pendingFetch);
        }
      }
      t.createRemoteJWKSet = function (e, t) {
        let r = new a(e, t);
        return async function (e, t) {
          return r.getKey(e, t);
        };
      };
    },
    80364: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.CompactSign = void 0));
      let n = r(2265);
      class o {
        constructor(e) {
          this._flattened = new n.FlattenedSign(e);
        }
        setProtectedHeader(e) {
          return (this._flattened.setProtectedHeader(e), this);
        }
        async sign(e, t) {
          let r = await this._flattened.sign(e, t);
          if (void 0 === r.payload)
            throw TypeError(
              'use the flattened module for creating JWS with b64: false'
            );
          return `${r.protected}.${r.payload}.${r.signature}`;
        }
      }
      t.CompactSign = o;
    },
    40955: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.compactVerify = void 0));
      let i = r(81618),
        a = r(17389),
        s = r(51274);
      async function c(e, t, r) {
        if (
          (e instanceof Uint8Array && (e = s.decoder.decode(e)),
          'string' != typeof e)
        )
          throw new a.JWSInvalid('Compact JWS must be a string or Uint8Array');
        let { 0: n, 1: c, 2: l, length: u } = e.split('.');
        if (3 !== u) throw new a.JWSInvalid('Invalid Compact JWS');
        let d = await (0, i.flattenedVerify)(
            { payload: c, protected: n, signature: l },
            t,
            r
          ),
          p = { payload: d.payload, protectedHeader: d.protectedHeader };
        return 'function' == typeof t ? o(o({}, p), {}, { key: d.key }) : p;
      }
      t.compactVerify = c;
    },
    2265: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.FlattenedSign = void 0));
      let i = r(62447),
        a = r(4970),
        s = r(66286),
        c = r(17389),
        l = r(51274),
        u = r(54695),
        d = r(60565);
      class p {
        constructor(e) {
          if (!(e instanceof Uint8Array))
            throw TypeError('payload must be an instance of Uint8Array');
          this._payload = e;
        }
        setProtectedHeader(e) {
          if (this._protectedHeader)
            throw TypeError('setProtectedHeader can only be called once');
          return ((this._protectedHeader = e), this);
        }
        setUnprotectedHeader(e) {
          if (this._unprotectedHeader)
            throw TypeError('setUnprotectedHeader can only be called once');
          return ((this._unprotectedHeader = e), this);
        }
        async sign(e, t) {
          let r;
          if (!this._protectedHeader && !this._unprotectedHeader)
            throw new c.JWSInvalid(
              'either setProtectedHeader or setUnprotectedHeader must be called before #sign()'
            );
          if (!(0, s.default)(this._protectedHeader, this._unprotectedHeader))
            throw new c.JWSInvalid(
              'JWS Protected and JWS Unprotected Header Parameter names must be disjoint'
            );
          let n = o(o({}, this._protectedHeader), this._unprotectedHeader),
            p = (0, d.default)(
              c.JWSInvalid,
              new Map([['b64', !0]]),
              null == t ? void 0 : t.crit,
              this._protectedHeader,
              n
            ),
            f = !0;
          if (
            p.has('b64') &&
            'boolean' != typeof (f = this._protectedHeader.b64)
          )
            throw new c.JWSInvalid(
              'The "b64" (base64url-encode payload) Header Parameter must be a boolean'
            );
          let { alg: h } = n;
          if ('string' != typeof h || !h)
            throw new c.JWSInvalid(
              'JWS "alg" (Algorithm) Header Parameter missing or invalid'
            );
          (0, u.default)(h, e, 'sign');
          let y = this._payload;
          (f && (y = l.encoder.encode((0, i.encode)(y))),
            (r = this._protectedHeader
              ? l.encoder.encode(
                  (0, i.encode)(JSON.stringify(this._protectedHeader))
                )
              : l.encoder.encode('')));
          let g = (0, l.concat)(r, l.encoder.encode('.'), y),
            v = await (0, a.default)(h, e, g),
            m = { signature: (0, i.encode)(v), payload: '' };
          return (
            f && (m.payload = l.decoder.decode(y)),
            this._unprotectedHeader && (m.header = this._unprotectedHeader),
            this._protectedHeader && (m.protected = l.decoder.decode(r)),
            m
          );
        }
      }
      t.FlattenedSign = p;
    },
    81618: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.flattenedVerify = void 0));
      let i = r(62447),
        a = r(94011),
        s = r(17389),
        c = r(51274),
        l = r(66286),
        u = r(25686),
        d = r(54695),
        p = r(60565),
        f = r(85904);
      async function h(e, t, r) {
        var n;
        let h, y;
        if (!(0, u.default)(e))
          throw new s.JWSInvalid('Flattened JWS must be an object');
        if (void 0 === e.protected && void 0 === e.header)
          throw new s.JWSInvalid(
            'Flattened JWS must have either of the "protected" or "header" members'
          );
        if (void 0 !== e.protected && 'string' != typeof e.protected)
          throw new s.JWSInvalid('JWS Protected Header incorrect type');
        if (void 0 === e.payload) throw new s.JWSInvalid('JWS Payload missing');
        if ('string' != typeof e.signature)
          throw new s.JWSInvalid('JWS Signature missing or incorrect type');
        if (void 0 !== e.header && !(0, u.default)(e.header))
          throw new s.JWSInvalid('JWS Unprotected Header incorrect type');
        let g = {};
        if (e.protected)
          try {
            let t = (0, i.decode)(e.protected);
            g = JSON.parse(c.decoder.decode(t));
          } catch {
            throw new s.JWSInvalid('JWS Protected Header is invalid');
          }
        if (!(0, l.default)(g, e.header))
          throw new s.JWSInvalid(
            'JWS Protected and JWS Unprotected Header Parameter names must be disjoint'
          );
        let v = o(o({}, g), e.header),
          m = (0, p.default)(
            s.JWSInvalid,
            new Map([['b64', !0]]),
            null == r ? void 0 : r.crit,
            g,
            v
          ),
          b = !0;
        if (m.has('b64') && 'boolean' != typeof (b = g.b64))
          throw new s.JWSInvalid(
            'The "b64" (base64url-encode payload) Header Parameter must be a boolean'
          );
        let { alg: _ } = v;
        if ('string' != typeof _ || !_)
          throw new s.JWSInvalid(
            'JWS "alg" (Algorithm) Header Parameter missing or invalid'
          );
        let w = r && (0, f.default)('algorithms', r.algorithms);
        if (w && !w.has(_))
          throw new s.JOSEAlgNotAllowed(
            '"alg" (Algorithm) Header Parameter not allowed'
          );
        if (b) {
          if ('string' != typeof e.payload)
            throw new s.JWSInvalid('JWS Payload must be a string');
        } else if (
          'string' != typeof e.payload &&
          !(e.payload instanceof Uint8Array)
        )
          throw new s.JWSInvalid(
            'JWS Payload must be a string or an Uint8Array instance'
          );
        let O = !1;
        ('function' == typeof t && ((t = await t(g, e)), (O = !0)),
          (0, d.default)(_, t, 'verify'));
        let S = (0, c.concat)(
          c.encoder.encode(null !== (n = e.protected) && void 0 !== n ? n : ''),
          c.encoder.encode('.'),
          'string' == typeof e.payload ? c.encoder.encode(e.payload) : e.payload
        );
        try {
          h = (0, i.decode)(e.signature);
        } catch {
          throw new s.JWSInvalid('Failed to base64url decode the signature');
        }
        if (!(await (0, a.default)(_, t, h, S)))
          throw new s.JWSSignatureVerificationFailed();
        if (b)
          try {
            y = (0, i.decode)(e.payload);
          } catch {
            throw new s.JWSInvalid('Failed to base64url decode the payload');
          }
        else
          y =
            'string' == typeof e.payload
              ? c.encoder.encode(e.payload)
              : e.payload;
        let E = { payload: y };
        return (void 0 !== e.protected && (E.protectedHeader = g),
        void 0 !== e.header && (E.unprotectedHeader = e.header),
        O)
          ? o(o({}, E), {}, { key: t })
          : E;
      }
      t.flattenedVerify = h;
    },
    63835: (e, t, r) => {
      'use strict';
      let n = ['payload'];
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.GeneralSign = void 0));
      let o = r(2265),
        i = r(17389);
      class a {
        constructor(e, t, r) {
          ((this.parent = e), (this.key = t), (this.options = r));
        }
        setProtectedHeader(e) {
          if (this.protectedHeader)
            throw TypeError('setProtectedHeader can only be called once');
          return ((this.protectedHeader = e), this);
        }
        setUnprotectedHeader(e) {
          if (this.unprotectedHeader)
            throw TypeError('setUnprotectedHeader can only be called once');
          return ((this.unprotectedHeader = e), this);
        }
        addSignature(...e) {
          return this.parent.addSignature(...e);
        }
        sign(...e) {
          return this.parent.sign(...e);
        }
        done() {
          return this.parent;
        }
      }
      class s {
        constructor(e) {
          ((this._signatures = []), (this._payload = e));
        }
        addSignature(e, t) {
          let r = new a(this, e, t);
          return (this._signatures.push(r), r);
        }
        async sign() {
          if (!this._signatures.length)
            throw new i.JWSInvalid('at least one signature must be added');
          let e = { signatures: [], payload: '' };
          for (let t = 0; t < this._signatures.length; t++) {
            let r = this._signatures[t],
              a = new o.FlattenedSign(this._payload);
            (a.setProtectedHeader(r.protectedHeader),
              a.setUnprotectedHeader(r.unprotectedHeader));
            let s = await a.sign(r.key, r.options),
              { payload: c } = s,
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
              })(s, n);
            if (0 === t) e.payload = c;
            else if (e.payload !== c)
              throw new i.JWSInvalid(
                'inconsistent use of JWS Unencoded Payload (RFC7797)'
              );
            e.signatures.push(l);
          }
          return e;
        }
      }
      t.GeneralSign = s;
    },
    40317: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.generalVerify = void 0));
      let n = r(81618),
        o = r(17389),
        i = r(25686);
      async function a(e, t, r) {
        if (!(0, i.default)(e))
          throw new o.JWSInvalid('General JWS must be an object');
        if (!Array.isArray(e.signatures) || !e.signatures.every(i.default))
          throw new o.JWSInvalid('JWS Signatures missing or incorrect type');
        for (let o of e.signatures)
          try {
            return await (0, n.flattenedVerify)(
              {
                header: o.header,
                payload: e.payload,
                protected: o.protected,
                signature: o.signature,
              },
              t,
              r
            );
          } catch {}
        throw new o.JWSSignatureVerificationFailed();
      }
      t.generalVerify = a;
    },
    64894: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.jwtDecrypt = void 0));
      let i = r(65124),
        a = r(91452),
        s = r(17389);
      async function c(e, t, r) {
        let n = await (0, i.compactDecrypt)(e, t, r),
          c = (0, a.default)(n.protectedHeader, n.plaintext, r),
          { protectedHeader: l } = n;
        if (void 0 !== l.iss && l.iss !== c.iss)
          throw new s.JWTClaimValidationFailed(
            'replicated "iss" claim header parameter mismatch',
            'iss',
            'mismatch'
          );
        if (void 0 !== l.sub && l.sub !== c.sub)
          throw new s.JWTClaimValidationFailed(
            'replicated "sub" claim header parameter mismatch',
            'sub',
            'mismatch'
          );
        if (void 0 !== l.aud && JSON.stringify(l.aud) !== JSON.stringify(c.aud))
          throw new s.JWTClaimValidationFailed(
            'replicated "aud" claim header parameter mismatch',
            'aud',
            'mismatch'
          );
        let u = { payload: c, protectedHeader: l };
        return 'function' == typeof t ? o(o({}, u), {}, { key: n.key }) : u;
      }
      t.jwtDecrypt = c;
    },
    27405: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.EncryptJWT = void 0));
      let i = r(68220),
        a = r(51274),
        s = r(70671);
      class c extends s.ProduceJWT {
        setProtectedHeader(e) {
          if (this._protectedHeader)
            throw TypeError('setProtectedHeader can only be called once');
          return ((this._protectedHeader = e), this);
        }
        setKeyManagementParameters(e) {
          if (this._keyManagementParameters)
            throw TypeError(
              'setKeyManagementParameters can only be called once'
            );
          return ((this._keyManagementParameters = e), this);
        }
        setContentEncryptionKey(e) {
          if (this._cek)
            throw TypeError('setContentEncryptionKey can only be called once');
          return ((this._cek = e), this);
        }
        setInitializationVector(e) {
          if (this._iv)
            throw TypeError('setInitializationVector can only be called once');
          return ((this._iv = e), this);
        }
        replicateIssuerAsHeader() {
          return ((this._replicateIssuerAsHeader = !0), this);
        }
        replicateSubjectAsHeader() {
          return ((this._replicateSubjectAsHeader = !0), this);
        }
        replicateAudienceAsHeader() {
          return ((this._replicateAudienceAsHeader = !0), this);
        }
        async encrypt(e, t) {
          let r = new i.CompactEncrypt(
            a.encoder.encode(JSON.stringify(this._payload))
          );
          return (
            this._replicateIssuerAsHeader &&
              (this._protectedHeader = o(
                o({}, this._protectedHeader),
                {},
                { iss: this._payload.iss }
              )),
            this._replicateSubjectAsHeader &&
              (this._protectedHeader = o(
                o({}, this._protectedHeader),
                {},
                { sub: this._payload.sub }
              )),
            this._replicateAudienceAsHeader &&
              (this._protectedHeader = o(
                o({}, this._protectedHeader),
                {},
                { aud: this._payload.aud }
              )),
            r.setProtectedHeader(this._protectedHeader),
            this._iv && r.setInitializationVector(this._iv),
            this._cek && r.setContentEncryptionKey(this._cek),
            this._keyManagementParameters &&
              r.setKeyManagementParameters(this._keyManagementParameters),
            r.encrypt(e, t)
          );
        }
      }
      t.EncryptJWT = c;
    },
    70671: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.ProduceJWT = void 0));
      let i = r(76543),
        a = r(25686),
        s = r(38103);
      class c {
        constructor(e) {
          if (!(0, a.default)(e))
            throw TypeError('JWT Claims Set MUST be an object');
          this._payload = e;
        }
        setIssuer(e) {
          return (
            (this._payload = o(o({}, this._payload), {}, { iss: e })),
            this
          );
        }
        setSubject(e) {
          return (
            (this._payload = o(o({}, this._payload), {}, { sub: e })),
            this
          );
        }
        setAudience(e) {
          return (
            (this._payload = o(o({}, this._payload), {}, { aud: e })),
            this
          );
        }
        setJti(e) {
          return (
            (this._payload = o(o({}, this._payload), {}, { jti: e })),
            this
          );
        }
        setNotBefore(e) {
          return (
            'number' == typeof e
              ? (this._payload = o(o({}, this._payload), {}, { nbf: e }))
              : (this._payload = o(
                  o({}, this._payload),
                  {},
                  { nbf: (0, i.default)(new Date()) + (0, s.default)(e) }
                )),
            this
          );
        }
        setExpirationTime(e) {
          return (
            'number' == typeof e
              ? (this._payload = o(o({}, this._payload), {}, { exp: e }))
              : (this._payload = o(
                  o({}, this._payload),
                  {},
                  { exp: (0, i.default)(new Date()) + (0, s.default)(e) }
                )),
            this
          );
        }
        setIssuedAt(e) {
          return (
            void 0 === e
              ? (this._payload = o(
                  o({}, this._payload),
                  {},
                  { iat: (0, i.default)(new Date()) }
                ))
              : (this._payload = o(o({}, this._payload), {}, { iat: e })),
            this
          );
        }
      }
      t.ProduceJWT = c;
    },
    81281: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.SignJWT = void 0));
      let n = r(80364),
        o = r(17389),
        i = r(51274),
        a = r(70671);
      class s extends a.ProduceJWT {
        setProtectedHeader(e) {
          return ((this._protectedHeader = e), this);
        }
        async sign(e, t) {
          var r;
          let a = new n.CompactSign(
            i.encoder.encode(JSON.stringify(this._payload))
          );
          if (
            (a.setProtectedHeader(this._protectedHeader),
            Array.isArray(
              null === (r = this._protectedHeader) || void 0 === r
                ? void 0
                : r.crit
            ) &&
              this._protectedHeader.crit.includes('b64') &&
              !1 === this._protectedHeader.b64)
          )
            throw new o.JWTInvalid('JWTs MUST NOT use unencoded payload');
          return a.sign(e, t);
        }
      }
      t.SignJWT = s;
    },
    75311: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.UnsecuredJWT = void 0));
      let n = r(62447),
        o = r(51274),
        i = r(17389),
        a = r(91452),
        s = r(70671);
      class c extends s.ProduceJWT {
        encode() {
          let e = n.encode(JSON.stringify({ alg: 'none' })),
            t = n.encode(JSON.stringify(this._payload));
          return `${e}.${t}.`;
        }
        static decode(e, t) {
          let r;
          if ('string' != typeof e)
            throw new i.JWTInvalid('Unsecured JWT must be a string');
          let { 0: s, 1: c, 2: l, length: u } = e.split('.');
          if (3 !== u || '' !== l)
            throw new i.JWTInvalid('Invalid Unsecured JWT');
          try {
            if (
              ((r = JSON.parse(o.decoder.decode(n.decode(s)))),
              'none' !== r.alg)
            )
              throw Error();
          } catch {
            throw new i.JWTInvalid('Invalid Unsecured JWT');
          }
          return { payload: (0, a.default)(r, n.decode(c), t), header: r };
        }
      }
      t.UnsecuredJWT = c;
    },
    39311: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.jwtVerify = void 0));
      let i = r(40955),
        a = r(91452),
        s = r(17389);
      async function c(e, t, r) {
        var n;
        let c = await (0, i.compactVerify)(e, t, r);
        if (
          (null === (n = c.protectedHeader.crit) || void 0 === n
            ? void 0
            : n.includes('b64')) &&
          !1 === c.protectedHeader.b64
        )
          throw new s.JWTInvalid('JWTs MUST NOT use unencoded payload');
        let l = {
          payload: (0, a.default)(c.protectedHeader, c.payload, r),
          protectedHeader: c.protectedHeader,
        };
        return 'function' == typeof t ? o(o({}, l), {}, { key: c.key }) : l;
      }
      t.jwtVerify = c;
    },
    75248: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.exportJWK = t.exportPKCS8 = t.exportSPKI = void 0));
      let n = r(33810),
        o = r(33810),
        i = r(86772);
      async function a(e) {
        return (0, n.toSPKI)(e);
      }
      async function s(e) {
        return (0, o.toPKCS8)(e);
      }
      async function c(e) {
        return (0, i.default)(e);
      }
      ((t.exportSPKI = a), (t.exportPKCS8 = s), (t.exportJWK = c));
    },
    45440: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.generateKeyPair = void 0));
      let n = r(88242);
      async function o(e, t) {
        return (0, n.generateKeyPair)(e, t);
      }
      t.generateKeyPair = o;
    },
    98132: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.generateSecret = void 0));
      let n = r(88242);
      async function o(e, t) {
        return (0, n.generateSecret)(e, t);
      }
      t.generateSecret = o;
    },
    63359: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.importJWK = t.importPKCS8 = t.importX509 = t.importSPKI = void 0));
      let i = r(62447),
        a = r(33810),
        s = r(49487),
        c = r(17389),
        l = r(25686);
      async function u(e, t, r) {
        if (
          'string' != typeof e ||
          0 !== e.indexOf('-----BEGIN PUBLIC KEY-----')
        )
          throw TypeError('"spki" must be SPKI formatted string');
        return (0, a.fromSPKI)(e, t, r);
      }
      async function d(e, t, r) {
        if (
          'string' != typeof e ||
          0 !== e.indexOf('-----BEGIN CERTIFICATE-----')
        )
          throw TypeError('"x509" must be X.509 formatted string');
        return (0, a.fromX509)(e, t, r);
      }
      async function p(e, t, r) {
        if (
          'string' != typeof e ||
          0 !== e.indexOf('-----BEGIN PRIVATE KEY-----')
        )
          throw TypeError('"pkcs8" must be PKCS#8 formatted string');
        return (0, a.fromPKCS8)(e, t, r);
      }
      async function f(e, t, r) {
        var n;
        if (!(0, l.default)(e)) throw TypeError('JWK must be an object');
        switch ((t || (t = e.alg), e.kty)) {
          case 'oct':
            if ('string' != typeof e.k || !e.k)
              throw TypeError('missing "k" (Key Value) Parameter value');
            if ((null != r || (r = !0 !== e.ext), r))
              return (0, s.default)(
                o(
                  o({}, e),
                  {},
                  { alg: t, ext: null !== (n = e.ext) && void 0 !== n && n }
                )
              );
            return (0, i.decode)(e.k);
          case 'RSA':
            if (void 0 !== e.oth)
              throw new c.JOSENotSupported(
                'RSA JWK "oth" (Other Primes Info) Parameter value is not supported'
              );
          case 'EC':
          case 'OKP':
            return (0, s.default)(o(o({}, e), {}, { alg: t }));
          default:
            throw new c.JOSENotSupported(
              'Unsupported "kty" (Key Type) Parameter value'
            );
        }
      }
      ((t.importSPKI = u),
        (t.importX509 = d),
        (t.importPKCS8 = p),
        (t.importJWK = f));
    },
    54207: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.unwrap = t.wrap = void 0));
      let n = r(43178),
        o = r(23402),
        i = r(77098),
        a = r(62447);
      async function s(e, t, r, o) {
        let s = e.slice(0, 7);
        o || (o = (0, i.default)(s));
        let { ciphertext: c, tag: l } = await (0, n.default)(
          s,
          r,
          t,
          o,
          new Uint8Array(0)
        );
        return { encryptedKey: c, iv: (0, a.encode)(o), tag: (0, a.encode)(l) };
      }
      async function c(e, t, r, n, i) {
        let a = e.slice(0, 7);
        return (0, o.default)(a, t, r, n, i, new Uint8Array(0));
      }
      ((t.wrap = s), (t.unwrap = c));
    },
    51274: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.concatKdf =
          t.lengthAndInput =
          t.uint32be =
          t.uint64be =
          t.p2s =
          t.concat =
          t.decoder =
          t.encoder =
            void 0));
      let n = r(96833);
      function o(...e) {
        let t = e.reduce((e, { length: t }) => e + t, 0),
          r = new Uint8Array(t),
          n = 0;
        return (
          e.forEach(e => {
            (r.set(e, n), (n += e.length));
          }),
          r
        );
      }
      function i(e, t, r) {
        if (t < 0 || t >= 4294967296)
          throw RangeError(
            `value must be >= 0 and <= ${4294967296 - 1}. Received ${t}`
          );
        e.set([t >>> 24, t >>> 16, t >>> 8, 255 & t], r);
      }
      function a(e) {
        let t = new Uint8Array(4);
        return (i(t, e), t);
      }
      async function s(e, t, r) {
        let o = Math.ceil((t >> 3) / 32),
          i = new Uint8Array(32 * o);
        for (let t = 0; t < o; t++) {
          let o = new Uint8Array(4 + e.length + r.length);
          (o.set(a(t + 1)),
            o.set(e, 4),
            o.set(r, 4 + e.length),
            i.set(await (0, n.default)('sha256', o), 32 * t));
        }
        return i.slice(0, t >> 3);
      }
      ((t.encoder = new TextEncoder()),
        (t.decoder = new TextDecoder()),
        (t.concat = o),
        (t.p2s = function (e, r) {
          return o(t.encoder.encode(e), new Uint8Array([0]), r);
        }),
        (t.uint64be = function (e) {
          let t = new Uint8Array(8);
          return (
            i(t, Math.floor(e / 4294967296), 0),
            i(t, e % 4294967296, 4),
            t
          );
        }),
        (t.uint32be = a),
        (t.lengthAndInput = function (e) {
          return o(a(e.length), e);
        }),
        (t.concatKdf = s));
    },
    90303: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.bitLength = void 0));
      let n = r(17389),
        o = r(30655);
      function i(e) {
        switch (e) {
          case 'A128GCM':
            return 128;
          case 'A192GCM':
            return 192;
          case 'A256GCM':
          case 'A128CBC-HS256':
            return 256;
          case 'A192CBC-HS384':
            return 384;
          case 'A256CBC-HS512':
            return 512;
          default:
            throw new n.JOSENotSupported(`Unsupported JWE Algorithm: ${e}`);
        }
      }
      ((t.bitLength = i),
        (t.default = e => (0, o.default)(new Uint8Array(i(e) >> 3))));
    },
    57091: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389),
        o = r(77098);
      t.default = (e, t) => {
        if (t.length << 3 !== (0, o.bitLength)(e))
          throw new n.JWEInvalid('Invalid Initialization Vector length');
      };
    },
    54695: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(59841),
        o = r(70627),
        i = (e, t) => {
          if (!(t instanceof Uint8Array)) {
            if (!(0, o.default)(t))
              throw TypeError((0, n.withAlg)(e, t, ...o.types, 'Uint8Array'));
            if ('secret' !== t.type)
              throw TypeError(
                `${o.types.join(' or ')} instances for symmetric algorithms must be of type "secret"`
              );
          }
        },
        a = (e, t, r) => {
          if (!(0, o.default)(t))
            throw TypeError((0, n.withAlg)(e, t, ...o.types));
          if ('secret' === t.type)
            throw TypeError(
              `${o.types.join(' or ')} instances for asymmetric algorithms must not be of type "secret"`
            );
          if ('sign' === r && 'public' === t.type)
            throw TypeError(
              `${o.types.join(' or ')} instances for asymmetric algorithm signing must be of type "private"`
            );
          if ('decrypt' === r && 'public' === t.type)
            throw TypeError(
              `${o.types.join(' or ')} instances for asymmetric algorithm decryption must be of type "private"`
            );
          if (t.algorithm && 'verify' === r && 'private' === t.type)
            throw TypeError(
              `${o.types.join(' or ')} instances for asymmetric algorithm verifying must be of type "public"`
            );
          if (t.algorithm && 'encrypt' === r && 'private' === t.type)
            throw TypeError(
              `${o.types.join(' or ')} instances for asymmetric algorithm encryption must be of type "public"`
            );
        };
      t.default = (e, t, r) => {
        e.startsWith('HS') ||
        'dir' === e ||
        e.startsWith('PBES2') ||
        /^A\d{3}(?:GCM)?KW$/.test(e)
          ? i(e, t)
          : a(e, t, r);
      };
    },
    69509: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389);
      t.default = function (e) {
        if (!(e instanceof Uint8Array) || e.length < 8)
          throw new n.JWEInvalid('PBES2 Salt Input must be 8 or more octets');
      };
    },
    43153: (e, t) => {
      'use strict';
      function r(e, t = 'algorithm.name') {
        return TypeError(
          `CryptoKey does not support this operation, its ${t} must be ${e}`
        );
      }
      function n(e, t) {
        return e.name === t;
      }
      function o(e) {
        return parseInt(e.name.slice(4), 10);
      }
      function i(e, t) {
        if (t.length && !t.some(t => e.usages.includes(t))) {
          let e =
            'CryptoKey does not support this operation, its usages must include ';
          if (t.length > 2) {
            let r = t.pop();
            e += `one of ${t.join(', ')}, or ${r}.`;
          } else
            2 === t.length
              ? (e += `one of ${t[0]} or ${t[1]}.`)
              : (e += `${t[0]}.`);
          throw TypeError(e);
        }
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.checkEncCryptoKey = t.checkSigCryptoKey = void 0),
        (t.checkSigCryptoKey = function (e, t, ...a) {
          switch (t) {
            case 'HS256':
            case 'HS384':
            case 'HS512': {
              if (!n(e.algorithm, 'HMAC')) throw r('HMAC');
              let i = parseInt(t.slice(2), 10);
              if (o(e.algorithm.hash) !== i)
                throw r(`SHA-${i}`, 'algorithm.hash');
              break;
            }
            case 'RS256':
            case 'RS384':
            case 'RS512': {
              if (!n(e.algorithm, 'RSASSA-PKCS1-v1_5'))
                throw r('RSASSA-PKCS1-v1_5');
              let i = parseInt(t.slice(2), 10);
              if (o(e.algorithm.hash) !== i)
                throw r(`SHA-${i}`, 'algorithm.hash');
              break;
            }
            case 'PS256':
            case 'PS384':
            case 'PS512': {
              if (!n(e.algorithm, 'RSA-PSS')) throw r('RSA-PSS');
              let i = parseInt(t.slice(2), 10);
              if (o(e.algorithm.hash) !== i)
                throw r(`SHA-${i}`, 'algorithm.hash');
              break;
            }
            case 'EdDSA':
              if (
                'Ed25519' !== e.algorithm.name &&
                'Ed448' !== e.algorithm.name
              )
                throw r('Ed25519 or Ed448');
              break;
            case 'ES256':
            case 'ES384':
            case 'ES512': {
              if (!n(e.algorithm, 'ECDSA')) throw r('ECDSA');
              let o = (function (e) {
                switch (e) {
                  case 'ES256':
                    return 'P-256';
                  case 'ES384':
                    return 'P-384';
                  case 'ES512':
                    return 'P-521';
                  default:
                    throw Error('unreachable');
                }
              })(t);
              if (e.algorithm.namedCurve !== o)
                throw r(o, 'algorithm.namedCurve');
              break;
            }
            default:
              throw TypeError('CryptoKey does not support this operation');
          }
          i(e, a);
        }),
        (t.checkEncCryptoKey = function (e, t, ...a) {
          switch (t) {
            case 'A128GCM':
            case 'A192GCM':
            case 'A256GCM': {
              if (!n(e.algorithm, 'AES-GCM')) throw r('AES-GCM');
              let o = parseInt(t.slice(1, 4), 10);
              if (e.algorithm.length !== o) throw r(o, 'algorithm.length');
              break;
            }
            case 'A128KW':
            case 'A192KW':
            case 'A256KW': {
              if (!n(e.algorithm, 'AES-KW')) throw r('AES-KW');
              let o = parseInt(t.slice(1, 4), 10);
              if (e.algorithm.length !== o) throw r(o, 'algorithm.length');
              break;
            }
            case 'ECDH':
              switch (e.algorithm.name) {
                case 'ECDH':
                case 'X25519':
                case 'X448':
                  break;
                default:
                  throw r('ECDH, X25519, or X448');
              }
              break;
            case 'PBES2-HS256+A128KW':
            case 'PBES2-HS384+A192KW':
            case 'PBES2-HS512+A256KW':
              if (!n(e.algorithm, 'PBKDF2')) throw r('PBKDF2');
              break;
            case 'RSA-OAEP':
            case 'RSA-OAEP-256':
            case 'RSA-OAEP-384':
            case 'RSA-OAEP-512': {
              if (!n(e.algorithm, 'RSA-OAEP')) throw r('RSA-OAEP');
              let i = parseInt(t.slice(9), 10) || 1;
              if (o(e.algorithm.hash) !== i)
                throw r(`SHA-${i}`, 'algorithm.hash');
              break;
            }
            default:
              throw TypeError('CryptoKey does not support this operation');
          }
          i(e, a);
        }));
    },
    54595: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(62724),
        o = r(31456),
        i = r(4766),
        a = r(55924),
        s = r(62447),
        c = r(17389),
        l = r(90303),
        u = r(63359),
        d = r(54695),
        p = r(25686),
        f = r(54207);
      async function h(e, t, r, h, y) {
        switch (((0, d.default)(e, t, 'decrypt'), e)) {
          case 'dir':
            if (void 0 !== r)
              throw new c.JWEInvalid(
                'Encountered unexpected JWE Encrypted Key'
              );
            return t;
          case 'ECDH-ES':
            if (void 0 !== r)
              throw new c.JWEInvalid(
                'Encountered unexpected JWE Encrypted Key'
              );
          case 'ECDH-ES+A128KW':
          case 'ECDH-ES+A192KW':
          case 'ECDH-ES+A256KW': {
            let i, a;
            if (!(0, p.default)(h.epk))
              throw new c.JWEInvalid(
                'JOSE Header "epk" (Ephemeral Public Key) missing or invalid'
              );
            if (!o.ecdhAllowed(t))
              throw new c.JOSENotSupported(
                'ECDH with the provided key is not allowed or not supported by your javascript runtime'
              );
            let d = await (0, u.importJWK)(h.epk, e);
            if (void 0 !== h.apu) {
              if ('string' != typeof h.apu)
                throw new c.JWEInvalid(
                  'JOSE Header "apu" (Agreement PartyUInfo) invalid'
                );
              try {
                i = (0, s.decode)(h.apu);
              } catch {
                throw new c.JWEInvalid('Failed to base64url decode the apu');
              }
            }
            if (void 0 !== h.apv) {
              if ('string' != typeof h.apv)
                throw new c.JWEInvalid(
                  'JOSE Header "apv" (Agreement PartyVInfo) invalid'
                );
              try {
                a = (0, s.decode)(h.apv);
              } catch {
                throw new c.JWEInvalid('Failed to base64url decode the apv');
              }
            }
            let f = await o.deriveKey(
              d,
              t,
              'ECDH-ES' === e ? h.enc : e,
              'ECDH-ES' === e
                ? (0, l.bitLength)(h.enc)
                : parseInt(e.slice(-5, -2), 10),
              i,
              a
            );
            if ('ECDH-ES' === e) return f;
            if (void 0 === r)
              throw new c.JWEInvalid('JWE Encrypted Key missing');
            return (0, n.unwrap)(e.slice(-6), f, r);
          }
          case 'RSA1_5':
          case 'RSA-OAEP':
          case 'RSA-OAEP-256':
          case 'RSA-OAEP-384':
          case 'RSA-OAEP-512':
            if (void 0 === r)
              throw new c.JWEInvalid('JWE Encrypted Key missing');
            return (0, a.decrypt)(e, t, r);
          case 'PBES2-HS256+A128KW':
          case 'PBES2-HS384+A192KW':
          case 'PBES2-HS512+A256KW': {
            let n;
            if (void 0 === r)
              throw new c.JWEInvalid('JWE Encrypted Key missing');
            if ('number' != typeof h.p2c)
              throw new c.JWEInvalid(
                'JOSE Header "p2c" (PBES2 Count) missing or invalid'
              );
            let o = (null == y ? void 0 : y.maxPBES2Count) || 1e4;
            if (h.p2c > o)
              throw new c.JWEInvalid(
                'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds'
              );
            if ('string' != typeof h.p2s)
              throw new c.JWEInvalid(
                'JOSE Header "p2s" (PBES2 Salt) missing or invalid'
              );
            try {
              n = (0, s.decode)(h.p2s);
            } catch {
              throw new c.JWEInvalid('Failed to base64url decode the p2s');
            }
            return (0, i.decrypt)(e, t, r, h.p2c, n);
          }
          case 'A128KW':
          case 'A192KW':
          case 'A256KW':
            if (void 0 === r)
              throw new c.JWEInvalid('JWE Encrypted Key missing');
            return (0, n.unwrap)(e, t, r);
          case 'A128GCMKW':
          case 'A192GCMKW':
          case 'A256GCMKW': {
            let n, o;
            if (void 0 === r)
              throw new c.JWEInvalid('JWE Encrypted Key missing');
            if ('string' != typeof h.iv)
              throw new c.JWEInvalid(
                'JOSE Header "iv" (Initialization Vector) missing or invalid'
              );
            if ('string' != typeof h.tag)
              throw new c.JWEInvalid(
                'JOSE Header "tag" (Authentication Tag) missing or invalid'
              );
            try {
              n = (0, s.decode)(h.iv);
            } catch {
              throw new c.JWEInvalid('Failed to base64url decode the iv');
            }
            try {
              o = (0, s.decode)(h.tag);
            } catch {
              throw new c.JWEInvalid('Failed to base64url decode the tag');
            }
            return (0, f.unwrap)(e, t, r, n, o);
          }
          default:
            throw new c.JOSENotSupported(
              'Invalid or unsupported "alg" (JWE Algorithm) header value'
            );
        }
      }
      t.default = h;
    },
    20091: (e, t, r) => {
      'use strict';
      let n = ['encryptedKey'],
        o = ['encryptedKey'];
      function i(e, t) {
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
      Object.defineProperty(t, '__esModule', { value: !0 });
      let a = r(62724),
        s = r(31456),
        c = r(4766),
        l = r(55924),
        u = r(62447),
        d = r(90303),
        p = r(17389),
        f = r(75248),
        h = r(54695),
        y = r(54207);
      async function g(e, t, r, g, v = {}) {
        let m, b, _;
        switch (((0, h.default)(e, r, 'encrypt'), e)) {
          case 'dir':
            _ = r;
            break;
          case 'ECDH-ES':
          case 'ECDH-ES+A128KW':
          case 'ECDH-ES+A192KW':
          case 'ECDH-ES+A256KW': {
            if (!s.ecdhAllowed(r))
              throw new p.JOSENotSupported(
                'ECDH with the provided key is not allowed or not supported by your javascript runtime'
              );
            let { apu: n, apv: o } = v,
              { epk: i } = v;
            i || (i = (await s.generateEpk(r)).privateKey);
            let { x: c, y: l, crv: h, kty: y } = await (0, f.exportJWK)(i),
              w = await s.deriveKey(
                r,
                i,
                'ECDH-ES' === e ? t : e,
                'ECDH-ES' === e
                  ? (0, d.bitLength)(t)
                  : parseInt(e.slice(-5, -2), 10),
                n,
                o
              );
            if (
              ((b = { epk: { x: c, crv: h, kty: y } }),
              'EC' === y && (b.epk.y = l),
              n && (b.apu = (0, u.encode)(n)),
              o && (b.apv = (0, u.encode)(o)),
              'ECDH-ES' === e)
            ) {
              _ = w;
              break;
            }
            _ = g || (0, d.default)(t);
            let O = e.slice(-6);
            m = await (0, a.wrap)(O, w, _);
            break;
          }
          case 'RSA1_5':
          case 'RSA-OAEP':
          case 'RSA-OAEP-256':
          case 'RSA-OAEP-384':
          case 'RSA-OAEP-512':
            ((_ = g || (0, d.default)(t)), (m = await (0, l.encrypt)(e, r, _)));
            break;
          case 'PBES2-HS256+A128KW':
          case 'PBES2-HS384+A192KW':
          case 'PBES2-HS512+A256KW': {
            _ = g || (0, d.default)(t);
            let { p2c: o, p2s: a } = v;
            var w = await (0, c.encrypt)(e, r, _, o, a);
            (({ encryptedKey: m } = w), (b = i(w, n)));
            break;
          }
          case 'A128KW':
          case 'A192KW':
          case 'A256KW':
            ((_ = g || (0, d.default)(t)), (m = await (0, a.wrap)(e, r, _)));
            break;
          case 'A128GCMKW':
          case 'A192GCMKW':
          case 'A256GCMKW': {
            _ = g || (0, d.default)(t);
            let { iv: n } = v;
            var O = await (0, y.wrap)(e, r, _, n);
            (({ encryptedKey: m } = O), (b = i(O, o)));
            break;
          }
          default:
            throw new p.JOSENotSupported(
              'Invalid or unsupported "alg" (JWE Algorithm) header value'
            );
        }
        return { cek: _, encryptedKey: m, parameters: b };
      }
      t.default = g;
    },
    76543: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = e => Math.floor(e.getTime() / 1e3)));
    },
    59841: (e, t) => {
      'use strict';
      function r(e, t, ...n) {
        if (n.length > 2) {
          let t = n.pop();
          e += `one of type ${n.join(', ')}, or ${t}.`;
        } else
          2 === n.length
            ? (e += `one of type ${n[0]} or ${n[1]}.`)
            : (e += `of type ${n[0]}.`);
        return (
          null == t
            ? (e += ` Received ${t}`)
            : 'function' == typeof t && t.name
              ? (e += ` Received function ${t.name}`)
              : 'object' == typeof t &&
                null != t &&
                t.constructor &&
                t.constructor.name &&
                (e += ` Received an instance of ${t.constructor.name}`),
          e
        );
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.withAlg = void 0),
        (t.default = (e, ...t) => r('Key must be ', e, ...t)),
        (t.withAlg = function (e, t, ...n) {
          return r(`Key for the ${e} algorithm must be `, t, ...n);
        }));
    },
    66286: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = (...e) => {
          let t;
          let r = e.filter(Boolean);
          if (0 === r.length || 1 === r.length) return !0;
          for (let e of r) {
            let r = Object.keys(e);
            if (!t || 0 === t.size) {
              t = new Set(r);
              continue;
            }
            for (let e of r) {
              if (t.has(e)) return !1;
              t.add(e);
            }
          }
          return !0;
        }));
    },
    25686: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          if (
            !('object' == typeof e && null !== e) ||
            '[object Object]' !== Object.prototype.toString.call(e)
          )
            return !1;
          if (null === Object.getPrototypeOf(e)) return !0;
          let t = e;
          for (; null !== Object.getPrototypeOf(t); )
            t = Object.getPrototypeOf(t);
          return Object.getPrototypeOf(e) === t;
        }));
    },
    77098: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.bitLength = void 0));
      let n = r(17389),
        o = r(30655);
      function i(e) {
        switch (e) {
          case 'A128GCM':
          case 'A128GCMKW':
          case 'A192GCM':
          case 'A192GCMKW':
          case 'A256GCM':
          case 'A256GCMKW':
            return 96;
          case 'A128CBC-HS256':
          case 'A192CBC-HS384':
          case 'A256CBC-HS512':
            return 128;
          default:
            throw new n.JOSENotSupported(`Unsupported JWE Algorithm: ${e}`);
        }
      }
      ((t.bitLength = i),
        (t.default = e => (0, o.default)(new Uint8Array(i(e) >> 3))));
    },
    91452: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389),
        o = r(51274),
        i = r(76543),
        a = r(38103),
        s = r(25686),
        c = e => e.toLowerCase().replace(/^application\//, ''),
        l = (e, t) =>
          'string' == typeof e
            ? t.includes(e)
            : !!Array.isArray(e) && t.some(Set.prototype.has.bind(new Set(e)));
      t.default = (e, t, r = {}) => {
        let u, d;
        let { typ: p } = r;
        if (p && ('string' != typeof e.typ || c(e.typ) !== c(p)))
          throw new n.JWTClaimValidationFailed(
            'unexpected "typ" JWT header value',
            'typ',
            'check_failed'
          );
        try {
          u = JSON.parse(o.decoder.decode(t));
        } catch {}
        if (!(0, s.default)(u))
          throw new n.JWTInvalid(
            'JWT Claims Set must be a top-level JSON object'
          );
        let {
          requiredClaims: f = [],
          issuer: h,
          subject: y,
          audience: g,
          maxTokenAge: v,
        } = r;
        for (let e of (void 0 !== v && f.push('iat'),
        void 0 !== g && f.push('aud'),
        void 0 !== y && f.push('sub'),
        void 0 !== h && f.push('iss'),
        new Set(f.reverse())))
          if (!(e in u))
            throw new n.JWTClaimValidationFailed(
              `missing required "${e}" claim`,
              e,
              'missing'
            );
        if (h && !(Array.isArray(h) ? h : [h]).includes(u.iss))
          throw new n.JWTClaimValidationFailed(
            'unexpected "iss" claim value',
            'iss',
            'check_failed'
          );
        if (y && u.sub !== y)
          throw new n.JWTClaimValidationFailed(
            'unexpected "sub" claim value',
            'sub',
            'check_failed'
          );
        if (g && !l(u.aud, 'string' == typeof g ? [g] : g))
          throw new n.JWTClaimValidationFailed(
            'unexpected "aud" claim value',
            'aud',
            'check_failed'
          );
        switch (typeof r.clockTolerance) {
          case 'string':
            d = (0, a.default)(r.clockTolerance);
            break;
          case 'number':
            d = r.clockTolerance;
            break;
          case 'undefined':
            d = 0;
            break;
          default:
            throw TypeError('Invalid clockTolerance option type');
        }
        let { currentDate: m } = r,
          b = (0, i.default)(m || new Date());
        if ((void 0 !== u.iat || v) && 'number' != typeof u.iat)
          throw new n.JWTClaimValidationFailed(
            '"iat" claim must be a number',
            'iat',
            'invalid'
          );
        if (void 0 !== u.nbf) {
          if ('number' != typeof u.nbf)
            throw new n.JWTClaimValidationFailed(
              '"nbf" claim must be a number',
              'nbf',
              'invalid'
            );
          if (u.nbf > b + d)
            throw new n.JWTClaimValidationFailed(
              '"nbf" claim timestamp check failed',
              'nbf',
              'check_failed'
            );
        }
        if (void 0 !== u.exp) {
          if ('number' != typeof u.exp)
            throw new n.JWTClaimValidationFailed(
              '"exp" claim must be a number',
              'exp',
              'invalid'
            );
          if (u.exp <= b - d)
            throw new n.JWTExpired(
              '"exp" claim timestamp check failed',
              'exp',
              'check_failed'
            );
        }
        if (v) {
          let e = b - u.iat;
          if (e - d > ('number' == typeof v ? v : (0, a.default)(v)))
            throw new n.JWTExpired(
              '"iat" claim timestamp check failed (too far in the past)',
              'iat',
              'check_failed'
            );
          if (e < 0 - d)
            throw new n.JWTClaimValidationFailed(
              '"iat" claim timestamp check failed (it should be in the past)',
              'iat',
              'check_failed'
            );
        }
        return u;
      };
    },
    38103: (e, t) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let r =
        /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i;
      t.default = e => {
        let t = r.exec(e);
        if (!t) throw TypeError('Invalid time period format');
        let n = parseFloat(t[1]);
        switch (t[2].toLowerCase()) {
          case 'sec':
          case 'secs':
          case 'second':
          case 'seconds':
          case 's':
            return Math.round(n);
          case 'minute':
          case 'minutes':
          case 'min':
          case 'mins':
          case 'm':
            return Math.round(60 * n);
          case 'hour':
          case 'hours':
          case 'hr':
          case 'hrs':
          case 'h':
            return Math.round(3600 * n);
          case 'day':
          case 'days':
          case 'd':
            return Math.round(86400 * n);
          case 'week':
          case 'weeks':
          case 'w':
            return Math.round(604800 * n);
          default:
            return Math.round(31557600 * n);
        }
      };
    },
    85904: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = (e, t) => {
          if (
            void 0 !== t &&
            (!Array.isArray(t) || t.some(e => 'string' != typeof e))
          )
            throw TypeError(`"${e}" option must be an array of strings`);
          if (t) return new Set(t);
        }));
    },
    60565: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389);
      t.default = function (e, t, r, o, i) {
        let a;
        if (void 0 !== i.crit && void 0 === o.crit)
          throw new e(
            '"crit" (Critical) Header Parameter MUST be integrity protected'
          );
        if (!o || void 0 === o.crit) return new Set();
        if (
          !Array.isArray(o.crit) ||
          0 === o.crit.length ||
          o.crit.some(e => 'string' != typeof e || 0 === e.length)
        )
          throw new e(
            '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present'
          );
        for (let s of ((a =
          void 0 !== r ? new Map([...Object.entries(r), ...t.entries()]) : t),
        o.crit)) {
          if (!a.has(s))
            throw new n.JOSENotSupported(
              `Extension Header Parameter "${s}" is not recognized`
            );
          if (void 0 === i[s])
            throw new e(`Extension Header Parameter "${s}" is missing`);
          if (a.get(s) && void 0 === o[s])
            throw new e(
              `Extension Header Parameter "${s}" MUST be integrity protected`
            );
        }
        return new Set(o.crit);
      };
    },
    62724: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.unwrap = t.wrap = void 0));
      let n = r(14300),
        o = r(6113),
        i = r(17389),
        a = r(51274),
        s = r(76027),
        c = r(43153),
        l = r(85477),
        u = r(59841),
        d = r(49679),
        p = r(70627);
      function f(e, t) {
        if (e.symmetricKeySize << 3 !== parseInt(t.slice(1, 4), 10))
          throw TypeError(`Invalid key size for alg: ${t}`);
      }
      function h(e, t, r) {
        if ((0, l.default)(e)) return e;
        if (e instanceof Uint8Array) return (0, o.createSecretKey)(e);
        if ((0, s.isCryptoKey)(e))
          return ((0, c.checkEncCryptoKey)(e, t, r), o.KeyObject.from(e));
        throw TypeError((0, u.default)(e, ...p.types, 'Uint8Array'));
      }
      ((t.wrap = (e, t, r) => {
        let s = parseInt(e.slice(1, 4), 10),
          c = `aes${s}-wrap`;
        if (!(0, d.default)(c))
          throw new i.JOSENotSupported(
            `alg ${e} is not supported either by JOSE or your javascript runtime`
          );
        let l = h(t, e, 'wrapKey');
        f(l, e);
        let u = (0, o.createCipheriv)(c, l, n.Buffer.alloc(8, 166));
        return (0, a.concat)(u.update(r), u.final());
      }),
        (t.unwrap = (e, t, r) => {
          let s = parseInt(e.slice(1, 4), 10),
            c = `aes${s}-wrap`;
          if (!(0, d.default)(c))
            throw new i.JOSENotSupported(
              `alg ${e} is not supported either by JOSE or your javascript runtime`
            );
          let l = h(t, e, 'unwrapKey');
          f(l, e);
          let u = (0, o.createDecipheriv)(c, l, n.Buffer.alloc(8, 166));
          return (0, a.concat)(u.update(r), u.final());
        }));
    },
    33810: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.fromX509 =
          t.fromSPKI =
          t.fromPKCS8 =
          t.toPKCS8 =
          t.toSPKI =
            void 0));
      let n = r(6113),
        o = r(14300),
        i = r(76027),
        a = r(85477),
        s = r(59841),
        c = r(70627),
        l = (e, t, r) => {
          let o;
          if ((0, i.isCryptoKey)(r)) {
            if (!r.extractable) throw TypeError('CryptoKey is not extractable');
            o = n.KeyObject.from(r);
          } else if ((0, a.default)(r)) o = r;
          else throw TypeError((0, s.default)(r, ...c.types));
          if (o.type !== e) throw TypeError(`key is not a ${e} key`);
          return o.export({ format: 'pem', type: t });
        };
      ((t.toSPKI = e => l('public', 'spki', e)),
        (t.toPKCS8 = e => l('private', 'pkcs8', e)),
        (t.fromPKCS8 = e =>
          (0, n.createPrivateKey)({
            key: o.Buffer.from(
              e.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''),
              'base64'
            ),
            type: 'pkcs8',
            format: 'der',
          })),
        (t.fromSPKI = e =>
          (0, n.createPublicKey)({
            key: o.Buffer.from(
              e.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''),
              'base64'
            ),
            type: 'spki',
            format: 'der',
          })),
        (t.fromX509 = e =>
          (0, n.createPublicKey)({ key: e, type: 'spki', format: 'pem' })));
    },
    89403: (e, t) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      class r {
        constructor(e) {
          if (
            48 !== e[0] ||
            ((this.buffer = e),
            (this.offset = 1),
            this.decodeLength() !== e.length - this.offset)
          )
            throw TypeError();
        }
        decodeLength() {
          let e = this.buffer[this.offset++];
          if (128 & e) {
            let t = -129 & e;
            e = 0;
            for (let r = 0; r < t; r++)
              e = (e << 8) | this.buffer[this.offset + r];
            this.offset += t;
          }
          return e;
        }
        unsignedInteger() {
          if (2 !== this.buffer[this.offset++]) throw TypeError();
          let e = this.decodeLength();
          0 === this.buffer[this.offset] && (this.offset++, e--);
          let t = this.buffer.slice(this.offset, this.offset + e);
          return ((this.offset += e), t);
        }
        end() {
          if (this.offset !== this.buffer.length) throw TypeError();
        }
      }
      t.default = r;
    },
    56088: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(14300),
        o = r(17389),
        i = n.Buffer.from([0]),
        a = n.Buffer.from([2]),
        s = n.Buffer.from([3]),
        c = n.Buffer.from([48]),
        l = n.Buffer.from([4]),
        u = e => {
          if (e < 128) return n.Buffer.from([e]);
          let t = n.Buffer.alloc(5);
          t.writeUInt32BE(e, 1);
          let r = 1;
          for (; 0 === t[r]; ) r++;
          return ((t[r - 1] = 128 | (5 - r)), t.slice(r - 1));
        },
        d = new Map([
          [
            'P-256',
            n.Buffer.from(
              '06 08 2A 86 48 CE 3D 03 01 07'.replace(/ /g, ''),
              'hex'
            ),
          ],
          [
            'secp256k1',
            n.Buffer.from('06 05 2B 81 04 00 0A'.replace(/ /g, ''), 'hex'),
          ],
          [
            'P-384',
            n.Buffer.from('06 05 2B 81 04 00 22'.replace(/ /g, ''), 'hex'),
          ],
          [
            'P-521',
            n.Buffer.from('06 05 2B 81 04 00 23'.replace(/ /g, ''), 'hex'),
          ],
          [
            'ecPublicKey',
            n.Buffer.from(
              '06 07 2A 86 48 CE 3D 02 01'.replace(/ /g, ''),
              'hex'
            ),
          ],
          ['X25519', n.Buffer.from('06 03 2B 65 6E'.replace(/ /g, ''), 'hex')],
          ['X448', n.Buffer.from('06 03 2B 65 6F'.replace(/ /g, ''), 'hex')],
          ['Ed25519', n.Buffer.from('06 03 2B 65 70'.replace(/ /g, ''), 'hex')],
          ['Ed448', n.Buffer.from('06 03 2B 65 71'.replace(/ /g, ''), 'hex')],
        ]);
      class p {
        constructor() {
          ((this.length = 0), (this.elements = []));
        }
        oidFor(e) {
          let t = d.get(e);
          if (!t) throw new o.JOSENotSupported('Invalid or unsupported OID');
          (this.elements.push(t), (this.length += t.length));
        }
        zero() {
          (this.elements.push(a, n.Buffer.from([1]), i), (this.length += 3));
        }
        one() {
          (this.elements.push(a, n.Buffer.from([1]), n.Buffer.from([1])),
            (this.length += 3));
        }
        unsignedInteger(e) {
          if (128 & e[0]) {
            let t = u(e.length + 1);
            (this.elements.push(a, t, i, e),
              (this.length += 2 + t.length + e.length));
          } else {
            let t = 0;
            for (; 0 === e[t] && (128 & e[t + 1]) == 0; ) t++;
            let r = u(e.length - t);
            (this.elements.push(a, u(e.length - t), e.slice(t)),
              (this.length += 1 + r.length + e.length - t));
          }
        }
        octStr(e) {
          let t = u(e.length);
          (this.elements.push(l, u(e.length), e),
            (this.length += 1 + t.length + e.length));
        }
        bitStr(e) {
          let t = u(e.length + 1);
          (this.elements.push(s, u(e.length + 1), i, e),
            (this.length += 1 + t.length + e.length + 1));
        }
        add(e) {
          (this.elements.push(e), (this.length += e.length));
        }
        end(e = c) {
          let t = u(this.length);
          return n.Buffer.concat(
            [e, t, ...this.elements],
            1 + t.length + this.length
          );
        }
      }
      t.default = p;
    },
    62447: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decode = t.encode = t.encodeBase64 = t.decodeBase64 = void 0));
      let n = r(14300),
        o = r(51274);
      (n.Buffer.isEncoding('base64url')
        ? (t.encode = e => n.Buffer.from(e).toString('base64url'))
        : (t.encode = e =>
            n.Buffer.from(e)
              .toString('base64')
              .replace(/=/g, '')
              .replace(/\+/g, '-')
              .replace(/\//g, '_')),
        (t.decodeBase64 = e => n.Buffer.from(e, 'base64')),
        (t.encodeBase64 = e => n.Buffer.from(e).toString('base64')),
        (t.decode = e =>
          n.Buffer.from(
            (function (e) {
              let t = e;
              return (t instanceof Uint8Array && (t = o.decoder.decode(t)), t);
            })(e),
            'base64'
          )));
    },
    77149: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113),
        o = r(51274);
      t.default = function (e, t, r, i, a, s) {
        let c = (0, o.concat)(e, t, r, (0, o.uint64be)(e.length << 3)),
          l = (0, n.createHmac)(`sha${i}`, a);
        return (l.update(c), l.digest().slice(0, s >> 3));
      };
    },
    93453: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389),
        o = r(85477);
      t.default = (e, t) => {
        let r;
        switch (e) {
          case 'A128CBC-HS256':
          case 'A192CBC-HS384':
          case 'A256CBC-HS512':
            r = parseInt(e.slice(-3), 10);
            break;
          case 'A128GCM':
          case 'A192GCM':
          case 'A256GCM':
            r = parseInt(e.slice(1, 4), 10);
            break;
          default:
            throw new n.JOSENotSupported(
              `Content Encryption Algorithm ${e} is not supported either by JOSE or your javascript runtime`
            );
        }
        if (t instanceof Uint8Array) {
          let e = t.byteLength << 3;
          if (e !== r)
            throw new n.JWEInvalid(
              `Invalid Content Encryption Key length. Expected ${r} bits, got ${e} bits`
            );
          return;
        }
        if ((0, o.default)(t) && 'secret' === t.type) {
          let e = t.symmetricKeySize << 3;
          if (e !== r)
            throw new n.JWEInvalid(
              `Invalid Content Encryption Key length. Expected ${r} bits, got ${e} bits`
            );
          return;
        }
        throw TypeError('Invalid Content Encryption Key type');
      };
    },
    37463: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.setModulusLength = t.weakMap = void 0),
        (t.weakMap = new WeakMap()));
      let r = (e, t) => {
          let n = e.readUInt8(1);
          if ((128 & n) == 0) return 0 === t ? n : r(e.subarray(2 + n), t - 1);
          let o = 127 & n;
          n = 0;
          for (let t = 0; t < o; t++) ((n <<= 8), (n |= e.readUInt8(2 + t)));
          return 0 === t ? n : r(e.subarray(2 + n), t - 1);
        },
        n = (e, t) => {
          let n = e.readUInt8(1);
          return (128 & n) == 0
            ? r(e.subarray(2), t)
            : r(e.subarray(2 + (127 & n)), t);
        },
        o = e => {
          var r, o;
          if (t.weakMap.has(e)) return t.weakMap.get(e);
          let i =
            null !==
              (o =
                null === (r = e.asymmetricKeyDetails) || void 0 === r
                  ? void 0
                  : r.modulusLength) && void 0 !== o
              ? o
              : (n(
                  e.export({ format: 'der', type: 'pkcs1' }),
                  'private' === e.type ? 1 : 0
                ) -
                  1) <<
                3;
          return (t.weakMap.set(e, i), i);
        };
      ((t.setModulusLength = (e, r) => {
        t.weakMap.set(e, r);
      }),
        (t.default = (e, t) => {
          if (2048 > o(e))
            throw TypeError(
              `${t} requires key modulusLength to be 2048 bits or larger`
            );
        }));
    },
    49679: (e, t, r) => {
      'use strict';
      let n;
      Object.defineProperty(t, '__esModule', { value: !0 });
      let o = r(6113);
      t.default = e => (n || (n = new Set((0, o.getCiphers)())), n.has(e));
    },
    23402: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113),
        o = r(57091),
        i = r(93453),
        a = r(51274),
        s = r(17389),
        c = r(25633),
        l = r(77149),
        u = r(76027),
        d = r(43153),
        p = r(85477),
        f = r(59841),
        h = r(49679),
        y = r(70627);
      t.default = (e, t, r, g, v, m) => {
        let b;
        if ((0, u.isCryptoKey)(t))
          ((0, d.checkEncCryptoKey)(t, e, 'decrypt'),
            (b = n.KeyObject.from(t)));
        else if (t instanceof Uint8Array || (0, p.default)(t)) b = t;
        else throw TypeError((0, f.default)(t, ...y.types, 'Uint8Array'));
        switch (((0, i.default)(e, b), (0, o.default)(e, g), e)) {
          case 'A128CBC-HS256':
          case 'A192CBC-HS384':
          case 'A256CBC-HS512':
            return (function (e, t, r, o, i, u) {
              let d, f;
              let y = parseInt(e.slice(1, 4), 10);
              (0, p.default)(t) && (t = t.export());
              let g = t.subarray(y >> 3),
                v = t.subarray(0, y >> 3),
                m = parseInt(e.slice(-3), 10),
                b = `aes-${y}-cbc`;
              if (!(0, h.default)(b))
                throw new s.JOSENotSupported(
                  `alg ${e} is not supported by your javascript runtime`
                );
              let _ = (0, l.default)(u, o, r, m, v, y);
              try {
                d = (0, c.default)(i, _);
              } catch {}
              if (!d) throw new s.JWEDecryptionFailed();
              try {
                let e = (0, n.createDecipheriv)(b, g, o);
                f = (0, a.concat)(e.update(r), e.final());
              } catch {}
              if (!f) throw new s.JWEDecryptionFailed();
              return f;
            })(e, b, r, g, v, m);
          case 'A128GCM':
          case 'A192GCM':
          case 'A256GCM':
            return (function (e, t, r, o, i, a) {
              let c = parseInt(e.slice(1, 4), 10),
                l = `aes-${c}-gcm`;
              if (!(0, h.default)(l))
                throw new s.JOSENotSupported(
                  `alg ${e} is not supported by your javascript runtime`
                );
              try {
                let e = (0, n.createDecipheriv)(l, t, o, { authTagLength: 16 });
                (e.setAuthTag(i),
                  a.byteLength && e.setAAD(a, { plaintextLength: r.length }));
                let s = e.update(r);
                return (e.final(), s);
              } catch {
                throw new s.JWEDecryptionFailed();
              }
            })(e, b, r, g, v, m);
          default:
            throw new s.JOSENotSupported(
              'Unsupported JWE Content Encryption Algorithm'
            );
        }
      };
    },
    96833: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113);
      t.default = (e, t) => (0, n.createHash)(e).update(t).digest();
    },
    38806: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389);
      t.default = function (e) {
        switch (e) {
          case 'PS256':
          case 'RS256':
          case 'ES256':
          case 'ES256K':
            return 'sha256';
          case 'PS384':
          case 'RS384':
          case 'ES384':
            return 'sha384';
          case 'PS512':
          case 'RS512':
          case 'ES512':
            return 'sha512';
          case 'EdDSA':
            return;
          default:
            throw new n.JOSENotSupported(
              `alg ${e} is not supported either by JOSE or your javascript runtime`
            );
        }
      };
    },
    31456: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.ecdhAllowed = t.generateEpk = t.deriveKey = void 0));
      let n = r(6113),
        o = r(73837),
        i = r(82980),
        a = r(51274),
        s = r(17389),
        c = r(76027),
        l = r(43153),
        u = r(85477),
        d = r(59841),
        p = r(70627),
        f = (0, o.promisify)(n.generateKeyPair);
      async function h(
        e,
        t,
        r,
        o,
        i = new Uint8Array(0),
        s = new Uint8Array(0)
      ) {
        let f, h;
        if ((0, c.isCryptoKey)(e))
          ((0, l.checkEncCryptoKey)(e, 'ECDH'), (f = n.KeyObject.from(e)));
        else if ((0, u.default)(e)) f = e;
        else throw TypeError((0, d.default)(e, ...p.types));
        if ((0, c.isCryptoKey)(t))
          ((0, l.checkEncCryptoKey)(t, 'ECDH', 'deriveBits'),
            (h = n.KeyObject.from(t)));
        else if ((0, u.default)(t)) h = t;
        else throw TypeError((0, d.default)(t, ...p.types));
        let y = (0, a.concat)(
            (0, a.lengthAndInput)(a.encoder.encode(r)),
            (0, a.lengthAndInput)(i),
            (0, a.lengthAndInput)(s),
            (0, a.uint32be)(o)
          ),
          g = (0, n.diffieHellman)({ privateKey: h, publicKey: f });
        return (0, a.concatKdf)(g, o, y);
      }
      async function y(e) {
        let t;
        if ((0, c.isCryptoKey)(e)) t = n.KeyObject.from(e);
        else if ((0, u.default)(e)) t = e;
        else throw TypeError((0, d.default)(e, ...p.types));
        switch (t.asymmetricKeyType) {
          case 'x25519':
            return f('x25519');
          case 'x448':
            return f('x448');
          case 'ec':
            return f('ec', { namedCurve: (0, i.default)(t) });
          default:
            throw new s.JOSENotSupported('Invalid or unsupported EPK');
        }
      }
      ((t.deriveKey = h),
        (t.generateEpk = y),
        (t.ecdhAllowed = e =>
          ['P-256', 'P-384', 'P-521', 'X25519', 'X448'].includes(
            (0, i.default)(e)
          )));
    },
    43178: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113),
        o = r(57091),
        i = r(93453),
        a = r(51274),
        s = r(77149),
        c = r(76027),
        l = r(43153),
        u = r(85477),
        d = r(59841),
        p = r(17389),
        f = r(49679),
        h = r(70627);
      t.default = (e, t, r, y, g) => {
        let v;
        if ((0, c.isCryptoKey)(r))
          ((0, l.checkEncCryptoKey)(r, e, 'encrypt'),
            (v = n.KeyObject.from(r)));
        else if (r instanceof Uint8Array || (0, u.default)(r)) v = r;
        else throw TypeError((0, d.default)(r, ...h.types, 'Uint8Array'));
        switch (((0, i.default)(e, v), (0, o.default)(e, y), e)) {
          case 'A128CBC-HS256':
          case 'A192CBC-HS384':
          case 'A256CBC-HS512':
            return (function (e, t, r, o, i) {
              let c = parseInt(e.slice(1, 4), 10);
              (0, u.default)(r) && (r = r.export());
              let l = r.subarray(c >> 3),
                d = r.subarray(0, c >> 3),
                h = `aes-${c}-cbc`;
              if (!(0, f.default)(h))
                throw new p.JOSENotSupported(
                  `alg ${e} is not supported by your javascript runtime`
                );
              let y = (0, n.createCipheriv)(h, l, o),
                g = (0, a.concat)(y.update(t), y.final()),
                v = parseInt(e.slice(-3), 10),
                m = (0, s.default)(i, o, g, v, d, c);
              return { ciphertext: g, tag: m };
            })(e, t, v, y, g);
          case 'A128GCM':
          case 'A192GCM':
          case 'A256GCM':
            return (function (e, t, r, o, i) {
              let a = parseInt(e.slice(1, 4), 10),
                s = `aes-${a}-gcm`;
              if (!(0, f.default)(s))
                throw new p.JOSENotSupported(
                  `alg ${e} is not supported by your javascript runtime`
                );
              let c = (0, n.createCipheriv)(s, r, o, { authTagLength: 16 });
              i.byteLength && c.setAAD(i, { plaintextLength: t.length });
              let l = c.update(t);
              return (c.final(), { ciphertext: l, tag: c.getAuthTag() });
            })(e, t, v, y, g);
          default:
            throw new p.JOSENotSupported(
              'Unsupported JWE Content Encryption Algorithm'
            );
        }
      };
    },
    3791: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(13685),
        o = r(95687),
        i = r(82361),
        a = r(17389),
        s = r(51274),
        c = async (e, t, r) => {
          let c;
          switch (e.protocol) {
            case 'https:':
              c = o.get;
              break;
            case 'http:':
              c = n.get;
              break;
            default:
              throw TypeError('Unsupported URL protocol.');
          }
          let { agent: l, headers: u } = r,
            d = c(e.href, { agent: l, timeout: t, headers: u }),
            [p] = await Promise.race([
              (0, i.once)(d, 'response'),
              (0, i.once)(d, 'timeout'),
            ]);
          if (!p) throw (d.destroy(), new a.JWKSTimeout());
          if (200 !== p.statusCode)
            throw new a.JOSEError(
              'Expected 200 OK from the JSON Web Key Set HTTP response'
            );
          let f = [];
          for await (let e of p) f.push(e);
          try {
            return JSON.parse(s.decoder.decode((0, s.concat)(...f)));
          } catch {
            throw new a.JOSEError(
              'Failed to parse the JSON Web Key Set HTTP response as JSON'
            );
          }
        };
      t.default = c;
    },
    83537: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.jwkImport =
          t.jwkExport =
          t.rsaPssParams =
          t.oneShotCallback =
            void 0));
      let [r, n] = process.versions.node.split('.').map(e => parseInt(e, 10));
      ((t.oneShotCallback = r >= 16 || (15 === r && n >= 13)),
        (t.rsaPssParams =
          !('electron' in process.versions) &&
          (r >= 17 || (16 === r && n >= 9))),
        (t.jwkExport = r >= 16 || (15 === r && n >= 9)),
        (t.jwkImport = r >= 16 || (15 === r && n >= 12)));
    },
    88242: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.generateKeyPair = t.generateSecret = void 0));
      let n = r(6113),
        o = r(73837),
        i = r(30655),
        a = r(37463),
        s = r(17389),
        c = (0, o.promisify)(n.generateKeyPair);
      async function l(e, t) {
        let r;
        switch (e) {
          case 'HS256':
          case 'HS384':
          case 'HS512':
          case 'A128CBC-HS256':
          case 'A192CBC-HS384':
          case 'A256CBC-HS512':
            r = parseInt(e.slice(-3), 10);
            break;
          case 'A128KW':
          case 'A192KW':
          case 'A256KW':
          case 'A128GCMKW':
          case 'A192GCMKW':
          case 'A256GCMKW':
          case 'A128GCM':
          case 'A192GCM':
          case 'A256GCM':
            r = parseInt(e.slice(1, 4), 10);
            break;
          default:
            throw new s.JOSENotSupported(
              'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
            );
        }
        return (0, n.createSecretKey)((0, i.default)(new Uint8Array(r >> 3)));
      }
      async function u(e, t) {
        var r, n;
        switch (e) {
          case 'RS256':
          case 'RS384':
          case 'RS512':
          case 'PS256':
          case 'PS384':
          case 'PS512':
          case 'RSA-OAEP':
          case 'RSA-OAEP-256':
          case 'RSA-OAEP-384':
          case 'RSA-OAEP-512':
          case 'RSA1_5': {
            let e =
              null !== (r = null == t ? void 0 : t.modulusLength) &&
              void 0 !== r
                ? r
                : 2048;
            if ('number' != typeof e || e < 2048)
              throw new s.JOSENotSupported(
                'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used'
              );
            let n = await c('rsa', { modulusLength: e, publicExponent: 65537 });
            return (
              (0, a.setModulusLength)(n.privateKey, e),
              (0, a.setModulusLength)(n.publicKey, e),
              n
            );
          }
          case 'ES256':
            return c('ec', { namedCurve: 'P-256' });
          case 'ES256K':
            return c('ec', { namedCurve: 'secp256k1' });
          case 'ES384':
            return c('ec', { namedCurve: 'P-384' });
          case 'ES512':
            return c('ec', { namedCurve: 'P-521' });
          case 'EdDSA':
            switch (null == t ? void 0 : t.crv) {
              case void 0:
              case 'Ed25519':
                return c('ed25519');
              case 'Ed448':
                return c('ed448');
              default:
                throw new s.JOSENotSupported(
                  'Invalid or unsupported crv option provided, supported values are Ed25519 and Ed448'
                );
            }
          case 'ECDH-ES':
          case 'ECDH-ES+A128KW':
          case 'ECDH-ES+A192KW':
          case 'ECDH-ES+A256KW':
            let o =
              null !== (n = null == t ? void 0 : t.crv) && void 0 !== n
                ? n
                : 'P-256';
            switch (o) {
              case void 0:
              case 'P-256':
              case 'P-384':
              case 'P-521':
                return c('ec', { namedCurve: o });
              case 'X25519':
                return c('x25519');
              case 'X448':
                return c('x448');
              default:
                throw new s.JOSENotSupported(
                  'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448'
                );
            }
          default:
            throw new s.JOSENotSupported(
              'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
            );
        }
      }
      ((t.generateSecret = l), (t.generateKeyPair = u));
    },
    82980: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.setCurve = t.weakMap = void 0));
      let n = r(14300),
        o = r(6113),
        i = r(17389),
        a = r(76027),
        s = r(85477),
        c = r(59841),
        l = r(70627),
        u = n.Buffer.from([42, 134, 72, 206, 61, 3, 1, 7]),
        d = n.Buffer.from([43, 129, 4, 0, 34]),
        p = n.Buffer.from([43, 129, 4, 0, 35]),
        f = n.Buffer.from([43, 129, 4, 0, 10]);
      t.weakMap = new WeakMap();
      let h = e => {
          switch (e) {
            case 'prime256v1':
              return 'P-256';
            case 'secp384r1':
              return 'P-384';
            case 'secp521r1':
              return 'P-521';
            case 'secp256k1':
              return 'secp256k1';
            default:
              throw new i.JOSENotSupported(
                'Unsupported key curve for this operation'
              );
          }
        },
        y = (e, r) => {
          var n;
          let g;
          if ((0, a.isCryptoKey)(e)) g = o.KeyObject.from(e);
          else if ((0, s.default)(e)) g = e;
          else throw TypeError((0, c.default)(e, ...l.types));
          if ('secret' === g.type)
            throw TypeError(
              'only "private" or "public" type keys can be used for this operation'
            );
          switch (g.asymmetricKeyType) {
            case 'ed25519':
            case 'ed448':
              return `Ed${g.asymmetricKeyType.slice(2)}`;
            case 'x25519':
            case 'x448':
              return `X${g.asymmetricKeyType.slice(1)}`;
            case 'ec': {
              if (t.weakMap.has(g)) return t.weakMap.get(g);
              let e =
                null === (n = g.asymmetricKeyDetails) || void 0 === n
                  ? void 0
                  : n.namedCurve;
              if (e || 'private' !== g.type) {
                if (!e) {
                  let t = g.export({ format: 'der', type: 'spki' }),
                    r = t[1] < 128 ? 14 : 15,
                    n = t[r],
                    o = t.slice(r + 1, r + 1 + n);
                  if (o.equals(u)) e = 'prime256v1';
                  else if (o.equals(d)) e = 'secp384r1';
                  else if (o.equals(p)) e = 'secp521r1';
                  else if (o.equals(f)) e = 'secp256k1';
                  else
                    throw new i.JOSENotSupported(
                      'Unsupported key curve for this operation'
                    );
                }
              } else e = y((0, o.createPublicKey)(g), !0);
              if (r) return e;
              let a = h(e);
              return (t.weakMap.set(g, a), a);
            }
            default:
              throw TypeError('Invalid asymmetric key type for this operation');
          }
        };
      ((t.setCurve = function (e, r) {
        t.weakMap.set(e, r);
      }),
        (t.default = y));
    },
    2231: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113),
        o = r(76027),
        i = r(43153),
        a = r(59841),
        s = r(70627);
      t.default = function (e, t, r) {
        if (t instanceof Uint8Array) {
          if (!e.startsWith('HS'))
            throw TypeError((0, a.default)(t, ...s.types));
          return (0, n.createSecretKey)(t);
        }
        if (t instanceof n.KeyObject) return t;
        if ((0, o.isCryptoKey)(t))
          return ((0, i.checkSigCryptoKey)(t, e, r), n.KeyObject.from(t));
        throw TypeError((0, a.default)(t, ...s.types, 'Uint8Array'));
      };
    },
    75621: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(17389);
      t.default = function (e) {
        switch (e) {
          case 'HS256':
            return 'sha256';
          case 'HS384':
            return 'sha384';
          case 'HS512':
            return 'sha512';
          default:
            throw new n.JOSENotSupported(
              `alg ${e} is not supported either by JOSE or your javascript runtime`
            );
        }
      };
    },
    70627: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.types = void 0));
      let n = r(76027),
        o = r(85477);
      t.default = e => (0, o.default)(e) || (0, n.isCryptoKey)(e);
      let i = ['KeyObject'];
      ((t.types = i),
        (globalThis.CryptoKey ||
          (null === n.default || void 0 === n.default
            ? void 0
            : n.default.CryptoKey)) &&
          i.push('CryptoKey'));
    },
    85477: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113),
        o = r(73837);
      t.default = o.types.isKeyObject
        ? e => o.types.isKeyObject(e)
        : e => null != e && e instanceof n.KeyObject;
    },
    49487: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(14300),
        o = r(6113),
        i = r(62447),
        a = r(17389),
        s = r(82980),
        c = r(37463),
        l = r(56088),
        u = r(83537);
      t.default = e => {
        if (u.jwkImport && 'oct' !== e.kty)
          return e.d
            ? (0, o.createPrivateKey)({ format: 'jwk', key: e })
            : (0, o.createPublicKey)({ format: 'jwk', key: e });
        switch (e.kty) {
          case 'oct':
            return (0, o.createSecretKey)((0, i.decode)(e.k));
          case 'RSA': {
            let t = new l.default(),
              r = void 0 !== e.d,
              i = n.Buffer.from(e.n, 'base64'),
              a = n.Buffer.from(e.e, 'base64');
            r
              ? (t.zero(),
                t.unsignedInteger(i),
                t.unsignedInteger(a),
                t.unsignedInteger(n.Buffer.from(e.d, 'base64')),
                t.unsignedInteger(n.Buffer.from(e.p, 'base64')),
                t.unsignedInteger(n.Buffer.from(e.q, 'base64')),
                t.unsignedInteger(n.Buffer.from(e.dp, 'base64')),
                t.unsignedInteger(n.Buffer.from(e.dq, 'base64')),
                t.unsignedInteger(n.Buffer.from(e.qi, 'base64')))
              : (t.unsignedInteger(i), t.unsignedInteger(a));
            let s = { key: t.end(), format: 'der', type: 'pkcs1' },
              u = r ? (0, o.createPrivateKey)(s) : (0, o.createPublicKey)(s);
            return ((0, c.setModulusLength)(u, i.length << 3), u);
          }
          case 'EC': {
            let t = new l.default(),
              r = void 0 !== e.d,
              i = n.Buffer.concat([
                n.Buffer.alloc(1, 4),
                n.Buffer.from(e.x, 'base64'),
                n.Buffer.from(e.y, 'base64'),
              ]);
            if (r) {
              t.zero();
              let r = new l.default();
              (r.oidFor('ecPublicKey'), r.oidFor(e.crv), t.add(r.end()));
              let a = new l.default();
              (a.one(), a.octStr(n.Buffer.from(e.d, 'base64')));
              let c = new l.default();
              c.bitStr(i);
              let u = c.end(n.Buffer.from([161]));
              a.add(u);
              let d = a.end(),
                p = new l.default();
              p.add(d);
              let f = p.end(n.Buffer.from([4]));
              t.add(f);
              let h = t.end(),
                y = (0, o.createPrivateKey)({
                  key: h,
                  format: 'der',
                  type: 'pkcs8',
                });
              return ((0, s.setCurve)(y, e.crv), y);
            }
            let a = new l.default();
            (a.oidFor('ecPublicKey'),
              a.oidFor(e.crv),
              t.add(a.end()),
              t.bitStr(i));
            let c = t.end(),
              u = (0, o.createPublicKey)({
                key: c,
                format: 'der',
                type: 'spki',
              });
            return ((0, s.setCurve)(u, e.crv), u);
          }
          case 'OKP': {
            let t = new l.default();
            if (void 0 !== e.d) {
              t.zero();
              let r = new l.default();
              (r.oidFor(e.crv), t.add(r.end()));
              let i = new l.default();
              i.octStr(n.Buffer.from(e.d, 'base64'));
              let a = i.end(n.Buffer.from([4]));
              t.add(a);
              let s = t.end();
              return (0, o.createPrivateKey)({
                key: s,
                format: 'der',
                type: 'pkcs8',
              });
            }
            let r = new l.default();
            (r.oidFor(e.crv),
              t.add(r.end()),
              t.bitStr(n.Buffer.from(e.x, 'base64')));
            let i = t.end();
            return (0, o.createPublicKey)({
              key: i,
              format: 'der',
              type: 'spki',
            });
          }
          default:
            throw new a.JOSENotSupported(
              'Invalid or unsupported JWK "kty" (Key Type) Parameter value'
            );
        }
      };
    },
    86772: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      Object.defineProperty(t, '__esModule', { value: !0 });
      let i = r(6113),
        a = r(62447),
        s = r(89403),
        c = r(17389),
        l = r(82980),
        u = r(76027),
        d = r(85477),
        p = r(59841),
        f = r(70627),
        h = r(83537),
        y = e => {
          let t;
          if ((0, u.isCryptoKey)(e)) {
            if (!e.extractable) throw TypeError('CryptoKey is not extractable');
            t = i.KeyObject.from(e);
          } else if ((0, d.default)(e)) t = e;
          else if (e instanceof Uint8Array)
            return { kty: 'oct', k: (0, a.encode)(e) };
          else throw TypeError((0, p.default)(e, ...f.types, 'Uint8Array'));
          if (h.jwkExport) {
            if (
              'secret' !== t.type &&
              !['rsa', 'ec', 'ed25519', 'x25519', 'ed448', 'x448'].includes(
                t.asymmetricKeyType
              )
            )
              throw new c.JOSENotSupported('Unsupported key asymmetricKeyType');
            return t.export({ format: 'jwk' });
          }
          switch (t.type) {
            case 'secret':
              return { kty: 'oct', k: (0, a.encode)(t.export()) };
            case 'private':
            case 'public':
              switch (t.asymmetricKeyType) {
                case 'rsa': {
                  let e;
                  let r = t.export({ format: 'der', type: 'pkcs1' }),
                    n = new s.default(r);
                  'private' === t.type && n.unsignedInteger();
                  let i = (0, a.encode)(n.unsignedInteger()),
                    c = (0, a.encode)(n.unsignedInteger());
                  return (
                    'private' === t.type &&
                      (e = {
                        d: (0, a.encode)(n.unsignedInteger()),
                        p: (0, a.encode)(n.unsignedInteger()),
                        q: (0, a.encode)(n.unsignedInteger()),
                        dp: (0, a.encode)(n.unsignedInteger()),
                        dq: (0, a.encode)(n.unsignedInteger()),
                        qi: (0, a.encode)(n.unsignedInteger()),
                      }),
                    n.end(),
                    o({ kty: 'RSA', n: i, e: c }, e)
                  );
                }
                case 'ec': {
                  let e, r, n;
                  let s = (0, l.default)(t);
                  switch (s) {
                    case 'secp256k1':
                      ((e = 64), (r = 33), (n = -1));
                      break;
                    case 'P-256':
                      ((e = 64), (r = 36), (n = -1));
                      break;
                    case 'P-384':
                      ((e = 96), (r = 35), (n = -3));
                      break;
                    case 'P-521':
                      ((e = 132), (r = 35), (n = -3));
                      break;
                    default:
                      throw new c.JOSENotSupported('Unsupported curve');
                  }
                  if ('public' === t.type) {
                    let r = t.export({ type: 'spki', format: 'der' });
                    return {
                      kty: 'EC',
                      crv: s,
                      x: (0, a.encode)(r.subarray(-e, -e / 2)),
                      y: (0, a.encode)(r.subarray(-e / 2)),
                    };
                  }
                  let u = t.export({ type: 'pkcs8', format: 'der' });
                  return (
                    u.length < 100 && (r += n),
                    o(
                      o({}, y((0, i.createPublicKey)(t))),
                      {},
                      { d: (0, a.encode)(u.subarray(r, r + e / 2)) }
                    )
                  );
                }
                case 'ed25519':
                case 'x25519': {
                  let e = (0, l.default)(t);
                  if ('public' === t.type) {
                    let r = t.export({ type: 'spki', format: 'der' });
                    return {
                      kty: 'OKP',
                      crv: e,
                      x: (0, a.encode)(r.subarray(-32)),
                    };
                  }
                  let r = t.export({ type: 'pkcs8', format: 'der' });
                  return o(
                    o({}, y((0, i.createPublicKey)(t))),
                    {},
                    { d: (0, a.encode)(r.subarray(-32)) }
                  );
                }
                case 'ed448':
                case 'x448': {
                  let e = (0, l.default)(t);
                  if ('public' === t.type) {
                    let r = t.export({ type: 'spki', format: 'der' });
                    return {
                      kty: 'OKP',
                      crv: e,
                      x: (0, a.encode)(r.subarray('Ed448' === e ? -57 : -56)),
                    };
                  }
                  let r = t.export({ type: 'pkcs8', format: 'der' });
                  return o(
                    o({}, y((0, i.createPublicKey)(t))),
                    {},
                    { d: (0, a.encode)(r.subarray('Ed448' === e ? -57 : -56)) }
                  );
                }
                default:
                  throw new c.JOSENotSupported(
                    'Unsupported key asymmetricKeyType'
                  );
              }
            default:
              throw new c.JOSENotSupported('Unsupported key type');
          }
        };
      t.default = y;
    },
    36504: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      Object.defineProperty(t, '__esModule', { value: !0 });
      let i = r(6113),
        a = r(82980),
        s = r(17389),
        c = r(37463),
        l = r(83537),
        u = {
          padding: i.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: i.constants.RSA_PSS_SALTLEN_DIGEST,
        },
        d = new Map([
          ['ES256', 'P-256'],
          ['ES256K', 'secp256k1'],
          ['ES384', 'P-384'],
          ['ES512', 'P-521'],
        ]);
      t.default = function (e, t) {
        switch (e) {
          case 'EdDSA':
            if (!['ed25519', 'ed448'].includes(t.asymmetricKeyType))
              throw TypeError(
                'Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448'
              );
            return t;
          case 'RS256':
          case 'RS384':
          case 'RS512':
            if ('rsa' !== t.asymmetricKeyType)
              throw TypeError(
                'Invalid key for this operation, its asymmetricKeyType must be rsa'
              );
            return ((0, c.default)(t, e), t);
          case l.rsaPssParams && 'PS256':
          case l.rsaPssParams && 'PS384':
          case l.rsaPssParams && 'PS512':
            if ('rsa-pss' === t.asymmetricKeyType) {
              let {
                  hashAlgorithm: r,
                  mgf1HashAlgorithm: n,
                  saltLength: o,
                } = t.asymmetricKeyDetails,
                i = parseInt(e.slice(-3), 10);
              if (void 0 !== r && (r !== `sha${i}` || n !== r))
                throw TypeError(
                  `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${e}`
                );
              if (void 0 !== o && o > i >> 3)
                throw TypeError(
                  `Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${e}`
                );
            } else if ('rsa' !== t.asymmetricKeyType)
              throw TypeError(
                'Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss'
              );
            return ((0, c.default)(t, e), o({ key: t }, u));
          case !l.rsaPssParams && 'PS256':
          case !l.rsaPssParams && 'PS384':
          case !l.rsaPssParams && 'PS512':
            if ('rsa' !== t.asymmetricKeyType)
              throw TypeError(
                'Invalid key for this operation, its asymmetricKeyType must be rsa'
              );
            return ((0, c.default)(t, e), o({ key: t }, u));
          case 'ES256':
          case 'ES256K':
          case 'ES384':
          case 'ES512': {
            if ('ec' !== t.asymmetricKeyType)
              throw TypeError(
                'Invalid key for this operation, its asymmetricKeyType must be ec'
              );
            let r = (0, a.default)(t),
              n = d.get(e);
            if (r !== n)
              throw TypeError(
                `Invalid key curve for the algorithm, its curve must be ${n}, got ${r}`
              );
            return { dsaEncoding: 'ieee-p1363', key: t };
          }
          default:
            throw new s.JOSENotSupported(
              `alg ${e} is not supported either by JOSE or your javascript runtime`
            );
        }
      };
    },
    4766: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decrypt = t.encrypt = void 0));
      let n = r(73837),
        o = r(6113),
        i = r(30655),
        a = r(51274),
        s = r(62447),
        c = r(62724),
        l = r(69509),
        u = r(76027),
        d = r(43153),
        p = r(85477),
        f = r(59841),
        h = r(70627),
        y = (0, n.promisify)(o.pbkdf2);
      function g(e, t) {
        if ((0, p.default)(e)) return e.export();
        if (e instanceof Uint8Array) return e;
        if ((0, u.isCryptoKey)(e))
          return (
            (0, d.checkEncCryptoKey)(e, t, 'deriveBits', 'deriveKey'),
            o.KeyObject.from(e).export()
          );
        throw TypeError((0, f.default)(e, ...h.types, 'Uint8Array'));
      }
      let v = async (
        e,
        t,
        r,
        n = 2048,
        o = (0, i.default)(new Uint8Array(16))
      ) => {
        (0, l.default)(o);
        let u = (0, a.p2s)(e, o),
          d = parseInt(e.slice(13, 16), 10) >> 3,
          p = g(t, e),
          f = await y(p, u, n, d, `sha${e.slice(8, 11)}`);
        return {
          encryptedKey: await (0, c.wrap)(e.slice(-6), f, r),
          p2c: n,
          p2s: (0, s.encode)(o),
        };
      };
      t.encrypt = v;
      let m = async (e, t, r, n, o) => {
        (0, l.default)(o);
        let i = (0, a.p2s)(e, o),
          s = parseInt(e.slice(13, 16), 10) >> 3,
          u = g(t, e),
          d = await y(u, i, n, s, `sha${e.slice(8, 11)}`);
        return (0, c.unwrap)(e.slice(-6), d, r);
      };
      t.decrypt = m;
    },
    30655: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = void 0));
      var n = r(6113);
      Object.defineProperty(t, 'default', {
        enumerable: !0,
        get: function () {
          return n.randomFillSync;
        },
      });
    },
    55924: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decrypt = t.encrypt = void 0));
      let n = r(6113),
        o = r(37463),
        i = r(76027),
        a = r(43153),
        s = r(85477),
        c = r(59841),
        l = r(70627),
        u = (e, t) => {
          if ('rsa' !== e.asymmetricKeyType)
            throw TypeError(
              'Invalid key for this operation, its asymmetricKeyType must be rsa'
            );
          (0, o.default)(e, t);
        },
        d = e => {
          switch (e) {
            case 'RSA-OAEP':
            case 'RSA-OAEP-256':
            case 'RSA-OAEP-384':
            case 'RSA-OAEP-512':
              return n.constants.RSA_PKCS1_OAEP_PADDING;
            case 'RSA1_5':
              return n.constants.RSA_PKCS1_PADDING;
            default:
              return;
          }
        },
        p = e => {
          switch (e) {
            case 'RSA-OAEP':
              return 'sha1';
            case 'RSA-OAEP-256':
              return 'sha256';
            case 'RSA-OAEP-384':
              return 'sha384';
            case 'RSA-OAEP-512':
              return 'sha512';
            default:
              return;
          }
        };
      function f(e, t, ...r) {
        if ((0, s.default)(e)) return e;
        if ((0, i.isCryptoKey)(e))
          return ((0, a.checkEncCryptoKey)(e, t, ...r), n.KeyObject.from(e));
        throw TypeError((0, c.default)(e, ...l.types));
      }
      ((t.encrypt = (e, t, r) => {
        let o = d(e),
          i = p(e),
          a = f(t, e, 'wrapKey', 'encrypt');
        return (
          u(a, e),
          (0, n.publicEncrypt)({ key: a, oaepHash: i, padding: o }, r)
        );
      }),
        (t.decrypt = (e, t, r) => {
          let o = d(e),
            i = p(e),
            a = f(t, e, 'unwrapKey', 'decrypt');
          return (
            u(a, e),
            (0, n.privateDecrypt)({ key: a, oaepHash: i, padding: o }, r)
          );
        }));
    },
    51773: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = 'node:crypto'));
    },
    4970: (e, t, r) => {
      'use strict';
      let n;
      Object.defineProperty(t, '__esModule', { value: !0 });
      let o = r(6113),
        i = r(73837),
        a = r(38806),
        s = r(75621),
        c = r(36504),
        l = r(2231);
      n = o.sign.length > 3 ? (0, i.promisify)(o.sign) : o.sign;
      let u = async (e, t, r) => {
        let i = (0, l.default)(e, t, 'sign');
        if (e.startsWith('HS')) {
          let t = o.createHmac((0, s.default)(e), i);
          return (t.update(r), t.digest());
        }
        return n((0, a.default)(e), r, (0, c.default)(e, i));
      };
      t.default = u;
    },
    25633: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(6113).timingSafeEqual;
      t.default = n;
    },
    94011: (e, t, r) => {
      'use strict';
      let n;
      Object.defineProperty(t, '__esModule', { value: !0 });
      let o = r(6113),
        i = r(73837),
        a = r(38806),
        s = r(36504),
        c = r(4970),
        l = r(2231),
        u = r(83537);
      n =
        o.verify.length > 4 && u.oneShotCallback
          ? (0, i.promisify)(o.verify)
          : o.verify;
      let d = async (e, t, r, i) => {
        let u = (0, l.default)(e, t, 'verify');
        if (e.startsWith('HS')) {
          let t = await (0, c.default)(e, u, i);
          try {
            return o.timingSafeEqual(r, t);
          } catch {
            return !1;
          }
        }
        let d = (0, a.default)(e),
          p = (0, s.default)(e, u);
        try {
          return await n(d, i, p, r);
        } catch {
          return !1;
        }
      };
      t.default = d;
    },
    76027: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.isCryptoKey = void 0));
      let n = r(6113),
        o = r(73837),
        i = n.webcrypto;
      ((t.default = i),
        (t.isCryptoKey = o.types.isCryptoKey
          ? e => o.types.isCryptoKey(e)
          : e => !1));
    },
    83830: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.deflate = t.inflate = void 0));
      let n = r(73837),
        o = r(59796),
        i = r(17389),
        a = (0, n.promisify)(o.inflateRaw),
        s = (0, n.promisify)(o.deflateRaw);
      ((t.inflate = e =>
        a(e, { maxOutputLength: 25e4 }).catch(() => {
          throw new i.JWEDecompressionFailed();
        })),
        (t.deflate = e => s(e)));
    },
    87762: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decode = t.encode = void 0));
      let n = r(62447);
      ((t.encode = n.encode), (t.decode = n.decode));
    },
    80967: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decodeJwt = void 0));
      let n = r(87762),
        o = r(51274),
        i = r(25686),
        a = r(17389);
      t.decodeJwt = function (e) {
        let t, r;
        if ('string' != typeof e)
          throw new a.JWTInvalid(
            'JWTs must use Compact JWS serialization, JWT must be a string'
          );
        let { 1: s, length: c } = e.split('.');
        if (5 === c)
          throw new a.JWTInvalid(
            'Only JWTs using Compact JWS serialization can be decoded'
          );
        if (3 !== c) throw new a.JWTInvalid('Invalid JWT');
        if (!s) throw new a.JWTInvalid('JWTs must contain a payload');
        try {
          t = (0, n.decode)(s);
        } catch {
          throw new a.JWTInvalid('Failed to base64url decode the payload');
        }
        try {
          r = JSON.parse(o.decoder.decode(t));
        } catch {
          throw new a.JWTInvalid('Failed to parse the decoded payload as JSON');
        }
        if (!(0, i.default)(r))
          throw new a.JWTInvalid('Invalid JWT Claims Set');
        return r;
      };
    },
    69292: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decodeProtectedHeader = void 0));
      let n = r(87762),
        o = r(51274),
        i = r(25686);
      t.decodeProtectedHeader = function (e) {
        let t;
        if ('string' == typeof e) {
          let r = e.split('.');
          (3 === r.length || 5 === r.length) && ([t] = r);
        } else if ('object' == typeof e && e) {
          if ('protected' in e) t = e.protected;
          else throw TypeError('Token does not contain a Protected Header');
        }
        try {
          if ('string' != typeof t || !t) throw Error();
          let e = JSON.parse(o.decoder.decode((0, n.decode)(t)));
          if (!(0, i.default)(e)) throw Error();
          return e;
        } catch {
          throw TypeError('Invalid Token or Protected Header formatting');
        }
      };
    },
    17389: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.JWSSignatureVerificationFailed =
          t.JWKSTimeout =
          t.JWKSMultipleMatchingKeys =
          t.JWKSNoMatchingKey =
          t.JWKSInvalid =
          t.JWKInvalid =
          t.JWTInvalid =
          t.JWSInvalid =
          t.JWEInvalid =
          t.JWEDecompressionFailed =
          t.JWEDecryptionFailed =
          t.JOSENotSupported =
          t.JOSEAlgNotAllowed =
          t.JWTExpired =
          t.JWTClaimValidationFailed =
          t.JOSEError =
            void 0));
      class r extends Error {
        static get code() {
          return 'ERR_JOSE_GENERIC';
        }
        constructor(e) {
          var t;
          (super(e),
            (this.code = 'ERR_JOSE_GENERIC'),
            (this.name = this.constructor.name),
            null === (t = Error.captureStackTrace) ||
              void 0 === t ||
              t.call(Error, this, this.constructor));
        }
      }
      t.JOSEError = r;
      class n extends r {
        static get code() {
          return 'ERR_JWT_CLAIM_VALIDATION_FAILED';
        }
        constructor(e, t = 'unspecified', r = 'unspecified') {
          (super(e),
            (this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'),
            (this.claim = t),
            (this.reason = r));
        }
      }
      t.JWTClaimValidationFailed = n;
      class o extends r {
        static get code() {
          return 'ERR_JWT_EXPIRED';
        }
        constructor(e, t = 'unspecified', r = 'unspecified') {
          (super(e),
            (this.code = 'ERR_JWT_EXPIRED'),
            (this.claim = t),
            (this.reason = r));
        }
      }
      t.JWTExpired = o;
      class i extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JOSE_ALG_NOT_ALLOWED'));
        }
        static get code() {
          return 'ERR_JOSE_ALG_NOT_ALLOWED';
        }
      }
      t.JOSEAlgNotAllowed = i;
      class a extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JOSE_NOT_SUPPORTED'));
        }
        static get code() {
          return 'ERR_JOSE_NOT_SUPPORTED';
        }
      }
      t.JOSENotSupported = a;
      class s extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWE_DECRYPTION_FAILED'),
            (this.message = 'decryption operation failed'));
        }
        static get code() {
          return 'ERR_JWE_DECRYPTION_FAILED';
        }
      }
      t.JWEDecryptionFailed = s;
      class c extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWE_DECOMPRESSION_FAILED'),
            (this.message = 'decompression operation failed'));
        }
        static get code() {
          return 'ERR_JWE_DECOMPRESSION_FAILED';
        }
      }
      t.JWEDecompressionFailed = c;
      class l extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JWE_INVALID'));
        }
        static get code() {
          return 'ERR_JWE_INVALID';
        }
      }
      t.JWEInvalid = l;
      class u extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JWS_INVALID'));
        }
        static get code() {
          return 'ERR_JWS_INVALID';
        }
      }
      t.JWSInvalid = u;
      class d extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JWT_INVALID'));
        }
        static get code() {
          return 'ERR_JWT_INVALID';
        }
      }
      t.JWTInvalid = d;
      class p extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JWK_INVALID'));
        }
        static get code() {
          return 'ERR_JWK_INVALID';
        }
      }
      t.JWKInvalid = p;
      class f extends r {
        constructor() {
          (super(...arguments), (this.code = 'ERR_JWKS_INVALID'));
        }
        static get code() {
          return 'ERR_JWKS_INVALID';
        }
      }
      t.JWKSInvalid = f;
      class h extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWKS_NO_MATCHING_KEY'),
            (this.message = 'no applicable key found in the JSON Web Key Set'));
        }
        static get code() {
          return 'ERR_JWKS_NO_MATCHING_KEY';
        }
      }
      t.JWKSNoMatchingKey = h;
      class y extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'),
            (this.message =
              'multiple matching keys found in the JSON Web Key Set'));
        }
        static get code() {
          return 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
        }
      }
      ((t.JWKSMultipleMatchingKeys = y), Symbol.asyncIterator);
      class g extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWKS_TIMEOUT'),
            (this.message = 'request timed out'));
        }
        static get code() {
          return 'ERR_JWKS_TIMEOUT';
        }
      }
      t.JWKSTimeout = g;
      class v extends r {
        constructor() {
          (super(...arguments),
            (this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'),
            (this.message = 'signature verification failed'));
        }
        static get code() {
          return 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
        }
      }
      t.JWSSignatureVerificationFailed = v;
    },
    92339: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      let n = r(51773);
      t.default = n.default;
    },
    80903: (e, t, r) => {
      'use strict';
      let n = r(94816),
        o = Symbol('max'),
        i = Symbol('length'),
        a = Symbol('lengthCalculator'),
        s = Symbol('allowStale'),
        c = Symbol('maxAge'),
        l = Symbol('dispose'),
        u = Symbol('noDisposeOnSet'),
        d = Symbol('lruList'),
        p = Symbol('cache'),
        f = Symbol('updateAgeOnGet'),
        h = () => 1;
      class y {
        constructor(e) {
          if (
            ('number' == typeof e && (e = { max: e }),
            e || (e = {}),
            e.max && ('number' != typeof e.max || e.max < 0))
          )
            throw TypeError('max must be a non-negative number');
          this[o] = e.max || 1 / 0;
          let t = e.length || h;
          if (
            ((this[a] = 'function' != typeof t ? h : t),
            (this[s] = e.stale || !1),
            e.maxAge && 'number' != typeof e.maxAge)
          )
            throw TypeError('maxAge must be a number');
          ((this[c] = e.maxAge || 0),
            (this[l] = e.dispose),
            (this[u] = e.noDisposeOnSet || !1),
            (this[f] = e.updateAgeOnGet || !1),
            this.reset());
        }
        set max(e) {
          if ('number' != typeof e || e < 0)
            throw TypeError('max must be a non-negative number');
          ((this[o] = e || 1 / 0), m(this));
        }
        get max() {
          return this[o];
        }
        set allowStale(e) {
          this[s] = !!e;
        }
        get allowStale() {
          return this[s];
        }
        set maxAge(e) {
          if ('number' != typeof e)
            throw TypeError('maxAge must be a non-negative number');
          ((this[c] = e), m(this));
        }
        get maxAge() {
          return this[c];
        }
        set lengthCalculator(e) {
          ('function' != typeof e && (e = h),
            e !== this[a] &&
              ((this[a] = e),
              (this[i] = 0),
              this[d].forEach(e => {
                ((e.length = this[a](e.value, e.key)), (this[i] += e.length));
              })),
            m(this));
        }
        get lengthCalculator() {
          return this[a];
        }
        get length() {
          return this[i];
        }
        get itemCount() {
          return this[d].length;
        }
        rforEach(e, t) {
          t = t || this;
          for (let r = this[d].tail; null !== r; ) {
            let n = r.prev;
            (w(this, e, r, t), (r = n));
          }
        }
        forEach(e, t) {
          t = t || this;
          for (let r = this[d].head; null !== r; ) {
            let n = r.next;
            (w(this, e, r, t), (r = n));
          }
        }
        keys() {
          return this[d].toArray().map(e => e.key);
        }
        values() {
          return this[d].toArray().map(e => e.value);
        }
        reset() {
          (this[l] &&
            this[d] &&
            this[d].length &&
            this[d].forEach(e => this[l](e.key, e.value)),
            (this[p] = new Map()),
            (this[d] = new n()),
            (this[i] = 0));
        }
        dump() {
          return this[d]
            .map(
              e =>
                !v(this, e) && {
                  k: e.key,
                  v: e.value,
                  e: e.now + (e.maxAge || 0),
                }
            )
            .toArray()
            .filter(e => e);
        }
        dumpLru() {
          return this[d];
        }
        set(e, t, r) {
          if ((r = r || this[c]) && 'number' != typeof r)
            throw TypeError('maxAge must be a number');
          let n = r ? Date.now() : 0,
            s = this[a](t, e);
          if (this[p].has(e)) {
            if (s > this[o]) return (b(this, this[p].get(e)), !1);
            let a = this[p].get(e).value;
            return (
              this[l] && !this[u] && this[l](e, a.value),
              (a.now = n),
              (a.maxAge = r),
              (a.value = t),
              (this[i] += s - a.length),
              (a.length = s),
              this.get(e),
              m(this),
              !0
            );
          }
          let f = new _(e, t, s, n, r);
          return f.length > this[o]
            ? (this[l] && this[l](e, t), !1)
            : ((this[i] += f.length),
              this[d].unshift(f),
              this[p].set(e, this[d].head),
              m(this),
              !0);
        }
        has(e) {
          return !!this[p].has(e) && !v(this, this[p].get(e).value);
        }
        get(e) {
          return g(this, e, !0);
        }
        peek(e) {
          return g(this, e, !1);
        }
        pop() {
          let e = this[d].tail;
          return e ? (b(this, e), e.value) : null;
        }
        del(e) {
          b(this, this[p].get(e));
        }
        load(e) {
          this.reset();
          let t = Date.now();
          for (let r = e.length - 1; r >= 0; r--) {
            let n = e[r],
              o = n.e || 0;
            if (0 === o) this.set(n.k, n.v);
            else {
              let e = o - t;
              e > 0 && this.set(n.k, n.v, e);
            }
          }
        }
        prune() {
          this[p].forEach((e, t) => g(this, t, !1));
        }
      }
      let g = (e, t, r) => {
          let n = e[p].get(t);
          if (n) {
            let t = n.value;
            if (v(e, t)) {
              if ((b(e, n), !e[s])) return;
            } else
              r && (e[f] && (n.value.now = Date.now()), e[d].unshiftNode(n));
            return t.value;
          }
        },
        v = (e, t) => {
          if (!t || (!t.maxAge && !e[c])) return !1;
          let r = Date.now() - t.now;
          return t.maxAge ? r > t.maxAge : e[c] && r > e[c];
        },
        m = e => {
          if (e[i] > e[o])
            for (let t = e[d].tail; e[i] > e[o] && null !== t; ) {
              let r = t.prev;
              (b(e, t), (t = r));
            }
        },
        b = (e, t) => {
          if (t) {
            let r = t.value;
            (e[l] && e[l](r.key, r.value),
              (e[i] -= r.length),
              e[p].delete(r.key),
              e[d].removeNode(t));
          }
        };
      class _ {
        constructor(e, t, r, n, o) {
          ((this.key = e),
            (this.value = t),
            (this.length = r),
            (this.now = n),
            (this.maxAge = o || 0));
        }
      }
      let w = (e, t, r, n) => {
        let o = r.value;
        (v(e, o) && (b(e, r), e[s] || (o = void 0)),
          o && t.call(n, o.value, o.key, e));
      };
      e.exports = y;
    },
    38398: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.UnsupportedStrategy =
          t.UnknownError =
          t.OAuthCallbackError =
          t.MissingSecret =
          t.MissingAuthorize =
          t.MissingAdapterMethods =
          t.MissingAdapter =
          t.MissingAPIRoute =
          t.InvalidCallbackUrl =
          t.AccountNotLinkedError =
            void 0),
        (t.adapterErrorHandler = function (e, t) {
          if (e)
            return Object.keys(e).reduce(function (r, n) {
              return (
                (r[n] = (0, i.default)(
                  o.default.mark(function r() {
                    var i,
                      a,
                      s,
                      c,
                      l,
                      u = arguments;
                    return o.default.wrap(
                      function (r) {
                        for (;;)
                          switch ((r.prev = r.next)) {
                            case 0:
                              for (
                                r.prev = 0, a = Array((i = u.length)), s = 0;
                                s < i;
                                s++
                              )
                                a[s] = u[s];
                              return (
                                t.debug('adapter_'.concat(n), { args: a }),
                                (c = e[n]),
                                (r.next = 6),
                                c.apply(void 0, a)
                              );
                            case 6:
                              return r.abrupt('return', r.sent);
                            case 9:
                              throw (
                                (r.prev = 9),
                                (r.t0 = r.catch(0)),
                                t.error('adapter_error_'.concat(n), r.t0),
                                ((l = new y(r.t0)).name = ''.concat(
                                  v(n),
                                  'Error'
                                )),
                                l
                              );
                            case 15:
                            case 'end':
                              return r.stop();
                          }
                      },
                      r,
                      null,
                      [[0, 9]]
                    );
                  })
                )),
                r
              );
            }, {});
        }),
        (t.capitalize = v),
        (t.eventsErrorHandler = function (e, t) {
          return Object.keys(e).reduce(function (r, n) {
            return (
              (r[n] = (0, i.default)(
                o.default.mark(function r() {
                  var i,
                    a = arguments;
                  return o.default.wrap(
                    function (r) {
                      for (;;)
                        switch ((r.prev = r.next)) {
                          case 0:
                            return (
                              (r.prev = 0),
                              (i = e[n]),
                              (r.next = 4),
                              i.apply(void 0, a)
                            );
                          case 4:
                            return r.abrupt('return', r.sent);
                          case 7:
                            ((r.prev = 7),
                              (r.t0 = r.catch(0)),
                              t.error(''.concat(g(n), '_EVENT_ERROR'), r.t0));
                          case 10:
                          case 'end':
                            return r.stop();
                        }
                    },
                    r,
                    null,
                    [[0, 7]]
                  );
                })
              )),
              r
            );
          }, {});
        }),
        (t.upperSnake = g));
      var o = n(r(17242)),
        i = n(r(4395)),
        a = n(r(20484)),
        s = n(r(48242)),
        c = n(r(74549)),
        l = n(r(39274)),
        u = n(r(50493)),
        d = n(r(77146)),
        p = n(r(54031));
      function f(e, t, r) {
        return (
          (t = (0, u.default)(t)),
          (0, l.default)(
            e,
            h()
              ? Reflect.construct(t, r || [], (0, u.default)(e).constructor)
              : t.apply(e, r)
          )
        );
      }
      function h() {
        try {
          var e = !Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          );
        } catch (e) {}
        return (h = function () {
          return !!e;
        })();
      }
      var y = (t.UnknownError = (function (e) {
        function t(e) {
          var r, n;
          return (
            (0, s.default)(this, t),
            ((n = f(this, t, [
              null !== (r = null == e ? void 0 : e.message) && void 0 !== r
                ? r
                : e,
            ])).name = 'UnknownError'),
            (n.code = e.code),
            e instanceof Error && (n.stack = e.stack),
            n
          );
        }
        return (
          (0, d.default)(t, e),
          (0, c.default)(t, [
            {
              key: 'toJSON',
              value: function () {
                return {
                  name: this.name,
                  message: this.message,
                  stack: this.stack,
                };
              },
            },
          ])
        );
      })((0, p.default)(Error)));
      function g(e) {
        return e.replace(/([A-Z])/g, '_$1').toUpperCase();
      }
      function v(e) {
        return ''.concat(e[0].toUpperCase()).concat(e.slice(1));
      }
      ((t.OAuthCallbackError = (function (e) {
        function t() {
          var e;
          (0, s.default)(this, t);
          for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
            n[o] = arguments[o];
          return (
            (e = f(this, t, [].concat(n))),
            (0, a.default)(e, 'name', 'OAuthCallbackError'),
            e
          );
        }
        return ((0, d.default)(t, e), (0, c.default)(t));
      })(y)),
        (t.AccountNotLinkedError = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'AccountNotLinkedError'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.MissingAPIRoute = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'MissingAPIRouteError'),
              (0, a.default)(e, 'code', 'MISSING_NEXTAUTH_API_ROUTE_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.MissingSecret = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'MissingSecretError'),
              (0, a.default)(e, 'code', 'NO_SECRET'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.MissingAuthorize = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'MissingAuthorizeError'),
              (0, a.default)(e, 'code', 'CALLBACK_CREDENTIALS_HANDLER_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.MissingAdapter = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'MissingAdapterError'),
              (0, a.default)(e, 'code', 'EMAIL_REQUIRES_ADAPTER_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.MissingAdapterMethods = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'MissingAdapterMethodsError'),
              (0, a.default)(e, 'code', 'MISSING_ADAPTER_METHODS_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.UnsupportedStrategy = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'UnsupportedStrategyError'),
              (0, a.default)(e, 'code', 'CALLBACK_CREDENTIALS_JWT_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)),
        (t.InvalidCallbackUrl = (function (e) {
          function t() {
            var e;
            (0, s.default)(this, t);
            for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)
              n[o] = arguments[o];
            return (
              (e = f(this, t, [].concat(n))),
              (0, a.default)(e, 'name', 'InvalidCallbackUrl'),
              (0, a.default)(e, 'code', 'INVALID_CALLBACK_URL_ERROR'),
              e
            );
          }
          return ((0, d.default)(t, e), (0, c.default)(t));
        })(y)));
    },
    79846: (e, t, r) => {
      'use strict';
      let n = ['code', 'level'];
      function o(e, t) {
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
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? o(Object(r), !0).forEach(function (t) {
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
              : o(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var a = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.AuthHandler = b));
      var s = g(r(21670)),
        c = r(56962),
        l = g(r(89918)),
        u = a(r(34699)),
        d = r(63756),
        p = r(91524),
        f = r(85733),
        h = r(29706);
      function y(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (y = function (e) {
          return e ? r : t;
        })(e);
      }
      function g(e, t) {
        if (!t && e && e.__esModule) return e;
        if (null === e || ('object' != typeof e && 'function' != typeof e))
          return { default: e };
        var r = y(t);
        if (r && r.has(e)) return r.get(e);
        var n = { __proto__: null },
          o = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i in e)
          if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
            var a = o ? Object.getOwnPropertyDescriptor(e, i) : null;
            a && (a.get || a.set)
              ? Object.defineProperty(n, i, a)
              : (n[i] = e[i]);
          }
        return ((n.default = e), r && r.set(e, n), n);
      }
      async function v(e) {
        try {
          return await e.json();
        } catch (e) {}
      }
      async function m(e) {
        var t, r, n, o;
        if (e instanceof Request) {
          let t = new URL(e.url),
            i = t.pathname.split('/').slice(3),
            a = Object.fromEntries(e.headers),
            s = Object.fromEntries(t.searchParams);
          return (
            (s.nextauth = i),
            {
              action: i[0],
              method: e.method,
              headers: a,
              body: await v(e),
              cookies: (0, h.parse)(
                null !== (r = e.headers.get('cookie')) && void 0 !== r ? r : ''
              ),
              providerId: i[1],
              error:
                null !== (n = t.searchParams.get('error')) && void 0 !== n
                  ? n
                  : i[1],
              origin: (0, c.detectOrigin)(
                null !== (o = a['x-forwarded-host']) && void 0 !== o
                  ? o
                  : a.host,
                a['x-forwarded-proto']
              ),
              query: s,
            }
          );
        }
        let { headers: i } = e,
          a =
            null !== (t = null == i ? void 0 : i['x-forwarded-host']) &&
            void 0 !== t
              ? t
              : null == i
                ? void 0
                : i.host;
        return (
          (e.origin = (0, c.detectOrigin)(
            a,
            null == i ? void 0 : i['x-forwarded-proto']
          )),
          e
        );
      }
      async function b(e) {
        var t, r, o, a, c, h, y;
        let { options: g, req: v } = e,
          b = await m(v);
        (0, s.setLogger)(g.logger, g.debug);
        let _ = (0, p.assertConfig)({ options: g, req: b });
        if (Array.isArray(_)) _.forEach(s.default.warn);
        else if (_ instanceof Error) {
          if (
            (s.default.error(_.code, _),
            !['signin', 'signout', 'error', 'verify-request'].includes(
              b.action
            ) || 'GET' !== b.method)
          )
            return {
              status: 500,
              headers: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                message:
                  'There is a problem with the server configuration. Check the server logs for more information.',
              },
            };
          let { pages: e, theme: t } = g,
            r =
              (null == e ? void 0 : e.error) &&
              (null === (c = b.query) ||
              void 0 === c ||
              null === (c = c.callbackUrl) ||
              void 0 === c
                ? void 0
                : c.startsWith(e.error));
          return !(null != e && e.error) || r
            ? (r &&
                s.default.error(
                  'AUTH_ON_ERROR_PAGE_ERROR',
                  Error(
                    `The error page ${null == e ? void 0 : e.error} should not require authentication`
                  )
                ),
              (0, u.default)({ theme: t }).error({ error: 'configuration' }))
            : { redirect: `${e.error}?error=Configuration` };
        }
        let { action: w, providerId: O, error: S, method: E = 'GET' } = b,
          { options: k, cookies: P } = await (0, d.init)({
            authOptions: g,
            action: w,
            providerId: O,
            origin: b.origin,
            callbackUrl:
              null !==
                (t =
                  null === (r = b.body) || void 0 === r
                    ? void 0
                    : r.callbackUrl) && void 0 !== t
                ? t
                : null === (o = b.query) || void 0 === o
                  ? void 0
                  : o.callbackUrl,
            csrfToken:
              null === (a = b.body) || void 0 === a ? void 0 : a.csrfToken,
            cookies: b.cookies,
            isPost: 'POST' === E,
          }),
          j = new f.SessionStore(k.cookies.sessionToken, b, k.logger);
        if ('GET' === E) {
          let e = (0, u.default)(
              i(i({}, k), {}, { query: b.query, cookies: P })
            ),
            { pages: t } = k;
          switch (w) {
            case 'providers':
              return await l.providers(k.providers);
            case 'session': {
              let e = await l.session({ options: k, sessionStore: j });
              return (
                e.cookies && P.push(...e.cookies),
                i(i({}, e), {}, { cookies: P })
              );
            }
            case 'csrf':
              return {
                headers: [{ key: 'Content-Type', value: 'application/json' }],
                body: { csrfToken: k.csrfToken },
                cookies: P,
              };
            case 'signin':
              if (t.signIn) {
                let e = `${t.signIn}${t.signIn.includes('?') ? '&' : '?'}callbackUrl=${encodeURIComponent(k.callbackUrl)}`;
                return (
                  S && (e = `${e}&error=${encodeURIComponent(S)}`),
                  { redirect: e, cookies: P }
                );
              }
              return e.signin();
            case 'signout':
              if (t.signOut) return { redirect: t.signOut, cookies: P };
              return e.signout();
            case 'callback':
              if (k.provider) {
                let e = await l.callback({
                  body: b.body,
                  query: b.query,
                  headers: b.headers,
                  cookies: b.cookies,
                  method: E,
                  options: k,
                  sessionStore: j,
                });
                return (
                  e.cookies && P.push(...e.cookies),
                  i(i({}, e), {}, { cookies: P })
                );
              }
              break;
            case 'verify-request':
              if (t.verifyRequest)
                return { redirect: t.verifyRequest, cookies: P };
              return e.verifyRequest();
            case 'error':
              if (
                [
                  'Signin',
                  'OAuthSignin',
                  'OAuthCallback',
                  'OAuthCreateAccount',
                  'EmailCreateAccount',
                  'Callback',
                  'OAuthAccountNotLinked',
                  'EmailSignin',
                  'CredentialsSignin',
                  'SessionRequired',
                ].includes(S)
              )
                return { redirect: `${k.url}/signin?error=${S}`, cookies: P };
              if (t.error)
                return {
                  redirect: `${t.error}${t.error.includes('?') ? '&' : '?'}error=${S}`,
                  cookies: P,
                };
              return e.error({ error: S });
          }
        } else if ('POST' === E)
          switch (w) {
            case 'signin':
              if (k.csrfTokenVerified && k.provider) {
                let e = await l.signin({
                  query: b.query,
                  body: b.body,
                  options: k,
                });
                return (
                  e.cookies && P.push(...e.cookies),
                  i(i({}, e), {}, { cookies: P })
                );
              }
              return { redirect: `${k.url}/signin?csrf=true`, cookies: P };
            case 'signout':
              if (k.csrfTokenVerified) {
                let e = await l.signout({ options: k, sessionStore: j });
                return (
                  e.cookies && P.push(...e.cookies),
                  i(i({}, e), {}, { cookies: P })
                );
              }
              return { redirect: `${k.url}/signout?csrf=true`, cookies: P };
            case 'callback':
              if (k.provider) {
                if ('credentials' === k.provider.type && !k.csrfTokenVerified)
                  return { redirect: `${k.url}/signin?csrf=true`, cookies: P };
                let e = await l.callback({
                  body: b.body,
                  query: b.query,
                  headers: b.headers,
                  cookies: b.cookies,
                  method: E,
                  options: k,
                  sessionStore: j,
                });
                return (
                  e.cookies && P.push(...e.cookies),
                  i(i({}, e), {}, { cookies: P })
                );
              }
              break;
            case '_log':
              if (g.logger)
                try {
                  let e = null !== (h = b.body) && void 0 !== h ? h : {},
                    { code: t, level: r } = e,
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
                              Object.prototype.propertyIsEnumerable.call(
                                e,
                                r
                              ) &&
                              (o[r] = e[r]));
                      }
                      return o;
                    })(e, n);
                  s.default[r](t, o);
                } catch (e) {
                  s.default.error('LOGGER_ERROR', e);
                }
              return {};
            case 'session':
              if (k.csrfTokenVerified) {
                let e = await l.session({
                  options: k,
                  sessionStore: j,
                  newSession:
                    null === (y = b.body) || void 0 === y ? void 0 : y.data,
                  isUpdate: !0,
                });
                return (
                  e.cookies && P.push(...e.cookies),
                  i(i({}, e), {}, { cookies: P })
                );
              }
              return { status: 400, body: {}, cookies: P };
          }
        return {
          status: 400,
          body: `Error: This action with HTTP ${E} is not supported by NextAuth.js`,
        };
      }
    },
    63756: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var i = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.init = b));
      var a = r(6113),
        s = i(r(21670)),
        c = r(38398),
        l = i(r(53676)),
        u = r(80878),
        d = m(r(85733)),
        p = m(r(6399)),
        f = r(26346),
        h = r(7380),
        y = r(10457),
        g = i(r(41932));
      function v(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (v = function (e) {
          return e ? r : t;
        })(e);
      }
      function m(e, t) {
        if (!t && e && e.__esModule) return e;
        if (null === e || ('object' != typeof e && 'function' != typeof e))
          return { default: e };
        var r = v(t);
        if (r && r.has(e)) return r.get(e);
        var n = { __proto__: null },
          o = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i in e)
          if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
            var a = o ? Object.getOwnPropertyDescriptor(e, i) : null;
            a && (a.get || a.set)
              ? Object.defineProperty(n, i, a)
              : (n[i] = e[i]);
          }
        return ((n.default = e), r && r.set(e, n), n);
      }
      async function b({
        authOptions: e,
        providerId: t,
        action: r,
        origin: n,
        cookies: i,
        callbackUrl: v,
        csrfToken: m,
        isPost: b,
      }) {
        var _, w;
        let O = (0, g.default)(n),
          S = (0, u.createSecret)({ authOptions: e, url: O }),
          { providers: E, provider: k } = (0, l.default)({
            providers: e.providers,
            url: O,
            providerId: t,
          }),
          P = o(
            o(
              {
                debug: !1,
                pages: {},
                theme: {
                  colorScheme: 'auto',
                  logo: '',
                  brandColor: '',
                  buttonText: '',
                },
              },
              e
            ),
            {},
            {
              url: O,
              action: r,
              provider: k,
              cookies: o(
                o(
                  {},
                  d.defaultCookies(
                    null !== (_ = e.useSecureCookies) && void 0 !== _
                      ? _
                      : O.base.startsWith('https://')
                  )
                ),
                e.cookies
              ),
              secret: S,
              providers: E,
              session: o(
                {
                  strategy: e.adapter ? 'database' : 'jwt',
                  maxAge: 2592e3,
                  updateAge: 86400,
                  generateSessionToken: () => {
                    var e;
                    return null !==
                      (e =
                        null === a.randomUUID || void 0 === a.randomUUID
                          ? void 0
                          : (0, a.randomUUID)()) && void 0 !== e
                      ? e
                      : (0, a.randomBytes)(32).toString('hex');
                  },
                },
                e.session
              ),
              jwt: o(
                {
                  secret: S,
                  maxAge: 2592e3,
                  encode: p.encode,
                  decode: p.decode,
                },
                e.jwt
              ),
              events: (0, c.eventsErrorHandler)(
                null !== (w = e.events) && void 0 !== w ? w : {},
                s.default
              ),
              adapter: (0, c.adapterErrorHandler)(e.adapter, s.default),
              callbacks: o(o({}, f.defaultCallbacks), e.callbacks),
              logger: s.default,
              callbackUrl: O.origin,
            }
          ),
          j = [],
          {
            csrfToken: A,
            cookie: x,
            csrfTokenVerified: T,
          } = (0, h.createCSRFToken)({
            options: P,
            cookieValue: null == i ? void 0 : i[P.cookies.csrfToken.name],
            isPost: b,
            bodyValue: m,
          });
        ((P.csrfToken = A),
          (P.csrfTokenVerified = T),
          x &&
            j.push({
              name: P.cookies.csrfToken.name,
              value: x,
              options: P.cookies.csrfToken.options,
            }));
        let { callbackUrl: C, callbackUrlCookie: W } = await (0,
        y.createCallbackUrl)({
          options: P,
          cookieValue: null == i ? void 0 : i[P.cookies.callbackUrl.name],
          paramValue: v,
        });
        return (
          (P.callbackUrl = C),
          W &&
            j.push({
              name: P.cookies.callbackUrl.name,
              value: W,
              options: P.cookies.callbackUrl.options,
            }),
          { options: P, cookies: j }
        );
      }
    },
    91524: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.assertConfig = function (e) {
          var t, r, n, l, u, d, p;
          let f, h, y;
          let { options: g, req: v } = e,
            m = [];
          if (
            (!s &&
              (v.origin || m.push('NEXTAUTH_URL'),
              g.secret,
              g.debug && m.push('DEBUG_ENABLED')),
            !g.secret)
          )
            return new o.MissingSecret(
              'Please define a `secret` in production.'
            );
          if (
            !(null !== (t = v.query) && void 0 !== t && t.nextauth) &&
            !v.action
          )
            return new o.MissingAPIRoute(
              'Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly.'
            );
          let b =
              null === (r = v.query) || void 0 === r ? void 0 : r.callbackUrl,
            _ = (0, i.default)(v.origin);
          if (b && !c(b, _.base))
            return new o.InvalidCallbackUrl(
              `Invalid callback URL. Received: ${b}`
            );
          let { callbackUrl: w } = (0, a.defaultCookies)(
              null !== (n = g.useSecureCookies) && void 0 !== n
                ? n
                : _.base.startsWith('https://')
            ),
            O =
              null === (l = v.cookies) || void 0 === l
                ? void 0
                : l[
                    null !==
                      (u =
                        null === (d = g.cookies) ||
                        void 0 === d ||
                        null === (d = d.callbackUrl) ||
                        void 0 === d
                          ? void 0
                          : d.name) && void 0 !== u
                      ? u
                      : w.name
                  ];
          if (O && !c(O, _.base))
            return new o.InvalidCallbackUrl(
              `Invalid callback URL. Received: ${O}`
            );
          for (let e of g.providers)
            'credentials' === e.type
              ? (f = !0)
              : 'email' === e.type
                ? (h = !0)
                : 'twitter' === e.id && '2.0' === e.version && (y = !0);
          if (f) {
            let e =
                (null === (p = g.session) || void 0 === p
                  ? void 0
                  : p.strategy) === 'database',
              t = !g.providers.some(e => 'credentials' !== e.type);
            if (e && t)
              return new o.UnsupportedStrategy(
                'Signin in with credentials only supported if JWT strategy is enabled'
              );
            if (g.providers.some(e => 'credentials' === e.type && !e.authorize))
              return new o.MissingAuthorize(
                'Must define an authorize() handler to use credentials authentication provider'
              );
          }
          if (h) {
            let { adapter: e } = g;
            if (!e)
              return new o.MissingAdapter('E-mail login requires an adapter.');
            let t = [
              'createVerificationToken',
              'useVerificationToken',
              'getUserByEmail',
            ].filter(t => !e[t]);
            if (t.length)
              return new o.MissingAdapterMethods(
                `Required adapter methods were missing: ${t.join(', ')}`
              );
          }
          return (s || (y && m.push('TWITTER_OAUTH_2_BETA'), (s = !0)), m);
        }));
      var o = r(38398),
        i = n(r(41932)),
        a = r(85733);
      let s = !1;
      function c(e, t) {
        try {
          return /^https?:/.test(
            new URL(e, e.startsWith('/') ? t : void 0).protocol
          );
        } catch (e) {
          return !1;
        }
      }
    },
    41575: (e, t, r) => {
      'use strict';
      let n = ['id'],
        o = ['id'];
      function i(e, t) {
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
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
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = u));
      var c = r(38398),
        l = r(80878);
      async function u(e) {
        var t, r, a, u, d, p;
        let { sessionToken: f, profile: h, account: y, options: g } = e;
        if (!(null != y && y.providerAccountId) || !y.type)
          throw Error('Missing or invalid provider account');
        if (!['email', 'oauth'].includes(y.type))
          throw Error('Provider not supported');
        let {
          adapter: v,
          jwt: m,
          events: b,
          session: { strategy: _, generateSessionToken: w },
        } = g;
        if (!v) return { user: h, account: y };
        let {
            createUser: O,
            updateUser: S,
            getUser: E,
            getUserByAccount: k,
            getUserByEmail: P,
            linkAccount: j,
            createSession: A,
            getSessionAndUser: x,
            deleteSession: T,
          } = v,
          C = null,
          W = null,
          J = !1,
          I = 'jwt' === _;
        if (f) {
          if (I)
            try {
              (C = await m.decode(s(s({}, m), {}, { token: f }))) &&
                'sub' in C &&
                C.sub &&
                (W = await E(C.sub));
            } catch (e) {}
          else {
            let e = await x(f);
            e && ((C = e.session), (W = e.user));
          }
        }
        if ('email' === y.type) {
          let e = await P(h.email);
          if (e)
            ((null === (t = W) || void 0 === t ? void 0 : t.id) !== e.id &&
              !I &&
              f &&
              (await T(f)),
              (W = await S({ id: e.id, emailVerified: new Date() })),
              await (null === (r = b.updateUser) || void 0 === r
                ? void 0
                : r.call(b, { user: W })));
          else {
            let e = s(s({}, h), {}, { emailVerified: new Date() }),
              { id: t } = e,
              r = i(e, n);
            ((W = await O(r)),
              await (null === (a = b.createUser) || void 0 === a
                ? void 0
                : a.call(b, { user: W })),
              (J = !0));
          }
          return {
            session: (C = I
              ? {}
              : await A({
                  sessionToken: await w(),
                  userId: W.id,
                  expires: (0, l.fromDate)(g.session.maxAge),
                })),
            user: W,
            isNewUser: J,
          };
        }
        if ('oauth' === y.type) {
          let e = await k({
            providerAccountId: y.providerAccountId,
            provider: y.provider,
          });
          if (e) {
            if (W) {
              if (e.id === W.id) return { session: C, user: W, isNewUser: J };
              throw new c.AccountNotLinkedError(
                'The account is already associated with another user'
              );
            }
            return {
              session: (C = I
                ? {}
                : await A({
                    sessionToken: await w(),
                    userId: e.id,
                    expires: (0, l.fromDate)(g.session.maxAge),
                  })),
              user: e,
              isNewUser: J,
            };
          }
          {
            if (W)
              return (
                await j(s(s({}, y), {}, { userId: W.id })),
                await (null === (p = b.linkAccount) || void 0 === p
                  ? void 0
                  : p.call(b, { user: W, account: y, profile: h })),
                { session: C, user: W, isNewUser: J }
              );
            let e = h.email ? await P(h.email) : null;
            if (e) {
              let t = g.provider;
              if (null != t && t.allowDangerousEmailAccountLinking) W = e;
              else
                throw new c.AccountNotLinkedError(
                  'Another account already exists with the same e-mail address'
                );
            } else {
              let e = s(s({}, h), {}, { emailVerified: null }),
                { id: t } = e,
                r = i(e, o);
              W = await O(r);
            }
            return (
              await (null === (u = b.createUser) || void 0 === u
                ? void 0
                : u.call(b, { user: W })),
              await j(s(s({}, y), {}, { userId: W.id })),
              await (null === (d = b.linkAccount) || void 0 === d
                ? void 0
                : d.call(b, { user: W, account: y, profile: h })),
              {
                session: (C = I
                  ? {}
                  : await A({
                      sessionToken: await w(),
                      userId: W.id,
                      expires: (0, l.fromDate)(g.session.maxAge),
                    })),
                user: W,
                isNewUser: !0,
              }
            );
          }
        }
        throw Error('Unsupported account type');
      }
    },
    10457: (e, t) => {
      'use strict';
      async function r({ options: e, paramValue: t, cookieValue: r }) {
        let { url: n, callbacks: o } = e,
          i = n.origin;
        return (
          t
            ? (i = await o.redirect({ url: t, baseUrl: n.origin }))
            : r && (i = await o.redirect({ url: r, baseUrl: n.origin })),
          { callbackUrl: i, callbackUrlCookie: i !== r ? i : void 0 }
        );
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createCallbackUrl = r));
    },
    85733: (e, t) => {
      'use strict';
      function r(e, t) {
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
      function n(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? r(Object(n), !0).forEach(function (t) {
                var r, o;
                ((r = t),
                  (o = n[t]),
                  (r = (function (e) {
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
                  })(r)) in e
                    ? Object.defineProperty(e, r, {
                        value: o,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[r] = o));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : r(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      function o(e, t, r) {
        (i(e, t), t.set(e, r));
      }
      function i(e, t) {
        if (t.has(e))
          throw TypeError(
            'Cannot initialize the same private elements twice on an object'
          );
      }
      function a(e, t) {
        return e.get(c(e, t));
      }
      function s(e, t, r) {
        return (e.set(c(e, t), r), r);
      }
      function c(e, t, r) {
        if ('function' == typeof e ? e === t : e.has(t))
          return arguments.length < 3 ? t : r;
        throw TypeError('Private element is not present on this object');
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.SessionStore = void 0),
        (t.defaultCookies = function (e) {
          let t = e ? '__Secure-' : '';
          return {
            sessionToken: {
              name: `${t}next-auth.session-token`,
              options: { httpOnly: !0, sameSite: 'lax', path: '/', secure: e },
            },
            callbackUrl: {
              name: `${t}next-auth.callback-url`,
              options: { httpOnly: !0, sameSite: 'lax', path: '/', secure: e },
            },
            csrfToken: {
              name: `${e ? '__Host-' : ''}next-auth.csrf-token`,
              options: { httpOnly: !0, sameSite: 'lax', path: '/', secure: e },
            },
            pkceCodeVerifier: {
              name: `${t}next-auth.pkce.code_verifier`,
              options: {
                httpOnly: !0,
                sameSite: 'lax',
                path: '/',
                secure: e,
                maxAge: 900,
              },
            },
            state: {
              name: `${t}next-auth.state`,
              options: {
                httpOnly: !0,
                sameSite: 'lax',
                path: '/',
                secure: e,
                maxAge: 900,
              },
            },
            nonce: {
              name: `${t}next-auth.nonce`,
              options: { httpOnly: !0, sameSite: 'lax', path: '/', secure: e },
            },
          };
        }));
      var l = new WeakMap(),
        u = new WeakMap(),
        d = new WeakMap(),
        p = new WeakSet();
      class f {
        constructor(e, t, r) {
          ((function (e, t) {
            (i(e, t), t.add(e));
          })(this, p),
            o(this, l, {}),
            o(this, u, void 0),
            o(this, d, void 0),
            s(d, this, r),
            s(u, this, e));
          let { cookies: n } = t,
            { name: c } = e;
          if ('function' == typeof (null == n ? void 0 : n.getAll))
            for (let { name: e, value: t } of n.getAll())
              e.startsWith(c) && (a(l, this)[e] = t);
          else if (n instanceof Map)
            for (let e of n.keys())
              e.startsWith(c) && (a(l, this)[e] = n.get(e));
          else for (let e in n) e.startsWith(c) && (a(l, this)[e] = n[e]);
        }
        get value() {
          return Object.keys(a(l, this))
            .sort((e, t) => {
              var r, n;
              return (
                parseInt(
                  null !== (r = e.split('.').pop()) && void 0 !== r ? r : '0'
                ) -
                parseInt(
                  null !== (n = t.split('.').pop()) && void 0 !== n ? n : '0'
                )
              );
            })
            .map(e => a(l, this)[e])
            .join('');
        }
        chunk(e, t) {
          let r = c(p, this, y).call(this);
          for (let o of c(p, this, h).call(this, {
            name: a(u, this).name,
            value: e,
            options: n(n({}, a(u, this).options), t),
          }))
            r[o.name] = o;
          return Object.values(r);
        }
        clean() {
          return Object.values(c(p, this, y).call(this));
        }
      }
      function h(e) {
        let t = Math.ceil(e.value.length / 3933);
        if (1 === t) return ((a(l, this)[e.name] = e.value), [e]);
        let r = [];
        for (let o = 0; o < t; o++) {
          let t = `${e.name}.${o}`,
            i = e.value.substr(3933 * o, 3933);
          (r.push(n(n({}, e), {}, { name: t, value: i })), (a(l, this)[t] = i));
        }
        return (
          a(d, this).debug('CHUNKING_SESSION_COOKIE', {
            message: 'Session cookie exceeds allowed 4096 bytes.',
            emptyCookieSize: 163,
            valueSize: e.value.length,
            chunks: r.map(e => e.value.length + 163),
          }),
          r
        );
      }
      function y() {
        let e = {};
        for (let r in a(l, this)) {
          var t;
          (null === (t = a(l, this)) || void 0 === t || delete t[r],
            (e[r] = {
              name: r,
              value: '',
              options: n(n({}, a(u, this).options), {}, { maxAge: 0 }),
            }));
        }
        return e;
      }
      t.SessionStore = f;
    },
    7380: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createCSRFToken = function ({
          options: e,
          cookieValue: t,
          isPost: r,
          bodyValue: o,
        }) {
          if (t) {
            let [i, a] = t.split('|');
            if (
              a ===
              (0, n.createHash)('sha256')
                .update(`${i}${e.secret}`)
                .digest('hex')
            )
              return { csrfTokenVerified: r && i === o, csrfToken: i };
          }
          let i = (0, n.randomBytes)(32).toString('hex'),
            a = (0, n.createHash)('sha256')
              .update(`${i}${e.secret}`)
              .digest('hex');
          return { cookie: `${i}|${a}`, csrfToken: i };
        }));
      var n = r(6113);
    },
    26346: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.defaultCallbacks = void 0),
        (t.defaultCallbacks = {
          signIn: () => !0,
          redirect: ({ url: e, baseUrl: t }) =>
            e.startsWith('/') ? `${t}${e}` : new URL(e).origin === t ? e : t,
          session: ({ session: e }) => e,
          jwt: ({ token: e }) => e,
        }));
    },
    94044: (e, t) => {
      'use strict';
      async function r({ email: e, adapter: t }) {
        let { getUserByEmail: r } = t;
        return (
          (e ? await r(e) : null) || { id: e, email: e, emailVerified: null }
        );
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = r));
    },
    52381: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = i));
      var n = r(6113),
        o = r(80878);
      async function i(e, t) {
        var r, i, a, s;
        let { url: c, adapter: l, provider: u, callbackUrl: d, theme: p } = t,
          f =
            null !==
              (r = await (null === (i = u.generateVerificationToken) ||
              void 0 === i
                ? void 0
                : i.call(u))) && void 0 !== r
              ? r
              : (0, n.randomBytes)(32).toString('hex'),
          h = new Date(
            Date.now() +
              (null !== (a = u.maxAge) && void 0 !== a ? a : 86400) * 1e3
          ),
          y = new URLSearchParams({ callbackUrl: d, token: f, email: e }),
          g = `${c}/callback/${u.id}?${y}`;
        return (
          await Promise.all([
            u.sendVerificationRequest({
              identifier: e,
              token: f,
              expires: h,
              url: g,
              provider: u,
              theme: p,
            }),
            null === (s = l.createVerificationToken) || void 0 === s
              ? void 0
              : s.call(l, {
                  identifier: e,
                  token: (0, o.hashToken)(f, t),
                  expires: h,
                }),
          ]),
          `${c}/verify-request?${new URLSearchParams({ provider: u.id, type: u.type })}`
        );
      }
    },
    43118: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = l));
      var i = r(31215),
        a = r(37618),
        s = (function (e, t) {
          if (!t && e && e.__esModule) return e;
          if (null === e || ('object' != typeof e && 'function' != typeof e))
            return { default: e };
          var r = c(t);
          if (r && r.has(e)) return r.get(e);
          var n = { __proto__: null },
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in e)
            if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
              var a = o ? Object.getOwnPropertyDescriptor(e, i) : null;
              a && (a.get || a.set)
                ? Object.defineProperty(n, i, a)
                : (n[i] = e[i]);
            }
          return ((n.default = e), r && r.set(e, n), n);
        })(r(70964));
      function c(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (c = function (e) {
          return e ? r : t;
        })(e);
      }
      async function l({ options: e, query: t }) {
        var r, n, c;
        let { logger: l, provider: u } = e,
          d = {};
        if ('string' == typeof u.authorization) {
          let e = Object.fromEntries(new URL(u.authorization).searchParams);
          d = o(o({}, d), e);
        } else
          d = o(
            o({}, d),
            null === (n = u.authorization) || void 0 === n ? void 0 : n.params
          );
        if (
          ((d = o(o({}, d), t)),
          null !== (r = u.version) && void 0 !== r && r.startsWith('1.'))
        ) {
          let t = (0, a.oAuth1Client)(e),
            r = await t.getOAuthRequestToken(d),
            n = `${null === (c = u.authorization) || void 0 === c ? void 0 : c.url}?${new URLSearchParams(o({ oauth_token: r.oauth_token, oauth_token_secret: r.oauth_token_secret }, r.params))}`;
          return (
            a.oAuth1TokenStore.set(r.oauth_token, r.oauth_token_secret),
            l.debug('GET_AUTHORIZATION_URL', { url: n, provider: u }),
            { redirect: n }
          );
        }
        let p = await (0, i.openidClient)(e),
          f = d,
          h = [];
        (await s.state.create(e, h, f),
          await s.pkce.create(e, h, f),
          await s.nonce.create(e, h, f));
        let y = p.authorizationUrl(f);
        return (
          l.debug('GET_AUTHORIZATION_URL', { url: y, cookies: h, provider: u }),
          { redirect: y, cookies: h }
        );
      }
    },
    12434: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = d));
      var i = r(67222),
        a = r(31215),
        s = r(37618),
        c = (function (e, t) {
          if (!t && e && e.__esModule) return e;
          if (null === e || ('object' != typeof e && 'function' != typeof e))
            return { default: e };
          var r = u(t);
          if (r && r.has(e)) return r.get(e);
          var n = { __proto__: null },
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in e)
            if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
              var a = o ? Object.getOwnPropertyDescriptor(e, i) : null;
              a && (a.get || a.set)
                ? Object.defineProperty(n, i, a)
                : (n[i] = e[i]);
            }
          return ((n.default = e), r && r.set(e, n), n);
        })(r(70964)),
        l = r(38398);
      function u(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (u = function (e) {
          return e ? r : t;
        })(e);
      }
      async function d(e) {
        var t, r, n, u, d, f;
        let { options: h, query: y, body: g, method: v, cookies: m } = e,
          { logger: b, provider: _ } = h,
          w =
            null !== (t = null == g ? void 0 : g.error) && void 0 !== t
              ? t
              : null == y
                ? void 0
                : y.error;
        if (w) {
          let e = Error(w);
          throw (
            b.error('OAUTH_CALLBACK_HANDLER_ERROR', {
              error: e,
              error_description: null == y ? void 0 : y.error_description,
              providerId: _.id,
            }),
            b.debug('OAUTH_CALLBACK_HANDLER_ERROR', { body: g }),
            e
          );
        }
        if (null !== (r = _.version) && void 0 !== r && r.startsWith('1.'))
          try {
            let e = await (0, s.oAuth1Client)(h),
              { oauth_token: t, oauth_verifier: r } = null != y ? y : {},
              n = await e.getOAuthAccessToken(t, s.oAuth1TokenStore.get(t), r),
              i = await e.get(
                _.profileUrl,
                n.oauth_token,
                n.oauth_token_secret
              );
            'string' == typeof i && (i = JSON.parse(i));
            let a = await p({ profile: i, tokens: n, provider: _, logger: b });
            return o(o({}, a), {}, { cookies: [] });
          } catch (e) {
            throw (b.error('OAUTH_V1_GET_ACCESS_TOKEN_ERROR', e), e);
          }
        null != y && y.oauth_token && s.oAuth1TokenStore.delete(y.oauth_token);
        try {
          let e, t;
          let r = await (0, a.openidClient)(h),
            s = {},
            l = [];
          (await c.state.use(m, l, h, s),
            await c.pkce.use(m, l, h, s),
            await c.nonce.use(m, l, h, s));
          let w = o(
            o(
              {},
              r.callbackParams({
                url: `http://n?${new URLSearchParams(y)}`,
                body: g,
                method: v,
              })
            ),
            null === (n = _.token) || void 0 === n ? void 0 : n.params
          );
          if (null !== (u = _.token) && void 0 !== u && u.request) {
            let t = await _.token.request({
              provider: _,
              params: w,
              checks: s,
              client: r,
            });
            e = new i.TokenSet(t.tokens);
          } else
            e = _.idToken
              ? await r.callback(_.callbackUrl, w, s)
              : await r.oauthCallback(_.callbackUrl, w, s);
          (Array.isArray(e.scope) && (e.scope = e.scope.join(' ')),
            (t =
              null !== (d = _.userinfo) && void 0 !== d && d.request
                ? await _.userinfo.request({
                    provider: _,
                    tokens: e,
                    client: r,
                  })
                : _.idToken
                  ? e.claims()
                  : await r.userinfo(e, {
                      params:
                        null === (f = _.userinfo) || void 0 === f
                          ? void 0
                          : f.params,
                    })));
          let O = await p({ profile: t, provider: _, tokens: e, logger: b });
          return o(o({}, O), {}, { cookies: l });
        } catch (e) {
          throw new l.OAuthCallbackError(e);
        }
      }
      async function p({ profile: e, tokens: t, provider: r, logger: n }) {
        try {
          var i;
          n.debug('PROFILE_DATA', { OAuthProfile: e });
          let a = await r.profile(e, t);
          if (
            ((a.email =
              null === (i = a.email) || void 0 === i
                ? void 0
                : i.toLowerCase()),
            !a.id)
          )
            throw TypeError(
              `Profile id is missing in ${r.name} OAuth profile response`
            );
          return {
            profile: a,
            account: o(
              {
                provider: r.id,
                type: r.type,
                providerAccountId: a.id.toString(),
              },
              t
            ),
            OAuthProfile: e,
          };
        } catch (t) {
          n.error('OAUTH_PARSE_PROFILE_ERROR', { error: t, OAuthProfile: e });
        }
      }
    },
    70964: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.pkce = t.nonce = t.PKCE_CODE_CHALLENGE_METHOD = void 0),
        (t.signCookie = c),
        (t.state = void 0));
      var i = r(67222),
        a = (function (e, t) {
          if (!t && e && e.__esModule) return e;
          if (null === e || ('object' != typeof e && 'function' != typeof e))
            return { default: e };
          var r = s(t);
          if (r && r.has(e)) return r.get(e);
          var n = { __proto__: null },
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in e)
            if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
              var a = o ? Object.getOwnPropertyDescriptor(e, i) : null;
              a && (a.get || a.set)
                ? Object.defineProperty(n, i, a)
                : (n[i] = e[i]);
            }
          return ((n.default = e), r && r.set(e, n), n);
        })(r(6399));
      function s(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (s = function (e) {
          return e ? r : t;
        })(e);
      }
      async function c(e, t, r, n) {
        let { cookies: i, logger: s } = n;
        s.debug(`CREATE_${e.toUpperCase()}`, { value: t, maxAge: r });
        let { name: c } = i[e],
          l = new Date();
        return (
          l.setTime(l.getTime() + 1e3 * r),
          {
            name: c,
            value: await a.encode(
              o(o({}, n.jwt), {}, { maxAge: r, token: { value: t }, salt: c })
            ),
            options: o(o({}, i[e].options), {}, { expires: l }),
          }
        );
      }
      let l = (t.PKCE_CODE_CHALLENGE_METHOD = 'S256');
      ((t.pkce = {
        async create(e, t, r) {
          var n, o;
          if (
            !(
              null !== (n = e.provider) &&
              void 0 !== n &&
              null !== (n = n.checks) &&
              void 0 !== n &&
              n.includes('pkce')
            )
          )
            return;
          let a = i.generators.codeVerifier(),
            s = i.generators.codeChallenge(a);
          ((r.code_challenge = s), (r.code_challenge_method = l));
          let u =
            null !== (o = e.cookies.pkceCodeVerifier.options.maxAge) &&
            void 0 !== o
              ? o
              : 900;
          t.push(await c('pkceCodeVerifier', a, u, e));
        },
        async use(e, t, r, n) {
          var i;
          if (
            !(
              null !== (i = r.provider) &&
              void 0 !== i &&
              null !== (i = i.checks) &&
              void 0 !== i &&
              i.includes('pkce')
            )
          )
            return;
          let s = null == e ? void 0 : e[r.cookies.pkceCodeVerifier.name];
          if (!s) throw TypeError('PKCE code_verifier cookie was missing.');
          let { name: c } = r.cookies.pkceCodeVerifier,
            l = await a.decode(o(o({}, r.jwt), {}, { token: s, salt: c }));
          if (!(null != l && l.value))
            throw TypeError('PKCE code_verifier value could not be parsed.');
          (t.push({
            name: c,
            value: '',
            options: o(
              o({}, r.cookies.pkceCodeVerifier.options),
              {},
              { maxAge: 0 }
            ),
          }),
            (n.code_verifier = l.value));
        },
      }),
        (t.state = {
          async create(e, t, r) {
            var n, o;
            if (
              !(
                null !== (n = e.provider.checks) &&
                void 0 !== n &&
                n.includes('state')
              )
            )
              return;
            let a = i.generators.state();
            r.state = a;
            let s =
              null !== (o = e.cookies.state.options.maxAge) && void 0 !== o
                ? o
                : 900;
            t.push(await c('state', a, s, e));
          },
          async use(e, t, r, n) {
            var i;
            if (
              !(
                null !== (i = r.provider.checks) &&
                void 0 !== i &&
                i.includes('state')
              )
            )
              return;
            let s = null == e ? void 0 : e[r.cookies.state.name];
            if (!s) throw TypeError('State cookie was missing.');
            let { name: c } = r.cookies.state,
              l = await a.decode(o(o({}, r.jwt), {}, { token: s, salt: c }));
            if (!(null != l && l.value))
              throw TypeError('State value could not be parsed.');
            (t.push({
              name: c,
              value: '',
              options: o(o({}, r.cookies.state.options), {}, { maxAge: 0 }),
            }),
              (n.state = l.value));
          },
        }),
        (t.nonce = {
          async create(e, t, r) {
            var n, o;
            if (
              !(
                null !== (n = e.provider.checks) &&
                void 0 !== n &&
                n.includes('nonce')
              )
            )
              return;
            let a = i.generators.nonce();
            r.nonce = a;
            let s =
              null !== (o = e.cookies.nonce.options.maxAge) && void 0 !== o
                ? o
                : 900;
            t.push(await c('nonce', a, s, e));
          },
          async use(e, t, r, n) {
            var i;
            if (
              !(
                null !== (i = r.provider) &&
                void 0 !== i &&
                null !== (i = i.checks) &&
                void 0 !== i &&
                i.includes('nonce')
              )
            )
              return;
            let s = null == e ? void 0 : e[r.cookies.nonce.name];
            if (!s) throw TypeError('Nonce cookie was missing.');
            let { name: c } = r.cookies.nonce,
              l = await a.decode(o(o({}, r.jwt), {}, { token: s, salt: c }));
            if (!(null != l && l.value))
              throw TypeError('Nonce value could not be parsed.');
            (t.push({
              name: c,
              value: '',
              options: o(o({}, r.cookies.nonce.options), {}, { maxAge: 0 }),
            }),
              (n.nonce = l.value));
          },
        }));
    },
    37618: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.oAuth1Client = function (e) {
          var t, r;
          let o = e.provider,
            i = new n.OAuth(
              o.requestTokenUrl,
              o.accessTokenUrl,
              o.clientId,
              o.clientSecret,
              null !== (t = o.version) && void 0 !== t ? t : '1.0',
              o.callbackUrl,
              null !== (r = o.encoding) && void 0 !== r ? r : 'HMAC-SHA1'
            ),
            a = i.get.bind(i);
          i.get = async (...e) =>
            await new Promise((t, r) => {
              a(...e, (e, n) => {
                if (e) return r(e);
                t(n);
              });
            });
          let s = i.getOAuthAccessToken.bind(i);
          i.getOAuthAccessToken = async (...e) =>
            await new Promise((t, r) => {
              s(...e, (e, n, o) => {
                if (e) return r(e);
                t({ oauth_token: n, oauth_token_secret: o });
              });
            });
          let c = i.getOAuthRequestToken.bind(i);
          return (
            (i.getOAuthRequestToken = async (e = {}) =>
              await new Promise((t, r) => {
                c(e, (e, n, o, i) => {
                  if (e) return r(e);
                  t({ oauth_token: n, oauth_token_secret: o, params: i });
                });
              })),
            i
          );
        }),
        (t.oAuth1TokenStore = void 0));
      var n = r(13585);
      t.oAuth1TokenStore = new Map();
    },
    31215: (e, t, r) => {
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
        (t.openidClient = i));
      var o = r(67222);
      async function i(e) {
        let t;
        let r = e.provider;
        if (
          (r.httpOptions && o.custom.setHttpOptionsDefaults(r.httpOptions),
          r.wellKnown)
        )
          t = await o.Issuer.discover(r.wellKnown);
        else {
          var i, a, s;
          t = new o.Issuer({
            issuer: r.issuer,
            authorization_endpoint:
              null === (i = r.authorization) || void 0 === i ? void 0 : i.url,
            token_endpoint:
              null === (a = r.token) || void 0 === a ? void 0 : a.url,
            userinfo_endpoint:
              null === (s = r.userinfo) || void 0 === s ? void 0 : s.url,
            jwks_uri: r.jwks_endpoint,
          });
        }
        let c = new t.Client(
          (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? n(Object(r), !0).forEach(function (t) {
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
                  : n(Object(r)).forEach(function (t) {
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
              client_id: r.clientId,
              client_secret: r.clientSecret,
              redirect_uris: [r.callbackUrl],
            },
            r.client
          ),
          r.jwks
        );
        return ((c[o.custom.clock_tolerance] = 10), c);
      }
    },
    53676: (e, t, r) => {
      'use strict';
      let n = ['options'];
      function o(e, t) {
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
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? o(Object(r), !0).forEach(function (t) {
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
              : o(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          let { url: t, providerId: r } = e,
            o = e.providers.map(e => {
              var r, o;
              let { options: c } = e,
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
                })(e, n);
              if ('oauth' === l.type) {
                let e = s(l),
                  r = s(c, !0),
                  n =
                    null !== (o = null == r ? void 0 : r.id) && void 0 !== o
                      ? o
                      : l.id;
                return (0, a.merge)(
                  e,
                  i(
                    i({}, r),
                    {},
                    {
                      signinUrl: `${t}/signin/${n}`,
                      callbackUrl: `${t}/callback/${n}`,
                    }
                  )
                );
              }
              let u =
                null !== (r = null == c ? void 0 : c.id) && void 0 !== r
                  ? r
                  : l.id;
              return (0, a.merge)(
                l,
                i(
                  i({}, c),
                  {},
                  {
                    signinUrl: `${t}/signin/${u}`,
                    callbackUrl: `${t}/callback/${u}`,
                  }
                )
              );
            });
          return { providers: o, provider: o.find(({ id: e }) => e === r) };
        }));
      var a = r(40110);
      function s(e, t = !1) {
        var r, n, o, i, a;
        if (!e) return;
        let s = Object.entries(e).reduce((e, [t, r]) => {
          if (
            ['authorization', 'token', 'userinfo'].includes(t) &&
            'string' == typeof r
          ) {
            var n;
            let o = new URL(r);
            e[t] = {
              url: `${o.origin}${o.pathname}`,
              params: Object.fromEntries(
                null !== (n = o.searchParams) && void 0 !== n ? n : []
              ),
            };
          } else e[t] = r;
          return e;
        }, {});
        return (
          t ||
            (null !== (r = s.version) && void 0 !== r && r.startsWith('1.')) ||
            ((s.idToken = !!(null !==
              (n =
                null !== (o = s.idToken) && void 0 !== o
                  ? o
                  : null === (i = s.wellKnown) || void 0 === i
                    ? void 0
                    : i.includes('openid-configuration')) && void 0 !== n
              ? n
              : null === (a = s.authorization) ||
                  void 0 === a ||
                  null === (a = a.params) ||
                  void 0 === a ||
                  null === (a = a.scope) ||
                  void 0 === a
                ? void 0
                : a.includes('openid'))),
            s.checks || (s.checks = ['state'])),
          s
        );
      }
    },
    80878: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.createSecret = function (e) {
          var t;
          let { authOptions: r, url: n } = e;
          return null !== (t = r.secret) && void 0 !== t
            ? t
            : (0, i.createHash)('sha256')
                .update(JSON.stringify(o(o({}, n), r)))
                .digest('hex');
        }),
        (t.fromDate = function (e, t = Date.now()) {
          return new Date(t + 1e3 * e);
        }),
        (t.hashToken = function (e, t) {
          var r;
          let { provider: n, secret: o } = t;
          return (0, i.createHash)('sha256')
            .update(`${e}${null !== (r = n.secret) && void 0 !== r ? r : o}`)
            .digest('hex');
        }));
      var i = r(6113);
    },
    5782: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          var t;
          let { url: r, error: o = 'default', theme: i } = e,
            a = `${r}/signin`,
            s = {
              default: {
                status: 200,
                heading: 'Error',
                message: (0, n.h)(
                  'p',
                  null,
                  (0, n.h)(
                    'a',
                    { className: 'site', href: null == r ? void 0 : r.origin },
                    null == r ? void 0 : r.host
                  )
                ),
              },
              configuration: {
                status: 500,
                heading: 'Server error',
                message: (0, n.h)(
                  'div',
                  null,
                  (0, n.h)(
                    'p',
                    null,
                    'There is a problem with the server configuration.'
                  ),
                  (0, n.h)(
                    'p',
                    null,
                    'Check the server logs for more information.'
                  )
                ),
              },
              accessdenied: {
                status: 403,
                heading: 'Access Denied',
                message: (0, n.h)(
                  'div',
                  null,
                  (0, n.h)('p', null, 'You do not have permission to sign in.'),
                  (0, n.h)(
                    'p',
                    null,
                    (0, n.h)('a', { className: 'button', href: a }, 'Sign in')
                  )
                ),
              },
              verification: {
                status: 403,
                heading: 'Unable to sign in',
                message: (0, n.h)(
                  'div',
                  null,
                  (0, n.h)('p', null, 'The sign in link is no longer valid.'),
                  (0, n.h)(
                    'p',
                    null,
                    'It may have been used already or it may have expired.'
                  )
                ),
                signin: (0, n.h)(
                  'a',
                  { className: 'button', href: a },
                  'Sign in'
                ),
              },
            },
            {
              status: c,
              heading: l,
              message: u,
              signin: d,
            } = null !== (t = s[o.toLowerCase()]) && void 0 !== t
              ? t
              : s.default;
          return {
            status: c,
            html: (0, n.h)(
              'div',
              { className: 'error' },
              (null == i ? void 0 : i.brandColor) &&
                (0, n.h)('style', {
                  dangerouslySetInnerHTML: {
                    __html: `
        :root {
          --brand-color: ${null == i ? void 0 : i.brandColor}
        }
      `,
                  },
                }),
              (0, n.h)(
                'div',
                { className: 'card' },
                (null == i ? void 0 : i.logo) &&
                  (0, n.h)('img', {
                    src: i.logo,
                    alt: 'Logo',
                    className: 'logo',
                  }),
                (0, n.h)('h1', null, l),
                (0, n.h)('div', { className: 'message' }, u),
                d
              )
            ),
          };
        }));
      var n = r(89976);
    },
    34699: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var i = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          let { url: t, theme: r, query: n, cookies: i } = e;
          function p({ html: e, title: t, status: n }) {
            var o;
            return {
              cookies: i,
              status: n,
              headers: [{ key: 'Content-Type', value: 'text/html' }],
              body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${(0, d.default)()}</style><title>${t}</title></head><body class="__next-auth-theme-${null !== (o = null == r ? void 0 : r.colorScheme) && void 0 !== o ? o : 'auto'}"><div class="page">${(0, a.default)(e)}</div></body></html>`,
            };
          }
          return {
            signin: t =>
              p({
                html: (0, s.default)(
                  o(
                    o(
                      {
                        csrfToken: e.csrfToken,
                        providers: e.providers,
                        callbackUrl: e.callbackUrl,
                        theme: r,
                      },
                      n
                    ),
                    t
                  )
                ),
                title: 'Sign In',
              }),
            signout: n =>
              p({
                html: (0, c.default)(
                  o({ csrfToken: e.csrfToken, url: t, theme: r }, n)
                ),
                title: 'Sign Out',
              }),
            verifyRequest: e =>
              p({
                html: (0, l.default)(o({ url: t, theme: r }, e)),
                title: 'Verify Request',
              }),
            error: e =>
              p(
                o(
                  o({}, (0, u.default)(o({ url: t, theme: r }, e))),
                  {},
                  { title: 'Error' }
                )
              ),
          };
        }));
      var a = i(r(87380)),
        s = i(r(52993)),
        c = i(r(56250)),
        l = i(r(74321)),
        u = i(r(5782)),
        d = i(r(26166));
    },
    52993: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          var t;
          let {
              csrfToken: r,
              providers: n,
              callbackUrl: s,
              theme: c,
              email: l,
              error: u,
            } = e,
            d = n.filter(
              e =>
                'oauth' === e.type ||
                'email' === e.type ||
                ('credentials' === e.type && !!e.credentials)
            );
          ('undefined' != typeof document &&
            c.buttonText &&
            document.documentElement.style.setProperty(
              '--button-text-color',
              c.buttonText
            ),
            'undefined' != typeof document &&
              c.brandColor &&
              document.documentElement.style.setProperty(
                '--brand-color',
                c.brandColor
              ));
          let p = {
              Signin: 'Try signing in with a different account.',
              OAuthSignin: 'Try signing in with a different account.',
              OAuthCallback: 'Try signing in with a different account.',
              OAuthCreateAccount: 'Try signing in with a different account.',
              EmailCreateAccount: 'Try signing in with a different account.',
              Callback: 'Try signing in with a different account.',
              OAuthAccountNotLinked:
                'To confirm your identity, sign in with the same account you used originally.',
              EmailSignin: 'The e-mail could not be sent.',
              CredentialsSignin:
                'Sign in failed. Check the details you provided are correct.',
              SessionRequired: 'Please sign in to access this page.',
              default: 'Unable to sign in.',
            },
            f = u && (null !== (t = p[u]) && void 0 !== t ? t : p.default),
            h = 'https://authjs.dev/img/providers';
          return (0, o.h)(
            'div',
            { className: 'signin' },
            c.brandColor &&
              (0, o.h)('style', {
                dangerouslySetInnerHTML: {
                  __html: `
        :root {
          --brand-color: ${c.brandColor}
        }
      `,
                },
              }),
            c.buttonText &&
              (0, o.h)('style', {
                dangerouslySetInnerHTML: {
                  __html: `
        :root {
          --button-text-color: ${c.buttonText}
        }
      `,
                },
              }),
            (0, o.h)(
              'div',
              { className: 'card' },
              c.logo &&
                (0, o.h)('img', {
                  src: c.logo,
                  alt: 'Logo',
                  className: 'logo',
                }),
              f &&
                (0, o.h)('div', { className: 'error' }, (0, o.h)('p', null, f)),
              d.map((e, t) => {
                let n, c, u, p, f, y;
                if ('oauth' === e.type) {
                  var g;
                  (({
                    bg: n = '',
                    text: c = '',
                    logo: u = '',
                    bgDark: f = n,
                    textDark: y = c,
                    logoDark: p = '',
                  } = null !== (g = e.style) && void 0 !== g ? g : {}),
                    (u = u.startsWith('/') ? `${h}${u}` : u),
                    (p = p.startsWith('/') ? `${h}${p}` : p || u) || (p = u));
                }
                return (0, o.h)(
                  'div',
                  { key: e.id, className: 'provider' },
                  'oauth' === e.type &&
                    (0, o.h)(
                      'form',
                      { action: e.signinUrl, method: 'POST' },
                      (0, o.h)('input', {
                        type: 'hidden',
                        name: 'csrfToken',
                        value: r,
                      }),
                      s &&
                        (0, o.h)('input', {
                          type: 'hidden',
                          name: 'callbackUrl',
                          value: s,
                        }),
                      (0, o.h)(
                        'button',
                        {
                          type: 'submit',
                          className: 'button',
                          style: {
                            '--provider-bg': n,
                            '--provider-dark-bg': f,
                            '--provider-color': c,
                            '--provider-dark-color': y,
                            '--provider-bg-hover': a(n, 0.8),
                            '--provider-dark-bg-hover': a(f, 0.8),
                          },
                        },
                        u &&
                          (0, o.h)('img', {
                            loading: 'lazy',
                            height: 24,
                            width: 24,
                            id: 'provider-logo',
                            src: `${u.startsWith('/') ? h : ''}${u}`,
                          }),
                        p &&
                          (0, o.h)('img', {
                            loading: 'lazy',
                            height: 24,
                            width: 24,
                            id: 'provider-logo-dark',
                            src: `${u.startsWith('/') ? h : ''}${p}`,
                          }),
                        (0, o.h)('span', null, 'Sign in with ', e.name)
                      )
                    ),
                  ('email' === e.type || 'credentials' === e.type) &&
                    t > 0 &&
                    'email' !== d[t - 1].type &&
                    'credentials' !== d[t - 1].type &&
                    (0, o.h)('hr', null),
                  'email' === e.type &&
                    (0, o.h)(
                      'form',
                      { action: e.signinUrl, method: 'POST' },
                      (0, o.h)('input', {
                        type: 'hidden',
                        name: 'csrfToken',
                        value: r,
                      }),
                      (0, o.h)(
                        'label',
                        {
                          className: 'section-header',
                          htmlFor: `input-email-for-${e.id}-provider`,
                        },
                        'Email'
                      ),
                      (0, o.h)('input', {
                        id: `input-email-for-${e.id}-provider`,
                        autoFocus: !0,
                        type: 'email',
                        name: 'email',
                        value: l,
                        placeholder: 'email@example.com',
                        required: !0,
                      }),
                      (0, o.h)(
                        'button',
                        { id: 'submitButton', type: 'submit' },
                        'Sign in with ',
                        e.name
                      )
                    ),
                  'credentials' === e.type &&
                    (0, o.h)(
                      'form',
                      { action: e.callbackUrl, method: 'POST' },
                      (0, o.h)('input', {
                        type: 'hidden',
                        name: 'csrfToken',
                        value: r,
                      }),
                      Object.keys(e.credentials).map(t => {
                        var r, n, a;
                        return (0, o.h)(
                          'div',
                          { key: `input-group-${e.id}` },
                          (0, o.h)(
                            'label',
                            {
                              className: 'section-header',
                              htmlFor: `input-${t}-for-${e.id}-provider`,
                            },
                            null !== (r = e.credentials[t].label) &&
                              void 0 !== r
                              ? r
                              : t
                          ),
                          (0, o.h)(
                            'input',
                            (0, i.default)(
                              {
                                name: t,
                                id: `input-${t}-for-${e.id}-provider`,
                                type:
                                  null !== (n = e.credentials[t].type) &&
                                  void 0 !== n
                                    ? n
                                    : 'text',
                                placeholder:
                                  null !== (a = e.credentials[t].placeholder) &&
                                  void 0 !== a
                                    ? a
                                    : '',
                              },
                              e.credentials[t]
                            )
                          )
                        );
                      }),
                      (0, o.h)(
                        'button',
                        { type: 'submit' },
                        'Sign in with ',
                        e.name
                      )
                    ),
                  ('email' === e.type || 'credentials' === e.type) &&
                    t + 1 < d.length &&
                    (0, o.h)('hr', null)
                );
              })
            )
          );
        }));
      var o = r(89976),
        i = n(r(43120));
      function a(e, t = 1) {
        if (!e) return;
        3 === (e = e.replace(/^#/, '')).length &&
          (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]);
        let r = parseInt(e, 16);
        return (
          (t = Math.min(Math.max(t, 0), 1)),
          `rgba(${(r >> 16) & 255}, ${(r >> 8) & 255}, ${255 & r}, ${t})`
        );
      }
    },
    56250: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          let { url: t, csrfToken: r, theme: o } = e;
          return (0, n.h)(
            'div',
            { className: 'signout' },
            o.brandColor &&
              (0, n.h)('style', {
                dangerouslySetInnerHTML: {
                  __html: `
        :root {
          --brand-color: ${o.brandColor}
        }
      `,
                },
              }),
            o.buttonText &&
              (0, n.h)('style', {
                dangerouslySetInnerHTML: {
                  __html: `
        :root {
          --button-text-color: ${o.buttonText}
        }
      `,
                },
              }),
            (0, n.h)(
              'div',
              { className: 'card' },
              o.logo &&
                (0, n.h)('img', {
                  src: o.logo,
                  alt: 'Logo',
                  className: 'logo',
                }),
              (0, n.h)('h1', null, 'Signout'),
              (0, n.h)('p', null, 'Are you sure you want to sign out?'),
              (0, n.h)(
                'form',
                { action: `${t}/signout`, method: 'POST' },
                (0, n.h)('input', {
                  type: 'hidden',
                  name: 'csrfToken',
                  value: r,
                }),
                (0, n.h)(
                  'button',
                  { id: 'submitButton', type: 'submit' },
                  'Sign out'
                )
              )
            )
          );
        }));
      var n = r(89976);
    },
    74321: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          let { url: t, theme: r } = e;
          return (0, n.h)(
            'div',
            { className: 'verify-request' },
            r.brandColor &&
              (0, n.h)('style', {
                dangerouslySetInnerHTML: {
                  __html: `
        :root {
          --brand-color: ${r.brandColor}
        }
      `,
                },
              }),
            (0, n.h)(
              'div',
              { className: 'card' },
              r.logo &&
                (0, n.h)('img', {
                  src: r.logo,
                  alt: 'Logo',
                  className: 'logo',
                }),
              (0, n.h)('h1', null, 'Check your email'),
              (0, n.h)(
                'p',
                null,
                'A sign in link has been sent to your email address.'
              ),
              (0, n.h)(
                'p',
                null,
                (0, n.h)('a', { className: 'site', href: t.origin }, t.host)
              )
            )
          );
        }));
      var n = r(89976);
    },
    70657: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      var i = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = u));
      var a = i(r(12434)),
        s = i(r(41575)),
        c = r(80878),
        l = i(r(94044));
      async function u(e) {
        var t, r, n, i, u, d;
        let {
            options: p,
            query: f,
            body: h,
            method: y,
            headers: g,
            sessionStore: v,
          } = e,
          {
            provider: m,
            adapter: b,
            url: _,
            callbackUrl: w,
            pages: O,
            jwt: S,
            events: E,
            callbacks: k,
            session: { strategy: P, maxAge: j },
            logger: A,
          } = p,
          x = [],
          T = 'jwt' === P;
        if ('oauth' === m.type)
          try {
            let {
              profile: n,
              account: i,
              OAuthProfile: c,
              cookies: l,
            } = await (0, a.default)({
              query: f,
              body: h,
              method: y,
              options: p,
              cookies: e.cookies,
            });
            l.length && x.push(...l);
            try {
              if (
                (A.debug('OAUTH_CALLBACK_RESPONSE', {
                  profile: n,
                  account: i,
                  OAuthProfile: c,
                }),
                !n || !i || !c)
              )
                return { redirect: `${_}/signin`, cookies: x };
              let e = n;
              if (b) {
                let { getUserByAccount: t } = b,
                  r = await t({
                    providerAccountId: i.providerAccountId,
                    provider: m.id,
                  });
                r && (e = r);
              }
              try {
                let t = await k.signIn({ user: e, account: i, profile: c });
                if (!t)
                  return {
                    redirect: `${_}/error?error=AccessDenied`,
                    cookies: x,
                  };
                if ('string' == typeof t) return { redirect: t, cookies: x };
              } catch (e) {
                return {
                  redirect: `${_}/error?error=${encodeURIComponent(e.message)}`,
                  cookies: x,
                };
              }
              let {
                user: a,
                session: l,
                isNewUser: u,
              } = await (0, s.default)({
                sessionToken: v.value,
                profile: n,
                account: i,
                options: p,
              });
              if (T) {
                let e = {
                    name: a.name,
                    email: a.email,
                    picture: a.image,
                    sub:
                      null === (r = a.id) || void 0 === r
                        ? void 0
                        : r.toString(),
                  },
                  t = await k.jwt({
                    token: e,
                    user: a,
                    account: i,
                    profile: c,
                    isNewUser: u,
                    trigger: u ? 'signUp' : 'signIn',
                  }),
                  n = await S.encode(o(o({}, S), {}, { token: t })),
                  s = new Date();
                s.setTime(s.getTime() + 1e3 * j);
                let l = v.chunk(n, { expires: s });
                x.push(...l);
              } else
                x.push({
                  name: p.cookies.sessionToken.name,
                  value: l.sessionToken,
                  options: o(
                    o({}, p.cookies.sessionToken.options),
                    {},
                    { expires: l.expires }
                  ),
                });
              if (
                (await (null === (t = E.signIn) || void 0 === t
                  ? void 0
                  : t.call(E, {
                      user: a,
                      account: i,
                      profile: n,
                      isNewUser: u,
                    })),
                u && O.newUser)
              )
                return {
                  redirect: `${O.newUser}${O.newUser.includes('?') ? '&' : '?'}callbackUrl=${encodeURIComponent(w)}`,
                  cookies: x,
                };
              return { redirect: w, cookies: x };
            } catch (e) {
              if ('AccountNotLinkedError' === e.name)
                return {
                  redirect: `${_}/error?error=OAuthAccountNotLinked`,
                  cookies: x,
                };
              if ('CreateUserError' === e.name)
                return {
                  redirect: `${_}/error?error=OAuthCreateAccount`,
                  cookies: x,
                };
              return (
                A.error('OAUTH_CALLBACK_HANDLER_ERROR', e),
                { redirect: `${_}/error?error=Callback`, cookies: x }
              );
            }
          } catch (e) {
            if ('OAuthCallbackError' === e.name)
              return (
                A.error('OAUTH_CALLBACK_ERROR', { error: e, providerId: m.id }),
                { redirect: `${_}/error?error=OAuthCallback`, cookies: x }
              );
            return (
              A.error('OAUTH_CALLBACK_ERROR', e),
              { redirect: `${_}/error?error=Callback`, cookies: x }
            );
          }
        else if ('email' === m.type)
          try {
            let e = null == f ? void 0 : f.token,
              t = null == f ? void 0 : f.email;
            if (!e)
              return { redirect: `${_}/error?error=configuration`, cookies: x };
            let r = await b.useVerificationToken({
              identifier: t,
              token: (0, c.hashToken)(e, p),
            });
            if (
              !r ||
              r.expires.valueOf() < Date.now() ||
              (t && r.identifier !== t)
            )
              return { redirect: `${_}/error?error=Verification`, cookies: x };
            let a = await (0, l.default)({ email: r.identifier, adapter: b }),
              u = { providerAccountId: a.email, type: 'email', provider: m.id };
            try {
              let e = await k.signIn({ user: a, account: u });
              if (!e)
                return {
                  redirect: `${_}/error?error=AccessDenied`,
                  cookies: x,
                };
              if ('string' == typeof e) return { redirect: e, cookies: x };
            } catch (e) {
              return {
                redirect: `${_}/error?error=${encodeURIComponent(e.message)}`,
                cookies: x,
              };
            }
            let {
              user: d,
              session: h,
              isNewUser: y,
            } = await (0, s.default)({
              sessionToken: v.value,
              profile: a,
              account: u,
              options: p,
            });
            if (T) {
              let e = {
                  name: d.name,
                  email: d.email,
                  picture: d.image,
                  sub:
                    null === (i = d.id) || void 0 === i ? void 0 : i.toString(),
                },
                t = await k.jwt({
                  token: e,
                  user: d,
                  account: u,
                  isNewUser: y,
                  trigger: y ? 'signUp' : 'signIn',
                }),
                r = await S.encode(o(o({}, S), {}, { token: t })),
                n = new Date();
              n.setTime(n.getTime() + 1e3 * j);
              let a = v.chunk(r, { expires: n });
              x.push(...a);
            } else
              x.push({
                name: p.cookies.sessionToken.name,
                value: h.sessionToken,
                options: o(
                  o({}, p.cookies.sessionToken.options),
                  {},
                  { expires: h.expires }
                ),
              });
            if (
              (await (null === (n = E.signIn) || void 0 === n
                ? void 0
                : n.call(E, { user: d, account: u, isNewUser: y })),
              y && O.newUser)
            )
              return {
                redirect: `${O.newUser}${O.newUser.includes('?') ? '&' : '?'}callbackUrl=${encodeURIComponent(w)}`,
                cookies: x,
              };
            return { redirect: w, cookies: x };
          } catch (e) {
            if ('CreateUserError' === e.name)
              return {
                redirect: `${_}/error?error=EmailCreateAccount`,
                cookies: x,
              };
            return (
              A.error('CALLBACK_EMAIL_ERROR', e),
              { redirect: `${_}/error?error=Callback`, cookies: x }
            );
          }
        else if ('credentials' === m.type && 'POST' === y) {
          let e;
          try {
            if (
              !(e = await m.authorize(h, {
                query: f,
                body: h,
                headers: g,
                method: y,
              }))
            )
              return {
                status: 401,
                redirect: `${_}/error?${new URLSearchParams({ error: 'CredentialsSignin', provider: m.id })}`,
                cookies: x,
              };
          } catch (e) {
            return {
              status: 401,
              redirect: `${_}/error?error=${encodeURIComponent(e.message)}`,
              cookies: x,
            };
          }
          let t = {
            providerAccountId: e.id,
            type: 'credentials',
            provider: m.id,
          };
          try {
            let r = await k.signIn({ user: e, account: t, credentials: h });
            if (!r)
              return {
                status: 403,
                redirect: `${_}/error?error=AccessDenied`,
                cookies: x,
              };
            if ('string' == typeof r) return { redirect: r, cookies: x };
          } catch (e) {
            return {
              redirect: `${_}/error?error=${encodeURIComponent(e.message)}`,
              cookies: x,
            };
          }
          let r = {
              name: e.name,
              email: e.email,
              picture: e.image,
              sub: null === (u = e.id) || void 0 === u ? void 0 : u.toString(),
            },
            n = await k.jwt({
              token: r,
              user: e,
              account: t,
              isNewUser: !1,
              trigger: 'signIn',
            }),
            i = await S.encode(o(o({}, S), {}, { token: n })),
            a = new Date();
          a.setTime(a.getTime() + 1e3 * j);
          let s = v.chunk(i, { expires: a });
          return (
            x.push(...s),
            await (null === (d = E.signIn) || void 0 === d
              ? void 0
              : d.call(E, { user: e, account: t })),
            { redirect: w, cookies: x }
          );
        }
        return {
          status: 500,
          body: `Error: Callback for provider type ${m.type} not supported`,
          cookies: x,
        };
      }
    },
    89918: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'callback', {
          enumerable: !0,
          get: function () {
            return o.default;
          },
        }),
        Object.defineProperty(t, 'providers', {
          enumerable: !0,
          get: function () {
            return c.default;
          },
        }),
        Object.defineProperty(t, 'session', {
          enumerable: !0,
          get: function () {
            return s.default;
          },
        }),
        Object.defineProperty(t, 'signin', {
          enumerable: !0,
          get: function () {
            return i.default;
          },
        }),
        Object.defineProperty(t, 'signout', {
          enumerable: !0,
          get: function () {
            return a.default;
          },
        }));
      var o = n(r(70657)),
        i = n(r(99491)),
        a = n(r(68271)),
        s = n(r(87554)),
        c = n(r(48908));
    },
    48908: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          return {
            headers: [{ key: 'Content-Type', value: 'application/json' }],
            body: e.reduce(
              (
                e,
                { id: t, name: r, type: n, signinUrl: o, callbackUrl: i }
              ) => (
                (e[t] = {
                  id: t,
                  name: r,
                  type: n,
                  signinUrl: o,
                  callbackUrl: i,
                }),
                e
              ),
              {}
            ),
          };
        }));
    },
    87554: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = a));
      var i = r(80878);
      async function a(e) {
        var t, r, n, a, s, c;
        let { options: l, sessionStore: u, newSession: d, isUpdate: p } = e,
          {
            adapter: f,
            jwt: h,
            events: y,
            callbacks: g,
            logger: v,
            session: { strategy: m, maxAge: b },
          } = l,
          _ = {
            body: {},
            headers: [{ key: 'Content-Type', value: 'application/json' }],
            cookies: [],
          },
          w = u.value;
        if (!w) return _;
        if ('jwt' === m)
          try {
            let e = await h.decode(o(o({}, h), {}, { token: w }));
            if (!e) throw Error('JWT invalid');
            let n = await g.jwt(
                o(
                  o({ token: e }, p && { trigger: 'update' }),
                  {},
                  { session: d }
                )
              ),
              a = (0, i.fromDate)(b),
              s = await g.session({
                session: {
                  user: {
                    name: null == e ? void 0 : e.name,
                    email: null == e ? void 0 : e.email,
                    image: null == e ? void 0 : e.picture,
                  },
                  expires: a.toISOString(),
                },
                token: n,
              });
            _.body = s;
            let c = await h.encode(
                o(o({}, h), {}, { token: n, maxAge: l.session.maxAge })
              ),
              f = u.chunk(c, { expires: a });
            (null === (t = _.cookies) || void 0 === t || t.push(...f),
              await (null === (r = y.session) || void 0 === r
                ? void 0
                : r.call(y, { session: s, token: n })));
          } catch (e) {
            (v.error('JWT_SESSION_ERROR', e),
              null === (n = _.cookies) || void 0 === n || n.push(...u.clean()));
          }
        else
          try {
            let {
                getSessionAndUser: e,
                deleteSession: t,
                updateSession: r,
              } = f,
              n = await e(w);
            if (
              (n &&
                n.session.expires.valueOf() < Date.now() &&
                (await t(w), (n = null)),
              n)
            ) {
              let { user: e, session: t } = n,
                c = l.session.updateAge,
                u = t.expires.valueOf() - 1e3 * b + 1e3 * c,
                f = (0, i.fromDate)(b);
              u <= Date.now() && (await r({ sessionToken: w, expires: f }));
              let h = await g.session(
                o(
                  {
                    session: {
                      user: { name: e.name, email: e.email, image: e.image },
                      expires: t.expires.toISOString(),
                    },
                    user: e,
                    newSession: d,
                  },
                  p ? { trigger: 'update' } : {}
                )
              );
              ((_.body = h),
                null === (a = _.cookies) ||
                  void 0 === a ||
                  a.push({
                    name: l.cookies.sessionToken.name,
                    value: w,
                    options: o(
                      o({}, l.cookies.sessionToken.options),
                      {},
                      { expires: f }
                    ),
                  }),
                await (null === (s = y.session) || void 0 === s
                  ? void 0
                  : s.call(y, { session: h })));
            } else
              w &&
                (null === (c = _.cookies) ||
                  void 0 === c ||
                  c.push(...u.clean()));
          } catch (e) {
            v.error('SESSION_ERROR', e);
          }
        return _;
      }
    },
    99491: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = s));
      var o = n(r(43118)),
        i = n(r(52381)),
        a = n(r(94044));
      async function s(e) {
        let { options: t, query: r, body: n } = e,
          { url: s, callbacks: c, logger: l, provider: u } = t;
        if (!u.type)
          return {
            status: 500,
            text: `Error: Type not specified for ${u.name}`,
          };
        if ('oauth' === u.type)
          try {
            return await (0, o.default)({ options: t, query: r });
          } catch (e) {
            return (
              l.error('SIGNIN_OAUTH_ERROR', { error: e, providerId: u.id }),
              { redirect: `${s}/error?error=OAuthSignin` }
            );
          }
        else if ('email' === u.type) {
          var d;
          let e = null == n ? void 0 : n.email;
          if (!e) return { redirect: `${s}/error?error=EmailSignin` };
          let r =
            null !== (d = u.normalizeIdentifier) && void 0 !== d
              ? d
              : e => {
                  let [t, r] = e.toLowerCase().trim().split('@');
                  return ((r = r.split(',')[0]), `${t}@${r}`);
                };
          try {
            e = r(null == n ? void 0 : n.email);
          } catch (e) {
            return (
              l.error('SIGNIN_EMAIL_ERROR', { error: e, providerId: u.id }),
              { redirect: `${s}/error?error=EmailSignin` }
            );
          }
          let o = await (0, a.default)({ email: e, adapter: t.adapter }),
            p = {
              providerAccountId: e,
              userId: e,
              type: 'email',
              provider: u.id,
            };
          try {
            let e = await c.signIn({
              user: o,
              account: p,
              email: { verificationRequest: !0 },
            });
            if (!e) return { redirect: `${s}/error?error=AccessDenied` };
            if ('string' == typeof e) return { redirect: e };
          } catch (e) {
            return {
              redirect: `${s}/error?${new URLSearchParams({ error: e })}`,
            };
          }
          try {
            return { redirect: await (0, i.default)(e, t) };
          } catch (e) {
            return (
              l.error('SIGNIN_EMAIL_ERROR', { error: e, providerId: u.id }),
              { redirect: `${s}/error?error=EmailSignin` }
            );
          }
        }
        return { redirect: `${s}/signin` };
      }
    },
    68271: (e, t) => {
      'use strict';
      function r(e, t) {
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
      function n(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? r(Object(n), !0).forEach(function (t) {
                var r, o;
                ((r = t),
                  (o = n[t]),
                  (r = (function (e) {
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
                  })(r)) in e
                    ? Object.defineProperty(e, r, {
                        value: o,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[r] = o));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : r(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      async function o(e) {
        var t, r;
        let { options: o, sessionStore: i } = e,
          {
            adapter: a,
            events: s,
            jwt: c,
            callbackUrl: l,
            logger: u,
            session: d,
          } = o,
          p = null == i ? void 0 : i.value;
        if (!p) return { redirect: l };
        if ('jwt' === d.strategy)
          try {
            let e = await c.decode(n(n({}, c), {}, { token: p }));
            await (null === (t = s.signOut) || void 0 === t
              ? void 0
              : t.call(s, { token: e }));
          } catch (e) {
            u.error('SIGNOUT_ERROR', e);
          }
        else
          try {
            let e = await a.deleteSession(p);
            await (null === (r = s.signOut) || void 0 === r
              ? void 0
              : r.call(s, { session: e }));
          } catch (e) {
            u.error('SIGNOUT_ERROR', e);
          }
        return { redirect: l, cookies: i.clean() };
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = o));
    },
    35730: (e, t) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
    },
    26166: e => {
      e.exports = function () {
        return ':root{--border-width:1px;--border-radius:0.5rem;--color-error:#c94b4b;--color-info:#157efb;--color-info-hover:#0f6ddb;--color-info-text:#fff}.__next-auth-theme-auto,.__next-auth-theme-light{--color-background:#ececec;--color-background-hover:hsla(0,0%,93%,.8);--color-background-card:#fff;--color-text:#000;--color-primary:#444;--color-control-border:#bbb;--color-button-active-background:#f9f9f9;--color-button-active-border:#aaa;--color-separator:#ccc}.__next-auth-theme-dark{--color-background:#161b22;--color-background-hover:rgba(22,27,34,.8);--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-separator:#444}@media (prefers-color-scheme:dark){.__next-auth-theme-auto{--color-background:#161b22;--color-background-hover:rgba(22,27,34,.8);--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-separator:#444}a.button,button{background-color:var(--provider-dark-bg,var(--color-background));color:var(--provider-dark-color,var(--color-primary))}a.button:hover,button:hover{background-color:var(--provider-dark-bg-hover,var(--color-background-hover))!important}#provider-logo{display:none!important}#provider-logo-dark{display:block!important;width:25px}}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit;margin:0;padding:0}body{background-color:var(--color-background);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;margin:0;padding:0}h1{font-weight:400}h1,p{color:var(--color-text);margin-bottom:1.5rem;padding:0 1rem}form{margin:0;padding:0}label{font-weight:500;margin-bottom:.25rem;text-align:left}input[type],label{color:var(--color-text);display:block}input[type]{background:var(--color-background-card);border:var(--border-width) solid var(--color-control-border);border-radius:var(--border-radius);box-sizing:border-box;font-size:1rem;padding:.5rem 1rem;width:100%}input[type]:focus{box-shadow:none}p{font-size:1.1rem;line-height:2rem}a.button{line-height:1rem;text-decoration:none}a.button:link,a.button:visited{background-color:var(--color-background);color:var(--color-primary)}button span{flex-grow:1}a.button,button{align-items:center;background-color:var(--provider-bg);border-color:rgba(0,0,0,.1);border-radius:var(--border-radius);color:var(--provider-color,var(--color-primary));display:flex;font-size:1.1rem;font-weight:500;justify-content:center;min-height:62px;padding:.75rem 1rem;position:relative;transition:all .1s ease-in-out}a.button:hover,button:hover{background-color:var(--provider-bg-hover,var(--color-background-hover));cursor:pointer}a.button:active,button:active{cursor:pointer}a.button #provider-logo,button #provider-logo{display:block;width:25px}a.button #provider-logo-dark,button #provider-logo-dark{display:none}#submitButton{background-color:var(--brand-color,var(--color-info));color:var(--button-text-color,var(--color-info-text));width:100%}#submitButton:hover{background-color:var(--button-hover-bg,var(--color-info-hover))!important}a.site{color:var(--color-primary);font-size:1rem;line-height:2rem;text-decoration:none}a.site:hover{text-decoration:underline}.page{box-sizing:border-box;display:grid;height:100%;margin:0;padding:0;place-items:center;position:absolute;width:100%}.page>div{text-align:center}.error a.button{margin-top:.5rem;padding-left:2rem;padding-right:2rem}.error .message{margin-bottom:1.5rem}.signin input[type=text]{display:block;margin-left:auto;margin-right:auto}.signin hr{border:0;border-top:1px solid var(--color-separator);display:block;margin:2rem auto 1rem;overflow:visible}.signin hr:before{background:var(--color-background-card);color:#888;content:"or";padding:0 .4rem;position:relative;top:-.7rem}.signin .error{background:#f5f5f5;background:var(--color-error);border-radius:.3rem;font-weight:500}.signin .error p{color:var(--color-info-text);font-size:.9rem;line-height:1.2rem;padding:.5rem 1rem;text-align:left}.signin form,.signin>div{display:block}.signin form input[type],.signin>div input[type]{margin-bottom:.5rem}.signin form button,.signin>div button{width:100%}.signin .provider+.provider{margin-top:1rem}.logo{display:inline-block;margin:1.25rem 0;max-height:70px;max-width:150px}.card{background-color:var(--color-background-card);border-radius:2rem;padding:1.25rem 2rem}.card .header{color:var(--color-primary)}.section-header{color:var(--color-text)}@media screen and (min-width:450px){.card{margin:2rem 0;width:368px}}@media screen and (max-width:450px){.card{margin:1rem 0;width:343px}}';
      };
    },
    78892: (e, t, r) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var n = {};
      Object.defineProperty(t, 'default', {
        enumerable: !0,
        get: function () {
          return i.default;
        },
      });
      var o = r(35730);
      Object.keys(o).forEach(function (e) {
        !(
          'default' === e ||
          '__esModule' === e ||
          Object.prototype.hasOwnProperty.call(n, e)
        ) &&
          ((e in t && t[e] === o[e]) ||
            Object.defineProperty(t, e, {
              enumerable: !0,
              get: function () {
                return o[e];
              },
            }));
      });
      var i = (function (e, t) {
        if (!t && e && e.__esModule) return e;
        if (null === e || ('object' != typeof e && 'function' != typeof e))
          return { default: e };
        var r = a(t);
        if (r && r.has(e)) return r.get(e);
        var n = { __proto__: null },
          o = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var i in e)
          if ('default' !== i && {}.hasOwnProperty.call(e, i)) {
            var s = o ? Object.getOwnPropertyDescriptor(e, i) : null;
            s && (s.get || s.set)
              ? Object.defineProperty(n, i, s)
              : (n[i] = e[i]);
          }
        return ((n.default = e), r && r.set(e, n), n);
      })(r(41666));
      function a(e) {
        if ('function' != typeof WeakMap) return null;
        var t = new WeakMap(),
          r = new WeakMap();
        return (a = function (e) {
          return e ? r : t;
        })(e);
      }
      Object.keys(i).forEach(function (e) {
        !(
          'default' === e ||
          '__esModule' === e ||
          Object.prototype.hasOwnProperty.call(n, e)
        ) &&
          ((e in t && t[e] === i[e]) ||
            Object.defineProperty(t, e, {
              enumerable: !0,
              get: function () {
                return i[e];
              },
            }));
      });
    },
    6399: (e, t, r) => {
      'use strict';
      var n = r(70269);
      Object.defineProperty(t, '__esModule', { value: !0 });
      var o = { encode: !0, decode: !0, getToken: !0 };
      ((t.decode = p), (t.encode = d), (t.getToken = f));
      var i = r(21704),
        a = n(r(93975)),
        s = r(87372),
        c = r(85733),
        l = r(95955);
      Object.keys(l).forEach(function (e) {
        !(
          'default' === e ||
          '__esModule' === e ||
          Object.prototype.hasOwnProperty.call(o, e)
        ) &&
          ((e in t && t[e] === l[e]) ||
            Object.defineProperty(t, e, {
              enumerable: !0,
              get: function () {
                return l[e];
              },
            }));
      });
      let u = () => (Date.now() / 1e3) | 0;
      async function d(e) {
        let { token: t = {}, secret: r, maxAge: n = 2592e3, salt: o = '' } = e,
          a = await h(r, o);
        return await new i.EncryptJWT(t)
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
          .setIssuedAt()
          .setExpirationTime(u() + n)
          .setJti((0, s.v4)())
          .encrypt(a);
      }
      async function p(e) {
        let { token: t, secret: r, salt: n = '' } = e;
        if (!t) return null;
        let o = await h(r, n),
          { payload: a } = await (0, i.jwtDecrypt)(t, o, {
            clockTolerance: 15,
          });
        return a;
      }
      async function f(e) {
        var t, r, n, o;
        let {
          req: i,
          secureCookie: a = null !==
            (t =
              null === (r = process.env.NEXTAUTH_URL) || void 0 === r
                ? void 0
                : r.startsWith('https://')) && void 0 !== t
            ? t
            : !!process.env.VERCEL,
          cookieName: s = a
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token',
          raw: l,
          decode: u = p,
          logger: d = console,
          secret: f = null !== (n = process.env.NEXTAUTH_SECRET) && void 0 !== n
            ? n
            : process.env.AUTH_SECRET,
        } = e;
        if (!i) throw Error('Must pass `req` to JWT getToken()');
        let h = new c.SessionStore(
            { name: s, options: { secure: a } },
            { cookies: i.cookies, headers: i.headers },
            d
          ).value,
          y =
            i.headers instanceof Headers
              ? i.headers.get('authorization')
              : null === (o = i.headers) || void 0 === o
                ? void 0
                : o.authorization;
        if (
          (h ||
            (null == y ? void 0 : y.split(' ')[0]) !== 'Bearer' ||
            (h = decodeURIComponent(y.split(' ')[1])),
          !h)
        )
          return null;
        if (l) return h;
        try {
          return await u({ token: h, secret: f });
        } catch (e) {
          return null;
        }
      }
      async function h(e, t) {
        return await (0, a.default)(
          'sha256',
          e,
          t,
          `NextAuth.js Generated Encryption Key${t ? ` (${t})` : ''}`,
          32
        );
      }
    },
    95955: (e, t) => {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
    },
    41666: (e, t, r) => {
      'use strict';
      let n = ['nextauth'];
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = void 0),
        (t.getServerSession = c),
        (t.unstable_getServerSession = l));
      var o = r(79846),
        i = r(55529);
      async function a(e, t, r) {
        var a, s, c, l, u, d, p, f, h;
        let y = e.query,
          { nextauth: g } = y,
          v = (function (e, t) {
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
          })(y, n);
        (null !== (a = r.secret) && void 0 !== a) ||
          (r.secret =
            null !==
              (s =
                null !==
                  (c =
                    null === (l = r.jwt) || void 0 === l ? void 0 : l.secret) &&
                void 0 !== c
                  ? c
                  : process.env.NEXTAUTH_SECRET) && void 0 !== s
              ? s
              : process.env.AUTH_SECRET);
        let m = await (0, o.AuthHandler)({
          req: {
            body: e.body,
            query: v,
            cookies: e.cookies,
            headers: e.headers,
            method: e.method,
            action: null == g ? void 0 : g[0],
            providerId: null == g ? void 0 : g[1],
            error:
              null !== (u = e.query.error) && void 0 !== u
                ? u
                : null == g
                  ? void 0
                  : g[1],
          },
          options: r,
        });
        if (
          (t.status(null !== (d = m.status) && void 0 !== d ? d : 200),
          null === (p = m.cookies) ||
            void 0 === p ||
            p.forEach(e => (0, i.setCookie)(t, e)),
          null === (f = m.headers) ||
            void 0 === f ||
            f.forEach(e => t.setHeader(e.key, e.value)),
          m.redirect)
        ) {
          if (
            (null === (h = e.body) || void 0 === h ? void 0 : h.json) !== 'true'
          ) {
            (t.status(302).setHeader('Location', m.redirect), t.end());
            return;
          }
          return t.json({ url: m.redirect });
        }
        return t.send(m.body);
      }
      async function s(e, t, n) {
        var a, s, c, l;
        (null !== (a = n.secret) && void 0 !== a) ||
          (n.secret =
            null !== (s = process.env.NEXTAUTH_SECRET) && void 0 !== s
              ? s
              : process.env.AUTH_SECRET);
        let { headers: u, cookies: d } = r(14308),
          p =
            null === (c = await t.params) || void 0 === c ? void 0 : c.nextauth,
          f = Object.fromEntries(e.nextUrl.searchParams),
          h = await (0, i.getBody)(e),
          y = await (0, o.AuthHandler)({
            req: {
              body: h,
              query: f,
              cookies: Object.fromEntries(
                (await d()).getAll().map(e => [e.name, e.value])
              ),
              headers: Object.fromEntries(await u()),
              method: e.method,
              action: null == p ? void 0 : p[0],
              providerId: null == p ? void 0 : p[1],
              error:
                null !== (l = f.error) && void 0 !== l
                  ? l
                  : null == p
                    ? void 0
                    : p[1],
            },
            options: n,
          }),
          g = (0, i.toResponse)(y),
          v = g.headers.get('Location');
        return (null == h ? void 0 : h.json) === 'true' && v
          ? (g.headers.delete('Location'),
            g.headers.set('Content-Type', 'application/json'),
            new Response(JSON.stringify({ url: v }), {
              status: y.status,
              headers: g.headers,
            }))
          : g;
      }
      async function c(...e) {
        var t, n, a;
        let s, l, u;
        let d = 0 === e.length || 1 === e.length;
        if (d) {
          u = Object.assign({}, e[0], { providers: [] });
          let { headers: t, cookies: n } = r(14308);
          ((s = {
            headers: Object.fromEntries(await t()),
            cookies: Object.fromEntries(
              (await n()).getAll().map(e => [e.name, e.value])
            ),
          }),
            (l = { getHeader() {}, setCookie() {}, setHeader() {} }));
        } else
          ((s = e[0]),
            (l = e[1]),
            (u = Object.assign({}, e[2], { providers: [] })));
        (null !== (n = (t = u).secret) && void 0 !== n) ||
          (t.secret =
            null !== (a = process.env.NEXTAUTH_SECRET) && void 0 !== a
              ? a
              : process.env.AUTH_SECRET);
        let {
          body: p,
          cookies: f,
          status: h = 200,
        } = await (0, o.AuthHandler)({
          options: u,
          req: {
            action: 'session',
            method: 'GET',
            cookies: s.cookies,
            headers: s.headers,
          },
        });
        if (
          (null == f || f.forEach(e => (0, i.setCookie)(l, e)),
          p && 'string' != typeof p && Object.keys(p).length)
        ) {
          if (200 === h) return (d && delete p.expires, p);
          throw Error(p.message);
        }
        return null;
      }
      async function l(...e) {
        return await c(...e);
      }
      t.default = function (...e) {
        var t;
        return 1 === e.length
          ? async (t, r) =>
              null != r && r.params ? await s(t, r, e[0]) : await a(t, r, e[0])
          : null !== (t = e[1]) && void 0 !== t && t.params
            ? s(...e)
            : a(...e);
      };
    },
    55529: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.getBody = o),
        (t.setCookie = function (e, t) {
          var r;
          let o =
            null !== (r = e.getHeader('Set-Cookie')) && void 0 !== r ? r : [];
          Array.isArray(o) || (o = [o]);
          let { name: i, value: a, options: s } = t,
            c = (0, n.serialize)(i, a, s);
          (o.push(c), e.setHeader('Set-Cookie', o));
        }),
        (t.toResponse = function (e) {
          var t, r, o;
          let i = new Headers(
            null === (t = e.headers) || void 0 === t
              ? void 0
              : t.reduce((e, { key: t, value: r }) => ((e[t] = r), e), {})
          );
          null === (r = e.cookies) ||
            void 0 === r ||
            r.forEach(e => {
              let { name: t, value: r, options: o } = e,
                a = (0, n.serialize)(t, r, o);
              i.has('Set-Cookie')
                ? i.append('Set-Cookie', a)
                : i.set('Set-Cookie', a);
            });
          let a = e.body;
          'application/json' === i.get('content-type')
            ? (a = JSON.stringify(e.body))
            : 'application/x-www-form-urlencoded' === i.get('content-type') &&
              (a = new URLSearchParams(e.body).toString());
          let s = e.redirect
              ? 302
              : null !== (o = e.status) && void 0 !== o
                ? o
                : 200,
            c = new Response(a, { headers: i, status: s });
          return (e.redirect && c.headers.set('Location', e.redirect), c);
        }));
      var n = r(29706);
      async function o(e) {
        if (!('body' in e) || !e.body || 'POST' !== e.method) return;
        let t = e.headers.get('content-type');
        return null != t && t.includes('application/json')
          ? await e.json()
          : null != t && t.includes('application/x-www-form-urlencoded')
            ? Object.fromEntries(new URLSearchParams(await e.text()))
            : void 0;
      }
    },
    21339: (e, t) => {
      'use strict';
      t.Z = function (e) {
        return {
          id: 'credentials',
          name: 'Credentials',
          type: 'credentials',
          credentials: {},
          authorize: () => null,
          options: e,
        };
      };
    },
    56962: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.detectOrigin = function (e, t) {
          var r;
          return (
            null !== (r = process.env.VERCEL) && void 0 !== r
              ? r
              : process.env.AUTH_TRUST_HOST
          )
            ? `${'http' === t ? 'http' : 'https'}://${e}`
            : process.env.NEXTAUTH_URL;
        }));
    },
    21670: (e, t, r) => {
      'use strict';
      var n = r(70269);
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = void 0),
        (t.proxyLogger = function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : i;
          arguments.length > 1 && arguments[1];
          try {
            return e;
          } catch (e) {
            return i;
          }
        }),
        (t.setLogger = function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            t = arguments.length > 1 ? arguments[1] : void 0;
          (t || (i.debug = function () {}),
            e.error && (i.error = e.error),
            e.warn && (i.warn = e.warn),
            e.debug && (i.debug = e.debug));
        }),
        n(r(17242)),
        n(r(20484)),
        n(r(4395)));
      var o = r(38398),
        i = {
          error: function (e, t) {
            ((t = (function e(t) {
              var r;
              return t instanceof Error && !(t instanceof o.UnknownError)
                ? { message: t.message, stack: t.stack, name: t.name }
                : (null != t &&
                    t.error &&
                    ((t.error = e(t.error)),
                    (t.message =
                      null !== (r = t.message) && void 0 !== r
                        ? r
                        : t.error.message)),
                  t);
            })(t)),
              console.error(
                '[next-auth][error]['.concat(e, ']'),
                '\nhttps://next-auth.js.org/errors#'.concat(e.toLowerCase()),
                t.message,
                t
              ));
          },
          warn: function (e) {
            console.warn(
              '[next-auth][warn]['.concat(e, ']'),
              '\nhttps://next-auth.js.org/warnings#'.concat(e.toLowerCase())
            );
          },
          debug: function (e, t) {
            console.log('[next-auth][debug]['.concat(e, ']'), t);
          },
        };
      t.default = i;
    },
    40110: (e, t) => {
      'use strict';
      function r(e) {
        return e && 'object' == typeof e && !Array.isArray(e);
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.merge = function e(t, ...n) {
          if (!n.length) return t;
          let o = n.shift();
          if (r(t) && r(o))
            for (let n in o)
              r(o[n])
                ? (t[n] || Object.assign(t, { [n]: {} }), e(t[n], o[n]))
                : Object.assign(t, { [n]: o[n] });
          return e(t, ...n);
        }));
    },
    41932: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = function (e) {
          var t;
          let r = new URL('http://localhost:3000/api/auth');
          e && !e.startsWith('http') && (e = `https://${e}`);
          let n = new URL(null !== (t = e) && void 0 !== t ? t : r),
            o = ('/' === n.pathname ? r.pathname : n.pathname).replace(
              /\/$/,
              ''
            ),
            i = `${n.origin}${o}`;
          return {
            origin: n.origin,
            host: n.host,
            path: o,
            base: i,
            toString: () => i,
          };
        }));
    },
    60171: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'DraftMode', {
          enumerable: !0,
          get: function () {
            return o;
          },
        }));
      let n = r(30129);
      class o {
        get isEnabled() {
          return this._provider.isEnabled;
        }
        enable() {
          if (!(0, n.staticGenerationBailout)('draftMode().enable()'))
            return this._provider.enable();
        }
        disable() {
          if (!(0, n.staticGenerationBailout)('draftMode().disable()'))
            return this._provider.disable();
        }
        constructor(e) {
          this._provider = e;
        }
      }
      ('function' == typeof t.default ||
        ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    83292: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var r in t)
            Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
        })(t, {
          headers: function () {
            return u;
          },
          cookies: function () {
            return d;
          },
          draftMode: function () {
            return p;
          },
        }));
      let n = r(5014),
        o = r(33112),
        i = r(75627),
        a = r(54580),
        s = r(72934),
        c = r(30129),
        l = r(60171);
      function u() {
        if (
          (0, c.staticGenerationBailout)('headers', {
            link: 'https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering',
          })
        )
          return o.HeadersAdapter.seal(new Headers({}));
        let e = a.requestAsyncStorage.getStore();
        if (!e)
          throw Error(
            'Invariant: headers() expects to have requestAsyncStorage, none available.'
          );
        return e.headers;
      }
      function d() {
        if (
          (0, c.staticGenerationBailout)('cookies', {
            link: 'https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering',
          })
        )
          return n.RequestCookiesAdapter.seal(
            new i.RequestCookies(new Headers({}))
          );
        let e = a.requestAsyncStorage.getStore();
        if (!e)
          throw Error(
            'Invariant: cookies() expects to have requestAsyncStorage, none available.'
          );
        let t = s.actionAsyncStorage.getStore();
        return t && (t.isAction || t.isAppRoute) ? e.mutableCookies : e.cookies;
      }
      function p() {
        let e = a.requestAsyncStorage.getStore();
        if (!e)
          throw Error(
            'Invariant: draftMode() expects to have requestAsyncStorage, none available.'
          );
        return new l.DraftMode(e.draftMode);
      }
      ('function' == typeof t.default ||
        ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    33112: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var r in t)
            Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
        })(t, {
          ReadonlyHeadersError: function () {
            return o;
          },
          HeadersAdapter: function () {
            return i;
          },
        }));
      let n = r(63324);
      class o extends Error {
        constructor() {
          super(
            'Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers'
          );
        }
        static callable() {
          throw new o();
        }
      }
      class i extends Headers {
        constructor(e) {
          (super(),
            (this.headers = new Proxy(e, {
              get(t, r, o) {
                if ('symbol' == typeof r) return n.ReflectAdapter.get(t, r, o);
                let i = r.toLowerCase(),
                  a = Object.keys(e).find(e => e.toLowerCase() === i);
                if (void 0 !== a) return n.ReflectAdapter.get(t, a, o);
              },
              set(t, r, o, i) {
                if ('symbol' == typeof r)
                  return n.ReflectAdapter.set(t, r, o, i);
                let a = r.toLowerCase(),
                  s = Object.keys(e).find(e => e.toLowerCase() === a);
                return n.ReflectAdapter.set(t, s ?? r, o, i);
              },
              has(t, r) {
                if ('symbol' == typeof r) return n.ReflectAdapter.has(t, r);
                let o = r.toLowerCase(),
                  i = Object.keys(e).find(e => e.toLowerCase() === o);
                return void 0 !== i && n.ReflectAdapter.has(t, i);
              },
              deleteProperty(t, r) {
                if ('symbol' == typeof r)
                  return n.ReflectAdapter.deleteProperty(t, r);
                let o = r.toLowerCase(),
                  i = Object.keys(e).find(e => e.toLowerCase() === o);
                return void 0 === i || n.ReflectAdapter.deleteProperty(t, i);
              },
            })));
        }
        static seal(e) {
          return new Proxy(e, {
            get(e, t, r) {
              switch (t) {
                case 'append':
                case 'delete':
                case 'set':
                  return o.callable;
                default:
                  return n.ReflectAdapter.get(e, t, r);
              }
            },
          });
        }
        merge(e) {
          return Array.isArray(e) ? e.join(', ') : e;
        }
        static from(e) {
          return e instanceof Headers ? e : new i(e);
        }
        append(e, t) {
          let r = this.headers[e];
          'string' == typeof r
            ? (this.headers[e] = [r, t])
            : Array.isArray(r)
              ? r.push(t)
              : (this.headers[e] = t);
        }
        delete(e) {
          delete this.headers[e];
        }
        get(e) {
          let t = this.headers[e];
          return void 0 !== t ? this.merge(t) : null;
        }
        has(e) {
          return void 0 !== this.headers[e];
        }
        set(e, t) {
          this.headers[e] = t;
        }
        forEach(e, t) {
          for (let [r, n] of this.entries()) e.call(t, n, r, this);
        }
        *entries() {
          for (let e of Object.keys(this.headers)) {
            let t = e.toLowerCase(),
              r = this.get(t);
            yield [t, r];
          }
        }
        *keys() {
          for (let e of Object.keys(this.headers)) {
            let t = e.toLowerCase();
            yield t;
          }
        }
        *values() {
          for (let e of Object.keys(this.headers)) {
            let t = this.get(e);
            yield t;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
    },
    63324: (e, t) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'ReflectAdapter', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }));
      class r {
        static get(e, t, r) {
          let n = Reflect.get(e, t, r);
          return 'function' == typeof n ? n.bind(e) : n;
        }
        static set(e, t, r, n) {
          return Reflect.set(e, t, r, n);
        }
        static has(e, t) {
          return Reflect.has(e, t);
        }
        static deleteProperty(e, t) {
          return Reflect.deleteProperty(e, t);
        }
      }
    },
    5014: (e, t, r) => {
      'use strict';
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var r in t)
            Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
        })(t, {
          ReadonlyRequestCookiesError: function () {
            return i;
          },
          RequestCookiesAdapter: function () {
            return a;
          },
          getModifiedCookieValues: function () {
            return c;
          },
          appendMutableCookies: function () {
            return l;
          },
          MutableRequestCookiesAdapter: function () {
            return u;
          },
        }));
      let n = r(75627),
        o = r(63324);
      class i extends Error {
        constructor() {
          super(
            'Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options'
          );
        }
        static callable() {
          throw new i();
        }
      }
      class a {
        static seal(e) {
          return new Proxy(e, {
            get(e, t, r) {
              switch (t) {
                case 'clear':
                case 'delete':
                case 'set':
                  return i.callable;
                default:
                  return o.ReflectAdapter.get(e, t, r);
              }
            },
          });
        }
      }
      let s = Symbol.for('next.mutated.cookies');
      function c(e) {
        let t = e[s];
        return t && Array.isArray(t) && 0 !== t.length ? t : [];
      }
      function l(e, t) {
        let r = c(t);
        if (0 === r.length) return !1;
        let o = new n.ResponseCookies(e),
          i = o.getAll();
        for (let e of r) o.set(e);
        for (let e of i) o.set(e);
        return !0;
      }
      class u {
        static wrap(e, t) {
          let r = new n.ResponseCookies(new Headers());
          for (let t of e.getAll()) r.set(t);
          let i = [],
            a = new Set(),
            c = () => {
              var e;
              let o =
                null == fetch.__nextGetStaticStore
                  ? void 0
                  : null == (e = fetch.__nextGetStaticStore.call(fetch))
                    ? void 0
                    : e.getStore();
              if (
                (o && (o.pathWasRevalidated = !0),
                (i = r.getAll().filter(e => a.has(e.name))),
                t)
              ) {
                let e = [];
                for (let t of i) {
                  let r = new n.ResponseCookies(new Headers());
                  (r.set(t), e.push(r.toString()));
                }
                t(e);
              }
            };
          return new Proxy(r, {
            get(e, t, r) {
              switch (t) {
                case s:
                  return i;
                case 'delete':
                  return function (...t) {
                    a.add('string' == typeof t[0] ? t[0] : t[0].name);
                    try {
                      e.delete(...t);
                    } finally {
                      c();
                    }
                  };
                case 'set':
                  return function (...t) {
                    a.add('string' == typeof t[0] ? t[0] : t[0].name);
                    try {
                      return e.set(...t);
                    } finally {
                      c();
                    }
                  };
                default:
                  return o.ReflectAdapter.get(e, t, r);
              }
            },
          });
        }
      }
    },
    14308: (e, t, r) => {
      e.exports = r(83292);
    },
    13585: (e, t, r) => {
      ((t.OAuth = r(80454).OAuth),
        (t.OAuthEcho = r(80454).OAuthEcho),
        (t.OAuth2 = r(2101).OAuth2));
    },
    15974: e => {
      e.exports.isAnEarlyCloseHost = function (e) {
        return e && e.match('.*google(apis)?.com$');
      };
    },
    80454: (e, t, r) => {
      var n = r(6113),
        o = r(59062),
        i = r(13685),
        a = r(95687),
        s = r(57310),
        c = r(63477),
        l = r(15974);
      ((t.OAuth = function (e, t, r, n, o, i, a, s, c) {
        if (
          ((this._isEcho = !1),
          (this._requestUrl = e),
          (this._accessUrl = t),
          (this._consumerKey = r),
          (this._consumerSecret = this._encodeData(n)),
          'RSA-SHA1' == a && (this._privateKey = n),
          (this._version = o),
          void 0 === i
            ? (this._authorize_callback = 'oob')
            : (this._authorize_callback = i),
          'PLAINTEXT' != a && 'HMAC-SHA1' != a && 'RSA-SHA1' != a)
        )
          throw Error('Un-supported signature method: ' + a);
        ((this._signatureMethod = a),
          (this._nonceSize = s || 32),
          (this._headers = c || {
            Accept: '*/*',
            Connection: 'close',
            'User-Agent': 'Node authentication',
          }),
          (this._clientOptions = this._defaultClientOptions =
            {
              requestTokenHttpMethod: 'POST',
              accessTokenHttpMethod: 'POST',
              followRedirects: !0,
            }),
          (this._oauthParameterSeperator = ','));
      }),
        (t.OAuthEcho = function (e, t, r, n, o, i, a, s) {
          if (
            ((this._isEcho = !0),
            (this._realm = e),
            (this._verifyCredentials = t),
            (this._consumerKey = r),
            (this._consumerSecret = this._encodeData(n)),
            'RSA-SHA1' == i && (this._privateKey = n),
            (this._version = o),
            'PLAINTEXT' != i && 'HMAC-SHA1' != i && 'RSA-SHA1' != i)
          )
            throw Error('Un-supported signature method: ' + i);
          ((this._signatureMethod = i),
            (this._nonceSize = a || 32),
            (this._headers = s || {
              Accept: '*/*',
              Connection: 'close',
              'User-Agent': 'Node authentication',
            }),
            (this._oauthParameterSeperator = ','));
        }),
        (t.OAuthEcho.prototype = t.OAuth.prototype),
        (t.OAuth.prototype._getTimestamp = function () {
          return Math.floor(new Date().getTime() / 1e3);
        }),
        (t.OAuth.prototype._encodeData = function (e) {
          return null == e || '' == e
            ? ''
            : encodeURIComponent(e)
                .replace(/\!/g, '%21')
                .replace(/\'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');
        }),
        (t.OAuth.prototype._decodeData = function (e) {
          return (
            null != e && (e = e.replace(/\+/g, ' ')),
            decodeURIComponent(e)
          );
        }),
        (t.OAuth.prototype._getSignature = function (e, t, r, n) {
          var o = this._createSignatureBase(e, t, r);
          return this._createSignature(o, n);
        }),
        (t.OAuth.prototype._normalizeUrl = function (e) {
          var t = s.parse(e, !0),
            r = '';
          return (
            t.port &&
              (('http:' == t.protocol && '80' != t.port) ||
                ('https:' == t.protocol && '443' != t.port)) &&
              (r = ':' + t.port),
            (t.pathname && '' != t.pathname) || (t.pathname = '/'),
            t.protocol + '//' + t.hostname + r + t.pathname
          );
        }),
        (t.OAuth.prototype._isParameterNameAnOAuthParameter = function (e) {
          var t = e.match('^oauth_');
          return !!t && 'oauth_' === t[0];
        }),
        (t.OAuth.prototype._buildAuthorizationHeaders = function (e) {
          var t = 'OAuth ';
          this._isEcho && (t += 'realm="' + this._realm + '",');
          for (var r = 0; r < e.length; r++)
            this._isParameterNameAnOAuthParameter(e[r][0]) &&
              (t +=
                '' +
                this._encodeData(e[r][0]) +
                '="' +
                this._encodeData(e[r][1]) +
                '"' +
                this._oauthParameterSeperator);
          return t.substring(
            0,
            t.length - this._oauthParameterSeperator.length
          );
        }),
        (t.OAuth.prototype._makeArrayOfArgumentsHash = function (e) {
          var t = [];
          for (var r in e)
            if (e.hasOwnProperty(r)) {
              var n = e[r];
              if (Array.isArray(n))
                for (var o = 0; o < n.length; o++) t[t.length] = [r, n[o]];
              else t[t.length] = [r, n];
            }
          return t;
        }),
        (t.OAuth.prototype._sortRequestParams = function (e) {
          return (
            e.sort(function (e, t) {
              return e[0] == t[0]
                ? e[1] < t[1]
                  ? -1
                  : 1
                : e[0] < t[0]
                  ? -1
                  : 1;
            }),
            e
          );
        }),
        (t.OAuth.prototype._normaliseRequestParams = function (e) {
          for (
            var t = this._makeArrayOfArgumentsHash(e), r = 0;
            r < t.length;
            r++
          )
            ((t[r][0] = this._encodeData(t[r][0])),
              (t[r][1] = this._encodeData(t[r][1])));
          t = this._sortRequestParams(t);
          for (var e = '', r = 0; r < t.length; r++)
            ((e += t[r][0] + '=' + t[r][1]), r < t.length - 1 && (e += '&'));
          return e;
        }),
        (t.OAuth.prototype._createSignatureBase = function (e, t, r) {
          return (
            (t = this._encodeData(this._normalizeUrl(t))),
            (r = this._encodeData(r)),
            e.toUpperCase() + '&' + t + '&' + r
          );
        }),
        (t.OAuth.prototype._createSignature = function (e, t) {
          if (void 0 === t) var t = '';
          else t = this._encodeData(t);
          var r = this._consumerSecret + '&' + t,
            i = '';
          return (
            'PLAINTEXT' == this._signatureMethod
              ? (i = r)
              : 'RSA-SHA1' == this._signatureMethod
                ? ((r = this._privateKey || ''),
                  (i = n.createSign('RSA-SHA1').update(e).sign(r, 'base64')))
                : (i = n.Hmac
                    ? n.createHmac('sha1', r).update(e).digest('base64')
                    : o.HMACSHA1(r, e)),
            i
          );
        }),
        (t.OAuth.prototype.NONCE_CHARS = [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
        ]),
        (t.OAuth.prototype._getNonce = function (e) {
          for (
            var t, r = [], n = this.NONCE_CHARS, o = n.length, i = 0;
            i < e;
            i++
          )
            ((t = Math.floor(Math.random() * o)), (r[i] = n[t]));
          return r.join('');
        }),
        (t.OAuth.prototype._createClient = function (e, t, r, n, o, s) {
          return (s ? a : i).request({
            host: t,
            port: e,
            path: n,
            method: r,
            headers: o,
          });
        }),
        (t.OAuth.prototype._prepareParameters = function (e, t, r, n, o) {
          var i = {
            oauth_timestamp: this._getTimestamp(),
            oauth_nonce: this._getNonce(this._nonceSize),
            oauth_version: this._version,
            oauth_signature_method: this._signatureMethod,
            oauth_consumer_key: this._consumerKey,
          };
          if ((e && (i.oauth_token = e), this._isEcho))
            u = this._getSignature(
              'GET',
              this._verifyCredentials,
              this._normaliseRequestParams(i),
              t
            );
          else {
            if (o) for (var a in o) o.hasOwnProperty(a) && (i[a] = o[a]);
            var l = s.parse(n, !1);
            if (l.query) {
              var u,
                d,
                p = c.parse(l.query);
              for (var a in p) {
                var f = p[a];
                if ('object' == typeof f)
                  for (d in f) i[a + '[' + d + ']'] = f[d];
                else i[a] = f;
              }
            }
            u = this._getSignature(r, n, this._normaliseRequestParams(i), t);
          }
          var h = this._sortRequestParams(this._makeArrayOfArgumentsHash(i));
          return ((h[h.length] = ['oauth_signature', u]), h);
        }),
        (t.OAuth.prototype._performSecureRequest = function (
          e,
          t,
          r,
          n,
          o,
          i,
          a,
          u
        ) {
          var d,
            p,
            f = this._prepareParameters(e, t, r, n, o);
          a || (a = 'application/x-www-form-urlencoded');
          var h = s.parse(n, !1);
          ('http:' != h.protocol || h.port || (h.port = 80),
            'https:' != h.protocol || h.port || (h.port = 443));
          var y = {},
            g = this._buildAuthorizationHeaders(f);
          for (var v in (this._isEcho
            ? (y['X-Verify-Credentials-Authorization'] = g)
            : (y.Authorization = g),
          (y.Host = h.host),
          this._headers))
            this._headers.hasOwnProperty(v) && (y[v] = this._headers[v]);
          for (var v in o)
            this._isParameterNameAnOAuthParameter(v) && delete o[v];
          (('POST' == r || 'PUT' == r) &&
            null == i &&
            null != o &&
            (i = c
              .stringify(o)
              .replace(/\!/g, '%21')
              .replace(/\'/g, '%27')
              .replace(/\(/g, '%28')
              .replace(/\)/g, '%29')
              .replace(/\*/g, '%2A')),
            i
              ? Buffer.isBuffer(i)
                ? (y['Content-length'] = i.length)
                : (y['Content-length'] = Buffer.byteLength(i))
              : (y['Content-length'] = 0),
            (y['Content-Type'] = a),
            (h.pathname && '' != h.pathname) || (h.pathname = '/'),
            (d = h.query ? h.pathname + '?' + h.query : h.pathname),
            (p =
              'https:' == h.protocol
                ? this._createClient(h.port, h.hostname, r, d, y, !0)
                : this._createClient(h.port, h.hostname, r, d, y)));
          var m = this._clientOptions;
          if (!u)
            return (
              ('POST' == r || 'PUT' == r) && null != i && '' != i && p.write(i),
              p
            );
          var b = '',
            _ = this,
            w = l.isAnEarlyCloseHost(h.hostname),
            O = !1,
            S = function (n) {
              O ||
                ((O = !0),
                n.statusCode >= 200 && n.statusCode <= 299
                  ? u(null, b, n)
                  : (301 == n.statusCode || 302 == n.statusCode) &&
                      m.followRedirects &&
                      n.headers &&
                      n.headers.location
                    ? _._performSecureRequest(
                        e,
                        t,
                        r,
                        n.headers.location,
                        o,
                        i,
                        a,
                        u
                      )
                    : u({ statusCode: n.statusCode, data: b }, b, n));
            };
          (p.on('response', function (e) {
            (e.setEncoding('utf8'),
              e.on('data', function (e) {
                b += e;
              }),
              e.on('end', function () {
                S(e);
              }),
              e.on('close', function () {
                w && S(e);
              }));
          }),
            p.on('error', function (e) {
              O || ((O = !0), u(e));
            }),
            ('POST' == r || 'PUT' == r) && null != i && '' != i && p.write(i),
            p.end());
        }),
        (t.OAuth.prototype.setClientOptions = function (e) {
          var t,
            r = {},
            n = Object.prototype.hasOwnProperty;
          for (t in this._defaultClientOptions)
            n.call(e, t)
              ? (r[t] = e[t])
              : (r[t] = this._defaultClientOptions[t]);
          this._clientOptions = r;
        }),
        (t.OAuth.prototype.getOAuthAccessToken = function (e, t, r, n) {
          var o = {};
          ('function' == typeof r ? (n = r) : (o.oauth_verifier = r),
            this._performSecureRequest(
              e,
              t,
              this._clientOptions.accessTokenHttpMethod,
              this._accessUrl,
              o,
              null,
              null,
              function (e, t, r) {
                if (e) n(e);
                else {
                  var o = c.parse(t),
                    i = o.oauth_token;
                  delete o.oauth_token;
                  var a = o.oauth_token_secret;
                  (delete o.oauth_token_secret, n(null, i, a, o));
                }
              }
            ));
        }),
        (t.OAuth.prototype.getProtectedResource = function (e, t, r, n, o) {
          this._performSecureRequest(r, n, t, e, null, '', null, o);
        }),
        (t.OAuth.prototype.delete = function (e, t, r, n) {
          return this._performSecureRequest(
            t,
            r,
            'DELETE',
            e,
            null,
            '',
            null,
            n
          );
        }),
        (t.OAuth.prototype.get = function (e, t, r, n) {
          return this._performSecureRequest(t, r, 'GET', e, null, '', null, n);
        }),
        (t.OAuth.prototype._putOrPost = function (e, t, r, n, o, i, a) {
          var s = null;
          return (
            'function' == typeof i && ((a = i), (i = null)),
            'string' == typeof o ||
              Buffer.isBuffer(o) ||
              ((i = 'application/x-www-form-urlencoded'), (s = o), (o = null)),
            this._performSecureRequest(r, n, e, t, s, o, i, a)
          );
        }),
        (t.OAuth.prototype.put = function (e, t, r, n, o, i) {
          return this._putOrPost('PUT', e, t, r, n, o, i);
        }),
        (t.OAuth.prototype.post = function (e, t, r, n, o, i) {
          return this._putOrPost('POST', e, t, r, n, o, i);
        }),
        (t.OAuth.prototype.getOAuthRequestToken = function (e, t) {
          ('function' == typeof e && ((t = e), (e = {})),
            this._authorize_callback &&
              (e.oauth_callback = this._authorize_callback),
            this._performSecureRequest(
              null,
              null,
              this._clientOptions.requestTokenHttpMethod,
              this._requestUrl,
              e,
              null,
              null,
              function (e, r, n) {
                if (e) t(e);
                else {
                  var o = c.parse(r),
                    i = o.oauth_token,
                    a = o.oauth_token_secret;
                  (delete o.oauth_token,
                    delete o.oauth_token_secret,
                    t(null, i, a, o));
                }
              }
            ));
        }),
        (t.OAuth.prototype.signUrl = function (e, t, r, n) {
          if (void 0 === n) var n = 'GET';
          for (
            var o = this._prepareParameters(t, r, n, e, {}),
              i = s.parse(e, !1),
              a = '',
              c = 0;
            c < o.length;
            c++
          )
            a += o[c][0] + '=' + this._encodeData(o[c][1]) + '&';
          return (
            (a = a.substring(0, a.length - 1)),
            i.protocol + '//' + i.host + i.pathname + '?' + a
          );
        }),
        (t.OAuth.prototype.authHeader = function (e, t, r, n) {
          if (void 0 === n) var n = 'GET';
          var o = this._prepareParameters(t, r, n, e, {});
          return this._buildAuthorizationHeaders(o);
        }));
    },
    2101: (e, t, r) => {
      var n = r(63477),
        o = (r(6113), r(95687)),
        i = r(13685),
        a = r(57310),
        s = r(15974);
      ((t.OAuth2 = function (e, t, r, n, o, i) {
        ((this._clientId = e),
          (this._clientSecret = t),
          (this._baseSite = r),
          (this._authorizeUrl = n || '/oauth/authorize'),
          (this._accessTokenUrl = o || '/oauth/access_token'),
          (this._accessTokenName = 'access_token'),
          (this._authMethod = 'Bearer'),
          (this._customHeaders = i || {}),
          (this._useAuthorizationHeaderForGET = !1),
          (this._agent = void 0));
      }),
        (t.OAuth2.prototype.setAgent = function (e) {
          this._agent = e;
        }),
        (t.OAuth2.prototype.setAccessTokenName = function (e) {
          this._accessTokenName = e;
        }),
        (t.OAuth2.prototype.setAuthMethod = function (e) {
          this._authMethod = e;
        }),
        (t.OAuth2.prototype.useAuthorizationHeaderforGET = function (e) {
          this._useAuthorizationHeaderForGET = e;
        }),
        (t.OAuth2.prototype._getAccessTokenUrl = function () {
          return this._baseSite + this._accessTokenUrl;
        }),
        (t.OAuth2.prototype.buildAuthHeader = function (e) {
          return this._authMethod + ' ' + e;
        }),
        (t.OAuth2.prototype._chooseHttpLibrary = function (e) {
          var t = o;
          return ('https:' != e.protocol && (t = i), t);
        }),
        (t.OAuth2.prototype._request = function (e, t, r, o, i, s) {
          var c = a.parse(t, !0);
          'https:' != c.protocol || c.port || (c.port = 443);
          var l = this._chooseHttpLibrary(c),
            u = {};
          for (var d in this._customHeaders) u[d] = this._customHeaders[d];
          if (r) for (var d in r) u[d] = r[d];
          ((u.Host = c.host),
            u['User-Agent'] || (u['User-Agent'] = 'Node-oauth'),
            o
              ? Buffer.isBuffer(o)
                ? (u['Content-Length'] = o.length)
                : (u['Content-Length'] = Buffer.byteLength(o))
              : (u['Content-length'] = 0),
            !i ||
              'Authorization' in u ||
              (c.query || (c.query = {}),
              (c.query[this._accessTokenName] = i)));
          var p = n.stringify(c.query);
          p && (p = '?' + p);
          var f = {
            host: c.hostname,
            port: c.port,
            path: c.pathname + p,
            method: e,
            headers: u,
          };
          this._executeRequest(l, f, o, s);
        }),
        (t.OAuth2.prototype._executeRequest = function (e, t, r, n) {
          var o = s.isAnEarlyCloseHost(t.host),
            i = !1;
          function a(e, t) {
            i ||
              ((i = !0),
              (e.statusCode >= 200 && e.statusCode <= 299) ||
              301 == e.statusCode ||
              302 == e.statusCode
                ? n(null, t, e)
                : n({ statusCode: e.statusCode, data: t }));
          }
          var c = '';
          this._agent && (t.agent = this._agent);
          var l = e.request(t);
          (l.on('response', function (e) {
            (e.on('data', function (e) {
              c += e;
            }),
              e.on('close', function (t) {
                o && a(e, c);
              }),
              e.addListener('end', function () {
                a(e, c);
              }));
          }),
            l.on('error', function (e) {
              ((i = !0), n(e));
            }),
            ('POST' == t.method || 'PUT' == t.method) && r && l.write(r),
            l.end());
        }),
        (t.OAuth2.prototype.getAuthorizeUrl = function (e) {
          var e = e || {};
          return (
            (e.client_id = this._clientId),
            this._baseSite + this._authorizeUrl + '?' + n.stringify(e)
          );
        }),
        (t.OAuth2.prototype.getOAuthAccessToken = function (e, t, r) {
          var t = t || {};
          ((t.client_id = this._clientId),
            (t.client_secret = this._clientSecret));
          var o = 'refresh_token' === t.grant_type ? 'refresh_token' : 'code';
          t[o] = e;
          var i = n.stringify(t);
          this._request(
            'POST',
            this._getAccessTokenUrl(),
            { 'Content-Type': 'application/x-www-form-urlencoded' },
            i,
            null,
            function (e, t, o) {
              if (e) r(e);
              else {
                try {
                  i = JSON.parse(t);
                } catch (e) {
                  i = n.parse(t);
                }
                var i,
                  a = i.access_token,
                  s = i.refresh_token;
                (delete i.refresh_token, r(null, a, s, i));
              }
            }
          );
        }),
        (t.OAuth2.prototype.getProtectedResource = function (e, t, r) {
          this._request('GET', e, {}, '', t, r);
        }),
        (t.OAuth2.prototype.get = function (e, t, r) {
          if (this._useAuthorizationHeaderForGET) {
            var n = { Authorization: this.buildAuthHeader(t) };
            t = null;
          } else n = {};
          this._request('GET', e, n, '', t, r);
        }));
    },
    59062: (e, t) => {
      function r(e) {
        for (var t, r, n = '', o = -1; ++o < e.length; )
          ((t = e.charCodeAt(o)),
            (r = o + 1 < e.length ? e.charCodeAt(o + 1) : 0),
            55296 <= t &&
              t <= 56319 &&
              56320 <= r &&
              r <= 57343 &&
              ((t = 65536 + ((1023 & t) << 10) + (1023 & r)), o++),
            t <= 127
              ? (n += String.fromCharCode(t))
              : t <= 2047
                ? (n += String.fromCharCode(
                    192 | ((t >>> 6) & 31),
                    128 | (63 & t)
                  ))
                : t <= 65535
                  ? (n += String.fromCharCode(
                      224 | ((t >>> 12) & 15),
                      128 | ((t >>> 6) & 63),
                      128 | (63 & t)
                    ))
                  : t <= 2097151 &&
                    (n += String.fromCharCode(
                      240 | ((t >>> 18) & 7),
                      128 | ((t >>> 12) & 63),
                      128 | ((t >>> 6) & 63),
                      128 | (63 & t)
                    )));
        return n;
      }
      function n(e) {
        for (var t = Array(e.length >> 2), r = 0; r < t.length; r++) t[r] = 0;
        for (var r = 0; r < 8 * e.length; r += 8)
          t[r >> 5] |= (255 & e.charCodeAt(r / 8)) << (24 - (r % 32));
        return t;
      }
      function o(e, t) {
        ((e[t >> 5] |= 128 << (24 - (t % 32))),
          (e[(((t + 64) >> 9) << 4) + 15] = t));
        for (
          var r = Array(80),
            n = 1732584193,
            o = -271733879,
            s = -1732584194,
            c = 271733878,
            l = -1009589776,
            u = 0;
          u < e.length;
          u += 16
        ) {
          for (var d = n, p = o, f = s, h = c, y = l, g = 0; g < 80; g++) {
            g < 16
              ? (r[g] = e[u + g])
              : (r[g] = a(r[g - 3] ^ r[g - 8] ^ r[g - 14] ^ r[g - 16], 1));
            var v,
              m,
              b,
              _,
              w,
              O = i(
                i(
                  a(n, 5),
                  ((v = g),
                  (m = o),
                  (b = s),
                  (_ = c),
                  v < 20
                    ? (m & b) | (~m & _)
                    : v < 40
                      ? m ^ b ^ _
                      : v < 60
                        ? (m & b) | (m & _) | (b & _)
                        : m ^ b ^ _)
                ),
                i(
                  i(l, r[g]),
                  (w = g) < 20
                    ? 1518500249
                    : w < 40
                      ? 1859775393
                      : w < 60
                        ? -1894007588
                        : -899497514
                )
              );
            ((l = c), (c = s), (s = a(o, 30)), (o = n), (n = O));
          }
          ((n = i(n, d)),
            (o = i(o, p)),
            (s = i(s, f)),
            (c = i(c, h)),
            (l = i(l, y)));
        }
        return [n, o, s, c, l];
      }
      function i(e, t) {
        var r = (65535 & e) + (65535 & t);
        return (((e >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
      }
      function a(e, t) {
        return (e << t) | (e >>> (32 - t));
      }
      t.HMACSHA1 = function (e, t) {
        return (function (e) {
          for (var t = '', r = e.length, n = 0; n < r; n += 3)
            for (
              var o =
                  (e.charCodeAt(n) << 16) |
                  (n + 1 < r ? e.charCodeAt(n + 1) << 8 : 0) |
                  (n + 2 < r ? e.charCodeAt(n + 2) : 0),
                i = 0;
              i < 4;
              i++
            )
              8 * n + 6 * i > 8 * e.length
                ? (t += '=')
                : (t +=
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(
                      (o >>> (6 * (3 - i))) & 63
                    ));
          return t;
        })(
          (function (e, t) {
            var r = n(e);
            r.length > 16 && (r = o(r, 8 * e.length));
            for (var i = Array(16), a = Array(16), s = 0; s < 16; s++)
              ((i[s] = 909522486 ^ r[s]), (a[s] = 1549556828 ^ r[s]));
            var c = o(i.concat(n(t)), 512 + 8 * t.length);
            return (function (e) {
              for (var t = '', r = 0; r < 32 * e.length; r += 8)
                t += String.fromCharCode((e[r >> 5] >>> (24 - (r % 32))) & 255);
              return t;
            })(o(a.concat(c), 672));
          })(r(e), r(t))
        );
      };
    },
    73362: (e, t, r) => {
      'use strict';
      var n = r(6113);
      function o(e, t) {
        return (
          (t = s(e, t)),
          (function (e, t) {
            if (
              (void 0 ===
                (r =
                  'passthrough' !== t.algorithm
                    ? n.createHash(t.algorithm)
                    : new u()).write &&
                ((r.write = r.update), (r.end = r.update)),
              l(t, r).dispatch(e),
              r.update || r.end(''),
              r.digest)
            )
              return r.digest('buffer' === t.encoding ? void 0 : t.encoding);
            var r,
              o = r.read();
            return 'buffer' === t.encoding ? o : o.toString(t.encoding);
          })(e, t)
        );
      }
      (((t = e.exports = o).sha1 = function (e) {
        return o(e);
      }),
        (t.keys = function (e) {
          return o(e, {
            excludeValues: !0,
            algorithm: 'sha1',
            encoding: 'hex',
          });
        }),
        (t.MD5 = function (e) {
          return o(e, { algorithm: 'md5', encoding: 'hex' });
        }),
        (t.keysMD5 = function (e) {
          return o(e, { algorithm: 'md5', encoding: 'hex', excludeValues: !0 });
        }));
      var i = n.getHashes ? n.getHashes().slice() : ['sha1', 'md5'];
      i.push('passthrough');
      var a = ['buffer', 'hex', 'binary', 'base64'];
      function s(e, t) {
        t = t || {};
        var r = {};
        if (
          ((r.algorithm = t.algorithm || 'sha1'),
          (r.encoding = t.encoding || 'hex'),
          (r.excludeValues = !!t.excludeValues),
          (r.algorithm = r.algorithm.toLowerCase()),
          (r.encoding = r.encoding.toLowerCase()),
          (r.ignoreUnknown = !0 === t.ignoreUnknown),
          (r.respectType = !1 !== t.respectType),
          (r.respectFunctionNames = !1 !== t.respectFunctionNames),
          (r.respectFunctionProperties = !1 !== t.respectFunctionProperties),
          (r.unorderedArrays = !0 === t.unorderedArrays),
          (r.unorderedSets = !1 !== t.unorderedSets),
          (r.unorderedObjects = !1 !== t.unorderedObjects),
          (r.replacer = t.replacer || void 0),
          (r.excludeKeys = t.excludeKeys || void 0),
          void 0 === e)
        )
          throw Error('Object argument required.');
        for (var n = 0; n < i.length; ++n)
          i[n].toLowerCase() === r.algorithm.toLowerCase() &&
            (r.algorithm = i[n]);
        if (-1 === i.indexOf(r.algorithm))
          throw Error(
            'Algorithm "' +
              r.algorithm +
              '"  not supported. supported values: ' +
              i.join(', ')
          );
        if (-1 === a.indexOf(r.encoding) && 'passthrough' !== r.algorithm)
          throw Error(
            'Encoding "' +
              r.encoding +
              '"  not supported. supported values: ' +
              a.join(', ')
          );
        return r;
      }
      function c(e) {
        return (
          'function' == typeof e &&
          null !=
            /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(
              Function.prototype.toString.call(e)
            )
        );
      }
      function l(e, t, r) {
        r = r || [];
        var n = function (e) {
          return t.update ? t.update(e, 'utf8') : t.write(e, 'utf8');
        };
        return {
          dispatch: function (t) {
            e.replacer && (t = e.replacer(t));
            var r = typeof t;
            return (null === t && (r = 'null'), this['_' + r](t));
          },
          _object: function (t) {
            var o = Object.prototype.toString.call(t),
              i = /\[object (.*)\]/i.exec(o);
            i = (i = i ? i[1] : 'unknown:[' + o + ']').toLowerCase();
            var a = null;
            if ((a = r.indexOf(t)) >= 0)
              return this.dispatch('[CIRCULAR:' + a + ']');
            if (
              (r.push(t),
              'undefined' != typeof Buffer &&
                Buffer.isBuffer &&
                Buffer.isBuffer(t))
            )
              return (n('buffer:'), n(t));
            if ('object' !== i && 'function' !== i && 'asyncfunction' !== i) {
              if (this['_' + i]) this['_' + i](t);
              else if (e.ignoreUnknown) return n('[' + i + ']');
              else throw Error('Unknown object type "' + i + '"');
            } else {
              var s = Object.keys(t);
              (e.unorderedObjects && (s = s.sort()),
                !1 === e.respectType ||
                  c(t) ||
                  s.splice(0, 0, 'prototype', '__proto__', 'constructor'),
                e.excludeKeys &&
                  (s = s.filter(function (t) {
                    return !e.excludeKeys(t);
                  })),
                n('object:' + s.length + ':'));
              var l = this;
              return s.forEach(function (r) {
                (l.dispatch(r),
                  n(':'),
                  e.excludeValues || l.dispatch(t[r]),
                  n(','));
              });
            }
          },
          _array: function (t, o) {
            o = void 0 !== o ? o : !1 !== e.unorderedArrays;
            var i = this;
            if ((n('array:' + t.length + ':'), !o || t.length <= 1))
              return t.forEach(function (e) {
                return i.dispatch(e);
              });
            var a = [],
              s = t.map(function (t) {
                var n = new u(),
                  o = r.slice();
                return (
                  l(e, n, o).dispatch(t),
                  (a = a.concat(o.slice(r.length))),
                  n.read().toString()
                );
              });
            return ((r = r.concat(a)), s.sort(), this._array(s, !1));
          },
          _date: function (e) {
            return n('date:' + e.toJSON());
          },
          _symbol: function (e) {
            return n('symbol:' + e.toString());
          },
          _error: function (e) {
            return n('error:' + e.toString());
          },
          _boolean: function (e) {
            return n('bool:' + e.toString());
          },
          _string: function (e) {
            (n('string:' + e.length + ':'), n(e.toString()));
          },
          _function: function (t) {
            (n('fn:'),
              c(t) ? this.dispatch('[native]') : this.dispatch(t.toString()),
              !1 !== e.respectFunctionNames &&
                this.dispatch('function-name:' + String(t.name)),
              e.respectFunctionProperties && this._object(t));
          },
          _number: function (e) {
            return n('number:' + e.toString());
          },
          _xml: function (e) {
            return n('xml:' + e.toString());
          },
          _null: function () {
            return n('Null');
          },
          _undefined: function () {
            return n('Undefined');
          },
          _regexp: function (e) {
            return n('regex:' + e.toString());
          },
          _uint8array: function (e) {
            return (
              n('uint8array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _uint8clampedarray: function (e) {
            return (
              n('uint8clampedarray:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _int8array: function (e) {
            return (
              n('uint8array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _uint16array: function (e) {
            return (
              n('uint16array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _int16array: function (e) {
            return (
              n('uint16array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _uint32array: function (e) {
            return (
              n('uint32array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _int32array: function (e) {
            return (
              n('uint32array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _float32array: function (e) {
            return (
              n('float32array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _float64array: function (e) {
            return (
              n('float64array:'),
              this.dispatch(Array.prototype.slice.call(e))
            );
          },
          _arraybuffer: function (e) {
            return (n('arraybuffer:'), this.dispatch(new Uint8Array(e)));
          },
          _url: function (e) {
            return n('url:' + e.toString(), 'utf8');
          },
          _map: function (t) {
            n('map:');
            var r = Array.from(t);
            return this._array(r, !1 !== e.unorderedSets);
          },
          _set: function (t) {
            n('set:');
            var r = Array.from(t);
            return this._array(r, !1 !== e.unorderedSets);
          },
          _file: function (e) {
            return (
              n('file:'),
              this.dispatch([e.name, e.size, e.type, e.lastModfied])
            );
          },
          _blob: function () {
            if (e.ignoreUnknown) return n('[blob]');
            throw Error(
              'Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n'
            );
          },
          _domwindow: function () {
            return n('domwindow');
          },
          _bigint: function (e) {
            return n('bigint:' + e.toString());
          },
          _process: function () {
            return n('process');
          },
          _timer: function () {
            return n('timer');
          },
          _pipe: function () {
            return n('pipe');
          },
          _tcp: function () {
            return n('tcp');
          },
          _udp: function () {
            return n('udp');
          },
          _tty: function () {
            return n('tty');
          },
          _statwatcher: function () {
            return n('statwatcher');
          },
          _securecontext: function () {
            return n('securecontext');
          },
          _connection: function () {
            return n('connection');
          },
          _zlib: function () {
            return n('zlib');
          },
          _context: function () {
            return n('context');
          },
          _nodescript: function () {
            return n('nodescript');
          },
          _httpparser: function () {
            return n('httpparser');
          },
          _dataview: function () {
            return n('dataview');
          },
          _signal: function () {
            return n('signal');
          },
          _fsevent: function () {
            return n('fsevent');
          },
          _tlswrap: function () {
            return n('tlswrap');
          },
        };
      }
      function u() {
        return {
          buf: '',
          write: function (e) {
            this.buf += e;
          },
          end: function (e) {
            this.buf += e;
          },
          read: function () {
            return this.buf;
          },
        };
      }
      t.writeToStream = function (e, t, r) {
        return (
          void 0 === r && ((r = t), (t = {})),
          l((t = s(e, t)), r).dispatch(e)
        );
      };
    },
    78456: (e, t, r) => {
      let n;
      let { strict: o } = r(39491),
        { createHash: i } = r(6113),
        { format: a } = r(73837);
      if (Buffer.isEncoding('base64url')) n = e => e.toString('base64url');
      else {
        let e = e =>
          e.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        n = t => e(t.toString('base64'));
      }
      function s(e, t, r) {
        let o = (function (e, t) {
          switch (e) {
            case 'HS256':
            case 'RS256':
            case 'PS256':
            case 'ES256':
            case 'ES256K':
              return i('sha256');
            case 'HS384':
            case 'RS384':
            case 'PS384':
            case 'ES384':
              return i('sha384');
            case 'HS512':
            case 'RS512':
            case 'PS512':
            case 'ES512':
            case 'Ed25519':
              return i('sha512');
            case 'Ed448':
              return i('shake256', { outputLength: 114 });
            case 'EdDSA':
              switch (t) {
                case 'Ed25519':
                  return i('sha512');
                case 'Ed448':
                  return i('shake256', { outputLength: 114 });
                default:
                  throw TypeError(
                    'unrecognized or invalid EdDSA curve provided'
                  );
              }
            default:
              throw TypeError('unrecognized or invalid JWS algorithm provided');
          }
        })(t, r)
          .update(e)
          .digest();
        return n(o.slice(0, o.length / 2));
      }
      e.exports = {
        validate: function (e, t, r, n, i) {
          let c, l;
          if ('string' != typeof e.claim || !e.claim)
            throw TypeError('names.claim must be a non-empty string');
          if ('string' != typeof e.source || !e.source)
            throw TypeError('names.source must be a non-empty string');
          (o(
            'string' == typeof t && t,
            `${e.claim} must be a non-empty string`
          ),
            o(
              'string' == typeof r && r,
              `${e.source} must be a non-empty string`
            ));
          try {
            c = s(r, n, i);
          } catch (t) {
            l = a('%s could not be validated (%s)', e.claim, t.message);
          }
          ((l = l || a('%s mismatch, expected %s, got: %s', e.claim, c, t)),
            o.equal(c, t, l));
        },
        generate: s,
      };
    },
    36735: (e, t, r) => {
      let n, o;
      let i = ['id_token_hint'],
        a = ['initialAccessToken', 'jwks'];
      function s(e, t) {
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
      function c(e, t, r) {
        ((function (e, t) {
          if (t.has(e))
            throw TypeError(
              'Cannot initialize the same private elements twice on an object'
            );
        })(e, t),
          t.set(e, r));
      }
      function l(e, t) {
        var r = d(e, t, 'get');
        return r.get ? r.get.call(e) : r.value;
      }
      function u(e, t, r) {
        var n = d(e, t, 'set');
        return (
          (function (e, t, r) {
            if (t.set) t.set.call(e, r);
            else {
              if (!t.writable)
                throw TypeError('attempted to set read only private field');
              t.value = r;
            }
          })(e, n, r),
          r
        );
      }
      function d(e, t, r) {
        if (!t.has(e))
          throw TypeError(
            'attempted to ' + r + ' private field on non-instance'
          );
        return t.get(e);
      }
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
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
      let { inspect: h } = r(73837),
        y = r(13685),
        g = r(6113),
        { strict: v } = r(39491),
        m = r(63477),
        b = r(57310),
        { URL: _, URLSearchParams: w } = r(57310),
        O = r(21704),
        S = r(78456),
        E = r(21607),
        k = r(59974),
        P = r(82862),
        j = r(88495),
        A = r(60503),
        { assertSigningAlgValuesSupport: x, assertIssuerConfiguration: T } =
          r(98216),
        C = r(31484),
        W = r(93459),
        J = r(37408),
        I = r(89703),
        { OPError: R, RPError: H } = r(46619),
        M = r(88428),
        { random: K } = r(52020),
        D = r(29184),
        { CLOCK_TOLERANCE: U } = r(57267),
        { keystores: N } = r(15400),
        $ = r(4166),
        L = r(24047),
        {
          authenticatedPost: B,
          resolveResponseType: q,
          resolveRedirectUri: z,
        } = r(17144),
        { queryKeyStore: F } = r(55159),
        G = r(22787),
        [V, X] = process.version
          .slice(1)
          .split('.')
          .map(e => parseInt(e, 10)),
        Y = V >= 17 || (16 === V && X >= 9),
        Z = Symbol(),
        Q = Symbol(),
        ee = Symbol();
      function et(e) {
        return C(
          e,
          'access_token',
          'code',
          'error_description',
          'error_uri',
          'error',
          'expires_in',
          'id_token',
          'iss',
          'response',
          'session_state',
          'state',
          'token_type'
        );
      }
      function er(e, t = 'Bearer') {
        return `${t} ${e}`;
      }
      function en(e) {
        let t = b.parse(e);
        return t.search ? m.parse(t.search.substring(1)) : {};
      }
      function eo(e, t, r) {
        if (void 0 === e[r])
          throw new H({
            message: `missing required JWT property ${r}`,
            jwt: t,
          });
      }
      function ei(e) {
        let t = f(
          {
            client_id: this.client_id,
            scope: 'openid',
            response_type: q.call(this),
            redirect_uri: z.call(this),
          },
          e
        );
        return (
          Object.entries(t).forEach(([e, r]) => {
            null == r
              ? delete t[e]
              : 'claims' === e && 'object' == typeof r
                ? (t[e] = JSON.stringify(r))
                : 'resource' === e && Array.isArray(r)
                  ? (t[e] = r)
                  : 'string' != typeof r && (t[e] = String(r));
          }),
          t
        );
      }
      function ea(e) {
        if (
          !W(e) ||
          !Array.isArray(e.keys) ||
          e.keys.some(e => !W(e) || !('kty' in e))
        )
          throw TypeError('jwks must be a JSON Web Key Set formatted object');
        return $.fromJWKS(e, { onlyPrivate: !0 });
      }
      var es = new WeakMap(),
        ec = new WeakMap(),
        el = new WeakMap(),
        eu = new WeakMap();
      n = h.custom;
      class ed {
        constructor(e, t, r = {}, n, o) {
          if (
            (c(this, es, { writable: !0, value: void 0 }),
            c(this, ec, { writable: !0, value: void 0 }),
            c(this, el, { writable: !0, value: void 0 }),
            c(this, eu, { writable: !0, value: void 0 }),
            u(this, es, new Map()),
            u(this, ec, e),
            u(this, el, t),
            'string' != typeof r.client_id || !r.client_id)
          )
            throw TypeError('client_id is required');
          let i = f(
            f(
              f(
                {
                  grant_types: ['authorization_code'],
                  id_token_signed_response_alg: 'RS256',
                  authorization_signed_response_alg: 'RS256',
                  response_types: ['code'],
                  token_endpoint_auth_method: 'client_secret_basic',
                },
                this.fapi1()
                  ? {
                      grant_types: ['authorization_code', 'implicit'],
                      id_token_signed_response_alg: 'PS256',
                      authorization_signed_response_alg: 'PS256',
                      response_types: ['code id_token'],
                      tls_client_certificate_bound_access_tokens: !0,
                      token_endpoint_auth_method: void 0,
                    }
                  : void 0
              ),
              this.fapi2()
                ? {
                    id_token_signed_response_alg: 'PS256',
                    authorization_signed_response_alg: 'PS256',
                    token_endpoint_auth_method: void 0,
                  }
                : void 0
            ),
            r
          );
          if (this.fapi())
            switch (i.token_endpoint_auth_method) {
              case 'self_signed_tls_client_auth':
              case 'tls_client_auth':
                break;
              case 'private_key_jwt':
                if (!n) throw TypeError('jwks is required');
                break;
              case void 0:
                throw TypeError('token_endpoint_auth_method is required');
              default:
                throw TypeError(
                  'invalid or unsupported token_endpoint_auth_method'
                );
            }
          if (
            this.fapi2() &&
            ((i.tls_client_certificate_bound_access_tokens &&
              i.dpop_bound_access_tokens) ||
              (!i.tls_client_certificate_bound_access_tokens &&
                !i.dpop_bound_access_tokens))
          )
            throw TypeError(
              'either tls_client_certificate_bound_access_tokens or dpop_bound_access_tokens must be set to true'
            );
          if (
            ((function (e, t, r) {
              if (
                (t.token_endpoint_auth_method ||
                  (function (e, t) {
                    try {
                      let r = e.issuer.token_endpoint_auth_methods_supported;
                      !r.includes(t.token_endpoint_auth_method) &&
                        r.includes('client_secret_post') &&
                        (t.token_endpoint_auth_method = 'client_secret_post');
                    } catch (e) {}
                  })(e, r),
                t.redirect_uri)
              ) {
                if (t.redirect_uris)
                  throw TypeError(
                    'provide a redirect_uri or redirect_uris, not both'
                  );
                ((r.redirect_uris = [t.redirect_uri]), delete r.redirect_uri);
              }
              if (t.response_type) {
                if (t.response_types)
                  throw TypeError(
                    'provide a response_type or response_types, not both'
                  );
                ((r.response_types = [t.response_type]),
                  delete r.response_type);
              }
            })(this, r, i),
            x('token', this.issuer, i),
            ['introspection', 'revocation'].forEach(e => {
              ((function (e, t, r) {
                if (!t[`${e}_endpoint`]) return;
                let n = r.token_endpoint_auth_method,
                  o = r.token_endpoint_auth_signing_alg,
                  i = `${e}_endpoint_auth_method`,
                  a = `${e}_endpoint_auth_signing_alg`;
                void 0 === r[i] &&
                  void 0 === r[a] &&
                  (void 0 !== n && (r[i] = n), void 0 !== o && (r[a] = o));
              })(e, this.issuer, i),
                x(e, this.issuer, i));
            }),
            Object.entries(i).forEach(([e, t]) => {
              (l(this, es).set(e, t),
                this[e] ||
                  Object.defineProperty(this, e, {
                    get() {
                      return l(this, es).get(e);
                    },
                    enumerable: !0,
                  }));
            }),
            void 0 !== n)
          ) {
            let e = ea.call(this, n);
            N.set(this, e);
          }
          (null != o &&
            o.additionalAuthorizedParties &&
            u(this, eu, L(o.additionalAuthorizedParties)),
            (this[U] = 0));
        }
        authorizationUrl(e = {}) {
          if (!W(e)) throw TypeError('params must be a plain object');
          T(this.issuer, 'authorization_endpoint');
          let t = new _(this.issuer.authorization_endpoint);
          for (let [r, n] of Object.entries(ei.call(this, e)))
            if (Array.isArray(n))
              for (let e of (t.searchParams.delete(r), n))
                t.searchParams.append(r, e);
            else t.searchParams.set(r, n);
          return t.href.replace(/\+/g, '%20');
        }
        authorizationPost(e = {}) {
          if (!W(e)) throw TypeError('params must be a plain object');
          let t = ei.call(this, e),
            r = Object.keys(t)
              .map(e => `<input type="hidden" name="${e}" value="${t[e]}"/>`)
              .join('\n');
          return `<!DOCTYPE html>
<head>
<title>Requesting Authorization</title>
</head>
<body onload="javascript:document.forms[0].submit()">
<form method="post" action="${this.issuer.authorization_endpoint}">
  ${r}
</form>
</body>
</html>`;
        }
        endSessionUrl(e = {}) {
          let t;
          T(this.issuer, 'end_session_endpoint');
          let { 0: r, length: n } = this.post_logout_redirect_uris || [],
            { post_logout_redirect_uri: o = 1 === n ? r : void 0 } = e;
          var a = e;
          if ((({ id_token_hint: t } = a), (e = s(a, i)), t instanceof I)) {
            if (!t.id_token)
              throw TypeError('id_token not present in TokenSet');
            t = t.id_token;
          }
          let c = b.parse(this.issuer.end_session_endpoint),
            l = j(
              en(this.issuer.end_session_endpoint),
              e,
              { post_logout_redirect_uri: o, client_id: this.client_id },
              { id_token_hint: t }
            );
          return (
            Object.entries(l).forEach(([e, t]) => {
              null == t && delete l[e];
            }),
            (c.search = null),
            (c.query = l),
            b.format(c)
          );
        }
        callbackParams(e) {
          let t = e instanceof y.IncomingMessage || (e && e.method && e.url);
          if ('string' != typeof e && !t)
            throw TypeError(
              '#callbackParams only accepts string urls, http.IncomingMessage or a lookalike'
            );
          if (!t) return et(en(e));
          switch (e.method) {
            case 'GET':
              return et(en(e.url));
            case 'POST':
              if (void 0 === e.body)
                throw TypeError(
                  'incoming message body missing, include a body parser prior to this method call'
                );
              switch (typeof e.body) {
                case 'object':
                case 'string':
                  if (Buffer.isBuffer(e.body))
                    return et(m.parse(e.body.toString('utf-8')));
                  if ('string' == typeof e.body) return et(m.parse(e.body));
                  return et(e.body);
                default:
                  throw TypeError('invalid IncomingMessage body object');
              }
            default:
              throw TypeError('invalid IncomingMessage method');
          }
        }
        async callback(
          e,
          t,
          r = {},
          { exchangeBody: n, clientAssertionPayload: o, DPoP: i } = {}
        ) {
          let a = et(t);
          if (!r.jarm || 'response' in t) {
            if ('response' in t) {
              let e = await this.decryptJARM(a.response);
              a = await this.validateJARM(e);
            }
          } else
            throw new H({
              message: 'expected a JARM response',
              checks: r,
              params: a,
            });
          if (
            (this.default_max_age &&
              !r.max_age &&
              (r.max_age = this.default_max_age),
            a.state && !r.state)
          )
            throw TypeError('checks.state argument is missing');
          if (!a.state && r.state)
            throw new H({
              message: 'state missing from the response',
              checks: r,
              params: a,
            });
          if (r.state !== a.state)
            throw new H({
              printf: [
                'state mismatch, expected %s, got: %s',
                r.state,
                a.state,
              ],
              checks: r,
              params: a,
            });
          if ('iss' in a) {
            if ((T(this.issuer, 'issuer'), a.iss !== this.issuer.issuer))
              throw new H({
                printf: [
                  'iss mismatch, expected %s, got: %s',
                  this.issuer.issuer,
                  a.iss,
                ],
                params: a,
              });
          } else if (
            this.issuer.authorization_response_iss_parameter_supported &&
            !('id_token' in a) &&
            !('response' in t)
          )
            throw new H({
              message: 'iss missing from the response',
              params: a,
            });
          if (a.error) throw new R(a);
          let s = {
            code: ['code'],
            id_token: ['id_token'],
            token: ['access_token', 'token_type'],
          };
          if (r.response_type) {
            for (let e of r.response_type.split(' '))
              if ('none' === e) {
                if (a.code || a.id_token || a.access_token)
                  throw new H({
                    message:
                      'unexpected params encountered for "none" response',
                    checks: r,
                    params: a,
                  });
              } else
                for (let t of s[e])
                  if (!a[t])
                    throw new H({
                      message: `${t} missing from response`,
                      checks: r,
                      params: a,
                    });
          }
          if (a.id_token) {
            let e = new I(a);
            if (
              (await this.decryptIdToken(e),
              await this.validateIdToken(
                e,
                r.nonce,
                'authorization',
                r.max_age,
                r.state
              ),
              !a.code)
            )
              return e;
          }
          if (a.code) {
            let t = await this.grant(
              f(
                f({}, n),
                {},
                {
                  grant_type: 'authorization_code',
                  code: a.code,
                  redirect_uri: e,
                  code_verifier: r.code_verifier,
                }
              ),
              { clientAssertionPayload: o, DPoP: i }
            );
            return (
              await this.decryptIdToken(t),
              await this.validateIdToken(t, r.nonce, 'token', r.max_age),
              a.session_state && (t.session_state = a.session_state),
              t
            );
          }
          return new I(a);
        }
        async oauthCallback(
          e,
          t,
          r = {},
          { exchangeBody: n, clientAssertionPayload: o, DPoP: i } = {}
        ) {
          let a = et(t);
          if (!r.jarm || 'response' in t) {
            if ('response' in t) {
              let e = await this.decryptJARM(a.response);
              a = await this.validateJARM(e);
            }
          } else
            throw new H({
              message: 'expected a JARM response',
              checks: r,
              params: a,
            });
          if (a.state && !r.state)
            throw TypeError('checks.state argument is missing');
          if (!a.state && r.state)
            throw new H({
              message: 'state missing from the response',
              checks: r,
              params: a,
            });
          if (r.state !== a.state)
            throw new H({
              printf: [
                'state mismatch, expected %s, got: %s',
                r.state,
                a.state,
              ],
              checks: r,
              params: a,
            });
          if ('iss' in a) {
            if ((T(this.issuer, 'issuer'), a.iss !== this.issuer.issuer))
              throw new H({
                printf: [
                  'iss mismatch, expected %s, got: %s',
                  this.issuer.issuer,
                  a.iss,
                ],
                params: a,
              });
          } else if (
            this.issuer.authorization_response_iss_parameter_supported &&
            !('id_token' in a) &&
            !('response' in t)
          )
            throw new H({
              message: 'iss missing from the response',
              params: a,
            });
          if (a.error) throw new R(a);
          if ('string' == typeof a.id_token && a.id_token.length)
            throw new H({
              message:
                'id_token detected in the response, you must use client.callback() instead of client.oauthCallback()',
              params: a,
            });
          delete a.id_token;
          let s = { code: ['code'], token: ['access_token', 'token_type'] };
          if (r.response_type)
            for (let e of r.response_type.split(' ')) {
              if ('none' === e && (a.code || a.id_token || a.access_token))
                throw new H({
                  message: 'unexpected params encountered for "none" response',
                  checks: r,
                  params: a,
                });
              if (s[e]) {
                for (let t of s[e])
                  if (!a[t])
                    throw new H({
                      message: `${t} missing from response`,
                      checks: r,
                      params: a,
                    });
              }
            }
          if (a.code) {
            let t = await this.grant(
              f(
                f({}, n),
                {},
                {
                  grant_type: 'authorization_code',
                  code: a.code,
                  redirect_uri: e,
                  code_verifier: r.code_verifier,
                }
              ),
              { clientAssertionPayload: o, DPoP: i }
            );
            if ('string' == typeof t.id_token && t.id_token.length)
              throw new H({
                message:
                  'id_token detected in the response, you must use client.callback() instead of client.oauthCallback()',
                params: a,
              });
            return (delete t.id_token, t);
          }
          return new I(a);
        }
        async decryptIdToken(e) {
          if (!this.id_token_encrypted_response_alg) return e;
          let t = e;
          if (t instanceof I) {
            if (!t.id_token)
              throw TypeError('id_token not present in TokenSet');
            t = t.id_token;
          }
          let r = this.id_token_encrypted_response_alg,
            n = this.id_token_encrypted_response_enc,
            o = await this.decryptJWE(t, r, n);
          return e instanceof I ? ((e.id_token = o), e) : o;
        }
        async validateJWTUserinfo(e) {
          let t = this.userinfo_signed_response_alg;
          return this.validateJWT(e, t, []);
        }
        async decryptJARM(e) {
          if (!this.authorization_encrypted_response_alg) return e;
          let t = this.authorization_encrypted_response_alg,
            r = this.authorization_encrypted_response_enc;
          return this.decryptJWE(e, t, r);
        }
        async decryptJWTUserinfo(e) {
          if (!this.userinfo_encrypted_response_alg) return e;
          let t = this.userinfo_encrypted_response_alg,
            r = this.userinfo_encrypted_response_enc;
          return this.decryptJWE(e, t, r);
        }
        async decryptJWE(e, t, r = 'A128CBC-HS256') {
          let n;
          let o = JSON.parse(P.decode(e.split('.')[0]));
          if (o.alg !== t)
            throw new H({
              printf: [
                'unexpected JWE alg received, expected %s, got: %s',
                t,
                o.alg,
              ],
              jwt: e,
            });
          if (o.enc !== r)
            throw new H({
              printf: [
                'unexpected JWE enc received, expected %s, got: %s',
                r,
                o.enc,
              ],
              jwt: e,
            });
          let i = e => new TextDecoder().decode(e.plaintext);
          if (t.match(/^(?:RSA|ECDH)/)) {
            let t = await N.get(this),
              r = O.decodeProtectedHeader(e);
            for (let o of t.all(f(f({}, r), {}, { use: 'enc' })))
              if (
                (n = await O.compactDecrypt(e, await o.keyObject(r.alg)).then(
                  i,
                  () => {}
                ))
              )
                break;
          } else
            n = await O.compactDecrypt(
              e,
              this.secretForAlg('dir' === t ? r : t)
            ).then(i, () => {});
          if (!n) throw new H({ message: 'failed to decrypt JWE', jwt: e });
          return n;
        }
        async validateIdToken(e, t, r, n, o) {
          let i = e,
            a = this.id_token_signed_response_alg;
          if (i instanceof I) {
            if (!i.id_token)
              throw TypeError('id_token not present in TokenSet');
            i = i.id_token;
          }
          i = String(i);
          let s = M(),
            { protected: c, payload: l, key: u } = await this.validateJWT(i, a);
          if ('number' == typeof n || (n !== ee && this.require_auth_time)) {
            if (!l.auth_time)
              throw new H({
                message: 'missing required JWT property auth_time',
                jwt: i,
              });
            if ('number' != typeof l.auth_time)
              throw new H({
                message: 'JWT auth_time claim must be a JSON numeric value',
                jwt: i,
              });
          }
          if ('number' == typeof n && l.auth_time + n < s - this[U])
            throw new H({
              printf: [
                'too much time has elapsed since the last End-User authentication, max_age %i, auth_time: %i, now %i',
                n,
                l.auth_time,
                s - this[U],
              ],
              now: s,
              tolerance: this[U],
              auth_time: l.auth_time,
              jwt: i,
            });
          if (t !== Q && (l.nonce || void 0 !== t) && l.nonce !== t)
            throw new H({
              printf: ['nonce mismatch, expected %s, got: %s', t, l.nonce],
              jwt: i,
            });
          if ('authorization' === r) {
            if (!l.at_hash && e.access_token)
              throw new H({
                message: 'missing required property at_hash',
                jwt: i,
              });
            if (!l.c_hash && e.code)
              throw new H({
                message: 'missing required property c_hash',
                jwt: i,
              });
            if (this.fapi1() && !l.s_hash && (e.state || o))
              throw new H({
                message: 'missing required property s_hash',
                jwt: i,
              });
            if (l.s_hash) {
              if (!o)
                throw TypeError(
                  'cannot verify s_hash, "checks.state" property not provided'
                );
              try {
                S.validate(
                  { claim: 's_hash', source: 'state' },
                  l.s_hash,
                  o,
                  c.alg,
                  u.jwk && u.jwk.crv
                );
              } catch (e) {
                throw new H({ message: e.message, jwt: i });
              }
            }
          }
          if (this.fapi() && l.iat < s - 3600)
            throw new H({
              printf: [
                'JWT issued too far in the past, now %i, iat %i',
                s,
                l.iat,
              ],
              now: s,
              tolerance: this[U],
              iat: l.iat,
              jwt: i,
            });
          if (e.access_token && void 0 !== l.at_hash)
            try {
              S.validate(
                { claim: 'at_hash', source: 'access_token' },
                l.at_hash,
                e.access_token,
                c.alg,
                u.jwk && u.jwk.crv
              );
            } catch (e) {
              throw new H({ message: e.message, jwt: i });
            }
          if (e.code && void 0 !== l.c_hash)
            try {
              S.validate(
                { claim: 'c_hash', source: 'code' },
                l.c_hash,
                e.code,
                c.alg,
                u.jwk && u.jwk.crv
              );
            } catch (e) {
              throw new H({ message: e.message, jwt: i });
            }
          return e;
        }
        async validateJWT(e, t, r = ['iss', 'sub', 'aud', 'exp', 'iat']) {
          let n, o, i;
          let a = 'https://self-issued.me' === this.issuer.issuer,
            s = M();
          try {
            ({ header: n, payload: o } = k(e, { complete: !0 }));
          } catch (t) {
            throw new H({
              printf: ['failed to decode JWT (%s: %s)', t.name, t.message],
              jwt: e,
            });
          }
          if (n.alg !== t)
            throw new H({
              printf: [
                'unexpected JWT alg received, expected %s, got: %s',
                t,
                n.alg,
              ],
              jwt: e,
            });
          if (
            (a && (r = [...r, 'sub_jwk']),
            r.forEach(eo.bind(void 0, o, e)),
            void 0 !== o.iss)
          ) {
            let t = this.issuer.issuer;
            if (
              (l(this, el) &&
                (t = this.issuer.issuer.replace('{tenantid}', o.tid)),
              o.iss !== t)
            )
              throw new H({
                printf: [
                  'unexpected iss value, expected %s, got: %s',
                  t,
                  o.iss,
                ],
                jwt: e,
              });
          }
          if (void 0 !== o.iat && 'number' != typeof o.iat)
            throw new H({
              message: 'JWT iat claim must be a JSON numeric value',
              jwt: e,
            });
          if (void 0 !== o.nbf) {
            if ('number' != typeof o.nbf)
              throw new H({
                message: 'JWT nbf claim must be a JSON numeric value',
                jwt: e,
              });
            if (o.nbf > s + this[U])
              throw new H({
                printf: [
                  'JWT not active yet, now %i, nbf %i',
                  s + this[U],
                  o.nbf,
                ],
                now: s,
                tolerance: this[U],
                nbf: o.nbf,
                jwt: e,
              });
          }
          if (void 0 !== o.exp) {
            if ('number' != typeof o.exp)
              throw new H({
                message: 'JWT exp claim must be a JSON numeric value',
                jwt: e,
              });
            if (s - this[U] >= o.exp)
              throw new H({
                printf: ['JWT expired, now %i, exp %i', s - this[U], o.exp],
                now: s,
                tolerance: this[U],
                exp: o.exp,
                jwt: e,
              });
          }
          if (void 0 !== o.aud) {
            if (Array.isArray(o.aud)) {
              if (o.aud.length > 1 && !o.azp)
                throw new H({
                  message: 'missing required JWT property azp',
                  jwt: e,
                });
              if (!o.aud.includes(this.client_id))
                throw new H({
                  printf: [
                    'aud is missing the client_id, expected %s to be included in %j',
                    this.client_id,
                    o.aud,
                  ],
                  jwt: e,
                });
            } else if (o.aud !== this.client_id)
              throw new H({
                printf: [
                  'aud mismatch, expected %s, got: %s',
                  this.client_id,
                  o.aud,
                ],
                jwt: e,
              });
          }
          if (void 0 !== o.azp) {
            let t = l(this, eu);
            if (
              !(t =
                'string' == typeof t
                  ? [this.client_id, t]
                  : Array.isArray(t)
                    ? [this.client_id, ...t]
                    : [this.client_id]).includes(o.azp)
            )
              throw new H({ printf: ['azp mismatch, got: %s', o.azp], jwt: e });
          }
          if (a) {
            try {
              v(W(o.sub_jwk));
              let e = await O.importJWK(o.sub_jwk, n.alg);
              (v.equal(e.type, 'public'), (i = [{ keyObject: () => e }]));
            } catch (t) {
              throw new H({
                message:
                  'failed to use sub_jwk claim as an asymmetric JSON Web Key',
                jwt: e,
              });
            }
            if ((await O.calculateJwkThumbprint(o.sub_jwk)) !== o.sub)
              throw new H({
                message: 'failed to match the subject with sub_jwk',
                jwt: e,
              });
          } else
            n.alg.startsWith('HS')
              ? (i = [this.secretForAlg(n.alg)])
              : 'none' !== n.alg &&
                (i = await F.call(
                  this.issuer,
                  f(f({}, n), {}, { use: 'sig' })
                ));
          if (!i && 'none' === n.alg) return { protected: n, payload: o };
          for (let t of i) {
            let r = await O.compactVerify(
              e,
              t instanceof Uint8Array ? t : await t.keyObject(n.alg)
            ).catch(() => {});
            if (r) return { payload: o, protected: r.protectedHeader, key: t };
          }
          throw new H({ message: 'failed to validate JWT signature', jwt: e });
        }
        async refresh(
          e,
          { exchangeBody: t, clientAssertionPayload: r, DPoP: n } = {}
        ) {
          let o = e;
          if (o instanceof I) {
            if (!o.refresh_token)
              throw TypeError('refresh_token not present in TokenSet');
            o = o.refresh_token;
          }
          let i = await this.grant(
            f(
              f({}, t),
              {},
              { grant_type: 'refresh_token', refresh_token: String(o) }
            ),
            { clientAssertionPayload: r, DPoP: n }
          );
          if (
            i.id_token &&
            (await this.decryptIdToken(i),
            await this.validateIdToken(i, Q, 'token', ee),
            e instanceof I && e.id_token)
          ) {
            let t = e.claims().sub,
              r = i.claims().sub;
            if (r !== t)
              throw new H({
                printf: ['sub mismatch, expected %s, got: %s', t, r],
                jwt: i.id_token,
              });
          }
          return i;
        }
        async requestResource(
          e,
          t,
          {
            method: r,
            headers: n,
            body: o,
            DPoP: i,
            tokenType: a = i
              ? 'DPoP'
              : t instanceof I
                ? t.token_type
                : 'Bearer',
          } = {},
          s
        ) {
          if (t instanceof I) {
            if (!t.access_token)
              throw TypeError('access_token not present in TokenSet');
            t = t.access_token;
          }
          if (t) {
            if ('string' != typeof t)
              throw TypeError('invalid access token provided');
          } else throw TypeError('no access token provided');
          let c = { headers: f({ Authorization: er(t, a) }, n), body: o },
            l = !!this.tls_client_certificate_bound_access_tokens,
            u = await D.call(
              this,
              f(f({}, c), {}, { responseType: 'buffer', method: r, url: e }),
              { accessToken: t, mTLS: l, DPoP: i }
            ),
            d = u.headers['www-authenticate'];
          return s !== Z &&
            d &&
            d.toLowerCase().startsWith('dpop ') &&
            'use_dpop_nonce' === A(d).error
            ? this.requestResource(e, t, {
                method: r,
                headers: n,
                body: o,
                DPoP: i,
                tokenType: a,
              })
            : u;
        }
        async userinfo(
          e,
          {
            method: t = 'GET',
            via: r = 'header',
            tokenType: n,
            params: o,
            DPoP: i,
          } = {}
        ) {
          let a;
          T(this.issuer, 'userinfo_endpoint');
          let s = { tokenType: n, method: String(t).toUpperCase(), DPoP: i };
          if ('GET' !== s.method && 'POST' !== s.method)
            throw TypeError('#userinfo() method can only be POST or a GET');
          if ('body' === r && 'POST' !== s.method)
            throw TypeError('can only send body on POST');
          let c = !!(
            this.userinfo_signed_response_alg ||
            this.userinfo_encrypted_response_alg
          );
          (c
            ? (s.headers = { Accept: 'application/jwt' })
            : (s.headers = { Accept: 'application/json' }),
            this.tls_client_certificate_bound_access_tokens &&
              this.issuer.mtls_endpoint_aliases &&
              (a = this.issuer.mtls_endpoint_aliases.userinfo_endpoint),
            (a = new _(a || this.issuer.userinfo_endpoint)),
            'body' === r &&
              ((s.headers.Authorization = void 0),
              (s.headers['Content-Type'] = 'application/x-www-form-urlencoded'),
              (s.body = new w()),
              s.body.append(
                'access_token',
                e instanceof I ? e.access_token : e
              )),
            o &&
              ('GET' === s.method
                ? Object.entries(o).forEach(([e, t]) => {
                    a.searchParams.append(e, t);
                  })
                : s.body
                  ? Object.entries(o).forEach(([e, t]) => {
                      s.body.append(e, t);
                    })
                  : ((s.body = new w()),
                    (s.headers['Content-Type'] =
                      'application/x-www-form-urlencoded'),
                    Object.entries(o).forEach(([e, t]) => {
                      s.body.append(e, t);
                    }))),
            s.body && (s.body = s.body.toString()));
          let l = await this.requestResource(a, e, s),
            u = J(l, { bearer: !0 });
          if (c) {
            if (!/^application\/jwt/.test(l.headers['content-type']))
              throw new H({
                message:
                  'expected application/jwt response from the userinfo_endpoint',
                response: l,
              });
            let e = l.body.toString(),
              t = await this.decryptJWTUserinfo(e);
            if (this.userinfo_signed_response_alg)
              ({ payload: u } = await this.validateJWTUserinfo(t));
            else
              try {
                ((u = JSON.parse(t)), v(W(u)));
              } catch (e) {
                throw new H({
                  message: 'failed to parse userinfo JWE payload as JSON',
                  jwt: t,
                });
              }
          } else
            try {
              u = JSON.parse(l.body);
            } catch (e) {
              throw (Object.defineProperty(e, 'response', { value: l }), e);
            }
          if (e instanceof I && e.id_token) {
            let t = e.claims().sub;
            if (u.sub !== t)
              throw new H({
                printf: [
                  'userinfo sub mismatch, expected %s, got: %s',
                  t,
                  u.sub,
                ],
                body: u,
                jwt: e.id_token,
              });
          }
          return u;
        }
        encryptionSecret(e) {
          let t =
            e <= 256 ? 'sha256' : e <= 384 ? 'sha384' : e <= 512 && 'sha512';
          if (!t)
            throw Error('unsupported symmetric encryption key derivation');
          return g
            .createHash(t)
            .update(this.client_secret)
            .digest()
            .slice(0, e / 8);
        }
        secretForAlg(e) {
          if (!this.client_secret) throw TypeError('client_secret is required');
          return /^A(\d{3})(?:GCM)?KW$/.test(e)
            ? this.encryptionSecret(parseInt(RegExp.$1, 10))
            : /^A(\d{3})(?:GCM|CBC-HS(\d{3}))$/.test(e)
              ? this.encryptionSecret(parseInt(RegExp.$2 || RegExp.$1, 10))
              : new TextEncoder().encode(this.client_secret);
        }
        async grant(e, { clientAssertionPayload: t, DPoP: r } = {}, n) {
          let o;
          T(this.issuer, 'token_endpoint');
          let i = await B.call(
            this,
            'token',
            { form: e, responseType: 'json' },
            { clientAssertionPayload: t, DPoP: r }
          );
          try {
            o = J(i);
          } catch (o) {
            if (n !== Z && o instanceof R && 'use_dpop_nonce' === o.error)
              return this.grant(e, { clientAssertionPayload: t, DPoP: r }, Z);
            throw o;
          }
          return new I(o);
        }
        async deviceAuthorization(
          e = {},
          { exchangeBody: t, clientAssertionPayload: r, DPoP: n } = {}
        ) {
          (T(this.issuer, 'device_authorization_endpoint'),
            T(this.issuer, 'token_endpoint'));
          let o = ei.call(
              this,
              f(
                {
                  client_id: this.client_id,
                  redirect_uri: null,
                  response_type: null,
                },
                e
              )
            ),
            i = J(
              await B.call(
                this,
                'device_authorization',
                { responseType: 'json', form: o },
                { clientAssertionPayload: r, endpointAuthMethod: 'token' }
              )
            );
          return new G({
            client: this,
            exchangeBody: t,
            clientAssertionPayload: r,
            response: i,
            maxAge: e.max_age,
            DPoP: n,
          });
        }
        async revoke(e, t, { revokeBody: r, clientAssertionPayload: n } = {}) {
          if (
            (T(this.issuer, 'revocation_endpoint'),
            void 0 !== t && 'string' != typeof t)
          )
            throw TypeError('hint must be a string');
          let o = f(f({}, r), {}, { token: e });
          (t && (o.token_type_hint = t),
            J(
              await B.call(
                this,
                'revocation',
                { form: o },
                { clientAssertionPayload: n }
              ),
              { body: !1 }
            ));
        }
        async introspect(
          e,
          t,
          { introspectBody: r, clientAssertionPayload: n } = {}
        ) {
          if (
            (T(this.issuer, 'introspection_endpoint'),
            void 0 !== t && 'string' != typeof t)
          )
            throw TypeError('hint must be a string');
          let o = f(f({}, r), {}, { token: e });
          return (
            t && (o.token_type_hint = t),
            J(
              await B.call(
                this,
                'introspection',
                { form: o, responseType: 'json' },
                { clientAssertionPayload: n }
              )
            )
          );
        }
        static async register(e, t = {}) {
          let { initialAccessToken: r, jwks: n } = t,
            o = s(t, a);
          if (
            (T(this.issuer, 'registration_endpoint'),
            void 0 !== n && !(e.jwks || e.jwks_uri))
          ) {
            let t = await ea.call(this, n);
            e.jwks = t.toJWKS();
          }
          return new this(
            J(
              await D.call(this, {
                headers: f(
                  { Accept: 'application/json' },
                  r ? { Authorization: er(r) } : void 0
                ),
                responseType: 'json',
                json: e,
                url: this.issuer.registration_endpoint,
                method: 'POST',
              }),
              { statusCode: 201, bearer: !0 }
            ),
            n,
            o
          );
        }
        get metadata() {
          return L(Object.fromEntries(l(this, es).entries()));
        }
        static async fromUri(e, t, r, n) {
          return new this(
            J(
              await D.call(this, {
                method: 'GET',
                url: e,
                responseType: 'json',
                headers: { Authorization: er(t), Accept: 'application/json' },
              }),
              { bearer: !0 }
            ),
            r,
            n
          );
        }
        async requestObject(
          e = {},
          {
            sign: t = this.request_object_signing_alg || 'none',
            encrypt: {
              alg: r = this.request_object_encryption_alg,
              enc: n = this.request_object_encryption_enc || 'A128CBC-HS256',
            } = {},
          } = {}
        ) {
          let o, i;
          if (!W(e)) throw TypeError('requestObject must be a plain object');
          let a = M(),
            s = { alg: t, typ: 'oauth-authz-req+jwt' },
            c = JSON.stringify(
              j(
                {},
                e,
                f(
                  {
                    iss: this.client_id,
                    aud: this.issuer.issuer,
                    client_id: this.client_id,
                    jti: K(),
                    iat: a,
                    exp: a + 300,
                  },
                  this.fapi() ? { nbf: a } : void 0
                )
              )
            );
          if ('none' === t)
            o = [P.encode(JSON.stringify(s)), P.encode(c), ''].join('.');
          else {
            let e = t.startsWith('HS');
            if (e) i = this.secretForAlg(t);
            else {
              let e = await N.get(this);
              if (!e)
                throw TypeError(
                  `no keystore present for client, cannot sign using alg ${t}`
                );
              if (!(i = e.get({ alg: t, use: 'sig' })))
                throw TypeError(`no key to sign with found for alg ${t}`);
            }
            o = await new O.CompactSign(new TextEncoder().encode(c))
              .setProtectedHeader(
                f(f({}, s), {}, { kid: e ? void 0 : i.jwk.kid })
              )
              .sign(e ? i : await i.keyObject(t));
          }
          if (!r) return o;
          let l = { alg: r, enc: n, cty: 'oauth-authz-req+jwt' };
          return (
            l.alg.match(/^(RSA|ECDH)/)
              ? ([i] = await F.call(
                  this.issuer,
                  { alg: l.alg, use: 'enc' },
                  { allowMulti: !0 }
                ))
              : (i = this.secretForAlg('dir' === l.alg ? l.enc : l.alg)),
            new O.CompactEncrypt(new TextEncoder().encode(o))
              .setProtectedHeader(
                f(
                  f({}, l),
                  {},
                  { kid: i instanceof Uint8Array ? void 0 : i.jwk.kid }
                )
              )
              .encrypt(i instanceof Uint8Array ? i : await i.keyObject(l.alg))
          );
        }
        async pushedAuthorizationRequest(
          e = {},
          { clientAssertionPayload: t } = {}
        ) {
          T(this.issuer, 'pushed_authorization_request_endpoint');
          let r = f(
              f({}, 'request' in e ? e : ei.call(this, e)),
              {},
              { client_id: this.client_id }
            ),
            n = await B.call(
              this,
              'pushed_authorization_request',
              { responseType: 'json', form: r },
              { clientAssertionPayload: t, endpointAuthMethod: 'token' }
            ),
            o = J(n, { statusCode: 201 });
          if (!('expires_in' in o))
            throw new H({
              message:
                'expected expires_in in Pushed Authorization Successful Response',
              response: n,
            });
          if ('number' != typeof o.expires_in)
            throw new H({
              message:
                'invalid expires_in value in Pushed Authorization Successful Response',
              response: n,
            });
          if (!('request_uri' in o))
            throw new H({
              message:
                'expected request_uri in Pushed Authorization Successful Response',
              response: n,
            });
          if ('string' != typeof o.request_uri)
            throw new H({
              message:
                'invalid request_uri value in Pushed Authorization Successful Response',
              response: n,
            });
          return o;
        }
        get issuer() {
          return l(this, ec);
        }
        [n]() {
          return `${this.constructor.name} ${h(this.metadata, { depth: 1 / 0, colors: process.stdout.isTTY, compact: !1, sorted: !0 })}`;
        }
        fapi() {
          return this.fapi1() || this.fapi2();
        }
        fapi1() {
          return 'FAPI1Client' === this.constructor.name;
        }
        fapi2() {
          return 'FAPI2Client' === this.constructor.name;
        }
        async validateJARM(e) {
          let t = this.authorization_signed_response_alg,
            { payload: r } = await this.validateJWT(e, t, [
              'iss',
              'exp',
              'aud',
            ]);
          return et(r);
        }
        async dpopProof(e, t, r) {
          let n;
          if (!W(e)) throw TypeError('payload must be a plain object');
          if (E(t)) n = t;
          else if ('CryptoKey' === t[Symbol.toStringTag]) n = t;
          else if ('node:crypto' === O.cryptoRuntime) n = g.createPrivateKey(t);
          else throw TypeError('unrecognized crypto runtime');
          if ('private' !== n.type)
            throw TypeError('"DPoP" option must be a private key');
          let i = o.call(this, n, t);
          if (!i) throw TypeError('could not determine DPoP JWS Algorithm');
          return new O.SignJWT(
            f(
              {
                ath: r
                  ? P.encode(g.createHash('sha256').update(r).digest())
                  : void 0,
              },
              e
            )
          )
            .setProtectedHeader({
              alg: i,
              typ: 'dpop+jwt',
              jwk: await eh(n, t),
            })
            .setIssuedAt()
            .setJti(K())
            .sign(n);
        }
      }
      function ep(e) {
        switch (e.algorithm.name) {
          case 'Ed25519':
          case 'Ed448':
            return 'EdDSA';
          case 'ECDSA':
            switch (e.algorithm.namedCurve) {
              case 'P-256':
                return 'ES256';
              case 'P-384':
                return 'ES384';
              case 'P-521':
                return 'ES512';
            }
            break;
          case 'RSASSA-PKCS1-v1_5':
            return `RS${e.algorithm.hash.name.slice(4)}`;
          case 'RSA-PSS':
            return `PS${e.algorithm.hash.name.slice(4)}`;
          default:
            throw TypeError('unsupported DPoP private key');
        }
      }
      if ('node:crypto' === O.cryptoRuntime) {
        o = function (o, a) {
          if ('CryptoKey' === a[Symbol.toStringTag]) return ep(o);
          switch (o.asymmetricKeyType) {
            case 'ed25519':
            case 'ed448':
              return 'EdDSA';
            case 'ec':
              return (function (e, o) {
                switch (
                  'object' == typeof o &&
                  'object' == typeof o.key &&
                  o.key.crv
                ) {
                  case 'P-256':
                    return 'ES256';
                  case 'secp256k1':
                    return 'ES256K';
                  case 'P-384':
                    return 'ES384';
                  case 'P-512':
                    return 'ES512';
                }
                let a = e.export({ format: 'der', type: 'pkcs8' }),
                  s = a[1] < 128 ? 17 : 18,
                  c = a[s],
                  l = a.slice(s + 1, s + 1 + c);
                if (l.equals(t)) return 'ES256';
                if (l.equals(r)) return 'ES384';
                if (l.equals(n)) return 'ES512';
                if (l.equals(i)) return 'ES256K';
                throw TypeError('unsupported DPoP private key curve');
              })(o, a);
            case 'rsa':
            case Y && 'rsa-pss':
              return (function (t, r, n) {
                if (
                  'object' == typeof r &&
                  'jwk' === r.format &&
                  r.key &&
                  r.key.alg
                )
                  return r.key.alg;
                if (Array.isArray(n)) {
                  let r = n.filter(RegExp.prototype.test.bind(e));
                  return (
                    'rsa-pss' === t.asymmetricKeyType &&
                      (r = r.filter(e => e.startsWith('PS'))),
                    ['PS256', 'PS384', 'PS512', 'RS256', 'RS384', 'RS384'].find(
                      e => r.includes(e)
                    )
                  );
                }
                return 'PS256';
              })(o, a, this.issuer.dpop_signing_alg_values_supported);
            default:
              throw TypeError('unsupported DPoP private key');
          }
        };
        let e = /^(?:RS|PS)(?:256|384|512)$/,
          t = Buffer.from([42, 134, 72, 206, 61, 3, 1, 7]),
          r = Buffer.from([43, 129, 4, 0, 34]),
          n = Buffer.from([43, 129, 4, 0, 35]),
          i = Buffer.from([43, 129, 4, 0, 10]);
      } else o = ep;
      let ef = new WeakMap();
      async function eh(e, t) {
        if (
          'node:crypto' === O.cryptoRuntime &&
          'object' == typeof t &&
          'object' == typeof t.key &&
          'jwk' === t.format
        )
          return C(t.key, 'kty', 'crv', 'x', 'y', 'e', 'n');
        if (ef.has(t)) return ef.get(t);
        let r = C(await O.exportJWK(e), 'kty', 'crv', 'x', 'y', 'e', 'n');
        return (
          (E(t) || 'WebCryptoAPI' === O.cryptoRuntime) && ef.set(t, r),
          r
        );
      }
      ((e.exports = (e, t = !1) =>
        class extends ed {
          constructor(...r) {
            super(e, t, ...r);
          }
          static get issuer() {
            return e;
          }
        }),
        (e.exports.BaseClient = ed));
    },
    22787: (e, t, r) => {
      let n;
      function o(e, t) {
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
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? o(Object(r), !0).forEach(function (t) {
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
              : o(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      function a(e, t, r) {
        ((function (e, t) {
          if (t.has(e))
            throw TypeError(
              'Cannot initialize the same private elements twice on an object'
            );
        })(e, t),
          t.set(e, r));
      }
      function s(e, t) {
        var r = l(e, t, 'get');
        return r.get ? r.get.call(e) : r.value;
      }
      function c(e, t, r) {
        var n = l(e, t, 'set');
        return (
          (function (e, t, r) {
            if (t.set) t.set.call(e, r);
            else {
              if (!t.writable)
                throw TypeError('attempted to set read only private field');
              t.value = r;
            }
          })(e, n, r),
          r
        );
      }
      function l(e, t, r) {
        if (!t.has(e))
          throw TypeError(
            'attempted to ' + r + ' private field on non-instance'
          );
        return t.get(e);
      }
      let { inspect: u } = r(73837),
        { RPError: d, OPError: p } = r(46619),
        f = r(88428);
      var h = new WeakMap(),
        y = new WeakMap(),
        g = new WeakMap(),
        v = new WeakMap(),
        m = new WeakMap(),
        b = new WeakMap(),
        _ = new WeakMap(),
        w = new WeakMap(),
        O = new WeakMap();
      n = u.custom;
      class S {
        constructor({
          client: e,
          exchangeBody: t,
          clientAssertionPayload: r,
          response: n,
          maxAge: o,
          DPoP: i,
        }) {
          if (
            (a(this, h, { writable: !0, value: void 0 }),
            a(this, y, { writable: !0, value: void 0 }),
            a(this, g, { writable: !0, value: void 0 }),
            a(this, v, { writable: !0, value: void 0 }),
            a(this, m, { writable: !0, value: void 0 }),
            a(this, b, { writable: !0, value: void 0 }),
            a(this, _, { writable: !0, value: void 0 }),
            a(this, w, { writable: !0, value: void 0 }),
            a(this, O, { writable: !0, value: void 0 }),
            ['verification_uri', 'user_code', 'device_code'].forEach(e => {
              if ('string' != typeof n[e] || !n[e])
                throw new d(
                  `expected ${e} string to be returned by Device Authorization Response, got %j`,
                  n[e]
                );
            }),
            !Number.isSafeInteger(n.expires_in))
          )
            throw new d(
              'expected expires_in number to be returned by Device Authorization Response, got %j',
              n.expires_in
            );
          (c(this, b, f() + n.expires_in),
            c(this, y, e),
            c(this, v, i),
            c(this, w, o),
            c(this, m, t),
            c(this, g, r),
            c(this, O, n),
            c(this, _, 1e3 * n.interval || 5e3));
        }
        abort() {
          c(this, h, !0);
        }
        async poll({ signal: e } = {}) {
          let t;
          if ((e && e.aborted) || s(this, h)) throw new d('polling aborted');
          if (this.expired())
            throw new d(
              'the device code %j has expired and the device authorization session has concluded',
              this.device_code
            );
          await new Promise(e => setTimeout(e, s(this, _)));
          try {
            t = await s(this, y).grant(
              i(
                i({}, s(this, m)),
                {},
                {
                  grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                  device_code: this.device_code,
                }
              ),
              { clientAssertionPayload: s(this, g), DPoP: s(this, v) }
            );
          } catch (t) {
            switch (t instanceof p && t.error) {
              case 'slow_down':
                c(this, _, s(this, _) + 5e3);
              case 'authorization_pending':
                return this.poll({ signal: e });
              default:
                throw t;
            }
          }
          return (
            'id_token' in t &&
              (await s(this, y).decryptIdToken(t),
              await s(this, y).validateIdToken(t, void 0, 'token', s(this, w))),
            t
          );
        }
        get device_code() {
          return s(this, O).device_code;
        }
        get user_code() {
          return s(this, O).user_code;
        }
        get verification_uri() {
          return s(this, O).verification_uri;
        }
        get verification_uri_complete() {
          return s(this, O).verification_uri_complete;
        }
        get expires_in() {
          return Math.max.apply(null, [s(this, b) - f(), 0]);
        }
        expired() {
          return 0 === this.expires_in;
        }
        [n]() {
          return `${this.constructor.name} ${u(s(this, O), { depth: 1 / 0, colors: process.stdout.isTTY, compact: !1, sorted: !0 })}`;
        }
      }
      e.exports = S;
    },
    46619: (e, t, r) => {
      let n = ['message', 'printf', 'response'],
        { format: o } = r(73837);
      class i extends Error {
        constructor(
          {
            error_description: e,
            error: t,
            error_uri: r,
            session_state: n,
            state: o,
            scope: i,
          },
          a
        ) {
          (super(e ? `${t} (${e})` : t),
            Object.assign(
              this,
              { error: t },
              e && { error_description: e },
              r && { error_uri: r },
              o && { state: o },
              i && { scope: i },
              n && { session_state: n }
            ),
            a && Object.defineProperty(this, 'response', { value: a }),
            (this.name = this.constructor.name),
            Error.captureStackTrace(this, this.constructor));
        }
      }
      class a extends Error {
        constructor(...e) {
          if ('string' == typeof e[0]) super(o(...e));
          else {
            let t = e[0],
              { message: r, printf: i, response: a } = t,
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
              })(t, n);
            (i ? super(o(...i)) : super(r),
              Object.assign(this, s),
              a && Object.defineProperty(this, 'response', { value: a }));
          }
          ((this.name = this.constructor.name),
            Error.captureStackTrace(this, this.constructor));
        }
      }
      e.exports = { OPError: i, RPError: a };
    },
    98216: e => {
      e.exports = {
        assertSigningAlgValuesSupport: function (e, t, r) {
          if (!t[`${e}_endpoint`]) return;
          let n = `${e}_endpoint_auth_method`,
            o = `${e}_endpoint_auth_signing_alg`,
            i = `${e}_endpoint_auth_signing_alg_values_supported`;
          if (r[n] && r[n].endsWith('_jwt') && !r[o] && !t[i])
            throw TypeError(
              `${i} must be configured on the issuer if ${o} is not defined on a client`
            );
        },
        assertIssuerConfiguration: function (e, t) {
          if (!e[t]) throw TypeError(`${t} must be configured on the issuer`);
        },
      };
    },
    82862: e => {
      let t;
      if (Buffer.isEncoding('base64url'))
        t = (e, t = 'utf8') => Buffer.from(e, t).toString('base64url');
      else {
        let e = e =>
          e.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        t = (t, r = 'utf8') => e(Buffer.from(t, r).toString('base64'));
      }
      ((e.exports.decode = e => Buffer.from(e, 'base64')),
        (e.exports.encode = t));
    },
    17144: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      let i = r(21704),
        { RPError: a } = r(46619),
        { assertIssuerConfiguration: s } = r(98216),
        { random: c } = r(52020),
        l = r(88428),
        u = r(29184),
        { keystores: d } = r(15400),
        p = r(78470),
        f = e => encodeURIComponent(e).replace(/%20/g, '+');
      async function h(e, t) {
        let r = this[`${e}_endpoint_auth_signing_alg`];
        if (
          (r ||
            s(this.issuer, `${e}_endpoint_auth_signing_alg_values_supported`),
          'client_secret_jwt' === this[`${e}_endpoint_auth_method`])
        ) {
          if (!r) {
            let t =
              this.issuer[`${e}_endpoint_auth_signing_alg_values_supported`];
            r = Array.isArray(t) && t.find(e => /^HS(?:256|384|512)/.test(e));
          }
          if (!r)
            throw new a(
              `failed to determine a JWS Algorithm to use for ${this[`${e}_endpoint_auth_method`]} Client Assertion`
            );
          return new i.CompactSign(Buffer.from(JSON.stringify(t)))
            .setProtectedHeader({ alg: r })
            .sign(this.secretForAlg(r));
        }
        let n = await d.get(this);
        if (!n)
          throw TypeError(
            'no client jwks provided for signing a client assertion with'
          );
        if (!r) {
          let t =
            this.issuer[`${e}_endpoint_auth_signing_alg_values_supported`];
          r = Array.isArray(t) && t.find(e => n.get({ alg: e, use: 'sig' }));
        }
        if (!r)
          throw new a(
            `failed to determine a JWS Algorithm to use for ${this[`${e}_endpoint_auth_method`]} Client Assertion`
          );
        let o = n.get({ alg: r, use: 'sig' });
        if (!o)
          throw new a(
            `no key found in client jwks to sign a client assertion with using alg ${r}`
          );
        return new i.CompactSign(Buffer.from(JSON.stringify(t)))
          .setProtectedHeader({ alg: r, kid: o.jwk && o.jwk.kid })
          .sign(await o.keyObject(r));
      }
      async function y(e, { clientAssertionPayload: t } = {}) {
        switch (this[`${e}_endpoint_auth_method`]) {
          case 'self_signed_tls_client_auth':
          case 'tls_client_auth':
          case 'none':
            return { form: { client_id: this.client_id } };
          case 'client_secret_post':
            if ('string' != typeof this.client_secret)
              throw TypeError(
                'client_secret_post client authentication method requires a client_secret'
              );
            return {
              form: {
                client_id: this.client_id,
                client_secret: this.client_secret,
              },
            };
          case 'private_key_jwt':
          case 'client_secret_jwt': {
            let r = l(),
              n = await h.call(
                this,
                e,
                o(
                  {
                    iat: r,
                    exp: r + 60,
                    jti: c(),
                    iss: this.client_id,
                    sub: this.client_id,
                    aud: this.issuer.issuer,
                  },
                  t
                )
              );
            return {
              form: {
                client_id: this.client_id,
                client_assertion: n,
                client_assertion_type:
                  'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
              },
            };
          }
          case 'client_secret_basic': {
            if ('string' != typeof this.client_secret)
              throw TypeError(
                'client_secret_basic client authentication method requires a client_secret'
              );
            let e = `${f(this.client_id)}:${f(this.client_secret)}`,
              t = Buffer.from(e).toString('base64');
            return { headers: { Authorization: `Basic ${t}` } };
          }
          default:
            throw TypeError(
              `missing, or unsupported, ${e}_endpoint_auth_method`
            );
        }
      }
      async function g(
        e,
        t,
        { clientAssertionPayload: r, endpointAuthMethod: n = e, DPoP: i } = {}
      ) {
        let a;
        let s = p(t, await y.call(this, n, { clientAssertionPayload: r })),
          c =
            this[`${n}_endpoint_auth_method`].includes('tls_client_auth') ||
            ('token' === e && this.tls_client_certificate_bound_access_tokens);
        if (
          (c &&
            this.issuer.mtls_endpoint_aliases &&
            (a = this.issuer.mtls_endpoint_aliases[`${e}_endpoint`]),
          (a = a || this.issuer[`${e}_endpoint`]),
          'form' in s)
        )
          for (let [e, t] of Object.entries(s.form))
            void 0 === t && delete s.form[e];
        return u.call(
          this,
          o(
            o({}, s),
            {},
            {
              method: 'POST',
              url: a,
              headers: o(
                o(
                  {},
                  'revocation' !== e ? { Accept: 'application/json' } : void 0
                ),
                s.headers
              ),
            }
          ),
          { mTLS: c, DPoP: i }
        );
      }
      e.exports = {
        resolveResponseType: function () {
          let { length: e, 0: t } = this.response_types;
          if (1 === e) return t;
        },
        resolveRedirectUri: function () {
          let { length: e, 0: t } = this.redirect_uris || [];
          if (1 === e) return t;
        },
        authFor: y,
        authenticatedPost: g,
      };
    },
    57267: e => {
      let t = Symbol(),
        r = Symbol();
      e.exports = { CLOCK_TOLERANCE: r, HTTP_OPTIONS: t };
    },
    59974: (e, t, r) => {
      let n = r(82862);
      e.exports = e => {
        if ('string' != typeof e || !e) throw TypeError('JWT must be a string');
        let { 0: t, 1: r, 2: o, length: i } = e.split('.');
        if (5 === i) throw TypeError('encrypted JWTs cannot be decoded');
        if (3 !== i) throw Error('JWTs must have three components');
        try {
          return {
            header: JSON.parse(n.decode(t)),
            payload: JSON.parse(n.decode(r)),
            signature: o,
          };
        } catch (e) {
          throw Error('JWT is malformed');
        }
      };
    },
    24047: e => {
      e.exports =
        globalThis.structuredClone || (e => JSON.parse(JSON.stringify(e)));
    },
    88495: (e, t, r) => {
      let n = r(93459);
      function o(e, t, ...r) {
        for (let i of r)
          if (n(i))
            for (let [r, a] of Object.entries(i))
              '__proto__' !== r &&
                'constructor' !== r &&
                (void 0 === t[r] && void 0 !== a && (t[r] = a),
                e && n(t[r]) && n(a) && o(!0, t[r], a));
        return t;
      }
      ((e.exports = o.bind(void 0, !1)), (e.exports.deep = o.bind(void 0, !0)));
    },
    52020: (e, t, r) => {
      let { createHash: n, randomBytes: o } = r(6113),
        i = r(82862),
        a = (e = 32) => i.encode(o(e));
      e.exports = {
        random: a,
        state: a,
        nonce: a,
        codeVerifier: a,
        codeChallenge: e => i.encode(n('sha256').update(e).digest()),
      };
    },
    21607: (e, t, r) => {
      let n = r(73837),
        o = r(6113);
      e.exports = n.types.isKeyObject || (e => e && e instanceof o.KeyObject);
    },
    93459: e => {
      e.exports = e => !!e && e.constructor === Object;
    },
    55159: (e, t, r) => {
      let n = r(73362),
        o = r(80903),
        { RPError: i } = r(46619),
        { assertIssuerConfiguration: a } = r(98216),
        s = r(4166),
        { keystores: c } = r(15400),
        l = r(37408),
        u = r(29184),
        d = new WeakMap(),
        p = new WeakMap(),
        f = e => (p.has(e) || p.set(e, new o({ max: 100 })), p.get(e));
      async function h(e = !1) {
        a(this, 'jwks_uri');
        let t = c.get(this),
          r = f(this);
        return e || !t
          ? (d.has(this) ||
              (r.reset(),
              d.set(
                this,
                (async () => {
                  let e = l(
                      await u
                        .call(this, {
                          method: 'GET',
                          responseType: 'json',
                          url: this.jwks_uri,
                          headers: {
                            Accept:
                              'application/json, application/jwk-set+json',
                          },
                        })
                        .finally(() => {
                          d.delete(this);
                        })
                    ),
                    t = s.fromJWKS(e, { onlyPublic: !0 });
                  return (r.set('throttle', !0, 6e4), c.set(this, t), t);
                })()
              )),
            d.get(this))
          : t;
      }
      async function y(
        { kid: e, kty: t, alg: r, use: o },
        { allowMulti: a = !1 } = {}
      ) {
        let s = f(this),
          c = { kid: e, kty: t, alg: r, use: o },
          l = n(c, {
            algorithm: 'sha256',
            ignoreUnknown: !0,
            unorderedArrays: !0,
            unorderedSets: !0,
            respectType: !1,
          }),
          u = s.get(l) || s.get('throttle'),
          d = await h.call(this, !u),
          p = d.all(c);
        if ((delete c.use, 0 === p.length))
          throw new i({
            printf: [
              "no valid key found in issuer's jwks_uri for key parameters %j",
              c,
            ],
            jwks: d,
          });
        if (!a && p.length > 1 && !e)
          throw new i({
            printf: [
              "multiple matching keys found in issuer's jwks_uri for key parameters %j, kid must be provided in this case",
              c,
            ],
            jwks: d,
          });
        return (s.set(l, !0), p);
      }
      ((e.exports.queryKeyStore = y), (e.exports.keystore = h));
    },
    4166: (e, t, r) => {
      var n;
      let o;
      let i = ['d', 'p', 'q', 'dp', 'dq', 'qi'];
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
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
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
      function c(e, t) {
        var r = l(e, t, 'get');
        return r.get ? r.get.call(e) : r.value;
      }
      function l(e, t, r) {
        if (!t.has(e))
          throw TypeError(
            'attempted to ' + r + ' private field on non-instance'
          );
        return t.get(e);
      }
      let u = r(21704),
        d = r(24047),
        p = r(93459),
        f = Symbol(),
        h = (e, { alg: t, use: r }) => {
          let n = 0;
          return (t && e.alg && n++, r && e.use && n++, n);
        };
      e.exports =
        ((n = new WeakMap()),
        (o = Symbol.iterator),
        class {
          constructor(e, t) {
            if (
              ((function (e, t, r) {
                ((function (e, t) {
                  if (t.has(e))
                    throw TypeError(
                      'Cannot initialize the same private elements twice on an object'
                    );
                })(e, t),
                  t.set(e, r));
              })(this, n, { writable: !0, value: void 0 }),
              e !== f)
            )
              throw Error('invalid constructor call');
            (function (e, t, r) {
              var n = l(e, t, 'set');
              (function (e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                  if (!t.writable)
                    throw TypeError('attempted to set read only private field');
                  t.value = r;
                }
              })(e, n, r);
            })(this, n, t);
          }
          toJWKS() {
            return {
              keys: this.map(e => {
                let {
                  jwk: { d: t, p: r, q: n, dp: o, dq: a, qi: s },
                } = e;
                return (function (e, t) {
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
                })(e.jwk, i);
              }),
            };
          }
          all({ alg: e, kid: t, use: r } = {}) {
            if (!r || !e) throw Error();
            let n = (function (e) {
                switch ('string' == typeof e && e.slice(0, 2)) {
                  case 'RS':
                  case 'PS':
                    return 'RSA';
                  case 'ES':
                    return 'EC';
                  case 'Ed':
                    return 'OKP';
                  default:
                    return;
                }
              })(e),
              o = { alg: e, use: r };
            return this.filter(o => {
              let i = !0;
              return (
                void 0 !== n && o.jwk.kty !== n && (i = !1),
                i && void 0 !== t && o.jwk.kid !== t && (i = !1),
                i &&
                  void 0 !== r &&
                  void 0 !== o.jwk.use &&
                  o.jwk.use !== r &&
                  (i = !1),
                i && o.jwk.alg && o.jwk.alg !== e
                  ? (i = !1)
                  : o.algorithms.has(e) || (i = !1),
                i
              );
            }).sort((e, t) => h(t, o) - h(e, o));
          }
          get(...e) {
            return this.all(...e)[0];
          }
          static async fromJWKS(
            e,
            { onlyPublic: t = !1, onlyPrivate: r = !1 } = {}
          ) {
            if (
              !p(e) ||
              !Array.isArray(e.keys) ||
              e.keys.some(e => !p(e) || !('kty' in e))
            )
              throw TypeError(
                'jwks must be a JSON Web Key Set formatted object'
              );
            let n = [];
            for (let o of e.keys) {
              let { kty: e, kid: i, crv: a } = (o = d(o)),
                { alg: c, use: l } = o;
              if (
                'string' == typeof e &&
                e &&
                (void 0 === l || 'sig' === l || 'enc' === l) &&
                ('string' == typeof c || void 0 === c) &&
                ('string' == typeof i || void 0 === i)
              ) {
                if ('EC' === e && 'sig' === l)
                  switch (a) {
                    case 'P-256':
                      c = 'ES256';
                      break;
                    case 'P-384':
                      c = 'ES384';
                      break;
                    case 'P-521':
                      c = 'ES512';
                  }
                if (
                  ('secp256k1' === a && ((l = 'sig'), (c = 'ES256K')),
                  'OKP' === e)
                )
                  switch (a) {
                    case 'Ed25519':
                    case 'Ed448':
                      ((l = 'sig'), (c = 'EdDSA'));
                      break;
                    case 'X25519':
                    case 'X448':
                      l = 'enc';
                  }
                if (c && !l)
                  switch (!0) {
                    case c.startsWith('ECDH'):
                    case c.startsWith('RSA'):
                      l = 'enc';
                  }
                if (r && ('oct' === o.kty || !o.d))
                  throw Error('jwks must only contain private keys');
                (t && (o.d || o.k)) ||
                  n.push({
                    jwk: s(s({}, o), {}, { alg: c, use: l }),
                    async keyObject(e) {
                      if (this[e]) return this[e];
                      let t = await u.importJWK(this.jwk, e);
                      return ((this[e] = t), t);
                    },
                    get algorithms() {
                      return (
                        Object.defineProperty(this, 'algorithms', {
                          value: (function (e, t, r, n) {
                            if (t) return new Set([t]);
                            switch (r) {
                              case 'EC': {
                                let t = [];
                                if (
                                  (('enc' === e || void 0 === e) &&
                                    (t = t.concat([
                                      'ECDH-ES',
                                      'ECDH-ES+A128KW',
                                      'ECDH-ES+A192KW',
                                      'ECDH-ES+A256KW',
                                    ])),
                                  'sig' === e || void 0 === e)
                                )
                                  switch (n) {
                                    case 'P-256':
                                    case 'P-384':
                                      t = t.concat([`ES${n.slice(-3)}`]);
                                      break;
                                    case 'P-521':
                                      t = t.concat(['ES512']);
                                      break;
                                    case 'secp256k1':
                                      'node:crypto' === u.cryptoRuntime &&
                                        (t = t.concat(['ES256K']));
                                  }
                                return new Set(t);
                              }
                              case 'OKP':
                                return new Set([
                                  'ECDH-ES',
                                  'ECDH-ES+A128KW',
                                  'ECDH-ES+A192KW',
                                  'ECDH-ES+A256KW',
                                ]);
                              case 'RSA': {
                                let t = [];
                                return (
                                  ('enc' === e || void 0 === e) &&
                                    ((t = t.concat([
                                      'RSA-OAEP',
                                      'RSA-OAEP-256',
                                      'RSA-OAEP-384',
                                      'RSA-OAEP-512',
                                    ])),
                                    'node:crypto' === u.cryptoRuntime &&
                                      (t = t.concat(['RSA1_5']))),
                                  ('sig' === e || void 0 === e) &&
                                    (t = t.concat([
                                      'PS256',
                                      'PS384',
                                      'PS512',
                                      'RS256',
                                      'RS384',
                                      'RS512',
                                    ])),
                                  new Set(t)
                                );
                              }
                              default:
                                throw Error('unreachable');
                            }
                          })(
                            this.jwk.use,
                            this.jwk.alg,
                            this.jwk.kty,
                            this.jwk.crv
                          ),
                          enumerable: !0,
                          configurable: !1,
                        }),
                        this.algorithms
                      );
                    },
                  });
              }
            }
            return new this(f, n);
          }
          filter(...e) {
            return c(this, n).filter(...e);
          }
          find(...e) {
            return c(this, n).find(...e);
          }
          every(...e) {
            return c(this, n).every(...e);
          }
          some(...e) {
            return c(this, n).some(...e);
          }
          map(...e) {
            return c(this, n).map(...e);
          }
          forEach(...e) {
            return c(this, n).forEach(...e);
          }
          reduce(...e) {
            return c(this, n).reduce(...e);
          }
          sort(...e) {
            return c(this, n).sort(...e);
          }
          *[o]() {
            for (let e of c(this, n)) yield e;
          }
        });
    },
    78470: (e, t, r) => {
      let n = r(93459);
      e.exports = function e(t, ...r) {
        for (let o of r)
          if (n(o))
            for (let [r, i] of Object.entries(o))
              '__proto__' !== r &&
                'constructor' !== r &&
                (n(t[r]) && n(i)
                  ? (t[r] = e(t[r], i))
                  : void 0 !== i && (t[r] = i));
        return t;
      };
    },
    31484: e => {
      e.exports = function (e, ...t) {
        let r = {};
        for (let n of t) void 0 !== e[n] && (r[n] = e[n]);
        return r;
      };
    },
    37408: (e, t, r) => {
      let { STATUS_CODES: n } = r(13685),
        { format: o } = r(73837),
        { OPError: i } = r(46619),
        a = r(60503),
        s = e => {
          let t = a(e.headers['www-authenticate']);
          if (t.error) throw new i(t, e);
        },
        c = e => {
          let t = !1;
          try {
            let r;
            ((r =
              'object' != typeof e.body || Buffer.isBuffer(e.body)
                ? JSON.parse(e.body)
                : e.body),
              (t = 'string' == typeof r.error && r.error.length) &&
                Object.defineProperty(e, 'body', {
                  value: r,
                  configurable: !0,
                }));
          } catch (e) {}
          return t;
        };
      e.exports = function (
        e,
        { statusCode: t = 200, body: r = !0, bearer: a = !1 } = {}
      ) {
        if (e.statusCode !== t) {
          if ((a && s(e), c(e))) throw new i(e.body, e);
          throw new i(
            {
              error: o(
                'expected %i %s, got: %i %s',
                t,
                n[t],
                e.statusCode,
                n[e.statusCode]
              ),
            },
            e
          );
        }
        if (r && !e.body)
          throw new i(
            {
              error: o(
                'expected %i %s with body but no body was returned',
                t,
                n[t]
              ),
            },
            e
          );
        return e.body;
      };
    },
    29184: (e, t, r) => {
      let n;
      let o = ['form', 'responseType', 'json', 'body'],
        i = r(39491),
        a = r(63477),
        s = r(13685),
        c = r(95687),
        { once: l } = r(82361),
        { URL: u } = r(57310),
        d = r(80903),
        p = r(92923),
        { RPError: f } = r(46619),
        h = r(31484),
        { deep: y } = r(88495),
        { HTTP_OPTIONS: g } = r(57267),
        v = /^[\x21\x23-\x5B\x5D-\x7E]+$/,
        m = [
          'agent',
          'ca',
          'cert',
          'crl',
          'headers',
          'key',
          'lookup',
          'passphrase',
          'pfx',
          'timeout',
        ],
        b = (e, t) => {
          n = y({}, e.length ? h(t, ...e) : t, n);
        };
      function _(e, t, r) {
        (r && (e.removeHeader('content-type'), e.setHeader('content-type', r)),
          t &&
            (e.removeHeader('content-length'),
            e.setHeader('content-length', Buffer.byteLength(t)),
            e.write(t)),
          e.end());
      }
      b([], {
        headers: {
          'User-Agent': `${p.name}/${p.version} (${p.homepage})`,
          'Accept-Encoding': 'identity',
        },
        timeout: 3500,
      });
      let w = new d({ max: 100 });
      ((e.exports = async function (
        e,
        { accessToken: t, mTLS: r = !1, DPoP: d } = {}
      ) {
        let p, b, O, S, E, k, P;
        try {
          ((p = new u(e.url)), delete e.url, i(/^(https?:)$/.test(p.protocol)));
        } catch (e) {
          throw TypeError('only valid absolute URLs can be requested');
        }
        let j = this[g],
          A = e,
          x = `${p.origin}${p.pathname}`;
        if (
          (d &&
            'dpopProof' in this &&
            ((A.headers = A.headers || {}),
            (A.headers.DPoP = await this.dpopProof(
              {
                htu: `${p.origin}${p.pathname}`,
                htm: e.method || 'GET',
                nonce: w.get(x),
              },
              d,
              t
            ))),
          j && (b = h(j.call(this, p, y({}, A, n)), ...m)),
          (A = y({}, b, A, n)),
          r && !A.pfx && !(A.key && A.cert))
        )
          throw TypeError('mutual-TLS certificate and key not set');
        if (A.searchParams)
          for (let [e, t] of Object.entries(A.searchParams))
            (p.searchParams.delete(e), p.searchParams.set(e, t));
        var T = A;
        for (let [e, t] of (({
          form: S,
          responseType: O,
          json: E,
          body: k,
        } = T),
        Object.entries(
          (A = (function (e, t) {
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
          })(T, o)).headers || {}
        )))
          void 0 === t && delete A.headers[e];
        let C = ('https:' === p.protocol ? c.request : s.request)(p.href, A);
        return (async () => {
          if (
            (E
              ? _(C, JSON.stringify(E), 'application/json')
              : S
                ? _(C, a.stringify(S), 'application/x-www-form-urlencoded')
                : k
                  ? _(C, k)
                  : _(C),
            ([P] = await Promise.race([l(C, 'response'), l(C, 'timeout')])),
            !P)
          )
            throw (
              C.destroy(),
              new f(`outgoing request timed out after ${A.timeout}ms`)
            );
          let e = [];
          for await (let t of P) e.push(t);
          if (e.length)
            switch (O) {
              case 'json':
                Object.defineProperty(P, 'body', {
                  get() {
                    let t = Buffer.concat(e);
                    try {
                      t = JSON.parse(t);
                    } catch (e) {
                      throw (
                        Object.defineProperty(e, 'response', { value: P }),
                        e
                      );
                    } finally {
                      Object.defineProperty(P, 'body', {
                        value: t,
                        configurable: !0,
                      });
                    }
                    return t;
                  },
                  configurable: !0,
                });
                break;
              case void 0:
              case 'buffer':
                Object.defineProperty(P, 'body', {
                  get() {
                    let t = Buffer.concat(e);
                    return (
                      Object.defineProperty(P, 'body', {
                        value: t,
                        configurable: !0,
                      }),
                      t
                    );
                  },
                  configurable: !0,
                });
                break;
              default:
                throw TypeError('unsupported responseType request option');
            }
          return P;
        })()
          .catch(e => {
            throw (P && Object.defineProperty(e, 'response', { value: P }), e);
          })
          .finally(() => {
            let e = P && P.headers['dpop-nonce'];
            e && v.test(e) && w.set(x, e);
          });
      }),
        (e.exports.setDefaults = b.bind(void 0, m)));
    },
    88428: e => {
      e.exports = () => Math.floor(Date.now() / 1e3);
    },
    15400: e => {
      e.exports.keystores = new WeakMap();
    },
    16464: e => {
      let t = /^\d+$/;
      e.exports = function (e) {
        if ('string' != typeof e) throw TypeError('input must be a string');
        return (
          !(function (e) {
            if (e.includes('://')) return !0;
            let r = e.replace(/(\/|\?)/g, '#').split('#')[0];
            if (r.includes(':')) {
              let e = r.indexOf(':'),
                n = r.slice(e + 1);
              if (!t.test(n)) return !0;
            }
            return !1;
          })(e)
            ? !(function (e) {
                if (!e.includes('@')) return !1;
                let t = e.split('@'),
                  r = t[t.length - 1];
                return !(r.includes(':') || r.includes('/') || r.includes('?'));
              })(e)
              ? `https://${e}`
              : `acct:${e}`
            : e
        ).split('#')[0];
      };
    },
    60503: e => {
      let t = /(\w+)=("[^"]*")/g;
      e.exports = e => {
        let r = {};
        try {
          for (; null !== t.exec(e); )
            RegExp.$1 && RegExp.$2 && (r[RegExp.$1] = RegExp.$2.slice(1, -1));
        } catch (e) {}
        return r;
      };
    },
    67222: (e, t, r) => {
      let n = r(59539),
        { OPError: o, RPError: i } = r(46619),
        a = r(20723),
        s = r(89703),
        { CLOCK_TOLERANCE: c, HTTP_OPTIONS: l } = r(57267),
        u = r(52020),
        { setDefaults: d } = r(29184);
      e.exports = {
        Issuer: n,
        Strategy: a,
        TokenSet: s,
        errors: { OPError: o, RPError: i },
        custom: {
          setHttpOptionsDefaults: d,
          http_options: l,
          clock_tolerance: c,
        },
        generators: u,
      };
    },
    59539: (e, t, r) => {
      let n;
      function o(e, t) {
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
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? o(Object(r), !0).forEach(function (t) {
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
              : o(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      function a(e, t) {
        var r = s(e, t, 'get');
        return r.get ? r.get.call(e) : r.value;
      }
      function s(e, t, r) {
        if (!t.has(e))
          throw TypeError(
            'attempted to ' + r + ' private field on non-instance'
          );
        return t.get(e);
      }
      let { inspect: c } = r(73837),
        l = r(57310),
        { RPError: u } = r(46619),
        d = r(36735),
        p = r(71803),
        f = r(37408),
        h = r(16464),
        y = r(29184),
        g = r(24047),
        { keystore: v } = r(55159),
        m = [
          'https://login.microsoftonline.com/common/.well-known/openid-configuration',
          'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
          'https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration',
          'https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration',
        ],
        b = Symbol(),
        _ = {
          claim_types_supported: ['normal'],
          claims_parameter_supported: !1,
          grant_types_supported: ['authorization_code', 'implicit'],
          request_parameter_supported: !1,
          request_uri_parameter_supported: !0,
          require_request_uri_registration: !1,
          response_modes_supported: ['query', 'fragment'],
          token_endpoint_auth_methods_supported: ['client_secret_basic'],
        };
      var w = new WeakMap();
      n = c.custom;
      class O {
        constructor(e = {}) {
          !(function (e, t, r) {
            ((function (e, t) {
              if (t.has(e))
                throw TypeError(
                  'Cannot initialize the same private elements twice on an object'
                );
            })(e, t),
              t.set(e, r));
          })(this, w, { writable: !0, value: void 0 });
          let t = e[b];
          (delete e[b],
            ['introspection', 'revocation'].forEach(t => {
              e[`${t}_endpoint`] &&
                void 0 === e[`${t}_endpoint_auth_methods_supported`] &&
                void 0 ===
                  e[`${t}_endpoint_auth_signing_alg_values_supported`] &&
                (e.token_endpoint_auth_methods_supported &&
                  (e[`${t}_endpoint_auth_methods_supported`] =
                    e.token_endpoint_auth_methods_supported),
                e.token_endpoint_auth_signing_alg_values_supported &&
                  (e[`${t}_endpoint_auth_signing_alg_values_supported`] =
                    e.token_endpoint_auth_signing_alg_values_supported));
            }),
            (function (e, t, r) {
              var n = s(e, t, 'set');
              (function (e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                  if (!t.writable)
                    throw TypeError('attempted to set read only private field');
                  t.value = r;
                }
              })(e, n, r);
            })(this, w, new Map()),
            Object.entries(e).forEach(([e, t]) => {
              (a(this, w).set(e, t),
                this[e] ||
                  Object.defineProperty(this, e, {
                    get() {
                      return a(this, w).get(e);
                    },
                    enumerable: !0,
                  }));
            }),
            p.set(this.issuer, this));
          let r = d(this, t);
          Object.defineProperties(this, {
            Client: { value: r, enumerable: !0 },
            FAPI1Client: { value: class extends r {}, enumerable: !0 },
            FAPI2Client: { value: class extends r {}, enumerable: !0 },
          });
        }
        get metadata() {
          return g(Object.fromEntries(a(this, w).entries()));
        }
        static async webfinger(e) {
          let t = h(e),
            { host: r } = l.parse(t),
            n = `https://${r}/.well-known/webfinger`,
            o = f(
              await y.call(this, {
                method: 'GET',
                url: n,
                responseType: 'json',
                searchParams: {
                  resource: t,
                  rel: 'http://openid.net/specs/connect/1.0/issuer',
                },
                headers: { Accept: 'application/json' },
              })
            ),
            i =
              Array.isArray(o.links) &&
              o.links.find(
                e =>
                  'object' == typeof e &&
                  'http://openid.net/specs/connect/1.0/issuer' === e.rel &&
                  e.href
              );
          if (!i)
            throw new u({
              message: 'no issuer found in webfinger response',
              body: o,
            });
          if ('string' != typeof i.href || !i.href.startsWith('https://'))
            throw new u({
              printf: ['invalid issuer location %s', i.href],
              body: o,
            });
          let a = i.href;
          if (p.has(a)) return p.get(a);
          let s = await this.discover(a);
          if (s.issuer !== a)
            throw (
              p.del(s.issuer),
              new u(
                'discovered issuer mismatch, expected %s, got: %s',
                a,
                s.issuer
              )
            );
          return s;
        }
        static async discover(e) {
          let t = (function (e) {
              let t = l.parse(e);
              if (t.pathname.includes('/.well-known/')) return e;
              {
                let e;
                return (
                  (e = t.pathname.endsWith('/')
                    ? `${t.pathname}.well-known/openid-configuration`
                    : `${t.pathname}/.well-known/openid-configuration`),
                  l.format(i(i({}, t), {}, { pathname: e }))
                );
              }
            })(e),
            r = f(
              await y.call(this, {
                method: 'GET',
                responseType: 'json',
                url: t,
                headers: { Accept: 'application/json' },
              })
            );
          return new O(
            i(i(i({}, _), r), {}, { [b]: !!m.find(e => t.startsWith(e)) })
          );
        }
        async reloadJwksUri() {
          await v.call(this, !0);
        }
        [n]() {
          return `${this.constructor.name} ${c(this.metadata, { depth: 1 / 0, colors: process.stdout.isTTY, compact: !1, sorted: !0 })}`;
        }
      }
      e.exports = O;
    },
    71803: (e, t, r) => {
      let n = r(80903);
      e.exports = new n({ max: 100 });
    },
    20723: (e, t, r) => {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? n(Object(r), !0).forEach(function (t) {
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
              : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(r, t)
                  );
                });
        }
        return e;
      }
      let i = r(57310),
        { format: a } = r(73837),
        s = r(24047),
        { RPError: c, OPError: l } = r(46619),
        { BaseClient: u } = r(36735),
        { random: d, codeChallenge: p } = r(52020),
        f = r(31484),
        { resolveResponseType: h, resolveRedirectUri: y } = r(17144);
      function g(e, t, r = {}) {
        e ? this.error(e) : t ? this.success(t, r) : this.fail(r);
      }
      function v(
        {
          client: e,
          params: t = {},
          passReqToCallback: r = !1,
          sessionKey: n,
          usePKCE: o = !0,
          extras: a = {},
        } = {},
        c
      ) {
        if (!(e instanceof u))
          throw TypeError('client must be an instance of openid-client Client');
        if ('function' != typeof c)
          throw TypeError('verify callback must be a function');
        if (!e.issuer || !e.issuer.issuer)
          throw TypeError('client must have an issuer with an identifier');
        if (
          ((this._client = e),
          (this._issuer = e.issuer),
          (this._verify = c),
          (this._passReqToCallback = r),
          (this._usePKCE = o),
          (this._key = n || `oidc:${i.parse(this._issuer.issuer).hostname}`),
          (this._params = s(t)),
          delete this._params.state,
          delete this._params.nonce,
          (this._extras = s(a)),
          this._params.response_type ||
            (this._params.response_type = h.call(e)),
          this._params.redirect_uri || (this._params.redirect_uri = y.call(e)),
          this._params.scope || (this._params.scope = 'openid'),
          !0 === this._usePKCE)
        ) {
          let e =
            !!Array.isArray(this._issuer.code_challenge_methods_supported) &&
            this._issuer.code_challenge_methods_supported;
          if (e && e.includes('S256')) this._usePKCE = 'S256';
          else if (e && e.includes('plain')) this._usePKCE = 'plain';
          else if (e)
            throw TypeError(
              'neither code_challenge_method supported by the client is supported by the issuer'
            );
          else this._usePKCE = 'S256';
        } else if (
          'string' == typeof this._usePKCE &&
          !['plain', 'S256'].includes(this._usePKCE)
        )
          throw TypeError(
            `${this._usePKCE} is not valid/implemented PKCE code_challenge_method`
          );
        this.name = i.parse(e.issuer.issuer).hostname;
      }
      ((v.prototype.authenticate = function (e, t) {
        (async () => {
          let r = this._client;
          if (!e.session)
            throw TypeError('authentication requires session support');
          let n = r.callbackParams(e),
            i = this._key,
            { 0: s, length: l } = Object.keys(n);
          if (0 === l || (1 === l && 'iss' === s)) {
            let n = o(o({ state: d() }, this._params), t);
            if (
              (!n.nonce &&
                n.response_type.includes('id_token') &&
                (n.nonce = d()),
              (e.session[i] = f(
                n,
                'nonce',
                'state',
                'max_age',
                'response_type'
              )),
              this._usePKCE && n.response_type.includes('code'))
            ) {
              let t = d();
              switch (((e.session[i].code_verifier = t), this._usePKCE)) {
                case 'S256':
                  ((n.code_challenge = p(t)),
                    (n.code_challenge_method = 'S256'));
                  break;
                case 'plain':
                  n.code_challenge = t;
              }
            }
            this.redirect(r.authorizationUrl(n));
            return;
          }
          let u = e.session[i];
          if (0 === Object.keys(u || {}).length)
            throw Error(
              a(
                'did not find expected authorization request details in session, req.session["%s"] is %j',
                i,
                u
              )
            );
          let {
            state: h,
            nonce: y,
            max_age: v,
            code_verifier: m,
            response_type: b,
          } = u;
          try {
            delete e.session[i];
          } catch (e) {}
          let _ = o({ redirect_uri: this._params.redirect_uri }, t),
            w = await r.callback(
              _.redirect_uri,
              n,
              {
                state: h,
                nonce: y,
                max_age: v,
                code_verifier: m,
                response_type: b,
              },
              this._extras
            ),
            O = this._passReqToCallback,
            S = this._verify.length > (O ? 3 : 2) && r.issuer.userinfo_endpoint,
            E = [w, g.bind(this)];
          if (S) {
            if (!w.access_token)
              throw new c({
                message:
                  'expected access_token to be returned when asking for userinfo in verify callback',
                tokenset: w,
              });
            let e = await r.userinfo(w);
            E.splice(1, 0, e);
          }
          (O && E.unshift(e), this._verify(...E));
        })().catch(e => {
          (e instanceof l &&
            'server_error' !== e.error &&
            !e.error.startsWith('invalid')) ||
          e instanceof c
            ? this.fail(e)
            : this.error(e);
        });
      }),
        (e.exports = v));
    },
    89703: (e, t, r) => {
      let n = ['constructor'],
        o = r(82862),
        i = r(88428);
      class a {
        constructor(e) {
          Object.assign(this, e);
          let t = Object.getOwnPropertyDescriptors(this.constructor.prototype),
            { constructor: r } = t;
          Object.defineProperties(
            this,
            (function (e, t) {
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
            })(t, n)
          );
        }
        set expires_in(e) {
          this.expires_at = i() + Number(e);
        }
        get expires_in() {
          return Math.max.apply(null, [this.expires_at - i(), 0]);
        }
        expired() {
          return 0 === this.expires_in;
        }
        claims() {
          if (!this.id_token)
            throw TypeError('id_token not present in TokenSet');
          return JSON.parse(o.decode(this.id_token.split('.')[1]));
        }
      }
      e.exports = a;
    },
    75990: function (e, t, r) {
      (function (e, t) {
        var r =
            /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
          n =
            /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/,
          o = /[\s\n\\/='"\0<>]/,
          i = /^xlink:?./,
          a = /["&<]/;
        function s(e) {
          if (!1 === a.test((e += ''))) return e;
          for (var t = 0, r = 0, n = '', o = ''; r < e.length; r++) {
            switch (e.charCodeAt(r)) {
              case 34:
                o = '&quot;';
                break;
              case 38:
                o = '&amp;';
                break;
              case 60:
                o = '&lt;';
                break;
              default:
                continue;
            }
            (r !== t && (n += e.slice(t, r)), (n += o), (t = r + 1));
          }
          return (r !== t && (n += e.slice(t, r)), n);
        }
        var c = function (e, t) {
            return String(e).replace(/(\n+)/g, '$1' + (t || '	'));
          },
          l = function (e, t, r) {
            return (
              String(e).length > (t || 40) ||
              (!r && -1 !== String(e).indexOf('\n')) ||
              -1 !== String(e).indexOf('<')
            );
          },
          u = {},
          d = /([A-Z])/g;
        function p(e) {
          var t = '';
          for (var n in e) {
            var o = e[n];
            null != o &&
              '' !== o &&
              (t && (t += ' '),
              (t +=
                '-' == n[0]
                  ? n
                  : u[n] || (u[n] = n.replace(d, '-$1').toLowerCase())),
              (t =
                'number' == typeof o && !1 === r.test(n)
                  ? t + ': ' + o + 'px;'
                  : t + ': ' + o + ';'));
          }
          return t || void 0;
        }
        function f(e, t) {
          return (
            Array.isArray(t)
              ? t.reduce(f, e)
              : null != t && !1 !== t && e.push(t),
            e
          );
        }
        function h() {
          this.__d = !0;
        }
        function y(e, t) {
          return {
            __v: e,
            context: t,
            props: e.props,
            setState: h,
            forceUpdate: h,
            __d: !0,
            __h: [],
          };
        }
        function g(e, t) {
          var r = e.contextType,
            n = r && t[r.__c];
          return null != r ? (n ? n.props.value : r.__) : t;
        }
        var v = [],
          m = { shallow: !0 };
        w.render = w;
        var b = function (e, t) {
            return w(e, t, m);
          },
          _ = [];
        function w(e, r, a) {
          r = r || {};
          var u = t.options.__s;
          t.options.__s = !0;
          var d,
            h = t.h(t.Fragment, null);
          return (
            (h.__k = [e]),
            (d =
              a &&
              (a.pretty ||
                a.voidElements ||
                a.sortAttributes ||
                a.shallow ||
                a.allAttributes ||
                a.xml ||
                a.attributeHook)
                ? (function e(r, a, u, d, h, m) {
                    if (null == r || 'boolean' == typeof r) return '';
                    if ('object' != typeof r)
                      return 'function' == typeof r ? '' : s(r);
                    var b = u.pretty,
                      _ = b && 'string' == typeof b ? b : '	';
                    if (Array.isArray(r)) {
                      for (var w = '', O = 0; O < r.length; O++)
                        (b && O > 0 && (w += '\n'),
                          (w += e(r[O], a, u, d, h, m)));
                      return w;
                    }
                    if (void 0 !== r.constructor) return '';
                    var S,
                      E = r.type,
                      k = r.props,
                      P = !1;
                    if ('function' == typeof E) {
                      if (
                        ((P = !0),
                        !u.shallow || (!d && !1 !== u.renderRootComponent))
                      ) {
                        if (E === t.Fragment) {
                          var j = [];
                          return (
                            f(j, r.props.children),
                            e(j, a, u, !1 !== u.shallowHighOrder, h, m)
                          );
                        }
                        var A,
                          x = (r.__c = y(r, a));
                        t.options.__b && t.options.__b(r);
                        var T = t.options.__r;
                        if (
                          E.prototype &&
                          'function' == typeof E.prototype.render
                        ) {
                          var C = g(E, a);
                          (((x = r.__c = new E(k, C)).__v = r),
                            (x._dirty = x.__d = !0),
                            (x.props = k),
                            null == x.state && (x.state = {}),
                            null == x._nextState &&
                              null == x.__s &&
                              (x._nextState = x.__s = x.state),
                            (x.context = C),
                            E.getDerivedStateFromProps
                              ? (x.state = Object.assign(
                                  {},
                                  x.state,
                                  E.getDerivedStateFromProps(x.props, x.state)
                                ))
                              : x.componentWillMount &&
                                (x.componentWillMount(),
                                (x.state =
                                  x._nextState !== x.state
                                    ? x._nextState
                                    : x.__s !== x.state
                                      ? x.__s
                                      : x.state)),
                            T && T(r),
                            (A = x.render(x.props, x.state, x.context)));
                        } else
                          for (var W = g(E, a), J = 0; x.__d && J++ < 25; )
                            ((x.__d = !1),
                              T && T(r),
                              (A = E.call(r.__c, k, W)));
                        return (
                          x.getChildContext &&
                            (a = Object.assign({}, a, x.getChildContext())),
                          t.options.diffed && t.options.diffed(r),
                          e(A, a, u, !1 !== u.shallowHighOrder, h, m)
                        );
                      }
                      E =
                        (S = E).displayName ||
                        (S !== Function && S.name) ||
                        (function (e) {
                          var t = (Function.prototype.toString
                            .call(e)
                            .match(/^\s*function\s+([^( ]+)/) || '')[1];
                          if (!t) {
                            for (var r = -1, n = v.length; n--; )
                              if (v[n] === e) {
                                r = n;
                                break;
                              }
                            (r < 0 && (r = v.push(e) - 1),
                              (t = 'UnnamedComponent' + r));
                          }
                          return t;
                        })(S);
                    }
                    var I,
                      R,
                      H = '<' + E;
                    if (k) {
                      var M = Object.keys(k);
                      u && !0 === u.sortAttributes && M.sort();
                      for (var K = 0; K < M.length; K++) {
                        var D = M[K],
                          U = k[D];
                        if ('children' !== D) {
                          if (
                            !o.test(D) &&
                            ((u && u.allAttributes) ||
                              ('key' !== D &&
                                'ref' !== D &&
                                '__self' !== D &&
                                '__source' !== D))
                          ) {
                            if ('defaultValue' === D) D = 'value';
                            else if ('defaultChecked' === D) D = 'checked';
                            else if ('defaultSelected' === D) D = 'selected';
                            else if ('className' === D) {
                              if (void 0 !== k.class) continue;
                              D = 'class';
                            } else
                              h &&
                                i.test(D) &&
                                (D = D.toLowerCase().replace(
                                  /^xlink:?/,
                                  'xlink:'
                                ));
                            if ('htmlFor' === D) {
                              if (k.for) continue;
                              D = 'for';
                            }
                            ('style' === D &&
                              U &&
                              'object' == typeof U &&
                              (U = p(U)),
                              'a' === D[0] &&
                                'r' === D[1] &&
                                'boolean' == typeof U &&
                                (U = String(U)));
                            var N =
                              u.attributeHook && u.attributeHook(D, U, a, u, P);
                            if (N || '' === N) H += N;
                            else if ('dangerouslySetInnerHTML' === D)
                              R = U && U.__html;
                            else if ('textarea' === E && 'value' === D) I = U;
                            else if (
                              (U || 0 === U || '' === U) &&
                              'function' != typeof U
                            ) {
                              if (
                                !(
                                  (!0 !== U && '' !== U) ||
                                  ((U = D), u && u.xml)
                                )
                              ) {
                                H = H + ' ' + D;
                                continue;
                              }
                              if ('value' === D) {
                                if ('select' === E) {
                                  m = U;
                                  continue;
                                }
                                'option' === E &&
                                  m == U &&
                                  void 0 === k.selected &&
                                  (H += ' selected');
                              }
                              H = H + ' ' + D + '="' + s(U) + '"';
                            }
                          }
                        } else I = U;
                      }
                    }
                    if (b) {
                      var $ = H.replace(/\n\s*/, ' ');
                      $ === H || ~$.indexOf('\n')
                        ? b && ~H.indexOf('\n') && (H += '\n')
                        : (H = $);
                    }
                    if (((H += '>'), o.test(E)))
                      throw Error(E + ' is not a valid HTML tag name in ' + H);
                    var L,
                      B =
                        n.test(E) || (u.voidElements && u.voidElements.test(E)),
                      q = [];
                    if (R) (b && l(R) && (R = '\n' + _ + c(R, _)), (H += R));
                    else if (null != I && f((L = []), I).length) {
                      for (
                        var z = b && ~H.indexOf('\n'), F = !1, G = 0;
                        G < L.length;
                        G++
                      ) {
                        var V = L[G];
                        if (null != V && !1 !== V) {
                          var X = e(
                            V,
                            a,
                            u,
                            !0,
                            'svg' === E || ('foreignObject' !== E && h),
                            m
                          );
                          if ((b && !z && l(X) && (z = !0), X)) {
                            if (b) {
                              var Y = X.length > 0 && '<' != X[0];
                              (F && Y ? (q[q.length - 1] += X) : q.push(X),
                                (F = Y));
                            } else q.push(X);
                          }
                        }
                      }
                      if (b && z)
                        for (var Z = q.length; Z--; )
                          q[Z] = '\n' + _ + c(q[Z], _);
                    }
                    if (q.length || R) H += q.join('');
                    else if (u && u.xml)
                      return H.substring(0, H.length - 1) + ' />';
                    return (
                      !B || L || R
                        ? (b && ~H.indexOf('\n') && (H += '\n'),
                          (H = H + '</' + E + '>'))
                        : (H = H.replace(/>$/, ' />')),
                      H
                    );
                  })(e, r, a)
                : (function e(r, a, c, l, u) {
                    if (null == r || !0 === r || !1 === r || '' === r)
                      return '';
                    if ('object' != typeof r)
                      return 'function' == typeof r ? '' : s(r);
                    if (S(r)) {
                      var d = '';
                      u.__k = r;
                      for (var f = 0; f < r.length; f++)
                        ((d += e(r[f], a, c, l, u)), (r[f] = O(r[f])));
                      return d;
                    }
                    if (void 0 !== r.constructor) return '';
                    ((r.__ = u), t.options.__b && t.options.__b(r));
                    var h = r.type,
                      v = r.props;
                    if ('function' == typeof h) {
                      if (h === t.Fragment) P = v.children;
                      else {
                        P =
                          h.prototype && 'function' == typeof h.prototype.render
                            ? ((m = a),
                              (_ = g((b = r.type), m)),
                              (w = new b(r.props, _)),
                              (r.__c = w),
                              (w.__v = r),
                              (w.__d = !0),
                              (w.props = r.props),
                              null == w.state && (w.state = {}),
                              null == w.__s && (w.__s = w.state),
                              (w.context = _),
                              b.getDerivedStateFromProps
                                ? (w.state = E(
                                    {},
                                    w.state,
                                    b.getDerivedStateFromProps(w.props, w.state)
                                  ))
                                : w.componentWillMount &&
                                  (w.componentWillMount(),
                                  (w.state =
                                    w.__s !== w.state ? w.__s : w.state)),
                              (k = t.options.__r) && k(r),
                              w.render(w.props, w.state, w.context))
                            : (function (e, r) {
                                var n,
                                  o = y(e, r),
                                  i = g(e.type, r);
                                e.__c = o;
                                for (
                                  var a = t.options.__r, s = 0;
                                  o.__d && s++ < 25;

                                )
                                  ((o.__d = !1),
                                    a && a(e),
                                    (n = e.type.call(o, e.props, i)));
                                return n;
                              })(r, a);
                        var m,
                          b,
                          _,
                          w,
                          k,
                          P,
                          j = r.__c;
                        j.getChildContext &&
                          (a = E({}, a, j.getChildContext()));
                      }
                      var A = e(
                        (P =
                          null != P && P.type === t.Fragment && null == P.key
                            ? P.props.children
                            : P),
                        a,
                        c,
                        l,
                        r
                      );
                      return (
                        t.options.diffed && t.options.diffed(r),
                        (r.__ = void 0),
                        t.options.unmount && t.options.unmount(r),
                        A
                      );
                    }
                    var x,
                      T,
                      C = '<';
                    if (((C += h), v))
                      for (var W in ((x = v.children), v)) {
                        var J,
                          I,
                          R,
                          H = v[W];
                        if (
                          !(
                            'key' === W ||
                            'ref' === W ||
                            '__self' === W ||
                            '__source' === W ||
                            'children' === W ||
                            ('className' === W && 'class' in v) ||
                            ('htmlFor' === W && 'for' in v) ||
                            o.test(W)
                          )
                        ) {
                          if (
                            ((I = W =
                              'className' === (J = W)
                                ? 'class'
                                : 'htmlFor' === J
                                  ? 'for'
                                  : 'defaultValue' === J
                                    ? 'value'
                                    : 'defaultChecked' === J
                                      ? 'checked'
                                      : 'defaultSelected' === J
                                        ? 'selected'
                                        : c && i.test(J)
                                          ? J.toLowerCase().replace(
                                              /^xlink:?/,
                                              'xlink:'
                                            )
                                          : J),
                            (R = H),
                            (H =
                              'style' === I && null != R && 'object' == typeof R
                                ? p(R)
                                : 'a' === I[0] &&
                                    'r' === I[1] &&
                                    'boolean' == typeof R
                                  ? String(R)
                                  : R),
                            'dangerouslySetInnerHTML' === W)
                          )
                            T = H && H.__html;
                          else if ('textarea' === h && 'value' === W) x = H;
                          else if (
                            (H || 0 === H || '' === H) &&
                            'function' != typeof H
                          ) {
                            if (!0 === H || '' === H) {
                              ((H = W), (C = C + ' ' + W));
                              continue;
                            }
                            if ('value' === W) {
                              if ('select' === h) {
                                l = H;
                                continue;
                              }
                              'option' !== h ||
                                l != H ||
                                'selected' in v ||
                                (C += ' selected');
                            }
                            C = C + ' ' + W + '="' + s(H) + '"';
                          }
                        }
                      }
                    var M = C;
                    if (((C += '>'), o.test(h)))
                      throw Error(h + ' is not a valid HTML tag name in ' + C);
                    var K = '',
                      D = !1;
                    if (T) ((K += T), (D = !0));
                    else if ('string' == typeof x) ((K += s(x)), (D = !0));
                    else if (S(x)) {
                      r.__k = x;
                      for (var U = 0; U < x.length; U++) {
                        var N = x[U];
                        if (((x[U] = O(N)), null != N && !1 !== N)) {
                          var $ = e(
                            N,
                            a,
                            'svg' === h || ('foreignObject' !== h && c),
                            l,
                            r
                          );
                          $ && ((K += $), (D = !0));
                        }
                      }
                    } else if (null != x && !1 !== x && !0 !== x) {
                      r.__k = [O(x)];
                      var L = e(
                        x,
                        a,
                        'svg' === h || ('foreignObject' !== h && c),
                        l,
                        r
                      );
                      L && ((K += L), (D = !0));
                    }
                    if (
                      (t.options.diffed && t.options.diffed(r),
                      (r.__ = void 0),
                      t.options.unmount && t.options.unmount(r),
                      D)
                    )
                      C += K;
                    else if (n.test(h)) return M + ' />';
                    return C + '</' + h + '>';
                  })(e, r, !1, void 0, h)),
            t.options.__c && t.options.__c(e, _),
            (t.options.__s = u),
            (_.length = 0),
            d
          );
        }
        function O(e) {
          return null == e || 'boolean' == typeof e
            ? null
            : 'string' == typeof e ||
                'number' == typeof e ||
                'bigint' == typeof e
              ? t.h(null, null, e)
              : e;
        }
        var S = Array.isArray,
          E = Object.assign;
        ((w.shallowRender = b),
          (e.default = w),
          (e.render = w),
          (e.renderToStaticMarkup = w),
          (e.renderToString = w),
          (e.shallowRender = b));
      })(t, r(89976));
    },
    87380: (e, t, r) => {
      e.exports = r(75990).default;
    },
    89976: (e, t) => {
      var r,
        n,
        o,
        i,
        a,
        s,
        c,
        l,
        u,
        d,
        p,
        f,
        h = {},
        y = [],
        g = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
        v = Array.isArray;
      function m(e, t) {
        for (var r in t) e[r] = t[r];
        return e;
      }
      function b(e) {
        e && e.parentNode && e.parentNode.removeChild(e);
      }
      function _(e, t, n) {
        var o,
          i,
          a,
          s = {};
        for (a in t)
          'key' == a ? (o = t[a]) : 'ref' == a ? (i = t[a]) : (s[a] = t[a]);
        if (
          (arguments.length > 2 &&
            (s.children = arguments.length > 3 ? r.call(arguments, 2) : n),
          'function' == typeof e && null != e.defaultProps)
        )
          for (a in e.defaultProps)
            void 0 === s[a] && (s[a] = e.defaultProps[a]);
        return w(e, s, o, i, null);
      }
      function w(e, t, r, i, a) {
        var s = {
          type: e,
          props: t,
          key: r,
          ref: i,
          __k: null,
          __: null,
          __b: 0,
          __e: null,
          __c: null,
          constructor: void 0,
          __v: null == a ? ++o : a,
          __i: -1,
          __u: 0,
        };
        return (null == a && null != n.vnode && n.vnode(s), s);
      }
      function O(e) {
        return e.children;
      }
      function S(e, t) {
        ((this.props = e), (this.context = t));
      }
      function E(e, t) {
        if (null == t) return e.__ ? E(e.__, e.__i + 1) : null;
        for (var r; t < e.__k.length; t++)
          if (null != (r = e.__k[t]) && null != r.__e) return r.__e;
        return 'function' == typeof e.type ? E(e) : null;
      }
      function k(e) {
        ((!e.__d && (e.__d = !0) && i.push(e) && !P.__r++) ||
          a != n.debounceRendering) &&
          ((a = n.debounceRendering) || s)(P);
      }
      function P() {
        for (var e, t, r, o, a, s, l = 1; i.length; )
          (i.length > l && i.sort(c),
            (e = i.shift()),
            (l = i.length),
            e.__d &&
              ((t = void 0),
              (o = (r = e.__v).__e),
              (a = []),
              (s = []),
              e.__P &&
                (((t = m({}, r)).__v = r.__v + 1),
                n.vnode && n.vnode(t),
                C(
                  e.__P,
                  t,
                  r,
                  e.__n,
                  e.__P.namespaceURI,
                  32 & r.__u ? [o] : null,
                  a,
                  null == o ? E(r) : o,
                  !!(32 & r.__u),
                  s
                ),
                (t.__v = r.__v),
                (t.__.__k[t.__i] = t),
                J(a, t, s),
                t.__e != o &&
                  (function e(t) {
                    var r, n;
                    if (null != (t = t.__) && null != t.__c) {
                      for (
                        t.__e = t.__c.base = null, r = 0;
                        r < t.__k.length;
                        r++
                      )
                        if (null != (n = t.__k[r]) && null != n.__e) {
                          t.__e = t.__c.base = n.__e;
                          break;
                        }
                      return e(t);
                    }
                  })(t))));
        P.__r = 0;
      }
      function j(e, t, r, o, i, a, s, c, l, u, d) {
        var p,
          f,
          g,
          m,
          _,
          S,
          k,
          P = (o && o.__k) || y,
          j = t.length;
        for (
          l = (function (e, t, r, o, i) {
            var a,
              s,
              c,
              l,
              u,
              d = r.length,
              p = d,
              f = 0;
            for (e.__k = Array(i), a = 0; a < i; a++)
              null != (s = t[a]) &&
              'boolean' != typeof s &&
              'function' != typeof s
                ? ((l = a + f),
                  ((s = e.__k[a] =
                    'string' == typeof s ||
                    'number' == typeof s ||
                    'bigint' == typeof s ||
                    s.constructor == String
                      ? w(null, s, null, null, null)
                      : v(s)
                        ? w(O, { children: s }, null, null, null)
                        : null == s.constructor && s.__b > 0
                          ? w(
                              s.type,
                              s.props,
                              s.key,
                              s.ref ? s.ref : null,
                              s.__v
                            )
                          : s).__ = e),
                  (s.__b = e.__b + 1),
                  (c = null),
                  -1 !=
                    (u = s.__i =
                      (function (e, t, r, n) {
                        var o,
                          i,
                          a,
                          s = e.key,
                          c = e.type,
                          l = t[r],
                          u = null != l && 0 == (2 & l.__u);
                        if (
                          (null === l && null == e.key) ||
                          (u && s == l.key && c == l.type)
                        )
                          return r;
                        if (n > (u ? 1 : 0)) {
                          for (o = r - 1, i = r + 1; o >= 0 || i < t.length; )
                            if (
                              null != (l = t[(a = o >= 0 ? o-- : i++)]) &&
                              0 == (2 & l.__u) &&
                              s == l.key &&
                              c == l.type
                            )
                              return a;
                        }
                        return -1;
                      })(s, r, l, p)) && (p--, (c = r[u]) && (c.__u |= 2)),
                  null == c || null == c.__v
                    ? (-1 == u && (i > d ? f-- : i < d && f++),
                      'function' != typeof s.type && (s.__u |= 4))
                    : u != l &&
                      (u == l - 1
                        ? f--
                        : u == l + 1
                          ? f++
                          : (u > l ? f-- : f++, (s.__u |= 4))))
                : (e.__k[a] = null);
            if (p)
              for (a = 0; a < d; a++)
                null != (c = r[a]) &&
                  0 == (2 & c.__u) &&
                  (c.__e == o && (o = E(c)),
                  (function e(t, r, o) {
                    var i, a;
                    if (
                      (n.unmount && n.unmount(t),
                      (i = t.ref) &&
                        ((i.current && i.current != t.__e) || I(i, null, r)),
                      null != (i = t.__c))
                    ) {
                      if (i.componentWillUnmount)
                        try {
                          i.componentWillUnmount();
                        } catch (e) {
                          n.__e(e, r);
                        }
                      i.base = i.__P = null;
                    }
                    if ((i = t.__k))
                      for (a = 0; a < i.length; a++)
                        i[a] && e(i[a], r, o || 'function' != typeof t.type);
                    (o || b(t.__e), (t.__c = t.__ = t.__e = void 0));
                  })(c, c));
            return o;
          })(r, t, P, l, j),
            p = 0;
          p < j;
          p++
        )
          null != (g = r.__k[p]) &&
            ((f = -1 == g.__i ? h : P[g.__i] || h),
            (g.__i = p),
            (S = C(e, g, f, i, a, s, c, l, u, d)),
            (m = g.__e),
            g.ref &&
              f.ref != g.ref &&
              (f.ref && I(f.ref, null, g), d.push(g.ref, g.__c || m, g)),
            null == _ && null != m && (_ = m),
            (k = !!(4 & g.__u)) || f.__k === g.__k
              ? (l = (function e(t, r, n, o) {
                  var i, a;
                  if ('function' == typeof t.type) {
                    for (i = t.__k, a = 0; i && a < i.length; a++)
                      i[a] && ((i[a].__ = t), (r = e(i[a], r, n, o)));
                    return r;
                  }
                  t.__e != r &&
                    (o &&
                      (r && t.type && !r.parentNode && (r = E(t)),
                      n.insertBefore(t.__e, r || null)),
                    (r = t.__e));
                  do r = r && r.nextSibling;
                  while (null != r && 8 == r.nodeType);
                  return r;
                })(g, l, e, k))
              : 'function' == typeof g.type && void 0 !== S
                ? (l = S)
                : m && (l = m.nextSibling),
            (g.__u &= -7));
        return ((r.__e = _), l);
      }
      function A(e, t, r) {
        '-' == t[0]
          ? e.setProperty(t, null == r ? '' : r)
          : (e[t] =
              null == r
                ? ''
                : 'number' != typeof r || g.test(t)
                  ? r
                  : r + 'px');
      }
      function x(e, t, r, n, o) {
        var i, a;
        e: if ('style' == t) {
          if ('string' == typeof r) e.style.cssText = r;
          else {
            if (('string' == typeof n && (e.style.cssText = n = ''), n))
              for (t in n) (r && t in r) || A(e.style, t, '');
            if (r) for (t in r) (n && r[t] == n[t]) || A(e.style, t, r[t]);
          }
        } else if ('o' == t[0] && 'n' == t[1])
          ((i = t != (t = t.replace(l, '$1'))),
            (t =
              (a = t.toLowerCase()) in e ||
              'onFocusOut' == t ||
              'onFocusIn' == t
                ? a.slice(2)
                : t.slice(2)),
            e.l || (e.l = {}),
            (e.l[t + i] = r),
            r
              ? n
                ? (r.t = n.t)
                : ((r.t = u), e.addEventListener(t, i ? p : d, i))
              : e.removeEventListener(t, i ? p : d, i));
        else {
          if ('http://www.w3.org/2000/svg' == o)
            t = t.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
          else if (
            'width' != t &&
            'height' != t &&
            'href' != t &&
            'list' != t &&
            'form' != t &&
            'tabIndex' != t &&
            'download' != t &&
            'rowSpan' != t &&
            'colSpan' != t &&
            'role' != t &&
            'popover' != t &&
            t in e
          )
            try {
              e[t] = null == r ? '' : r;
              break e;
            } catch (e) {}
          'function' == typeof r ||
            (null == r || (!1 === r && '-' != t[4])
              ? e.removeAttribute(t)
              : e.setAttribute(t, 'popover' == t && 1 == r ? '' : r));
        }
      }
      function T(e) {
        return function (t) {
          if (this.l) {
            var r = this.l[t.type + e];
            if (null == t.u) t.u = u++;
            else if (t.u < r.t) return;
            return r(n.event ? n.event(t) : t);
          }
        };
      }
      function C(e, t, o, i, a, s, c, l, u, d) {
        var p,
          f,
          y,
          g,
          _,
          w,
          k,
          P,
          A,
          T,
          C,
          J,
          I,
          H,
          M,
          K,
          D,
          U = t.type;
        if (null != t.constructor) return null;
        (128 & o.__u && ((u = !!(32 & o.__u)), (s = [(l = t.__e = o.__e)])),
          (p = n.__b) && p(t));
        e: if ('function' == typeof U)
          try {
            if (
              ((P = t.props),
              (A = 'prototype' in U && U.prototype.render),
              (T = (p = U.contextType) && i[p.__c]),
              (C = p ? (T ? T.props.value : p.__) : i),
              o.__c
                ? (k = (f = t.__c = o.__c).__ = f.__E)
                : (A
                    ? (t.__c = f = new U(P, C))
                    : ((t.__c = f = new S(P, C)),
                      (f.constructor = U),
                      (f.render = R)),
                  T && T.sub(f),
                  (f.props = P),
                  f.state || (f.state = {}),
                  (f.context = C),
                  (f.__n = i),
                  (y = f.__d = !0),
                  (f.__h = []),
                  (f._sb = [])),
              A && null == f.__s && (f.__s = f.state),
              A &&
                null != U.getDerivedStateFromProps &&
                (f.__s == f.state && (f.__s = m({}, f.__s)),
                m(f.__s, U.getDerivedStateFromProps(P, f.__s))),
              (g = f.props),
              (_ = f.state),
              (f.__v = t),
              y)
            )
              (A &&
                null == U.getDerivedStateFromProps &&
                null != f.componentWillMount &&
                f.componentWillMount(),
                A &&
                  null != f.componentDidMount &&
                  f.__h.push(f.componentDidMount));
            else {
              if (
                (A &&
                  null == U.getDerivedStateFromProps &&
                  P !== g &&
                  null != f.componentWillReceiveProps &&
                  f.componentWillReceiveProps(P, C),
                (!f.__e &&
                  null != f.shouldComponentUpdate &&
                  !1 === f.shouldComponentUpdate(P, f.__s, C)) ||
                  t.__v == o.__v)
              ) {
                for (
                  t.__v != o.__v &&
                    ((f.props = P), (f.state = f.__s), (f.__d = !1)),
                    t.__e = o.__e,
                    t.__k = o.__k,
                    t.__k.some(function (e) {
                      e && (e.__ = t);
                    }),
                    J = 0;
                  J < f._sb.length;
                  J++
                )
                  f.__h.push(f._sb[J]);
                ((f._sb = []), f.__h.length && c.push(f));
                break e;
              }
              (null != f.componentWillUpdate &&
                f.componentWillUpdate(P, f.__s, C),
                A &&
                  null != f.componentDidUpdate &&
                  f.__h.push(function () {
                    f.componentDidUpdate(g, _, w);
                  }));
            }
            if (
              ((f.context = C),
              (f.props = P),
              (f.__P = e),
              (f.__e = !1),
              (I = n.__r),
              (H = 0),
              A)
            ) {
              for (
                f.state = f.__s,
                  f.__d = !1,
                  I && I(t),
                  p = f.render(f.props, f.state, f.context),
                  M = 0;
                M < f._sb.length;
                M++
              )
                f.__h.push(f._sb[M]);
              f._sb = [];
            } else
              do
                ((f.__d = !1),
                  I && I(t),
                  (p = f.render(f.props, f.state, f.context)),
                  (f.state = f.__s));
              while (f.__d && ++H < 25);
            ((f.state = f.__s),
              null != f.getChildContext &&
                (i = m(m({}, i), f.getChildContext())),
              A &&
                !y &&
                null != f.getSnapshotBeforeUpdate &&
                (w = f.getSnapshotBeforeUpdate(g, _)),
              (K = p),
              null != p &&
                p.type === O &&
                null == p.key &&
                (K = (function e(t) {
                  return 'object' != typeof t ||
                    null == t ||
                    (t.__b && t.__b > 0)
                    ? t
                    : v(t)
                      ? t.map(e)
                      : m({}, t);
                })(p.props.children)),
              (l = j(e, v(K) ? K : [K], t, o, i, a, s, c, l, u, d)),
              (f.base = t.__e),
              (t.__u &= -161),
              f.__h.length && c.push(f),
              k && (f.__E = f.__ = null));
          } catch (e) {
            if (((t.__v = null), u || null != s)) {
              if (e.then) {
                for (
                  t.__u |= u ? 160 : 128;
                  l && 8 == l.nodeType && l.nextSibling;

                )
                  l = l.nextSibling;
                ((s[s.indexOf(l)] = null), (t.__e = l));
              } else {
                for (D = s.length; D--; ) b(s[D]);
                W(t);
              }
            } else ((t.__e = o.__e), (t.__k = o.__k), e.then || W(t));
            n.__e(e, t, o);
          }
        else
          null == s && t.__v == o.__v
            ? ((t.__k = o.__k), (t.__e = o.__e))
            : (l = t.__e =
                (function (e, t, o, i, a, s, c, l, u) {
                  var d,
                    p,
                    f,
                    y,
                    g,
                    m,
                    _,
                    w = o.props,
                    O = t.props,
                    S = t.type;
                  if (
                    ('svg' == S
                      ? (a = 'http://www.w3.org/2000/svg')
                      : 'math' == S
                        ? (a = 'http://www.w3.org/1998/Math/MathML')
                        : a || (a = 'http://www.w3.org/1999/xhtml'),
                    null != s)
                  ) {
                    for (d = 0; d < s.length; d++)
                      if (
                        (g = s[d]) &&
                        'setAttribute' in g == !!S &&
                        (S ? g.localName == S : 3 == g.nodeType)
                      ) {
                        ((e = g), (s[d] = null));
                        break;
                      }
                  }
                  if (null == e) {
                    if (null == S) return document.createTextNode(O);
                    ((e = document.createElementNS(a, S, O.is && O)),
                      l && (n.__m && n.__m(t, s), (l = !1)),
                      (s = null));
                  }
                  if (null == S) w === O || (l && e.data == O) || (e.data = O);
                  else {
                    if (
                      ((s = s && r.call(e.childNodes)),
                      (w = o.props || h),
                      !l && null != s)
                    )
                      for (w = {}, d = 0; d < e.attributes.length; d++)
                        w[(g = e.attributes[d]).name] = g.value;
                    for (d in w)
                      if (((g = w[d]), 'children' == d));
                      else if ('dangerouslySetInnerHTML' == d) f = g;
                      else if (!(d in O)) {
                        if (
                          ('value' == d && 'defaultValue' in O) ||
                          ('checked' == d && 'defaultChecked' in O)
                        )
                          continue;
                        x(e, d, null, g, a);
                      }
                    for (d in O)
                      ((g = O[d]),
                        'children' == d
                          ? (y = g)
                          : 'dangerouslySetInnerHTML' == d
                            ? (p = g)
                            : 'value' == d
                              ? (m = g)
                              : 'checked' == d
                                ? (_ = g)
                                : (l && 'function' != typeof g) ||
                                  w[d] === g ||
                                  x(e, d, g, w[d], a));
                    if (p)
                      (l ||
                        (f &&
                          (p.__html == f.__html || p.__html == e.innerHTML)) ||
                        (e.innerHTML = p.__html),
                        (t.__k = []));
                    else if (
                      (f && (e.innerHTML = ''),
                      j(
                        'template' == t.type ? e.content : e,
                        v(y) ? y : [y],
                        t,
                        o,
                        i,
                        'foreignObject' == S
                          ? 'http://www.w3.org/1999/xhtml'
                          : a,
                        s,
                        c,
                        s ? s[0] : o.__k && E(o, 0),
                        l,
                        u
                      ),
                      null != s)
                    )
                      for (d = s.length; d--; ) b(s[d]);
                    l ||
                      ((d = 'value'),
                      'progress' == S && null == m
                        ? e.removeAttribute('value')
                        : null == m ||
                          (m === e[d] &&
                            ('progress' != S || m) &&
                            ('option' != S || m == w[d])) ||
                          x(e, d, m, w[d], a),
                      (d = 'checked'),
                      null != _ && _ != e[d] && x(e, d, _, w[d], a));
                  }
                  return e;
                })(o.__e, t, o, i, a, s, c, u, d));
        return ((p = n.diffed) && p(t), 128 & t.__u ? void 0 : l);
      }
      function W(e) {
        (e && e.__c && (e.__c.__e = !0), e && e.__k && e.__k.forEach(W));
      }
      function J(e, t, r) {
        for (var o = 0; o < r.length; o++) I(r[o], r[++o], r[++o]);
        (n.__c && n.__c(t, e),
          e.some(function (t) {
            try {
              ((e = t.__h),
                (t.__h = []),
                e.some(function (e) {
                  e.call(t);
                }));
            } catch (e) {
              n.__e(e, t.__v);
            }
          }));
      }
      function I(e, t, r) {
        try {
          if ('function' == typeof e) {
            var o = 'function' == typeof e.__u;
            (o && e.__u(), (o && null == t) || (e.__u = e(t)));
          } else e.current = t;
        } catch (e) {
          n.__e(e, r);
        }
      }
      function R(e, t, r) {
        return this.constructor(e, r);
      }
      function H(e, t, o) {
        var i, a, s, c;
        (t == document && (t = document.documentElement),
          n.__ && n.__(e, t),
          (a = (i = 'function' == typeof o) ? null : (o && o.__k) || t.__k),
          (s = []),
          (c = []),
          C(
            t,
            (e = ((!i && o) || t).__k = _(O, null, [e])),
            a || h,
            h,
            t.namespaceURI,
            !i && o
              ? [o]
              : a
                ? null
                : t.firstChild
                  ? r.call(t.childNodes)
                  : null,
            s,
            !i && o ? o : a ? a.__e : t.firstChild,
            i,
            c
          ),
          J(s, e, c));
      }
      ((r = y.slice),
        (n = {
          __e: function (e, t, r, n) {
            for (var o, i, a; (t = t.__); )
              if ((o = t.__c) && !o.__)
                try {
                  if (
                    ((i = o.constructor) &&
                      null != i.getDerivedStateFromError &&
                      (o.setState(i.getDerivedStateFromError(e)), (a = o.__d)),
                    null != o.componentDidCatch &&
                      (o.componentDidCatch(e, n || {}), (a = o.__d)),
                    a)
                  )
                    return (o.__E = o);
                } catch (t) {
                  e = t;
                }
            throw e;
          },
        }),
        (o = 0),
        (S.prototype.setState = function (e, t) {
          var r;
          ((r =
            null != this.__s && this.__s != this.state
              ? this.__s
              : (this.__s = m({}, this.state))),
            'function' == typeof e && (e = e(m({}, r), this.props)),
            e && m(r, e),
            null != e && this.__v && (t && this._sb.push(t), k(this)));
        }),
        (S.prototype.forceUpdate = function (e) {
          this.__v && ((this.__e = !0), e && this.__h.push(e), k(this));
        }),
        (S.prototype.render = O),
        (i = []),
        (s =
          'function' == typeof Promise
            ? Promise.prototype.then.bind(Promise.resolve())
            : setTimeout),
        (c = function (e, t) {
          return e.__v.__b - t.__v.__b;
        }),
        (P.__r = 0),
        (l = /(PointerCapture)$|Capture$/i),
        (u = 0),
        (d = T(!1)),
        (p = T(!0)),
        (f = 0),
        (t.Component = S),
        (t.Fragment = O),
        (t.cloneElement = function (e, t, n) {
          var o,
            i,
            a,
            s,
            c = m({}, e.props);
          for (a in (e.type && e.type.defaultProps && (s = e.type.defaultProps),
          t))
            'key' == a
              ? (o = t[a])
              : 'ref' == a
                ? (i = t[a])
                : (c[a] = void 0 === t[a] && null != s ? s[a] : t[a]);
          return (
            arguments.length > 2 &&
              (c.children = arguments.length > 3 ? r.call(arguments, 2) : n),
            w(e.type, c, o || e.key, i || e.ref, null)
          );
        }),
        (t.createContext = function (e) {
          function t(e) {
            var r, n;
            return (
              this.getChildContext ||
                ((r = new Set()),
                ((n = {})[t.__c] = this),
                (this.getChildContext = function () {
                  return n;
                }),
                (this.componentWillUnmount = function () {
                  r = null;
                }),
                (this.shouldComponentUpdate = function (e) {
                  this.props.value != e.value &&
                    r.forEach(function (e) {
                      ((e.__e = !0), k(e));
                    });
                }),
                (this.sub = function (e) {
                  r.add(e);
                  var t = e.componentWillUnmount;
                  e.componentWillUnmount = function () {
                    (r && r.delete(e), t && t.call(e));
                  };
                })),
              e.children
            );
          }
          return (
            (t.__c = '__cC' + f++),
            (t.__ = e),
            (t.Provider =
              t.__l =
              (t.Consumer = function (e, t) {
                return e.children(t);
              }).contextType =
                t),
            t
          );
        }),
        (t.createElement = _),
        (t.createRef = function () {
          return { current: null };
        }),
        (t.h = _),
        (t.hydrate = function e(t, r) {
          H(t, r, e);
        }),
        (t.isValidElement = function (e) {
          return null != e && null == e.constructor;
        }),
        (t.options = n),
        (t.render = H),
        (t.toChildArray = function e(t, r) {
          return (
            (r = r || []),
            null == t ||
              'boolean' == typeof t ||
              (v(t)
                ? t.some(function (t) {
                    e(t, r);
                  })
                : r.push(t)),
            r
          );
        }));
    },
    87372: (e, t, r) => {
      'use strict';
      let n, o;
      (r.r(t),
        r.d(t, {
          NIL: () => O,
          parse: () => v,
          stringify: () => f,
          v1: () => g,
          v3: () => b,
          v4: () => _,
          v5: () => w,
          validate: () => d,
          version: () => S,
        }));
      var i = r(6113),
        a = r.n(i);
      let s = new Uint8Array(256),
        c = s.length;
      function l() {
        return (
          c > s.length - 16 && (a().randomFillSync(s), (c = 0)),
          s.slice(c, (c += 16))
        );
      }
      let u =
          /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
        d = function (e) {
          return 'string' == typeof e && u.test(e);
        },
        p = [];
      for (let e = 0; e < 256; ++e) p.push((e + 256).toString(16).substr(1));
      let f = function (e, t = 0) {
          let r = (
            p[e[t + 0]] +
            p[e[t + 1]] +
            p[e[t + 2]] +
            p[e[t + 3]] +
            '-' +
            p[e[t + 4]] +
            p[e[t + 5]] +
            '-' +
            p[e[t + 6]] +
            p[e[t + 7]] +
            '-' +
            p[e[t + 8]] +
            p[e[t + 9]] +
            '-' +
            p[e[t + 10]] +
            p[e[t + 11]] +
            p[e[t + 12]] +
            p[e[t + 13]] +
            p[e[t + 14]] +
            p[e[t + 15]]
          ).toLowerCase();
          if (!d(r)) throw TypeError('Stringified UUID is invalid');
          return r;
        },
        h = 0,
        y = 0,
        g = function (e, t, r) {
          let i = (t && r) || 0,
            a = t || Array(16),
            s = (e = e || {}).node || n,
            c = void 0 !== e.clockseq ? e.clockseq : o;
          if (null == s || null == c) {
            let t = e.random || (e.rng || l)();
            (null == s && (s = n = [1 | t[0], t[1], t[2], t[3], t[4], t[5]]),
              null == c && (c = o = ((t[6] << 8) | t[7]) & 16383));
          }
          let u = void 0 !== e.msecs ? e.msecs : Date.now(),
            d = void 0 !== e.nsecs ? e.nsecs : y + 1,
            p = u - h + (d - y) / 1e4;
          if (
            (p < 0 && void 0 === e.clockseq && (c = (c + 1) & 16383),
            (p < 0 || u > h) && void 0 === e.nsecs && (d = 0),
            d >= 1e4)
          )
            throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
          ((h = u), (y = d), (o = c));
          let g = ((268435455 & (u += 122192928e5)) * 1e4 + d) % 4294967296;
          ((a[i++] = (g >>> 24) & 255),
            (a[i++] = (g >>> 16) & 255),
            (a[i++] = (g >>> 8) & 255),
            (a[i++] = 255 & g));
          let v = ((u / 4294967296) * 1e4) & 268435455;
          ((a[i++] = (v >>> 8) & 255),
            (a[i++] = 255 & v),
            (a[i++] = ((v >>> 24) & 15) | 16),
            (a[i++] = (v >>> 16) & 255),
            (a[i++] = (c >>> 8) | 128),
            (a[i++] = 255 & c));
          for (let e = 0; e < 6; ++e) a[i + e] = s[e];
          return t || f(a);
        },
        v = function (e) {
          let t;
          if (!d(e)) throw TypeError('Invalid UUID');
          let r = new Uint8Array(16);
          return (
            (r[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24),
            (r[1] = (t >>> 16) & 255),
            (r[2] = (t >>> 8) & 255),
            (r[3] = 255 & t),
            (r[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8),
            (r[5] = 255 & t),
            (r[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8),
            (r[7] = 255 & t),
            (r[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8),
            (r[9] = 255 & t),
            (r[10] =
              ((t = parseInt(e.slice(24, 36), 16)) / 1099511627776) & 255),
            (r[11] = (t / 4294967296) & 255),
            (r[12] = (t >>> 24) & 255),
            (r[13] = (t >>> 16) & 255),
            (r[14] = (t >>> 8) & 255),
            (r[15] = 255 & t),
            r
          );
        };
      function m(e, t, r) {
        function n(e, n, o, i) {
          if (
            ('string' == typeof e &&
              (e = (function (e) {
                e = unescape(encodeURIComponent(e));
                let t = [];
                for (let r = 0; r < e.length; ++r) t.push(e.charCodeAt(r));
                return t;
              })(e)),
            'string' == typeof n && (n = v(n)),
            16 !== n.length)
          )
            throw TypeError(
              'Namespace must be array-like (16 iterable integer values, 0-255)'
            );
          let a = new Uint8Array(16 + e.length);
          if (
            (a.set(n),
            a.set(e, n.length),
            ((a = r(a))[6] = (15 & a[6]) | t),
            (a[8] = (63 & a[8]) | 128),
            o)
          ) {
            i = i || 0;
            for (let e = 0; e < 16; ++e) o[i + e] = a[e];
            return o;
          }
          return f(a);
        }
        try {
          n.name = e;
        } catch (e) {}
        return (
          (n.DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'),
          (n.URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),
          n
        );
      }
      let b = m('v3', 48, function (e) {
          return (
            Array.isArray(e)
              ? (e = Buffer.from(e))
              : 'string' == typeof e && (e = Buffer.from(e, 'utf8')),
            a().createHash('md5').update(e).digest()
          );
        }),
        _ = function (e, t, r) {
          let n = (e = e || {}).random || (e.rng || l)();
          if (((n[6] = (15 & n[6]) | 64), (n[8] = (63 & n[8]) | 128), t)) {
            r = r || 0;
            for (let e = 0; e < 16; ++e) t[r + e] = n[e];
            return t;
          }
          return f(n);
        },
        w = m('v5', 80, function (e) {
          return (
            Array.isArray(e)
              ? (e = Buffer.from(e))
              : 'string' == typeof e && (e = Buffer.from(e, 'utf8')),
            a().createHash('sha1').update(e).digest()
          );
        }),
        O = '00000000-0000-0000-0000-000000000000',
        S = function (e) {
          if (!d(e)) throw TypeError('Invalid UUID');
          return parseInt(e.substr(14, 1), 16);
        };
    },
    99256: e => {
      'use strict';
      e.exports = function (e) {
        e.prototype[Symbol.iterator] = function* () {
          for (let e = this.head; e; e = e.next) yield e.value;
        };
      };
    },
    94816: (e, t, r) => {
      'use strict';
      function n(e) {
        var t = this;
        if (
          (t instanceof n || (t = new n()),
          (t.tail = null),
          (t.head = null),
          (t.length = 0),
          e && 'function' == typeof e.forEach)
        )
          e.forEach(function (e) {
            t.push(e);
          });
        else if (arguments.length > 0)
          for (var r = 0, o = arguments.length; r < o; r++)
            t.push(arguments[r]);
        return t;
      }
      function o(e, t, r, n) {
        if (!(this instanceof o)) return new o(e, t, r, n);
        ((this.list = n),
          (this.value = e),
          t ? ((t.next = this), (this.prev = t)) : (this.prev = null),
          r ? ((r.prev = this), (this.next = r)) : (this.next = null));
      }
      ((e.exports = n),
        (n.Node = o),
        (n.create = n),
        (n.prototype.removeNode = function (e) {
          if (e.list !== this)
            throw Error('removing node which does not belong to this list');
          var t = e.next,
            r = e.prev;
          return (
            t && (t.prev = r),
            r && (r.next = t),
            e === this.head && (this.head = t),
            e === this.tail && (this.tail = r),
            e.list.length--,
            (e.next = null),
            (e.prev = null),
            (e.list = null),
            t
          );
        }),
        (n.prototype.unshiftNode = function (e) {
          if (e !== this.head) {
            e.list && e.list.removeNode(e);
            var t = this.head;
            ((e.list = this),
              (e.next = t),
              t && (t.prev = e),
              (this.head = e),
              this.tail || (this.tail = e),
              this.length++);
          }
        }),
        (n.prototype.pushNode = function (e) {
          if (e !== this.tail) {
            e.list && e.list.removeNode(e);
            var t = this.tail;
            ((e.list = this),
              (e.prev = t),
              t && (t.next = e),
              (this.tail = e),
              this.head || (this.head = e),
              this.length++);
          }
        }),
        (n.prototype.push = function () {
          for (var e, t = 0, r = arguments.length; t < r; t++)
            ((e = arguments[t]),
              (this.tail = new o(e, this.tail, null, this)),
              this.head || (this.head = this.tail),
              this.length++);
          return this.length;
        }),
        (n.prototype.unshift = function () {
          for (var e, t = 0, r = arguments.length; t < r; t++)
            ((e = arguments[t]),
              (this.head = new o(e, null, this.head, this)),
              this.tail || (this.tail = this.head),
              this.length++);
          return this.length;
        }),
        (n.prototype.pop = function () {
          if (this.tail) {
            var e = this.tail.value;
            return (
              (this.tail = this.tail.prev),
              this.tail ? (this.tail.next = null) : (this.head = null),
              this.length--,
              e
            );
          }
        }),
        (n.prototype.shift = function () {
          if (this.head) {
            var e = this.head.value;
            return (
              (this.head = this.head.next),
              this.head ? (this.head.prev = null) : (this.tail = null),
              this.length--,
              e
            );
          }
        }),
        (n.prototype.forEach = function (e, t) {
          t = t || this;
          for (var r = this.head, n = 0; null !== r; n++)
            (e.call(t, r.value, n, this), (r = r.next));
        }),
        (n.prototype.forEachReverse = function (e, t) {
          t = t || this;
          for (var r = this.tail, n = this.length - 1; null !== r; n--)
            (e.call(t, r.value, n, this), (r = r.prev));
        }),
        (n.prototype.get = function (e) {
          for (var t = 0, r = this.head; null !== r && t < e; t++) r = r.next;
          if (t === e && null !== r) return r.value;
        }),
        (n.prototype.getReverse = function (e) {
          for (var t = 0, r = this.tail; null !== r && t < e; t++) r = r.prev;
          if (t === e && null !== r) return r.value;
        }),
        (n.prototype.map = function (e, t) {
          t = t || this;
          for (var r = new n(), o = this.head; null !== o; )
            (r.push(e.call(t, o.value, this)), (o = o.next));
          return r;
        }),
        (n.prototype.mapReverse = function (e, t) {
          t = t || this;
          for (var r = new n(), o = this.tail; null !== o; )
            (r.push(e.call(t, o.value, this)), (o = o.prev));
          return r;
        }),
        (n.prototype.reduce = function (e, t) {
          var r,
            n = this.head;
          if (arguments.length > 1) r = t;
          else if (this.head) ((n = this.head.next), (r = this.head.value));
          else throw TypeError('Reduce of empty list with no initial value');
          for (var o = 0; null !== n; o++)
            ((r = e(r, n.value, o)), (n = n.next));
          return r;
        }),
        (n.prototype.reduceReverse = function (e, t) {
          var r,
            n = this.tail;
          if (arguments.length > 1) r = t;
          else if (this.tail) ((n = this.tail.prev), (r = this.tail.value));
          else throw TypeError('Reduce of empty list with no initial value');
          for (var o = this.length - 1; null !== n; o--)
            ((r = e(r, n.value, o)), (n = n.prev));
          return r;
        }),
        (n.prototype.toArray = function () {
          for (
            var e = Array(this.length), t = 0, r = this.head;
            null !== r;
            t++
          )
            ((e[t] = r.value), (r = r.next));
          return e;
        }),
        (n.prototype.toArrayReverse = function () {
          for (
            var e = Array(this.length), t = 0, r = this.tail;
            null !== r;
            t++
          )
            ((e[t] = r.value), (r = r.prev));
          return e;
        }),
        (n.prototype.slice = function (e, t) {
          ((t = t || this.length) < 0 && (t += this.length),
            (e = e || 0) < 0 && (e += this.length));
          var r = new n();
          if (t < e || t < 0) return r;
          (e < 0 && (e = 0), t > this.length && (t = this.length));
          for (var o = 0, i = this.head; null !== i && o < e; o++) i = i.next;
          for (; null !== i && o < t; o++, i = i.next) r.push(i.value);
          return r;
        }),
        (n.prototype.sliceReverse = function (e, t) {
          ((t = t || this.length) < 0 && (t += this.length),
            (e = e || 0) < 0 && (e += this.length));
          var r = new n();
          if (t < e || t < 0) return r;
          (e < 0 && (e = 0), t > this.length && (t = this.length));
          for (var o = this.length, i = this.tail; null !== i && o > t; o--)
            i = i.prev;
          for (; null !== i && o > e; o--, i = i.prev) r.push(i.value);
          return r;
        }),
        (n.prototype.splice = function (e, t, ...r) {
          (e > this.length && (e = this.length - 1),
            e < 0 && (e = this.length + e));
          for (var n = 0, i = this.head; null !== i && n < e; n++) i = i.next;
          for (var a = [], n = 0; i && n < t; n++)
            (a.push(i.value), (i = this.removeNode(i)));
          (null === i && (i = this.tail),
            i !== this.head && i !== this.tail && (i = i.prev));
          for (var n = 0; n < r.length; n++)
            i = (function (e, t, r) {
              var n =
                t === e.head ? new o(r, null, t, e) : new o(r, t, t.next, e);
              return (
                null === n.next && (e.tail = n),
                null === n.prev && (e.head = n),
                e.length++,
                n
              );
            })(this, i, r[n]);
          return a;
        }),
        (n.prototype.reverse = function () {
          for (
            var e = this.head, t = this.tail, r = e;
            null !== r;
            r = r.prev
          ) {
            var n = r.prev;
            ((r.prev = r.next), (r.next = n));
          }
          return ((this.head = t), (this.tail = e), this);
        }));
      try {
        r(99256)(n);
      } catch (e) {}
    },
    69925: e => {
      ((e.exports = function (e, t) {
        ((this.v = e), (this.k = t));
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    44367: e => {
      ((e.exports = function (e) {
        if (void 0 === e)
          throw ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return e;
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    4395: e => {
      function t(e, t, r, n, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value;
        } catch (e) {
          return void r(e);
        }
        s.done ? t(c) : Promise.resolve(c).then(n, o);
      }
      ((e.exports = function (e) {
        return function () {
          var r = this,
            n = arguments;
          return new Promise(function (o, i) {
            var a = e.apply(r, n);
            function s(e) {
              t(a, o, i, s, c, 'next', e);
            }
            function c(e) {
              t(a, o, i, s, c, 'throw', e);
            }
            s(void 0);
          });
        };
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    48242: e => {
      ((e.exports = function (e, t) {
        if (!(e instanceof t))
          throw TypeError('Cannot call a class as a function');
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    15598: (e, t, r) => {
      var n = r(60274),
        o = r(14914);
      ((e.exports = function (e, t, r) {
        if (n()) return Reflect.construct.apply(null, arguments);
        var i = [null];
        i.push.apply(i, t);
        var a = new (e.bind.apply(e, i))();
        return (r && o(a, r.prototype), a);
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    74549: (e, t, r) => {
      var n = r(58580);
      function o(e, t) {
        for (var r = 0; r < t.length; r++) {
          var o = t[r];
          ((o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            'value' in o && (o.writable = !0),
            Object.defineProperty(e, n(o.key), o));
        }
      }
      ((e.exports = function (e, t, r) {
        return (
          t && o(e.prototype, t),
          r && o(e, r),
          Object.defineProperty(e, 'prototype', { writable: !1 }),
          e
        );
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    20484: (e, t, r) => {
      var n = r(58580);
      ((e.exports = function (e, t, r) {
        return (
          (t = n(t)) in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    43120: e => {
      function t() {
        return (
          (e.exports = t =
            Object.assign
              ? Object.assign.bind()
              : function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r)
                      ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
                  }
                  return e;
                }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          t.apply(null, arguments)
        );
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    50493: e => {
      function t(r) {
        return (
          (e.exports = t =
            Object.setPrototypeOf
              ? Object.getPrototypeOf.bind()
              : function (e) {
                  return e.__proto__ || Object.getPrototypeOf(e);
                }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          t(r)
        );
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    77146: (e, t, r) => {
      var n = r(14914);
      ((e.exports = function (e, t) {
        if ('function' != typeof t && null !== t)
          throw TypeError('Super expression must either be null or a function');
        ((e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          Object.defineProperty(e, 'prototype', { writable: !1 }),
          t && n(e, t));
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    70269: e => {
      ((e.exports = function (e) {
        return e && e.__esModule ? e : { default: e };
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    55609: e => {
      ((e.exports = function (e) {
        try {
          return -1 !== Function.toString.call(e).indexOf('[native code]');
        } catch (t) {
          return 'function' == typeof e;
        }
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    60274: e => {
      function t() {
        try {
          var r = !Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          );
        } catch (e) {}
        return ((e.exports = t =
          function () {
            return !!r;
          }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports))();
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    39274: (e, t, r) => {
      var n = r(29852).default,
        o = r(44367);
      ((e.exports = function (e, t) {
        if (t && ('object' == n(t) || 'function' == typeof t)) return t;
        if (void 0 !== t)
          throw TypeError(
            'Derived constructors may only return object or undefined'
          );
        return o(e);
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    20162: (e, t, r) => {
      var n = r(44510);
      function o() {
        /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var t,
          r,
          i = 'function' == typeof Symbol ? Symbol : {},
          a = i.iterator || '@@iterator',
          s = i.toStringTag || '@@toStringTag';
        function c(e, o, i, a) {
          var s = Object.create(
            (o && o.prototype instanceof u ? o : u).prototype
          );
          return (
            n(
              s,
              '_invoke',
              (function (e, n, o) {
                var i,
                  a,
                  s,
                  c = 0,
                  u = o || [],
                  d = !1,
                  p = {
                    p: 0,
                    n: 0,
                    v: t,
                    a: f,
                    f: f.bind(t, 4),
                    d: function (e, r) {
                      return ((i = e), (a = 0), (s = t), (p.n = r), l);
                    },
                  };
                function f(e, n) {
                  for (
                    a = e, s = n, r = 0;
                    !d && c && !o && r < u.length;
                    r++
                  ) {
                    var o,
                      i = u[r],
                      f = p.p,
                      h = i[2];
                    e > 3
                      ? (o = h === n) &&
                        ((s = i[(a = i[4]) ? 5 : ((a = 3), 3)]),
                        (i[4] = i[5] = t))
                      : i[0] <= f &&
                        ((o = e < 2 && f < i[1])
                          ? ((a = 0), (p.v = n), (p.n = i[1]))
                          : f < h &&
                            (o = e < 3 || i[0] > n || n > h) &&
                            ((i[4] = e), (i[5] = n), (p.n = h), (a = 0)));
                  }
                  if (o || e > 1) return l;
                  throw ((d = !0), n);
                }
                return function (o, u, h) {
                  if (c > 1) throw TypeError('Generator is already running');
                  for (
                    d && 1 === u && f(u, h), a = u, s = h;
                    (r = a < 2 ? t : s) || !d;

                  ) {
                    i ||
                      (a
                        ? a < 3
                          ? (a > 1 && (p.n = -1), f(a, s))
                          : (p.n = s)
                        : (p.v = s));
                    try {
                      if (((c = 2), i)) {
                        if ((a || (o = 'next'), (r = i[o]))) {
                          if (!(r = r.call(i, s)))
                            throw TypeError('iterator result is not an object');
                          if (!r.done) return r;
                          ((s = r.value), a < 2 && (a = 0));
                        } else
                          (1 === a && (r = i.return) && r.call(i),
                            a < 2 &&
                              ((s = TypeError(
                                "The iterator does not provide a '" +
                                  o +
                                  "' method"
                              )),
                              (a = 1)));
                        i = t;
                      } else if ((r = (d = p.n < 0) ? s : e.call(n, p)) !== l)
                        break;
                    } catch (e) {
                      ((i = t), (a = 1), (s = e));
                    } finally {
                      c = 1;
                    }
                  }
                  return { value: r, done: d };
                };
              })(e, i, a),
              !0
            ),
            s
          );
        }
        var l = {};
        function u() {}
        function d() {}
        function p() {}
        r = Object.getPrototypeOf;
        var f = [][a]
            ? r(r([][a]()))
            : (n((r = {}), a, function () {
                return this;
              }),
              r),
          h = (p.prototype = u.prototype = Object.create(f));
        function y(e) {
          return (
            Object.setPrototypeOf
              ? Object.setPrototypeOf(e, p)
              : ((e.__proto__ = p), n(e, s, 'GeneratorFunction')),
            (e.prototype = Object.create(h)),
            e
          );
        }
        return (
          (d.prototype = p),
          n(h, 'constructor', p),
          n(p, 'constructor', d),
          (d.displayName = 'GeneratorFunction'),
          n(p, s, 'GeneratorFunction'),
          n(h),
          n(h, s, 'Generator'),
          n(h, a, function () {
            return this;
          }),
          n(h, 'toString', function () {
            return '[object Generator]';
          }),
          ((e.exports = o =
            function () {
              return { w: c, m: y };
            }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports))()
        );
      }
      ((e.exports = o),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    93560: (e, t, r) => {
      var n = r(94424);
      ((e.exports = function (e, t, r, o, i) {
        var a = n(e, t, r, o, i);
        return a.next().then(function (e) {
          return e.done ? e.value : a.next();
        });
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    94424: (e, t, r) => {
      var n = r(20162),
        o = r(9954);
      ((e.exports = function (e, t, r, i, a) {
        return new o(n().w(e, t, r, i), a || Promise);
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    9954: (e, t, r) => {
      var n = r(69925),
        o = r(44510);
      ((e.exports = function e(t, r) {
        var i;
        (this.next ||
          (o(e.prototype),
          o(
            e.prototype,
            ('function' == typeof Symbol && Symbol.asyncIterator) ||
              '@asyncIterator',
            function () {
              return this;
            }
          )),
          o(
            this,
            '_invoke',
            function (e, o, a) {
              function s() {
                return new r(function (o, i) {
                  (function e(o, i, a, s) {
                    try {
                      var c = t[o](i),
                        l = c.value;
                      return l instanceof n
                        ? r.resolve(l.v).then(
                            function (t) {
                              e('next', t, a, s);
                            },
                            function (t) {
                              e('throw', t, a, s);
                            }
                          )
                        : r.resolve(l).then(
                            function (e) {
                              ((c.value = e), a(c));
                            },
                            function (t) {
                              return e('throw', t, a, s);
                            }
                          );
                    } catch (e) {
                      s(e);
                    }
                  })(e, a, o, i);
                });
              }
              return (i = i ? i.then(s, s) : s());
            },
            !0
          ));
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    44510: e => {
      function t(r, n, o, i) {
        var a = Object.defineProperty;
        try {
          a({}, '', {});
        } catch (e) {
          a = 0;
        }
        ((e.exports = t =
          function (e, r, n, o) {
            function i(r, n) {
              t(e, r, function (e) {
                return this._invoke(r, n, e);
              });
            }
            r
              ? a
                ? a(e, r, {
                    value: n,
                    enumerable: !o,
                    configurable: !o,
                    writable: !o,
                  })
                : (e[r] = n)
              : (i('next', 0), i('throw', 1), i('return', 2));
          }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          t(r, n, o, i));
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    18936: e => {
      ((e.exports = function (e) {
        var t = Object(e),
          r = [];
        for (var n in t) r.unshift(n);
        return function e() {
          for (; r.length; )
            if ((n = r.pop()) in t) return ((e.value = n), (e.done = !1), e);
          return ((e.done = !0), e);
        };
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    92600: (e, t, r) => {
      var n = r(69925),
        o = r(20162),
        i = r(93560),
        a = r(94424),
        s = r(9954),
        c = r(18936),
        l = r(62574);
      function u() {
        'use strict';
        var t = o(),
          r = t.m(u),
          d = (Object.getPrototypeOf ? Object.getPrototypeOf(r) : r.__proto__)
            .constructor;
        function p(e) {
          var t = 'function' == typeof e && e.constructor;
          return (
            !!t &&
            (t === d || 'GeneratorFunction' === (t.displayName || t.name))
          );
        }
        var f = { throw: 1, return: 2, break: 3, continue: 3 };
        function h(e) {
          var t, r;
          return function (n) {
            (t ||
              ((t = {
                stop: function () {
                  return r(n.a, 2);
                },
                catch: function () {
                  return n.v;
                },
                abrupt: function (e, t) {
                  return r(n.a, f[e], t);
                },
                delegateYield: function (e, o, i) {
                  return ((t.resultName = o), r(n.d, l(e), i));
                },
                finish: function (e) {
                  return r(n.f, e);
                },
              }),
              (r = function (e, r, o) {
                ((n.p = t.prev), (n.n = t.next));
                try {
                  return e(r, o);
                } finally {
                  t.next = n.n;
                }
              })),
              t.resultName &&
                ((t[t.resultName] = n.v), (t.resultName = void 0)),
              (t.sent = n.v),
              (t.next = n.n));
            try {
              return e.call(this, t);
            } finally {
              ((n.p = t.prev), (n.n = t.next));
            }
          };
        }
        return ((e.exports = u =
          function () {
            return {
              wrap: function (e, r, n, o) {
                return t.w(h(e), r, n, o && o.reverse());
              },
              isGeneratorFunction: p,
              mark: t.m,
              awrap: function (e, t) {
                return new n(e, t);
              },
              AsyncIterator: s,
              async: function (e, t, r, n, o) {
                return (p(t) ? a : i)(h(e), t, r, n, o);
              },
              keys: c,
              values: l,
            };
          }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports))();
      }
      ((e.exports = u),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    62574: (e, t, r) => {
      var n = r(29852).default;
      ((e.exports = function (e) {
        if (null != e) {
          var t =
              e[
                ('function' == typeof Symbol && Symbol.iterator) || '@@iterator'
              ],
            r = 0;
          if (t) return t.call(e);
          if ('function' == typeof e.next) return e;
          if (!isNaN(e.length))
            return {
              next: function () {
                return (
                  e && r >= e.length && (e = void 0),
                  { value: e && e[r++], done: !e }
                );
              },
            };
        }
        throw TypeError(n(e) + ' is not iterable');
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    14914: e => {
      function t(r, n) {
        return (
          (e.exports = t =
            Object.setPrototypeOf
              ? Object.setPrototypeOf.bind()
              : function (e, t) {
                  return ((e.__proto__ = t), e);
                }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          t(r, n)
        );
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    82543: (e, t, r) => {
      var n = r(29852).default;
      ((e.exports = function (e, t) {
        if ('object' != n(e) || !e) return e;
        var r = e[Symbol.toPrimitive];
        if (void 0 !== r) {
          var o = r.call(e, t || 'default');
          if ('object' != n(o)) return o;
          throw TypeError('@@toPrimitive must return a primitive value.');
        }
        return ('string' === t ? String : Number)(e);
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    58580: (e, t, r) => {
      var n = r(29852).default,
        o = r(82543);
      ((e.exports = function (e) {
        var t = o(e, 'string');
        return 'symbol' == n(t) ? t : t + '';
      }),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    29852: e => {
      function t(r) {
        return (
          (e.exports = t =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          t(r)
        );
      }
      ((e.exports = t),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    54031: (e, t, r) => {
      var n = r(50493),
        o = r(14914),
        i = r(55609),
        a = r(15598);
      function s(t) {
        var r = 'function' == typeof Map ? new Map() : void 0;
        return (
          (e.exports = s =
            function (e) {
              if (null === e || !i(e)) return e;
              if ('function' != typeof e)
                throw TypeError(
                  'Super expression must either be null or a function'
                );
              if (void 0 !== r) {
                if (r.has(e)) return r.get(e);
                r.set(e, t);
              }
              function t() {
                return a(e, arguments, n(this).constructor);
              }
              return (
                (t.prototype = Object.create(e.prototype, {
                  constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0,
                  },
                })),
                o(t, e)
              );
            }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports),
          s(t)
        );
      }
      ((e.exports = s),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports));
    },
    17242: (e, t, r) => {
      var n = r(92600)();
      e.exports = n;
      try {
        regeneratorRuntime = n;
      } catch (e) {
        'object' == typeof globalThis
          ? (globalThis.regeneratorRuntime = n)
          : Function('r', 'regeneratorRuntime = r')(n);
      }
    },
    92923: e => {
      'use strict';
      e.exports = JSON.parse(
        '{"name":"openid-client","version":"5.7.1","description":"OpenID Connect Relying Party (RP, Client) implementation for Node.js runtime, supports passportjs","keywords":["auth","authentication","basic","certified","client","connect","dynamic","electron","hybrid","identity","implicit","oauth","oauth2","oidc","openid","passport","relying party","strategy"],"homepage":"https://github.com/panva/openid-client","repository":"panva/openid-client","funding":{"url":"https://github.com/sponsors/panva"},"license":"MIT","author":"Filip Skokan <panva.ip@gmail.com>","exports":{"types":"./types/index.d.ts","import":"./lib/index.mjs","require":"./lib/index.js"},"main":"./lib/index.js","types":"./types/index.d.ts","files":["lib","types/index.d.ts"],"scripts":{"format":"npx prettier --loglevel silent --write ./lib ./test ./certification ./types","test":"mocha test/**/*.test.js"},"dependencies":{"jose":"^4.15.9","lru-cache":"^6.0.0","object-hash":"^2.2.0","oidc-token-hash":"^5.0.3"},"devDependencies":{"@types/node":"^16.18.106","@types/passport":"^1.0.16","base64url":"^3.0.1","chai":"^4.5.0","mocha":"^10.7.3","nock":"^13.5.5","prettier":"^2.8.8","readable-mock-req":"^0.2.2","sinon":"^9.2.4","timekeeper":"^2.3.1"},"standard-version":{"scripts":{"postchangelog":"sed -i \'\' -e \'s/### \\\\[/## [/g\' CHANGELOG.md"},"types":[{"type":"feat","section":"Features"},{"type":"fix","section":"Fixes"},{"type":"chore","hidden":true},{"type":"docs","hidden":true},{"type":"style","hidden":true},{"type":"refactor","section":"Refactor","hidden":false},{"type":"perf","section":"Performance","hidden":false},{"type":"test","hidden":true}]}}'
      );
    },
  }));
