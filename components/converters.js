import numbro from 'numbro/dist/numbro.min.js';
import numbroLang from 'numbro/dist/languages/fr-FR.min.js';
import moment from 'moment';
import _ from 'lodash';

var lang = 'fr-FR'; // FIXME
numbro.culture(lang, numbroLang);
numbro.culture(lang);

export class NumberFormatValueConverter {
  toView(value, decimals, format) {
    decimals = _.repeat('0', decimals || 2);

    switch (lang) {
    default:
    case 'fr-FR':
      format = format || '(0,0[.]' + decimals + ')';
      break;
    case 'en-US':
      format = format || '(0,0.' + decimals + ')';
      break;
    case 'en-GB':
      format = format || '(0,0[.]' + decimals + ')';
      break;
    }

    return numbro(value).format(format);
  }

  fromView(str) {
    return numbro().unformat(str);
  }
}

export class CurrencyValueConverter {
  toView(value, decimals, format) {
    decimals = _.repeat('0', decimals || 2);

    switch (lang) {
    default:
    case 'fr-FR':
      format = format || '(0,0[.]' + decimals + ' $)';
      break;
    case 'en-US':
      format = format || '($0,0.' + decimals + ')';
      break;
    case 'en-GB':
      format = format || '(0,0[.]' + decimals + ' $)';
      break;
    }

    return numbro(value).format(format);
  }

  fromView(str) {
    return numbro().unformat(str);
  }
}

export class DateFormatValueConverter {
  toView(value, format) {
    return moment(value).format(format);
  }
}
