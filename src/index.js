import {ng, beforeBoot} from 'fd-angular-core';
import {I18n as I18nService} from './I18nService';

export {mountI18n} from './States';

export {translate} from './translate'

export var I18n = new I18nService();
beforeBoot(() => I18n.ready());
