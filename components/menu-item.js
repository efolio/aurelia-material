import {inject, Optional} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding';
import {MdlUpgrader} from './upgrader.js';
import {mdlComponent} from './component.js';
import {MdlMenuCustomElement} from './menu.js';

@mdlComponent({type: 'MenuItem', upgrade: false, inject: false})
@inject(MdlUpgrader, Optional.of(MdlMenuCustomElement, true), ObserverLocator)
export class MdlMenuItemCustomElement {
  constructor(upgrader, menu, observerLocator) {
    if (!menu)
      throw new Error('menu-items/options should be in a menu/select!');

    this.upgrader = upgrader;
    this.menu = menu;

    this.rippleObserver = observerLocator.getObserver(menu, 'ripple');
    this.rippleChanged = this.rippleChanged.bind(this);
  }

  attached() {
    this.rippleObserver.subscribe(this.rippleChanged);
    this.rippleChanged(this.menu.ripple);
  }

  detached() {
    this.rippleObserver.unsubscribe(this.rippleChanged);
  }

  rippleChanged(value) {
    this.upgrader[value ? 'upgrade' : 'downgrade'](this.component, 'MaterialRipple');
  }
}
