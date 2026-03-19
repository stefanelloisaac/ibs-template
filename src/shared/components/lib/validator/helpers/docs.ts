/**
 * @lib isValidCPF
 * @description Valida um CPF (11 digitos, sem pontuacao) verificando os digitos de controle.
 * Rejeita sequencias repetidas (ex: 11111111111).
 *
 * @param cpf - String com 11 digitos numericos
 * @returns `true` se o CPF e valido
 *
 * @usage InputDocs
 */

export function isValidCPF(cpf: string): boolean {
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calc = (factor: number) =>
    cpf
      .slice(0, factor - 1)
      .split('')
      .reduce((sum, digit, i) => sum + Number(digit) * (factor - i), 0);

  const digit = (sum: number) => ((sum * 10) % 11) % 10;

  return digit(calc(10)) === Number(cpf[9]) && digit(calc(11)) === Number(cpf[10]);
}

/**
 * @lib isValidCNPJ
 * @description Valida um CNPJ (14 caracteres alfanumericos, sem pontuacao) verificando os
 * digitos de controle. Suporta o formato alfanumerico do novo CNPJ.
 * Rejeita caracteres invalidos (I, O, U, Q, F) e sequencia zerada.
 *
 * @param cnpj - String com 14 caracteres alfanumericos
 * @returns `true` se o CNPJ e valido
 *
 * @usage InputDocs
 */

export function isValidCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  if (cnpj === '00000000000000') return false;

  if (/[IOUQF]/.test(cnpj)) return false;

  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;

  const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const charToValue = (char: string) => char.charCodeAt(0) - 48;

  const calcDigit = (sum: number) => {
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < 12; i++) {
    const value = charToValue(cnpj[i]);
    sum1 += value * weights[i + 1];
    sum2 += value * weights[i];
  }

  const digit1 = calcDigit(sum1);
  sum2 += digit1 * weights[12];
  const digit2 = calcDigit(sum2);

  return cnpj[12] === String(digit1) && cnpj[13] === String(digit2);
}
