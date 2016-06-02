import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {componentHandler} from 'encapsulated-mdl';

@inject(EventAggregator)
export class MdlUpgrader {
  constructor(eventAgg) {
    this.eventAgg = eventAgg;
  }

  upgrade(item, type, ripple) {
    componentHandler.upgradeElement(item, type);

    if (ripple)
      componentHandler.upgradeElement(item, 'MaterialRipple');

    this.eventAgg.publish('mdl:component:upgrade', {data: item, type: type});
  }

  downgrade(item, type) {
    if (!item.attributes['data.upgraded'] || item.attributes['data.upgraded'].value.indexOf(',' + type) < 0)
      return;
    throw new Error('Downgrading is not supported yet!');
  }
}
