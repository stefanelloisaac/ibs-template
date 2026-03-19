import { createValidator } from '../../../../lib/validator';

export const validateInputDropzone = (value: string) =>
  createValidator(value)
    .refine((v) => v.length > 0, 'Selecione ao menos um arquivo.')
    .validate();
