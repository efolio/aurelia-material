import {inject, Optional} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {MdlUpgrader} from './upgrader.js';
import {mdlComponent} from './component.js';
import {MdlMenuCustomElement} from './menu.js';

@mdlComponent({type: 'MenuItem', upgrade: false, inject: false})
@inject(MdlUpgrader, Optional.of(MdlMenuCustomElement, true), BindingEngine)
export class MdlMenuItemCustomElement {
  constructor(upgrader, menu, bindingEngine) {
    if (!menu)
      throw new Error('menu-items/options should be in a menu/select!');

    this.upgrader = upgrader;
    this.menu = menu;

    this.rippleObserver = bindingEngine.propertyObserver(menu, 'ripple');
  }

  attached() {
    this.rippleSubscription = this.rippleObserver.subscribe(this.rippleChanged);
    this.rippleChanged(this.menu.ripple);
  }

  detached() {
    this.rippleSubscription.dispose();
  }

  rippleChanged(value) {
    this.upgrader[value ? 'upgrade' : 'downgrade'](this.component, 'MaterialRipple');
  }
}
