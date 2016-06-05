import {inject} from 'aurelia-framework';

@inject(Element)
export class MdlAutoWidthCustomAttribute {
  selector = 'label'

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.valueChanged(this.selector);
  }

  valueChanged(newValue) {
    if (newValue === 'mdl-auto-width')
      return;

    this.selector = newValue;
    this.element.style.width = this.element.querySelector(this.selector).textContent.length / 2 + 1 + 'em';
    console.log('auto-width.js:22', this.element.style.width);
  }
}
