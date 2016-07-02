import {bindable, inject, Container} from 'aurelia-framework';
import {MdlUpgrader} from './upgrader.js';
import {DOM} from 'aurelia-pal';

const componentAttrs = Symbol('componentAttrs');
const attachedFns = Symbol('attachedFns');

export function getComponentOptions(obj) {
  do {
    if (componentAttrs in obj.constructor)
      return obj.constructor[componentAttrs];
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  throw new Error('No options found! Invalid component?');
}

export function mdl(options) {
  if (typeof options === 'string' || options instanceof String)
    options = {mdlType: options};

  options.ref = options.ref || 'component';
  options.prefix = options.prefix || ('mdl-' + options.mdlType.toLowerCase());
  options.upgrade = 'upgrade' in options ? options.upgrade : options.mdlType;

  return function(target) {
    target[componentAttrs] = options;

    if (options.upgrade === false)
      return;

    const attached = target.prototype.attached || function() {};
    target.prototype.attached = function() {
      this.upgrader.upgrade(this[options.ref], 'Material' + options.upgrade);
      attached.apply(this, arguments);
    };

    Object.defineProperty(target.prototype, 'mdlType', {
      get: function() {
        return getComponentOptions(this).mdlType;
      }
    });
  };
}

function attachedAndChanged(changed, target, key, descriptor) {
  bindable(target, key, descriptor);

  if (!target[attachedFns]) {
    target[attachedFns] = [];

    const attached = target.attached || function() {};
    target.attached = function() {
      attached.apply(this, arguments);
      target[attachedFns].forEach(elt => {
        target[elt.key + 'Changed'] = function() {
          elt.changed.apply(this, arguments);
        };
        elt.changed.call(this, this[elt.key]);
      });
    };
    const detached = target.detached || function() {};
    target.detached = function() {
      detached.apply(this, arguments);
      target[attachedFns].forEach(elt => target[elt.key + 'Changed'] = function() {});
    };
  }
  target[attachedFns].push({key: key, changed: changed});

  target[key + 'Changed'] = function() {};
}

function _styleAttr(options, target, key, descriptor) {
  options = options || {};
  options.suffix = options.suffix || key;

  function changed(value) {
    const componentOptions = getComponentOptions(this);
    if (!this[componentOptions.ref])
      return;
    this[componentOptions.ref].classList[value ? 'add' : 'remove'](
      options.class || (componentOptions.prefix + '--' + options.suffix)
    );
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
    if (!value)
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

export function upgradeAttr(type, ref) {
  return function(target, key, descriptor) {
    function changed(value) {
      const options = getComponentOptions(this);
      this.upgrader[value ? 'upgrade' : 'downgrade'](this[ref || options.ref], 'Material' + type);
    }

    attachedAndChanged(changed, target, key, descriptor);
  };
}

@inject(Container, MdlUpgrader)
export class MdlComponent {
  constructor(container, upgrader) {
    container.registerInstance(MdlComponent, this);
    this.upgrader = upgrader;
  }

  setCustomValidity(errors, formField = this.input) {
    errors = errors || [];

    // Set validity on input
    formField.setCustomValidity(errors.join(' '));

    // Deletion of prev errors
    let deleteThese = [];
    Array.prototype.forEach.call(this.component.children, child => {
      if (child.classList.contains('mdl-validation'))
        deleteThese.push(child);
    });
    deleteThese.forEach(child => this.component.removeChild(child));

    const options = getComponentOptions(this);

    // Add relevant errors
    errors.forEach(error => {
      let errorMessageHelper = DOM.createElement('span');
      let errorMessageNode = DOM.createTextNode(error.message);

      errorMessageHelper.appendChild(errorMessageNode);
      errorMessageHelper.classList.add('mdl-validation', options.prefix + '__error');
      this.component.appendChild(errorMessageHelper);
    });
  }
}
