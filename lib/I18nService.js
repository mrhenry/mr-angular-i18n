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
	function I18n($rootScope) {
		_classCallCheck(this, _I18n);

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
				_this[$locales] = setup.locales;
				_this[$current] = _this.extractLocaleFromPath(window.location.pathname);
			});

			return this[$setup];
		}
	}, {
		key: 'extractLocaleFromPath',
		value: function extractLocaleFromPath(path) {
			var locale = undefined;

			if (path.indexOf('/') === 0) {
				path = path.slice(1);
			}

			locale = path.split('/');

			if (!!locale[0] && locale[0].length === 2 && this[$locales].indexOf(locale[0]) > -1) {
				locale = locale[0];
			} else if (navigator.language) {
				locale = navigator.language.split('-')[0];
			} else {
				locale = this[$default];
			}

			if (this[$locales].includes(locale)) {
				return locale;
			}

			return this[$default];
		}
	}, {
		key: 'update',
		value: function update() {
			var locale = this.extractLocaleFromPath(window.location.pathname);

			if (locale !== this[$current]) {
				this[$current] = locale;
				return true;
			}

			return false;
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
  Returns the canonical version for the current absUrl
  	@memberof I18n
  */
	}, {
		key: 'canonical',
		get: function get() {
			var url = window.location.href,
			    locale = /\/([a-z]{2})\//gi.exec(url);

			if (locale) {
				if (locale[1] === this[$default]) {
					url = url.split('/');
					url.splice(3, 1);
					url = url.join('/');
				}
			} else {
				if (this[$current] !== this[$default]) {
					url = url.split('/');
					url.splice(3, 0, this[$current]);
					url = url.join('/');
				}
			}

			return url;
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

	var _I18n = I18n;
	I18n = (0, _fdAngularCore.Inject)('$rootScope')(I18n) || I18n;
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
//# sourceMappingURL=I18nService.js.map