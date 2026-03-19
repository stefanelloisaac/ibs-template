import { createValidator } from '../../../../lib/validator';

export const validateLookupMultiple = (value: string) =>
  createValidator(value)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .validate();
