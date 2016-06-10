import {inject} from 'aurelia-framework';
import {ValidationEngine} from 'aurelia-validatejs';
import {getContextFor} from 'aurelia-binding';
import {MdlComponent} from './component.js';

// Library still in beta, keeping this for later use.
//
// class ValidationRenderer {
//   renderErrors(node, relevantErrors) {
//     if (!(node instanceof MdlComponent))
//       relevantErrors = relevantErrors.concat(' ');

//     node.setCustomValidity(relevantErrors);
//   }
// }

// @inject(ValidationRenderer)
export class MdlValidateBindingBehavior {
  // constructor(renderer) {
  //   this.renderer = renderer;
  // }
  bind(binding, source) {
    let targetProperty;
    let target;
    let reporter;

    targetProperty = this.getTargetProperty(binding);
    target = this.getPropertyContext(source, targetProperty);
    reporter = this.getReporter(target);

    reporter.subscribe(errors => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });

      if (!(binding.target instanceof MdlComponent))
        relevantErrors = relevantErrors.concat(' ');

      binding.target.setCustomValidity(relevantErrors);
    });
  }
  unbind(binding, source) {
    // TODO: destroy yourself, gracefully (LOL)
  }
  getTargetProperty(binding) {
    let sourceExpression = binding.sourceExpression;

    if (!sourceExpression.expression)
      return;

    do {
      sourceExpression = sourceExpression.expression;
    } while (sourceExpression.expression);

    return sourceExpression.name;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(targetProperty, source, 0);
    return target;
  }
  getReporter(target) {
    return ValidationEngine.getValidationReporter(target);
  }
}
