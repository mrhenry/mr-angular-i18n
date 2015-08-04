(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MrAngularI18n = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchSetup = fetchSetup;
exports.fetchTranslations = fetchTranslations;

var _templateObject = _taggedTemplateLiteral(["/api/i18n/", ".json"], ["/api/i18n/", ".json"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _mrUtil = require('mr-util');

function fetchSetup() {
	return fetch("/api/i18n.json").then(status).then(json);
}

function fetchTranslations(locale) {
	return fetch((0, _mrUtil.url)(_templateObject, locale)).then(status).then(json);
}

function status(resp) {
	if (!resp.status === 200) {
		throw Error("Unexpected response status: " + resp.status);
	}
	return resp;
}

function json(resp) {
	return resp.json();
}

},{"mr-util":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Api = require('./Api');

var _fdAngularCore = require('fd-angular-core');

var $current = Symbol('$current');
var $default = Symbol('$default');
var $locales = Symbol('$locales');
var $cache = Symbol('$cache');
var $setup = Symbol('$setup');
var $fetchSetup = Symbol('$fetchSetup');

/**
@namespace I18n
*/

var I18n = (function () {
	function I18n() {
		_classCallCheck(this, I18n);

		this[$cache] = {};
	}

	/**
 Returns the current (or closest) locale.
 	@var {String} current
 @memberof I18n
 */

	_createClass(I18n, [{
		key: $fetchSetup,
		value: function value() {
			var _this = this;

			if (this[$setup]) {
				return this[$setup];
			}

			this[$setup] = (0, _Api.fetchSetup)().then(function (setup) {
				_this[$default] = setup['default'];
				_this[$current] = setup['default'];
				_this[$locales] = setup.locales;

				if (navigator.language) {
					var locale = navigator.language.split('-')[0];
					if (setup.locales.indexOf(locale)) {
						_this[$current] = locale;
					}
				}
			});

			return this[$setup];
		}

		/**
  Returns a promise that resolves when the I18n service is ready with its setup.
  	@function ready
  @memberof I18n
  @returns {Promise.<I18n>}
  */
	}, {
		key: 'ready',
		value: function ready() {
			var _this2 = this;

			return this[$fetchSetup]().then(function () {
				return _this2;
			});
		}

		/**
  Returns a promise that returns all the translated keys for the provided locale.
  	@function fetch
  @memberof I18n
  @param {String} locale
  @returns {Promise.<Object>}
  */
	}, {
		key: 'fetch',
		value: function fetch(locale) {
			var _this3 = this;

			if (this[$cache][locale]) {
				return this[$cache][locale];
			}

			this[$cache][locale] = this[$fetchSetup]().then(function () {
				return Promise.all([(0, _Api.fetchTranslations)(_this3['default']), (0, _Api.fetchTranslations)(locale)]).then(deepMerge);
			});

			return this[$cache][locale];
		}
	}, {
		key: 'current',
		get: function get() {
			return this[$current];
		}
	}, {
		key: 'default',
		get: function get() {
			return this[$default];
		}

		/**
  Returns the list of available locales.
  	@var {String[]} locales
  @memberof I18n
  */
	}, {
		key: 'locales',
		get: function get() {
			return this[$locales];
		}
	}]);

	return I18n;
})();

exports.I18n = I18n;

function deepMerge(stack) {
	var base = {};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = stack[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var level = _step.value;

			deepApply(base, level);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return base;

	function deepApply(dst, src) {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Object.keys(src)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var key = _step2.value;

				var val = src[key];

				if (_fdAngularCore.ng.isObject(val)) {
					var val2 = dst[key] || {};
					deepApply(val2, val);
					dst[key] = val2;
				} else {
					dst[key] = val;
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2['return']) {
					_iterator2['return']();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}
}

},{"./Api":1,"fd-angular-core":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.mountI18n = mountI18n;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fdAngularCore = require('fd-angular-core');

var _index = require('./index');

var $current = Symbol('$current');
var $translations = Symbol('$translations');

/**
@function mountI18n
@param {State} child
@example
bootstrap(mountI18n(AppController));
*/

function mountI18n(child) {
	return {
		child: child,
		buildUiRouterState: build
	};

	function build(options) {
		var children = [];

		children.push(mountI18nLocale($current, this.child));
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _index.I18n.locales[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var locale = _step.value;

				children.push(mountI18nLocale(locale, this.child));
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		children = children.map(function (c) {
			return (0, _fdAngularCore.buildUiRouterState)(c, options);
		});

		return {
			name: 'i18n',
			abstract: true,
			hiddenState: true,
			children: children
		};
	}
}

function mountI18nLocale(locale, child) {
	var url = '/',
	    name = 'i18n.$current';
	if (locale !== $current) {
		url = '/' + locale;
		name = 'i18n.' + locale;
	}

	return {
		state: _fdAngularCore.mountAt.call(I18nController, url, { name: name }),
		locale: locale,
		child: child,
		buildUiRouterState: build
	};

	function build() {
		var _this = this;

		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		options = Object.create(options, {});
		if (this.locale === $current) {
			options.locale = null;
		} else {
			options.locale = this.local;
		}

		var state = (0, _fdAngularCore.buildUiRouterState)(this.state, options);

		// add resolve
		if (!state.resolve) {
			state.resolve = {};
		}
		if (this.locale === $current) {
			state.resolve.$locale = function () {
				return _index.I18n.current;
			};
		} else {
			state.resolve.$locale = function () {
				return _this.locale;
			};
		}
		state.resolve.$translations = ['$locale', function ($locale) {
			return _index.I18n.fetch($locale);
		}];

		// add children
		if (!state.children) {
			state.children = [];
		}
		state.children.push((0, _fdAngularCore.buildUiRouterState)(this.child, options));

		return state;
	}
}

var I18nController = (function () {
	function I18nController(translations, locale) {
		_classCallCheck(this, _I18nController);

		this[$current] = locale;
		this[$translations] = translations;
	}

	_createClass(I18nController, [{
		key: 'current',
		get: function get() {
			return this[$current];
		}
	}, {
		key: 'locales',
		get: function get() {
			return _index.I18n.locales;
		}

		/**
  The current translated keys (only available in localised states, when injected as a service)
  	@var {Object} t
  @memberof I18n
  */
	}, {
		key: 't',
		get: function get() {
			return this[$translations];
		}
	}]);

	var _I18nController = I18nController;
	I18nController = (0, _fdAngularCore.Inject)('$translations', '$locale')(I18nController) || I18nController;
	I18nController = (0, _fdAngularCore.State)({
		bindTo: 'I18n',
		template: '<ui-view></ui-view>'
	})(I18nController) || I18nController;
	return I18nController;
})();

},{"./index":4,"fd-angular-core":undefined}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fdAngularCore = require('fd-angular-core');

var _I18nService = require('./I18nService');

var _States = require('./States');

Object.defineProperty(exports, 'mountI18n', {
  enumerable: true,
  get: function get() {
    return _States.mountI18n;
  }
});
var I18n = new _I18nService.I18n();
exports.I18n = I18n;
(0, _fdAngularCore.beforeBoot)(function () {
  return I18n.ready();
});

},{"./I18nService":2,"./States":3,"fd-angular-core":undefined}]},{},[4])(4)
});
//# sourceMappingURL=mr-angular-i18n.js.map
