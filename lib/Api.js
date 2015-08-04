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
//# sourceMappingURL=Api.js.map