import { createValidator } from '../../../../lib/validator';

export const validateInputFile = (value: string) =>
  createValidator(value)
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .validate();
