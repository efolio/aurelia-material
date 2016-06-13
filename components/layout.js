import {bindable} from 'aurelia-framework';
import {mdl, MdlComponent, styleAttr, upgradeAttr, forwardAttr} from './component.js';

@mdl({mdlType: 'Layout', tabBar: 'tabBar'})
export class MdlLayoutCustomElement extends MdlComponent {
  @upgradeAttr('Ripple') ripple = true;
  @bindable tabs;
}
