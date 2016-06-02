import {mdlComponent, styleAttr, upgradeAttr, forwardAttr} from './component.js';

@mdlComponent('Button')
export class MdlButtonCustomElement {
  @styleAttr raised
  @styleAttr fab
  @styleAttr colored
  @styleAttr accent
  @styleAttr primary
  @styleAttr icon
  @styleAttr({suffix: 'mini-fab'}) miniFab
  @styleAttr({class: 'is-disabled'}) @forwardAttr disabled
  @upgradeAttr('Ripple') ripple = true;

  constructor(upgrader) {
    this.upgrader = upgrader;
  }
}
