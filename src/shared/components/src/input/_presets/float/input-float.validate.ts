import { createValidator } from '../../../../lib/validator';
import { patterns } from '../../../../lib/validator/helpers/patterns';

export const validateInputFloat = (value: string) =>
  createValidator(value)
    .transform((v) => v.replace(/[^\d.,]/g, '').replace(/\.(?=\d{3})/g, ''))
    .refine((v) => !!v && !/^0+([.,]0+)?$/.test(v), 'Campo obrigatório.')
    .refine((v) => patterns.float.test(v), 'Formato inválido.')
    .validate();
