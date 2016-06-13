import {bindable, bindingMode} from 'aurelia-framework';
import {MdlUpgrader} from './upgrader.js';
import {mdl, MdlComponent, forwardAttr, styleAttr, upgradeAttr} from './component.js';

export class MdlCheckboxBase extends MdlComponent {
  attached() {
    this.upgrader.upgrade(this.component.querySelector('.mdl-' + this.mdlType.toLowerCase() + '__ripple-container'), 'MaterialRipple');
    this.checkedChanged(this.checked);
  }

  checkedChanged(value) {
    if (!this.component)
      return;
    this.component.classList[value ? 'add' : 'remove']('is-checked');
  }
}

@mdl({mdlType: 'Checkbox'})
export class MdlCheckboxCustomElement extends MdlCheckboxBase {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) checked = false
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled
  @upgradeAttr('Ripple') ripple = true
}

@mdl({mdlType: 'Switch'})
export class MdlSwitchCustomElement extends MdlCheckboxBase {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) checked = false
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled
  @upgradeAttr('Ripple') ripple = true
}
