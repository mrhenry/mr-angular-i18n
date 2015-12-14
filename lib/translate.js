// app.translate('foo.bar') renders this.translations.foo.bar
// app.translate('foo.bar', 'baz') renders this.translations.foo.bar, replacing any ${} syntax with 'baz'
// app.translate('foo.bar', { hello: 'world' }) renders this.translations.foo.bar, replacing ${hello} with 'world'
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.translate = translate;

function translate(translations, key, replace) {
  var options = arguments.length <= 3 || arguments[3] === undefined ? { translateCamelCase: true } : arguments[3];

  if (typeof translations !== 'object') {
    return '';
  }

  var translation = translations;

  key = key.split('.');

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = key[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      if (!!options.translateCamelCase) {
        k = k.replace(/([a-z])([A-Z])/g, function (match, before, after) {
          return before + '_' + after.toLowerCase();
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

  if (replace !== undefined) {
    if (typeof replace === 'object') {
      for (var _key in replace) {
        var value = replace[_key];

        translation = translation.replace('${' + _key + '}', value);
      }
    } else {
      translation = translation.replace(/\$\{[\w\d]+\}/gi, replace);
    }
  }

  return translation;
}
//# sourceMappingURL=translate.js.map