import {bindable} from 'aurelia-framework';
import {MdlUpgrader} from './upgrader.js';

const componentAttrs = 'componentAttrs'; //new Symbol('componentAttrs');

function getComponentOptions(obj) {
  do {
    if (componentAttrs in obj.constructor)
      return obj.constructor[componentAttrs];
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  throw new Error('No options found! Invalid component?');
}

export function mdlComponent(options) {
  if (typeof options === 'string' || options instanceof String)
    options = {type: options};

  options.ref = options.ref || 'component';
  options.prefix = options.prefix || ('mdl-' + options.type.toLowerCase());
  options.upgrade = 'upgrade' in options ? options.upgrade : options.type;

  return function(target) {
    target[componentAttrs] = options;

    if (options.inject !== false)
      target.inject = [MdlUpgrader];

    if (options.upgrade === false)
      return;

    const attached = target.prototype.attached || function() {};
    target.prototype.attached = function() {
      this.upgrader.upgrade(this[options.ref], 'Material' + options.upgrade);
      attached.apply(this, arguments);
    };
  };
}

function attachedAndChanged(changed, target, key, descriptor) {
  bindable(target, key, descriptor);
  target[key + 'Changed'] = function() {};

  const attached = target.attached || function() {};
  target.attached = function() {
    attached.apply(this, arguments);
    changed.call(this, this[key]);
    target[key + 'Changed'] = changed;
  };
}

function _styleAttr(options, target, key, descriptor) {
  options = options || {};
  options.suffix = options.suffix || key;

  function changed(value) {
    const componentOptions = getComponentOptions(this);
    this[componentOptions.ref].classList[value ? 'add' : 'remove'](options.class || (componentOptions.prefix + '--' + options.suffix));
  }

  attachedAndChanged(changed, target, key, descriptor);
}

export function styleAttr(options, ...rest) {
  if (arguments.length > 1)
    return _styleAttr.call(this, null, options, ...rest);

  return _styleAttr.bind(this, options);
}

function _forwardAttr(ref, target, key, descriptor) {
  function changed(value) {
    var elt = this[ref || getComponentOptions(this).ref];
    if (!value && value !== '')
      return elt.removeAttribute(key);
    elt.setAttribute(key, value);
  }

  attachedAndChanged(changed, target, key, descriptor);
}

export function forwardAttr(optionsOrTarget, ...rest) {
  if (arguments.length > 1)
    return _forwardAttr.call(this, null, optionsOrTarget, ...rest);

  return _forwardAttr.bind(this, optionsOrTarget);
}

export function upgradeAttr(type) {
  return function(target, key, descriptor) {
    function changed(value) {
      const options = getComponentOptions(this);
      this.upgrader[value ? 'upgrade' : 'downgrade'](this[options.ref], 'Material' + type);
    }

    attachedAndChanged(changed, target, key, descriptor);
  };
}
