import { createValidator } from '../../../../lib/validator';

export const validateInputPassword = (value: string) =>
  createValidator(value)
    .refine((v) => v.length > 0, 'Campo obrigatório.')
    .refine((v) => v.length >= 8, 'Senha deve ter no mínimo 8 caracteres.')
    .refine((v) => /[A-Z]/.test(v), 'Senha deve conter pelo menos uma letra maiúscula.')
    .refine((v) => /[a-z]/.test(v), 'Senha deve conter pelo menos uma letra minúscula.')
    .refine((v) => /[0-9]/.test(v), 'Senha deve conter pelo menos um número.')
    .validate();
