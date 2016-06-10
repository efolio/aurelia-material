import {mdl, MdlComponent, styleAttr, upgradeAttr, forwardAttr} from './component.js';

@mdl('Button')
export class MdlButtonCustomElement extends MdlComponent {
  @styleAttr raised
  @styleAttr fab
  @styleAttr colored
  @styleAttr accent
  @styleAttr primary
  @styleAttr icon
  @styleAttr({suffix: 'mini-fab'}) miniFab
  @styleAttr({class: 'is-disabled'}) @forwardAttr disabled
  @upgradeAttr('Ripple') ripple = true;
}
