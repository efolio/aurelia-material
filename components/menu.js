import {inject, bindable, Optional} from 'aurelia-framework';
import {mdl, MdlComponent, upgradeAttr} from './component.js';
import {MdlSelectCustomElement} from './select.js';
import {MdlUpgrader} from './upgrader.js';

@mdl({mdlType: 'Menu'})
@inject(Optional.of(MdlSelectCustomElement, true))
export class MdlMenuCustomElement extends MdlComponent {
  @bindable for
  @bindable position
  @upgradeAttr('Ripple') ripple

  constructor(select, ...superDeps) {
    super(...superDeps)

    if (select)
      select.registerMenu(this);
  }
}
