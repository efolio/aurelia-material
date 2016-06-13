import {useView, bindable, inject, containerless, Optional} from 'aurelia-framework';
import {MdlMenuItemCustomElement} from './menu-item.js';
import {MdlSelectCustomElement} from './select.js';
import {ObserverLocator} from 'aurelia-binding';

@inject(Optional.of(MdlSelectCustomElement, true))
export class MdlOptionCustomElement extends MdlMenuItemCustomElement {
  @bindable default
  @bindable value

  constructor(select, ...superDeps) {
    if (!select)
      throw new Error('option should be in a select');

    super(...superDeps);
    this.select = select;
  }

  attached() {
    super.attached();

    if (this.value === undefined)
      this.value = this.component.textContent;

    this.select.registerValue(this.component.textContent, this);

    // handle default value
    if ((this.value === this.select.value) ||                                   // current option is selected
      this.select.value === undefined && (this.value === undefined || this.default)) {       // no value to preselect & falsy value | default
      this.setValue();
    }
  }

  setValue(focus) {
    if (!this.component)
      return;
    this.select.setValue(this.component.textContent, this.value);
    if (focus)
      this.select.focus();
  }

  valueChanged(value, oldValue) {
    if (this.select.value !== oldValue)
      return;
    this.setValue();
  }
}
