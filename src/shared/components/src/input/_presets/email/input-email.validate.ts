import { createValidator } from '../../../../lib/validator';
import { patterns } from '../../../../lib/validator/helpers/patterns';

export const validateInputEmail = (value: string) =>
  createValidator(value)
    .transform((v) => v.trim().toLowerCase())
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => patterns.email.test(v), 'Formato inválido.')
    .validate();
