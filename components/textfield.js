import {bindable, bindingMode} from 'aurelia-framework';
import {mdl, MdlComponent, forwardAttr, styleAttr} from './component.js';

@mdl({mdlType: 'Textfield', upgrade: 'Textfield'})
export class MdlTextfieldCustomElement extends MdlComponent {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) value = ''
  @bindable label
  @bindable({defaultBindingMode: bindingMode.twoWay}) mdlFocus
  @bindable type
  @styleAttr({class: 'is-disabled'}) @forwardAttr('input') disabled

  valueChanged(value) {
    if (!this.component)
      return;

    this.component.MaterialTextfield.change(value);
  }
}
