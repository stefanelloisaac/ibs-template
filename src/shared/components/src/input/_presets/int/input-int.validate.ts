import { createValidator } from '../../../../lib/validator';
import { patterns } from '../../../../lib/validator/helpers/patterns';

export const validateInputInt = (value: string) =>
  createValidator(value)
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => !!v && !/^0+$/.test(v), 'Campo obrigatório.')
    .refine((v) => patterns.int.test(v), 'Formato inválido.')
    .validate();
