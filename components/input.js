import {bindable, bindingMode} from 'aurelia-framework';
import {MdlUpgrader} from './upgrader.js';
import {mdlComponent, forwardAttr, styleAttr} from './component.js';

@mdlComponent({type: 'Input', upgrade: 'Textfield'})
export class MdlInputCustomElement {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) value = ''
  @bindable label
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled

  constructor(upgrader) {
    this.upgrader = upgrader;
  }

  valueChanged(value) {
    if (!this.component || this.input.value === value)
      return;
    this.component.MaterialTextfield.change(value);
  }
}
