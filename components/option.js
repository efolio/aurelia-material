import {useView, bindable, inject, containerless} from 'aurelia-framework';
import {MdlMenuItemCustomElement} from './menu-item.js';
import {MdlSelectCustomElement} from './select.js';
import {ObserverLocator} from 'aurelia-binding';
import {MdlUpgrader} from './upgrader.js';

@useView('./menu-item.html')
@inject(MdlSelectCustomElement, Element)
export class MdlOptionCustomElement extends MdlMenuItemCustomElement {
  @bindable default
  @bindable value = null

  constructor(select, option, ...superDeps) {
    super(...superDeps);
    this.select = select;
    this.option = option;
  }

  attached() {
    super.attached();

    this.select.registerValue(this.option.textContent, this);

    if (this.value === null)
      this.value = this.option.textContent;

    // handle default value
    if (this.default && !this.select.value)
      this.component.click();
  }

  valueChanged(value, oldValue) {
    if (this.select.value !== oldValue)
      return;
    this.select.value = value;
  }
}
