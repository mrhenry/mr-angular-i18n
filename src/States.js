import {buildUiRouterState, mountAt, State} from 'fd-angular-core';
import {I18n} from './index';

let $current = Symbol('$current');
let $translations = Symbol('$translations');

/**
@function mountI18n
@param {State} child
@example
bootstrap(mountI18n(AppController));
*/
export function mountI18n(child) {
	return {
		child:              child,
		buildUiRouterState: build,
	};

	function build(options) {
		let children = [];

		children.push(mountI18nLocale($current, this.child));
		for (let locale of I18n.locales) {
			children.push(mountI18nLocale(locale, this.child));
		}

		children = children.map(c => buildUiRouterState(c, options));

		return {
			name:        'i18n',
			abstract:    true,
			hiddenState: true,
			children:    children,
		};
	}
}

function mountI18nLocale(locale, child) {
	let url = '/', name = 'i18n.$current';
	if (locale !== $current) {
		url = `/${locale}`;
		name = `i18n.${locale}`;
	}

	return {
		state:  I18nController::mountAt(url, { name }),
		locale: locale,
		child:  child,
		build:  build,
	};

	function build(options) {
		options = Object.create(options, {});
		if (this.locale === $current) {
			options.locale = null;
		} else {
			options.locale = this.local;
		}

		let state = buildUiRouterState(this.state, options);

		// add resolve
		if (!state.resolve) {
			state.resolve = {};
		}
		if (this.locale === $current) {
			state.resolve.$locale = () => { return I18n.current; };
		} else {
			state.resolve.$locale = () => { return this.locale; };
		}
		state.resolve.$translations = ['$locale', function($locale) { return I18n.fetch($locale); }];

		// add children
		if (!state.children) {
			state.children = [];
		}
		state.children.push(buildUiRouterState(this.child, options));

		return state;
	}
}

@State({
	hidden:   true,
	bindTo:   'I18n',
	template: `<ui-view></ui-view>`,
})
@Inject('$translations', '$locale')
class I18nController {

	constructor(translations, locale) {
		this[$current] = locale;
		this[$translations] = translations;
	}

	get current() {
		return this[$current];
	}

	get locales() {
		return I18n.locales;
	}

	/**
	The current translated keys (only available in localised states, when injected as a service)

	@var {Object} t
	@memberof I18n
	*/
	get t() {
		return this[$translations];
	}

}
