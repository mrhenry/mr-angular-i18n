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
		build: build
	};

	function build(options) {
		var _this = this;

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
	I18nController = Inject('$translations', '$locale')(I18nController) || I18nController;
	I18nController = (0, _fdAngularCore.State)({
		hidden: true,
		bindTo: 'I18n',
		template: '<ui-view></ui-view>'
	})(I18nController) || I18nController;
	return I18nController;
})();
//# sourceMappingURL=States.js.map