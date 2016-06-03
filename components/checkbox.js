import {bindable, bindingMode} from 'aurelia-framework';
import {MdlUpgrader} from './upgrader.js';
import {mdlComponent, forwardAttr, styleAttr, upgradeAttr} from './component.js';

export class MdlCheckboxBase {
  constructor(upgrader) {
    this.upgrader = upgrader;
  }

  attached() {
    this.upgrader.upgrade(this.component.querySelector('.mdl-' + this.type.toLowerCase() + '__ripple-container'), 'MaterialRipple');
  }

  checkedChanged(value) {
    if (!this.component)
      return;
    this.component.classList[value ? 'add' : 'remove']('is-checked');
  }
}

@mdlComponent({type: 'Checkbox'})
export class MdlCheckboxCustomElement extends MdlCheckboxBase {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) checked = false
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled
  @upgradeAttr('Ripple') ripple = true
}

@mdlComponent({type: 'Switch'})
export class MdlSwitchCustomElement extends MdlCheckboxBase {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) checked = false
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled
  @upgradeAttr('Ripple') ripple = true
}
