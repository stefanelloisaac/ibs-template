import { createValidator } from '../../../../lib/validator';
import { isValidCNPJ, isValidCPF } from '../../../../lib/validator/helpers/docs';

export const validateInputCpf = (value: string) =>
  createValidator(value)
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 11, 'Campo obrigatório.')
    .refine((v) => isValidCPF(v), 'Formato inválido.')
    .validate();

export const validateInputCnpj = (value: string) =>
  createValidator(value)
    .transform((v) =>
      v
        .trim()
        .replace(/[.\-/]/g, '')
        .toUpperCase(),
    )
    .refine((v) => v.length === 14, 'Campo obrigatório.')
    .refine((v) => isValidCNPJ(v), 'Formato inválido.')
    .validate();
