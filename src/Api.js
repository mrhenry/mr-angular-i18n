import {url} from 'mr-util';

export function fetchSetup() {
	return fetch("/api/i18n.json")
		.then(status)
		.then(json);
}

export function fetchTranslations(locale) {
	return fetch(url`/api/i18n/${locale}.json`)
		.then(status)
		.then(json);
}

function status(resp) {
	if (!resp.status === 200) {
		throw Error(`Unexpected response status: ${resp.status}`);
	}
	return resp;
}

function json(resp) {
	return resp.json();
}
