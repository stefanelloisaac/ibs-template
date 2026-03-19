import type { InputMoneyFormatOptions } from './input-money.types';

export const inputMoneyUtils = {
  MAX_VALUE: 1_000_000_000_000,
  MAX_VALUE_DIGITS: 13,

  getMaxCents: (decimalPlaces: number): number => {
    return inputMoneyUtils.MAX_VALUE * Math.pow(10, decimalPlaces);
  },

  getMaxDigits: (decimalPlaces: number): number => {
    return inputMoneyUtils.MAX_VALUE_DIGITS + decimalPlaces;
  },

  format: (valueInCents: number, options: InputMoneyFormatOptions): string => {
    const { locale = 'pt-BR', currency = 'BRL', decimalPlaces = 2 } = options;
    const divisor = Math.pow(10, decimalPlaces);
    const value = valueInCents / divisor;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })
      .format(value)
      .replace(/\u00A0/g, ' ');
  },

  getMaxLength: (options: InputMoneyFormatOptions): number => {
    const maxCents = inputMoneyUtils.getMaxCents(options.decimalPlaces ?? 2);
    return inputMoneyUtils.format(maxCents, options).length;
  },
};
