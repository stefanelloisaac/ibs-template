import { cloneElement, useEffect, useMemo } from 'react';
import {
  useFormErrors,
  useFormRegisterValidator,
  useFormSetFieldError,
  useFormUnregisterValidator,
} from '../../../../store/form/use-form';
import { getValidator } from '../../_core/form.registry';
import type { FormElement } from '../../_core/form.types';
import { formUtils } from '../../_core/form.utils';
import type { FormFieldProps, FormFieldChildProps, FormValidatableElementType } from './form-field.types';

export function FormField(props: FormFieldProps) {
  const { name, children } = props;

  const errors = useFormErrors();
  const registerValidator = useFormRegisterValidator();
  const unregisterValidator = useFormUnregisterValidator();
  const setFieldError = useFormSetFieldError();
  const childProps = children.props as FormFieldChildProps;

  const validatorKey = useMemo(() => {
    const type = children.type as FormValidatableElementType;
    if (type.validatorKey) return type.validatorKey;
    if (type.getValidatorKey) return type.getValidatorKey(childProps);
    return undefined;
  }, [children.type, childProps]);

  const validator = validatorKey ? getValidator(validatorKey) : undefined;

  useEffect(() => {
    if (validator) {
      registerValidator(name, validator);
      return () => unregisterValidator(name);
    }
  }, [name, validator, registerValidator, unregisterValidator]);

  const handleBlur = (e: React.FocusEvent<FormElement>) => {
    const el = e.target;
    if (validator) formUtils.runValidator(el, validator);
    setFieldError(name, el.validity.valid ? null : el.validationMessage);
    childProps.onBlur?.(e);
  };

  return cloneElement(children, {
    name,
    errorMessage: errors[name],
    onBlur: handleBlur,
  } as Partial<FormFieldChildProps>);
}
