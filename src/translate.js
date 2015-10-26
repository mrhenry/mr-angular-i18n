// app.translate('foo.bar') renders this.translations.foo.bar
// app.translate('foo.bar', 'baz') renders this.translations.foo.bar, replacing any ${} syntax with 'baz'
// app.translate('foo.bar', { hello: 'world' }) renders this.translations.foo.bar, replacing ${hello} with 'world'
export function translate (translations, key, replace, options = { translateCamelCase: true }) {
  if (typeof translations !== 'object') {
    return '';
  }

  let translation = translations;

  key = key.split('.');

  for (let k of key) {
    if (!!options.translateCamelCase) {
      k = k.replace(/([a-z])([A-Z])/g, (match, before, after) => {
        return `${before}_${after.toLowerCase()}`
      });
    }

    k = k.toLowerCase();

    try {
      translation = translation[k];

      if (translation === undefined) {
        return '';
      }
    } catch (e) {
      return '';
    }
  }

  if (!!replace) {
    if (typeof replace === 'object') {
      for (let key in replace) {
        let value = replace[key];

        translation = translation.replace('${' + key + '}', value);
      }
    } else {
      translation = translation.replace(/\$\{[\w\d]+\}/gi, replace);
    }
  }

  return translation;
}