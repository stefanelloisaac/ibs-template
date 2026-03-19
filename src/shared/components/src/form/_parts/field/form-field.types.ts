import type { FormElement } from '../../_core/form.types';

export interface FormFieldProps {
  name: string;
  children: React.ReactElement<FormFieldChildProps>;
}

export type FormFieldChildProps = {
  onBlur?: (e: React.FocusEvent<FormElement>) => void;
};

export interface FormValidatableComponent {
  validatorKey?: string;
  getValidatorKey?: (props: Record<string, unknown>) => string;
}

export type FormValidatableElementType = React.JSXElementConstructor<unknown> & FormValidatableComponent;
