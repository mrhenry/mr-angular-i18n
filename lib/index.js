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

var _translate = require('./translate');

Object.defineProperty(exports, 'translate', {
  enumerable: true,
  get: function get() {
    return _translate.translate;
  }
});
var I18n = new _I18nService.I18n();
exports.I18n = I18n;
(0, _fdAngularCore.beforeBoot)(function () {
  return I18n.ready();
});
//# sourceMappingURL=index.js.map