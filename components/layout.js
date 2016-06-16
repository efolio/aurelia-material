import {bindable} from 'aurelia-framework';
import {mdl, MdlComponent, styleAttr, upgradeAttr, forwardAttr} from './component.js';

@mdl({mdlType: 'Layout', upgrade: false})
export class MdlLayoutCustomElement extends MdlComponent {
  @upgradeAttr('Ripple', 'tabBar') ripple = true;
  @bindable router;
}
