(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.locI18next = factory());
}(this, (function () { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var defaults = {
  selectorAttr: 'data-i18n',
  targetAttr: 'i18n-target',
  optionsAttr: 'i18n-options',
  useOptionsAttr: false,
  parseDefaultValueFromContent: true,
  document: document
};

function init(i18next) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = _objectSpread({}, defaults, options);

  var extendDefault = function extendDefault(o, val) {
    return options.parseDefaultValueFromContent ? _objectSpread({}, o, {
      defaultValue: val
    }) : o;
  };

  function parse(elem, key, opts) {
    var attr = 'text';

    if (key.indexOf('[') == 0) {
      var parts = key.split(']');
      key = parts[1];
      attr = parts[0].substr(1, parts[0].length - 1);
    }

    key = key.indexOf(';') == key.length - 1 ? key.substr(0, key.length - 2) : key;

    if (attr === 'html') {
      elem.innerHTML = i18next.t(key, extendDefault(opts, elem.innerHTML));
    } else if (attr === 'text') {
      elem.textContent = i18next.t(key, extendDefault(opts, elem.textContent));
    } else if (attr === 'prepend') {
      var startIdx = elem.innerHTML.indexOf('<loc-i18n>');
      var endIdx = elem.innerHTML.indexOf('</loc-i18n>') + 11;

      if (startIdx > -1 && endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, startIdx), elem.innerHTML.slice(endIdx)].join('');
      }

      elem.innerHTML = ['<loc-i18n>', i18next.t(key, extendDefault(opts, elem.innerHTML)), '</loc-i18n>', elem.innerHTML].join('');
    } else if (attr === 'append') {
      var _startIdx = elem.innerHTML.indexOf('<loc-i18n>');

      var _endIdx = elem.innerHTML.indexOf('</loc-i18n>') + 11;

      if (_startIdx > -1 && _endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, _startIdx), elem.innerHTML.slice(_endIdx)].join('');
      }

      elem.innerHTML = [elem.innerHTML, '<loc-i18n>', i18next.t(key, extendDefault(opts, elem.innerHTML), '</loc-i18n>')].join('');
    } else if (attr.indexOf('data-') === 0) {
      var dataAttr = attr.substr('data-'.length);
      var translated = i18next.t(key, extendDefault(opts, elem.getAttribute(dataAttr))); // we change into the data cache

      elem.setAttribute(dataAttr, translated); // we change into the dom

      elem.setAttribute(attr, translated);
    } else {
      elem.setAttribute(attr, i18next.t(key, extendDefault(opts, elem.getAttribute(attr))));
    }
  }

  ;

  function relaxedJsonParse(badJSON) {
    return JSON.parse(badJSON.replace(/:\s*"([^"]*)"/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, '@colon@') + '"';
    }).replace(/:\s*'([^']*)'/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, '@colon@') + '"';
    }).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ').replace(/@colon@/g, ':'));
  }

  function _loc(elem, opts) {
    var key = elem.getAttribute(options.selectorAttr); //        if (!key && typeof key !== 'undefined' && key !== false)
    //            key = elem.textContent || elem.innerHTML;

    if (!key) return;
    var target = elem,
        targetSelector = elem.getAttribute(options.targetAttr);
    if (targetSelector != null) target = elem.querySelector(targetSelector) || elem;
    if (!opts && options.useOptionsAttr === true) opts = relaxedJsonParse(elem.getAttribute(options.optionsAttr) || '{}');
    opts = opts || {};

    if (key.indexOf(';') >= 0) {
      var keys = key.split(';');

      for (var ix = 0, l_ix = keys.length; ix < l_ix; ix++) {
        if (keys[ix] != '') parse(target, keys[ix], opts);
      }
    } else {
      parse(target, key, opts);
    }

    if (options.useOptionsAttr === true) {
      var clone = {};
      clone = _objectSpread({
        clone: clone
      }, opts);
      delete clone.lng;
      elem.setAttribute(options.optionsAttr, JSON.stringify(clone));
    }
  }

  function handle(selector, opts) {
    var elems = options.document.querySelectorAll(selector);

    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var childs = elem.querySelectorAll('[' + options.selectorAttr + ']');

      for (var j = childs.length - 1; j > -1; j--) {
        _loc(childs[j], opts);
      }

      _loc(elem, opts);
    }
  }

  ;
  return handle;
}

var main = {
  init: init
};

return main;

})));