import {fetchSetup, fetchTranslations} from './Api';
import {ng} from 'fd-angular-core';

let $current = new Symbol('$current');
let $default = new Symbol('$default');
let $locales = new Symbol('$locales');
let $cache = new Symbol('$cache');
let $setup = new Symbol('$setup');
let $fetchSetup = new Symbol('$fetchSetup');

/**
@namespace I18n
*/

export class I18n {

	constructor() {
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
				this[$current] = setup.default;
				this[$locales] = setup.locales;

				if (navigator.language) {
					let locale = navigator.language.split('-')[0];
					if (setup.locales.indexOf(locale)) {
						this[$current] = locale;
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
