import {bindable, inject, bindingMode, observable, Container, Optional} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MdlUpgrader} from './upgrader.js';
import getmdlSelect from 'getmdl-select/getmdl-select.min.js';
import {mdlComponent, forwardAttr} from './component.js';

@mdlComponent({type: 'Select', upgrade: 'Textfield', inject: false})
@inject(MdlUpgrader, EventAggregator, Element, Container)
export class MdlSelectCustomElement {
  @bindable id
  @bindable({defaultBindingMode: bindingMode.twoWay}) value
  @bindable label
  @bindable ripple = true
  @forwardAttr('input') disabled

  values = {}

  constructor(upgrader, evAgg, element, container) {
    this.upgrader = upgrader;
    this.evAgg = evAgg;
    this.container = container;

    element.removeAttribute('id');
  }

  attached() {
    getmdlSelect.addEventListeners(this.component);
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
