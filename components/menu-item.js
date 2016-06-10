import {inject, Optional} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {mdl, MdlComponent} from './component.js';
import {MdlMenuCustomElement} from './menu.js';

@mdl({mdlType: 'MenuItem', upgrade: false})
@inject(Optional.of(MdlMenuCustomElement, true), BindingEngine)
export class MdlMenuItemCustomElement extends MdlComponent {
  constructor(menu, bindingEngine, ...superDeps) {
    super(...superDeps);

    if (!menu)
      throw new Error('menu-items/options should be in a menu/select!');

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
