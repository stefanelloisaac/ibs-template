import { createValidator } from '../../../../lib/validator';

export const validateInputColor = (value: string) =>
  createValidator(value)
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => /^#[0-9A-Fa-f]{6}$/.test(v), 'Formato inválido.')
    .validate();
