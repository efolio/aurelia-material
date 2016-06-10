import {inject} from 'aurelia-framework';
import {accounting} from 'accounting';
//import 'numbro/dist/languages.js';
import moment from 'moment';
import _ from 'lodash';
import {MdlComponent} from './component';
import {DOM} from 'aurelia-pal';

const defaultCulture = 'fr-FR';
const cultureFormats = {
  'fr-FR': {
    symbol: '€',
    precision: 2,
    thousand: ' ',
    decimal: ',',
    format: '%v %s',
  },
  'en-US': {
    symbol: '$',
    precision: 2,
    thousand: ',',
    decimal: '.',
    format: '%s%v',
  },
};

function handleDefault(value, defaultValue, allowedFalsy) {
  if (arguments.length < 3)
    return !value ? defaultValue : value;
  return !value && value !== allowedFalsy ? defaultValue : value;
}

function numberFromView(str, options, symbol = '') {
  if (str === '')
    return undefined;

  const culture = cultureFormats[options.culture || defaultCulture];

  const nb = accounting.unformat(str, handleDefault(options.decimal, culture.decimal));

  if (nb === 0 && Number(str.replace(',', '.').replace(symbol, '')) !== 0)
    return str;

  return nb;
}

export class NumberValueConverter {
  toView(value, options) {
    if (+value !== value)
      return value;

    const culture = cultureFormats[options.culture || defaultCulture];

    var res = accounting.formatNumber(
      value,
      handleDefault(options.precision, culture.precision, 0),
      handleDefault(options.thousand, culture.thousand, ''),
      handleDefault(options.decimal, culture.decimal)
    );

    if (options.symbol)
      return (handleDefault(culture.unitFormat, '%v %s').replace('%v', res).replace('%s', options.symbol));

    return res;
  }

  fromView(str, options) {
    return numberFromView(str, options);
  }
}

export class CurrencyValueConverter {
  toView(value, options = {}) {
    if (+value !== value)
      return value;

    const culture = cultureFormats[options.culture || defaultCulture];

    const method = options.symbol === '' ?
      accounting.formatNumber.bind(accounting, value) :
      accounting.formatMoney.bind(accounting, value, handleDefault(options.symbol, culture.symbol))
    ;

    return method(
      handleDefault(options.precision, culture.precision, 0),
      handleDefault(options.thousand, culture.thousand, ''),
      handleDefault(options.decimal, culture.decimal),
      handleDefault(options.format, culture.format, '')
    );
  }

  fromView(str, options = {}) {
    const culture = cultureFormats[options.culture || defaultCulture];
    return numberFromView(str, options, handleDefault(options.symbol, culture.symbol));
  }
}

class NumberBindingBehavior_ {
  constructor(ValueConverter) {
    this.converter = new ValueConverter();
    this.numberConverter = new NumberValueConverter();
  }

  addUnit(binding, options) {
    if (!binding.target.label || !options.symbol)
      return;

    binding.label = binding.target.label;
    binding.target.label += ' (' + options.symbol + ')';

    return; // TODO: handle no component case

    let unitHelper = binding.label = DOM.createElement('span');
    let unitHelperNode = DOM.createTextNode(' (' + options.symbol + ')');

    unitHelper.appendChild(unitHelperNode);
    binding.target.labelElement.appendChild(unitHelper);
  }

  removeUnit(binding) {
    if (!binding.label)
      return;

    binding.target.label = binding.label;
    binding.label = null;

    return; // TODO: handle no component case

    binding.target.labelElement.removeChild(binding.label);
  }

  addListeners(binding, options) {
    binding.target.input.addEventListener(options.start || 'blur', () => {
      binding.isStarted = true;
      binding.updateTarget(binding.lastSourceValue);

      if (!binding.target.labelElement)
        return;

      if (binding.label && binding.lastSourceValue !== undefined)
        this.removeUnit(binding);
    });

    binding.target.input.addEventListener(options.stop || 'focus', () => {
      binding.isStarted = false;
      binding.updateTarget(binding.lastSourceValue);

      if (!binding.target.labelElement)
        return;

      if (!binding.label)
        this.addUnit(binding, options);
    });

    if (binding.lastSourceValue === undefined && !binding.label)
      this.addUnit(binding, options);
  }

  bind(binding, scope, options = {}, ...rest) {
    const updateSource = binding.updateSource;

    if (!(binding.target instanceof MdlComponent))
      throw new Error('This behavior works only on mdl components!');

    binding.isStarted = 'defaultState' in options ? options.defaultState : true;
    setTimeout(() => this.addListeners(binding, options));

    binding.updateSource = value => {
      binding.lastSourceValue = this.converter.fromView(value, options, ...rest);
      updateSource.call(binding, binding.lastSourceValue);
    };

    const updateTarget = binding.updateTarget;
    binding.updateTarget = value => {
      const culture = cultureFormats[options.culture || defaultCulture];
      updateTarget.call(binding, binding.isStarted ?
        this.converter.toView(value, options, ...rest) :
        (value && ('' + value).replace('.', handleDefault(options.decimal, culture.decimal)))
      );
    };
  }

  unbind(binding, scope) {
  }
}

export class NumberBindingBehavior extends NumberBindingBehavior_{
  constructor(...superDeps) {
    super(NumberValueConverter, ...superDeps);
  }
}

export class CurrencyBindingBehavior extends NumberBindingBehavior_{
  constructor(...superDeps) {
    super(CurrencyValueConverter, ...superDeps);
  }
}


export class DateValueConverter {
  toView(value, format) {
    return moment(value).format(format);
  }

  fromView(str, format) {
    const date = moment(str, format);

    if (!date.isValid())
      return str;

    return date.toDate();
  }
}
