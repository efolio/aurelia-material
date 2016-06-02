import {inject, bindable, Optional} from 'aurelia-framework';
import {mdlComponent, upgradeAttr} from './component.js';
import {MdlSelectCustomElement} from './select.js';
import {MdlUpgrader} from './upgrader.js';

@mdlComponent({type: 'Menu', inject: false})
@inject(MdlUpgrader, Optional.of(MdlSelectCustomElement, true))
export class MdlMenuCustomElement {
  @bindable for
  @bindable position
  @upgradeAttr('Ripple') ripple

  constructor(upgrader, select) {
    this.upgrader = upgrader;

    if (select)
      select.registerMenu(this);
  }
}
