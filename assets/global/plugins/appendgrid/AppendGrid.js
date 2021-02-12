!
function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AppendGrid = t() : e.AppendGrid = t()
}(window, (function() {
    return function(e) {
        var t = {};

        function n(o) {
            if (t[o]) return t[o].exports;
            var r = t[o] = {
                i: o,
                l: !1,
                exports: {}
            };
            return e[o].call(r.exports, r, r.exports, n),
                r.l = !0,
                r.exports
        }
        return n.m = e,
            n.c = t,
            n.d = function(e, t, o) {
                n.o(e, t) || Object.defineProperty(e, t, {
                    enumerable: !0,
                    get: o
                })
            },
            n.r = function(e) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }),
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
            },
            n.t = function(e, t) {
                if (1 & t && (e = n(e)), 8 & t) return e;
                if (4 & t && "object" == typeof e && e && e.__esModule) return e;
                var o = Object.create(null);
                if (n.r(o), Object.defineProperty(o, "default", {
                        enumerable: !0,
                        value: e
                    }), 2 & t && "string" != typeof e)
                    for (var r in e) n.d(o, r,
                        function(t) {
                            return e[t]
                        }.bind(null, r));
                return o
            },
            n.n = function(e) {
                var t = e && e.__esModule ?
                    function() {
                        return e.
                        default
                    } :
                    function() {
                        return e
                    };
                return n.d(t, "a", t),
                    t
            },
            n.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            },
            n.p = "/",
            n(n.s = 0)
    }([function(e, t, n) {
        "use strict";

        function o(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }
        n.r(t);
        var i = function() {
            function e(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                o(this, e),
                    this.name = t,
                    this.icons = {
                        append: null,
                        removeLast: null,
                        insert: null,
                        remove: null,
                        moveUp: null,
                        moveDown: null
                    },
                    this.isTextBased = n
            }
            var t, n, i;
            return t = e,
                (n = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        throw "*generateIcon* is not overrided for *".concat(this.name, "*.")
                    }
                }]) && r(t.prototype, n),
                i && r(t, i),
                e
        }();

        function l(e) {
            return (l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function u(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function a(e, t) {
            return !t || "object" !== l(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function s(e) {
            return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function c(e, t) {
            return (c = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var f = function(e) {
            function t(e) {
                var n;
                return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    n = a(this, s(t).call(this, "icon-default", !0)),
                    Object.assign(n.icons, {
                        append: "＋",
                        removeLast: "－",
                        insert: "↜",
                        remove: "✕",
                        moveUp: "▲",
                        moveDown: "▼"
                    }),
                    e && Object.assign(n.icons, e),
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && c(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createTextNode(this.icons[t] || "");
                        return e.appendChild(n),
                            n
                    }
                }]) && u(n.prototype, o),
                r && u(n, r),
                t
        }(i);

        function p(e) {
            for (var t = arguments.length,
                    n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++) n[o - 1] = arguments[o];
            n && n.length && n.forEach((function(t) {
                if (t) {
                    var n = t.split(/\s+/gi);
                    n && n.length && n.forEach((function(t) {
                        t && e.classList.add(t)
                    }))
                }
            }))
        }

        function d(e) {
            return null == e
        }

        function m(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }

        function y(e) {
            return "[object Object]" === Object.prototype.toString.call(e)
        }

        function h(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null,
                i = document.createElement(e);
            return t && (i.id = t),
                n && (i.name = n),
                o && p(i, o),
                r && (i.type = r),
                i
        }

        function v(e) {
            return (v = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function b(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function w(e, t) {
            return !t || "object" !== v(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function g(e) {
            return (g = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function O(e, t) {
            return (O = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var C = function(e) {
            function t(e) {
                var n;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n = w(this, g(t).call(this, "icon-fontawesome5"));
                var o = {
                    icons: null
                };
                Object.assign(o, e);
                var r = {
                    append: "fa fa-plus",
                    removeLast: "fa fa-minus",
                    insert: "fa fa-reply",
                    remove: "fa fa-times",
                    moveUp: "fa fa-angle-up",
                    moveDown: "fa fa-angle-down"
                };
                return o.icons && Object.assign(r, o.icons),
                    n.icons = r,
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && O(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createElement("i");
                        return p(n, this.icons[t]),
                            e.appendChild(n),
                            n
                    }
                }]) && b(n.prototype, o),
                r && b(n, r),
                t
        }(i);

        function k(e) {
            return (k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function _(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function R(e, t) {
            return !t || "object" !== k(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function P(e) {
            return (P = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function j(e, t) {
            return (j = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var x = function(e) {
            function t(e) {
                var n;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n = R(this, P(t).call(this, "icon-materialdesignicons3"));
                var o = {
                    icons: null
                };
                Object.assign(o, e);
                var r = {
                    append: "mdi mdi-plus",
                    removeLast: "mdi mdi-minus",
                    insert: "mdi mdi-reply",
                    remove: "mdi mdi-close",
                    moveUp: "mdi mdi-chevron-up",
                    moveDown: "mdi mdi-chevron-down"
                };
                return o.icons && Object.assign(r, o.icons),
                    n.icons = r,
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && j(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createElement("span");
                        return p(n, this.icons[t]),
                            e.appendChild(n),
                            n
                    }
                }]) && _(n.prototype, o),
                r && _(n, r),
                t
        }(i);

        function S(e) {
            return (S = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function E(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function B(e, t) {
            return !t || "object" !== S(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function I(e) {
            return (I = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function F(e, t) {
            return (F = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var L = function(e) {
            function t(e) {
                var n;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n = B(this, I(t).call(this, "icon-ionicon4"));
                var o = {
                    icons: null
                };
                Object.assign(o, e);
                var r = {
                    append: "icon ion-md-add",
                    removeLast: "icon ion-md-remove",
                    insert: "icon ion-md-undo",
                    remove: "icon ion-md-close",
                    moveUp: "icon ion-md-arrow-dropup",
                    moveDown: "icon ion-md-arrow-dropdown"
                };
                return o.icons && Object.assign(r, o.icons),
                    n.icons = r,
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && F(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createElement("i");
                        return p(n, this.icons[t]),
                            e.appendChild(n),
                            n
                    }
                }]) && E(n.prototype, o),
                r && E(n, r),
                t
        }(i);

        function T(e) {
            return (T = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function D(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function A(e, t) {
            return !t || "object" !== T(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function N(e) {
            return (N = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function U(e, t) {
            return (U = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var G = function(e) {
            function t(e) {
                var n;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n = A(this, N(t).call(this, "icon-typicons2"));
                var o = {
                    icons: null
                };
                Object.assign(o, e);
                var r = {
                    append: "typcn typcn-plus",
                    removeLast: "typcn typcn-minus",
                    insert: "typcn typcn-arrow-back",
                    remove: "typcn typcn-times",
                    moveUp: "typcn typcn-arrow-sorted-up",
                    moveDown: "typcn typcn-arrow-sorted-down"
                };
                return o.icons && Object.assign(r, o.icons),
                    n.icons = r,
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && U(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createElement("span");
                        return p(n, this.icons[t]),
                            e.appendChild(n),
                            n
                    }
                }]) && D(n.prototype, o),
                r && D(n, r),
                t
        }(i);

        function M(e) {
            return (M = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function q(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function V(e, t) {
            return !t || "object" !== M(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function $(e) {
            return ($ = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function W(e, t) {
            return (W = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var H = function(e) {
            function t(e) {
                var n;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n = V(this, $(t).call(this, "icon-openiconic"));
                var o = {
                    icons: null
                };
                Object.assign(o, e);
                var r = {
                    append: "plus",
                    removeLast: "minus",
                    insert: "share",
                    remove: "x",
                    moveUp: "chevron-top",
                    moveDown: "chevron-bottom"
                };
                return o.icons && Object.assign(r, o.icons),
                    n.icons = r,
                    n
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && W(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "generateIcon",
                    value: function(e, t) {
                        var n = document.createElement("span");
                        return n.className = "oi",
                            n.dataset.glyph = this.icons[t],
                            n.setAttribute("aria-hidden", "true"),
                            e.appendChild(n),
                            n
                    }
                }]) && q(n.prototype, o),
                r && q(n, r),
                t
        }(i);

        function z(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }
        var J = function() {
            function e(t, n) {
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.i18n = t,
                    this.iconFramework = n,
                    this.sectionClasses = {
                        table: null,
                        thead: null,
                        theadRow: null,
                        theadCell: null,
                        tbody: null,
                        tbodyRow: null,
                        tbodyCell: null,
                        tfoot: null,
                        tfootRow: null,
                        tfootCell: null,
                        first: null,
                        last: null,
                        control: null,
                        button: null,
                        buttonGroup: null,
                        append: null,
                        removeLast: null,
                        insert: null,
                        remove: null,
                        moveUp: null,
                        moveDown: null,
                        empty: null
                    }
            }
            var t, n, o;
            return t = e,
                (n = [{
                        key: "applySectionClasses",
                        value: function(e) {
                            for (var t in this.sectionClasses) e[t] && (this.sectionClasses[t] ? this.sectionClasses[t] += " " + e[t] : this.sectionClasses[t] = e[t])
                        }
                    },
                    {
                        key: "getSectionClasses",
                        value: function(e) {
                            return this.sectionClasses[e]
                        }
                    },
                    {
                        key: "createButtonGroup",
                        value: function() {
                            return null
                        }
                    },
                    {
                        key: "generateButton",
                        value: function(e, t, n) {
                            var o = h("button", n, null, null, "button");
                            return o.title = this.i18n[t],
                                p(o, this.getSectionClasses("button"), this.getSectionClasses(t)),
                                e.appendChild(o),
                                this.iconFramework.generateIcon(o, t),
                                o
                        }
                    },
                    {
                        key: "generateControl",
                        value: function(e, t, n, o) {
                            var r = null;
                            if ("select" === t.type)
                                if (r = h("select", n, o), Array.isArray(t.ctrlOptions)) {
                                    if (t.ctrlOptions.length > 0)
                                        if (y(t.ctrlOptions[0]))
                                            for (var i = null,
                                                    l = null,
                                                    u = 0; u < t.ctrlOptions.length; u++) {
                                                d(t.ctrlOptions[u].group) ? l = null : i !== t.ctrlOptions[u].group && (i = t.ctrlOptions[u].group, (l = h("optgroup")).label = i, r.appendChild(l));
                                                var a = h("option");
                                                a.value = t.ctrlOptions[u].value,
                                                    a.innerText = t.ctrlOptions[u].label,
                                                    d(t.ctrlOptions[u].title) || a.setAttribute("title", t.ctrlOptions[u].title),
                                                    null === l ? a.appendTo(r) : a.appendTo(l)
                                            } else
                                                for (var s = 0; s < t.ctrlOptions.length; s++) {
                                                    var c = t.ctrlOptions[s];
                                                    r.options[r.options.length] = new Option(c, c)
                                                }
                                } else if (y(t.ctrlOptions))
                                for (var f in t.ctrlOptions) r.options[r.options.length] = new Option(t.ctrlOptions[f], f);
                            else if ("string" == typeof t.ctrlOptions)
                                for (var m = t.ctrlOptions.split(";"), v = 0; v < m.length; v++) {
                                    var b = m[v].indexOf(":");
                                    r.options[r.options.length] = -1 === b ? new Option(m[v], m[v]) : new Option(m[v].substring(b + 1, m[v].length), m[v].substring(0, b))
                                } else "function" == typeof t.ctrlOptions && t.ctrlOptions(r);
                            else if ("checkbox" === t.type)(r = h("input", n, o, null, "checkbox")).value = 1;
                            else if ("textarea" === t.type) r = h("textarea", n, o);
                            else if (-1 != t.type.search(/^(color|date|datetime|datetime\-local|email|month|number|range|search|tel|time|url|week)$/)) {
                                r = h("input", n, o);
                                try {
                                    r.type = t.type
                                } catch (e) {}
                            } else(r = h("input", n, o)).type = "text";
                            return p(r, this.getSectionClasses("control"), t.ctrlClass),
                                e && e.appendChild(r),
                                r
                        }
                    }
                ]) && z(t.prototype, n),
                o && z(t, o),
                e
        }();

        function K(e) {
            return (K = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function Q(e, t) {
            return !t || "object" !== K(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function X(e) {
            return (X = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function Y(e, t) {
            return (Y = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var Z = function(e) {
            function t(e, n, o) {
                var r;
                return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    (r = Q(this, X(t).call(this, n, o))).name = "ui-default",
                    r
            }
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && Y(e, t)
                }(t, e),
                t
        }(J);

        function ee(e) {
            return (ee = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function te(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function ne(e, t) {
            return !t || "object" !== ee(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function oe(e, t, n) {
            return (oe = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                var o = function(e, t) {
                    for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = re(e)););
                    return e
                }(e, t);
                if (o) {
                    var r = Object.getOwnPropertyDescriptor(o, t);
                    return r.get ? r.get.call(n) : r.value
                }
            })(e, t, n || e)
        }

        function re(e) {
            return (re = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function ie(e, t) {
            return (ie = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var le = function(e) {
            function t(e, n, o) {
                var r;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                (r = ne(this, re(t).call(this, n, o))).name = "ui-bootstrap4";
                var i = {
                    useButtonGroup: !0,
                    sectionClasses: null,
                    sizing: "normal"
                };
                Object.assign(i, e);
                var l = {
                    table: "table",
                    thead: "thead-light",
                    control: "form-control",
                    button: "btn",
                    buttonGroup: "btn-group",
                    append: "btn-outline-secondary",
                    removeLast: "btn-outline-secondary",
                    insert: "btn-outline-secondary",
                    remove: "btn-outline-secondary",
                    moveUp: "btn-outline-secondary",
                    moveDown: "btn-outline-secondary",
                    empty: "text-center"
                };
                return "small" === i.sizing ? (l.table += " table-sm", l.buttonGroup += " btn-group-sm", l.control += " form-control-sm") : "large" === i.sizing && (l.buttonGroup += " btn-group-lg", l.control += " form-control-lg"),
                    i.sectionClasses && Object.assign(l, i.sectionClasses),
                    r.applySectionClasses(l),
                    r.uiParams = i,
                    r
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && ie(e, t)
                }(t, e),
                n = t,
                (o = [{
                        key: "createButtonGroup",
                        value: function() {
                            if (this.uiParams.useButtonGroup) {
                                var e = document.createElement("div");
                                return p(e, this.getSectionClasses("buttonGroup")),
                                    e
                            }
                            return oe(re(t.prototype), "createButtonGroup", this).call(this)
                        }
                    },
                    {
                        key: "generateControl",
                        value: function(e, n, o, r) {
                            var i = null;
                            if ("checkbox" === n.type) {
                                var l = h("div", null, null, "form-check");
                                e.appendChild(l),
                                    (i = h("input", o, r, "form-check-input position-static")).type = "checkbox",
                                    i.value = 1,
                                    l.appendChild(i)
                            } else "readonly" === n.type ? (p(i = h("input", o, r, null, "text"), this.getSectionClasses("control"), n.ctrlClass), i.classList.remove("form-control"), i.classList.add("form-control-plaintext"), i.readOnly = !0, e.appendChild(i)) : i = oe(re(t.prototype), "generateControl", this).call(this, e, n, o, r);
                            return i
                        }
                    }
                ]) && te(n.prototype, o),
                r && te(n, r),
                t
        }(J);

        function ue(e) {
            return (ue = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function ae(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function se(e, t) {
            return !t || "object" !== ue(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function ce(e, t, n) {
            return (ce = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                var o = function(e, t) {
                    for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = fe(e)););
                    return e
                }(e, t);
                if (o) {
                    var r = Object.getOwnPropertyDescriptor(o, t);
                    return r.get ? r.get.call(n) : r.value
                }
            })(e, t, n || e)
        }

        function fe(e) {
            return (fe = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function pe(e, t) {
            return (pe = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var de = function(e) {
            function t(e, n, o) {
                var r;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                (r = se(this, fe(t).call(this, n, o))).name = "ui-bulma";
                var i = {
                    useButtonGroup: !0,
                    sectionClasses: null,
                    sizing: "normal"
                };
                Object.assign(i, e);
                var l = {
                    table: "table",
                    control: "input",
                    button: "button",
                    buttonGroup: "field has-addons",
                    append: "is-outlined",
                    removeLast: "is-outlined",
                    insert: "is-outlined",
                    remove: "is-outlined",
                    moveUp: "is-outlined",
                    moveDown: "is-outlined",
                    empty: "has-text-centered"
                };
                return "small" === i.sizing ? (l.table += " is-narrow", l.control += " is-small", l.button += " is-small") : "medium" === i.sizing ? (l.control += " is-medium", l.button += " is-medium") : "large" === i.sizing && (l.control += " is-large", l.button += " is-large"),
                    i.sectionClasses && Object.assign(l, i.sectionClasses),
                    r.applySectionClasses(l),
                    r.uiParams = i,
                    r
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && pe(e, t)
                }(t, e),
                n = t,
                (o = [{
                        key: "generateButton",
                        value: function(e, t, n) {
                            var o = h("button", n, null, null, "button");
                            o.title = this.i18n[t],
                                p(o, this.getSectionClasses("button"), this.getSectionClasses(t));
                            var r = null;
                            if (this.iconFramework.isTextBased ? r = o : ((r = document.createElement("span")).classList.add("icon"), o.appendChild(r)), this.iconFramework.generateIcon(r, t), this.uiParams.useButtonGroup) {
                                var i = document.createElement("p");
                                i.classList.add("control"),
                                    i.appendChild(o),
                                    e.appendChild(i)
                            } else e.appendChild(o);
                            return o
                        }
                    },
                    {
                        key: "createButtonGroup",
                        value: function() {
                            if (this.uiParams.useButtonGroup) {
                                var e = document.createElement("div");
                                return p(e, this.getSectionClasses("buttonGroup")),
                                    e
                            }
                            return ce(fe(t.prototype), "createButtonGroup", this).call(this)
                        }
                    },
                    {
                        key: "generateControl",
                        value: function(e, n, o, r) {
                            var i = null;
                            if ("select" === n.type) {
                                var l = h("div", null, null, "select");
                                "small" === this.uiParams.sizing ? l.classList.add("is-small") : "medium" === this.uiParams.sizing ? l.classList.add("is-medium") : "large" === this.uiParams.sizing && l.classList.add("is-large"),
                                    e.appendChild(l),
                                    i = ce(fe(t.prototype), "generateControl", this).call(this, null, n, o, r),
                                    l.appendChild(i)
                            } else if ("checkbox" === n.type) {
                                var u = h("label", null, null, "checkbox");
                                e.appendChild(u),
                                    (i = h("input", o, r, null, "checkbox")).value = 1,
                                    u.appendChild(i)
                            } else "readonly" === n.type ? (p(i = h("input", o, r, null, "text"), this.getSectionClasses("control"), n.ctrlClass), i.classList.add("is-static"), i.readOnly = !0, e.appendChild(i)) : i = ce(fe(t.prototype), "generateControl", this).call(this, e, n, o, r);
                            return i
                        }
                    }
                ]) && ae(n.prototype, o),
                r && ae(n, r),
                t
        }(J);

        function me(e) {
            return (me = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
        }

        function ye(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }

        function he(e, t) {
            return !t || "object" !== me(t) && "function" != typeof t ?
                function(e) {
                    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e) : t
        }

        function ve(e, t, n) {
            return (ve = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                var o = function(e, t) {
                    for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = be(e)););
                    return e
                }(e, t);
                if (o) {
                    var r = Object.getOwnPropertyDescriptor(o, t);
                    return r.get ? r.get.call(n) : r.value
                }
            })(e, t, n || e)
        }

        function be(e) {
            return (be = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function we(e, t) {
            return (we = Object.setPrototypeOf ||
                function(e, t) {
                    return e.__proto__ = t,
                        e
                })(e, t)
        }
        var ge = function(e) {
            function t(e, n, o) {
                var r;
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                (r = he(this, be(t).call(this, n, o))).name = "ui-foundation6";
                var i = {
                    useButtonGroup: !0,
                    sectionClasses: null
                };
                Object.assign(i, e);
                var l = {
                    button: "button",
                    buttonGroup: "button-group"
                };
                return i.sectionClasses && Object.assign(l, i.sectionClasses),
                    r.applySectionClasses(l),
                    r.uiParams = i,
                    r
            }
            var n, o, r;
            return function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        t && we(e, t)
                }(t, e),
                n = t,
                (o = [{
                    key: "createButtonGroup",
                    value: function() {
                        if (this.uiParams.useButtonGroup) {
                            var e = document.createElement("div");
                            return p(e, this.getSectionClasses("buttonGroup")),
                                e
                        }
                        return ve(be(t.prototype), "createButtonGroup", this).call(this)
                    }
                }]) && ye(n.prototype, o),
                r && ye(n, r),
                t
        }(J);

        function Oe(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }
        var Ce = function() {
            function e(t) {
                !
                function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e);
                var n = this;
                Object.assign(n, {
                    uniqueIndex: 0,
                    rowOrder: [],
                    isDataLoaded: !1,
                    visibleCount: 0,
                    finalColSpan: 0,
                    hideLastColumn: !1,
                    settings: null,
                    tbWhole: null,
                    tbBody: null,
                    iconFramework: null,
                    uiFramework: null
                });
                var o = Object.assign({},
                    t);
                n.settings = o;
                var r = null;
                if (!(r = "string" == typeof o.element ? document.getElementById(o.element) : o.element) || !r.tagName || "TABLE" !== r.tagName) throw "*element* is not defined or is not a table DOM element.";
                if (n.tbWhole = r, r.innerHTML = "", "fontawesome5" === o.iconFramework) n.iconFramework = new C(o.iconParams);
                else if ("ionicon4" === o.iconFramework) n.iconFramework = new L(o.iconParams);
                else if ("materialdesignicons3" === o.iconFramework) n.iconFramework = new x(o.iconParams);
                else if ("openiconic" === o.iconFramework) n.iconFramework = new H(o.iconParams);
                else if ("typicons2" === o.iconFramework) n.iconFramework = new G(o.iconParams);
                else {
                    if (o.iconFramework && "default" !== o.iconFramework) throw "Unknown Icon framework *".concat(o.iconFramework, "*.");
                    n.iconFramework = new f(o.iconParams)
                }
                if ("bootstrap4" === o.uiFramework) n.uiFramework = new le(o.uiParams, o.i18n, n.iconFramework);
                else if ("bulma" === o.uiFramework) n.uiFramework = new de(o.uiParams, o.i18n, n.iconFramework);
                else if ("foundation6" === o.uiFramework) n.uiFramework = new ge(o.uiParams, o.i18n, n.iconFramework);
                else {
                    if (o.uiFramework && "default" !== o.uiFramework) throw "Unknown UI framework *".concat(o.uiFramework, "*.");
                    n.uiFramework = new Z(o.uiParams, o.i18n, n.iconFramework)
                }
                d(o.idPrefix) && (r.id ? o.idPrefix = r.id : o.idPrefix = "ag" + (new Date).getTime()),
                    o.sectionClasses && n.uiFramework.applySectionClasses(o.sectionClasses),
                    p(r, n.uiFramework.getSectionClasses("table"));
                var i = n.createElement("thead");
                r.appendChild(i);
                var l, u = n.createElement("tr", "theadRow");
                i.appendChild(u);
                var a = 0;
                o.hideRowNumColumn || (l = n.createElement("th", "theadCell"), u.appendChild(l), a++);
                for (var s = 0,
                        c = 0; c < o.columns.length; c++)
                    if ("hidden" !== o.columns[c].type) {
                        if (0 === s) {
                            if (l = n.createElement("th", "theadCell"), u.appendChild(l), p(l, o.columns[c].displayClass), !d(o.columns[c].displayCss))
                                for (var m in o.columns[c].displayCss) l.style[m] = o.columns[c].displayCss[m];
                            o.columns[c].headerSpan > 1 && (l.setAttribute("colSpan", o.columns[c].headerSpan), s = o.columns[c].headerSpan - 1),
                                "function" == typeof o.columns[c].display ? o.columns[c].display(l) : o.columns[c].display && (l.innerText = o.columns[c].display)
                        } else s--;
                        a++
                    }
                l = n.createElement("th", "theadCell"),
                    o.hideButtons.insert && o.hideButtons.remove && o.hideButtons.moveUp && o.hideButtons.moveDown ? (n.hideLastColumn = !0, l.style.display = "none") : a++, !n.hideLastColumn && o.rowButtonsInFront ? o.hideRowNumColumn ? u.insertBefore(l, u.firstChild) : u.insertBefore(l, u.childNodes[1]) : u.appendChild(l),
                    n.finalColSpan = a;
                var y = n.createElement("tbody");
                r.appendChild(y),
                    n.tbBody = y;
                var v = n.createElement("tfoot");
                r.appendChild(v),
                    u = n.createElement("tr", "tfootRow"),
                    v.appendChild(u),
                    (l = n.createElement("td", "tfootCell")).colSpan = n.finalColSpan,
                    u.appendChild(l);
                var b = o.idPrefix + "_rowOrder",
                    w = h("input", b, b, null, "hidden");
                if (l.appendChild(w), o.hideButtons.append && o.hideButtons.removeLast) u.style.display = "none";
                else {
                    var g = n.uiFramework.createButtonGroup();
                    if (g ? l.appendChild(g) : g = l, !o.hideButtons.append) n.uiFramework.generateButton(g, "append").addEventListener("click", (function(e) {
                        n.insertRow(1)
                    }));
                    if (!o.hideButtons.removeLast) n.uiFramework.generateButton(g, "removeLast").addEventListener("click", (function(e) {
                        n.removeRow()
                    }))
                }
                this.showEmptyMessage(),
                    n.settings = o
            }
            var t, n, o;
            return t = e,
                (n = [{
                        key: "createElement",
                        value: function(e, t, n) {
                            return h(e, n, null, this.uiFramework.getSectionClasses(t || e))
                        }
                    },
                    {
                        key: "loadData",
                        value: function(e) {
                            var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            if (!Array.isArray(e) || !e.length) throw "*records* should be in array format!";
                            var n = this,
                                o = n.settings;
                            n.tbBody.innerHTML = "",
                                n.rowOrder.length = 0,
                                n.uniqueIndex = 0;
                            for (var r = n.insertRow(e.length), i = 0; i < r.addedRows.length; i++) {
                                for (var l = 0; l < o.columns.length; l++) n.setCtrlValue(l, n.rowOrder[i], e[i][o.columns[l].name]);
                                "function" == typeof o.rowDataLoaded && o.rowDataLoaded(n.tbWhole, e[i], i, n.rowOrder[i])
                            }
                            n.isDataLoaded = !0,
                                t && (n.settings.initData = null),
                                "function" == typeof o.dataLoaded && o.dataLoaded(n.tbWhole, e)
                        }
                    },
                    {
                        key: "insertRow",
                        value: function(e, t, n) {
                            var o, r, i = this,
                                l = i.settings,
                                u = i.uiFramework,
                                a = i.tbBody,
                                s = [],
                                c = null,
                                f = !1,
                                y = e,
                                v = !1;
                            if (Array.isArray(e) && (y = e.length, v = !0), m(n)) {
                                for (var b = 0; b < i.rowOrder.length; b++)
                                    if (i.rowOrder[b] === n) {
                                        t = b,
                                            0 !== b && (c = b - 1);
                                        break
                                    }
                            } else m(t) ? t >= i.rowOrder.length ? t = null : c = t - 1 : 0 !== i.rowOrder.length && (t = null, c = i.rowOrder.length - 1);
                            0 === i.rowOrder.length && (a.innerHTML = "");
                            for (var w = function(n) {
                                        if (0 < l.maxRowsAllowed && i.rowOrder.length >= l.maxRowsAllowed) return f = !0,
                                            "break";
                                        var c = ++i.uniqueIndex,
                                            y = [];
                                        if ((o = i.createElement("tr", "tbodyRow", l.idPrefix + "_$row_" + c)).dataset.uniqueIndex = c, m(t)) {
                                            var b = t + n;
                                            i.rowOrder.splice(b, 0, c),
                                                a.insertBefore(o, a.childNodes[b])
                                        } else i.rowOrder.push(c),
                                            a.appendChild(o);
                                        s.push(c),
                                            l.hideRowNumColumn || ((r = i.createElement("td", "tbodyCell", l.idPrefix + "_$rowNum_" + c)).innerText = "" + i.rowOrder.length, p(r, u.getSectionClasses("first")), o.appendChild(r));
                                        for (var w = 0; w < l.columns.length; w++)
                                            if ("hidden" !== l.columns[w].type) {
                                                if (r = i.createElement("td", "tbodyCell"), o.appendChild(r), p(r, l.columns[w].cellClass), !d(l.columns[w].cellCss))
                                                    for (var g in l.columns[w].cellCss) r.style[g] = l.columns[w].cellCss[g];
                                                var O = l.idPrefix + "_" + l.columns[w].name + "_" + c,
                                                    C = void 0;
                                                C = "function" == typeof l.nameFormatter ? l.nameFormatter(l.idPrefix, l.columns[w].name, c) : O;
                                                var k = null,
                                                    _ = "custom" === l.columns[w].type;
                                                if (_) "function" == typeof l.columns[w].customBuilder && (k = l.columns[w].customBuilder(r, l.idPrefix, l.columns[w].name, c));
                                                else {
                                                    if (k = i.uiFramework.generateControl(r, l.columns[w], O, C), !d(l.columns[w].ctrlAttr))
                                                        for (var R in l.columns[w].ctrlAttr) k.setAttribute(R, l.columns[w].ctrlAttr[R]);
                                                    if (!d(l.columns[w].ctrlCss))
                                                        for (var P in l.columns[w].ctrlCss) k.style[P] = l.columns[w].ctrlCss[P];
                                                    if (l.columns[w].events) {
                                                        k.dataset.columnName = l.columns[w].name,
                                                            k.dataset.uniqueIndex = c;
                                                        var j = function(e) {
                                                            var t = l.columns[w].events[e];
                                                            k.addEventListener(e, (function(e) {
                                                                e.columnName = e.currentTarget.dataset.columnName,
                                                                    e.uniqueIndex = parseInt(e.currentTarget.dataset.uniqueIndex),
                                                                    t(e)
                                                            }))
                                                        };
                                                        for (var x in l.columns[w].events) j(x)
                                                    }
                                                }
                                                v ? i.setCtrlValue(w, c, e[n][l.columns[w].name]) : d(l.columns[w].value) || i.setCtrlValue(w, c, l.columns[w].value),
                                                    _ || "function" != typeof l.columns[w].ctrlAdded || l.columns[w].ctrlAdded(k, r, c)
                                            } else y.push(w);
                                        if (r = i.createElement("td", "tbodyCell", l.idPrefix + "_$rowButton_" + c), i.hideLastColumn || !l.rowButtonsInFront ? o.appendChild(r) : l.hideRowNumColumn ? o.insertBefore(r, o.firstChild) : o.insertBefore(r, o.childNodes[1]), y.forEach((function(t) {
                                                var o, u = l.columns[t].name,
                                                    a = l.idPrefix + "_" + u + "_" + c;
                                                o = "function" == typeof l.nameFormatter ? l.nameFormatter(l.idPrefix, u, c) : a,
                                                    r.appendChild(h("input", a, o, null, "hidden")),
                                                    v ? i.setCtrlValue(t, c, e[n][u]) : d(l.columns[t].value) || i.setCtrlValue(t, c, l.columns[t].value)
                                            })), i.hideLastColumn) r.style.display = "none";
                                        else if (l.columns.length > i.visibleCount) {
                                            p(r, u.getSectionClasses("last"));
                                            var S = u.createButtonGroup();
                                            S ? r.appendChild(S) : S = r, ["insert", "remove", "moveUp", "moveDown"].forEach((function(e) {
                                                if (!l.hideButtons[e]) {
                                                    var t = l.idPrefix + "_$" + e + "_" + c,
                                                        n = u.generateButton(S, e, t);
                                                    n.dataset.uniqueIndex = c,
                                                        n.addEventListener("click", (function(t) {
                                                            var n = parseInt(t.currentTarget.dataset.uniqueIndex);
                                                            i.rowButtonActions(e, n)
                                                        }))
                                                }
                                            }))
                                        }
                                    },
                                    g = 0; g < y && "break" !== w(g); g++);
                            return i.saveSetting(),
                                l.hideRowNumColumn || d(t) || i.sortSequence(t),
                                m(t) ? "function" == typeof l.afterRowInserted && l.afterRowInserted(i.tbWhole, c, s) : "function" == typeof l.afterRowAppended && l.afterRowAppended(i.tbWhole, c, s),
                                f && "function" == typeof l.maxNumRowsReached && l.maxNumRowsReached(i.tbWhole), {
                                    addedRows: s,
                                    parentIndex: c,
                                    rowIndex: t
                                }
                        }
                    },
                    {
                        key: "removeRow",
                        value: function(e, t, n) {
                            var o = this.settings,
                                r = this.tbBody;
                            if (m(t))
                                for (var i = 0; i < this.rowOrder.length; i++)
                                    if (this.rowOrder[i] === t) {
                                        e = i;
                                        break
                                    }
                            m(e) ? (n || "function" != typeof o.beforeRowRemove || o.beforeRowRemove(this.tbWhole, e)) && (this.rowOrder.splice(e, 1), r.removeChild(r.childNodes[e]), this.saveSetting(), o.hideRowNumColumn || this.sortSequence(e), "function" == typeof o.afterRowRemoved && o.afterRowRemoved(this.tbWhole, e)) : (n || "function" != typeof o.beforeRowRemove || o.beforeRowRemove(this.tbWhole, this.rowOrder.length - 1)) && (t = this.rowOrder.pop(), r.removeChild(r.lastChild), this.saveSetting(), "function" == typeof o.afterRowRemoved && o.afterRowRemoved(this.tbWhole, null)),
                                0 === this.rowOrder.length && this.showEmptyMessage()
                        }
                    },
                    {
                        key: "moveUpRow",
                        value: function(e, t) {
                            var n = this.settings,
                                o = this.tbBody,
                                r = null;
                            if (m(e) && e > 0 && e < this.rowOrder.length ? (r = e, t = this.rowOrder[e]) : m(t) && (r = this.findRowIndex(t)), !d(r) && r > 0) {
                                var i = this.rowOrder[r - 1],
                                    l = document.getElementById(n.idPrefix + "_$row_" + t),
                                    u = document.getElementById(n.idPrefix + "_$row_" + i);
                                if (o.removeChild(l), o.insertBefore(l, u), this.rowOrder[r] = i, this.rowOrder[r - 1] = t, !n.hideRowNumColumn) {
                                    var a = document.getElementById(n.idPrefix + "_$rowNum_" + t),
                                        s = document.getElementById(n.idPrefix + "_$rowNum_" + i),
                                        c = s.innerHTML;
                                    s.innerHTML = a.innerHTML,
                                        a.innerHTML = c
                                }
                                this.saveSetting(),
                                    document.getElementById(n.idPrefix + "_$moveUp_" + t).blur(),
                                    document.getElementById(n.idPrefix + "_$moveUp_" + i).focus(),
                                    "function" == typeof n.afterRowSwapped && n.afterRowSwapped(this.tbWhole, r, r - 1)
                            }
                        }
                    },
                    {
                        key: "moveDownRow",
                        value: function(e, t) {
                            var n = this.settings,
                                o = this.tbBody,
                                r = null;
                            if (m(e) && e >= 0 && e < this.rowOrder.length - 1 ? (r = e, t = this.rowOrder[e]) : m(t) && (r = this.findRowIndex(t)), !d(r) && r !== this.rowOrder.length - 1) {
                                var i = this.rowOrder[r + 1],
                                    l = document.getElementById(n.idPrefix + "_$row_" + t),
                                    u = document.getElementById(n.idPrefix + "_$row_" + i);
                                if (o.removeChild(u), o.insertBefore(u, l), this.rowOrder[r] = i, this.rowOrder[r + 1] = t, !n.hideRowNumColumn) {
                                    var a = document.getElementById(n.idPrefix + "_$rowNum_" + t),
                                        s = document.getElementById(n.idPrefix + "_$rowNum_" + i),
                                        c = s.innerHTML;
                                    s.innerHTML = a.innerHTML,
                                        a.innerHTML = c
                                }
                                this.saveSetting(),
                                    document.getElementById(n.idPrefix + "_$moveDown_" + t).blur(),
                                    document.getElementById(n.idPrefix + "_$moveDown_" + i).focus(),
                                    "function" == typeof n.afterRowSwapped && n.afterRowSwapped(this.tbWhole, r, r + 1)
                            }
                        }
                    },
                    {
                        key: "setCtrlValue",
                        value: function(e, t, n) {
                            var o = this.settings,
                                r = o.columns[e].type,
                                i = o.columns[e].name;
                            if ("custom" === r) "function" == typeof o.columns[e].customSetter && o.columns[e].customSetter(o.idPrefix, i, t, n);
                            else {
                                var l = this.getCellCtrl(o.idPrefix, i, t);
                                "checkbox" === r ? "boolean" == typeof n ? l.checked = n : m(n) ? l.checked = 0 !== n : l.checked = !d(n) : l.value = d(n) ? "" : n
                            }
                        }
                    },
                    {
                        key: "getCellCtrl",
                        value: function(e, t, n) {
                            return document.getElementById(e + "_" + t + "_" + n)
                        }
                    },
                    {
                        key: "getCtrlValue",
                        value: function(e, t) {
                            var n = this.settings,
                                o = n.columns[e];
                            if ("custom" === o.type) {
                                if ("function" == typeof o.customGetter) return o.customGetter(n.idPrefix, o.name, t);
                                throw "*customGetter* of column *".concat(o.name, "* is not defined.")
                            }
                            var r = this.getCellCtrl(n.idPrefix, o.name, t);
                            return null === r ? null : "checkbox" === o.type ? r.checked ? 1 : 0 : r.value
                        }
                    },
                    {
                        key: "getRowValue",
                        value: function(e, t) {
                            var n = this,
                                o = {},
                                r = d(t) ? "" : "_" + t;
                            return n.settings.columns.forEach((function(t, i) {
                                    var l = t.name + r;
                                    o[l] = n.getCtrlValue(i, e)
                                })),
                                o
                        }
                    },
                    {
                        key: "getColumnIndex",
                        value: function(e) {
                            for (var t = this.settings.columns,
                                    n = 0; n < t.length; n++)
                                if (t[n].name === e) return n;
                            return null
                        }
                    },
                    {
                        key: "isRowEmpty",
                        value: function(e) {
                            for (var t = this.settings.columns,
                                    n = 0; n < t.length; n++) {
                                var o = t[n].emptyCriteria,
                                    r = this.getCtrlValue(n, e);
                                if ("function" == typeof o) {
                                    if (!o(r)) return !1
                                } else {
                                    var i = null;
                                    if (d(o)) {
                                        var l = t[n].type;
                                        if ("checkbox" === l) i = 0;
                                        else if ("select" === l) {
                                            var u = this.getCellCtrl(this.settings.idPrefix, t[n].name, e).options;
                                            i = u.length > 0 ? u[0].value : ""
                                        } else i = ""
                                    } else i = o;
                                    if (r !== i) return !1
                                }
                            }
                            return !0
                        }
                    },
                    {
                        key: "findRowIndex",
                        value: function(e) {
                            for (var t = 0; t < this.rowOrder.length; t++)
                                if (this.rowOrder[t] === e) return t;
                            return null
                        }
                    },
                    {
                        key: "saveSetting",
                        value: function() {
                            document.getElementById(this.settings.idPrefix + "_rowOrder").value = this.rowOrder.join()
                        }
                    },
                    {
                        key: "showEmptyMessage",
                        value: function() {
                            this.tbBody.innerHTML = "";
                            var e = this.createElement("tr", "tbodyRow");
                            this.tbBody.appendChild(e);
                            var t = this.createElement("td", "tbodyCell");
                            t.setAttribute("colspan", this.finalColSpan),
                                p(t, this.uiFramework.getSectionClasses("empty")),
                                t.innerText = this.settings.i18n.rowEmpty,
                                e.appendChild(t)
                        }
                    },
                    {
                        key: "sortSequence",
                        value: function(e) {
                            for (var t = e || 0; t < this.rowOrder.length; t++) document.getElementById(this.settings.idPrefix + "_$rowNum_" + this.rowOrder[t]).innerText = "" + (t + 1)
                        }
                    },
                    {
                        key: "rowButtonActions",
                        value: function(e, t) {
                            "insert" === e ? this.insertRow(1, null, t) : "remove" === e ? this.removeRow(null, t) : "moveUp" === e ? this.moveUpRow(null, t) : "moveDown" === e && this.moveDownRow(null, t)
                        }
                    }
                ]) && Oe(t.prototype, n),
                o && Oe(t, o),
                e
        }();

        function ke(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value" in o && (o.writable = !0),
                    Object.defineProperty(e, o.key, o)
            }
        }
        var _e = new WeakMap,
            Re = {
                element: null,
                uiFramework: null,
                uiParams: null,
                iconFramework: null,
                iconParams: null,
                initRows: 3,
                idPrefix: null,
                initData: null,
                columns: [],
                i18n: null,
                hideButtons: null,
                hideRowNumColumn: !1,
                rowButtonsInFront: !1,
                rowCountName: "_RowCount",
                sectionClasses: null,
                maxRowsAllowed: 0
            },
            Pe = {
                nameFormatter: null,
                dataLoaded: null,
                rowDataLoaded: null,
                afterRowAppended: null,
                afterRowInserted: null,
                afterRowSwapped: null,
                beforeRowRemove: null,
                afterRowRemoved: null,
                maxNumRowsReached: null
            },
            je = {
                type: "text",
                name: null,
                value: null,
                display: null,
                displayCss: null,
                displayClass: null,
                displayTooltip: null,
                headerSpan: 1,
                cellCss: null,
                cellClass: null,
                ctrlAttr: null,
                ctrlProp: null,
                ctrlCss: null,
                ctrlClass: null,
                ctrlOptions: null,
                invisible: !1,
                emptyCriteria: null,
                customBuilder: null,
                customGetter: null,
                customSetter: null,
                events: null,
                ctrlAdded: null
            },
            xe = function() {
                function e(t) {
                    !
                    function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e);
                    var n = Object.assign({},
                            Re, Pe, t),
                        o = {
                            append: "Append Row",
                            removeLast: "Remove Last Row",
                            insert: "Insert Row Above",
                            remove: "Remove Current Row",
                            moveUp: "Move Up",
                            moveDown: "Move Down",
                            rowEmpty: "This Grid Is Empty"
                        };
                    n.i18n && Object.assign(o, n.i18n),
                        n.i18n = o;
                    var r = {
                        append: !1,
                        removeLast: !1,
                        insert: !1,
                        remove: !1,
                        moveUp: !1,
                        moveDown: !1
                    };
                    n.hideButtons && Object.assign(r, n.hideButtons),
                        n.hideButtons = r;
                    for (var i = 0; i < n.columns.length; i++) {
                        var l = Object.assign({},
                            je, n.columns[i]);
                        n.columns[i] = l
                    }
                    var u = new Ce(n);
                    _e.set(this, u),
                        Array.isArray(n.initData) ? u.loadData(n.initData, !0) : n.initRows > 0 && u.insertRow(n.initRows)
                }
                var t, n, o;
                return t = e,
                    (n = [{
                            key: "appendRow",
                            value: function(e) {
                                return _e.get(this).insertRow(e || 1).addedRows
                            }
                        },
                        {
                            key: "insertRow",
                            value: function(e, t) {
                                return _e.get(this).insertRow(e, t).addedRows
                            }
                        },
                        {
                            key: "removeRow",
                            value: function(e) {
                                _e.get(this).removeRow(e)
                            }
                        },
                        {
                            key: "moveUpRow",
                            value: function(e) {
                                _e.get(this).moveUpRow(e)
                            }
                        },
                        {
                            key: "moveDownRow",
                            value: function(e) {
                                _e.get(this).moveDownRow(e)
                            }
                        },
                        {
                            key: "load",
                            value: function(e) {
                                _e.get(this).loadData(e)
                            }
                        },
                        {
                            key: "getAllValue",
                            value: function(e) {
                                var t = _e.get(this),
                                    n = e ? {} : [];
                                return t.rowOrder.forEach((function(o, r) {
                                        e ? Object.assign(n, t.getRowValue(o, r)) : n.push(t.getRowValue(o))
                                    })),
                                    e && (n[t.settings.rowCountName] = t.rowOrder.length),
                                    n
                            }
                        },
                        {
                            key: "getUniqueIndex",
                            value: function(e) {
                                var t = _e.get(this).rowOrder;
                                return e >= 0 && e < t.length ? t[e] : null
                            }
                        },
                        {
                            key: "getRowIndex",
                            value: function(e) {
                                for (var t = _e.get(this).rowOrder, n = 0; n < t.length; n++)
                                    if (t[n] === e) return n;
                                return null
                            }
                        },
                        {
                            key: "getRowCount",
                            value: function() {
                                return _e.get(this).rowOrder.length
                            }
                        },
                        {
                            key: "getRowOrder",
                            value: function() {
                                return _e.get(this).rowOrder.slice()
                            }
                        },
                        {
                            key: "getRowValue",
                            value: function(e) {
                                var t = this.getUniqueIndex(e);
                                return null !== t ? _e.get(this).getRowValue(t) : null
                            }
                        },
                        {
                            key: "getCtrlValue",
                            value: function(e, t) {
                                var n = _e.get(this).getColumnIndex(e),
                                    o = this.getUniqueIndex(t);
                                return null !== n && null !== o ? _e.get(this).getCtrlValue(n, o) : null
                            }
                        },
                        {
                            key: "setCtrlValue",
                            value: function(e, t, n) {
                                var o = _e.get(this).getColumnIndex(e),
                                    r = this.getUniqueIndex(t);
                                if (null !== o && null !== r) return _e.get(this).setCtrlValue(o, r, n)
                            }
                        },
                        {
                            key: "getColumns",
                            value: function() {
                                return _e.get(this).settings.columns.slice()
                            }
                        },
                        {
                            key: "getCellCtrl",
                            value: function(e, t) {
                                var n = this.getUniqueIndex(t);
                                return this.getCellCtrlByUniqueIndex(e, n)
                            }
                        },
                        {
                            key: "getCellCtrlByUniqueIndex",
                            value: function(e, t) {
                                var n = _e.get(this);
                                return null !== n.getColumnIndex(e) && m(t) ? n.getCellCtrl(n.settings.idPrefix, e, t) : null
                            }
                        },
                        {
                            key: "isRowEmpty",
                            value: function(e) {
                                var t = this.getUniqueIndex(e);
                                return null === t || _e.get(this).isRowEmpty(t)
                            }
                        },
                        {
                            key: "removeEmptyRows",
                            value: function() {
                                for (var e = _e.get(this), t = this.getRowOrder(), n = 0; n < t.length; n++) e.isRowEmpty(t[n]) && e.removeRow(null, t[n], !0)
                            }
                        }
                    ]) && ke(t.prototype, n),
                    o && ke(t, o),
                    e
            }();
        t.
        default = xe
    }]).
    default
}));