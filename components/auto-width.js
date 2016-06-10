import {inject, Optional, BindingEngine} from 'aurelia-framework';
import {MdlComponent} from './component.js';

@inject(Element, Optional.of(MdlComponent), BindingEngine)
export class MdlAutoWidthCustomAttribute {
  mult = 1
  width = 0

  constructor(element, component, bindingEngine) {
    this.element = element;
    this.component = component;

    this.labelObserver = bindingEngine.propertyObserver(this.component, 'label');
  }

  attached() {
    this.valueChanged(this.selector);

    if (this.component) {
      this.labelSubscription = this.labelObserver.subscribe(this.valueChanged.bind(this));
    }
  }

  detached() {
    if (!this.labelSubscription)
      return;
    this.labelSubscription.dispose();
  }

  valueChanged(newValue) {
    if (newValue === 'mdl-auto-width')
      return;

    var match = newValue && newValue.match(/^([0-9]+)x$/);
    if (match)
      this.mult = +match[1];

    if (this.component && !this.component.component)
      return;

    var newWidth = this.component.label.length / 2 * this.mult + 1;

    if (newWidth < this.width)
      return;

    (this.component ? this.component.component : this.element).style.width = newWidth + 'em';

    return; // TODO: no component case

    var newWidth = this.element.querySelector(this.selector).textContent.length / 2 * this.mult + 1;
  }
}
