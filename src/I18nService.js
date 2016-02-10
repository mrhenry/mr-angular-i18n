import {fetchSetup, fetchTranslations} from './Api';
import {ng, Inject} from 'fd-angular-core';

let $current = Symbol('$current');
let $default = Symbol('$default');
let $locales = Symbol('$locales');
let $cache = Symbol('$cache');
let $setup = Symbol('$setup');
let $fetchSetup = Symbol('$fetchSetup');

/**
@namespace I18n
*/

@Inject('$rootScope')
export class I18n {

	constructor($rootScope) {
		this[$cache] = {};
	}

	/**
	Returns the current (or closest) locale.

	@var {String} current
	@memberof I18n
	*/
	get current() { return this[$current]; }

	get default() { return this[$default]; }

	/**
	Returns the canonical version for the current absUrl

	@memberof I18n
	*/
	get canonical() {
		let url = window.location.href,
			locale = (/\/([a-z]{2})\//gi).exec(url);

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
	get locales() { return this[$locales]; }

	[$fetchSetup]() {
		if (this[$setup]) {
			return this[$setup];
		}

		this[$setup] = fetchSetup()
			.then(setup => {
				this[$default] = setup.default;
				this[$locales] = setup.locales;
				this[$current] = this.extractLocaleFromPath(window.location.pathname);
			});

		return this[$setup];
	}

	extractLocaleFromPath(path) {
		let locale;

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

	update() {
		let locale = this.extractLocaleFromPath(window.location.pathname);

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
	ready() {
		return this[$fetchSetup]().then(() => this);
	}


	/**
	Returns a promise that returns all the translated keys for the provided locale.

	@function fetch
	@memberof I18n
	@param {String} locale
	@returns {Promise.<Object>}
	*/
	fetch(locale) {
		if (this[$cache][locale]) {
			return this[$cache][locale];
		}

		this[$cache][locale] = this[$fetchSetup]()
			.then(() => {
				return Promise.all([
					fetchTranslations(this.default),
					fetchTranslations(locale),
				]).then(deepMerge);
			});

		return this[$cache][locale];
	}

}

function deepMerge(stack) {
	let base = {};

	for (let level of stack) {
		deepApply(base, level);
	}

	return base;

	function deepApply(dst, src) {
		for (let key of Object.keys(src)) {
			let val = src[key];

			if (ng.isObject(val)) {
				let val2 = (dst[key] || {});
				deepApply(val2, val);
				dst[key] = val2;
			} else {
				dst[key] = val;
			}
		}
	}
}
