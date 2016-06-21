import {bindable} from 'aurelia-framework';
import {forwardAttr} from './component.js';
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dialog-polyfill.css!';

export class MdlDialogCustomElement {
  @bindable fullwidth;

  attached() {
    if (! this.component.showModal)
      dialogPolyfill.registerDialog(this.component);
  }

  open() {
    this.component.showModal();
  }

  close() {
    console.log('dialog.js:19', 'close');
    this.component.close();
  }
}
