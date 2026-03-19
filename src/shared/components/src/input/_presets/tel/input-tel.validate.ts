import { createValidator } from '../../../../lib/validator';
import { patterns } from '../../../../lib/validator/helpers/patterns';

export const validateInputTel = (value: string) =>
  createValidator(value)
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => v.length >= 10 && v.length <= 11, 'Formato inválido.')
    .refine((v) => patterns.tel.test(v), 'Formato inválido.')
    .validate();
