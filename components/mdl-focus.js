import {inject, Optional, bindingMode, customAttribute} from 'aurelia-framework';
import {getComponentOptions, MdlComponent} from './component.js';
import {MdlTextfieldCustomElement} from './textfield.js';

@customAttribute('mdl-focus', bindingMode.twoWay)
@inject(Optional.of(MdlComponent))
export class mdlFocus {
  constructor(component) {
    console.log('mdl-focus.js:6', component);
    var strategy = {}
    if (component) {
      var options = getComponentOptions(component);
      console.log('mdl-focus.js:10', options);
      // …
    }
  }

  attached() {
  }
}
