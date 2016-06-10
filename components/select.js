import {bindable, inject, bindingMode, observable, Container, Optional} from 'aurelia-framework';
import {BindingSignaler} from 'aurelia-templating-resources';
import {EventAggregator} from 'aurelia-event-aggregator';
import {mdl, MdlComponent, forwardAttr} from './component.js';

@mdl({mdlType: 'Select', upgrade: 'Textfield'})
@inject(EventAggregator, Element, Container, BindingSignaler)
export class MdlSelectCustomElement extends MdlComponent {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) value
  @bindable label
  @bindable ripple = true
  @forwardAttr('input') disabled

  values = {}

  constructor(evAgg, element, container, signaler, ...superDeps) {
    super(...superDeps);

    this.evAgg = evAgg;
    this.container = container;
    this.signaler = signaler;

    element.removeAttribute('id');
  }

  attached() {
    var subscription = this.evAgg.subscribe('mdl:component:upgrade', payload => {
      if (!payload.data.attributes['data-mdl-for'] || payload.data.attributes['data-mdl-for'].value !== this.id)
        return;

      this.component.style.width = this.component.querySelector('.mdl-menu').clientWidth + 'px';
      subscription.dispose();
    });
  }

  registerMenu(menu) {
    this.container.registerInstance(menu.constructor, menu);
  }

  registerValue(textContent, option) {
    this.values[textContent] = option;
  }

  setValue(textContent) {
    this.component.MaterialTextfield.change(textContent);
    this.value = this.values[textContent].value;
  }

  focus() {
    this.input.focus();
  }
}

export class MdlInternalSelectKeyToValueValueConverter {
  fromView(key, map) {
    return (map[key] || {value: key}).value;
  }

  toView(value, map) {
    for (let key in map) {
      if (this.fromView(key, map) === value)
        return key;
    }
    return '';
  }
}
