import { createValidator } from '../../../../lib/validator';

export const validateInputDatetimeLocal = (value: string) =>
  createValidator(value)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => !isNaN(new Date(v).getTime()), 'Formato inválido.')
    .validate();
