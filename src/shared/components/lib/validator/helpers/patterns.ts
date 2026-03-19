/**
 * @lib patterns
 * @description Expressoes regulares para validacao de formatos de input.
 * Cada pattern valida o formato final do valor (sem mascara) de um tipo de campo.
 *
 * @usage InputEmail, InputTel, InputTime, InputMonth, InputWeek,
 *        InputInt, InputFloat, InputMoney, InputPercent
 */

export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  tel: /^[1-9]{2}9?[0-9]{8}$/,
  time: /^([01]\d|2[0-3]):([0-5]\d)$/,
  month: /^\d{4}-(0[1-9]|1[0-2])$/,
  week: /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/,
  int: /^\d+$/,
  float: /^\d+([.,]\d+)?$/,
};
