import type { ValidatorFn } from '../../../lib/validator';
import type { FormElement, FormErrors } from './form.types';

export const formUtils = {
  collectErrors: (form: HTMLFormElement): FormErrors => {
    const errors: FormErrors = {};
    form.querySelectorAll(':invalid').forEach((el) => {
      const field = el as FormElement;
      if (field.name) {
        errors[field.name] = field.validationMessage;
      }
    });
    return errors;
  },

  runValidator: (el: FormElement, fn: ValidatorFn) => {
    if (!el.required) {
      if (!el.value) {
        el.setCustomValidity('');
        return;
      }
      const inputMode = el.getAttribute('inputmode');
      if ((inputMode === 'numeric' || inputMode === 'decimal') && /^0+$/.test(el.value.replace(/\D/g, ''))) {
        el.setCustomValidity('');
        return;
      }
    }
    const result = fn(el.value);
    el.setCustomValidity(result.success ? '' : result.message);
  },

  runValidators: (form: HTMLFormElement, validators: Map<string, ValidatorFn>) => {
    validators.forEach((fn, fieldName) => {
      const el = form.elements.namedItem(fieldName) as FormElement | null;
      if (el && 'setCustomValidity' in el) {
        formUtils.runValidator(el, fn);
      }
    });
  },
};
