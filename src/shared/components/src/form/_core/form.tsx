import { useId, useImperativeHandle, useRef, useState } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import type { ValidatorFn } from '../../../lib/validator';
import { FormStoreProvider } from '../../../providers/form.provider';
import { createFormStore } from '../../../store/form/form.store';
import type { FormBaseProps } from './form.types';
import { formUtils } from './form.utils';

export function Form(props: FormBaseProps) {
  const { className, children, onSubmit, id, ref, ...rest } = props;

  const formRef = useRef<HTMLFormElement>(null);
  const [validators] = useState(() => new Map<string, ValidatorFn>());
  const generatedId = useId();
  const formId = id || generatedId;

  // MARK: Criar store (1x)
  const [store] = useState(() => createFormStore({ validators }));

  const validateForm = () => {
    if (!formRef.current) return false;
    formUtils.runValidators(formRef.current, validators);
    const isValid = formRef.current.checkValidity();
    store.getState().setErrors(isValid ? {} : formUtils.collectErrors(formRef.current));
    return isValid;
  };

  useImperativeHandle(ref, () => ({
    validate: validateForm,
    getFormData: () => (formRef.current ? new FormData(formRef.current) : null),
  }));

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(e);
    }
  };

  return (
    <ErrorBoundary>
      <FormStoreProvider store={store}>
        <form
          ref={formRef}
          id={formId}
          data-slot='form'
          className={className}
          onSubmit={handleSubmit}
          noValidate
          {...rest}
        >
          {children}
        </form>
      </FormStoreProvider>
    </ErrorBoundary>
  );
}
