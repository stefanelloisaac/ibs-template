export type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type FormErrors = Record<string, string>;

export interface FormRef {
  validate: () => boolean;
  getFormData: () => FormData | null;
}

export interface FormBaseProps extends React.ComponentPropsWithoutRef<'form'> {
  ref?: React.Ref<FormRef>;
  onSubmit?: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}
