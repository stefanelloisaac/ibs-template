import { useCallback, useEffect, useRef } from 'react';
import {
  useFormErrors,
  useFormRegisterValidator,
  useFormSetFieldError,
  useFormUnregisterValidator,
} from '../../../../store/form/use-form';
import type { FormElement } from '../../../form/_core/form.types';
import { formUtils } from '../../../form/_core/form.utils';
import { InputDatetimeLocal } from '../../../input';
import { validateInputDatetimeLocal } from '../../../input/_presets/datetime-local/input-datetime-local.validate';
import { Period } from '../../_core/period';
import type { PeriodDatetimeProps } from './period-datetime.types';

export function PeriodDatetime(props: PeriodDatetimeProps) {
  const { label, required, disabled, startName, endName, className } = props;

  const errors = useFormErrors();
  const registerValidator = useFormRegisterValidator();
  const unregisterValidator = useFormUnregisterValidator();
  const setFieldError = useFormSetFieldError();
  const startValueRef = useRef('');

  const endValidator = useCallback((value: string) => {
    const base = validateInputDatetimeLocal(value);
    if (!base.success) return base;

    const startValue = startValueRef.current;
    if (startValue && value < startValue) {
      return { success: false as const, message: 'Data/hora final deve ser igual ou posterior à data/hora inicial.' };
    }

    return base;
  }, []);

  useEffect(() => {
    registerValidator(startName, validateInputDatetimeLocal);
    return () => unregisterValidator(startName);
  }, [registerValidator, unregisterValidator, startName]);

  useEffect(() => {
    registerValidator(endName, endValidator);
    return () => unregisterValidator(endName);
  }, [registerValidator, unregisterValidator, endName, endValidator]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startValueRef.current = e.target.value;
  };

  const handleStartBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.target as FormElement;
    formUtils.runValidator(el, validateInputDatetimeLocal);
    setFieldError(startName, el.validity.valid ? null : el.validationMessage);
  };

  const handleEndBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.target as FormElement;
    formUtils.runValidator(el, endValidator);
    setFieldError(endName, el.validity.valid ? null : el.validationMessage);
  };

  const startError = errors[startName] ?? undefined;
  const endError = errors[endName] ?? undefined;

  return (
    <Period
      label={label}
      required={required}
      disabled={disabled}
      errorMessage={startError || endError}
      className={className}
    >
      <InputDatetimeLocal
        name={startName}
        required={required}
        disabled={disabled}
        intent={startError ? 'error' : undefined}
        onChange={handleStartChange}
        onBlur={handleStartBlur}
      />
      <InputDatetimeLocal
        name={endName}
        required={required}
        disabled={disabled}
        intent={endError ? 'error' : undefined}
        onBlur={handleEndBlur}
      />
    </Period>
  );
}
