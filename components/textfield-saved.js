import {bindable, bindingMode} from 'aurelia-framework';
import {computedFrom} from 'aurelia-binding';
import {MdlUpgrader} from './upgrader.js';
import {mdl, forwardAttr, styleAttr} from './component.js';
import * as converters from './converters.js';
import _ from 'lodash';

@mdl({mdlType: 'Textfield', upgrade: 'Textfield'})
export class MdlTextfieldCustomElement {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) value = ''
  @bindable label
  @bindable type
  @bindable valueConverter
  @bindable displayValue
  @bindable unit
  @forwardAttr('input') required
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled

  constructor(upgrader) {
    this.upgrader = upgrader;

    this.focusListener = () => {
      this.hasFocus = true;
      this.displayValue = this.value && this.valueConverterObj ?
        this.valueConverterObj.prototype.fromView(this.value)
        : undefined
      ;
    };

    this.blurListener = () => {
      this.hasFocus = false;
      this.displayValue = this.value ? (
        this.valueConverterObj ?
          this.addUnit(this.valueConverterObj.prototype.toView(this.value)) :
          this.addUnit(this.value)
        ) :
        undefined
      ;

      if (!this.displayValue && !this.value)
        this.component.MaterialTextfield.change(this.value);
    };
  }

  addUnit(value) {
    if (this.unit && this.type !== 'currency')
      return value + ' ' + this.unit;
    return value;
  }

  removeUnit(value) {
    if (this.unit && this.type !== 'currency')
      return value.substr(0, value.length - (' ' + this.unit).length);
    return value;
  }

  @computedFrom('unit', 'hasFocus', 'displayValue')
  get displayLabelUnit() {
    return this.unit && (this.hasFocus || (!this.displayValue && this.displayValue !== 0)) ?
      (' (' + this.unit + ')') : ''
    ;
  }

  addEventListeners() {
    this.input.addEventListener('focus', this.focusListener);
    this.input.addEventListener('blur', this.blurListener);
  }

  removeEventListeners() {
    this.input.removeEventListener('focus', this.focusListener);
    this.input.removeEventListener('blur', this.blurListener);
  }

  attached() {
    this.valueConverterChanged(this.valueConverter);
  }

  detached() {
    if (this.hasEventListeners)
      this.removeEventListeners();
  }

  typeChanged(value) {
    this.valueConverter = this.valueConverter || value;

    if (value === 'currency')
      this.unit = this.unit || '€'; // FIXME culture
  }

  valueConverterChanged(value) {
    if (!this.input)
      return;

    this.valueConverterObj = null;
    if (!value)
      return;

    let converterName = value[0].toUpperCase() + value.substr(1, value.length) + 'ValueConverter';

    this.valueConverterObj = converters[converterName];
    this.blurListener();

    if (!(converterName in converters) || (this.hasEventListeners && this.value))
      return;

    (this.hasEventListeners ? this.removeEventListeners : this.addEventListeners).call(this);
    this.hasEventListeners = !this.hasEventListeners;
  }

  displayValueChanged(value) {
    if (!this.valueConverterObj)
      return this.value = value;

    this.value = this.valueConverterObj.prototype.fromView(value);
  }
}
