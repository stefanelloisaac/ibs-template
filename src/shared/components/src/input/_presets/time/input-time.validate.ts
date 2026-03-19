import { createValidator } from '../../../../lib/validator';
import { patterns } from '../../../../lib/validator/helpers/patterns';

export const validateInputTime = (value: string) =>
  createValidator(value)
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => patterns.time.test(v), 'Formato inválido.')
    .validate();
